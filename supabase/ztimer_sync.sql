-- ZTimer sync: run this ONCE in Supabase  (Dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- How it works
--  * Nobody can read the tables directly (row level security is on and there are no policies).
--  * The app and the website only call the function zt_sync(), giving their secret sync code.
--    The code is never stored: only its SHA-256 hash is.
--  * One call both uploads what changed on that device and downloads what changed elsewhere.
--  * Each person also has an optional unique nickname (for friends / racing later).

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.zt_users (
  id          uuid primary key default gen_random_uuid(),
  code_hash   text not null unique,
  nick        text,
  created_at  timestamptz not null default now()
);
create unique index if not exists zt_users_nick_ci on public.zt_users (lower(nick)) where nick is not null;

create table if not exists public.zt_solves (
  user_id     uuid not null references public.zt_users(id) on delete cascade,
  uid         text not null,              -- stable id made by the device that recorded the solve
  puzzle      text not null,              -- the app's puzzle type, e.g. 333, 222, pyra, mega, 333oh
  category    text not null default 'Normal',
  time_ms     bigint not null,
  penalty     int  not null default 0,    -- the app's penalty: 0 none, 1 +2, 2 DNF
  solved_at   bigint not null,            -- milliseconds since 1970
  scramble    text,
  comment     text,
  history     boolean not null default false,
  deleted     boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, uid)
);
create index if not exists zt_solves_pull on public.zt_solves (user_id, updated_at);

alter table public.zt_users  enable row level security;
alter table public.zt_solves enable row level security;
revoke all on public.zt_users, public.zt_solves from anon, authenticated;

-- p_code   secret sync code (at least 16 characters)
-- p_nick   nickname to claim or change; null or '' leaves it alone
-- p_since  server_time returned by the previous call (null the first time)
-- p_solves array of solves that are new or changed on this device (deleted:true marks a deletion)
create or replace function public.zt_sync(p_code text, p_nick text, p_since timestamptz, p_solves jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_user uuid;
  v_nick text;
  v_now  timestamptz := clock_timestamp();
  v_rows jsonb;
  v_more boolean := false;
  v_limit int := 2000;
begin
  if p_code is null or length(p_code) < 16 or length(p_code) > 128 then
    return jsonb_build_object('error', 'bad_code');
  end if;
  v_hash := encode(digest(p_code, 'sha256'), 'hex');

  select id, nick into v_user, v_nick from zt_users where code_hash = v_hash;
  if v_user is null then
    insert into zt_users (code_hash) values (v_hash) returning id, nick into v_user, v_nick;
  end if;

  if p_nick is not null and btrim(p_nick) <> '' and lower(btrim(p_nick)) is distinct from lower(coalesce(v_nick, '')) then
    if btrim(p_nick) !~ '^[A-Za-z0-9_]{3,20}$' then
      return jsonb_build_object('error', 'bad_nick');
    end if;
    if exists (select 1 from zt_users where lower(nick) = lower(btrim(p_nick)) and id <> v_user) then
      return jsonb_build_object('error', 'nick_taken');
    end if;
    update zt_users set nick = btrim(p_nick) where id = v_user returning nick into v_nick;
  elsif p_nick is not null and btrim(p_nick) <> '' then
    update zt_users set nick = btrim(p_nick) where id = v_user returning nick into v_nick;  -- only changes capital letters
  end if;

  -- upload
  if p_solves is not null and jsonb_typeof(p_solves) = 'array' and jsonb_array_length(p_solves) > 0 then
    insert into zt_solves (user_id, uid, puzzle, category, time_ms, penalty, solved_at, scramble, comment, history, deleted, updated_at)
    select v_user, s->>'uid', coalesce(s->>'puzzle', 'other'), coalesce(nullif(s->>'category', ''), 'Normal'),
           coalesce((s->>'time')::bigint, 0), coalesce((s->>'penalty')::int, 0), coalesce((s->>'date')::bigint, 0),
           s->>'scramble', s->>'comment', coalesce((s->>'history')::boolean, false), coalesce((s->>'deleted')::boolean, false), v_now
    from jsonb_array_elements(p_solves) s
    where s->>'uid' is not null
    on conflict (user_id, uid) do update set
      -- a deletion only flips the flag, the rest of the row stays so every device can find the solve it refers to
      puzzle     = case when excluded.deleted then zt_solves.puzzle     else excluded.puzzle     end,
      category   = case when excluded.deleted then zt_solves.category   else excluded.category   end,
      time_ms    = case when excluded.deleted then zt_solves.time_ms    else excluded.time_ms    end,
      penalty    = case when excluded.deleted then zt_solves.penalty    else excluded.penalty    end,
      solved_at  = case when excluded.deleted then zt_solves.solved_at  else excluded.solved_at  end,
      scramble   = case when excluded.deleted then zt_solves.scramble   else excluded.scramble   end,
      comment    = case when excluded.deleted then zt_solves.comment    else excluded.comment    end,
      history    = case when excluded.deleted then zt_solves.history    else excluded.history    end,
      deleted    = excluded.deleted,
      updated_at = v_now;
  end if;

  -- download: everything that changed since the last call, except what this call just uploaded
  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_rows from (
    select uid, puzzle, category, time_ms as time, penalty, solved_at as date, scramble, comment, history, deleted,
           updated_at
    from zt_solves
    where user_id = v_user and updated_at < v_now and (p_since is null or updated_at > p_since)
    order by updated_at
    limit v_limit + 1
  ) r;
  if jsonb_array_length(v_rows) > v_limit then
    v_more := true;
    v_rows := (select jsonb_agg(e) from (select e from jsonb_array_elements(v_rows) with ordinality t(e, n) where n <= v_limit order by n) q);
  end if;

  return jsonb_build_object('ok', true, 'nick', v_nick, 'solves', v_rows, 'more', v_more,
                            'server_time', case when v_more then (v_rows->(v_limit - 1)->>'updated_at') else to_char(v_now at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') end);
end;
$$;

revoke all on function public.zt_sync(text, text, timestamptz, jsonb) from public;
grant execute on function public.zt_sync(text, text, timestamptz, jsonb) to anon, authenticated;

-- Optional: lets you (and later the racing feature) check that a nickname is free without signing in.
create or replace function public.zt_nick_free(p_nick text) returns boolean
language sql security definer set search_path = public as $$
  select not exists (select 1 from zt_users where lower(nick) = lower(btrim(p_nick)));
$$;
revoke all on function public.zt_nick_free(text) from public;
grant execute on function public.zt_nick_free(text) to anon, authenticated;
