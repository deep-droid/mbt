// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// common.js

var ctxMenuId;
var ctxMenuInit = false;

var parentWinObj;
var FrameName = "";
var inIFrame = true;

/* All frames must implement mainCallbackFunc(action, params)
 *    action: adjustHeight, isChanged, close, reset, display (param: true/false), isLoaded(return true/false)
 * Call this iniFrame(frameName) in $(document).ready()
 * Also have 	window.onresize = adjustHeight(); to resize controls when window is resized.
 */
function initFrame (frameName_p) { // only for frames and window
	FrameName = frameName_p;
	if (window.opener) {
		parentWinObj = window.opener;
		inIFrame = false;
		parentWinObj.disableTabForWin(FrameName);
	}
	else {
		parentWinObj = parent;
	}

	
	if (parentWinObj.regWin) {
		parentWinObj.regWin(window, FrameName, mainCallbackFunc);
		window.onunload = function() { parentWinObj.detachWin(); };
	}

    initCommon(false);
}

function reloadFrame() {
	window.location.reload();
}


// called by children windows to clear it when win is closing.
function detachWin(frameName_p) {
	winList[frameName_p] = undefined;
	winCallbackFuncList [frameName_p] = undefined;
}

function ctxMenu(clickItemLocator_p, menuLocator_p, menuCallback_p, menuOutCallback_p) {
	$(clickItemLocator_p).rightClick( function(el) {
		ctxMenuId = $(el).attr("id");
		if (menuCallback_p) {
			menuCallback_p(ctxMenuId);
		}
	});
	$(clickItemLocator_p).showMenu({
		opacity: 1.0,
		query: menuLocator_p
	});
	
	if (!ctxMenuInit) {
		$(".menu li:not(.noHL)").hover(
				function() {$(this).addClass("menuHover");}, 
				function () {$(this).removeClass("menuHover")});
		$(".menu").bind("mouseleave", function() {
			$(this).hide(50);
			if (menuOutCallback_p) {
				menuOutCallback_p(ctxMenuId);
			}
		});
		ctxMenuInit = true;
	}

}

function getCtxId () {
	return ctxMenuId;
}


function makeButton(btnLocator_p) {
	$(btnLocator_p).css("background-image","url(img/btn1.png) no repeat")
       .hover(
    		function() { alert('hover');$(this).css("background-image","url(img/btn2.png) no repeat");}, 
			function() { $(this).css("background-image","url(img/btn1.png) no repeat");}
 	);
}


var shortCutExec = null;
var shortCutFuncList = [];
function initCommon(isMainWin_p) {
	if (isMainWin_p) {
		shortCutExec = this;
		inIFrame = false;
	}
	else {
		if (window.opener){ 
			shortCutExec = window.opener;
		}
		else {
			shortCutExec = parent;
		}
	}
	
	shortCutFuncList["exec"] = shortCutExec.startButton;
	shortCutFuncList["debug"] = shortCutExec.debugButton;
	shortCutFuncList["pause"] = shortCutExec.pauseButton;
	shortCutFuncList["resume"] = shortCutExec.startButton;
	shortCutFuncList["nextTrav"] = shortCutExec.stepOverButton;
	shortCutFuncList["nextScript"] = shortCutExec.stepScriptButton;
	shortCutFuncList["dryRun"] = shortCutExec.dryRunButton;
	shortCutFuncList["stop"] = shortCutExec.stopButton;
	shortCutFuncList["close"] = shortCutExec.closeModel;
//	shortCutFuncList["expandAll"] = shortCutExec.expandAll;
//	shortCutFuncList["collapseAll"] = shortCutExec.collapseAll;
	shortCutFuncList["save"] = shortCutExec.fileSave;
	shortCutFuncList["modelScript"] = function() { shortCutExec.reloadMScriptEditTab('webmbtMScriptEdit.html@model@'); };
	shortCutFuncList["reset"] = shortCutExec.resetAllPanes;
	shortCutFuncList["log"] = function() { shortCutExec.openLogWin('tabMscriptLog'); };
	shortCutFuncList["graph"] = shortCutExec.openGraph;
	shortCutFuncList["testSC"] = shortCutExec.testSC;
	shortCutFuncList["stepIn"] = shortCutExec.stepInButton;
	shortCutFuncList["mSave"] = shortCutExec.mScriptSave;
	shortCutFuncList["mCancel"] = shortCutExec.mScriptCancel;
	shortCutFuncList["pSave"] = shortCutExec.propertySave;
	shortCutFuncList["pCancel"] = shortCutExec.propertyCancel;
	shortCutFuncList["mCheck"] = shortCutExec.mScriptCheck;
	shortCutFuncList["mSearch"] = shortCutExec.mScriptSearch;
	shortCutFuncList["batchRun"] = shortCutExec.batchRun;
//	shortCutFuncList["modeling"] = shortCutExec.modeling;
	shortCutFuncList["stopAll"] = shortCutExec.stopAllButton;
	shortCutFuncList["closeOthers"] = shortCutExec.closeOtherModel;
	shortCutFuncList["treeView"] = shortCutExec.modelTreeView;
	shortCutFuncList["mcaseView"] = shortCutExec.mcaseView;

	shortCutFuncList["modelProp"] = shortCutExec.modelPropDialog;		
	shortCutFuncList["mbtSetting"] = shortCutExec.mbtSettingDialog;
	shortCutFuncList["canvasProp"] = shortCutExec.canvasProperty;

	var scList = shortCutExec.getConfigProperty("scList");
	if (scList==undefined) return;
	scList = scList.split(";");
	for (var sc in scList) {
		var pieces = scList[sc].split(":");
		var scFunc = shortCutFuncList[pieces[1]];
		if (scFunc) {
			shortcut.add(pieces[0], shortCutFuncList[pieces[1]]);
			if (isMainWin_p) {
				setTooltip(pieces[1], pieces[0]);
			}
		}
	}
	
	// disable ctrl/alt M,R,U,P,S
	document.onkeydown = disableKeys;
	document.onkeypress = disableKeys;
	document.onkeyup = disableKeys;
}

function disableKeys(event) {
	var code;
	if (!event) event = window.event;
	if (event.keyCode) code = event.keyCode;
	else if (event.which) code = event.which;
	var keyChar = String.fromCharCode(code);
	var keyCharUp = keyChar.toUpperCase();
	if ((event.altKey || event.ctrlKey || event.metaKey) &&
	    (keyCharUp=="K" || keyCharUp=="M" || keyCharUp=="R" ||
 	     keyCharUp=="B" || keyCharUp=="N" || keyCharUp=="I" ||
		 keyCharUp=="U" || keyCharUp=="S" || keyCharUp=="P")) {
		event.preventDefault();
		if (event.stopPropagation) {
		    event.stopPropagation();
		} 
	    event.cancelBubble = true;
//		event.keyCode = 0;
		return false;
	}
	else return true;
}

function execShortcut(scCode) {
	var sc = shortCutFuncList[scCode];
	if (typeof(sc)=="undefined") {
		alertDialog("shortcut.unknown");
		return;
	}
	
	eval (sc);
}

function setTooltip (funcCode_p, scLabel_p) {
	var scKey = scLabel_p;
	var idx = scLabel_p.lastIndexOf("+");
	if (idx>0) scKey = scKey.substring(idx+1);
	if (scKey.length>1) scKey = "*";
//	$("#" + funcCode_p + "Btn").next(".sc").html(scKey).attr("title", "shortcut key: " + scLabel_p);
	var fld = $("#" + funcCode_p + "Btn");
	$(fld).attr("title", $(fld).attr("title") + ";  shortcut key: " + scLabel_p);
	
	$("#" + funcCode_p + "Btn").next(".sc").attr("title", "shortcut key: " + scLabel_p);
	$("#" + funcCode_p + "Menu").find(".msc").html(scLabel_p);
}

function setupMiniButtons(elems, btnBackground) {
	if (btnBackground==undefined) {
		btnBackground = "#555555";
	}
	$(elems).hover(function(){$(this).css("background-color", "#9ED812");}, function(){$(this).css("background-color", "")});
	$(elems).mousedown(function(){$(this).css("border", "1px solid #8FBC8F");})
			.mouseup(function(){$(this).css("border", "1px solid " + btnBackground);})
			.mouseout(function(){$(this).css("border", "1px solid " + btnBackground);});
}


function closeFrame() {
	if (FrameName && parentWinObj) {
		parentWinObj.closeWin(FrameName);
	}
}


// from http://blog.pothoven.net/2006/07/get-request-parameters-through.html
function getRequestParam ( parameterName ) {
	var queryString = window.top.location.search.substring(1);
	// Add "=" to the parameter name (i.e. parameterName=value)
	var parameterName = parameterName + "=";
	if ( queryString.length > 0 ) {
	// Find the beginning of the string
		begin = queryString.indexOf ( parameterName );
		// If the parameter name is not found, skip it, otherwise return the value
		if ( begin != -1 ) {
			// Add the length (integer) to the beginning
			begin += parameterName.length;
			// Multiple parameters are separated by the "&" sign
			end = queryString.indexOf ( "&" , begin );
			if ( end == -1 ) {
				end = queryString.length
			}
			// Return the string
			return unescape ( queryString.substring ( begin, end ) );
		}
		// Return "null" if no parameter has been found
		return "null";
	}
}

function disableTabForWin(tabID_p) {
	if (this.findTabGroup) {
		var tabGroup = findTabGroup(tabID_p);
		if (tabGroup) {
			disableTab(tabGroup, tabID_p);
		}
	}
}