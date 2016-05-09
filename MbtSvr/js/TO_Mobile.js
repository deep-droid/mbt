// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtMain.js

window.onerror = function gotError(errMsg, fileName, lineNum) {
	handleJsError(errMsg, fileName, lineNum);
}


function handleJsError (errMsg, fileName, lineNum) {
	try {
		alert ("errMsg: " + errMsg + "; fileName:" + fileName + "; lineNum: " + lineNum);
	}
	catch (err) {
		//
	}
}

var winName;

var curAppState = {
	breakpoints: new Array(),
	curDSName: null,
	curNodeData: null,
	curTags: "", // cur tags user last entered
	debugMode: false,
	edition: "community",
	execID: -1,
	execMode: "", // execution status, exec, paused,...
	getPausedAt: function() { 
			if (curAppState.pausedAtList.length<=0) return null;
			else return curAppState.pausedAtList[0]; // either lid (neg) or uid
		},
	getLastPausedAt: function() {
			if (curAppState.pausedTrailingList.length<=0) return null;
			else return curAppState.pausedTrailingList[0];
		},
	hotSyncEnabled: true,
	markList: new Array(), // list of uid marked, only used by graph
	mbtSessionID: "",
	modelOpen: undefined,
	mscriptType: "", // state, transition, model, usecase, etc.
	mscriptTrigger: "", // action, verify, onentry, etc.
	nodeDataList: new Array(),
	oneTimeSync: true,
	pausedAtList: new Array(), // may contain mscript line or state/trans pausedAt
	pausedTrailingList: new Array(), // only contain state/trans pausedAt
	playModelDelay: -1,
	pluginList: null,
	reqTagList: new Array(),
	realEdition: "Community",
	runMode: "", // debug, modeling, run
	subModelList: null,
	updateSeq: 0,
	webmbtObj: null
}

var winCallbackFuncList = {};

$(document).ready(function() {
	$("#winList").change(function() {
		var winCmd = $(this).val();
		if (winCmd=="") return;
		selectTab(winCmd);
		setTimeout(function() { $("#winList").val("");}, 500);
	});
	
	updateOrientation();
	loadModelIDE();
});


function regWin(winObj, frameName_p, cbFunc_p) {
	initFrame();
}

function removeWinCallbackFunc(frameName_p) {
	return;
}


function runWinAction(frameName_p, action_p, params_p) {
	var frameWin = $("#framePane").contentWindow;
	if (frameWin && frameWin.mainCallbackFunc) {
		frameWin.mainCallbackFunc ([action_p, params_p]);
	}
	return;
}



function refreshConfig() {
	sendAction ("config", "cmd=getConfigJson", function(data) {
		if (actionCallback(data)) return;
		curAppState.nodeDataList[data.config.uid] = data.config;
		curAppState.edition = data.config.prodlevel;
		curAppState.realEdition = data.config.realprodlevel;
		curAppState.pluginList = data.config.pluginList;
		var editionProdLevel = curAppState.nodeDataList["config"].prodlevel;
		if (editionProdLevel=="Expired") {
			$("#edition").addClass("expired");
		}
		$("#edition").html(editionProdLevel);
			
	});
}

refreshConfig();

function sendAction (action, params, callbackFunc) {
	sendActionUtil (action, params, callbackFunc);
}

function postAction (action, params, callbackFunc) {
	postActionUtil (action, params, callbackFunc);
}

var fileListLoadCalled = false;
// generic action callback, return true if the action has been taken care of by this function
function actionCallback(actionObj_p) {
	curAppState.hotSyncEnabled = true;
	if (actionObj_p.error && actionObj_p.error=="model.not.open" || 
	    actionObj_p.status && actionObj_p.status=="model.not.open") {
		if (!fileListLoadCalled) {
			fileListLoadCalled = true;
			selectTab("FileList");
		}
		return true;
	}
	if (actionObj_p.error) {
		var errMsg = actionObj_p.error.replace("java.lang.Exception: ", "");
		errMsg = translateMsg(errMsg);
		setTimeout('alertDialog("Error: ' + errMsg + '")', 150);
		return true;
	}
	
	if (actionObj_p.alertMessage) {
		if (actionObj_p.alertMessage!="ok") {
			if (actionObj_p.alertMessage=="change.saved") {
				setModelChanged(false);
			}
			alertDialog (actionObj_p.alertMessage);
		}
		return true;
	}
	
	if (actionObj_p.action) {
		if (actionObj_p.action=="refresh") {
			sendAction("getModelJson", "", loadScxml);
		}
	}
	return false;
}

// generic action callback, return true if the action has been taken care of by this function
function actionCallbackPost(message_p) {
	var actionObj = eval("actionObj=" + message_p);
	return actionCallback(actionObj);
}


function hotSyncTimer() {
	try {
		curAppState.hotSyncEnabled = false;
		curAppState.oneTimeSync = false;
		setTimeout("sendAction('sync', '',  handleSyncAction)", 10);
	}
	catch (err) {
		alert (err);
	}
	var localTime = new Date();
	runWinAction("Monitor", "updateSyncClock", localTime.toLocaleString());
}

//var syncTimer = setInterval(hotSyncTimer, 5000);

function showExecStopped(msg_p) {
	runWinAction("Monitor", "display", true);
	selectTab("Monitor");
	tempMsg = translateMsg("mbt.exec.done", msg_p);
	alertDialog(tempMsg);
}

// process syn actions from the server
function handleSyncAction (actions_p) {
	curAppState.hotSyncEnabled = true;
	var tempMsg;
	runWinAction("Monitor", "updateProgress");
	
	if (actions_p.action==undefined || actions_p.action.length<=0) {
		return;
	}
	for (j=0; j<actions_p.action.length; j++) {
		var syncActionCmd = actions_p.action[j].syncAction;
		if (syncActionCmd=="started") {
			curAppState.execID = -1;
			curAppState.pausedAtList = new Array();
			curAppState.pausedTrailingList = new Array();
			setExecMode("exec");
			if (actions_p.action[j].value!="") {
				alertDialog(actions_p.action[j].value);
			}
			
			if (curAppState.debugMode) startEditMScript({uid: "scxml", readonly: true});
		}
		else if (syncActionCmd=="debugPaused") {
			setExecMode ("paused");
			curAppState.pausedAtList = actions_p.action[j].details.pausedAt;
			curAppState.pausedTrailingList = actions_p.action[j].details.trailing;

			alertDialog("Paused At: " +  getPausedAtMsg());
		}
		else if (syncActionCmd=="ended" || actions_p.action[j].syncAction=="interrupted") {
			setExecMode ("stopped");
			tempMsg = translateMsg("mbt.exec.done", actions_p.action[j].value);
			alertDialog(tempMsg);
		}
		else if (syncActionCmd=="errored") {
			setExecMode ("errored");
			tempMsg = translateMsg("mbt.exec.aborted", actions_p.action[j].value);
			showExecStopped(tempMsg);
			alertDialog(tempMsg);
		}
		else if (syncActionCmd=="warning") {
			tempMsg = translateMsg("mbt.exec.warning", actions_p.action[j].value);
			alertDialog(tempMsg);
		}
		else if (syncActionCmd=="execstatus") {
			runWinAction("Monitor", "updateProgress", "");
		}
		else if (syncActionCmd=="execMSC") {
			execWinAction("WinExecMSC", "execMSC");
		}
	}

}


// returns a node data
function getDataObj (uid_p) {
	return curAppState.nodeDataList[uid_p];
}


function loadModelIDE () {
	sendAction("getModelJson", "", loadScxml);
}

function reloadModel () {
	sendAction("getModelJson", "", storeScxml);
}

function loadScxml (jsonObj_p) {
	if (jsonObj_p==undefined) return;
	
	if (!storeScxml(jsonObj_p)) return;

	if (curAppState.webmbtObj.execStatus.execStatus=="STARTED") {
		setExecMode("exec");
	}

	$(".sbIcon").show();
	
	selectTab("Monitor");
}

function storeScxml (jsonObj_p) {
	if (actionCallback(jsonObj_p)) return false;
	curAppState.breakpoints = jsonObj_p.breakpoints;
	
	curAppState.webmbtObj = jsonObj_p;
	var model = jsonObj_p.model;
	curAppState.mbtSessionID = jsonObj_p.sessionID;
	curAppState.runMode = jsonObj_p.runMode;
	
	curAppState.nodeDataList[model.mbt.uid] = model.mbt;
	model.mbt.typeCode="mbt";
	curAppState.nodeDataList["mbt"] = model.mbt;
	model.mbt.parentuid = model.uid;
	curAppState.nodeDataList["scxml"] = model;
	model.folderPath = curAppState.webmbtObj.folderPath; // to be used for model pane for display only
	
	if (jsonObj_p.modelChanged=="true") setModelChanged(true);
	
	if (model.exceptmsglist && model.exceptmsglist.length>0) {
		var tempMsg = "Model has the following alerts:<br>";
		for (i=0; i<model.exceptmsglist.length; i++) {
			tempMsg += model.exceptmsglist[i] + "<br>";
		}
		alertDialog(tempMsg);
	}
	
	curAppState.nodeDataList[model.uid] = model;
	for (i=0; i<model.mbt.usecases.length; i++) {
		curAppState.nodeDataList[model.mbt.usecases[i].uid] = model.mbt.usecases[i];
		model.mbt.usecases[i].parentuid=model.mbt.uid;
		for (j=0; j<model.mbt.usecases[i].steps.length; j++) {
			curAppState.nodeDataList[model.mbt.usecases[i].steps[j].uid]= model.mbt.usecases[i].steps[j];
			model.mbt.usecases[i].steps[j].parentuid=model.mbt.usecases[i].uid;
		}
	}

	var stateList = new Array();
	var expandList = new Array();
	expandList[0] = model;
	while (expandList.length>0) {
		expandList = loadSubStates(expandList, stateList);
	}

	curAppState.modelOpen = true;
	curAppState.modelName = model.filename;
	if (model.alert) {
		alertDialog(model.alert);
	}
	
	return true;
}

function loadSubStates (expandList_p, stateList_p) {
	var newExpandList = new Array();
	for (k=0; k<expandList_p.length; k++) {
		for (i=0; i<expandList_p[k].childrenStates.length; i++) {
			curAppState.nodeDataList[expandList_p[k].childrenStates[i].uid] = expandList_p[k].childrenStates[i];
			stateList_p[stateList_p.length] = expandList_p[k].childrenStates[i].stateid;
			expandList_p[k].childrenStates[i].parentuid = expandList_p[k].uid;
			for (j=0; j<expandList_p[k].childrenStates[i].transitions.length; j++) {
				curAppState.nodeDataList[expandList_p[k].childrenStates[i].transitions[j].uid]= expandList_p[k].childrenStates[i].transitions[j];
				expandList_p[k].childrenStates[i].transitions[j].parentuid=expandList_p[k].childrenStates[i].uid;
			}
			if (expandList_p[k].childrenStates[i].childrenStates && expandList_p[k].childrenStates[i].childrenStates.length>0) {
				newExpandList[newExpandList.length] = expandList_p[k].childrenStates[i];
			}
		}
	}
	return newExpandList;
}


// check anything changed and alert user changes pending, can not execute
function okToExec() {
	if (curAppState.modelOpen) {
		return true;
	}
	else {
		alertDialog ("model.not.open");
		return false;
	}
}


// start button: start or resume
function startButton() {
	curAppState.debugMode = false;
	if (okToExec()) {
		if (curAppState.execMode=="" || curAppState.execMode=="stopped" || curAppState.execMode=="errored") {
			curAppState.debugMode = false;
			setExecMode ("exec");
			var runType = "full";
			execMbt(runType, false, false);
		}
		else if (curAppState.execMode=="paused") {
			curAppState.debugMode = false;
			setExecMode ("exec");
			continueMbt();
		}
		else alertDialog("is.executing");
	}
}


function continueMbt () {
	sendAction ("continue", "");
}

function stopButton() {
	curAppState.pausedAtList = new Array();
	curAppState.pausedTrailingList = new Array();
	curAppState.execMode = "";

	if (curAppState.modelOpen) {
		stopMbt();
		curAppState.hotSyncEnabled = true;
	}
	else alertDialog ("model.not.open");
}


// pause button: pause or stepScript
function pauseButton() {
	if (curAppState.modelOpen) {
		if (curAppState.execMode=="exec" || curAppState.execMode=="paused") {
			sendAction ("pause", "");
			if (curAppState.playModelDelay > 0) curAppState.playModelDelay = - curAppState.playModelDelay;
			runWinAction("Model", "clearAnimate");
			if (curAppState.playModelDelay > 0) curAppState.playModelDelay = -curAppState.playModelDelay;
			curAppState.hotSyncEnabled = true;
		}
		else alertDialog("pause.invalid");
	}
	else alertDialog ("model.not.open");
}


function execMbt (runType_p, debug_p, markedOnly_p) {
	var runParams = "";
	if (runType_p=="full" && debug_p) {
		sendAction ("start", "debug=y&" + runParams);
		curAppState.runMode = "debug";
	}
	else if (runType_p=="full" && !debug_p) {
		sendAction ("start", runParams);
		curAppState.runMode = "run";
	}
	else if (runType_p=="dry"  && debug_p) {
		sendAction ("start", "dryRun=y&debug=y&" + runParams);
		curAppState.runMode = "dry";
	}
	else {
		sendAction ("start", "dryRun=y&" + runParams);
		curAppState.runMode = "dry";
	}

	setTimeout(hotSyncTimer, 1000);
	selectTab("Monitor");
}

function stopMbt () {
	sendAction ("session", "cmd=stopExec");

	curAppState.hotSyncEnabled = true;
	curAppState.execMode = "";
	setTimeout(hotSyncTimer, 1000);
}


function resumeMbt () {
	sendAction ("resume", "");
	curAppState.hotSyncEnabled = true;
	selectTab("Monitor");
	curAppState.hotSyncEnabled = true;
	setTimeout(hotSyncTimer, 1000);
}

function loadMbtStat (execID_p) {
	curAppState.execID = execID_p;
	selectTab("tabStats");
}

function setExecMode(execMode_p) {
	curAppState.execMode = execMode_p;
	if (curAppState.execMode=="exec") {
		curTravNodeData = undefined;
	}
}

function isRunning() {
	if (curAppState.execMode=="exec") return true;
	else return false;
}

function isPaused() {
	if (curAppState.execMode=="paused") return true;
	else return false;
}


function aboutWebMBT() {
	sendAction("config","cmd=about", function(data) {
		if (actionCallback(data)) return;
		alertDialog(data.about);
	});
}


function openModel (filePath_p) {
//	if (curAppState.nodeDataList.config.sessLimit <= curAppState.nodeDataList.config.sessList.length) {
//		alertDialog("model.session.limit.exceeded");
//		return;
//	}

	sendAction("open", "mbtfile="+filePath_p, function (data) {
		if (actionCallback(data)) return;
		if (data.status && data.status=="ok") location.replace("TO_Mobile.html");
	});
}


// close this window
function exitMbt() {
	sendAction ("session", "cmd=logoff", refreshIde);
	window.close();
	self.close();
}

//close current model
function closeModel() {
	if (!isModelChanged() || prompt("There are unsaved changes to the model. Do you wish to discard the changes and close the model?")) {
		doCloseModel();
	}
}


function doCloseModel() {
	sendAction ("session", "cmd=close");
	setTimeout(refreshIde, 100);
}

function refreshIde() {
	window.location.reload();
}


//logs a message to console with default log level
function logMsg (msg_p, logLevel_p) {
	return;
}


function openGraph() {
	window.open("app=webmbt&action=webmbtGraph&type=graph&regen=true&rand=" + Math.random());
}


function getConfigProperty(name_p) {
	if (curAppState.nodeDataList.config==undefined) return undefined;
	return curAppState.nodeDataList.config[name_p];
}

var tabToWinHtml = {
	'Monitor': 'webmbtMonitor.html',
	'FileList': 'webmbtFileList.html',
	'Stats': 'ExecStat.html',
	'SeqTrace': 'webmbtMbtTrans.html',
	'ModelGraph': openGraph,
	'Model': 'ModelEditor.html',
	'CloseModel': closeModel
};

function selectTab (tabName_p) {
	var cmd = tabToWinHtml[tabName_p];
	winName = tabName_p;
	if (typeof (cmd)=="function") {
		cmd.apply();
	}
	else {
		$("#framePane").attr("src", cmd);
	}
}


function detachWin(win_p) {
 	return;
}


function isModelChanged() {
	return false;
}

function setModelChanged(in_p) {
	return;
}

function isTabSelected(tab_p) {
	return true;
}

function alertDialog(msg_p) {
	alert(msg_p);
}

function genHttpRequestURL (action, params) {
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	url = url + "&" + params;
	return url;
}

function sendActionUtil (action, params, callbackFunc) {
	// assumes params are already encoded
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	url = url + "&" + params;
	if (callbackFunc==undefined) callbackFunc = actionCallback;
	$.getJSON(url, callbackFunc);
}


function postActionUtil (action, params, callbackFunc, dataType) {
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	// url = url + "&" + params;
	params.updateSeq = updateSeq;
	if (callbackFunc==undefined) callbackFunc = actionCallbackPost;
	try {
		if (dataType) {
			$.post(url, params, callbackFunc, dataType);
		}
		else {
			$.post(url, params, callbackFunc);
		}
	}
	catch (err) {
		alert(err);
	}
}

function isShade(rowNum_p) {
	if (Math.floor(rowNum_p/5)%2==1) return true;
	else return false;
}



var gMsgList = new Array();
function resolveMsg (msgID_p) {
	return gMsgList[msgID_p];
}

function translateMsg (msgKey_p, token1_p, token2_p, token3_p, token4_p, token5_p) {
	var transMsg = gMsgList[msgKey_p];
	if (transMsg==undefined) return decodeURI(msgKey_p);
	transMsg = transMsg.desc;
	if (token1_p==undefined) return decodeURI(transMsg);
	transMsg = transMsg.replace("@@", token1_p);

	if (token2_p==undefined) return decodeURI(transMsg);
	transMsg = transMsg.replace("@@", token2_p);

	if (token3_p==undefined) return decodeURI(transMsg);
	transMsg = transMsg.replace("@@", token3_p);

	if (token4_p==undefined) return decodeURI(transMsg);
	transMsg = transMsg.replace("@@", token4_p);

	if (token5_p==undefined) return decodeURI(transMsg);
	transMsg = transMsg.replace("@@", token5_p);
	
	return decodeURI(transMsg);
	
}

function containsTransMessages() {
	if (gMsgList==undefined) return false;
	for (msgKey in gMsgList) {
		return true;
	}
	return false;
}

function refresh() {
	if (winName=="Monitor") {
		hotSyncTimer();
	}
	else {
		$("#framePane").contentWindow.display(true);
	}
}
