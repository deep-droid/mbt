// copyright 2008 - 2013, TestOptimal, LLC, all rights reserved.
// webmbtMScriptEditor.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	try {
		parentWinObj.handleJsError(errMsg, fileName, lineNum);
	}
	catch (err) {}
}

var editor = null;
var curNodeData = undefined;
var curStateNode;
var params;
var curTriggerType;
var mscriptLoaded = false;
var codeFoldText = '<div style="position: absolute; right: -3px; color:#600">&#x25bc;</div>%N%';
var curScriptType;

var formChanged;
function resetFormChanged() {
	$(".mScriptButton").hide();
	formChanged =false;
}

function display (refreshIt) {
	if (editor) return;
	else startLoadMScript();
}

function reset() {
	startLoadMScript();
}


$(document).ready(function() {
	initFrame("MScript");
	window.onresize = adjustHeight;
	adjustHeight();
	window.onbeforeunload = checkClosing;

	parentWinObj.sendAction("misc", "type=getMscriptMacroList", function(data) {
		mscriptMethodList = data;
		if (parentWinObj.curAppState.modelOpen) {
			startLoadMScript();
		}
		else {
			setTimeout ("startLoadMScript()", 2000);
		}
	});
	
	$(".btn img").hover(function(){ $(this).addClass("actionBtnHover");}, function(){ $(this).removeClass("actionBtnHover");});
	
	$(document).blur(function(e) {
		if (formChanged) mScriptSave();
	});
	
	$('body').bind("contextmenu",function(e){
		checkCodeAssist();
	   	return false;
	}); 
	
	$("#searchCtrl img").hover(function(){$(this).addClass("btnHover");}, function(){$(this).removeClass("btnHover")});
	
	$(".tagList tr").hover(function(){$(this).addClass("menuHover");}, function(){$(this).removeClass("menuHover")});
	initCodeAssist();
	setupPopupMenu();	
});

function checkClosing () {
	if (formChanged) {
		// save mscript changes, if error then alert user
		mScriptSave();
	}
}

function getReadonlyFlag () {
	if (curNodeData && (curNodeData.readOnly == "Y" || 
		curNodeData.readOnly == "true")) {
		return true;
	}
	else return false;
}

function startLoadMScript() {
	if (!parentWinObj.curAppState.modelOpen) return;
	
	curScriptType = parentWinObj.curAppState.mscriptType;
	curTriggerType = parentWinObj.curAppState.mscriptTrigger;
	curNodeData = parentWinObj.curAppState.curNodeData;
	if (curNodeData==undefined) {
		return;
	}
	if (curNodeData.typeCode!="state" && curNodeData.typeCode!="transition" &&
	    curNodeData.typeCode!="mbt" && 
	    curNodeData.typeCode!="usecase" && curNodeData.typeCode!="step") {
		curNodeData = parentWinObj.curAppState.nodeDataList["scxml"];
		curScriptType = "";
	}

	var readonlyOption = getReadonlyFlag();
	var readonlyText = "";
	if (readonlyOption) {
		readonlyText = " <small id='readonly'>(READONLY)</small>";
	}
	
	if (curScriptType=="") curScriptType = "scxml";
//	$("#searchCtrl img").hover(function(){$(this).addClass("btnHover");}, function(){$(this).removeClass("btnHover")});
//	
//	$(".tagList tr").hover(function(){$(this).addClass("menuHover");}, function(){$(this).removeClass("menuHover")});
//	initCodeAssist();
//	setupPopupMenu();	
//
	var scriptName = "";
	if (curScriptType == "state") {
	    scriptName = curNodeData.stateid;
	    if (!curTriggerType || curTriggerType=="") {
    		if (parentWinObj.isModelCFG()) {
		    	curTriggerType = "process";
		    }
		    else {
		    	curTriggerType = "onentry";
		    }
	    }
	    params = "stateuid=" + curNodeData.uid; //stateid;
		loadMScript("state", curTriggerType /*"onentry"*/, params);
	}
	else if (curScriptType == "transition") {
	    curStateNode = parentWinObj.curAppState.nodeDataList[curNodeData.parentuid];
	    scriptName = curNodeData.event + " from " + curStateNode.stateid;
	    if (!curTriggerType || curTriggerType=="") {
			if (parentWinObj.isModelCFG()) {
		    	curTriggerType = "guard";
		    }
		    else {
		    	curTriggerType = "action";
		    }
		}
	    params = "stateuid=" + curStateNode.uid + "&eventuid=" + curNodeData.uid;
		loadMScript("transition", curTriggerType, params);
	}

	else if (curScriptType == "mbt") {
	    scriptName = "MBT ";
	    if (!curTriggerType || curTriggerType=="") curTriggerType = "MBT_start";
		loadMScript("model", curTriggerType, "");
	}
	else if (curScriptType == "usecase") {
	    scriptName = "mCase: " + curNodeData.usecasename;
	    if (!curTriggerType || curTriggerType=="") curTriggerType = "setup";
	    params = "mcaseName=" + curNodeData.usecasename;
		loadMScript("usecase", curTriggerType, params);
	}
	else {
	    scriptName = "Model ";
		loadMScript("model", "", "");
		curTriggerType = "scxml";
	}

	applyTriggerSelectFilter(params);

    $("#editScriptType").html(scriptName + readonlyText);
			
	var optionText = "#mScriptTypeList option[value='" + curTriggerType + "']";
	$(optionText).attr("selected","selected");

	mscriptLoaded = true;
	adjustHeight();
}

function mScriptSave() {
	formChanged = false;
	if (curNodeData==null) return;
	
	if (curScriptType == "state") {
		save (curNodeData.uid, curTriggerType, "&nodeType=state&stateuid=" + curNodeData.uid);
	}
	else if (curScriptType == "transition") {
		save (curNodeData.uid, curTriggerType, "&nodeType=transition&stateuid=" + curStateNode.uid + "&eventuid=" + curNodeData.uid);
	}
	else if (curScriptType == "usecase") {
		save ("mbt", curTriggerType, "&nodeType=usercase&mcaseName=" + curNodeData.usecasename);
	}
	else if (curScriptType == "mbt") {
		save ("mbt", curTriggerType /* e.g. "MBT_end" */, "&nodeType=model");
	}
	else if (curScriptType == "scxml") {
		save ("scxml", "", "&nodeType=model");
	}
	
	parentWinObj.refreshUID(curNodeData.uid);
	
//	resetFormChanged();
	
}

function isChanged() {
	return formChanged;
}

var foldFunc_XML;

function refreshEditor(textareaName_p) {
	var readonlyOption = getReadonlyFlag();

  	foldFunc_XML = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
	var wordWrap = (parentWinObj.getConfigProperty("MScriptWrap")=="Y");
	var indentCharNum = parentWinObj.getConfigProperty("mScriptIndent");

	// mscript mode - detect mscript function name
	CodeMirror.defineMode("mscript", mscriptModeImpl);


	var txtArea = document.getElementById(textareaName_p);

    editor = CodeMirror.fromTextArea(txtArea, {
	    lineNumbers: true,
		mode: {name: "mscript"}, //"xml"},
		alignCDATA: true,
		indentUnit: parseInt(indentCharNum),
		autoCloseTags: true,
		readOnly: readonlyOption,
//		onBlur: autoSave, // causing compiling error to auto scroll and cancel code assist popup
		fixedGutter: true,
		lineWrapping: wordWrap, // if set to true, it caused inability to move cursor to the end of line
		highlightSelectionMatches: true,
		extraKeys: {
			"Ctrl-Space": function(cm) { checkCodeAssist(); },
			"Cmd-Space": function(cm) { checkCodeAssist(); },
			"Ctrl-B": function(cm) { foldFunc_XML(cm, cm.getCursor().line);},
			"Cmd-B": function(cm) { foldFunc_XML(cm, cm.getCursor().line);},
			"Ctrl-E": function(cm) { evalMScript(); },
			"Cmd-E": function(cm) { evalMScript(); },

			"Ctrl-F": function(cm) { openSearch(); },
			"Cmd-F": function(cm) { openSearch(); },

			"Ctrl-K": function(cm) { mScriptCheck(); },
			"Cmd-K": function(cm) { mScriptCheck(); },

			"Ctrl-L": function(cm) { openGoto(); },
			"Cmd-L": function(cm) { openGoto(); },

			"Ctrl-M": function(cm) { caMacro(); },
			"Cmd-M": function(cm) { caMacro(); },
			"Ctrl-P": function(cm) { caExpr("plugin"); },
			"Cmd-P": function(cm) { caExpr("plugin"); },
			"Ctrl-R": function(cm) { caReqTag(false); },
			"Cmd-R": function(cm) { caReqTag(false); },
			"Ctrl-S": function(cm) { caExpr("sys"); },
			"Cmd-S": function(cm) { caExpr("sys"); },
			"Ctrl-U": function(cm) { caUiMap(); },
			"Cmd-U": function(cm) { caUiMap(); },
			"Ctrl-/": function(cm) { commentSelection(true); },
			"Cmd-/": function(cm) { commentSelection(true); },
			"Shift-Ctrl-/": function(cm) { commentSelection(false); },
			"Shift-Cmd-/": function(cm) { commentSelection(false); }
		},
		gutters: ["breakpoints", "CodeMirror-linenumbers", "CodeMirror-folded"]
	  });

	editor.setOption("theme", "to");
	editor.on("gutterClick", toggleBreak);
	editor.on("cursorActivity", function(cursor) {
//		editor.matchHighlight("CodeMirror-matchhighlight");
		cursorActivity(cursor);
	});
	
	editor.on("change", function(cm, obj) {
		formChanged = true;
		parentWinObj.setModelChanged(true);
	});
	
	editor.on("mousedown", function(cm, obj) {
		$("#hoverMenu").hide();
	});

	initSearch(); 
	initCompile();
	initGoto();
	hlLine = editor.addLineClass(0, "wrap", "activeline");
	showBreakpoints();
	
	if (parentWinObj.isModelCFG()) {
		$(".fsm").hide();
	}
	else {
		$(".cfg").hide();	
	}
	adjustHeight();
	return editor;
}

function getSelectedRange() {
	return { from: editor.getCursor(true), to: editor.getCursor(false) };
}

function autoFormatSelection() {
	var range = getSelectedRange();
	editor.autoFormatRange(range.from, range.to);
}

function commentSelection(isComment) {
	var range = getSelectedRange();
	editor.commentRange(isComment, range.from, range.to);
}      

var foldableTags = {
		"state": true, 
		"transition": true,
		"mbt": true,
		"mscript": true,
		"while": true,
		"if": true,
		"script": true,
		"mcase": true,
		"func": true,
		"dataset": true,
		"rowdata": true,
		"seqout": true,
		"output": true,
		"sql": true
	}

function evalMScript() {
	var scriptText = "";
	if (setCurContextVars()) {
	    scriptText = editor.getSelection();
	}
	else {
	    scriptText = curLine.substring(curLine.lastIndexOf('"',curPos.ch), curLine.indexOf('"',curPos.ch));
	}
	if (scriptText.indexOf('"')==0) {
		scriptText = scriptText.substring(1);
	}
	if (scriptText.lastIndexOf('"')==scriptText.length-1) {
		scriptText = scriptText.substring(0, scriptText.length-1);
	}
	parentWinObj.execMScriptExpr(scriptText);
}


var curTagName;
var curAttrName;
var curLine; // cur line string
var curPos; // pos obj, contains .line and .chr
var curString; // cur line text
var curToken;

// returns true if something is selected. false if nothing is selected
function setCurContextVars() {
	curPos = editor.getCursor();
	curLine = editor.getLine(curPos.line);
	curToken = editor.getTokenAt(curPos);
	curString = curToken.string;
	if (curString.length>1) curString = curString.substring(1, curString.length-1); // remove quotes around it
	var state = curToken.state;
	curTagName = state.base.tagName;
	if (curTagName=="!text") {
		curTagName = state.context.prev.tagName;
	}	

	var halfLine = curLine.substring(0, curPos.ch);
	var idx = halfLine.lastIndexOf('="');
	curAttrName = "";
	if (idx>=0) {
		curAttrName = $.trim(halfLine.substring(0,idx));
	}
	idx = curAttrName.lastIndexOf(' ');
	if (idx>=0) {
		curAttrName = $.trim(curAttrName.substring(idx));
	}
	if (editor.somethingSelected()) return true;
	else return false;
}


function checkCodeAssist() {
	setCurContextVars();
	
	if (editor.getOption("readOnly")) return;
	
	if ($.trim(curLine)=="") {
		// tag code assist
		caScriptTag();
		return;
	}

	if (curToken.type!="string" && curToken.type!="mscriptFunc") {
		return;
	}
	
	caExpr("");
}

// must be in lid attr
function toggleBreak(cm, line, gutterClass, mouseEvt) { 
	
    var info = editor.lineInfo(line);
	
	if (gutterClass=="CodeMirror-folded") {
		foldFunc_XML(cm, line);
		return;
	}

	
    var idx = info.text.indexOf('lid="');
    if (idx<0) return false;
    
    editor.setCursor(line, idx+6);
	setCurContextVars();
//	if (curAttrName!="lid") return;
	var lid = curString;
	
	if (curTagName == "script" ||
		curTagName == "mscript" ||
		curTagName == "comment" ||
		curTagName == "mcase" ||
		curTagName == "state" ||
		curTagName == "transition") {
		return; // can not set breakpoint on these tags
	}
    var info = editor.lineInfo(curPos.line);
    if (info.gutterMarkers && info.gutterMarkers["breakpoints"]) {
		parentWinObj.sendAction ("removeBreak", "uid=L" + lid);
    	removeBreakpoint(lid);
    }
  	else {
		parentWinObj.sendAction ("setBreak", "uid=L" + lid);
    	setBreakpoint(lid);
	}
}

function findLineByLid(lid_p) {
    var searchCur = editor.getSearchCursor(" lid=\"" + lid_p + "\"");
    if (!searchCur.findNext()) return;
    var lineNum = searchCur.from().line;
	return lineNum;
}

function makeMarker() {
  var marker = document.createElement("div");
  marker.style.color = "red";
  marker.class="breakpointMarker";
  marker.innerHTML = "<font size=3>&#149;</font>";
  return marker;
}

function removeBreakpoint(breakID_p) {
	var lineNum = findLineByLid(breakID_p);

	if (lineNum!=undefined) {
//		var lineInfo = editor.lineInfo(lineNum);
//			editor.setGutterMarker(lineNum, null);
//		}
//		else {
		editor.setGutterMarker(lineNum, "breakpoints", null);
		// remove marker from breakMarkerList
//		}
	}
}

function setBreakpoint(breakID_p) {
	var lineNum = findLineByLid(breakID_p);
	if (lineNum!=undefined) {
		var lineInfo = editor.lineInfo(lineNum);
		if (lineInfo.markers) return; // already has the breakpoint
		var marker = makeMarker();
//		if (lineInfo.markerText) marker = lineInfo.markerText; 
		var breakMarker = editor.setGutterMarker(lineNum, "breakpoints", marker);
		breakMarkerList.push(breakMarker);
	}
}


function showBreakpoints() {
	parentWinObj.sendAction("debug", "type=getBreakpoints", updateBreakpoints);
}

var breakMarkerList = new Array();

function updateBreakpoints(data) {
	for (var i in breakMarkerList) {
		if (breakMarkerList[i]) breakMarkerList[i].clear(); //editor.clearMarker(i);
	}
			
	breakMarkerList = new Array();
	for (var i in data) {
		if (data[i].indexOf("L")<0) continue;
		setBreakpoint (parseInt(data[i].substring(1)));
	}
	setPausedAt();
	
	return;
}
	

//called from main to set paused at the line number passed in
var pausedAtLineFrom = -1;
var pauseAtLineTo = -1;
function setPausedAt () {
	if (editor==null) return;
	for (var i=pausedAtLineFrom; i>=0 && i<=pausedAtLineTo; i++) {
		 editor.removeLineClass(i, "background", "pausedAt");
	}
	pausedAtLineFrom = -1;
	
	var pausedAtObj = parentWinObj.curAppState.getPausedAt();
	if (!pausedAtObj) return;
	
	var lid = parseInt(pausedAtObj.lid);
	var lineNum = findLineByLid(lid);
	if (lineNum) {
		var lineInfo = editor.lineInfo(lineNum);
		var srch = editor.getSearchCursor(">", {line:lineInfo.line-1,chr: 1});
		if (!srch.findNext()) return;
//		editor.setCursor(srch.to().line, 1);
		editor.setCursor(lineInfo.line, 0);
		var curCur = editor.getCursor();
		pausedAtLineFrom = curCur.line;
		pausedAtLineTo = srch.to().line;
		for (var i=pausedAtLineFrom; i<=pausedAtLineTo; i++) {
		    hlLine = editor.addLineClass(i, "background", "pausedAt");
		}	
		
		jumpToLine(pausedAtLineFrom, "top");
		
	}
}

function jumpToLine(i, posSec) { 
    var t = editor.charCoords({line: i, ch: 0}, "local").top; 
    var middleHeight = 0; 
    if (posSec=="middle") {
    	middleHeight = editor.getScrollerElement().offsetHeight / 2;
    }
    editor.scrollTo(null, t - middleHeight - 5); 
} 

// cursor: top-level node that the cursor is inside or next to as an argument
var hlLine = null;
function cursorActivity(cursor) {
	closeCodeAssistPopup();
	
	var cur = editor.getLineHandle(editor.getCursor().line);
	if (hlLine && cur != hlLine) {
	    editor.removeLineClass(hlLine, "wrap", "activeline");
	    hlLine = editor.addLineClass(cur, "wrap", "activeline");
	}
}


function showReqTag (tag) {
	var tagObj = findReqTag(tag);
	if (tagObj) {
		var curCursor = editor.getCursor();
		var coords = curCursor.cursorCoords();
		showHoverMsg(tagObj.tooltip, coords.x, coords.yBot);
	}

}

var mode = "LID"; // this is reset to N after reload
function loadMScript(nodeType_p, scriptType_p, getParams_p) {
	parentWinObj.postActionUtil("mscriptGet", "nodeType=" + nodeType_p + "&scriptType=" + scriptType_p + "&"
			+ getParams_p + "&mode=" + mode, procLoadMScript, "text");
	return;
}


function procLoadMScript (data) {
	mode = "LID";
	var xmlString = stripWrapper(data);
	
	// make it at least 10 lines
	var lineCount = xmlString.split("\n").length;
	if (lineCount < 10) {
		for (var i=0; i<10-lineCount; i++) {
			xmlString += "\n";
		}
	}
	
	$("#mScriptTextarea").text(xmlString);
	setTimeout ('refreshEditor("mScriptTextarea")', 20);
}

function addWrapper(triggerType_p, script_p) {
	if (curScriptType=="scxml") return script_p;
	var newScript = script_p.replace(/\n/g,"").replace("/ /g","");
	if (newScript=="") {
		if (triggerType_p=="all") {
			if (curScriptType=="state") {
				script_p = "<state id=\"" + curNodeData.stateid + "\"/>";
			}
			else if (curScriptType=="transition") {
				script_p = "<transition event=\"" + curNodeData.event + "\"/>";
			}
		}
		else {
			script_p = "<script type=\"" + triggerType_p + "\"/>";
		}
	}
	
	return script_p;
}


function stripWrapper(script_p) {
	if (script_p=="") return "";
	var idx = script_p.indexOf("\"/>");
	if (idx + 5 >= script_p.length) {
		script_p = script_p.substring(0, idx+1) + ">\n\n</script>";
	}
	return script_p;
}

function save(uid_p, scriptType_p, saveParams_p) {
	// check if the state/trans has not been deleted
	if (parentWinObj.curAppState.nodeDataList[uid_p] == null) {
		return;
	}

	var mScriptText = addWrapper(scriptType_p, editor.getValue());
	mScriptText = encodeURIComponent(mScriptText);
	parentWinObj.postAction("mscriptSave", "xmlScript=" + mScriptText
			+ "&scriptType=" + scriptType_p + "&" + saveParams_p,
			function(data) {
				setTimeout("parentWinObj.refreshUID('" + uid_p + "')", 10);
				parentWinObj.setModelChanged(true);
				var jObj = data;
//				jObj = eval("jObj=" + data);
				if (jObj.error)
					alertDialog(jObj.error);
				else if (jObj.alertMessage && jObj.alertMessage != "ok")
					alertDialog(jObj.alertMessage);
				else if (jObj.length>0) {
					var erList = [];
					for (i in jObj) {
						var err = jObj[i];
						erList.push("LID: " + err.lid + ", attr: " + err.attr + ", char: " + err.charIdx + ": " + err.msg);
					}
					alertDialog("<ul><li>" + erList.join("</li><li>") + "</li></ul>");
				}
				else {
					formChanged = false;
					$(".mScriptButton").hide();
				}
			});
}

function mScriptCancel() {
	reloadFrame();
}

function mScriptCheck(notify_p) {

	if (formChanged) {
		mScriptSave();
		setTimeout('mScriptCheck("' + notify_p + '")', 250);
		return;
	}
	
	// send state/trans trigger type specific command
	var params = "";
	if (curScriptType == "state") {
	    params += "&nodeType=state&stateuid=" + curNodeData.uid;
	}
	else if (curScriptType == "transition") {
	    params += "&nodeType=transition&stateuid=" + curStateNode.uid;
	    params += "&eventuid=" + curNodeData.uid;
	}
	else if (curScriptType == "mbt") {
		params = "&nodeType=model";
	}
	else if (curScriptType == "usecase") {
		params += "&nodeType=usecase&mcaseName=" + curNodeData.usecasename;
	}
	
	if (curTriggerType!="") {
		params = "scriptType=" + curTriggerType + params;
	}
	
	parentWinObj.sendAction("mscriptCheck", params, openCompile);
}



// check expr at the cursor DONT USE
function mScriptExprCheck() {
	var curPos = editor.getCursor(true); // get the beginning position
	var curToken = editor.getTokenAt(curPos);
	if (curToken.string==null || curToken.string.indexOf("$")<0) return;
	var requestText = encodeURIComponent("scriptType=expr&lid=" + lid + "&attr=" + exprAttrName+ "&expr=" + curToken.string);
	parentWinObj.sendAction("mscriptCheck", requestText, openCompile);
}
		
var triggerTypeSelectList = new Array();
triggerTypeSelectList["model"] = ['<option class="model" value="scxml" title="mscript for the entire model">Model</option>',
								'<option class="mbt" value="MBT_start" title="startup action executed at the beginning of the model execution">MBT Start</option>',
//								'<option class="state fsm" value="onStateEntry" title="entry trigger executed right before each state onEntry trigger.  This is a generic trigger applied to all states">All State Entry</option>',
//								'<option class="transition fsm" value="onTransPrep" title="prep trigger executed right before each transition prep trigger.  This is a generic trigger applied to all transitions">All Trans Prep</option>',
//								'<option class="transition fsm" value="onTransAction" title="action trigger executed right before each transition action trigger. This is a geneirc trigger applied to all transitions/edges">All Trans Action</option>',
//								'<option class="transition fsm" value="onTransVerify" title="verify action executed right before each transition verify trigger. This is a generic trigger applied to all transitions/edges">All Trans Verify</option>',
//								'<option class="transition cfg" value="onTransPrep" title="prep trigger executed right before each edge prep trigger.  This is a generic trigger applied to all edges">All Edge Prep</option>',
//								'<option class="transition cfg" value="onTransAction" title="action trigger executed right before each ege action trigger. This is a geneirc trigger applied to all edges">All Edge Action</option>',
//								'<option class="transition cfg" value="onTransVerify" title="verify action executed right before each edge verify trigger. This is a generic trigger applied to all edges">All Edge Verify</option>',
//								'<option class="state fsm" value="onStateExit" title="exit action executed each time exiting any state in the model. This is a generic state action that applies to all states and is executed right before onEntry trigger">All State Exit</option>',
								'<option class="mbt" value="MBT_end" title="ending action executed at the end of model execution">MBT End</option>',
								'<option class="mbt" value="func" title="User defined function">Functions</option>',
								'<option style="margin-top: 5px;" class="mbt" value="onException" title="exception/failure trigger executed on any AUT failures">On Failure</option>',
								'<option class="mbt" value="onError" title="error trigger executed on any execution errors">On Error</option>'];
								
triggerTypeSelectList["usecase"] = ['<option class="mcase" value="setup" title="setup action executed at the beginning of the mcase">mCase Setup</option>',
								  '<option class="mcase" value="cleanup" title="cleanup action executed at the end of mcase">mCase Cleanup</option>'];
triggerTypeSelectList["state"] = [
//								'<option class="state" value="stateInit" title="init action executed once at the beginning of the model execution.">State Init</option>',
							    '<option class="state" value="all" title="state/node triggers.">State Triggers</option>',
							    '<option class="state" value="onentry" title="entry action executed on entry into the state/node.">On Entry</option>',
							    '<option class="state" value="process" title="process executed after on entry trigger.">Process</option>',
								'<option class="state" value="onexit" title="exit action executed when leaving the state/node">On Exit</option>',
								'<option style="margin-top: 5px;" class="model" value="scxml" title="mscript for the entire model">Model</option>',
								'<option class="mbt" value="MBT_start" title="startup action executed at the beginning of the model execution">MBT Start</option>',
								'<option class="mbt" value="func" title="User defined function">Functions</option>'];

triggerTypeSelectList["transition"] = [
//								'<option class="transition" value="transInit" title="executed once for each transition at the beginning of the model execution">Trans Init</option>',
							    '<option class="transition" value="all" title="Transition/Edge triggers.">Trans Triggers</option>',
							    '<option class="transition" value="guard" title="guard condition for the transition, must evaluate to true without error before each traversal of the transition">Guard</option>',
							    '<option class="transition" value="prep" title="prep for the transition traversal, usually used to set up fields.">Prep</option>',
							    '<option class="transition" value="action" title="action executed after prep">Action</option>',
							    '<option class="transition" value="verify" title="verify executed after each transition action">Verify</option>',
								'<option style="margin-top: 5px;" class="model" value="scxml" title="mscript for the entire model">Model</option>',
								'<option class="mbt" value="MBT_start" title="startup action executed at the beginning of the model execution">MBT Start</option>',
								'<option class="mbt" value="func" title="User defined function">Functions</option>'];

var userDefinedTriggerList = new Array();

var staticTriggerUID = {
						"scxml": "scxml",
						"MBT_start": "mbt",
						"MBT_end": "mbt",
						"onException": "mbt",
						"onError": "mbt",
						"func": "mbt"
//						"onStateEntry": "mbt",
//						"onTransPrep": "mbt",
//						"onTransAction": "mbt",
//						"onTransVerify": "mbt",
//						"onStateExit": "mbt"
					};

function applyTriggerSelectFilter(params_p) {
	$("#mScriptTypeList option").remove();
	var nodeType = curScriptType;
	if (nodeType=="scxml" || nodeType=="mbt") {
		nodeType = "model";
	}
	var tempList = triggerTypeSelectList[nodeType];
	if (tempList == undefined) {
		return;
	}
	
	for (var i in tempList) {
		$("#mScriptTypeList").append(tempList[i]);
	}
	
	if (parentWinObj.isModelCFG()) {
		$(".fsm").remove();
	}
	else {
		$(".cfg").remove();	
	}

	
	parentWinObj.sendAction("mscriptGet", "cmd=getTriggerList&scriptType=" + curScriptType + "&"
			+ params_p, function(data) {
		userDefinedTriggerList = data;
		for (var j in data) {
		    var optHtml = '<option class="' + nodeType + ' userTrigger" value="' + data[j] + '" title="User defined trigger">' + data[j] + '</option>';
			$("#mScriptTypeList").append(optHtml);
		}
		var optionText = "#mScriptTypeList option[value='" + curTriggerType + "']";
		$(optionText).attr("selected","selected");
		
		for (var k in userDefinedTriggerList) {
			if (userDefinedTriggerList[k]==curTriggerType) {
				$("#menuDeleteTrigger").show();			
				break;
			}
		}
	});

    if (curTriggerType=="func" || curTriggerType=="scxml") {
		$("#flowGraph").hide();
    }
    else {
		$("#flowGraph").show();
    }
    
    $("#moreMenu").hover(function() {
    		if (curNodeData.typeCode=="state" || curNodeData.typeCode=="transition") {
    			$("#hoverMenu .stateTrans").show();
    		}
    		else {
    			$("#hoverMenu .stateTrans").hide();
    		}
    		$("#hoverMenu").show();
    	});	
    $("#hoverMenu").hover(null, function() {
    		$("#hoverMenu").hide();
    	})
    	.click (function() {
    		$("#hoverMenu").hide();
    	});
    
}

function selectTrigger() {
	var triggerType = $("select option:selected").val();
	openTrigger(triggerType);
}

function openTrigger(triggerType) {
	if (isChanged()) {
		mScriptSave();
	}
	parentWinObj.curAppState.mscriptTrigger = triggerType;
	var paramObj = {uid: curNodeData.uid, trigger: triggerType};
	var tUID = staticTriggerUID[triggerType];
	if (tUID) {
		paramObj.uid = tUID;
	}
	parentWinObj.startEditMScript(paramObj);
}


var defaultTriggerList = new Array();
defaultTriggerList["scxml"] = "scxml";
defaultTriggerList["mbt"] = "MBT_start";
defaultTriggerList["transition"] = "action";
defaultTriggerList["state"] = "process";
defaultTriggerList["usecase"] = "setup";

function setCurNode(nodeData) {
	if (isChanged()) {
		alertDialog("mScript.change.pending");
		return;
	}
	if (curNodeData==nodeData) {
		return;
	}
	
	var triggerType = defaultTriggerList[nodeData.typeCode];
	if (typeof(triggerType)=="undefined") {
		return;
	}	
	openTrigger(triggerType);
}

function importSeCode() {
	var dialogHtml = "<b>Paste Selenium IDE source code and click OK</b><br/>" 
			+ "<div><textarea id='seCode' style='width: 500px; height: 300px'></textarea></div>";

	parent.plainDialog(
		dialogHtml, 
		function () {
			var seCodeFld = parent.getDialogField('seCode');
			var seCode = $(seCodeFld).val();
	
			if (seCode=="") {
				return;
			}
			
			setCurContextVars();
			parseSeCode(seCode, curPos);
		}, 
		"seCode");
}


function showHoverMsg(msg) {
	$('<div id="hoverMsg"><span id="hoverMsgText">'+msg+'</span></div>').prependTo("body");
	var hoverElem = document.getElementById("hoverMsg");
	var curPos = editor.getCursor(false)
    editor.addWidget(curPos, hoverElem, true);
	setTimeout("clearHover()", 5000);
}

function setReadOnly(readonly_p) {
	editor.setOption('readOnly', readonly_p);
	if (readonly_p) {
	
	}
	else {
	
	}
}


function clearHover() {
	$("#hoverMsg").remove();
}

function adjustHeight() {
	var editorHeight = $(window).height() - 33;
//	$("#editorDiv").css("height", editorHeight).css("width", $(window).width());
	$(".CodeMirror-scroll").css("height", editorHeight); //.css("width", $(window).width());
}


// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="setBreak") {
		if (params_p.val) {
			setBreakpoint(params_p.uid);
		}
		else {
			removeBreakpoint(params_p.uid);
		}
	}
	else if (action_p=="clearBreaks") {
		showBreakpoints();
	}
	else if (action_p=="reset") {
//		reset();
	}
	else if (action_p=="display") {
		display(params_p);
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		if (editor) return true;
		else return false;
	}
	else if (action_p=="mScriptSave") {
		mScriptSave();
	}
	else if (action_p=="mScriptCancel") {
		mScriptCancel();
	}
	else if (action_p=="cancel") {
		resetFormChanged();
	}
	else if (action_p=="mScriptCheck") {
		mScriptCheck();
	}
	else if (action_p=="search") {
		search();
	}
	else if (action_p=="isChanged") {
		return isChanged();
	}
	else if (action_p=="setPausedAt") {
		setPausedAt();
	}
	else if (action_p=="updateNode") {
		startLoadMScript();
	}
}

function setupPopupMenu() {
	$( ".popupMenu" ).draggable().resizable({ alsoResize: '.innerMenu' });
}


function closePopup() {
	$(".popupMenu").hide();
}

function alertDialog(msg) {
	parentWinObj.alertDialog(msg);
}


function showFlowGraph(cmd_p, suppressCmt_p) {
	var nodeType = curNodeData.typeCode;
	var stateuid = "";
	var eventuid = "";
	if (curNodeData.typeCode=="state") {
		stateuid = curNodeData.uid;
	}
	else if (curNodeData.typeCode=="transition") {
		stateuid = curStateNode.uid;
		eventuid = curNodeData.uid;
	}
//	var url = "app=webmbt&action=webmbtGraph&cmd=getGraph&regen=true&type=flowGraph&cmdType=" + cmd_p 
	var htmlFile = "GraphTriggerPSD.html";
	if (cmd_p=="triggerFlow") {
		htmlFile = "GraphTriggerCallHierarchy.html";
	}
	var url = htmlFile + "?type=flowGraph&cmdType=" + cmd_p 
		+ "&nodeType=" + nodeType + "&stateuid=" + stateuid + "&eventuid=" + eventuid 
		+ "&scriptType=" + curTriggerType + "&noComment=" + suppressCmt_p 
		+ "&rand=" + Math.random();
	var winObj = window.open(url);
	parent.addWin(winObj, cmd_p);
	return;
}

function addTrigger() {
	if (formChanged) {
		mScriptSave();
	}
	
	parentWinObj.promptDialog("trigger.add", "", function() {
		var triggerName = parentWinObj.getPromptVal();
		if (triggerName=="") return;
				
		parentWinObj.setModelChanged(true);
		parentWinObj.sendAction("mscriptSave", "cmd=addTrigger&scriptType=" + curScriptType + "&triggerName=" + triggerName + "&" + params,
			function(data) {
			parentWinObj.actionCallback(data);
			if (data.error) {
				return;
			}
			parentWinObj.curAppState.mscriptTrigger = triggerName;
			setTimeout('startLoadMScript()', 50);
		});
	});
}

function deleteTrigger() {
	parentWinObj.confirmDialog("trigger.delete", function() {
		parentWinObj.setModelChanged(true);
		parentWinObj.sendAction("mscriptSave", "cmd=delTrigger&scriptType=" + curScriptType + "&triggerName=" + curTriggerType + "&" + params,
			function(data) {
				parentWinObj.actionCallback(data);
				if (data.error) {
					return;
				}
				parentWinObj.curAppState.mscriptTrigger = "";
				setTimeout('startLoadMScript()', 50);
			});
	});
}

function getMscriptCoverage() {
	mode = "coverage";
	startLoadMScript();
}

function getMscriptMDC() {
	mode = "mdc";
	startLoadMScript();
}