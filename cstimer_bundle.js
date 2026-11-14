/* ZTimer bundle: csTimer scramble code (GPL-3.0, (c) Shuang Chen / cs0x7f), concatenated from the files the csTimer npm module uses. */
var module = {exports: {}};
(function(){
/* ==== lib/utillib.js ==== */
'use strict';

const isInNode = (typeof process === 'object' && typeof require === 'function' && typeof global === 'object');
const isInWorker = true;

/** @define {boolean} */
const ISCSTIMER = false;

function execBoth(funcMain, funcWorker, params) {
	if (!isInWorker && funcMain) {
		return funcMain.apply(this, params || []);
	}
	if (isInWorker && funcWorker) {
		return funcWorker.apply(this, params || []);
	}
	return {};
}

//execute function only in worker
function execWorker(func, params) {
	return execBoth(undefined, func, params);
}

//execute function only in main
function execMain(func, params) {
	return execBoth(func, undefined, params);
}

execWorker(function() {
	if (isInNode) {
		global['self'] = global;
	}
	self.$ = {
		isArray: Array.isArray,
		noop: function() {},
		now: function() {
			return +new Date;
		}
	};
});

ISCSTIMER && execMain(function() {
	$.beacon = function(obj, url) {
		url = url || 'stat.php';
		obj = typeof(obj) == 'string' ? obj : JSON.stringify(obj);
		if (navigator.sendBeacon) {
			navigator.sendBeacon(url, obj);
		} else {
			$.post(url, obj);
		}
	};

	window.onerror = function(msg, url, line, col, error) {
		if (!line && !col || /extension|adsbygoogle/i.exec(url) || !/\.js/i.exec(url)) {
			return;
		}
		if (error == undefined) {
			error = {};
		}
		var fingerprint = '';
		try {
			fingerprint = $.fingerprint();
		} catch (e) {}
		$.beacon({
			'version': CSTIMER_VERSION,
			'fp': fingerprint,
			'msg': msg,
			'url': url,
			'line': line,
			'col': col,
			'stack': error.stack
		}, 'bug.php');
		DEBUG && console.log(CSTIMER_VERSION, fingerprint, msg, url, line, col, error);
	};

	var constants = ['CSTIMER_VERSION', 'LANG_SET', 'LANG_STR', 'LANG_CUR', 'OK_LANG', 'CANCEL_LANG', 'RESET_LANG', 'ABOUT_LANG', 'ZOOM_LANG', 'COPY_LANG', 'BUTTON_TIME_LIST', 'BUTTON_OPTIONS', 'BUTTON_EXPORT', 'BUTTON_DONATE', 'PROPERTY_SR', 'PROPERTY_USEINS', 'PROPERTY_USEINS_STR', 'PROPERTY_SHOWINS', 'PROPERTY_VOICEINS', 'PROPERTY_VOICEINS_STR', 'PROPERTY_VOICEVOL', 'PROPERTY_PHASES', 'PROPERTY_TIMERSIZE', 'PROPERTY_USEMILLI', 'PROPERTY_SMALLADP', 'PROPERTY_SCRSIZE', 'PROPERTY_SCRMONO', 'PROPERTY_SCRLIM', 'PROPERTY_SCRALIGN', 'PROPERTY_SCRALIGN_STR', 'PROPERTY_SCRWRAP', 'PROPERTY_SCRWRAP_STR', 'PROPERTY_SCRNEUT', 'PROPERTY_SCRNEUT_STR', 'PROPERTY_SCREQPR', 'PROPERTY_SCREQPR_STR', 'PROPERTY_SCRFAST', 'PROPERTY_SCRKEYM', 'PROPERTY_SCRCLK', 'PROPERTY_SCRCLK_STR', 'PROPERTY_WNDSCR', 'PROPERTY_WNDSTAT', 'PROPERTY_WNDTOOL', 'PROPERTY_WND_STR', 'EXPORT_DATAEXPORT', 'EXPORT_TOFILE', 'EXPORT_FROMFILE', 'EXPORT_TOSERV', 'EXPORT_FROMSERV', 'EXPORT_FROMOTHER', 'EXPORT_USERID', 'EXPORT_INVID', 'EXPORT_ERROR', 'EXPORT_NODATA', 'EXPORT_UPLOADED', 'EXPORT_CODEPROMPT', 'EXPORT_ONLYOPT', 'EXPORT_ACCOUNT', 'EXPORT_LOGINGGL', 'EXPORT_LOGINWCA', 'EXPORT_LOGOUTCFM', 'EXPORT_LOGINAUTHED', 'EXPORT_AEXPALERT', 'EXPORT_WHICH', 'EXPORT_WHICH_ITEM', 'IMPORT_FINAL_CONFIRM', 'BUTTON_SCRAMBLE', 'BUTTON_TOOLS', 'IMAGE_UNAVAILABLE', 'TOOLS_SELECTFUNC', 'TOOLS_CROSS', 'TOOLS_EOLINE', 'TOOLS_ROUX1', 'TOOLS_222FACE', 'TOOLS_GIIKER', 'TOOLS_IMAGE', 'TOOLS_STATS', 'TOOLS_HUGESTATS', 'TOOLS_DISTRIBUTION', 'TOOLS_TREND', 'TOOLS_METRONOME', 'TOOLS_RECONS', 'TOOLS_RECONS_NODATA', 'TOOLS_RECONS_TITLE', 'TOOLS_TRAINSTAT', 'TOOLS_BLDHELPER', 'TOOLS_CFMTIME', 'TOOLS_SOLVERS', 'TOOLS_DLYSTAT', 'TOOLS_DLYSTAT1', 'TOOLS_DLYSTAT_OPT1', 'TOOLS_DLYSTAT_OPT2', 'TOOLS_SYNCSEED', 'TOOLS_SYNCSEED_SEED', 'TOOLS_SYNCSEED_INPUT', 'TOOLS_SYNCSEED_30S', 'TOOLS_SYNCSEED_HELP', 'TOOLS_SYNCSEED_DISABLE', 'TOOLS_SYNCSEED_INPUTA', 'TOOLS_BATTLE', 'TOOLS_BATTLE_HEAD', 'TOOLS_BATTLE_TITLE', 'TOOLS_BATTLE_STATUS', 'TOOLS_BATTLE_INFO', 'TOOLS_BATTLE_JOINALERT', 'TOOLS_BATTLE_LEAVEALERT', 'OLCOMP_UPDATELIST', 'OLCOMP_VIEWRESULT', 'OLCOMP_VIEWMYRESULT', 'OLCOMP_START', 'OLCOMP_SUBMIT', 'OLCOMP_SUBMITAS', 'OLCOMP_WCANOTICE', 'OLCOMP_OLCOMP', 'OLCOMP_ANONYM', 'OLCOMP_ME', 'OLCOMP_WCAACCOUNT', 'OLCOMP_ABORT', 'OLCOMP_WITHANONYM', 'PROPERTY_IMGSIZE', 'PROPERTY_IMGREP', 'TIMER_INSPECT', 'TIMER_SOLVE', 'PROPERTY_USEMOUSE', 'PROPERTY_TIMEU', 'PROPERTY_TIMEU_STR', 'PROPERTY_PRETIME', 'PROPERTY_STOPKEY', 'PROPERTY_STOPKEY_STR', 'PROPERTY_PHASEBEEP', 'PROPERTY_ENTERING', 'PROPERTY_ENTERING_STR', 'PROPERTY_INTUNIT', 'PROPERTY_INTUNIT_STR', 'PROPERTY_COLOR', 'PROPERTY_COLORS', 'PROPERTY_VIEW', 'PROPERTY_VIEW_STR', 'PROPERTY_UIDESIGN', 'PROPERTY_UIDESIGN_STR', 'COLOR_EXPORT', 'COLOR_IMPORT', 'COLOR_FAIL', 'PROPERTY_FONTCOLOR_STR', 'PROPERTY_COLOR_STR', 'PROPERTY_FONT', 'PROPERTY_FONT_STR', 'PROPERTY_FORMAT', 'PROPERTY_USEKSC', 'PROPERTY_USEGES', 'PROPERTY_NTOOLS', 'PROPERTY_AHIDE', 'SCRAMBLE_LAST', 'SCRAMBLE_NEXT', 'SCRAMBLE_SCRAMBLE', 'SCRAMBLE_SCRAMBLING', 'SCRAMBLE_LENGTH', 'SCRAMBLE_INPUT', 'SCRAMBLE_INPUTTYPE', 'PROPERTY_VRCSPEED', 'PROPERTY_VRCORI', 'PROPERTY_VRCMP', 'PROPERTY_VRCMPS', 'PROPERTY_GIIKERVRC', 'PROPERTY_GIISOK_DELAY', 'PROPERTY_GIISOK_DELAYS', 'PROPERTY_GIISOK_KEY', 'PROPERTY_GIISOK_MOVE', 'PROPERTY_GIISOK_MOVES', 'PROPERTY_GIISBEEP', 'PROPERTY_GIIRST', 'PROPERTY_GIIRSTS', 'PROPERTY_GIIMODE', 'PROPERTY_GIIMODES', 'PROPERTY_VRCAH', 'PROPERTY_VRCAHS', 'CONFIRM_GIIRST', 'PROPERTY_GIIAED', 'scrdata', 'SCRAMBLE_NOOBST', 'SCRAMBLE_NOOBSS', 'SCROPT_TITLE', 'SCROPT_BTNALL', 'SCROPT_BTNNONE', 'SCROPT_EMPTYALT', 'STATS_CFM_RESET', 'STATS_CFM_DELSS', 'STATS_CFM_DELMUL', 'STATS_CFM_DELETE', 'STATS_COMMENT', 'STATS_REVIEW', 'STATS_DATE', 'STATS_SSSTAT', 'STATS_SSRETRY', 'STATS_CURROUND', 'STATS_CURSESSION', 'STATS_CURSPLIT', 'STATS_EXPORTCSV', 'STATS_SSMGR_TITLE', 'STATS_SSMGR_NAME', 'STATS_SSMGR_DETAIL', 'STATS_SSMGR_OPS', 'STATS_SSMGR_ORDER', 'STATS_SSMGR_ODCFM', 'STATS_SSMGR_SORTCFM', 'STATS_ALERTMG', 'STATS_PROMPTSPL', 'STATS_ALERTSPL', 'STATS_AVG', 'STATS_SUM', 'STATS_SOLVE', 'STATS_TIME', 'STATS_SESSION', 'STATS_SESSION_NAME', 'STATS_SESSION_NAMEC', 'STATS_STRING', 'STATS_PREC', 'STATS_PREC_STR', 'STATS_TYPELEN', 'STATS_STATCLR', 'STATS_ABSIDX', 'STATS_XSESSION_DATE', 'STATS_XSESSION_NAME', 'STATS_XSESSION_SCR', 'STATS_XSESSION_CALC', 'STATS_RSFORSS', 'PROPERTY_PRINTSCR', 'PROPERTY_PRINTCOMM', 'PROPERTY_PRINTDATE', 'PROPERTY_SUMMARY', 'PROPERTY_IMRENAME', 'PROPERTY_SCR2SS', 'PROPERTY_SS2SCR', 'PROPERTY_SS2PHASES', 'PROPERTY_STATINV', 'PROPERTY_STATSSUM', 'PROPERTY_STATTHRES', 'PROPERTY_STATBPA', 'PROPERTY_STATWPA', 'PROPERTY_STATAL', 'PROPERTY_STATALU', 'PROPERTY_HLPBS', 'PROPERTY_HLPBS_STR', 'PROPERTY_DELMUL', 'PROPERTY_TOOLSFUNC', 'PROPERTY_TRIM', 'PROPERTY_TRIMR', 'PROPERTY_TRIM_MED', 'PROPERTY_STKHEAD', 'PROPERTY_TOOLPOS', 'PROPERTY_TOOLPOS_STR', 'PROPERTY_HIDEFULLSOL', 'PROPERTY_IMPPREV', 'PROPERTY_AUTOEXP', 'PROPERTY_AUTOEXP_OPT', 'PROPERTY_SCRASIZE', 'MODULE_NAMES', 'BGIMAGE_URL', 'BGIMAGE_INVALID', 'BGIMAGE_OPACITY', 'BGIMAGE_IMAGE', 'BGIMAGE_IMAGE_STR', 'SHOW_AVG_LABEL', 'SHOW_DIFF_LABEL', 'SHOW_DIFF_LABEL_STR', 'USE_LOGOHINT', 'TOOLS_SCRGEN', 'SCRGEN_NSCR', 'SCRGEN_PRE', 'SCRGEN_GEN', 'VRCREPLAY_TITLE', 'VRCREPLAY_ORI', 'VRCREPLAY_SHARE', 'GIIKER_CONNECT', 'GIIKER_RESET', 'GIIKER_REQMACMSG', 'GIIKER_NOBLEMSG', 'PROPERTY_SHOWAD', 'PROPERTY_GIIORI', 'LGHINT_INVALID', 'LGHINT_NETERR', 'LGHINT_SERVERR', 'LGHINT_SUBMITED', 'LGHINT_SSBEST', 'LGHINT_SCRCOPY', 'LGHINT_LINKCOPY', 'LGHINT_SOLVCOPY', 'LGHINT_SORT0', 'LGHINT_IMPORTED', 'LGHINT_IMPORT0', 'LGHINT_BTCONSUC', 'LGHINT_BTDISCON', 'LGHINT_BTNOTSUP', 'LGHINT_BTINVMAC', 'LGHINT_AEXPABT', 'LGHINT_AEXPSUC', 'LGHINT_AEXPFAL', 'EASY_SCRAMBLE_HINT', 'EXPORT_INFO', 'EXPORT_BTN', 'EXPORT_TIMEOUT', 'EXPORT_RELOGIN', 'EXPORT_LOGINFIRST', 'STATS_FILTERPAT', 'STATS_SOLVEHEAD', 'STATS_BROWSER', 'STATS_STATALUS', 'TOOLS_RECONS_CASESSTAT', 'TOOLS_333ROUX', 'TOOLS_PYRV', 'TOOLS_PYRT', 'TOOLS_SKBL1', 'TOOLS_333UDF', 'TOOLS_333KOC', 'TOOLS_333PATS', 'TOOLS_RECONS_SUB', 'STACKMAT_CONNECT', 'BT_CONNECT_TITLE', 'BT_CONNECT_MSG', 'STACKMAT_DBG', 'STACKMAT_DBG_FIELDS', 'STACKMAT_DBG_VALS', 'STACKMAT_MIC', 'GIIKER_DBG', 'GIIKER_RAWPRETTY', 'CONFIRM_RESETOPT', 'CONFIRM_TRANSLATE', 'CONFIRM_COLORSCHEME', 'LGHINT_UNSAFE', 'LGHINT_COPYFAIL', 'LGHINT_USEDEFAULT', 'LGHINT_POPUPBLOCK', 'VRC_KEYLAYOUT', 'TOOLS_MTRNM_UI', 'TOOLS_MTRNM_BTN', 'TOOLS_MTRNM_BEEPAT', 'TOOLS_BLDHELPER_SCR', 'GSOLVER_SQ1', 'GSOLVER_NOSOLNMOVES'];
	for (var i = 0; i < constants.length; i++) {
		window[constants[i]] = window[constants[i]] || '|||||||||||||||';
	}

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function */ callback, /* DOMElement */ element) {
				return window.setTimeout(callback, 1000 / 60);
			};
	})();

	if (!window.localStorage) {
		window.localStorage = {};
	}

	if (!('properties' in localStorage) && location.protocol != 'https:' && location.hostname != 'localhost' && location.protocol != 'file:') {
		location.href = 'https:' + location.href.substring(location.protocol.length);
	}

	if (window.performance && window.performance.now) {
		$.now = function() {
			return Math.floor(window.performance.now());
		};
	}

	$.urlParam = function(name) {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null) {
			return null;
		} else {
			return results[1] || 0;
		}
	};

	$.hashParam = function(name) {
		var results = new RegExp('[#&]' + name + '=([^&#]*)').exec(window.location.hash);
		if (results == null) {
			return null;
		} else {
			return results[1] || 0;
		}
	};

	$.clearUrl = function(name) {
		var results = new RegExp('[\?&](' + name + '=[^&#]*&?)').exec(window.location.href);
		var result = name ?
			location.href.replace(results[1], '').replace(/\?$/, '') :
			location.pathname;
		if (history && history.replaceState) {
			history.replaceState(undefined, undefined, result);
		} else {
			location.href = result;
		}
	};

	$.clearHash = function(name) {
		var results = new RegExp('[#&](' + name + '=[^&#]*&?)').exec(window.location.href);
		var result = name ?
			location.href.replace(results[1], '').replace(/#$/, '') :
			location.pathname + location.search;
		if (history && history.replaceState) {
			history.replaceState(undefined, undefined, result);
		} else {
			location.href = result;
		}
	};

	$.clipboardCopy = function(value) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(value);
		}
		DEBUG && console.log('[utillib] clipboard copy fallback');
		var textArea = $('<textarea>' + value + '</textarea>').appendTo(document.body);
		textArea.focus().select();
		var succ = false;
		try {
			succ = document.execCommand('copy');
		} catch (err) {}
		textArea.remove();
		return succ ? Promise.resolve() : Promise.reject();
	};

	$.fingerprint = function() {
		var fp_screen = window.screen && [Math.max(screen.height, screen.width), Math.min(screen.height, screen.width), screen.colorDepth].join("x");
		var fp_tzoffset = new Date().getTimezoneOffset();
		var fp_plugins = $.map(navigator.plugins, function(p) {
			return [
				p.name,
				p.description,
				$.map(p, function(mt) {
					return [mt.type, mt.suffixes].join("~");
				}).sort().join(",")
			].join("::");
		}).sort().join(";");
		var rawFP = [
			navigator.userAgent,
			navigator.language,
			!!window.sessionStorage,
			!!window.localStorage,
			!!window.indexedDB,
			navigator.doNotTrack,
			fp_screen,
			fp_tzoffset,
			fp_plugins
		].join("###");
		return $.sha256(rawFP);
	};

	$.delayExec = (function() {
		var tids = {};

		return function(key, func, timeout) {
			if (tids[key]) {
				clearTimeout(tids[key][0]);
				delete tids[key];
			}
			var tid = setTimeout(func, timeout);
			tids[key] = [tid, func];
		}
	})();

	$.waitUser = (function() {
		var callbacks = [];

		function reg(func) {
			callbacks.push(func);
		}

		function call() {
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i]();
			}
			callbacks = [];
		}

		return {
			reg: reg,
			call: call
		}
	})();

	$.ppost = function(url, data, dataType) {
		return new Promise(function(resolve, reject) {
			$.post(url, data, resolve, dataType).error(reject);
		});
	};

	$.nextTick = function(deadline) {
		if (deadline != undefined && $.now() < deadline) {
			return null;
		}
		return new Promise(function(resolve) {
			setTimeout(resolve, 0);
		});
	};

	$.strHash = function(str) {
		var h1 = 0x811c9dc5 | 0;
		var h2 = 0x9e3779b9 | 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ c, 16777619);
			h2 = Math.imul(h2 ^ c, 0x85ebca6b);
		}
		return (h1 >>> 0) + '_' + (h2 >>> 0);
	};

	(function() {
		// handle blocked alert/confirm/prompt
		var lastMsg = null;

		$.alert = function(msg) {
			var tt = $.now();
			try {
				alert(msg);
			} catch (e) {}
			if ($.now() - tt < 20) {
				logohint.push(msg);
			}
		};

		$.confirm = function(msg) {
			var tt = $.now();
			var ret;
			try {
				ret = confirm(msg);
			} catch (e) {}
			if (!ret && $.now() - tt < 20) {
				if (msg == lastMsg) {
					lastMsg = null;
					return true;
				}
				logohint.push(msg);
				lastMsg = msg;
			}
			return ret;
		};

		$.prompt = function(msg, val) {
			var tt = $.now();
			var ret;
			try {
				ret = prompt(msg, val);
			} catch (e) {}
			if (!ret && $.now() - tt < 20) {
				if (msg == lastMsg) {
					lastMsg = null;
					logohint.push($.format(LGHINT_USEDEFAULT, ['[' + (val || '') + ']']));
					return val || null;
				}
				logohint.push(LGHINT_POPUPBLOCK);
				lastMsg = msg;
			}
			return ret;
		};
	})();

	$.fn.reclk = function(handler) {
		return this.unbind('click').click(handler);
	};

	if ('serviceWorker' in navigator) {
		$(function() {
			navigator.serviceWorker.register('sw.js');
		});
	} else if (window.applicationCache) {
		$(function() {
			applicationCache.addEventListener('updateready', function(e) {
				if (applicationCache.status == applicationCache.UPDATEREADY) {
					applicationCache.swapCache();
					location.reload();
				}
			}, false);
		});
	}

	if (navigator.storage && navigator.storage.persisted) {
		navigator.storage.persisted().then(function(persistent) {
			if (persistent) {
				return Promise.resolve(persistent);
			} else if (navigator.storage.persist) {
				return navigator.storage.persist();
			}
		}).then(function(persistent) {
			$.persistent = persistent;
		});
	}
});

/** @define {boolean} */
const DEBUGM = true;
/** @define {boolean} */
const DEBUGWK = false;
const DEBUG = ISCSTIMER && (isInWorker ? DEBUGWK : (DEBUGM && !!$.urlParam('debug')));
var DEBUGBL = false; // for debugging bluetooth

(function() {
	$.svg = (function() {
		function SVG(width, height) {
			this.elems = [];
			this.width = width;
			this.height = height;
		}

		function parseNumber(f) {
			return parseFloat(f.toFixed(3)).toString();
		}

		SVG.prototype.addElem = function(xml) {
			this.elems.push(xml);
		}

		SVG.prototype.addPoly = function(points, fillStyle, strokeStyle) {
			var cords = [];
			for (var i = 0; i < points[0].length; i++) {
				cords.push(parseNumber(points[0][i]) + ',' + parseNumber(points[1][i]));
			}
			this.elems.push('<polygon points="' + cords.join(' ') +
				'" style="fill:' + fillStyle + ';stroke:' + (strokeStyle || '#000') + ';" />');
		}

		SVG.prototype.addText = function(text, points, styles, align) {
			var styleStr = "paint-order:stroke;";
			for (var key in styles) {
				styleStr += key + ':' + styles[key] + ';';
			}
			var alignKV = 'dominant-baseline="middle" text-anchor="middle"';
			if (align == 1) {
				alignKV = 'dominant-baseline="hanging" text-anchor="start"';
			}
			this.elems.push('<text x="' + parseNumber(points[0]) + '" y="' + parseNumber(points[1]) +
				'" style="' + styleStr + '" ' + alignKV + '>' +
				encodeURIComponent(text) + '</text>');
		}

		SVG.prototype.render = function() {
			return '<svg width="' + parseNumber(this.width) + '" height="' + parseNumber(this.height) +
				'" xmlns="http://www.w3.org/2000/svg">' + this.elems.join('') + '</svg>';
		}

		SVG.prototype.renderGroup = function(x, y, width, height) {
			var scale = Math.min(width / this.width, height / this.height);
			var offset = [(width - this.width * scale) / 2, (height - this.height * scale) / 2];
			return '<g transform="translate(' +
				parseNumber(x + (width - this.width * scale) / 2) + ',' +
				parseNumber(y + (height - this.height * scale) / 2) + ') scale(' +
				parseNumber(scale) + ')">' + this.elems.join('') + '</g>';
		}

		return SVG;
	})();

	// trans: [size, offx, offy] == [size, 0, offx * size, 0, size, offy * size] or [a11 a12 a13 a21 a22 a23]
	$.ctxDrawPolygon = function(ctx, color, arr, trans) {
		if (!ctx) {
			return;
		}
		trans = trans || [1, 0, 0, 0, 1, 0];
		arr = $.ctxTransform(arr, trans);
		if (ctx instanceof $.svg) {
			return ctx.addPoly(arr, color);
		}
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.moveTo(arr[0][0], arr[1][0]);
		for (var i = 1; i < arr[0].length; i++) {
			ctx.lineTo(arr[0][i], arr[1][i]);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	};

	$.ctxRotate = function(arr, theta) {
		return $.ctxTransform(arr, [Math.cos(theta), -Math.sin(theta), 0, Math.sin(theta), Math.cos(theta), 0]);
	};

	$.ctxTransform = function(arr) {
		var ret;
		for (var i = 1; i < arguments.length; i++) {
			var trans = arguments[i];
			if (trans.length == 3) {
				trans = [trans[0], 0, trans[1] * trans[0], 0, trans[0], trans[2] * trans[0]];
			}
			ret = [[], []];
			for (var i = 0; i < arr[0].length; i++) {
				ret[0][i] = arr[0][i] * trans[0] + arr[1][i] * trans[1] + trans[2];
				ret[1][i] = arr[0][i] * trans[3] + arr[1][i] * trans[4] + trans[5];
			}
		}
		return ret;
	};

	$.nearColor = function(color, ref, longFormat) {
		var col, m;
		m = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(color);
		if (m) {
			col = [m[1] + m[1], m[2] + m[2], m[3] + m[3]];
		}
		m = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(color);
		if (m) {
			col = [m[1], m[2], m[3]];
		}
		for (var i=0; i<3; i++) {
			col[i] = parseInt(col[i], 16) + (ref || 0);
			col[i] = Math.min(Math.max(col[i], 0), 255);
			col[i] = (Math.round(col[i]/17)).toString(16);
		}
		return "#" + (longFormat ? col[0] + col[0] + col[1] + col[1] + col[2] + col[2] : col[0] + col[1] + col[2]);
	};

	$.col2std = function(col, faceMap) {
		var ret = [];
		col = (col || '').match(/#[0-9a-fA-F]{3}/g) || [];
		for (var i = 0; i < col.length; i++) {
			ret.push(~~($.nearColor(col[faceMap[i]], 0, true).replace('#', '0x')));
		}
		return ret;
	};

	$.format = function(format, args) {
		return format.replace(/{(\d+)}/g, (m, num) => args[~~num] || '');
	};

	$.UDPOLY_RE = "skb|m?pyr|prc|heli(?:2x2|cv)?|crz3a|giga|mgm|klm|redi|dino|fto|dmd|ctico";
	$.TWISTY_RE = "sq1|clk|udpoly|" + $.UDPOLY_RE;
})();

/* ==== lib/isaac.js ==== */
/* ----------------------------------------------------------------------
 * Copyright (c) 2012 Yves-Marie K. Rinquin
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ----------------------------------------------------------------------
 *
 * ISAAC is a cryptographically secure pseudo-random number generator
 * (or CSPRNG for short) designed by Robert J. Jenkins Jr. in 1996 and
 * based on RC4. It is designed for speed and security.
 *
 * ISAAC's informations & analysis:
 *   http://burtleburtle.net/bob/rand/isaac.html
 * ISAAC's implementation details:
 *   http://burtleburtle.net/bob/rand/isaacafa.html
 *
 * ISAAC succesfully passed TestU01
 *
 * ----------------------------------------------------------------------
 *
 * Usage:
 *   <script src="isaac.js"><\/script>
 *   var random_number = isaac.random();
 *
 * Output: [ 0x00000000; 0xffffffff]
 *         [-2147483648; 2147483647]
 *
 */

/* isaac module pattern */
var isaac = (function(){

	/* private: internal states */
	var m = Array(256), // internal memory
		acc = 0,        // accumulator
		brs = 0,        // last result
		cnt = 0,        // counter
		r = Array(256), // result array
		gnt = 0;        // generation counter

	seed(Math.random() * 0xffffffff);

	/* private: 32-bit integer safe adder */
	function add(x, y) {
		var lsb = (x & 0xffff) + (y & 0xffff);
		var msb = (x >>>   16) + (y >>>   16) + (lsb >>> 16);
		return (msb << 16) | (lsb & 0xffff);
	}

	/* public: initialisation */
	function reset() {
		acc = brs = cnt = 0;
		for(var i = 0; i < 256; ++i)
			m[i] = r[i] = 0;
		gnt = 0;
	}

	/* public: seeding function */
	function seed(s) {
		var a, b, c, d, e, f, g, h, i;

		/* seeding the seeds of love */
		a = b = c = d =
		e = f = g = h = 0x9e3779b9; /* the golden ratio */

		if(s && typeof(s) === 'number') {
			s = [s];
		}

		if(s instanceof Array) {
			reset();
			for(i = 0; i < s.length; i++)
				r[i & 0xff] += (typeof(s[i]) === 'number') ? s[i] : 0;
		}

		/* private: seed mixer */
		function seed_mix() {
			a ^= b <<  11; d = add(d, a); b = add(b, c);
			b ^= c >>>  2; e = add(e, b); c = add(c, d);
			c ^= d <<   8; f = add(f, c); d = add(d, e);
			d ^= e >>> 16; g = add(g, d); e = add(e, f);
			e ^= f <<  10; h = add(h, e); f = add(f, g);
			f ^= g >>>  4; a = add(a, f); g = add(g, h);
			g ^= h <<   8; b = add(b, g); h = add(h, a);
			h ^= a >>>  9; c = add(c, h); a = add(a, b);
		}

		for(i = 0; i < 4; i++) /* scramble it */
			seed_mix();

		for(i = 0; i < 256; i += 8) {
			if(s) { /* use all the information in the seed */
				a = add(a, r[i + 0]); b = add(b, r[i + 1]);
				c = add(c, r[i + 2]); d = add(d, r[i + 3]);
				e = add(e, r[i + 4]); f = add(f, r[i + 5]);
				g = add(g, r[i + 6]); h = add(h, r[i + 7]);
			}
			seed_mix();
			/* fill in m[] with messy stuff */
			m[i + 0] = a; m[i + 1] = b; m[i + 2] = c; m[i + 3] = d;
			m[i + 4] = e; m[i + 5] = f; m[i + 6] = g; m[i + 7] = h;
		}
		if(s) {
			/* do a second pass to make all of the seed affect all of m[] */
			for(i = 0; i < 256; i += 8) {
				a = add(a, m[i + 0]); b = add(b, m[i + 1]);
				c = add(c, m[i + 2]); d = add(d, m[i + 3]);
				e = add(e, m[i + 4]); f = add(f, m[i + 5]);
				g = add(g, m[i + 6]); h = add(h, m[i + 7]);
				seed_mix();
				/* fill in m[] with messy stuff (again) */
				m[i + 0] = a; m[i + 1] = b; m[i + 2] = c; m[i + 3] = d;
				m[i + 4] = e; m[i + 5] = f; m[i + 6] = g; m[i + 7] = h;
			}
		}

		prng(); /* fill in the first set of results */
		gnt = 256;  /* prepare to use the first set of results */;
	}

	/* public: isaac generator, n = number of run */
	function prng(n){
		var i, x, y;

		n = (n && typeof(n) === 'number')
			? Math.abs(Math.floor(n)) : 1;

		while(n--) {
			cnt = add(cnt,   1);
			brs = add(brs, cnt);

			for(i = 0; i < 256; i++) {
				switch(i & 3) {
					case 0: acc ^= acc <<  13; break;
					case 1: acc ^= acc >>>  6; break;
					case 2: acc ^= acc <<   2; break;
					case 3: acc ^= acc >>> 16; break;
				}
				acc        = add(m[(i +  128) & 0xff], acc); x = m[i];
				m[i] =   y = add(m[(x >>>  2) & 0xff], add(acc, brs));
				r[i] = brs = add(m[(y >>> 10) & 0xff], x);
			}
		}
	}

	/* public: return a random number between */
	function rand() {
		if(!gnt--) {
			prng(); gnt = 255;
		}
		return r[gnt];
	}

	function random() {
		return ((rand() >>> 5) * 0x4000000 + (rand() >>> 6)) / 0x20000000000000;
	}

	/* public: return internals in an object*/
	function internals(obj) {
		var ret = {a: acc, b: brs, c: cnt, m: m.slice(), r: r.slice(), g: gnt};
		if (obj) {
			acc = obj.a; brs = obj.b; cnt = obj.c; m = obj.m.slice(); r = obj.r.slice(); gnt = obj.g;
		}
		return ret;
	}

	/* return class object */
	return {
		reset: reset,
		seed:  seed,
		prng:  prng,
		rand:  rand,
		random: random,
		internals: internals
	};
})(); /* declare and execute */

/* ==== lib/mathlib.js ==== */
"use strict";

var mathlib = (function() {
	var Cnk = [],
		fact = [1];
	for (var i = 0; i < 32; ++i) {
		Cnk[i] = [];
		for (var j = 0; j < 32; ++j) {
			Cnk[i][j] = 0;
		}
	}
	for (var i = 0; i < 32; ++i) {
		Cnk[i][0] = Cnk[i][i] = 1;
		fact[i + 1] = fact[i] * (i + 1);
		for (var j = 1; j < i; ++j) {
			Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
		}
	}

	var permMul4 = [];
	for (var i = 0; i < 24; i++) {
		var perm1 = [];
		var perm2 = [];
		var perm3 = [];
		permMul4[i] = [];
		setNPerm(perm1, i, 4);
		for (var j = 0; j < 24; j++) {
			setNPerm(perm2, j, 4);
			for (var k = 0; k < 4; k++) {
				perm3[k] = perm1[perm2[k]];
			}
			permMul4[i][j] = getNPerm(perm3, 4);
		}
	}

	function circleOri(arr, a, b, c, d, ori) {
		var temp = arr[a];
		arr[a] = arr[d] ^ ori;
		arr[d] = arr[c] ^ ori;
		arr[c] = arr[b] ^ ori;
		arr[b] = temp ^ ori;
	}

	function circle(arr) {
		var length = arguments.length - 1,
			temp = arr[arguments[length]];
		for (var i = length; i > 1; i--) {
			arr[arguments[i]] = arr[arguments[i - 1]];
		}
		arr[arguments[1]] = temp;
		return circle;
	}

	//perm: [idx1, idx2, ..., idxn]
	//pow: 1, 2, 3, ...
	//ori: ori1, ori2, ..., orin, base
	// arr[perm[idx2]] = arr[perm[idx1]] + ori[idx2] - ori[idx1] + base
	function acycle(arr, perm, pow, ori) {
		pow = pow || 1;
		var plen = perm.length;
		var tmp = [];
		for (var i = 0; i < plen; i++) {
			tmp[i] = arr[perm[i]];
		}
		for (var i = 0; i < plen; i++) {
			var j = (i + pow) % plen;
			arr[perm[j]] = tmp[i];
			if (ori) {
				arr[perm[j]] += ori[j] - ori[i] + ori.at(-1);
			}
		}
		return acycle;
	}

	function getPruning(table, index) {
		return table[index >> 3] >> ((index & 7) << 2) & 15;
	}

	function setNPerm(arr, idx, n, even) {
		var prt = 0;
		if (even < 0) {
			idx <<= 1;
		}
		if (n >= 16) {
			arr[n - 1] = 0;
			for (var i = n - 2; i >= 0; i--) {
				arr[i] = idx % (n - i);
				prt ^= arr[i];
				idx = ~~(idx / (n - i));
				for (var j = i + 1; j < n; j++) {
					arr[j] >= arr[i] && arr[j]++;
				}
			}
			if (even < 0 && (prt & 1) != 0) {
				var tmp = arr[n - 1];
				arr[n - 1] = arr[n - 2];
				arr[n - 2] = tmp;
			}
			return arr;
		}
		var vall = 0x76543210;
		var valh = 0xfedcba98;
		for (var i = 0; i < n - 1; i++) {
			var p = fact[n - 1 - i];
			var v = idx / p;
			idx = idx % p;
			prt ^= v;
			v <<= 2;
			if (v >= 32) {
				v = v - 32;
				arr[i] = valh >> v & 0xf;
				var m = (1 << v) - 1;
				valh = (valh & m) + ((valh >> 4) & ~m);
			} else {
				arr[i] = vall >> v & 0xf;
				var m = (1 << v) - 1;
				vall = (vall & m) + ((vall >>> 4) & ~m) + (valh << 28);
				valh = valh >> 4;
			}
		}
		if (even < 0 && (prt & 1) != 0) {
			arr[n - 1] = arr[n - 2];
			arr[n - 2] = vall & 0xf;
		} else {
			arr[n - 1] = vall & 0xf;
		}
		return arr;
	}

	function getNPerm(arr, n, even) {
		n = n || arr.length;
		var idx = 0;
		if (n >= 16) {
			for (var i = 0; i < n - 1; i++) {
				idx *= n - i;
				for (var j = i + 1; j < n; j++) {
					arr[j] < arr[i] && idx++;
				}
			}
			return even < 0 ? (idx >> 1) : idx;
		}
		var vall = 0x76543210;
		var valh = 0xfedcba98;
		for (var i = 0; i < n - 1; i++) {
			var v = arr[i] << 2;
			idx *= n - i;
			if (v >= 32) {
				idx += (valh >> (v - 32)) & 0xf;
				valh -= 0x11111110 << (v - 32);
			} else {
				idx += (vall >> v) & 0xf;
				valh -= 0x11111111;
				vall -= 0x11111110 << v;
			}
		}
		return even < 0 ? (idx >> 1) : idx;
	}

	function getNParity(idx, n) {
		var i, p;
		p = 0;
		for (i = n - 2; i >= 0; --i) {
			p ^= idx % (n - i);
			idx = ~~(idx / (n - i));
		}
		return p & 1;
	}

	function getNOri(arr, n, evenbase) {
		var base = Math.abs(evenbase);
		var idx = evenbase < 0 ? 0 : arr[0] % base;
		for (var i = n - 1; i > 0; i--) {
			idx = idx * base + arr[i] % base;
		}
		return idx;
	}

	function setNOri(arr, idx, n, evenbase) {
		var base = Math.abs(evenbase);
		var parity = base * n;
		for (var i = 1; i < n; i++) {
			arr[i] = idx % base;
			parity -= arr[i];
			idx = ~~(idx / base);
		}
		arr[0] = (evenbase < 0 ? parity : idx) % base;
		return arr;
	}

	function bitCount(x) {
		x -= (x >> 1) & 0x55555555;
		x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
		return ((x + (x >> 4) & 0xf0f0f0f) * 0x1010101) >> 24;
	}

	function getMPerm(arr, n, cnts, cums) {
		var seen = ~0;
		var idx = 0;
		var x = 1;
		for (var i = 0; i < n; i++) {
			var pi = arr[i];
			idx = idx * (n - i) + bitCount(seen & ((1 << cums[pi]) - 1)) * x;
			x = x * cnts[pi]--;
			seen &= ~(1 << (cums[pi] + cnts[pi]));
		}
		return Math.round(idx / x);
	}

	function setMPerm(arr, idx, n, cnts, x) {
		for (var i = 0; i < n; i++) {
			for (var j = 0; j < cnts.length; j++) {
				if (cnts[j] == 0) {
					continue;
				}
				var x2 = ~~(x * cnts[j] / (n - i));
				if (idx < x2) {
					cnts[j]--;
					arr[i] = j;
					x = x2;
					break;
				}
				idx -= x2;
			}
		}
		return arr;
	}

	// type: 'p' (permutation), 'o' (orientation), 'c' (combination)
	// evenbase: base for ori, sign for even parity, cnts for combination
	function Coord(type, length, evenbase) {
		this.length = length;
		this.evenbase = evenbase;
		if (type == 'p') {
			this.get = function(arr) {
				return getNPerm(arr, this.length, this.evenbase);
			};
			this.set = function(arr, idx) {
				return setNPerm(arr, idx, this.length, this.evenbase);
			};
		} else if (type == 'o') {
			this.get = function(arr) {
				return getNOri(arr, this.length, this.evenbase);
			};
			this.set = function(arr, idx) {
				return setNOri(arr, idx, this.length, this.evenbase);
			};
		} else if (type == 'c') {
			var cnts = evenbase;
			this.cnts = cnts.slice();
			this.cntn = this.cnts.length;
			this.cums = [0];
			for (var i = 1; i <= this.cntn; i++) {
				this.cums[i] = this.cums[i - 1] + cnts[i - 1];
			}
			this.n = this.cums[this.cntn];
			var n = this.n;
			var x = 1;
			for (var i = 0; i < this.cntn; i++) {
				for (var j = 1; j <= cnts[i]; j++, n--) {
					x *= n / j;
				}
			}
			this.x = Math.round(x);
			this.get = function(arr) {
				return getMPerm(arr, this.n, this.cnts.slice(), this.cums);
			};
			this.set = function(arr, idx) {
				return setMPerm(arr, idx, this.n, this.cnts.slice(), this.x);
			};
		} else { // invalid type
			debugger;
		}
	}

	function fillFacelet(facelets, f, perm, ori, divcol) {
		for (var i = 0; i < facelets.length; i++) {
			var cubie = facelets[i];
			var p = perm[i] === undefined ? i : perm[i];
			if (typeof(cubie) == 'number') {
				f[cubie] = ~~(facelets[p] / divcol);
				continue;
			}
			var o = ori[i] || 0;
			for (var j = 0; j < cubie.length; j++) {
				f[cubie[(j + o) % cubie.length]] = ~~(facelets[p][j] / divcol);
			}
		}
	}

	function detectFacelet(facelets, f, perm, ori, divcol) {
		for (var i = 0; i < facelets.length; i++) {
			var n_ori = facelets[i].length;
			out: for (var j = 0; j < facelets.length + 1; j++) {
				if (j == facelets.length) { // not matched
					return -1;
				} else if (facelets[j].length != n_ori) {
					continue;
				}
				for (var o = 0; o < n_ori; o++) {
					var isMatch = true;
					for (var t = 0; t < n_ori; t++) {
						if (~~(facelets[j][t] / divcol) != f[facelets[i][(t + o) % n_ori]]) {
							isMatch = false;
							break;
						}
					}
					if (isMatch) {
						perm[i] = j;
						ori[i] = o;
						break out;
					}
				}
			}
		}
		return 0;
	}

	function createMove(moveTable, size, doMove, N_MOVES) {
		N_MOVES = N_MOVES || 6;
		if ($.isArray(doMove)) {
			var cord = new Coord(doMove[1], doMove[2], doMove[3]);
			doMove = doMove[0];
			for (var j = 0; j < N_MOVES; j++) {
				moveTable[j] = [];
				for (var i = 0; i < size; i++) {
					var arr = cord.set([], i);
					doMove(arr, j);
					moveTable[j][i] = cord.get(arr);
				}
			}
		} else {
			for (var j = 0; j < N_MOVES; j++) {
				moveTable[j] = [];
				for (var i = 0; i < size; i++) {
					moveTable[j][i] = doMove(i, j);
				}
			}
		}
	}

	function createMoveHash(initState, validMoves, hashFunc, moveFunc) {
		var states = [initState];
		var hash2idx = {};
		var depthEnds = [];
		hash2idx[hashFunc(initState)] = 0;
		depthEnds[0] = 1;
		var moveTable = [];
		for (var m = 0; m < validMoves.length; m++) {
			moveTable[m] = [];
		}
		var tt = +new Date;
		for (var i = 0; i < states.length; i++) {
			if (i == depthEnds.at(-1)) {
				depthEnds.push(states.length);
			}
			if (i % 10000 == 9999) {
				DEBUG && console.log(i, 'states scanned, tt=', +new Date - tt);
			}
			var curState = states[i];
			for (var m = 0; m < validMoves.length; m++) {
				var newState = moveFunc(curState, validMoves[m]);
				if (!newState) {
					moveTable[m][i] = -1;
					continue;
				}
				var newHash = hashFunc(newState);
				if (!(newHash in hash2idx)) {
					hash2idx[newHash] = states.length;
					states.push(newState);
				}
				moveTable[m][i] = hash2idx[newHash];
			}
		}
		DEBUG && console.log('[move hash] ' + states.length + ' states generated, tt=', +new Date - tt, JSON.stringify(depthEnds));
		return [moveTable, hash2idx];
	}

	function edgeMove(arr, m) {
		if (m == 0) { //F
			circleOri(arr, 0, 7, 8, 4, 1);
		} else if (m == 1) { //R
			circleOri(arr, 3, 6, 11, 7, 0);
		} else if (m == 2) { //U
			circleOri(arr, 0, 1, 2, 3, 0);
		} else if (m == 3) { //B
			circleOri(arr, 2, 5, 10, 6, 1);
		} else if (m == 4) { //L
			circleOri(arr, 1, 4, 9, 5, 0);
		} else if (m == 5) { //D
			circleOri(arr, 11, 10, 9, 8, 0);
		}
	}

	function CubieCube() {
		this.ca = [0, 1, 2, 3, 4, 5, 6, 7];
		this.ea = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
		this.ori = 0;
	}

	CubieCube.SOLVED = new CubieCube();

	CubieCube.EdgeMult = function(a, b, prod) {
		for (var ed = 0; ed < 12; ed++) {
			prod.ea[ed] = a.ea[b.ea[ed] >> 1] ^ (b.ea[ed] & 1);
		}
	};

	CubieCube.CornMult = function(a, b, prod) {
		for (var corn = 0; corn < 8; corn++) {
			var ori = ((a.ca[b.ca[corn] & 7] >> 3) + (b.ca[corn] >> 3)) % 3;
			prod.ca[corn] = a.ca[b.ca[corn] & 7] & 7 | ori << 3;
		}
	};

	CubieCube.CubeMult = function(a, b, prod) {
		CubieCube.CornMult(a, b, prod);
		CubieCube.EdgeMult(a, b, prod);
	};

	CubieCube.CentMult = function(a, b, prod) {
		prod.ct = [];
		for (var cent = 0; cent < 6; cent++) {
			prod.ct[cent] = a.ct[b.ct[cent]];
		}
	};

	CubieCube.prototype.init = function(ca, ea) {
		this.ca = ca.slice();
		this.ea = ea.slice();
		return this;
	};

	CubieCube.prototype.hashCode = function() {
		var ret = 0;
		for (var i = 0; i < 20; i++) {
			ret = 0 | (ret * 31 + (i < 12 ? this.ea[i] : this.ca[i - 12]));
		}
		return ret;
	}

	CubieCube.prototype.isEqual = function(c) {
		c = c || CubieCube.SOLVED;
		for (var i = 0; i < 8; i++) {
			if (this.ca[i] != c.ca[i]) {
				return false;
			}
		}
		for (var i = 0; i < 12; i++) {
			if (this.ea[i] != c.ea[i]) {
				return false;
			}
		}
		return true;
	};

	CubieCube.cFacelet = [
		[8, 9, 20], // URF
		[6, 18, 38], // UFL
		[0, 36, 47], // ULB
		[2, 45, 11], // UBR
		[29, 26, 15], // DFR
		[27, 44, 24], // DLF
		[33, 53, 42], // DBL
		[35, 17, 51]  // DRB
	];
	CubieCube.eFacelet = [
		[5, 10], // UR
		[7, 19], // UF
		[3, 37], // UL
		[1, 46], // UB
		[32, 16], // DR
		[28, 25], // DF
		[30, 43], // DL
		[34, 52], // DB
		[23, 12], // FR
		[21, 41], // FL
		[50, 39], // BL
		[48, 14]  // BR
	];
	CubieCube.ctFacelet = [4, 13, 22, 31, 40, 49]; // centers
	CubieCube.faceMap = (function() {
		var f = [];
		for (var c = 0; c < 8; c++) {
			for (var n = 0; n < 3; n++) {
				f[CubieCube.cFacelet[c][n]] = [0, c, n];
			}
		}
		for (var e = 0; e < 12; e++) {
			for (var n = 0; n < 2; n++)
				f[CubieCube.eFacelet[e][n]] = [1, e, n];
		}
		return f;
	})();

	CubieCube.prototype.toPerm = function(cFacelet, eFacelet, ctFacelet, withOri) {
		cFacelet = cFacelet || CubieCube.cFacelet;
		eFacelet = eFacelet || CubieCube.eFacelet;
		ctFacelet = ctFacelet || CubieCube.ctFacelet;
		var f = [];
		for (var i = 0; i < 54; i++) {
			f[i] = i;
		}
		var obj = this;
		if (withOri && obj.ori) {
			obj = new CubieCube();
			var rot = CubieCube.rotCube[CubieCube.rotMulI[0][this.ori]];
			CubieCube.CubeMult(this, rot, obj);
			for (var i = 0; i < 6; i++) {
				f[ctFacelet[i]] = ctFacelet[rot.ct[i]];
			}
		}
		for (var c = 0; c < 8; c++) {
			var j = obj.ca[c] & 0x7; // cornercubie with index j is at
			var ori = obj.ca[c] >> 3; // Orientation of this cubie
			for (var n = 0; n < 3; n++)
				f[cFacelet[c][(n + ori) % 3]] = cFacelet[j][n];
		}
		for (var e = 0; e < 12; e++) {
			var j = obj.ea[e] >> 1; // edgecubie with index j is at edgeposition
			var ori = obj.ea[e] & 1; // Orientation of this cubie
			for (var n = 0; n < 2; n++)
				f[eFacelet[e][(n + ori) % 2]] = eFacelet[j][n];
		}
		return f;
	}

	CubieCube.prototype.toFaceCube = function(cFacelet, eFacelet, ctFacelet, withOri) {
		var perm = this.toPerm(cFacelet, eFacelet, ctFacelet, withOri);
		var ts = "URFDLB";
		var f = [];
		for (var i = 0; i < 54; i++) {
			f[i] = ts[~~(perm[i] / 9)];
		}
		return f.join("");
	}

	CubieCube.prototype.prettyString = function(withOri) {
		var facelet = this.toFaceCube(null, null, null, withOri);
		var tmp =
			"        U0U1U2\n" +
			"        U3U4U5\n" +
			"        U6U7U8\n" +
			"L0L1L2  F0F1F2  R0R1R2  B0B1B2\n" +
			"L3L4L5  F3F4F5  R3R4R5  B3B4B5\n" +
			"L6L7L8  F6F7F8  R6R7R8  B6B7B8\n" +
			"        D0D1D2\n" +
			"        D3D4D5\n" +
			"        D6D7D8\n";
		return tmp.replace(/[URFDLB][0-8]/g, function(m) {
			var i1 = "URFDLB".indexOf(m[0]);
			return facelet[i1 * 9 + ~~m[1]] + ' ';
		});
	}

	CubieCube.prototype.invFrom = function(cc) {
		for (var edge = 0; edge < 12; edge++) {
			this.ea[cc.ea[edge] >> 1] = edge << 1 | cc.ea[edge] & 1;
		}
		for (var corn = 0; corn < 8; corn++) {
			this.ca[cc.ca[corn] & 0x7] = corn | 0x20 >> (cc.ca[corn] >> 3) & 0x18;
		}
		return this;
	}

	CubieCube.prototype.fromFacelet = function(facelet, cFacelet, eFacelet) {
		cFacelet = cFacelet || CubieCube.cFacelet;
		eFacelet = eFacelet || CubieCube.eFacelet;
		var count = 0;
		var f = [];
		var centers = facelet[4] + facelet[13] + facelet[22] + facelet[31] + facelet[40] + facelet[49];
		for (var i = 0; i < 54; ++i) {
			f[i] = centers.indexOf(facelet[i]);
			if (f[i] == -1) {
				return -1;
			}
			count += 1 << (f[i] << 2);
		}
		if (count != 0x999999) {
			return -1;
		}
		var col1, col2, i, j, ori;
		for (i = 0; i < 8; ++i) {
			for (ori = 0; ori < 3; ++ori)
				if (f[cFacelet[i][ori]] == 0 || f[cFacelet[i][ori]] == 3)
					break;
			col1 = f[cFacelet[i][(ori + 1) % 3]];
			col2 = f[cFacelet[i][(ori + 2) % 3]];
			for (j = 0; j < 8; ++j) {
				if (col1 == ~~(cFacelet[j][1] / 9) && col2 == ~~(cFacelet[j][2] / 9)) {
					this.ca[i] = j | ori % 3 << 3;
					break;
				}
			}
		}
		for (i = 0; i < 12; ++i) {
			for (j = 0; j < 12; ++j) {
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][0] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][1] / 9)) {
					this.ea[i] = j << 1;
					break;
				}
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][1] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][0] / 9)) {
					this.ea[i] = j << 1 | 1;
					break;
				}
			}
		}
		return this;
	}

	CubieCube.prototype.verify = function() {
		var mask = 0;
		var sum = 0;
		var ep = [];
		for (var e = 0; e < 12; e++) {
			mask |= 1 << 8 << (this.ea[e] >> 1);
			sum ^= this.ea[e] & 1;
			ep.push(this.ea[e] >> 1);
		}
		var cp = [];
		for (var c = 0; c < 8; c++) {
			mask |= 1 << (this.ca[c] & 7);
			sum += this.ca[c] >> 3 << 1;
			cp.push(this.ca[c] & 0x7);
		}
		if (mask != 0xfffff || sum % 6 != 0
				|| getNParity(getNPerm(ep, 12), 12) != getNParity(getNPerm(cp, 8), 8)) {
			return -1;
		}
		return 0;
	}

	CubieCube.moveCube = (function() {
		var moveCube = [];
		for (var i = 0; i < 18; i++) {
			moveCube[i] = new CubieCube();
		}
		moveCube[0].init([3, 0, 1, 2, 4, 5, 6, 7], [6, 0, 2, 4, 8, 10, 12, 14, 16, 18, 20, 22]);
		moveCube[3].init([20, 1, 2, 8, 15, 5, 6, 19], [16, 2, 4, 6, 22, 10, 12, 14, 8, 18, 20, 0]);
		moveCube[6].init([9, 21, 2, 3, 16, 12, 6, 7], [0, 19, 4, 6, 8, 17, 12, 14, 3, 11, 20, 22]);
		moveCube[9].init([0, 1, 2, 3, 5, 6, 7, 4], [0, 2, 4, 6, 10, 12, 14, 8, 16, 18, 20, 22]);
		moveCube[12].init([0, 10, 22, 3, 4, 17, 13, 7], [0, 2, 20, 6, 8, 10, 18, 14, 16, 4, 12, 22]);
		moveCube[15].init([0, 1, 11, 23, 4, 5, 18, 14], [0, 2, 4, 23, 8, 10, 12, 21, 16, 18, 7, 15]);
		for (var a = 0; a < 18; a += 3) {
			for (var p = 0; p < 2; p++) {
				CubieCube.CubeMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
			}
		}
		return moveCube;
	})();

	CubieCube.rotCube = (function() {
		var u4 = new CubieCube().init([3, 0, 1, 2, 7, 4, 5, 6], [6, 0, 2, 4, 14, 8, 10, 12, 23, 17, 19, 21]);
		u4.ct = [0, 5, 1, 3, 2, 4];
		var f2 = new CubieCube().init([5, 4, 7, 6, 1, 0, 3, 2], [12, 10, 8, 14, 4, 2, 0, 6, 18, 16, 22, 20]);
		f2.ct = [3, 4, 2, 0, 1, 5];
		var urf = new CubieCube().init([8, 20, 13, 17, 19, 15, 22, 10], [3, 16, 11, 18, 7, 22, 15, 20, 1, 9, 13, 5]);
		urf.ct = [2, 0, 1, 5, 3, 4];
		var c = new CubieCube();
		c.ct = [0, 1, 2, 3, 4, 5];
		var d = new CubieCube();
		var rotCube = [];
		for (var i = 0; i < 24; i++) {
			rotCube[i] = new CubieCube().init(c.ca, c.ea);
			rotCube[i].ct = c.ct.slice();
			CubieCube.CubeMult(c, u4, d);
			CubieCube.CentMult(c, u4, d);
			c.init(d.ca, d.ea);
			c.ct = d.ct.slice();
			if (i % 4 == 3) {
				CubieCube.CubeMult(c, f2, d);
				CubieCube.CentMult(c, f2, d);
				c.init(d.ca, d.ea);
				c.ct = d.ct.slice();
			}
			if (i % 8 == 7) {
				CubieCube.CubeMult(c, urf, d);
				CubieCube.CentMult(c, urf, d);
				c.init(d.ca, d.ea);
				c.ct = d.ct.slice();
			}
		}

		var movHash = [];
		var rotHash = [];
		var rotMult = [];
		var rotMulI = [];
		var rotMulM = [];
		for (var i = 0; i < 24; i++) {
			rotHash[i] = rotCube[i].hashCode();
			rotMult[i] = [];
			rotMulI[i] = [];
			rotMulM[i] = [];
		}
		for (var i = 0; i < 18; i++) {
			movHash[i] = CubieCube.moveCube[i].hashCode();
		}
		for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 24; j++) {
				CubieCube.CubeMult(rotCube[i], rotCube[j], c);
				var k = rotHash.indexOf(c.hashCode());
				rotMult[i][j] = k;
				rotMulI[k][j] = i;
			}
		}
		for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 18; j++) {
				CubieCube.CubeMult(rotCube[rotMulI[0][i]], CubieCube.moveCube[j], c);
				CubieCube.CubeMult(c, rotCube[i], d);
				var k = movHash.indexOf(d.hashCode());
				rotMulM[i][j] = k;
			}
		}

		var rot2str = [
			"", "y'", "y2", "y",
			"z2", "y' z2", "y2 z2", "y z2",
			"y' x'", "y2 x'", "y x'", "x'",
			"y' x", "y2 x", "y x", "x",
			"y z", "z", "y' z", "y2 z",
			"y' z'", "y2 z'", "y z'", "z'"
		];

		CubieCube.rotMult = rotMult;
		CubieCube.rotMulI = rotMulI;
		CubieCube.rotMulM = rotMulM;
		CubieCube.rot2str = rot2str;
		return rotCube;
	})();

	CubieCube.prototype.edgeCycles = function() {
		var visited = [];
		var small_cycles = [0, 0, 0];
		var cycles = 0;
		var parity = false;
		for (var x = 0; x < 12; ++x) {
			if (visited[x]) {
				continue
			}
			var length = -1;
			var flip = false;
			var y = x;
			do {
				visited[y] = true;
				++length;
				flip ^= this.ea[y] & 1;
				y = this.ea[y] >> 1;
			} while (y != x);
			cycles += length >> 1;
			if (length & 1) {
				parity = !parity;
				++cycles;
			}
			if (flip) {
				if (length == 0) {
					++small_cycles[0];
				} else if (length & 1) {
					small_cycles[2] ^= 1;
				} else {
					++small_cycles[1];
				}
			}
		}
		small_cycles[1] += small_cycles[2];
		if (small_cycles[0] < small_cycles[1]) {
			cycles += (small_cycles[0] + small_cycles[1]) >> 1;
		} else {
			var flip_cycles = [0, 2, 3, 5, 6, 8, 9];
			cycles += small_cycles[1] + flip_cycles[(small_cycles[0] - small_cycles[1]) >> 1];
		}
		return cycles - parity;
	};

	var CubeMoveRE = /^\s*([URFDLB]w?|[EMSyxz]|2-2[URFDLB]w)(['2]?)(@\d+)?\s*$/;
	var tmpCubie = new CubieCube();
	CubieCube.prototype.selfMoveStr = function(moveStr, isInv) {
		var m = CubeMoveRE.exec(moveStr);
		if (!m) {
			return;
		}
		var face = m[1];
		var pow = "2'".indexOf(m[2] || '-') + 2;
		if (isInv) {
			pow = 4 - pow;
		}
		if (m[3]) {
			this.tstamp = ~~m[3].slice(1);
		}
		this.ori = this.ori || 0;
		var axis = 'URFDLB'.indexOf(face);
		if (axis != -1) {
			m = axis * 3 + pow % 4 - 1
			m = CubieCube.rotMulM[this.ori][m];
			CubieCube.CubeMult(this, CubieCube.moveCube[m], tmpCubie);
			this.init(tmpCubie.ca, tmpCubie.ea);
			return m;
		}
		axis = 'UwRwFwDwLwBw'.indexOf(face);
		if (axis != -1) {
			axis >>= 1;
			m = (axis + 3) % 6 * 3 + pow % 4 - 1
			m = CubieCube.rotMulM[this.ori][m];
			CubieCube.CubeMult(this, CubieCube.moveCube[m], tmpCubie);
			this.init(tmpCubie.ca, tmpCubie.ea);
			var rot = [3, 15, 17, 1, 11, 23][axis];
			for (var i = 0; i < pow; i++) {
				this.ori = CubieCube.rotMult[rot][this.ori];
			}
			return m;
		}
		axis = ['2-2Uw', '2-2Rw', '2-2Fw', '2-2Dw', '2-2Lw', '2-2Bw'].indexOf(face);
		if (axis == -1) {
			axis = [null, null, 'S', 'E', 'M', null].indexOf(face);
		}
		if (axis != -1) {
			var m1 = axis * 3 + (4 - pow) % 4 - 1;
			var m2 = (axis + 3) % 6 * 3 + pow % 4 - 1;
			m1 = CubieCube.rotMulM[this.ori][m1];
			CubieCube.CubeMult(this, CubieCube.moveCube[m1], tmpCubie);
			this.init(tmpCubie.ca, tmpCubie.ea);
			m2 = CubieCube.rotMulM[this.ori][m2];
			CubieCube.CubeMult(this, CubieCube.moveCube[m2], tmpCubie);
			this.init(tmpCubie.ca, tmpCubie.ea);
			var rot = [3, 15, 17, 1, 11, 23][axis];
			for (var i = 0; i < pow; i++) {
				this.ori = CubieCube.rotMult[rot][this.ori];
			}
			return m1 + 18;
		}
		axis = 'yxz'.indexOf(face);
		if (axis != -1) {
			var rot = [3, 15, 17][axis];
			for (var i = 0; i < pow; i++) {
				this.ori = CubieCube.rotMult[rot][this.ori];
			}
			return;
		}
	}

	CubieCube.prototype.selfConj = function(conj) {
		if (conj === undefined) {
			conj = this.ori;
		}
		if (conj != 0) {
			CubieCube.CubeMult(CubieCube.rotCube[conj], this, tmpCubie);
			CubieCube.CubeMult(tmpCubie, CubieCube.rotCube[CubieCube.rotMulI[0][conj]], this);
			this.ori = CubieCube.rotMulI[this.ori][conj] || 0;
		}
	}

	var minx = (function() {
		var U = 0, R = 1, F = 2, L = 3, BL = 4, BR = 5, DR = 6, DL = 7, DBL = 8, B = 9, DBR = 10, D = 11;
		var oppFace = [D, DBL, B, DBR, DR, DL, BL, BR, R, F, L, U];
		var adjFaces = [
			[BR, R, F, L, BL], //U
			[DBR, DR, F, U, BR], //R
			[DR, DL, L, U, R], //F
			[DL, DBL, BL, U, F], //L
			[DBL, B, BR, U, L], //BL
			[B, DBR, R, U, BL], //BR
			[D, DL, F, R, DBR], //DR
			[D, DBL, L, F, DR], //DL
			[D, B, BL, L, DL], //DBL
			[D, DBR, BR, BL, DBL], //B
			[D, DR, R, BR, B], //DBR
			[DR, DBR, B, DBL, DL]  //D
		];

		// wide: 0=single, 1=all, 2=all but single
		// state: corn*5, edge*5, center*1
		function doMove(state, face, pow, wide) {
			pow = (pow % 5 + 5) % 5;
			if (pow == 0) {
				return;
			}
			var base = face * 11;
			var adjs = [];
			var swaps = [[], [], [], [], []];
			for (var i = 0; i < 5; i++) {
				var aface = adjFaces[face][i];
				var ridx = adjFaces[aface].indexOf(face);
				if (wide == 0 || wide == 1) {
					swaps[i].push(
						base + i,
						base + i + 5,
						aface * 11 + ridx % 5 + 5,
						aface * 11 + ridx % 5,
						aface * 11 + (ridx + 1) % 5);
				}
				if (wide == 1 || wide == 2) {
					swaps[i].push(aface * 11 + 10);
					for (var j = 1; j < 5; j++) {
						swaps[i].push(aface * 11 + (ridx + j) % 5 + 5);
					}
					for (var j = 2; j < 5; j++) {
						swaps[i].push(aface * 11 + (ridx + j) % 5);
					}
					var ii = 4 - i;
					var opp = oppFace[face];
					var oaface = adjFaces[opp][ii];
					var oridx = adjFaces[oaface].indexOf(opp);
					swaps[i].push(
						opp * 11 + ii,
						opp * 11 + ii + 5,
						oaface * 11 + 10);
					for (var j = 0; j < 5; j++) {
						swaps[i].push(
							oaface * 11 + (oridx + j) % 5 + 5,
							oaface * 11 + (oridx + j) % 5);
					}
				}
			}
			for (var i = 0; i < swaps[0].length; i++) {
				mathlib.acycle(state, [swaps[0][i], swaps[1][i], swaps[2][i], swaps[3][i], swaps[4][i]], pow);
			}
		}

		return {
			doMove: doMove,
			oppFace: oppFace,
			adjFaces: adjFaces
		}
	})();

	function createPrun(prun, init, size, maxd, doMove, N_MOVES, N_POWER, N_INV) {
		var isMoveTable = $.isArray(doMove);
		N_MOVES = N_MOVES || 6;
		N_POWER = N_POWER || 3;
		N_INV = N_INV || 256;
		maxd = maxd || 256;
		for (var i = 0, len = (size + 7) >>> 3; i < len; i++) {
			prun[i] = -1;
		}
		if (!$.isArray(init)) {
			init = [init];
		}
		for (var i = 0; i < init.length; i++) {
			prun[init[i] >> 3] ^= 15 << ((init[i] & 7) << 2);
		}
		var val = 0;
		// var t = +new Date;
		for (var l = 0; l <= maxd; l++) {
			var done = 0;
			var inv = l >= N_INV;
			var fill = (l + 1) ^ 15;
			var find = inv ? 0xf : l;
			var check = inv ? l : 0xf;

			out: for (var p = 0; p < size; p++, val >>= 4) {
				if ((p & 7) == 0) {
					val = prun[p >> 3];
					if (!inv && val == -1) {
						p += 7;
						continue;
					}
				}
				if ((val & 0xf) != find) {
					continue;
				}
				for (var m = 0; m < N_MOVES; m++) {
					var q = p;
					for (var c = 0; c < N_POWER; c++) {
						q = isMoveTable ? doMove[m][q] : doMove(q, m);
						if (q < 0) {
							break;
						}
						if (getPruning(prun, q) != check) {
							continue;
						}
						++done;
						if (inv) {
							prun[p >> 3] ^= fill << ((p & 7) << 2);
							continue out;
						}
						prun[q >> 3] ^= fill << ((q & 7) << 2);
					}
				}
			}
			if (done == 0) {
				break;
			}
			DEBUG && console.log('[prun]', done);
		}
	}

	// stateParams: [[init, doMove, size, [maxd], [N_INV]], [...]...]
	function Solver(N_MOVES, N_POWER, stateParams) {
		this.N_STATES = stateParams.length;
		this.N_MOVES = N_MOVES;
		this.N_POWER = N_POWER;
		this.stateParams = stateParams;
		this.coords = [];
		for (var i = 0; i < this.N_STATES; i++) {
			var doMove = stateParams[i][1];
			if ($.isArray(doMove)) {
				this.coords[i] = new Coord(doMove[1], doMove[2], doMove[3]);
			}
		}
		this.inited = false;
	}

	var _ = Solver.prototype;

	_.init = function() {
		if (this.inited) {
			return;
		}
		this.move = [];
		this.prun = [];
		for (var i = 0; i < this.N_STATES; i++) {
			var stateParam = this.stateParams[i];
			var init = stateParam[0];
			var doMove = stateParam[1];
			var size = stateParam[2];
			var maxd = stateParam[3];
			var N_INV = stateParam[4];
			this.move[i] = [];
			this.prun[i] = [];
			createMove(this.move[i], size, doMove, this.N_MOVES);
			createPrun(this.prun[i], init, size, maxd, this.move[i], this.N_MOVES, this.N_POWER, N_INV);
		}
		this.solv = new Searcher(null, (state) => {
			var prun = 0;
			for (var i = 0; i < this.N_STATES; i++) {
				prun = Math.max(prun, getPruning(this.prun[i], state[i]));
			}
			return prun;
		}, (state, move) => {
			for (var i = 0; i < this.N_STATES; i++) {
				state[i] = this.move[i][move][state[i]];
			}
			return state;
		}, this.N_MOVES, this.N_POWER);
		this.inited = true;
	}

	_.search = function(state, minl, MAXL) {
		MAXL = MAXL || 99;
		if (!this.inited) {
			this.init();
		}
		this.sol = this.solv.solve(state, minl, MAXL);
		return this.sol;
	};

	_.toStr = function(sol, move_map, power_map) {
		return sol.map((move) => move_map[move[0]] + power_map[move[1]]).join(' ').replace(/ +/g, ' ');
	};

	// ida search algorithm
	// isSolved(state) -> boolean, in case isSolved = null, getPrun(idx) == 0 is used
	// getPrun(state) -> int
	// doMove(state) -> newState
	// if ckmv[last_move] >> cur_move & 1, cur_move is skipped
	function Searcher(isSolved, getPrun, doMove, N_AXIS, N_POWER, ckmv) {
		this.isSolved = isSolved || function() { return true; };
		this.getPrun = getPrun;
		this.doMove = doMove;
		this.N_AXIS = N_AXIS;
		this.N_POWER = N_POWER;
		this.ckmv = ckmv || valuedArray(N_AXIS, function(i) { return 1 << i; } );
	}

	_ = Searcher.prototype;

	_.solve = function(idx, minl, MAXL, callback, cost) {
		var sols = this.solveMulti([idx], minl, MAXL, callback, cost);
		return sols == null ? null : sols[0];
	};

	_.solveMulti = function(idxs, minl, MAXL, callback, cost) {
		this.sidx = 0;
		this.sol = [];
		this.length = minl;
		this.idxs = idxs;
		return this.nextMulti(MAXL, callback, cost);
	};

	_.next = function(MAXL, callback, cost) {
		var sols = this.nextMulti(MAXL, callback, cost);
		return sols == null ? null : sols[0];
	};

	_.nextMulti = function(MAXL, callback, cost) {
		this.cost = (cost || 1e9) + 1;
		this.callback = callback || function() { return true; };
		for (; this.length <= MAXL; this.length++) {
			for (; this.sidx < this.idxs.length; this.sidx++) {
				if (this.idaSearch(this.idxs[this.sidx], this.length, 0, -1, this.sol) == 0) {
					return this.cost <= 0 ? null : [this.sol, this.sidx];
				}
			}
			this.sidx = 0;
		}
		return null;
	}

	_.idaSearch = function(idx, maxl, depth, lm, sol) {
		if (--this.cost <= 0) {
			return 0;
		}
		var prun = this.getPrun(idx);
		if (prun > maxl) {
			return prun > maxl + 1 ? 2 : 1;
		} else if (maxl == 0) {
			return this.isSolved(idx) && this.callback(sol, this.sidx) ? 0 : 1;
		} else if (prun == 0 && maxl == 1 && this.isSolved(idx)) {
			return 1;
		}
		var axis = sol.length > depth ? sol[depth][0] : 0;
		for (; axis < this.N_AXIS; axis++) {
			if (this.ckmv[lm] >> axis & 1) {
				continue;
			}
			var idx1 = $.isArray(idx) ? idx.slice() : idx;
			var pow = sol.length > depth ? sol[depth][1] : 0;
			for (; pow < this.N_POWER; pow++) {
				idx1 = this.doMove(idx1, axis, pow);
				if (idx1 == null) {
					break;
				}
				sol[depth] = [axis, pow];
				var ret = this.idaSearch(idx1, maxl - 1, depth + 1, axis, sol);
				if (ret == 0) {
					return 0;
				}
				sol.pop();
				if (ret == 2) {
					break;
				}
			}
		}
		return 1;
	};

	// state: string not null
	// solvedStates: [solvedstate, solvedstate, ...], string not null
	// moveFunc: function(state, move);
	// moves: {move: face0 | axis0}, face0 | axis0 = 4 + 4 bits
	function gSolver(solvedStates, doMove, moves) {
		this.solvedStates = solvedStates;
		this.doMove = doMove;
		this.movesList = [];
		for (var move in moves) {
			this.movesList.push([move, moves[move]]);
		}
		this.prunTable = {};
		this.toUpdateArr = null;
		this.prunTableSize = 0;
		this.prunDepth = -1;
		this.cost = 0;
		this.MAX_PRUN_SIZE = 100000;
	}

	_ = gSolver.prototype;

	_.updatePrun = function(targetDepth) {
		targetDepth = targetDepth === undefined ? this.prunDepth + 1 : targetDepth;
		for (var depth = this.prunDepth + 1; depth <= targetDepth; depth++) {
			if (this.prevSize >= this.MAX_PRUN_SIZE) {
				DEBUG && console.log('[gSolver] skipPrun', depth, this.prunTableSize);
				break;
			}
			var t = +new Date;
			if (depth < 1) {
				this.prevSize = 0;
				for (var i = 0; i < this.solvedStates.length; i++) {
					var state = this.solvedStates[i];
					if (!(state in this.prunTable)) {
						this.prunTable[state] = depth;
						this.prunTableSize++;
					}
				}
			} else {
				this.updatePrunBFS(depth - 1);
			}
			if (this.cost == 0) {
				return;
			}
			this.prunDepth = depth;
			DEBUG && console.log('[gSolver] updatePrun', depth, this.prunTableSize - this.prevSize, +new Date - t);
			this.prevSize = this.prunTableSize;
		}
	};

	_.updatePrunBFS = function(fromDepth) {
		if (this.toUpdateArr == null) {
			this.toUpdateArr = [];
			for (var state in this.prunTable) {
				if (this.prunTable[state] != fromDepth) {
					continue;
				}
				this.toUpdateArr.push(state);
			}
		}
		while (this.toUpdateArr.length != 0) {
			var state = this.toUpdateArr.pop();
			for (var moveIdx = 0; moveIdx < this.movesList.length; moveIdx++) {
				var newState = this.doMove(state, this.movesList[moveIdx][0]);
				if (!newState || newState in this.prunTable) {
					continue;
				}
				this.prunTable[newState] = fromDepth + 1;
				this.prunTableSize++;
			}
			if (this.cost >= 0) {
				if (this.cost == 0) {
					return;
				}
				this.cost--;
			}
		}
		this.toUpdateArr = null;
	};

	_.search = function(state, minl, MAXL) {
		this.sol = [];
		this.subOpt = false;
		this.state = state;
		this.visited = {};
		this.maxl = minl = minl || 0;
		return this.searchNext(MAXL);
	};

	_.searchNext = function(MAXL, cost) {
		MAXL = (MAXL + 1) || 99;
		this.prevSolStr = this.solArr ? this.solArr.join(',') : null;
		this.solArr = null;
		this.cost = cost || -1;
		for (; this.maxl < MAXL; this.maxl++) {
			this.updatePrun(Math.ceil(this.maxl / 2));
			if (this.cost == 0) {
				return null;
			}
			if (this.idaSearch(this.state, this.maxl, null, 0)) {
				break;
			}
		}
		return this.solArr;
	}

	_.getPruning = function(state) {
		var prun = this.prunTable[state];
		return prun === undefined ? this.prunDepth + 1 : prun;
	};

	_.idaSearch = function(state, maxl, lm, depth) {
		if (this.getPruning(state) > maxl) {
			return false;
		}
		if (maxl == 0) {
			if (this.solvedStates.indexOf(state) == -1) {
				return false;
			}
			var solArr = this.sol.map((move) => this.movesList[move][0]);
			this.subOpt = true;
			if (solArr.join(',') == this.prevSolStr) {
				return false;
			}
			this.solArr = solArr;
			return true;
		}
		if (!this.subOpt) {
			if (state in this.visited && this.visited[state] < depth) {
				return false;
			}
			this.visited[state] = depth;
		}
		if (this.cost >= 0) {
			if (this.cost == 0) {
				return true;
			}
			this.cost--;
		}
		var lastMove = lm == null ? '' : this.movesList[lm][0];
		var lastAxisFace = lm == null ? -1 : this.movesList[lm][1];
		for (var moveIdx = this.sol[depth] || 0; moveIdx < this.movesList.length; moveIdx++) {
			var moveArgs = this.movesList[moveIdx];
			var axisface = moveArgs[1] ^ lastAxisFace;
			var move = moveArgs[0];
			if (axisface == 0 ||
				(axisface & 0xf) == 0 && move <= lastMove) {
				continue;
			}
			var newState = this.doMove(state, move);
			if (!newState || newState == state) {
				continue;
			}
			this.sol[depth] = moveIdx;
			if (this.idaSearch(newState, maxl - 1, moveIdx, depth + 1)) {
				return true;
			}
			this.sol.pop();
		}
		return false;
	};

	var randGen = (function() {
		var rndFunc;
		var rndCnt;
		var seedStr; // '' + new Date().getTime();

		function random() {
			rndCnt++;
			// console.log(rndCnt);
			return rndFunc();
		}

		function getSeed() {
			return [rndCnt, seedStr];
		}

		function setSeed(_rndCnt, _seedStr) {
			if (_seedStr && (_seedStr != seedStr || rndCnt > _rndCnt)) {
				var seed = [];
				for (var i = 0; i < _seedStr.length; i++) {
					seed[i] = _seedStr.charCodeAt(i);
				}
				isaac.seed(seed);
				rndFunc = isaac.random;
				rndCnt = 0;
				seedStr = _seedStr;
			}
			while (rndCnt < _rndCnt) {
				rndFunc();
				rndCnt++;
			}
		}

		var seed = '' + new Date().getTime();
		if (typeof crypto != 'undefined' && crypto.getRandomValues) {
			seed = String.fromCharCode.apply(null, crypto.getRandomValues(new Uint16Array(256)));
			DEBUG && console.log('[mathlib] use crypto seed', seed);
		} else {
			DEBUG && console.log('[mathlib] use datetime seed', seed);
		}
		setSeed(256, seed);

		return {
			random: random,
			getSeed: getSeed,
			setSeed: setSeed
		};
	})();

	function rndEl(x) {
		return x[~~(randGen.random() * x.length)];
	}

	function rn(n) {
		return ~~(randGen.random() * n)
	}

	function rndHit(prob) {
		return randGen.random() < prob;
	}

	function rndPerm(n, isEven) {
		var p = 0;
		var arr = [];
		for (var i = 0; i < n; i++) {
			arr[i] = i;
		}
		for (var i = 0; i < n - 1; i++) {
			var k = rn(n - i);
			circle(arr, i, i + k);
			p ^= k != 0;
		}
		if (isEven && p) {
			circle(arr, 0, 1);
		}
		return arr;
	}

	function rndProb(plist) {
		var cum = 0;
		var curIdx = 0;
		for (var i = 0; i < plist.length; i++) {
			if (plist[i] == 0) {
				continue;
			}
			if (randGen.random() < plist[i] / (cum + plist[i])) {
				curIdx = i;
			}
			cum += plist[i];
		}
		return curIdx;
	}

	function time2str(unix, format) {
		if (!unix) {
			return 'N/A';
		}
		format = format || '%Y-%M-%D %h:%m:%s';
		var date = new Date(unix * 1000);
		return format
			.replace('%Y', date.getFullYear())
			.replace('%M', ('0' + (date.getMonth() + 1)).slice(-2))
			.replace('%D', ('0' + date.getDate()).slice(-2))
			.replace('%h', ('0' + date.getHours()).slice(-2))
			.replace('%m', ('0' + date.getMinutes()).slice(-2))
			.replace('%s', ('0' + date.getSeconds()).slice(-2))
			.replace('%S', ('00' + date.getMilliseconds()).slice(-3));
	}

	var timeRe = /^\s*(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s*$/;

	function str2time(val) {
		var m = timeRe.exec(val);
		if (!m) {
			return null;
		}
		var date = new Date(1970, 0, 1);
		date.setFullYear(~~m[1]);
		date.setMonth(~~m[2] - 1);
		date.setDate(~~m[3]);
		date.setHours(~~m[4]);
		date.setMinutes(~~m[5]);
		date.setSeconds(~~m[6]);
		return ~~(date.getTime() / 1000);
	}

	function obj2str(val) {
		if (typeof val == 'string') {
			return val;
		}
		return JSON.stringify(val);
	}

	function str2obj(val) {
		if (typeof val != 'string') {
			return val;
		}
		return JSON.parse(val);
	}

	function valuedArray(len, val) {
		var ret = [];
		var isFun = typeof val == 'function';
		for (var i = 0; i < len; i++) {
			ret[i] = isFun ? val(i) : val;
		}
		return ret;
	}

	function idxArray(arr, idx) {
		return arr.map((elem) => elem[idx]);
	}

	function permOriMult(p1, p2, prod, o1, o2, ori, oriMod) {
		for (var i = 0; i < p2.length; i++) {
			if (oriMod) {
				ori[i] = (o1[p2[i]] + o2[i]) % oriMod;
			}
			prod[i] = p1[p2[i]];
		}
	}

	Math.TAU = Math.PI * 2;

	return {
		Cnk: Cnk,
		fact: fact,
		bitCount: bitCount,
		getPruning: getPruning,
		setNOri: setNOri,
		getNOri: getNOri,
		setNPerm: setNPerm,
		getNPerm: getNPerm,
		getNParity: getNParity,
		permMul4: permMul4,
		Coord: Coord,
		createMove: createMove,
		createMoveHash: createMoveHash,
		edgeMove: edgeMove,
		circle: circle,
		circleOri: circleOri,
		acycle: acycle,
		createPrun: createPrun,
		CubieCube: CubieCube,
		minx: minx,
		SOLVED_FACELET: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
		fillFacelet: fillFacelet,
		detectFacelet: detectFacelet,
		rn: rn,
		rndEl: rndEl,
		rndProb: rndProb,
		rndHit: rndHit,
		time2str: time2str,
		str2time: str2time,
		obj2str: obj2str,
		str2obj: str2obj,
		valuedArray: valuedArray,
		idxArray: idxArray,
		Solver: Solver,
		Searcher: Searcher,
		rndPerm: rndPerm,
		permOriMult: permOriMult,
		gSolver: gSolver,
		getSeed: randGen.getSeed,
		setSeed: randGen.setSeed
	};
})();

/* ==== lib/grouplib.js ==== */
"use strict";

var grouplib = (function(rn) {

	function permMult(permA, permB) { // different from cube mult
		var ret = [];
		for (var i = 0; i < permA.length; i++) {
			ret[i] = permB[permA[i]];
		}
		return ret;
	}

	function permInv(perm) {
		var ret = [];
		for (var i = 0; i < perm.length; i++) {
			ret[perm[i]] = i;
		}
		return ret;
	}

	function permCmp(perm1, perm2) {
		if (perm1.length != perm2.length) {
			return perm1.length - perm2.length;
		}
		for (var i = perm1.length - 1; i >= 0; i--) {
			if (perm1[i] != perm2[i]) {
				return perm1[i] - perm2[i];
			}
		}
		return 0;
	}

	function SchreierSims(gen, shuffle) {
		if (gen.sgs) {
			this.copy(gen);
			return;
		}
		this.sgs = [];
		this.sgsi = [];
		this.t2i = [];
		this.i2t = [];
		this.keyIdx = [];
		this.Tk = [];
		this.e = [];
		var n = gen[0].length;
		for (var i = 0; i < n; i++) {
			this.e[i] = i;
		}
		for (var i = 0; i < n; i++) {
			this.sgs.push([]);
			this.sgsi.push([]);
			this.t2i.push([]);
			this.i2t.push([i]);
			this.Tk.push([]);
			this.sgs[i][i] = this.e;
			this.sgsi[i][i] = this.e;
			this.t2i[i][i] = 0;
		}
		this.extend(gen, shuffle);
	}

	SchreierSims.prototype.extend = function(gen, shuffle) {
		for (var i = 0; i < gen.length; i++) {
			var g = gen[i];
			if (shuffle) {
				g = permMult(permMult(permInv(shuffle), g), shuffle);
			}
			if (this.isMember(g) < 0) {
				this.knutha(this.e.length - 1, g);
			}
		}
	}

	SchreierSims.prototype.copy = function(obj) {
		this.sgs = [];
		this.sgsi = [];
		this.t2i = [];
		this.i2t = [];
		this.keyIdx = obj.keyIdx.slice();
		this.Tk = [];
		this.e = obj.e;
		var n = this.e.length;
		for (var i = 0; i < n; i++) {
			this.sgs[i] = obj.sgs[i].slice();
			this.sgsi[i] = obj.sgsi[i].slice();
			this.t2i[i] = obj.t2i[i].slice();
			this.i2t[i] = obj.i2t[i].slice();
			this.Tk[i] = obj.Tk[i].slice();
		}
	}

	SchreierSims.prototype.toKeyIdx = function(perm) {
		var ret = [];
		perm = perm || this.e;
		for (var i = 0; i < this.keyIdx.length; i++) {
			ret[i] = perm[this.keyIdx[i]];
		}
		return ret;
	}

	SchreierSims.prototype.isMember = function(p, depth) {
		depth = depth || 0;
		var idx = 0;
		var ps = [];
		for (var i = p.length - 1; i >= depth; i--) {
			var j = p[i];
			for (var k = 0; k < ps.length; k++) {
				j = ps[k][j];
			}
			if (j !== i) {
				if (!this.sgs[i][j]) {
					return -1;
				}
				ps.push(this.sgsi[i][j]);
			}
			idx = idx * this.i2t[i].length + this.t2i[i][j];
		}
		return idx;
	}

	SchreierSims.prototype.isSubgroupMemberByKey = function(permKey, sgsH) {
		var idx = 0;
		var ps = [];
		for (var ii = 0; ii < this.keyIdx.length; ii++) {
			var i = this.keyIdx[ii];
			var j = permKey[ii];
			for (var k = 0; k < ps.length; k++) {
				j = ps[k][j];
			}
			if (j !== i) {
				if (!sgsH.sgs[i][j]) {
					return -1;
				}
				ps.push(sgsH.sgsi[i][j]);
			}
			idx = idx * sgsH.i2t[i].length + sgsH.t2i[i][j];
		}
		return idx;
	}

	SchreierSims.prototype.knutha = function(k, p) {
		this.Tk[k].push(p);
		for (var i = 0; i < this.sgs[k].length; i++) {
			if (this.sgs[k][i]) {
				this.knuthb(k, permMult(this.sgs[k][i], p));
			}
		}
	}

	SchreierSims.prototype.knuthb = function(k, p) {
		var j = p[k];
		if (!this.sgs[k][j]) {
			this.sgs[k][j] = p;
			this.sgsi[k][j] = permInv(p);
			this.t2i[k][j] = this.i2t[k].length;
			this.i2t[k].push(j);
			if (this.i2t[k].length == 2) {
				this.keyIdx.push(k);
				this.keyIdx.sort(function(a, b) { return b - a; });
			}
			for (var i = 0; i < this.Tk[k].length; i++) {
				this.knuthb(k, permMult(p, this.Tk[k][i]));
			}
			return;
		}
		var p2 = permMult(p, this.sgsi[k][j]);
		if (this.isMember(p2) < 0) {
			this.knutha(k - 1, p2);
		}
	}

	SchreierSims.prototype.size = function(accuracy) {
		var n = this.sgs.length;
		var size = accuracy ? BigInt(1) : 1;
		for (var j = 0; j < n; j++) {
			size *= accuracy ? BigInt(this.i2t[j].length) : this.i2t[j].length;
		}
		return size;
	}

	SchreierSims.prototype.minElem = function(p, depth) {
		p = permInv(p);
		for (var ii = 0; ii < this.keyIdx.length; ii++) {
			var i = this.keyIdx[ii];
			var maxi = p[i];
			var j = i;
			for (var k = 1; k < this.i2t[i].length; k++) {
				var m = this.i2t[i][k];
				if (p[m] > maxi) {
					maxi = p[m];
					j = m;
				}
			}
			if (j !== i) {
				p = permMult(this.sgs[i][j], p);
			}
		}
		return permInv(p);
	}

	/*
	// to enumerate perm[depth]
	// checkFunction(depth + 1, perm): perm[depth + 1] is set
	// callback(perm), return true if break
	SchreierSims.prototype.backtrack = function(depth, perm, callback, checkFunc) {
		while (depth >= 1 && this.i2t[depth].length == 1) { // skip redaudant base
			depth--;
		}
		if (!checkFunc(depth + 1, perm)) {
			return;
		}
		if (depth == 0) {
			return callback(perm);
		}
		for (var jj = 0; jj < this.i2t[depth].length; jj++) {
			var j = this.i2t[depth][jj];
			var ret = this.backtrack(depth - 1,
				permMult(this.sgs[depth][j], perm), callback, checkFunc);
			if (ret) {
				return ret;
			}
		}
	}
	*/

	// list all coset representative of subH in G, algorithm in Handbook of Computational Group Theory, pp128
	SchreierSims.prototype.listCoset = function(subH) {
		var cosetReps = [this.e.slice()];
		var targetSize = 1;
		out: for (var ii = this.keyIdx.length - 1; ii >= 0; ii--) {
			var i = this.keyIdx[ii];
			if (this.i2t[i].length == subH.i2t[i].length) { // no new coset
				continue;
			}
			targetSize *= this.i2t[i].length;
			targetSize /= subH.i2t[i].length;
			for (var ci = 0, len = cosetReps.length; ci < len; ci++) {
				var coset = cosetReps[ci];
				expand: for (var jj = 1; jj < this.i2t[i].length; jj++) {
					var j = this.i2t[i][jj];
					var newCoset = permMult(coset, this.sgs[i][j]);
					for (var ss = 1; ss < subH.i2t[i].length; ss++) {
						if (newCoset[subH.i2t[i][ss]] > j) {
							continue expand;
						}
					}
					cosetReps.push(newCoset);
					if (cosetReps.length >= targetSize) {
						continue out;
					}
				}
			}
			console.log('[grouplib] listCoset ERROR, Not enough coset representatives');
		}
		return cosetReps;
	}

	SchreierSims.prototype.rndElem = function() {
		var perm = this.e.slice();
		for (var i = this.e.length - 1; i >= 0; i--) {
			var cnt = 0;
			var p = 0;
			for (var j = 0; j <= i; j++) {
				if (!this.sgs[i][j]) {
					continue;
				}
				if (rn(++cnt) < 1) {
					p = j;
				}
			}
			if (p !== i) {
				perm = permMult(perm, this.sgsi[i][p]);
			}
		}
		return perm;
	}

	function CanonSeqGen(gens) {
		this.gens = gens;
		this.glen = gens.length;
		this.trieNodes = [null];
		this.trieNodes.push([]);
		this.skipSeqs = [];
	}

	CanonSeqGen.prototype.addSkipSeq = function(seq) {
		this.skipSeqs.push(seq.slice());
		var node = 1;
		for (var i = 0; i < seq.length; i++) {
			var next = ~~this.trieNodes[node][seq[i]];
			if (next == -1) {
				return;
			}
			if (i == seq.length - 1) {
				this.trieNodes[node][seq[i]] = -1;
				break;
			}
			if (next <= 0) { // empty node, create a new node
				next = this.trieNodes.length;
				this.trieNodes.push([]);
				this.trieNodes[node][seq[i]] = next;
				for (var m = 0; m < this.glen; m++) {
					this.updateNext(seq.slice(0, i + 1).concat(m));
				}
			}
			node = next;
		}
	}

	CanonSeqGen.prototype.traversalTrie = function(node, seq, callback) {
		if (node <= 0) {
			return;
		}
		for (var i = 0; i < this.glen; i++) {
			seq.push(i);
			this.traversalTrie(~~this.trieNodes[node][i], seq, callback)
			seq.pop();
		}
		callback(node, seq);
	}

	CanonSeqGen.prototype.updateNext = function(seq) {
		var node = 1;
		for (var i = 0; i < seq.length; i++) {
			var next = ~~this.trieNodes[node][seq[i]];
			if (next == 0) {
				next = this.updateNext(seq.slice(1, i + 1));
				next = next > 0 ? ~next : next;
				this.trieNodes[node][seq[i]] = next;
			}
			if (next == -1) {
				return -1;
			} else if (next < 0) {
				next = ~next;
			}
			node = next;
		}
		return node;
	}

	CanonSeqGen.prototype.refillNext = function() {
		// clear next nodes
		this.traversalTrie(1, [], (node, seq) => {
			for (var i = 0; i < this.glen; i++) {
				var next = ~~this.trieNodes[node][i];
				if (next != -1 && next <= node) { // skip or to sub-trie
					this.trieNodes[node][i] = 0;
				}
			}
		});
		// calculate next nodes
		this.traversalTrie(1, [], (node, seq) => {
			for (var i = 0; i < this.glen; i++) {
				if ((i & 0x1f) == 0) {
					this.trieNodes[node][this.glen + (i >> 5)] = 0;
				}
				var next = ~~this.trieNodes[node][i];
				if (next != -1 && next <= node) { // skip or to sub-trie
					this.updateNext(seq.concat(i));
				}
				if (~~this.trieNodes[node][i] == -1) {
					this.trieNodes[node][this.glen + (i >> 5)] |= 1 << (i & 0x1f);
				}
			}
		});
	}

	CanonSeqGen.prototype.countSeq = function(depth, accuracy) {
		var ZERO = accuracy ? BigInt(0) : 0;
		var counts = accuracy ? [BigInt(0), BigInt(1)] : [0, 1];
		var ret = accuracy ? [BigInt(0), BigInt(1)] : [1];
		for (var d = 0; d < depth; d++) {
			var newCounts = [];
			var depthCnt = ZERO;
			for (var node = 1; node < this.trieNodes.length; node++) {
				var curCount = counts[node] || ZERO;
				if (curCount == 0) {
					continue;
				}
				for (var i = 0; i < this.glen; i++) {
					var next = ~~this.trieNodes[node][i];
					if (next != -1) {
						next = next < 0 ? ~next : next;
						newCounts[next] = (newCounts[next] || ZERO) + curCount;
						depthCnt += curCount;
					}
				}
			}
			counts = newCounts;
			ret.push(depthCnt);
		}
		return ret;
	}

	CanonSeqGen.prototype.countSeqMove = function(depth, moveTable, initState) {
		var counts = [];
		counts[initState * this.trieNodes.length + 1 - 1] = 1;
		var ret = [];
		for (var d = 0; d < depth; d++) {
			var newCounts = [];
			var depthCnts = [];
			var depthCnt = 0;
			for (var state = 0; state < moveTable[0].length; state++) {
				for (var node = 1; node < this.trieNodes.length; node++) {
					var curCount = counts[state * this.trieNodes.length + node - 1] || 0;
					if (curCount == 0) {
						continue;
					}
					for (var i = 0; i < this.glen; i++) {
						var next = ~~this.trieNodes[node][i];
						if (next != -1) {
							next = next < 0 ? ~next : next;
							var newState = moveTable[i][state];
							var idx = newState * this.trieNodes.length + next - 1;
							newCounts[idx] = (newCounts[idx] || 0) + curCount;
							depthCnts[newState] = (depthCnts[newState] || 0) + curCount;
							depthCnt += curCount;
						}
					}
				}
			}
			counts = newCounts;
			ret.push(depthCnts, depthCnt);
		}
		return ret;
	}

	CanonSeqGen.prototype.initTrie = function(depth) {
		this.trieNodes = [null];
		this.trieNodes.push([]);
		this.refillNext();
		var e = [];
		for (var i = 0; i < this.gens[0].length; i++) {
			e[i] = i;
		}
		var visited = new Map();
		for (var seqlen = 0; seqlen <= depth; seqlen++) {
			this.searchSkip(e, seqlen, [], 1, visited);
			this.refillNext();
		}
	}

	CanonSeqGen.prototype.searchSkip = function(perm, maxl, seq, node, visited) {
		if (maxl == 0) {
			var key = String.fromCharCode.apply(null, perm);
			if (visited.has(key)) {
				// console.log('find skip seq', seq, 'replaced by', visited.get(key));
				this.addSkipSeq(seq);
			} else {
				visited.set(key, seq.slice());
			}
			return;
		}
		for (var i = 0; i < this.glen; i++) {
			var next = this.trieNodes[node][i];
			if (next == -1) {
				continue;
			} else if (next < 0) {
				next = ~next;
			}
			var gen = this.gens[i];
			var permNew = permMult(gen, perm);
			seq.push(i);
			this.searchSkip(permNew, maxl - 1, seq, next, visited);
			seq.pop();
		}
	}

	/*
	CanonSeqGen.prototype.finalize = function() {
		var diff = [];
		for (var i = 1; i < this.trieNodes.length; i++) {
			diff[i] = [];
		}
		var changed = true;
		while (changed) {
			changed = false;
			for (var node1 = 1; node1 < this.trieNodes.length; node1++) {
				for (var node2 = 1; node2 < node1; node2++) {
					if (diff[node1][node2]) {
						continue;
					}
					for (var i = 0; i < this.glen; i++) {
						var next1 = ~~this.trieNodes[node1][i];
						var next2 = ~~this.trieNodes[node2][i];
						if (next1 == -1 && next2 == -1) {
							continue;
						}
						if ((next1 == -1) != (next2 == -1)) {
							diff[node1][node2] = true;
							changed = true;
							break;
						}
						next1 ^= next1 >> 31;
						next2 ^= next2 >> 31;
						if (next1 != next2 && diff[Math.max(next1, next2)][Math.min(next1, next2)]) {
							diff[node1][node2] = true;
							changed = true;
							break;
						}
					}
				}
			}
		}
		var nodeMap = [0];
		var idx = 1;
		for (var i = 1; i < this.trieNodes.length; i++) {
			nodeMap[i] = i;
			for (var j = 1; j < i; j++) {
				if (!diff[i][j]) {
					nodeMap[i] = nodeMap[j];
				}
			}
			if (nodeMap[i] == i) {
				nodeMap[i] = idx;
				idx++;
			}
		}
		for (var node = 1; node < this.trieNodes.length; node++) {
			for (var i = 0; i < this.glen; i++) {
				var next = ~~this.trieNodes[node][i];
				var old = next ^ (next >> 31);
				this.trieNodes[node][i] = nodeMap[old] ^ (next >> 31);
			}
		}
		for (var i = 1; i < this.trieNodes.length; i++) {
			this.trieNodes[nodeMap[i]] = this.trieNodes[i];
		}
		while (this.trieNodes.length > idx) {
			this.trieNodes.pop();
		}
		console.log(diff, nodeMap, idx);
	}
	*/

	function SubgroupSolver(genG, genH, genM) {
		//assert <genH>  <=  <genM>  <=  <genG>
		this.genG = genG;
		this.genH = genH;
		this.genM = genM;
		if (!genH) {
			var e = [];
			for (var i = 0; i < genG[0].length; i++) {
				e[i] = i;
			}
			this.genH = [e];
		}
	}

	SubgroupSolver.prototype.permHash = function(perm) {
		return String.fromCharCode.apply(null, perm);
	}

	SubgroupSolver.prototype.midCosetHash = function(perm) {
		return this.sgsM == null ? this.sgsG.isMember(permInv(perm), this.sgsMdepth) : this.permHash(this.sgsM.minElem(perm));
	}

	SubgroupSolver.prototype.initTables = function(maxCosetSize) {
		if (this.coset2idx) {
			return;
		}
		maxCosetSize = maxCosetSize || 100000;

		this.sgsH = new SchreierSims(this.genH);
		this.sgsG = new SchreierSims(this.sgsH);
		this.sgsG.extend(this.genG);
		var cosetSize = this.sgsG.size() / this.sgsH.size();
		this.isCosetSearch = this.sgsH.size() > 1;

		var midCosetSize = 1;
		if (this.genM) {
			this.sgsM = new SchreierSims(this.genM);
			midCosetSize = this.sgsG.size() / this.sgsM.size();
		} else if (this.sgsH.size() == 1) {
			this.sgsM = null;
			this.sgsMdepth = 0;
			for (var i = this.sgsG.e.length - 1; i >= 0; i--) {
				if (midCosetSize * this.sgsG.i2t[i].length > maxCosetSize) {
					break;
				}
				this.sgsMdepth = i;
				midCosetSize *= this.sgsG.i2t[i].length;
			}
		} else if (cosetSize <= maxCosetSize) { // subgroup <H>
			this.sgsM = new SchreierSims(this.genH);
			midCosetSize = cosetSize;
		} else { // trivial subgroup <G>
			this.sgsM = null;
			this.sgsMdepth = this.sgsG.e.length;
		}
		this.clen = midCosetSize;
		DEBUG && console.log('[Subgroup Solver] coset space:', cosetSize, 'mid coset size:', midCosetSize);

		this.genEx = [];
		this.genExi = [];
		this.genExMap = [];
		var genExSet = new Map();
		genExSet.set(this.permHash(this.sgsG.e), -1);
		for (var i = 0; i < this.genG.length; i++) {
			var perm = this.genG[i];
			var pow = 1;
			while (true) {
				var key = this.permHash(perm);
				if (genExSet.has(key)) {
					break;
				}
				genExSet.set(key, this.genEx.length);
				this.genEx.push(perm);
				this.genExi.push(permInv(perm));
				this.genExMap.push([i, pow]);
				perm = permMult(this.genG[i], perm);
				pow++;
			}
		}
		this.glen = this.genEx.length;
		for (var i = 0; i < this.glen; i++) {
			var genInv = permInv(this.genEx[i]);
			this.genExMap[i][2] = genExSet.get(this.permHash(genInv));
		}

		this.canon = new CanonSeqGen(this.genEx);
		this.canon.initTrie(2);
		this.canoni = new CanonSeqGen(this.genEx);
		for (var i = 0; i < this.canon.skipSeqs.length; i++) {
			var seq = this.canon.skipSeqs[i].slice();
			seq.reverse();
			for (var j = 0; j < seq.length; j++) {
				seq[j] = this.genExMap[seq[j]][2];
			}
			this.canoni.addSkipSeq(seq);
		}
		this.canoni.refillNext();

		// move table, {coset <=> representative} for G/M
		this.moveTable = [];
		this.idx2coset = [this.sgsG.e];
		this.coset2idx = {};
		this.coset2idx[this.midCosetHash(this.sgsG.e)] = 0;
		var sumPrun = 0;
		for (var i = 0; i < this.idx2coset.length; i++) {
			if (i >= midCosetSize) {
				console.log('ERROR!');
				break;
			}
			var perm = this.idx2coset[i];
			for (var j = 0; j < this.glen; j++) {
				if (this.genExMap[j][1] != 1) {
					continue;
				}
				var newp = permMult(this.genEx[j], perm);
				var key = this.midCosetHash(newp);
				if (!(key in this.coset2idx)) {
					this.coset2idx[key] = this.idx2coset.length;
					this.idx2coset.push(newp);
				}
				this.moveTable[i * this.glen + j] = this.coset2idx[key];
			}
		}
		var stdMove = null;
		for (var j = 0; j < this.glen; j++) {
			if (this.genExMap[j][1] == 1) {
				stdMove = j;
				continue;
			}
			for (var i = 0; i < this.clen; i++) {
				this.moveTable[i * this.glen + j] = this.moveTable[this.moveTable[i * this.glen + j - 1] * this.glen + stdMove];
			}
		}
		this.prunTable = this.initPrunTable(this.sgsG.e);
		DEBUG && console.log('[Subgroup Solver] prun table size:', this.prunTable[0].length);
	}

	SubgroupSolver.prototype.idaMidSearch = function(pidx, maxl, lm, trieNodes, moves, curPerm, insertPerm, prunTable, callback) {
		var nodePrun = prunTable[0][pidx];
		if (nodePrun > maxl) {
			return false;
		}
		if (maxl == 0) {
			if (pidx >= this.clen) {
				moves.push(-1);
				var newPerm = permMult(curPerm, insertPerm);
				var ret = callback(moves, newPerm);
				moves.pop();
				return ret;
			}
			return callback(moves, curPerm);
		}

		if (pidx >= this.clen && lm != 0) {
			var newpidx = prunTable[3][pidx - this.clen];
			moves.push(-1);
			var newPerm = permMult(curPerm, insertPerm);
			var ret = this.idaMidSearch(newpidx, maxl, 1, trieNodes, moves, newPerm, insertPerm, prunTable, callback);
			moves.pop();
			if (ret) {
				return ret;
			}
		}

		var node = trieNodes[lm || 1];
		var glenBase = pidx * ((this.glen + 31) >> 5);

		for (var mbase = 0; mbase < this.glen; mbase += 32) {
			var mask = node[this.glen + (mbase >> 5)];
			mask |= (nodePrun >= maxl - 1) ? prunTable[nodePrun - maxl + 2][glenBase + (mbase >> 5)] : 0;
			mask = ~mask & (this.glen - mbase >= 32 ? -1 : ((1 << this.glen - mbase) - 1));
			while (mask != 0) {
				var midx = 31 - Math.clz32(mask);
				mask -= 1 << midx;
				midx += mbase;

				var cidx = pidx % this.clen;
				var newpidx = this.moveTable[cidx * this.glen + midx] + pidx - cidx;
				if (DEBUG && prunTable[0][newpidx] >= maxl) {
					debugger;
				}
				var nextCanon = node[midx];
				moves.push(midx);
				var newPerm = permMult(curPerm, this.genExi[midx]);
				var ret = this.idaMidSearch(newpidx, maxl - 1, nextCanon ^ (nextCanon >> 31), trieNodes, moves, newPerm, insertPerm, prunTable, callback);
				moves.pop();
				if (ret) {
					return ret;
				}
			}
		}
		return false;
	}

	SubgroupSolver.prototype.initPrunTable = function(perm, tryNISS) {
		var pidx = this.coset2idx[this.midCosetHash(perm)];
		var prunTable = [];
		var fartherMask = [];
		var nocloserMask = [];
		var maskBase = (this.glen + 31) >> 5;
		for (var i = 0; i < this.clen; i++) {
			prunTable[i] = -1;
		}
		var permMove = [];
		if (tryNISS) {
			for (var i = 0; i < this.clen; i++) {
				prunTable.push(-1, -1);
				permMove[i] = this.coset2idx[this.midCosetHash(permMult(perm, this.idx2coset[i]))];
				permMove[permMove[i] + this.clen] = i;
			}
			prunTable[0] = 0;
		} else {
			prunTable[pidx] = 0;
		}
		var fill = 1;
		var lastfill = 0;
		var curDepth = 0;
		while (fill != lastfill) {
			lastfill = fill;
			for (var idx = 0; idx < prunTable.length; idx++) {
				if (prunTable[idx] != curDepth) {
					continue;
				}
				var cidx = idx % this.clen;
				var midx = idx - cidx; // 0 - normal, 1 - after perm inserted, 2 - after permi inserted
				for (var m = 0; m < this.glen; m++) {
					var newIdx = this.moveTable[cidx * this.glen + m] + midx;
					var newPrun = prunTable[newIdx];
					if (prunTable[newIdx] == -1) {
						prunTable[newIdx] = curDepth + 1;
						newPrun = curDepth + 1;
						fill++;
					}
					if (newPrun > curDepth) {
						fartherMask[idx * maskBase + (m >> 5)] |= 1 << (m & 0x1f);
					}
					if (newPrun >= curDepth) {
						nocloserMask[idx * maskBase + (m >> 5)] |= 1 << (m & 0x1f);
					}
				}
				if (!tryNISS || midx != 0) {
					continue;
				}
				// insert perm/permi
				for (var m = 0; m < 2; m++) {
					var newIdx = permMove[cidx + (1 - m) * this.clen] + (m + 1) * this.clen;
					if (prunTable[newIdx] == -1) {
						prunTable[newIdx] = curDepth;
						fill++;
					}
				}
			}
			curDepth++;
		}
		return [prunTable, fartherMask, nocloserMask, permMove, curDepth];
	}

	// 0 - normal, 1 - solved, 2 - unsolvable
	SubgroupSolver.prototype.checkPerm = function(perm) {
		this.initTables();
		if (this.sgsH.isMember(perm) >= 0) {
			return 1;
		} else if (this.sgsG.isMember(perm) < 0) {
			return 2;
		} else {
			return 0;
		}
	}

	SubgroupSolver.ONLY_IDA = 0x1;
	SubgroupSolver.ALLOW_PRE = 0x2;

	SubgroupSolver.prototype.DissectionSolve = function(perm, minl, maxl, permCtx, solCallback) {
		permCtx = permCtx || {};
		var tt = $.now();
		this.initTables();
		DEBUG && console.log('[Subgroup Solver] finished init tables, tt=', $.now() - tt);
		if (this.sgsG.isMember(perm) < 0) {
			console.log('[Subgroup Solver] NOT A MEMBER OF G');
			return;
		}
		var pidx = this.coset2idx[this.midCosetHash(perm)];
		if (!pidx && pidx !== 0) {
			console.log('[Subgroup Solver] ERROR!');
			return;
		}
		var onlyIDA = (permCtx.mask & SubgroupSolver.ONLY_IDA) != 0;
		var tryNISS = (permCtx.mask & SubgroupSolver.ALLOW_PRE) != 0 && this.isCosetSearch;
		var ret = null;
		var prunTable1 = this.prunTable;
		var prunTable2 = null;
		if (tryNISS) {
			permCtx.prunTable = permCtx.prunTable || this.initPrunTable(perm, tryNISS);
			prunTable2 = permCtx.prunTable;
			prunTable1 = prunTable2;
			pidx = this.clen;
		}
		DEBUG && console.log('[Subgroup Solver] finish init searching, prun value:', prunTable1[0][pidx], 'tt=', $.now() - tt);
		for (var depth = Math.max(minl, prunTable1[0][pidx]); depth <= maxl; depth++) {
			var s1tot = 0;
			var s2tot = 0;
			var permi = permInv(perm);
			if (onlyIDA || depth <= this.prunTable[4]) {
				ret = this.idaMidSearch(tryNISS ? this.clen : pidx, depth,
						1, this.canon.trieNodes, [],
						this.sgsG.toKeyIdx(tryNISS ? null : permi), permi, prunTable1,
						(moves, permKey) => {
					s1tot++;
					if (this.sgsG.isSubgroupMemberByKey(permKey, this.sgsH) < 0) {
						return;
					}
					var solution = [];
					for (var i = 0; i < moves.length; i++) {
						solution.push(moves[i] == -1 ? -1 : this.genExMap[moves[i]].slice(0, 2));
					}
					return solCallback ? solCallback(solution) : solution;
				});
				DEBUG && console.log('[Subgroup Solver] ida ', s1tot + s2tot, 'node(s) checked at', depth, 'tt=', $.now() - tt);
				if (ret) {
					return ret;
				}
				continue;
			}
			var mid = ~~(depth / 2);
			if (!prunTable2) {
				prunTable2 = this.initPrunTable(perm, tryNISS);
			}
			var preSize = tryNISS ? 2 : 1;
			var mpcnt = 0;
			var mpsizes = [];
			for (var mpidx = 0; mpidx < this.clen * preSize; mpidx++) {
				//pidx at mid == mpidx
				var mpidx1 = mpidx;
				var mpidx2 = mpidx + (tryNISS ? (mpidx >= this.clen ? -this.clen : this.clen * 2) : 0);
				if (prunTable1[0][mpidx1] > mid || prunTable2[0][mpidx2] > depth - mid) {
					continue;
				}
				mpcnt++;

				// search from mpidx to 0
				var visited = new Map();
				var size1 = 0;
				var size2 = 0;
				var perm0 = this.isCosetSearch ? this.sgsG.e : this.sgsG.toKeyIdx();
				this.idaMidSearch(mpidx1, mid,
						0, this.canon.trieNodes, [],
						perm0, permi, prunTable1,
						(moves, permKey) => {
					var key;
					if (this.isCosetSearch) {
						var permRep = this.sgsH.minElem(permKey);
						key = this.permHash(permRep);
					} else {
						key = this.permHash(permKey);
					}
					size1++;
					var sols1h = visited.get(key) || [];
					sols1h.push(moves.slice());
					visited.set(key, sols1h);
				});

				//search from mpidx to pidx
				ret = this.idaMidSearch(mpidx2, depth - mid,
						1, this.canoni.trieNodes, [],
						perm0, perm, prunTable2,
						(moves, permKey) => {
					// mp * move2 = perm, mp * move1 = I  =>  perm * move2' * move1 = I  =>  move1 = move2 * perm'
					var finalPermKey = tryNISS ? permKey : permMult(permKey, perm);
					var key;
					if (this.isCosetSearch) {
						var permRep = this.sgsH.minElem(finalPermKey);
						key = this.permHash(permRep);
					} else {
						key = this.permHash(finalPermKey);
					}

					size2++;
					if (visited.has(key)) {
						var sols2h = [];
						var node = 1;
						for (var i = 0; i < moves.length; i++) {
							var move = moves[moves.length - 1 - i];
							move = move == -1 ? -1 : this.genExMap[move][2];
							node = move == -1 ? 1 : this.canon.trieNodes[node][move];
							if (DEBUG && node == -1) {
								debugger;
							}
							node ^= node >> 31;
							sols2h.push(move == -1 ? -1 : this.genExMap[move].slice(0, 2));
						}
						var sols1h = visited.get(key);
						for (var i = 0; i < sols1h.length; i++) {
							var solution = sols2h.slice();
							var node2 = node;
							for (var j = 0; j < sols1h[i].length; j++) {
								var move = sols1h[i][j];
								node2 = move == -1 ? 1 : this.canon.trieNodes[node2][move];
								if (node2 == -1) {
									break;
								}
								node2 ^= node2 >> 31;
								solution.push(move == -1 ? -1 : this.genExMap[move].slice(0, 2));
							}
							if (node2 == -1) {
								continue;
							}
							var chk = solCallback ? solCallback(solution) : solution;
							if (chk) {
								return chk;
							}
						}
					}
				});
				mpsizes.push([mpidx, size1, size2]);
				s1tot += size1;
				s2tot += size2;
				if (ret) {
					break;
				}
			}
			DEBUG && console.log('[Subgroup Solver] dis ', s1tot + s2tot, 'node(s) checked at', depth, 'tt=', $.now() - tt);
			if (ret) {
				break;
			}
		}
		return ret;
	}

	SubgroupSolver.prototype.godsAlgo = function(depth) {
		this.initTables();
		var stateCnt = 0;
		for (var i = 0; i < this.clen; i++) {
			var perm = this.idx2coset[i];
			var visited = new Set();
			for (var maxl = 0; maxl <= depth; maxl++) {
				var perm0 = this.isCosetSearch ? this.sgsG.e : this.sgsG.toKeyIdx();
				this.idaMidSearch(i, maxl,
						1, this.canon.trieNodes, [],
						perm0, null, this.prunTable,
						(moves, permKey) => {
					var key;
					if (this.isCosetSearch) {
						var permRep = this.sgsH.minElem(permKey);
						key = this.permHash(permRep);
					} else {
						key = this.permHash(permKey);
					}
					if (!visited.has(key)) {
						stateCnt++;
						visited.add(key);
					}
				});
			}
		}
		return stateCnt;
	}

	return {
		permMult: permMult,
		permInv: permInv,
		permCmp: permCmp,
		CanonSeqGen: CanonSeqGen,
		SchreierSims: SchreierSims,
		SubgroupSolver: SubgroupSolver
	}
})(mathlib.rn);

/* ==== lib/poly3dlib.js ==== */
var poly3d = (function() {
	var EPS = 1e-6;

	function Point(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	var _ = Point.prototype;

	_.abs = function(p) {
		return p ? Math.hypot(this.x - p.x, this.y - p.y, this.z - p.z) : Math.hypot(this.x, this.y, this.z);
	}

	_.add = function(p, scalar) {
		if (scalar === undefined) {
			scalar = 1;
		}
		return new Point(this.x + p.x * scalar, this.y + p.y * scalar, this.z + p.z * scalar);
	}

	_.scalar = function(w) {
		return new Point(this.x * w, this.y * w, this.z * w);
	}

	_.normalized = function() {
		var abs = Math.hypot(this.x, this.y, this.z);
		return abs < EPS ? new Point(1, 0, 0) : new Point(this.x / abs, this.y / abs, this.z / abs);
	}

	_.inprod = function(p) {
		return this.x * p.x + this.y * p.y + this.z * p.z;
	}

	_.outprod = function(p) {
		return new Point(
			this.y * p.z - this.z * p.y,
			this.z * p.x - this.x * p.z,
			this.x * p.y - this.y * p.x
		);
	}

	_.triangleArea = function(p1, p2) {
		var v10x = p1.x - this.x;
		var v10y = p1.y - this.y;
		var v10z = p1.z - this.z;
		var v20x = p2.x - this.x;
		var v20y = p2.y - this.y;
		var v20z = p2.z - this.z;
		return Math.hypot(
			v10y * v20z - v10z * v20y,
			v10z * v20x - v10x * v20z,
			v10x * v20y - v10y * v20x
		) / 2;
	}

	function RotTrans(norm, theta) {
		var c = Math.cos(theta),
			s = Math.sin(theta),
			t = 1 - c,
			x = norm.x,
			y = norm.y,
			z = norm.z,
			tx = t * x,
			ty = t * y;
		this.mat = [
			tx * x + c, tx * y - s * z, tx * z + s * y,
			tx * y + s * z, ty * y + c, ty * z - s * x,
			tx * z - s * y, ty * z + s * x, t * z * z + c
		];
	}

	_ = RotTrans.prototype;

	_.perform = function(p) {
		var mat = this.mat;
		return new Point(
			mat[0] * p.x + mat[1] * p.y + mat[2] * p.z,
			mat[3] * p.x + mat[4] * p.y + mat[5] * p.z,
			mat[6] * p.x + mat[7] * p.y + mat[8] * p.z
		);
	}

	// {(x, y, z) | x * norm.x + y * norm.y + z * norm.z = dis}
	function Plane(norm, dis) {
		this.norm = norm;
		this.dis = typeof(dis) == 'number' ? dis : 1;
	}

	Plane.prototype.side = function(point) {
		return this.norm.inprod(point) - this.dis;
	}

	function Sphere(ct, radius, norm) {
		this.ct = ct;
		this.radius = radius;
		if (norm) {
			this.norm = norm;
		}
	}

	Sphere.prototype.side = function(point) { // when radius > 0, >0: outside, <0: inside
		return (this.ct.abs(point) - Math.abs(this.radius)) * (this.radius > 0 ? 1 : -1);
	}

	function Segment(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	_ = Segment.prototype;

	_.getMid = function() {
		return this.p1.add(this.p2).scalar(0.5);;
	}

	_.genMids = function() {
		return [];
	}

	_.slice = function(p1, p2) {
		return new Segment(p1, p2);
	}

	_.revert = function() {
		return new Segment(this.p2, this.p1);
	}

	_.rankKey = function(p) {
		return this.p2.add(this.p1, -1).inprod(p);
	}

	_.intersect = function(obj) {
		var ret = [];
		if (obj instanceof Plane) {
			var prod1 = this.p1.inprod(obj.norm) - obj.dis;
			var prod2 = this.p2.inprod(obj.norm) - obj.dis;
			if (Math.abs(prod1 - prod2) < EPS) {
				return [];
			}
			var lambda = -prod1 / (prod2 - prod1);
			if (Math.abs(lambda) < EPS || Math.abs(lambda - 1) < EPS) {
				ret.push(Math.abs(lambda) < EPS ? this.p1 : this.p2);
			} else if (lambda > 0 && lambda < 1) {
				ret.push(this.p1.scalar(1 - lambda).add(this.p2, lambda));
			}
		} else if (obj instanceof Sphere) {
			// p = (1 - lambda) * p1 + lambda * p2, ||p - ct||^2 = radius^2
			// ||p1 - ct + lambda * (p2 - p1) ||^2 = radius^2
			// ||p2 - p1||^2 lambda^2 + 2 * <p2 - p1, p1 - ct> lambda + ||p1 - ct||^2 - radius^2 = 0
			var a = Math.pow(this.p1.abs(this.p2), 2);
			var b = this.p2.add(this.p1, -1).inprod(this.p1.add(obj.ct, -1)) * 2;
			var c = Math.pow(this.p1.abs(obj.ct), 2) - Math.pow(obj.radius, 2);
			var delta = b * b - 4 * a * c;
			if (delta <= 0) { // tangency or not intersected
				return [];
			}
			for (var sign = -1; sign < 2; sign += 2) {
				var lambda = (-b + sign * Math.sqrt(delta)) / (2 * a)
				if (Math.abs(lambda) < EPS || Math.abs(lambda - 1) < EPS) {
					ret.push(Math.abs(lambda) < EPS ? this.p1 : this.p2);
				} else if (lambda > 0 && lambda < 1) {
					ret.push(this.p1.scalar(1 - lambda).add(this.p2, lambda));
				}
			}
		}
		return ret;
	}

	function Arc(p1, p2, ct, norm) {
		this.p1 = p1;
		this.p2 = p2;
		this.ct = ct;
		this.norm = norm;
		this._fu = this.p1.add(this.ct, -1).normalized();
		this._fv = this.norm.outprod(this._fu);
		this._radius = this.ct.abs(p1);
		var ctp2 = this.p2.add(this.ct, -1);
		this._ang = (Math.atan2(this._fv.inprod(ctp2), this._fu.inprod(ctp2)) + Math.PI * 2 + EPS) % (Math.PI * 2) - EPS;
	}

	_ = Arc.prototype;

	_.getMid = function() {
		return this.ct.add(this._fu, Math.cos(this._ang / 2) * this._radius).add(this._fv, Math.sin(this._ang / 2) * this._radius);
	}

	_.genMids = function() {
		var nSegs = Math.ceil(this._ang / Math.PI * 180 / 10);
		var mids = [];
		for (var i = 0; i < nSegs - 1; i++) {
			var theta = this._ang / nSegs * (i + 1);
			mids.push(this.ct.add(this._fu, Math.cos(theta) * this._radius).add(this._fv, Math.sin(theta) * this._radius));
		}
		return mids;
	}

	_.slice = function(p1, p2) {
		return new Arc(p1, p2, this.ct, this.norm);
	}

	_.revert = function() {
		return new Arc(this.p2, this.p1, this.ct, this.norm.scalar(-1));
	}

	_.rankKey = function(p) {
		var vec1 = p.add(this.ct, -1);
		return Math.atan2(this._fv.inprod(vec1), this._fu.inprod(vec1));
	}

	_.intersect = function(obj) {
		var a, b, c;
		// p = ct + radius * (fu * cos(t) + fv * sin(t)), 0 <= t <= atan2(<p2 - ct , fv>, <p2 - ct, fu>);
		if (obj instanceof Plane) {
			// <p, norm> = dis => radius * <fu, norm> * cos(t) + radius * <fv, norm> * sin(t) = dis - <ct, norm>
			// t = +- acos(a / c) - phi
			a = this._radius * obj.norm.inprod(this._fv);
			b = this._radius * obj.norm.inprod(this._fu);
			c = obj.dis - obj.norm.inprod(this.ct);
		} else if (obj instanceof Sphere) {
			// ||p - ct2|| = radius2 => ||ct - ct2 + radius * (fu * cos(t) + fv * sin(t))|| = radius2
			// => ||ct - ct2||^2 + radius ^ 2 + 2 * <ct - ct2, radius * (fu * cos(t) + fv * sin(t))> = radius2^2
			// => <ct - ct2, radius * (fu * cos(t) + fv * sin(t))> = (radius2 ^ 2 - radius ^ 2 - ||ct - ct2||^2) / 2;
			var vec1 = this.ct.add(obj.ct, -1);
			a = this._radius * vec1.inprod(this._fv);
			b = this._radius * vec1.inprod(this._fu);
			c = ((obj.radius + this._radius) * (obj.radius - this._radius) - Math.pow(this.ct.abs(obj.ct), 2)) / 2;
		}
		// console.log(a, b, c, this, obj);
		//solve: b cos(t) + a sin(t) = c => sqrt(a*a+b*b) cos(t + phi) = c, phi = atan2(-a, b)
		var phi = Math.atan2(-a, b);
		var cos_t = c / Math.hypot(a, b);
		if (Math.abs(cos_t) >= 1) { // tangency or not intersected
			return [];
		}
		var ret = [];
		var t0 = Math.acos(cos_t);
		for (var sign = -1; sign < 2; sign += 2) {
			var t = (sign * t0 - phi + Math.PI * 4 + EPS) % (Math.PI * 2) - EPS;
			if (t > -EPS && t < this._ang + EPS) {
				ret.push(t);
			}
		}
		ret.sort(function(a, b) { return a - b; });
		for (var i = 0; i < ret.length; i++) {
			if (Math.abs(ret[i]) < EPS || Math.abs(ret[i] - this._ang) < EPS) {
				ret[i] = Math.abs(ret[i]) < EPS ? this.p1 : this.p2;
			} else {
				ret[i] = this.ct.add(this._fu, Math.cos(ret[i]) * this._radius).add(this._fv, Math.sin(ret[i]) * this._radius);
			}
		}
		for (var i = 0; i < ret.length; i++) {
			if (Math.abs(obj.side(ret[i])) > EPS) {
				debugger;
			}
			if (Math.abs(this.ct.abs(ret[i]) - this._radius) > EPS) {
				debugger;
			}
			if (Math.abs(this.norm.inprod(this.ct) - this.norm.inprod(ret[i])) > EPS) {
				debugger;
			}
		}
		// console.log(ret, this._radius);
		return ret;
	}

	// assert points.length >= 3, assume paths[i].p2 = paths[i + ].p1
	function Polygon(paths) {
		this.paths = paths.slice();
		var norm;
		for (var i = 0; i < paths.length; i++) {
			if (paths[i].ct) {
				norm = paths[i].norm;
				break;
			}
			var candNorm = paths[0].p2.add(paths[0].p1, -1).outprod(paths[1].p2.add(paths[1].p1, -1));
			if (candNorm.abs() > EPS * 10) {
				norm = candNorm.normalized();
				break;
			}
		}
		this.area = 0;
		if (!norm) {
			return;
		}
		var center = new Point(0, 0, 0);
		for (var i = 1; i < paths.length - 1; i++) {
			var area = paths[i].p1.add(paths[0].p1, -1).outprod(paths[i].p2.add(paths[i].p1, -1)).inprod(norm) / 2;
			center = center.add(paths[0].p1, area / 3);
			center = center.add(paths[i].p1, area / 3);
			center = center.add(paths[i].p2, area / 3);
			this.area += area;
		}
		for (var i = 0; i < paths.length; i++) {
			if (!paths[i].ct) {
				continue;
			}
			var arc = paths[i];
			var theta = arc._ang / 2;
			var h = 4 * arc._radius * Math.pow(Math.sin(arc._ang / 2), 3) / 3 / (arc._ang - Math.sin(arc._ang));
			area = Math.pow(arc._radius, 2) * (arc._ang - Math.sin(arc._ang)) / 2 * arc.norm.inprod(norm);
			var centroid = arc.ct.add(arc.norm.outprod(arc.p2.add(arc.p1, -1)).normalized(), -h);
			center = center.add(centroid, area);
			this.area += area;
		}
		this.center = center.scalar(1 / this.area);
		this.norm = this.area > 0 ? norm : norm.scalar(-1);
		this.area = Math.abs(this.area);
		this.dis = this.norm.inprod(paths[0].p1);
	}

	_ = Polygon.prototype;

	Polygon.fromVertices = function(vertices) {
		var paths = [];
		for (var i = 0; i < vertices.length; i++) {
			paths.push(new Segment(vertices[i], vertices[(i + 1) % vertices.length]));
		}
		return new Polygon(paths);
	}

	_.projection = function(norms) {
		var ret = [];
		for (var i = 0; i < this.paths.length; i++) {
			var points = [this.paths[i].p1].concat(this.paths[i].genMids());
			for (var k = 0; k < points.length; k++) {
				var coord = [];
				for (var j = 0; j < norms.length; j++) {
					coord.push(points[k].inprod(norms[j]));
				}
				ret.push(coord);
			}
		}
		return ret;
	}

	_.split = function(obj) {
		// calculate all intersects
		var paths = [[], []];
		var nCuts = 0;
		var refSide = obj.side(this.center) < 0 ? 1 : 0; // 0 outside, 1 inside
		for (var i = 0; i < this.paths.length; i++) {
			var path = this.paths[i];
			var points = path.intersect(obj);
			nCuts += points.length;
			var start = path.p1;
			for (var j = 0; j < points.length; j++) {
				if (start.abs(points[j]) > EPS) {
					var newPath = path.slice(start, points[j]);
					paths[obj.side(newPath.getMid()) < 0 ? 1 : 0].push(newPath);
					start = points[j];
				}
			}
			if (start.abs(path.p2) > EPS) {
				var remainPath = start == path.p1 ? path : path.slice(start, path.p2);
				var sideFloat = obj.side(remainPath.getMid());
				paths[Math.abs(sideFloat) < EPS ? refSide : sideFloat < 0 ? 1 : 0].push(remainPath);
			}
		}

		var cutBound;
		if (obj instanceof Plane) {
			if (nCuts == 0) {
				return paths[0].length == 0 ? [[], [this]] : [[this], []];
			}
			cutBound = new Segment(new Point(0, 0, 0), obj.norm.outprod(this.norm));
		} else if (obj instanceof Sphere) {
			var ct = obj.ct.add(this.norm, -this.norm.inprod(obj.ct) + this.dis);
			var radius = Math.pow(obj.radius, 2) - Math.pow(this.dis - this.norm.inprod(obj.ct), 2);
			if (radius <= 0) {
				return paths[0].length == 0 ? [[], [this]] : [[this], []];
			}
			radius = Math.sqrt(radius);
			var p1 = this.paths[1].p1.add(this.paths[0].p1, -1).normalized().scalar(radius).add(ct);
			cutBound = new Arc(p1, p1, ct, this.norm.scalar(obj.radius > 0 ? -1 : 1));
		}

		var polys = [[], []];
		// DEBUG && console.log('cut bound=', JSON.stringify(cutBound));

		for (var side = 0; side < 2; side++) {
			// mark all near-bound points
			var sign = side * 2 - 1;
			var pathStart = [];
			var pathsSide = paths[side];
			for (var i = 0, len = pathsSide.length; i < len; i++) {
				var nextIdx = (i + 1) % len;
				if (pathsSide[i].p2.abs(pathsSide[nextIdx].p1) > EPS) {
					pathStart.push([nextIdx, cutBound.rankKey(pathsSide[nextIdx].p1), pathsSide[nextIdx].p1]);
				}
			}
			pathStart.sort((a, b) => a[1] - b[1]);
			// DEBUG && console.log('sort result', JSON.stringify(pathStart));
			var usedCnt = 0;
			var used = [];
			// DEBUG && console.log('handle side', side, 'pathsSide.length=', pathsSide.length, JSON.stringify(pathsSide));
			while (usedCnt < pathsSide.length) {
				var curPaths = [];
				var idx = 0;
				while (used[idx]) {
					idx++;
				}
				// DEBUG && console.log('handle side', side, 'start idx=', idx);
				while (true) {
					var path = pathsSide[idx];
					curPaths.push(path);
					used[idx] = 1;
					usedCnt++;
					// DEBUG && console.log('path add', JSON.stringify(path), 'used=', JSON.stringify(used), 'usedCnt=', usedCnt, curPaths.length);
					if (path.p2.abs(curPaths[0].p1) < EPS) { // close path
						break;
					}
					idx = (idx + 1) % len;
					if (path.p2.abs(pathsSide[idx].p1) < EPS) {
						continue;
					}
					var key = cutBound.rankKey(path.p2);
					var next = 0;
					for (var i = 0; i < pathStart.length; i++) {
						if (pathStart[i][1] > key) {
							next = i;
							break;
						}
					}
					idx = pathStart[next][0];
					pathStart.splice(next, 1);
					curPaths.push(cutBound.slice(path.p2, pathsSide[idx].p1));
					// DEBUG && console.log('path addcut', JSON.stringify(cutBound.slice(path.p2, pathsSide[idx].p1)), 'remain start=', pathStart, curPaths.length);
					if (pathsSide[idx].p1.abs(curPaths[0].p1) < EPS) { // close path
						break;
					}
				}
				// DEBUG && console.log('close path=', JSON.stringify(curPaths));
				var poly = new Polygon(curPaths);
				if (poly.area > EPS) {
					polys[side].push(poly);
				} else {
					console.log('invalid path length', curPaths, poly);
				}
			}
			cutBound = cutBound.revert();
		}
		return polys;
	}

	_.trim = function(gap) {
		var toCutPlanes = [];
		var _point = this.paths.at(-1).p1;
		var poly = this;
		for (var i = 0; i < this.paths.length; i++) { // check paths[i]
			var path = this.paths[i];
			if (path instanceof Arc) {
				var radius = (this.norm.inprod(path.norm) > 0 ? 1 : -1) * path._radius; 
				poly = poly.split(new Sphere(path.ct, radius - gap / 2))[1][0];
			} else {
				var norm = path.p2.add(path.p1, -1).outprod(this.norm).normalized();
				var dis = norm.inprod(path.p2);
				poly = poly.split(new Plane(norm, dis - gap / 2))[1][0];
			}
			if (!poly) {
				return null;
			}
		}
		return poly;
	}

	// facePlanes = [plane1, plane2, ..., planeN]
	function PolyhedronPuzzle(facePlanes, faceVs, faceNames) {
		this.facePlanes = facePlanes.slice();
		this.faceNames = faceNames.slice();
		this.faceUVs = [];
		for (var i = 0; i < facePlanes.length; i++) {
			var faceNorm = facePlanes[i].norm;
			var faceV = faceVs[i];
			faceV = faceV.add(faceNorm, -faceV.inprod(faceNorm)).normalized();
			var faceU = faceV.outprod(faceNorm);
			this.faceUVs[i] = [faceU, faceV];
		}
		this.makeFacePolygons();
	}

	_ = PolyhedronPuzzle.prototype;

	// twistyPlanes = [plane1, plane2, ..., planeN]
	// twistyDetails = [[name1, maxPow1, planeIdx1_1, planeIdx1_2, ...], [name2, maxPow2, planeIdx2_1, ...], ...]
	_.setTwisty = function(twistyPlanes, twistyDetails) {
		this.twistyPlanes = twistyPlanes.slice();
		this.twistyDetails = twistyDetails.slice();
		this._twistyCache = {};
		for (var i = 0; i < twistyDetails.length; i++) {
			if (this.twistyDetails[i].length == 2) {
				this.twistyDetails[i].push(i);
			}
		}
		this.cutFacePolygons();
		this.makeMoveTable();
	}

	_.getTwistyIdx = function(laxis) {
		if (laxis in this._twistyCache) {
			return this._twistyCache[laxis];
		}
		var m = /^(\d*)([A-Z][A-Za-z]*)$/.exec(laxis);
		if (!m) {
			return -1;
		}
		var layerRe = new RegExp(m[1] + "(?=[A-Z])");
		var axis = m[2].split(/(?=[A-Z])/g);
		var faceSet = {};
		var faceCnt = 0;
		for (var i = 0; i < axis.length; i++) {
			if (faceSet[axis[i]] == undefined) {
				faceSet[axis[i]] = new RegExp(axis[i] + "(?=[A-Z]|$)");
				faceCnt++;
			}
		}
		var minRemain = [99, -1];
		var minIdx = -1;
		for (var i = 0; i < this.twistyDetails.length; i++) {
			var chkAxis = this.twistyDetails[i][0];
			if (!layerRe.exec(chkAxis)) {
				continue;
			}
			var remain = chkAxis.length - m[1].length;
			for (var face in faceSet) {
				if (faceSet[face].exec(chkAxis)) {
					remain -= face.length;
				} else {
					remain = 99;
					break;
				}
			}
			if (remain < minRemain[0]) {
				minRemain = [remain, i];
			}
		}
		this._twistyCache[laxis] = faceCnt == 1 && minRemain[0] != 0 ? -1 : minRemain[1];
		return this._twistyCache[laxis];
	}

	_.makeFacePolygons = function() {
		this.facesPolys = [];
		for (var face = 0; face < this.facePlanes.length; face++) {
			var norm = this.facePlanes[face].norm;
			var dis = this.facePlanes[face].dis;
			var faceCenter = norm.scalar(dis);
			var faceUV = this.faceUVs[face];
			var poly = Polygon.fromVertices([
				faceCenter.add(faceUV[0], 100),
				faceCenter.add(faceUV[1], 100),
				faceCenter.add(faceUV[0], -100),
				faceCenter.add(faceUV[1], -100)
			]);
			for (var fother = 0; fother < this.facePlanes.length; fother++) {
				if (fother == face) {
					continue;
				}
				poly = poly.split(this.facePlanes[fother])[1][0];
				if (!poly) { // all area in the plane is cut out, input is incorrect
					debugger
					break;
				}
			}
			this.facesPolys[face] = [poly];
		}
	}

	_.cutFacePolygons = function() {
		var cuts = this.twistyPlanes.slice();
		cuts.sort(function(a, b) { return (a.ct ? 1 : 0) - (b.ct ? 1 : 0); });
		// TODO we are not able to handle holes, so cut plane first
		for (var i = 0; i < cuts.length; i++) {
			var plane = cuts[i];
			this.enumFacesPolys((face, p, poly) => {
				var polys = poly.split(plane);
				polys = Array.prototype.concat.apply([], polys);
				this.facesPolys[face][p] = polys[0];
				for (var j = 1; j < polys.length; j++) {
					this.facesPolys[face].push(polys[j]);
				}
			});
		}
	}

	_.enumFacesPolys = function(callback) {
		var idx = 0;
		for (var face = 0; face < this.facesPolys.length; face++) {
			var facePolys = this.facesPolys[face];
			var polyLen = facePolys.length;
			for (var p = 0; p < polyLen; p++) {
				if (callback(face, p, facePolys[p], idx)) {
					return;
				}
				idx++;
			}
		}
	}

	_.makeMoveTable = function() {
		this.moveTable = [];
		var proj1d = [];
		var projNorm = new Point(1, 2, 3).normalized();
		this.enumFacesPolys((face, p, poly, idx) => {
			proj1d[idx] = [idx, projNorm.inprod(poly.center), poly.center];
		});
		proj1d.sort(function(a, b) { return a[1] - b[1]; });
		for (var i = 0; i < this.twistyDetails.length; i++) {
			var curMove = [];
			var planes = [];
			for (var j = 2; j < this.twistyDetails[i].length; j++) {
				planes.push(this.twistyPlanes[this.twistyDetails[i][j]]);
			}
			var trans = new RotTrans(planes[0].norm, Math.PI * 2 / this.twistyDetails[i][1]);
			this.enumFacesPolys((face, p, poly, idx) => {
				for (var j = 0; j < planes.length; j++) {
					if (planes[j].side(poly.center) < 0) {
						curMove[idx] = -1; // not affect by this twisty
						return;
					}
				}
				var movedCenter = trans.perform(poly.center);
				var movedProj = projNorm.inprod(movedCenter);
				var left = 0, right = proj1d.length - 1;
				while (right > left) {
					var mid = (right + left) >> 1;
					var midval = proj1d[mid][1];
					if (midval < movedProj - EPS) {
						left = mid + 1;
					} else {
						right = mid;
					}
				}
				for (var j = left; j < proj1d.length; j++) {
					if (proj1d[j][1] > movedProj + EPS) {
						debugger; // no moves found
					}
					if (movedCenter.abs(proj1d[j][2]) < EPS) {
						curMove[idx] = proj1d[j][0];
						break;
					}
				}
			});
			this.moveTable.push(curMove);
		}
	}

	function makePuzzle(nface, faceCuts, edgeCuts, cornCuts, faceMoves, edgeMoves, cornMoves) {
		var faceNorms = [];
		var faceVs = [];
		var faceNames = [];
		var facePow = 3;
		var edgePow = 2;
		var cornPow = 3;
		if (nface == 4) { // tetrahedron
			faceNorms = [
				new Point(0, -1, 0),
				new Point(-Math.sqrt(6) / 3, 1 / 3, -Math.sqrt(2) / 3),
				new Point(Math.sqrt(6) / 3, 1 / 3, -Math.sqrt(2) / 3),
				new Point(0, 1 / 3, Math.sqrt(8) / 3)
			];
			faceVs = [3, 2, 1, new Point(0, 1, 0)];
			faceNames = ["D", "L", "R", "F"];
		} else if (nface == 6) { // cube
			faceNorms = [
				new Point(0, 1, 0),
				new Point(1, 0, 0),
				new Point(0, 0, 1)
			];
			faceVs = [5, 0, 0, 2, 0, 0];
			faceNames = ["U", "R", "F", "D", "L", "B"];
			facePow = 4;
		} else if (nface == 8) { // octahedron
			faceNorms = [
				new Point(0, 1, 0),
				new Point(Math.sqrt(6) / 3, 1 / 3, Math.sqrt(2) / 3),
				new Point(-Math.sqrt(6) / 3, 1 / 3, Math.sqrt(2) / 3),
				new Point(0, -1 / 3, Math.sqrt(8) / 3)
			];
			var UBEdge = faceNorms[0].add(faceNorms[3], -1);
			faceVs = [7, UBEdge, UBEdge, 0, 7, UBEdge, UBEdge, 0];
			faceNames = ["U", "R", "L", "F", "D", "Bl", "Br", "B"];
			cornPow = 4;
		} else if (nface == 12) { // dodecahedron
			faceNorms = [
				new Point(0, Math.sqrt(5), 0)
			];
			for (var i = 0; i < 5; i++) {
				faceNorms.push(new Point(2 * Math.sin(0.4 * i * Math.PI), 1, 2 * Math.cos(0.4 * i * Math.PI)));
			}
			faceVs = [7, 0, 3, 7, 7, 4, 7, 0, 3, 7, 7, 4];
			faceNames = ["U", "F", "R", "Br", "Bl", "L", "D", "B", "Dbl", "Dl", "Dr", "Dbr"];
			facePow = 5;
		} else if (nface == 20) { // icosahedron
			for (var i = 0; i < 5; i++) {
				var r1 = Math.sqrt(5) + 1;
				var r2 = Math.sqrt(5) + 3;
				faceNorms.push(new Point(r1 * Math.sin(0.4 * i * Math.PI), Math.sqrt(5) + 2, r1 * Math.cos(0.4 * i * Math.PI)));
				faceNorms.push(new Point(r2 * Math.sin(0.4 * i * Math.PI), 1, r2 * Math.cos(0.4 * i * Math.PI)));
				faceVs[i * 2] = i * 2 + 11;
				faceVs[i * 2 + 1] = i * 2
				faceVs[i * 2 + 10] = i * 2 + 11;
				faceVs[i * 2 + 11] = i * 2
			}
			faceNames = ["U", "F", "Ur", "R", "Ubr", "Br", "Ubl", "Bl", "Ul", "L", "D", "B", "Dl", "Lb", "Dfl", "Fl", "Dfr", "Fr", "Dr", "Rb"];
			cornPow = 5;
		} else { // invalid input
			debugger;
		}
		if (nface != 4) {
			for (var i = 0, length = faceNorms.length; i < length; i++) {
				faceNorms[i] = faceNorms[i].normalized();
				faceNorms.push(faceNorms[i].scalar(-1));
			}
		}

		var facePlanes = [];
		for (var i = 0; i < faceNorms.length; i++) {
			facePlanes.push(new Plane(faceNorms[i]));
			if (typeof(faceVs[i]) == 'number') {
				faceVs[i] = faceNorms[faceVs[i]];
			}
		}

		var puzzle = new PolyhedronPuzzle(facePlanes, faceVs, faceNames);

		var twistyPlanes = [];
		var twistyDetails = [];

		function addAxes(norms, names, pow, cuts, moves) {
			if (!cuts || cuts.length == 0) {
				return;
			}
			if (!moves) {
				moves = [];
				for (var i = 0; i < cuts.length; i++) {
					moves[i] = i;
				}
			}
			for (var i = 0; i < norms.length; i++) {
				var planeBase = twistyPlanes.length;
				for (var j = 0; j < cuts.length; j++) {
					if (typeof(cuts[j]) == 'number') { // plane
						twistyPlanes.push(new Plane(norms[i], cuts[j]));
					} else { // sphere
						twistyPlanes.push(new Sphere(norms[i].scalar(cuts[j][0]), cuts[j][1], norms[i]));
					}
				}
				for (var j = 0; j < moves.length; j++) {
					var detail = [j + "" + names[i], pow];
					var planes = typeof(moves[j]) == 'number' ? [moves[j]] : moves[j];
					for (var k = 0; k < planes.length; k++) {
						detail.push(planes[k] + planeBase);
					}
					twistyDetails.push(detail);
				}
			}
		}

		addAxes(faceNorms, faceNames, facePow, faceCuts, faceMoves);

		if (edgeCuts && edgeCuts.length > 0) {
			var edgeNorms = [];
			var edgeNames = [];
			puzzle.enumFacesPolys(function(face, p, poly) {
				var _point = poly.paths.at(-1).p1;
				for (var i = 0; i < poly.paths.length; i++) {
					var point = poly.paths[i].p1;
					var edgeNorm = point.add(_point).normalized();
					for (var j = 0; j < edgeNorms.length; j++) {
						if (edgeNorm.abs(edgeNorms[j]) < EPS) {
							edgeNames[j] += faceNames[face];
							edgeNorm = null;
							break;
						}
					}
					if (edgeNorm) {
						edgeNorms.push(edgeNorm);
						edgeNames.push(faceNames[face]);
					}
					_point = point;
				}
			});
			addAxes(edgeNorms, edgeNames, edgePow, edgeCuts, edgeMoves);
		}
		if (cornCuts && cornCuts.length > 0) {
			var cornNorms = [];
			var cornNames = [];
			puzzle.enumFacesPolys(function(face, p, poly) {
				for (var i = 0; i < poly.paths.length; i++) {
					var cornNorm  = poly.paths[i].p1.normalized();
					for (var j = 0; j < cornNorms.length; j++) {
						if (cornNorm.abs(cornNorms[j]) < EPS) {
							cornNames[j] += faceNames[face];
							cornNorm = null;
							break;
						}
					}
					if (cornNorm) {
						cornNorms.push(cornNorm);
						cornNames.push(faceNames[face]);
					}
				}
			});
			addAxes(cornNorms, cornNames, cornPow, cornCuts, cornMoves);
		}

		puzzle.setTwisty(twistyPlanes, twistyDetails);

		DEBUG && console.log('[poly3dlib] create puzzle: ', puzzle);

		return puzzle;
	}

	// return [sizes, polys], polys = [ [xs, ys, face], ... ]
	function renderNet(puzzle, gap, minArea) {
		var faceTrans = [];
		var nface = puzzle.facePlanes.length;
		gap = gap || 0;
		var sizes = [0, 0];
		if (nface == 4) { // tetrahedron
			var hw = Math.sqrt(6) * (1 + gap);
			var hwdsq3 = hw / Math.sqrt(3);
			faceTrans = [
				[hw * 2, hwdsq3 * 4], [hw * 1, hwdsq3 * 1],
				[hw * 3, hwdsq3 * 1], [hw * 2, hwdsq3 * 2]
			];
			sizes = [hw * 4, hwdsq3 * 6];
		} else if (nface == 6) { // cube
			var hw = (1 + gap);
			faceTrans = [
				[hw * 3, hw], [hw * 5, hw * 3], [hw * 3, hw * 3],
				[hw * 3, hw * 5], [hw, hw * 3], [hw * 7, hw * 3]
			];
			sizes = [hw * 8, hw * 6];
		} else if (nface == 8) { // octahedron
			var hwdsq3 = Math.sqrt(6) * (1 + gap) / 2 / Math.sqrt(3);
			var sq3 = Math.sqrt(3);
			faceTrans = [
				[hwdsq3 * 3, hwdsq3 * 1, sq3, 1], [hwdsq3 * 5, hwdsq3 * 3, 1, sq3],
				[hwdsq3 * 1, hwdsq3 * 3, 1, sq3], [hwdsq3 * 3, hwdsq3 * 5, sq3, 1],
				[hwdsq3 * 9, hwdsq3 * 5, sq3, 1], [hwdsq3 * 11, hwdsq3 * 3, 1, sq3],
				[hwdsq3 * 7, hwdsq3 * 3, 1, sq3], [hwdsq3 * 9, hwdsq3 * 1, sq3, 1]
			];
			sizes = [hwdsq3 * 12, hwdsq3 * 6];
		} else if (nface == 12) { // dodecahedron
			var phi = (Math.sqrt(5) + 1) / 2;
			var hw = Math.sqrt(3 - phi) / Math.pow(phi, 2) * (1 + gap);
			var wec2 = hw * Math.tan(Math.PI * 0.3) * 2;
			var off1X = hw * (1 + 2 * phi);
			var off1Y = hw * (1 / Math.sin(Math.PI * 0.2) + Math.cos(Math.PI * 0.1) * 2);
			var off2X = hw * (4 + 5 * phi);
			var off2Y = wec2 + hw / Math.cos(Math.PI * 0.3);;
			faceTrans[0] = [off1X, off1Y];
			faceTrans[6] = [off2X, off2Y];
			for (var i = 0; i < 5; i++) {
				faceTrans[1 + i] = [off1X + Math.cos(Math.PI * (0.5 - 0.4 * i)) * wec2, off1Y + Math.sin(Math.PI * (0.5 - 0.4 * i)) * wec2];
				faceTrans[7 + i] = [off2X + Math.cos(Math.PI * (1.5 + 0.4 * i)) * wec2, off2Y + Math.sin(Math.PI * (1.5 + 0.4 * i)) * wec2];
			}
			sizes = [off1X + off2X, off1Y + off2Y];
		} else if (nface == 20) { // icosahedron
			var phi = (Math.sqrt(5) + 1) / 2;
			var hw = Math.sqrt(3) / Math.pow(phi, 2) * (1 + gap);
			for (var i = 0; i < 5; i++) {
				faceTrans[i * 2] = [((5 + i * 2) % 10 + 1) * hw, 2 * hw / Math.sqrt(3)];
				faceTrans[i * 2 + 1] = [((5 + i * 2) % 10 + 1) * hw, 4 * hw / Math.sqrt(3)];
				faceTrans[i * 2 + 10] = [(1 + i * 2) % 10 * hw, 7 * hw / Math.sqrt(3)];
				faceTrans[i * 2 + 11] = [(1 + i * 2) % 10 * hw, 5 * hw / Math.sqrt(3)];
			}
			sizes = [hw * 11, 9 * hw / Math.sqrt(3)];
		} else { // invalid input
			debugger;
		}
		var ret = [];
		var faceMeta = [];
		puzzle.enumFacesPolys(function(face, p, poly, idx) {
			if (poly.area < minArea) {
				return;
			}
			var cords = poly.projection(puzzle.faceUVs[face]);
			var trans = faceTrans[face];
			var arr = [[], []];
			for (var i = 0; i < cords.length; i++) {
				arr[0][i] = trans[0] + cords[i][0] * (trans[2] || 1);
				arr[1][i] = trans[1] - cords[i][1] * (trans[3] || 1);
			}
			arr[2] = face;
			ret[idx] = arr;
			faceMeta[face] = faceMeta[face] || [trans[0], trans[1], puzzle.faceNames[face]];
		});
		return [sizes, ret, faceMeta];
	}

	// parseFunc(m, p1, p2, ..) -> [layer, axis, pow] or null, toStrFunc(layer:int, axis:str, pow:int) -> moveString
	function makeParser(regexp, parseFunc, toStrFunc, preProcess) {
		return {
			parseScramble: function(regexp, parseFunc, preProcess, scramble) {
				if (!scramble || /^\s*$/.exec(scramble)) {
					return [];
				}
				if (preProcess) {
					scramble = preProcess(scramble);
				}
				var ret = [];
				scramble.replace(regexp, function() {
					var move = parseFunc.apply(null, arguments);
					if (move) {
						ret.push(["" + move[0] + move[1], move[2]]);
					}
				});
				return ret;
			}.bind(null, regexp, parseFunc, preProcess),
			move2str: function(toStrFunc, move) {
				var m = /^(\d+)([a-zA-Z]+)$/.exec(move[0]);
				if (!m) { // invalid move
					debugger;
					return "";
				}
				return toStrFunc(~~m[1], m[2], move[1]);
			}.bind(null, toStrFunc)
		}
	}

	function makePuzzleParser(puzzle) {
		return makeParser(/(?:^|\s*)(?:\[([a-zA-Z]+)(\d*)(')?\]|(\d*)([A-Z][a-zA-Z]*)(\d*)(')?)(?:$|\s*)/g, function(puzzle, m, p1, p2, p3, p4, p5, p6, p7) {
			var layer = p1 ? '0' : p4 == '' ? '1' : p4;
			var axis = p1 || p5;
			var pow = (p1 ? (p2 == '' ? 1 : ~~p2) : (p6 == '' ? 1 : ~~p6)) * ((p3 || p7) ? -1 : 1);
			var faces = axis.match(/[A-Z][a-z]*/g);
			if (puzzle.getTwistyIdx(layer + axis) != -1) {
				return [layer, axis, pow];
			}
		}.bind(null, puzzle), function(layer, axis, pow) {
			var move = axis + (Math.abs(pow) == 1 ? "" : Math.abs(pow)) + (pow < 0 ? "'" : "");
			return layer == 0 ? ('[' + move + ']') : move;
		});
	}

	function parsePolyParam(polyDef) {
		var paramCmd = polyDef.split(/\s+/g);
		var nFace = [4, 6, 8, 12, 20]['tcodi'.indexOf(paramCmd[0])];
		var polyParam = [nFace, [-5], [-5], [-5]];
		var cutIdx = 1;
		var m;
		for (var i = 1; i < paramCmd.length; i++) {
			if (/^[fev]$/.exec(paramCmd[i])) {
				cutIdx = ' fev'.indexOf(paramCmd[i]);
			} else if (/^[+-]?\d+(?:\.\d+)?$/.exec(paramCmd[i])) {
				polyParam[cutIdx].push(parseFloat(paramCmd[i]));
			} else if (/^\d+(?:\.\d+)?r[+-]?\d+(?:\.\d+)?$/.exec(paramCmd[i])) {
				var sphereCmd = paramCmd[i].split('r');
				polyParam[cutIdx].push([parseFloat(sphereCmd[0]), -parseFloat(sphereCmd[1])]);
			}
		}
		return polyParam;
	}

	function getFamousPuzzle(name, bindObj) {
		var polyParam, parser, scale = 1, pieceGap = 0.075, colors = [];
		if (/^(\d)\1\1$/.exec(name)) {
			var dim = /^(\d)\1\1$/.exec(name);
			dim = ~~dim[1];
			polyParam = [6, [-5]];
			for (var i = 0; i < (dim >> 1); i++) {
				polyParam[1].push(1 - (i + 1) * 2 / dim);
			}
		} else if (name == "pyr" || name == "mpyr") {
			polyParam = [4, [], [], {
				"pyr": [-5, 5/3, 1/3],
				"mpyr": [-5, 2, 1, 0]
			}[name]];
			scale = 0.51;
			pieceGap = 0.14;
			parser = makeParser(/(?:^|\s*)(?:([URLBurlb])(w?)(')?|\[([urlb])(')?\])(?:$|\s*)/g, function(m, p1, p2, p3, p4, p5) {
				var face = ["LRF", "DRF", "DLF", "DLR"]["URLB".indexOf((p1 || p4).toUpperCase())];
				return [p4 ? 0 : p2 ? 3 : p1 == p1.toUpperCase() ? 2 : 1, face, (p3 || p5) ? -1 : 1];
			}, function(layer, axis, pow) {
				var move = "urlb".charAt(["LRF", "DRF", "DLF", "DLR"].indexOf(axis));
				var powfix = pow < 0 ? "'" : "";
				return ["[" + move + powfix + "]", move + powfix, move.toUpperCase() + powfix, move.toUpperCase() + 'w' + powfix][layer];
			});
		} else if (name == "fto" || name == "dmd") {
			polyParam = {
				"fto": [8, [-5, 1/3, -1/3], [], [-5]],
				"dmd": [8, [-5, 0], [], [-5]]
			}[name];
			parser = makeParser(/(?:^|\s*)\[?([URFDLT]|(?:B[RL]?))(w)?(')?(\])?(?:$|\s*)/g, function(m, p1, p2, p3, p4) {
				return [p4 || p1 == 'T' ? 0 : p2 ? 2 : 1, p1 == 'T' ? 'URLF' : (p1[0] + p1.slice(1).toLowerCase()), p3 ? -1 : 1];
			}, function(layer, axis, pow) {
				var move = (axis.length > 3 ? 'T' : axis.toUpperCase()) + (layer == 2 ? 'w' : '') + (pow > 0 ? "" : "'");
				return layer == 0 ? ('[' + move + ']') : move;
			});
		} else if (name == "klm" || name == "mgm" || name == "prc" || name == "giga") {
			polyParam = [12, {
				"klm": [-5, 0.57, -0.57],
				"mgm": [-5, 0.72, -0.72],
				"giga": [-5, 0.83, -0.83, 0.66, -0.66],
				"prc": [-5, 0.4472136, -0.4472136]
			}[name]];
			scale = 1.18;
			pieceGap = 0.05;
			parser = makeParser(/(?:^|\s*)(?:([DLRdlr])(\+\+?|--?)|([UuFfy]|D?B?[RL]|d?b?[rl]|[DdBb])(\d?)('?)|\[([ufrl])(\d?)('?)\])(?:$|\s*)/g, function(m, p1, p2, p3, p4, p5, p6, p7, p8) {
				if (p1) {
					var fidx = "DLRdlr".indexOf(p1);
					return [fidx > 2 ? 4 : 2, ["D", "Dbl", "Dbr"][fidx % 3], (p2[0] == '-' ? -1 : 1) * p2.length];
				} else if (p3) {
					var pow = (p5 ? -1 : 1) * (~~p4 || 1);
					return p3[0] == 'y' ? [0, 'U', pow] :
						[p3[0] >= 'a' ? 3 : 1, p3[0].toUpperCase() + p3.slice(1).toLowerCase(), pow];
				} else {
					return [0, p6.toUpperCase(), (p8 ? -1 : 1) * (~~p7 || 1)];
				}
			}, function(layer, axis, pow) {
				pow = (pow + 7) % 5 - 2;
				var powfix = (Math.abs(pow) == 1 ? "" : Math.abs(pow)) + (pow >= 0 ? "" : "'");
				if (layer == 0) {
					return "[" + axis.toLowerCase() + powfix + "]";
				} else if (layer == 2 || layer == 4) {
					powfix = pow > 0 ? "+" : "-";
					axis = "DLR".charAt(["D", "Dbl", "Dbr"].indexOf(axis));
					return (layer == 4 ? axis.toLowerCase() : axis) + powfix + (Math.abs(pow) == 2 ? powfix : '');
				} else if (layer == 1) {
					return axis.toUpperCase() + powfix;
				} else if (layer == 3) {
					return axis.toLowerCase() + powfix;
				}
			}, function(scramble) {
				if (/^(\s*([+-]{2}\s*)+U'?\s*\n?)*$/.exec(scramble)) {
					scramble = tools.carrot2poch(scramble);
				}
				return scramble;
			});
		} else if (name == "heli" || name == "helicv" || name == "heli2x2") {
			polyParam = {
				"heli": [6, [-5], [-5, Math.sqrt(0.5)], [-5]],
				"helicv": [6, [-5], [-5, [2 * Math.sqrt(2), -Math.sqrt(5)]], [-5]],
				"heli2x2": [6, [-5, 0], [-5, [Math.sqrt(2), -0.6]], [-5, [Math.sqrt(3), -0.7]]]
			}[name];
			pieceGap = 0.05;
		} else if (/^crz3a$/.exec(name)) {
			polyParam = [6, [-5, 0.3333, [1, 0.75]], [], [], [0, [1, 2]]];
			parser = makeParser(/(?:^|\s*)([URFDLBxyz])(\d*)(')?(?:$|\s*)/g, function(m, p1, p2, p3) {
				var pow = (p2 == '' ? 1 : ~~p2) * (p3 ? -1 : 1);
				if ("xyz".indexOf(p1) != -1) {
					return [0, "RUF".charAt("xyz".indexOf(p1)), pow];
				}
				return [1, p1, pow];
			}, function(layer, axis, pow) {
				var powfix = (Math.abs(pow) == 1 ? "" : Math.abs(pow)) + (pow >= 0 ? "" : "'");
				return (layer == 0 ? "xyz".charAt("RUF".indexOf(axis)) : axis) + powfix;
			});
		} else if (/^(redi|dino)$/.exec(name)) {
			polyParam = name == 'redi' ? [6, [-5], [], [-5, 0.85]] : [6, [-5], [], [-5, Math.sqrt(1/3)]];
			var rediShort = 'FLBRflbrxyz';
			var rediLong = ['URF', 'UFL', 'ULB', 'URB', 'RFD', 'FDL', 'DLB', 'RDB', 'R', 'U', 'F'];
			parser = makeParser(/(?:^|\s*)([FLBRflbrxyz])(')?(?:$|\s*)/g, function(m, p1, p2, p3) {
				var midx = rediShort.indexOf(p1);
				return [midx >= 8 ? 0 : 1, rediLong[midx], p2 ? -1 : 1];
			}, function(layer, axis, pow) {
				return rediShort.charAt(rediLong.indexOf(axis)) + (pow >= 0 ? "" : "'");
			}, function(scramble) {
				if (/^(([LR]'? ){3,}x ){3,}/.exec(scramble)) {
					return scramble.replace(/L/g, 'B');
				}
				return scramble;
			});
		} else if (/^skb$/.exec(name)) {
			polyParam = [6, [-5], [], [-5, 0]];
			var skbShort = 'FlUrDLBRxyz';
			var skbLong = ['URF', 'UFL', 'ULB', 'URB', 'RFD', 'FDL', 'DLB', 'RDB', 'R', 'U', 'F'];
			parser = makeParser(/(?:^|\s*)([FlUrDLBRxyz])(')?(?:$|\s*)/g, function(m, p1, p2, p3) {
				var midx = skbShort.indexOf(p1);
				return [midx >= 8 ? 0 : 1, skbLong[midx], p2 ? -1 : 1];
			}, function(layer, axis, pow) {
				return skbShort.charAt(skbLong.indexOf(axis)) + (pow >= 0 ? "" : "'");
			});
		} else if (name == 'ctico') {
			polyParam = [20, [], [], [-5, 0]];
		} else {
			return null;
		}
		var nFace = polyParam[0];
		if (nFace == 4) {
			colors = $.col2std(kernel.getProp("colpyr"), [3, 1, 2, 0]);
		} else if (nFace == 6) {
			colors = $.col2std(kernel.getProp("colcube"), [3, 4, 5, 0, 1, 2]);
		} else if (nFace == 8) {
			colors = $.col2std(kernel.getProp("colfto"), [0, 3, 1, 2, 6, 7, 5, 4]);
		} else if (nFace == 12) {
			colors = $.col2std(kernel.getProp("colmgm"), [0, 2, 1, 5, 4, 3, 11, 9, 8, 7, 6, 10]);
		} else if (nFace == 20) {
			colors = $.col2std(kernel.getProp("colico"), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
		}

		bindObj = bindObj || {};
		bindObj.parser = parser;
		bindObj.polyParam = polyParam;
		bindObj.scale = (bindObj.scale || 1) * scale;
		bindObj.pieceGap = pieceGap;
		bindObj.colors = colors;
		return bindObj;
	}

	return {
		Point: Point,
		RotTrans: RotTrans,
		Plane: Plane,
		Sphere: Sphere,
		Segment: Segment,
		Arc: Arc,
		Polygon: Polygon,
		makePuzzle: makePuzzle,
		renderNet: renderNet,
		makeParser: makeParser,
		makePuzzleParser: makePuzzleParser,
		getFamousPuzzle: getFamousPuzzle,
		udpolyre: new RegExp("^(" + $.UDPOLY_RE + ")$"),
		parsePolyParam: parsePolyParam
	}
})();

/* ==== lib/pat3x3.js ==== */
var pat3x3 = (function() {

	var bitCount = mathlib.bitCount;

	function iterFill(depth, mask, ori, parity, memo, candidates, nOri, sampleArr) {
		var key = (mask * nOri + ori) * 2 + parity;
		if (!sampleArr && key in memo) {
			return memo[key];
		}
		if (depth == candidates.length) {
			if (ori == 0 && parity == 0) {
				memo[key] = 1;
			} else {
				memo[key] = 0;
			}
			return memo[key];
		}
		var cnt = 0;
		var probs = [];
		for (var i = 0; i < candidates[depth].length; i++) {
			probs[i] = 0;
			var piece = candidates[depth][i][0];
			if (mask >> piece & 1) {
				continue;
			}
			probs[i] = iterFill(depth + 1,
				mask | 1 << piece,
				(ori + candidates[depth][i][1]) % nOri,
				parity ^ (bitCount(mask >> piece) & 1),
				memo, candidates, nOri
			);
			cnt += probs[i];
		}
		if (sampleArr) {
			var action = candidates[depth][mathlib.rndProb(probs)];
			sampleArr[depth] = action;
			return iterFill(depth + 1,
				mask | 1 << action[0],
				(ori + action[1]) % nOri,
				parity ^ (bitCount(mask >> action[0]) & 1),
				memo, candidates, nOri, sampleArr
			);
		}
		memo[key] = cnt;
		return memo[key];
	}

	function genCandidates(facelet, solved, pieces) {
		var nPiece = pieces.length;
		var nOri = pieces[0].length;
		var candidates = [];
		for (var pos = 0; pos < nPiece; pos++) {
			candidates[pos] = [];
			for (var piece = 0; piece < nPiece; piece++) {
				for (var ori = 0; ori < nOri; ori++) {
					var isValid = true;
					for (var chk = 0; chk < nOri; chk++) {
						var target = facelet[pieces[pos][chk]]
						if (target != -1 && target != solved[pieces[piece][(nOri - ori + chk) % nOri]]) {
							isValid = false;
							break;
						}
					}
					if (isValid) {
						candidates[pos].push([piece, ori]);
					}
				}
			}
		}
		return candidates;
	}

	function calcPattern(facelet, solved) {
		facelet = facelet.split("");
		solved = (solved || mathlib.SOLVED_FACELET).split("");
		for (var i = 0; i < facelet.length; i++) {
			facelet[i] = "URFDLB-XYZ".indexOf(facelet[i]);
			solved[i] = "URFDLB-XYZ".indexOf(solved[i]);
		}
		var cornCandidates = genCandidates(facelet, solved, mathlib.CubieCube.cFacelet);
		var edgeCandidates = genCandidates(facelet, solved, mathlib.CubieCube.eFacelet);
		var cornCnts = [];
		var edgeCnts = [];
		var cornMemo = {};
		var edgeMemo = {};
		for (var parity = 0; parity < 2; parity++) {
			cornCnts[parity] = iterFill(0, 0, 0, parity, cornMemo, cornCandidates, 3);
			edgeCnts[parity] = iterFill(0, 0, 0, parity, edgeMemo, edgeCandidates, 2);
		}
		return [cornCnts, edgeCnts, cornMemo, edgeMemo, cornCandidates, edgeCandidates];
	}

	function genPattern(cornCnts, edgeCnts, cornMemo, edgeMemo, cornCandidates, edgeCandidates) {
		var parity = ~~mathlib.rndHit(cornCnts[1] * edgeCnts[1] / (cornCnts[0] * edgeCnts[0] + cornCnts[1] * edgeCnts[1]));
		var cornArr = [];
		var edgeArr = [];
		iterFill(0, 0, 0, parity, cornMemo, cornCandidates, 3, cornArr);
		iterFill(0, 0, 0, parity, edgeMemo, edgeCandidates, 2, edgeArr);
		var cc = new mathlib.CubieCube();
		for (var i = 0; i < 8; i++) {
			cc.ca[i] = cornArr[i][1] * 8 + cornArr[i][0];
		}
		for (var i = 0; i < 12; i++) {
			cc.ea[i] = edgeArr[i][0] * 2 + edgeArr[i][1];
		}
		return cc.toFaceCube();
	}

	function genPatternGroup(solved) {
		var params = calcPattern(solved, solved);
		var cornCnts = params[0];
		var edgeCnts = params[1];
		var cornMemo = params[2];
		var edgeMemo = params[3];
		var cornCandidates = params[4];
		var edgeCandidates = params[5];
		var targetSize = cornCnts[0] * edgeCnts[0] + cornCnts[1] * edgeCnts[1];
		var sgs = null;
		do {
			var parity = Math.random() < cornCnts[1] * edgeCnts[1] / (cornCnts[0] * edgeCnts[0] + cornCnts[1] * edgeCnts[1]) ? 1 : 0;
			var cornArr = [];
			var edgeArr = [];
			iterFill(0, 0, 0, parity, cornMemo, cornCandidates, 3, cornArr);
			iterFill(0, 0, 0, parity, edgeMemo, edgeCandidates, 2, edgeArr);
			var cc = new mathlib.CubieCube();
			for (var i = 0; i < 8; i++) {
				cc.ca[i] = cornArr[i][1] * 8 + cornArr[i][0];
			}
			for (var i = 0; i < 12; i++) {
				cc.ea[i] = edgeArr[i][0] * 2 + edgeArr[i][1];
			}
			var perm = cc.toPerm();
			if (!sgs) {
				sgs = new grouplib.SchreierSims([perm]);
			} else {
				sgs.extend([perm]);
			}
			DEBUG && console.log('[pat3x3] gen group ', sgs.size(), targetSize);
		} while (sgs.size() < targetSize);
		return sgs;
	}

	return {
		calcPattern: calcPattern,
		genPattern: genPattern,
		genPatternGroup: genPatternGroup
	}
})();

/* ==== lib/min2phase.js ==== */
"use strict";

var min2phase = (function() {
	var USE_TWST_FLIP_PRUN = true;
	var PARTIAL_INIT_LEVEL = 2;

	var MAX_PRE_MOVES = 20;
	var TRY_INVERSE = true;
	var TRY_THREE_AXES = true;

	var USE_CONJ_PRUN = USE_TWST_FLIP_PRUN;
	var MIN_P1LENGTH_PRE = 7;
	var MAX_DEPTH2 = 13;

	var INVERSE_SOLUTION = 0x2;

	function Search() {
		this.move = [];
		this.moveSol = [];

		this.nodeUD = [];

		this.valid1 = 0;
		this.allowShorter = false;
		this.cc = new CubieCube();
		this.urfCubieCube = [];
		this.urfCoordCube = [];
		this.phase1Cubie = [];

		this.preMoveCubes = [];
		this.preMoves = [];
		this.preMoveLen = 0;
		this.maxPreMoves = 0;

		this.isRec = false;
		for (var i = 0; i < 21; i++) {
			this.nodeUD[i] = new CoordCube();
			this.phase1Cubie[i] = new CubieCube();
		}
		for (var i = 0; i < 6; i++) {
			this.urfCubieCube[i] = new CubieCube();
			this.urfCoordCube[i] = new CoordCube();
		}
		for (var i = 0; i < MAX_PRE_MOVES; i++) {
			this.preMoveCubes[i + 1] = new CubieCube();
		}
	}

	var Ux1 = 0;
	var Ux2 = 1;
	var Ux3 = 2;
	var Rx1 = 3;
	var Rx2 = 4;
	var Rx3 = 5;
	var Fx1 = 6;
	var Fx2 = 7;
	var Fx3 = 8;
	var Dx1 = 9;
	var Dx2 = 10;
	var Dx3 = 11;
	var Lx1 = 12;
	var Lx2 = 13;
	var Lx3 = 14;
	var Bx1 = 15;
	var Bx2 = 16;
	var Bx3 = 17;

	var N_MOVES = 18;
	var N_MOVES2 = 10;
	var N_FLIP = 2048;
	var N_FLIP_SYM = 336;
	var N_TWST = 2187;
	var N_TWST_SYM = 324;
	var N_PERM = 40320;
	var N_PERM_SYM = 2768;
	var N_MPERM = 24;
	var N_SLICE = 495;
	var N_COMB = 140;

	var SYM_E2C_MAGIC = 0x00DDDD00;
	var Cnk = [];
	var fact = [1];
	var move2str = [
		"U ", "U2", "U'", "R ", "R2", "R'", "F ", "F2", "F'",
		"D ", "D2", "D'", "L ", "L2", "L'", "B ", "B2", "B'"
	];
	var ud2std = [Ux1, Ux2, Ux3, Rx2, Fx2, Dx1, Dx2, Dx3, Lx2, Bx2, Rx1, Rx3, Fx1, Fx3, Lx1, Lx3, Bx1, Bx3];
	var std2ud = [];
	var ckmv2bit = [];
	var urfMove = [
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
		[6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14],
		[3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11],
		[2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15],
		[8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12],
		[5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9]
	];

	{ // init util
		for (var i = 0; i < 18; i++) {
			std2ud[ud2std[i]] = i;
		}
		for (var i = 0; i < 10; i++) {
			var ix = ~~(ud2std[i] / 3);
			ckmv2bit[i] = 0;
			for (var j = 0; j < 10; j++) {
				var jx = ~~(ud2std[j] / 3);
				ckmv2bit[i] |= ((ix == jx) || ((ix % 3 == jx % 3) && (ix >= jx)) ? 1 : 0) << j;
			}
		}
		ckmv2bit[10] = 0;
		for (var i = 0; i < 13; i++) {
			Cnk[i] = [];
			fact[i + 1] = fact[i] * (i + 1);
			Cnk[i][0] = Cnk[i][i] = 1;
			for (var j = 1; j < 13; j++) {
				Cnk[i][j] = j <= i ? Cnk[i - 1][j - 1] + Cnk[i - 1][j] : 0;
			}
		}
	}

	function setPruning(table, index, value) {
		table[index >> 3] ^= value << (index << 2); // index << 2 <=> (index & 7) << 2
	}

	function getPruning(table, index) {
		return table[index >> 3] >> (index << 2) & 0xf; // index << 2 <=> (index & 7) << 2
	}

	function getPruningMax(maxValue, table, index) {
		return Math.min(maxValue, table[index >> 3] >> (index << 2) & 0xf);
	}

	function hasZero(val) {
		return ((val - 0x11111111) & ~val & 0x88888888) != 0;
	}

	function ESym2CSym(idx) {
		return idx ^ (SYM_E2C_MAGIC >> ((idx & 0xf) << 1) & 3);
	}

	function getPermSymInv(idx, sym, isCorner) {
		var idxi = PermInvEdgeSym[idx];
		if (isCorner) {
			idxi = ESym2CSym(idxi);
		}
		return idxi & 0xfff0 | SymMult[idxi & 0xf][sym];
	}

	function CubieCube() {
		this.ca = [0, 1, 2, 3, 4, 5, 6, 7];
		this.ea = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	}

	function setNPerm(arr, idx, n) {
		n--;
		var val = 0x76543210;
		for (var i = 0; i < n; ++i) {
			var p = fact[n - i];
			var v = ~~(idx / p);
			idx %= p;
			v <<= 2;
			arr[i] = arr[i] & 0xf0 | val >> v & 0xf;
			var m = (1 << v) - 1;
			val = (val & m) + (val >> 4 & ~m);
		}
		arr[n] = arr[n] & 0xf0 | val & 0xf;
	}

	function getNPerm(arr, n) {
		var idx = 0,
			val = 0x76543210;
		for (var i = 0; i < n - 1; ++i) {
			var v = (arr[i] & 0xf) << 2;
			idx = (n - i) * idx + (val >> v & 0xf);
			val -= 0x11111110 << v;
		}
		return idx;
	}

	function setNPermFull(arr, idx, n) {
		arr[n - 1] = arr[n - 1] & 0xf0;
		for (var i = n - 2; i >= 0; --i) {
			arr[i] = arr[i] & 0xf0 | idx % (n - i);
			idx = ~~(idx / (n - i));
			for (var j = i + 1; j < n; ++j) {
				if ((arr[j] & 0xf) >= (arr[i] & 0xf)) {
					arr[j] += 1;
				}
			}
		}
	}

	function getNPermFull(arr, n) {
		var idx = 0;
		for (var i = 0; i < n; ++i) {
			idx *= n - i;
			for (var j = i + 1; j < n; ++j) {
				if ((arr[j] & 0xf) < (arr[i] & 0xf)) {
					++idx;
				}
			}
		}
		return idx;
	}

	function getComb(arr, mask) {
		var end = arr.length - 1;
		var idxC = 0,
			r = 4;
		for (var i = end; i >= 0; i--) {
			var perm = arr[i] & 0xf;
			if ((perm & 0xc) == mask) {
				idxC += Cnk[i][r--];
			}
		}
		return idxC;
	}

	function setComb(arr, idxC, mask) {
		var end = arr.length - 1;
		var r = 4,
			fill = end;
		for (var i = end; i >= 0; i--) {
			if (idxC >= Cnk[i][r]) {
				idxC -= Cnk[i][r--];
				arr[i] = arr[i] & 0xf0 | r | mask;
			} else {
				if ((fill & 0xc) == mask) {
					fill -= 4;
				}
				arr[i] = arr[i] & 0xf0 | fill--;
			}
		}
	}

	function getNParity(idx, n) {
		var p = 0;
		for (var i = n - 2; i >= 0; i--) {
			p ^= idx % (n - i);
			idx = ~~(idx / (n - i));
		}
		return p & 1;
	}
	CubieCube.EdgeMult = function(a, b, prod) {
		for (var ed = 0; ed < 12; ed++) {
			prod.ea[ed] = a.ea[b.ea[ed] & 0xf] ^ (b.ea[ed] & 0x10);
		}
	}
	CubieCube.CornMult = function(a, b, prod) {
		for (var corn = 0; corn < 8; corn++) {
			var ori = ((a.ca[b.ca[corn] & 0xf] >> 4) + (b.ca[corn] >> 4)) % 3;
			prod.ca[corn] = a.ca[b.ca[corn] & 0xf] & 0xf | ori << 4;
		}
	}
	CubieCube.CornMultFull = function(a, b, prod) {
		for (var corn = 0; corn < 8; corn++) {
			var oriA = a.ca[b.ca[corn] & 0xf] >> 4;
			var oriB = b.ca[corn] >> 4;
			var ori = oriA + ((oriA < 3) ? oriB : 6 - oriB);
			ori = ori % 3 + ((oriA < 3) == (oriB < 3) ? 0 : 3);
			prod.ca[corn] = a.ca[b.ca[corn] & 0xf] & 0xf | ori << 4;
		}
	}
	CubieCube.CornConjugate = function(a, idx, b) {
		var sinv = SymCube[SymMultInv[0][idx]];
		var s = SymCube[idx];
		for (var corn = 0; corn < 8; corn++) {
			var oriA = sinv.ca[a.ca[s.ca[corn] & 0xf] & 0xf] >> 4;
			var oriB = a.ca[s.ca[corn] & 0xf] >> 4;
			var ori = (oriA < 3) ? oriB : (3 - oriB) % 3;
			b.ca[corn] = sinv.ca[a.ca[s.ca[corn] & 0xf] & 0xf] & 0xf | ori << 4;
		}
	}
	CubieCube.EdgeConjugate = function(a, idx, b) {
		var sinv = SymCube[SymMultInv[0][idx]];
		var s = SymCube[idx];
		for (var ed = 0; ed < 12; ed++) {
			b.ea[ed] = sinv.ea[a.ea[s.ea[ed] & 0xf] & 0xf] ^ (a.ea[s.ea[ed] & 0xf] & 0x10) ^ (s.ea[ed] & 0x10);
		}
	}
	CubieCube.prototype.init = function(ca, ea) {
		this.ca = ca.slice();
		this.ea = ea.slice();
		return this;
	}
	CubieCube.prototype.initCoord = function(cperm, twst, eperm, flip) {
		setNPerm(this.ca, cperm, 8);
		this.setTwst(twst);
		setNPermFull(this.ea, eperm, 12);
		this.setFlip(flip);
		return this;
	}
	CubieCube.prototype.isEqual = function(c) {
		for (var i = 0; i < 8; i++) {
			if (this.ca[i] != c.ca[i]) {
				return false;
			}
		}
		for (var i = 0; i < 12; i++) {
			if (this.ea[i] != c.ea[i]) {
				return false;
			}
		}
		return true;
	}
	CubieCube.prototype.setFlip = function(idx) {
		var parity = 0;
		for (var i = 10; i >= 0; i--, idx >>= 1) {
			this.ea[i] = this.ea[i] & 0xf | (idx & 1) << 4;
			parity ^= this.ea[i];
		}
		this.ea[11] = this.ea[11] & 0xf | parity & 0x10;
	}
	CubieCube.prototype.getFlip = function() {
		var idx = 0;
		for (var i = 0; i < 11; i++) {
			idx = idx << 1 | this.ea[i] >> 4 & 1;
		}
		return idx;
	}
	CubieCube.prototype.getFlipSym = function() {
		return FlipR2S[this.getFlip()];
	}
	CubieCube.prototype.setTwst = function(idx) {
		var twst = 15;
		for (var i = 6; i >= 0; i--, idx = ~~(idx / 3)) {
			this.ca[i] = this.ca[i] & 0xf | idx % 3 << 4;
			twst -= this.ca[i] >> 4;
		}
		this.ca[7] = this.ca[7] & 0xf | (twst % 3) << 4;
	}
	CubieCube.prototype.getTwst = function() {
		var idx = 0;
		for (var i = 0; i < 7; i++) {
			idx += (idx << 1) + (this.ca[i] >> 4);
		}
		return idx;
	}
	CubieCube.prototype.getTwstSym = function() {
		return TwstR2S[this.getTwst()];
	}
	CubieCube.prototype.setCPerm = function(idx) {
		setNPerm(this.ca, idx, 8);
	}
	CubieCube.prototype.getCPerm = function() {
		return getNPerm(this.ca, 8);
	}
	CubieCube.prototype.getCPermSym = function() {
		return ESym2CSym(EPermR2S[getNPerm(this.ca, 8)]);
	}
	CubieCube.prototype.setEPerm = function(idx) {
		setNPerm(this.ea, idx, 8);
	}
	CubieCube.prototype.getEPerm = function() {
		return getNPerm(this.ea, 8);
	}
	CubieCube.prototype.getEPermSym = function() {
		return EPermR2S[getNPerm(this.ea, 8)];
	}
	CubieCube.prototype.getSlice = function() {
		return 494 - getComb(this.ea, 8);
	}
	CubieCube.prototype.setSlice = function(idx) {
		setComb(this.ea, 494 - idx, 8);
	}
	CubieCube.prototype.getMPerm = function() {
		return getNPermFull(this.ea, 12) % 24;
	}
	CubieCube.prototype.setMPerm = function(idx) {
		setNPermFull(this.ea, idx, 12);
	}
	CubieCube.prototype.getCComb = function() {
		return getComb(this.ca, 0);
	}
	CubieCube.prototype.setCComb = function(idx) {
		setComb(this.ca, idx, 0);
	}
	CubieCube.prototype.URFConjugate = function() {
		var temps = new CubieCube();
		CubieCube.CornMult(CubieCube.urf2, this, temps);
		CubieCube.CornMult(temps, CubieCube.urf1, this);
		CubieCube.EdgeMult(CubieCube.urf2, this, temps);
		CubieCube.EdgeMult(temps, CubieCube.urf1, this);
	}
	var cornerFacelet = [
		[8, 9, 20],
		[6, 18, 38],
		[0, 36, 47],
		[2, 45, 11],
		[29, 26, 15],
		[27, 44, 24],
		[33, 53, 42],
		[35, 17, 51]
	];
	var edgeFacelet = [
		[5, 10],
		[7, 19],
		[3, 37],
		[1, 46],
		[32, 16],
		[28, 25],
		[30, 43],
		[34, 52],
		[23, 12],
		[21, 41],
		[50, 39],
		[48, 14]
	];
	CubieCube.prototype.toFaceCube = function(cFacelet, eFacelet) {
		cFacelet = cFacelet || cornerFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var ts = "URFDLB";
		var f = [];
		for (var i = 0; i < 54; i++) {
			f[i] = ts[~~(i / 9)];
		}
		for (var c = 0; c < 8; c++) {
			var j = this.ca[c] & 0xf; // cornercubie with index j is at
			var ori = this.ca[c] >> 4; // Orientation of this cubie
			for (var n = 0; n < 3; n++)
				f[cFacelet[c][(n + ori) % 3]] = ts[~~(cFacelet[j][n] / 9)];
		}
		for (var e = 0; e < 12; e++) {
			var j = this.ea[e] & 0xf; // edgecubie with index j is at edgeposition
			var ori = this.ea[e] >> 4; // Orientation of this cubie
			for (var n = 0; n < 2; n++)
				f[eFacelet[e][(n + ori) % 2]] = ts[~~(eFacelet[j][n] / 9)];
		}
		return f.join("");
	}
	CubieCube.prototype.invFrom = function(cc) {
		for (var edge = 0; edge < 12; edge++) {
			this.ea[cc.ea[edge] & 0xf] = edge & 0xf | cc.ea[edge] & 0x10;
		}
		for (var corn = 0; corn < 8; corn++) {
			this.ca[cc.ca[corn] & 0xf] = corn | 0x40 >> (cc.ca[corn] >> 4) & 0x30;
		}
		return this;
	}
	CubieCube.prototype.fromFacelet = function(facelet, cFacelet, eFacelet) {
		cFacelet = cFacelet || cornerFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var count = 0;
		var f = [];
		var centers = facelet[4] + facelet[13] + facelet[22] + facelet[31] + facelet[40] + facelet[49];
		for (var i = 0; i < 54; ++i) {
			f[i] = centers.indexOf(facelet[i]);
			if (f[i] == -1) {
				return -1;
			}
			count += 1 << (f[i] << 2);
		}
		if (count != 0x999999) {
			return -1;
		}
		var col1, col2, i, j, ori;
		for (i = 0; i < 8; ++i) {
			for (ori = 0; ori < 3; ++ori)
				if (f[cFacelet[i][ori]] == 0 || f[cFacelet[i][ori]] == 3)
					break;
			col1 = f[cFacelet[i][(ori + 1) % 3]];
			col2 = f[cFacelet[i][(ori + 2) % 3]];
			for (j = 0; j < 8; ++j) {
				if (col1 == ~~(cFacelet[j][1] / 9) && col2 == ~~(cFacelet[j][2] / 9)) {
					this.ca[i] = j | ori % 3 << 4;
					break;
				}
			}
		}
		for (i = 0; i < 12; ++i) {
			for (j = 0; j < 12; ++j) {
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][0] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][1] / 9)) {
					this.ea[i] = j;
					break;
				}
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][1] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][0] / 9)) {
					this.ea[i] = j | 0x10;
					break;
				}
			}
		}
	}

	function CoordCube() {
		this.twst = 0;
		this.flip = 0;
		this.slice = 0;
		this.prun = 0;
		this.twstc = 0;
		this.flipc = 0;
	}
	CoordCube.prototype.set = function(node) {
		this.twst = node.twst;
		this.flip = node.flip;
		this.slice = node.slice;
		this.prun = node.prun;
		if (USE_CONJ_PRUN) {
			this.twstc = node.twstc;
			this.flipc = node.flipc;
		}
	}
	CoordCube.prototype.calcPruning = function(isPhase1) {
		this.prun = Math.max(
			getPruningMax(SliceTwstPrunMax, SliceTwstPrun,
				(this.twst >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.twst & 7]),
			getPruningMax(SliceFlipPrunMax, SliceFlipPrun,
				(this.flip >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.flip & 7]),
			USE_CONJ_PRUN ? getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
				(this.twstc >> 3) << 11 | FlipS2RF[this.flipc ^ (this.twstc & 7)]) : 0,
			USE_TWST_FLIP_PRUN ? getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
				(this.twst >> 3) << 11 | FlipS2RF[this.flip ^ (this.twst & 7)]) : 0
		);
	}
	CoordCube.prototype.setWithPrun = function(cc, depth) {
		this.twst = cc.getTwstSym();
		this.flip = cc.getFlipSym();
		this.prun = USE_TWST_FLIP_PRUN ? getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
			(this.twst >> 3) << 11 | FlipS2RF[this.flip ^ (this.twst & 7)]) : 0;
		if (this.prun > depth) {
			return false;
		}
		this.slice = cc.getSlice();
		this.prun = Math.max(this.prun,
			getPruningMax(SliceTwstPrunMax, SliceTwstPrun,
				(this.twst >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.twst & 7]),
			getPruningMax(SliceFlipPrunMax, SliceFlipPrun,
				(this.flip >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.flip & 7]));
		if (this.prun > depth) {
			return false;
		}
		if (USE_CONJ_PRUN) {
			var pc = new CubieCube();
			CubieCube.CornConjugate(cc, 1, pc);
			CubieCube.EdgeConjugate(cc, 1, pc);
			this.twstc = pc.getTwstSym();
			this.flipc = pc.getFlipSym();
			this.prun = Math.max(this.prun,
				getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
					(this.twstc >> 3) << 11 | FlipS2RF[this.flipc ^ (this.twstc & 7)]));
		}
		return this.prun <= depth;
	}
	CoordCube.prototype.doMovePrun = function(cc, m, isPhase1) {
		this.slice = SliceMove[cc.slice * N_MOVES + m];
		this.flip = FlipMove[(cc.flip >> 3) * N_MOVES + Sym8Move[m << 3 | cc.flip & 7]] ^ (cc.flip & 7);
		this.twst = TwstMove[(cc.twst >> 3) * N_MOVES + Sym8Move[m << 3 | cc.twst & 7]] ^ (cc.twst & 7);
		this.prun = Math.max(
			getPruningMax(SliceTwstPrunMax, SliceTwstPrun,
				(this.twst >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.twst & 7]),
			getPruningMax(SliceFlipPrunMax, SliceFlipPrun,
				(this.flip >> 3) * N_SLICE + SliceConj[this.slice << 3 | this.flip & 7]),
			USE_TWST_FLIP_PRUN ? getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
				(this.twst >> 3) << 11 | FlipS2RF[this.flip ^ (this.twst & 7)]) : 0);
		return this.prun;
	}
	CoordCube.prototype.doMovePrunConj = function(cc, m) {
		m = SymMove[3][m];
		this.flipc = FlipMove[(cc.flipc >> 3) * N_MOVES + Sym8Move[m << 3 | cc.flipc & 7]] ^ (cc.flipc & 7);
		this.twstc = TwstMove[(cc.twstc >> 3) * N_MOVES + Sym8Move[m << 3 | cc.twstc & 7]] ^ (cc.twstc & 7);
		return getPruningMax(TwstFlipPrunMax, TwstFlipPrun,
			(this.twstc >> 3) << 11 | FlipS2RF[this.flipc ^ (this.twstc & 7)]);
	}
	Search.prototype.solution = function(facelets, maxDepth, probeMax, probeMin, verbose, firstAxisFilter, lastAxisFilter) {
		initPrunTables();
		var check = this.verify(facelets);
		if (check != 0) {
			return "Error " + Math.abs(check);
		}
		if (maxDepth === undefined) {
			maxDepth = 21;
		}
		if (probeMax === undefined) {
			probeMax = 1e9;
		}
		if (probeMin === undefined) {
			probeMin = 0;
		}
		if (verbose === undefined) {
			verbose = 0;
		}
		this.sol = maxDepth + 1;
		this.probe = 0;
		this.probeMax = probeMax;
		this.probeMin = Math.min(probeMin, probeMax);
		this.verbose = verbose;
		this.moveSol = null;
		this.isRec = false;
		this.firstFilters = [0, 0, 0, 0, 0, 0];
		this.lastFilters = [0, 0, 0, 0, 0, 0];
		for (var i = 0; i < 3; i++) {
			if (firstAxisFilter !== undefined) {
				this.firstFilters[i] |= 0xe07 << (~~(urfMove[(3 - i) % 3][firstAxisFilter * 3] / 3)) * 3;
				this.lastFilters[i + 3] |= 0xe07 << (~~(urfMove[(3 - i) % 3][firstAxisFilter * 3] / 3)) * 3;
			}
			if (lastAxisFilter !== undefined) {
				this.lastFilters[i] |= 0xe07 << (~~(urfMove[(3 - i) % 3][lastAxisFilter * 3] / 3)) * 3;
				this.firstFilters[i + 3] |= 0xe07 << (~~(urfMove[(3 - i) % 3][lastAxisFilter * 3] / 3)) * 3;
			}
		}
		this.initSearch();
		return this.search();
	}

	Search.prototype.initSearch = function() {
		this.conjMask = (TRY_INVERSE ? 0 : 0x38) | (TRY_THREE_AXES ? 0 : 0x36);
		this.maxPreMoves = this.conjMask > 7 ? 0 : MAX_PRE_MOVES;

		for (var i = 0; i < 6; i++) {
			this.urfCubieCube[i].init(this.cc.ca, this.cc.ea);
			this.urfCoordCube[i].setWithPrun(this.urfCubieCube[i], 20);
			this.cc.URFConjugate();
			if (i % 3 == 2) {
				var tmp = new CubieCube().invFrom(this.cc);
				this.cc.init(tmp.ca, tmp.ea);
			}
		}
	}

	Search.prototype.next = function(probeMax, probeMin, verbose) {
		this.probe = 0;
		this.probeMax = probeMax;
		this.probeMin = Math.min(probeMin, probeMax);
		this.moveSol = null;
		this.isRec = true;
		this.verbose = verbose;
		return this.search();
	}

	Search.prototype.verify = function(facelets) {
		if (this.cc.fromFacelet(facelets) == -1) {
			return -1;
		}
		var sum = 0;
		var edgeMask = 0;
		for (var e = 0; e < 12; e++) {
			edgeMask |= 1 << (this.cc.ea[e] & 0xf);
			sum ^= this.cc.ea[e] >> 4;
		}
		if (edgeMask != 0xfff) {
			return -2; // missing edges
		}
		if (sum != 0) {
			return -3;
		}
		var cornMask = 0;
		sum = 0;
		for (var c = 0; c < 8; c++) {
			cornMask |= 1 << (this.cc.ca[c] & 0xf);
			sum += this.cc.ca[c] >> 4;
		}
		if (cornMask != 0xff) {
			return -4; // missing corners
		}
		if (sum % 3 != 0) {
			return -5; // twisted corner
		}
		if ((getNParity(getNPermFull(this.cc.ea, 12), 12) ^ getNParity(this.cc.getCPerm(), 8)) != 0) {
			return -6; // parity error
		}
		return 0; // cube ok
	}

	Search.prototype.phase1PreMoves = function(maxl, lm, cc) {
		if (maxl == this.maxPreMoves - 1 && (this.lastFilter >> lm & 1) != 0) {
			return 1;
		}
		this.preMoveLen = this.maxPreMoves - maxl;
		if (this.isRec ? (this.depth1 == this.length1 - this.preMoveLen) :
			(this.preMoveLen == 0 || (0x36FB7 >> lm & 1) == 0)) {
			this.depth1 = this.length1 - this.preMoveLen;
			this.phase1Cubie[0].init(cc.ca, cc.ea) /* = cc*/ ;
			this.allowShorter = this.depth1 == MIN_P1LENGTH_PRE && this.preMoveLen != 0;

			if (this.nodeUD[this.depth1 + 1].setWithPrun(cc, this.depth1) &&
				this.phase1(this.nodeUD[this.depth1 + 1], this.depth1, -1) == 0) {
				return 0;
			}
		}

		if (maxl == 0 || this.preMoveLen + MIN_P1LENGTH_PRE >= this.length1) {
			return 1;
		}

		var skipMoves = 0;
		if (maxl == 1 || this.preMoveLen + 1 + MIN_P1LENGTH_PRE >= this.length1) { //last pre move
			skipMoves |= 0x36FB7; // 11 0110 1111 1011 0111
		}

		lm = ~~(lm / 3) * 3;
		for (var m = 0; m < 18; m++) {
			if (m == lm || m == lm - 9 || m == lm + 9) {
				m += 2;
				continue;
			}
			if (this.isRec && m != this.preMoves[this.maxPreMoves - maxl] || (skipMoves & 1 << m) != 0) {
				continue;
			}
			CubieCube.CornMult(moveCube[m], cc, this.preMoveCubes[maxl]);
			CubieCube.EdgeMult(moveCube[m], cc, this.preMoveCubes[maxl]);
			this.preMoves[this.maxPreMoves - maxl] = m;
			var ret = this.phase1PreMoves(maxl - 1, m, this.preMoveCubes[maxl]);
			if (ret == 0) {
				return 0;
			}
		}
		return 1;
	}

	Search.prototype.search = function() {
		for (this.length1 = this.isRec ? this.length1 : 0; this.length1 < this.sol; this.length1++) {
			for (this.urfIdx = this.isRec ? this.urfIdx : 0; this.urfIdx < 6; this.urfIdx++) {
				if ((this.conjMask & 1 << this.urfIdx) != 0) {
					continue;
				}
				this.firstFilter = this.firstFilters[this.urfIdx];
				this.lastFilter = this.lastFilters[this.urfIdx];
				if (this.phase1PreMoves(this.maxPreMoves, -30, this.urfCubieCube[this.urfIdx], 0) == 0) {
					return this.moveSol == null ? "Error 8" : this.moveSol;
				}
			}
		}
		return this.moveSol == null ? "Error 7" : this.moveSol;
	}

	Search.prototype.initPhase2Pre = function() {
		this.isRec = false;
		if (this.probe >= (this.moveSol == null ? this.probeMax : this.probeMin)) {
			return 0;
		}
		++this.probe;

		for (var i = this.valid1; i < this.depth1; i++) {
			CubieCube.CornMult(this.phase1Cubie[i], moveCube[this.move[i]], this.phase1Cubie[i + 1]);
			CubieCube.EdgeMult(this.phase1Cubie[i], moveCube[this.move[i]], this.phase1Cubie[i + 1]);
		}
		this.valid1 = this.depth1;

		var ret = this.initPhase2(this.phase1Cubie[this.depth1]);
		if (ret == 0 || this.preMoveLen == 0 || ret == 2) {
			return ret;
		}

		var m = ~~(this.preMoves[this.preMoveLen - 1] / 3) * 3 + 1;
		CubieCube.CornMult(moveCube[m], this.phase1Cubie[this.depth1], this.phase1Cubie[this.depth1 + 1]);
		CubieCube.EdgeMult(moveCube[m], this.phase1Cubie[this.depth1], this.phase1Cubie[this.depth1 + 1]);

		this.preMoves[this.preMoveLen - 1] += 2 - this.preMoves[this.preMoveLen - 1] % 3 * 2;
		ret = this.initPhase2(this.phase1Cubie[this.depth1 + 1]);
		this.preMoves[this.preMoveLen - 1] += 2 - this.preMoves[this.preMoveLen - 1] % 3 * 2;
		return ret;
	}
	Search.prototype.initPhase2 = function(phase2Cubie) {
		var p2corn = phase2Cubie.getCPermSym();
		var p2csym = p2corn & 0xf;
		p2corn >>= 4;
		var p2edge = phase2Cubie.getEPermSym();
		var p2esym = p2edge & 0xf;
		p2edge >>= 4;
		var p2mid = phase2Cubie.getMPerm();
		var prun = Math.max(
			getPruningMax(EPermCCombPPrunMax, EPermCCombPPrun,
				p2edge * N_COMB + CCombPConj[(Perm2CombP[p2corn] & 0xff) << 4 | SymMultInv[p2esym][p2csym]]),
			getPruningMax(MCPermPrunMax, MCPermPrun,
				p2corn * N_MPERM + MPermConj[p2mid << 4 | p2csym]));
		var maxDep2 = Math.min(MAX_DEPTH2, this.sol - this.length1);
		if (prun >= maxDep2) {
			return prun > maxDep2 ? 2 : 1;
		}
		var depth2;
		for (depth2 = maxDep2 - 1; depth2 >= prun; depth2--) {
			var ret = this.phase2(p2edge, p2esym, p2corn, p2csym, p2mid, depth2, this.depth1, 10);
			if (ret < 0) {
				break;
			}
			depth2 -= ret;
			this.moveSol = [];
			for (var i = 0; i < this.depth1 + depth2; i++) {
				this.appendSolMove(this.move[i]);
			}
			for (var i = this.preMoveLen - 1; i >= 0; i--) {
				this.appendSolMove(this.preMoves[i]);
			}
			this.sol = this.moveSol.length;
			this.moveSol = this.solutionToString();
		}
		if (depth2 != maxDep2 - 1) { //At least one solution has been found.
			return this.probe >= this.probeMin ? 0 : 1;
		} else {
			return 1;
		}
	}
	Search.prototype.phase1 = function(node, maxl, lm) {
		if (maxl == this.depth1 - 1 && (this.firstFilter >> lm & 1) != 0) {
			return 1;
		}
		if (node.prun == 0 && maxl < 5) {
			if (this.allowShorter || maxl == 0) {
				this.depth1 -= maxl;
				var ret = this.initPhase2Pre();
				this.depth1 += maxl;
				return ret;
			} else {
				return 1;
			}
		}
		for (var axis = 0; axis < 18; axis += 3) {
			if (axis == lm || axis == lm - 9) {
				continue;
			}
			for (var power = 0; power < 3; power++) {
				var m = axis + power;

				if (this.isRec && m != this.move[this.depth1 - maxl]) {
					continue;
				}

				var prun = this.nodeUD[maxl].doMovePrun(node, m, true);
				if (prun > maxl) {
					break;
				} else if (prun == maxl) {
					continue;
				}

				if (USE_CONJ_PRUN) {
					prun = this.nodeUD[maxl].doMovePrunConj(node, m);
					if (prun > maxl) {
						break;
					} else if (prun == maxl) {
						continue;
					}
				}
				this.move[this.depth1 - maxl] = m;
				this.valid1 = Math.min(this.valid1, this.depth1 - maxl);
				var ret = this.phase1(this.nodeUD[maxl], maxl - 1, axis);
				if (ret == 0) {
					return 0;
				} else if (ret == 2) {
					break;
				}
			}
		}
		return 1;
	}
	Search.prototype.appendSolMove = function(curMove) {
		if (this.moveSol.length == 0) {
			this.moveSol.push(curMove);
			return;
		}
		var axisCur = ~~(curMove / 3);
		var axisLast = ~~(this.moveSol.at(-1) / 3);
		if (axisCur == axisLast) {
			var pow = (curMove % 3 + this.moveSol.at(-1) % 3 + 1) % 4;
			if (pow == 3) {
				this.moveSol.pop();
			} else {
				this.moveSol.splice(-1, 1, axisCur * 3 + pow);
			}
			return;
		}
		if (this.moveSol.length > 1 &&
			axisCur % 3 == axisLast % 3 &&
			axisCur == ~~(this.moveSol.at(-2) / 3)) {
			var pow = (curMove % 3 + this.moveSol.at(-2) % 3 + 1) % 4;
			if (pow == 3) {
				this.moveSol.splice(-2, 1, this.moveSol.at(-1));
				this.moveSol.pop();
			} else {
				this.moveSol.splice(-2, 1, axisCur * 3 + pow);
			}
			return;
		}
		this.moveSol.push(curMove);
	}
	Search.prototype.phase2 = function(edge, esym, corn, csym, mid, maxl, depth, lm) {
		if (this.depth1 == 0 && depth == 1 && (this.firstFilter >> ud2std[lm] & 1) != 0) {
			return -1;
		}
		if (edge == 0 && corn == 0 && mid == 0 && (this.preMoveLen > 0 || (this.lastFilter >> ud2std[lm] & 1) == 0)) {
			return maxl;
		}
		var moveMask = ckmv2bit[lm];
		for (var m = 0; m < 10; m++) {
			if ((moveMask >> m & 1) != 0) {
				m += 0x42 >> m & 3;
				continue;
			}
			var midx = MPermMove[mid * N_MOVES2 + m];
			var cornx = CPermMove[corn * N_MOVES2 + SymMoveUD[csym][m]];
			var csymx = SymMult[cornx & 0xf][csym];
			cornx >>= 4;
			if (getPruningMax(MCPermPrunMax, MCPermPrun,
					cornx * N_MPERM + MPermConj[midx << 4 | csymx]) >= maxl) {
				continue;
			}
			var edgex = EPermMove[edge * N_MOVES2 + SymMoveUD[esym][m]];
			var esymx = SymMult[edgex & 0xf][esym];
			edgex >>= 4;
			if (getPruningMax(EPermCCombPPrunMax, EPermCCombPPrun,
					edgex * N_COMB + CCombPConj[(Perm2CombP[cornx] & 0xff) << 4 | SymMultInv[esymx][csymx]]) >= maxl) {
				continue;
			}
			var edgei = getPermSymInv(edgex, esymx, false);
			var corni = getPermSymInv(cornx, csymx, true);
			if (getPruningMax(EPermCCombPPrunMax, EPermCCombPPrun,
					(edgei >> 4) * N_COMB + CCombPConj[(Perm2CombP[corni >> 4] & 0xff) << 4 | SymMultInv[edgei & 0xf][corni & 0xf]]) >= maxl) {
				continue;
			}

			var ret = this.phase2(edgex, esymx, cornx, csymx, midx, maxl - 1, depth + 1, m);
			if (ret >= 0) {
				this.move[depth] = ud2std[m];
				return ret;
			}
		}
		return -1;
	}
	Search.prototype.solutionToString = function() {
		var sb = '';
		var urf = (this.verbose & INVERSE_SOLUTION) != 0 ? (this.urfIdx + 3) % 6 : this.urfIdx;
		if (urf < 3) {
			for (var s = 0; s < this.moveSol.length; ++s) {
				sb += move2str[urfMove[urf][this.moveSol[s]]] + ' ';
			}
		} else {
			for (var s = this.moveSol.length - 1; s >= 0; --s) {
				sb += move2str[urfMove[urf][this.moveSol[s]]] + ' ';
			}
		}
		return sb;
	}

	var moveCube = [];
	var SymCube = [];
	var SymMult = [];
	var SymMultInv = [];
	var SymMove = [];
	var SymMoveUD = [];
	var Sym8Move = [];
	var FlipS2R = [];
	var FlipR2S = [];
	var FlipSelfSym = [];
	var FlipS2RF = [];
	var TwstS2R = [];
	var TwstR2S = [];
	var TwstSelfSym = [];
	var EPermS2R = [];
	var EPermR2S = [];
	var PermSelfSym = [];
	var Perm2CombP = [];
	var PermInvEdgeSym = [];
	var TwstMove = [];
	var FlipMove = [];
	var SliceMove = [];
	var SliceConj = [];
	var SliceTwstPrun = [];
	var SliceFlipPrun = [];
	var TwstFlipPrun = [];

	//phase2
	var CPermMove = [];
	var EPermMove = [];
	var MPermMove = [];
	var MPermConj = [];
	var CCombPMove = [];
	var CCombPConj = [];
	var MCPermPrun = [];
	var EPermCCombPPrun = [];

	var TwstFlipPrunMax = 15;
	var SliceTwstPrunMax = 15;
	var SliceFlipPrunMax = 15;
	var MCPermPrunMax = 15;
	var EPermCCombPPrunMax = 15;

	{ //init move cubes
		for (var i = 0; i < 18; i++) {
			moveCube[i] = new CubieCube()
		}
		moveCube[0].initCoord(15120, 0, 119750400, 0);
		moveCube[3].initCoord(21021, 1494, 323403417, 0);
		moveCube[6].initCoord(8064, 1236, 29441808, 550);
		moveCube[9].initCoord(9, 0, 5880, 0);
		moveCube[12].initCoord(1230, 412, 2949660, 0);
		moveCube[15].initCoord(224, 137, 328552, 137);
		for (var a = 0; a < 18; a += 3) {
			for (var p = 0; p < 2; p++) {
				CubieCube.EdgeMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
				CubieCube.CornMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
			}
		}
		CubieCube.urf1 = new CubieCube().initCoord(2531, 1373, 67026819, 1367);
		CubieCube.urf2 = new CubieCube().initCoord(2089, 1906, 322752913, 2040);
	}

	function initBasic() {
		//init sym cubes
		var c = new CubieCube();
		var d = new CubieCube();
		var t;

		var f2 = new CubieCube().initCoord(28783, 0, 259268407, 0);
		var u4 = new CubieCube().initCoord(15138, 0, 119765538, 7);
		var lr2 = new CubieCube().initCoord(5167, 0, 83473207, 0);
		for (var i = 0; i < 8; i++) {
			lr2.ca[i] |= 3 << 4;
		}
		for (var i = 0; i < 16; i++) {
			SymCube[i] = new CubieCube().init(c.ca, c.ea);
			CubieCube.CornMultFull(c, u4, d);
			CubieCube.EdgeMult(c, u4, d);
			c.init(d.ca, d.ea);
			if (i % 4 == 3) {
				CubieCube.CornMultFull(c, lr2, d);
				CubieCube.EdgeMult(c, lr2, d);
				c.init(d.ca, d.ea);
			}
			if (i % 8 == 7) {
				CubieCube.CornMultFull(c, f2, d);
				CubieCube.EdgeMult(c, f2, d);
				c.init(d.ca, d.ea);
			}
		}

		// gen sym tables
		for (var i = 0; i < 16; i++) {
			SymMult[i] = [];
			SymMultInv[i] = [];
			SymMove[i] = [];
			Sym8Move[i] = [];
			SymMoveUD[i] = [];
		}
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j < 16; j++) {
				SymMult[i][j] = i ^ j ^ (0x14ab4 >> j & i << 1 & 2); // SymMult[i][j] = (i ^ j ^ (0x14ab4 >> j & i << 1 & 2)));
				SymMultInv[SymMult[i][j]][j] = i;
			}
		}

		c = new CubieCube();
		for (var s = 0; s < 16; s++) {
			for (var j = 0; j < 18; j++) {
				CubieCube.CornConjugate(moveCube[j], SymMultInv[0][s], c);
				outloop: for (var m = 0; m < 18; m++) {
					for (var k = 0; k < 8; k++) {
						if (moveCube[m].ca[k] != c.ca[k]) {
							continue outloop;
						}
					}
					SymMove[s][j] = m;
					SymMoveUD[s][std2ud[j]] = std2ud[m];
					break;
				}
				if (s % 2 == 0) {
					Sym8Move[j << 3 | s >> 1] = SymMove[s][j];
				}
			}
		}

		// init sym 2 raw tables
		function initSym2Raw(N_RAW, Sym2Raw, Raw2Sym, SelfSym, coord, setFunc, getFunc) {
			var N_RAW_HALF = (N_RAW + 1) >> 1;
			var c = new CubieCube();
			var d = new CubieCube();
			var count = 0;
			var sym_inc = coord >= 2 ? 1 : 2;
			var conjFunc = coord != 1 ? CubieCube.EdgeConjugate : CubieCube.CornConjugate;

			for (var i = 0; i < N_RAW; i++) {
				if (Raw2Sym[i] !== undefined) {
					continue;
				}
				setFunc.call(c, i);
				for (var s = 0; s < 16; s += sym_inc) {
					conjFunc(c, s, d);
					var idx = getFunc.call(d);
					if (USE_TWST_FLIP_PRUN && coord == 0) {
						FlipS2RF[count << 3 | s >> 1] = idx;
					}
					if (idx == i) {
						SelfSym[count] |= 1 << (s / sym_inc);
					}
					Raw2Sym[idx] = (count << 4 | s) / sym_inc;
				}
				Sym2Raw[count++] = i;
			}
			return count;
		}

		initSym2Raw(N_FLIP, FlipS2R, FlipR2S, FlipSelfSym, 0, CubieCube.prototype.setFlip, CubieCube.prototype.getFlip);
		initSym2Raw(N_TWST, TwstS2R, TwstR2S, TwstSelfSym, 1, CubieCube.prototype.setTwst, CubieCube.prototype.getTwst);
		initSym2Raw(N_PERM, EPermS2R, EPermR2S, PermSelfSym, 2, CubieCube.prototype.setEPerm, CubieCube.prototype.getEPerm);

		var cc = new CubieCube();
		for (var i = 0; i < N_PERM_SYM; i++) {
			setNPerm(cc.ea, EPermS2R[i], 8);
			Perm2CombP[i] = getComb(cc.ea, 0) + getNParity(EPermS2R[i], 8) * 70;
			c.invFrom(cc);
			PermInvEdgeSym[i] = EPermR2S[c.getEPerm()];
		}

		// init coord tables
		c = new CubieCube();
		d = new CubieCube();
		function initSymMoveTable(moveTable, SymS2R, N_SIZE, N_MOVES, setFunc, getFunc, multFunc, ud2std) {
			for (var i = 0; i < N_SIZE; i++) {
				setFunc.call(c, SymS2R[i]);
				for (var j = 0; j < N_MOVES; j++) {
					multFunc(c, moveCube[ud2std ? ud2std[j] : j], d);
					moveTable[i * N_MOVES + j] = getFunc.call(d);
				}
			}
		}

		initSymMoveTable(FlipMove, FlipS2R, N_FLIP_SYM, N_MOVES,
			CubieCube.prototype.setFlip, CubieCube.prototype.getFlipSym, CubieCube.EdgeMult);
		initSymMoveTable(TwstMove, TwstS2R, N_TWST_SYM, N_MOVES,
			CubieCube.prototype.setTwst, CubieCube.prototype.getTwstSym, CubieCube.CornMult);
		initSymMoveTable(EPermMove, EPermS2R, N_PERM_SYM, N_MOVES2,
			CubieCube.prototype.setEPerm, CubieCube.prototype.getEPermSym, CubieCube.EdgeMult, ud2std);
		initSymMoveTable(CPermMove, EPermS2R, N_PERM_SYM, N_MOVES2,
			CubieCube.prototype.setCPerm, CubieCube.prototype.getCPermSym, CubieCube.CornMult, ud2std);

		for (var i = 0; i < N_SLICE; i++) {
			c.setSlice(i);
			for (var j = 0; j < N_MOVES; j++) {
				CubieCube.EdgeMult(c, moveCube[j], d);
				SliceMove[i * N_MOVES + j] = d.getSlice();
			}
			for (var j = 0; j < 16; j += 2) {
				CubieCube.EdgeConjugate(c, SymMultInv[0][j], d);
				SliceConj[i << 3 | j >> 1] = d.getSlice();
			}
		}

		for (var i = 0; i < N_MPERM; i++) {
			c.setMPerm(i);
			for (var j = 0; j < N_MOVES2; j++) {
				CubieCube.EdgeMult(c, moveCube[ud2std[j]], d);
				MPermMove[i * N_MOVES2 + j] = d.getMPerm();
			}
			for (var j = 0; j < 16; j++) {
				CubieCube.EdgeConjugate(c, SymMultInv[0][j], d);
				MPermConj[i << 4 | j] = d.getMPerm();
			}
		}

		for (var i = 0; i < N_COMB; i++) {
			c.setCComb(i % 70);
			for (var j = 0; j < N_MOVES2; j++) {
				CubieCube.CornMult(c, moveCube[ud2std[j]], d);
				CCombPMove[i * N_MOVES2 + j] = d.getCComb() + 70 * ((0xA5 >> j & 1) ^ ~~(i / 70));
			}
			for (var j = 0; j < 16; j++) {
				CubieCube.CornConjugate(c, SymMultInv[0][j], d);
				CCombPConj[i << 4 | j] = d.getCComb() + 70 * ~~(i / 70);
			}
		}
	}

	//init pruning tables
	var InitPrunProgress = -1;

	function initRawSymPrun(PrunTable, N_RAW, N_SYM, RawMove, RawConj, SymMove, SelfSym, PrunFlag) {
		var SYM_SHIFT = PrunFlag & 0xf;
		var SYM_E2C_MAGIC = ((PrunFlag >> 4) & 1) == 1 ? 0x00DDDD00 : 0x00000000;
		var IS_PHASE2 = ((PrunFlag >> 5) & 1) == 1;
		var INV_DEPTH = PrunFlag >> 8 & 0xf;
		var MAX_DEPTH = PrunFlag >> 12 & 0xf;
		var MIN_DEPTH = PrunFlag >> 16 & 0xf;

		var SYM_MASK = (1 << SYM_SHIFT) - 1;
		var ISTFP = RawMove == null;
		var N_SIZE = N_RAW * N_SYM;
		var N_MOVES = IS_PHASE2 ? 10 : 18;
		var NEXT_AXIS_MAGIC = N_MOVES == 10 ? 0x42 : 0x92492;

		var depth = getPruning(PrunTable, N_SIZE) - 1;

		if (depth == -1) {
			for (var i = 0; i < (N_SIZE >> 3) + 1; i++) {
				PrunTable[i] = -1;
			}
			setPruning(PrunTable, 0, 0 ^ 0xf);
			depth = 0;
		} else {
			setPruning(PrunTable, N_SIZE, 0xf ^ (depth + 1));
		}

		var SEARCH_DEPTH = PARTIAL_INIT_LEVEL > 0 ?
			Math.min(Math.max(depth + 1, MIN_DEPTH), MAX_DEPTH) : MAX_DEPTH;

		while (depth < SEARCH_DEPTH) {
			var inv = depth > INV_DEPTH;
			var select = inv ? 0xf : depth;
			var selArrMask = select * 0x11111111;
			var check = inv ? depth : 0xf;
			depth++;
			InitPrunProgress++;
			var xorVal = depth ^ 0xf;
			var done = 0;
			var val = 0;
			for (var i = 0; i < N_SIZE; i++, val >>= 4) {
				if ((i & 7) == 0) {
					val = PrunTable[i >> 3];
					if (!hasZero(val ^ selArrMask)) {
						i += 7;
						continue;
					}
				}
				if ((val & 0xf) != select) {
					continue;
				}
				var raw = i % N_RAW;
				var sym = ~~(i / N_RAW);
				var flip = 0,
					fsym = 0;
				if (ISTFP) {
					flip = FlipR2S[raw];
					fsym = flip & 7;
					flip >>= 3;
				}

				for (var m = 0; m < N_MOVES; m++) {
					var symx = SymMove[sym * N_MOVES + m];
					var rawx;
					if (ISTFP) {
						rawx = FlipS2RF[
							FlipMove[flip * N_MOVES + Sym8Move[m << 3 | fsym]] ^
							fsym ^ (symx & SYM_MASK)];
					} else {
						rawx = RawConj[RawMove[raw * N_MOVES + m] << SYM_SHIFT | symx & SYM_MASK];
					}
					symx >>= SYM_SHIFT;
					var idx = symx * N_RAW + rawx;
					var prun = getPruning(PrunTable, idx);
					if (prun != check) {
						if (prun < depth - 1) {
							m += NEXT_AXIS_MAGIC >> m & 3;
						}
						continue;
					}
					done++;
					if (inv) {
						setPruning(PrunTable, i, xorVal);
						break;
					}
					setPruning(PrunTable, idx, xorVal);
					for (var j = 1, selfSym = SelfSym[symx];
							(selfSym >>= 1) != 0; j++) {
						if ((selfSym & 1) != 1) {
							continue;
						}
						var idxx = symx * N_RAW;
						if (ISTFP) {
							idxx += FlipS2RF[FlipR2S[rawx] ^ j];
						} else {
							idxx += RawConj[rawx << SYM_SHIFT | (j ^ (SYM_E2C_MAGIC >> (j << 1) & 3))];
						}
						if (getPruning(PrunTable, idxx) == check) {
							setPruning(PrunTable, idxx, xorVal);
							done++;
						}
					}
				}
			}
			// console.log(depth, done, InitPrunProgress);
		}
		setPruning(PrunTable, N_SIZE, (depth + 1) ^ 0xf);
		return depth + 1;
	}

	function doInitPrunTables(targetProgress) {
		if (USE_TWST_FLIP_PRUN) {
			TwstFlipPrunMax = initRawSymPrun(
				TwstFlipPrun, N_FLIP, N_TWST_SYM,
				null, null,
				TwstMove, TwstSelfSym, 0x19603
			);
		}
		if (InitPrunProgress > targetProgress) {
			return;
		}
		SliceTwstPrunMax = initRawSymPrun(
			SliceTwstPrun, N_SLICE, N_TWST_SYM,
			SliceMove, SliceConj,
			TwstMove, TwstSelfSym, 0x69603
		);
		if (InitPrunProgress > targetProgress) {
			return;
		}
		SliceFlipPrunMax = initRawSymPrun(
			SliceFlipPrun, N_SLICE, N_FLIP_SYM,
			SliceMove, SliceConj,
			FlipMove, FlipSelfSym, 0x69603
		);
		if (InitPrunProgress > targetProgress) {
			return;
		}
		MCPermPrunMax = initRawSymPrun(
			MCPermPrun, 24, N_PERM_SYM,
			MPermMove, MPermConj,
			CPermMove, PermSelfSym, 0x8ea34
		);
		if (InitPrunProgress > targetProgress) {
			return;
		}
		EPermCCombPPrunMax = initRawSymPrun(
			EPermCCombPPrun, N_COMB, N_PERM_SYM,
			CCombPMove, CCombPConj,
			EPermMove, PermSelfSym, 0x7d824
		);
	}

	function initPrunTables() {
		if (InitPrunProgress < 0) {
			initBasic();
			InitPrunProgress = 0;
		}
		if (InitPrunProgress == 0) {
			doInitPrunTables(99);
		} else if (InitPrunProgress < 54) {
			doInitPrunTables(InitPrunProgress);
		} else {
			return true;
		}
		return false;
	}

	function randomCube() {
		var ep, cp;
		var eo = ~~(Math.random() * 2048);
		var co = ~~(Math.random() * 2187);
		do {
			ep = ~~(Math.random() * fact[12]);
			cp = ~~(Math.random() * fact[8]);
		} while (getNParity(cp, 8) != getNParity(ep, 12));
		var cc = new CubieCube().initCoord(cp, co, ep, eo);
		return cc.toFaceCube();
	}
	function fromScramble(s) {
		var j = 0;
		var axis = -1;
		var c1 = new CubieCube();
		var c2 = new CubieCube();
		for (var i = 0; i < s.length; i++) {
			switch (s[i]) {
				case 'U':
				case 'R':
				case 'F':
				case 'D':
				case 'L':
				case 'B':
					axis = "URFDLB".indexOf(s[i]) * 3;
					break;
				case ' ':
					if (axis != -1) {
						CubieCube.CornMult(c1, moveCube[axis], c2);
						CubieCube.EdgeMult(c1, moveCube[axis], c2);
						c1.init(c2.ca, c2.ea);
					}
					axis = -1;
					break;
				case '2':
					axis++;
					break;
				case '\'':
					axis += 2;
					break;
				default:
					continue;
			}
		}
		if (axis != -1) {
			CubieCube.CornMult(c1, moveCube[axis], c2);
			CubieCube.EdgeMult(c1, moveCube[axis], c2);
			c1.init(c2.ca, c2.ea);
		}
		return c2.toFaceCube();
	}

	return {
		Search: Search,
		solve: function(facelet) {
			return new Search().solution(facelet);
		},
		randomCube: randomCube,
		fromScramble: fromScramble,
		initFull: function() {
			PARTIAL_INIT_LEVEL = 0;
			initPrunTables();
		},
		INVERSE_SOLUTION: INVERSE_SOLUTION
	}
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = min2phase;
}

/* ==== lib/cubeutil.js ==== */
"use strict";

var cubeutil = (function() {

	function toEqus(facelet) {
		var col2equ = {};
		for (var i = 0; i < facelet.length; i++) {
			var col = facelet[i];
			if (col == '-') {
				continue;
			}
			col2equ[col] = col2equ[col] || [];
			col2equ[col].push(i);
		}
		var equs = [];
		for (var col in col2equ) {
			if (col2equ[col].length > 1) {
				equs.push(col2equ[col]);
			}
		}
		return equs;
	}

	var crossMask = toEqus("----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-");
	var f2l1Mask = toEqus("----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-");
	var f2l2Mask = toEqus("----U--------R--R----FF-FF-DD-DDD-D-----LL-LL----B--B-");
	var f2l3Mask = toEqus("----U--------RR-RR----F--F--D-DDD-DD----L--L----BB-BB-");
	var f2l4Mask = toEqus("----U--------R--R-----F--F--D-DDDDD----LL-LL-----BB-BB");
	var f2lMask = toEqus("----U-------RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB");
	var ollMask = toEqus("UUUUUUUUU---RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB");
	var eollMask = toEqus("-U-UUU-U----RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB");
	var cpllMask = toEqus("UUUUUUUUUr-rRRRRRRf-fFFFFFFDDDDDDDDDl-lLLLLLLb-bBBBBBB");
	var roux1Mask = toEqus("---------------------F--F--D--D--D-----LLLLLL-----B--B");
	var roux2Mask = toEqus("------------RRRRRR---F-FF-FD-DD-DD-D---LLLLLL---B-BB-B");
	var roux3Mask = toEqus("U-U---U-Ur-rRRRRRRf-fF-FF-FD-DD-DD-Dl-lLLLLLLb-bB-BB-B");
	var LLPattern = "012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB";
	var c2LLPattern = "0-1---2-36-7---R-R4-5---F-FD-D---D-Da-b---L-L8-9---B-B";
	var c2LLMask = toEqus("---------------R-R------F-FD-D---D-D------L-L------B-B");
	var solvedMask = toEqus(mathlib.SOLVED_FACELET);

	var cubeRots = (function genRots() {

		function faceletRot(facelet, rot) {
			var ret = [];
			for (var i = 0; i < 54; i++) {
				ret[rot[i]] = facelet[i];
			}
			return ret;
		}

		var cubeRotY = mathlib.CubieCube.rotCube[3].toPerm(); mathlib.circle(cubeRotY, 13, 49, 40, 22);
		var cubeRotX = mathlib.CubieCube.rotCube[15].toPerm(); mathlib.circle(cubeRotX, 4, 22, 31, 49);
		var cubeRotZ = mathlib.CubieCube.rotCube[17].toPerm(); mathlib.circle(cubeRotZ, 4, 40, 31, 13);

		var ret = [];
		var cur = [];
		for (var i = 0; i < 54; i++) {
			cur[i] = i;
		}
		for (var a = 0; a < 24; a++) {
			ret[a] = cur.slice();
			cur = faceletRot(cur, (a & 1) ? cubeRotX : cubeRotZ);
			if (a % 6 == 5) {
				cur = faceletRot(cur, cubeRotZ);
				cur = faceletRot(cur, cubeRotZ);
			}
			if (a % 12 == 11) {
				cur = faceletRot(cur, cubeRotY);
				cur = faceletRot(cur, cubeRotY);
			}
		}
		return ret;
	})();

	function solvedProgressCubie(param, mask) {
		var faceGetter = function(i) {
			var src = mathlib.CubieCube.faceMap[i];
			var ret = 0;
			if (!src) {
				ret = i;
			} else if (src[0] == 0) {
				var val = facelet.ca[src[1]];
				ret = mathlib.CubieCube.cFacelet[val & 0x7][(3 - (val >> 3) + src[2]) % 3];
			} else if (src[0] == 1) {
				var val = facelet.ea[src[1]];
				ret = mathlib.CubieCube.eFacelet[val >> 1][(val & 1) ^ src[2]];
			}
			return ~~(ret / 9);
		};
		var cubeRot = cubeRots[param[1]];
		var facelet = param[0];
		mask = mask || solvedMask;
		for (var i = 0; i < mask.length; i++) {
			var equ = mask[i];
			var col = faceGetter(cubeRot[equ[0]]);
			for (var j = 1; j < equ.length; j++) {
				if (faceGetter(cubeRot[equ[j]]) != col) {
					return 1;
				}
			}
		}
		return 0;
	}

	function solvedProgress(param, mask) {
		if (param[0] instanceof mathlib.CubieCube) {
			return solvedProgressCubie(param, mask);
		}
		var cubeRot = cubeRots[param[1]];
		var facelet = param[0];
		mask = mask || solvedMask;
		for (var i = 0; i < mask.length; i++) {
			var equ = mask[i];
			var col = facelet[cubeRot[equ[0]]];
			for (var j = 1; j < equ.length; j++) {
				if (facelet[cubeRot[equ[j]]] != col) {
					return 1;
				}
			}
		}
		return 0;
	}

	//return 9: nothing, 8: cross solved, 4~7: nth f2l solved, 2~3 c/e oll solved, 1 cpll solved, 0: solved
	function getCF4O2P2Progress(param) {
		if (solvedProgress(param, crossMask)) {
			return 9;
		} else if (solvedProgress(param, f2lMask)) {
			return 4 +
				solvedProgress(param, f2l1Mask) +
				solvedProgress(param, f2l2Mask) +
				solvedProgress(param, f2l3Mask) +
				solvedProgress(param, f2l4Mask);
		} else if (solvedProgress(param, eollMask)) {
			return 4;
		} else if (solvedProgress(param, ollMask)) {
			return 3;
		} else if (solvedProgress(param, cpllMask)) {
			return 2;
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	//return 7: nothing, 6: cross solved, 2~5: nth f2l solved, 1 oll solved, 0: solved
	function getCF4OPProgress(param) {
		if (solvedProgress(param, crossMask)) {
			return 7;
		} else if (solvedProgress(param, f2lMask)) {
			return 2 +
				solvedProgress(param, f2l1Mask) +
				solvedProgress(param, f2l2Mask) +
				solvedProgress(param, f2l3Mask) +
				solvedProgress(param, f2l4Mask);
		} else if (solvedProgress(param, ollMask)) {
			return 2;
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	//return 4: nothing, 3: cross solved, 2: f2l solved, 1 oll solved, 0: solved
	function getCFOPProgress(param) {
		if (solvedProgress(param, crossMask)) {
			return 4;
		} else if (solvedProgress(param, f2lMask)) {
			return 3;
		} else if (solvedProgress(param, ollMask)) {
			return 2;
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	//return 6: nothing, 5: cross solved, 2~4: nth f2l solved, 1 eoll solved, 0: solved
	function getCF3ZBProgress(param) {
		if (solvedProgress(param, crossMask)) {
			return 6;
		} else if (solvedProgress(param, eollMask)) {
			return 1 + Math.max(1,
				solvedProgress(param, f2l1Mask) +
				solvedProgress(param, f2l2Mask) +
				solvedProgress(param, f2l3Mask) +
				solvedProgress(param, f2l4Mask)
			);
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	//return 2: nothing, 1: f2l solved, 0: solved
	function getFPProgress(param) {
		if (solvedProgress(param, f2lMask)) {
			return 2;
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	//return 4: nothing, 3: block1, 2: block2, 1: cll, 0: solved
	function getRouxProgress(param) {
		if (solvedProgress(param, roux1Mask)) {
			return 4;
		} else if (solvedProgress(param, roux2Mask)) {
			return 3;
		} else if (solvedProgress(param, roux3Mask)) {
			return 2;
		} else if (solvedProgress(param)) {
			return 1;
		}
		return 0;
	}

	var stepParams = {
		'cross': [6, crossMask],
		'f2l':   [6, f2lMask],
		'oll':   [6, ollMask],
		'eoll':  [6, eollMask],
		'cpll':  [6, cpllMask],
		'fb':    [24, roux1Mask],
		'sb':    [24, roux2Mask],
		'cmll':  [24, roux3Mask]
	};

	//return 0: solved, 1 not solved
	function calcStepProgress(step, param) {
		if (step in stepParams) {
			return solvedProgress(param, stepParams[step][1]);
		}
		return solvedProgress(param);
	}

	function getStepProgress(step, facelet, n_axis) {
		if (!n_axis) {
			n_axis = (step in stepParams) ? stepParams[step][0] : 1;
		}
		return getProgressNAxis(facelet, calcStepProgress.bind(null, step), n_axis);
	}

	//6 axes: D -x-> B -z-> R -x-> U -z-> F -x-> L -z-> D
	function getProgressNAxis(facelet, process, n_axis) {
		var minRet = 99;
		for (var a = 0; a < n_axis; a++) {
			minRet = Math.min(minRet, process([facelet, a]));
		}
		return minRet;
	}

	var centerRot = [
		[0, 2, 4, 3, 5, 1], // y'
		[5, 1, 0, 2, 4, 3], // x'
		[4, 0, 2, 1, 3, 5] // z
	];

	function moveSeq2str(moveSeq) {
		return $.map(moveSeq, function(val) {
			return val[0].trim() + '@' + val[1];
		}).join(' ');
	}

	//rawMoveSeqs: [moveseq, moveseq, ..., moveseq]
	//moveseq: [[move, timestamp], [move, timestamp], ..., [move, timestamp]]
	//move: string [URFDLB][ 2']
	//return: [[movestr, length], [movestr, length], ..., [movestr, length]]
	function getPrettyMoves(rawMoveSeqs) {
		// console.log(rawAlgs);
		var center = [0, 1, 2, 3, 4, 5];

		return $.map(rawMoveSeqs, function(moveSeq, seqIdx) {
			var ret = [];

			function pushSol(axis, pow) {
				if (ret.length == 0 || ~~(ret.at(-1) / 3) != axis) {
					ret.push(axis * 3 + pow);
					return;
				}
				pow = (pow + ret.at(-1) % 3 + 1) % 4;
				if (pow == 3) {
					ret.pop();
				} else {
					ret.splice(-1, 1, axis * 3 + pow);
				}
			}

			for (var i = 0; i < moveSeq.length; i++) {
				var axis = center.indexOf("URFDLB".indexOf(moveSeq[i][0][0]));
				var pow = " 2'".indexOf(moveSeq[i][0][1]) % 3;
				if (i == moveSeq.length - 1 || moveSeq[i + 1][1] - moveSeq[i][1] > 100) {
					pushSol(axis, pow);
					continue;
				}
				var axis2 = center.indexOf("URFDLB".indexOf(moveSeq[i + 1][0][0]));
				var pow2 = " 2'".indexOf(moveSeq[i + 1][0][1]) % 3;
				if (axis != axis2 && axis % 3 == axis2 % 3 && pow + pow2 == 2) {
					var axisM = axis % 3;
					var powM = (pow - 1) * [1, 1, -1, -1, -1, 1][axis] + 1;
					pushSol(axisM + 6, powM)
					for (var p = 0; p < powM + 1; p++) {
						var center_ = [];
						for (var c = 0; c < 6; c++) {
							center_[c] = center[centerRot[axisM][c]];
						}
						center = center_;
					}
					i++;
					continue;
				}
				pushSol(axis, pow);
			}
			return [
				[$.map(ret, function(val) {
					return "URFDLBEMS".charAt(~~(val / 3)) + " 2'".charAt(val % 3);
				}).join(""), ret.length]
			];
		});
	}

	var identPLL = (function() {
		var pllPattern = [];
		return function(facelet) {
			for (var i = pllPattern.length; i < 22; i++) {
				var param = i == 21 ? 'UUUUUUUUUFFFRRRBBBLLL' : scramble_333.getPLLImage(i)[0];
				pllPattern.push(toEqus(LLPattern.replace(/[0-9a-z]/g, function(v) {
					return param[parseInt(v, 36)].toLowerCase();
				})));
			}
			return searchCaseByPattern(facelet, ollMask, pllPattern);
		}
	})();

	var identOLL = (function() {
		var ollPattern = [];
		return function(facelet) {
			for (var i = ollPattern.length; i < 58; i++) {
				var param = scramble_333.getOLLImage(i)[0].replace(/G/g, '-');
				ollPattern.push(toEqus(LLPattern.replace(/[0-9a-z]/g, function(v) {
					return param[parseInt(v, 36)].toLowerCase();
				})));
			}
			return searchCaseByPattern(facelet, f2lMask, ollPattern);
		}
	})();

	var identCOLL = (function() {
		var collPattern = [];
		return function(facelet) {
			for (var i = collPattern.length; i < 43; i++) {
				var param = scramble_333.getCOLLImage('D', i)[0].replace(/G/g, '-');
				collPattern.push(toEqus(LLPattern.replace(/[0-9a-z]/g, function(v) {
					return param[parseInt(v, 36)].toLowerCase();
				})));
			}
			return searchCaseByPattern(facelet, eollMask, collPattern);
		}
	})();

	var identZBLL = (function() {
		var zbllPattern = [];
		return function(facelet) {
			for (var i = zbllPattern.length; i < 493; i++) {
				var param = scramble_333.getZBLLImage(i)[0].replace(/G/g, '-');
				zbllPattern.push(toEqus(LLPattern.replace(/[0-9a-z]/g, function(v) {
					return param[parseInt(v, 36)].toLowerCase();
				})));
			}
			return searchCaseByPattern(facelet, eollMask, zbllPattern);
		}
	})();

	var identC2CLL = (function() {
		var cllPattern = [];
		return function(facelet) {
			for (var i = cllPattern.length; i < 40; i++) {
				var param = scramble_222.getEGLLImage(i)[0].replace(/G/g, '-');
				cllPattern.push(toEqus(c2LLPattern.replace(/[0-9a-z]/g, function(v) {
					return param[parseInt(v, 36)].toLowerCase();
				})));
			}
			return searchCaseByPattern(facelet, c2LLMask, cllPattern);
		}
	})();

	function searchCaseByPattern(facelet, baseMask, patterns) {
		var chkList = [];
		for (var a = 0; a < 24; a++) {
			if (solvedProgress([facelet, a], baseMask) == 0) {
				chkList.push(a);
			}
		}
		for (var i = 0; i < patterns.length; i++) {
			for (var j = 0; j < chkList.length; j++) {
				if (solvedProgress([facelet, chkList[j]], patterns[i]) == 0) {
					return i;
				}
			}
		}
		return -1;
	}

	function identStep(step, facelet) {
		switch (step) {
			case 'PLL':
				return identPLL(facelet);
			case 'OLL':
				return identOLL(facelet);
			case 'COLL':
				return identCOLL(facelet);
			case 'ZBLL':
				return identZBLL(facelet);
			case 'C2CLL':
				return identC2CLL(facelet);
		}
	}

	function getIdentData(method) {
		var identData = {
			//name: [ident, genImg, startIdx, endIdx, stageIdx]
			'PLL': [identPLL, scramble_333.getPLLImage, 0, 21, 0],
			'OLL': [identOLL, scramble_333.getOLLImage, 1, 58, 1],
			'COLL': [identCOLL, scramble_333.getCOLLImage.bind(null, 'D'), 0, 40, 1],
			'ZBLL': [identZBLL, scramble_333.getZBLLImage, 0, 493, 0],
			'CLL': [identC2CLL, scramble_222.getEGLLImage, 0, 40, 1]
		};
		return method ? identData[method] : identData;
	}

	function getScrambledState(scramble, reqFace) {
		var scrType = scramble[0];
		var scrSeq = scramble[1];
		if (!tools.isPuzzle('333', scramble)) {
			return;
		}
		var scr = parseScramble(scrSeq, "URFDLB");
		var c = new mathlib.CubieCube();
		var d = new mathlib.CubieCube();
		c.ori = 0;
		for (var i = 0; i < scr.length; i++) {
			var axis = scr[i][0];
			var pow = scr[i][2];
			var m = axis * 3 + pow - 1;
			if (m < 0 || m >= 18) {
				continue;
			}
			if (scr[i][1] == 2) { //Xw
				var rot = [3, 15, 17, 1, 11, 23][axis];
				for (var j = 0; j < pow; j++) {
					c.ori = mathlib.CubieCube.rotMult[rot][c.ori];
				}
				m = mathlib.CubieCube.rotMulM[c.ori][(axis + 3) % 6 * 3 + pow - 1];
			}
			mathlib.CubieCube.CubeMult(c, mathlib.CubieCube.moveCube[m], d);
			c.init(d.ca, d.ea);
		}
		return reqFace ? c.toFaceCube() : c;
	}

	function getProgress(facelet, method) {
		switch (method) {
			case 'cfop':
				return getProgressNAxis(facelet, getCFOPProgress, 6);
			case 'fp':
				return getProgressNAxis(facelet, getFPProgress, 6);
			case 'cf4op':
				return getProgressNAxis(facelet, getCF4OPProgress, 6);
			case 'roux':
				return getProgressNAxis(facelet, getRouxProgress, 24);
			case 'cf4o2p2':
				return getProgressNAxis(facelet, getCF4O2P2Progress, 6);
			case 'cf3zb':
				return getProgressNAxis(facelet, getCF3ZBProgress, 6);
			case 'n':
				return getProgressNAxis(facelet, solvedProgress, 1);
		}
	}

	function getStepNames(method) {
		switch (method) {
			case 'cfop':
				return ['pll', 'oll', 'f2l', 'cross'];
			case 'fp':
				return ['op', 'cf'];
			case 'cf4op':
				return ['pll', 'oll', 'f2l-4', 'f2l-3', 'f2l-2', 'f2l-1', 'cross'];
			case 'roux':
				return ['l6e', 'cmll', 'sb', 'fb'];
			case 'cf4o2p2':
				return ['pll', 'cpll', 'oll', 'eoll', 'f2l-4', 'f2l-3', 'f2l-2', 'f2l-1', 'cross'];
			case 'cf3zb':
				return ['zbll', 'zbf2l', 'f2l-3', 'f2l-2', 'f2l-1', 'cross'];
			case 'n':
				return ['solve'];
		}
	}

	function getStepCount(method) {
		var stepNames = getStepNames(method);
		return stepNames ? stepNames.length : 0;
	}

	function getPrettyReconstruction(rawMoves, method) {
		var prettySolve = "";
		var prettyMoves = getPrettyMoves(rawMoves);
		var stepNames = getStepNames(method).reverse();
		var totalMoves = 0;
		for (var i = 0; i < prettyMoves.length; i++) {
			totalMoves += prettyMoves[i][1];
			prettySolve += prettyMoves[i][0].replace(/ /g, '') + (stepNames[i] ? " // " + stepNames[i] + " " + prettyMoves[i][1] + " move(s)" : "") + "\n";
		}
		return {
			prettySolve: prettySolve,
			totalMoves: totalMoves
		};
	}

	var scrambleReg = /^([\d]+(?:-\d+)?)?([FRUBLDfrubldzxySME])(?:([w])|&sup([\d]);)?([2'])?$/;

	function parseScramble(scramble, moveMap, addPreScr) {
		scramble = scramble || '';
		if (addPreScr) {
			scramble = kernel.getProp(tools.isCurTrainScramble() ? 'preScrT' : 'preScr') + ' ' + scramble;
		}
		var moveseq = [];
		var moves = scramble.split(' ');
		var m, w, f, p;
		for (var s = 0; s < moves.length; s++) {
			m = scrambleReg.exec(moves[s]);
			if (m == null) {
				continue;
			}
			f = "FRUBLDfrubldzxySME".indexOf(m[2]);
			if (f > 14) {
				p = "2'".indexOf(m[5] || 'X') + 2;
				f = [0, 4, 5][f % 3];
				moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 2, p]);
				moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 1, 4 - p]);
				continue;
			}
			w = (m[1] || '').split('-');
			var w2 = ~~w[1] || -1;
			w = f < 12 ? (~~w[0] || ~~m[4] || ((m[3] == "w" || f > 5) && 2) || 1) : -1;
			p = (f < 12 ? 1 : -1) * ("2'".indexOf(m[5] || 'X') + 2);
			moveseq.push([moveMap.indexOf("FRUBLD".charAt(f % 6)), w, p, w2]);
		}
		return moveseq;
	}

	function getConjMoves(moves, inv, conj) {
		if (!moves) {
			return moves;
		}
		if (conj === undefined) {
			conj = getPreConj();
		}
		if (inv) {
			conj = mathlib.CubieCube.rotMulI[0][conj || 0];
		}
		return moves.replace(/[URFDLB]/g, function(face) {
			return "URFDLB".charAt(mathlib.CubieCube.rotMulM[conj]["URFDLB".indexOf(face) * 3] / 3);
		});
	}

	function getPreConj() { // TODO 24 cases, use map insetad of calculation
		var preScr = kernel.getProp(tools.isCurTrainScramble() ? 'preScrT' : 'preScr', '').split(' ');
		var cc = new mathlib.CubieCube();
		for (var i = 0; i < preScr.length; i++) {
			cc.selfMoveStr(preScr[i]);
		}
		return cc.ori || 0;
	}

	function getAlgCubingUrl(alg, setup, puzzle) {
		var dim = {
			'222': '2x2x2',
			'333': '3x3x3',
			'444': '4x4x4',
			'555': '5x5x5',
			'666': '6x6x6',
			'777': '7x7x7'
		};
		if (puzzle && !dim[puzzle] && typeof tools != 'undefined' && tools.puzzleType) {
			puzzle = tools.puzzleType(puzzle) || puzzle;
		}
		if (!puzzle || !dim[puzzle]) {
			puzzle = (typeof tools != 'undefined' && tools.getCurPuzzle && tools.getCurPuzzle()) || '333';
		}
		var url = 'https://alg.cubing.net/?alg=' + encodeURIComponent(alg || '') +
			'&setup=' + encodeURIComponent(setup || '');
		if (dim[puzzle]) {
			url += '&puzzle=' + dim[puzzle];
		}
		return url;
	}

	function cornersEqual(a, b) {
		for (var i = 0; i < 8; i++) {
			if (a.ca[i] != b.ca[i]) {
				return false;
			}
		}
		return true;
	}

	function cubiesMatch(a, b, cornerOnly) {
		return cornerOnly ? cornersEqual(a, b) : a.isEqual(b);
	}

	function isFaceletSolved(facelet, cornerOnly) {
		if (!cornerOnly) {
			return facelet == mathlib.SOLVED_FACELET;
		}
		for (var i = 0; i < 54; i++) {
			if (i % 9 % 2 == 0 && facelet[i] != mathlib.SOLVED_FACELET[i]) {
				return false;
			}
		}
		return true;
	}

	return {
		getProgress: getProgress,
		getStepNames: getStepNames,
		getStepCount: getStepCount,
		getStepProgress: getStepProgress,
		getPrettyMoves: getPrettyMoves,
		getPrettyReconstruction: getPrettyReconstruction,
		moveSeq2str: moveSeq2str,
		getScrambledState: getScrambledState,
		identStep: identStep,
		getIdentData: getIdentData,
		parseScramble: parseScramble,
		getConjMoves: getConjMoves,
		getPreConj: getPreConj,
		getAlgCubingUrl: getAlgCubingUrl,
		cubiesMatch: cubiesMatch,
		isFaceletSolved: isFaceletSolved
	}
})();

/* ==== solver/ftocta.js ==== */
var ftosolver = (function() {
	"use strict";
	//face-turning octahedron cube w/o identical pieces
	function FtoCubie(cp, co, ep, uf, rl) {
		this.cp = (cp && cp.slice()) || [0, 1, 2, 3, 4, 5];
		this.co = (co && co.slice()) || [0, 0, 0, 0, 0, 0];
		this.ep = (ep && ep.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this.uf = (uf && uf.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this.rl = (rl && rl.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	}

	var U = 0, F = 9, r = 18, l = 27, D = 36, B = 45, R = 54, L = 63;

	var cornFacelets = [
		[U + 0, R + 0, F + 0, L + 0],
		[U + 4, B + 8, r + 4, R + 8],
		[U + 8, L + 4, l + 8, B + 4],
		[l + 0, D + 0, r + 0, B + 0],
		[F + 4, D + 8, l + 4, L + 8],
		[r + 8, D + 4, F + 8, R + 4]
	];

	var edgeFacelets = [
		[U + 1, R + 3], [U + 3, L + 1], [U + 6, B + 6],
		[l + 1, D + 3], [r + 3, D + 1], [F + 6, D + 6],
		[F + 3, R + 1], [F + 1, L + 3], [l + 6, L + 6],
		[l + 3, B + 1], [r + 1, B + 3], [r + 6, R + 6]
	];

	var ctufFacelets = [
		U + 2, U + 5, U + 7,
		F + 2, F + 5, F + 7,
		r + 2, r + 5, r + 7,
		l + 2, l + 5, l + 7
	];

	var ctrlFacelets = [
		D + 2, D + 5, D + 7,
		B + 2, B + 5, B + 7,
		L + 2, L + 5, L + 7,
		R + 2, R + 5, R + 7
	];

	FtoCubie.prototype.isEqual = function(fc) {
		for (var i = 0; i < 12; i++) {
			if (this.ep[i] != fc.ep[i] || this.uf[i] != fc.uf[i] || this.rl[i] != fc.rl[i]
					|| i < 6 && (this.cp[i] != fc.cp[i] || this.co[i] != fc.co[i])) {
				return false;
			}
		}
		return true;
	}

	FtoCubie.prototype.toFaceCube = function(todiv) {
		var f = [];
		todiv = todiv || 9;
		var co = [];
		for (var i = 0; i < 6; i++) {
			co[i] = this.co[i] * 2;
		}
		mathlib.fillFacelet(cornFacelets, f, this.cp, co, todiv);
		mathlib.fillFacelet(edgeFacelets, f, this.ep, [], todiv);
		mathlib.fillFacelet(ctufFacelets, f, this.uf, null, todiv);
		mathlib.fillFacelet(ctrlFacelets, f, this.rl, null, todiv);
		return f;
	}

	FtoCubie.prototype.fromFacelet = function(facelet) {
		var count = 0;
		var f = [];
		for (var i = 0; i < 72; ++i) {
			f[i] = facelet[i];
			count += Math.pow(16, f[i]);
		}
		if (count != 0x99999999) {
			return -1;
		}
		var co = [];
		if (mathlib.detectFacelet(cornFacelets, f, this.cp, co, 9) == -1
				|| mathlib.detectFacelet(edgeFacelets, f, this.ep, [], 9) == -1) {
			return -1;
		}
		var parity = 0;
		for (var i = 0; i < 6; i++) {
			this.co[i] = co[i] >> 1;
			parity ^= this.co[i];
		}
		if (parity != 0
				|| mathlib.getNParity(mathlib.getNPerm(this.cp, 6), 6) != 0
				|| mathlib.getNParity(mathlib.getNPerm(this.ep, 12), 12) != 0) {
			return -1;
		}
		var remainCnts = [3, 3, 3, 3];
		for (var i = 0; i < 12; i++) {
			var col = f[ctufFacelets[i]];
			if (!(remainCnts[col] > 0)) {
				return -1;
			}
			this.uf[i] = col * 3 + 3 - remainCnts[col];
			remainCnts[col]--;
		}
		remainCnts = [3, 3, 3, 3];
		for (var i = 0; i < 12; i++) {
			var col = [0, 1, 3, 2][f[ctrlFacelets[i]] - 4];
			if (!(remainCnts[col] > 0)) {
				return -1;
			}
			this.rl[i] = col * 3 + 3 - remainCnts[col];
			remainCnts[col]--;
		}
		if (mathlib.getNParity(mathlib.getNPerm(this.uf, 12), 12) != 0) {
			for (var i = 0; i < 12; i++) { // swap 0 and 1 to fix parity
				this.uf[i] ^= this.uf[i] < 2 ? 1 : 0;
			}
		}
		if (mathlib.getNParity(mathlib.getNPerm(this.rl, 12), 12) != 0) {
			for (var i = 0; i < 12; i++) { // swap 0 and 1 to fix parity
				this.rl[i] ^= this.rl[i] < 2 ? 1 : 0;
			}
		}
		return this;
	}

	FtoCubie.prototype.toString = function(todiv) {
		var f = this.toFaceCube(todiv);
		var ret = '' +
			'  U8 U7 U6 U5 U4      B8 B7 B6 B5 B4\n' +
			'L4   U3 U2 U1   R8  r4   B3 B2 B1   l8\n' +
			'L5 L1   U0   R3 R7  r5 r1   B0   l3 l7\n' +
			'L6 L2 L0  R0 R2 R6  r6 r2 r0  l0 l2 l6\n' +
			'L7 L3   F0   R1 R5  r7 r3   D0   l1 l5\n' +
			'L8   F1 F2 F3   R4  r8   D1 D2 D3   l4\n' +
			'  F4 F5 F6 F7 F8      D4 D5 D6 D7 D8';
		ret = ret.replace(/([UFrlDBRL])([0-8])/g, function(m, p1, p2) {
			var i = 'UFrlDBRL'.indexOf(p1) * 9 + (~~p2);
			return 'UFrlDBRL' [~~(f[i] / 9)] + (f[i] % 9);
		});
		return ret;
	}

	FtoCubie.FtoMult = function() {
		var args = Array.from(arguments);
		var prod = args.pop() || new FtoCubie();
		return args.reduceRight((b, a) => {
			for (var i = 0; i < 6; i++) {
				prod.co[i] = a.co[b.cp[i]] ^ b.co[i];
				prod.cp[i] = a.cp[b.cp[i]];
			}
			for (var i = 0; i < 12; i++) {
				prod.ep[i] = a.ep[b.ep[i]];
				prod.uf[i] = a.uf[b.uf[i]];
				prod.rl[i] = a.rl[b.rl[i]];
			}
			return prod;
		});
	}

	function initMoveCube() {
		var rotU = new FtoCubie( //move[U]
			[1, 2, 0, 4, 5, 3], [0, 0, 0, 0, 0, 0], [2, 0, 1, 5, 3, 4, 10, 11, 6, 7, 8, 9],
			[1, 2, 0, 7, 8, 6, 10, 11, 9, 4, 5, 3], [2, 0, 1, 8, 6, 7, 11, 9, 10, 5, 3, 4]);
		var rotR = new FtoCubie( //move[R]
			[5, 0, 4, 2, 3, 1], [1, 1, 0, 1, 1, 0], [6, 5, 7, 9, 2, 10, 11, 4, 3, 8, 1, 0],
			[5, 3, 4, 8, 6, 7, 2, 0, 1, 11, 9, 10], [4, 5, 3, 7, 8, 6, 1, 2, 0, 10, 11, 9]);

		var rotUi = FtoCubie.FtoMult(rotU, rotU, null);
		var rotRi = FtoCubie.FtoMult(rotR, rotR, null);
		var rotL = FtoCubie.FtoMult(rotUi, rotR, rotU, null);
		var rotF = FtoCubie.FtoMult(rotR, rotU, rotRi, null);

		var moveCube = [];
		moveCube[0] = new FtoCubie( //moveU
			[1, 2, 0, 3, 4, 5], [0, 0, 0, 0, 0, 0], [2, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			[1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, 3, 6, 7, 11, 9, 8, 5, 10, 4]);
		moveCube[2] = new FtoCubie( //moveF
			[4, 1, 2, 3, 5, 0], [1, 0, 0, 0, 1, 0], [0, 1, 2, 3, 4, 6, 7, 5, 8, 9, 10, 11],
			[0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11], [0, 9, 10, 3, 4, 5, 2, 7, 1, 8, 6, 11]);
		moveCube[4] = new FtoCubie( //mover
			[0, 5, 2, 1, 4, 3], [0, 1, 0, 0, 0, 1], [0, 1, 2, 3, 10, 5, 6, 7, 8, 9, 11, 4],
			[0, 1, 2, 3, 4, 5, 7, 8, 6, 9, 10, 11], [5, 3, 2, 11, 4, 10, 6, 7, 8, 9, 0, 1]);
		moveCube[6] = new FtoCubie( //movel
			[0, 1, 3, 4, 2, 5], [0, 0, 1, 1, 0, 0], [0, 1, 2, 8, 4, 5, 6, 7, 9, 3, 10, 11],
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9], [8, 1, 7, 2, 0, 5, 6, 3, 4, 9, 10, 11]);
		moveCube[8] = new FtoCubie( //moveD
			[0, 1, 2, 5, 3, 4], [0, 0, 0, 0, 0, 0], [0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11],
			[0, 1, 2, 3, 9, 10, 5, 7, 4, 8, 6, 11], [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
		moveCube[10] = new FtoCubie( //moveB
			[0, 3, 1, 2, 4, 5], [0, 1, 1, 0, 0, 0], [0, 1, 10, 3, 4, 5, 6, 7, 8, 2, 9, 11],
			[0, 6, 7, 3, 4, 5, 11, 9, 8, 2, 10, 1], [0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11]);
		moveCube[12] = new FtoCubie( //moveR
			[5, 0, 2, 3, 4, 1], [1, 1, 0, 0, 0, 0], [6, 1, 2, 3, 4, 5, 11, 7, 8, 9, 10, 0],
			[5, 3, 2, 8, 4, 7, 6, 0, 1, 9, 10, 11], [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9]);
		moveCube[14] = new FtoCubie( //moveL
			[2, 1, 4, 3, 0, 5], [1, 0, 1, 0, 0, 0], [0, 8, 2, 3, 4, 5, 6, 1, 7, 9, 10, 11],
			[11, 1, 10, 2, 0, 5, 6, 7, 8, 9, 3, 4], [0, 1, 2, 3, 4, 5, 7, 8, 6, 9, 10, 11]);
		moveCube[16] = FtoCubie.FtoMult(rotU, moveCube[8], null); // moveUw = [U] * D
		moveCube[18] = FtoCubie.FtoMult(rotF, moveCube[10], null); // moveFw = [F] * B
		moveCube[20] = FtoCubie.FtoMult(rotR, moveCube[6], null); // moveRw = [R] * l
		moveCube[22] = FtoCubie.FtoMult(rotL, moveCube[4], null); // moveLw = [L] * r

		for (var i = 1; i < 24; i += 2) {
			moveCube[i] = new FtoCubie();
			FtoCubie.FtoMult(moveCube[i - 1], moveCube[i - 1], moveCube[i]);
		}

		var moveHash = [];
		for (var i = 0; i < 24; i ++) {
			moveHash[i] = moveCube[i].ep.join(',');
		}
		//init sym
		var symCube = [];
		var symMult = [];
		var symMulI = [];
		var symMulM = [];
		var symHash = [];
		var fc = new FtoCubie();
		var fc2 = new FtoCubie();
		var tmp;
		for (var s = 0; s < 12; s++) {
			symCube[s] = new FtoCubie(fc.cp, fc.co, fc.ep, fc.uf, fc.rl);
			symHash[s] = symCube[s].ep.join(',');
			symMult[s] = [];
			symMulI[s] = [];
			fc = FtoCubie.FtoMult(fc, rotU, null);
			if (s % 3 == 2) { // [F] or [R]
				fc = FtoCubie.FtoMult(fc, rotR, rotU, null);
			}
			if (s % 6 == 5) {
				fc = FtoCubie.FtoMult(fc, rotU, rotR, null);
			}
		}
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 12; j++) {
				FtoCubie.FtoMult(symCube[i], symCube[j], fc);
				var k = symHash.indexOf(fc.ep.join(','));
				symMult[i][j] = k;
				symMulI[k][j] = i;
			}
		}
		for (var s = 0; s < 12; s++) {
			symMulM[s] = [];
			for (var j = 0; j < 8; j++) {
				FtoCubie.FtoMult(symCube[symMulI[0][s]], moveCube[j * 2], symCube[s], fc);
				var k = moveHash.indexOf(fc.ep.join(','));
				symMulM[s][j] = k >> 1;
			}
		}
		FtoCubie.moveCube = moveCube;
		FtoCubie.symCube = symCube;
		FtoCubie.symMult = symMult;
		FtoCubie.symMulI = symMulI;
		FtoCubie.symMulM = symMulM;
	};

	initMoveCube();

	function ftoPermMove(key, perm, move) {
		var ret = [];
		var movePerm = FtoCubie.moveCube[move][key];
		for (var i = 0; i < 12; i++) {
			ret[i] = perm[movePerm[i]];
		}
		return ret;
	}

	function ftoFullMove(fc, move) {
		return FtoCubie.FtoMult(fc, FtoCubie.moveCube[move], null);
	}

	function phase1EdgeHash(ep) {
		var ret = 0;
		var e3fst = -1;
		for (var i = 0; i < 12; i++) {
			if ((0x38 >> ep[i] & 1) == 0) {
				continue;
			}
			if (e3fst == -1) {
				e3fst = ep[i];
			}
			ret += ((ep[i] - e3fst + 3) % 3 + 1) << i * 2;
		}
		return ret;
	}

	function phase1CtrlHash(rl) {
		var ret = 0;
		for (var i = 0; i < 12; i++) {
			if (rl[i] < 3) {
				ret |= 1 << i;
			}
		}
		return ret;
	}

	function phase2EdgeHash(ep) {
		var edge2group = [0, 1, 2, 3, 3, 3, 0, 1, 1, 2, 2, 0];
		var groups = [[0, 6, 11], [1, 7, 8], [2, 9, 10], [3, 4, 5]];
		var ret = 0;
		var egoff = [-1, -1, -1, -1];
		for (var i = 0; i < 12; i++) {
			var g = edge2group[ep[i]];
			var gidx = groups[g].indexOf(ep[i]);
			if (egoff[g] == -1) {
				egoff[g] = gidx;
			}
			ret += (g * 4 + (gidx - egoff[g] + 3) % 3) * Math.pow(16, i);
		}
		return ret;
	}

	function phase2CtHash(ct) {
		var ret = 0;
		for (var i = 0; i < 12; i++) {
			ret |= ~~(ct[i] / 3) << (i * 2);
		}
		return ret;
	}

	function phase3EdgeHash(ep) {
		return String.fromCharCode.apply(null, ep);
	}

	function phase3CcufHash(fc) {
		return String.fromCharCode.apply(null, [].concat(fc.cp, fc.co));
	}

	function randomMoves(validMoves, len) {
		var scramble = [];
		for (var i = 0; i < len; i++) {
			scramble.push(validMoves[~~(Math.random() * validMoves.length)]);
		}
		var fc = new FtoCubie();
		for (var i = 0; i < scramble.length; i++) {
			fc = FtoCubie.FtoMult(fc, FtoCubie.moveCube[scramble[i]], null);
		}
		return [fc, scramble];
	}

	function genCkmv(moves) {
		var ckmv = [];
		var tmp1 = new FtoCubie();
		var tmp2 = new FtoCubie();
		for (var m1 = 0; m1 < moves.length; m1++) {
			ckmv[m1] = 1 << m1;
			for (var m2 = 0; m2 < m1; m2++) {
				FtoCubie.FtoMult(FtoCubie.moveCube[moves[m1]], FtoCubie.moveCube[moves[m2]], tmp1);
				FtoCubie.FtoMult(FtoCubie.moveCube[moves[m2]], FtoCubie.moveCube[moves[m1]], tmp2);
				if (tmp1.isEqual(tmp2)) {
					ckmv[m1] |= 1 << m2;
				}
			}
		}
		return ckmv;
	}

	var phase1Moves = [0, 2, 22, 6, 16, 10, 12, 14]; // keep the (D, DR) edge
	var p1epMoves = null;
	var p1rlMoves = null;
	var ckmv1 = null;
	var solv1 = null;

	var pyraSymCube = [];
	for (var i = 0; i < 12; i++) {
		pyraSymCube.push(new FtoCubie(
			FtoCubie.symCube[i].cp,
			FtoCubie.symCube[i].co,
			null,
			FtoCubie.symCube[i].uf,
			null
		));
	}

	function phase1Init() {
		var fc = new FtoCubie();
		p1epMoves = mathlib.createMoveHash(fc.ep.slice(), phase1Moves, phase1EdgeHash, ftoPermMove.bind(null, 'ep'));
		p1rlMoves = mathlib.createMoveHash(fc.rl.slice(), phase1Moves, phase1CtrlHash, ftoPermMove.bind(null, 'rl'));
		var N_P1EP = p1epMoves[0][0].length;
		var N_P1RL = p1rlMoves[0][0].length;
		DEBUG && console.log('p1ep len=' + N_P1EP + ' p1rl len=' + N_P1RL);

		ckmv1 = genCkmv(phase1Moves);
		var p1eprlPrun = [];
		mathlib.createPrun(p1eprlPrun, 0, N_P1EP * N_P1RL, 14, function(idx, move) {
			var rl = ~~(idx / N_P1EP);
			var ep = idx % N_P1EP;
			return p1rlMoves[0][move][rl] * N_P1EP + p1epMoves[0][move][ep];
		}, phase1Moves.length, 2);

		solv1 = new mathlib.Searcher(null, function(idx) {
			return mathlib.getPruning(p1eprlPrun, idx[1] * N_P1EP + idx[0]);
		}, function(idx, move) {
			return [
				p1epMoves[0][move][idx[0]],
				p1rlMoves[0][move][idx[1]]
			];
		}, 8, 2, ckmv1);
	}

	function phase1GenIdxs(fc) {
		var idxs = [];
		var syms = [];
		var fc2 = new FtoCubie();
		var fc3 = new FtoCubie();

		for (var sidx = 0; sidx < 12; sidx += 3) {
			FtoCubie.FtoMult(FtoCubie.symCube[sidx % 12], fc, fc2);
			var rot;
			for (rot = 0; rot < 12; rot++) {
				FtoCubie.FtoMult(fc2, FtoCubie.symCube[rot], fc3);
				if (fc3.ep[4] == 4) {
					break;
				}
			}
			var epidxs = [];
			var rlidxs = [];
			idxs.push([
				p1epMoves[1][phase1EdgeHash(fc3.ep)],
				p1rlMoves[1][phase1CtrlHash(fc3.rl)]
			]);
			syms.push([sidx, rot]);
		}
		return [idxs, syms];
	}

	function phase1ProcSol(sol, solsym, fc) {
		for (var i = 0; i < sol.length; i++) {
			sol[i] = phase1Moves[sol[i][0]] + sol[i][1];
		}
		var std = move2std(sol);
		for (var i = 0; i < std[0].length; i++) {
			var move = std[0][i];
			sol[i] = FtoCubie.symMulM[FtoCubie.symMulI[0][solsym[1]]][move >> 1] * 2 + (move & 1);
			fc = FtoCubie.FtoMult(fc, FtoCubie.moveCube[sol[i]], null);
		}
		solsym[1] = FtoCubie.symMulI[solsym[1]][std[1]];
		fc = FtoCubie.FtoMult(
			pyraSymCube[~~(solsym[0] / 12)], FtoCubie.symCube[solsym[0] % 12],
			fc, FtoCubie.symCube[solsym[1]], null
		);
		return [fc, sol, solsym[0], solsym[1]];
	}

	var N_PHASE1_SOLS = 1000;

	function solvePhase1(fc) {
		if (!solv1) {
			phase1Init();
		}

		var tt = $.now();
		var idxs = phase1GenIdxs(fc);
		var syms = idxs[1];
		idxs = idxs[0];

		var p1sols = [];

		var sol1s = solv1.solveMulti(idxs, 0, 12, function(sol, sidx) {
			var param = phase1ProcSol(sol.slice(), syms[sidx].slice(), fc);
			p1sols.push(param);
			return p1sols.length >= N_PHASE1_SOLS;
		});

		tt = $.now() - tt;
		for (var i = 0; i < p1sols.length; i++) {
			p1sols[i].push(tt);
		}
		return p1sols;
	}

	var phase2Moves = [0, 12, 14, 8, 10];
	var p2epMoves = null;
	var p2rlMoves = null;
	var p2ccMoves = null;
	var p2cc2ufBit = {};
	var ckmv2 = null;
	var solv2 = null;
	var P2EPRL_MAXL = 11;
	var p2symMap = [];
	var ufStd2Raw = [];
	var ufRaw2Std = [];
	var p2ufCoord = new mathlib.Coord('c', 12, [3, 3, 3, 3]);

	var cornExFacelets = [
		[U + 2, R + 2, F + 2, L + 2],
		[U + 5, B + 7, r + 5, R + 7],
		[U + 7, L + 5, l + 7, B + 5],
		[l + 2, D + 2, r + 2, B + 2],
		[F + 5, D + 7, l + 5, L + 7],
		[r + 7, D + 5, F + 7, R + 5]
	];

	function phase2CpcoHash(fc) {
		var ret = String.fromCharCode.apply(null, [].concat(fc.cp, fc.co));
		if (!(ret in p2cc2ufBit)) {
			var co = [];
			for (var i = 0; i < 6; i++) {
				co[i] = fc.co[i] * 2;
			}
			var facelet = fc.toFaceCube();
			mathlib.fillFacelet(cornExFacelets, facelet, fc.cp, co, 9);
			var fc2 = new FtoCubie().fromFacelet(facelet);
			p2cc2ufBit[ret] = phase2CtHash(fc2.uf);
		}
		return ret;
	}

	// re-color the cube s.t. uf is minimized in lexicographical order
	function phase2ufStd(uf, symMap) {
		var col1 = uf[0], col2 = -1;
		for (var i = 1; i < 12; i++) {
			if (uf[i] != col1) {
				col2 = uf[i];
				break;
			}
		}
		var sym = symMap[col1 * 4 + col2];
		for (var i = 0; i < 12; i++) {
			uf[i] = ~~(FtoCubie.symCube[sym].uf[uf[i] * 3] / 3);
		}
		return sym;
	}

	function getPhase2ufIdx(uf) {
		var ufstd = [];
		for (var i = 0; i < 12; i++) {
			ufstd[i] = ~~(uf[i] / 3);
		}
		var sym = phase2ufStd(ufstd, p2symMap);
		return ufRaw2Std[p2ufCoord.get(ufstd)] << 4 | sym;
	}

	function phase2Init() {
		var fc = new FtoCubie();
		p2epMoves = mathlib.createMoveHash(fc.ep.slice(), phase2Moves, phase2EdgeHash, ftoPermMove.bind(null, 'ep'));
		p2rlMoves = mathlib.createMoveHash(fc.rl.slice(), phase2Moves, phase2CtHash, ftoPermMove.bind(null, 'rl'));
		p2ccMoves = mathlib.createMoveHash(fc, phase2Moves, phase2CpcoHash, ftoFullMove);

		var arr = [];
		var arr2 = [];
		var p2ufMoveStd = [[], [], [], [], []];
		var ufStd2Bit = [];
		var p2ccRecol = [];
		for (var s = 0; s < 12; s++) {
			var uf = FtoCubie.symCube[s].uf;
			var col1 = ~~(uf.indexOf(0) / 3);
			var col2 = ~~(uf.indexOf(3) / 3);
			p2symMap[col1 * 4 + col2] = s;
			p2ccRecol[s] = [];
		}
		out: for (var i = 0; i < 42000; i++) {
			p2ufCoord.set(arr, i);
			for (var j = 1; j < 12; j++) {
				if (arr[j] > 1) {
					continue out;
				} else if (arr[j] == 1) {
					break;
				}
			}
			ufRaw2Std[i] = ufStd2Raw.length;
			ufStd2Raw.push(i);
		}
		for (var i = 0; i < ufStd2Raw.length; i++) {
			p2ufCoord.set(arr, ufStd2Raw[i]);
			var hash = 0;
			for (var j = 0; j < 12; j++) {
				hash |= arr[j] << (j * 2);
			}
			ufStd2Bit[i] = hash;
			for (var m = 0; m < phase2Moves.length; m++) {
				mathlib.permOriMult(arr, FtoCubie.moveCube[phase2Moves[m]].uf, arr2);
				var sym = phase2ufStd(arr2, p2symMap);
				p2ufMoveStd[m][i] = ufRaw2Std[p2ufCoord.get(arr2)] << 4 | sym;
			}
		}
		var cc2Bit = [];
		for (var key in p2ccMoves[1]) {
			var idx = p2ccMoves[1][key];
			cc2Bit[idx] = p2cc2ufBit[key];
			var cpco = [];
			for (var s = 0; s < 12; s++) {
				var sc = FtoCubie.symCube[s];
				for (var i = 0; i < 6; i++) {
					var scpi = key.charCodeAt(i);
					cpco[i] = sc.cp[scpi];
					cpco[i + 6] = sc.co[scpi] ^ key.charCodeAt(i + 6);
				}
				var hash = String.fromCharCode.apply(null, cpco);
				p2ccRecol[s][idx] = p2ccMoves[1][hash];
			}
		}

		var p2necPrun = [ // idx = (a << 2 | b) * 7 + c, a: #mismatch in U faces, b: U corners w/o U faces, c: others
			 0,99, 3, 4, 5, 6, 8,
			99, 2, 3, 4, 5, 6, 8,
			 1, 3, 4, 5, 6, 7, 8,
			 1, 3, 4, 5, 6, 7, 9,
			99, 2, 3, 4, 5, 6, 8,
			 2, 2, 4, 4, 5, 6, 8,
			 3, 3, 4, 5, 6, 7, 8,
			 3, 3, 4, 5, 6, 7, 9,
			 3, 3, 4, 5, 6, 7, 8,
			 4, 4, 4, 5, 6, 7, 8,
			 4, 4, 5, 6, 7, 8, 9,
			 4, 4, 5, 6, 7, 8, 9,
			 4, 4, 5, 6, 7, 8, 9,
			 4, 4, 5, 6, 7, 8, 9,
			 5, 5, 6, 7, 8, 9,10,
			 5, 5, 6, 7, 8, 9,10
		];

		var N_P2EP = p2epMoves[0][0].length;
		var N_P2RL = p2rlMoves[0][0].length;
		var p2eprlPrun = [];
		mathlib.createPrun(p2eprlPrun, 0, N_P2EP * N_P2RL, P2EPRL_MAXL - 2, function(idx, move) {
			var rl = ~~(idx / N_P2EP);
			var ep = idx % N_P2EP;
			return p2rlMoves[0][move][rl] * N_P2EP + p2epMoves[0][move][ep];
		}, phase2Moves.length, 2);
		ckmv2 = genCkmv(phase2Moves);

		solv2 = new mathlib.Searcher(null, function(idx) {
			var xors = ufStd2Bit[idx[3] >> 4] ^ cc2Bit[p2ccRecol[idx[3] & 0xf][idx[2]]];
			xors = (xors | xors >> 1) & 0x555555;
			var necIdx = (mathlib.bitCount(xors & 0x3f) << 2 | mathlib.bitCount(xors & 0xc0c0c0)) * 7 + mathlib.bitCount(xors & 0x3f3f00);
			return Math.max(
				Math.min(P2EPRL_MAXL, mathlib.getPruning(p2eprlPrun, idx[1] * N_P2EP + idx[0])),
				p2necPrun[necIdx]
			);
		}, function(idx, move) {
			var ufidx1 = p2ufMoveStd[move][idx[3] >> 4];
			var ufcol = FtoCubie.symMult[ufidx1 & 0xf][idx[3] & 0xf];
			return [
				p2epMoves[0][move][idx[0]],
				p2rlMoves[0][move][idx[1]],
				p2ccMoves[0][move][idx[2]],
				ufidx1 & ~0xf | ufcol,
			];
		}, phase2Moves.length, 2, ckmv2);

		if (1 != 1 && !isInWorker) {
			// code for init p2necPrun
			var p2ufPrun = [];
			var N_P2CC = p2ccMoves[0][0].length;
			var N_P2UFSTD = ufStd2Raw.length;
			var ufBit2Std = {};
			for (var i = 0; i < ufStd2Bit.length; i++) {
				ufBit2Std[ufStd2Bit[i]] = i;
			}
			var solved = [];
			for (var key in p2ccMoves[1]) {
				var ufidx = ufBit2Std[p2cc2ufBit[key]];
				if (ufidx !== undefined) {
					solved.push(ufidx * N_P2CC + p2ccMoves[1][key]);
				}
			}
			mathlib.createPrun(p2ufPrun, solved, N_P2CC * N_P2UFSTD, 13, function(idx, move) {
				var ufstd = ~~(idx / N_P2CC);
				var cc = idx % N_P2CC;
				ufstd = p2ufMoveStd[move][ufstd];
				var ufcol = ufstd & 0xf;
				ufstd >>= 4;
				cc = p2ccMoves[0][move][cc]
				return ufstd * N_P2CC + p2ccRecol[ufcol][cc];
			}, phase2Moves.length, 2);

			$.tryHashPrun = function(hashFunc) {
				var buc = new Map();
				for (var i = 0; i < N_P2CC * N_P2UFSTD; i++) {
					var hash = hashFunc(ufStd2Bit[~~(i / N_P2CC)], cc2Bit[i % N_P2CC]);
					if (!buc.has(hash)) {
						buc.set(hash, [100, -1, 0]);
					}
					var prun = mathlib.getPruning(p2ufPrun, i);
					var arr = buc.get(hash);
					arr[0] = Math.min(arr[0], prun);
					arr[1] = Math.max(arr[1], prun);
					arr[2]++;
				}
				var cnt = 0;
				var csum = 0;
				var bcnt = 0;
				for (var [k, arr] of buc) {
					bcnt++;
					cnt += arr[2];
					csum += arr[2] * arr[0];
				}
				console.log(JSON.stringify(Object.fromEntries(buc)));
				console.log('bcnt=', bcnt);
				console.log('avg: ', csum / cnt);
			}

			$.tryHashPrun(function(ufbit, ccbit) {
				var xors = ufbit ^ ccbit;
				xors = (xors | xors >> 1) & 0x55555555;
				return (mathlib.bitCount(xors & 0x3f) << 2 | mathlib.bitCount(xors & 0xc0c0c0)) * 7 + mathlib.bitCount(xors & 0x3f3f00);
			});
		}
	}

	function solvePhase2(solvInfos) {
		if (!solv2) {
			phase2Init();
		}
		var tt = $.now();
		var idxs = [];
		for (var i = 0; i < solvInfos.length; i++) {
			idxs.push([
				p2epMoves[1][phase2EdgeHash(solvInfos[i][0].ep)],
				p2rlMoves[1][phase2CtHash(solvInfos[i][0].rl)],
				p2ccMoves[1][phase2CpcoHash(solvInfos[i][0])],
				getPhase2ufIdx(solvInfos[i][0].uf)
			]);
		}
		var sol2s = solv2.solveMulti(idxs, 0, 25);
		var sol = sol2s[0];
		var src = sol2s[1];
		var solvInfo = solvInfos[src];
		var fc = solvInfo[0];
		for (var i = 0; i < sol.length; i++) {
			var move = phase2Moves[sol[i][0]] + sol[i][1];
			sol[i] = FtoCubie.symMulM[FtoCubie.symMulI[0][solvInfo[3]]][move >> 1] * 2 + (move & 1);
			fc = FtoCubie.FtoMult(fc, FtoCubie.moveCube[move], null);
		}
		return [fc, sol, solvInfo[2], solvInfo[3], src, $.now() - tt];
	}

	var phase3Moves = [8, 10, 12, 14];
	var p3epMoves = null;
	var p3ufMoves = null;
	var p3epPrun = null;
	var p3ufPrun = null;
	var ckmv3 = null;
	var solv3 = null;

	function phase3Init() {
		var fc = new FtoCubie();
		p3epMoves = mathlib.createMoveHash(fc.ep.slice(), phase3Moves, phase3EdgeHash, ftoPermMove.bind(null, 'ep'));
		p3ufMoves = mathlib.createMoveHash(new FtoCubie(), phase3Moves, phase3CcufHash, ftoFullMove);
		p3epPrun = [];
		p3ufPrun = [];
		mathlib.createPrun(p3epPrun, 0, 81, 14, p3epMoves[0], 4, 2);
		mathlib.createPrun(p3ufPrun, 0, 11520, 14, p3ufMoves[0], 4, 2);
		ckmv3 = genCkmv(phase3Moves);

		solv3 = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(p3epPrun, idx[0]),
				mathlib.getPruning(p3ufPrun, idx[1])
			);
		}, function(idx, move) {
			return [p3epMoves[0][move][idx[0]], p3ufMoves[0][move][idx[1]]];
		}, 4, 2, ckmv3);
	}

	function solvePhase3(solvInfo) {
		var fc = solvInfo[0];
		if (!p3epPrun) {
			phase3Init();
		}

		var tt = $.now();
		var p3epidx = p3epMoves[1][phase3EdgeHash(fc.ep)];
		var p3ufidx = p3ufMoves[1][phase3CcufHash(fc)];

		var sol = solv3.solve([p3epidx, p3ufidx], 0, 25);

		for (var i = 0; i < sol.length; i++) {
			var move = phase3Moves[sol[i][0]] + sol[i][1];
			sol[i] = FtoCubie.symMulM[FtoCubie.symMulI[0][solvInfo[3]]][move >> 1] * 2 + (move & 1);

			fc = FtoCubie.FtoMult(fc, FtoCubie.moveCube[move], null);
		}
		return [fc, sol, solvInfo[2], solvInfo[3], $.now() - tt];
	}

	// convert wide moves to face moves
	function move2std(moves) {
		var sym = 0;
		var ret = [];
		// Uw = [U] * D, Fw = [F] * B, Rw = [R] * l, Lw = [L] * r
		var w2axis = [4, 5, 3, 2];
		var w2rot = [1, 10, 5, 11];
		for (var i = 0; i < moves.length; i++) {
			var rot = 0;
			var axis = moves[i] >> 1;
			var pow = moves[i] & 1;
			if (axis >= 8) {
				rot = w2rot[axis - 8];
				axis = w2axis[axis - 8];
			}
			if (!pow) {
				rot = FtoCubie.symMult[rot][rot];
			}
			ret.push(FtoCubie.symMulM[sym][axis] * 2 + pow);
			sym = FtoCubie.symMult[rot][sym];
		}
		return [ret, sym];
	}

	function applyMoves(fc, moves) {
		for (var i = 0; i < moves.length; i++) {
			fc = FtoCubie.FtoMult(fc, FtoCubie.moveCube[moves[i]], null);
		}
		return fc;
	}

	var move2str = ["U", "U'", "F", "F'", "r", "r'", "l", "l'", "D", "D'", "B", "B'", "R", "R'", "L", "L'"]

	function prettyMoves(moves) {
		var buf = [];
		for (var i = 0; i < moves.length; i++) {
			buf[i] = move2str[moves[i]];
		}
		return buf.join(' ').replace(/l/g, 'BL').replace(/r/g, 'BR');
	}

	function FtoSolver() {}

	FtoSolver.prototype.solveFto = function(fc, invSol) {
		if (!solv1) {
			var tt = $.now();
			phase1Init();
			phase2Init();
			phase3Init();
			DEBUG && console.log('[ftosolver] init time:', $.now() - tt);
		}
		var solvInfos = solvePhase1(fc);

		var solvInfo2 = solvePhase2(solvInfos);

		var solvInfo1 = solvInfos[solvInfo2[4]];
		this.sol1 = solvInfo1[1].slice();
		this.tt1 = solvInfo1[4];
		var sym1Idx = solvInfo1[2];

		this.sol2 = solvInfo2[1].slice();
		this.tt2 = solvInfo2[5];
		solvInfo2[0] = FtoCubie.FtoMult(pyraSymCube[FtoCubie.symMulI[0][~~(sym1Idx / 12)]], solvInfo2[0], null);

		var solvInfo3 = solvePhase3(solvInfo2);
		this.sol3 = solvInfo3[1].slice();
		this.tt3 = solvInfo3[4];

		var sol = [].concat(this.sol1, this.sol2, this.sol3);
		if (invSol) {
			for (var i = 0; i < sol.length; i++) {
				sol[i] ^= 1;
			}
			sol.reverse();
		}
		return prettyMoves(sol);
	}

	var solver = new FtoSolver();

	function solveTest(n_moves) {
		var solvInfo = randomMoves([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], n_moves);

		var scramble = prettyMoves(solvInfo[1].slice());
		var solution = solver.solveFto(solvInfo[0]);

		var fc = solvInfo[0];
		DEBUG && console.log('scrambled state\n', fc.toString(1));
		fc = applyMoves(fc, solver.sol1);
		DEBUG && console.log('after phase 1 (' + prettyMoves(solver.sol1) + '):\n', fc.toString(1));
		fc = applyMoves(fc, solver.sol2);
		DEBUG && console.log('after phase 2 (' + prettyMoves(solver.sol2) + '):\n', fc.toString(1));
		fc = applyMoves(fc, solver.sol3);
		DEBUG && console.log('after phase 3 (' + prettyMoves(solver.sol3) + '):\n', fc.toString(1));

		var facelets = fc.toFaceCube();
		var isSolved = true;
		out: for (var i = 0; i < 8; i++) {
			for (var j = 1; j < 9; j++) {
				if (facelets[i * 9 + j] != facelets[i * 9]) {
					isSolved = false;
					break out;
				}
			}
		}
		if (!isSolved) {
			console.log('error, FTO not solved!!!');
		}

		DEBUG && console.log(scramble, solution);
		return [
			solver.sol1.length + solver.sol2.length + solver.sol3.length,
			solver.sol1.length,
			solver.sol2.length,
			solver.sol3.length,
			solver.tt1,
			solver.tt2,
			solver.tt3
		];
	}

	function testbench(ntest) {
		ntest = ntest || 100;
		var cumlen = [];
		for (var nsolv = 0; nsolv < ntest; nsolv++) {
			var lengths = solveTest(200);
			for (var i = 0; i < lengths.length; i++) {
				cumlen[i] = (cumlen[i] || 0) + lengths[i];
			}
			console.log('AvgL: ', cumlen[0] / (nsolv + 1));
		}
		console.log('AvgL1:', cumlen[1] / ntest);
		console.log('AvgL2:', cumlen[2] / ntest);
		console.log('AvgL3:', cumlen[3] / ntest);
		console.log('AvgT1:', cumlen[4] / ntest);
		console.log('AvgT2:', cumlen[5] / ntest);
		console.log('AvgT3:', cumlen[6] / ntest);
	}

	function solveFacelet(facelet, invSol) {
		var fc = new FtoCubie();
		if (fc.fromFacelet(facelet) == -1) {
			return "FTO Solver ERROR!";
		}
		return solver.solveFto(fc, invSol);
	}

	return {
		solveFacelet: solveFacelet,
		FtoCubie: FtoCubie,
		testbench: DEBUG && testbench
	};
})();

/* ==== solver/megaminx.js ==== */
"use strict";

var mgmsolver = (function() {

	function MgmCubie() {
		this.corn = [];
		this.twst = [];
		this.edge = [];
		this.flip = [];
		for (var i = 0; i < 20; i++) {
			this.corn[i] = i;
			this.twst[i] = 0;
		}
		for (var i = 0; i < 30; i++) {
			this.edge[i] = i;
			this.flip[i] = 0;
		}
	}

	MgmCubie.SOLVED = new MgmCubie();

	var U = 0, R = 10, F = 20, L = 30, BL = 40, BR = 50, DR = 60, DL = 70, DBL = 80, B = 90, DBR = 100, D = 110;
	var cornFacelet = [
		[U + 2, R + 3, F + 4], // 0
		[U + 3, F + 3, L + 4], // 1
		[U + 4, L + 3, BL + 4], // 2
		[U + 0, BL + 3, BR + 4], // 3
		[U + 1, BR + 3, R + 4], // 4
		[D + 3, B + 0, DBL + 1], // 5
		[D + 2, DBR + 0, B + 1], // 6
		[D + 1, DR + 0, DBR + 1], // 7
		[D + 0, DL + 0, DR + 1], // 8
		[D + 4, DBL + 0, DL + 1], // 9
		[DR + 3, F + 0, R + 2], // [F + 0, R + 2, DR + 3], // 10
		[L + 0, F + 2, DL + 3], // 11
		[BL + 0, L + 2, DBL + 3], // 12
		[BR + 0, BL + 2, B + 3], // 13
		[R + 0, BR + 2, DBR + 3], // 14
		[B + 4, BL + 1, DBL + 2], // 15
		[DBR + 4, BR + 1, B + 2], // 16
		[DR + 4, R + 1, DBR + 2], // 17
		[DL + 4, F + 1, DR + 2], // 18
		[DBL + 4, L + 1, DL + 2] // 19
	];
	var edgeFacelet = [ // edge orientation s.t. all EOs in <U, R> are 0
		[U + 6, R + 8], // 0
		[U + 7, F + 8], // 1
		[U + 8, L + 8], // 2
		[U + 9, BL + 8], // 3
		[U + 5, BR + 8], // 4
		[D + 8, DBL + 5], // 5
		[D + 7, B + 5], // 6
		[D + 6, DBR + 5], // 7
		[D + 5, DR + 5], // 8
		[D + 9, DL + 5], // 9
		[F + 9, R + 7], // 10
		[F + 5, DR + 7], // 11
		[L + 9, F + 7], // 12
		[L + 5, DL + 7], // 13
		[BL + 9, L + 7], // 14
		[BL + 5, DBL + 7], // 15
		[BR + 9, BL + 7], // 16
		[BR + 5, B + 7], // 17
		[BR + 7, R + 9], // [R + 9, BR + 7], // 18
		[DBR + 7, R + 5], // [R + 5, DBR + 7], // 19
		[B + 9, DBL + 6], // 20
		[B + 8, BL + 6], // 21
		[DBR + 9, B + 6], // 22
		[DBR + 8, BR + 6], // 23
		[DR + 9, DBR + 6], // 24
		[DR + 8, R + 6], // 25
		[DL + 9, DR + 6], // 26
		[DL + 8, F + 6], // 27
		[DBL + 9, DL + 6], // 28
		[DBL + 8, L + 6] // 29
	];

	MgmCubie.prototype.toFaceCube = function(cFacelet, eFacelet) {
		cFacelet = cFacelet || cornFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var f = [];
		mathlib.fillFacelet(cFacelet, f, this.corn, this.twst, 10);
		mathlib.fillFacelet(eFacelet, f, this.edge, this.flip, 10);
		return f;
	}

	MgmCubie.prototype.fromFacelet = function(facelet, cFacelet, eFacelet) {
		cFacelet = cFacelet || cornFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var count = 0;
		var f = [];
		for (var i = 0; i < 120; ++i) {
			f[i] = facelet[i];
			count += Math.pow(16, f[i]);
		}
		if (count != 0xaaaaaaaaaaaa) {
			return -1;
		}
		if (mathlib.detectFacelet(cFacelet, f, this.corn, this.twst, 10) == -1
				|| mathlib.detectFacelet(eFacelet, f, this.edge, this.flip, 10) == -1) {
			return -1;
		}
		return this;
	}

	MgmCubie.prototype.hashCode = function() {
		var ret = 0;
		for (var i = 0; i < 20; i++) {
			ret = 0 | (ret * 31 + this.corn[i] * 3 + this.twst[i]);
			ret = 0 | (ret * 31 + this.edge[i] * 2 + this.flip[i]);
		}
		return ret;
	}

	MgmCubie.MgmMult = function(a, b, prod) {
		for (var i = 0; i < 20; i++) {
			prod.corn[i] = a.corn[b.corn[i]];
			prod.twst[i] = (a.twst[b.corn[i]] + b.twst[i]) % 3;
		}
		for (var i = 0; i < 30; i++) {
			prod.edge[i] = a.edge[b.edge[i]];
			prod.flip[i] = a.flip[b.edge[i]] ^ b.flip[i];
		}
	};

	MgmCubie.MgmMult3 = function(a, b, c, prod) {
		for (var i = 0; i < 20; i++) {
			prod.corn[i] = a.corn[b.corn[c.corn[i]]];
			prod.twst[i] = (a.twst[b.corn[c.corn[i]]] + b.twst[c.corn[i]] + c.twst[i]) % 3;
		}
		for (var i = 0; i < 30; i++) {
			prod.edge[i] = a.edge[b.edge[c.edge[i]]];
			prod.flip[i] = a.flip[b.edge[c.edge[i]]] ^ b.flip[c.edge[i]] ^ c.flip[i];
		}
	};

	MgmCubie.prototype.invFrom = function(cc) {
		for (var i = 0; i < 20; i++) {
			this.corn[cc.corn[i]] = i;
			this.twst[cc.corn[i]] = (3 - cc.twst[i]) % 3;
		}
		for (var i = 0; i < 30; i++) {
			this.edge[cc.edge[i]] = i;
			this.flip[cc.edge[i]] = cc.flip[i];
		}
		return this;
	}

	MgmCubie.prototype.copy = function(cc) {
		this.corn = cc.corn.slice();
		this.twst = cc.twst.slice();
		this.edge = cc.edge.slice();
		this.flip = cc.flip.slice();
		return this;
	};

	MgmCubie.prototype.isEqual = function(c) {
		for (var i = 0; i < 20; i++) {
			if (this.corn[i] != c.corn[i] || this.twst[i] != c.twst[i]) {
				return false;
			}
		}
		for (var i = 0; i < 30; i++) {
			if (this.edge[i] != c.edge[i] || this.flip[i] != c.flip[i]) {
				return false;
			}
		}
		return true;
	};

	function getComb(perm, ori, n, r, base) {
		var thres = r;
		var idxComb = 0;
		var idxOri = 0;
		var permR = [];
		for (var i = n - 1; i >= 0; i--) {
			if (perm[i] < thres) {
				idxComb += mathlib.Cnk[i][r--];
				idxOri = idxOri * base + ori[i];
				permR[r] = perm[i];
			}
		}
		return [idxComb, mathlib.getNPerm(permR, thres), idxOri];
	}

	function setComb(perm, ori, idx, n, r) {
		var fill = n - 1;
		for (var i = n - 1; i >= 0; i--) {
			if (idx >= mathlib.Cnk[i][r]) {
				idx -= mathlib.Cnk[i][r--];
				perm[i] = r;
			} else {
				perm[i] = fill--;
			}
			ori[i] = 0;
		}
	}

	function doCombMove4(moveTable, N_PERM, N_ORI, TT_OFFSET, idx, move) {
		var slice = ~~(idx / N_ORI / N_PERM);
		var perm = ~~(idx / N_ORI) % N_PERM;
		var twst = idx % N_ORI;
		var val = moveTable[move][slice];
		slice = val[0];
		perm = perm4Mult[perm][val[1]];
		twst = (N_ORI & 1) // is corner coord?
			? perm4TT[perm4MulT[val[1]][twst * TT_OFFSET] / TT_OFFSET][val[2]]
			: (perm4MulF[val[1]][twst * TT_OFFSET] / TT_OFFSET ^ val[2]);
		return (slice * N_PERM + perm) * N_ORI + twst;
	}

	MgmCubie.prototype.setCComb = function(idx, r) {
		setComb(this.corn, this.twst, idx, 20, r || 4);
	}

	MgmCubie.prototype.getCComb = function(r) {
		return getComb(this.corn, this.twst, 20, r || 4, 3);
	}

	MgmCubie.prototype.setEComb = function(idx, r) {
		setComb(this.edge, this.flip, idx, 30, r || 4);
	}

	MgmCubie.prototype.getEComb = function(r) {
		return getComb(this.edge, this.flip, 30, r || 4, 2);
	}

	MgmCubie.prototype.faceletMove = function(face, pow, wide) {
		var facelet = this.toFaceCube();
		var state = [];
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 10; j++) {
				state[i * 11 + j] = facelet[i * 10 + j];
			}
			state[i * 11 + 10] = 0;
		}
		mathlib.minx.doMove(state, face, pow, wide);
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 10; j++) {
				facelet[i * 10 + j] = state[i * 11 + j];
			}
		}
		this.fromFacelet(facelet);
	}

	function createMoveCube() {
		//init move
		var moveCube = [];
		var moveHash = [];
		for (var i = 0; i < 12 * 4; i++) {
			moveCube[i] = new MgmCubie();
		}
		for (var a = 0; a < 48; a += 4) {
			moveCube[a].faceletMove(a >> 2, 1, 0);
			moveHash[a] = moveCube[a].hashCode();
			for (var p = 0; p < 3; p++) {
				MgmCubie.MgmMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
				moveHash[a + p + 1] = moveCube[a + p + 1].hashCode();
			}
		}
		MgmCubie.moveCube = moveCube;

		//init sym
		var symCube = [];
		var symMult = [];
		var symMulI = [];
		var symMulM = [];
		var symHash = [];
		var tmp = new MgmCubie();
		for (var s = 0; s < 60; s++) {
			symCube[s] = new MgmCubie().copy(tmp);
			symHash[s] = symCube[s].hashCode();
			symMult[s] = [];
			symMulI[s] = [];
			tmp.faceletMove(0, 1, 1); // [U]
			if (s % 5 == 4) { // [F] or [R]
				tmp.faceletMove(s % 10 == 4 ? 1 : 2, 1, 1);
			}
			if (s % 30 == 29) {
				tmp.faceletMove(1, 2, 1);
				tmp.faceletMove(2, 1, 1);
				tmp.faceletMove(0, 3, 1);
			}
		}
		for (var i = 0; i < 60; i++) {
			for (var j = 0; j < 60; j++) {
				MgmCubie.MgmMult(symCube[i], symCube[j], tmp);
				var k = symHash.indexOf(tmp.hashCode());
				symMult[i][j] = k;
				symMulI[k][j] = i;
			}
		}
		for (var s = 0; s < 60; s++) {
			symMulM[s] = [];
			for (var j = 0; j < 12; j++) {
				MgmCubie.MgmMult3(symCube[symMulI[0][s]], moveCube[j * 4], symCube[s], tmp);
				var k = moveHash.indexOf(tmp.hashCode());
				symMulM[s][j] = k >> 2;
			}
		}
		MgmCubie.symCube = symCube;
		MgmCubie.symMult = symMult;
		MgmCubie.symMulI = symMulI;
		MgmCubie.symMulM = symMulM;
	}

	function CCombCoord(cubieMap) {
		this.map = new MgmCubie();
		this.imap = new MgmCubie();
		this.map.corn = cubieMap.slice();
		for (var i = 0; i < 20; i++) {
			if (cubieMap.indexOf(i) == -1) {
				this.map.corn.push(i);
			}
		}
		this.imap.invFrom(this.map);
		this.tmp = new MgmCubie();
	}

	CCombCoord.prototype.get = function(cc, r) {
		MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
		return this.tmp.getCComb(r);
	}

	CCombCoord.prototype.set = function(cc, idx, r) {
		this.tmp.setCComb(idx, r);
		MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
	}

	MgmCubie.CCombCoord = CCombCoord;

	function ECombCoord(cubieMap) {
		this.map = new MgmCubie();
		this.imap = new MgmCubie();
		this.map.edge = cubieMap.slice();
		for (var i = 0; i < 30; i++) {
			if (cubieMap.indexOf(i) == -1) {
				this.map.edge.push(i);
			}
		}
		this.imap.invFrom(this.map);
		this.tmp = new MgmCubie();
	}

	ECombCoord.prototype.get = function(cc, r) {
		MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
		return this.tmp.getEComb(r);
	}

	ECombCoord.prototype.set = function(cc, idx, r) {
		this.tmp.setEComb(idx, r);
		MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
	}

	MgmCubie.ECombCoord = ECombCoord;

	function EOriCoord(cubieMap) {
		ECombCoord.call(this, cubieMap);
	}
	EOriCoord.prototype = {
		get: function(cc, r) {
			var idx = 0;
			MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
			for (var i = 0; i < r; i++) {
				idx = idx | (this.tmp.flip[i] << i);
			}
			return idx;
		},
		set: function(cc, idx, r) {
			for (var i = 0; i < 30; i++) {
				this.tmp.flip[i] = i < r ? (idx >> i) & 1 : 0;
			}
			MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
		}
	};
	MgmCubie.EOriCoord = EOriCoord;

	function EPermCoord(cubieMap) {
		ECombCoord.call(this, cubieMap);
	}
	EPermCoord.prototype = {
		get: function(cc, r) {
			MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
			return mathlib.getNPerm(this.tmp.edge, r);
		},
		set: function(cc, idx, r) {
			var edge = [];
			mathlib.setNPerm(edge, idx, r);
			for (var i = 0; i < 30; i++) {
				this.tmp.edge[i] = i < r ? edge[i] : i;
			}
			MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
		}
	};
	MgmCubie.EPermCoord = EPermCoord;

	function COriCoord(cubieMap) {
		CCombCoord.call(this, cubieMap);
	}
	COriCoord.prototype = {
		get: function(cc, r) {
			var idx = 0;
			MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
			for (var i = 0, base = 1; i < r; i++, base *= 3) {
				idx += this.tmp.twst[i] * base;
			}
			return idx;
		},
		set: function(cc, idx, r) {
			for (var i = 0; i < 30; i++) {
				this.tmp.twst[i] = i < r ? idx % 3 : 0;
				idx = ~~(idx / 3);
			}
			MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
		}
	}
	MgmCubie.COriCoord = COriCoord;

	function CPermCoord(cubieMap) {
		CCombCoord.call(this, cubieMap);
	}
	CPermCoord.prototype = {
		get: function(cc, r) {
			MgmCubie.MgmMult3(this.imap, cc, this.map, this.tmp);
			return mathlib.getNPerm(this.tmp.corn, r);
		},
		set: function(cc, idx, r) {
			var corn = [];
			mathlib.setNPerm(corn, idx, r);
			for (var i = 0; i < 20; i++) {
				this.tmp.corn[i] = i < r ? corn[i] : i;
			}
			MgmCubie.MgmMult3(this.map, this.tmp, this.imap, cc);
		}
	}
	MgmCubie.CPermCoord = CPermCoord;

	var perm4Mult = [];
	var perm4MulT = [];
	var perm4MulF = [];
	var perm4TT = [];

	var ckmv = [];

	var urfMove = [1, 2, 0, 5, 10, 6, 3, 4, 9, 11, 7, 8];
	var y2Move = [0, 3, 4, 5, 1, 2, 8, 9, 10, 6, 7, 11];
	var yMove = [0, 2, 3, 4, 5, 1, 7, 8, 9, 10, 6, 11];

	function comb4FullMove(moveTable, idx, move) {
		var slice = ~~(idx / 81 / 24);
		var perm = ~~(idx / 81) % 24;
		var twst = idx % 81;
		var val = moveTable[move][slice];
		slice = val[0];
		perm = perm4Mult[perm][val[1]];
		twst = perm4TT[perm4MulT[val[1]][twst]][val[2]];
		return slice * 81 * 24 + perm * 81 + twst;
	}

	function comb3FullMove(moveTable, idx, move) {
		var slice = ~~(idx / 27 / 6);
		var perm = ~~(idx / 27) % 6;
		var twst = idx % 27;
		var val = moveTable[move][slice];
		slice = val[0];
		perm = perm4Mult[perm][val[1]];
		twst = perm4TT[perm4MulT[val[1]][twst * 3] / 3][val[2]];
		return slice * 27 * 6 + perm * 27 + twst;
	}

	function init() {
		init = $.noop;
		var tt = $.now();
		createMoveCube();

		function setTwst4(arr, idx, base) {
			for (var k = 0; k < 4; k++) {
				arr[k] = idx % base;
				idx = ~~(idx / base);
			}
		}

		function getTwst4(arr, base) {
			var idx = 0;
			for (var k = 3; k >= 0; k--) {
				idx = idx * base + arr[k];
			}
			return idx;
		}

		var perm1 = [];
		var perm2 = [];
		var perm3 = [];
		for (var i = 0; i < 24; i++) {
			perm4Mult[i] = [];
			mathlib.setNPerm(perm1, i, 4);
			for (var j = 0; j < 24; j++) {
				mathlib.setNPerm(perm2, j, 4);
				for (var k = 0; k < 4; k++) {
					perm3[k] = perm1[perm2[k]];
				}
				perm4Mult[i][j] = mathlib.getNPerm(perm3, 4);
			}
		}
		for (var j = 0; j < 24; j++) {
			mathlib.setNPerm(perm2, j, 4);
			perm4MulT[j] = [];
			for (var i = 0; i < 81; i++) {
				setTwst4(perm1, i, 3);
				for (var k = 0; k < 4; k++) {
					perm3[k] = perm1[perm2[k]];
				}
				perm4MulT[j][i] = getTwst4(perm3, 3);
			}
			perm4MulF[j] = [];
			for (var i = 0; i < 16; i++) {
				setTwst4(perm1, i, 2);
				for (var k = 0; k < 4; k++) {
					perm3[k] = perm1[perm2[k]];
				}
				perm4MulF[j][i] = getTwst4(perm3, 2);
			}
		}
		for (var j = 0; j < 81; j++) {
			perm4TT[j] = [];
			setTwst4(perm2, j, 3);
			for (var i = 0; i < 81; i++) {
				setTwst4(perm1, i, 3);
				for (var k = 0; k < 4; k++) {
					perm3[k] = (perm1[k] + perm2[k]) % 3;
				}
				perm4TT[j][i] = getTwst4(perm3, 3);
			}
		}
		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();
		for (var m1 = 0; m1 < 12; m1++) {
			ckmv[m1] = 1 << m1;
			for (var m2 = 0; m2 < m1; m2++) {
				MgmCubie.MgmMult(MgmCubie.moveCube[m1 * 4], MgmCubie.moveCube[m2 * 4], tmp1);
				MgmCubie.MgmMult(MgmCubie.moveCube[m2 * 4], MgmCubie.moveCube[m1 * 4], tmp2);
				if (tmp1.isEqual(tmp2)) {
					ckmv[m1] |= 1 << m2;
				}
			}
		}
		DEBUG && console.log('[mgmsolver] base init finished, tt=', $.now() - tt);
	}

	function move2str(moves) {
		var ret = [];
		for (var i = 0; i < moves.length; i++) {
			ret.push(["U", "R", "F", "L", "BL", "BR", "DR", "DL", "DBL", "B", "DBR", "D"][moves[i][0]] + ["", "2", "2'", "'"][moves[i][1]]);
		}
		return ret.join(' ');
	}

	function move2strRURp(moves) {
		var ret = [];
		for (var i = 0; i < moves.length; i++) {
			let suffix = ["", "2", "2'", "'"][moves[i][1]];
			ret.push(moves[i][0] == 0 ? "U" + suffix : "R U" + suffix + " R'");
		}
		return ret.join(' ');
	}

	// klmminx solver
	var KlmPhase1Move = [];
	var KlmPhase2Move = [];
	var KlmPhase3Move = [];
	var KlmPhase1Prun = [];
	var KlmPhase2Prun = [];
	var KlmPhase3Prun = [];
	var klmPhase1Coord;
	var klmPhase2Coord;
	var klmPhase3Coord;
	var klmSolv1 = null;
	var klmSolv2 = null;
	var klmSolv3 = null;

	function initKlmPhase1() {
		klmPhase1Coord = new CCombCoord([5, 6, 7, 8, 9]);
		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();
		mathlib.createMove(KlmPhase1Move, 1140, function(idx, move) {
			klmPhase1Coord.set(tmp1, idx, 3);
			MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
			return klmPhase1Coord.get(tmp2, 3);
		}, 12);
		mathlib.createPrun(KlmPhase1Prun, 0, 1140 * 27 * 6, 8, comb3FullMove.bind(null, KlmPhase1Move), 12, 4, 5);
		var doKlmPhase1Move = comb3FullMove.bind(null, KlmPhase1Move);
		klmSolv1 = new mathlib.Searcher(null, function(idx) {
			return Math.max(mathlib.getPruning(KlmPhase1Prun, idx[0]), mathlib.getPruning(KlmPhase1Prun, idx[1]));
		}, function(idx, move) {
			var idx1 = [doKlmPhase1Move(idx[0], move), doKlmPhase1Move(idx[1], y2Move[move])];
			if (idx1[0] == idx[0] && idx1[1] == idx[1]) {
				return null;
			}
			return idx1;
		}, 12, 4, ckmv);
	}

	function initKlmPhase2() {
		klmPhase2Coord = new CCombCoord([13, 15, 16, 0, 1, 2, 3, 4, 10, 11, 12, 14, 17, 18, 19]);
		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();
		mathlib.createMove(KlmPhase2Move, 455, function(idx, move) {
			klmPhase2Coord.set(tmp1, idx, 3);
			MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
			return klmPhase2Coord.get(tmp2, 3);
		}, 6);
		mathlib.createPrun(KlmPhase2Prun, 0, 455 * 27 * 6, 8, comb3FullMove.bind(null, KlmPhase2Move), 6, 4, 4);
		var doKlmPhase2Move = comb3FullMove.bind(null, KlmPhase2Move);
		klmSolv2 = new mathlib.Searcher(null, function(idx) {
			return Math.max(mathlib.getPruning(KlmPhase2Prun, idx[0]), mathlib.getPruning(KlmPhase2Prun, idx[1]));
		}, function(idx, move) {
			var idx1 = [doKlmPhase2Move(idx[0], move), doKlmPhase2Move(idx[1], yMove[move])];
			if (idx1[0] == idx[0] && idx1[1] == idx[1]) {
				return null;
			}
			return idx1;
		}, 6, 4, ckmv);
	}

	function initKlmPhase3() {
		klmPhase3Coord = new CCombCoord([0, 1, 2, 3, 4, 10, 11, 14, 17, 18]);
		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();
		mathlib.createMove(KlmPhase3Move, 210, function(idx, move) {
			klmPhase3Coord.set(tmp1, idx);
			MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
			return klmPhase3Coord.get(tmp2);
		}, 3);
		var doKlmPhase3Move = comb4FullMove.bind(null, KlmPhase3Move);
		mathlib.createPrun(KlmPhase3Prun, 0, 210 * 81 * 24, 14, doKlmPhase3Move, 3, 4, 6);
		klmSolv3 = new mathlib.Searcher(null, function(idx) {
			return Math.max(mathlib.getPruning(KlmPhase3Prun, idx[0]), mathlib.getPruning(KlmPhase3Prun, idx[1]), mathlib.getPruning(KlmPhase3Prun, idx[2]));
		}, function(idx, move) {
			return [doKlmPhase3Move(idx[0], move), doKlmPhase3Move(idx[1], (move + 1) % 3), doKlmPhase3Move(idx[2], (move + 2) % 3)];
		}, 3, 4, ckmv);
	}

	function initKlm() {
		initKlm = $.noop;
		init();
		var tt = $.now();
		initKlmPhase1();
		initKlmPhase2();
		initKlmPhase3();
		DEBUG && console.log('[mgmsolver] klm init finished, tt=', $.now() - tt);
	}

	function solveKlmCubie(cc, useSym) {
		initKlm();
		var kc0 = new MgmCubie();
		var kc1 = new MgmCubie();
		var kc2 = new MgmCubie();

		kc0.copy(cc);

		var idx;
		var tt = $.now();
		var sols = [];
		var solsym = 0;

		//klmPhase1
		var idx1s = [];
		for (var s = 0; s < (useSym ? 12 : 1); s++) {
			MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][s * 5]], kc0, MgmCubie.symCube[s * 5], kc1);
			var val0 = klmPhase1Coord.get(kc1, 3);
			MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][2]], kc1, MgmCubie.symCube[2], kc2);
			var val1 = klmPhase1Coord.get(kc2, 3);
			idx1s.push([val0[0] * 27 * 6 + val0[1] * 27 + val0[2], val1[0] * 27 * 6 + val1[1] * 27 + val1[2]]);
		}
		var sol1s = klmSolv1.solveMulti(idx1s, 0, 9);
		var ksym = sol1s[1] * 5;
		var sol1 = sol1s[0];
		MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][ksym]], kc0, MgmCubie.symCube[ksym], kc1);
		kc0.copy(kc1);
		solsym = MgmCubie.symMult[solsym][ksym];
		for (var i = 0; i < sol1.length; i++) {
			var move = sol1[i];
			MgmCubie.MgmMult(kc0, MgmCubie.moveCube[move[0] * 4 + move[1]], kc1);
			kc0.copy(kc1);
			move[0] = MgmCubie.symMulM[MgmCubie.symMulI[0][solsym]][move[0]];
		}
		DEBUG && console.log('[mgmsolver] KlmPhase1s in ', $.now() - tt, 'ms', sol1.length, 'move(s) sym=', ksym);

		//klmPhase2
		tt = $.now();
		var idx2s = [];
		for (var s = 0; s < (useSym ? 5 : 1); s++) {
			MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][s]], kc0, MgmCubie.symCube[s], kc1);
			var val0 = klmPhase2Coord.get(kc1, 3);
			MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][1]], kc1, MgmCubie.symCube[1], kc2);
			var val1 = klmPhase2Coord.get(kc2, 3);
			idx2s.push([val0[0] * 27 * 6 + val0[1] * 27 + val0[2], val1[0] * 27 * 6 + val1[1] * 27 + val1[2]]);
		}
		var sol2s = klmSolv2.solveMulti(idx2s, 0, 14);
		ksym = sol2s[1];
		var sol2 = sol2s[0];
		MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][ksym]], kc0, MgmCubie.symCube[ksym], kc1);
		kc0.copy(kc1);
		solsym = MgmCubie.symMult[solsym][ksym];
		for (var i = 0; i < sol2.length; i++) {
			var move = sol2[i];
			MgmCubie.MgmMult(kc0, MgmCubie.moveCube[move[0] * 4 + move[1]], kc1);
			kc0.copy(kc1);
			move[0] = MgmCubie.symMulM[MgmCubie.symMulI[0][solsym]][move[0]];
		}
		DEBUG && console.log('[mgmsolver] KlmPhase2s in ', $.now() - tt, 'ms', sol2.length, 'move(s) sym=', ksym);

		//klmPhase3
		val0 = klmPhase3Coord.get(kc0);
		MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][6]], kc0, MgmCubie.symCube[6], kc1);
		val1 = klmPhase3Coord.get(kc1);
		MgmCubie.MgmMult3(MgmCubie.symCube[MgmCubie.symMulI[0][29]], kc0, MgmCubie.symCube[29], kc1);
		var val2 = klmPhase3Coord.get(kc1);
		idx = [(val0[0] * 24 + val0[1]) * 81 + val0[2], (val1[0] * 24 + val1[1]) * 81 + val1[2], (val2[0] * 24 + val2[1]) * 81 + val2[2]];
		tt = $.now();
		var sol3 = klmSolv3.solve(idx, 0, 14);
		DEBUG && console.log('[mgmsolver] KlmPhase3 in ', $.now() - tt, 'ms', sol3.length, 'move(s)');
		for (var i = 0; i < sol3.length; i++) {
			var move = sol3[i];
			move[0] = MgmCubie.symMulM[MgmCubie.symMulI[0][solsym]][move[0]];
		}
		DEBUG && console.log('[mgmsolver] klm total length: ', sol1.length + sol2.length + sol3.length);
		return move2str(Array.prototype.concat(sol1, sol2, sol3));
	}


	var mgmSolv1 = null;
	var mgmSolv2 = null;
	var mgmSolv3 = null;
	var mgmSolv4 = null;
	var mgmSolv5 = null;
	var mgmSolv6 = null;
	var mgmSolv7 = null;
	var mgmSolv8 = null;
	var mgmSolv9 = null;
	var mgmSolvA = null;

	/**
	 * SOLE_EO: 0 = no ori, 1 = edge ori, 2 = corner ori
	 */
	function BlockSolver(edges, corns, N_EDGE, N_CORN, N_MOVE, SOLV_ORI) {
		var tt = $.now();

		var mgmECoord = new ECombCoord(edges);
		var mgmCCoord = new CCombCoord(corns);
		// var mgmOCoord = SOLV_ORI ? new EOriCoord(edges) : null;
		var mgmOCoord = SOLV_ORI == 1 ? new EOriCoord(edges) : SOLV_ORI == 2 ? new COriCoord(corns) : null;

		var MgmEMove = [];
		var MgmCMove = [];
		var MgmOMove = [];
		var MgmEPrun = [];
		var MgmCPrun = [];
		var MgmOPrun = [];

		var N_ECOMB = mathlib.Cnk[edges.length][N_EDGE];
		var N_CCOMB = mathlib.Cnk[corns.length][N_CORN];
		var N_EPERM = mathlib.fact[N_EDGE];
		var N_CPERM = mathlib.fact[N_CORN];
		var N_EORI = Math.pow(2, N_EDGE);
		var N_CORI = Math.pow(3, N_CORN);
		var N_ORI = Math.pow(1 + SOLV_ORI, SOLV_ORI == 1 ? edges.length : corns.length);

		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();

		mathlib.createMove(MgmEMove, N_ECOMB, function(idx, move) {
			mgmECoord.set(tmp1, idx, N_EDGE);
			MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
			return mgmECoord.get(tmp2, N_EDGE);
		}, N_MOVE);

		mathlib.createMove(MgmCMove, N_CCOMB, function(idx, move) {
			mgmCCoord.set(tmp1, idx, N_CORN);
			MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
			return mgmCCoord.get(tmp2, N_CORN);
		}, N_MOVE);

		var doMgmEMove = doCombMove4.bind(null, MgmEMove, N_EPERM, N_EORI, 16 / N_EORI);
		var doMgmCMove = doCombMove4.bind(null, MgmCMove, N_CPERM, N_CORI, 81 / N_CORI);

		mathlib.createPrun(MgmEPrun, 0, N_ECOMB * N_EPERM * N_EORI, 14, doMgmEMove, N_MOVE, 4);
		mathlib.createPrun(MgmCPrun, 0, N_CCOMB * N_CPERM * N_CORI, 14, doMgmCMove, N_MOVE, 4);
		if (SOLV_ORI) {
			mathlib.createMove(MgmOMove, N_ORI, function(idx, move) {
				mgmOCoord.set(tmp1, idx, edges.length);
				MgmCubie.MgmMult(tmp1, MgmCubie.moveCube[move * 4], tmp2);
				return mgmOCoord.get(tmp2, edges.length);
			}, N_MOVE);
			mathlib.createPrun(MgmOPrun, 0, N_CCOMB * N_ORI, 14, function(idx, move) {
				var slice = ~~(idx / N_ORI);
				var twst = idx % N_ORI;
				return MgmCMove[move][slice][0] * N_ORI + MgmOMove[move][twst];
			}, N_MOVE, 4);
		}

		var MgmECPrun = [];
		mathlib.createPrun(MgmECPrun, 0, N_ECOMB * N_CCOMB, 14, function(idx, move) {
			var idxE = ~~(idx / N_CCOMB);
			var idxC = idx % N_CCOMB;
			return MgmEMove[move][idxE][0] * N_CCOMB + MgmCMove[move][idxC][0];
		}, N_MOVE, 4);

		this.solv = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(MgmEPrun, idx[0]),
				mathlib.getPruning(MgmCPrun, idx[1]),
				SOLV_ORI ? mathlib.getPruning(MgmOPrun, ~~(idx[1] / N_CPERM / N_CORI) * N_ORI + idx[2]) : 0,
				mathlib.getPruning(MgmECPrun, ~~(idx[0] / N_EPERM / N_EORI) * N_CCOMB + ~~(idx[1] / N_CPERM / N_CORI))
			);
		}, function(idx, move) {
			var idx1 = [
				doMgmEMove(idx[0], move),
				doMgmCMove(idx[1], move),
				SOLV_ORI ? MgmOMove[move][idx[2]] : 0
			];
			if (idx1[0] == idx[0] && idx1[1] == idx[1] && idx1[2] == idx[2]) {
				return null;
			}
			return idx1;
		}, N_MOVE, 4, ckmv);
		this.mgmECoord = mgmECoord;
		this.mgmCCoord = mgmCCoord;
		this.mgmOCoord = mgmOCoord;
		this.N_EDGE = N_EDGE;
		this.N_CORN = N_CORN;
		this.N_ELEN = edges.length;
		DEBUG && console.log('[mgmsolver] mgm init, tt=', $.now() - tt);
	}

	BlockSolver.prototype.getIdx = function(cc) {
		var idxE = this.mgmECoord.get(cc, this.N_EDGE);
		var idxC = this.mgmCCoord.get(cc, this.N_CORN);
		var idxO = this.mgmOCoord ? this.mgmOCoord.get(cc, this.N_ELEN) : 0;
		return [
			(idxE[0] * mathlib.fact[this.N_EDGE] + idxE[1]) * Math.pow(2, this.N_EDGE) + idxE[2],
			(idxC[0] * mathlib.fact[this.N_CORN] + idxC[1]) * Math.pow(3, this.N_CORN) + idxC[2],
			idxO
		];
	}

	BlockSolver.prototype.solve = function(kc0) {
		var tt = $.now();
		var kc1 = new MgmCubie();
		var idx = this.getIdx(kc0);
		var sol = this.solv.solve(idx, 0, 30);
		for (var i = 0; i < sol.length; i++) {
			var move = sol[i];
			MgmCubie.MgmMult(kc0, MgmCubie.moveCube[move[0] * 4 + move[1]], kc1);
			kc0.copy(kc1);
		}
		DEBUG && console.log('[mgmsolver] block solved, tt=', $.now() - tt);
		return sol;
	}

	BlockSolver.prototype.solveMulti = function(kcs, nsol) {
		var tt = $.now();
		var kc1 = new MgmCubie();
		var idxs = [];
		for (var i = 0; i < kcs.length; i++) {
			idxs.push(this.getIdx(kcs[i]));
		}
		// DEBUG && console.log('[mgmsolver] idxs=', idxs);
		var solSet = new Set();
		var sols = [];
		var kcsRet = [];
		this.solv.solveMulti(idxs, 0, 30, function(sol, sidx) {
			var kc0 = new MgmCubie();
			kc0.copy(kcs[sidx]);
			for (var i = 0; i < sol.length; i++) {
				var move = sol[i];
				MgmCubie.MgmMult(kc0, MgmCubie.moveCube[move[0] * 4 + move[1]], kc1);
				kc0.copy(kc1);
			}
			var hashCode = kc0.hashCode();
			if (solSet.has(hashCode)) {
				return false;
			}
			solSet.add(hashCode);
			sols.push([sol.slice(), sidx]);
			kcsRet.push(kc0);
			return sols.length >= nsol;
		});
		DEBUG && console.log('[mgmsolver] block solved multi, tt=', $.now() - tt);
		return [kcsRet, sols];
	}

	function BlockRURpSolver(edges, corns, N_EDGE, N_CORN, N_MOVE) {
		var tt = $.now();

		var mgmEPCoord = new EPermCoord(edges);
		var mgmCPCoord = new CPermCoord(corns);
		var mgmEOCoord = new EOriCoord(edges);
		var mgmCOCoord = new COriCoord(corns);

		var MgmEPMove = [];
		var MgmCPMove = [];
		var MgmEOMove = [];
		var MgmCOMove = [];
		var MgmEPrun = [];
		var MgmCPrun = [];

		var N_EPERM = mathlib.fact[N_EDGE];
		var N_CPERM = mathlib.fact[N_CORN];
		var N_EORI = Math.pow(2, N_EDGE);
		var N_CORI = Math.pow(3, N_CORN);

		var tmp1 = new MgmCubie();
		var tmp2 = new MgmCubie();
		var moveRURp = new MgmCubie();
		MgmCubie.MgmMult3(MgmCubie.moveCube[4], MgmCubie.moveCube[0], MgmCubie.moveCube[7], moveRURp);

		var CoordMove = function(coord, N_PIECE, idx, move) {
			coord.set(tmp1, idx, N_PIECE);
			MgmCubie.MgmMult(tmp1, move == 0 ? MgmCubie.moveCube[0] : moveRURp, tmp2);
			return coord.get(tmp2, N_PIECE);
		};

		mathlib.createMove(MgmEPMove, N_EPERM, CoordMove.bind(null, mgmEPCoord, N_EDGE), N_MOVE);
		mathlib.createMove(MgmCPMove, N_CPERM, CoordMove.bind(null, mgmCPCoord, N_CORN), N_MOVE);
		mathlib.createMove(MgmEOMove, N_EORI, CoordMove.bind(null, mgmEOCoord, N_EDGE), N_MOVE);
		mathlib.createMove(MgmCOMove, N_CORI, CoordMove.bind(null, mgmCOCoord, N_CORN), N_MOVE);

		var doXMove = function(PMove, OMove, N_ORI, idx, move) {
			let perm = ~~(idx / N_ORI);
			let ori = idx % N_ORI;
			perm = PMove[move][perm];
			ori = OMove[move][ori];
			return perm * N_ORI + ori;
		};

		var doMgmEMove = doXMove.bind(null, MgmEPMove, MgmEOMove, N_EORI);
		var doMgmCMove = doXMove.bind(null, MgmCPMove, MgmCOMove, N_CORI);

		mathlib.createPrun(MgmEPrun, 0, N_EPERM * N_EORI, 14, doMgmEMove, N_MOVE, 4);
		mathlib.createPrun(MgmCPrun, 0, N_CPERM * N_CORI, 14, doMgmCMove, N_MOVE, 4);

		this.solv = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(MgmEPrun, idx[0]),
				mathlib.getPruning(MgmCPrun, idx[1])
			);
		}, function(idx, move) {
			return [
				doMgmEMove(idx[0], move),
				doMgmCMove(idx[1], move)
			];
		}, N_MOVE, 4, ckmv);
		this.mgmECoord = { get: (cc) => mgmEPCoord.get(cc, N_EDGE) * N_EORI + mgmEOCoord.get(cc, N_EDGE) };
		this.mgmCCoord = { get: (cc) => mgmCPCoord.get(cc, N_CORN) * N_CORI + mgmCOCoord.get(cc, N_CORN) };
		this.N_EDGE = N_EDGE;
		this.N_CORN = N_CORN;
		DEBUG && console.log('[mgmsolver] mgm init, tt=', $.now() - tt);
	}

	BlockRURpSolver.prototype.getIdx = function(cc) {
		var idxE = this.mgmECoord.get(cc);
		var idxC = this.mgmCCoord.get(cc);
		return [idxE, idxC];
	};

	BlockRURpSolver.prototype.solve = BlockSolver.prototype.solve;
	BlockRURpSolver.prototype.solveMulti = BlockSolver.prototype.solveMulti;

	function initMgm() {
		initMgm = $.noop;
		init();
		var tt = $.now();
		var edgeOrder = [6, 7, 22,  5, 20,  9, 28,  8, 24, 26,  17, 23,  15, 16, 21,  13, 14, 29,  11, 12, 27,  18, 19, 25,  0, 1, 2, 3, 4, 10];
		var cornOrder = [6,         5,      9,      7, 8,       16,      13, 15,      12, 19,      11, 18,      14, 17,      0, 1, 2, 3, 4, 10];
		mgmSolv1 = new BlockSolver(edgeOrder, cornOrder, 3, 1, 12);
		mgmSolv2 = new BlockSolver(edgeOrder.slice(3), cornOrder.slice(1), 2, 1, 9);
		mgmSolv3 = new BlockSolver(edgeOrder.slice(5), cornOrder.slice(2), 2, 1, 8);
		mgmSolv4 = new BlockSolver(edgeOrder.slice(7), cornOrder.slice(3), 3, 2, 7);
		mgmSolv5 = new BlockSolver(edgeOrder.slice(10), cornOrder.slice(5), 2, 1, 6);
		mgmSolv6 = new BlockSolver(edgeOrder.slice(12), cornOrder.slice(6), 3, 2, 5);
		mgmSolv7 = new BlockSolver(edgeOrder.slice(15), cornOrder.slice(8), 3, 2, 4);
		mgmSolv8 = new BlockSolver(edgeOrder.slice(18), cornOrder.slice(10), 3, 2, 3, 1);
		mgmSolv9 = new BlockSolver(edgeOrder.slice(21), cornOrder.slice(12), 3, 2, 2);
		mgmSolvA = new BlockRURpSolver(edgeOrder.slice(24), cornOrder.slice(14), 6, 6, 2);
		DEBUG && console.log('[mgmsolver] mgm init finished, tt=', $.now() - tt);
		return;
	}

	function solveMgmCubie(cc, useSym) {
		initMgm();
		var kc0 = new MgmCubie();
		var kc1 = new MgmCubie();
		var kc2 = new MgmCubie();

		kc0.copy(cc);

		var idx;
		var tt = $.now();
		var sols = [];
		var kcs0 = [kc0];
		var [kcs1, sol1s] = mgmSolv1.solveMulti(kcs0, 100);
		var [kcs2, sol2s] = mgmSolv2.solveMulti(kcs1, 100);
		var [kcs3, sol3s] = mgmSolv3.solveMulti(kcs2, 100);
		var [kcs4, sol4s] = mgmSolv4.solveMulti(kcs3, 10);
		var [kcs5, sol5s] = mgmSolv5.solveMulti(kcs4, 100);
		var [kcs6, sol6s] = mgmSolv6.solveMulti(kcs5, 100);
		var [kcs7, sol7s] = mgmSolv7.solveMulti(kcs6, 100);
		var [kcs8, sol8s] = mgmSolv8.solveMulti(kcs7, 5);
		var [kcs9, sol9s] = mgmSolv9.solveMulti(kcs8, 20);
		var [kcsA, solAs] = mgmSolvA.solveMulti(kcs9, 1);
		var [solA, sidxA] = solAs[0];
		var [sol9, sidx9] = sol9s[sidxA];
		var [sol8, sidx8] = sol8s[sidx9];
		var [sol7, sidx7] = sol7s[sidx8];
		var [sol6, sidx6] = sol6s[sidx7];
		var [sol5, sidx5] = sol5s[sidx6];
		var [sol4, sidx4] = sol4s[sidx5];
		var [sol3, sidx3] = sol3s[sidx4];
		var [sol2, sidx2] = sol2s[sidx3];
		var [sol1, sidx1] = sol1s[sidx2];

		// DEBUG && console.log(sol1s, sol2s, sol3s, sol4s, sol5s, sol6s, sol7s, sol8s, sol9s, solAs);
		var ret = [move2str([].concat(sol1, sol2, sol3, sol4, sol5, sol6, sol7, sol8, sol9)), move2strRURp(solA)].join(' ');

		DEBUG && console.log('[mgmsolver] mgm solved, tt=', $.now() - tt, 'sol_len=', ret.split(/ +/).length);
		return ret;
	}

	function checkSolver(isKlm) {
		init();
		var kc0 = new MgmCubie();
		var kc1 = new MgmCubie();
		var gen = [];
		for (var i = 0; i < 500; i++) {
			var move = mathlib.rn(12);
			gen.push([move, 0]);
			MgmCubie.MgmMult(kc0, MgmCubie.moveCube[move * 4], kc1);
			kc0.copy(kc1);
		}
		return move2str(gen) + '   ' + (isKlm ? solveKlmCubie : solveMgmCubie)(kc0, true);
	}

	return {
		MgmCubie: MgmCubie,
		solveKlmCubie: solveKlmCubie,
		solveMgmCubie: solveMgmCubie,
		checkSolver: DEBUG && checkSolver
	};
})();

/* ==== scramble/scramble.js ==== */
"use strict";

var scrMgr = (function(rn, rndEl) {

	function mega(turns, suffixes, length) {
		turns = turns || [[""]];
		suffixes = suffixes || [""];
		length = length || 0;
		var donemoves = 0;
		var lastaxis = -1;
		var s = [];
		var first, second;
		for (var i = 0; i < length; i++) {
			do {
				first = rn(turns.length);
				second = rn(turns[first].length);
				if (first != lastaxis) {
					donemoves = 0;
					lastaxis = first;
				}
			} while (((donemoves >> second) & 1) != 0);
			donemoves |= 1 << second;
			if (turns[first][second].constructor == Array) {
				s.push(rndEl(turns[first][second]) + rndEl(suffixes));
			} else {
				s.push(turns[first][second] + rndEl(suffixes));
			}
		}
		return s.join(' ');
	}

	/**
	 *	{type: callback(type, length, state)}
	 *	callback return: scramble string or undefined means delay
	 */
	var scramblers = {
		"blank": function() {
			return "N/A";
		}
	};

	/**
	 *  {type: func(idx) {return [filter, probs, imgGen][idx])
	 */
	var extra = {};

	/**
	 *	filter_and_probs: [[str1, ..., strN], [prob1, ..., probN], imgGen]
	 */
	function regScrambler(type, callback, filter_and_probs) {
		DEBUG && console.log('[regscr]', type);
		if ($.isArray(type)) {
			for (var i = 0; i < type.length; i++) {
				scramblers[type[i]] = callback;
			}
		} else {
			scramblers[type] = callback;
			if ($.isArray(filter_and_probs)) {
				extra[type] = function(ret, idx) { return ret[idx]; }.bind(null, filter_and_probs);
			} else if (filter_and_probs) {
				extra[type] = filter_and_probs;
			}
		}
		if (type == '333') {
			scramblers['mrbl'] = scramblers['333oh'] = scramblers['333ft'] = callback;
		}
		return regScrambler;
	}

	/**
	 *	return extra info for specific type, idx: 0 => filter, 1 => probs, 2 => imgGen
	 */
	function getExtra(type, idx) {
		if (!(type in extra)) {
			return;
		}
		return extra[type](idx);
	}

	/**
	 *	format string,
	 *		${args} => scramblers[scrType](scrType, scrArg)
	 *		#{args} => mega(args)
	 */
	function formatScramble(str) {
		var repfunc = function(match, p1) {
			if (match[0] == '$') {
				var args = [p1];
				if (p1[0] == '[') {
					args = JSON.parse(p1);
				}
				return scramblers[args[0]].apply(this, args);
			} else if (match[0] == '#') {
				return mega.apply(this, JSON.parse('[' + p1 + ']'));
			} else {
				return '';
			}
		};
		var re1 = /[$#]\{([^\}]+)\}/g;
		return str.replace(re1, repfunc);
	}

	function rndState(filter, probs) {
		if (probs == undefined) {
			return undefined;
		}
		var ret = probs.slice();
		if (filter == undefined) {
			filter = ret;
		}
		if (probs[0] == 0) {
			return filter.slice();
		}
		var valids = [];
		for (var i = 0; i < filter.length; i++) {
			valids.push(i);
			if (!filter[i]) {
				ret[i] = 0;
				valids.pop();
			} else if (equalProb == 1) {
				ret[i] = 1;
			}
		}
		if (equalProb == 2) {
			if (millerCnt++ < 0) {
				millerCnt = mathlib.rn(65536);
			}
			return valids[MillerShuffle(millerCnt % valids.length, ~~(millerCnt / valids.length), valids.length)];
		}
		return mathlib.rndProb(ret);
	}

	function fixCase(cases, probs) {
		if (cases != undefined) {
			return cases;
		}
		if (equalProb == 2) { // strict equal prob
			if (millerCnt++ < 0) {
				millerCnt = mathlib.rn(65536);
			}
			return MillerShuffle(millerCnt % probs.length, ~~(millerCnt / probs.length), probs.length);
		} else if (equalProb == 1) { // weak equal prob
			return mathlib.rn(probs.length);
		} else {
			return mathlib.rndProb(probs);
		}
	}

	var equalProb = 0;
	var millerCnt = -1;

	function toTxt(scramble) {
		return scramble.replace(/<span[^>]*>(.*?)<\/span>/ig, '$1 ').replace(/~/g, '').replace(/\\n/g, '\n').replace(/`(.*?)`/g, '$1');
	}

	function MillerShuffle(idx, permIdx, length) {
		if (length <= 0 || idx < 0 || permIdx < 0) {
			return 0;
		}
		var p1 = 24317, p2 = 32141, p3 = 63629;
		var randR = permIdx + ~~(idx / length) * 131;
		var r1 = randR % p1 + 42;
		var r2 = ((randR * 0x89) ^ r1) % p2;
		var r3 = (r1 + r2 + p3) % length;
		var r4 = r1 ^ r2 ^ r3;
		var rx = ~~(randR / length) % length + 1;
		var rx2 = ~~(randR / length / length) % length + 1;
		var sidx = (idx + randR) % length;
		if (sidx % 3 == 0) sidx = (((sidx / 3) * p1 + r1) % ~~((length + 2) / 3)) * 3;
		if (sidx % 2 == 0) sidx = (((sidx / 2) * p2 + r2) % ~~((length + 1) / 2)) * 2;
		if (sidx < ~~(length / 2)) sidx = (sidx * p3 + r4) % ~~(length / 2);
		if ((sidx ^ rx) < length) sidx ^= rx;
		sidx = (sidx * p3 + r3) % length;
		if ((sidx ^ rx2) < length) sidx ^= rx2;
		return sidx;
	}

	return {
		reg: regScrambler,
		scramblers: scramblers,
		getExtra: getExtra,
		mega: mega,
		formatScramble: formatScramble,
		rndState: rndState,
		fixCase: fixCase,
		setEqPr: function(ep) { equalProb = ~~ep; },
		getEqPr: function() { return equalProb; },
		toTxt: toTxt
	}
})(mathlib.rn, mathlib.rndEl);


var scramble = ISCSTIMER && execMain(function(rn, rndEl) {
	var scramblers = scrMgr.scramblers;
	var getExtra = scrMgr.getExtra;

	var div = $('<div id="scrambleDiv"/>');
	var title = $('<div />').addClass('title');
	var selects = [$('<select />'), $('<select />')];
	var menu = new kernel.TwoLvMenu(scrdata, loadScrOptsAndGen, selects[0], selects[1], '333');
	var scrOpt = $('<input type="button" class="icon">').val('\ue994');
	var scrOptDiv = $('<div>');
	var scrFltDiv = $('<div class="sflt">');
	var scrFltSelAll = $('<input type="button">').val(SCROPT_BTNALL);
	var scrFltSelNon = $('<input type="button">').val(SCROPT_BTNNONE);
	var scrLen = $('<input type="text" maxlength="3">');
	var scrHelp = $('<span>');
	var sdiv = $('<div>');
	var ssdiv = $('<div id="scrambleTxt"/>');
	var alias = {
		'333oh': '333',
		'333ft': '333',
		'mrbl': '333'
	};
	var helpMsg = {
		'easyc': EASY_SCRAMBLE_HINT,
		'easyxc': EASY_SCRAMBLE_HINT
	};

	var scrFlt = "";
	var scrTPRe = /^\$T([a-zA-Z0-9]+)(-[0-9]+)?\$\s*(.*)$/;

	function genScramble() {
		kernel.blur();
		kernel.pushSignal('scrambling', type);
		sdiv.html(SCRAMBLE_SCRAMBLING + '...');
		typeExIn = (!type || /^(remote|input$)/.exec(type)) ? typeExIn : type;
		if (!isDisplayLast) {
			lasttype = type;
			lastscramble = scramble;
			lastlen = len;
		}
		isDisplayLast = false;
		if (lastscramble) {
			lastClick.addClass('click').unbind('click').click(procLastClick);
		}

		type = menu.getSelected() || '333';
		len = ~~scrLen.val();
		if (lasttype != type) {
			kernel.setProp('scrType', type);
		}
		scramble = "";
		requestAnimFrame(doScrambleIt);
	}


	var type, scramble, len = 0;
	var lasttype, lastscramble, lastlen = 0;
	var neutLevel = 0;
	var typeExIn = '333';
	var isDisplayLast = false;
	var lastClick = $('<span />').html(SCRAMBLE_LAST);
	var nextClick = $('<span />').addClass('click').html(SCRAMBLE_NEXT).click(procNextClick);

	function procLastClick() {
		isDisplayLast = true;
		sdiv.html(scrStd(lasttype, lastscramble, lastlen, true));
		lastClick.removeClass('click').unbind('click');
		if (lastscramble != undefined) {
			kernel.pushSignal('scrambleX', scrStd(lasttype, lastscramble, lastlen));
		}
	}

	function procNextClick() {
		if (isDisplayLast) {
			isDisplayLast = false;
			sdiv.html(scrStd(type, scramble, len, true));
			lastClick.addClass('click').unbind('click').click(procLastClick);
			kernel.pushSignal('scrambleX', scrStd(type, scramble, len));
		} else {
			genScramble();
		}
	}

	function pushScramble(_scramble) {
		if (!isDisplayLast) {
			lasttype = type;
			lastscramble = scramble;
			lastlen = len;
		}
		isDisplayLast = false;
		scramble = _scramble;
		sdiv.html(scrStd(type, scramble, len, true));
		lastClick.addClass('click').unbind('click').click(procLastClick);
		kernel.pushSignal('scrambleX', scrStd(type, scramble, len));
	}

	function procScrambleClick() {
		if (!scramble) {
			return;
		}
		var act = kernel.getProp('scrClk', 'n');
		if (act == 'c') {
			var scrTxt = (tools.getCurScramble()[1]).trim();
			$.clipboardCopy(scrTxt).then(
				logohint.push.bind(logohint, LGHINT_SCRCOPY),
				logohint.push.bind(logohint, LGHINT_COPYFAIL)
			);
		} else if (act == '+') {
			procNextClick();
		}
	}

	function scrStd(type, scramble, len, forDisplay, forceKeyM) {
		scramble = scramble || '';
		len = len || 0;
		var m = scrTPRe.exec(scramble);
		if (m) {
			type = m[1];
			scramble = m[3];
			len = ~~m[2];
		}
		var scrTxt = scrMgr.toTxt(scramble);
		if (forDisplay) {
			var fontSize = kernel.getProp('scrASize') ? Math.max(0.25, Math.round(Math.pow(50 / Math.max(scrTxt.length, 10), 0.30) * 20) / 20) : 1;
			sdiv.css('font-size', fontSize + 'em');
			DEBUG && console.log('[scrFontSize]', fontSize);
			return scramble.replace(/~/g, '&nbsp;').replace(/\\n/g, '\n')
				.replace(/`(.*?)`/g, forceKeyM || kernel.getProp('scrKeyM', false) ? '<u>$1</u>' : '$1');
		} else {
			return [type, scrTxt, len];
		}
	}

	function doScrambleIt() {
		calcScramble();
		if (scramble) {
			scrambleOK();
		} else {
			sdiv.html(SCRAMBLE_SCRAMBLING + "... ");
		}
	}

	var enableCache = true;

	function setCacheEnable(enable) {
		enableCache = enable;
	}

	var cacheTid = 0;

	function genCachedScramble(args, detailType, isPredict) {
		if (!enableCache || args[0].startsWith('nocache_')) {
			return;
		}
		if (csTimerWorker && csTimerWorker.getScramble) {
			cacheTid = cacheTid || csTimerWorker.getScramble(args, function(detailType, scramble) {
				DEBUG && console.log('[scrcache]', detailType + ' cached by csTimerWorker');
				saveCachedScramble(detailType, scramble);
			}.bind(undefined, detailType));
		} else if (!isPredict) {
			cacheTid = cacheTid || setTimeout(function(detailType, args) {
				var scrambler = scramblers[args[0]];
				saveCachedScramble(detailType, scrambler.apply(scrambler, args));
			}.bind(undefined, detailType, args), 500);
		}
	}

	function saveCachedScramble(detailType, scramble) {
		var cachedScr = JSON.parse(localStorage['cachedScr'] || null) || {};
		if ($.isArray(cachedScr)) {
			cachedScr = {};
		}
		cachedScr[detailType] = scramble;
		localStorage['cachedScr'] = JSON.stringify(cachedScr);
		cacheTid = 0;
	}

	$(function() {
		if (!csTimerWorker || !csTimerWorker.getScramble) {
			return;
		}
		var forceCached = ['["444wca",40,null]'];
		var cachedScr = JSON.parse(localStorage['cachedScr'] || null) || {};
		if ($.isArray(cachedScr)) {
			cachedScr = {};
		}
		for (var i = 0; i < forceCached.length; i++) {
			if (!(forceCached[i] in cachedScr)) {
				setTimeout(genCachedScramble.bind(undefined, JSON.parse(forceCached[i]), forceCached[i], true), 2500 + ~~(Math.random() * 5000));
			}
		}
	});

	function calcScramble() {
		if (!type) {
			return;
		}
		scramble = "";
		var realType = alias[type] || type;

		if (realType == 'input') {
			scramble = inputScrambleGen.next();
			return;
		} else {
			inputScrambleGen.clear();
		}

		if (realType.startsWith('remote')) {
			scramble = remoteScrambleGen.next(realType);
			return;
		} else {
			remoteScrambleGen.clear();
		}

		if (realType in scramblers) {
			var cachedScr = JSON.parse(localStorage['cachedScr'] || null) || {};
			var detailType = JSON.stringify([realType, len, scrFlt[1], neutLevel]);
			if (enableCache && detailType in cachedScr && !realType.startsWith('nocache_')) {
				scramble = cachedScr[detailType];
				delete cachedScr[detailType];
				localStorage['cachedScr'] = JSON.stringify(cachedScr);
			} else {
				scramble = scramblers[realType](realType, len, rndState(scrFlt[1], getExtra(realType, 1)), neutLevel, scrFlt[1]);
			}
			genCachedScramble([realType, len, rndState(scrFlt[1], getExtra(realType, 1)), neutLevel, scrFlt[1]], detailType);
			return;
		}

		requestAnimFrame(doScrambleIt);
	}

	function scrambleOK(scrStr) {
		scramble = (scrStr || scramble).replace(/(\s*)$/, "");
		sdiv.html(scrStd(type, scramble, len, true));
		kernel.pushSignal('scramble', scrStd(type, scramble, len));
	}

	var remoteScrambleGen = (function() {
		var remoteScramble = [];

		function next(type) {
			var ret = null;
			while (!ret && remoteScramble.length != 0) {
				ret = remoteScramble.shift();
			}
			if (ret) {
				return ret;
			}
			if (type == 'remoteComp') {
				if (!window['onlinecomp']) {
					remoteFail();
				} else {
					onlinecomp.getScrambles().then(function(ret) {
						if (!parseInput(ret)) {
							remoteFail();
						} else {
							requestAnimFrame(doScrambleIt);
						}
					}, remoteFail);
				}
			} else if (type == 'remoteBattle') {
				if (!window['battle']) {
					remoteFail();
				} else {
					battle.getScrambles().then(function(ret) {
						if (!parseInput(ret)) {
							remoteFail();
						} else {
							requestAnimFrame(doScrambleIt);
						}
					}, remoteFail);
				}
			}
			return "";
		}

		function remoteFail() {
			kernel.setProp('scrType', typeExIn);
		}

		function clear() {
			remoteScramble = [];
		}

		function parseInput(ret) {
			if (!$.isArray(ret)) {
				return false;
			}
			remoteScramble = ret;
			return remoteScramble.length != 0;
		}

		return {
			next: next,
			clear: clear
		};
	})();

	var inputScrambleGen = (function() {

		var inputScramble = [];
		var inputDiv;
		var inputText;
		var puzzleSelect;

		function init() {
			inputDiv = $('<table>');
			inputText = $('<textarea style="width:100%;height:100%;">');
			puzzleSelect = $('<select>');
			var puzzles = ["333", "222so", "444wca", "555wca", "666wca", "777wca", "clkwca", "mgmp", "pyrso", "skbso", "sqrs"];
			for (var i = 0; i < puzzles.length; i++) {
				puzzleSelect.append($('<option>').val(puzzles[i]).html(menu.getValName(puzzles[i])));
			}
			inputDiv.append(
				$('<tr height=0%>').append($('<td>').append(SCRAMBLE_INPUTTYPE + ':', puzzleSelect)),
				$('<tr height=100%>').append($('<td>').append(inputText))
			);
			puzzleSelect.val('333');
		}

		function next() {
			var ret = null;
			while (!ret && inputScramble.length != 0) {
				ret = inputScramble.shift();
			}
			if (ret) {
				return ret;
			}
			if (!puzzleSelect) {
				init();
			}
			inputText.val("");
			kernel.showDialog([inputDiv, inputOK, inputCancel], 'input', SCRAMBLE_INPUT);
			return "";
		}

		function clear() {
			inputScramble = [];
		}

		function inputOK() {
			if (!parseInput(inputText.val())) {
				kernel.setProp('scrType', typeExIn);
			} else {
				doScrambleIt();
			}
		}

		function inputCancel() {
			kernel.setProp('scrType', typeExIn);
		}

		function parseInput(str) {
			if (str.match(/^\s*$/)) {
				return false;
			}
			inputScramble = [];
			var inputs = str.split('\n');
			var typePrefix = '$T' + puzzleSelect.val() + '$';
			for (var i = 0; i < inputs.length; i++) {
				var s = inputs[i];
				if (s.match(/^\s*$/) == null) {
					s = s.replace(/^\d+[\.\),]\s*/, '');
					if (!scrTPRe.exec(s)) {
						s = typePrefix + s;
					}
					inputScramble.push(s);
				}
			}
			return inputScramble.length != 0;
		}

		return {
			next: next,
			clear: clear
		};
	})();

	function loadScrOpts() {
		kernel.blur();
		var idx = menu.getSelIdx();
		if (!scrdata[idx[0]] || !scrdata[idx[0]][1] || !scrdata[idx[0]][1][idx[1]]) {
			idx = [0, 0];
		}
		var len = scrdata[idx[0]][1][idx[1]][2];
		scrLen.val(Math.abs(len));
		scrLen[0].disabled = len <= 0;
		var curType = menu.getSelected();
		if (curType in helpMsg) {
			scrHelp.text(helpMsg[curType]).show();
		} else {
			scrHelp.hide();
		}
		scrFlt = JSON.parse(kernel.getProp('scrFlt', JSON.stringify([curType, getExtra(curType, 0)])));
		scrOpt[0].disabled = scrLen[0].disabled && !getExtra(curType, 0);
		if (scrFlt[0] != curType) {
			scrFlt = [curType, getExtra(curType, 0) && mathlib.valuedArray(getExtra(curType, 0).length, 1)];
			kernel.setProp('scrFlt', JSON.stringify(scrFlt), 'session');
		}
	}

	function loadScrOptsAndGen() {
		loadScrOpts();
		genScramble();
	}

	function showScrOpt() {
		scrFltDiv.empty();
		var chkBoxList = [];
		var chkLabelList = [];
		var modified = false;
		var data = getExtra(type, 0);
		if (data) {
			var imgGen = getExtra(type, 2);
			var curData = data;
			if (scrFlt[0] == type) {
				curData = scrFlt[1] || data;
			}
			// console.log(scrFlt, curData);
			scrFltDiv.append('<br>', scrFltSelAll, scrFltSelNon, '<br><br>');
			var dataGroup = {};
			for (var i = 0; i < data.length; i++) {
				var spl = data[i].indexOf('-');
				if (spl == -1) {
					dataGroup[data[i]] = [i];
					continue;
				}
				var group = data[i].slice(0, spl);
				dataGroup[group] = dataGroup[group] || [];
				dataGroup[group].push(i);
			}
			for (var i = 0; i < data.length; i++) {
				var chkBox = $('<input type="checkbox">').val(i);
				if (curData[i]) {
					chkBox[0].checked = true;
				}
				chkBoxList.push(chkBox);
				var label = $('<label>').append(chkBox, data[i]);
				if (imgGen) {
					var img = $('<img style="display:block;">');
					imgGen(i, img);
					img.width('5em');
					img.height('5em');
					label.append('<br>', img);
					label.addClass('bimg');
				}
				chkLabelList.push(label);
			}

			var cntSel = function(g) {
				var cnt = 0;
				$.each(dataGroup[g], function(idx, val) {
					cnt += chkBoxList[val][0].checked ? 1 : 0;
				});
				return cnt + '/' + dataGroup[g].length;
			};

			for (var g in dataGroup) {
				if (dataGroup[g].length == 1) {
					scrFltDiv.append(chkLabelList[dataGroup[g][0]]);
				}
			}
			for (var g in dataGroup) {
				if (dataGroup[g].length == 1) {
					continue;
				}
				scrFltDiv.append($('<div>').attr('data', g).append(
					$('<div class="sgrp">').append(
						$('<span>').html(g + ' ' + cntSel(g)), ' | ',
						$('<span class="click">').html(SCROPT_BTNALL).click(function() {
							var g = $(this).parent().parent().attr('data');
							$.each(dataGroup[g], function(idx, val) {
								chkBoxList[val][0].checked = true;
							});
							$(this).parent().children().first().html(g + ' ' + cntSel(g));
						}), ' | ',
						$('<span class="click">').html(SCROPT_BTNNONE).click(function() {
							var g = $(this).parent().parent().attr('data');
							$.each(dataGroup[g], function(idx, val) {
								chkBoxList[val][0].checked = false;
							});
							$(this).parent().children().first().html(g + ' ' + cntSel(g));
						}), ' | ',
						$('<span class="click">[+]</span>').click(function() {
							$(this).parent().next().toggle();
						})),
					$('<div>').append($.map(dataGroup[g], function(val) {
						chkBoxList[val].change(function() {
							var g = $(this).parent().parent().parent().attr('data');
							$(this).parent().parent().parent().find('span:first').html(g + ' ' + cntSel(g));
						});
						return chkLabelList[val];
					})))
				);
			}

			scrFltSelAll.unbind('click').click(function() {
				for (var i = 0; i < chkBoxList.length; i++) {
					if (!chkBoxList[i][0].checked) {
						chkBoxList[i][0].checked = true;
					}
					chkBoxList[i].change();
				}
			});
			scrFltSelNon.unbind('click').click(function() {
				for (var i = 0; i < chkBoxList.length; i++) {
					if (chkBoxList[i][0].checked) {
						chkBoxList[i][0].checked = false;
					}
					chkBoxList[i].change();
				}
			});
		}

		function procDialog() {
			var data = getExtra(type, 0);
			if (data) {
				data = mathlib.valuedArray(data.length, 1);
				var hasVal = false;
				for (var i = 0; i < chkBoxList.length; i++) {
					if (!chkBoxList[i][0].checked) {
						data[i] = 0;
					} else {
						hasVal = true;
					}
				}
				if (!hasVal) {
					alert(SCROPT_EMPTYALT);
				} else {
					scrFlt = [type, data];
					var scrFltStr = JSON.stringify(scrFlt);
					if (kernel.getProp('scrFlt') != scrFltStr) {
						modified = true;
						kernel.setProp('scrFlt', scrFltStr);
					}
				}
				if (modified) {
					genScramble();
				}
			}
		}
		kernel.showDialog([scrOptDiv, procDialog, null, procDialog], 'scropt', SCROPT_TITLE);
	}

	var isEn = false;

	function procSignal(signal, value) {
		if (signal == 'time') {
			if (isEn) {
				genScramble();
			} else {
				sdiv.empty();
				kernel.pushSignal('scramble', ['-', '', 0]);
			}
		} else if (signal == 'property') {
			if (value[0] == 'scrSize') {
				ssdiv.css('font-size', value[1] / 7 + 'em');
			} else if (value[0] == 'scrMono') {
				div.css('font-family', value[1] ? 'Monospace' : 'Arial');
			} else if (value[0] == 'scrType') {
				if (value[1] != menu.getSelected()) {
					loadType(value[1]);
				}
			} else if (value[0] == 'scrLim') {
				if (value[1]) {
					ssdiv.addClass('limit');
				} else {
					ssdiv.removeClass('limit');
				}
			} else if (value[0] == 'scrAlign') {
				div.css('text-align', {'c': 'center', 'l': 'left', 'r': 'right'}[value[1]]);
			} else if (value[0] == 'scrWrap') {
				ssdiv.css('text-wrap', {'n': 'unset', 'b': 'balance'}[value[1]]);
			} else if (value[0] == 'scrFast') {
				alias['444wca'] = value[1] ? '444m' : '444wca';
				if (type == '444wca') {
					genScramble();
				}
			} else if (value[0] == 'scrKeyM') {
				sdiv.html(isDisplayLast ? scrStd(lasttype, lastscramble || '', lastlen || 0, true) : scrStd(type, scramble || '', len, true));
			} else if (value[0] == 'scrHide') {
				if (value[1]) {
					title.hide();
				} else {
					title.show();
				}
			} else if (value[0] == 'scrNeut') {
				neutLevel = ~~value[1];
				if (value[2] == 'modify') {
					genScramble();
				}
			} else if (value[0] == 'scrEqPr') {
				scrMgr.setEqPr(~~value[1]);
			} else if (value[0] == 'scrClk') {
				ssdiv.css('cursor', {
					'n': 'default',
					'c': 'copy',
					'+': 'pointer'
				}[value[1]]);
				if (value[1] == 'n') {
					ssdiv.removeClass('noselect');
				} else {
					ssdiv.addClass('noselect');
				}
			}
		} else if (signal == 'button' && value[0] == 'scramble') {
			isEn = value[1];
			if (isEn && sdiv.html() == '') {
				genScramble();
			}
		} else if (signal == 'ctrl' && value[0] == 'scramble') {
			if (value[1] == 'last') {
				procLastClick();
			} else if (value[1] == 'next') {
				procNextClick();
			}
		} else if (signal == 'scrfix') {
			if (!value) {
				return;
			}
			sdiv.html(scrStd(type, value, len, true, true));
		}
	}

	function procOnType(type, func) {
		for (var i = 0; i < scrdata.length; i++) {
			for (var j = 0; j < scrdata[i][1].length; j++) {
				if (scrdata[i][1][j][1] == type) {
					func(i, j);
					return;
				}
			}
		}
	}

	function loadType(type) {
		menu.loadVal(type);
		loadScrOptsAndGen();
	}

	function getTypeName(type) {
		var name = '';
		procOnType(type, function(i, j) {
			name = scrdata[i][0] + '>' + scrdata[i][1][j][0];
		});
		return name;
	}

	function getTypeIdx(type) {
		var idx = 1e300;
		procOnType(type, function(i, j) {
			idx = i * 100 + j;
		});
		return idx;
	}

	var scrambleGenerator = (function() {
		var tdiv = $('<div />').css('text-align', 'center').css('font-size', '0.7em');
		var button = $('<span />').addClass('click').html(SCRGEN_GEN);
		var scrNum = $('<input type="text" maxlength="3">').val(5);
		var output = $('<textarea rows="10" style="width: 100%" readonly />');
		var prefix = $('<select><option value="1. ">1. </option><option value="1) ">1) </option><option value="(1) ">(1) </option><option value=""></option></select>');
		var downclk = $('<span class="click">').html('Download');
		tdiv.append(SCRGEN_NSCR, scrNum, "&nbsp;", SCRGEN_PRE).append(prefix, "<br>", button, ' | ', downclk, "<br>", output);
		var genScrambles = "";

		function generate() {
			var n_scramble = ~~scrNum.val();
			genScrambles = "";
			var scramble_copy = scramble;
			var pre = prefix.val();
			for (var i = 0; i < n_scramble; i++) {
				calcScramble();
				genScrambles += pre.replace('1', i + 1) + scramble + "\n";
			}
			scramble = scramble_copy;
			output.text(genScrambles);
			$.clipboardCopy(genScrambles).then(
				logohint.push.bind(logohint, LGHINT_SCRCOPY),
				logohint.push.bind(logohint, LGHINT_COPYFAIL)
			);
			output.select();
		}

		function downClk(e) {
			if (!genScrambles) {
				return;
			}
			var blob = new Blob([genScrambles], {'type': 'text/plain'});
			var outFile = $('<a class="click"/>').appendTo('body');
			outFile.attr('href', URL.createObjectURL(blob));
			outFile.attr('download', 'Scrambles_' + mathlib.time2str(new Date()/1000, '%Y%M%D_%h%m%s') + '.txt');
			outFile[0].click();
			outFile.remove();
		}

		return function(fdiv) {
			if (!fdiv) {
				return;
			}
			fdiv.empty().append(tdiv.width(div.width() / 2));
			prefix.unbind("change").change(kernel.blur);
			button.unbind("click").click(generate);
			downclk.unbind("click").click(downClk);
		}
	})();

	var rndState = scrMgr.rndState;

	$(function() {
		kernel.regListener('scramble', 'time', procSignal);
		kernel.regListener('scramble', 'property', procSignal, /^scr(?:Size|Mono|Type|Lim|Align|Wrap|Fast|KeyM|Hide|Neut|EqPr|Clk)$/);
		kernel.regListener('scramble', 'button', procSignal, /^scramble$/);
		kernel.regListener('scramble', 'ctrl', procSignal, /^scramble$/);
		kernel.regListener('scramble', 'scrfix', procSignal);
		kernel.regProp('scramble', 'scrSize', 2, PROPERTY_SCRSIZE, [15, 5, 50], 1);
		kernel.regProp('scramble', 'scrASize', 0, PROPERTY_SCRASIZE, [true], 1);
		kernel.regProp('scramble', 'scrMono', 0, PROPERTY_SCRMONO, [true], 1);
		kernel.regProp('scramble', 'scrLim', 0, PROPERTY_SCRLIM, [false], 1);
		kernel.regProp('scramble', 'scrAlign', 1, PROPERTY_SCRALIGN, ['c', ['c', 'l', 'r'], PROPERTY_SCRALIGN_STR.split('|')], 1);
		kernel.regProp('scramble', 'scrWrap', 1, PROPERTY_SCRWRAP, ['b', ['b', 'n'], PROPERTY_SCRWRAP_STR.split('|')], 1);
		kernel.regProp('scramble', 'preScr', 1, "pre-scramble", ['',
			["", "y", "y2", "y'", "z2", "z2 y", "z2 y2", "z2 y'", "z'", "z' y", "z' y2", "z' y'", "z", "z y", "z y2", "z y'", "x'", "x' y", "x' y2", "x' y'", "x", "x y", "x y2", "x y'"],
			["(UF)", "(UR) y", "(UB) y2", "(UL) y'", "(DF) z2", "(DL) z2 y", "(DB) z2 y2", "(DR) z2 y'", "(RF) z'", "(RD) z' y", "(RB) z' y2", "(RU) z' y'", "(LF) z", "(LU) z y", "(LB) z y2", "(LD) z y'", "(BU) x'", "(BR) x' y", "(BD) x' y2", "(BL) x' y'", "(FD) x", "(FR) x y", "(FU) x y2", "(FL) x y'"]
		], 1);
		kernel.regProp('scramble', 'preScrT', 1, "training pre-scramble", ['z2',
			["", "y", "y2", "y'", "z2", "z2 y", "z2 y2", "z2 y'", "z'", "z' y", "z' y2", "z' y'", "z", "z y", "z y2", "z y'", "x'", "x' y", "x' y2", "x' y'", "x", "x y", "x y2", "x y'"],
			["(UF)", "(UR) y", "(UB) y2", "(UL) y'", "(DF) z2", "(DL) z2 y", "(DB) z2 y2", "(DR) z2 y'", "(RF) z'", "(RD) z' y", "(RB) z' y2", "(RU) z' y'", "(LF) z", "(LU) z y", "(LB) z y2", "(LD) z y'", "(BU) x'", "(BR) x' y", "(BD) x' y2", "(BL) x' y'", "(FD) x", "(FR) x y", "(FU) x y2", "(FL) x y'"]
		], 1);
		kernel.regProp('scramble', 'scrNeut', 1, PROPERTY_SCRNEUT, ['n', ['n', '1', '2', '6'], PROPERTY_SCRNEUT_STR.split('|')], 1);
		kernel.regProp('scramble', 'scrEqPr', 1, PROPERTY_SCREQPR, ['0', ['0', '1', '2'], PROPERTY_SCREQPR_STR.split('|')], 1);
		kernel.regProp('scramble', 'scrFast', 0, PROPERTY_SCRFAST, [false]);
		kernel.regProp('scramble', 'scrKeyM', 0, PROPERTY_SCRKEYM, [false], 1);
		kernel.regProp('scramble', 'scrClk', 1, PROPERTY_SCRCLK, ['c', ['n', 'c', '+'], PROPERTY_SCRCLK_STR.split('|')], 1);
		kernel.regProp('scramble', 'scrType', ~5, SCRAMBLE_INPUTTYPE, ['333'], 3);

		scrLen.change(genScramble);
		scrOpt.click(showScrOpt);
		scrOptDiv.append($('<div>').append(SCRAMBLE_LENGTH + ': ', scrLen), scrHelp, scrFltDiv);

		title.append($('<nobr>').append(selects[0], ' ', selects[1], ' ', scrOpt), " <wbr>");
		title.append($('<nobr>').append(lastClick, '/', nextClick, ' ', SCRAMBLE_SCRAMBLE));
		div.append(title, ssdiv.append(sdiv).click(procScrambleClick));
		tools.regTool('scrgen', TOOLS_SCRGEN, scrambleGenerator);
		ssdiv.click(function() {
			title.show();
			kernel.blur();
			kernel.setProp('scrHide', false);
		});
		kernel.regProp('ui', 'scrHide', ~0, 'Hide Scramble Selector', [false]);
		kernel.addWindow('scramble', BUTTON_SCRAMBLE, div, true, true, 3);
		loadScrOpts();
	});

	return {
		getTypeName: getTypeName,
		getTypeIdx: getTypeIdx,
		scrStd: scrStd,
		pushScramble: pushScramble,
		setCacheEnable: setCacheEnable
	}
}, [mathlib.rn, mathlib.rndEl]);

/* ==== scramble/megascramble.js ==== */
(function(mega, rn, rndEl) {
	var cubesuff=["","2","'"];
	var minxsuff=["","2","'","2'"];
	var args = {
		"111": [[["x"],["y"],["z"]],cubesuff], // 1x1x1
		"2223": [[["U"],["R"],["F"]],cubesuff], // 2x2x2 (3-gen)
		"2226": [[[["U","D"]],[["R","L"]],[["F","B"]]],cubesuff], // 2x2x2 (6-gen)
		"333o": [[["U","D"],["R","L"],["F","B"]],cubesuff], // 3x3x3 (old style)
		"334": [[[["U","U'","U2"],["u","u'","u2"]],[["R2","L2","M2"]],[["F2","B2","S2"]]]], // 3x3x4
		"336": [[[["U","U'","U2"],["u","u'","u2"],["3u","3u2","3u'"]],[["R2","L2","M2"]],[["F2","B2","S2"]]]], // 3x3x6
		"888": [[["U","D","u","d","3u","3d","4u"],["R","L","r","l","3r","3l","4r"],["F","B","f","b","3f","3b","4f"]],cubesuff], // 8x8x8 (SiGN)
		"999": [[["U","D","u","d","3u","3d","4u","4d"],["R","L","r","l","3r","3l","4r","4l"],["F","B","f","b","3f","3b","4f","4b"]],cubesuff], // 9x9x9 (SiGN)
		"101010": [[["U","D","u","d","3u","3d","4u","4d","5u"],["R","L","r","l","3r","3l","4r","4l","5r"],["F","B","f","b","3f","3b","4f","4b","5f"]],cubesuff], // 10x10x10 (SiGN)
		"111111": [[["U","D","u","d","3u","3d","4u","4d","5u","5d"],["R","L","r","l","3r","3l","4r","4l","5r","5l"],["F","B","f","b","3f","3b","4f","4b","5f","5b"]],cubesuff], // 11x11x11 (SiGN)
		"444": [[["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff], // 4x4x4 (SiGN)
		"444m": [[["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]],cubesuff], // 4x4x4 (WCA)
		"555": [[["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff], // 5x5x5 (SiGN)
		"555wca": [[["U","D","Uw","Dw"],["R","L","Rw","Lw"],["F","B","Fw","Bw"]],cubesuff], // 5x5x5 (WCA)
		"666p": [[["U","D","2U","2D","3U"],["R","L","2R","2L","3R"],["F","B","2F","2B","3F"]],cubesuff], // 6x6x6 (prefix)
		"666wca": [[["U","D","Uw","Dw","3Uw"],["R","L","Rw","Lw","3Rw"],["F","B","Fw","Bw","3Fw"]],cubesuff], // 6x6x6 (WCA)
		"666s": [[["U","D","U&sup2;","D&sup2;","U&sup3;"],["R","L","R&sup2;","L&sup2;","R&sup3;"],["F","B","F&sup2;","B&sup2;","F&sup3;"]],cubesuff], // 6x6x6 (suffix)
		"666si": [[["U","D","u","d","3u"],["R","L","r","l","3r"],["F","B","f","b","3f"]],cubesuff], // 6x6x6 (SiGN)
		"777p": [[["U","D","2U","2D","3U","3D"],["R","L","2R","2L","3R","3L"],["F","B","2F","2B","3F","3B"]],cubesuff], // 7x7x7 (prefix)
		"777wca": [[["U","D","Uw","Dw","3Uw","3Dw"],["R","L","Rw","Lw","3Rw","3Lw"],["F","B","Fw","Bw","3Fw","3Bw"]],cubesuff], // 7x7x7 (prefix)
		"777s": [[["U","D","U&sup2;","D&sup2;","U&sup3;","D&sup3;"],["R","L","R&sup2;","L&sup2;","R&sup3;","L&sup3;"],["F","B","F&sup2;","B&sup2;","F&sup3;","B&sup3;"]],cubesuff], // 7x7x7 (suffix)
		"777si": [[["U","D","u","d","3u","3d"],["R","L","r","l","3r","3l"],["F","B","f","b","3f","3b"]],cubesuff], // 7x7x7 (SiGN)
		"crz3a": [[["U","D"],["R","L"],["F","B"]],cubesuff], // crazy 3x3x3
		"cm3": [[[["U<","U>","U2"],["E<","E>","E2"],["D<","D>","D2"]],[["R^","Rv","R2"],["M^","Mv","M2"],["L^","Lv","L2"]]]], // Cmetrick
		"cm2": [[[["U<","U>","U2"],["D<","D>","D2"]],[["R^","Rv","R2"],["L^","Lv","L2"]]]], // Cmetrick Mini
		"233": [[[["U","U'","U2"]],["R2","L2"],["F2","B2"]]], // Domino/2x3x3
		"fto": [[["U","D"],["F","B"],["L","BR"],["R","BL"]],["","'"]], // FTO/Face-Turning Octa
		"gear": [[["U"],["R"],["F"]],["","2","3","4","5","6","'","2'","3'","4'","5'"]],
		"sfl": [[["R","L"],["U","D"]],cubesuff], // Super Floppy Cube
		"ufo": [[["A"],["B"],["C"],[["U","U'","U2'","U2","U3"]]]], // UFO
		// "2gen": [[["U"],["R"]],cubesuff], // 2-generator <R,U>
		// "2genl": [[["U"],["L"]],cubesuff], // 2-generator <L,U>
		// "roux": [[["U"],["M"]],cubesuff], // Roux-generator <M,U>
		// "3gen_F": [[["U"],["R"],["F"]],cubesuff], // 3-generator <F,R,U>
		// "3gen_L": [[["U"],["R","L"]],cubesuff], // 3-generator <R,U,L>
		// "RrU": [[["U"],["R","r"]],cubesuff], // 3-generator <R,r,U>
		"RrUu": [[["U","u"],["R","r"]],cubesuff], // <R,r,U,u>
		"minx2g": [[["U"],["R"]],minxsuff], // megaminx 2-gen
		// "half": [[["U","D"],["R","L"],["F","B"]],["2"]], // 3x3x3 half turns, replaced by random state solver
		"lsll": [[[["R U R'","R U2 R'","R U' R'"]],[["F' U F","F' U2 F","F' U' F"]],[["U","U2","U'"]]]], // 3x3x3 last slot + last layer (old)
		"prco": [[["F","B"],["U","D"],["L","DBR"],["R","DBL"],["BL","DR"],["BR","DL"]],minxsuff], // Pyraminx Crystal (old style)
		"skb": [[["R"],["L"],["B"],["U"]],["","'"]], // Skewb
		"ivy": [[["R"],["L"],["D"],["B"]],["","'"]], // Ivy
		"112": [[["R"],["R"]],cubesuff], // 1x1x2
		"eide": [[["OMG"],["WOW"],["WTF"],[["WOO-HOO","WOO-HOO","MATYAS","YES","YES","YAY","YEEEEEEEEEEEES"]],["HAHA"],["XD"],[":D"],["LOL"]],["","","","!!!"]] // Derrick Eide	
	};
	
	var args2 = {
		'sia113': '#{[["U","u"],["R","r"]],%c,%l} z2 #{[["U","u"],["R","r"]],%c,%l}',
		'sia123': '#{[["U"],["R","r"]],%c,%l} z2 #{[["U"],["R","r"]],%c,%l}',
		'sia222': '#{[["U"],["R"],["F"]],%c,%l} z2 y #{[["U"],["R"],["F"]],%c,%l}',
		'335': '#{[[["U","U\'","U2"],["D","D\'","D2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
		'337': '#{[[["U","U\'","U2","u","u\'","u2","U u","U u\'","U u2","U\' u","U\' u\'","U\' u2","U2 u","U2 u\'","U2 u2"],["D","D\'","D2","d","d\'","d2","D d","D d\'","D d2","D\' d","D\' d\'","D\' d2","D2 d","D2 d\'","D2 d2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
		'r234': '2) ${222so}\\n3) ${333}\\n4) ${[444,40]}',
		'r2345': '${r234}\\n5) ${["555",60]}',
		'r23456': '${r2345}\\n6) ${["666p",80]}',
		'r234567': '${r23456}\\n7) ${["777p",100]}',
		'r234w': '2) ${222so}\\n3) ${333}\\n4) ${["444m",40]}',
		'r2345w': '${r234w}\\n5) ${["555wca",60]}',
		'r23456w': '${r2345w}\\n6) ${["666wca",80]}',
		'r234567w': '${r23456w}\\n7) ${["777wca",100]}',
		'rmngf': '${r2345w}\\n3oh) ${333}\\npyr) ${["pyrso",10]}\\n skb) ${skbso}\\nsq1) ${sqrs}\\nclk) ${clkwca}\\nmgm) ${["mgmp",70]}',
		'333ni': '${333}#{[[""]],["","Rw ","Rw2 ","Rw\' ","Fw ","Fw\' "],1}#{[[""]],["","Uw","Uw2","Uw\'"],1}',
		'444bld': '${444wca}#{[[""]],[""," x"," x2"," x\'"," z"," z\'"],1}#{[[""]],[""," y"," y2"," y\'"],1}',
		'555bld': '${["555wca",%l]}#{[[""]],[""," 3Rw"," 3Rw2"," 3Rw\'"," 3Fw"," 3Fw\'"],1}#{[[""]],[""," 3Uw"," 3Uw2"," 3Uw\'"],1}'
	};

	var edges = {
		// '4edge': ["r b2",["b2 r'","b2 U2 r U2 r U2 r U2 r"],["u"]],
		'5edge': ["r R b B",["B' b' R' r'","B' b' R' U2 r U2 r U2 r U2 r"],["u","d"]], 
		'6edge': ["3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"],["u","3u","d"]],
		'7edge': ["3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"],["u","3u","3d","d"]]
	};

	function megascramble(type, length) {
		var value = args[type];
		switch (value.length) {
			case 1: return mega(value[0], [""], length);
			case 2: return mega(value[0], value[1], length);
			case 3: return mega(value[0], value[1], value[2]);
		}
	}

	function edgescramble(type, length) {
		var value = edges[type];
		return edge(value[0], value[1], value[2], length);
	}

	function formatScramble(type, length) {
		var value = args2[type].replace(/%l/g, length).replace(/%c/g, '["","2","\'"]');
		return scrMgr.formatScramble(value);
	}

	for (var i in args) {
		scrMgr.reg(i, megascramble);
	}

	for (var i in args2) {
		scrMgr.reg(i, formatScramble);
	}

	for (var i in edges) {
		scrMgr.reg(i, edgescramble);
	}

	function cubeNNN(type, len) {
		var size = len;
		if (size <= 1) {
			return "N/A";
		}
		var data = [[], [], []];
		for (var i = 0; i < len - 1; i++) {
			if (i % 2 == 0) {
				data[0].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'U' : 'u'));
				data[1].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'R' : 'r'));
				data[2].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'F' : 'f'));
			} else {

				data[0].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'D' : 'd'));
				data[1].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'L' : 'l'));
				data[2].push((i < 4 ? '' : ~~(i / 2 + 1)) + (i < 2 ? 'B' : 'b'));
			}
		}
		return mega(data, cubesuff, size * 10);
	}
	scrMgr.reg('cubennn', cubeNNN);

	function edge(start, end, moves, len) {
		var u=0,d=0,movemis=[];
		var triggers=[["R","R'"],["R'","R"],["L","L'"],["L'","L"],["F'","F"],["F","F'"],["B","B'"],["B'","B"]];
		var ud=["U","D"];
		var scramble = start;
		// initialize move misalignments
		for (var i=0; i<moves.length; i++) {
			movemis[i] = 0;
		}

		for (var i=0; i<len; i++) {
			// apply random moves
			var done = false;
			while (!done) {
				var v = "";
				for (var j=0; j<moves.length; j++) {
					var x = rn(4);
					movemis[j] += x;
					if (x!=0) {
						done = true;
						v += " " + moves[j] + cubesuff[x-1];
					}
				}
			}
			// apply random trigger, update U/D
			var trigger = rn(8);
			var layer = rn(2);
			var turn = rn(3);
			scramble += v + " " + triggers[trigger][0] + " " + ud[layer] + cubesuff[turn] + " " + triggers[trigger][1];
			if (layer==0) {u += turn+1;}
			if (layer==1) {d += turn+1;}
		}

		// fix everything
		for (var i=0; i<moves.length; i++) {
			var x = 4-(movemis[i]%4);
			if (x<4) {
				scramble += " " + moves[i] + cubesuff[x-1];
			}
		}
		u = 4-(u%4); d = 4-(d%4);
		if (u<4) {
			scramble += " U" + cubesuff[u-1];
		}
		if (d<4) {
			scramble += " D" + cubesuff[d-1];
		}
		scramble += " " + rndEl(end);
		return scramble;
	}
})(scrMgr.mega, mathlib.rn, mathlib.rndEl);

/* ==== scramble/scramble_333_edit.js ==== */
/*

scramble_333.js

3x3x3 Solver / Scramble Generator in Javascript.

The core 3x3x3 code is from a min2phase solver by Shuang Chen.
Compiled to Javascript using GWT.
(There may be a lot of redundant code right now, but it's still really fast.)

 */
"use strict";

var scramble_333 = (function(getNPerm, setNPerm, getNParity, rn, rndEl) {

	var Ux1 = 0,
		Ux2 = 1,
		Ux3 = 2,
		Rx1 = 3,
		Rx2 = 4,
		Rx3 = 5,
		Fx1 = 6,
		Fx2 = 7,
		Fx3 = 8,
		Dx1 = 9,
		Dx2 = 10,
		Dx3 = 11,
		Lx1 = 12,
		Lx2 = 13,
		Lx3 = 14,
		Bx1 = 15,
		Bx2 = 16,
		Bx3 = 17;

	function renderFacelet(solved, cc, resultMap) {
		var f = cc.toPerm();
		var ret = [];
		for (var i = 0; i < resultMap.length; i++) {
			ret[i] = solved[f[resultMap[i]]];
		}
		return ret.join('');
	}

	// SCRAMBLERS

	var search = new min2phase.Search();

	function getRandomScramble() {
		return getAnyScramble(0xffffffffffff, 0xffffffffffff, 0xffffffff, 0xffffffff);
	}

	function getFMCScramble() {
		var scramble = getAnyScramble(0xffffffffffff, 0xffffffffffff, 0xffffffff, 0xffffffff, 0, undefined, undefined, 2, 1);
		return "R' U' F " + scramble + "R' U' F";
	}

	function cntU(b) {
		for (var c = 0, a = 0; a < b.length; a++) - 1 == b[a] && c++;
		return c
	}

	function fixOri(arr, cntU, base) {
		var sum = 0;
		var idx = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] != -1) {
				sum += arr[i];
			}
		}
		sum %= base;
		for (var i = 0; i < arr.length - 1; i++) {
			if (arr[i] == -1) {
				if (cntU-- == 1) {
					arr[i] = ((base << 4) - sum) % base;
				} else {
					arr[i] = rn(base);
					sum += arr[i];
				}
			}
			idx *= base;
			idx += arr[i];
		}
		if (cntU == 1) {
			arr.splice(-1, 1, ((base << 4) - sum) % base);
		}
		return idx;
	}

	function fixPerm(arr, cntU, parity) {
		var val = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] != -1) {
				val[arr[i]] = -1;
			}
		}
		for (var i = 0, j = 0; i < val.length; i++) {
			if (val[i] != -1) {
				val[j++] = val[i];
			}
		}
		var last;
		for (var i = 0; i < arr.length && cntU > 0; i++) {
			if (arr[i] == -1) {
				var r = rn(cntU);
				arr[i] = val[r];
				for (var j = r; j < 11; j++) {
					val[j] = val[j + 1];
				}
				if (cntU-- == 2) {
					last = i;
				}
			}
		}
		if (getNParity(getNPerm(arr, arr.length), arr.length) == 1 - parity) {
			var temp = arr[i - 1];
			arr[i - 1] = arr[last];
			arr[last] = temp;
		}
		return getNPerm(arr, arr.length);
	}

	//arr: 53 bit integer
	function parseMask(arr, length) {
		if ('number' !== typeof arr) {
			return arr;
		}
		var ret = [];
		for (var i = 0; i < length; i++) {
			var val = arr & 0xf; // should use "/" instead of ">>" to avoid unexpected type conversion
			ret[i] = val == 15 ? -1 : val;
			arr /= 16;
		}
		return ret;
	}

	var aufsuff = [
		[],
		[Ux1],
		[Ux2],
		[Ux3]
	];

	var rlpresuff = [
		[],
		[Rx1, Lx3],
		[Rx2, Lx2],
		[Rx3, Lx1]
	];

	var rlappsuff = ["", "x'", "x2", "x"];

	var emptysuff = [
		[]
	];

	function getAnyScramble(_ep, _eo, _cp, _co, neut, _rndapp, _rndpre, firstAxisFilter, lastAxisFilter) {
		_rndapp = _rndapp || emptysuff;
		_rndpre = _rndpre || emptysuff;
		_ep = parseMask(_ep, 12);
		_eo = parseMask(_eo, 12);
		_cp = parseMask(_cp, 8);
		_co = parseMask(_co, 8);
		var solution = "";
		do {
			var eo = _eo.slice();
			var ep = _ep.slice();
			var co = _co.slice();
			var cp = _cp.slice();
			var neo = fixOri(eo, cntU(eo), 2);
			var nco = fixOri(co, cntU(co), 3);
			var nep, ncp;
			var ue = cntU(ep);
			var uc = cntU(cp);
			if (ue == 1) {
				fixPerm(ep, ue, -1);
				ue = 0;
			}
			if (uc == 1) {
				fixPerm(cp, uc, -1);
				uc = 0;
			}
			if (ue == 0 && uc == 0) {
				nep = getNPerm(ep, 12);
				ncp = getNPerm(cp, 8);
			} else if (ue != 0 && uc == 0) {
				ncp = getNPerm(cp, 8);
				nep = fixPerm(ep, ue, getNParity(ncp, 8));
			} else if (ue == 0 && uc != 0) {
				nep = getNPerm(ep, 12);
				ncp = fixPerm(cp, uc, getNParity(nep, 12));
			} else {
				nep = fixPerm(ep, ue, -1);
				ncp = fixPerm(cp, uc, getNParity(nep, 12));
			}
			if (ncp + nco + nep + neo == 0) {
				continue;
			}
			var rndpre = rndEl(_rndpre);
			var rndapp = rndEl(_rndapp);
			var cc = new mathlib.CubieCube();
			var cd = new mathlib.CubieCube();
			for (var i = 0; i < 12; i++) {
				cc.ea[i] = ep[i] << 1 | eo[i];
				if (i < 8) {
					cc.ca[i] = co[i] << 3 | cp[i];
				}
			}
			for (var i = 0; i < rndpre.length; i++) {
				mathlib.CubieCube.CubeMult(mathlib.CubieCube.moveCube[rndpre[i]], cc, cd);
				cc.init(cd.ca, cd.ea);
			}
			for (var i = 0; i < rndapp.length; i++) {
				mathlib.CubieCube.CubeMult(cc, mathlib.CubieCube.moveCube[rndapp[i]], cd);
				cc.init(cd.ca, cd.ea);
			}
			if (neut) {
				cc.ori = mathlib.rn([1, 4, 8, 1, 1, 1, 24][neut]);
				cc.selfConj();
				cc.ori = 0;
			}
			var posit = cc.toFaceCube();
			solution = search.solution(posit, 21, 1e9, 50, 2, lastAxisFilter, firstAxisFilter);
		} while (solution.length <= 3);
		return solution.replace(/ +/g, ' ');
	}

	function getEdgeScramble() {
		return getAnyScramble(0xffffffffffff, 0xffffffffffff, 0x76543210, 0x00000000);
	}

	function getCornerScramble() {
		return getAnyScramble(0xba9876543210, 0x000000000000, 0xffffffff, 0xffffffff);
	}

	function getLLScramble(type, length, cases, neut) {
		return getAnyScramble(0xba987654ffff, 0x00000000ffff, 0x7654ffff, 0x0000ffff, neut);
	}

	var f2l_map = [
		[0x2000, 4, 'Easy-01'],
		[0x1011, 4, 'Easy-02'],
		[0x2012, 4, 'Easy-03'],
		[0x1003, 4, 'Easy-04'],
		[0x2003, 4, 'RE-05'],
		[0x1012, 4, 'RE-06'],
		[0x2002, 4, 'RE-07'],
		[0x1013, 4, 'RE-08'],
		[0x2013, 4, 'REFC-09'],
		[0x1002, 4, 'REFC-10'],
		[0x2010, 4, 'REFC-11'],
		[0x1001, 4, 'REFC-12'],
		[0x2011, 4, 'REFC-13'],
		[0x1000, 4, 'REFC-14'],
		[0x2001, 4, 'SPGO-15'],
		[0x1010, 4, 'SPGO-16'],
		[0x0000, 4, 'SPGO-17'],
		[0x0011, 4, 'SPGO-18'],
		[0x0003, 4, 'PMS-19'],
		[0x0012, 4, 'PMS-20'],
		[0x0002, 4, 'PMS-21'],
		[0x0013, 4, 'PMS-22'],
		[0x0001, 4, 'Weird-23'],
		[0x0010, 4, 'Weird-24'],
		[0x0400, 4, 'CPEU-25'],
		[0x0411, 4, 'CPEU-26'],
		[0x1400, 4, 'CPEU-27'],
		[0x2411, 4, 'CPEU-28'],
		[0x1411, 4, 'CPEU-29'],
		[0x2400, 4, 'CPEU-30'],
		[0x0018, 4, 'EPCU-31'],
		[0x0008, 4, 'EPCU-32'],
		[0x2008, 4, 'EPCU-33'],
		[0x1008, 4, 'EPCU-34'],
		[0x2018, 4, 'EPCU-35'],
		[0x1018, 4, 'EPCU-36'],
		[0x0418, 1, 'ECP-37'],
		[0x1408, 1, 'ECP-38'],
		[0x2408, 1, 'ECP-39'],
		[0x1418, 1, 'ECP-40'],
		[0x2418, 1, 'ECP-41'],
		[0x0408, 1, 'Solved-42']
	];
	var f2lprobs = mathlib.idxArray(f2l_map, 1);
	var f2lfilter = mathlib.idxArray(f2l_map, 2);

	function getLSLLScramble(type, length, cases, neut) {
		var caze = f2l_map[scrMgr.fixCase(cases, f2lprobs)][0];
		var ep = Math.pow(16, caze & 0xf);
		var eo = 0xf ^ (caze >> 4 & 1);
		var cp = Math.pow(16, caze >> 8 & 0xf);
		var co = 0xf ^ (caze >> 12 & 3);
		return getAnyScramble(0xba9f7654ffff - 7 * ep, 0x000f0000ffff - eo * ep, 0x765fffff - 0xb * cp, 0x000fffff - co * cp, neut, aufsuff);
	}

	var eols_map = [];
	var eolsprobs = [];
	var eolsfilter = [];
	for (var i = 0; i < f2l_map.length; i++) {
		if (f2l_map[i][0] & 0xf0) {
			continue;
		}
		eols_map.push(f2l_map[i]);
		eolsprobs.push(f2lprobs[i]);
		eolsfilter.push(f2lfilter[i]);
	}

	function getEOLSScramble(type, length, cases, neut) {
		var caze = eols_map[scrMgr.fixCase(cases, eolsprobs)][0];
		var ep = Math.pow(16, caze & 0xf);
		var cp = Math.pow(16, caze >> 8 & 0xf);
		var co = 0xf ^ (caze >> 12 & 3);
		return getAnyScramble(0xba9f7654ffff - 7 * ep, 0x000000000000, 0x765fffff - 0xb * cp, 0x000fffff - co * cp, neut, aufsuff);
	}

	function getF2LImage(piece0, stmap, stprobs, cases, canvas) {
		var emap = [[5, 10], [7, 19], [3, -1], [1, -1], null, null, null, null, [23, 12]];
		var cmap = [[8, 20, 9], [6, -1, 18], [0, -1, -1], [2, 11, -1], [-1, 15, 26]];
		var caze = stmap[scrMgr.fixCase(cases, stprobs)][0];
		var ep = emap[caze & 0xf];
		var eo = caze >> 4 & 1;
		var cp = cmap[caze >> 8 & 0xf];
		var co = caze >> 12 & 3;
		var pieces = piece0.split('');
		for (var i1 = 0; i1 < 3; i1++) {
			if (i1 < 2 && ep[i1] >= 0) {
				pieces[ep[i1]] = 'BR'.charAt(eo ^ i1);
			}
			if (cp[i1] >= 0) {
				pieces[cp[i1]] = 'URB'.charAt((co + 3 + i1) % 3);
			}
		}
		image.face3Image(pieces.join(''), canvas);
	}

	var wvls_map = [];
	var wvlsprobs = [];
	var wvlsfilter = [
		'Oriented', 'Rectangle-1', 'Rectangle-2', 'Tank-1', 'Bowtie-1', 'Bowtie-3', 'Tank-2', 'Bowtie-2', 'Bowtie-4', 'Snake-1', 'Adjacent-1', 'Adjacent-2', 'Gun-Far', 'Sune-1', 'Pi-Near', 'Gun-Back', 'Pi-Front', 'H-Side', 'Snake-2', 'Adjacent-3', 'Adjacent-4', 'Gun-Sides', 'H-Front', 'Pi-Back', 'Gun-Near', 'Pi-Far', 'Sune-2'
	];

	for (var i = 0; i < 27; i++) {
		wvls_map[i] = ~~(i / 9) << 12 | ~~(i / 3) % 3 << 8 | i % 3;
		wvlsprobs[i] = 1;
	}

	function getWVLSScramble(type, length, cases, neut) {
		var caze = wvls_map[scrMgr.fixCase(cases, wvlsprobs)];
		return getAnyScramble(0xba9f7654ff8f, 0x000000000000, 0x765fff4f, 0x000f0020 | caze, neut);
	}

	function getWVLSImage(cases, canvas) {
		var caze = wvls_map[scrMgr.fixCase(cases, wvlsprobs)];
		var fill = ['DGG', 'GDG', 'GGD'];
		fill = fill[caze & 3] + fill[caze >> 8 & 3] + fill[caze >> 12 & 3];
		image.llImage.drawImage('3D6DDDBB0RR21G87G54GU'.replace(/[0-9]/g, function(v) {
			return fill[~~v];
		}), null, canvas);
	}

	var vls_map = [];
	var vlsprobs = [];
	var vlsfilter = [];

	for (var i = 0; i < 27 * 8; i++) {
		var co = i % 27;
		var eo = ~~(i / 27);
		vls_map[i] = [~~(co / 9) % 3 << 12 | ~~(co / 3) % 3 << 8 | co % 3, (eo >> 2 & 1) << 12 | (eo >> 1 & 1) << 8 | eo & 1];
		vlsprobs[i] = 1;
		vlsfilter[i] = ["WVLS", "UB", "UF", "UF UB", "UL", "UB UL", "UF UL", "No Edge"][eo] + "-" + (co + 1);
	}

	function getVLSScramble(type, length, cases, neut) {
		var caze = vls_map[scrMgr.fixCase(cases, vlsprobs)];
		return getAnyScramble(0xba9f7654ff8f, 0x000f00000000 + caze[1], 0x765fff4f, 0x000f0020 + caze[0], neut, [[Ux3]]);
	}

	function getVLSImage(cases, canvas) {
		var caze = vls_map[scrMgr.fixCase(cases, vlsprobs)];
		var fillc = ['DGG', 'GDG', 'GGD'];
		fillc = fillc[caze[0] & 3] + fillc[caze[0] >> 8 & 3] + fillc[caze[0] >> 12 & 3];
		var fille = ['DG', 'GD'];
		fille = fille[caze[1] & 3] + fille[caze[1] >> 8 & 3] + fille[caze[1] >> 12 & 3];
		image.llImage.drawImage('6a0eDR3cR4dUFF21b87f5'.replace(/[0-9]/g, function(v) {
			return fillc[~~v];
		}).replace(/[a-z]/g, function(v) {
			return fille[v.charCodeAt(0) - 'a'.charCodeAt(0)];
		}), null, canvas);
	}

	function getF2LScramble(type, length, cases, neut) {
		return getAnyScramble(0xffff7654ffff, 0xffff0000ffff, 0xffffffff, 0xffffffff, neut);
	}

	function genZBLLMap() {
		var isVisited = [];
		var zbll_map = [];
		var cc = new mathlib.CubieCube();
		for (var idx = 0; idx < 27 * 24 * 24; idx++) {
			if (isVisited[idx >> 5] >> (idx & 0x1f) & 1) {
				continue;
			}
			var epi = idx % 24;
			var cpi = ~~(idx / 24) % 24;
			var coi = ~~(idx / 24 / 24);
			if (mathlib.getNParity(cpi, 4) != mathlib.getNParity(epi, 4)) {
				continue;
			}
			var co = mathlib.setNOri([], coi, 4, -3);
			var cp = mathlib.setNPerm([], cpi, 4, 0);
			var ep = mathlib.setNPerm([], epi, 4, 0);
			var zbcase = [0, 0, 0, null, 0, null];
			for (var i = 0; i < 4; i++) {
				zbcase[0] += cp[i] << i * 4;
				zbcase[1] += co[i] << i * 4;
				zbcase[2] += ep[i] << i * 4;
			}
			for (var conj = 0; conj < 16; conj++) {
				var c0 = conj >> 2;
				var c1 = conj & 3;
				var co2 = [], cp2 = [], ep2 = [];
				for (var i = 0; i < 4; i++) {
					co2[(i + c0) & 3] = co[i];
					cp2[(i + c0) & 3] = (cp[i] + c1) & 3;
					ep2[(i + c0) & 3] = (ep[i] + c1) & 3;
				}
				var co2i = mathlib.getNOri(co2, 4, -3);
				var cp2i = mathlib.getNPerm(cp2, 4, 0);
				var ep2i = mathlib.getNPerm(ep2, 4, 0);
				var idx2 = (co2i * 24 + cp2i) * 24 + ep2i;
				if (isVisited[idx2 >> 5] >> (idx2 & 0x1f) & 1) {
					continue;
				}
				isVisited[idx2 >> 5] |= 1 << (idx2 & 0x1f);
				zbcase[4]++;
			}
			for (var i = 0; i < 12; i++) {
				cc.ea[i] = ep[i] << 1;
				if (i < 8) {
					cc.ca[i] = co[i] << 3 | cp[i];
				}
			}
			zbcase[3] = renderFacelet("DDDDDDDDDLLLLLLLLLFFFFFFFFFUUUUUUUUURRRRRRRRRBBBBBBBBB",
				cc, [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 9, 10, 11, 45, 46, 47, 36, 37, 38]);
			if (idx > 0) { // skip solved state
				zbll_map.push(zbcase);
			}
		}

		var coNames = {}
		coNames[0x0000] = 'O';
		coNames[0x0012] = 'U';
		coNames[0x0021] = 'T';
		coNames[0x0102] = 'L';
		coNames[0x0111] = 'aS';
		coNames[0x0222] = 'S';
		coNames[0x1122] = 'Pi';
		coNames[0x1212] = 'H';
		var coCnts = {};
		for (var i = 0; i < zbll_map.length; i++) {
			var zbcase = zbll_map[i];
			var coName = coNames[zbcase[1]];
			coCnts[coName] = coCnts[coName] || [];
			var coCnt = coCnts[coName];
			var cpIdx = coCnt.indexOf(zbcase[0]);
			if (cpIdx == -1) {
				cpIdx = coCnt.length;
				coCnt.push(zbcase[0], 1);
			} else {
				coCnt[cpIdx + 1]++;
			}
			zbcase[5] = coName + ((cpIdx >> 1) + 1) + '-' + coCnts[coName][cpIdx + 1];
		}
		return zbll_map;
	}

	var zbll_map = genZBLLMap();
	var zbprobs = mathlib.idxArray(zbll_map, 4);
	var zbfilter = mathlib.idxArray(zbll_map, 5);

	function getZBLLScramble(type, length, cases, neut) {
		var zbcase = zbll_map[scrMgr.fixCase(cases, zbprobs)];
		return getAnyScramble(zbcase[2] + 0xba9876540000, 0, zbcase[0] + 0x76540000, zbcase[1], neut, aufsuff, aufsuff);
	}

	function getZBLLx2Scramble(type, length, cases, neut, filter) {
		var A = zbll_map[scrMgr.fixCase(cases, zbprobs)];
		var B = zbll_map[scrMgr.rndState(filter, zbprobs)];
		var EM = [4, 7, 6, 5], cp = A[0], co = A[1], ep = A[2] + 0xba9800000000;
		for (var i = 0; i < 4; i++) {
			cp += (7 - (B[0] >> (4 * i) & 15)) * Math.pow(16, 7 - i);
			co += (B[1] >> (4 * i) & 15) * Math.pow(16, 7 - i);
			ep += EM[B[2] >> (4 * i) & 15] * Math.pow(16, EM[i]);
		}
		return getAnyScramble(ep, 0, cp, co, neut, udaufsuff, emptysuff);
	}

	function getZBLLImage(cases, canvas) {
		var face = zbll_map[cases][3];
		if (!canvas) {
			return [face, null, zbfilter[cases]];
		}
		image.llImage.drawImage(face, null, canvas);
	}

	var coll_map = [
		[0x3210, 0x2121, 'FeFeeeBeBLGRDGDRGLDGD', 2, 'H-1'],
		[0x2301, 0x1212, 'ReLeeeReLBGBDGDFGFDGD', 2, 'H-2'],
		[0x1203, 0x1212, 'ReBeeeLeBFGRDGDLGFDGD', 4, 'H-3'],
		[0x2013, 0x1212, 'LeReeeFeFRGLDGDBGBDGD', 4, 'H-4'],
		[0x3021, 0x1020, 'DeLeeeReDBGRFGBDGFLGD', 4, 'L-1'],
		[0x1203, 0x0201, 'DeReeeLeDFGBRGFDGLBGD', 4, 'L-2'],
		[0x2301, 0x0102, 'DeBeeeLeDFGRFGRDGLBGD', 4, 'L-3'],
		[0x3210, 0x1020, 'DeLeeeFeDRGFLGBDGBRGD', 4, 'L-4'],
		[0x3102, 0x1020, 'DeLeeeLeDFGBRGBDGRFGD', 4, 'L-5'],
		[0x2013, 0x0201, 'DeReeeReDBGLBGFDGFLGD', 4, 'L-6'],
		[0x3210, 0x1122, 'LeFeeeReFBGDRGLDGBDGD', 4, 'Pi-1'],
		[0x2301, 0x2112, 'FeLeeeFeRRGDBGBDGLDGD', 4, 'Pi-2'],
		[0x1203, 0x1221, 'ReLeeeReLBGDFGBDGFDGD', 4, 'Pi-3'],
		[0x3102, 0x1122, 'BeFeeeFeBRGDLGLDGRDGD', 4, 'Pi-4'],
		[0x2013, 0x1221, 'BeLeeeLeFFGDRGBDGRDGD', 4, 'Pi-5'],
		[0x3021, 0x1122, 'BeReeeLeBFGDLGFDGRDGD', 4, 'Pi-6'],
		[0x3210, 0x2220, 'ReBeeeFeDRGFLGDLGDBGD', 4, 'S-1'],
		[0x2301, 0x0222, 'BeReeeLeDFGRFGDBGDLGD', 4, 'S-2'],
		[0x3021, 0x2220, 'BeReeeFeDRGFLGDBGDLGD', 4, 'S-3'],
		[0x2013, 0x2202, 'ReBeeeLeDFGRFGDLGDBGD', 4, 'S-4'],
		[0x3102, 0x2220, 'FeBeeeLeDFGBRGDLGDRGD', 4, 'S-5'],
		[0x1203, 0x2202, 'LeReeeFeDRGLBGDBGDFGD', 4, 'S-6'],
		[0x1203, 0x1002, 'BeLeeeDeDBGRFGDFGRDGL', 4, 'T-1'],
		[0x3102, 0x2100, 'ReBeeeDeDLGBRGDLGFDGF', 4, 'T-2'],
		[0x2301, 0x0210, 'BeFeeeDeDBGFLGDRGRDGL', 4, 'T-3'],
		[0x3210, 0x2100, 'FeFeeeDeDBGBRGDRGLDGL', 4, 'T-4'],
		[0x2013, 0x1002, 'BeBeeeDeDLGRFGDLGRDGF', 4, 'T-5'],
		[0x3021, 0x2100, 'FeBeeeDeDRGRFGDLGLDGB', 4, 'T-6'],
		[0x2301, 0x0120, 'LeLeeeDeDFGBRGBDGDFGR', 4, 'U-1'],
		[0x3210, 0x1200, 'LeReeeDeDBGBRGFDGDFGL', 4, 'U-2'],
		[0x3021, 0x1200, 'FeFeeeDeDBGBRGLDGDRGL', 4, 'U-3'],
		[0x2013, 0x2001, 'BeFeeeDeDFGBRGLDGDLGR', 4, 'U-4'],
		[0x1203, 0x2001, 'ReFeeeDeDBGRFGLDGDBGL', 4, 'U-5'],
		[0x3102, 0x1200, 'LeBeeeDeDBGRFGRDGDFGL', 4, 'U-6'],
		[0x3210, 0x1101, 'LeFeeeDeRRGFDGLDGBDGB', 4, 'aS-1'],
		[0x2301, 0x1110, 'ReFeeeDeLRGBDGLDGFDGB', 4, 'aS-2'],
		[0x3021, 0x1101, 'LeBeeeDeFFGLDGRDGBDGR', 4, 'aS-3'],
		[0x2013, 0x1011, 'LeFeeeDeBFGRDGLDGBDGR', 4, 'aS-4'],
		[0x1203, 0x1011, 'FeBeeeDeLFGBDGRDGLDGR', 4, 'aS-5'],
		[0x3102, 0x1101, 'FeBeeeDeRBGFDGRDGLDGL', 4, 'aS-6'],
		[0x3021, 0x0000, 'DeDeeeDeDBGRFGBRGFLGL', 4, 'O-Adj'],
		[0x2301, 0x0000, 'DeDeeeDeDBGFLGRFGBRGL', 1, 'O-Diag'],
		[0x3210, 0x0000, 'DeDeeeDeDBGBRGRFGFLGL', 1, 'O-AUF']
	];
	var coprobs = mathlib.idxArray(coll_map, 3);
	var cofilter = mathlib.idxArray(coll_map, 4);

	function getCOLLScramble(type, length, cases, neut) {
		var cocase = coll_map[scrMgr.fixCase(cases, coprobs)];
		return getAnyScramble(0xba987654ffff, 0, cocase[0] + 0x76540000, cocase[1], neut, aufsuff, aufsuff);
	}

	function getCMLLScramble(type, length, cases) {
		var cocase = coll_map[scrMgr.fixCase(cases, coprobs)];
		var rnd4 = 0; /* ZTimer: never add a random cube rotation (x, x', x2) to the scramble */
		var presuff = [];
		for (var i = 0; i < aufsuff.length; i++) {
			presuff.push(aufsuff[i].concat(rlpresuff[rnd4]));
		}
		return getAnyScramble(0xba98f6f4ffff, 0x0000f0f0ffff, cocase[0] + 0x76540000, cocase[1], 0, presuff, aufsuff) + rlappsuff[rnd4];
	}

	function getSBRouxScramble(type, length, cases) {
		var rnd4 = rn(4);
		return getAnyScramble(0xfa9ff6ffffff, 0xf00ff0ffffff, 0xf65fffff, 0xf00fffff, 0, [rlpresuff[rnd4]]) + rlappsuff[rnd4];
	}

	function getCOLLImage(efill, cases, canvas) {
		var face = coll_map[cases][2].replace(/e/g, efill || 'U');
		if (!canvas) {
			return [face, null, cofilter[cases]];
		}
		image.llImage.drawImage(face, null, canvas);
	}

	function getZZLLScramble(type, length, cases, neut) {
		return getAnyScramble(0xba9876543f1f, 0x000000000000, 0x7654ffff, 0x0000ffff, neut, aufsuff);
	}

	var ttll_map = [
		[0x32410, 0x3210, 'FBar-1'],
		[0x32410, 0x3102, 'FBar-2'],
		[0x32410, 0x3021, 'FBar-3'],
		[0x32410, 0x2301, 'FBar-4'],
		[0x32410, 0x2130, 'FBar-5'],
		[0x32410, 0x2013, 'FBar-6'],
		[0x32410, 0x1320, 'FBar-7'],
		[0x32410, 0x1203, 'FBar-8'],
		[0x32410, 0x1032, 'FBar-9'],
		[0x32410, 0x0312, 'FBar-10'],
		[0x32410, 0x0231, 'FBar-11'],
		[0x32410, 0x0123, 'FBar-12'],
		[0x32401, 0x3201, '2Opp-1'],
		[0x32401, 0x3120, '2Opp-2'],
		[0x32401, 0x3012, '2Opp-3'],
		[0x32401, 0x2310, '2Opp-4'],
		[0x32401, 0x2103, '2Opp-5'],
		[0x32401, 0x2031, '2Opp-6'],
		[0x32401, 0x1302, '2Opp-7'],
		[0x32401, 0x1230, '2Opp-8'],
		[0x32401, 0x1023, '2Opp-9'],
		[0x32401, 0x0321, '2Opp-10'],
		[0x32401, 0x0213, '2Opp-11'],
		[0x32401, 0x0132, '2Opp-12'],
		[0x31420, 0x3201, 'ROpp-1'],
		[0x31420, 0x3120, 'ROpp-2'],
		[0x31420, 0x3012, 'ROpp-3'],
		[0x31420, 0x2310, 'ROpp-4'],
		[0x31420, 0x2103, 'ROpp-5'],
		[0x31420, 0x2031, 'ROpp-6'],
		[0x31420, 0x1302, 'ROpp-7'],
		[0x31420, 0x1230, 'ROpp-8'],
		[0x31420, 0x1023, 'ROpp-9'],
		[0x31420, 0x0321, 'ROpp-10'],
		[0x31420, 0x0213, 'ROpp-11'],
		[0x31420, 0x0132, 'ROpp-12'],
		[0x31402, 0x3210, 'RBar-1'],
		[0x31402, 0x3102, 'RBar-2'],
		[0x31402, 0x3021, 'RBar-3'],
		[0x31402, 0x2301, 'RBar-4'],
		[0x31402, 0x2130, 'RBar-5'],
		[0x31402, 0x2013, 'RBar-6'],
		[0x31402, 0x1320, 'RBar-7'],
		[0x31402, 0x1203, 'RBar-8'],
		[0x31402, 0x1032, 'RBar-9'],
		[0x31402, 0x0312, 'RBar-10'],
		[0x31402, 0x0231, 'RBar-11'],
		[0x31402, 0x0123, 'RBar-12'],
		[0x30421, 0x3210, '2Bar-1'],
		[0x30421, 0x3102, '2Bar-2'],
		[0x30421, 0x3021, '2Bar-3'],
		[0x30421, 0x2301, '2Bar-4'],
		[0x30421, 0x2130, '2Bar-5'],
		[0x30421, 0x2013, '2Bar-6'],
		[0x30421, 0x1320, '2Bar-7'],
		[0x30421, 0x1203, '2Bar-8'],
		[0x30421, 0x1032, '2Bar-9'],
		[0x30421, 0x0312, '2Bar-10'],
		[0x30421, 0x0231, '2Bar-11'],
		[0x30421, 0x0123, '2Bar-12'],
		[0x30412, 0x3201, 'FOpp-1'],
		[0x30412, 0x3120, 'FOpp-2'],
		[0x30412, 0x3012, 'FOpp-3'],
		[0x30412, 0x2310, 'FOpp-4'],
		[0x30412, 0x2103, 'FOpp-5'],
		[0x30412, 0x2031, 'FOpp-6'],
		[0x30412, 0x1302, 'FOpp-7'],
		[0x30412, 0x1230, 'FOpp-8'],
		[0x30412, 0x1023, 'FOpp-9'],
		[0x30412, 0x0321, 'FOpp-10'],
		[0x30412, 0x0213, 'FOpp-11'],
		[0x30412, 0x0132, 'FOpp-12']
	];
	var ttllprobs = [];
	var ttllfilter = [];
	for (var i = 0; i < ttll_map.length; i++) {
		ttllprobs[i] = 1;
		ttllfilter[i] = ttll_map[i][2];
	}

	function getTTLLScramble(type, length, cases, neut) {
		var ttllcase = ttll_map[scrMgr.fixCase(cases, ttllprobs)];
		return getAnyScramble(0xba9876540000 + ttllcase[1], 0x000000000000, 0x76500000 + ttllcase[0], 0x00000000, neut, aufsuff, aufsuff);
	}

	function getTTLLImage(cases, canvas) {
		var ret = [];
		var ttllcase = ttll_map[cases];
		for (var i = 3; i >= 0; i--) {
			ret.push(["FR", "LF", "BL", "RB", "GG"][ttllcase[0] >> (i * 4) & 0xf]);
			ret.push("RFLB".charAt(ttllcase[1] >> (i * 4) & 0xf));
		}
		ret = ret.join('');
		ret = ret.slice(7) + ret.slice(0, 7);
		var llParam = ['GDDDDDDDD' + ret, null]
		if (!canvas) {
			return llParam.concat([ttllfilter[cases]]);
		}
		image.llImage.drawImage(llParam[0], llParam[1], canvas);
	}

	function getLSEScramble() {
		var rnd4 = 0; /* ZTimer: never add a random cube rotation (x, x', x2) to the scramble */
		return getAnyScramble(0xba98f6f4ffff, 0x0000f0f0ffff, 0x76543210, 0x00000000, 0, [rlpresuff[rnd4]], aufsuff) + rlappsuff[rnd4];
	}

	function getCLLScramble(type, length, cases, neut) {
		var cocase = coll_map[scrMgr.fixCase(cases, coprobs)];
		return getAnyScramble(0xba987654ffff, 0x00000000ffff, cocase[0] + 0x76540000, cocase[1], neut, aufsuff, aufsuff);
	}

	function getELLScramble(type, length, cases, neut) {
		return getAnyScramble(0xba987654ffff, 0x00000000ffff, 0x76543210, 0x00000000, neut);
	}

	function get2GLLScramble(type, length, cases, neut) {
		return getAnyScramble(0xba987654ffff, 0x000000000000, 0x76543210, 0x0000ffff, neut, aufsuff);
	}

	var pll_map = [
		[0x1032, 0x3210, 1, 'H'],
		[0x3102, 0x3210, 4, 'Ua'],
		[0x3021, 0x3210, 4, 'Ub'],
		[0x2301, 0x3210, 2, 'Z'],
		[0x3210, 0x3021, 4, 'Aa'],
		[0x3210, 0x3102, 4, 'Ab'],
		[0x3210, 0x2301, 2, 'E'],
		[0x3012, 0x3201, 4, 'F'],
		[0x2130, 0x3021, 4, 'Ga'],
		[0x1320, 0x3102, 4, 'Gb'],
		[0x3021, 0x3102, 4, 'Gc'],
		[0x3102, 0x3021, 4, 'Gd'],
		[0x3201, 0x3201, 4, 'Ja'],
		[0x3120, 0x3201, 4, 'Jb'],
		[0x1230, 0x3012, 1, 'Na'],
		[0x3012, 0x3012, 1, 'Nb'],
		[0x0213, 0x3201, 4, 'Ra'],
		[0x2310, 0x3201, 4, 'Rb'],
		[0x1230, 0x3201, 4, 'T'],
		[0x3120, 0x3012, 4, 'V'],
		[0x3201, 0x3012, 4, 'Y']
	];
	var pllprobs = mathlib.idxArray(pll_map, 2);
	var pllfilter = mathlib.idxArray(pll_map, 3);
	var pllImgParam = [
		['BFBRLRFBFLRL', [1, 7], [3, 5]],
		['BRBRLRFFFLBL', [3, 7], [7, 5], [5, 3]],
		['BLBRBRFFFLRL', [3, 5], [5, 7], [7, 3]],
		['LFLBRBRBRFLF', [1, 5], [3, 7]],
		['LBBRRLBFRFLF', [0, 2], [2, 6], [6, 0]],
		['RBFLRRFFLBLB', [0, 6], [6, 8], [8, 0]],
		['LBRFRBRFLBLF', [0, 6], [2, 8]],
		['BFRFRBRBFLLL', [1, 7], [2, 8]],
		['BRRFLBRBFLFL'],
		['BFRFBBRLFLRL'],
		['BFRFLBRRFLBL'],
		['BLRFFBRBFLRL'],
		['BBRFFBRRFLLL', [1, 5], [2, 8]],
		['LBBRLLBRRFFF', [2, 8], [5, 7]],
		['FBBRLLBFFLRR', [2, 6], [3, 5]],
		['BBFLLRFFBRRL', [0, 8], [3, 5]],
		['LLBRBLBFRFRF', [1, 3], [2, 8]],
		['RBFLFRFLLBRB', [2, 8], [3, 7]],
		['BBRFLBRFFLRL', [2, 8], [3, 5]],
		['BBFLFRFRBRLL', [0, 8], [1, 5]],
		['BBFLRRFLBRFL', [0, 8], [1, 3]]
	];

	function getPLLScramble(type, length, cases, neut) {
		var pllcase = pll_map[scrMgr.fixCase(cases, pllprobs)];
		return getAnyScramble(pllcase[0] + 0xba9876540000, 0x000000000000, pllcase[1] + 0x76540000, 0x00000000, neut, aufsuff, aufsuff);
	}

	function getPLLImage(cases, canvas) {
		var arrows = pllImgParam[cases].slice(1);
		if (arrows.length == 2) {
			arrows = arrows.concat([[arrows[0][1], arrows[0][0]], [arrows[1][1], arrows[1][0]]])
		}
		var llParam = ['DDDDDDDDD' + pllImgParam[cases][0], arrows]
		if (!canvas) {
			return llParam.concat([pllfilter[cases]]);
		}
		image.llImage.drawImage(llParam[0], llParam[1], canvas);
	}

	var oll_map = [
		[0x0000, 0x0000, 1, 'PLL', 0x000ff],
		[0x1111, 0x1212, 2, 'Point-1', 0xeba00],
		[0x1111, 0x1122, 4, 'Point-2', 0xdda00],
		[0x1111, 0x0222, 4, 'Point-3', 0x5b620],
		[0x1111, 0x0111, 4, 'Point-4', 0x6d380],
		[0x0011, 0x2022, 4, 'Square-5', 0x8360b],
		[0x0011, 0x1011, 4, 'Square-6', 0x60b16],
		[0x0011, 0x2202, 4, 'SLBS-7', 0x1362a],
		[0x0011, 0x0111, 4, 'SLBS-8', 0x64392],
		[0x0011, 0x1110, 4, 'Fish-9', 0x2538a],
		[0x0011, 0x2220, 4, 'Fish-10', 0x9944c],
		[0x0011, 0x0222, 4, 'SLBS-11', 0x9160e],
		[0x0011, 0x1101, 4, 'SLBS-12', 0x44b13],
		[0x0101, 0x2022, 4, 'Knight-13', 0x1a638],
		[0x0101, 0x0111, 4, 'Knight-14', 0x2c398],
		[0x0101, 0x0222, 4, 'Knight-15', 0x8a619],
		[0x0101, 0x1011, 4, 'Knight-16', 0x28b1c],
		[0x1111, 0x0102, 4, 'Point-17', 0x4b381],
		[0x1111, 0x0012, 4, 'Point-18', 0x49705],
		[0x1111, 0x0021, 4, 'Point-19', 0xc9a05],
		[0x1111, 0x0000, 1, 'CO-20', 0x492a5],
		[0x0000, 0x1212, 2, 'OCLL-21', 0x1455a],
		[0x0000, 0x1122, 4, 'OCLL-22', 0xa445a],
		[0x0000, 0x0012, 4, 'OCLL-23', 0x140fa],
		[0x0000, 0x0021, 4, 'OCLL-24', 0x101de],
		[0x0000, 0x0102, 4, 'OCLL-25', 0x2047e],
		[0x0000, 0x0111, 4, 'OCLL-26', 0x2095e],
		[0x0000, 0x0222, 4, 'OCLL-27', 0x1247a],
		[0x0011, 0x0000, 4, 'CO-28', 0x012af],
		[0x0011, 0x0210, 4, 'Awkward-29', 0x1138e],
		[0x0011, 0x2100, 4, 'Awkward-30', 0x232aa],
		[0x0011, 0x0021, 4, 'P-31', 0x50396],
		[0x0011, 0x1002, 4, 'P-32', 0x0562b],
		[0x0101, 0x0021, 4, 'T-33', 0x1839c],
		[0x0101, 0x0210, 4, 'C-34', 0x2a2b8],
		[0x0011, 0x1020, 4, 'Fish-35', 0x4a1d1],
		[0x0011, 0x0102, 4, 'W-36', 0xc4293],
		[0x0011, 0x2010, 4, 'Fish-37', 0x0338b],
		[0x0011, 0x0201, 4, 'W-38', 0x11a2e],
		[0x0101, 0x1020, 4, 'BLBS-39', 0x18a3c],
		[0x0101, 0x0102, 4, 'BLBS-40', 0x8c299],
		[0x0011, 0x1200, 4, 'Awkward-41', 0x152aa],
		[0x0011, 0x0120, 4, 'Awkward-42', 0x0954d],
		[0x0011, 0x0012, 4, 'P-43', 0xe0296],
		[0x0011, 0x2001, 4, 'P-44', 0x03a2b],
		[0x0101, 0x0012, 4, 'T-45', 0xa829c],
		[0x0101, 0x0120, 4, 'C-46', 0x43863],
		[0x0011, 0x1221, 4, 'L-47', 0x52b12],
		[0x0011, 0x1122, 4, 'L-48', 0xa560a],
		[0x0011, 0x2112, 4, 'L-49', 0xe4612],
		[0x0011, 0x2211, 4, 'L-50', 0xec450],
		[0x0101, 0x1221, 4, 'I-51', 0x1ab18],
		[0x0101, 0x1122, 4, 'I-52', 0x53942],
		[0x0011, 0x2121, 4, 'L-53', 0x54712],
		[0x0011, 0x1212, 4, 'L-54', 0x1570a],
		[0x0101, 0x2121, 2, 'I-55', 0x1c718],
		[0x0101, 0x1212, 2, 'I-56', 0xaaa18],
		[0x0101, 0x0000, 2, 'CO-57', 0x082bd]
	];
	var ollprobs = mathlib.idxArray(oll_map, 2);
	var ollfilter = mathlib.idxArray(oll_map, 3);

	function getOLLScramble(type, length, cases, neut) {
		var ollcase = oll_map[scrMgr.fixCase(cases, ollprobs)];
		return getAnyScramble(0xba987654ffff, ollcase[0], 0x7654ffff, ollcase[1], neut, aufsuff, aufsuff);
	}

	function getOLLImage(cases, canvas) {
		var face = '';
		var val = oll_map[cases][4];
		for (var i = 0; i < 21; i++) {
			if (i == 4) {
				face += 'D';
			} else {
				face += (val & 1) ? 'D' : 'G';
				val >>= 1;
			}
		}
		if (!canvas) {
			return [face, null, ollfilter[cases]];
		}
		image.llImage.drawImage(face, null, canvas);
	}

	function getEOLineScramble(type, length, cases, neut) {
		return getAnyScramble(0xffff7f5fffff, 0x000000000000, 0xffffffff, 0xffffffff, neut);
	}

	function getEOCrossScramble(type, length, cases, neut) {
		return getAnyScramble(0xffff7654ffff, 0x000000000000, 0xffffffff, 0xffffffff, neut);
	}

	var daufsuff = [[], [Dx1], [Dx2], [Dx3]];
	var udaufsuff = [];
	for (var i = 0; i < 16; i++) {
		udaufsuff.push(aufsuff[i >> 2].concat(daufsuff[i & 3]));
	}
	var daufrot = ["", "y", "y2", "y'"];
	function getMehta3QBScramble() {
		var rnd4 = mathlib.rn(4);
		return getAnyScramble(0xffff765fffff, 0xffff000fffff, 0xf65fffff, 0xf00fffff, 0, [daufsuff[rnd4]]) + daufrot[rnd4];
	}

	function getMehtaEOLEScramble() {
		var skip = mathlib.rn(4);
		var rnd4 = mathlib.rn(4);
		return getAnyScramble(0xba98765fffff + (0x4567 & (0xf << skip * 4)) * 0x100000000, 0x0000000fffff + (0xf << skip * 4) * 0x100000000, 0xf65fffff, 0xf00fffff, 0, [daufsuff[rnd4]]) + daufrot[rnd4];
	}

	function getMehtaTDRScramble() {
		return getAnyScramble(0xba98765fffff, 0x000000000000, 0xf65fffff, 0xf00fffff);
	}

	function getMehta6CPScramble() {
		return getAnyScramble(0xba98765fffff, 0x000000000000, 0xf65fffff, 0x00000000);
	}

	function getMehtaL5EPScramble() {
		return getAnyScramble(0xba98765fffff, 0x000000000000, 0x76543210, 0x00000000);
	}

	function getMehtaCDRLLScramble() {
		return getAnyScramble(0xba98765fffff, 0x000000000000, 0x7654ffff, 0x0000ffff);
	}

	var customfilter = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'RF', 'LF', 'LB', 'RB', 'URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'];
	for (var i = 0; i < 20; i++) {
		var piece = customfilter[i];
		customfilter[i + 20] = (piece.length == 2 ? 'OriE-' : 'OriC-') + piece;
		customfilter[i] = (piece.length == 2 ? 'PermE-' : 'PermC-') + piece;
	}
	var customprobs = mathlib.valuedArray(40, 0);

	function getCustomScramble(type, length, cases, neut) {
		var ep = 0;
		var eo = 0;
		var cp = 0;
		var co = 0;
		var chk = 0x1100; //ep+cp|ep+1|cp+1|eo|co
		cases = cases || mathlib.valuedArray(40, 1);
		for (var i = 0; i < 12; i++) {
			chk += (cases[i] ? 0x11000 : 0) + (cases[i + 20] ? 0x10 : 0);
			ep += (cases[i] ? 0xf : i) * Math.pow(16, i);
			eo += (cases[i + 20] ? 0xf : 0) * Math.pow(16, i);
		}
		for (var i = 0; i < 8; i++) {
			chk += (cases[i + 12] ? 0x10100 : 0) + (cases[i + 32] ? 0x1 : 0);
			cp += (cases[i + 12] ? 0xf : i) * Math.pow(16, i);
			co += (cases[i + 32] ? 0xf : 0) * Math.pow(16, i);
		}
		if ((chk & 0x1cccee) == 0) {
			return "U' U ";
		}
		return getAnyScramble(ep, eo, cp, co, neut);
	}

	function getEasyCrossScramble(type, length, _, neut) {
		var cases = cross.getEasyCross(length);
		return getAnyScramble(cases[0], cases[1], 0xffffffff, 0xffffffff, neut);
	}

	function getEasyXCrossScramble(type, length, _, neut) {
		var cases = cross.getEasyXCross(length);
		return getAnyScramble(cases[0], cases[1], cases[2], cases[3], neut);
	}

	var normTrans = [];

	function normOrient(facelet, toAppend) {
		var rotMoves1 = ["", "x", "x2", "x'", "z", "z'"];
		var rotMoves2 = ["", "y", "y2", "y'"];
		if (normTrans.length == 0) {
			for (var i = 0; i < 24; i++) {
				var cc = new mathlib.CubieCube();
				cc.selfMoveStr(rotMoves2[i & 3]);
				cc.selfMoveStr(rotMoves1[i >> 2]);
				normTrans.push(cc.toPerm(null, null, null, true));
			}
		}
		var ori = 0;
		out: for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 6; j++) {
				if (facelet[normTrans[i][j * 9 + 4]] != "URFDLB".charAt(j)) {
					continue out;
				}
			}
			var ret = [];
			for (var j = 0; j < 54; j++) {
				ret[j] = facelet[normTrans[i][j]];
			}
			facelet = ret.join('');
			ori = i;
			break;
		}
		var mv1 = rotMoves1[ori >> 2];
		if (mv1 != "") {
			toAppend.push(mv1[0] + "'2 ".charAt("2'".indexOf(mv1[1]) + 1));
		}
		var mv2 = rotMoves2[ori & 3];
		if (mv2 != "") {
			toAppend.push(mv2[0] + "'2 ".charAt("2'".indexOf(mv2[1]) + 1));
		}
		return facelet;
	}

	var subsetSolvs = {};

	function subsetScramble(moves) {
		var key = moves.join('|');
		if (!subsetSolvs[key]) {
			var gens = [];
			for (var m = 0; m < moves.length; m++) {
				var cc = new mathlib.CubieCube();
				cc.selfMoveStr(moves[m]);
				gens.push(cc.toPerm(null, null, null, true));
			}
			subsetSolvs[key] = new grouplib.SubgroupSolver(gens);
			subsetSolvs[key].initTables();
		}
		var solv = subsetSolvs[key];
		var solution = "";
		if (solv.sgsG.size() < 1e8) {
			do {
				var state = subsetSolvs[key].sgsG.rndElem();
				var sol = subsetSolvs[key].DissectionSolve(state, 12, 20);
				solution = sol.map((mvpow) => moves[mvpow[0]] + ["", "2", "'"][mvpow[1] - 1]).join(" ");
			} while (solution.length <= 2);
			return solution.replace(/ +/g, ' ');
		}
		var toAppend;
		do {
			var state = subsetSolvs[key].sgsG.rndElem();
			for (var i = 0; i < state.length; i++) {
				state[i] = "URFDLB".charAt(~~(state[i] / 9));
			}
			toAppend = [];
			state = normOrient(state.join(''), toAppend);
			solution = search.solution(state, 21, 1e9, 50, 2);
		} while (solution.length <= 3);
		toAppend.unshift(solution);
		return toAppend.join(' ').replace(/ +/g, ' ');
	}

	function genFacelet(facelet) {
		return search.solution(facelet, 21, 1e9, 50, 2);
	}

	function solvFacelet(facelet) {
		return search.solution(facelet, 21, 1e9, 50, 0);
	}

	/*

	// gens: pattern (string) or [perm1, perm2, ...]
	// assert <iniGens> >= <endGens> <> {e}
	function CommonStep(iniGens, endGens, imgInfo, names) {
		this.iniGens = iniGens;
		this.endGens = endGens;
		this.imgInfo = imgInfo;
		this.names = names || [];
	}

	CommonStep.prototype.init = function() {
		if (this.iniG) {
			return;
		}
		this.iniG = $.isArray(this.iniGens) ? new grouplib.SchreierSims(this.iniGens) : pat3x3.genPatternGroup(this.iniGens);
		this.endG = $.isArray(this.endGens) ? new grouplib.SchreierSims(this.endGens) : pat3x3.genPatternGroup(this.endGens);
		var genAUF = mathlib.CubieCube.moveCube[0].toPerm();
		this.endG.extend([genAUF]);
		this.iniG.extend([genAUF]);
		var cosets = this.iniG.listCoset(this.endG);
		var probs = [];
		for (var i = 0; i < cosets.length; i++) {
			cosets[i] = this.endG.minElem(grouplib.permInv(cosets[i]));
		}
		cosets.sort(grouplib.permCmp);
		var visited = new Set();
		this.movePerm = [];
		var uniqCosets = [];
		for (var i = 0; i < cosets.length; i++) { // handle <U> equivalence
			var coset = cosets[i];
			if (visited.has(coset.join(','))) {
				continue;
			}
			visited.add(coset.join(','));
			var idx = uniqCosets.length;
			this.names[idx] = this.names[idx] || (idx + 1 + "");
			probs[idx] = 1;
			uniqCosets.push(coset);
			for (var m = 0; m < 3; m++) {
				this.movePerm[m] = this.movePerm[m] || mathlib.CubieCube.moveCube[m].toPerm();
				var key = this.endG.minElem(grouplib.permMult(this.movePerm[m], coset)).join(',');
				if (!visited.has(key)) {
					visited.add(key);
					probs[idx]++;
				}
			}
		}
		this.cosets = uniqCosets;
		this.probs = probs;
		DEBUG && console.log('[scramble_333] common step filter init', this);
	}

	CommonStep.prototype.getScramble = function(type, length, cases, neut) { // currently not support neut
		this.init();
		var caze = scrMgr.fixCase(cases, this.probs);
		var perm = grouplib.permMult(this.cosets[caze], this.endG.rndElem());
		var auf = mathlib.rn(4);
		if (auf != 3) {
			perm = grouplib.permMult(this.movePerm[auf], perm);
		}
		var posit = "";
		for (var i = 0; i < perm.length; i++) {
			posit += mathlib.SOLVED_FACELET.charAt(perm[i]);
		}
		return search.solution(posit, 21, 1e9, 50, 2);
	}

	CommonStep.prototype.getImage = function(caze, canvas) {
		this.init();
		var perm = this.cosets[caze];
		var posit = "";
		var llIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 9, 10, 11, 45, 46, 47, 36, 37, 38];
		var target = "DDDDDDDDDLLLLLLLLLFFFFFFFFFUUUUUUUUURRRRRRRRRBBBBBBBBB";
		if (this.imgInfo) {
			target = this.imgInfo[1];
		} else if (!$.isArray(this.endGens)) {
			target = this.endGens;
		}
		for (var i = 0; i < llIdx.length; i++) {
			posit += target.charAt(perm[llIdx[i]]);
		}
		if (!canvas) {
			return [posit, null, this.names[caze]];
		}
		image.llImage.drawImage(posit, null, canvas);
	}

	CommonStep.prototype.regScr = function(type) {
		scrMgr.reg(type, this.getScramble.bind(this), this.getExtra.bind(this));
	}

	CommonStep.prototype.getExtra = function(idx) {
		this.init();
		return [this.names, this.probs, this.getImage.bind(this)][idx];
	}

	var CLL_SOLVED = "DGDGDGDGDLGLLLLLLLFGFFFFFFFUUUUUUUUURGRRRRRRRBGBBBBBBB";
	var F2L_SOLVED = "GGGGDGGGGGGGLLLLLLGGGFFFFFFUUUUUUUUUGGGRRRRRRGGGBBBBBB";
	new CommonStep(F2L_SOLVED, CLL_SOLVED).regScr('cll');
	*/

	scrMgr.reg('333', getRandomScramble)
		('333fm', getFMCScramble)
		('edges', getEdgeScramble)
		('corners', getCornerScramble)
		('333custom', getCustomScramble, [customfilter, customprobs])
		('ll', getLLScramble)
		('lsll2', getLSLLScramble, [f2lfilter, f2lprobs, getF2LImage.bind(null, 'GGGGDGGGGGGGGRRGRRGGGBBGBBG', f2l_map, f2lprobs)])
		('f2l', getF2LScramble)
		('zbll', getZBLLScramble, [zbfilter, zbprobs, getZBLLImage])
		('zbllx2', getZBLLx2Scramble, [zbfilter, zbprobs, getZBLLImage])
		('zzll', getZZLLScramble)
		('zbls', getLSLLScramble, [f2lfilter, f2lprobs, getF2LImage.bind(null, 'GGGGDGGGGGGGGRRGRRGGGBBGBBG', f2l_map, f2lprobs)])
		('ttll', getTTLLScramble, [ttllfilter, ttllprobs, getTTLLImage])
		('eols', getEOLSScramble, [eolsfilter, eolsprobs, getF2LImage.bind(null, 'GDGDDDGDGGGGGRRGRRGGGBBDBBG', eols_map, eolsprobs)])
		('wvls', getWVLSScramble, [wvlsfilter, wvlsprobs, getWVLSImage])
		('vls', getVLSScramble, [vlsfilter, vlsprobs, getVLSImage])
		('lse', getLSEScramble)
		('cmll', getCMLLScramble, [cofilter, coprobs, getCOLLImage.bind(null, 'G')])
		('cll', getCLLScramble, [cofilter, coprobs, getCOLLImage.bind(null, 'G')])
		('coll', getCOLLScramble, [cofilter, coprobs, getCOLLImage.bind(null, 'D')])
		('ell', getELLScramble)
		('pll', getPLLScramble, [pllfilter, pllprobs, getPLLImage])
		('oll', getOLLScramble, [ollfilter, ollprobs, getOLLImage])
		('2gll', get2GLLScramble)
		('sbrx', getSBRouxScramble)
		('half', subsetScramble.bind(null, ["U2", "R2", "F2", "D2", "L2", "B2"]))
		('333drud', subsetScramble.bind(null, ["U", "R2", "F2", "D", "L2", "B2"]))
		('3gen_F', subsetScramble.bind(null, ["U", "R", "F"]))
		('3gen_L', subsetScramble.bind(null, ["U", "R", "L"]))
		('2gen', subsetScramble.bind(null, ["U", "R"]))
		('2genl', subsetScramble.bind(null, ["U", "L"]))
		('RrU', subsetScramble.bind(null, ["R", "Rw", "U"]))
		('roux', subsetScramble.bind(null, ["M", "U"]))
		('mt3qb', getMehta3QBScramble)
		('mteole', getMehtaEOLEScramble)
		('mttdr', getMehtaTDRScramble)
		('mt6cp', getMehta6CPScramble)
		('mtl5ep', getMehtaL5EPScramble)
		('mtcdrll', getMehtaCDRLLScramble)
		('easyc', getEasyCrossScramble)
		('easyxc', getEasyXCrossScramble)
		('eoline', getEOLineScramble)
		('eocross', getEOCrossScramble);

	return {
		/* mark2 interface */
		getRandomScramble: getRandomScramble, //getRandomScramble,

		/* added methods */
		getEdgeScramble: getEdgeScramble,
		getCornerScramble: getCornerScramble,
		getLLScramble: getLLScramble,
		getLSLLScramble: getLSLLScramble,
		getCOLLScramble: getCOLLScramble,
		getZBLLScramble: getZBLLScramble,
		getZBLLx2Scramble: getZBLLx2Scramble,
		getZZLLScramble: getZZLLScramble,
		getTTLLScramble: getTTLLScramble,
		getF2LScramble: getF2LScramble,
		getLSEScramble: getLSEScramble,
		getCMLLScramble: getCMLLScramble,
		getCLLScramble: getCLLScramble,
		getELLScramble: getELLScramble,
		getAnyScramble: getAnyScramble,
		getPLLImage: getPLLImage,
		getOLLImage: getOLLImage,
		getCOLLImage: getCOLLImage,
		getZBLLImage: getZBLLImage,
		genFacelet: genFacelet,
		solvFacelet: solvFacelet
	};

})(mathlib.getNPerm, mathlib.setNPerm, mathlib.getNParity, mathlib.rn, mathlib.rndEl);

/* ==== scramble/scramble_444.js ==== */
"use strict";

var scramble_444 = (function(Cnk, circle) {

	var PHASE1_SOLS = 10000;
	var PHASE2_ATTS = 500;
	var PHASE2_SOLS = 100;
	var MAX_SEARCH_DEPTH = 60;

	function createArray(length1, length2) {
		var result, i;
		result = new Array(length1);
		if (length2 != undefined) {
			for (i = 0; i < length1; i++) {
				result[i] = new Array(length2);
			}
		}
		return result;
	}

	var _;

	function defineClass() {
		_ = arguments[0].prototype;
		for (var i = 1; i < arguments.length; ++i) {
			arguments[i].prototype = _;
		}
	}

	function nullMethod() {}

	function $clinit_Center1() {
		$clinit_Center1 = nullMethod;
		Center1SymMove = createArray(15582, 36);
		Center1Sym2Raw = createArray(15582);
		Center1SymPrun = createArray(15582);
		SymMult = createArray(48, 48);
		SymMove = createArray(48, 36);
		SymInv = createArray(48);
		finish_0 = createArray(48);
	}

	function $equals(obj, c) {
		for (var i = 0; i < 24; ++i) {
			if (obj.ct[i] != c.ct[i]) {
				return false;
			}
		}
		return true;
	}

	function $get_1(obj) {
		var idx = 0;
		var r = 8;
		for (var i = 23; i >= 0; --i) {
			obj.ct[i] == 1 && (idx += Cnk[i][r--]);
		}
		return idx;
	}

	function getCenter1RotThres(obj, rotPerm, thres) {
		var idx = 0;
		var r = 8;
		for (var i = 23; i >= 0; --i) {
			obj.ct[rotPerm[i]] == 1 && (idx += Cnk[i][r--]);
			if (idx >= thres) {
				return -1;
			}
		}
		return idx;
	}

	function $getsym(obj) {
		var cord, j;
		var ret = 0;
		if (Center1Raw2Sym != null) {
			for (var s = 0; s < 48; s++) {
				var idx = getCenter1RotThres(obj, Center1RotPerm[s], mathlib.Cnk[21][8]);
				if (idx != -1) {
					ret = Center1Raw2Sym[idx];
					return ret & ~0x3f | SymMult[s][ret & 0x3f];
				}
			}
		}
		for (j = 0; j < 48; ++j) {
			cord = raw2sym_0($get_1(obj));
			if (cord != -1) {
				return cord * 64 + j;
			}
			$rot(obj, 0);
			j % 2 == 1 && $rot(obj, 1);
			j % 8 == 7 && $rot(obj, 2);
			j % 16 == 15 && $rot(obj, 3);
		}
	}

	function doMoveCenter1(obj, m_0) {
		doMoveCenterCube(obj, m_0);
	}

	function $rot(obj, r) {
		switch (r) {
			case 0:
				doMoveCenter1(obj, 19);
				doMoveCenter1(obj, 28);
				break;
			case 1:
				doMoveCenter1(obj, 21);
				doMoveCenter1(obj, 32);
				break;
			case 2:
				swap(obj.ct, 0, 3, 1, 2, 1);
				swap(obj.ct, 8, 11, 9, 10, 1);
				swap(obj.ct, 4, 7, 5, 6, 1);
				swap(obj.ct, 12, 15, 13, 14, 1);
				swap(obj.ct, 16, 19, 21, 22, 1);
				swap(obj.ct, 17, 18, 20, 23, 1);
				break;
			case 3:
				doMoveCenter1(obj, 18);
				doMoveCenter1(obj, 29);
				doMoveCenter1(obj, 24);
				doMoveCenter1(obj, 35);
				break;
		}
	}

	function Center1Rotate(obj, r) {
		var j;
		for (j = 0; j < r; ++j) {
			$rot(obj, 0);
			j % 2 == 1 && $rot(obj, 1);
			j % 8 == 7 && $rot(obj, 2);
			j % 16 == 15 && $rot(obj, 3);
		}
	}

	function $set_0(obj, idx) {
		var i, r;
		r = 8;
		for (i = 23; i >= 0; --i) {
			obj.ct[i] = 0;
			if (idx >= Cnk[i][r]) {
				idx -= Cnk[i][r--];
				obj.ct[i] = 1;
			}
		}
	}

	function $set_1(obj, c) {
		var i;
		for (i = 0; i < 24; ++i) {
			obj.ct[i] = c.ct[i];
		}
	}

	function Center1(cc) {
		if (cc) {
			this.ct = cc.ct.slice();
			return;
		}
		this.ct = [];
		for (var i = 0; i < 24; ++i) {
			this.ct[i] = i < 8 ? 1 : 0;
		}
	}

	Center1.prototype.fromCube = function(cc, urf) {
		for (var i = 0; i < 24; ++i) {
			this.ct[i] = cc.ct[i] % 3 == urf ? 1 : 0;
		}
		return this;
	}

	function initCenter1MoveTable() {
		var c = new Center1();
		var d = new Center1();
		for (var i = 0; i < 15582; ++i) {
			$set_0(d, Center1Sym2Raw[i]);
			for (var m = 0; m < 36; ++m) {
				if (m % 3 == 1 || Center1SymMove[i][m] !== undefined) {
					continue;
				}
				$set_1(c, d);
				doMoveCenter1(c, m);
				var idx = $getsym(c);
				Center1SymMove[i][m] = idx;
				var invM = SymMove[idx & 0x3f][~~(m / 3) * 3 + 2 - m % 3];
				if (Center1SymMove[idx >> 6][invM] === undefined) {
					Center1SymMove[idx >> 6][invM] = i << 6 | SymInv[idx & 0x3f];
				}
			}
		}
		for (var i = 0; i < 15582; i++) {
			for (var m = 0; m < 36; m += 3) {
				var idx = Center1SymMove[i][m];
				var nextM = SymMove[idx & 0x3f][m];
				var nextIdx = Center1SymMove[idx >>> 6][nextM];
				var symx = SymMult[idx & 0x3f][nextIdx & 0x3f];
				Center1SymMove[i][m + 1] = nextIdx & ~0x3f | symx;
			}
		}
	}

	function initCenter1Prun() {
		var check, depth, done, i, idx, inv, m_0, select;
		fill_0(Center1SymPrun);
		Center1SymPrun[0] = 0;
		depth = 0;
		done = 1;
		while (done != 15582) {
			inv = depth > 4;
			select = inv ? -1 : depth;
			check = inv ? depth : -1;
			++depth;
			for (i = 0; i < 15582; ++i) {
				if (Center1SymPrun[i] != select) {
					continue;
				}
				for (m_0 = 0; m_0 < 27; ++m_0) {
					idx = Center1SymMove[i][m_0] >>> 6;
					if (Center1SymPrun[idx] != check) {
						continue;
					}
					++done;
					if (inv) {
						Center1SymPrun[i] = depth;
						break;
					} else {
						Center1SymPrun[idx] = depth;
					}
				}
			}
		}
	}

	function getSolvedSym(cube) {
		var c, check, i, j;
		c = new Center1(cube);
		for (j = 0; j < 48; ++j) {
			check = true;
			for (i = 0; i < 24; ++i) {
				if (c.ct[i] != (centerFacelet[i] >> 4)) {
					check = false;
					break;
				}
			}
			if (check) {
				return j;
			}
			$rot(c, 0);
			j % 2 == 1 && $rot(c, 1);
			j % 8 == 7 && $rot(c, 2);
			j % 16 == 15 && $rot(c, 3);
		}
		return -1;
	}

	function initSymMeta() {
		var c, d, e, f, i, j, k_0;
		c = new Center1();
		for (i = 0; i < 24; ++i) {
			c.ct[i] = i;
		}
		d = new Center1(c);
		e = new Center1(c);
		f = new Center1(c);
		for (i = 0; i < 48; ++i) {
			for (j = 0; j < 48; ++j) {
				for (k_0 = 0; k_0 < 48; ++k_0) {
					if ($equals(c, d)) {
						SymMult[i][j] = k_0;
						k_0 == 0 && (SymInv[i] = j);
					}
					$rot(d, 0);
					k_0 % 2 == 1 && $rot(d, 1);
					k_0 % 8 == 7 && $rot(d, 2);
					k_0 % 16 == 15 && $rot(d, 3);
				}
				$rot(c, 0);
				j % 2 == 1 && $rot(c, 1);
				j % 8 == 7 && $rot(c, 2);
				j % 16 == 15 && $rot(c, 3);
			}
			$rot(c, 0);
			i % 2 == 1 && $rot(c, 1);
			i % 8 == 7 && $rot(c, 2);
			i % 16 == 15 && $rot(c, 3);
		}
		for (i = 0; i < 48; ++i) {
			$set_1(c, e);
			Center1Rotate(c, SymInv[i]);
			for (j = 0; j < 36; ++j) {
				$set_1(d, c);
				doMoveCenter1(d, j);
				Center1Rotate(d, i);
				for (k_0 = 0; k_0 < 36; ++k_0) {
					$set_1(f, e);
					doMoveCenter1(f, k_0);
					if ($equals(f, d)) {
						SymMove[i][j] = k_0;
						break;
					}
				}
			}
		}
		$set_0(c, 0);
		for (i = 0; i < 48; ++i) {
			finish_0[SymInv[i]] = $get_1(c);
			$rot(c, 0);
			i % 2 == 1 && $rot(c, 1);
			i % 8 == 7 && $rot(c, 2);
			i % 16 == 15 && $rot(c, 3);
		}
	}

	function initCenter1Sym2Raw() {
		var idx, j, occ;
		var c = new Center1();
		var d = new Center1();

		Center1RotPerm = [];
		for (var i = 0; i < 24; i++) {
			c.ct[i] = i;
		}
		for (var s = 0; s < 48; s++) {
			Center1RotPerm[s] = c.ct.slice();
			$rot(c, 0);
			s % 2 == 1 && $rot(c, 1);
			s % 8 == 7 && $rot(c, 2);
			s % 16 == 15 && $rot(c, 3);
		}

		occ = createArray(22984);
		for (var i = 0; i < 22984; i++) {
			occ[i] = 0;
		}
		var count = 0;
		for (var i = 0; i < mathlib.Cnk[21][8]; ++i) {
			if ((occ[i >>> 5] & 1 << (i & 31)) == 0) {
				$set_0(c, i);
				for (j = 0; j < 48; ++j) {
					idx = getCenter1RotThres(c, Center1RotPerm[j], mathlib.Cnk[21][8]);
					if (idx == -1) {
						continue;
					}
					occ[idx >>> 5] |= 1 << (idx & 31);
					Center1Raw2Sym != null && (Center1Raw2Sym[idx] = count << 6 | SymInv[j]);
				}
				Center1Sym2Raw[count++] = i;
			}
		}
	}

	function raw2sym_0(n) {
		var m_0;
		m_0 = binarySearch_0(Center1Sym2Raw, n);
		return m_0 >= 0 ? m_0 : -1;
	}

	var Center1SymPrun, Center1SymMove, finish_0, Center1Raw2Sym = null,
		Center1Sym2Raw, Center1RotPerm, SymInv, SymMove, SymMult;

	function $clinit_Center2() {
		$clinit_Center2 = nullMethod;
		rlmv = createArray(70, 28);
		ctmv = createArray(6435, 28);
		rlrot = createArray(70, 16);
		ctrot = createArray(6435, 16);
		ctprun = createArray(450450);
		pmv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
	}

	function $getct(obj) {
		var i, idx, r;
		idx = 0;
		r = 8;
		for (i = 14; i >= 0; --i) {
			obj.ct[i] != obj.ct[15] && (idx += Cnk[i][r--]);
		}
		return idx;
	}

	function $getrl(obj) {
		var i, idx, r;
		idx = 0;
		r = 4;
		for (i = 6; i >= 0; --i) {
			obj.rl[i] != obj.rl[7] && (idx += Cnk[i][r--]);
		}
		return idx * 2 + obj.parity;
	}

	function doMoveCenter2(obj, m_0) {
		var key;
		obj.parity ^= pmv[m_0];
		key = m_0 % 3;
		m_0 = ~~(m_0 / 3);
		switch (m_0) {
			case 0:
				swap(obj.ct, 0, 1, 2, 3, key);
				break;
			case 1:
				swap(obj.rl, 0, 1, 2, 3, key);
				break;
			case 2:
				swap(obj.ct, 8, 9, 10, 11, key);
				break;
			case 3:
				swap(obj.ct, 4, 5, 6, 7, key);
				break;
			case 4:
				swap(obj.rl, 4, 5, 6, 7, key);
				break;
			case 5:
				swap(obj.ct, 12, 13, 14, 15, key);
				break;
			case 6:
				swap(obj.ct, 0, 1, 2, 3, key);
				swap(obj.rl, 0, 5, 4, 1, key);
				swap(obj.ct, 8, 9, 12, 13, key);
				break;
			case 7:
				swap(obj.rl, 0, 1, 2, 3, key);
				swap(obj.ct, 1, 15, 5, 9, key);
				swap(obj.ct, 2, 12, 6, 10, key);
				break;
			case 8:
				swap(obj.ct, 8, 9, 10, 11, key);
				swap(obj.rl, 0, 3, 6, 5, key);
				swap(obj.ct, 3, 2, 5, 4, key);
				break;
			case 9:
				swap(obj.ct, 4, 5, 6, 7, key);
				swap(obj.rl, 3, 2, 7, 6, key);
				swap(obj.ct, 11, 10, 15, 14, key);
				break;
			case 10:
				swap(obj.rl, 4, 5, 6, 7, key);
				swap(obj.ct, 0, 8, 4, 14, key);
				swap(obj.ct, 3, 11, 7, 13, key);
				break;
			case 11:
				swap(obj.ct, 12, 13, 14, 15, key);
				swap(obj.rl, 1, 4, 7, 2, key);
				swap(obj.ct, 1, 0, 7, 6, key);
		}
	}

	function $rot_0(obj, r) {
		switch (r) {
			case 0:
				doMoveCenter2(obj, 19);
				doMoveCenter2(obj, 28);
				break;
			case 1:
				doMoveCenter2(obj, 21);
				doMoveCenter2(obj, 32);
				break;
			case 2:
				swap(obj.ct, 0, 3, 1, 2, 1);
				swap(obj.ct, 8, 11, 9, 10, 1);
				swap(obj.ct, 4, 7, 5, 6, 1);
				swap(obj.ct, 12, 15, 13, 14, 1);
				swap(obj.rl, 0, 3, 5, 6, 1);
				swap(obj.rl, 1, 2, 4, 7, 1);
		}
	}

	function $set_2(obj, c, edgeParity) {
		var i;
		for (i = 0; i < 16; ++i) {
			obj.ct[i] = c.ct[i] % 3;
		}
		for (i = 0; i < 8; ++i) {
			obj.rl[i] = c.ct[i + 16];
		}
		obj.parity = edgeParity;
	}

	function $setct(obj, idx) {
		var i, r;
		r = 8;
		obj.ct[15] = 0;
		for (i = 14; i >= 0; --i) {
			if (idx >= Cnk[i][r]) {
				idx -= Cnk[i][r--];
				obj.ct[i] = 1;
			} else {
				obj.ct[i] = 0;
			}
		}
	}

	function $setrl(obj, idx) {
		var i, r;
		obj.parity = idx & 1;
		idx >>>= 1;
		r = 4;
		obj.rl[7] = 0;
		for (i = 6; i >= 0; --i) {
			if (idx >= Cnk[i][r]) {
				idx -= Cnk[i][r--];
				obj.rl[i] = 1;
			} else {
				obj.rl[i] = 0;
			}
		}
	}

	function Center2() {
		this.rl = createArray(8);
		this.ct = createArray(16);
		this.parity = 0;
	}

	Center2.prototype.copy = function(obj) {
		for (var i = 0; i < 8; i++) {
			this.rl[i] = obj.rl[i];
		}
		for (var i = 0; i < 16; i++) {
			this.ct[i] = obj.ct[i];
		}
		this.parity = obj.parity;
	}
	var ctmv, ctprun, ctrot, pmv, rlmv, rlrot;

	function initCenter2() {
		var ct, ctx, depth, done, i, idx, j, m_0, rl, rlx;
		var c = new Center2;
		var d = new Center2;
		for (i = 0; i < 70; ++i) {
			for (m_0 = 0; m_0 < 28; ++m_0) {
				$setrl(c, i);
				doMoveCenter2(c, move2std[m_0]);
				rlmv[i][m_0] = $getrl(c);
			}
		}
		for (i = 0; i < 70; ++i) {
			$setrl(c, i);
			for (j = 0; j < 16; ++j) {
				rlrot[i][j] = $getrl(c);
				$rot_0(c, 0);
				j % 2 == 1 && $rot_0(c, 1);
				j % 8 == 7 && $rot_0(c, 2);
			}
		}
		for (i = 0; i < 6435; ++i) {
			$setct(c, i);
			for (j = 0; j < 16; ++j) {
				ctrot[i][j] = $getct(c);
				$rot_0(c, 0);
				j % 2 == 1 && $rot_0(c, 1);
				j % 8 == 7 && $rot_0(c, 2);
			}
		}
		for (i = 0; i < 6435; ++i) {
			$setct(c, i);
			for (m_0 = 0; m_0 < 28; ++m_0) {
				d.copy(c);
				doMoveCenter2(d, move2std[m_0]);
				ctmv[i][m_0] = $getct(d);
			}
		}
		fill_0(ctprun);
		ctprun[0] = ctprun[18] = ctprun[28] = ctprun[46] = ctprun[54] = ctprun[56] = 0;
		depth = 0;
		done = 6;

		while (done != 450450) {
			var inv = depth > 6;
			var select = inv ? -1 : depth;
			var check = inv ? depth : -1;
			++depth;
			for (i = 0; i < 450450; ++i) {
				if (ctprun[i] != select) {
					continue;
				}
				ct = ~~(i / 70);
				rl = i % 70;
				for (m_0 = 0; m_0 < 23; ++m_0) {
					ctx = ctmv[ct][m_0];
					rlx = rlmv[rl][m_0];
					idx = ctx * 70 + rlx;
					if (ctprun[idx] != check) {
						continue;
					}
					++done;
					if (inv) {
						ctprun[i] = depth;
						break;
					} else {
						ctprun[idx] = depth;
					}
				}
			}
		}
	}

	function $clinit_Center3() {
		$clinit_Center3 = nullMethod;
		ctmove = createArray(29400, 20);
		pmove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
		prun_0 = createArray(29400);
		rl2std = [0, 9, 14, 23, 27, 28, 41, 42, 46, 55, 60, 69];
		std2rl = createArray(70);
	}

	function $getct_0(obj) {
		var check, i, idx, idxrl, r;
		idx = 0;
		r = 4;
		for (i = 6; i >= 0; --i) {
			obj.ud[i] != obj.ud[7] && (idx += Cnk[i][r--]);
		}
		idx *= 35;
		r = 4;
		for (i = 6; i >= 0; --i) {
			obj.fb[i] != obj.fb[7] && (idx += Cnk[i][r--]);
		}
		idx *= 12;
		check = obj.fb[7] ^ obj.ud[7];
		idxrl = 0;
		r = 4;
		for (i = 7; i >= 0; --i) {
			obj.rl[i] != check && (idxrl += Cnk[i][r--]);
		}
		return obj.parity + 2 * (idx + std2rl[idxrl]);
	}

	function doMoveCenter3(obj, i) {
		obj.parity ^= pmove[i];
		switch (i) {
			case 0:
			case 1:
			case 2:
				swap(obj.ud, 0, 1, 2, 3, i % 3);
				break;
			case 3:
				swap(obj.rl, 0, 1, 2, 3, 1);
				break;
			case 4:
			case 5:
			case 6:
				swap(obj.fb, 0, 1, 2, 3, (i - 1) % 3);
				break;
			case 7:
			case 8:
			case 9:
				swap(obj.ud, 4, 5, 6, 7, (i - 1) % 3);
				break;
			case 10:
				swap(obj.rl, 4, 5, 6, 7, 1);
				break;
			case 11:
			case 12:
			case 13:
				swap(obj.fb, 4, 5, 6, 7, (i + 1) % 3);
				break;
			case 14:
				swap(obj.ud, 0, 1, 2, 3, 1);
				swap(obj.rl, 0, 5, 4, 1, 1);
				swap(obj.fb, 0, 5, 4, 1, 1);
				break;
			case 15:
				swap(obj.rl, 0, 1, 2, 3, 1);
				swap(obj.fb, 1, 4, 7, 2, 1);
				swap(obj.ud, 1, 6, 5, 2, 1);
				break;
			case 16:
				swap(obj.fb, 0, 1, 2, 3, 1);
				swap(obj.ud, 3, 2, 5, 4, 1);
				swap(obj.rl, 0, 3, 6, 5, 1);
				break;
			case 17:
				swap(obj.ud, 4, 5, 6, 7, 1);
				swap(obj.rl, 3, 2, 7, 6, 1);
				swap(obj.fb, 3, 2, 7, 6, 1);
				break;
			case 18:
				swap(obj.rl, 4, 5, 6, 7, 1);
				swap(obj.fb, 0, 3, 6, 5, 1);
				swap(obj.ud, 0, 3, 4, 7, 1);
				break;
			case 19:
				swap(obj.fb, 4, 5, 6, 7, 1);
				swap(obj.ud, 0, 7, 6, 1, 1);
				swap(obj.rl, 1, 4, 7, 2, 1);
		}
	}

	function $set_3(obj, c, eXc_parity) {
		var i, parity;
		parity = c.ct[0] % 3 > c.ct[8] % 3 ^ c.ct[8] % 3 > c.ct[16] % 3 ^ c.ct[0] % 3 > c.ct[16] % 3 ? 0 : 1;
		for (i = 0; i < 8; ++i) {
			obj.ud[i] = ~~(c.ct[i] / 3) ^ 1;
			obj.fb[i] = ~~(c.ct[i + 8] / 3) ^ 1;
			obj.rl[i] = ~~(c.ct[i + 16] / 3) ^ 1 ^ parity;
		}
		obj.parity = parity ^ eXc_parity;
	}

	function $setct_0(obj, idx) {
		var i, idxfb, idxrl, r;
		obj.parity = idx & 1;
		idx >>>= 1;
		idxrl = rl2std[idx % 12];
		idx = ~~(idx / 12);
		r = 4;
		for (i = 7; i >= 0; --i) {
			obj.rl[i] = 0;
			if (idxrl >= Cnk[i][r]) {
				idxrl -= Cnk[i][r--];
				obj.rl[i] = 1;
			}
		}
		idxfb = idx % 35;
		idx = ~~(idx / 35);
		r = 4;
		obj.fb[7] = 0;
		for (i = 6; i >= 0; --i) {
			if (idxfb >= Cnk[i][r]) {
				idxfb -= Cnk[i][r--];
				obj.fb[i] = 1;
			} else {
				obj.fb[i] = 0;
			}
		}
		r = 4;
		obj.ud[7] = 0;
		for (i = 6; i >= 0; --i) {
			if (idx >= Cnk[i][r]) {
				idx -= Cnk[i][r--];
				obj.ud[i] = 1;
			} else {
				obj.ud[i] = 0;
			}
		}
	}

	function Center3() {
		this.ud = createArray(8);
		this.rl = createArray(8);
		this.fb = createArray(8);
		this.parity = 0;
	}

	Center3.prototype.copy = function(obj) {
		for (var i = 0; i < 8; i++) {
			this.ud[i] = obj.ud[i];
			this.rl[i] = obj.rl[i];
			this.fb[i] = obj.fb[i];
		}
		this.parity = obj.parity;
	}
	var ctmove, pmove, prun_0, rl2std, std2rl;

	function initCenter3() {
		var depth, done, i, m_0;
		for (i = 0; i < 12; ++i) {
			std2rl[rl2std[i]] = i;
		}
		var c = new Center3;
		var d = new Center3;
		for (i = 0; i < 29400; ++i) {
			$setct_0(c, i);
			for (m_0 = 0; m_0 < 20; ++m_0) {
				d.copy(c);
				doMoveCenter3(d, m_0);
				ctmove[i][m_0] = $getct_0(d);
			}
		}
		fill_0(prun_0);
		prun_0[0] = 0;
		depth = 0;
		done = 1;
		while (done != 29400) {
			for (i = 0; i < 29400; ++i) {
				if (prun_0[i] != depth) {
					continue;
				}
				for (m_0 = 0; m_0 < 17; ++m_0) {
					if (prun_0[ctmove[i][m_0]] == -1) {
						prun_0[ctmove[i][m_0]] = depth + 1;
						++done;
					}
				}
			}
			++depth;
		}
	}

	function $copy_1(obj, c) {
		var i;
		for (i = 0; i < 24; ++i) {
			obj.ct[i] = c.ct[i];
		}
	}

	function doMoveCenterCube(obj, m_0) {
		var key;
		key = m_0 % 3;
		m_0 = ~~(m_0 / 3);
		switch (m_0) {
			case 6: // u
				swap(obj.ct, 8, 20, 12, 16, key);
				swap(obj.ct, 9, 21, 13, 17, key);
			case 0: // U
				swap(obj.ct, 0, 1, 2, 3, key);
				break;
			case 7: // r
				swap(obj.ct, 1, 15, 5, 9, key);
				swap(obj.ct, 2, 12, 6, 10, key);
			case 1: // R
				swap(obj.ct, 16, 17, 18, 19, key);
				break;
			case 8: // f
				swap(obj.ct, 2, 19, 4, 21, key);
				swap(obj.ct, 3, 16, 5, 22, key);
			case 2: // F
				swap(obj.ct, 8, 9, 10, 11, key);
				break;
			case 9: // d
				swap(obj.ct, 10, 18, 14, 22, key);
				swap(obj.ct, 11, 19, 15, 23, key);
			case 3: // D
				swap(obj.ct, 4, 5, 6, 7, key);
				break;
			case 10: // l
				swap(obj.ct, 0, 8, 4, 14, key);
				swap(obj.ct, 3, 11, 7, 13, key);
			case 4: // L
				swap(obj.ct, 20, 21, 22, 23, key);
				break;
			case 11: // b
				swap(obj.ct, 1, 20, 7, 18, key);
				swap(obj.ct, 0, 23, 6, 17, key);
			case 5: // B
				swap(obj.ct, 12, 13, 14, 15, key);
				break;
		}
	}

	function CenterCube() {
		this.ct = [];
		for (var i = 0; i < 24; ++i) {
			this.ct[i] = centerFacelet[i] >> 4;
		}
	}

	function $clinit_CornerCube() {
		$clinit_CornerCube = nullMethod;
		CornerMoveCube = createArray(18);
		cornerFacelet_0 = [
			[8, 9, 20],
			[6, 18, 38],
			[0, 36, 47],
			[2, 45, 11],
			[29, 26, 15],
			[27, 44, 24],
			[33, 53, 42],
			[35, 17, 51]
		];
		initMove_0();
	}

	function $$init_2(obj) {
		obj.cp = [0, 1, 2, 3, 4, 5, 6, 7];
		obj.co = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	function $copy_2(obj, c) {
		var i;
		for (i = 0; i < 8; ++i) {
			obj.cp[i] = c.cp[i];
			obj.co[i] = c.co[i];
		}
	}

	function $move_3(obj, idx) {
		!obj.temps && (obj.temps = new CornerCube_0);
		CornMult_0(obj, CornerMoveCube[idx], obj.temps);
		$copy_2(obj, obj.temps);
	}

	function $setTwist_0(obj, idx) {
		var i, twst;
		twst = 0;
		for (i = 6; i >= 0; --i) {
			twst += obj.co[i] = idx % 3;
			idx = ~~(idx / 3);
		}
		obj.co[7] = (15 - twst) % 3;
	}

	function CornMult_0(a, b, prod) {
		var corn, ori, oriA, oriB;
		for (corn = 0; corn < 8; ++corn) {
			prod.cp[corn] = a.cp[b.cp[corn]];
			oriA = a.co[b.cp[corn]];
			oriB = b.co[corn];
			ori = oriA;
			ori = ori + (oriA < 3 ? oriB : 6 - oriB);
			ori = ori % 3;
			oriA >= 3 ^ oriB >= 3 && (ori = ori + 3);
			prod.co[corn] = ori;
		}
	}

	function CornerCube_0() {
		$$init_2(this);
	}

	function CornerCube_1(cperm, twist) {
		$$init_2(this);
		mathlib.setNPerm(this.cp, cperm, 8);
		$setTwist_0(this, twist);
	}

	function initMove_0() {
		var a, p_0;
		CornerMoveCube[0] = new CornerCube_1(15120, 0);
		CornerMoveCube[3] = new CornerCube_1(21021, 1494);
		CornerMoveCube[6] = new CornerCube_1(8064, 1236);
		CornerMoveCube[9] = new CornerCube_1(9, 0);
		CornerMoveCube[12] = new CornerCube_1(1230, 412);
		CornerMoveCube[15] = new CornerCube_1(224, 137);
		for (a = 0; a < 18; a += 3) {
			for (p_0 = 0; p_0 < 2; ++p_0) {
				CornerMoveCube[a + p_0 + 1] = new CornerCube_0;
				CornMult_0(CornerMoveCube[a + p_0], CornerMoveCube[a], CornerMoveCube[a + p_0 + 1]);
			}
		}
	}

	defineClass(CornerCube_0, CornerCube_1);
	_.temps = null;
	var cornerFacelet_0, CornerMoveCube;

	function $clinit_Edge3() {
		$clinit_Edge3 = nullMethod;
		prunValues = [1, 4, 16, 55, 324, 1922, 12275, 77640, 485359, 2778197, 11742425, 27492416, 31002941, 31006080];
		Edge3Prun = new Int32Array(1937880);
		Edge3Sym2Raw = createArray(1538);
		Edge3Sym2Mask = createArray(1538);
		symstate = createArray(1538);
		Edge3Raw2Sym = createArray(11880);
		syminv_0 = [0, 1, 6, 3, 4, 5, 2, 7];
		mvrot = createArray(168, 12);
		mvroto = createArray(168, 12);
		factX = [1, 1, 1, 3, 12, 60, 360, 2520, 20160, 181440, 1814400, 19958400, 239500800];
		FullEdgeMap = [0, 2, 4, 6, 1, 3, 7, 5, 8, 9, 10, 11];
	}

	function $circlex(obj, a, b, c, d) {
		var temp;
		temp = obj.edgeo[d];
		obj.edgeo[d] = obj.edge[c];
		obj.edge[c] = obj.edgeo[b];
		obj.edgeo[b] = obj.edge[a];
		obj.edge[a] = temp;
	}

	function $get_2(obj, end, returnMask) {
		obj.isStd || $std(obj);
		return get12Perm(obj.edge, end, returnMask);
	}

	function get12Perm(arr, end, returnMask) {
		var idx = 0;
		var mask = 0;
		for (var i = 0; i < end; i++) {
			var val = arr[i];
			idx = idx * (12 - i) + val - mathlib.bitCount(mask & ((1 << val) - 1));
			mask |= 1 << val;
		}
		return returnMask ? mask : idx;
	}

	function $getsym_0(obj) {
		obj.isStd || $std(obj);
		return getMvSym(obj.edge, 20) >> 3;
	}

	function $move_4(obj, i) {
		obj.isStd = false;
		switch (i) {
			case 0:
				circle(obj.edge, 0, 4, 1, 5);
				circle(obj.edgeo, 0, 4, 1, 5);
				break;
			case 1:
				$swap_0(obj.edge, 0, 4, 1, 5);
				$swap_0(obj.edgeo, 0, 4, 1, 5);
				break;
			case 2:
				circle(obj.edge, 0, 5, 1, 4);
				circle(obj.edgeo, 0, 5, 1, 4);
				break;
			case 3:
				$swap_0(obj.edge, 5, 10, 6, 11);
				$swap_0(obj.edgeo, 5, 10, 6, 11);
				break;
			case 4:
				circle(obj.edge, 0, 11, 3, 8);
				circle(obj.edgeo, 0, 11, 3, 8);
				break;
			case 5:
				$swap_0(obj.edge, 0, 11, 3, 8);
				$swap_0(obj.edgeo, 0, 11, 3, 8);
				break;
			case 6:
				circle(obj.edge, 0, 8, 3, 11);
				circle(obj.edgeo, 0, 8, 3, 11);
				break;
			case 7:
				circle(obj.edge, 2, 7, 3, 6);
				circle(obj.edgeo, 2, 7, 3, 6);
				break;
			case 8:
				$swap_0(obj.edge, 2, 7, 3, 6);
				$swap_0(obj.edgeo, 2, 7, 3, 6);
				break;
			case 9:
				circle(obj.edge, 2, 6, 3, 7);
				circle(obj.edgeo, 2, 6, 3, 7);
				break;
			case 10:
				$swap_0(obj.edge, 4, 8, 7, 9);
				$swap_0(obj.edgeo, 4, 8, 7, 9);
				break;
			case 11:
				circle(obj.edge, 1, 9, 2, 10);
				circle(obj.edgeo, 1, 9, 2, 10);
				break;
			case 12:
				$swap_0(obj.edge, 1, 9, 2, 10);
				$swap_0(obj.edgeo, 1, 9, 2, 10);
				break;
			case 13:
				circle(obj.edge, 1, 10, 2, 9);
				circle(obj.edgeo, 1, 10, 2, 9);
				break;
			case 14:
				$swap_0(obj.edge, 0, 4, 1, 5);
				$swap_0(obj.edgeo, 0, 4, 1, 5);
				circle(obj.edge, 9, 11);
				circle(obj.edgeo, 8, 10);
				break;
			case 15:
				$swap_0(obj.edge, 5, 10, 6, 11);
				$swap_0(obj.edgeo, 5, 10, 6, 11);
				circle(obj.edge, 1, 3);
				circle(obj.edgeo, 0, 2);
				break;
			case 16:
				$swap_0(obj.edge, 0, 11, 3, 8);
				$swap_0(obj.edgeo, 0, 11, 3, 8);
				circle(obj.edge, 5, 7);
				circle(obj.edgeo, 4, 6);
				break;
			case 17:
				$swap_0(obj.edge, 2, 7, 3, 6);
				$swap_0(obj.edgeo, 2, 7, 3, 6);
				circle(obj.edge, 8, 10);
				circle(obj.edgeo, 9, 11);
				break;
			case 18:
				$swap_0(obj.edge, 4, 8, 7, 9);
				$swap_0(obj.edgeo, 4, 8, 7, 9);
				circle(obj.edge, 0, 2);
				circle(obj.edgeo, 1, 3);
				break;
			case 19:
				$swap_0(obj.edge, 1, 9, 2, 10);
				$swap_0(obj.edgeo, 1, 9, 2, 10);
				circle(obj.edge, 4, 6);
				circle(obj.edgeo, 5, 7);
		}
	}

	function $rot_1(obj, r) {
		obj.isStd = false;
		switch (r) {
			case 0:
				$move_4(obj, 14);
				$move_4(obj, 17);
				break;
			case 1:
				$circlex(obj, 11, 5, 10, 6);
				$circlex(obj, 5, 10, 6, 11);
				$circlex(obj, 1, 2, 3, 0);
				$circlex(obj, 4, 9, 7, 8);
				$circlex(obj, 8, 4, 9, 7);
				$circlex(obj, 0, 1, 2, 3);
				break;
			case 2:
				$swapx(obj, 4, 5);
				$swapx(obj, 5, 4);
				$swapx(obj, 11, 8);
				$swapx(obj, 8, 11);
				$swapx(obj, 7, 6);
				$swapx(obj, 6, 7);
				$swapx(obj, 9, 10);
				$swapx(obj, 10, 9);
				$swapx(obj, 1, 1);
				$swapx(obj, 0, 0);
				$swapx(obj, 3, 3);
				$swapx(obj, 2, 2);
		}
	}

	function $rotate_0(obj, r) {
		while (r >= 2) {
			r -= 2;
			$rot_1(obj, 1);
			$rot_1(obj, 2);
		}
		r != 0 && $rot_1(obj, 0);
	}

	function $set_4(obj, idx) {
		var i, p_0, parity, v, vall, valh;
		vall = 0x76543210;
		valh = 0xba98;
		parity = 0;
		for (i = 0; i < 11; ++i) {
			p_0 = factX[11 - i];
			v = ~~(idx / p_0);
			idx = idx % p_0;
			parity ^= v;
			v <<= 2;
			if (v >= 32) {
				v = v - 32;
				obj.edge[i] = valh >> v & 15;
				var m = (1 << v) - 1;
				valh = (valh & m) + ((valh >> 4) & ~m);
			} else {
				obj.edge[i] = vall >> v & 15;
				var m = (1 << v) - 1;
				vall = (vall & m) + ((vall >>> 4) & ~m) + (valh << 28);
				valh = valh >> 4;
			}
		}
		if ((parity & 1) == 0) {
			obj.edge[11] = vall;
		} else {
			obj.edge[11] = obj.edge[10];
			obj.edge[10] = vall;
		}
		for (i = 0; i < 12; ++i) {
			obj.edgeo[i] = i;
		}
		obj.isStd = true;
	}

	function $set_5(obj, e) {
		var i;
		for (i = 0; i < 12; ++i) {
			obj.edge[i] = e.edge[i];
			obj.edgeo[i] = e.edgeo[i];
		}
		obj.isStd = e.isStd;
	}

	function $set_6(obj, c) {
		var i, parity, s, t;
		obj.temp == null && (obj.temp = createArray(12));
		for (i = 0; i < 12; ++i) {
			obj.temp[i] = i;
			obj.edge[i] = c.ep[FullEdgeMap[i] + 12] % 12;
		}
		parity = 1;
		for (i = 0; i < 12; ++i) {
			while (obj.edge[i] != i) {
				t = obj.edge[i];
				obj.edge[i] = obj.edge[t];
				obj.edge[t] = t;
				s = obj.temp[i];
				obj.temp[i] = obj.temp[t];
				obj.temp[t] = s;
				parity ^= 1;
			}
		}
		for (i = 0; i < 12; ++i) {
			obj.edge[i] = obj.temp[c.ep[FullEdgeMap[i]] % 12];
		}
		return parity;
	}

	function $std(obj) {
		var i;
		obj.temp == null && (obj.temp = createArray(12));
		for (i = 0; i < 12; ++i) {
			obj.temp[obj.edgeo[i]] = i;
		}
		for (i = 0; i < 12; ++i) {
			obj.edge[i] = obj.temp[obj.edge[i]];
			obj.edgeo[i] = i;
		}
		obj.isStd = true;
	}

	function $swap_0(arr, a, b, c, d) {
		var temp;
		temp = arr[a];
		arr[a] = arr[c];
		arr[c] = temp;
		temp = arr[b];
		arr[b] = arr[d];
		arr[d] = temp;
	}

	function $swapx(obj, x, y) {
		var temp;
		temp = obj.edge[x];
		obj.edge[x] = obj.edgeo[y];
		obj.edgeo[y] = temp;
	}

	function Edge3_0() {
		this.edge = createArray(12);
		this.edgeo = createArray(12);
		this.isStd = true;
		this.temp = null;
	}
	var FullEdgeMap,
		Edge3Prun, factX, mvrot, mvroto, prunValues, Edge3Raw2Sym, Edge3Sym2Raw, Edge3Sym2Mask, syminv_0, symstate;

	function initEdge3Prun() {
		var chk, cord1, cord1x, cord2, cord2x, e, f, find_0, g, j, symState, symcord1, val;
		e = new Edge3_0;
		f = new Edge3_0;
		g = new Edge3_0;
		fill_0(Edge3Prun);

		var depth = 0;
		var done = 1;
		var doneRaw = 1;
		setPruning(Edge3Prun, 0, 0);
		var bfsMoves = [1, 0, 2, 3, 5, 4, 6, 8, 7, 9, 10, 12, 11, 13, 14, 15, 16];
		var start = $.now();
		while (done != 31006080) {
			var inv = depth > 9;
			var depm3 = depth % 3;
			var dep1m3 = (depth + 1) % 3;
			var dep2m3 = (depth + 2) % 3;
			find_0 = inv ? 3 : depm3;
			chk = inv ? depm3 : 3;
			var find_mask = find_0 * 0x55555555;
			if (depth >= EDGE3_MAX_PRUN - 1) {
				break;
			}
			for (var i_ = 0; i_ < 31006080; i_ += 16) {
				val = Edge3Prun[i_ >> 4];
				var chkmask = val ^ find_mask;
				if  (!inv && val == -1 || ((chkmask - 0x55555555) & ~chkmask & 0xaaaaaaaa) == 0) {
					continue;
				}
				for (var i = i_, end = i_ + 16; i < end; ++i, val >>= 2) {
					if ((val & 3) != find_0) {
						continue;
					}
					symcord1 = ~~(i / 20160);
					cord1 = Edge3Sym2Raw[symcord1];
					cord2 = i % 20160;
					$set_4(e, cord1 * 20160 + cord2);
					for (var mi = 0; mi < 17; ++mi) {
						var m = bfsMoves[mi]
						var idx = getMvSym(e.edge, m, Edge3SymMove[m][symcord1]);
						var symx = idx & 7;
						idx >>= 3;
						var prun = getPruning_0(Edge3Prun, idx);
						if (prun != chk) {
							if (prun == dep2m3 || prun == depm3 && idx < i) {
								mi = skipAxis3[m];
							}
							continue;
						}
						setPruning(Edge3Prun, inv ? i : idx, dep1m3);
						++done;
						if (inv) {
							break;
						}
						var symcord1x = ~~(idx / 20160);
						symState = symstate[symcord1x];
						if (symState == 1) {
							continue;
						}
						$set_5(f, e);
						$move_4(f, m);
						$rotate_0(f, symx);
						for (j = 1;
							(symState = symState >> 1) != 0; ++j) {
							if ((symState & 1) != 1) {
								continue;
							}
							$set_5(g, f);
							$rotate_0(g, j);
							var idxx = symcord1x * 20160 + $get_2(g, 10) % 20160;
							if (getPruning_0(Edge3Prun, idxx) == chk) {
								setPruning(Edge3Prun, idxx, dep1m3);
								++done;
							}
						}
					}
				}
			}
			++depth;
			DEBUG && console.log('[scramble 444] edge3 pruning ', depth, done, $.now() - start);
		}
	}

	function getPruning_0(table, index) {
		return table[index >> 4] >> ((index & 15) << 1) & 3;
	}

	function getMvSym(ep, mv, assumeIdx) {
		var mrIdx = mv << 3;
		var movo, mov;
		var idx = 0;
		var mask = 0;
		if (assumeIdx !== undefined && move3std[mv] % 3 == 1) {
			mrIdx |= assumeIdx & 0x7;
			idx = assumeIdx >> 3;
		} else {
			movo = mvroto[mrIdx];
			mov = mvrot[mrIdx];
			for (var i = 0; i < 4; i++) {
				var val = movo[ep[mov[i]]];
				idx = idx * (12 - i) + val - mathlib.bitCount(mask & ((1 << val) - 1));
				mask |= 1 << val;
			}
			idx = Edge3Raw2Sym[idx];
			mrIdx |= idx & 7;
			idx >>= 3;
		}
		movo = mvroto[mrIdx];
		mov = mvrot[mrIdx];
		mask = Edge3Sym2Mask[idx];
		for (var i = 4; i < 10; i++) {
			var val = movo[ep[mov[i]]];
			idx = idx * (12 - i) + val - mathlib.bitCount(mask & ((1 << val) - 1));
			mask |= 1 << val;
		}
		return idx << 3 | mrIdx & 0x7;
	}

	var EDGE3_MAX_PRUN = 10;

	function getprun(edge) {
		var cord1, cord1x, cord2, cord2x, depm3, depth, e, idx, symcord1;
		e = new Edge3_0;
		depth = 0;
		depm3 = getPruning_0(Edge3Prun, edge);
		if (depm3 == 3) {
			return EDGE3_MAX_PRUN;
		}
		while (edge != 0) {
			depm3 = (depm3 + 2) % 3;
			symcord1 = ~~(edge / 20160);
			cord1 = Edge3Sym2Raw[symcord1];
			cord2 = edge % 20160;
			$set_4(e, cord1 * 20160 + cord2);
			for (var m = 0; m < 17; ++m) {
				idx = getMvSym(e.edge, m) >> 3;
				if (getPruning_0(Edge3Prun, idx) == depm3) {
					++depth;
					edge = idx;
					break;
				}
			}
		}
		return depth;
	}

	function getprun_0(edge, prun) {
		var depm3 = getPruning_0(Edge3Prun, edge);
		if (depm3 == 3) {
			return EDGE3_MAX_PRUN;
		}
		return ((0x49249249 << depm3 >> prun) & 3) + prun - 1;
		// (depm3 - prun + 16) % 3 + prun - 1;
	}

	function initEdge3MvRot() {
		var e = new Edge3_0;
		for (var m = 0; m < 21; ++m) {
			for (var r = 0; r < 8; ++r) {
				$set_4(e, 0);
				$move_4(e, m);
				$rotate_0(e, r);
				for (var i = 0; i < 12; ++i) {
					mvrot[m << 3 | r][i] = e.edge[i];
				}
				$std(e);
				for (var i = 0; i < 12; ++i) {
					mvroto[m << 3 | r][i] = e.temp[i];
				}
			}
		}
	}

	var Edge3SymMove = [];

	function initEdge3Sym2Raw() {
		var count, e, idx, j, occ;
		e = new Edge3_0;
		occ = createArray(1485);
		for (var i = 0; i < 1485; i++) {
			occ[i] = 0;
		}
		count = 0;
		for (var i = 0; i < 11880; ++i) {
			if ((occ[i >>> 3] & 1 << (i & 7)) == 0) {
				$set_4(e, i * factX[8]);
				Edge3Sym2Raw[count] = i;
				Edge3Sym2Mask[count] = $get_2(e, 4, true);
				for (j = 0; j < 8; ++j) {
					idx = $get_2(e, 4);
					idx == i && (symstate[count] = symstate[count] | 1 << j);
					occ[idx >> 3] |= 1 << (idx & 7);
					Edge3Raw2Sym[idx] = count << 3 | syminv_0[j];
					$rot_1(e, 0);
					if (j % 2 == 1) {
						$rot_1(e, 1);
						$rot_1(e, 2);
					}
				}
				count++;
			}
		}
		for (var m = 0; m < 20; m++) {
			Edge3SymMove[m] = [];
		}
		for (var i = 0; i < 1538; i++) {
			$set_4(e, Edge3Sym2Raw[i] * factX[8]);
			for (var m = 0; m < 20; ++m) {
				if (move3std[m] % 3 != 1) {
					continue;
				}
				idx = getMvSym(e.edge, m);
				Edge3SymMove[m][i] = ~~((idx >> 3) / 20160) << 3 | idx & 0x7;
			}
		}
	}

	function setPruning(table, index, value) {
		table[index >> 4] ^= (3 ^ value) << ((index & 15) << 1);
	}

	function checkPhase2Edge(epInv, moves, length) {
		var parity = 0;
		for (var i = 0; i < 12; i++) {
			var e = epInv[i];
			var eo = epInv[i + 12];
			for (var j = 0; j < length; j++) {
				var moveMap = epMoveMap[moves[j]];
				e = moveMap[e];
				eo = moveMap[eo];
			}
			if ((e < 12) != (eo >= 12)) {
				return false;
			}
			parity ^= e >= 12 ? 1 : 0
		}
		return parity == 0;
	}

	function $copy_3(obj, c) {
		var i;
		for (i = 0; i < 24; ++i) {
			obj.ep[i] = c.ep[i];
		}
	}

	function doMoveEdge(obj, m_0) {
		var key;
		key = m_0 % 3;
		m_0 = ~~(m_0 / 3);
		switch (m_0) {
			case 6:
				swap(obj.ep, 9, 22, 11, 20, key);
			case 0:
				swap(obj.ep, 0, 1, 2, 3, key);
				swap(obj.ep, 12, 13, 14, 15, key);
				break;
			case 7:
				swap(obj.ep, 2, 16, 6, 12, key);
			case 1:
				swap(obj.ep, 11, 15, 10, 19, key);
				swap(obj.ep, 23, 3, 22, 7, key);
				break;
			case 8:
				swap(obj.ep, 3, 19, 5, 13, key);
			case 2:
				swap(obj.ep, 0, 11, 6, 8, key);
				swap(obj.ep, 12, 23, 18, 20, key);
				break;
			case 9:
				swap(obj.ep, 8, 23, 10, 21, key);
			case 3:
				swap(obj.ep, 4, 5, 6, 7, key);
				swap(obj.ep, 16, 17, 18, 19, key);
				break;
			case 10:
				swap(obj.ep, 14, 0, 18, 4, key);
			case 4:
				swap(obj.ep, 1, 20, 5, 21, key);
				swap(obj.ep, 13, 8, 17, 9, key);
				break;
			case 11:
				swap(obj.ep, 7, 15, 1, 17, key);
			case 5:
				swap(obj.ep, 2, 9, 4, 10, key);
				swap(obj.ep, 14, 21, 16, 22, key);
				break;
		}
	}

	function EdgeCube() {
		this.ep = [];
		for (var i = 0; i < 24; ++i) {
			this.ep[i] = i;
		}
	}

	function $clinit_FullCube_0() {
		$clinit_FullCube_0 = nullMethod;
		move2rot = [35, 1, 34, 2, 4, 6, 22, 5, 19];
	}

	function $$init_3(obj) {
		obj.moveBuffer = createArray(60);
	}

	function $copy_4(obj, c) {
		var i;
		$copy_3(obj.edge, c.edge);
		$copy_1(obj.center, c.center);
		$copy_2(obj.corner, c.corner);
		obj.value = c.value;
		obj.add1 = c.add1;
		obj.length1 = c.length1;
		obj.length2 = c.length2;
		obj.length3 = c.length3;
		obj.sym = c.sym;
		for (i = 0; i < 60; ++i) {
			obj.moveBuffer[i] = c.moveBuffer[i];
		}
		obj.moveLength = c.moveLength;
		obj.edgeAvail = c.edgeAvail;
		obj.centerAvail = c.centerAvail;
		obj.cornerAvail = c.cornerAvail;
	}

	var centerFacelet = [5, 6, 10, 9, 53, 54, 58, 57, 37, 38, 42, 41, 85, 86, 90, 89, 21, 22, 26, 25, 69, 70, 74, 73];
	var cornerFacelet = [[15, 16, 35], [12, 32, 67], [0, 64, 83], [3, 80, 19], [51, 47, 28], [48, 79, 44], [60, 95, 76], [63, 31, 92]];
	var edgeFacelet = [[13, 33], [4, 65], [2, 81], [11, 17], [61, 94], [52, 78], [50, 46], [59, 30], [75, 40], [68, 87], [27, 88], [20, 39], [34, 14], [66, 8], [82, 1], [18, 7], [93, 62], [77, 56], [45, 49], [29, 55], [36, 71], [91, 72], [84, 23], [43, 24]];

	function $fromFacelet(obj, f) {
		var ctMask = 0;
		var edMask = 0;
		var cpMask = 0;
		var coSum = 0;
		for (var i = 0; i < 24; i++) {
			obj.center.ct[i] = f[centerFacelet[i]];
			ctMask += 1 << f[centerFacelet[i]] * 4;
		}
		for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 24; j++) {
				if (f[edgeFacelet[i][0]] == (edgeFacelet[j][0] >> 4) && f[edgeFacelet[i][1]] == (edgeFacelet[j][1] >> 4)) {
					obj.edge.ep[i] = j;
					edMask |= 1 << j;
				}
			}
		}
		var col1, col2, ori;
		for (var i = 0; i<8; i++) {
			for (ori = 0; ori < 3; ori++) {
				if (f[cornerFacelet[i][ori]] == 0 || f[cornerFacelet[i][ori]] == 3) {
					break;
				}
			}
			col1 = f[cornerFacelet[i][(ori + 1) % 3]];
			col2 = f[cornerFacelet[i][(ori + 2) % 3]];
			for (var j = 0; j < 8; j++) {
				if (col1 == (cornerFacelet[j][1] >> 4) && col2 == (cornerFacelet[j][2] >> 4)) {
					obj.corner.cp[i] = j;
					obj.corner.co[i] = ori % 3;
					cpMask |= 1 << j;
					coSum += ori % 3;
					break;
				}
			}
		}
		return (cpMask != 0xff) * 1 + (coSum % 3 != 0) * 2 + (ctMask != 0x444444) * 4 + (edMask != 0xffffff) * 8;;
	}

	function toFacelet(obj) {
		getCenter(obj);
		$getCorner(obj);
		$getEdge(obj);
		var f = [];
		for (var i = 0; i < 24; i++) {
			f[centerFacelet[i]] = obj.center.ct[i];
		}
		for (var i = 0; i < 24; i++) {
			f[edgeFacelet[i][0]] = edgeFacelet[obj.edge.ep[i]][0] >> 4;
			f[edgeFacelet[i][1]] = edgeFacelet[obj.edge.ep[i]][1] >> 4;
		}
		for (var c=0; c<8; c++) {
			var j = obj.corner.cp[c];
			var ori = obj.corner.co[c];
			for (var n=0; n<3; n++) {
				f[cornerFacelet[c][(n + ori) % 3]] = cornerFacelet[j][n] >> 4;
			}
		}
		return f;
	}

	function to333Facelet(obj) {
		var f = toFacelet(obj);
		var chks = [[1, 2], [4, 8], [7, 11], [13, 14], [5, 6, 9, 10]];
		var map4to3 = [0, 1, 3, 4, 5, 7, 12, 13, 15];
		var f3 = [];
		for (var fidx = 0; fidx < 6; fidx++) {
			for (var i = 0; i < chks.length; i++) {
				var cmp = f[fidx << 4 | chks[i][0]];
				for (var j = 1; j < chks[i].length; j++) {
					if (cmp != f[fidx << 4 | chks[i][j]]) {
						console.log('reduction error', chks[i][j], chks[i][0]);
						return null;
					}
				}
			}
			for (var i = 0; i < map4to3.length; i++) {
				f3[fidx * 9 + i] = f[fidx << 4 | map4to3[i]];
			}
		}
		return f3;
	}

	function getCenter(obj) {
		while (obj.centerAvail < obj.moveLength) {
			doMoveCenterCube(obj.center, obj.moveBuffer[obj.centerAvail++]);
		}
		return obj.center;
	}

	function $getCorner(obj) {
		while (obj.cornerAvail < obj.moveLength) {
			$move_3(obj.corner, obj.moveBuffer[obj.cornerAvail++] % 18);
		}
		return obj.corner;
	}

	function $getEdge(obj) {
		while (obj.edgeAvail < obj.moveLength) {
			doMoveEdge(obj.edge, obj.moveBuffer[obj.edgeAvail++]);
		}
		return obj.edge;
	}

	function getMoveString(obj) {
		var finishSym, fixedMoves, i, i_1, idx, move, rot, ret, sym, axis, pows;
		fixedMoves = new Array(obj.moveLength - (obj.add1 ? 2 : 0));
		idx = 0;
		for (i = 0; i < obj.length1; ++i) {
			fixedMoves[idx++] = obj.moveBuffer[i];
		}
		sym = obj.sym;
		for (i = obj.length1 + (obj.add1 ? 2 : 0); i < obj.moveLength; ++i) {
			if (SymMove[sym][obj.moveBuffer[i]] >= 27) {
				fixedMoves[idx++] = SymMove[sym][obj.moveBuffer[i]] - 9;
				rot = move2rot[SymMove[sym][obj.moveBuffer[i]] - 27];
				sym = SymMult[sym][rot];
			} else {
				fixedMoves[idx++] = SymMove[sym][obj.moveBuffer[i]];
			}
		}
		finishSym = SymMult[SymInv[sym]][getSolvedSym(getCenter(obj))];
		ret = [];
		sym = finishSym;
		for (i = idx - 1; i >= 0; --i) {
			move = fixedMoves[i];
			move = ~~(move / 3) * 3 + (2 - move % 3);
			if (SymMove[sym][move] >= 27) {
				ret.push(SymMove[sym][move] - 9);
				rot = move2rot[SymMove[sym][move] - 27];
				sym = SymMult[sym][rot];
			} else {
				ret.push(SymMove[sym][move]);
			}
		}
		axis = -1;
		idx = 0;
		pows = [0, 0, 0];
		for (i = 0; i < ret.length; ++i) {
			move = ret[i];
			if (axis != ~~(move / 3) % 3) {
				for (i_1 = 0; i_1 < 3; i_1++) {
					if (pows[i_1] % 4) {
						ret[idx++] = move2str_1[i_1 * 9 + axis * 3 + pows[i_1] - 1] + ' ';
						pows[i_1] = 0;
					}
				}
				axis = ~~(move / 3) % 3;
			}
			pows[~~(move / 9)] += move % 3 + 1;
		}
		for (i_1 = 0; i_1 < 3; i_1++) {
			if (pows[i_1] % 4) {
				ret[idx++] = move2str_1[i_1 * 9 + axis * 3 + pows[i_1] - 1] + ' ';
				pows[i_1] = 0;
			}
		}
		ret = ret.slice(0, idx).join('');
		return ret;
	}

	function $move_6(obj, m_0) {
		obj.moveBuffer[obj.moveLength++] = m_0;
	}

	function FullCube_3() {
		$$init_3(this);
		this.edge = new EdgeCube();
		this.center = new CenterCube();
		this.corner = new CornerCube_0;
	}

	function FullCube_4(c) {
		FullCube_3.call(this);
		$copy_4(this, c);
	}

	defineClass(FullCube_3, FullCube_4);
	_.add1 = false;
	_.center = null;
	_.centerAvail = 0;
	_.corner = null;
	_.cornerAvail = 0;
	_.edge = null;
	_.edgeAvail = 0;
	_.length1 = 0;
	_.length2 = 0;
	_.length3 = 0;
	_.moveLength = 0;
	_.sym = 0;
	_.value = 0;
	var move2rot;

	function $compare_0(c1, c2) {
		return c2.value - c1.value;
	}

	function $clinit_Moves() {
		$clinit_Moves = nullMethod;
		var i, j;
		move2str_1 = ['U  ', 'U2 ', "U' ", 'R  ', 'R2 ', "R' ", 'F  ', 'F2 ', "F' ", 'D  ', 'D2 ', "D' ", 'L  ', 'L2 ', "L' ", 'B  ', 'B2 ', "B' ", 'Uw ', 'Uw2', "Uw'", 'Rw ', 'Rw2', "Rw'", 'Fw ', 'Fw2', "Fw'", 'Dw ', 'Dw2', "Dw'", 'Lw ', 'Lw2', "Lw'", 'Bw ', 'Bw2', "Bw'"];
		move2std = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25, 28, 30, 31, 32, 34, 36];
		move3std = [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 22, 25, 28, 31, 34, 36];
		std2move = createArray(37);
		std3move = createArray(37);
		ckmv = createArray(37, 36);
		ckmv2_0 = createArray(29, 28);
		ckmv3 = createArray(21, 20);
		skipAxis = createArray(36);
		skipAxis2 = createArray(28);
		skipAxis3 = createArray(20);
		epMoveMap = createArray(36, 24);
		for (i = 0; i < 29; ++i) {
			std2move[move2std[i]] = i;
		}
		for (i = 0; i < 21; ++i) {
			std3move[move3std[i]] = i;
		}
		for (i = 0; i < 36; ++i) {
			for (j = 0; j < 36; ++j) {
				ckmv[i][j] = ~~(i / 3) == ~~(j / 3) || ~~(i / 3) % 3 == ~~(j / 3) % 3 && i > j;
			}
			ckmv[36][i] = false;
		}
		for (i = 0; i < 29; ++i) {
			for (j = 0; j < 28; ++j) {
				ckmv2_0[i][j] = ckmv[move2std[i]][move2std[j]];
			}
		}
		for (i = 0; i < 21; ++i) {
			for (j = 0; j < 20; ++j) {
				ckmv3[i][j] = ckmv[move3std[i]][move3std[j]];
			}
		}
		for (i = 0; i < 36; ++i) {
			skipAxis[i] = 36;
			for (j = i; j < 36; ++j) {
				if (!ckmv[i][j]) {
					skipAxis[i] = j - 1;
					break;
				}
			}
		}
		for (i = 0; i < 28; ++i) {
			skipAxis2[i] = 28;
			for (j = i; j < 28; ++j) {
				if (!ckmv2_0[i][j]) {
					skipAxis2[i] = j - 1;
					break;
				}
			}
		}
		for (i = 0; i < 20; ++i) {
			skipAxis3[i] = 20;
			for (j = i; j < 20; ++j) {
				if (!ckmv3[i][j]) {
					skipAxis3[i] = j - 1;
					break;
				}
			}
		}
		for (i = 0; i < 36; ++i) {
			var edge = new EdgeCube();
			doMoveEdge(edge, i);
			for (j = 0; j < 24; j++) {
				epMoveMap[i][edge.ep[j]] = j;
			}
		}
	}

	var ckmv, ckmv2_0, ckmv3, move2std, move2str_1, move3std, skipAxis, skipAxis2, skipAxis3, std2move, std3move, epMoveMap;

	function $doSearch(obj) {
		var MAX_LENGTH2, MAX_LENGTH3, ct, edge, eparity, fb, fbprun, index, length12, length123, p1SolsArr, prun, rl, rlprun, s2ct, s2rl, solcube, ud, udprun;
		obj.solution = '';
		var tt = $.now();
		ud = $getsym(new Center1().fromCube(getCenter(obj.c), 0));
		fb = $getsym(new Center1().fromCube(getCenter(obj.c), 1));
		rl = $getsym(new Center1().fromCube(getCenter(obj.c), 2));
		udprun = Center1SymPrun[ud >> 6];
		fbprun = Center1SymPrun[fb >> 6];
		rlprun = Center1SymPrun[rl >> 6];
		obj.p1SolsCnt = 0;
		obj.arr2idx = 0;
		$clear(obj.p1sols);
		for (obj.length1 = Math.min(udprun, fbprun, rlprun); obj.length1 < MAX_SEARCH_DEPTH; ++obj.length1) {
			if (rlprun <= obj.length1 && phase1Search(obj, rl >>> 6, rl & 63, obj.length1, -1, 0)
					|| udprun <= obj.length1 && phase1Search(obj, ud >>> 6, ud & 63, obj.length1, -1, 0)
					|| fbprun <= obj.length1 && phase1Search(obj, fb >>> 6, fb & 63, obj.length1, -1, 0)) {
				break;
			}
		}
		p1SolsArr = obj.p1sols.array.slice();
		var tt1 = $.now() - tt;
		DEBUG && console.log('[scramble 444] Phase 1 Done in', $.now() - tt);
		p1SolsArr.sort(function(a, b) {
			return a.value - b.value
		});
		MAX_LENGTH2 = 9;
		do {
			OUT: for (length12 = p1SolsArr[0].value; length12 < MAX_SEARCH_DEPTH; ++length12) {
					for (var i = 0; i < p1SolsArr.length; ++i) {
						var cc = p1SolsArr[i];
						if (cc.value > length12) {
							break;
						}
						if (length12 - cc.length1 > MAX_LENGTH2) {
							continue;
						}
						$copy_4(obj.c1, cc);
						var ep = $getEdge(obj.c1).ep;
						$set_2(obj.ct2, getCenter(obj.c1), parity_0(ep));
						s2ct = $getct(obj.ct2);
						s2rl = $getrl(obj.ct2);
						obj.length1 = cc.length1;
						obj.length2 = length12 - cc.length1;
						obj.epInv = [];
						for (var e = 0; e < 24; e++) {
							obj.epInv[ep[e]] = e;
						}
						if (phase2Search(obj, s2ct, s2rl, obj.length2, 28, 0)) {
							break OUT;
						}
					}
				}
				++MAX_LENGTH2;
		} while (length12 == MAX_SEARCH_DEPTH);
		obj.arr2.sort(function(a, b) {
			return a.value - b.value
		});
		DEBUG && console.log('[scramble 444] Phase 2 Done in', $.now() - tt);
		var tt2 = $.now() - tt - tt1;
		index = 0;
		MAX_LENGTH3 = 13;
		do {
			OUT2: for (length123 = obj.arr2[0].value; length123 < MAX_SEARCH_DEPTH; ++length123) {
					for (var i = 0; i < Math.min(obj.arr2idx, PHASE2_SOLS); ++i) {
						if (obj.arr2[i].value > length123) {
							break;
						}
						obj.arr2[i].length3 = length123 - obj.arr2[i].length1 - obj.arr2[i].length2;
						if (obj.arr2[i].length3 > MAX_LENGTH3) {
							continue;
						}
						eparity = $set_6(obj.e12, $getEdge(obj.arr2[i]));
						$set_3(obj.ct3, getCenter(obj.arr2[i]), eparity ^ parity_0($getCorner(obj.arr2[i]).cp));
						ct = $getct_0(obj.ct3);
						edge = $get_2(obj.e12, 10);
						for (var j = 0; j < 12; j++) {
							obj.tempep[0][j] = obj.e12.edge[j];
						}
						prun = getprun($getsym_0(obj.e12));
						if (prun <= obj.arr2[i].length3
								&& phase3Search(obj, obj.tempep[0], ct, prun, obj.arr2[i].length3, 20, 0)) {
							index = i;
							break OUT2;
						}
					}
				}
				++MAX_LENGTH3;
		}
		while (length123 == MAX_SEARCH_DEPTH);
		DEBUG && console.log('[scramble 444] Phase 3 Done in', $.now() - tt);
		var tt3 = $.now() - tt - tt1 - tt2;

		solcube = new FullCube_4(obj.arr2[index]);
		obj.length1 = solcube.length1;
		obj.length2 = solcube.length2;
		obj.length3 = solcube.length3;
		for (var i = 0; i < obj.length3; ++i) {
			$move_6(solcube, move3std[obj.move3[i]]);
		}
		var f3 = to333Facelet(solcube);
		if (!f3) {
			console.log('[scramble 444] Reduction Error!', toFacelet(solcube));
		}
		for (var i = 0; i < 54; i++) {
			f3[i] = "URFDLB"[f3[i]];
		}
		f3 = f3.join('');
		var sol3 = scramble_333.solvFacelet(f3).split(' ');
		var length333 = 0;
		for (var m = 0; m < sol3.length; m++) {
			if (/^[URFDLB][2']?$/.exec(sol3[m])) {
				length333++;
				$move_6(solcube, "URFDLB".indexOf(sol3[m][0]) * 3 + "2'".indexOf(sol3[m][1]) + 1);
			}
		}
		obj.solution = getMoveString(solcube);
		DEBUG && console.log('[scramble 444] 3x3x3 Done in', $.now() - tt);
		DEBUG && console.log('[scramble 444] Phase depths: ', [obj.length1, obj.length2, obj.length3, length333, tt1, tt2, tt3]);
		return [obj.length1, obj.length2, obj.length3, length333, tt1, tt2, tt3];
	}

	function printState(state) {
		var tmp =
			"          U0U1U2U3\n" +
			"          U4U5U6U7\n" +
			"          U8U9UaUb\n" +
			"          UcUdUeUf\n" +
			"L0L1L2L3  F0F1F2F3  R0R1R2R3  B0B1B2B3\n" +
			"L4L5L6L7  F4F5F6F7  R4R5R6R7  B4B5B6B7\n" +
			"L8L9LaLb  F8F9FaFb  R8R9RaRb  B8B9BaBb\n" +
			"LcLdLeLf  FcFdFeFf  RcRdReRf  BcBdBeBf\n" +
			"          D0D1D2D3\n" +
			"          D4D5D6D7\n" +
			"          D8D9DaDb\n" +
			"          DcDdDeDf\n";
		tmp = tmp.replace(/[URFDLB][0-9a-f]/g, function(m) {
			var i1 = "URFDLB".indexOf(m[0]);
			var i2 = "0123456789abcdef".indexOf(m[1]);
			var posit = state[i1 * 16 + i2];
			return "URFDLB"[posit] + ' ';
		});
	}

	function $init2_0(obj, sym) {
		var ctp, i, next, s2ct, s2rl;
		$copy_4(obj.c1, obj.c);
		for (i = 0; i < obj.length1; ++i) {
			$move_6(obj.c1, obj.move1[i]);
		}
		switch (finish_0[sym]) {
			case 0:
				$move_6(obj.c1, 24);
				$move_6(obj.c1, 35);
				obj.move1[obj.length1] = 24;
				obj.move1[obj.length1 + 1] = 35;
				obj.add1 = true;
				sym = 19;
				break;
			case 12869:
				$move_6(obj.c1, 18);
				$move_6(obj.c1, 29);
				obj.move1[obj.length1] = 18;
				obj.move1[obj.length1 + 1] = 29;
				obj.add1 = true;
				sym = 34;
				break;
			case 735470:
				obj.add1 = false;
				sym = 0;
		}
		$set_2(obj.ct2, getCenter(obj.c1), parity_0($getEdge(obj.c1).ep));
		s2ct = $getct(obj.ct2);
		s2rl = $getrl(obj.ct2);
		ctp = ctprun[s2ct * 70 + s2rl];
		obj.c1.value = ctp + obj.length1;
		obj.c1.length1 = obj.length1;
		obj.c1.add1 = obj.add1;
		obj.c1.sym = sym;
		++obj.p1SolsCnt;
		if (obj.p1sols.size < PHASE2_ATTS) {
			next = new FullCube_4(obj.c1);
		} else {
			next = $poll(obj.p1sols);
			next.value > obj.c1.value && $copy_4(next, obj.c1);
		}
		$add(obj.p1sols, next);
		return obj.p1SolsCnt == PHASE1_SOLS;
	}

	function $init3(obj) {
		if (!checkPhase2Edge(obj.epInv, obj.move2, obj.length2)) {
			return false;
		}
		var ct, eparity, i, prun;
		$copy_4(obj.c2, obj.c1);
		for (i = 0; i < obj.length2; ++i) {
			$move_6(obj.c2, obj.move2[i]);
		}
		eparity = $set_6(obj.e12, $getEdge(obj.c2));
		$set_3(obj.ct3, getCenter(obj.c2), eparity ^ parity_0($getCorner(obj.c2).cp));
		ct = $getct_0(obj.ct3);
		$get_2(obj.e12, 10);
		prun = getprun($getsym_0(obj.e12));
		!obj.arr2[obj.arr2idx] ? (obj.arr2[obj.arr2idx] = new FullCube_4(obj.c2)) : $copy_4(obj.arr2[obj.arr2idx], obj.c2);
		obj.arr2[obj.arr2idx].value = obj.length1 + obj.length2 + Math.max(prun, prun_0[ct]);
		obj.arr2[obj.arr2idx].length2 = obj.length2;
		++obj.arr2idx;
		return obj.arr2idx == obj.arr2.length;
	}

	function phase1Search(obj, ct, sym, maxl, lm, depth) {
		var axis, ctx, m_0, power, prun, symx;
		if (ct == 0) {
			return maxl == 0 && $init2_0(obj, sym);
		}
		for (axis = 0; axis < 27; axis += 3) {
			if (axis == lm || axis == lm - 9 || axis == lm - 18) {
				continue;
			}
			for (power = 0; power < 3; ++power) {
				m_0 = axis + power;
				ctx = Center1SymMove[ct][SymMove[sym][m_0]];
				prun = Center1SymPrun[ctx >>> 6];
				if (prun >= maxl) {
					if (prun > maxl) {
						break;
					}
					continue;
				}
				symx = SymMult[sym][ctx & 63];
				ctx >>>= 6;
				obj.move1[depth] = m_0;
				if (phase1Search(obj, ctx, symx, maxl - 1, axis, depth + 1)) {
					return true;
				}
			}
		}
		return false;
	}

	function phase2Search(obj, ct, rl, maxl, lm, depth) {
		var ctx, m_0, prun, rlx;
		if (ct == 0 && ctprun[rl] == 0 && maxl < 5) {
			return maxl == 0 && $init3(obj);
		}
		for (m_0 = 0; m_0 < 23; ++m_0) {
			if (ckmv2_0[lm][m_0]) {
				m_0 = skipAxis2[m_0];
				continue;
			}
			ctx = ctmv[ct][m_0];
			rlx = rlmv[rl][m_0];
			prun = ctprun[ctx * 70 + rlx];
			if (prun >= maxl) {
				prun > maxl && (m_0 = skipAxis2[m_0]);
				continue;
			}
			obj.move2[depth] = move2std[m_0];
			if (phase2Search(obj, ctx, rlx, maxl - 1, m_0, depth + 1)) {
				return true;
			}
		}
		return false;
	}

	function phase3Search(obj, eplast, ct, prun, maxl, lm, depth) {
		if (maxl == 0) {
			return true;
		}
		var ep = obj.tempep[depth];
		if (lm != 20) {
			var movo = mvroto[lm << 3];
			var mov = mvrot[lm << 3];
			for (var i = 0; i < 12; i++) {
				ep[i] = movo[eplast[mov[i]]];
			}
		}
		for (var m = 0; m < 17; m++) {
			if (ckmv3[lm][m]) {
				m = skipAxis3[m];
				continue;
			}
			var ctx = ctmove[ct][m];
			var prun1 = prun_0[ctx];
			if (prun1 >= maxl) {
				prun1 > maxl && m < 14 && (m = skipAxis3[m]);
				continue;
			}
			var prunx = getprun_0(getMvSym(ep, m) >> 3, prun);
			if (prunx >= maxl) {
				prunx > maxl && m < 14 && (m = skipAxis3[m]);
				continue;
			}
			if (phase3Search(obj, ep, ctx, prunx, maxl - 1, m, depth + 1)) {
				obj.move3[depth] = m;
				return true;
			}
		}
		return false;
	}

	function Search_4() {
		var i;
		this.p1sols = new PriorityQueue_0();
		this.move1 = createArray(15);
		this.move2 = createArray(20);
		this.move3 = createArray(20);
		this.c1 = new FullCube_3;
		this.c2 = new FullCube_3;
		this.ct2 = new Center2;
		this.ct3 = new Center3;
		this.e12 = new Edge3_0;
		this.tempep = createArray(20);
		this.arr2 = createArray(PHASE2_SOLS);
		for (i = 0; i < 20; ++i) {
			this.tempep[i] = [];
		}
		this.add1 = false;
		this.arr2idx = 0;
		this.c = null;
		this.length1 = 0;
		this.length2 = 0;
		this.p1SolsCnt = 0;
		this.solution = '';
	}

	function parity_0(arr) {
		var parity = 0;
		var mask = 0;
		for (var i = 0; i < arr.length; i++) {
			var val = arr[i];
			parity ^= val - mathlib.bitCount(mask & ((1 << val) - 1));
			mask |= 1 << val;
		}
		return parity & 1;
	}

	function swap(arr, a, b, c, d, key) {
		var temp;
		switch (key) {
			case 0:
				temp = arr[d];
				arr[d] = arr[c];
				arr[c] = arr[b];
				arr[b] = arr[a];
				arr[a] = temp;
				return;
			case 1:
				temp = arr[a];
				arr[a] = arr[c];
				arr[c] = temp;
				temp = arr[b];
				arr[b] = arr[d];
				arr[d] = temp;
				return;
			case 2:
				temp = arr[a];
				arr[a] = arr[b];
				arr[b] = arr[c];
				arr[c] = arr[d];
				arr[d] = temp;
				return;
		}
	}

	function $add(obj, o) {
		if ($offer(obj, o)) {
			return true;
		}
	}

	function $add_0(obj, o) {
		obj.array[obj.size++] = o;
		return true;
	}

	function $clear(obj) {
		obj.array = [];
		obj.size = 0;
	}

	function $get_4(obj, index) {
		return obj.array[index];
	}

	function $remove_0(obj, index) {
		var previous;
		previous = obj.array[index];
		obj.array.splice(index, 1);
		--obj.size;
		return previous;
	}

	function $set_7(obj, index, o) {
		var previous;
		previous = obj.array[index];
		obj.array[index] = o;
		return previous;
	}

	function PriorityQueue_0() {
		this.array = [];
		this.array.length = PHASE2_ATTS;
		this.size = 0;
	}

	function binarySearch_0(sortedArray, key) {
		var high, low, mid, midVal;
		low = 0;
		high = sortedArray.length - 1;
		while (low <= high) {
			mid = low + ((high - low) >> 1);
			midVal = sortedArray[mid];
			if (midVal < key) {
				low = mid + 1;
			} else if (midVal > key) {
				high = mid - 1;
			} else {
				return mid;
			}
		}
		return -low - 1;
	}

	function fill_0(a) {
		for (var i = 0; i < a.length; i++) {
			a[i] = -1;
		}
	}

	function $mergeHeaps(obj, node) {
		var heapSize, smallestChild, value, leftChild, rightChild, smallestChild_0;
		heapSize = obj.size;
		value = $get_4(obj, node);
		while (node * 2 + 1 < heapSize) {
			smallestChild = (leftChild = 2 * node + 1, rightChild = leftChild + 1, smallestChild_0 = leftChild, rightChild < heapSize && $compare_0($get_4(obj, rightChild), $get_4(obj, leftChild)) < 0 && (smallestChild_0 = rightChild), smallestChild_0);
			if ($compare_0(value, $get_4(obj, smallestChild)) < 0) {
				break;
			}
			$set_7(obj, node, $get_4(obj, smallestChild));
			node = smallestChild;
		}
		$set_7(obj, node, value);
	}

	function $offer(obj, e) {
		var childNode, node;
		node = obj.size;
		$add_0(obj, e);
		while (node > 0) {
			childNode = node;
			node = (node - 1) >> 1;
			if ($compare_0($get_4(obj, node), e) <= 0) {
				$set_7(obj, childNode, e);
				return true;
			}
			$set_7(obj, childNode, $get_4(obj, node));
		}
		$set_7(obj, node, e);
		return true;
	}

	function $poll(obj) {
		var value;
		if (obj.size == 0) {
			return null;
		}
		value = $get_4(obj, 0);
		$removeAtIndex(obj);
		return value;
	}

	function $removeAtIndex(obj) {
		var lastValue;
		lastValue = $remove_0(obj, obj.size - 1);
		if (0 < obj.size) {
			$set_7(obj, 0, lastValue);
			$mergeHeaps(obj, 0);
		}
	}

	var searcher;

	function init() {
		init = nullMethod;
		var tt = $.now();
		DEBUG && console.log('[scramble 444] start initialization');
		$clinit_Moves();
		$clinit_Center1();
		$clinit_Center2();
		$clinit_Center3();
		$clinit_Edge3();
		$clinit_CornerCube();
		$clinit_FullCube_0();
		DEBUG && console.log('[scramble 444] alloc tables', $.now() - tt);
		initSymMeta();
		DEBUG && console.log('[scramble 444] initSymMeta', $.now() - tt);
		Center1Raw2Sym = createArray(735471);
		initCenter1Sym2Raw();
		DEBUG && console.log('[scramble 444] initCenter1Sym2Raw', $.now() - tt);
		initCenter1MoveTable();
		DEBUG && console.log('[scramble 444] initCenter1MoveTable', $.now() - tt);
		Center1Raw2Sym = null;
		initCenter1Prun();
		DEBUG && console.log('[scramble 444] initCenter1Prun', $.now() - tt);

		initCenter2();
		DEBUG && console.log('[scramble 444] initCenter2', $.now() - tt);
		initCenter3();
		DEBUG && console.log('[scramble 444] initCenter3', $.now() - tt);
		initEdge3MvRot();
		DEBUG && console.log('[scramble 444] initEdge3MvRot', $.now() - tt);
		initEdge3Sym2Raw();
		DEBUG && console.log('[scramble 444] initEdge3Sym2Raw', $.now() - tt);
		initEdge3Prun();
		DEBUG && console.log('[scramble 444] initEdge3Prun', $.now() - tt);
		searcher = new Search_4();
	}

	function partialSolvedState(ctMask, edMask, cnMask, neut) {
		var facelet;
		var colmap = [0, 1, 2, 3, 4, 5];
		if (neut) {
			var ori = mathlib.rn([1, 4, 8, 1, 1, 1, 24][neut]);
			if (ori >= 8) {
				mathlib.acycle(colmap, [0, 1, 2], ori >> 3);
				mathlib.acycle(colmap, [3, 4, 5], ori >> 3);
				ori &= 0x7;
			}
			if (ori >= 4) {
				mathlib.acycle(colmap, [0, 1, 3, 4], 2);
				ori &= 0x3;
			}
			if (ori >= 1) {
				mathlib.acycle(colmap, [1, 2, 4, 5], ori);
			}
		}
		var solved = true;
		for (var _ = 0; solved && _ < 100; _++) {
			var cc = new FullCube_3;
			var ctSwaps = [];
			var edSwaps = [];
			var cnSwaps = [];
			for (var i = 0; i < 24; i++) {
				if (ctMask >> i & 1) {
					ctSwaps.push(i);
				}
				if (edMask >> i & 1) {
					edSwaps.push(i);
				}
				if (cnMask >> i & 1) {
					cnSwaps.push(i);
				}
			}
			var ctPerm = mathlib.rndPerm(ctSwaps.length);
			for (var i = 0; i < ctSwaps.length; i++) {
				cc.center.ct[ctSwaps[i]] = centerFacelet[ctSwaps[ctPerm[i]]] >> 4;
			}
			var edPerm = mathlib.rndPerm(edSwaps.length);
			for (var i = 0; i < edSwaps.length; i++) {
				cc.edge.ep[edSwaps[i]] = edSwaps[edPerm[i]];
			}
			var cnPerm = mathlib.rndPerm(cnSwaps.length);
			var coSum = 24;
			for (var i = 0; i < cnSwaps.length; i++) {
				var co = mathlib.rn(3);
				cc.corner.co[cnSwaps[i]] = co;
				cc.corner.cp[cnSwaps[i]] = cnSwaps[cnPerm[i]];
				coSum -= co;
			}
			if (coSum % 3 != 0) {
				cc.corner.co[cnSwaps[0]] = (cc.corner.co[cnSwaps[0]] + coSum) % 3;
			}
			facelet = toFacelet(cc);
			for (var i = 0; i < 96; i++) {
				facelet[i] = "URFDLB".charAt(colmap[facelet[i]]);
				if (facelet[i] != facelet[i >> 4 << 4]) {
					solved = false;
				}
			}
		}
		return facelet.join("");
	}

	function genFacelet(facelet) {
		init();
		facelet = facelet.split('');
		for (var i = 0; i < 96; i++) {
			facelet[i] = "URFDLB".indexOf(facelet[i]);
		}
		DEBUG && console.log('[scramble 444] Scramble to state:');
		DEBUG && printState(facelet);
		searcher.c = new FullCube_3;
		var chk = $fromFacelet(searcher.c, facelet);
		if (chk != 0) {
			console.log('[scramble 444] State Check Error!', chk, facelet);
		}
		$doSearch(searcher);
		return searcher.solution.replace(/\s+/g, ' ');
	}

	function testbench(nsolv) {
		init();
		nsolv = nsolv || 100;
		var avgs = [];
		for (var i = 0; i < nsolv; i++) {
			var facelet = partialSolvedState(0xffffff, 0xffffff, 0xff).split('');
			for (var j = 0; j < 96; j++) {
				facelet[j] = "URFDLB".indexOf(facelet[j]);
			}
			searcher.c = new FullCube_3;
			var chk = $fromFacelet(searcher.c, facelet);
			if (chk != 0) {
				console.log('[scramble 444] State Check Error!', chk, facelet);
			}
			var tt = $.now();
			var data = $doSearch(searcher);
			for (var j = 0; j < data.length; j++) {
				avgs[j] = (avgs[j] || 0) + data[j];
			}
			console.log(avgs.map((x) => ~~(100 * x / (i + 1)) / 100));
		}
	}

	function getPartialScramble(ctMask, edMask, cnMask, neut) {
		return genFacelet(partialSolvedState(ctMask, edMask, cnMask, neut));
	}

	function getRandomScramble() {
		return genFacelet(partialSolvedState(0xffffff, 0xffffff, 0xff));
	}

	function getYauUD3CScramble(type, length, cases, neut) {
		var unsolv = mathlib.rn(4);
		return getPartialScramble(0xffff00, 0xff0ff0 | (0x1001 << unsolv), 0xff, neut);
	}

	function getHoyaRLDAScramble(type, length, cases, neut) {
		var unsolv = mathlib.rn(2) * 4;
		return getPartialScramble(0x0000f0 | (0xf00 << unsolv), 0xffffff, 0xff, neut);
	}

	function getHoyaRLCAScramble(type, length, cases, neut) {
		var unsolv = mathlib.rn(2) * 4;
		return getPartialScramble(0x0000f0 | (0xf00 << unsolv), 0xff0ff0, 0xff, neut);
	}

	function getEdgeScramble() {
		return getPartialScramble(0x000000, 0xffffff, 0xff);
	}

	function getEdgeOnlyScramble() {
		return getPartialScramble(0x000000, 0xffffff, 0x00);
	}

	function getCenterOnlyScramble() {
		return getPartialScramble(0xffffff, 0x000000, 0x00);
	}

	function getLastLayerScramble(type, length, cases, neut) {
		return getPartialScramble(0x000000, 0x0f00f0, 0xf0, neut);
	}

	function getCenterUDSolvedScramble(type, length, cases, neut) {
		return getPartialScramble(0xffff00, 0xffffff, 0xff, neut);
	}

	function getCenterRLSolvedScramble(type, length, cases, neut) {
		return getPartialScramble(0x00ffff, 0xffffff, 0xff, neut);
	}

	// targetFace: which face the U-color (face 0) should end up on
	//   0=U, 1=R, 2=F, 3=D, 4=L, 5=B
	function appendRotationFix(scramble, targetFace) {
		var testCube = new FullCube_3;
		var moves = scramble.trim().split(/\s+/);
		for (var mi = 0; mi < moves.length; mi++) {
			var mv = moves[mi];
			while (mv.length < 3) mv += ' ';
			var mvIdx = move2str_1.indexOf(mv);
			if (mvIdx >= 0) {
				$move_6(testCube, mvIdx);
			}
		}
		var f = toFacelet(testCube);
		var faceCenters = [5, 21, 37, 53, 69, 85]; // U,R,F,D,L,B
		var uColorAt = -1;
		for (var fi = 0; fi < 6; fi++) {
			if (f[faceCenters[fi]] == 0) {
				uColorAt = fi;
				break;
			}
		}
		// Rotations to bring U-color from position uColorAt to face targetFace.
		// rotTable[from][to] gives the rotation string needed.
		var rotTable = [
			// to:  U      R      F      D      L      B
			/*U*/ ['',    "z",  "x'",   'z2',  "z'",   "x" ],
			/*R*/ ["z'",   '',    "y",  "z",  'z2',  "y'"  ],
			/*F*/ ["x",  "y'",   '',    "x'",   "y",  'x2' ],
			/*D*/ ['z2',  "z'",   "x",  '',    "z",  "x'"  ],
			/*L*/ ["z",  'z2',  "y'",   "z'",   '',    "y" ],
			/*B*/ ["x'",   "y",  'x2',  "x",  "y'",   ''   ]
		];
		targetFace = targetFace || 0;
		var rot = rotTable[uColorAt][targetFace];
		if (rot) {
			scramble = scramble + ' ' + rot;
		}
		return scramble.replace(/\s+/g, ' ').trim();
	}

	function getLast8DedgeScramble(type, length, cases, neut) {
		// D-cross edges (4-7, 16-19) solved, U + equator edges scrambled, all corners scrambled
		var scramble = getPartialScramble(0x000000, 0xf0ff0f, 0xff, neut);
		return appendRotationFix(scramble, 0);
	}

	function getELLScramble(type, length, cases, neut) {
		return getPartialScramble(0x000000, 0x0f00f0, 0x00, neut);
	}

	function applyColorNeutrality(neut) {
		var colmap = [0, 1, 2, 3, 4, 5];
		if (neut) {
			var ori = mathlib.rn([1, 4, 8, 1, 1, 1, 24][neut]);
			if (ori >= 8) {
				mathlib.acycle(colmap, [0, 1, 2], ori >> 3);
				mathlib.acycle(colmap, [3, 4, 5], ori >> 3);
				ori &= 0x7;
			}
			if (ori >= 4) {
				mathlib.acycle(colmap, [0, 1, 3, 4], 2);
				ori &= 0x3;
			}
			if (ori >= 1) {
				mathlib.acycle(colmap, [1, 2, 4, 5], ori);
			}
		}
		return colmap;
	}


	var llU = [3, 0, 1, 2];
	var llUPow = [[0,1,2,3], llU];
	llUPow[2] = llUPow[1].map(function(_, i) { return llU[llUPow[1][i]]; });
	llUPow[3] = llUPow[2].map(function(_, i) { return llU[llUPow[2][i]]; });

	function llConjugate(perm, k) {
		if (k == 0) return perm.slice();
		var uk = llUPow[k];
		var uinv = llUPow[(4 - k) % 4];
		return perm.map(function(_, i) { return uk[perm[uinv[i]]]; });
	}

	function permuteByU(arr, k) {
		if (k == 0) return arr.slice();
		var u = llUPow[k];
		var result = [];
		for (var i = 0; i < 4; i++) {
			result[u[i]] = arr[i];
		}
		return result;
	}

	function fillRandomPerm(arr, n) {
		var free = [], used = {};
		for (var i = 0; i < n; i++) {
			if (arr[i] != -1) used[arr[i]] = true;
		}
		for (var i = 0; i < n; i++) {
			if (!used[i]) free.push(i);
		}
		for (var i = free.length - 1; i > 0; i--) {
			var j = mathlib.rn(i + 1);
			var tmp = free[i]; free[i] = free[j]; free[j] = tmp;
		}
		for (var i = 0, fi = 0; i < n; i++) {
			if (arr[i] == -1) arr[i] = free[fi++];
		}
	}

	function fillRandomOri(arr, n, base) {
		var sum = 0;
		var last = -1;
		for (var i = 0; i < n; i++) {
			if (arr[i] == -1) {
				last = i;
			} else {
				sum += arr[i];
			}
		}
		for (var i = 0; i < n; i++) {
			if (arr[i] == -1 && i != last) {
				arr[i] = mathlib.rn(base);
				sum += arr[i];
			}
		}
		if (last != -1) {
			arr[last] = (base - sum % base) % base;
		}
	}

	// 4x4 last-layer scramble generator.
	// Treats the cube as reduced with D layer solved.
	// Parameters:
	//   _ep: U-layer dedge permutation [4], -1 = random
	//   _eo: U-layer dedge flip [4] (0 = paired, 1 = wings swapped), -1 = random
	//   _cp: U-layer corner permutation [4], -1 = random
	//   _co: U-layer corner orientation [4] (0/1/2), -1 = random (sum constrained to 0 mod 3)
	//   neut: color neutrality level
	//   _rndpre: array of U-power values [0,1,2,3] for pre-AUF (random element chosen)
	//   _rndapp: array of U-power values [0,1,2,3] for post-AUF (random element chosen)
	//   rotFix: target face for rotation fix (0=U, 3=D, etc.), or false/undefined to skip
	function get444LLScramble(_ep, _eo, _cp, _co, neut, _rndpre, _rndapp, rotFix) {
		var ep = _ep.slice();
		var eo = _eo.slice();
		var cp = _cp.slice();
		var co = _co.slice();

		fillRandomPerm(ep, 4);
		fillRandomPerm(cp, 4);
		for (var i = 0; i < 4; i++) {
			if (eo[i] == -1) eo[i] = mathlib.rn(2);
		}
		fillRandomOri(co, 4, 3);

		// Apply pre-AUF by conjugating arrays
		if (_rndpre && _rndpre.length > 0) {
			var k = _rndpre[mathlib.rn(_rndpre.length)];
			if (k > 0) {
				ep = llConjugate(ep, k);
				cp = llConjugate(cp, k);
				eo = permuteByU(eo, k);
				co = permuteByU(co, k);
			}
		}

		// Apply post-AUF by permuting slot contents
		if (_rndapp && _rndapp.length > 0) {
			var k = _rndapp[mathlib.rn(_rndapp.length)];
			if (k > 0) {
				var u = llUPow[k];
				var newEp = [], newEo = [], newCp = [], newCo = [];
				for (var i = 0; i < 4; i++) {
					newEp[u[i]] = ep[i];
					newEo[u[i]] = eo[i];
					newCp[u[i]] = cp[i];
					newCo[u[i]] = co[i];
				}
				ep = newEp; eo = newEo; cp = newCp; co = newCo;
			}
		}

		// Build FullCube_3
		var cc = new FullCube_3;
		for (var i = 0; i < 4; i++) {
			cc.corner.cp[i] = cp[i];
			cc.corner.co[i] = co[i];
		}
		for (var i = 0; i < 4; i++) {
			var src = ep[i];
			if (eo[i]) {
				cc.edge.ep[i] = src + 12;
				cc.edge.ep[i + 12] = src;
			} else {
				cc.edge.ep[i] = src;
				cc.edge.ep[i + 12] = src + 12;
			}
		}

		// Solve
		var colmap = applyColorNeutrality(neut);
		var facelet = toFacelet(cc);
		for (var i = 0; i < 96; i++) {
			facelet[i] = "URFDLB".charAt(colmap[facelet[i]]);
		}
		var scramble = genFacelet(facelet.join("")).replace(/^\s+/, '');

		if (rotFix !== undefined && rotFix !== false) {
			scramble = appendRotationFix(scramble, rotFix);
		}

		return scramble;
	}

	var ppll_map = [
		// EPLL: corners solved, edges permuted with parity
		[[2,1,0,3], [0,1,2,3], 2, 'EPLL-Opp'],
		[[0,1,3,2], [0,1,2,3], 4, 'EPLL-Adj'],
		[[3,0,1,2], [0,1,2,3], 1, 'EPLL-O-'],
		[[1,2,3,0], [0,1,2,3], 1, 'EPLL-O+'],
		[[2,3,1,0], [0,1,2,3], 4, 'EPLL-W'],
		// CPLL: edges solved, corners permuted with parity
		[[0,1,2,3], [2,1,0,3], 2, 'CPLL-pN'],
		[[0,1,2,3], [3,1,2,0], 4, 'CPLL-pJ'],
		[[2,3,0,1], [3,1,2,0], 4, 'CPLL-M'],
		// Diag: diagonal corner swap with parity
		[[1,2,0,3], [2,1,0,3], 4, 'Diag-Sa'],
		[[3,1,0,2], [0,3,2,1], 4, 'Diag-Sb'],
		[[0,3,2,1], [3,2,1,0], 1, 'Diag-Q'],
		[[2,1,0,3], [3,2,1,0], 1, 'Diag-X'],
		// Adj: adjacent corner swap with parity
		[[1,0,3,2], [0,2,1,3], 4, 'Adj-Ka'],
		[[3,2,1,0], [0,2,1,3], 4, 'Adj-Kb'],
		[[3,1,0,2], [3,1,2,0], 4, 'Adj-Pa'],
		[[2,1,3,0], [3,1,2,0], 4, 'Adj-Pb'],
		[[0,1,3,2], [0,2,3,1], 4, 'Adj-Ba'],
		[[0,2,1,3], [3,1,0,2], 4, 'Adj-Bb'],
		[[0,3,1,2], [1,0,2,3], 4, 'Adj-Ca'],
		[[0,2,3,1], [1,0,2,3], 4, 'Adj-Cb'],
		[[2,0,1,3], [0,1,3,2], 4, 'Adj-Da'],
		[[2,1,3,0], [0,1,3,2], 4, 'Adj-Db'],
		// Standard PLL (no parity)
		[[2,3,0,1], [0,1,2,3], 1, 'PLL-H'],
		[[3,0,2,1], [0,1,2,3], 4, 'PLL-Ua'],
		[[1,3,2,0], [0,1,2,3], 4, 'PLL-Ub'],
		[[3,2,1,0], [0,1,2,3], 2, 'PLL-Z'],
		[[0,1,2,3], [1,2,0,3], 4, 'PLL-Aa'],
		[[0,1,2,3], [2,0,1,3], 4, 'PLL-Ab'],
		[[0,1,2,3], [1,0,3,2], 2, 'PLL-E'],
		[[0,3,2,1], [1,0,2,3], 4, 'PLL-F'],
		[[2,0,1,3], [1,2,0,3], 4, 'PLL-Ga'],
		[[1,2,0,3], [2,0,1,3], 4, 'PLL-Gb'],
		[[1,3,2,0], [2,0,1,3], 4, 'PLL-Gc'],
		[[3,0,2,1], [1,2,0,3], 4, 'PLL-Gd'],
		[[3,1,2,0], [1,0,2,3], 4, 'PLL-Ja'],
		[[1,0,2,3], [1,0,2,3], 4, 'PLL-Jb'],
		[[2,1,0,3], [2,1,0,3], 1, 'PLL-Na'],
		[[0,3,2,1], [2,1,0,3], 1, 'PLL-Nb'],
		[[0,1,3,2], [1,0,2,3], 4, 'PLL-Ra'],
		[[0,2,1,3], [1,0,2,3], 4, 'PLL-Rb'],
		[[2,1,0,3], [1,0,2,3], 4, 'PLL-T'],
		[[1,0,2,3], [2,1,0,3], 4, 'PLL-V'],
		[[3,1,2,0], [2,1,0,3], 4, 'PLL-Y']
	];


	var ppllprobs = mathlib.idxArray(ppll_map, 2);
	var ppllfilter = mathlib.idxArray(ppll_map, 3);

	function getPPLLScramble(type, length, cases, neut) {
		var c = ppll_map[scrMgr.fixCase(cases, ppllprobs)];
		return get444LLScramble(c[0], [0,0,0,0], c[1], [0,0,0,0], neut, [0,1,2,3], [0,1,2,3], 0);
	}
	
	// Sticker pattern + optional arrows for the LL plan-view image of each ppll_map case.
	// 12-char string = side stickers adjacent to U face, read as 4 strips of 3:
	//
	//         B[7] B[8] B[9]
	//   L[10]  .    .    .  R[4]
	//   L[11]  .   (U)   .  R[5]
	//   L[12]  .    .    .  R[6]
	//         F[1] F[2] F[3]
	//
	// Letters F/R/B/L = face color of that sticker (front/right/back/left).
	// Arrows [a, b] indicate piece movement from position a to b on the 3x3 grid:
	//   0 1 2
	//   3 4 5
	//   6 7 8
	// 22 parity cases + 21 standard PLLs = 43 total.
	var ppllImgParam = [
		// EPLL (5)
		['BFBRRRFBFLLL', [7, 1], [1, 7]],                         // Opp
		['LBLBLBRRRFFF', [7, 5], [5, 7]],                         // Adj
		['BRBRFRFLFLBL', [1, 3], [3, 7], [7, 5], [5, 1]],        // O-  (CCW)
		['BLBRBRFRFLFL', [1, 5], [5, 7], [7, 3], [3, 1]],        // O+  (CW)
		['BRBRLRFBFLFL'],             // W
		// CPLL (3)
		['LLRFBBRRLBFF', [0, 8], [8, 0]],             // pN  
		['RRFLFRFLLBBB', [2, 8], [8, 2]],             // pJ  
		['RLFLBRFRLBFB'],             // M   
		// Diag (4)
		['LRRFLBRBLBFF'],             // Sa
		['FFBRBLBRFLLR'],             // Sb  
		['RFLBRFLBRFLB'],             // Q
		['RBLBLFLFRFRB'],             // X
		// Adj (10)
		['RRLBBRFLFLFB'],             // Ka
		['RLLBFRFRFLBB'],             // Kb
		['BRRFFBRBFLLL'],             // Pa  
		['FBLBFFLLBRRR'],             // Pb  
		['BRRFLBRFFLBL'],             // Ba
		['RRFLBRFFLBLB'],             // Bb  
		['BLFLRBRFRFBL'],             // Ca  
		['FRBRBFLFLBLR'],             // Cb
		['BFBRRFLLRFBL'],             // Da
		['LRLBLRFBBRFF'],             // Db  
		// PLL (21)
		['BFBRLRFBFLRL', [1, 7], [3, 5]],             // H
		['BRBRLRFFFLBL', [3, 7], [7, 5], [5, 3]],     // Ua
		['BLBRBRFFFLRL', [3, 5], [5, 7], [7, 3]],     // Ub
		['LFLBRBRBRFLF', [1, 5], [3, 7]],             // Z
		['LBBRRLBFRFLF', [0, 2], [2, 6], [6, 0]],     // Aa
		['RBFLRRFFLBLB', [0, 6], [6, 8], [8, 0]],     // Ab
		['LBRFRBRFLBLF', [0, 6], [2, 8]],             // E
		['BFRFRBRBFLLL', [1, 7], [2, 8]],             // F
		['BRRFLBRBFLFL'],                             // Ga
		['BFRFBBRLFLRL'],                             // Gb
		['BFRFLBRRFLBL'],                             // Gc
		['BLRFFBRBFLRL'],                             // Gd
		['BBRFFBRRFLLL', [1, 5], [2, 8]],             // Ja
		['LBBRLLBRRFFF', [2, 8], [5, 7]],             // Jb
		['FBBRLLBFFLRR', [2, 6], [3, 5]],             // Na
		['BBFLLRFFBRRL', [0, 8], [3, 5]],             // Nb
		['LLBRBLBFRFRF', [1, 3], [2, 8]],             // Ra
		['RBFLFRFLLBRB', [2, 8], [3, 7]],             // Rb
		['BBRFLBRFFLRL', [2, 8], [3, 5]],             // T
		['BBFLFRFRBRLL', [0, 8], [1, 5]],             // V
		['BBFLRRFLBRFL', [0, 8], [1, 3]]              // Y
	];

	function getPPLLImage(cases, canvas) {
		var sideStickers3 = ppllImgParam[cases][0]; // 12-char 3x3 side stickers
		var arrows3 = ppllImgParam[cases].slice(1);
		if (arrows3.length == 2) {
			arrows3 = arrows3.concat([[arrows3[0][1], arrows3[0][0]], [arrows3[1][1], arrows3[1][0]]]);
		}

		// Expand to 4x4: U face = 16 'D's, side stickers = 16 chars
		var uFace = 'DDDDDDDDDDDDDDDD';
		// Each 3x3 side strip [corner, edge, corner] -> [corner, edge, edge, corner]
		var side4 = '';
		for (var s = 0; s < 4; s++) {
			var c1 = sideStickers3[s * 3];
			var e  = sideStickers3[s * 3 + 1];
			var c2 = sideStickers3[s * 3 + 2];
			side4 += c1 + e + e + c2;
		}

		// Map 3x3 arrow grid positions to 4x4 [x, y] coordinates
		// 3x3 grid:  0(0,0) 1(1,0) 2(2,0) / 3(0,1) 4(1,1) 5(2,1) / 6(0,2) 7(1,2) 8(2,2)
		// 4x4 grid corners: 0->0,0  2->3,0  6->0,3  8->3,3
		// 4x4 grid edges (midpoint of two wings): 1->1.5,0  3->0,1.5  5->3,1.5  7->1.5,3
		var arrowMap = [[0,0], [1.5,0], [3,0], [0,1.5], [1.5,1.5], [3,1.5], [0,3], [1.5,3], [3,3]];
		var arrows4 = [];
		for (var i = 0; i < arrows3.length; i++) {
			arrows4.push([arrowMap[arrows3[i][0]], arrowMap[arrows3[i][1]]]);
		}

		var llParam = [uFace + side4, arrows4];
		if (!canvas) {
			return llParam.concat([ppllfilter[cases]]);
		}
		image.llImage.drawImage(llParam[0], llParam[1], canvas);
	}



	// POLL case trainer map
	// [co, flipIdx, nOriEdge, aufCount, 'name']
	// co: corner orientation array [URF, UFL, ULB, UBR] (0=oriented, 1=CW twist, 2=CCW twist)
	// flipIdx: edge slot index (0=UF, 1=UL, 2=UB, 3=UR)
	//   for nOriEdge=3: flipIdx is the bad (flipped) edge
	//   for nOriEdge=1: flipIdx is the good (oriented) edge
	// nOriEdge: 3 = three edges oriented (1 bad), 1 = one edge oriented (3 bad)
	// aufCount: probability weight (4 for all cases)
	var poll_map = [
		// === 3 edges oriented ===
		// S
		[[2,0,2,2], 0, 3, 4, '3E-S-F'],
		[[2,0,2,2], 3, 3, 4, '3E-S-R'],
		[[2,0,2,2], 2, 3, 4, '3E-S-B'],
		[[2,0,2,2], 1, 3, 4, '3E-S-L'],
		// A
		[[0,1,1,1], 0, 3, 4, '3E-A-F'],
		[[0,1,1,1], 3, 3, 4, '3E-A-R'],
		[[0,1,1,1], 2, 3, 4, '3E-A-B'],
		[[0,1,1,1], 1, 3, 4, '3E-A-L'],
		// T
		[[0,0,1,2], 0, 3, 4, '3E-T-F'],
		[[0,0,1,2], 3, 3, 4, '3E-T-R'],
		[[0,0,1,2], 2, 3, 4, '3E-T-B'],
		[[0,0,1,2], 1, 3, 4, '3E-T-L'],
		// L
		[[0,1,0,2], 0, 3, 4, '3E-L-F'],
		[[0,1,0,2], 3, 3, 4, '3E-L-R'],
		[[0,1,0,2], 2, 3, 4, '3E-L-B'],
		[[0,1,0,2], 1, 3, 4, '3E-L-L'],
		// U
		[[0,0,2,1], 0, 3, 4, '3E-U-F'],
		[[0,0,2,1], 3, 3, 4, '3E-U-R'],
		[[0,0,2,1], 2, 3, 4, '3E-U-B'],
		[[0,0,2,1], 1, 3, 4, '3E-U-L'],
		// Pi
		[[2,2,1,1], 0, 3, 4, '3E-Pi-F'],
		[[2,2,1,1], 3, 3, 4, '3E-Pi-R'],
		[[2,2,1,1], 2, 3, 4, '3E-Pi-B'],
		[[2,2,1,1], 1, 3, 4, '3E-Pi-L'],
		// H (U2-symmetric)
		[[2,1,2,1], 0, 3, 4, '3E-H-F'],
		[[2,1,2,1], 3, 3, 4, '3E-H-R'],
		// O (U-symmetric)
		[[0,0,0,0], 0, 3, 4, '3E-O-F'],
		// === 1 edge oriented ===
		// S
		[[2,0,2,2], 0, 1, 4, '1E-S-F'],
		[[2,0,2,2], 3, 1, 4, '1E-S-R'],
		[[2,0,2,2], 2, 1, 4, '1E-S-B'],
		[[2,0,2,2], 1, 1, 4, '1E-S-L'],
		// A
		[[0,1,1,1], 0, 1, 4, '1E-A-F'],
		[[0,1,1,1], 3, 1, 4, '1E-A-R'],
		[[0,1,1,1], 2, 1, 4, '1E-A-B'],
		[[0,1,1,1], 1, 1, 4, '1E-A-L'],
		// T
		[[0,0,1,2], 0, 1, 4, '1E-T-F'],
		[[0,0,1,2], 3, 1, 4, '1E-T-R'],
		[[0,0,1,2], 2, 1, 4, '1E-T-B'],
		[[0,0,1,2], 1, 1, 4, '1E-T-L'],
		// L
		[[0,1,0,2], 0, 1, 4, '1E-L-F'],
		[[0,1,0,2], 3, 1, 4, '1E-L-R'],
		[[0,1,0,2], 2, 1, 4, '1E-L-B'],
		[[0,1,0,2], 1, 1, 4, '1E-L-L'],
		// U
		[[0,0,2,1], 0, 1, 4, '1E-U-F'],
		[[0,0,2,1], 3, 1, 4, '1E-U-R'],
		[[0,0,2,1], 2, 1, 4, '1E-U-B'],
		[[0,0,2,1], 1, 1, 4, '1E-U-L'],
		// Pi
		[[2,2,1,1], 0, 1, 4, '1E-Pi-F'],
		[[2,2,1,1], 3, 1, 4, '1E-Pi-R'],
		[[2,2,1,1], 2, 1, 4, '1E-Pi-B'],
		[[2,2,1,1], 1, 1, 4, '1E-Pi-L'],
		// H (U2-symmetric)
		[[2,1,2,1], 0, 1, 4, '1E-H-F'],
		[[2,1,2,1], 3, 1, 4, '1E-H-R'],
		// O (U-symmetric)
		[[0,0,0,0], 0, 1, 4, '1E-O-F']
	];

	var pollprobs = mathlib.idxArray(poll_map, 3);
	var pollfilter = mathlib.idxArray(poll_map, 4);

	function getPOLLScramble(type, length, cases, neut) {
		var c = poll_map[scrMgr.fixCase(cases, pollprobs)];
		var co = c[0];
		var flipIdx = c[1];
		var nOriEdge = c[2];
		var eo = [];
		for (var i = 0; i < 4; i++) {
			eo[i] = (nOriEdge == 3) ? (i == flipIdx ? 1 : 0) : (i == flipIdx ? 0 : 1);
		}
		return get444LLScramble([-1,-1,-1,-1], eo, [-1,-1,-1,-1], co, neut, [0,1,2,3], [0,1,2,3], 0);
	}

	// 4x4 Plan-view image layout (32-char string):
	// Side strip rendering order (due to rotation math):
	//   F strip (rot=0): x=0 left, x=3 right
	//   R strip (rot=1): x=0 bottom, x=3 top
	//   B strip (rot=2): x=0 right, x=3 left
	//   L strip (rot=3): x=0 top, x=3 bottom
	//
	//              B[27] B[26] B[25] B[24]
	//     L[28]    U[0]  U[1]  U[2]  U[3]   R[23]
	//     L[29]    U[4]  U[5]  U[6]  U[7]   R[22]
	//     L[30]    U[8]  U[9]  U[10] U[11]  R[21]
	//     L[31]    U[12] U[13] U[14] U[15]  R[20]
	//              F[16] F[17] F[18] F[19]
	//
	// Corner yellow sticker positions: [U-face, CW-side, CCW-side]
	//   URF(co[0]): [15, 20, 19]   R[20]=bottom-R, F[19]=right-F
	//   UFL(co[1]): [12, 16, 31]   F[16]=left-F,   L[31]=bottom-L
	//   ULB(co[2]): [0,  28, 27]   L[28]=top-L,    B[27]=left-B
	//   UBR(co[3]): [3,  24, 23]   B[24]=right-B,  R[23]=top-R
	//
	// Edge yellow sticker positions (2 wings each): [U-face pair, side pair]
	//   UF(slot 0): U=[13,14], side=[17,18]
	//   UL(slot 1): U=[4,8],   side=[30,29]
	//   UB(slot 2): U=[1,2],   side=[26,25]
	//   UR(slot 3): U=[7,11],  side=[21,22]

	function getPOLLImage(cases, canvas) {
		var pollCornerPos4 = [
			[15, 20, 19],  // URF: U-face=15, CW=R[20], CCW=F[19]
			[12, 16, 31],  // UFL: U-face=12, CW=F[16], CCW=L[31]
			[0, 28, 27],   // ULB: U-face=0,  CW=L[28], CCW=B[27]
			[3, 24, 23]    // UBR: U-face=3,  CW=B[24], CCW=R[23]
		];
		var pollEdgeUPos4 = [[13, 14], [4, 8], [1, 2], [7, 11]];
		var pollEdgeSidePos4 = [[17, 18], [30, 29], [26, 25], [21, 22]];

		var pollCase = poll_map[cases];
		var co = pollCase[0];
		var flipIdx = pollCase[1];
		var nOriEdge = pollCase[2];

		var face = [];
		for (var i = 0; i < 32; i++) {
			face[i] = 'G';
		}
		// 4 center stickers always yellow
		face[5] = 'D';
		face[6] = 'D';
		face[9] = 'D';
		face[10] = 'D';

		// Set corner stickers based on CO
		for (var c = 0; c < 4; c++) {
			face[pollCornerPos4[c][co[c]]] = 'D';
		}

		// Set edge stickers based on flip (both wings of each dedge)
		for (var e = 0; e < 4; e++) {
			var isFlipped;
			if (nOriEdge == 3) {
				isFlipped = (e == flipIdx);
			} else {
				isFlipped = (e != flipIdx);
			}
			var uPair = pollEdgeUPos4[e];
			var sPair = pollEdgeSidePos4[e];
			if (isFlipped) {
				face[sPair[0]] = 'D';
				face[sPair[1]] = 'D';
			} else {
				face[uPair[0]] = 'D';
				face[uPair[1]] = 'D';
			}
		}

		var llParam = [face.join(''), null];
		if (!canvas) {
			return llParam.concat([pollfilter[cases]]);
		}
		image.llImage.drawImage(llParam[0], llParam[1], canvas);
	}

	scrMgr.reg('444wca', getRandomScramble)
		('4edge', getEdgeScramble)
		('444edo', getEdgeOnlyScramble)
		('444cto', getCenterOnlyScramble)
		('444ll', getLastLayerScramble)
		('444ell', getELLScramble)
		('444ctud', getCenterUDSolvedScramble)
		('444ctrl', getCenterRLSolvedScramble)
		('444l8e', getLast8DedgeScramble)
		('444ud3c', getYauUD3CScramble)
		('444rlda', getHoyaRLDAScramble)
		('444rlca', getHoyaRLCAScramble)
		('444ppll', getPPLLScramble, [ppllfilter, ppllprobs, getPPLLImage])
		('444poll', getPOLLScramble, [pollfilter, pollprobs, getPOLLImage])
	;

	return {
		getRandomScramble: getRandomScramble,
		getPartialScramble: getPartialScramble,
		testbench: testbench
	}
})(mathlib.Cnk, mathlib.circle);

/* ==== scramble/scramble_sq1_new.js ==== */
"use strict";

var sq1 = (function(setNPerm, getNPerm, circle, rn) {

	function SqCubie() {
		this.ul = 0x011233; // 0 UB, 1 UBL, 2 UL, 3 UFL
		this.ur = 0x455677; // 4 UF, 5 UFR, 6 UR, 7 UBR
		this.dl = 0x998bba; // 9 DBR, 8 DR, b DFR, a DF
		this.dr = 0xddcffe; // d DFL, c DL, f DBL, e DB
		this.ml = 0;
	}

	var _ = SqCubie.prototype;

	_.toString = function() {
		return this.ul.toString(16).padStart(6, 0) +
			this.ur.toString(16).padStart(6, 0) +
			"|/".charAt(this.ml) +
			this.dl.toString(16).padStart(6, 0) +
			this.dr.toString(16).padStart(6, 0);
	}

	_.pieceAt = function(idx) {
		var ret;
		if (idx < 6) {
			ret = this.ul >> ((5 - idx) << 2);
		} else if (idx < 12) {
			ret = this.ur >> ((11 - idx) << 2);
		} else if (idx < 18) {
			ret = this.dl >> ((17 - idx) << 2);
		} else {
			ret = this.dr >> ((23 - idx) << 2);
		}
		return ret & 0xf;
	}

	_.setPiece = function(idx, value) {
		if (idx < 6) {
			this.ul &= ~(0xf << ((5 - idx) << 2));
			this.ul |= value << ((5 - idx) << 2);
		} else if (idx < 12) {
			this.ur &= ~(0xf << ((11 - idx) << 2));
			this.ur |= value << ((11 - idx) << 2);
		} else if (idx < 18) {
			this.dl &= ~(0xf << ((17 - idx) << 2));
			this.dl |= value << ((17 - idx) << 2);
		} else {
			this.dr &= ~(0xf << ((23 - idx) << 2));
			this.dr |= value << ((23 - idx) << 2);
		}
	}

	_.copy = function(c) {
		this.ul = c.ul;
		this.ur = c.ur;
		this.dl = c.dl;
		this.dr = c.dr;
		this.ml = c.ml;
	}

	_.doMove = function(move) {
		var temp;
		move <<= 2;
		if (move > 24) {
			move = 48 - move;
			temp = this.ul;
			this.ul = (this.ul >> move | this.ur << 24 - move) & 0xffffff;
			this.ur = (this.ur >> move | temp << 24 - move) & 0xffffff;
		} else if (move > 0) {
			temp = this.ul;
			this.ul = (this.ul << move | this.ur >> 24 - move) & 0xffffff;
			this.ur = (this.ur << move | temp >> 24 - move) & 0xffffff;
		} else if (move == 0) {
			temp = this.ur;
			this.ur = this.dl;
			this.dl = temp;
			this.ml = 1 - this.ml;
		} else if (move >= -24) {
			move = -move;
			temp = this.dl;
			this.dl = (this.dl << move | this.dr >> 24 - move) & 0xffffff;
			this.dr = (this.dr << move | temp >> 24 - move) & 0xffffff;
		} else if (move < -24) {
			move = 48 + move;
			temp = this.dl;
			this.dl = (this.dl >> move | this.dr << 24 - move) & 0xffffff;
			this.dr = (this.dr >> move | temp << 24 - move) & 0xffffff;
		}
	}

	function FullCube_getParity(obj) {
		var a, b, cnt, i, p, arr;
		cnt = 0;
		arr = [obj.pieceAt(0)];
		for (i = 1; i < 24; ++i) {
			if (obj.pieceAt(i) != arr[cnt]) {
				arr[++cnt] = obj.pieceAt(i);
			}
		}
		p = 0;
		for (a = 0; a < 16; ++a) {
			for (b = a + 1; b < 16; ++b) {
				arr[a] > arr[b] && (p ^= 1);
			}
		}
		return p;
	}

	function FullCube_getShapeIdx(obj) {
		var dlx, drx, ulx, urx;
		urx = obj.ur & 0x111111;
		urx |= urx >> 3;
		urx |= urx >> 6;
		urx = urx & 15 | urx >> 12 & 48;
		ulx = obj.ul & 0x111111;
		ulx |= ulx >> 3;
		ulx |= ulx >> 6;
		ulx = ulx & 15 | ulx >> 12 & 48;
		drx = obj.dr & 0x111111;
		drx |= drx >> 3;
		drx |= drx >> 6;
		drx = drx & 15 | drx >> 12 & 48;
		dlx = obj.dl & 0x111111;
		dlx |= dlx >> 3;
		dlx |= dlx >> 6;
		dlx = dlx & 15 | dlx >> 12 & 48;
		return Shape_getShape2Idx(FullCube_getParity(obj) << 24 | ulx << 18 | urx << 12 | dlx << 6 | drx);
	}

	function FullCube_getSquare(obj, sq) {
		var a, b;
		var prm = [];
		for (a = 0; a < 8; ++a) {
			prm[a] = obj.pieceAt(a * 3 + 1) >> 1;
		}
		sq.cornperm = getNPerm(prm, 8);
		sq.topEdgeFirst = obj.pieceAt(0) == obj.pieceAt(1);
		a = sq.topEdgeFirst ? 2 : 0;
		for (b = 0; b < 4; a += 3, ++b)
			prm[b] = obj.pieceAt(a) >> 1;
		sq.botEdgeFirst = obj.pieceAt(12) == obj.pieceAt(13);
		a = sq.botEdgeFirst ? 14 : 12;
		for (; b < 8; a += 3, ++b)
			prm[b] = obj.pieceAt(a) >> 1;
		sq.edgeperm = getNPerm(prm, 8);
		sq.ml = obj.ml;
	}

	function FullCube_randomCube(indice) {
		var f, i, shape, edge, corner, n_edge, n_corner, rnd, m;
		if (indice === undefined) {
			indice = rn(3678);
		}
		f = new SqCubie;
		shape = Shape_ShapeIdx[indice];
		corner = 0x01234567 << 1 | 0x11111111;
		edge = 0x01234567 << 1;
		n_corner = n_edge = 8;
		for (i = 0; i < 24; i++) {
			if (((shape >> i) & 1) == 0) { //edge
				rnd = rn(n_edge) << 2;
				f.setPiece(23 - i, (edge >> rnd) & 0xf);
				m = (1 << rnd) - 1;
				edge = (edge & m) + ((edge >> 4) & ~m);
				--n_edge;
			} else { //corner
				rnd = rn(n_corner) << 2;
				f.setPiece(23 - i, (corner >> rnd) & 0xf);
				f.setPiece(22 - i, (corner >> rnd) & 0xf);
				m = (1 << rnd) - 1;
				corner = (corner & m) + ((corner >> 4) & ~m);
				--n_corner;
				++i;
			}
		}
		f.ml = rn(2);
		return f;
	}

	function Search_init2(obj) {
		var corner, edge, i, j, ml, prun;
		obj.Search_d.copy(obj.Search_c);
		for (i = 0; i < obj.Search_length1; ++i) {
			obj.Search_d.doMove(obj.Search_move[i]);
		}
		FullCube_getSquare(obj.Search_d, obj.Search_sq);
		edge = obj.Search_sq.edgeperm;
		corner = obj.Search_sq.cornperm;
		ml = obj.Search_sq.ml;
		prun = Math.max(SquarePrun[obj.Search_sq.edgeperm << 1 | ml], SquarePrun[obj.Search_sq.cornperm << 1 | ml]);
		for (i = prun; i < obj.Search_maxlen2; ++i) {
			if (Search_phase2(obj, edge, corner, obj.Search_sq.topEdgeFirst, obj.Search_sq.botEdgeFirst, ml, i, obj.Search_length1, 0)) {
				for (j = 0; j < i; ++j) {
					obj.Search_d.doMove(obj.Search_move[obj.Search_length1 + j]);
				}
				obj.Search_sol_string = Search_move2string(obj, i + obj.Search_length1);
				return true;
			}
		}
		return false;
	}

	function Search_move2string(obj, len) {
		var s = "";
		var top = 0,
			bottom = 0;
		for (var i = len - 1; i >= 0; i--) {
			var val = obj.Search_move[i];
			//console.log(val);
			if (val > 0) {
				val = 12 - val;
				top = (val > 6) ? (val - 12) : val;
			} else if (val < 0) {
				val = 12 + val;
				bottom = (val > 6) ? (val - 12) : val;
			} else {
				var twst = "/";
				if (i == obj.Search_length1 - 1) {
					twst = "`/`";
				}
				if (top == 0 && bottom == 0) {
					s += twst;
				} else {
					s += " (" + top + "," + bottom + ")" + twst;
				}
				top = bottom = 0;
			}
		}
		if (top == 0 && bottom == 0) {} else {
			s += " (" + top + "," + bottom + ") ";
		}
		return s; // + " (" + len + "t)";
	}

	function Search_phase1(obj, shape, prunvalue, maxl, depth, lm) {
		var m, prunx, shapex;
		if (prunvalue == 0 && maxl < 4) {
			return maxl == 0 && Search_init2(obj);
		}
		if (lm != 0) {
			shapex = Shape_TwistMove[shape];
			prunx = ShapePrun[shapex];
			if (prunx < maxl) {
				obj.Search_move[depth] = 0;
				if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 0)) {
					return true;
				}
			}
		}
		shapex = shape;
		if (lm <= 0) {
			m = 0;
			while (true) {
				m += Shape_TopMove[shapex];
				shapex = m >> 4;
				m &= 15;
				if (m >= 12) {
					break;
				}
				prunx = ShapePrun[shapex];
				if (prunx > maxl) {
					break;
				} else if (prunx < maxl) {
					obj.Search_move[depth] = m;
					if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 1)) {
						return true;
					}
				}
			}
		}
		shapex = shape;
		if (lm <= 1) {
			m = 0;
			while (true) {
				m += Shape_BottomMove[shapex];
				shapex = m >> 4;
				m &= 15;
				if (m >= 6) {
					break;
				}
				prunx = ShapePrun[shapex];
				if (prunx > maxl) {
					break;
				} else if (prunx < maxl) {
					obj.Search_move[depth] = -m;
					if (Search_phase1(obj, shapex, prunx, maxl - 1, depth + 1, 2)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	function Search_phase2(obj, edge, corner, topEdgeFirst, botEdgeFirst, ml, maxl, depth, lm) {
		var botEdgeFirstx, cornerx, edgex, m, prun1, prun2, topEdgeFirstx;
		if (maxl == 0 && !topEdgeFirst && botEdgeFirst) {
			return true;
		}
		if (lm != 0 && topEdgeFirst == botEdgeFirst) {
			edgex = Square_TwistMove[edge];
			cornerx = Square_TwistMove[corner];
			if (SquarePrun[edgex << 1 | 1 - ml] < maxl && SquarePrun[cornerx << 1 | 1 - ml] < maxl) {
				obj.Search_move[depth] = 0;
				if (Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirst, 1 - ml, maxl - 1, depth + 1, 0)) {
					return true;
				}
			}
		}
		if (lm <= 0) {
			topEdgeFirstx = !topEdgeFirst;
			edgex = topEdgeFirstx ? Square_TopMove[edge] : edge;
			cornerx = topEdgeFirstx ? corner : Square_TopMove[corner];
			m = topEdgeFirstx ? 1 : 2;
			prun1 = SquarePrun[edgex << 1 | ml];
			prun2 = SquarePrun[cornerx << 1 | ml];
			while (m < 12 && prun1 <= maxl && prun1 <= maxl) {
				if (prun1 < maxl && prun2 < maxl) {
					obj.Search_move[depth] = m;
					if (Search_phase2(obj, edgex, cornerx, topEdgeFirstx, botEdgeFirst, ml, maxl - 1, depth + 1, 1)) {
						return true;
					}
				}
				topEdgeFirstx = !topEdgeFirstx;
				if (topEdgeFirstx) {
					edgex = Square_TopMove[edgex];
					prun1 = SquarePrun[edgex << 1 | ml];
					m += 1;
				} else {
					cornerx = Square_TopMove[cornerx];
					prun2 = SquarePrun[cornerx << 1 | ml];
					m += 2;
				}
			}
		}
		if (lm <= 1) {
			botEdgeFirstx = !botEdgeFirst;
			edgex = botEdgeFirstx ? Square_BottomMove[edge] : edge;
			cornerx = botEdgeFirstx ? corner : Square_BottomMove[corner];
			m = botEdgeFirstx ? 1 : 2;
			prun1 = SquarePrun[edgex << 1 | ml];
			prun2 = SquarePrun[cornerx << 1 | ml];
			while (m < (maxl > 6 ? 6 : 12) && prun1 <= maxl && prun1 <= maxl) {
				if (prun1 < maxl && prun2 < maxl) {
					obj.Search_move[depth] = -m;
					if (Search_phase2(obj, edgex, cornerx, topEdgeFirst, botEdgeFirstx, ml, maxl - 1, depth + 1, 2)) {
						return true;
					}
				}
				botEdgeFirstx = !botEdgeFirstx;
				if (botEdgeFirstx) {
					edgex = Square_BottomMove[edgex];
					prun1 = SquarePrun[edgex << 1 | ml];
					m += 1;
				} else {
					cornerx = Square_BottomMove[cornerx];
					prun2 = SquarePrun[cornerx << 1 | ml];
					m += 2;
				}
			}
		}
		return false;
	}

	function Search_solution(obj, c) {
		var shape;
		obj.Search_c = c;
		shape = FullCube_getShapeIdx(c);
		//console.log(shape);
		for (obj.Search_length1 = ShapePrun[shape]; obj.Search_length1 < 100; ++obj.Search_length1) {
			//console.log(obj.Search_length1);
			obj.Search_maxlen2 = Math.min(32 - obj.Search_length1, 17);
			if (Search_phase1(obj, shape, ShapePrun[shape], obj.Search_length1, 0, -1)) {
				break;
			}
		}
		return obj.Search_sol_string;
	}

	function Search_Search() {
		this.Search_move = [];
		this.Search_d = new SqCubie;
		this.Search_sq = new Square_Square;
	}

	function Search() {}

	_ = Search_Search.prototype = Search.prototype;
	_.Search_c = null;
	_.Search_length1 = 0;
	_.Search_maxlen2 = 0;
	_.Search_sol_string = null;

	function Shape_$clinit() {
		Shape_$clinit = $.noop;
		Shape_halflayer = [0, 3, 6, 12, 15, 24, 27, 30, 48, 51, 54, 60, 63];
		Shape_ShapeIdx = [];
		ShapePrun = [];
		Shape_TopMove = [];
		Shape_BottomMove = [];
		Shape_TwistMove = [];
		Shape_init();
	}

	function Shape_bottomMove(obj) {
		var move, moveParity;
		move = 0;
		moveParity = 0;
		do {
			if ((obj.bottom & 2048) == 0) {
				move += 1;
				obj.bottom = obj.bottom << 1;
			} else {
				move += 2;
				obj.bottom = obj.bottom << 2 ^ 12291;
			}
			moveParity = 1 - moveParity;
		}
		while ((bitCount(obj.bottom & 63) & 1) != 0);
		(bitCount(obj.bottom) & 2) == 0 && (obj.Shape_parity ^= moveParity);
		return move;
	}

	function Shape_getIdx(obj) {
		var ret;
		ret = binarySearch(Shape_ShapeIdx, obj.top << 12 | obj.bottom) << 1 | obj.Shape_parity;
		return ret;
	}

	function Shape_setIdx(obj, idx) {
		obj.Shape_parity = idx & 1;
		obj.top = Shape_ShapeIdx[idx >> 1];
		obj.bottom = obj.top & 4095;
		obj.top >>= 12;
	}

	function Shape_topMove(obj) {
		var move, moveParity;
		move = 0;
		moveParity = 0;
		do {
			if ((obj.top & 2048) == 0) {
				move += 1;
				obj.top = obj.top << 1;
			} else {
				move += 2;
				obj.top = obj.top << 2 ^ 12291;
			}
			moveParity = 1 - moveParity;
		}
		while ((bitCount(obj.top & 63) & 1) != 0);
		(bitCount(obj.top) & 2) == 0 && (obj.Shape_parity ^= moveParity);
		return move;
	}

	function Shape_Shape() {}

	function Shape_getShape2Idx(shp) {
		var ret;
		ret = binarySearch(Shape_ShapeIdx, shp & 0xffffff) << 1 | shp >> 24;
		return ret;
	}

	function Shape_init() {
		var count, depth, dl, done, done0, dr, i, idx, m, s, ul, ur, value, p1, p3, temp;
		count = 0;
		for (i = 0; i < 28561; ++i) {
			dr = Shape_halflayer[i % 13];
			dl = Shape_halflayer[~~(i / 13) % 13];
			ur = Shape_halflayer[~~(~~(i / 13) / 13) % 13];
			ul = Shape_halflayer[~~(~~(~~(i / 13) / 13) / 13)];
			value = ul << 18 | ur << 12 | dl << 6 | dr;
			bitCount(value) == 16 && (Shape_ShapeIdx[count++] = value);
		}
		s = new Shape_Shape;
		for (i = 0; i < 7356; ++i) {
			Shape_setIdx(s, i);
			Shape_TopMove[i] = Shape_topMove(s);
			Shape_TopMove[i] |= Shape_getIdx(s) << 4;
			Shape_setIdx(s, i);
			Shape_BottomMove[i] = Shape_bottomMove(s);
			Shape_BottomMove[i] |= Shape_getIdx(s) << 4;
			Shape_setIdx(s, i);
			temp = s.top & 63;
			p1 = bitCount(temp);
			p3 = bitCount(s.bottom & 4032);
			s.Shape_parity ^= 1 & (p1 & p3) >> 1;
			s.top = s.top & 4032 | s.bottom >> 6 & 63;
			s.bottom = s.bottom & 63 | temp << 6;
			Shape_TwistMove[i] = Shape_getIdx(s);
		}
		for (i = 0; i < 7536; ++i) {
			ShapePrun[i] = -1;
		}
		ShapePrun[Shape_getShape2Idx(14378715)] = 0;
		ShapePrun[Shape_getShape2Idx(31157686)] = 0;
		ShapePrun[Shape_getShape2Idx(23967451)] = 0;
		ShapePrun[Shape_getShape2Idx(7191990)] = 0;
		done = 4;
		done0 = 0;
		depth = -1;
		while (done != done0) {
			done0 = done;
			++depth;
			for (i = 0; i < 7536; ++i) {
				if (ShapePrun[i] == depth) {
					m = 0;
					idx = i;
					do {
						idx = Shape_TopMove[idx];
						m += idx & 15;
						idx >>= 4;
						if (ShapePrun[idx] == -1) {
							++done;
							ShapePrun[idx] = depth + 1;
						}
					}
					while (m != 12);
					m = 0;
					idx = i;
					do {
						idx = Shape_BottomMove[idx];
						m += idx & 15;
						idx >>= 4;
						if (ShapePrun[idx] == -1) {
							++done;
							ShapePrun[idx] = depth + 1;
						}
					}
					while (m != 12);
					idx = Shape_TwistMove[i];
					if (ShapePrun[idx] == -1) {
						++done;
						ShapePrun[idx] = depth + 1;
					}
				}
			}
		}
	}

	function Shape() {}

	_ = Shape_Shape.prototype = Shape.prototype;
	_.bottom = 0;
	_.Shape_parity = 0;
	_.top = 0;
	var Shape_BottomMove, Shape_ShapeIdx, ShapePrun, Shape_TopMove, Shape_TwistMove, Shape_halflayer;

	function Square_$clinit() {
		Square_$clinit = $.noop;
		SquarePrun = [];
		Square_TwistMove = [];
		Square_TopMove = [];
		Square_BottomMove = [];
		Square_init();
	}

	function Square_Square() {}

	function Square_init() {
		var check, depth, done, find, i, idx, idxx, inv, m, ml, pos;
		pos = [];
		for (i = 0; i < 40320; ++i) {
			setNPerm(pos, i, 8);
			circle(pos, 2, 4)(pos, 3, 5);
			Square_TwistMove[i] = getNPerm(pos, 8);
			setNPerm(pos, i, 8);
			circle(pos, 0, 3, 2, 1);
			Square_TopMove[i] = getNPerm(pos, 8);
			setNPerm(pos, i, 8);
			circle(pos, 4, 7, 6, 5);
			Square_BottomMove[i] = getNPerm(pos, 8);
		}
		for (i = 0; i < 80640; ++i) {
			SquarePrun[i] = -1;
		}
		SquarePrun[0] = 0;
		depth = 0;
		done = 1;
		while (done < 80640) {
			//console.log(done);
			inv = depth >= 11;
			find = inv ? -1 : depth;
			check = inv ? depth : -1;
			++depth;
			OUT: for (i = 0; i < 80640; ++i) {
				if (SquarePrun[i] == find) {
					idx = i >> 1;
					ml = i & 1;
					idxx = Square_TwistMove[idx] << 1 | 1 - ml;
					if (SquarePrun[idxx] == check) {
						++done;
						SquarePrun[inv ? i : idxx] = depth;
						if (inv)
							continue OUT;
					}
					idxx = idx;
					for (m = 0; m < 4; ++m) {
						idxx = Square_TopMove[idxx];
						if (SquarePrun[idxx << 1 | ml] == check) {
							++done;
							SquarePrun[inv ? i : idxx << 1 | ml] = depth;
							if (inv)
								continue OUT;
						}
					}
					for (m = 0; m < 4; ++m) {
						idxx = Square_BottomMove[idxx];
						if (SquarePrun[idxx << 1 | ml] == check) {
							++done;
							SquarePrun[inv ? i : idxx << 1 | ml] = depth;
							if (inv)
								continue OUT;
						}
					}
				}
			}
		}
	}

	function Square() {}

	_ = Square_Square.prototype = Square.prototype;
	_.botEdgeFirst = false;
	_.cornperm = 0;
	_.edgeperm = 0;
	_.ml = 0;
	_.topEdgeFirst = false;
	var Square_BottomMove, SquarePrun, Square_TopMove, Square_TwistMove;

	function bitCount(x) {
		x -= x >> 1 & 1431655765;
		x = (x >> 2 & 858993459) + (x & 858993459);
		x = (x >> 4) + x & 252645135;
		x += x >> 8;
		x += x >> 16;
		return x & 63;
	}

	function binarySearch(sortedArray, key) {
		var high, low, mid, midVal;
		low = 0;
		high = sortedArray.length - 1;
		while (low <= high) {
			mid = low + ((high - low) >> 1);
			midVal = sortedArray[mid];
			if (midVal < key) {
				low = mid + 1;
			} else if (midVal > key) {
				high = mid - 1;
			} else {
				return mid;
			}
		}
		return -low - 1;
	}

	// Star_x8 = [0];
	// Star_x71 = [1];
	// Star_x62 = [3];
	// Star_x44 = [18];
	// Star_x53 = [19];

	// Square_Scallop = [1004];
	// Square_rPawn = [1005];
	// Square_Shield = [1006];
	// Square_Barrel = [1007];
	// Square_rFist = [1008];
	// Square_Mushroom = [1009];
	// Square_lPawn = [1011];
	// Square_Square = [1015];
	// Square_lFist = [1016];
	// Square_Kite = [1018];

	// Kite_Scallop = [1154];
	// Kite_rPawn = [1155];
	// Kite_Shield = [1156];
	// Kite_Barrel = [1157];
	// Kite_rFist = [1158];
	// Kite_Mushroom = [1159];
	// Kite_lPawn = [1161];
	// Kite_lFist = [1166];
	// Kite_Kite = [1168];

	// Barrel_Scallop = [424];
	// Barrel_rPawn = [425];
	// Barrel_Shield = [426];
	// Barrel_Barrel = [427];
	// Barrel_rFist = [428];
	// Barrel_Mushroom = [429];
	// Barrel_lPawn = [431];
	// Barrel_lFist = [436];

	// Scallop_Scallop = [95];
	// Scallop_rPawn = [218];
	// Scallop_Shield = [341];
	// Scallop_rFist = [482];
	// Scallop_Mushroom = [528];
	// Scallop_lPawn = [632];
	// Scallop_lFist = [1050];

	// Shield_rPawn = [342];
	// Shield_Shield = [343];
	// Shield_rFist = [345];
	// Shield_Mushroom = [346];
	// Shield_lPawn = [348];
	// Shield_lFist = [353];

	// Mushroom_rPawn = [223];
	// Mushroom_rFist = [487];
	// Mushroom_Mushroom = [533];
	// Mushroom_lPawn = [535];
	// Mushroom_lFist = [1055];

	// Pawn_rPawn_rPawn = [219];
	// Pawn_rPawn_lPawn = [225];
	// Pawn_rPawn_rFist = [483];
	// Pawn_lPawn_rFist = [489];
	// Pawn_lPawn_lPawn = [639];
	// Pawn_rPawn_lFist = [1051];
	// Pawn_lPawn_lFist = [1057];

	// Fist_rFist_rFist = [486];
	// Fist_lFist_rFist = [1054];
	// Fist_lFist_lFist = [1062];

	// Pair_x6 = [6];
	// Pair_r42 = [21];
	// Pair_x411 = [34];
	// Pair_r51 = [46];
	// Pair_l42 = [59];
	// Pair_l51 = [71];
	// Pair_x33 = [144];
	// Pair_x312 = [157];
	// Pair_x321 = [182];
	// Pair_x222 = [305];

	// L_x6 = [7];
	// L_r42 = [22];
	// L_x411 = [35];
	// L_r51 = [47];
	// L_l42 = [60];
	// L_l51 = [72];
	// L_x33 = [145];
	// L_x312 = [158];
	// L_x321 = [183];
	// L_x222 = [306];

	// Line_x6 = [8];
	// Line_r42 = [23];
	// Line_x411 = [36];
	// Line_r51 = [48];
	// Line_l42 = [61];
	// Line_l51 = [73];
	// Line_x33 = [146];
	// Line_x312 = [159];
	// Line_x321 = [184];
	// Line_x222 = [307];

	var cspcases = [0, 1, 3, 18, 19, 1004, 1005, 1006, 1007, 1008, 1009, 1011, 1015, 1016, 1018, 1154, 1155, 1156, 1157, 1158, 1159, 1161, 1166, 1168, 424, 425, 426, 427, 428, 429, 431, 436, 95, 218, 341, 482, 528, 632, 1050, 342, 343, 345, 346, 348, 353, 223, 487, 533, 535, 1055, 219, 225, 483, 489, 639, 1051, 1057, 486, 1054, 1062, 6, 21, 34, 46, 59, 71, 144, 157, 182, 305, 7, 22, 35, 47, 60, 72, 145, 158, 183, 306, 8, 23, 36, 48, 61, 73, 146, 159, 184, 307];

	function CSPInit() {
		CSPInit = $.noop;
		var s = new Shape_Shape;
		for (var csp = 0; csp < cspcases.length; csp++) {
			var curCases = [cspcases[csp]];
			for (var i = 0; i < curCases.length; i++) {
				var shape = curCases[i];
				do {
					shape = Shape_TopMove[shape << 1] >> 5;
					if (curCases.indexOf(shape) == -1) {
						curCases.push(shape);
					}
				} while (shape != curCases[i]);
				do {
					shape = Shape_BottomMove[shape << 1] >> 5;
					if (curCases.indexOf(shape) == -1) {
						curCases.push(shape);
					}
				} while (shape != curCases[i]);
				Shape_setIdx(s, shape << 1);
				var tmp = s.top;
				s.top = s.bottom;
				s.bottom = tmp;
				shape = Shape_getIdx(s) >> 1;
				if (curCases.indexOf(shape) == -1) {
					curCases.push(shape);
				}
			}
			cspcases[csp] = curCases;
		}
	}

	var cspfilter = ['Star-x8', 'Star-x71', 'Star-x62', 'Star-x44', 'Star-x53', 'Square-Scallop', 'Square-rPawn', 'Square-Shield', 'Square-Barrel', 'Square-rFist', 'Square-Mushroom', 'Square-lPawn', 'Square-Square', 'Square-lFist', 'Square-Kite', 'Kite-Scallop', 'Kite-rPawn', 'Kite-Shield', 'Kite-Barrel', 'Kite-rFist', 'Kite-Mushroom', 'Kite-lPawn', 'Kite-lFist', 'Kite-Kite', 'Barrel-Scallop', 'Barrel-rPawn', 'Barrel-Shield', 'Barrel-Barrel', 'Barrel-rFist', 'Barrel-Mushroom', 'Barrel-lPawn', 'Barrel-lFist', 'Scallop-Scallop', 'Scallop-rPawn', 'Scallop-Shield', 'Scallop-rFist', 'Scallop-Mushroom', 'Scallop-lPawn', 'Scallop-lFist', 'Shield-rPawn', 'Shield-Shield', 'Shield-rFist', 'Shield-Mushroom', 'Shield-lPawn', 'Shield-lFist', 'Mushroom-rPawn', 'Mushroom-rFist', 'Mushroom-Mushroom', 'Mushroom-lPawn', 'Mushroom-lFist', 'Pawn-rPawn-rPawn', 'Pawn-rPawn-lPawn', 'Pawn-rPawn-rFist', 'Pawn-lPawn-rFist', 'Pawn-lPawn-lPawn', 'Pawn-rPawn-lFist', 'Pawn-lPawn-lFist', 'Fist-rFist-rFist', 'Fist-lFist-rFist', 'Fist-lFist-lFist', 'Pair-x6', 'Pair-r42', 'Pair-x411', 'Pair-r51', 'Pair-l42', 'Pair-l51', 'Pair-x33', 'Pair-x312', 'Pair-x321', 'Pair-x222', 'L-x6', 'L-r42', 'L-x411', 'L-r51', 'L-l42', 'L-l51', 'L-x33', 'L-x312', 'L-x321', 'L-x222', 'Line-x6', 'Line-r42', 'Line-x411', 'Line-r51', 'Line-l42', 'Line-l51', 'Line-x33', 'Line-x312', 'Line-x321', 'Line-x222'];
	var cspprobs = [16, 16, 16, 10, 16, 24, 16, 24, 16, 24, 16, 16, 4, 24, 16, 48, 32, 48, 32, 48, 32, 32, 48, 16, 48, 32, 48, 16, 48, 32, 32, 48, 36, 48, 72, 72, 48, 48, 72, 48, 36, 72, 48, 48, 72, 32, 48, 16, 32, 48, 16, 32, 48, 48, 16, 48, 48, 36, 72, 36, 72, 96, 96, 72, 96, 72, 72, 72, 72, 24, 48, 64, 64, 48, 64, 48, 48, 48, 48, 16, 24, 32, 32, 24, 32, 24, 24, 24, 24, 8];

	var search = new Search_Search;

	function square1SolverGetRandomScramble(type, length, cases) {
		Shape_$clinit();
		Square_$clinit();
		var scrambleString = Search_solution(search, FullCube_randomCube());
		return scrambleString;
	}

	function getCSPScramble(type, length, cases) {
		Shape_$clinit();
		Square_$clinit();
		CSPInit();
		var idx = mathlib.rndEl(cspcases[scrMgr.fixCase(cases, cspprobs)]);
		var scrambleString = Search_solution(search, FullCube_randomCube(idx));
		return scrambleString;
	}

	var pll_map = [
		[0x1032, 0x3210], // H
		[0x3102, 0x3210], // Ua
		[0x3021, 0x3210], // Ub
		[0x2301, 0x3210], // Z
		[0x3210, 0x3021], // Aa
		[0x3210, 0x3102], // Ab
		[0x3210, 0x2301], // E
		[0x3012, 0x3201], // F
		[0x2130, 0x3021], // Gb
		[0x1320, 0x3102], // Ga
		[0x3021, 0x3102], // Gc
		[0x3102, 0x3021], // Gd
		[0x3201, 0x3201], // Ja
		[0x3120, 0x3201], // Jb
		[0x1230, 0x3012], // Na
		[0x3012, 0x3012], // Nb
		[0x0213, 0x3201], // Ra
		[0x2310, 0x3201], // Rb
		[0x1230, 0x3201], // T
		[0x3120, 0x3012], // V
		[0x3201, 0x3012] // Y
	];

	var pllprobs = [
		1, 4, 4, 2,
		4, 4, 2, 4,
		4, 4, 4, 4,
		4, 4, 1, 1,
		4, 4, 4, 4, 4
	];

	var pllfilter = [
		'H', 'Ua', 'Ub', 'Z',
		'Aa', 'Ab', 'E', 'F',
		'Ga', 'Gb', 'Gc', 'Gd',
		'Ja', 'Jb', 'Na', 'Nb',
		'Ra', 'Rb', 'T', 'V', 'Y'
	];

	function getPLLScramble(type, length, cases) {
		Shape_$clinit();
		Square_$clinit();
		var pllcase = pll_map[scrMgr.fixCase(cases, pllprobs)];
		var cc = new SqCubie;
		var rn = mathlib.rn(4) * 0x1111;
		var rn2 = mathlib.rn(4) * 4;
		var ep = (0x4444 - pllcase[0] + rn) & 0x3333;
		var cp = (0x3333 - pllcase[1] + rn) & 0x3333;
		ep = (ep | ep << 16) >> rn2;
		cp = (cp | cp << 16) >> rn2;
		for (var i = 0; i < 4; i++) {
			var c = (cp >> (12 - i * 4) & 0xf) << 1 | 1;
			cc.setPiece(i * 3 + 1, c);
			cc.setPiece(i * 3 + 2, c);
			cc.setPiece((i * 3 + 3) % 12, (ep >> (12 - i * 4) & 0xf) << 1);
		}
		if (mathlib.rn(2) != 0) {
			cc.doMove(1);
		}
		cc.ml = mathlib.rn(2);
		return Search_solution(search, cc);
	}

	function getPLLImage(cases, canvas) {
		Shape_$clinit();
		Square_$clinit();
		var pllcase = pll_map[scrMgr.fixCase(cases, pllprobs)];
		var cc = new SqCubie;
		var ep = (0x4444 - pllcase[0]) & 0x3333;
		var cp = (0x3333 - pllcase[1]) & 0x3333;
		for (var i = 0; i < 4; i++) {
			var c = (cp >> (12 - i * 4) & 0xf) << 1 | 1;
			cc.setPiece(i * 3 + 1, c);
			cc.setPiece(i * 3 + 2, c);
			cc.setPiece((i * 3 + 3) % 12, (ep >> (12 - i * 4) & 0xf) << 1);
		}
		if (!canvas) {
			return [cc, false, null];
		}
		image.sqllImage(cc, false, canvas);
	}

	scrMgr.reg('sqrs', square1SolverGetRandomScramble);
	scrMgr.reg('sqrcsp', getCSPScramble, [cspfilter, cspprobs]);
	scrMgr.reg('sq1pll', getPLLScramble, [pllfilter, pllprobs, getPLLImage]);

	return {
		initialize: $.noop,
		SqCubie: SqCubie,
		getRandomScramble: square1SolverGetRandomScramble
	};

})(mathlib.setNPerm, mathlib.getNPerm, mathlib.circle, mathlib.rn);

/* ==== scramble/pyraminx.js ==== */
"use strict";

(function() {
	/*
	x504x x x504x
	 132 231 132
	  x x405x x
	    x504x
	     132
	      x  */
	var cFacelet = [
		[3, 16, 11], // F3, L4, R5
		[4, 23, 15], // F4, D5, L3
		[5, 9, 22], // F5, R3, D4
		[10, 17, 21] // R4, L5, D3
	];

	var eFacelet = [
		[1, 7], // F1, R1
		[2, 14], // F2, L2
		[0, 18], // F0, D0
		[6, 12], // R0, L0
		[8, 20], // R2, D2
		[13, 19] // L1, D1
	];

	function checkNoBar(perm, ori) {
		var edgeOri = eocoord.set([], ori & 0x1f);
		var cornOri = cocoord.set([], ori >> 5);
		var edgePerm = epcoord.set([], perm);
		var f = [];
		mathlib.fillFacelet(cFacelet, f, [0, 1, 2, 3], cornOri, 6);
		mathlib.fillFacelet(eFacelet, f, edgePerm, edgeOri, 6);
		var pieces = [4, 2, 3, 1, 5, 0];
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 2; j++) {
				var p1 = eFacelet[i][0 ^ j];
				var p2 = eFacelet[i][1 ^ j];
				var nb1 = ~~(p1 / 6) * 6 + pieces[(pieces.indexOf(p1 % 6) + 5) % 6];
				var nb2 = ~~(p2 / 6) * 6 + pieces[(pieces.indexOf(p2 % 6) + 1) % 6];
				if (f[nb1] == f[p1] && f[nb2] == f[p2]) {
					return false;
				}
			}
		}
		return true;
	}

	var solv = new mathlib.Solver(4, 2, [
		[0, [epermMove, 'p', 6, -1], 360],
		[0, oriMove, 2592]
	]);

	var movePieces = [
		[0, 1, 3],
		[1, 2, 5],
		[0, 4, 2],
		[3, 5, 4]
	];

	var moveOris = [
		[0, 1, 0, 2],
		[0, 1, 0, 2],
		[0, 0, 1, 2],
		[0, 0, 1, 2]
	];

	function epermMove(arr, m) {
		mathlib.acycle(arr, movePieces[m]);
	}

	var eocoord = new mathlib.Coord('o', 6, -2);
	var epcoord = new mathlib.Coord('p', 6, -1);
	var cocoord = new mathlib.Coord('o', 4, 3);

	function oriMove(a, c) {
		var edgeOri = eocoord.set([], a & 0x1f);
		var cornOri = cocoord.set([], a >> 5);
		cornOri[c]++;
		mathlib.acycle(edgeOri, movePieces[c], 1, moveOris[c]);
		return cocoord.get(cornOri) << 5 | eocoord.get(edgeOri);
	}

	function pyrMult(state0, state1) {
		var ep0 = epcoord.set([], state0[0]);
		var eo0 = eocoord.set([], state0[1] & 0x1f);
		var co0 = cocoord.set([], state0[1] >> 5);
		var ep1 = epcoord.set([], state1[0]);
		var eo1 = eocoord.set([], state1[1] & 0x1f);
		var co1 = cocoord.set([], state1[1] >> 5);
		var ep2 = [];
		var eo2 = [];
		var co2 = [];
		for (var i = 0; i < 6; i++) {
			ep2[i] = ep0[ep1[i]];
			eo2[i] = eo0[ep1[i]] ^ eo1[i];
		}
		for (var i = 0; i < 4; i++) {
			co2[i] = co0[i] + co1[i];
		}
		return [epcoord.get(ep2), cocoord.get(co2) << 5 | eocoord.get(eo2)];
	}

	var aufs = [[0, 0], [183, 869], [87, 1729]];

	var l4e_map = [
		//[ 0, 1, '1'],
		[ 1, 3, 'L3Bar-1', 'LLDGFFRRG'],
		[59, 3, 'L3Bar-2', 'DLLGFFRRG'],
		[25, 3, 'L3Bar-3', 'FFGDRRLLG'],
		[35, 3, 'L3Bar-4', 'GRRGLLFFD'],
		[12, 3, 'LL-1',    'LLGFFGGGG'],
		[10, 3, 'LL-2',    'GLLGGGGRR'],
		[ 2, 1, 'LL-3',    'RLRLFLFRF'],
		[ 4, 1, 'LL-4',    'FLFRFRLRL'],
		[ 3, 3, 'L4NB-1',  'FGGGGDGFGGGF'],
		[57, 3, 'L4NB-2',  'GGRGRGDGGGGR'],
		[53, 3, 'L4NB-3',  'GGDGRGGGRGGR'],
		[45, 3, 'L4NB-4',  'DGGFGGGFGGGF'],
		[33, 3, 'L4NB-5',  'GGDGGGGRGGGR'],
		[27, 3, 'L4NB-6',  'DGGGFGGGGGGF'],
		[49, 3, 'L3NB-1',  'RRGGGDGFF'],
		[43, 3, 'L3NB-2',  'GFFRRGDGG'],
		[41, 3, 'L3NB-3',  'GGGDLLFFG'],
		[51, 3, 'L3NB-4',  'GGGGRRLLD'],
		[ 8, 3, 'Flip-1',  'RLFLFFRRL'],
		[16, 3, 'Flip-2',  'LFFRRRLLFGGD'],
		[56, 1, 'Flip-3',  'RLFLFRFRLGGD'],
		[21, 3, 'L4Blk-1', 'GGDGGGLLL'],
		[13, 3, 'L4Blk-2', 'DGGLLLGGG'],
		[29, 3, 'L4Bar-1', 'GGGDGGGRR'],
		[37, 3, 'L4Bar-2', 'GGGFFGGGD'],
		[61, 3, 'L4Bar-3', 'GGGDGGLLG'],
		[ 5, 3, 'L4Bar-4', 'GGGGLLGGD'],
		[17, 3, 'L4Bar-5', 'GGGLLDGGG'],
		[11, 3, 'L4Bar-6', 'GGGGGGDLL'],
		[ 9, 3, 'L4Bar-7', 'RRGDGGGGG'],
		[19, 3, 'L4Bar-8', 'GFFGGGGGD'],
		[20, 3, 'DFlip-1', 'GGGRRGGGGGGD'],
		[18, 3, 'DFlip-2', 'GGGGGGGFFGGD'],
		[60, 1, 'DFlip-3', 'FFGRRGLLGGGD'],
		[58, 1, 'DFlip-4', 'GRRGLLGFFGGD']
	];

	var l4eprobs = [];
	var l4efilter = [];
	for (var i = 0; i < l4e_map.length; i++) {
		l4eprobs.push(l4e_map[i][1]);
		l4efilter.push(l4e_map[i][2]);
	}

	function getL4EScramble(type, length, cases) {
		var l4ecase = l4e_map[scrMgr.fixCase(cases, l4eprobs)][0];
		var perm = mathlib.getNPerm(mathlib.setNPerm([], l4ecase & 1, 4, -1).concat([4, 5]), 6, -1);
		var ori = (l4ecase >> 1 & 0x3) * 864 + (l4ecase >> 3);
		var state = pyrMult(mathlib.rndEl(aufs), pyrMult([perm, ori], mathlib.rndEl(aufs)));
		var sol = solv.toStr(solv.search(state, 8).reverse(), "ULRB", ["'", ""]) + ' ';
		for (var i = 0; i < 4; i++) {
			var r = mathlib.rn(3);
			if (r < 2) {
				sol += "lrbu".charAt(i) + [" ", "' "][r];
			}
		}
		return sol;
	}

	function getL4EImage(cases, canvas) {
		var l4ecase = l4e_map[cases];
		if (!canvas) {
			return ['GGG' + l4ecase[3], null, l4ecase[2]];
		}
		image.pyrllImage('GGG' + l4ecase[3], canvas);
	}

	function getScramble(type) {
		var minl = type == 'pyro' ? 0 : 8;
		var limit = type == 'pyrl4e' ? 2 : 6;
		var len = 0;
		var sol;
		var perm;
		var ori;
		do {
			if (type == 'pyro' || type == 'pyrso' || type == 'pyr4c') {
				perm = mathlib.rn(360);
				ori = mathlib.rn(2592);
			} else if (type == 'pyrl4e') {
				perm = mathlib.getNPerm(mathlib.setNPerm([], mathlib.rn(12), 4, -1).concat([4, 5]), 6, -1);
				ori = mathlib.rn(3) * 864 + mathlib.rn(8);
			} else if (type == 'pyrnb') {
				do {
					perm = mathlib.rn(360);
					ori = mathlib.rn(2592);
				} while (!checkNoBar(perm, ori));
			}
			len = solv.search([perm, ori], 0).length;
			sol = solv.toStr(solv.search([perm, ori], minl).reverse(), "ULRB", ["'", ""]) + ' ';
			for (var i = 0; i < 4; i++) {
				var r = mathlib.rn(type == 'pyr4c' ? 2 : 3);
				if (r < 2) {
					sol += "lrbu".charAt(i) + [" ", "' "][r];
					len++;
				}
			}
		} while (len < limit);
		return sol;
	}
	scrMgr.reg(['pyro', 'pyrso', 'pyrnb', 'pyr4c'], getScramble)
		('pyrl4e', getL4EScramble, [l4efilter, l4eprobs, getL4EImage]);
})();

var mpyr = (function() {

	function MpyrCubie(ep, eo, wp, ct, co, cp) {
		this.ep = ep || [0, 1, 2, 3, 4, 5];
		this.eo = eo || [0, 0, 0, 0, 0, 0];
		this.wp = wp || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this.ct = ct || [0, 1, 2, 3];
		this.co = co || [0, 0, 0, 0];
		this.cp = cp || [0, 1, 2, 3]; // for cube rotation
	}

	MpyrCubie.prototype.toString = function() {
		var f = this.toFaceCube(1);
		var ret = '' +
			'XX L0 L1 L2 L3 L4 XX    XX R0 R1 R2 R3 R4 XX\n' +
			'   L5 L6 L7 L8 L9    XX    R5 R6 R7 R8 R9\n' +
			'      La Lb Lc    Fc Fb Fa    Ra Rb Rc\n' +
			'         XX    F9 F8 F7 F6 F5    XX\n' +
			'            XX F4 F3 F2 F1 F0 XX\n' +
			'            XX D0 D1 D2 D3 D4 XX\n' +
			'               D5 D6 D7 D8 D9\n' +
			'                  Da Db Dc\n' +
			'                     XX';
		ret = ret.replace(/([FRDL])([0-9a-c])/g, function(m, p1, p2) {
			var i = 'FRDL'.indexOf(p1) * 13 + parseInt(p2, 16);
			return 'FRDL'[~~(f[i] / 13)] + (f[i] % 13).toString(16);
		});
		return ret;
	}

	var F = 0, R = 13, D = 26, L = 39, a = 10, b = 11, c = 12;

	var edgeFacelets = [
		[F + 8, L + 8], [D + 8, R + 8],
		[F + 6, R + 6], [D + 6, L + 6],
		[F + 2, D + 2], [R + 2, L + 2]
	];

	var wingFacelets = [
		[F + 9, L + c], [L + 9, F + c], [D + 9, R + c], [R + 9, D + c],
		[F + a, R + 5], [R + a, F + 5], [D + a, L + 5], [L + a, D + 5],
		[F + 1, D + 3], [D + 1, F + 3], [R + 1, L + 3], [L + 1, R + 3]
	];

	var cornFacelets = [
		[F + 0, R + b, D + 4],
		[D + 0, L + b, F + 4],
		[R + 0, F + b, L + 4],
		[L + 0, D + b, R + 4]
	];

	var centFacelets = [
		F + 7, D + 7, R + 7, L + 7
	];

	MpyrCubie.prototype.toFaceCube = function(todiv) {
		var f = [];
		todiv = todiv || 13;
		mathlib.fillFacelet(edgeFacelets, f, this.ep, this.eo, todiv);
		mathlib.fillFacelet(wingFacelets, f, this.wp, [], todiv);
		mathlib.fillFacelet(cornFacelets, f, this.cp, this.co, todiv);
		mathlib.fillFacelet(centFacelets, f, this.ct, null, todiv);
		return f;
	}

	MpyrCubie.prototype.fromFacelet = function(facelet) {
		var count = 0;
		var f = [];
		for (var i = 0; i < 52; ++i) {
			f[i] = facelet[i];
			count += Math.pow(16, f[i]);
		}
		if (count != 0xdddd) {
			return -1;
		}
		for (var i = 0; i < 6; i++) {
			out: for (var j = 0; j < 6; j++) {
				for (var t = 0; t < 2; t++) {
					if (~~(edgeFacelets[j][0] / 13) == f[edgeFacelets[i][t]] &&
							~~(edgeFacelets[j][1] / 13) == f[edgeFacelets[i][t ^ 1]]) {
						this.ep[i] = j;
						this.eo[i] = t;
						break out;
					}
				}
			}
		}
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 12; j++) {
				if (~~(wingFacelets[j][0] / 13) == f[wingFacelets[i][0]] &&
						~~(wingFacelets[j][1] / 13) == f[wingFacelets[i][1]]) {
					this.wp[i] = j;
					break;
				}
			}
		}
		for (var i = 0; i < 4; i++) {
			out: for (var j = 0; j < 4; j++) {
				for (var t = 0; t < 3; t++) {
					if (~~(cornFacelets[j][0] / 13) == f[cornFacelets[i][t]] &&
							~~(cornFacelets[j][1] / 13) == f[cornFacelets[i][(t + 1) % 3]] &&
							~~(cornFacelets[j][2] / 13) == f[cornFacelets[i][(t + 2) % 3]]) {
						this.cp[i] = j;
						this.co[i] = t;
						break out;
					}
				}
			}
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (~~(centFacelets[j] / 13) == f[centFacelets[i]]) {
					this.ct[i] = j;
				}
			}
		}
		return this;
	}

	MpyrCubie.randomCube = function() {
		return new MpyrCubie(
			mathlib.rndPerm(6, true), mathlib.setNOri([], mathlib.rn(32), 6, -2),
			mathlib.rndPerm(12, true), mathlib.rndPerm(4, true),
			mathlib.setNOri([], mathlib.rn(27), 4, -3), null)
	}

	MpyrCubie.MpyrMult = function() {
		var args = Array.from(arguments);
		var prod = args.pop() || new MpyrCubie();
		return args.reduceRight((b, a) => {
			for (var i = 0; i < 4; i++) {
				prod.ct[i] = a.ct[b.ct[i]];
				prod.co[i] = (a.co[b.cp[i]] + b.co[i]) % 3;
				prod.cp[i] = a.cp[b.cp[i]];
			}
			for (var i = 0; i < 6; i++) {
				prod.eo[i] = a.eo[b.ep[i]] ^ b.eo[i];
				prod.ep[i] = a.ep[b.ep[i]];
			}
			for (var i = 0; i < 12; i++) {
				prod.wp[i] = a.wp[b.wp[i]];
			}
			return prod;
		});
	}

	function initMoveCube() {
		if (MpyrCubie.moveCube) {
			return;
		}
		// var moveUv = new MpyrCubie([2, 3, 5, 4, 1, 0], [1, 0, 0, 1, 1, 1], [5, 4, 6, 7, 10, 11, 9, 8, 3, 2, 1, 0], [2, 1, 3, 0], [1, 1, 1, 1], [3, 0, 2, 1]);
		// var moveRv = new MpyrCubie([3, 2, 4, 5, 1, 0], [0, 1, 1, 0, 0, 0], [6, 7, 5, 4, 9, 8, 10, 11, 2, 3, 0, 1], [1, 2, 0, 3], [1, 1, 1, 1], [0, 3, 1, 2]);
		var moveCube = [];
		moveCube[0] = new MpyrCubie( //moveU
			[0, 1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0],
			[0, 4, 2, 3, 10, 5, 6, 7, 8, 9, 1, 11],
			[0, 1, 2, 3], [0, 0, 1, 0], null);
		moveCube[2] = new MpyrCubie( //moveUw
			[2, 1, 5, 3, 4, 0], [1, 0, 0, 0, 0, 1],
			[5, 4, 2, 3, 10, 11, 6, 7, 8, 9, 1, 0],
			[2, 1, 3, 0], [0, 0, 1, 0], null);
		moveCube[4] = new MpyrCubie( //moveB
			[0, 1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0],
			[0, 1, 2, 6, 4, 5, 11, 7, 8, 9, 10, 3],
			[0, 1, 2, 3], [0, 0, 0, 1], null);
		moveCube[6] = new MpyrCubie( //moveBw
			[0, 3, 2, 5, 4, 1], [0, 1, 0, 1, 0, 0],
			[0, 1, 7, 6, 4, 5, 11, 10, 8, 9, 2, 3],
			[0, 3, 1, 2], [0, 0, 0, 1], null);
		moveCube[8] = new MpyrCubie( //moveR
			[0, 1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0],
			[0, 1, 5, 3, 4, 8, 6, 7, 2, 9, 10, 11],
			[0, 1, 2, 3], [1, 0, 0, 0], null);
		moveCube[10] = new MpyrCubie( //moveRw
			[0, 2, 4, 3, 1, 5], [0, 1, 1, 0, 0, 0],
			[0, 1, 5, 4, 9, 8, 6, 7, 2, 3, 10, 11],
			[1, 2, 0, 3], [1, 0, 0, 0], null);
		moveCube[12] = new MpyrCubie( //moveL
			[0, 1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0],
			[7, 1, 2, 3, 4, 5, 6, 9, 8, 0, 10, 11],
			[0, 1, 2, 3], [0, 1, 0, 0], null);
		moveCube[14] = new MpyrCubie( //moveLw
			[3, 1, 2, 4, 0, 5], [1, 0, 0, 0, 1, 0],
			[7, 6, 2, 3, 4, 5, 8, 9, 1, 0, 10, 11],
			[3, 0, 2, 1], [0, 1, 0, 0], null);
		for (var i = 1; i < 16; i += 2) {
			moveCube[i] = MpyrCubie.MpyrMult(moveCube[i - 1], moveCube[i - 1], null);
		}
		MpyrCubie.moveCube = moveCube;
	}

	initMoveCube();

	MpyrCubie.prototype.getPairPerm = function() {
		var objw = [];
		var ret = [];
		for (var i = 0; i < 6; i++) {
			var ori = this.eo[i];
			objw[this.ep[i] * 2] = i * 2 + ori;
			objw[this.ep[i] * 2 + 1] = i * 2 + (ori ^ 1);
		}
		for (var i = 0; i < 12; i++) {
			ret[i] = objw[this.wp[i]];
		}
		return ret;
	}

	MpyrCubie.prototype.getCosetIdx = function() {
		var ret = 0;
		for (var i = 0; i < 4; i++) {
			ret += this.co[i];
		}
		ret += 3 - this.ct[3 ^ this.ct.indexOf(3)];
		return ret % 3;
	}

	function genCkmv(moves) {
		var ckmv = [];
		var tmp1 = new MpyrCubie();
		var tmp2 = new MpyrCubie();
		for (var m1 = 0; m1 < moves.length; m1++) {
			ckmv[m1] = 1 << m1;
			for (var m2 = 0; m2 < m1; m2++) {
				MpyrCubie.MpyrMult(MpyrCubie.moveCube[moves[m1]], MpyrCubie.moveCube[moves[m2]], tmp1);
				MpyrCubie.MpyrMult(MpyrCubie.moveCube[moves[m2]], MpyrCubie.moveCube[moves[m1]], tmp2);
				if (tmp1.toString(1) == tmp2.toString(1)) {
					ckmv[m1] |= 1 << m2;
				}
			}
		}
		return ckmv;
	}

	function doMove(mc, move) {
		return MpyrCubie.MpyrMult(mc, MpyrCubie.moveCube[move], null);
	}

	function doCosetMove(idx, move) {
		return (idx + 1 - (move >> 1) % 2) % 3;
	}

	var phase1Moves = [0, 2, 4, 6, 8, 10, 12, 14];
	var p1e1w2Move = null;
	var solv1 = null;

	function phase1e1w2Hash(edge, fc) {
		var pos = fc.ep.indexOf(edge);
		var ori = fc.eo[pos];
		return (pos * 12 + fc.wp.indexOf(edge << 1 | ori)) * 12 + fc.wp.indexOf(edge << 1 | ori ^ 1);
	}

	function initPhase1() {
		var mc = new MpyrCubie();
		p1e1w2Move = mathlib.createMoveHash(mc, phase1Moves, phase1e1w2Hash.bind(null, 0), doMove);
		var solved = [];
		var solved2 = [];
		for (var i = 0; i < 6; i++) {
			solved.push(p1e1w2Move[1][phase1e1w2Hash(i, mc)]);
			for (var j = 0; j < i; j++) {
				solved2.push(Math.min(solved[i], solved[j]) * 792 + Math.max(solved[i], solved[j]));
			}
		}
		var p1e2w4Prun = [];
		mathlib.createPrun(p1e2w4Prun, solved2, 792 * 792 * 3, 12, function(idx, move) {
			var ct = doCosetMove(~~(idx / 792 / 792), phase1Moves[move]);
			var idx1 = ~~(idx / 792) % 792;
			var idx2 = idx % 792;
			idx1 = p1e1w2Move[0][move][idx1];
			idx2 = p1e1w2Move[0][move][idx2];
			return ct * 792 * 792 + Math.min(idx1, idx2) * 792 + Math.max(idx1, idx2);
		}, 8, 2);
		var ckmv = genCkmv(phase1Moves);
		solv1 = new mathlib.Searcher(null, function(idx) {
			var prun = 0;
			var ctbase = idx[6] * 792 * 792;
			for (var i = 0; i < 6; i++) {
				for (var j = 0; j < i; j++) {
					prun = Math.max(prun, mathlib.getPruning(p1e2w4Prun,
						ctbase + Math.min(idx[i], idx[j]) * 792 + Math.max(idx[i], idx[j])));
				}
			}
			return prun;
		}, function(idx, move) {
			var ret = [];
			for (var i = 0; i < 6; i++) {
				ret[i] = p1e1w2Move[0][move][idx[i]];
			}
			ret[6] = doCosetMove(idx[6], phase1Moves[move]);
			return ret;
		}, 8, 2, ckmv);
	}

	var phase2Moves = [2, 6, 10, 14];
	var p2epctMoves = null;
	var p2eocoMoves = null;
	var solv2 = null;

	function phase2EpCtHash(fc) {
		return mathlib.getNPerm(fc.ep, 6, -1) * 4 + fc.ct.indexOf(0);
	}

	function phase2EoCoHash(fc) {
		return (parseInt(fc.eo.join(''), 2) >> 1) * 81 + parseInt(fc.co.join(''), 3);
	}

	function initPhase2() {
		p2epctMoves = mathlib.createMoveHash(new MpyrCubie(), phase2Moves, phase2EpCtHash, doMove);
		p2eocoMoves = mathlib.createMoveHash(new MpyrCubie(), phase2Moves, phase2EoCoHash, doMove);
		var p2epctPrun = [];
		var p2eocoPrun = [];
		mathlib.createPrun(p2epctPrun, 0, 1440, 14, p2epctMoves[0], 4, 2);
		mathlib.createPrun(p2eocoPrun, 0, 2592, 14, p2eocoMoves[0], 4, 2);
		var ckmv2 = genCkmv(phase2Moves);
		solv2 = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(p2epctPrun, idx[0]),
				mathlib.getPruning(p2eocoPrun, idx[1])
			);
		}, function(idx, move) {
			return [p2epctMoves[0][move][idx[0]], p2eocoMoves[0][move][idx[1]]];
		}, 4, 2, ckmv2);
	}

	function getScramble(validMoves, len) {
		var scramble = [];
		for (var i = 0; i < len; i++) {
			scramble.push(validMoves[~~(Math.random() * validMoves.length)]);
		}
		var mc = new MpyrCubie();
		for (var i = 0; i < scramble.length; i++) {
			mc = MpyrCubie.MpyrMult(mc, MpyrCubie.moveCube[scramble[i]], null);
		}
		return [mc, scramble];
	}

	var move2str = ["U", "U'", "Uw", "Uw'", "B", "B'", "Bw", "Bw'", "R", "R'", "Rw", "Rw'", "L", "L'", "Lw", "Lw'"]

	function prettyMoves(moves) {
		return moves.map((move) => move2str[move]).join(' ');
	}

	function applyMoves(mc, moves) {
		return moves.reduce((mc, move) => MpyrCubie.MpyrMult(mc, MpyrCubie.moveCube[move], null), mc);
	}

	function solveMpyr(mc) {
		if (!solv1) {
			initPhase1();
			initPhase2();
		}
		var tt1 = $.now();
		var idx = [];
		for (var i = 0; i < 6; i++) {
			idx[i] = p1e1w2Move[1][phase1e1w2Hash(i, mc)];
		}
		idx[6] = mc.getCosetIdx();
		var sol1 = solv1.solve(idx, 0, 14);
		tt1 = $.now() - tt1;
		for (var i = 0; i < sol1.length; i++) {
			sol1[i] = phase1Moves[sol1[i][0]] + sol1[i][1];
		}
		mc = applyMoves(mc, sol1);
		var p2epct = p2epctMoves[1][phase2EpCtHash(mc)];
		var p2eoco = p2eocoMoves[1][phase2EoCoHash(mc)];
		var tt2 = $.now();
		var sol2 = solv2.solve([p2epct, p2eoco], 0, 20);
		tt2 = $.now() - tt2;
		for (var i = 0; i < sol2.length; i++) {
			sol2[i] = phase2Moves[sol2[i][0]] + sol2[i][1];
		}
		return [sol1, sol2, tt1, tt2];
	}

	function solveTest(n_moves) {
		var solvInfo = getScramble([0, 2, 4, 6, 8, 10, 12, 14], n_moves);
		var scramble = prettyMoves(solvInfo[1].slice());
		var mc = solvInfo[0];
		var ret = solveMpyr(mc);
		DEBUG && console.log('[mpyr] phase1 solved in ', ret[2]);
		DEBUG && console.log('[mpyr] phase2 solved in ', ret[3]);
		mc = applyMoves(mc, ret[0]);
		mc = applyMoves(mc, ret[1]);

		var isSolved = true;
		var f = mc.toFaceCube();
		for (var i = 0; i < 52; i += 13) {
			for (var j = i + 1; j < i + 13; j++) {
				if (f[i] != f[j]) {
					isSolved = false;
					break;
				}
			}
		}
		if (!isSolved) {
			console.log('ERROR! NOT SOLVED!');
		}
		return [ret[0].length, ret[1].length, ret[2], ret[3]];
	}


	function getRandomScramble() {
		var mc = MpyrCubie.randomCube();
		var sol = solveMpyr(mc);
		sol = prettyMoves([].concat(sol[0], sol[1]));
		for (var i = 0; i < 4; i++) {
			var r = mathlib.rn(3);
			if (r < 2) {
				sol += " " + "lrbu".charAt(i) + ["", "'"][r];
			}
		}
		return sol;
	}

	scrMgr.reg('mpyrso', getRandomScramble);

	return {
		getRandomScramble: getRandomScramble,
		solveTest: solveTest
	};
})();


/* ==== scramble/skewb.js ==== */
(function() {

	/**	1 2   U
		 0  LFRB
		3 4   D  */
	//centers: U R F B L D
	//twstcor: URF ULB DRB DLF
	//fixedco: UBR UFL DFR DBL

	var fixedCorn = [
		[4, 16, 7], // U4 B1 R2
		[1, 11, 22], // U1 F1 L2
		[26, 14, 8], // D1 F4 R3
		[29, 19, 23] // D4 B4 L3
	];

	var twstCorn = [
		[3, 6, 12], // U3 R1 F2
		[2, 21, 17], // U2 L1 B2
		[27, 9, 18], // D2 R4 B3
		[28, 24, 13] // D3 L4 F3
	];

	function checkNoBar(perm, twst) {
		var corner = cpcord.set([], perm % 12);
		var center = ctcord.set([], ~~(perm / 12));
		var fixedtwst = ftcord.set([], twst % 81);
		twst = twcord.set([], ~~(twst / 81));
		var f = [];
		for (var i = 0; i < 6; i++) {
			f[i * 5] = center[i];
		}
		mathlib.fillFacelet(fixedCorn, f, [0, 1, 2, 3], fixedtwst, 5);
		mathlib.fillFacelet(twstCorn, f, corner, twst, 5);
		for (var i = 0; i < 30; i += 5) {
			for (var j = 1; j < 5; j++) {
				if (f[i] == f[i + j]) {
					return false;
				}
			}
		}
		return true;
	}

	var moveCenters = [
		[0, 3, 1],
		[0, 2, 4],
		[1, 5, 2],
		[3, 4, 5]
	];

	var moveCorners = [
		[0, 1, 2],
		[0, 3, 1],
		[0, 2, 3],
		[1, 3, 2]
	];

	var ctcord = new mathlib.Coord('p', 6, -1);
	var cpcord = new mathlib.Coord('p', 4, -1);
	var ftcord = new mathlib.Coord('o', 4, 3);
	var twcord = new mathlib.Coord('o', 4, -3);

	function ctcpMove(idx, m) {
		var corner = cpcord.set([], idx % 12);
		var center = ctcord.set([], ~~(idx / 12));
		mathlib.acycle(center, moveCenters[m]);
		mathlib.acycle(corner, moveCorners[m]);
		return ctcord.get(center) * 12 + cpcord.get(corner);
	}

	function twstMove(idx, move) {
		var fixedtwst = ftcord.set([], idx % 81);
		var twst = twcord.set([], ~~(idx / 81));
		fixedtwst[move]++;
		mathlib.acycle(twst, moveCorners[move], 1, [0, 2, 1, 3]);
		return twcord.get(twst) * 81 + ftcord.get(fixedtwst);
	}

	var solv = new mathlib.Solver(4, 2, [
		[0, ctcpMove, 4320],
		[0, twstMove, 2187]
	]);

	var solvivy = new mathlib.Solver(4, 2, [
		[0, function(idx, m) {
			return ~~(ctcpMove(idx * 12, m) / 12);
		}, 360],
		[0, function(idx, m) {
			return twstMove(idx, m) % 81;
		}, 81]
	]);


	function sol2str(sol) {
		var ret = [];
		var move2str = ["L", "R", "B", "U"]; //RLDB (in jaap's notation) rotated by z2
		for (var i = 0; i < sol.length; i++) {
			var axis = sol[i][0];
			var pow = 1 - sol[i][1];
			if (axis == 2) { //step two.
				mathlib.acycle(move2str, [0, 3, 1], pow + 1);
			}
			ret.push(move2str[axis] + ((pow == 1) ? "'" : ""));
		}
		return ret.join(" ");
	}

	var ori = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];

	function getScramble(type) {
		var perm, twst;
		var lim = type == 'skbso' ? 6 : 2;
		var minl = type == 'skbo' ? 0 : 8;
		do {
			if (type == 'skbll') {
				perm = ctcord.get(mathlib.rndPerm(5, true).concat([5])) * 12 + mathlib.rn(2) * 3;
				twst = mathlib.rn(3) * 81 + mathlib.rndEl([0, 29, 55]);
			} else {
				perm = mathlib.rn(4320);
				twst = mathlib.rn(2187);
			}
		} while (
			perm == 0 && twst == 0 ||
			ori[perm % 12] != (twst + ~~(twst / 3) + ~~(twst / 9) + ~~(twst / 27)) % 3 ||
			solv.search([perm, twst], 0, lim) != null ||
			type == 'skbnb' && !checkNoBar(perm, twst));
		return sol2str(solv.search([perm, twst], minl).reverse());
	}

	function getScrambleIvy(type) {
		var perm, twst, lim = 1,
			maxl = type == 'ivyso' ? 6 : 0;
		do {
			perm = mathlib.rn(360);
			twst = mathlib.rn(81);
		} while (perm == 0 && twst == 0 || solvivy.search([perm, twst], 0, lim) != null);
		return solvivy.toStr(solvivy.search([perm, twst], maxl).reverse(), "RLDB", "' ");
	}

	scrMgr.reg(['skbo', 'skbso', 'skbnb', 'skbll'], getScramble)(['ivyo', 'ivyso'], getScrambleIvy);

})();

/* ==== scramble/2x2x2.js ==== */
var scramble_222 = (function(rn) {
	var solv = new mathlib.Solver(3, 3, [[0, [doPermMove, 'p', 7], 5040], [0, [doOriMove, 'o', 7, -3], 729]]);

	var movePieces = [
		[0, 2, 3, 1],
		[0, 1, 5, 4],
		[0, 4, 6, 2]
	];

	var moveOris = [
		null,
		[0, 1, 0, 1, 3],
		[1, 0, 1, 0, 3]
	];

	var oriCoord = new mathlib.Coord('o', 7, -3);

	function doPermMove(arr, m) {
		mathlib.acycle(arr, movePieces[m]);
	}

	function doOriMove(arr, m) {
		mathlib.acycle(arr, movePieces[m], 1, moveOris[m]);
	}

	var cFacelet = [
		[3, 4, 9],
		[1, 20, 5],
		[2, 8, 17],
		[0, 16, 21],
		[13, 11, 6],
		[15, 7, 22],
		[12, 19, 10]
	];

	var llFaces = [0, 1, 2, 3, 8, 9, 4, 5, 20, 21, 16, 17];

	function checkNoBar(pidx, oidx) {
		var perm = mathlib.setNPerm([], pidx, 7);
		var ori = oriCoord.set([], oidx);
		var f = [];
		for (var i = 0; i < 24; i++) {
			f[i] = i >> 2;
		}
		mathlib.fillFacelet(cFacelet, f, perm, ori, 4);
		for (var i = 0; i < 24; i += 4) {
			if ((1 << f[i] | 1 << f[i + 3]) & (1 << f[i + 1] | 1 << f[i + 2])) {
				return false;
			}
		}
		return true;
	}

	var egprobs = [1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4];
	var egmap = [0, 17, 5, 14, 8, 1, 2, 4];
	var egfilter = ['EG0-O', 'EG0-H', 'EG0-L', 'EG0-Pi', 'EG0-S', 'EG0-T', 'EG0-U', 'EG0-aS', 'EG1B-O', 'EG1B-H', 'EG1B-L', 'EG1B-Pi', 'EG1B-S', 'EG1B-T', 'EG1B-U', 'EG1B-aS', 'EG1L-O', 'EG1L-H', 'EG1L-L', 'EG1L-Pi', 'EG1L-S', 'EG1L-T', 'EG1L-U', 'EG1L-aS', 'EG1F-O', 'EG1F-H', 'EG1F-L', 'EG1F-Pi', 'EG1F-S', 'EG1F-T', 'EG1F-U', 'EG1F-aS', 'EG1R-O', 'EG1R-H', 'EG1R-L', 'EG1R-Pi', 'EG1R-S', 'EG1R-T', 'EG1R-U', 'EG1R-aS', 'EG2-O', 'EG2-H', 'EG2-L', 'EG2-Pi', 'EG2-S', 'EG2-T', 'EG2-U', 'EG2-aS'];
	var egperms = [
		[4, 5, 6],
		[4, 6, 5],
		[6, 5, 4],
		[5, 4, 6],
		[5, 6, 4],
		[6, 4, 5]
	];

	var egll_map = [
		[0x3210, 0x1221, 2, 'H-1'],
		[0x3120, 0x1221, 2, 'H-2'],
		[0x2310, 0x1221, 4, 'H-3'],
		[0x3012, 0x1221, 4, 'H-4'],
		[0x0312, 0x0210, 4, 'L-1'],
		[0x2310, 0x0210, 4, 'L-2'],
		[0x0213, 0x0210, 4, 'L-3'],
		[0x3210, 0x0210, 4, 'L-4'],
		[0x2013, 0x0210, 4, 'L-5'],
		[0x3012, 0x0210, 4, 'L-6'],
		[0x3210, 0x1212, 4, 'Pi-1'],
		[0x0213, 0x1212, 4, 'Pi-2'],
		[0x2310, 0x1212, 4, 'Pi-3'],
		[0x2013, 0x1212, 4, 'Pi-4'],
		[0x3012, 0x1212, 4, 'Pi-5'],
		[0x0312, 0x1212, 4, 'Pi-6'],
		[0x3210, 0x2220, 4, 'S-1'],
		[0x0213, 0x2220, 4, 'S-2'],
		[0x0312, 0x2220, 4, 'S-3'],
		[0x3012, 0x2220, 4, 'S-4'],
		[0x2013, 0x2220, 4, 'S-5'],
		[0x2310, 0x2220, 4, 'S-6'],
		[0x2310, 0x1020, 4, 'T-1'],
		[0x2013, 0x1020, 4, 'T-2'],
		[0x0213, 0x1020, 4, 'T-3'],
		[0x3210, 0x1020, 4, 'T-4'],
		[0x3012, 0x1020, 4, 'T-5'],
		[0x0312, 0x1020, 4, 'T-6'],
		[0x0213, 0x2010, 4, 'U-1'],
		[0x3210, 0x2010, 4, 'U-2'],
		[0x0312, 0x2010, 4, 'U-3'],
		[0x3012, 0x2010, 4, 'U-4'],
		[0x2310, 0x2010, 4, 'U-5'],
		[0x2013, 0x2010, 4, 'U-6'],
		[0x3210, 0x1011, 4, 'aS-1'],
		[0x0213, 0x1011, 4, 'aS-2'],
		[0x0312, 0x1011, 4, 'aS-3'],
		[0x3012, 0x1011, 4, 'aS-4'],
		[0x2310, 0x1011, 4, 'aS-5'],
		[0x2013, 0x1011, 4, 'aS-6']
	];

	var tcllp_map = [
		[0x0123, 0x0221, 4, 'Hammer-1'],
		[0x3021, 0x0221, 4, 'Hammer-2'],
		[0x0132, 0x0221, 4, 'Hammer-3'],
		[0x0231, 0x0221, 4, 'Hammer-4'],
		[0x0321, 0x0221, 4, 'Hammer-5'],
		[0x2301, 0x0221, 4, 'Hammer-6'],
		[0x0123, 0x1022, 4, 'Spaceship-1'],
		[0x2301, 0x1022, 4, 'Spaceship-2'],
		[0x1320, 0x1022, 4, 'Spaceship-3'],
		[0x3021, 0x1022, 4, 'Spaceship-4'],
		[0x3012, 0x1022, 4, 'Spaceship-5'],
		[0x0231, 0x1022, 4, 'Spaceship-6'],
		[0x2031, 0x0002, 4, 'Stollery-1'],
		[0x3120, 0x0002, 4, 'Stollery-2'],
		[0x3201, 0x0002, 4, 'Stollery-3'],
		[0x2103, 0x0002, 4, 'Stollery-4'],
		[0x0231, 0x0002, 4, 'Stollery-5'],
		[0x2130, 0x0002, 4, 'Stollery-6'],
		[0x0123, 0x2222, 1, 'Pinwheel-1'],
		[0x1032, 0x2222, 1, 'Pinwheel-2'],
		[0x3201, 0x2222, 4, 'Pinwheel-3'],
		[0x2031, 0x0110, 2, '2Face-1'],
		[0x3102, 0x0110, 4, '2Face-2'],
		[0x0213, 0x0110, 2, '2Face-3'],
		[0x3021, 0x0110, 4, '2Face-4'],
		[0x1302, 0x0122, 4, 'Turtle-1'],
		[0x1032, 0x0122, 4, 'Turtle-2'],
		[0x3201, 0x0122, 4, 'Turtle-3'],
		[0x1230, 0x0122, 4, 'Turtle-4'],
		[0x2310, 0x0122, 4, 'Turtle-5'],
		[0x0321, 0x0122, 4, 'Turtle-6'],
		[0x3210, 0x1112, 4, 'Pinwheel Poser-1'],
		[0x3120, 0x1112, 4, 'Pinwheel Poser-2'],
		[0x3201, 0x1112, 4, 'Pinwheel Poser-3'],
		[0x2103, 0x1112, 4, 'Pinwheel Poser-4'],
		[0x2310, 0x1112, 4, 'Pinwheel Poser-5'],
		[0x2130, 0x1112, 4, 'Pinwheel Poser-6'],
		[0x2031, 0x0011, 4, 'Gun-1'],
		[0x1032, 0x0011, 4, 'Gun-2'],
		[0x0132, 0x0011, 4, 'Gun-3'],
		[0x3021, 0x0011, 4, 'Gun-4'],
		[0x2310, 0x0011, 4, 'Gun-5'],
		[0x2130, 0x0011, 4, 'Gun-6']
	];

	var tclln_map = [
		[0x1302, 0x1201, 4, 'Hammer-1'],
		[0x3021, 0x1201, 4, 'Hammer-2'],
		[0x2310, 0x1201, 4, 'Hammer-3'],
		[0x3201, 0x1201, 4, 'Hammer-4'],
		[0x1203, 0x1201, 4, 'Hammer-5'],
		[0x3120, 0x1201, 4, 'Hammer-6'],
		[0x0123, 0x1012, 4, 'Spaceship-1'],
		[0x1032, 0x1012, 4, 'Spaceship-2'],
		[0x0312, 0x1012, 4, 'Spaceship-3'],
		[0x3201, 0x1012, 4, 'Spaceship-4'],
		[0x1023, 0x1012, 4, 'Spaceship-5'],
		[0x2130, 0x1012, 4, 'Spaceship-6'],
		[0x0123, 0x0001, 4, 'Stollery-1'],
		[0x3120, 0x0001, 4, 'Stollery-2'],
		[0x0132, 0x0001, 4, 'Stollery-3'],
		[0x2103, 0x0001, 4, 'Stollery-4'],
		[0x3102, 0x0001, 4, 'Stollery-5'],
		[0x1203, 0x0001, 4, 'Stollery-6'],
		[0x0123, 0x1111, 1, 'Pinwheel-1'],
		[0x1032, 0x1111, 1, 'Pinwheel-2'],
		[0x1320, 0x1111, 4, 'Pinwheel-3'],
		[0x2031, 0x2002, 2, '2Face-1'],
		[0x0132, 0x2002, 4, '2Face-2'],
		[0x1032, 0x2002, 2, '2Face-3'],
		[0x3021, 0x2002, 4, '2Face-4'],
		[0x2031, 0x1102, 4, 'Turtle-1'],
		[0x3120, 0x1102, 4, 'Turtle-2'],
		[0x1023, 0x1102, 4, 'Turtle-3'],
		[0x3021, 0x1102, 4, 'Turtle-4'],
		[0x0132, 0x1102, 4, 'Turtle-5'],
		[0x1203, 0x1102, 4, 'Turtle-6'],
		[0x1302, 0x2122, 4, 'Pinwheel Poser-1'],
		[0x0213, 0x2122, 4, 'Pinwheel Poser-2'],
		[0x2013, 0x2122, 4, 'Pinwheel Poser-3'],
		[0x0312, 0x2122, 4, 'Pinwheel Poser-4'],
		[0x2310, 0x2122, 4, 'Pinwheel Poser-5'],
		[0x0321, 0x2122, 4, 'Pinwheel Poser-6'],
		[0x0123, 0x0022, 4, 'Gun-1'],
		[0x1032, 0x0022, 4, 'Gun-2'],
		[0x0132, 0x0022, 4, 'Gun-3'],
		[0x2310, 0x0022, 4, 'Gun-4'],
		[0x0312, 0x0022, 4, 'Gun-5'],
		[0x2130, 0x0022, 4, 'Gun-6']
	];

	var tcll_map = [
		[0x0123, 0x0221, 4, 'TCLL1-Hammer'],
		[0x0123, 0x1022, 4, 'TCLL1-Spaceship'],
		[0x2031, 0x0002, 4, 'TCLL1-Stollery'],
		[0x0123, 0x2222, 1, 'TCLL1-Pinwheel'],
		[0x2031, 0x0110, 2, 'TCLL1-2Face'],
		[0x1302, 0x0122, 4, 'TCLL1-Turtle'],
		[0x3210, 0x1112, 4, 'TCLL1-Pinwheel Poser'],
		[0x2031, 0x0011, 4, 'TCLL1-Gun'],
		[0x1302, 0x1201, 4, 'TCLL2-Hammer'],
		[0x0123, 0x1012, 4, 'TCLL2-Spaceship'],
		[0x0123, 0x0001, 4, 'TCLL2-Stollery'],
		[0x0123, 0x1111, 1, 'TCLL2-Pinwheel'],
		[0x2031, 0x2002, 2, 'TCLL2-2Face'],
		[0x2031, 0x1102, 4, 'TCLL2-Turtle'],
		[0x1302, 0x2122, 4, 'TCLL2-Pinwheel Poser'],
		[0x0123, 0x0022, 4, 'TCLL2-Gun']
	];

	var lsall_map = [
		[0x00000, 'LS1-PBL'],
		[0x00222, 'LS1-Sune'],
		[0x00111, 'LS1-aSune'],
		[0x00102, 'LS1-Ua'],
		[0x00021, 'LS1-Ub'],
		[0x00120, 'LS1-La'],
		[0x00210, 'LS1-Lb'],
		[0x00201, 'LS1-Ta'],
		[0x00012, 'LS1-Tb'],
		[0x10221, 'LS2-Hammer'],
		[0x10212, 'LS2-Spaceship'],
		[0x10200, 'LS2-StolleryA'],
		[0x10002, 'LS2-StolleryB'],
		[0x10020, 'LS2-StolleryC'],
		[0x10110, 'LS2-2Face'],
		[0x10122, 'LS2-Turtle'],
		[0x10011, 'LS2-GunA'],
		[0x10101, 'LS2-GunB'],
		[0x20112, 'LS3-Hammer'],
		[0x20211, 'LS3-Spaceship'],
		[0x20100, 'LS3-StolleryA'],
		[0x20001, 'LS3-StolleryB'],
		[0x20010, 'LS3-StolleryC'],
		[0x20220, 'LS3-2Face'],
		[0x20121, 'LS3-Turtle'],
		[0x20022, 'LS3-GunA'],
		[0x20202, 'LS3-GunB'],
		[0x02022, 'LS4-SuneA'],
		[0x02220, 'LS4-SuneB'],
		[0x02202, 'LS4-SuneC'],
		[0x02211, 'LS4-PiA'],
		[0x02121, 'LS4-PiB'],
		[0x02010, 'LS4-U'],
		[0x02001, 'LS4-L'],
		[0x02100, 'LS4-T'],
		[0x02112, 'LS4-H'],
		[0x12012, 'LS5-HammerA'],
		[0x12102, 'LS5-HammerB'],
		[0x12120, 'LS5-SpaceshipA'],
		[0x12201, 'LS5-SpaceshipB'],
		[0x12000, 'LS5-Stollery'],
		[0x12222, 'LS5-Pinwheel'],
		[0x12021, 'LS5-TurtleA'],
		[0x12210, 'LS5-TurtleB'],
		[0x12111, 'LS5-Pinwheel Poser'],
		[0x22110, 'LS6-Hammer'],
		[0x22101, 'LS6-Spaceship'],
		[0x22002, 'LS6-2Face'],
		[0x22011, 'LS6-Turtle'],
		[0x22122, 'LS6-Pinwheel PoserA'],
		[0x22221, 'LS6-Pinwheel PoserB'],
		[0x22212, 'LS6-Pinwheel PoserC'],
		[0x22200, 'LS6-GunA'],
		[0x22020, 'LS6-GunB'],
		[0x01011, 'LS7-aSuneA'],
		[0x01110, 'LS7-aSuneB'],
		[0x01101, 'LS7-aSuneC'],
		[0x01212, 'LS7-PiA'],
		[0x01122, 'LS7-PiB'],
		[0x01200, 'LS7-U'],
		[0x01002, 'LS7-L'],
		[0x01020, 'LS7-T'],
		[0x01221, 'LS7-H'],
		[0x11220, 'LS8-Hammer'],
		[0x11022, 'LS8-Spaceship'],
		[0x11001, 'LS8-2Face'],
		[0x11202, 'LS8-Turtle'],
		[0x11121, 'LS8-Pinwheel PoserA'],
		[0x11112, 'LS8-Pinwheel PoserB'],
		[0x11211, 'LS8-Pinwheel PoserC'],
		[0x11010, 'LS8-GunA'],
		[0x11100, 'LS8-GunB'],
		[0x21201, 'LS9-HammerA'],
		[0x21021, 'LS9-HammerB'],
		[0x21012, 'LS9-SpaceshipA'],
		[0x21120, 'LS9-SpaceshipB'],
		[0x21000, 'LS9-Stollery'],
		[0x21111, 'LS9-Pinwheel'],
		[0x21102, 'LS9-TurtleA'],
		[0x21210, 'LS9-TurtleB'],
		[0x21222, 'LS9-Pinwheel Poser']
	];

	var egllprobs = mathlib.idxArray(egll_map, 2);
	var egllfilter = mathlib.idxArray(egll_map, 3);
	var tcllpprobs = mathlib.idxArray(tcllp_map, 2);
	var tcllpfilter = mathlib.idxArray(tcllp_map, 3);
	var tcllnprobs = mathlib.idxArray(tclln_map, 2);
	var tcllnfilter = mathlib.idxArray(tclln_map, 3);
	var tcllprobs = mathlib.idxArray(tcll_map, 2);
	var tcllfilter = mathlib.idxArray(tcll_map, 3);
	var lsallprobs = mathlib.valuedArray(lsall_map.length, 1);
	var lsallfilter = mathlib.idxArray(lsall_map, 1);

	function getLLScramble(type, length, cases) {
		var llcase = 0;
		var ncubie = 4;
		var perm = [0, 1, 2, 3];
		var ori = [0, 0, 0, 0, 0, 0, 0];
		if (type == '222tcp') {
			llcase = tcllp_map[scrMgr.fixCase(cases, tcllpprobs)];
			ori = [0, 0, 0, 0, 1, 0, 0];
			perm = perm.concat(egperms[0]);
		} else if (type == '222tcn') {
			llcase = tclln_map[scrMgr.fixCase(cases, tcllnprobs)];
			ori = [0, 0, 0, 0, 2, 0, 0];
			perm = perm.concat(egperms[0]);
		} else if (type == '222tc') {
			var tcllIdx = scrMgr.fixCase(cases, tcllprobs)
			llcase = tcll_map[tcllIdx].slice();
			ori = [0, 0, 0, 0, tcllIdx < 8 ? 1 : 2, 0, 0];
			perm = perm.concat(egperms[0]);
			var perm4 = mathlib.rndPerm(4);
			llcase[0] = 0;
			for (var i = 0; i < 4; i++) {
				llcase[0] |= perm4[i] << (i * 4);
			}
		} else if (type == '222eg0') {
			llcase = egll_map[scrMgr.fixCase(cases, egllprobs)];
			perm = perm.concat(egperms[0]);
		} else if (type == '222eg1') {
			llcase = egll_map[scrMgr.fixCase(cases, egllprobs)];
			perm = perm.concat(egperms[2 + rn(4)]);
		} else if (type == '222eg2') {
			llcase = egll_map[scrMgr.fixCase(cases, egllprobs)];
			perm = perm.concat(egperms[1]);
		} else  if (type == '222lsall') {
			perm = perm.concat(egperms[0]);
			var perm4 = mathlib.rndPerm(4);
			perm4.push(perm4[3]);
			perm4[3] = 4;
			llcase = [0, lsall_map[scrMgr.fixCase(cases, lsallprobs)][0]];
			for (var i = 0; i < 5; i++) {
				llcase[0] |= perm4[i] << (i * 4);
			}
			ncubie = 5;
		}
		var rndA = rn(4);
		while (rndA-- > 0) {
			doPermMove(perm, 0);
		}
		var perm0 = perm.slice();
		for (var i = 0; i < ncubie; i++) {
			perm[i] = perm0[llcase[0] >> (i * 4) & 0xf];
			ori[i] = llcase[1] >> (i * 4) & 0xf;
		}
		var rndU = rn(4);
		while (rndU-- > 0) {
			doOriMove(ori, 0);
			doPermMove(perm, 0);
		}
		perm = mathlib.getNPerm(perm, 7);
		ori = oriCoord.get(ori);
		return solv.toStr(solv.search([perm, ori], 9).reverse(), "URF", "'2 ");
	}

	function getLLImage(type, ll_map, llfilter, cases, canvas) {
		var llcase = ll_map[cases];
		var llface = [];
		for (var i = 0; i < 4; i++) {
			if (!type || type == 'all' || type == 'ori') {
				var perm = llcase[0] >> (i << 2) & 0xf;
				var ori = llcase[1] >> (i << 2) & 0xf;
				var cols = type == 'all' ? 'DLFURB' : 'DGGUGG';
				for (var j = 0; j < 3; j++) {
					var pos = llFaces.indexOf(cFacelet[i][j]);
					llface[pos] = cols.charAt(cFacelet[perm][(j + 3 - ori) % 3] >> 2);
				}
			} else if (type == 'ls') {
				var ori = llcase[0] >> (i << 2) & 0xf;
				for (var j = 0; j < 3; j++) {
					var pos = llFaces.indexOf(cFacelet[i][j]);
					llface[pos] = "DGU".charAt((j + 3 - ori) % 3 == 0 ? (i == 3 ? 2 : 0) : 1);
				}
			}
		}
		llface = llface.join('');
		if (!canvas) {
			return [llface, null, llfilter[cases]];
		}
		image.llImage.drawImage(llface, null, canvas);
	}

	function getScramble(type, length, state) {
		var ori, perm, lim;
		var maxl = type == '222o' ? 0 : 9;
		do {
			lim = 2;
			if (type == '222o' || type == '222so') {
				perm = rn(5040);
				ori = rn(729);
				lim = 3;
			} else if (type == '222easy') {
				var n = Math.min(11, Math.max(4, ~~length || 4));
				do {
					perm = rn(5040);
					ori = rn(729);
				} while (solv.search([perm, ori], 0, n) == null);
				lim = 3;
			} else if (type == '222eg') {
				ori = egmap[state & 0x7];
				perm = [0, 2, 3, 4, 5, 1][state >> 3];
				var arr = mathlib.setNPerm([0, 0, 0, 0].concat(egperms[perm]), rn(24), 4);
				perm = mathlib.getNPerm(arr, 7);
				var rndU = rn(4);
				ori = oriCoord.set([], ori);
				while (rndU-- > 0) {
					doOriMove(ori, 0);
				}
				ori = oriCoord.get(ori);
			} else if (/^222eg[012]$/.exec(type)) {
				return getScramble('222eg', length, [0, 8, 40][~~type[5]] + state);
			} else if (type == '222nb') {
				do {
					perm = rn(5040);
					ori = rn(729);
				} while (!checkNoBar(perm, ori));
			}
		} while (perm == 0 && ori == 0 || solv.search([perm, ori], 0, lim) != null);
		return solv.toStr(solv.search([perm, ori], maxl).reverse(), "URF", "'2 ");
	}

	scrMgr.reg(['222o', '222so', '222nb', '222easy'], getScramble)
		('222eg0', getLLScramble, [egllfilter, egllprobs, getLLImage.bind(null, 'all', egll_map, egllfilter)])
		('222eg1', getLLScramble, [egllfilter, egllprobs, getLLImage.bind(null, 'all', egll_map, egllfilter)])
		('222eg2', getLLScramble, [egllfilter, egllprobs, getLLImage.bind(null, 'all', egll_map, egllfilter)])
		('222tcp', getLLScramble, [tcllpfilter, tcllpprobs, getLLImage.bind(null, 'all', tcllp_map, tcllpfilter)])
		('222tcn', getLLScramble, [tcllnfilter, tcllnprobs, getLLImage.bind(null, 'all', tclln_map, tcllnfilter)])
		('222tc', getLLScramble, [tcllfilter, tcllprobs, getLLImage.bind(null, 'ori', tcll_map, tcllfilter)])
		('222lsall', getLLScramble, [lsallfilter, lsallprobs, getLLImage.bind(null, 'ls', lsall_map, lsallfilter)])
		('222eg', getScramble, [egfilter, egprobs]);

	return {
		getEGLLImage: getLLImage.bind(null, false, egll_map, egllfilter)
	}
})(mathlib.rn);

/* ==== scramble/gearcube.js ==== */
(function() {
	var cmv = [];
	var emv = [];
	var prun = [[], [], []];

	var moveEdges = [
		[0, 3, 2, 1],
		[0, 1],
		[0, 3]
	];

	function cornerMove(arr, m) {
		mathlib.acycle(arr, [0, m + 1]);
	}

	function edgeMove(idx, m) {
		var arr = mathlib.setNPerm([], ~~(idx / 3), 4);
		mathlib.acycle(arr, moveEdges[m]);
		return mathlib.getNPerm(arr, 4) * 3 + (idx % 3 + (m == 0 ? 1 : 0)) % 3;
	}

	function doMove(off, idx, m) {
		var edge = idx % 72;
		var corner = ~~(idx / 72);
		corner = cmv[m][corner];
		edge = emv[(m + off) % 3][edge];
		return corner * 72 + edge;
	}

	function getPrun(state) {
		return Math.max(
			mathlib.getPruning(prun[0], state[0] * 72 + state[1]),
			mathlib.getPruning(prun[1], state[0] * 72 + state[2]),
			mathlib.getPruning(prun[2], state[0] * 72 + state[3]));
	}

	function search(state, maxl, lm, sol) {
		if (maxl == 0) {
			return state[0] == 0 && state[1] == 0 && state[2] == 0 && state[3] == 0;
		}
		if (getPrun(state) > maxl) {
			return false;
		}
		for (var m = 0; m < 3; m++) {
			if (m == lm) {
				continue
			}
			var statex = state.slice();
			for (var a = 0; a < 11; a++) {
				statex[0] = cmv[m][statex[0]];
				for (var i = 1; i < 4; i++) {
					statex[i] = emv[(m + i - 1) % 3][statex[i]];
				}
				if (search(statex, maxl - 1, m, sol)) {
					sol.push("URF".charAt(m) + ["'", "2'", "3'", "4'", "5'", "6", "5", "4", "3", "2", ""][a]);
					return true;
				}
			}
		}
	}

	function init() {
		init = $.noop;
		mathlib.createMove(emv, 72, edgeMove, 3);
		mathlib.createMove(cmv, 24, [cornerMove, 'p', 4], 3);
		for (var i = 0; i < 3; i++) {
			mathlib.createPrun(prun[i], 0, 24 * 72, 5, doMove.bind(null, i), 3, 12, 0);
		}
	}

	function getRandomState() {
		var ret = [mathlib.rn(24)];
		for (var i = 0; i < 3; i++) {
			do {
				ret[i + 1] = mathlib.rn(72);
			} while (mathlib.getPruning(prun[i], ret[0] * 72 + ret[i + 1]) == 15);
		}
		return ret;
	}

	function generateScramble(type) {
		init();
		var state;
		do {
			state = getRandomState();
		} while (state == 0);
		var len = type == 'gearso' ? 4 : 0;
		var sol = [];
		while (true) {
			if (search(state, len, -1, sol)) {
				break;
			}
			len++;
		}
		return sol.reverse().join(" ");
	}
	scrMgr.reg(['gearo', 'gearso'], generateScramble);
})();

/* ==== scramble/1x3x3.js ==== */
(function() {
	var solv = new mathlib.Solver(4, 1, [[0, doMove, 384]]);
	var movePieces = [
		[0, 1],
		[2, 3],
		[0, 3],
		[1, 2]
	];

	function doMove(idx, m) {
		var arr = mathlib.setNPerm([], idx >> 4, 4);
		mathlib.acycle(arr, movePieces[m]);
		return (mathlib.getNPerm(arr, 4) << 4) + ((idx & 15) ^ (1 << m));
	}

	function generateScramble() {
		var c = 1 + mathlib.rn(191);
		c = c * 2 + ((mathlib.getNParity(c >> 3, 4) ^ (c >> 1) ^ (c >> 2) ^ c) & 1);
		return solv.toStr(solv.search([c], 0), "RLFB", [""]);
	}
	scrMgr.reg('133', generateScramble);
})();

/* ==== scramble/2x2x3.js ==== */
(function(circle, getNPerm) {
	var cmv = [];
	var cprun = [];

	function initCornerMoveTable() {
		var g = [],
			temp;
		for (var i = 0; i < 40320; i++) {
			cmv[i] = [];
		}
		for (var i = 0; i < 40320; i++) {
			mathlib.setNPerm(g, i, 8);
			circle(g, 0, 1, 2, 3);
			temp = cmv[0][i] = getNPerm(g, 8); //U
			circle(g, 4, 5, 6, 7);
			temp = cmv[1][temp] = getNPerm(g, 8); //D
			circle(g, 2, 5)(g, 3, 6);
			temp = cmv[2][temp] = getNPerm(g, 8); //R
			circle(g, 0, 5)(g, 3, 4);
			cmv[3][temp] = getNPerm(g, 8); //F
		}
	}

	function doEdgeMove(idx, m) {
		if (m < 2) {
			return idx;
		}
		var g = mathlib.setNPerm([], idx, 3);
		if (m == 2) {
			circle(g, 0, 1);
		} else if (m == 3) {
			circle(g, 0, 2);
		}
		return getNPerm(g, 3);
	}
	//	function doMv(idx, m) {
	//		return cmv[~~(idx / 6)][m] * 6 + doEdgeMove(idx % 6, m);
	//	}
	function init() {
		init = $.noop;
		initCornerMoveTable();
		mathlib.createPrun(cprun, 0, 40320, 12, cmv, 4, 3);
		//		mathlib.createPrun([], 0, 40320 * 6, 15, doMv, 4, 3);
	}

	function search(corner, edge, maxl, lm, sol) {
		if (maxl == 0) {
			return corner + edge == 0;
		}
		if (mathlib.getPruning(cprun, corner) > maxl) return false;
		var h, g, f, i;
		for (i = 0; i < 4; i++) {
			if (i != lm) {
				h = corner;
				g = edge;
				for (f = 0; f < (i < 2 ? 3 : 1); f++) {
					h = cmv[i][h];
					g = doEdgeMove(g, i);
					if (search(h, g, maxl - 1, i, sol)) {
						sol.push(["U", "D", "R2", "F2"][i] + (i < 2 ? " 2'".charAt(f) : ""));
						return true;
					}
				}
			}
		}
	}

	function generateScramble() {
		init();
		var b, c;
		do {
			c = mathlib.rn(40320);
			b = mathlib.rn(6);
		} while (b + c == 0);
		var d = [];
		for (var a = 0; a < 99; a++) {
			if (search(c, b, a, -1, d)) {
				break;
			}
		}
		return d.reverse().join(" ");
	}
	scrMgr.reg('223', generateScramble);
})(mathlib.circle, mathlib.getNPerm);

/* ==== scramble/clock.js ==== */
"use strict";

var clock = (function(rn, Cnk) {
	var moveArr = [
		[0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], //UR
		[0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], //DR
		[0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], //DL
		[1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //UL
		[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], //U
		[0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], //R
		[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], //D
		[1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], //L
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], //ALL
		[11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0], //UR
		[0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 1, 1, 1], //DR
		[0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 1, 1, 0, 1], //DL
		[0, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0], //UL
		[11, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0], //U
		[11, 0, 0, 0, 0, 0, 11, 0, 0, 1, 0, 1, 1, 1], //R
		[0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 1, 1, 1, 1], //D
		[0, 0, 11, 0, 0, 0, 0, 0, 11, 1, 1, 1, 0, 1], //L
		[11, 0, 11, 0, 0, 0, 11, 0, 11, 1, 1, 1, 1, 1] //ALL
	];

	function select(n, k, idx) {
		var r = k;
		var val = 0;
		for (var i = n - 1; i >= 0; i--) {
			if (idx >= Cnk[i][r]) {
				idx -= Cnk[i][r--];
				val |= 1 << i;
			}
		}
		return val;
	}

	//invert table 0  1  2  3  4  5  6  7  8  9 10 11
	var invert = [-1, 1, -1, -1, -1, 5, -1, 7, -1, -1, -1, 11];

	function randomState() {
		var ret = [];
		for (var i = 0; i < 14; i++) {
			ret[i] = rn(12);
		}
		return ret;
	}

	/**
	 *	@return the length of the solution (the number of non-zero elements in the solution array)
	 *		-1: invalid input
	 */
	function Solution(clock, solution) {
		if (clock.length != 14 || solution.length != 18) {
			return -1;
		}
		return solveIn(14, clock, solution);
	}

	function swap(arr, row1, row2) {
		var tmp = arr[row1];
		arr[row1] = arr[row2];
		arr[row2] = tmp;
	}

	function addTo(arr, row1, row2, startidx, mul) {
		var length = arr[0].length;
		for (var i = startidx; i < length; i++) {
			arr[row2][i] = (arr[row2][i] + arr[row1][i] * mul) % 12;
		}
	}

	//linearly dependent
	var ld_list = [7695, 42588, 47187, 85158, 86697, 156568, 181700, 209201, 231778];

	function solveIn(k, numbers, solution) {
		var n = 18;
		var min_nz = k + 1;

		for (var idx = 0; idx < Cnk[n][k]; idx++) {
			var val = select(n, k, idx);
			var isLD = false;
			for (var r = 0; r < ld_list.length; r++) {
				if ((val & ld_list[r]) == ld_list[r]) {
					isLD = true;
					break;
				}
			}
			if (isLD) {
				continue;
			}
			var map = [];
			var cnt = 0;
			for (var j = 0; j < n; j++) {
				if (((val >> j) & 1) == 1) {
					map[cnt++] = j;
				}
			}
			var arr = [];
			for (var i = 0; i < 14; i++) {
				arr[i] = [];
				for (var j = 0; j < k; j++) {
					arr[i][j] = moveArr[map[j]][i];
				}
				arr[i][k] = numbers[i];
			}
			var ret = GaussianElimination(arr);
			if (ret != 0) {
				continue;
			}
			var isSolved = true;
			for (var i = k; i < 14; i++) {
				if (arr[i][k] != 0) {
					isSolved = false;
					break;
				}
			}
			if (!isSolved) {
				continue;
			}
			backSubstitution(arr);
			var cnt_nz = 0;
			for (var i = 0; i < k; i++) {
				if (arr[i][k] != 0) {
					cnt_nz++;
				}
			}
			if (cnt_nz < min_nz) {
				for (var i = 0; i < 18; i++) {
					solution[i] = 0;
				}
				for (var i = 0; i < k; i++) {
					solution[map[i]] = arr[i][k];
				}
				min_nz = cnt_nz;
			}
		}
		return min_nz == k + 1 ? -1 : min_nz;
	}

	function GaussianElimination(arr) {
		var m = 14;
		var n = arr[0].length;
		for (var i = 0; i < n - 1; i++) {
			if (invert[arr[i][i]] == -1) {
				var ivtidx = -1;
				for (var j = i + 1; j < m; j++) {
					if (invert[arr[j][i]] != -1) {
						ivtidx = j;
						break;
					}
				}
				if (ivtidx == -1) {
					OUT: for (var j1 = i; j1 < m - 1; j1++) {
						for (var j2 = j1 + 1; j2 < m; j2++) {
							if (invert[(arr[j1][i] + arr[j2][i]) % 12] != -1) {
								addTo(arr, j2, j1, i, 1);
								ivtidx = j1;
								break OUT;
							}
						}
					}
				}
				if (ivtidx == -1) { //k vectors are linearly dependent
					for (var j = i + 1; j < m; j++) {
						if (arr[j][i] != 0) {
							return -1;
						}
					}
					return i + 1;
				}
				swap(arr, i, ivtidx);
			}
			var inv = invert[arr[i][i]];
			for (var j = i; j < n; j++) {
				arr[i][j] = arr[i][j] * inv % 12;
			}
			for (var j = i + 1; j < m; j++) {
				addTo(arr, i, j, i, 12 - arr[j][i]);
			}
		}
		return 0;
	}

	function backSubstitution(arr) {
		var n = arr[0].length;
		for (var i = n - 2; i > 0; i--) {
			for (var j = i - 1; j >= 0; j--) {
				if (arr[j][i] != 0) {
					addTo(arr, i, j, i, 12 - arr[j][i]);
				}
			}
		}
	}

	var turns = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];

	function getScramble(type) {
		var rndarr = randomState();
		var solution = [];
		solution.length = 18;
		Solution(rndarr, solution);
		var scramble = "";

		for (var x = 0; x < 9; x++) {
			var turn = solution[x];
			if (turn == 0) {
				continue;
			}
			var clockwise = turn <= 6;
			if (turn > 6) {
				turn = 12 - turn;
			}
			scramble += turns[x] + turn + (clockwise ? "+" : "-") + " ";
		}
		scramble += "y2 ";
		for (var x = 0; x < 9; x++) {
			var turn = solution[x + 9];
			if (turn == 0) {
				continue;
			}
			var clockwise = turn <= 6;
			if (turn > 6) {
				turn = 12 - turn;
			}
			scramble += turns[x] + turn + (clockwise ? "+" : "-") + " ";
		}
		var isFirst = true;
		for (var x = 0; x < 4; x++) {
			if (rn(2) == 1) {
				scramble += (isFirst ? "" : " ") + turns[x];
				isFirst = false;
			}
		}
		return scramble;
	}

	scrMgr.reg('clko', getScramble);

	return {
		moveArr: moveArr
	};

})(mathlib.rn, mathlib.Cnk);

/* ==== scramble/333lse.js ==== */
(function() {

	var edgePerms = [
		[0, 1, 2, 3],
		[0, 2, 5, 4]
	];

	var edgeOris = [
		[0, 0, 0, 0, 2],
		[0, 1, 0, 1, 2]
	];

	function doPermMove(idx, m) {
		var edge = idx >> 3;
		var corn = idx;
		var cent = idx << 1 | (mathlib.getNParity(edge, 6) ^ ((corn >> 1) & 1));
		var g = mathlib.setNPerm([], edge, 6);
		mathlib.acycle(g, edgePerms[m]);
		if (m == 0) { //U
			corn = corn + 2;
		}
		if (m == 1) { //M
			cent = cent + 1;
		}
		return (mathlib.getNPerm(g, 6) << 3) | (corn & 6) | ((cent >> 1) & 1);
	}

	function doOriMove(arr, m) {
		mathlib.acycle(arr, edgePerms[m], 1, edgeOris[m]);
	}

	var solv = new mathlib.Solver(2, 3, [
		[0, doPermMove, 5760],
		[0, [doOriMove, 'o', 6, -2], 32]
	]);

	function generateScramble() {
		var b, c;
		do {
			c = mathlib.rn(5760);
			b = mathlib.rn(32);
		} while (b + c == 0);
		return solv.toStr(solv.search([c, b], 0), "UM", " 2'").replace(/ +/g, ' ');
	}
	scrMgr.reg('lsemu', generateScramble);
})();

/* ==== scramble/mgmlsll.js ==== */
(function() {
	/*
           3
		2     4
         1 0 0
             5
	move: 0=U, 1=R U R', 2=F' U F
	*/

	var epcord = new mathlib.Coord('p', 6, -1);
	var eocord = new mathlib.Coord('o', 6, -2);
	var cpcord = new mathlib.Coord('p', 6, -1);
	var cocord = new mathlib.Coord('o', 6, -3);

	function eMove(idx, m) {
		var perm = epcord.set([], idx >> 5);
		var twst = eocord.set([], idx & 0x1f);
		if (m == 0) {
			mathlib.acycle(twst, [0, 1, 2, 3, 4], 1);
			mathlib.acycle(perm, [0, 1, 2, 3, 4], 1);
		} else if (m == 1) {
			mathlib.acycle(twst, [0, 1, 2, 3, 5], 1);
			mathlib.acycle(perm, [0, 1, 2, 3, 5], 1);
		} else if (m == 2) {
			mathlib.acycle(twst, [1, 2, 3, 4, 5], 1, [0, 0, 0, 0, 1, 2]);
			mathlib.acycle(perm, [1, 2, 3, 4, 5]);
		}
		return epcord.get(perm) << 5 | eocord.get(twst);
	}

	function cMove(idx, m) {
		var perm = cpcord.set([], ~~(idx / 243));
		var twst = cocord.set([], idx % 243);
		if (m == 0) {
			mathlib.acycle(twst, [0, 1, 2, 3, 4], 1);
			mathlib.acycle(perm, [0, 1, 2, 3, 4], 1);
		} else if (m == 1) {
			mathlib.acycle(twst, [0, 5, 1, 2, 3], 1, [2, 0, 0, 0, 0, 3]);
			mathlib.acycle(perm, [0, 5, 1, 2, 3]);
		} else if (m == 2) {
			mathlib.acycle(twst, [0, 2, 3, 4, 5], 1, [1, 0, 0, 0, 1, 3]);
			mathlib.acycle(perm, [0, 2, 3, 4, 5]);
		}
		return cpcord.get(perm) * 243 + cocord.get(twst);
	}

	var solv = new mathlib.Solver(3, 4, [
		[0, eMove, 32 * 360],
		[0, cMove, 243 * 360]
	]);

	function getMinxLSScramble(type, length, cases) {
		var edge = 0;
		var corn = 0;
		do {
			if (type == 'mlsll') {
				edge = mathlib.rn(32 * 360);
				corn = mathlib.rn(243 * 360);
			} else if (type == 'mgmpll') {
				edge = epcord.get(mathlib.rndPerm(5, true).concat([5])) * 32;
				corn = cpcord.get(mathlib.rndPerm(5, true).concat([5])) * 243;
			} else if (type == 'mgmll') {
				var eo = eocord.set([], mathlib.rn(32)); eo[0] += eo[5]; eo[5] = 0;
				var co = cocord.set([], mathlib.rn(243)); co[0] += co[5]; co[5] = 0;
				edge = epcord.get(mathlib.rndPerm(5, true).concat([5])) * 32 + eocord.get(eo);
				corn = cpcord.get(mathlib.rndPerm(5, true).concat([5])) * 243 + cocord.get(co);
			}
		} while (edge == 0 && corn == 0);
		var sol = solv.search([edge, corn], 0);
		var ret = [];
		for (var i = 0; i < sol.length; i++) {
			var move = sol[i];
			ret.push(["U", "R U", "F' U"][move[0]] + ["", "2", "2'", "'"][move[1]] + ["", " R'", " F"][move[0]]);
		}
		return ret.join(" ").replace(/ +/g, ' ');
	}

	scrMgr.reg('mlsll', getMinxLSScramble)
		('mgmpll', getMinxLSScramble)
		('mgmll', getMinxLSScramble);

})();

/* ==== scramble/megaminx.js ==== */
(function() {
	"use strict";

	function getKiloScramble() {
		var cc = new mgmsolver.MgmCubie();
		cc.corn = mathlib.rndPerm(20, true);
		var chksum = 60;
		for (var i = 0; i < 19; i++) {
			var t = mathlib.rn(3);
			cc.twst[i] = t;
			chksum -= t;
		}
		cc.twst[19] = chksum % 3;
		return mgmsolver.solveKlmCubie(cc, true);
	}

	function getMegaScramble() {
		var cc = new mgmsolver.MgmCubie();
		cc.corn = mathlib.rndPerm(20, true);
		cc.edge = mathlib.rndPerm(30, true);
		var chksum = 60;
		for (var i = 0; i < 19; i++) {
			var t = mathlib.rn(3);
			cc.twst[i] = t;
			chksum -= t;
		}
		cc.twst[19] = chksum % 3;
		chksum = 0;
		for (var i = 0; i < 29; i++) {
			var t = mathlib.rn(2);
			cc.flip[i] = t;
			chksum ^= t;
		}
		cc.flip[29] = chksum;
		return mgmsolver.solveMgmCubie(cc, true);
	}

	scrMgr.reg('klmso', getKiloScramble)
			  ('mgmso', getMegaScramble);
})();

/* ==== scramble/scramble_fto.js ==== */
(function() {
	"use strict";

	var l3t_cp = [0x543210, 0x543102, 0x543021];
	var l3t_base = [
		[0x0, 0xba9876543210, 1, "O"],
		[0x0, 0x7a98b6543120, 3, "Oc"],
		[0x0, 0x3a98b6547210, 1, "Oa"],
		[0x0, 0x7a983654b210, 1, "Ob"],
		[0x110, 0xba9876543210, 3, "V"],
		[0x110, 0x7a98b6543120, 9, "Vc"],
		[0x110, 0x3a98b6547210, 3, "Va"],
		[0x110, 0x7a983654b210, 3, "Vb"],
		[0x0, 0xba9876541320, 9, "Q"],
		[0x0, 0x7a98b6542310, 9, "Qc"],
		[0x0, 0xba9826547310, 9, "Qa"],
		[0x0, 0x1a98b6547320, 9, "Qb"],
		[0x0, 0x7a981654b320, 9, "Qr"],
		[0x0, 0x2a987654b310, 9, "Ql"],
		[0x110, 0xba9876541320, 9, "W"],
		[0x110, 0x7a98b6542310, 9, "Wc"],
		[0x110, 0xba9826547310, 9, "Wa"],
		[0x110, 0x1a98b6547320, 9, "Wb"],
		[0x110, 0x7a981654b320, 9, "Wr"],
		[0x110, 0x2a987654b310, 9, "Wl"],
		[0x110, 0xba9876542130, 9, "J"],
		[0x110, 0x7a98b6541230, 9, "Jc"],
		[0x110, 0xba9816547230, 9, "Ja"],
		[0x110, 0x2a98b6547130, 9, "Jb"],
		[0x110, 0x7a982654b130, 9, "Jr"],
		[0x110, 0x1a987654b230, 9, "Jl"],
		[0x110, 0xba9876541203, 9, "L"],
		[0x110, 0x7a98b6542103, 9, "Lc"],
		[0x110, 0xba9826547103, 9, "La"],
		[0x110, 0x1a98b6547203, 9, "Lb"],
		[0x110, 0x7a981654b203, 9, "Lr"],
		[0x110, 0x2a987654b103, 9, "Ll"],
		[0x0, 0xba9826541730, 9, "B"],
		[0x0, 0x1a98b6542730, 9, "Bc"],
		[0x0, 0x2a981654b730, 9, "Ba"],
		[0x0, 0x7a9816542b30, 9, "Bb"],
		[0x0, 0x2a9876541b30, 9, "Br"],
		[0x0, 0x1a9826547b30, 9, "Bl"],
		[0x110, 0xba9826541730, 9, "T"],
		[0x110, 0x1a98b6542730, 9, "Tc"],
		[0x110, 0x2a981654b730, 9, "Ta"],
		[0x110, 0x7a9816542b30, 9, "Tb"],
		[0x110, 0x2a9876541b30, 9, "Tr"],
		[0x110, 0x1a9826547b30, 9, "Tl"],
		[0x110, 0xba9816542703, 9, "Z"],
		[0x110, 0x2a98b6541703, 9, "Zc"],
		[0x110, 0x1a982654b703, 9, "Za"],
		[0x110, 0x7a9826541b03, 9, "Zb"],
		[0x110, 0x1a9876542b03, 9, "Zr"],
		[0x110, 0x2a9816547b03, 9, "Zl"],
		[0x110, 0xba9826541073, 9, "S"],
		[0x110, 0x1a98b6542073, 9, "Sc"],
		[0x110, 0x2a981654b073, 9, "Sa"],
		[0x110, 0x7a98165420b3, 9, "Sb"],
		[0x110, 0x2a98765410b3, 9, "Sr"],
		[0x110, 0x1a98265470b3, 9, "Sl"],
		[0x0, 0x1a9826540b73, 3, "X"],
		[0x0, 0x2a98165407b3, 3, "Xb"],
		[0x110, 0x1a9826540b73, 9, "Y"],
		[0x110, 0x2a98165407b3, 9, "Yb"]
	];
	// count 60


	var ep0 = 0xba9876543210;
	var cp0 = 0x543210;
	var co0 = 0x000000;
	var uf0 = 0xba9876543210;
	var rl0 = 0xba9876543210;
	var epf = 0xffffffffffff;
	var cpf = 0xffffff;
	var cof = 0xffffff;
	var uff = 0xffffffffffff;
	var rlf = 0xffffffffffff;
	var tcpco = 0x000110;
	var l4tcp = 0x54ffff;
	var l4tco = 0x00ffff;
	var l4tuf = 0xfaf8ff54ffff;

	function parseMask(mask, len) {
		var ret = [];
		for (var i = 0; i < len; i++) {
			var val = mask & 0xf;
			ret[i] = val == 15 ? -1 : val == 14 ? -2 : val;
			mask /= 16;
		}
		return ret;
	}

	function fixPerm(arr) {
		var val = [];
		var free = [];
		for (var i = 0; i < arr.length; i++) {
			val[i] = i;
		}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == -1) {
				free.push(i);
			} else {
				val[arr[i]] = -1;
			}
		}
		for (var i = 0, j = 0; i < val.length; i++) {
			if (val[i] != -1) {
				val[j++] = val[i];
			}
		}
		var cntU = free.length;
		for (var i = 0; i < free.length; i++) {
			var r = mathlib.rn(cntU);
			arr[free[i]] = val[r];
			for (var j = r; j < cntU - 1; j++) {
				val[j] = val[j + 1];
			}
			cntU--;
		}
		if (free.length > 1 && mathlib.getNParity(mathlib.getNPerm(arr, arr.length), arr.length) != 0) {
			var temp = arr[free[0]];
			arr[free[0]] = arr[free[1]];
			arr[free[1]] = temp;
		}
	}

	function fixOri(arr, base) {
		var cntU = 0;
		var sum = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == -1) {
				cntU++;
			} else {
				sum += arr[i];
			}
		}
		sum %= base;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == -1) {
				if (cntU-- == 1) {
					arr[i] = (base - sum) % base;
				} else {
					arr[i] = mathlib.rn(base);
					sum = (sum + arr[i]) % base;
				}
			}
		}
	}

	function genL3TMap() {
		var ret = [];
		for (var i = 0; i < l3t_base.length; i++) {
			var co = l3t_base[i][0];
			var uf = l3t_base[i][1];
			var probs = l3t_base[i][2];
			var base = l3t_base[i][3];
			for (var k = 0; k < 3; k++) {
				var cp = l3t_cp[k];
				if (cp == 0x543210 && co == 0 && uf == 0xba9876543210) {
					continue;
				}
				var name = base.charAt(0) + '-' + base + (k == 0 ? '' : k == 1 ? '+' : '-');
				ret.push([cp, co, uf, probs, name]);
			}
		}
		return ret;
	}

	var l3t_map = genL3TMap();
	var l3tprobs = mathlib.idxArray(l3t_map, 3);
	var l3tfilter = mathlib.idxArray(l3t_map, 4);

	function genTCPMap() {
		var ret = [];
		for (var i = 0; i < l3t_map.length; i++) {
			var name = l3t_map[i][4];
			if (name.charAt(0) != 'T') {
				continue;
			}
			var base = name.slice(2);
			var suffix = '';
			var last = base.charAt(base.length - 1);
			if (last == '+' || last == '-') {
				suffix = last;
				base = base.slice(0, -1);
			}
			ret.push([l3t_map[i][0], l3t_map[i][2], 1, base + '-' + base + suffix, i]);
		}
		return ret;
	}

	var tcp_map = genTCPMap();
	var tcpprobs = mathlib.idxArray(tcp_map, 2);
	var tcpfilter = mathlib.idxArray(tcp_map, 3);
	var tcp_l3t = mathlib.idxArray(tcp_map, 4);

	function getAnyState(_ep, _cp, _co, _uf, _rl, auf) {
		var ep = parseMask(_ep, 12);
		var cp = parseMask(_cp, 6);
		var co = parseMask(_co, 6);
		var uf = parseMask(_uf, 12);
		var rl = parseMask(_rl, 12);
		fixPerm(ep);
		fixPerm(cp);
		fixOri(co, 2);
		fixPerm(uf);
		fixPerm(rl);
		var cc = new ftosolver.FtoCubie(cp, co, ep, uf, rl);
		if (auf) {
			var a = mathlib.rn(3);
			var b = mathlib.rn(3);
			cc = ftosolver.FtoCubie.FtoMult(ftosolver.FtoCubie.symCube[a], cc, null);
			for (var i = 0; i < b; i++) {
				cc = ftosolver.FtoCubie.FtoMult(cc, ftosolver.FtoCubie.moveCube[0], null);
			}
			cc = ftosolver.FtoCubie.FtoMult(cc, ftosolver.FtoCubie.symCube[(3 - a) % 3], null);
		}
		return cc;
	}

	function getAnyScramble(_ep, _cp, _co, _uf, _rl, auf) {
		var solution;
		do {
			var cc = getAnyState(_ep, _cp, _co, _uf, _rl, auf);
			solution = ftosolver.solveFacelet(cc.toFaceCube(), true);
		} while (solution.length <= 3);
		return solution;
	}

	function getL3TScramble(type, length, cases) {
		var l3tcase = l3t_map[scrMgr.fixCase(cases, l3tprobs)] || l3t_map[0];
		return getAnyScramble(ep0, l3tcase[0], l3tcase[1], l3tcase[2], rl0, true);
	}

	function getL4TScramble() {
		return getAnyScramble(ep0, l4tcp, l4tco, l4tuf, rl0, true);
	}

	function getTCPScramble(type, length, cases) {
		return getL3TScramble(type, length, tcp_l3t[scrMgr.fixCase(cases, tcpprobs)]);
	}

	function getL3TImage(cases, img) {
		var l3tcase = l3t_map[cases];
		if (l3tcase) {
			image.ftollImage.drawFace(getAnyState(ep0, l3tcase[0], l3tcase[1], l3tcase[2], rl0, false).toFaceCube(), img);
		}
	}

	function getTCPImage(cases, img) {
		var tcpcase = tcp_map[cases];
		if (tcpcase) {
			image.ftollImage.drawFace(getAnyState(ep0, tcpcase[0], tcpco, tcpcase[1], rl0, false).toFaceCube(), img);
		}
	}


	scrMgr.reg('ftoso', getAnyScramble.bind(null, epf, cpf, cof, uff, rlf, false))
		('ftol3t', getL3TScramble, [l3tfilter, l3tprobs, getL3TImage])
		('ftol4t', getL4TScramble)
		('ftotcp', getTCPScramble, [tcpfilter, tcpprobs, getTCPImage])
		('ftoedge', getAnyScramble.bind(null, epf, cp0, co0, uf0, rl0, false))
		('ftocent', getAnyScramble.bind(null, ep0, cp0, co0, uff, rlf, false))
		('ftocorn', getAnyScramble.bind(null, ep0, cpf, cof, uf0, rl0, false));
})();

/* ==== scramble/redi.js ==== */
var redi = (function() {
	var edgeMoveSwaps = [
		[1, 0, 8], // F
		[2, 1, 9], // L
		[3, 2, 10], // B
		[0, 3, 11], // R
		[4, 5, 8], // f
		[5, 6, 9], // l
		[6, 7, 10], // b
		[7, 4, 11]  // r
	];

	var edgeMoveSwaps2 = [
		[1, 0, 4], // F
		[2, 1, 5], // L
		[3, 2, 6], // B
		[0, 3, 7]  // R
	];

	function phase2EdgeMove(arr, move) {
		mathlib.acycle(arr, edgeMoveSwaps2[move], 1);
	}

	function phase2CornMove(arr, move) {
		arr[move] = (arr[move] + 1) % 3;
	}

	function getEdgeComb(target, ep) {
		var idxComb = 0;
		var permR = [];
		var r = 4;
		for (var i = 11; i >= 0; i--) {
			if ((ep[i] & 0xc) == target) {
				idxComb += mathlib.Cnk[i][r--];
				permR[r] = ep[i] & 0x3;
			}
		}
		return idxComb * 24 + mathlib.getNPerm(permR, 4);
	}

	function setPhase1EdgeComb(ep, idx) {
		var fill = 11;
		var r = 4;
		for (var i = 11; i >= 0; i--) {
			if (idx >= mathlib.Cnk[i][r]) {
				idx -= mathlib.Cnk[i][r--];
				ep[i] = r + 4;
			} else {
				ep[i] = fill--;
				if ((fill & 0xc) == 4) {
					fill -= 4;
				}
			}
		}
		return ep;
	}

	function phase1EdgeCombMove(idx, move) {
		var ep = setPhase1EdgeComb([], idx);
		mathlib.acycle(ep, edgeMoveSwaps[move], 1);
		return getEdgeComb(4, ep);
	}

	function doEdge4Move(idx, move) {
		var slice = ~~(idx / 24);
		var perm = idx % 24;
		var val = edgeCombMove[move][slice];
		slice = ~~(val / 24);
		perm = perm4Mult[perm][val % 24];
		return slice * 24 + perm;
	}

	function phase1CornMove(idx, move) {
		if (move < 4) {
			return idx;
		}
		var co = cornCoord.set([], idx);
		co[move - 4] = (co[move - 4] + 1) % 3;
		return cornCoord.get(co);
	}

	function prettySolution(sol) {
		var ret = [];
		for (var i = 0; i < sol.length; i++) {
			ret.push('FLBRflbr'[sol[i][0]] + ["", "'"][sol[i][1]]);
		}
		return ret.join(' ');
	}

	var perm4Mult = [];
	var edgeCombMove = [];
	var cornMove = [];
	var cornCoord = null;
	var phase1EdgePrun = [];
	var phase1CornPrun = [];
	var dinoEdgePruns = [[], phase1EdgePrun, []];
	var solvRedi1 = null;
	var solvRedi2 = null;
	var solvDino = null;

	function initDino() { // edge-only
		if (solvDino) {
			return;
		}
		var perm1 = [];
		var perm2 = [];
		var perm3 = [];
		for (var i = 0; i < 24; i++) {
			perm4Mult[i] = [];
			mathlib.setNPerm(perm1, i, 4);
			for (var j = 0; j < 24; j++) {
				mathlib.setNPerm(perm2, j, 4);
				for (var k = 0; k < 4; k++) {
					perm3[k] = perm1[perm2[k]];
				}
				perm4Mult[i][j] = mathlib.getNPerm(perm3, 4);
			}
		}
		mathlib.createMove(edgeCombMove, 495, phase1EdgeCombMove, 8);
		mathlib.createPrun(dinoEdgePruns[0], 0, 495 * 24, 8, doEdge4Move, 8, 2);
		mathlib.createPrun(dinoEdgePruns[1], 1656, 495 * 24, 8, doEdge4Move, 8, 2);
		mathlib.createPrun(dinoEdgePruns[2], 11856, 495 * 24, 8, doEdge4Move, 8, 2);

		solvDino = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(dinoEdgePruns[0], idx[0]),
				mathlib.getPruning(dinoEdgePruns[1], idx[1]),
				mathlib.getPruning(dinoEdgePruns[2], idx[2])
			);
		}, function(idx, move) {
			var idx1 = [
				doEdge4Move(idx[0], move),
				doEdge4Move(idx[1], move),
				doEdge4Move(idx[2], move)
			];
			if (idx1[0] == idx[0] && idx1[1] == idx[1] && idx1[2] == idx[2]) {
				return null;
			}
			return idx1;
		}, 8, 2);
	}

	function initRedi() {
		if (solvRedi1) {
			return;
		}
		cornCoord = new mathlib.Coord('o', 4, 3);
		mathlib.createMove(cornMove, 81, phase1CornMove, 8);
		mathlib.createPrun(phase1CornPrun, 0, 81, 4, cornMove, 8, 2);

		solvRedi1 = new mathlib.Searcher(null, function(idx) {
			return Math.max(
				mathlib.getPruning(phase1CornPrun, idx[0]),
				mathlib.getPruning(phase1EdgePrun, idx[1])
			);
		}, function(idx, move) {
			var idx1 = [cornMove[move][idx[0]], doEdge4Move(idx[1], move)];
			if (idx1[0] == idx[0] && idx1[1] == idx[1]) {
				return null;
			}
			return idx1;
		}, 8, 2);

		solvRedi2 = new mathlib.Solver(4, 2, [
			[0, [phase2CornMove, 'o', 4, 3], 81],
			[0, [phase2EdgeMove, 'p', 8, -1], 20160]
		]);
	}

	function solveRedi(ep, co) {
		var p1eidx = getEdgeComb(4, ep);
		var p1cidx = cornCoord.get(co.slice(4));
		var sol1 = solvRedi1.solve([p1cidx, p1eidx], 0, 15);

		for (var i = 0; i < sol1.length; i++) {
			var axis = sol1[i][0];
			var pow = sol1[i][1] + 1;
			mathlib.acycle(ep, edgeMoveSwaps[axis], pow);
			co[axis] = (co[axis] + pow) % 3;
		}
		var ep2 = [];
		for (var i = 0; i < 8; i++) {
			var j = i < 4 ? i : i + 4;
			ep2[i] = ep[j] < 4 ? ep[j] : ep[j] - 4;
		}
		var p2eidx = mathlib.getNPerm(ep2, 8, -1);
		var p2cidx = cornCoord.get(co);
		var sol2 = solvRedi2.search([p2cidx, p2eidx], 0);
		return prettySolution([].concat(sol1, sol2));
	}

	function solveDino(ep, minl) {
		var idx = [
			getEdgeComb(0, ep),
			getEdgeComb(4, ep),
			getEdgeComb(8, ep)
		];
		var sol = solvDino.solve(idx, minl, 15);
		return prettySolution(sol);
	}

	function testRedi() {
		initRedi();
		var scramble = [];
		for (var i = 0; i < 20; i++) {
			scramble.push([~~(Math.random() * 8), ~~(Math.random() * 2)]);
		}
		var ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		var co = [0, 0, 0, 0, 0, 0, 0, 0];
		for (var i = 0; i < scramble.length; i++) {
			var axis = scramble[i][0];
			var pow = scramble[i][1] + 1;
			mathlib.acycle(ep, edgeMoveSwaps[axis], pow);
			co[axis] = (co[axis] + pow) % 3;
		}
		console.log(prettySolution(scramble) + '   ' + solveRedi(ep, co));
	}

	function testDino() {
		initDino();
		var scramble = [];
		for (var i = 0; i < 20; i++) {
			scramble.push([~~(Math.random() * 8), ~~(Math.random() * 2)]);
		}
		var ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		for (var i = 0; i < scramble.length; i++) {
			var axis = scramble[i][0];
			var pow = scramble[i][1] + 1;
			mathlib.acycle(ep, edgeMoveSwaps[axis], pow);
		}
		console.log(prettySolution(scramble) + '   ' + solveDino(ep));
	}

	function getRandomScramble(type) {
		initDino();
		if (type == 'rediso') {
			initRedi();
		}
		var ep = mathlib.rndPerm(12, true);
		var co = [];
		for (var i = 0; i < 8; i++) {
			co[i] = mathlib.rn(3);
		}
		if (type == 'rediso') {
			return solveRedi(ep, co);
		} else if (type == 'dinoso') {
			return solveDino(ep, 10);
		} else { // dinoo
			return solveDino(ep, 0);
		}
	}

	scrMgr.reg('rediso', getRandomScramble)
		('dinoo', getRandomScramble)
		('dinoso', getRandomScramble);

	return {
		solveRedi: solveRedi,
		getRandomScramble: getRandomScramble,
		testRedi: testRedi,
		testDino: testDino
	}
})();

/* ==== scramble/slide.js ==== */
var slideCube = (function() {
	var sol;

	function slideMove(state, m) {
		var blank = state.indexOf('-');
		var x = blank >> 2;
		var y = blank & 3;

		var ret = state.split('');
		var ori = m[0];
		var target = ~~m[1];
		var arr = [x << 2 | y];
		if (ori == 'V') {
			if (ret[x << 2 | target] == '$') {
				return null;
			}
			var inc = y > target ? -1 : 1;
			while (y != target) {
				y += inc;
				arr.push(x << 2 | y);
			}
		} else {
			if (ret[target << 2 | y] == '$') {
				return null;
			}
			var inc = x > target ? -1 : 1;
			while (x != target) {
				x += inc;
				arr.push(x << 2 | y);
			}
		}
		arr.reverse();
		mathlib.acycle(ret, arr);
		return ret.join('');
	}

	function mirror(perm) {
		var ret = [];
		var mirrorPerm = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
		for (var i = 0; i < 16; i++) {
			ret[i] = mirrorPerm[perm[mirrorPerm[i]]];
		}
		return ret;
	}

	function fixBlank(state) {
		var ret = [];
		state = state.split('');
		for (var i = 0; i < state.length; i++) {
			if (state[i] == '?') {
				state[i] = '-';
				ret.push(state.join(''));
				state[i] = '?';
			}
		}
		return ret;
	}

	var moves = {
		'V0': 0x0,
		'V1': 0x0,
		'V2': 0x0,
		'V3': 0x0,
		'H0': 0x1,
		'H1': 0x1,
		'H2': 0x1,
		'H3': 0x1
	};

	var solv1 = new mathlib.gSolver(
		fixBlank('0123????????????'),
		slideMove,
		moves
	);

	var solv2 = new mathlib.gSolver(
		fixBlank('$$$$4???8???c???'),
		slideMove,
		moves
	);

	var solv3 = new mathlib.gSolver(
		['$$$$$567$9ab$de-'],
		slideMove,
		moves
	);

	function stateInit(state, perm) {
		var ret = [];
		for (var i = 0; i < perm.length; i++) {
			ret[i] = state[perm[i]];
		}
		state = ret.join('');
		for (var i = 0; i < sol.length; i++) {
			state = slideMove(state, sol[i]);
		}
		return state
	}

	function randPerm(size) {
		var perm = [];
		var inv;
		do {
			perm = mathlib.rndPerm(size * size);
			inv = (size - 1 - ~~(perm.indexOf(perm.length - 1) / size)) * (size - 1);
			for (var i = 0; i < perm.length; i++) {
				for (var j = i + 1; j < perm.length; j++) {
					if (perm[i] > perm[j] && perm[i] != perm.length - 1) {
						inv++;
					}
				}
			}
		} while (inv % 2 != 0);
		return perm;
	}

	function prettySol(settings, size, midx) {
		var ret = [];
		var moveRef = midx == 1 ? 'VH' : 'HV';
		var symbol = settings.indexOf('a') == -1 ? ['DR', 'UL'] : ['\uFFEC\uFFEB', '\uFFEA\uFFE9'];
		var isBlankMove = settings.indexOf('m') != -1;
		var compress = settings.indexOf('p') != -1;
		var pos = [-1, -1];
		for (var i = 0; i < sol.length; i++) {
			var val = ~~sol[i][1];
			var m = moveRef.indexOf(sol[i][0]);
			if (pos[m] == -1 || pos[m] == val) {
				pos[m] = val;
				continue;
			}
			if (ret.length > 0 && ret.at(-1)[0] == m) {
				var move = ret.at(-1);
				move[1] += val - pos[m];
				if (move[1] == 0) {
					ret.pop();
				}
			} else {
				ret.push([m, val - pos[m]]);
			}
			pos[m] = val;
		}
		for (var i = 0; i < ret.length; i++) {
			var move = ret[i];
			var axis = symbol[isBlankMove != (move[1] > 0) ? 0 : 1][move[0]];
			var pow = Math.abs(move[1]);
			ret[i] = [];
			if (compress) {
				ret[i].push(axis + pow);
			} else {
				while (pow-- > 0) {
					ret[i].push(axis);
				}
			}
			ret[i] = ret[i].join(' ');
		}
		ret.reverse();
		return ret.join(' ').replace(/1/g, '');
	}

	function getScramble(size, type) {
		var t = +new Date;
		var perm = [];
		var midx = 0;
		if (size == 4) {
			perm[0] = randPerm(4);
			perm[1] = mirror(perm[0]);
			out: for (var d = 0; d < 99; d++) {
				for (midx = 0; midx < 2; midx++) {
					var blank = perm[midx].indexOf(perm[midx].length - 1);
					sol = ['V' + (blank & 3), 'H' + (blank >> 2)];
					var sol1 = solv1.search(stateInit('0123???????????-', perm[midx]), d, d);
					if (sol1) {
						sol = sol.concat(sol1);
						break out;
					}
				}
			}
			var sol2 = solv2.search(stateInit('01234???8???c??-', perm[midx]).replace(/[0123]/g, '$'), 0);
			sol = sol.concat(sol2);
		} else if (size == 3) {
			var perm8 = randPerm(3);
			var slide8 = [5, 6, 7, 9, 10, 11, 13, 14, 15];
			for (var i = 0; i < 16; i++) {
				perm[i] = slide8[perm8[slide8.indexOf(i)]] || i;
			}
			var blank = perm.indexOf(perm.length - 1);
			sol = ['V' + (blank & 3), 'H' + (blank >> 2)];
			perm = [perm];
		}
		var sol3 = solv3.search(stateInit('0123456789abcde-', perm[midx]).replace(/[012348c]/g, '$'), 0);
		sol = sol.concat(sol3);
		DEBUG && console.log('[15p solver]', midx, stateInit('0123456789abcde-', perm[midx]), sol.join(''), sol.length, +new Date - t);
		return prettySol(type.slice(size == 3 ? 3 : 4), 4, midx);
	}
	scrMgr.reg(['15prp', '15prap', '15prmp'], getScramble.bind(null, 4))
		(['8prp', '8prap', '8prmp'], getScramble.bind(null, 3));

})();

/* ==== scramble/utilscramble.js ==== */
"use strict";

(function(rn, rndEl, mega) {
	var cubesuff = ["", "2", "'"];
	var minxsuff = ["", "2", "'", "2'"];
	var seq = [];
	var p = [];

	function adjScramble(faces, adj, len, suffixes, probs) {
		suffixes = suffixes || [""];
		var used = 0;
		var face;
		var ret = [];
		for (var j = 0; j < len; j++) {
			do {
				face = probs ? mathlib.rndProb(probs) : rn(faces.length);
			} while ((used >> face) & 1);
			ret.push(faces[face] + rndEl(suffixes));
			used &= ~adj[face];
			used |= 1 << face;
		}
		return ret.join(" ");
	}

	function yj4x4(type, len) {
		// the idea is to keep the fixed center on U and do Rw or Lw, Fw or Bw, to not disturb it
		var turns = [
			["U", "D"],
			["R", "L", "r"],
			["F", "B", "f"]
		];
		var donemoves = [];
		var lastaxis;
		var fpos = 0; // 0 = Ufr, 1 = Ufl, 2 = Ubl, 3 = Ubr
		var j, k;
		var s = "";
		lastaxis = -1;
		for (j = 0; j < len; j++) {
			var done = 0;
			do {
				var first = rn(turns.length);
				var second = rn(turns[first].length);
				if (first != lastaxis || donemoves[second] == 0) {
					if (first == lastaxis) {
						donemoves[second] = 1;
						var rs = rn(cubesuff.length);
						if (first == 0 && second == 0) {
							fpos = (fpos + 4 + rs) % 4;
						}
						if (first == 1 && second == 2) { // r or l
							if (fpos == 0 || fpos == 3) s += "l" + cubesuff[rs] + " ";
							else s += "r" + cubesuff[rs] + " ";
						} else if (first == 2 && second == 2) { // f or b
							if (fpos == 0 || fpos == 1) s += "b" + cubesuff[rs] + " ";
							else s += "f" + cubesuff[rs] + " ";
						} else {
							s += turns[first][second] + cubesuff[rs] + " ";
						}
					} else {
						for (k = 0; k < turns[first].length; k++) {
							donemoves[k] = 0;
						}
						lastaxis = first;
						donemoves[second] = 1;
						var rs = rn(cubesuff.length);
						if (first == 0 && second == 0) {
							fpos = (fpos + 4 + rs) % 4;
						}
						if (first == 1 && second == 2) { // r or l
							if (fpos == 0 || fpos == 3) s += "l" + cubesuff[rs] + " ";
							else s += "r" + cubesuff[rs] + " ";
						} else if (first == 2 && second == 2) { // f or b
							if (fpos == 0 || fpos == 1) s += "b" + cubesuff[rs] + " ";
							else s += "f" + cubesuff[rs] + " ";
						} else {
							s += turns[first][second] + cubesuff[rs] + " ";
						}
					}
					done = 1;
				}
			} while (done == 0);
		}
		return s;
	}

	scrMgr.reg('444yj', yj4x4);

	function bicube(type, len) {
		function canMove(face) {
			var u = [],
				i, j, done, z = 0;
			for (i = 0; i < 9; i++) {
				done = 0;
				for (j = 0; j < u.length; j++) {
					if (u[j] == start[d[face][i]]) done = 1;
				}
				if (done == 0) {
					u[u.length] = start[d[face][i]];
					if (start[d[face][i]] == 0) z = 1;
				}
			}
			return (u.length == 5 && z == 1);
		}

		function doMove(face, amount) {
			for (var i = 0; i < amount; i++) {
				var t = start[d[face][0]];
				start[d[face][0]] = start[d[face][6]];
				start[d[face][6]] = start[d[face][4]];
				start[d[face][4]] = start[d[face][2]];
				start[d[face][2]] = t;
				t = start[d[face][7]];
				start[d[face][7]] = start[d[face][5]];
				start[d[face][5]] = start[d[face][3]];
				start[d[face][3]] = start[d[face][1]];
				start[d[face][1]] = t;
			}
		}

		var d = [
			[0, 1, 2, 5, 8, 7, 6, 3, 4],
			[6, 7, 8, 13, 20, 19, 18, 11, 12],
			[0, 3, 6, 11, 18, 17, 16, 9, 10],
			[8, 5, 2, 15, 22, 21, 20, 13, 14]
		];
		var start = [1, 1, 2, 3, 3, 2, 4, 4, 0, 5, 6, 7, 8, 9, 10, 10, 5, 6, 7, 8, 9, 11, 11],
			move = "UFLR",
			s = "",
			arr = [],
			poss, done, i, j, x, y;
		while (arr.length < len) {
			poss = [1, 1, 1, 1];
			for (j = 0; j < 4; j++) {
				if (poss[j] == 1 && !canMove(j))
					poss[j] = 0;
			}
			done = 0;
			while (done == 0) {
				x = rn(4);
				if (poss[x] == 1) {
					y = rn(3) + 1;
					doMove(x, y);
					done = 1;
				}
			}
			arr[arr.length] = [x, y];
			if (arr.length >= 2) {
				if (arr.at(-1)[0] == arr.at(-2)[0]) {
					arr.at(-2)[1] = (arr.at(-2)[1] + arr.at(-1)[1]) % 4;
					arr = arr.slice(0, arr.length - 1);
				}
			}
			if (arr.length >= 1) {
				if (arr.at(-1)[1] == 0) {
					arr = arr.slice(0, arr.length - 1);
				}
			}
		}
		for (i = 0; i < len; i++) {
			s += move[arr[i][0]] + cubesuff[arr[i][1] - 1] + " ";
		}
		return s;
	}

	scrMgr.reg('bic', bicube);



	// Clock functions.
	function c(s) {
		var array = [s + "=0", s + "+1", s + "+2", s + "+3", s + "+4", s + "+5", s + "+6", s + "-5", s + "-4", s + "-3", s + "-2", s + "-1"];
		return " " + rndEl(array) + " ";
	}

	function c2() {
		return rndEl(["U", "d"]) + rndEl(["U", "d"]);
	}

	function c3() {
		return "     "
	}

	function do15puzzle(mirrored, len, arrow, tiny) {
		var moves = (mirrored ? ["U", "L", "R", "D"] : ["D", "R", "L", "U"]);
		var effect = [
			[0, -1],
			[1, 0],
			[-1, 0],
			[0, 1]
		];
		var x = 0,
			y = 3,
			r, lastr = 5,
			ret = [];
		for (var i = 0; i < len; i++) {
			do {
				r = rn(4);
			} while (x + effect[r][0] < 0 || x + effect[r][0] > 3 || y + effect[r][1] < 0 || y + effect[r][1] > 3 || r + lastr == 3);
			x += effect[r][0];
			y += effect[r][1];
			if (ret.length > 0 && ret.at(-1)[0] == r) {
				ret.at(-1)[1]++;
			} else {
				ret.push([r, 1]);
			}
			lastr = r;
		}
		var retstr = '';
		for (var i = 0; i < ret.length; i++) {
			var m = mirrored ? ret[i][0] : (3 - ret[i][0]);
			m = (arrow ? "\uFFEA\uFFE9\uFFEB\uFFEC" : "ULRD").charAt(m);
			if (tiny) {
				retstr += m + (ret[i][1] == 1 ? '' : ret[i][1]) + ' ';
			} else {
				for (var j = 0; j < ret[i][1]; j++) {
					retstr += m + ' ';
				}
			}
		}
		return retstr;
	}

	function pochscramble(x, y) {
		var ret = "";
		var i, j;
		for (i = 0; i < y; i++) {
			ret += "  ";
			for (j = 0; j < x; j++) {
				ret += (j % 2 == 0 ? "R" : "D") + rndEl(["++", "--"]) + " ";
			}
			ret += "U" + (ret.endsWith("-- ") ? "'\\n" : "~\\n");
		}
		return ret;
	}

	function carrotscramble(x, y) {
		var ret = "";
		var i, j;
		for (i = 0; i < y; i++) {
			ret += " ";
			for (j = 0; j < x / 2; j++) {
				ret += rndEl(["+", "-"]) + rndEl(["+", "-"]) + " ";
			}
			ret += "U" + (ret.endsWith("- ") ? "'\\n" : "~\\n");
		}
		return ret;
	}

	function gigascramble(len) {
		var ret = "";
		var i, j;
		for (i = 0; i < Math.ceil(len / 10); i++) {
			ret += "  ";
			for (j = 0; j < 10; j++) {
				ret += (j % 2 == 0 ? ("Rr".charAt(rn(2))) : ("Dd".charAt(rn(2)))) + rndEl(["+ ", "++", "- ", "--"]) + " ";
			}
			ret += "y" + rndEl(minxsuff).padEnd(2, '~') + "\\n";
		}
		return ret;
	}

	function sq1_scramble(type, len) {
		seq = [];
		var i, k;
		sq1_getseq(1, type, len);
		var s = "";
		for (i = 0; i < seq[0].length; i++) {
			k = seq[0][i];
			if (k[0] == 7) {
				s += "/";
			} else {
				s += " (" + k[0] + "," + k[1] + ")";
			}
		}
		return s;
	}

	function ssq1t_scramble(len) {
		seq = [];
		var i;
		sq1_getseq(2, 0, len);
		var s = seq[0],
			t = seq[1],
			u = "";
		if (s[0][0] == 7) s = [
			[0, 0]
		].concat(s);
		if (t[0][0] == 7) t = [
			[0, 0]
		].concat(t);
		for (i = 0; i < len; i++) {
			u += "(" + s[2 * i][0] + "," + t[2 * i][0] + "," + t[2 * i][1] + "," + s[2 * i][1] + ")/ ";
		}
		return u;
	}

	function sq1_getseq(num, type, len) {
		for (var n = 0; n < num; n++) {
			p = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
			seq[n] = [];
			var cnt = 0;
			while (cnt < len) {
				var x = rn(12) - 5;
				var y = (type == 2) ? 0 : rn(12) - 5;
				var size = (x == 0 ? 0 : 1) + (y == 0 ? 0 : 1);
				if ((cnt + size <= len || type != 1) && (size > 0 || cnt == 0)) {
					if (sq1_domove(x, y)) {
						if (type == 1) cnt += size;
						if (size > 0) seq[n][seq[n].length] = [x, y];
						if (cnt < len || type != 1) {
							cnt++;
							seq[n][seq[n].length] = [7, 0];
							sq1_domove(7, 0);
						}
					}
				}
			}
		}
	}

	function sq1_domove(x, y) {
		var i, px, py;
		if (x == 7) {
			for (i = 0; i < 6; i++) {
				mathlib.circle(p, i + 6, i + 12);
			}
			return true;
		} else {
			if (p[(17 - x) % 12] || p[(11 - x) % 12] || p[12 + (17 - y) % 12] || p[12 + (11 - y) % 12]) {
				return false;
			} else {
				// do the move itself
				px = p.slice(0, 12);
				py = p.slice(12, 24);
				for (i = 0; i < 12; i++) {
					p[i] = px[(12 + i - x) % 12];
					p[i + 12] = py[(12 + i - y) % 12];
				}
				return true;
			}
		}
	}

	function moyuRedi(length) {
		var ret = [];
		for (var i = 0; i < length; i++) {
			ret.push(mega([
				["R"],
				["L"]
			], ["", "'"], 3 + rn(3)));
		}
		return ret.join(' x ');
	}

	function addPyrTips(scramble, moveLen) {
		var cnt = 0;
		var rnd = [];
		for (var i = 0; i < 4; i++) {
			rnd[i] = rn(3);
			if (rnd[i] > 0) {
				rnd[i] = "ulrb".charAt(i) + ["! ", "' "][rnd[i] - 1];
				cnt++;
			} else {
				rnd[i] = "";
			}
		}
		return scramble.substr(0, scramble.length - moveLen * cnt) + " " + rnd.join("");
	}

	function PolyScrambler(puzzle, validMoves, move2str) {
		var pobj = poly3d.getFamousPuzzle(puzzle);
		puzzle = poly3d.makePuzzle.apply(poly3d, pobj.polyParam);
		var permLen = puzzle.moveTable[0].length;
		var e = [];
		for (var i = 0; i < permLen; i++) {
			e[i] = i;
		}
		var gens = [];
		for (var i = 0; i < validMoves.length; i++) {
			var move = pobj.parser.parseScramble(validMoves[i]);
			var perm = e.slice();
			for (var j = 0; j < move.length; j++) {
				var pow = move[j][1];
				if (pow == 0) {
					continue;
				}
				var operm = puzzle.moveTable[puzzle.getTwistyIdx(move[j][0])].slice();
				for (var k = 0; k < operm.length; k++) {
					operm[k] = operm[k] >= 0 ? operm[k] : k;
				}
				if (pow < 0) {
					operm = grouplib.permInv(operm);
					pow = -pow;
				}
				while (--pow >= 0) {
					perm = grouplib.permMult(perm, operm);
				}
			}
			gens.push(perm);
		}
		this.solv = new grouplib.SubgroupSolver(gens);
		this.move2str = move2str;
		this.moves = validMoves;
		this.solv.initTables();
		DEBUG && console.log('[scramble] Poly Scramble |G|=', this.solv.sgsG.size());
	}

	PolyScrambler.prototype.getScramble = function(minLen, maxLen) {
		var solution = "";
		do {
			var state = this.solv.sgsG.rndElem();
			var sol = this.solv.DissectionSolve(state, minLen, maxLen) || [];
			solution = sol.map((mvpow) => this.move2str(this.moves[mvpow[0]], mvpow[1])).join(" ");
		} while (solution.length <= 2);
		return solution.replace(/ +/g, ' ');
	}

	var polyObjs = {};

	function getPolyScrambler(puzzle, validMoves, move2str) {
		var key = JSON.stringify([puzzle, validMoves]);
		if (!(key in polyObjs)) {
			polyObjs[key] = new PolyScrambler(puzzle, validMoves, move2str);
		}
		return polyObjs[key];
	}

	function utilscramble(type, len) {
		var ret = "";
		switch (type) {
			case "15p": // 15 puzzle
				return do15puzzle(false, len);
			case "15pm": // 15 puzzle, mirrored
				return do15puzzle(true, len);
			case "15pat": // 15 puzzle
				return do15puzzle(false, len, true, true);
			case "clkwca": // Clock (WCA Notation)
			case "clkwcab": // Clock (WCA Notation with buttons)
			case "clknf": // Clock w/o flip
				var clkapp = ["0+", "1+", "2+", "3+", "4+", "5+", "6+", "1-", "2-", "3-", "4-", "5-"];
				ret = type == "clknf" ?
					"UR? DR? DL? UL? U(?,?) R(?,?) D(?,?) L(?,?) ALL? all?????":
					"UR? DR? DL? UL? U? R? D? L? ALL? y2 U? R? D? L? ALL?????";
				for (var i = 0; i < 14; i++) {
					ret = ret.replace('?', rndEl(clkapp));
				}
				if (type == "clkwca") {
					ret = ret.slice(0, -4);
				}
				return ret.replace('?', rndEl(["", " UR"])).replace('?', rndEl(["", " DR"])).replace('?', rndEl(["", " DL"])).replace('?', rndEl(["", " UL"]));
			case "clk": // Clock (Jaap order)
				return "UU" + c("u") + "dU" + c("u") + "dd" + c("u") + "Ud" + c("u") + "dU" + c("u") + "Ud" + c("u") + "UU" + c("u") + "UU" + c("u") + "UU" + c("u") + "dd" + c3() + c2() + "\\ndd" + c("d") + "dU" + c("d") + "UU" + c("d") + "Ud" + c("d") + "UU" + c3() + "UU" + c3() + "Ud" + c3() + "dU" + c3() + "UU" + c3() + "dd" + c("d") + c2();
			case "clkc": // Clock (concise)
				ret = "";
				for (var i = 0; i < 4; i++) ret += "(" + (rn(12) - 5) + ", " + (rn(12) - 5) + ") / ";
				for (var i = 0; i < 6; i++) ret += "(" + (rn(12) - 5) + ") / ";
				for (var i = 0; i < 4; i++) ret += rndEl(["d", "U"]);
				return ret;
			case "clke": // Clock (efficient order)
				return "UU" + c("u") + "dU" + c("u") + "dU" + c("u") + "UU" + c("u") + "UU" + c("u") + "UU" + c("u") + "Ud" + c("u") + "Ud" + c("u") + "dd" + c("u") + "dd" + c3() + c2() + "\\nUU" + c3() + "UU" + c3() + "dU" + c("d") + "dU" + c3() + "dd" + c("d") + "Ud" + c3() + "Ud" + c("d") + "UU" + c3() + "UU" + c("d") + "dd" + c("d") + c2();
			case "giga": // Gigaminx
				return gigascramble(len);
			case "mgmo": // Megaminx (old style)
				return adjScramble(["F", "B", "U", "D", "L", "DBR", "DL", "BR", "DR", "BL", "R", "DBL"], [0x554, 0xaa8, 0x691, 0x962, 0xa45, 0x58a, 0x919, 0x626, 0x469, 0x896, 0x1a5, 0x25a], len, minxsuff);
			case "mgms2l": // Megaminx (old style)
				return adjScramble(["F", "R", "BR", "BL", "L", "U"], [0x32, 0x25, 0x2a, 0x34, 0x29, 0x1f], len, minxsuff);
			case "mgmp": // Megaminx (Pochmann)
				return pochscramble(10, Math.ceil(len / 10));
			case "mgmc": // Megaminx (Carrot)
				return carrotscramble(10, Math.ceil(len / 10));
			case "klmp": // Kilominx (Pochmann)
				return pochscramble(10, Math.ceil(len / 10));
			case "heli":
			case "helicv":
				return adjScramble(["UF", "UR", "UB", "UL", "FR", "BR", "BL", "FL", "DF", "DR", "DB", "DL"], [0x09a, 0x035, 0x06a, 0x0c5, 0x303, 0x606, 0xc0c, 0x909, 0xa90, 0x530, 0xa60, 0x5c0], len);
			case "heli2x2":
				ret = adjScramble(['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR', 'UFR', 'UFL', 'UBL', 'UBR', 'DFR', 'DFL', 'DBL', 'DBR', 'U', 'R', 'F'], [0x2709000, 0x1703000, 0x3506000, 0x330c000, 0x2e90000, 0x1e30000, 0x3c60000, 0x3ac0000, 0x0f11000, 0x1d22000, 0x3944000, 0x2b88000, 0x0700103, 0x1500206, 0x310040c, 0x2300809, 0x0e00130, 0x1c00260, 0x38004c0, 0x2a00890, 0x360ff0f, 0x2d999bb, 0x1b33377, 0x36f0ff0, 0x2d666ee, 0x1bcccdd], len, null, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3]).split(' ');
				for (var i = 0; i < ret.length; i++) {
					if (ret[i].length == 3) {
						ret[i] += mathlib.rndEl(["", "'"]);
					} else if (ret[i].length == 1) {
						ret[i] += mathlib.rndEl(["", "'", "2"]);
					}
				}
				return ret.join(' ');
			case "heli2x2g":
				var lastMove = -1;
				ret = [];
				var cornMoves = ['UFR', 'UFL', 'UBL', 'UBR', 'DFR', 'DFL', 'DBL', 'DBR'];
				var edgeMoves = ['UF', 'UL', 'UB', 'UR', 'FR', 'FL', 'BL', 'BR', 'DF', 'DL', 'DB', 'DR'];
				var maxWidth = 0;
				for (var i = 0; i < len; i++) {
					var facePerm;
					do {
						facePerm = mathlib.rndPerm(3);
					} while (facePerm[0] == lastMove);
					lastMove = facePerm[2];
					var cornPerm = mathlib.rndPerm(8).slice(0, 4).sort();
					var edgePerm = mathlib.rndPerm(12).slice(0, mathlib.rn(2) + 6).sort(function(a, b) {return a - b;});
					var line = [];
					for (var j = 0; j < 3; j++) {
						line.push('URF'.charAt(facePerm[j]) + mathlib.rndEl([" ", "2", "'"]));
					}
					line.push('');
					for (var j = 0; j < cornPerm.length; j++) {
						line.push(cornMoves[cornPerm[j]] + mathlib.rndEl([" ", "'"]));
					}
					line.push('');
					for (var j = 0; j < edgePerm.length; j++) {
						line.push(edgeMoves[edgePerm[j]]);
					}
					ret[i] = line.join(' ');
					maxWidth = Math.max(maxWidth, ret[i].length);
				}
				for (var i = 0; i < ret.length; i++) {
					ret[i] = ret[i].padEnd(maxWidth, '~');
				}
				return ret.join('\\n');
			case "redi":
				return adjScramble(["L", "R", "F", "B", "l", "r", "f", "b"], [0x1c, 0x2c, 0x43, 0x83, 0xc1, 0xc2, 0x34, 0x38], len, ["", "'"]);
			case "redim":
				return moyuRedi(len);
			case "dmdso":
				return getPolyScrambler("dmd", ["U", "R", "L", "F"], (mv, pow) => mv + ["", "'"][pow - 1]).getScramble(7, 10);
			case "pyrm": // Pyraminx (random moves)
				ret = mega([
					["U"],
					["L"],
					["R"],
					["B"]
				], ["!", "'"], len);
				return addPyrTips(ret, 3).replace(/!/g, "");
			case "prcp": // Pyraminx Crystal (Pochmann)
				return pochscramble(10, Math.ceil(len / 10));
			case "mpyr": // Master Pyraminx
				ret = adjScramble(["U!", "L!", "R!", "B!", "Uw", "Lw", "Rw", "Bw"], [0xe0, 0xd0, 0xb0, 0x70, 0xee, 0xdd, 0xbb, 0x77], len, ["!", "'"]);
				return addPyrTips(ret, 4).replace(/!/g, "");
			case "r3": // multiple 3x3x3 relay
				for (var i = 0; i < len; i++) {
					ret += (i == 0 ? "" : "\\n") + (i + 1) + ") ${333}";
				}
				return scrMgr.formatScramble(ret);
			case "r3ni": // multiple 3x3x3 bld
				for (var i = 0; i < len; i++) {
					ret += (i == 0 ? "" : "\\n") + (i + 1) + ") ${333ni}";
				}
				return scrMgr.formatScramble(ret);
			case "sq1h": // Square-1 (turn metric)
				return sq1_scramble(1, len);
			case "sq1t": // Square-1 (twist metric)
				return sq1_scramble(0, len);
			case "sq2": // Square-2
				var i = 0;
				while (i < len) {
					var rndu = rn(12) - 5;
					var rndd = rn(12) - 5;
					if (rndu != 0 || rndd != 0) {
						i++;
						ret += "(" + rndu + "," + rndd + ")/ ";
					}
				}
				return ret;
			case "ssq1t": // Super Square-1 (twist metric)
				return ssq1t_scramble(len);
			case "bsq": // Bandaged Square-1 </,(1,0)>
				return sq1_scramble(2, len);
			case "ctico": // icosamate
				return adjScramble(["UL", "UR", "UrUl", "FlFr", "LBl", "RBr"], [0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f], len, minxsuff);
			case "-1": // -1x-1x-1 (micro style)
				for (var i = 0; i < len; i++) {
					ret += String.fromCharCode(32 + rn(224));
				}
				ret += "Error: subscript out of range";
				return ret;
			case "333noob": // 3x3x3 for noobs
				ret = mega(SCRAMBLE_NOOBST, SCRAMBLE_NOOBSS.split('|'), len).replace(/t/, "T");
				return ret.substr(0, ret.length - 2) + ".";
			case "lol": // LOL
				ret = mega([
					["L"],
					["O"]
				], 0, len);
				return ret.replace(/ /g, "");
		}
		console.log('Error');
	}


	scrMgr.reg(['15p', '15pm', '15pat', 'clkwca', 'clkwcab', 'clknf', 'clk', 'clkc', 'clke', 'giga', 'mgmo', 'mgmp', 'mgmc', 'mgms2l', 'klmp', 'heli', 'helicv', 'heli2x2', 'heli2x2g', 'redi', 'redim', 'pyrm', 'prcp', 'mpyr', 'r3', 'r3ni', 'sq1h', 'sq1t', 'sq2', 'ssq1t', 'bsq', 'ctico', 'dmdso', '-1', '333noob', 'lol'], utilscramble);

})(mathlib.rn, mathlib.rndEl, scrMgr.mega);

/* ==== tools/tools.js ==== */
"use strict";

var tools = (function() {
	var curScramble = ['-', '', 0];

	function scrambleType(scramble) {
		if (scramble.match(/^([\d]?[xyzFRUBLDfrubldSME]([w]|&sup[\d];)?[2']?\s*)+$/) == null) {
			return '-';
		} else if (scramble.match(/^([xyzFRU][2']?\s*)+$/)) {
			return '222o';
		} else if (scramble.match(/^([xyzFRUBLDSME][2']?\s*)+$/)) {
			return '333';
		} else if (scramble.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/)) {
			return '444';
		} else if (scramble.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/)) {
			return '555';
		} else {
			return '-';
		}
	}

	function carrot2poch(scramble) {
		return scramble.replace(/([+-])([+-]) /g, function(m, p1, p2) {
			return 'R' + p1 + p1 + ' D' + p2 + p2 + ' ';
		});
	}

	function isPuzzle(puzzle, scramble) {
		scramble = scramble || curScramble;
		var scrPuzzle = puzzleType(scramble[0]);
		scramble = scramble[1];
		if (scrPuzzle) {
			return scrPuzzle == puzzle;
		} else if (puzzle == '222') {
			return scramble.match(/^([xyzFRU][2']?\s*)+$/);
		} else if (puzzle == '333') {
			return scramble.match(/^([xyzFRUBLDSME][2']?\s*)+$/);
		} else if (puzzle == '444') {
			return scramble.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/);
		} else if (puzzle == '555') {
			return scramble.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/);
		} else if (puzzle == 'skb') {
			return scramble.match(/^([RLUB]'?\s*)+$/);
		} else if (puzzle == 'pyr') {
			return scramble.match(/^([RLUBrlub]'?\s*)+$/);
		} else if (puzzle == 'sq1') {
			return scramble.match(/^$/);
		} else if (puzzle == 'fto') {
			return scramble.match(/^(([FRUBLD]|(?:BL)|(?:BR))[']?\s*)+$/);
		}
		return false;
	}

	function puzzleType(scrambleType) {
		if (/^222(so|[236o]|eg[012]?|tc[np]?|lsall|nb|easy)$/.exec(scrambleType)) {
			return "222";
		} else if (/^(333(oh?|ni|f[mt]|drud|custom)?|(z[zb]|[coep]|c[om]|2g|ls|tt)?ll|zbllx2|lse(mu)?|2genl?|3gen_[LF]|edges|corners|f2l|lsll2|(zb|w?v|eo)ls|roux|RrU|half|easyx?c|eoline|eocross|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|nocache_333(bld|pat)spec)$/.exec(scrambleType)) {
			return "333";
		} else if (/^(444([mo]|wca|yj|bld|ctud|ctrl|ud3c|l8e|rlda|rlca|edo|cto|e?ll|p[op]ll)?|4edge|RrUu)$/.exec(scrambleType)) {
			return "444";
		} else if (/^(555(wca|bld)?|5edge)$/.exec(scrambleType)) {
			return "555";
		} else if (/^(666(si|[sp]|wca)?|6edge)$/.exec(scrambleType)) {
			return "666";
		} else if (/^(777(si|[sp]|wca)?|7edge)$/.exec(scrambleType)) {
			return "777";
		} else if (/^pyr(s?[om]|l4e|nb|4c)$/.exec(scrambleType)) {
			return "pyr";
		} else if (/^skb(s?o|nb|ll)?$/.exec(scrambleType)) {
			return "skb";
		} else if (/^sq(rs|1pll|1[ht]|rcsp)$/.exec(scrambleType)) {
			return "sq1";
		} else if (/^clk(wcab?|o|nf)$/.exec(scrambleType)) {
			return "clk";
		} else if (/^(mgmp|mgmo|mgmc|minx2g|mlsll|mgmpll|mgmll|mgmso|mgms2l)$/.exec(scrambleType)) {
			return "mgm";
		} else if (/^(klmso|klmp)$/.exec(scrambleType)) {
			return "klm";
		} else if (/^(fto|fto(so|l[34]t|tcp|edge|cent|corn))$/.exec(scrambleType)) {
			return "fto";
		} else if (/^(dmdso)$/.exec(scrambleType)) {
			return "dmd";
		} else if (/^(mpyr|mpyrso)$/.exec(scrambleType)) {
			return "mpyr";
		} else if (/^15p(at|ra?p?)?$/.exec(scrambleType)) {
			return "15p";
		} else if (/^15p(rmp|m)$/.exec(scrambleType)) {
			return "15b";
		} else if (/^8p(at|ra?p?)?$/.exec(scrambleType)) {
			return "8p";
		} else if (/^8p(rmp|m)$/.exec(scrambleType)) {
			return "8b";
		} else if (/^heli2x2g?$/.exec(scrambleType)) {
			return "heli2x2";
		} else if (/^prc[po]$/.exec(scrambleType)) {
			return "prc";
		} else if (/^redi(m|so)?$/.exec(scrambleType)) {
			return "redi";
		} else if (/^dino(o|so)?$/.exec(scrambleType)) {
			return "dino";
		} else if (/^gear(o|so)?$/.exec(scrambleType)) {
			return "gear";
		} else {
			return scrambleType;
		}
	}

	var ret = ISCSTIMER ? execMain(function() {
		var divs = [];
		var isEn = false;

		function execFunc(idx, signal) {
			if (idx == -1) {
				for (var i = 0; i < kernel.getProp('NTools'); i++) {
					execFunc(i, signal);
				}
				return;
			}
			if (!isEn) {
				for (var tool in toolBox) {
					toolBox[tool]();
				}
				fdivs[idx].empty();
				return;
			}

			for (var tool in toolBox) {
				if (tool == funcs[idx]) {
					toolBox[tool](fdivs[idx], signal);
				}
			}
		}

		function disableFunc(idx, signal) {
			for (var tool in toolBox) {
				if (tool == funcs[idx]) {
					toolBox[tool](undefined, signal);
				}
			}
		}

		var fdivs = [];
		var funcs = ['image', 'stats', 'cross'];
		var funcSpan = [];
		var funcMenu = [];
		var funcData = [];

		for (var i = 0; i < 4; i++) {
			fdivs[i] = $('<div />');
			funcSpan[i] = $('<span />');
			funcMenu[i] = new kernel.TwoLvMenu(funcData, onFuncSelected.bind(null, i), $('<select />'), $('<select />'));
			divs[i] = $('<div />').css('display', 'inline-block');
		}

		function onFuncSelected(idx, val) {
			DEBUG && console.log('[func select]', idx, val);
			kernel.blur();
			var start = idx === undefined ? 0 : idx;
			var end = idx === undefined ? 4 : idx + 1;
			for (var i = start; i < end; i++) {
				var newVal = funcMenu[i].getSelected();
				if (funcs[i] != newVal) {
					disableFunc(i, 'property');
					funcs[i] = newVal;
					kernel.setProp('toolsfunc', JSON.stringify(funcs));
					execFunc(i, 'property');
				}
			}
		}

		function procSignal(signal, value) {
			if (signal == 'property') {
				if (/^(img|col).*/.exec(value[0])) {
					for (var i = 0; i < kernel.getProp('NTools'); i++) {
						if (funcs[i] == 'image') {
							execFunc(i, signal);
						}
					}
				} else if (value[0] == 'NTools') {
					for (var i = 0; i < 4; i++) {
						if (i < value[1]) {
							divs[i].show();
							if (fdivs[i].html() == '') {
								execFunc(i, signal);
							}
						} else {
							divs[i].hide();
							disableFunc(i, signal);
						}
					}
				} else if (value[0] == 'toolHide') {
					toggleFuncSpan(!value[1]);
				} else if (value[0] == 'toolsfunc' && value[2] == 'session') {
					var newfuncs = JSON.parse(value[1]);
					for (var i = 0; i < 4; i++) {
						funcMenu[i].loadVal(newfuncs[i]);
					}
					onFuncSelected();
				} else if (value[0] == 'toolPos') {
					$('html').removeClass('toolf toolt');
					if ('ft'.indexOf(value[1]) != -1) {
						$('html').addClass('tool' + value[1]);
					}
				}
			} else if (signal == 'scramble' || signal == 'scrambleX') {
				curScramble = value;
				kernel.setProp('isTrainScr', !!trainScrambleRe.exec((curScramble || [])[0]));
				execFunc(-1, signal);
			} else if (signal == 'button' && value[0] == 'tools') {
				isEn = value[1];
				if (!isEn) {
					execFunc(-1, signal);
					return;
				}
				for (var i = 0; i < kernel.getProp('NTools'); i++) {
					if (isEn && fdivs[i].html() == '') {
						execFunc(i, signal);
					}
				}
			}
		}

		function toggleFuncSpan(isShow) {
			for (var i = 0; i < 4; i++) {
				if (isShow) {
					funcSpan[i].show();
				} else {
					funcSpan[i].hide();
				}
			}
		}

		function showFuncSpan(e) {
			if ($(e.target).is('input,textarea,select,.click')) {
				return;
			}
			kernel.setProp('toolHide', false);
		}

		$(function() {
			kernel.regListener('tools', 'property', procSignal, /^(?:img(Size|Rep)|image|toolsfunc|NTools|col(?:cube|pyr|skb|sq1|mgm|fto|clk|15p|ico)|toolHide|toolPos)$/);
			kernel.regListener('tools', 'scramble', procSignal);
			kernel.regListener('tools', 'scrambleX', procSignal);
			kernel.regListener('tools', 'button', procSignal, /^tools$/);

			var mainDiv = $('<div id="toolsDiv"/>');
			for (var i = 0; i < 4; i++) {
				fdivs[i].click(showFuncSpan);
				funcSpan[i].append("<br>", TOOLS_SELECTFUNC, funcMenu[i].select1, funcMenu[i].select2);
				divs[i].append(fdivs[i], funcSpan[i]).appendTo(mainDiv);
				if (i == 1) {
					mainDiv.append('<br>');
				}
			}

			kernel.regProp('tools', 'toolPos', 1, PROPERTY_TOOLPOS, ['b', ['b', 'f', 't'], PROPERTY_TOOLPOS_STR.split('|')], 1);
			kernel.regProp('tools', 'solSpl', 0, PROPERTY_HIDEFULLSOL, [false]);
			kernel.regProp('tools', 'imgSize', 2, PROPERTY_IMGSIZE, [15, 5, 50], 1);
			kernel.regProp('tools', 'imgRep', 0, PROPERTY_IMGREP, [true], 1);
			kernel.regProp('tools', 'NTools', 2, PROPERTY_NTOOLS, [1, 1, 4], 1);
			var defaultFunc = JSON.stringify(['image', 'stats', 'cross', 'distribution']);
			kernel.regProp('tools', 'toolsfunc', 5, PROPERTY_TOOLSFUNC, [defaultFunc], 1);
			kernel.regProp('tools', 'isTrainScr', ~5, 'Is Train Scramble', [false], 0);
			var funcStr = kernel.getProp('toolsfunc', defaultFunc);
			if (funcStr.indexOf('[') == -1) {
				funcStr = defaultFunc.replace('image', funcStr);
				kernel.setProp('toolsfunc', funcStr);
			}
			funcs = JSON.parse(funcStr);
			kernel.addWindow('tools', BUTTON_TOOLS, mainDiv, false, true, 6);
			kernel.regProp('ui', 'toolHide', ~0, 'Hide Tools Selector', [false]);
		});

		/**
		 *	{name: function(fdiv, updateAll) , }
		 */
		var toolBox = {};

		function regTool(name, str, execFunc) {
			DEBUG && console.log('[regtool]', name, str);
			toolBox[name] = execFunc;
			str = str.split('>');
			if (str.length == 2) {
				var idx1 = -1;
				for (var i = 0; i < funcData.length; i++) {
					if (funcData[i][0] == str[0] && $.isArray(funcData[i][1])) {
						idx1 = i;
						break;
					}
				}
				if (idx1 != -1) {
					funcData[idx1][1].push([str[1], name]);
				} else {
					funcData.push([str[0], [[str[1], name]]]);
				}
			} else {
				funcData.push([str[0], name]);
			}
			$.delayExec('toolreset', function() {
				for (var i = 0; i < 4; i++) {
					funcMenu[i].reset(funcs[i]);
				}
			}, 0);
		}

		function getSolutionSpan(solution) {
			var span = $('<span />');
			for (var i = 0; i < solution.length; i++) {
				span.append('<span style="display:none;">&nbsp;' + solution[i] + '</span>');
			}
			if (kernel.getProp('solSpl')) {
				span.append($('<span class="click" data="n">[+1]</span>').click(procSolutionClick));
				span.append($('<span class="click" data="a">[' + solution.length + 'f]</span>').click(procSolutionClick));
			} else {
				span.children().show();
			}
			return span;
		}

		function procSolutionClick(e) {
			var span = $(this);
			if (span.attr('data') == 'a') {
				span.prevAll().show();
				span.prev().hide();
				span.hide();
			} else if (span.attr('data') == 'n') {
				var unshown = span.prevAll(':hidden');
				unshown.last().show();
				if (unshown.length == 1) {
					span.next().hide();
					span.hide();
				}
			}
		}
		return {
			regTool: regTool,
			getSolutionSpan: getSolutionSpan,
		}
	}) : {};

	var lastTrain = null;
	var trainScrambleRe = /^((z[zb]|[coep]|c[om]|2g|ls|tt)?ll|zbllx2|lse(mu)?|2genl?|3gen_[LF]|333drud|f2l|lsll2|(zb|w?v|eo)ls|roux|eoline|eocross|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|222(eg[012]?|tc[np]?|lsall)|444(p[op]ll|l8e))$/;

	function isCurTrainScramble(scramble) {
		return !!trainScrambleRe.exec((scramble || curScramble || [])[0]);
	}

	var ret2 = {
		getCurScramble: function() {
			return curScramble;
		},
		getCurPuzzle: function() {
			return puzzleType(curScramble[0]);
		},
		scrambleType: scrambleType,
		puzzleType: puzzleType,
		carrot2poch: carrot2poch,
		isCurTrainScramble: isCurTrainScramble,
		isPuzzle: isPuzzle
	};
	for (var key in ret2) {
		ret[key] = ret2[key];
	}
	return ret;
})();

/* ==== tools/image.js ==== */
"use strict";

var image = (function() {

	var img;
	var hsq3 = Math.sqrt(3) / 2;
	var PI = Math.PI;

	var Rotate = $.ctxRotate;
	var Transform = $.ctxTransform;
	var drawPolygon = $.ctxDrawPolygon;

	var clkImage = (function() {
		function drawClock(svg, color, trans, time) {
			var points = Transform(Rotate([
				[1, 1, 0, -1, -1, -1, 1, 0],
				[0, -1, -8, -1, 0, 1, 1, 0]
			], time / 6 * PI), trans);
			var x = points[0];
			var y = points[1];
			svg.addElem('<circle cx="' + x[7] + '" cy="' + y[7] + '" r="' + trans[0] * 9 + '" style="fill:' + color + '" />');
			var path = [];
			path.push('M' + x[0] + ' ' + y[0]);
			path.push('Q' + x[1] + ' ' + y[1] + ',' + x[2] + ' ' + y[2]);
			path.push('Q' + x[3] + ' ' + y[3] + ',' + x[4] + ' ' + y[4]);
			path.push('C' + x[5] + ' ' + y[5] + ',' + x[6] + ' ' + y[6] + ',' + x[0] + ' ' + y[0]);
			svg.addElem('<path d="' + path.join(' ') + '" style="fill:' + colors[3] + ';stroke:' + colors[0] + '" />');
		}

		function drawButton(svg, color, trans) {
			var points = Transform([[0],[0]], trans);
			svg.addElem('<circle cx="' + points[0][0] + '" cy="' + points[1][0] +
				'" r="' + trans[0] * 3 + '" style="fill:' + color + ';stroke:#000;" />');
		}

		var width = 3;
		var movere = /([UD][RL]|ALL|[UDRLy]|all)(?:(\d[+-]?)|\((\d[+-]?),(\d[+-]?)\))?/
		var movestr = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL']
		var colors = ['#f00', '#37b', '#5cf', '#ff0', '#850'];

		return function(svg, moveseq) {
			colors = kernel.getProp('colclk').match(colre);
			var moves = moveseq.split(/\s+/);
			var moveArr = clock.moveArr;
			var flip = 9;
			var buttons = [0, 0, 0, 0];
			var clks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var i = 0; i < moves.length; i++) {
				var m = movere.exec(moves[i]);
				if (!m) {
					continue;
				}
				if (m[0] == 'y2') {
					flip = 9 - flip;
					continue;
				}
				var axis = movestr.indexOf(m[1]) + flip;
				if (m[2] == undefined && m[3] == undefined) {
					buttons[axis % 9] = 1;
					continue;
				}
				var power;
				var actions = [];
				if (m[1] == 'all') {
					power = ~~m[2][0] * (m[2][1] == '+' ? -1 : 1) + 12;
					actions.push(8 + 9 - flip, power);
				} else if (m[2]) {
					power = ~~m[2][0] * (m[2][1] == '+' ? 1 : -1) + 12;
					actions.push(axis, power);
				} else {
					power = ~~m[3][0] * (m[3][1] == '+' ? 1 : -1) + 12;
					actions.push(axis, power);
					power = ~~m[4][0] * (m[4][1] == '+' ? -1 : 1) + 12;
					axis = (10 - axis % 9) % 4 + 4 + 9 - flip;
					actions.push(axis, power);
				}
				for (var k = 0; k < actions.length; k += 2) {
					for (var j = 0; j < 14; j++) {
						clks[j] = (clks[j] + moveArr[actions[k]][j] * actions[k + 1]) % 12;
					}
				}
			}
			clks = [clks[0], clks[3], clks[6], clks[1], clks[4], clks[7], clks[2], clks[5], clks[8],
				12 - clks[2], clks[10], 12 - clks[8], clks[9], clks[11], clks[13], 12 - clks[0], clks[12], 12 - clks[6]
			];
			buttons = [buttons[3], buttons[2], buttons[0], buttons[1], 1 - buttons[0], 1 - buttons[1], 1 - buttons[3], 1 - buttons[2]];

			svg.width = 6.25 * 20 * width;
			svg.height = 3 * 20 * width;

			var y = [10, 30, 50];
			var x = [10, 30, 50, 75, 95, 115];
			for (var ii = 0; ii < 18; ii++) {
				var i = (ii + flip) % 18;
				drawClock(svg, [colors[1], colors[2]][~~(ii / 9)], [width, x[~~(i / 3)], y[i % 3]], clks[ii]);
			}

			y = [20, 40];
			x = [20, 40, 85, 105];
			for (var i = 0; i < 8; i++) {
				drawButton(svg, [colors[4], colors[3]][buttons[i]], [width, x[~~(i / 2)], y[i % 2]]);
			}
		};
	})();

	var sq1Image = (function() {

		var sqa = hsq3 + 1;
		var sqb = sqa * Math.sqrt(2);
		var ep = [
			[0, -0.5, 0.5],
			[0, -sqa, -sqa]
		];
		var cp = [
			[0, -0.5, -sqa, -sqa],
			[0, -sqa, -sqa, -0.5]
		];
		var cpr = [
			[0, -0.5, -sqa],
			[0, -sqa, -sqa]
		];
		var cpl = [
			[0, -sqa, -sqa],
			[0, -sqa, -0.5]
		];

		var eps = Transform(ep, [0.66, 0, 0]);
		var cps = Transform(cp, [0.66, 0, 0]);
		var cprs = Transform(cpr, [0.66, 0, 0]);
		var cpls = Transform(cpl, [0.66, 0, 0]);

		var udcol = 'UD';
		var ecol = 'R-B-L-F-F-L-B-R-';
		var ccol = 'RBBLLFFRRFFLLBBR';
		var colors = {
			'U': '#ff0',
			'R': '#f80',
			'F': '#0f0',
			'D': '#fff',
			'L': '#f00',
			'B': '#00f'
		};

		var width = 45;

		var movere = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/;

		function doMove(move, sc) {
			if (move[0] != 0) {
				sc.doMove(move[0]);
			}
			if (move[1] != 0) {
				sc.doMove(-move[1]);
			}
			if (move[2] != 0) {
				sc.doMove(0);
			}
		}

		function drawPosit(svg, sc, colors, sq2sc, half) {
			for (var i = 0; i < (half ? 12 : 24); i++) {
				var trans = i < 12 ? [width, sqb, sqb] : [width, sqb * 3, sqb];
				var val = sc.pieceAt(i);
				var colorUD = colors[udcol[val >= 8 ? 1 : 0]];
				var cRot = -(i < 12 ? (i - 1) : (i - 6)) * PI / 6;
				var eRot = -(i < 12 ? (i) : (i - 5)) * PI / 6;
				if (val % 2 == 1) { // corner
					if (sq2sc) {
						var cLR = sq2sc.pieceAt(i) & 1;
						cRot += cLR ? 0 : PI / 6;
						drawPolygon(svg, colors[ccol[val - cLR]],
							Rotate(cLR ? cpr : cpl, cRot), trans);
						drawPolygon(svg, colorUD,
							Rotate(cLR ? cprs : cpls, cRot), trans);
					} else {
						drawPolygon(svg, colors[ccol[val - 1]],
							Rotate(cpr, cRot), trans);
						drawPolygon(svg, colors[ccol[val]],
							Rotate(cpl, cRot), trans);
						drawPolygon(svg, colorUD,
							Rotate(cps, cRot), trans);
						i++;
					}
				} else { // edge
					drawPolygon(svg, colors[ecol[val]],
						Rotate(ep, eRot), trans);
					drawPolygon(svg, colorUD,
						Rotate(eps, eRot), trans);
				}
			}
		}

		function llImage(sc, sq2sc, img) {
			var svg = new $.svg();
			var cols = kernel.getProp('colsq1').match(colre);
			colors = {
				'U': cols[0],
				'R': cols[1],
				'F': cols[2],
				'D': cols[3],
				'L': cols[4],
				'B': cols[5]
			};
			svg.width = 2 * sqb * width;
			svg.height = 2 * sqb * width;
			drawPosit(svg, sc, colors, sq2sc, true);
			if (img) {
				img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
			}
			return svg;
		}

		function scrImage(svg, moveseq, isSQ2) {
			var cols = kernel.getProp('colsq1').match(colre);
			colors = {
				'U': cols[0],
				'R': cols[1],
				'F': cols[2],
				'D': cols[3],
				'L': cols[4],
				'B': cols[5]
			};
			var sc = new sq1.SqCubie();
			var sq2sc = null;
			if (isSQ2) {
				sq2sc = new sq1.SqCubie();
				sq2sc.ul = sq2sc.ur = 0x010010;
				sq2sc.dl = sq2sc.dr = 0x100100;
			}
			var moves = moveseq.split('/');
			var tomove = [];
			var recons = [];
			for (var i = 0; i < moves.length; i++) {
				if (/^\s*$/.exec(moves[i])) {
					tomove.push([0, 0, 1]);
					recons.push('/');
					continue;
				}
				var m = movere.exec(moves[i]);
				if (!m) {
					continue;
				}
				tomove.push([(~~m[1] + 12) % 12, (~~m[2] + 12) % 12, 1]);
				if (~~m[1]) {
					recons.push('(' + m[1] + ',0)');
				}
				if (~~m[2]) {
					recons.push('(0,' + m[2] + ')');
				}
				recons.push('/');
			}
			tomove.push([0, 0, 1]);
			for (var i = 0; i < tomove.length; i++) {
				doMove(tomove[i], sc);
				sq2sc && doMove(tomove[i], sq2sc);
			}

			svg.width = 4 * sqb * width;
			svg.height = 2 * sqb * width;

			//draw middle
			for (var i = 0; i < 2; i++) {
				var trans = i == 0 ? [width, sqb, sqb + sqa] : [width, sqb * 3, sqb - sqa - 0.7];
				drawPolygon(svg, colors['L'], [[-sqa, -sqa, -0.5, -0.5], [0, 0.7, 0.7, 0]], trans);
				if (sc.ml == 0) {
					drawPolygon(svg, colors['L'], [[sqa, sqa, -0.5, -0.5], [0, 0.7, 0.7, 0]], trans);
				} else {
					drawPolygon(svg, colors['R'], [[hsq3, hsq3, -0.5, -0.5], [0, 0.7, 0.7, 0]], trans);
				}
			}
			//draw top and bottom
			drawPosit(svg, sc, colors, sq2sc);

			if (recons.at(-1) == '/') {
				recons.pop();
			} else {
				recons.push('/');
			}
			return ["~", recons, 'sq1'];
		}

		return {
			scrImage: scrImage,
			llImage: llImage
		}
	})();

	var nnnImage = (function() {
		var width = 30;

		var posit = [];
		var colors = ['#ff0', '#fa0', '#00f', '#fff', '#f00', '#0d0'];

		function face(svg, f, size) {
			var offx = 10 / 9,
				offy = 10 / 9;
			if (f == 0) { //D
				offx *= size;
				offy *= size * 2;
			} else if (f == 1) { //L
				offx *= 0;
				offy *= size;
			} else if (f == 2) { //B
				offx *= size * 3;
				offy *= size;
			} else if (f == 3) { //U
				offx *= size;
				offy *= 0;
			} else if (f == 4) { //R
				offx *= size * 2;
				offy *= size;
			} else if (f == 5) { //F
				offx *= size;
				offy *= size;
			}

			for (var i = 0; i < size; i++) {
				var x = (f == 1 || f == 2) ? size - 1 - i : i;
				for (var j = 0; j < size; j++) {
					var y = (f == 0) ? size - 1 - j : j;
					drawPolygon(svg, colors[posit[(f * size + y) * size + x]], [
						[i, i, i + 1, i + 1],
						[j, j + 1, j + 1, j]
					], [width, offx + 0.1, offy + 0.1]);
				}
			}
		}

		/**
		 *  f: face, [ D L B U R F ]
		 *  d: which slice, in [0, size-1)
		 *  q: [  2 ']
		 */
		function doslice(f, d, q, size) {
			var f1, f2, f3, f4;
			var s2 = size * size;
			var c, i, j, k;
			if (f > 5) f -= 6;
			for (k = 0; k < q; k++) {
				for (i = 0; i < size; i++) {
					if (f == 0) {
						f1 = 6 * s2 - size * d - size + i;
						f2 = 2 * s2 - size * d - 1 - i;
						f3 = 3 * s2 - size * d - 1 - i;
						f4 = 5 * s2 - size * d - size + i;
					} else if (f == 1) {
						f1 = 3 * s2 + d + size * i;
						f2 = 3 * s2 + d - size * (i + 1);
						f3 = s2 + d - size * (i + 1);
						f4 = 5 * s2 + d + size * i;
					} else if (f == 2) {
						f1 = 3 * s2 + d * size + i;
						f2 = 4 * s2 + size - 1 - d + size * i;
						f3 = d * size + size - 1 - i;
						f4 = 2 * s2 - 1 - d - size * i;
					} else if (f == 3) {
						f1 = 4 * s2 + d * size + size - 1 - i;
						f2 = 2 * s2 + d * size + i;
						f3 = s2 + d * size + i;
						f4 = 5 * s2 + d * size + size - 1 - i;
					} else if (f == 4) {
						f1 = 6 * s2 - 1 - d - size * i;
						f2 = size - 1 - d + size * i;
						f3 = 2 * s2 + size - 1 - d + size * i;
						f4 = 4 * s2 - 1 - d - size * i;
					} else if (f == 5) {
						f1 = 4 * s2 - size - d * size + i;
						f2 = 2 * s2 - size + d - size * i;
						f3 = s2 - 1 - d * size - i;
						f4 = 4 * s2 + d + size * i;
					}
					c = posit[f1];
					posit[f1] = posit[f2];
					posit[f2] = posit[f3];
					posit[f3] = posit[f4];
					posit[f4] = c;
				}
				if (d == 0) {
					for (i = 0; i + i < size; i++) {
						for (j = 0; j + j < size - 1; j++) {
							f1 = f * s2 + i + j * size;
							f3 = f * s2 + (size - 1 - i) + (size - 1 - j) * size;
							if (f < 3) {
								f2 = f * s2 + (size - 1 - j) + i * size;
								f4 = f * s2 + j + (size - 1 - i) * size;
							} else {
								f4 = f * s2 + (size - 1 - j) + i * size;
								f2 = f * s2 + j + (size - 1 - i) * size;
							}
							c = posit[f1];
							posit[f1] = posit[f2];
							posit[f2] = posit[f3];
							posit[f3] = posit[f4];
							posit[f4] = c;
						}
					}
				}
			}
		}

		function genPosit(size, moveseq) {
			var cnt = 0;
			posit = [];
			for (var i = 0; i < 6; i++) {
				for (var f = 0; f < size * size; f++) {
					posit[cnt++] = i;
				}
			}
			var moves = cubeutil.parseScramble(moveseq, "DLBURF", true);
			for (var s = 0; s < moves.length; s++) {
				for (var d = 0; d < moves[s][1]; d++) {
					doslice(moves[s][0], d, moves[s][2], size)
				}
				if (moves[s][1] == -1) {
					for (var d = 0; d < size - 1; d++) {
						doslice(moves[s][0], d, -moves[s][2], size);
					}
					doslice((moves[s][0] + 3) % 6, 0, moves[s][2] + 4, size);
				}
			}
			return posit;
		}

		function draw(svg, size, moveseq) {
			genPosit(size, moveseq);

			svg.width = (39 * size / 9 + 0.2) * width;
			svg.height = (29 * size / 9 + 0.2) * width;

			colors = kernel.getProp('colcube').match(colre);
			for (var i = 0; i < 6; i++) {
				face(svg, i, size);
			}

			var moves = moveseq.split(/\s+/);
			var recons = [];
			for (var i = 0; i < moves.length; i++) {
				if (moves[i]) {
					recons.push(moves[i]);
				}
			}
			return ["~", recons, [size, size, size].join('')];
		}

		return {
			draw: draw,
			genPosit: genPosit
		}
	})();

	var mrblImage = (function() {
		// image for mirror block
		var width = 30;
		var posit = [];
		var colors = [];

		function getBoundOffset(f, size, i, j) {
			if (i != 0 && i != size - 1 && j != 0 && j != size - 1) {
				return [-1, -1, -1, -1];
			}
			//   0
			// 2   3
			//   1
			var D = 0, L = 4, B = 8, U = 12, R = 16, F = 20;
			var neighbor = [
				[F + 1, B + 1, L + 1, R + 1],
				[U + 2, D + 2, B + 3, F + 2],
				[U + 0, D + 1, R + 3, L + 2],
				[B + 0, F + 0, L + 0, R + 0],
				[U + 3, D + 3, F + 3, B + 2],
				[U + 1, D + 0, L + 3, R + 2]
			][f];
			var isBound = [i == 0, i == size - 1, j == 0, j == size - 1];
			var ret = [-1, -1, -1, -1];
			for (var i1 = 0; i1 < 4; i1++) {
				if (!isBound[i1]) {
					continue;
				}
				var idx = [size - 1 - j, j, i, size - 1 - i][i1];
				var rij = [[0, idx], [size - 1, size - 1 - idx], [size - 1 - idx, 0], [idx, size - 1]][neighbor[i1] & 0x3];
				var fidx = neighbor[i1] >> 2;
				if (fidx == 1 || fidx == 2) {
					rij[1] = size - 1 - rij[1];
				}
				if (fidx == 0) {
					rij[0] = size - 1 - rij[0];
				}
				ret[i1] = posit[fidx * size * size + rij[0] * size + rij[1]];
			}
			return ret;
		}

		function face(svg, f, size) {
			var offx = (size + 1) / size,
				offy = (size + 1) / size;
			if (f == 0) { //D
				offx *= size;
				offy *= size * 2;
			} else if (f == 1) { //L
				offx *= 0;
				offy *= size;
			} else if (f == 2) { //B
				offx *= size * 3;
				offy *= size;
			} else if (f == 3) { //U
				offx *= size;
				offy *= 0;
			} else if (f == 4) { //R
				offx *= size * 2;
				offy *= size;
			} else if (f == 5) { //F
				offx *= size;
				offy *= size;
			}
			var heights = [0.45, 0.15, 0.3, -0.45, -0.15, -0.3];
			for (var i = 0; i < size; i++) {
				var x = (f == 1 || f == 2) ? size - 1 - i : i;
				for (var j = 0; j < size; j++) {
					var y = (f == 0) ? size - 1 - j : j;
					var off = getBoundOffset(f, size, j, i);
					for (var i1 = 0; i1 < 4; i1++) {
						off[i1] = off[i1] == -1 ? 0 : heights[off[i1]];
					}
					drawPolygon(svg, colors[posit[(f * size + y) * size + x]], [
						[i - off[2], i - off[2], i + 1 + off[3], i + 1 + off[3]],
						[j - off[0], j + 1 + off[1], j + 1 + off[1], j - off[0]]
					], [width, offx + 0.6, offy + 0.6]);
				}
			}
		}

		return function(svg, size, moveseq) {
			posit = nnnImage.genPosit(size, moveseq);
			svg.width = (4 * size + 4 + 0.2) * width;
			svg.height = (3 * size + 3 + 0.2) * width;
			colors = kernel.getProp('colcube').match(colre);
			for (var i = 0; i < 6; i++) {
				face(svg, i, size);
			}
		}
	})();

	var gearImage = (function() {

		var moveMaps = [
			[3, 2, 1, 0, 4, 11, 12, 13, 14, 15, 16, 5, 6, 7, 8, 9, 10, 68, 69, 19, 20, 89, 73, 74, 75, 94, 95, 82, 28, 29, 30, 100, 101, 25, 85, 86, 36, 37, 21, 90, 91, 92, 26, 27, 99, 45, 46, 47, 32, 33, 42, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 17, 18, 70, 71, 38, 22, 23, 24, 43, 44, 31, 79, 80, 81, 49, 50, 76, 34, 35, 87, 88, 72, 39, 40, 41, 77, 78, 48, 96, 97, 98, 83, 84, 93],
			[0, 52, 2, 54, 38, 40, 41, 11, 59, 60, 61, 46, 47, 56, 14, 15, 16, 20, 19, 18, 17, 21, 28, 29, 30, 31, 32, 33, 22, 23, 24, 25, 26, 27, 34, 87, 36, 85, 55, 57, 58, 45, 99, 100, 101, 63, 64, 96, 48, 49, 50, 51, 1, 53, 3, 89, 97, 98, 62, 8, 9, 10, 91, 92, 5, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 37, 86, 35, 88, 4, 12, 13, 39, 93, 94, 95, 6, 7, 90, 42, 43, 44],
			[0, 1, 52, 51, 72, 5, 6, 7, 74, 75, 14, 56, 57, 58, 80, 81, 65, 71, 18, 69, 20, 4, 15, 16, 73, 25, 26, 27, 9, 10, 22, 76, 77, 78, 37, 36, 35, 34, 38, 45, 46, 47, 48, 49, 50, 39, 40, 41, 42, 43, 44, 3, 2, 53, 54, 21, 11, 12, 13, 23, 24, 8, 62, 63, 64, 29, 30, 59, 68, 19, 70, 17, 55, 66, 67, 79, 31, 32, 33, 60, 61, 28, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101]
		];

		return function(svg, moveseq) {
			var width = 30;
			svg.width = (39 * 3 / 9 + 0.2) * width;
			svg.height = (29 * 3 / 9 + 0.2) * width;
			var state = [];
			for (var i = 0; i < 17 * 6; i++) {
				state[i] = ~~(i / 17);
			}
			moveseq.replace(/([URF])([23456]?)('?)/g, function(m, g1, g2, g3) {
				var move = moveMaps["URF".indexOf(g1)];
				var pow = ~~g2 || 1;
				pow = g3 ? (12 - pow) : pow;
				for (var p = 0; p < pow; p++) {
					var tmp = [];
					for (var i = 0; i < 17 * 6; i++) {
						tmp[i] = state[move[i]];
					}
					state = tmp;
				}
			});
			var colors = kernel.getProp('colcube').match(colre);
			for (var f = 0; f < 6; f++) {
				var offx = 10 / 3 * [1, 2, 1, 1, 0, 3][f],
					offy = 10 / 3 * [0, 1, 1, 2, 1, 1][f];
				for (var s = 0; s < 5; s++) {
					var x = [0, 2, 0, 2, 1][s],
						y = [0, 0, 2, 2, 1][s];
					drawPolygon(svg, colors[(state[f * 17 + s] + 3) % 6], [
						[x, x, x + 1, x + 1],
						[y, y + 1, y + 1, y]
					], [width, offx + 0.1, offy + 0.1]);
				}
				for (var s = 0; s < 4; s++) {
					var c1 = state[f * 17 + s * 3 + 5];
					var c2 = state[f * 17 + s * 3 + 6];
					var c3 = state[f * 17 + s * 3 + 7];
					var rot = [
						[1, 0, 0, 0, 1, 0],
						[0, -1, 3, 1, 0, 0],
						[-1, 0, 3, 0, -1, 3],
						[0, 1, 0, -1, 0, 3]
					][s];
					if (c1 == c2 && c2 == c3) {
						drawPolygon(svg, colors[(c1 + 3) % 6], Transform([
							[1, 1, 2, 2],
							[0, 1, 1, 0]
						], rot), [width, offx + 0.1, offy + 0.1]);
					} else if (c1 == c2) {
						drawPolygon(svg, colors[(c1 + 3) % 6], Transform([
							[1, 1, 2, 1.5],
							[0, 1, 1, 0]
						], rot), [width, offx + 0.1, offy + 0.1]);
						drawPolygon(svg, colors[(c3 + 3) % 6], Transform([
							[1.5, 2, 2],
							[0, 1, 0]
						], rot), [width, offx + 0.1, offy + 0.1]);
					} else {
						drawPolygon(svg, colors[(c1 + 3) % 6], Transform([
							[1, 1, 1.5],
							[0, 1, 0]
						], rot), [width, offx + 0.1, offy + 0.1]);
						drawPolygon(svg, colors[(c3 + 3) % 6], Transform([
							[1.5, 1, 2, 2],
							[0, 1, 1, 0]
						], rot), [width, offx + 0.1, offy + 0.1]);
					}
				}
			}
			return svg;
		}
	})();

	/**
	 *	last layer image
	 *	pieces = U1U2...U9F1..F3R1..L3
	 *	   B3 B2 B1
	 *	L1 U1 U2 U3 R3
	 *	L2 U4 U5 U6 R2
	 *	L3 U7 U8 U9 R1
	 *	   F1 F2 F3
	 */
	var llImage = (function() {
		function drawImage(pieces, arrows, img) {
			var svg = new $.svg();
			var colors = kernel.getProp('colcube').match(colre);
			var dim = 3;
			if (pieces.length == 12) {
				dim = 2;
			} else if (pieces.length == 32) {
				dim = 4;
			}
			var width = 50;
			svg.width = (dim + 1.2) * width;
			svg.height = (dim + 1.2) * width;
			for (var i = 0; i < dim * dim; i++) {
				var x = i % dim + 0.5;
				var y = ~~(i / dim) + 0.5;
				drawPolygon(svg, colors["DLBURF".indexOf(pieces[i])] || '#888', [
					[x, x + 1, x + 1, x],
					[y, y, y + 1, y + 1]
				], [width, 0.1, 0.1]);
			}
			for (var i = 0; i < dim * 4; i++) {
				var x = i % dim;
				var rot = ~~(i / dim);
				drawPolygon(svg, colors["DLBURF".indexOf(pieces[i + dim * dim])] || '#888', Rotate([
					[x - dim / 2, x - dim / 2 + 1, (x - dim / 2 + 1) * 0.9, (x - dim / 2) * 0.9],
					[dim / 2 + 0.05, dim / 2 + 0.05, dim / 2 + 0.5, dim / 2 + 0.5]
				], -rot * PI / 2), [width, 0.6 + dim / 2, 0.6 + dim / 2]);
			}
			arrows = arrows || [];
			for (var i = 0; i < arrows.length; i++) {
				var arrow = arrows[i];
				var x1, y1, x2, y2;
				if (typeof arrow[0] === 'number') {
					x1 = arrow[0] % dim + 1.1;
					y1 = ~~(arrow[0] / dim) + 1.1;
				} else {
					x1 = arrow[0][0] + 1.1;
					y1 = arrow[0][1] + 1.1;
				}
				if (typeof arrow[1] === 'number') {
					x2 = arrow[1] % dim + 1.1;
					y2 = ~~(arrow[1] / dim) + 1.1;
				} else {
					x2 = arrow[1][0] + 1.1;
					y2 = arrow[1][1] + 1.1;
				}
				var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
				drawPolygon(svg, '#000', Rotate([
					[0.2, length - 0.4, length - 0.4, length - 0.1, length - 0.4, length - 0.4, 0.2],
					[0.05, 0.05, 0.15, 0, -0.15, -0.05, -0.05]
				], Math.atan2(y2 - y1, x2 - x1)), [width, x1, y1]);
			}
			if (img) {
				img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
			}
			return svg;
		}

		function draw(size, moveseq, img) {
			var state = nnnImage.genPosit(size, moveseq);
			var pieces = [];
			for (var i = 0; i < size * size; i++) {
				pieces.push("DLBURF"[state[3 * size * size + i]]);
			}
			for (var j = 0; j < 4; j++) {
				var offset = [5, 4, 2, 1][j] * size * size;
				for (var i = 0; i < size; i++) {
					var ii = [i, i, size - 1 - i, size - 1 - i][j];
					pieces.push("DLBURF"[state[offset + ii]]);
				}
			}
			return drawImage(pieces.join(''), [], img);
		}

		return {
			drawImage: drawImage,
			draw: draw
		}
	})();

	/**
	 *	cube image of URF faces
	 *	pieces = U1U2...U9R1..R9F1..F9
	 *	U1 U3 R3 R9
	 *	U7 U9 R1 R7
	 *	F1 F3
	 * 	F7 F9
	 */
	var face3Image = (function() {
		var width = 20;
		var gap = 1;
		var ftrans = [
			[width * hsq3, -width * hsq3, (width * 3 + gap) * hsq3, width / 2, width / 2, 0],
			[width * hsq3, 0, (width * 3 + gap * 2) * hsq3, -width / 2, width, width * 3 + gap * 1.5],
			[width * hsq3, 0, 0, width / 2, width, width * 1.5 + gap * 1.5],
		]
		function drawImage(pieces, img) {
			var svg = new $.svg();
			var colors = kernel.getProp('colcube').match(colre);
			svg.width = (6 * width + gap * 2) * hsq3;
			svg.height = (6 * width + gap * 1.5);
			for (var i = 0; i < 27; i++) {
				var x = i % 3;
				var y = ~~(i / 3) % 3;
				drawPolygon(svg, colors["DLBURF".indexOf(pieces[i])] || '#888', [
					[x, x + 1, x + 1, x],
					[y, y, y + 1, y + 1]
				], ftrans[~~(i / 9)]);
			}
			if (img) {
				img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
			}
			return svg;
		}
		return drawImage;
	})();

	var ftollImage = (function() {
		var puzzle, polys;
		var faceMap = [0, 6, 7, 1, 4, 3, 2, 5];
		var cellMap = [
			[0, 3, 8, 1, 6, 4, 2, 7, 5],
			[0, 1, 4, 2, 5, 7, 3, 6, 8],
			[0, 3, 8, 2, 7, 5, 1, 6, 4],
			[0, 2, 7, 1, 5, 4, 3, 6, 8],
			[4, 6, 8, 7, 5, 2, 3, 1, 0],
			[8, 6, 4, 3, 1, 0, 5, 7, 2],
			[4, 6, 8, 1, 3, 0, 7, 5, 2],
			[8, 3, 0, 6, 1, 4, 5, 7, 2]
		];
		var side = {1: [0, 2, 3, 7, 8], 2: [0, 1, 2, 4, 5], 7: [4, 5, 6, 7, 8]};

		function init() {
			if (puzzle) {
				return;
			}
			var params = poly3d.getFamousPuzzle('fto');
			puzzle = poly3d.makePuzzle.apply(poly3d, params.polyParam);
			polys = [];
			puzzle.enumFacesPolys(function(face, p, poly) {
				polys.push([face, p, poly]);
			});
		}

		function drawFace(face, img) {
			init();
			var colors = kernel.getProp('colfto').match(colre);
			var draw = [];
			var cx = 0, cy = 0, n = 0, u0;
			for (var i = 0; i < polys.length; i++) {
				var f = polys[i][0], p = polys[i][1], poly = polys[i][2];
				if (poly.norm.y <= 0 || (f && side[f].indexOf(cellMap[f][p]) < 0)) {
					continue;
				}
				var xs = [], ys = [];
				for (var j = 0; j < poly.paths.length; j++) {
					xs.push(poly.paths[j].p1.x);
					ys.push(-poly.paths[j].p1.z);
				}
				var px = poly.center.x, py = -poly.center.z;
				if (f == 0) {
					cx += px;
					cy += py;
					n++;
					if (cellMap[0][p] == 0) {
						u0 = [px, py];
					}
				}
				draw.push([xs, ys, face[faceMap[f] * 9 + cellMap[f][p]]]);
			}
			cx /= n;
			cy /= n;
			var a = Math.PI / 2 - Math.atan2(u0[1] - cy, u0[0] - cx);
			var ca = Math.cos(a), sa = Math.sin(a);
			var minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
			for (var i = 0; i < draw.length; i++) {
				var xs = draw[i][0], ys = draw[i][1];
				for (var j = 0; j < xs.length; j++) {
					var dx = xs[j] - cx, dy = ys[j] - cy;
					xs[j] = cx + dx * ca - dy * sa;
					ys[j] = cy + dx * sa + dy * ca;
					minx = Math.min(minx, xs[j]);
					maxx = Math.max(maxx, xs[j]);
					miny = Math.min(miny, ys[j]);
					maxy = Math.max(maxy, ys[j]);
				}
			}
			var svg = new $.svg();
			var scale = 180 / (maxx - minx);
			svg.width = 180;
			svg.height = Math.round((maxy - miny) * scale);
			for (var i = 0; i < draw.length; i++) {
				drawPolygon(svg, colors[draw[i][2]], [draw[i][0], draw[i][1]], [scale, -minx, -miny]);
			}
			if (img) {
				img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
			}
			return svg;
		}
		return {
			drawFace: drawFace
		};
	})();

	/**
	 *  F1 R1 L1 F2 F3 F4 R L F5..
	 */
	var pyrllImage = (function() {
		var width = 20;

		function drawImage(pieces, img) {
			var svg = new $.svg();
			svg.width = 6 * hsq3 * width;
			svg.height = 6 * hsq3 * width;
			var colors = kernel.getProp('colpyr').match(colre);
			var idx = 0;
			for (var i = 0; i < 3; i++) {
				for (var f = 0; f < 3; f++) {
					for (var j = 0; j < (i * 2 + 1); j++) {
						var piece;
						var x = -hsq3 * i + hsq3 * j;
						var y = i / 2;
						if (j % 2 == 0) {
							piece = [[x, x - hsq3, x + hsq3], [y, y + 0.5, y + 0.5]];
						} else {
							piece = [[x - hsq3, x, x + hsq3], [y, y + 0.5, y]];
						}
						drawPolygon(svg, colors["FLRD".indexOf(pieces[idx])] || '#888', Rotate(piece, PI / 3 * 4 * f), [width, 3 * hsq3, 3 + (6 * hsq3 - 4.5) / 2]);
						idx++;
					}
				}
			}
			if (img) {
				img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
			}
			return svg;
		}
		return drawImage;
	})();

	var polyhedronImage = (function() {
		var puzzleCache = {};

		return function(svg, type, moveseq, faceNameMask, minArea) {
			var colors = [];
			var moves = [];
			minArea = minArea || 0;
			var gap = 0.05;
			var puzzle = puzzleCache[type];

			var params = poly3d.getFamousPuzzle(type);
			if (params != null) {
				puzzle = puzzle || poly3d.makePuzzle.apply(poly3d, params.polyParam);
				params.parser = params.parser || poly3d.makePuzzleParser(puzzle);
				moves = params.parser.parseScramble(moveseq);
				gap = params.pieceGap;
				colors = params.colors;
			} else {
				debugger; // unknown puzzle
			}

			DEBUG && console.log('[polyhedron image] puzzle=', puzzle, 'moves=', moves);
			puzzleCache[type] = puzzle;
			var poly2d = poly3d.renderNet(puzzle, gap, minArea);
			var sizes = poly2d[0];
			var polys = poly2d[1];
			var faces = poly2d[2];
			var posit = [];
			for (var i = 0; i < polys.length; i++) {
				posit[i] = polys[i] && polys[i][2];
			}
			for (var midx = 0; midx < moves.length; midx++) {
				var move = moves[midx];
				var moveIdx = puzzle.getTwistyIdx(move[0]);
				if (moveIdx == -1) {
					debugger; // error, cannot find move permutations
				}
				var perm = puzzle.moveTable[moveIdx];
				var maxPow = puzzle.twistyDetails[moveIdx][1];
				var pow = (move[1] % maxPow + maxPow) % maxPow;
				var posit2 = [];
				for (var i = 0; i < posit.length; i++) {
					var val = i;
					for (var j = 0; j < pow; j++) {
						val = perm[val] < 0 ? val : perm[val];
					}
					posit2[i] = posit[val];
				}
				posit = posit2;
			}
			if (type == 'skb') {
				colors = $.col2std(kernel.getProp("colskb"), [0, 2, 4, 3, 5, 1])
				var trans = [
					[hsq3, -hsq3, hsq3 * 2, 0.5, 0.5, -1],
					[hsq3, 0, 0, -0.5, 1, 2],
					[hsq3, 0, 0, 0.5, 1, -2],
					[hsq3, 0, 0, 0.5, 1, -2],
					[hsq3, 0, 0, 0.5, 1, -2],
					[hsq3, 0, 0, -0.5, 1, 2]
				];
				for (var i = 0; i < 6; i++) {
					for (var j = 0; j < 6; j++) {
						if (j % 3 != 2) {
							trans[i][j] *= 8 / sizes[0];
						}
					}
				}
				for (var i = 0; i < polys.length; i++) {
					if (!polys[i]) {
						continue;
					}
					var poly = Transform(polys[i], trans[polys[i][2]]);
					polys[i][0] = poly[0];
					polys[i][1] = poly[1];
				}
				sizes = [8 * hsq3, 6];
			}
			var scale = Math.min(1.6 / sizes[0], 1.0 / sizes[1]) * 300;
			svg.width = sizes[0] * scale;
			svg.height = sizes[1] * scale;
			for (var i = 0; i < colors.length; i++) {
				colors[i] = '#' + colors[i].toString(16).padStart(6, '0');
			}
			for (var i = 0; i < posit.length; i++) {
				polys[i] && drawPolygon(svg, colors[posit[i]], polys[i], [scale, 0, 0, 0, scale, 0]);
			}
			for (var i = 0; i < faces.length; i++) {
				if ((faceNameMask >> i & 1) == 0) {
					continue;
				}
				var face = faces[i];
				svg.addText(face[2].toUpperCase(), [face[0] * scale, face[1] * scale], {
					'font': '20px Arial',
					'fill': kernel.getProp('col-font'),
					'stroke': kernel.getProp('col-board'),
					'stroke-width': '3px'
				});
			}
			var recons = [];
			for (var midx = 0; midx < moves.length; midx++) {
				recons.push(params.parser.move2str(moves[midx]));
			}
			return ["~", recons, type];
		}
	})();


	var sldImage = (function() {

		return function(svg, type, size, moveseq) {
			var width = 50;
			var gap = 0.05;

			var state = [];
			var effect = [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0]
			];
			for (var i = 0; i < size * size; i++) {
				state[i] = i;
			}
			var x = size - 1;
			var y = size - 1;

			var movere = /([ULRD\uFFEA\uFFE9\uFFEB\uFFEC])([\d]?)/;
			moveseq = moveseq.split(' ');
			for (var s = 0; s < moveseq.length; s++) {
				var m = movere.exec(moveseq[s]);
				if (!m) {
					continue;
				}
				var turn = 'ULRD\uFFEA\uFFE9\uFFEB\uFFEC'.indexOf(m[1]) % 4;
				var pow = ~~m[2] || 1;
				var eff = effect[type == 'b' ? 3 - turn : turn];
				for (var p = 0; p < pow; p++) {
					mathlib.circle(state, x * size + y, (x + eff[0]) * size + y + eff[1]);
					x += eff[0];
					y += eff[1];
				}
			}

			svg.width = (size + gap * 4) * width;
			svg.height = (size + gap * 4) * width;

			var cols = kernel.getProp('col15p').match(colre);
			cols[size - 1] = cols.at(-1);
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					var val = state[j * size + i];
					var colorIdx = Math.min(~~(val / size), val % size);
					val++;
					drawPolygon(svg, cols[colorIdx], [
						[i + gap, i + gap, i + 1 - gap, i + 1 - gap],
						[j + gap, j + 1 - gap, j + 1 - gap, j + gap]
					], [width, gap * 2, gap * 2]);
					if (val == size * size) {
						continue;
					}
					svg.addText(val, [width * (i + 0.5 + gap * 2), width * (j + 0.5 + gap * 2)], {
						'font': width * 0.6 + 'px Arial',
						'fill': '#000'
					});
				}
			}
		}
	})();

	var types_nnn = ['222', '333', '444', '555', '666', '777', '888', '999', '101010', '111111'];

	function renderSVG(svg, scramble) {
		var type = scramble[0];
		if (type == 'input') {
			type = tools.scrambleType(scramble[1]);
		}
		type = tools.puzzleType(type);
		var size = types_nnn.indexOf(type);
		var recons = 0;
		if (size >= 0) {
			recons = nnnImage.draw(svg, size + 2, scramble[1]);
		} else if (type == "cubennn") {
			nnnImage.draw(svg, scramble[2], scramble[1]);
		} else if (poly3d.udpolyre.exec(type)) {
			var faceNameMask = 0;
			if (/^prc|giga|mgm|klm$/.exec(type)) {
				faceNameMask = 0x3;
			} else if (type == 'fto') {
				faceNameMask = 0xff;
			} else if (type == 'ctico') {
				faceNameMask = 0xfffff;
			}
			recons = polyhedronImage(svg, type, scramble[1], faceNameMask, type == 'klm' ? 0.1 : 0);
		} else if (type == "sq1" || type == "sq2") {
			recons = sq1Image.scrImage(svg, scramble[1], type == "sq2");
		} else if (type == "clk") {
			clkImage(svg, scramble[1]);
		} else if (type == "gear") {
			gearImage(svg, scramble[1]);
		} else if (type == "mrbl") {
			mrblImage(svg, 3, scramble[1]);
		} else if (type == "15b" || type == "15p") {
			sldImage(svg, type[2], 4, scramble[1]);
		} else if (type == "8b" || type == "8p") {
			sldImage(svg, type[1], 3, scramble[1]);
		} else if (/^r(3(ni)?|23\d+w?|mngf)$/.exec(type)) {
			var subScrs = [];
			scramble[1].replaceAll(/(?:^|\n)\s*(\d+|3oh|pyr|skb|sq1|clk|mgm)\)\s*([^\0]*?)\s*(?=\n.*\)|$)/g, function(m, p1, p2) {
				var subType = type.startsWith('r3') ? '333' :
					type == 'rmngf' ? p1.replace('3oh', '333').padEnd(3, p1):
					types_nnn[subScrs.length];
				subScrs.push([subType, p2, 0]);
			});
			var n_height = Math.ceil(Math.sqrt(subScrs.length));
			var n_width = Math.ceil(subScrs.length / n_height);
			var GRID_WIDTH = 240;
			var GRID_HEIGHT = 150;
			svg.width = n_width * GRID_WIDTH;
			svg.height = n_height * GRID_HEIGHT;
			for (var i = 0; i < subScrs.length; i++) {
				var x = i % n_width * GRID_WIDTH;
				var y = ~~(i / n_width) * GRID_HEIGHT;
				var subSvg = new $.svg();
				renderSVG(subSvg, subScrs[i]);
				svg.addElem(subSvg.renderGroup(x, y, GRID_WIDTH, GRID_HEIGHT));
				svg.addText((i + 1).toString(), [x, y], {
					'font': '40px Arial',
					'fill': kernel.getProp('col-font')
				}, 1);
			}
		} else {
			return -1;
		}
		return recons;
	}

	function genImage(scramble, renderTool) {
		var svg = new $.svg();
		var recons = renderSVG(svg, scramble);
		if (recons == -1) { // not available
			return false;
		}
		if (!renderTool) {
			return svg;
		}
		var scale = Math.min(1.6 / svg.width, 1.0 / svg.height) * kernel.getProp('imgSize') * 0.6;
		img.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
		img.width(svg.width * scale + 'em');
		img.height(svg.height * scale + 'em');

		if (recons && kernel.getProp('imgRep')) {
			for (var i = 0; i < recons[1].length; i++) {
				recons[1][i] = recons[1][i] + '@' + (i + 1) * 1000;
			}
			recons[1] = recons[1].join(' ');
			img.click(function(recons) {
				replay.popupReplay.apply(null, recons);
			}.bind(null, recons));
		} else {
			img.click(function(svg, scale) {
				var popImg = $('<img style="display:block;">');
				popImg.attr('src', 'data:image/svg+xml;base64,' + btoa(svg.render()));
				popImg.css('object-fit', 'contain');
				kernel.showDialog([popImg, $.noop, undefined, $.noop], 'share', TOOLS_IMAGE);
			}.bind(null, svg, scale));
		}
		return true;
	}

	ISCSTIMER && execMain(function() {
		function execFunc(fdiv) {
			if (!fdiv) {
				return;
			}
			img = img || $('<img style="display:block;">');
			fdiv.empty().append(img);
			if (!genImage(tools.getCurScramble(), true)) {
				fdiv.html(IMAGE_UNAVAILABLE);
			}
		}

		$(function() {
			tools.regTool('image', TOOLS_IMAGE, execFunc);
		});
	});

	var colre = /#[0-9a-fA-F]{3}/g;

	return {
		draw: genImage,
		llImage: llImage,
		pyrllImage: pyrllImage,
		face3Image: face3Image,
		ftollImage: ftollImage,
		sqllImage: sq1Image.llImage
	}
})();

/* ==== tools/cross.js ==== */
"use strict";

var cross = (function(createMove, edgeMove, createPrun, setNPerm, getNPerm, Cnk, getPruning) {
	var permPrun, flipPrun, ecPrun, fullPrun;
	var cmv = [];
	var pmul = [];
	var fmul = [];

	var e1mv = [];
	var c1mv = [];
	var xxPrun01 = [];
	var xxPrun02 = [];

	function pmv(a, c) {
		var b = cmv[c][~~(a / 24)];
		return 24 * ~~(b / 384) + pmul[a % 24][(b >> 4) % 24]
	}

	function fmv(b, c) {
		var a = cmv[c][b >> 4];
		return ~~(a / 384) << 4 | fmul[b & 15][(a >> 4) % 24] ^ a & 15
	}

	function i2f(a, c) {
		for (var b = 3; 0 <= b; b--) c[b] = a & 1, a >>= 1
	}

	function f2i(c) {
		for (var a = 0, b = 0; 4 > b; b++) a <<= 1, a |= c[b];
		return a
	}

	function fullmv(idx, move) {
		var slice = cmv[move][~~(idx / 384)];
		var flip = fmul[idx & 15][(slice >> 4) % 24] ^ slice & 15;
		var perm = pmul[(idx >> 4) % 24][(slice >> 4) % 24];
		return (~~(slice / 384)) * 384 + 16 * perm + flip;
	}

	function init() {
		init = $.noop;
		for (var i = 0; i < 24; i++) {
			pmul[i] = [];
		}
		for (var i = 0; i < 16; i++) {
			fmul[i] = [];
		}
		var pm1 = [];
		var pm2 = [];
		var pm3 = [];
		for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 24; j++) {
				setNPerm(pm1, i, 4);
				setNPerm(pm2, j, 4);
				for (var k = 0; k < 4; k++) {
					pm3[k] = pm1[pm2[k]];
				}
				pmul[i][j] = getNPerm(pm3, 4);
				if (i < 16) {
					i2f(i, pm1);
					for (var k = 0; k < 4; k++) {
						pm3[k] = pm1[pm2[k]];
					}
					fmul[i][j] = f2i(pm3);
				}
			}
		}
		createMove(cmv, 495, getmv);

		permPrun = [];
		flipPrun = [];
		createPrun(permPrun, 0, 11880, 5, pmv);
		createPrun(flipPrun, 0, 7920, 6, fmv);

		//combMove[comb][m] = comb*, flip*, perm*
		//newcomb = comb*, newperm = perm x perm*, newflip = flip x perm* ^ flip*
		function getmv(comb, m) {
			var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var r = 4;
			for (var i = 0; i < 12; i++) {
				if (comb >= Cnk[11 - i][r]) {
					comb -= Cnk[11 - i][r--];
					arr[i] = r << 1;
				} else {
					arr[i] = -1;
				}
			}
			edgeMove(arr, m);
			comb = 0, r = 4;
			var t = 0;
			var pm = [];
			for (var i = 0; i < 12; i++) {
				if (arr[i] >= 0) {
					comb += Cnk[11 - i][r--];
					pm[r] = arr[i] >> 1;
					t |= (arr[i] & 1) << (3 - r);
				}
			}
			return (comb * 24 + getNPerm(pm, 4)) << 4 | t;
		}
	}

	function xxinit() {
		xxinit = $.noop;
		xinit();
		var obj1 = 4;
		var obj2 = 5;
		createPrun(xxPrun01, obj1 * 3 * 24 + obj1 * 2 + 576 * (obj2 * 3 * 24 + obj2 * 2), 576 * 576, 7, function(q, m) {
			var ec1 = q % 576;
			var ec2 = ~~(q / 576);
			return c1mv[~~(ec1 / 24)][m] * 24 + e1mv[ec1 % 24][m] + 576 * (c1mv[~~(ec2 / 24)][m] * 24 + e1mv[ec2 % 24][m])
		});
		obj2 = 6;
		createPrun(xxPrun02, obj1 * 3 * 24 + obj1 * 2 + 576 * (obj2 * 3 * 24 + obj2 * 2), 576 * 576, 7, function(q, m) {
			var ec1 = q % 576;
			var ec2 = ~~(q / 576);
			return c1mv[~~(ec1 / 24)][m] * 24 + e1mv[ec1 % 24][m] + 576 * (c1mv[~~(ec2 / 24)][m] * 24 + e1mv[ec2 % 24][m])
		});
	}

	function xinit() {
		xinit = $.noop;
		init();
		for (var i = 0; i < 24; i++) {
			c1mv[i] = [];
			e1mv[i] = [];
			for (var m = 0; m < 6; m++) {
				c1mv[i][m] = cornMove(i, m);
				var edge = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
				edge[i >> 1] = i & 1;
				edgeMove(edge, m);
				for (var e = 0; e < 12; e++) {
					if (edge[e] >= 0) {
						e1mv[i][m] = e << 1 | edge[e];
						break;
					}
				}
			}
		}
		ecPrun = [];
		for (var obj = 0; obj < 4; obj++) {
			var prun = [];
			createPrun(prun, (obj + 4) * 3 * 24 + (obj + 4) * 2, 576, 5, function(q, m) {
				return c1mv[~~(q / 24)][m] * 24 + e1mv[q % 24][m]
			});
			ecPrun[obj] = prun;
		}

		function cornMove(corn, m) {
			var idx = ~~(corn / 3);
			var twst = corn % 3;
			var idxt = [
				[3, 1, 2, 7, 0, 5, 6, 4],
				[0, 1, 6, 2, 4, 5, 7, 3],
				[1, 2, 3, 0, 4, 5, 6, 7],
				[0, 5, 1, 3, 4, 6, 2, 7],
				[4, 0, 2, 3, 5, 1, 6, 7],
				[0, 1, 2, 3, 7, 4, 5, 6]
			];
			var twstt = [
				[2, 0, 0, 1, 1, 0, 0, 2],
				[0, 0, 1, 2, 0, 0, 2, 1],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 1, 2, 0, 0, 2, 1, 0],
				[1, 2, 0, 0, 2, 1, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			];
			twst = (twst + twstt[m][idx]) % 3;
			return idxt[m][idx] * 3 + twst;
		}
	}

	var solvCross = new mathlib.Searcher(
		(idx) => idx[0] + idx[1] == 0,
		(idx) => Math.max(getPruning(permPrun, idx[0]), getPruning(flipPrun, idx[1])),
		(idx, move) => [pmv(idx[0], move), fmv(idx[1], move)],
		6, 3, [1, 2, 4, 9, 18, 36]
	);

	var solvXCross = new mathlib.Searcher(
		(idx) => idx[0] + idx[1] == 0 && idx[2] == (idx[4] + 4) * 2 && idx[3] == (idx[4] + 4) * 3,
		(idx) => Math.max(
			getPruning(permPrun, idx[0]),
			getPruning(flipPrun, idx[1]),
			getPruning(ecPrun[idx[4]], idx[3] * 24 + idx[2])
		),
		(idx, move) => [pmv(idx[0], move), fmv(idx[1], move), e1mv[idx[2]][move], c1mv[idx[3]][move], idx[4]],
		6, 3, [1, 2, 4, 9, 18, 36]
	);

	var solvXXCross = new mathlib.Searcher(
		(idx) => idx[0] + idx[1] == 0 && idx[2] == 4 * 2 && idx[3] == 4 * 3
				&& (idx[4] == 5 * 2 && idx[5] == 5 * 3 || idx[4] == 6 * 2 && idx[5] == 6 * 3),
		(idx) => Math.max(
			getPruning(permPrun, idx[0]),
			getPruning(flipPrun, idx[1]),
			getPruning(idx[6], idx[3] * 24 + idx[2] + 576 * (idx[5] * 24 + idx[4]))
		),
		(idx, move) => [
			pmv(idx[0], move), fmv(idx[1], move),
			e1mv[idx[2]][move], c1mv[idx[3]][move],
			e1mv[idx[4]][move], c1mv[idx[5]][move],
			idx[6]
		],
		6, 3, [1, 2, 4, 9, 18, 36]
	);

	var solvXXXCross = new mathlib.Searcher(
		(idx) => idx[0] + idx[1] == 0 && idx[2] == 4 * 2 && idx[3] == 4 * 3
				&& idx[4] == 5 * 2 && idx[5] == 5 * 3 && idx[6] == 6 * 2 && idx[7] == 6 * 3,
		(idx) => Math.max(
			getPruning(permPrun, idx[0]),
			getPruning(flipPrun, idx[1]),
			getPruning(xxPrun01, idx[3] * 24 + idx[2] + 576 * (idx[5] * 24 + idx[4])),
			getPruning(xxPrun02, idx[3] * 24 + idx[2] + 576 * (idx[7] * 24 + idx[6]))
		),
		(idx, move) => [
			pmv(idx[0], move), fmv(idx[1], move),
			e1mv[idx[2]][move], c1mv[idx[3]][move],
			e1mv[idx[4]][move], c1mv[idx[5]][move],
			e1mv[idx[6]][move], c1mv[idx[7]][move]
		],
		6, 3, [1, 2, 4, 9, 18, 36]
	);

	var faceStr = ["D", "U", "L", "R", "F", "B"];
	var moveIdx = ["FRUBLD", "FLDBRU", "FDRBUL", "FULBDR", "URBDLF", "DRFULB"]
	var rotIdx = ["&nbsp;&nbsp;", "z2", "z'", "z&nbsp;", "x'", "x&nbsp;"];
	var yrotIdx = ["FRUBLD", "RBULFD", "BLUFRD", "LFURBD"];

	var curScramble;

	function solve_cross(moves) {
		init();
		var ret = [];
		for (var face = 0; face < 6; face++) {
			var flip = 0;
			var perm = 0;
			for (var i = 0; i < moves.length; i++) {
				var m = moveIdx[face].indexOf("FRUBLD".charAt(moves[i][0]));
				var p = moves[i][2];
				for (var j = 0; j < p; j++) {
					flip = fmv(flip, m);
					perm = pmv(perm, m);
				}
			}
			var sol = solvCross.solve([perm, flip], 0, 50);
			for (var i = 0; i < sol.length; i++) {
				sol[i] = "FRUBLD".charAt(sol[i][0]) + " 2'".charAt(sol[i][1])
			}
			ret.push(sol);
		}
		return ret;
	}

	function solve_xcross(moves, face) {
		xinit();
		var flip = 0;
		var perm = 0;
		var e1 = [8, 10, 12, 14];
		var c1 = [12, 15, 18, 21];
		for (var i = 0; i < moves.length; i++) {
			var m = moveIdx[face].indexOf("FRUBLD".charAt(moves[i][0]));
			var p = moves[i][2];
			for (var j = 0; j < p; j++) {
				flip = fmv(flip, m);
				perm = pmv(perm, m);
				for (var obj = 0; obj < 4; obj++) {
					e1[obj] = e1mv[e1[obj]][m];
					c1[obj] = c1mv[c1[obj]][m];
				}
			}
		}
		var idxs = [];
		for (var i = 0; i < 4; i++) {
			idxs.push([perm, flip, e1[i], c1[i], i]);
		}
		var sol = solvXCross.solveMulti(idxs, 0, 20)[0];
		for (var i = 0; i < sol.length; i++) {
			sol[i] = "FRUBLD".charAt(sol[i][0]) + " 2'".charAt(sol[i][1])
		}
		return sol;
	}

	function solve_xxcross(moves, face, is3x) {
		xxinit();
		var idxs = [];
		var id3s = [];
		var yrot = 0;
		for (yrot = 0; yrot < 4; yrot++) {
			var flip = 0;
			var perm = 0;
			var e1 = [8, 10, 12];
			var c1 = [12, 15, 18];
			for (var i = 0; i < moves.length; i++) {
				var m = yrotIdx[yrot].indexOf("FRUBLD".charAt(moveIdx[face].indexOf("FRUBLD".charAt(moves[i][0]))));
				var p = moves[i][2];
				for (var j = 0; j < p; j++) {
					flip = fmv(flip, m);
					perm = pmv(perm, m);
					e1 = [e1mv[e1[0]][m], e1mv[e1[1]][m], e1mv[e1[2]][m]];
					c1 = [c1mv[c1[0]][m], c1mv[c1[1]][m], c1mv[c1[2]][m]];
				}
			}
			idxs.push([perm, flip, e1[0], c1[0], e1[1], c1[1], xxPrun01]);
			idxs.push([perm, flip, e1[0], c1[0], e1[2], c1[2], xxPrun02]);
			id3s.push([perm, flip, e1[0], c1[0], e1[1], c1[1], e1[2], c1[2]]);
		}
		var tt = +new Date;
		var sol = is3x ? solvXXXCross.solveMulti(id3s, 0, 20) : solvXXCross.solveMulti(idxs, 0, 20);
		var yrot = is3x ? sol[1] : (sol[1] >> 1);
		return sol[0].map((move) => yrotIdx[yrot][move[0]] + " 2'"[move[1]]);
	}

	function fullInit() {
		fullInit = $.noop;
		init();
		fullPrun = [];
		createPrun(fullPrun, 0, 190080, 7, fullmv, 6, 3, 6);
	}

	function mapCross(idx) {
		var comb = ~~(idx / 384);
		var perm = (idx >> 4) % 24;
		var flip = idx & 15;

		var arrp = [];
		var arrf = [];
		var pm = [];
		var fl = [];
		i2f(flip, fl);
		setNPerm(pm, perm, 4);
		var r = 4;
		var map = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0];
		for (var i = 0; i < 12; i++) {
			if (comb >= Cnk[11 - i][r]) {
				comb -= Cnk[11 - i][r--];
				arrp[map[i]] = pm[r];
				arrf[map[i]] = fl[r];
			} else {
				arrp[map[i]] = arrf[map[i]] = -1;
			}
		}
		return [arrp, arrf];
	}

	function getEasyCross(length) {
		fullInit();
		var lenA = Math.min(length % 10, 8);
		var lenB = Math.min(~~(length / 10), 8);
		var minLen = Math.min(lenA, lenB);
		var maxLen = Math.max(lenA, lenB);
		var ncase = [0, 1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080];
		var cases = mathlib.rn(ncase[maxLen + 1] - ncase[minLen]) + 1;
		var i;
		for (i = 0; i < 190080; i++) {
			var prun = getPruning(fullPrun, i);
			if (prun <= maxLen && prun >= minLen && --cases == 0) {
				break;
			}
		}
		return mapCross(i);
	}

	function getEasyXCross(length) {
		fullInit();
		xinit();
		var lenA = length % 10;
		var lenB = ~~(length / 10);
		var minLen = Math.min(lenA, lenB, 8);
		var maxLen = Math.max(lenA, lenB);
		var ncase = [1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080];
		length = Math.max(0, Math.min(maxLen, 8)); // cross length
		var remain = ncase[length];
		var isFound = false;
		var testCnt = 0;
		while (!isFound) {
			var rndIdx = [];
			var sample = 500;
			for (var i = 0; i < sample; i++) {
				rndIdx.push(mathlib.rn(remain));
			}
			rndIdx.sort(function(a, b) { return b - a; });
			var rndCases = [];
			var cnt = 0;
			for (var i = 0; i < 190080; i++) {
				var prun = getPruning(fullPrun, i);
				if (prun > length) {
					continue;
				}
				while (rndIdx.at(-1) == cnt) {
					rndCases.push(i);
					rndIdx.pop();
				}
				if (rndIdx.length == 0) {
					break;
				}
				cnt++;
			}
			rndIdx = mathlib.rndPerm(sample);
			for (var i = 0; i < sample; i++) {
				var caze = rndCases[rndIdx[i]];
				var comb = ~~(caze / 384);
				var perm = comb * 24 + (caze >> 4) % 24;
				var flip = comb << 4 | caze & 15;
				var sol = [];
				var corns = mathlib.rndPerm(8).slice(4);
				var edges = mathlib.rndPerm(8);

				var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var r = 4;
				for (var j = 0; j < 12; j++) {
					if (comb >= Cnk[11 - j][r]) {
						comb -= Cnk[11 - j][r--];
						arr[j] = -1;
					} else {
						arr[j] = edges.pop();
					}
				}
				for (var j = 0; j < 4; j++) {
					corns[j] = corns[j] * 3 + mathlib.rn(3);
					edges[j] = arr.indexOf(j) * 2 + mathlib.rn(2);
					var sol = solvXCross.solve([perm, flip, edges[j], corns[j], j], 0, isFound ? minLen - 1 : maxLen);
					if (sol == null) {
						continue;
					} else if (sol.length < minLen) {
						isFound = false; // too short
						break;
					} else if (sol.length <= maxLen) {
						isFound = true;
					}
				}
				if (!isFound) {
					continue;
				}
				var crossArr = mapCross(caze);
				crossArr[2] = mathlib.valuedArray(8, -1);
				crossArr[3] = mathlib.valuedArray(8, -1);
				var map = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0];
				var map2 = [6, 5, 4, 7, 2, 1, 0, 3];
				for (var i = 0; i < 4; i++) {
					crossArr[0][map[edges[i] >> 1]] = map[i + 4];
					crossArr[1][map[edges[i] >> 1]] = edges[i] % 2;
					crossArr[2][map2[~~(corns[i] / 3)]] = map2[i + 4];
					crossArr[3][map2[~~(corns[i] / 3)]] = (30 - corns[i]) % 3;
				}
				return crossArr;
			}
		}
	}


	ISCSTIMER && execMain(function() {

		function execCross(scramble, fdiv) {
			fdiv.empty();
			curScramble = cubeutil.parseScramble(scramble, "FRUBLD");
			var solutions = solve_cross(curScramble);
			for (var face = 0; face < 6; face++) {
				var span = $('<span class="sol"/>');
				var clk = $('<span />').html('ec').addClass('click').click(ecClick);
				span.append(faceStr[face] + "(", clk, "): " + rotIdx[face], tools.getSolutionSpan(solutions[face]), '<br>');
				fdiv.append(span);
			}
		}

		function ecClick() {
			var span = $(this).parent();
			var face = "DULRFB".indexOf(span.html()[0]);
			var sol = solve_xcross(curScramble, face);
			var clktxt = $(this).html();
			if (clktxt == 'ec') {
				sol = solve_xcross(curScramble, face);
				clktxt = 'xx';
			} else if (clktxt == 'xx') {
				sol = solve_xxcross(curScramble, face);
				clktxt = '3x';
			} else if (clktxt == '3x') {
				sol = solve_xxcross(curScramble, face, true);
				clktxt = '<<';
			} else {
				sol = solve_cross(curScramble)[face];
				clktxt = 'ec';
			}
			var clk = $('<span />').html(clktxt).addClass('click').click(ecClick);
			span.empty().append(faceStr[face] + "(", clk, "): " + rotIdx[face], tools.getSolutionSpan(sol), '<br>');
		}

		function execFunc(fdiv) {
			if (!fdiv) {
				return;
			}
			if (tools.isPuzzle('333')) {
				var scramble = tools.getCurScramble();
				execCross(scramble[1], fdiv);
			} else {
				fdiv.html(IMAGE_UNAVAILABLE);
			}
		}

		$(function() {
			tools.regTool('cross', TOOLS_SOLVERS + '>' + TOOLS_CROSS, execFunc);
		});
	});

	return {
		solve: solve_cross,
		getEasyCross: getEasyCross,
		getEasyXCross: getEasyXCross
	}
})(mathlib.createMove, mathlib.edgeMove, mathlib.createPrun, mathlib.setNPerm, mathlib.getNPerm, mathlib.Cnk, mathlib.getPruning);

/* ==== worker.js ==== */
"use strict";

var csTimerWorker = execBoth(ISCSTIMER && function() {
	if (!window.Worker) {
		return {};
	}
	var worker = new Worker('js/cstimer.js');
	var callbacks = {};
	var msgid = 0;

	worker.onmessage = function(e) {
		//data: [msgid, type, ret]
		var data = e.data;
		var callback = callbacks[data[0]];
		delete callbacks[data[0]];
		callback && callback(data[2]);
	};

	//[realType, len, state]
	function getScramble(args, callback) {
		++msgid;
		callbacks[msgid] = callback;
		worker.postMessage([msgid, 'scramble', args]);
		return msgid;
	}

	worker.postMessage([0, 'set', ['SCRAMBLE_NOOBST', SCRAMBLE_NOOBST]]);
	worker.postMessage([0, 'set', ['SCRAMBLE_NOOBSS', SCRAMBLE_NOOBSS]]);

	return {
		getScramble: getScramble
	};
}, function() {
	self.kernel = {
		getProp: function(key, def) {
			return self[key] == undefined ? def : self[key];
		},
		setProp: function(key, value) {
			self[key] = value;
		}
	};
	var configs = {
		'colcube': '#ff0#fa0#00f#fff#f00#0d0',
		'colpyr': '#0f0#f00#00f#ff0',
		'colskb': '#fff#00f#f00#ff0#0f0#f80',
		'colmgm': '#fff#d00#060#81f#fc0#00b#ffb#8df#f83#7e0#f9f#999',
		'colsq1': '#ff0#f80#0f0#fff#f00#00f',
		'colclk': '#f00#37b#5cf#ff0#850',
		'col15p': '#f99#9f9#99f#fff',
		'colfto': '#fff#808#0d0#f00#00f#bbb#ff0#fa0',
		'colico': '#fff#084#b36#a85#088#811#e71#b9b#05a#ed1#888#6a3#e8b#a52#6cb#c10#fa0#536#49c#ec9'
	};
	for (var key in configs) {
		self.kernel.setProp(key, configs[key]);
	}
	var funcs = {
		getScrambleTypes: function() {
			var keys = [];
			for (var key in scrMgr.scramblers) {
				keys.push(key);
			}
			return keys;
		},
		getScramble: function() {
			var scrambler = scrMgr.scramblers[arguments[0]];
			var scramble = scrambler.apply(scrambler, arguments);
			if (!ISCSTIMER) {
				scramble = scrMgr.toTxt(scramble);
			}
			return scramble;
		},
		setSeed: function(seed) {
			mathlib.setSeed(256, seed.toString());
		},
		setGlobal: function(key, value) {
			self.kernel.setProp(key, value);
		},
		getImage: function(scramble, type) {
			var ret = image.draw([type || '333', scramble]);
			return ret && ret.render();
		}
	};
	self.onmessage = function(e) {
		var data = e.data;
		var msgid = data[0];
		var type = data[1];
		var details = data[2];
		var ret = undefined;
		switch (type) {
			case 'scrtype': // get scramble types
				ret = funcs.getScrambleTypes();
				break;
			case 'scramble': //generate scramble cache
				ret = funcs.getScramble.apply(null, details);
				break;
			case 'seed': // set seed
				funcs.setSeed(details[0]);
				break;
			case 'image': //generate scramble image
				ret = funcs.getImage.apply(null, details)
				break;
			case 'set': //set global values
				funcs.setGlobal.apply(null, details);
				break;
			default:
				break;
		}
		postMessage([msgid, type, ret]);
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = funcs;
	}
});

module.exports.scrMgr = scrMgr;
module.exports.image = image;
})();
window.cstimerModule = module.exports;
