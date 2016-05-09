// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtMain.js

window.onerror = function gotError(errMsg, fileName, lineNum) {
	handleJsError(errMsg, fileName, lineNum);
}


function handleJsError (errMsg, fileName, lineNum) {
	try {
		logMsg ("errMsg: " + errMsg + "; fileName:" + fileName + "; lineNum: " + lineNum, 1);
	}
	catch (err) {
		//
	}
}


var curAppState = {
	breakpoints: new Array(),
	curDSName: null,
	curNodeData: null,
	curPropNodeData: null,
	curTags: "", // cur tags user last entered
	debugMode: false,
	edition: "Expired",
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
	mbtSessionID: "",
	modelOpen: undefined,
	modelName: "",
	mscriptType: "", // state, transition, model, usecase, etc.
	mscriptTrigger: "", // action, verify, onentry, etc.
	nodeDataList: new Array(),
	oneTimeSync: true,
	pausedAtList: new Array(), // may contain mscript line or state/trans pausedAt
	pausedTrailingList: new Array(), // only contain state/trans pausedAt
	playModelDelay: -1,
	playModelMode: "Traversal",
	pluginList: null,
	reqTagList: new Array(),
	realEdition: "Trial",
	runMode: "", // debug, modeling, run
	subModelList: null,
	updateSeq: 0,
	webmbtObj: null,
	lastMarkSeq: "None",
	hotSyncMillis: 1000
}

function clearBreaks() {
	sendAction ("removeAllBreaks");
	curAppState.breakpoints = new Array();
	runWinAction('Model', 'clearBreaks');
//	runWinAction('TreeView', 'clearBreaks');
//	runWinAction('Graph', 'clearBreaks');
	runWinAction('MScript', 'clearBreaks');
}

function toggleBreak(uid_p) {
	var breakStatus = true;
	var newBreakpoints = new Array();
	for (i in curAppState.breakpoints) {
		if (curAppState.breakpoints[i]==uid_p) {
			breakStatus = false;
		}
		else {
			newBreakpoints.push(curAppState.breakpoints[i]);
		}
	}
	
	if (breakStatus) {
		newBreakpoints.push(uid_p);
		sendAction ("setBreak", "uid="+ uid_p);
	}
	else {
		sendAction ("removeBreak", "uid="+uid_p);
	}
	if (uid_p.indexOf("U") == 0) {
		runWinAction('Model', 'setBreak', {uid: uid_p, val: breakStatus});
		runWinAction('MScript', 'setBreak',  {uid: uid_p, val: breakStatus});
	}
	curAppState.breakpoints = newBreakpoints;
}

var menuFlags = new Array();
menuFlags["scxml"] = "x";
menuFlags["state"] = "s";
menuFlags["transition"] = "t";
menuFlags["mbt"] = "m";
menuFlags["usecase"] = "n";
menuFlags["step"] = "p";
refreshConfig(); // do this as early as possible

var IDE_Name = "TestOptimal";

$(document).ready(function() {
//		window.fullScreen = true; // only works in FF

	$("#headerSection").dblclick(function() {
		window.open("webmbtMain.html", IDE_Name + " MBT",'fullscreen=yes');
		window.location = 'blank.html';
	});

	initCommon(true);

	// default IDE layout. navigate.js has Reset Layout setting
	tabGroupList = [
		{ tabGroup: "paneLeft", detachable: false, tabList: ["FileList", "Model"]},
		{ tabGroup: "paneTopRight", detachable: true, tabList: ["Monitor", "Stats", "Vars", "UIMap"]},
		{ tabGroup: "paneBottomRight", detachable: true, tabList: ["MScript","SeqTrace", "ScreenShot"]}
	];

	initTabLayoutFromCookie();

	window.onresize = windowResized; 
	resetAllPanes();

	setInterval(checkWinClosedAndRestoreTab, 2000);
	
	jQuery().zoom(this.windowResized);
	$('.icon-wrap').hover(
		function() { $(this).addClass('ui-state-hover'); }, 
		function() { $(this).removeClass('ui-state-hover'); }
	);

    $("#hDivider").mousedown(hDividerDownAction);
    $("#vDivider").mousedown(vDividerDownAction);
	$("div").disableSelection();

	$(".btn div").hover(function() {$(this).css("background-image","url('img/btn2.png')");}, function() {$(this).css("background-image","");});
	$(".btn div").click(function() {$(this).css("background-image","url('img/btn1.png')").css("background-image","");});
	setupSideBarButtons($("#sideBar div"), "#444444");

	$(".tabLabel a").dblclick(function() {
		var tabID = $(this).attr("href").substring(1);
		var tabGroup = findTabGroup(tabID);
		minMaxPane(tabGroup);
	});
	
	addTabGroup("paneLeft");
	
	// hover menu setup
	$("#menu li ul").hide(); 
	$("#menu li").hover(
        function () {
		$(this).children("ul").show();
        },function(){
		$(this).children("ul").hide();
	});//hover

    $('a[rel*=facebox]').facebox({
        loading_image : '/js/facebox/loading.gif',
        close_image   : '/js/facebox/closelabel.gif'
    }) 
	    

//	window.status = "Retrieving data from TestOptimal server...";
	loadModelIDE();
	maxLeftPane();

});

function setCurStateTrans(uid_p) {
	if (uid_p==null) {
		curAppState.curNodeData = null;
	}
	else {
		curAppState.curNodeData = curAppState.nodeDataList[uid_p];
	}
	return curAppState.curNodeData;
}

function containsPlugin(pluginID_p) {
	if (curAppState.pluginList==null) return false;
	for (i in curAppState.pluginList) {
		if (curAppState.pluginList[i].code.toUpperCase().indexOf(pluginID_p.toUpperCase())>=0) {
			return true;
		}
	}
	return false;
}

function pluginEnabled (pluginID_p) {
	var scxml = curAppState.nodeDataList["scxml"];
	return scxml.pluginID.toUpperCase().indexOf(pluginID_p.toUpperCase())>=0;
}

function setModelChanged(modelChanged_p) {
	if (modelChanged_p) {
		var chgMsg = "There are unsaved model changes.";
		setAlertMsg(chgMsg);
	}
	else {
		runWinActionOnAllWins('cancel','');
		setAlertMsg("");
	}
}

function setAlertMsg(msg_p) {
	if (msg_p && msg_p!="") {
		var curMsg = $("#sideBarFiller").attr("title");
		if (curMsg && curMsg!="") {
			if (msg_p!=curMsg) {
				$("#sideBarFiller").attr("title", curMsg + "\n" + msg_p);
			}
		}
		else {
			$("#sideBarFiller").attr("title", msg_p);
		}
		$("#sideBarFiller img").attr("src", "img/savePending.png");
	}
	else {
		$("#sideBarFiller img").attr("src", "img/save.png");
		$("#sideBarFiller").attr("title", "");
	}	
}

function handleAlertMsg() {
	var curMsg = $("#sideBarFiller").attr("title");
	setAlertMsg("");
	if (curMsg.indexOf("There are unsaved model changes.")>=0) {
		fileSave();
	}
	else if (curMsg!="") {
		alertDialog(curMsg);
	}
}

function flashSideBarFiller(ok_p) {
	if (ok_p) {
		$("#indOK").show();
		$("#indOK").hide(1000);
	}
	else {
		$("#indCancel").show();
		$("#indCancel").hide(1000);
	}
}

function isModelChanged() {
	var curMsg = $("#sideBarFiller").attr("title");
	if (curMsg!="") return true;
	else return false;
}

function refreshConfig() {
	sendAction ("config", "cmd=getConfigJson", function(data) {
		if (actionCallback(data)) return;
		curAppState.nodeDataList[data.config.uid] = data.config;
		curAppState.edition = data.config.prodlevel;
		curAppState.realEdition = data.config.realprodlevel;
		curAppState.pluginList = data.config.pluginList;
		setTimeout (updAppHeaderInfo, 100);
		if (!data.config.licenseStatus) {
			setTimeout("setLicense()", 100);;
		}
		curAppState.hotSyncMillis = data.config.hotSyncMillis;
	});
	
	sendAction ("config", "cmd=getKPIList&published=Y", function(data) {
		var kpiHtml = "";
		for (i in data.kpiList) {
			var kpi = data.kpiList[i];
			kpiHtml += "<span class='elem' style='background-color: " + kpi.color + "; border-radius: 8px; margin-right: 3px;'>" + kpi.name + " " + kpi.value + kpi.suffix + "</span>";
		}

		if (kpiHtml=='') {
			$("#KPI").hide();
		}
		else {
			$("#KPI .elems").append(kpiHtml).show();
			$("#KPI .elems .elem").attr("title","click to open Dashboard").click(function() {
				openDashboard();
			})
		}
	});
	
}

function updAppHeaderInfo() {
	var editionTitle = IDE_Name + " " + curAppState.nodeDataList["config"].TestOptimalVersion;
	var editionProdLevel = curAppState.nodeDataList["config"].realprodlevel; //prodlevel;
	if (curAppState.nodeDataList["config"].prodlevel=="Expired") {
		editionProdLevel = "Expired";
		editionTitle += ", Date Expired: " + curAppState.nodeDataList["config"].expirationdate;
		$("#edition").addClass("expired");
//		setLicense();
	}
	$("#edition").html(editionProdLevel).attr("title", editionTitle);
	if (editionProdLevel=="BasicMBT") {
		$(".nonBasic").hide();
	}

	$("#toVer").text("ver. " + curAppState.nodeDataList["config"].TestOptimalVersion);
	
	if (curAppState.nodeDataList["config"].conSvrMgr) {
		$("#conSvrMgrMenu").hide();
		$("#fileArchiveMenu").show();
		$("#disconSvrMgrMenu").show();
		$("#repoMenu").show();
	}
	else {
		$("#conSvrMgrMenu").show();
		$("#fileArchiveMenu").hide();
		$("#disconSvrMgrMenu").hide();
		$("#repoMenu").hide();
	}
	
	if (isRuntime()) {
		$(".devOnly").hide();
	}
	
	if (isShowNewFeature()) {
		$(".newFeature").show();
	}
}

// after model is loaded
function postInit() {
	if (curAppState.nodeDataList.config==undefined) {
		logMsg(1, "postInit() ... waiting for config");
		setTimeout(postInit, 200);
		return;
	}
	
	forceSyncOnce();

	$(".sbIcon").show();
	addTabGroup("paneTopRight");
	addTabGroup("paneBottomRight");

	if (curAppState.nodeDataList.config.defaultAUT!="Y") {
		$("#modeAUT").removeClass("modeSelected");
	}
	
	loadReqTagList();
	
	// add report menu items
	var rptMenu = $("#reportSeqOut").parent().parent();
	$(rptMenu).find("ul .report").remove();
//	var rptList = curAppState.nodeDataList.config.rptList;
//	for (var i in rptList) {
//		var dispRpt = rptList[i].replace("_", " ");
//		$('<li><a href="javascript:openReport(\'' + rptList[i] +'\');" class="report">' + dispRpt + '</a></li>').insertBefore("#reportSeqOut");
//	}
	
	var scxmlNode = curAppState.nodeDataList["scxml"];
	$("#tab_Model").attr("title", scxmlNode.folderPath + "/ " + scxmlNode.filename);
	
	initCommon(true);
	if (isRuntime()) {
		$(".devOnly").remove();
	}
	
	$(".reqModelOpen").show();
//	if (!containsPlugin ('SEQOUT')) {
//		$("#reportSeqOut").hide();
//		}

	if (!containsPlugin ('BA')) {
		$("#mbbaView").hide();
	}

	setSessionMenu();

	if (!curAppState.webmbtObj.lockAcquired) {
		$("#lockMenu").show();
	}
	
//	setTimeout('hotSyncTimer()', 1000);
}

function setSessionMenu() {
	// add session menu items
	var sessMenu = $("#sessionMenu").parent().parent().find("ul");
	var sessList = curAppState.nodeDataList.config.sessList;
	$(sessMenu).find("li").remove();
	for (var i in sessList) {
		var sess = sessList[i].sessID;
		var sessID = parseInt(i) + 1;
		var selectedClass = "";
		var modelName = sessList[i].modelName;
		if (sess==curAppState.mbtSessionID) {
			$('<li class=selectedSession title="current session">Session ' + sessID + '</li>').appendTo(sessMenu);
		}
		else {
			$('<li><a href="javascript:setSession(\'' + sess +'\');" class="session" title="' + modelName + '">Session ' + sessID + '</a></li>').appendTo(sessMenu);
		}
	}
}


function sendAction (action, params, callbackFunc) {
	if (action!="sync") logMsg ("sendAction: " + action + ", " + params, 3);
	sendActionUtil (action, params, callbackFunc);
}

function postAction (action, params, callbackFunc) {
	if (action!="sync") logMsg ("postAction: " + action + ", " + params, 3);
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
		logMsg("From Server: action error " + errMsg, 1);
		setTimeout('alertDialog("Error: ' + errMsg + '")', 150);
		return true;
	}
	
	if (actionObj_p.alertMessage) {
		if (actionObj_p.alertMessage!="ok") {
			if (actionObj_p.alertMessage=="change.saved") {
				setModelChanged(false);
			}
			else alertDialog (actionObj_p.alertMessage);
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


function forceSyncOnce() {
	curAppState.oneTimeSync = true;
}

var syncCount = 0;
var ideHotSync = true; // to be set by menu for debugging
function hotSyncTimer() {
	var enabled = (ideHotSync && curAppState.modelOpen && (curAppState.oneTimeSync || curAppState.hotSyncEnabled));
	try {
		if (enabled) {
			curAppState.hotSyncEnabled = false;
			curAppState.oneTimeSync = false;
			setTimeout("sendAction('sync', '',  handleSyncAction)", curAppState.hotSyncMillis);
		}
	}
	catch (err) {
		logMsg (err);
	}
	
	syncCount++;
	var localTime = new Date();
	runWinAction("Monitor", "updateSyncClock", localTime.toLocaleString());
//	self.status = "sync " + syncCount + ", enabled=" + enabled;
}

var syncTimer = setInterval(hotSyncTimer, 1000);

function showExecStopped(msg_p) {
	runWinAction("Monitor", "display", true);
	runWinAction("Model", "clearPaused");
	runWinAction("SeqTrace", "display", true);
	runWinAction("Stats", "loadCurrentStat");
	tempMsg = translateMsg("mbt.exec.done", msg_p);
//	selectTab("Monitor");
//	alertDialog(tempMsg);
}

// process syn actions from the server
function handleSyncAction (actions_p) {
	curAppState.hotSyncEnabled = true;
	var tempMsg;
//	$("#loadingImg").hide();
//	self.status = "TestOptimal is Ready";

//	runWinAction("Monitor", "updateProgress");
	
	if (actions_p.execStatus) {
		runWinAction("Monitor", "updateProgress", actions_p.execStatus);
	}

	if (actions_p.action==undefined || actions_p.action.length<=0) {
		return;
	}
	
//	var found_execstatus = false;
	for (j=0; j<actions_p.action.length; j++) {
		var syncActionCmd = actions_p.action[j].syncAction;
		if (syncActionCmd=="started") {
			curAppState.execID = -1;
			curAppState.pausedAtList = new Array();
			curAppState.pausedTrailingList = new Array();
			setExecMode("exec");
			logMsg("MBT execution has started", 2);
			if (curAppState.debugMode) startEditMScript({uid: "scxml", readonly: false});
			if (actions_p.action[j].value!="") {
				runWinAction("Model", "sysMsg", { "msg": actions_p.action[j].value});
			}
		}
		else if (syncActionCmd=="debugPaused") {
			setExecMode ("paused");
			curAppState.pausedAtList = actions_p.action[j].details.pausedAt;
			curAppState.pausedTrailingList = actions_p.action[j].details.trailing;

			if (curAppState.playModelDelay>0) {
				if (curAppState.playModelMode == "Traversal") {
					setTimeout("stepOver()", curAppState.playModelDelay);
				}
				else {
					setTimeout("stepScript()", curAppState.playModelDelay);
				}
			}
			runWinAction("Model", "pausedAtMsg", { "msg": "Paused At: " +  getPausedAtMsg()});
			runWinAction("Model", "setPausedAt");
			runWinAction("MScript", "setPausedAt");
		}
		else if (syncActionCmd=="ended" || actions_p.action[j].syncAction=="interrupted") {
			setExecMode ("stopped");
			logMsg("MBT execution has ended", 2);
			tempMsg = translateMsg("mbt.exec.done", actions_p.action[j].value);
			showExecStopped(tempMsg);
			runWinAction("Model", "sysMsg", { "msg": tempMsg});
			curAppState.pausedAtList = new Array();
			curAppState.pausedTrailingList = new Array();
		}
		else if (syncActionCmd=="errored") {
			setExecMode ("errored");
			tempMsg = translateMsg("mbt.exec.aborted", actions_p.action[j].value);
			logMsg("MBT execution error " + actions_p.action[j].value);
			showExecStopped(tempMsg);
			runWinAction("Model", "sysMsg", { "msg": tempMsg});
		}
		else if (syncActionCmd=="warning") {
			tempMsg = translateMsg("mbt.exec.warning", actions_p.action[j].value);
			showExecStopped(tempMsg);
			runWinAction("Model", "sysMsg", { "msg": tempMsg});
			logMsg("MBT execution warning " + actions_p.action[j].value);
		}
		else if (syncActionCmd=="execstatus") {
		alert ('unexpectively received execstatus in sync action');
//			found_execstatus = true;
//			runWinAction("Monitor", "updateProgress");
		}
		else if (syncActionCmd=="alert") {
			alertDialog (actions_p.action[j].value);
		}
	}
	
	runWinAction("Vars", "display", true);
}


// returns a node data
function getDataObj (uid_p) {
	return curAppState.nodeDataList[uid_p];
}

// saves the property changes
function saveProperty (nodeData_p, cbFunc_p) {
	if (nodeData_p.uid==undefined || nodeData_p.uid=="") {
		logMsg("save new " + nodeData_p.typeCode, 3);
		postAction ("addNode", nodeData_p, function (retMsg_p) {
			data = retMsg_p;
			if (actionCallback(data)) return;
			for (i in data.addnodes.nodelist) {
				var tempNode = data.addnodes.nodelist[i];
				curAppState.nodeDataList[tempNode.uid] = tempNode;
				if (tempNode.typeCode=="state") {
					curAppState.nodeDataList[tempNode.parentuid].childrenStates.push(tempNode);
				}
				else if (tempNode.typeCode=="transition") {
					curAppState.nodeDataList[tempNode.parentuid].transitions.push(tempNode);
				}
				else if (tempNode.typeCode=="usecase") {
					curAppState.nodeDataList["mbt"].usecases.push(tempNode);
				}
				else if (tempNode.typeCode=="step") {
					curAppState.nodeDataList[tempNode.parentuid].steps.push(tempNode);
				}
				else if (tempNode.typeCode=="swimlane") {
					curAppState.nodeDataList[tempNode.parentuid].swimlanes.push(tempNode);
				}
				else if (tempNode.typeCode=="box") {
					curAppState.nodeDataList[tempNode.parentuid].boxes.push(tempNode);
				}
			}
			runWinAction("Model", "addState/Trans", data.addnodes.nodelist);
			if (cbFunc_p) cbFunc_p (data.addnodes.nodelist);
		});
	}
	else {
		logMsg("save " + nodeData_p.typeCode + " uid: " + nodeData_p.uid, 3);
		postAction ("updateNode", nodeData_p, function(data) {
//			data = retMsg_p;
			if (actionCallback(data)) {
				runWinAction("Model", "updateNode", nodeData_p);
				if (nodeData_p.typeCode=="state" || nodeData_p.typeCode=="transition") {
					runWinAction("MScript", "updateNode", nodeData_p);
				}
			}
			else if (data.action && data.action=="revert") {
				alertDialog("SubModel changes detected, reloading model...");
				revertModel();
			}
		});
	}
	setModelChanged(true);
}

// not used yet.
function updateNodeInParent (updNodeData_p) {
	var childList = null;
	if (updNodeData_p.typeCode=="state") {
		childList = curAppState.nodeDataList[updNodeData_p.parentuid].childrenStates;
	}
	else if (updNodeData_p.typeCode=="transition") {
		childList = curAppState.nodeDataList[updNodeData_p.parentuid].transitions;
	}
	else if (updNodeData_p.typeCode=="usecase") {
		childList = curAppState.nodeDataList["mbt"].usecases;
	}
	else if (updNodeData_p.typeCode=="step") {
		childList = curAppState.nodeDataList[updNodeData_p.parentuid].steps;
	}
	else return;
	
	for (var i in childList) {
		var child = childList[i];
		if (child && child.uid == updNodeData_p) {
			childList[i] = child;
			return;
		}
	}
}

function fileSave() {
	if (curAppState.webmbtObj) {
/*	
		if (curAppState.webmbtObj.model.archiveModel) {
			promptDialog("save.model.prompt", "", function(){
				sendAction ("mbtSave", "comment=" + $("#promptField").val());
			});
		}
		else {
*/		
			runWinAction("MScript", "mScriptSave");
			setTimeout('sendAction ("mbtSave", "")', 1000); // to give mscript enough time to save
//		}
	}
	else {
		alertDialog("model.not.open");
	}
}

function fileSaveAs() {
	if (curAppState.webmbtObj) {
		promptDialog("save.model.as", "", function(){
			var asModelName = $("#promptField").val();
			if (asModelName=="") return;
			sendAction ("mbtSave", "asModelName=" + asModelName, function(data) {
				if (actionCallback(data)) return;
				logMsg("Save model as " + data.asModelName, 2);
				curAppState.nodeDataList["scxml"].filename = data.asModelName;
				runWinAction("Model", "renameModel", data.asModelName);
			});
		});
	}
	else {
		alertDialog("model.not.open");
	}
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
	resetAllPanes();

	curAppState.mscriptType = "scxml";
	curAppState.mscriptTrigger = "";
	curAppState.curNodeData = curAppState.nodeDataList["scxml"];

	runWinAction("Model", "display");

	if (curAppState.webmbtObj.execStatus.execStatus=="STARTED") {
		setExecMode("exec");
	}
	else if (curAppState.webmbtObj.execStatus.execStatus=="PAUSED") {
		setExecMode ("paused");
	}

	if (findTabGroup("Model")!=null) selectTab("Model");
	
	postInit();
}

function storeScxml (jsonObj_p) {
	if (actionCallback(jsonObj_p)) return false;
	curAppState.breakpoints = jsonObj_p.breakpoints;
//	curAppState.disableds = jsonObj_p.disableds;
	
	curAppState.webmbtObj = jsonObj_p;
	runWinAction("FileList", "display", true);
	getSubModelList();
	
//	if (jsonObj_p==undefined) jsonObj_p = actionObj;
	var model = jsonObj_p.model;
	curAppState.mbtSessionID = jsonObj_p.sessionID;
	curAppState.runMode = jsonObj_p.runMode;
	
//	nodeDataList = new Array(); // wipe out old array
	curAppState.nodeDataList[model.mbt.uid] = model.mbt;
	model.mbt.typeCode="mbt";
	curAppState.nodeDataList["mbt"] = model.mbt;
	model.mbt.parentuid = model.uid;
	curAppState.nodeDataList["scxml"] = model;
	model.folderPath = curAppState.webmbtObj.folderPath; // to be used for model pane for display only

	curAppState.nodeDataList[model.misc.uid] = model.misc;
	curAppState.nodeDataList["misc"] = model.misc;
	model.misc.parentuid = model.uid;
	
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

	if (model.misc && model.misc.swimlanes) {
		curAppState.nodeDataList[model.misc.uid] = model.misc;
		for (i=0; i<model.misc.swimlanes.length; i++) {
			curAppState.nodeDataList[model.misc.swimlanes[i].uid] = model.misc.swimlanes[i];
			model.misc.swimlanes[i].parentuid=model.misc.uid;
		}
	}

	if (model.misc && model.misc.boxes) {
		curAppState.nodeDataList[model.misc.uid] = model.misc;
		for (i=0; i<model.misc.boxes.length; i++) {
			curAppState.nodeDataList[model.misc.boxes[i].uid] = model.misc.boxes[i];
			model.misc.boxes[i].parentuid=model.misc.uid;
		}
	}

	var stateList = new Array();
	var expandList = new Array();
	expandList[0] = model;
	while (expandList.length>0) {
		expandList = loadSubStates(expandList, stateList);
	}

	curAppState.nodeDataList["template.usecase"] = model.template.usecase;
	curAppState.nodeDataList["template.usecase"].typeCode = "usecase";
	curAppState.nodeDataList["template.step"] = model.template.step;
	curAppState.nodeDataList["template.step"].typeCode = "step";
	curAppState.nodeDataList["template.state"] = model.template.state;
	curAppState.nodeDataList["template.state"].typeCode = "state";
	curAppState.nodeDataList["template.transition"] = model.template.transition;
	curAppState.nodeDataList["template.transition"].typeCode = "transition";
	curAppState.nodeDataList["template.swimlane"] = model.template.swimlane;
	curAppState.nodeDataList["template.swimlane"].typeCode = "swimlane";
	curAppState.nodeDataList["template.box"] = model.template.box;
	curAppState.nodeDataList["template.box"].typeCode = "box";

	curAppState.modelOpen = true;
	curAppState.modelName = model.filename;
	if (model.alert) {
		alertDialog(model.alert);
	}
	
	if (curAppState.curNodeData) {
		curAppState.curNodeData = curAppState.nodeDataList[curAppState.curNodeData.uid];
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
	curAppState.pausedTrailingList = new Array();
	if (okToExec()) {
		if (curAppState.execMode=="" || curAppState.execMode=="stopped" || curAppState.execMode=="errored") {
			curAppState.debugMode = false;
			setExecMode ("exec");
			var runType = "full";
			if (!isModeAUT()) {
				runType = "dry";
			}
			execMbt(runType, false, isModeMark());
		}
		else if (curAppState.execMode=="paused") {
			curAppState.debugMode = false;
			setExecMode ("exec");
			continueMbt();
		}
		else alertDialog("is.executing");
	}
}

function playButton() {
	curAppState.debugMode = false;
	if (curAppState.execMode=="paused") {
		// resume play
		if (curAppState.playModelDelay<-1) {
			curAppState.playModelDelay = - curAppState.playModelDelay;
		}
		else {
			curAppState.playModelDelay = 500;
		}
		
		stepOver();
		return;
	}
	
	if (okToExec()) {
		if (curAppState.execMode=="" || curAppState.execMode=="stopped" || curAppState.execMode=="errored") {
			curAppState.debugMode = false;
			var dly = curAppState.playModelDelay;
			if (curAppState.hiliteFailedGuards==undefined) {
				curAppState.hiliteFailedGuards = false;
			}
			var fGuard = "";
			if (curAppState.hiliteFailedGuards) {
				fGuard = "checked";
			}
			if (dly <= 0) {
				dly = 500;
			}
			var playHtml = "<b>Animate/Play Model Execution</b><br/>" 
				+ "<table onkeypress='dialogDefaultAction(event);'>"
				+ "<tr><td title='Whether to pause at every traversal (state/transition) or every mscript line.'>Pause Every:</td><td><input type=radio name='pauseEvery' id='pauseTraversal' value='1' checked>Traversal</input><input type=radio name='pauseEvery' id='pauseMScriptLine' value='0'>MScript Line</input></td></tr>"
				+ "<tr><td title='Pause duration in milliseconds'>Delay:</td><td><input id='playDelay' value='" + dly + "'/> ms</td></tr>"
				+ "<tr><td title='Highlight transitions with failed guards/conditions'>Highlight Failed Guards:</td><td><input type=checkbox id='hiliteFailedGuard' " + fGuard + "/></td></tr>"
				+ "</table>";

			plainDialog(playHtml, function () {
				var fld = getDialogField('pauseTraversal');
				if ($(fld).is(":checked")) {
					curAppState.playModelMode = "Traversal";
				}
				else {
					curAppState.playModelMode = "MScriptLine";
				}
				fld = getDialogField('playDelay');
				var playDelayMillis = $(fld).val();
				if (playDelayMillis=="") {
					curAppState.playModelDelay = -1;
				}
				else {
					curAppState.playModelDelay = parseInt(playDelayMillis);
					setTimeout("startDebug()", 50);
				}
				
				var fGuard = getDialogField('hiliteFailedGuard');
				if ($(fGuard).is(":checked")) {
					curAppState.hiliteFailedGuards = true;
				}
				else {
					curAppState.hiliteFailedGuards = false;
				}
			});	
		}
		else alertDialog("is.executing");
	}
}


function playAction () {
	var playModelDelayNew = getPromptVal();
	
	if (playModelDelayNew=="" || playModelDelayNew==undefined) return;
	
	curAppState.playModelDelay = parseInt(playModelDelayNew);
	if (curAppState.playModelDelay>0) {
		setTimeout("startDebug()", 50);
	}
	return;
}


function continueMbt () {
	logMsg ("continueMbt", 2);
	curAppState.pausedTrailingList = new Array();
	sendAction ("continue", "");
}

function debugButton() {
	curAppState.debugMode = true;
	curAppState.playModelDelay = -1;
	startDebug();
}

function startDebug () {
	if (okToExec()) {
		if (curAppState.execMode=="" || curAppState.execMode=="stopped" || curAppState.execMode=="errored") {
			curAppState.debugMode = true;
			setExecMode ("exec");
			var runType = "full";
			if (!isModeAUT()) runType = "dry";
			execMbt(runType, true, isModeMark());
		}
		else if (curAppState.execMode=="paused") {
			curAppState.debugMode = true;
			setExecMode ("exec");
			resumeMbt();
		}
		else alertDialog("is.executing");
	}
}

function stopButton() {
	curAppState.pausedAtList = new Array();
	curAppState.pausedTrailingList = new Array();
	curAppState.execMode = "";

	if (curAppState.modelOpen) {
		stopMbt();
		runWinAction("Model", "clearPaused");
		curAppState.hotSyncEnabled = true;
	}
	else alertDialog ("model.not.open");
}

function stopAllButton() {
	curAppState.pausedAtList = new Array();
	curAppState.pausedTrailingList = new Array();
	curAppState.runMode = "";

	if (curAppState.modelOpen) {
//		setExecMode ("stopped");
		stopMbtAll();
		runWinAction("Model", "clearAnimate");
		if (curAppState.playModelDelay > 0) curAppState.playModelDelay = -curAppState.playModelDelay;
	}
	else alertDialog ("model.not.open");
}

function closeOtherButton() {
	sendAction ("session", "cmd=closeOthers", function(data) {
		actionCallback(data);
		if (data.error) {
			flashSideBarFiller(false);
		}
		else {
			flashSideBarFiller(true);
		}
		refreshConfig();
	});
}

// pause button: pause or stepScript
function pauseButton() {
	if (curAppState.modelOpen) {
		if (curAppState.execMode=="exec" || curAppState.execMode=="paused") {
			logMsg("pause requested", 2);
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

function stepScriptButton() {
	pauseButton();
}

//pause button: pause or stepOver
function stepOverButton() {
	if (curAppState.modelOpen) {
		if (curAppState.execMode=="paused") {
			setExecMode ("exec");
			stepOver();
		}
		else alertDialog("step.invalid");
	}
	else alertDialog ("model.not.open");
}

//step over mScript lines
function stepLineButton(lineNum_p) {
	if (curAppState.modelOpen) {
		if (curAppState.execMode=="paused") {
			if (lineNum_p) {
				setExecMode ("exec");
				stepLine(lineNum_p);
			}
			else {
				promptDialog("step.line", "+3", stepLineReq);
			}
		}
		else alertDialog("step.invalid");
	}
	else alertDialog ("model.not.open");
}

function stepInButton() {
	if (curAppState.modelOpen) {
		if (curAppState.execMode=="paused") {
			setExecMode ("exec");
			stepScript();
		}
		else {
			alertDialog("step.invalid");
		}
	}
	else {
		alertDialog ("model.not.open");	
	}
}

function stepLineReq() {
	var lineNum = $("#promptField").val();
	stepLine (lineNum);
}

function stepLine (lineNum_p) {
	logMsg ("step over mScript " + lineNum_p, 2);
	sendAction ("stepScript", "line=" + encodeURIComponent(lineNum_p));
	runWinAction("Monitor", "updateProgress");
	runWinAction("Model", "clearPaused");
	curAppState.hotSyncEnabled = true;
}

function execMbt (runType_p, debug_p, markedOnly_p) {
	logMsg ("execMbt", 2);
	var runParams = "";
	if (markedOnly_p) {
		if (findTabGroup("Model")!=null) {
			runParams = runWinAction('Model', 'getAllMarkedUID').join(",");
		}
		else {
			alertDialog("Model Editor is not open.");
			return;
		}
		if (runParams!="") {
			runParams = "markList=" + runParams + "&mbtMode=" + curAppState.lastMarkSeq;
		}
	}

	if (isModeEnabled('modeALM')) {
		runParams += "&ALM=Y";
	}	
	
	if (runType_p=="modeling") {
		curAppState.runMode = "modeling";
		sendAction("start", "modeling=y&" + runParams);
	}
	else if (runType_p=="full" && debug_p) {
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

//	selectTab("Monitor");
	runWinAction("Monitor", "setStarting");
	runWinAction("Monitor", "display", true);
	
	runWinAction("Model", "clearPaused");
	runWinAction("Stats", "reset");
}

function stopMbt () {
	logMsg ("stopMbt", 2);
	sendAction ("session", "cmd=stopExec");

	runWinAction("Monitor", "display", true);
//	selectTab("Stats");
	runWinAction("Model", "clearPaused");
//	runWinAction("TreeView", "clearPaused");
//	runWinAction("Graph", "clearPaused");
	curAppState.hotSyncEnabled = true;
	curAppState.execMode = "";
}

function stopMbtAll () {
	logMsg ("stopMbt", 2);
	sendAction ("session", "cmd=stopExecAll");

	runWinAction("Monitor", "display", true);
//	selectTab("Monitor");
	runWinAction("Model", "clearPaused");
	curAppState.hotSyncEnabled = true;
}

function resumeMbt () {
	logMsg ("resumeMbt", 2);
	sendAction ("resume", "");
	curAppState.hotSyncEnabled = true;
	
	runWinAction("Monitor", "display", true);
//	selectTab("Monitor");
	runWinAction("Model", "clearPaused");
	curAppState.hotSyncEnabled = true;
}

function loadMbtStat (execID_p) {
	curAppState.execID = execID_p;
	runWinAction("Stats", "loadStat", curAppState.execID);
	runWinAction("SeqTrace", "display", true);
//	selectTab("tabStats");
}

function stepOver () {
	logMsg ("stepOver", 2);
	sendAction ("stepOver", "");
	runWinAction("Monitor", "updateProgress");
	curAppState.hotSyncEnabled = true;
}

function stepScript () {
	logMsg ("stepScript", 2);
	runWinAction("Model", "clearPaused");
	sendAction ("stepScript", "");
	runWinAction("Monitor", "updateProgress");
	curAppState.hotSyncEnabled = true;
}

function setExecMode(execMode_p) {
	curAppState.execMode = execMode_p;
//	self.status = curAppState.execMode;
	
	if (curAppState.execMode=="exec") {
		curTravNodeData = undefined;
	}
	
	runWinAction("monitor", "setExecMode", curAppState.execMode);
}

function isRunning() {
	if (curAppState.execMode=="exec") return true;
	else return false;
}

function isPaused() {
	if (curAppState.execMode=="paused") return true;
	else return false;
}

function fileImport () {
	selectTab("FileList");

	jQuery.facebox('<div><br>Select model file type, enter / select model file to import and click on <b>Import</b> button:<br><br>'
				+ '<form name="import" id="import" ENCTYPE="multipart/form-data" action="app=webmbt&action=import" method="post" target=_parent >'
				+ '<table><tr><td>Type:</td><td><select name="importFileType" id="importFileType">'
				+ '<option class="devOnly" value="GraphML">GraphML</option>'
				+ '	<option class="devOnly" value="GraphXML">GraphXML</option>'
				+ '	<option class="devOnly" value="SCXML">SCXML</option>'
				+ '	<option class="devOnly" value="XMI">XMI</option>'
				+ '</select></td></tr><tr><td>&nbsp;</td></tr>'
				+ '<tr><td style="padding-top: 5px;">File:</td><td><input type="file" class="devOnly" name="importFile" size="40" id="importFile"/>'
				+ '<input type="hidden" name="action" id="action" value="import" />'
			+ '</td></tr></table></form>'
		+ '<div style="width:100%; margin-top: 10px; display:block;">'
		+ '	  <div><button id="importButton" name="importButton" onclick="javascript:doImportFile();" class="devOnly">Import</button></div>'
		+ '</div>'
		+ '</div>');
	scrollToFacebox();
}



function doImportFile() {
	jQuery(document).trigger('close.facebox');
	
	if ($("#importFile").val()=="") {
		alertDialog("file.missing");
		return;
	}

	var importFileType = $("#importFileType").val();

	if (curAppState.modelOpen) {
		$("#import").trigger("submit");
		setModelChanged(true);
	}
	else {
		alertDialog("import.model.open");
	}
}


function backup () {
	if (curAppState.modelOpen) {
		if (curAppState.nodeDataList["scxml"].backupDate==undefined || curAppState.nodeDataList["scxml"].backupDate=="") {
			sendAction("backup", "", function(data) {
				actionCallback(data);
				var newBackupDate = (new Date()).toLocaleString();
				curAppState.nodeDataList["scxml"].backupDate = newBackupDate;
			});
		}
		else {
			confirmDialog(translateMsg("backup.ok2override", curAppState.nodeDataList["scxml"].backupDate), function () {
				sendAction("backup", "", function(data) {
					actionCallback(data);
					var newBackupDate = (new Date()).toLocaleString();
					curAppState.nodeDataList["scxml"].backupDate = newBackupDate;
				});
			});
		}
	}
	else {
		alertDialog("model.not.open");
	}
}

function restore () {
	if (curAppState.modelOpen) {
		if (curAppState.nodeDataList["scxml"].backupDate==undefined || curAppState.nodeDataList["scxml"].backupDate=="") {
			alertDialog("backup.missing");
		}
		else {
			confirmDialog(translateMsg("backup.restore", curAppState.nodeDataList["scxml"].backupDate), function () {
				sendAction("restore", "mbtFile=" + curAppState.nodeDataList["scxml"].filename, function(data) {
					if (data.error) alertDialog(data.error);
					else if (data.alertMessage) {
						if (data.alertMessage=="restore.ok") {
							location.replace("webmbtMain.html");
						}
						else {
							alertDialog(data.alertMessage);
						}
					}
					else {
						alertDialog ("rt.error");
					}
				});
			});
		}
	}
	else {
		alertDialog("model.not.open");
	}
}


function submitArchRequest(modelName_p) {
	promptDialog("prompt.archive.comment", "", function() {
		setTimeout("sendArchToSvr('" + modelName_p + "')", 20);
	});
}

function sendArchToSvr(modelName_p) {
	var cmt = getPromptVal();
	var modelParam = "";
	if (modelName_p) {
		modelParam = "&model=" + modelName_p;
	}
	modelParam += "&comment=" + encodeURIComponent(cmt);
	sendAction ("archive", "rand=" + Math.random() + modelParam, function(data) {
		actionCallback(data);
		if (data.error) flashSideBarFiller(false);
		else flashSideBarFiller(true);
	});
}

function aboutWebMBT() {
	sendAction("config","cmd=about", function(data) {
		if (actionCallback(data)) return;
		alertDialog(data.about);
	});
}


function newFolder () {
	promptDialog ("folder.new", "", function() {
		var curFolder = runWinAction("FileList", "getCurFolder");
		sendAction("newModel", "type=folder&curFolder=" + curFolder + "&modelName=" + $("#promptField").val(), function (data) {
			if (actionCallback(data)) return;
			runWinAction("FileList", "display", true);
		})	
	});

}

function openModel (filePath_p) {
//	if (curAppState.nodeDataList.config.sessLimit <= curAppState.nodeDataList.config.sessList.length) {
//		alertDialog("model.session.limit.exceeded");
//		return;
//	}

	logMsg("open model:" + filePath_p, 2);
	sendAction("open", "mbtfile="+filePath_p, function (data) {
		if (actionCallback(data)) return;
		if (data.status && data.status=="ok") location.replace("webmbtMain.html");
	});
}


function importModel (filePath_p, fileType_p) {
	logMsg("import model:" + filePath_p, 2);
	sendAction("import", "mbtFile="+filePath_p+"&fileType="+fileType_p);
}


function saveConfig() {
	logMsg("save config", 2);
	var configObj = curAppState.nodeDataList["config"];
	postAction ("saveConfig", configObj, function (retMsg_p) {
		data = retMsg_p;
		if (actionCallback(data)) return;
	});
}



function checkUpdates() {
	postActionUtil("config", "cmd=checkUpdates", function(data) {
		if (data.indexOf('{"error":')==0) {
			var msg = data.substring(10,data.length-2);
			alertDialog(msg);
		}
		else alertDialog(data);
	});
}

function renameModel () {
	if (curAppState.modelOpen) {
		promptDialog ("file.rename", curAppState.nodeDataList["scxml"].filename, renameRequest);
	}
	else {
		alertDialog("model.not.open");
	}
}

function renameRequest() {
	var modelName2 = $("#promptField").val().replace( /[\s\n\r'"=]+/g, "");
	if (modelName2=="") return;
	
	if (modelName2==curAppState.nodeDataList["scxml"].filename) return;
	
	sendAction("renameModel", "modelName=" + modelName2, function (data) {
		if (actionCallback(data)) return;
		
		if (data.renameFile) {
			logMsg("Renamed model to " + data.renameFile, 2);
			curAppState.nodeDataList["scxml"].filename = data.renameFile;
			runWinAction("Model", "renameModel", data.renameFile);
		}
	});
}

//reloads the object in current tab: model, filelist, etc.
function refreshLeftPane () {
	refreshTabGroup("paneLeft");
}

function refreshTopRightPane () {
	refreshTabGroup("paneTopRight");
}

function refreshBottomRightPane () {
	refreshTabGroup("paneBottomRight");
}

// deletes the file
function deleteFile (fname_p) {
	sendAction ("deletemodel", "mbtFile=" + fname_p);
}

// deletes the current model
function deleteModel() {
	confirmDialog("model.ok2delete", function () {
		sendAction("deletemodel", "");
		alertDialog("model.deleted");
	});
}


//close current model
function closeModel() {
	if (isModelChanged()) {
		confirmDialog(translateMsg("model.changed"), 
			function () {
				fileSave();
				setTimeout('doCloseModel()', 1000);
			},
			function () {
				setModelChanged(false);
				doCloseModel();
			},
			"Save", "Discard"
		);
	}
	else {
		doCloseModel();
	}
}

//close current model
function closeOtherModel() {
	sendAction ("session", "cmd=closeOthers", function(data) {
		actionCallback(data);
		if (data.error) {
			flashSideBarFiller(false);
		}
		else {
			flashSideBarFiller(true);
		}
		setTimeout('refreshConfig()',1000);
	});
}

//close current model
function closeAllModel() {
	if (isModelChanged()) {
		confirmDialog(translateMsg("model.changed"), 
			function () {
				fileSave();
				setTimeout('doCloseAllModel()', 500);
			},
			function () {
				setModelChanged(false);
				doCloseAllModel();
			},
			"Save", "Discard"
		);
	}
	else {
		doCloseAllModel();
	}
}


function doCloseModel() {
//	$("#fileMenu").removeClass("modelChanged");
	closeWin();
	sendAction ("session", "cmd=close");
	setTimeout('refreshIde()', 2000);
}


function doCloseAllModel() {
	closeWin();
	sendAction ("session", "cmd=closeAll");
	setTimeout('refreshIde()', 2000);
}

function revertModel() {
	if (!curAppState.modelOpen) return;
	setModelChanged(false);
	closeWin();
	sendAction ("session", "cmd=close", function(retData) {
		openModel(curAppState.nodeDataList["scxml"].filename);
	});
	curAppState.nodeDataList.config.sessList=new Array();
}


function editConfig () {
	sendAction ("config", "cmd=getConfigJson", function(data) {
		if (actionCallback(data)) return;
		curAppState.nodeDataList[data.config.uid] = data.config;
		curAppState.edition = data.config.prodlevel;
		if (data.config.cmd) eval(data.config.cmd);
		if (data.config.alert) {
			alertDialog(data.config.alert);
		}
		curAppState.pluginList = data.config.pluginList;
		$("#helpSupport").attr("href", $("#helpSupport").attr("href") + "&email=" + data.config.email);
		editProperty("config", 600, 450);
	});
}





function getSubModelList () {
	sendAction("mbtFileList", "type=subModel", function (data) {
		if (actionCallback(data)) return;
		curAppState.subModelList = data;
	});
}


//logs a message to console with default log level
function logMsg (msg_p, logLevel_p) {
	runWinAction("Console", "logMsg", {level: logLevel_p, msg: msg_p});
}


function getConfigProperty(name_p) {
	if (curAppState.nodeDataList.config==undefined) return undefined;
	return curAppState.nodeDataList.config[name_p];
}

function getCopyModelName() {
	return runWinAction("FileList", "getCopyModelName");
}

function toggleMode(modeFieldID_p) {
	setMode(modeFieldID_p, !isModeEnabled(modeFieldID_p));
}

function setMode(modeFieldID_p, enableStatus_p) {
	var modeField = $("#" + modeFieldID_p);
	if (enableStatus_p) {
		$(modeField).addClass("modeSelected");
	}
	else {
		$(modeField).removeClass("modeSelected");
	}
}

function isModeAUT() {
	return $("#modeAUT").hasClass("modeSelected");
}

function isModeMark() {
	return $("#modeMark").hasClass("modeSelected");
}

function isModeEnabled(modeID_p) {
	return $("#" + modeID_p).hasClass("modeSelected");
}

function loadModelMScriptFlags() {
	sendAction ("getModelJson", "type=getMscriptFlags", function (data) {
		if (actionCallback(data)) return;
		for (var i in data) {
			var dataI = data[i];
			var nodeObj = curAppState.nodeDataList[dataI.uid];
			if (nodeObj) {
				nodeObj.setVars = dataI.setVars;
				nodeObj.guardTrigger = dataI.guardTrigger;
			}
		}
	});
}

function setStatusMsg(msg_p) {
	window.status = msg_p;
	setTimeout("window.status='';", 500);
}

function snapshotStateUI (stateUID_p) {
	
	var stateObj = curAppState.nodeDataList[stateUID_p];
	if (stateObj.typeCode!="state") {
		alertDialog("snapUI.not.state");
		return;
	}

	sendAction ("uiState", "type=snapShotState&state=" + stateObj.stateid, function (data) {
		actionCallback(data);
		if (data.error) {
			// already taken care of by actionCallback()
		}
		else alertDialog("snapUI.done");
	});
}

function viewStateUI(stateUID_p) {
	var winObj = window.open("/MbtSvr/webmbtUISpy.html?stateID=" + curAppState.nodeDataList[stateUID_p].stateid, "MbtStateUI");
	addWin(winObj, "MbtStateUI");
}

/* additional shortcut functions */
function mScriptSave () {
	runWinAction("MScript", "mScriptSave");
}

function mScriptCancel () {
	runWinAction("MScript", "mScriptCancel");
}

function propertySave () {
	runWinAction("Property", "save");
}

function propertyCancel () {
	$("#shareDialog").dialog("close");
}

function mScriptCheck () {
	runWinAction("MScript", "mScriptCheck");
}

function mScriptSearch () {
	runWinAction("MScript", "search");
}


function setSession(sessID) {
	if (isModelChanged()) {
		alertDialog("model.new.change.pending");
		return;
	}
	
	sendAction ("session", "cmd=setSession&sessionID=" + sessID, function (data) {
		actionCallback(data);
		setTimeout("refreshIde()", 50);
	});
}


function refreshIde() {
	window.location.reload();
}


function retrieveSessionMenu() {
	sendAction ("config", "cmd=getConfigJson", function(data) {
		if (actionCallback(data)) return;
		curAppState.nodeDataList[data.config.uid] = data.config;
		if (data.config.alert) {
			alertDialog(data.config.alert);
		}
		
		setTimeout("setSessionMenu()", 50);
	});
}

function modeling() {
	execMbt("modeling",false,false);
}

function connectSvrMgr() {
	sendAction ("config", "cmd=conSvrMgr", function(data) {
		actionCallback(data);
		if (data.error) return;
		flashSideBarFiller(true);
		curAppState.nodeDataList["config"].conSvrMgr = true;
		setTimeout("updAppHeaderInfo()", 50);
	});
}

function disconnectSvrMgr() {
	sendAction ("config", "cmd=disconSvrMgr", function(data) {
		actionCallback(data);
		if (data.error) return;
		flashSideBarFiller(true);
		curAppState.nodeDataList["config"].conSvrMgr = false;
		setTimeout("updAppHeaderInfo()", 50);
	});
}

function closeDialog() {
	$("#shareDialog").dialog("close");
}

function startEditMScript(param) {
	var uid = param;
	if (param.uid) {
		uid = param.uid;
		curAppState.mscriptReadonly = param.readonly;
		curAppState.mscriptTrigger = param.trigger;
	}
	curAppState.curNodeData = curAppState.nodeDataList[uid];
	if (curAppState.curNodeData) {
    	curAppState.mscriptType = curAppState.curNodeData.typeCode;
	}
	else {
    	curAppState.mscriptType = "";
	}
	setTimeout('editMScript("' + uid + '")', 50);
}


function editMScript(uid_p) {
	if (selectWin("MScript")) {
		refreshWin("MScript");
	}
	else {
		openWin("MScript");
	}
}


function startDataSet (param) {
	var uid = null;
	if (param) {
		uid = param;
		if (param.uid) {
			uid = param.uid;
		}
		curAppState.curPropNodeData = curAppState.nodeDataList[uid];
	}
	setTimeout(editDataSet, 50);
}

function cancelChanges() {
	runWinActionOnAllWins('cancel','');
}

function refreshUID (uid_p) {
	sendAction("getModelJson", "cmd=refreshUID&uid=" + uid_p, function(data) {
		if (actionCallback(data)) return;
		curAppState.nodeDataList[data.uid] = data;
		runWinAction("Model", "updateNode", data);
	});
}

// shortcut
function modelTreeView () {
	runWinAction("Model", "popupTreeView");
}

function mcaseView () {
	runWinAction("Model", "popupMCaseView");
}

function getPausedAtMsg() {
	var pausedAt = curAppState.getPausedAt();
	if (pausedAt==null) return "";
	var desc = "";
	if (pausedAt.uid.indexOf("L")==0) {
		desc = pausedAt.desc;
		pausedUID = curAppState.getLastPausedAt();
		if (pausedUID) pausedUID = pausedUID.uid;
	}
	else {
		pausedUID = pausedAt.uid;
		var nodeData = curAppState.nodeDataList[pausedUID];
		if (nodeData.typeCode=="state") desc = nodeData.stateid + " (uid:" + pausedUID + ")";
		else if (nodeData.typeCode=="transition") desc = nodeData.event + " (uid:" + pausedUID + ")";
		else desc = desc + "(uid:" + pausedUID + ")";
	}
	
	return desc;
}

function zoomFrame(frameID_p, pct_p) {
	if ($.browser.webkit) {
		alertDialog("Zoom in/out is not supported for this browser type");
	}
	else {
		var modelProp = curAppState.nodeDataList["scxml"];
		try {
			modelProp.zoomPct = parseInt(modelProp.zoomPct) + pct_p;
			saveProperty(modelProp);
		}
		catch(err) {
			modelProp.zoomPct = 100;
		}
		windowResized();
	}
}


function shutdownServer() {
	confirmDialog("Do you wish to shut down " + IDE_Name + " server?", function () {
		sendAction("ping", "cmd=shutdown", function (data) {
			alertDialog("Shutdown request submitted");
		});
	});
}


function isRuntime() {
	if (curAppState.realEdition == "Runtime" ||
		curAppState.realEdition == "EntRuntime" ||
		curAppState.realEdition == "MiniRuntime") {
		return true;
	}
	else {
		return false;
	}
}

function isShowNewFeature() {
	return curAppState.nodeDataList["config"].showNewReleaseFeatures;
}

function lockModel () {
	sendAction("session", "cmd=forceLock", function (data) {
		if (data.error) {
			alertDialog (data.error);
			return;
		}
		
		curAppState.webmbtObj = true;
		alertDialog (data.alertMessage);
		
	});
}


function resetIDE() {
	confirmDialog("ide.reset.prompt", function() {
		resetDefault();}
	)
}

