
function testSC() {
	alert("shortcut key test success");
}

// need to finsh
function openGraph() {
//testing html2canvas
//	runWinAction('Model', 'modelGraph');
//	return;
	openGraphWin("ModelGraph", "GraphModel.html?type=ModelGraph&modelName=" + curAppState.nodeDataList["scxml"].filename);
}

function openReportSeqOut() {
	openReport("TestCaseRpt");
}

function openStatsRpt() {
	var winName = "StatsRpt";
	closeWin(winName);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/StatsRpt_Main.html", winName, windowOptions);
	if (!logWin) {
		alertDialog("popup.blocker");
	}
}

function openDashboard() {
	var winName = "Dashboard";
	closeWin(winName);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/Dashboard_Main.html", winName, windowOptions);
	if (!logWin) {
		alertDialog("popup.blocker");
	}
}

function openPlayback() {
	var winName = "Playback";
	closeWin(winName);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/Playback/Playback.html", winName, windowOptions);
	if (!logWin) {
		alertDialog("popup.blocker");
	}
}

function openReport(rptFile) {
	closeWin(rptFile);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/app=webrpt&name=" + rptFile, 
						rptFile, windowOptions);
	if (logWin) {
		if (rptFile!="TestCaseRpt") {
			closeWin(rptFile);
			addWin(logWin, rptFile);
		}
	}
	else {
		alertDialog("popup.blocker");
	}
}


function openGraphWin(winName, graphURL) {
	closeWin(winName);
	var winObj = window.open(graphURL + "&rand=" + Math.random(), winName);
	addWin(winObj, winName);
}

function openBDT () {
	window.location = "BDT_Main.html";
}

function openDataDesigner() {
	var winName = "DataDesigner";
	closeWin(winName);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/DataDesign_Main.html", winName, windowOptions);
	if (!logWin) {
		alertDialog("popup.blocker");
	}
}


function openUIRepo() {
	var winName = "UIRepo";
	closeWin(winName);
	var windowOptions = "toolbar=no,menubar=no,status=no,directories=no,scrollbars=yes,location=no";
	logWin = window.open("/MbtSvr/UIRepo_Main.html", winName, windowOptions);
	if (!logWin) {
		alertDialog("popup.blocker");
	}
}

function printModel() {
	runWinAction("Model", "printModel");
}

function openTravGraph() {
	openGraphWin("SequenceGraph", "GraphSequence.html?type=SequenceGraph&execID=" + curAppState.execID);
}

function openTravGraphWithParam(params) {
	openGraphWin("SequenceGraph", "GraphSequence.html?type=SequenceGraph&execID=" + curAppState.execID + "&" + params);
}

function openCoverageGraph() {
	openGraphWin("CoverageGraph", "GraphCoverage.html?type=CoverageGraph&execID=" + curAppState.execID);
}

function openExecMSC() {
	openGraphWin("ExecMSC", "GraphExecMsgSeqChart.html?type=execMSC");
}

function openTravMSC() {
	openGraphWin("MbtTravMSC", "GraphTravMsgSeqChart.html?type=travMSC&execID=" + curAppState.execID); 
}



function canvasProperty() {
	var modelProp = curAppState.nodeDataList["scxml"];
	var canvasProp = {
		typeCode: "canvasProp",
		uid: "canvasProp"
	}
	curAppState.nodeDataList["canvasProp"] = canvasProp;
	editProperty (canvasProp, 550, 300);
}

function modelPropDialog () {
	editProperty('scxml', 610, 450);
}

function mbtSettingDialog () {
	editProperty('mbt', 400, 420);
}

function editStateProperty (stateNode) {
	editProperty(stateNode, 600, 450);
}

function editTransProperty (transNode) {
	editProperty(transNode, 600, 450);
}

function editMCaseProperty (mcaseNode) {
	editProperty(mcaseNode, 600, 280);
}

function editStepProperty (stepNode) {
	editProperty(stepNode, 550, 260);
}

function editSwimlaneProperty (swimlaneNode) {
	editProperty(swimlaneNode, 550, 260);
}


function editBoxProperty (boxNode) {
	editProperty(boxNode, 550, 450);
}

function createNewModel(newModel_p) {
	newModel_p.curFolder = runWinAction("FileList", "getCurFolder");
	newModel_p.modelName = newModel_p.filename.replace( /[\s\n\r'"=]+/g, "");
	postAction("newModel", newModel_p, 
			function (data) {
//				var ret;
//				eval("ret=" + data);
				if (actionCallback(data)) return;
				if (data.status && data.status=="ok") location.replace("webmbtMain.html");
			});
}


function newModel () {
	var modelType = "FSM";
	var plugin = "Selenium";
	if (curAppState.realEdition=="MBBA") {
		modelType = "CFG";
		plugin = "BA";
	}
	curAppState.curPropNodeData = {
		typeCode: "newModel", 
		curFolder: 	runWinAction("FileList", "getCurFolder"),
		uid: "newModel",
		filename: "", 
		desc: "", 
		modelType: modelType,
		url: "http://", 
		browser: "firefox", 
		pluginID: plugin,
		template: "templateBasic"
	};
	
	$('#shareDialog iframe').attr("src","PropertyEditor.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Create New Model",
			autoOpen: false,
			width: 600,
			height: 500,
			position: [($(window).width()-600)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: {
				"Ok": function() {
					runWinAction("Property", "save");
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		})
		.dialog("open");
}


// not finished yet, need to get filter from the submodel state ctx.
// stateUID_p is the stateUID of main model state
function editStateTransFilter (stateUID_p, targetUID_p) {
	var propNode = curAppState.nodeDataList[targetUID_p];
	if (propNode==undefined) return;
	var title = "SubModel Filter for ";
	if (propNode.typeCode=="state") {
	   	title += resolveSysMsg("state") + ": " + propNode.stateid;
	}
	else {
		title += resolveSysMsg("transition") + ": " + propNode.event; 
	}
	
	// rest of attrs are set in PropertyEditor.js
	curAppState.curNodeData = {
		typeCode: propNode.typeCode + "Filter", 
		type: propNode.typeCode,
		uid:  propNode.typeCode + "Filter",
		stateUID: stateUID_p,
		targetUID: targetUID_p
	};
	
	
	$('#shareDialog iframe').attr("src","PropertyEditor.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  title,
			autoOpen: false,
			width: 350,
			height: 200,
			modal: true,
			position: [($(window).width()-350)/2, 75],
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: {
				"Ok": function() {
					runWinAction("Property", "save");
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		})
		.dialog("open");
}



function setLicense() {
	$('#shareDialog iframe').attr("src","ManageLicense.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Manage License",
			autoOpen: false,
			width: 500,
			height: 400,
			position: [($(window).width()-500)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}


function openModelRepo () {
	$('#shareDialog iframe').attr("src","ModelRepo.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Model Check In/Out",
			autoOpen: false,
			width: 700,
			height: 500,
			position: [($(window).width()-700)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}



function batchRun () {
	$('#shareDialog iframe').attr("src","BatchRun.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Batch Run Models",
			autoOpen: false,
			width: 700,
			height: 500,
			position: [($(window).width()-700)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}


function batchDeploy () {
	$('#shareDialog iframe').attr("src","BatchDeploy.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Batch Deploy Models to SvrMgr",
			autoOpen: false,
			width: 720,
			height: 500,
			position: [($(window).width()-700)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}

function batchCoverage () {
	$('#shareDialog iframe').attr("src","BatchModelCoverage.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Requirement Coverage by Models",
			autoOpen: false,
			width: 720,
			height: 500,
			position: [($(window).width()-700)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}


var customizeTabInit = false;
function customizeTab(tabGroup_p) {
	if (!customizeTabInit) prepCustomTabs();
	$("#opaqDiv").show();
	$('#tabDefn').dialog().dialog(
		{	title:  "Tab Customization",
			close: function(ev, ui) {
	            clearDialog();  
	        },
			autoOpen: false,
			width: 350,
			modal: true,
			position: [($(window).width()-350)/2, 75],
			closeOnEscape: true
		})
		.dialog("open");
}

function prepCustomTabs() {
	for (winID in allWinList) {
		if (allWinList[winID].app=="ide" || allWinList[winID].app=="*") {
			var tabGroup = findTabGroup(winID);
			var itemClass = "tabItem";
			if (winID=="FileList" || winID=="Model") itemClass = "tabItemFixed";
			var htmlCode = "<li class='" + itemClass + "'>" + winID + "</li>";
			if (tabGroup==null) tabGroup = "midPane";
			$("#" + tabGroup + "Tabs .tabContainer").append(htmlCode);
		}
	}

	$(".tabItem" ).draggable().draggable({revert: "invalid", helper: "clone" });
	$(".tabPane").droppable({
			accept: ".tabItem",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				var tabID = $(ui.draggable).text();
				var tabGroup = $(this).attr("tabGroup");
				deleteTab(tabID);
				if (tabGroup!="unusedTabs") addTab(tabGroup, tabID);
				saveTabLayout();
				$( this ).find(".tabContainer:first").append(ui.draggable);
				windowResized();
			}
		});
	customizeTabInit = true;
}


function editDataSet() {
	$("#opaqDiv").show();
	$('#shareDialog iframe').attr("src","DataSet.html");
	
	setTimeout(function() {
	$('#shareDialog').dialog().dialog(
		{	title:  "DataSet for " + getPropertyLabel(curAppState.curPropNodeData),
			close: function(ev, ui) {
	            clearDialog();  
	        },
			buttons: {},
			autoOpen: false,
			position: [($(window).width()-600)/2, 75],
			width: 600,
			height: 500,
			closeOnEscape: true
		})
		.dialog("open");
		}, 50);
}



function editProperty(nodeData_p, width_p, height_p) {
	if (!nodeData_p) return;
	
	if (!nodeData_p.typeCode) {
		nodeData_p = curAppState.nodeDataList[nodeData_p];
	}
	logMsg("edit property on uid: " + nodeData_p.uid + ", " + nodeData_p.typeCode, 3);
	
	if (width_p==undefined || width_p <= 0) width_p = 600;
	if (height_p==undefined || height_p <= 0) height_p = 600;
	curAppState.curPropNodeData = nodeData_p;
	
	$('#shareDialog iframe').attr("src","PropertyEditor.html");//.hide();
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  getPropertyLabel(curAppState.curPropNodeData),
			autoOpen: false,
			width: width_p,
			height: height_p,
			position: [($(window).width()-600)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: {
				"Ok": function() {
					runWinAction("Property", "save");
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		})
		.dialog("open");
}


function getPropertyLabel (nodeData_p) {
	var labelText = "";
	if (nodeData_p.typeCode=="state") {
		if (isModelCFG()) {
			labelText = "<small>Node</small> " + nodeData_p.stateid;
		}
		else {
			labelText = "<small>State</small> " + nodeData_p.stateid;
		}
	}
	else if (nodeData_p.typeCode=="transition") {
		if (isModelCFG()) {
			labelText = "<small>Edge</small> " + nodeData_p.event + ": " + curAppState.nodeDataList[nodeData_p.parentuid].stateid + "->" + nodeData_p.target;
		}
		else {
			labelText = "<small>Trans</small> " + nodeData_p.event + ": " + curAppState.nodeDataList[nodeData_p.parentuid].stateid + "->" + nodeData_p.target;
		}
	}
	else if (nodeData_p.typeCode=="usecase") {
		labelText = "<small>mCase</small> " + nodeData_p.usecasename;
	}
	else if (nodeData_p.typeCode=="step") {
		labelText = "<small>step</small> ";
		var tempTrans = curAppState.nodeDataList[nodeData_p.transuid];
		if (tempTrans) {
			var tempState = curAppState.nodeDataList[tempTrans.parentuid];
			if (tempState) {
				labelText += tempState.stateid + "." + tempTrans.event;
			}
			else {
				labelText += tempState.stateid;
			}
		}
		else {
			var tempState = curAppState.nodeDataList[nodeData_p.stateuid];
			labelText += tempState.stateid;
		}
	}
	else if (nodeData_p.typeCode=="config") {
		labelText = "Config Setting";
	}
	else if (nodeData_p.typeCode=="scxml") {
		labelText = "Model Property";
	}
	else if (nodeData_p.typeCode=="mbt") {
		labelText = "MBT Setting";
	}
	else if (nodeData_p.typeCode=="canvasProp") {
		labelText = "Canvas / Graph Setting";
	}
	else labelText = nodeData_p.typeCode + " (" + nodeData_p.uid + ")";
	return labelText;
}




// mscript exec
function execMScriptExpr (scriptText_p) {
	openMScriptExec(scriptText_p, true);
}

function openMScriptExec (mscriptExpr_p, autoExec_p) {
	if (curAppState.execMode!="paused") {
		alertDialog("mScript.exec.not.paused");
		return;
	}

	curAppState.autoExecMScript = false;
	if (mscriptExpr_p && mscriptExpr_p!="") {
		curAppState.lastMScriptExpr = mscriptExpr_p;
		curAppState.autoExecMScript = true;
	}
	else {
		curAppState.lastMScriptExpr = "";
	}

	$("#opaqDiv").show();
	$('#shareDialog iframe').attr("src","ExecMScriptExpr.html");
	$("#opaqDiv").show();
	
	$('#shareDialog').dialog().dialog(
		{	title:  "MScript Sandbox",
			close: function(ev, ui) {
	            clearDialog();  
	        },
			buttons: {},
			autoOpen: false,
			position: [($(window).width()-700)/2, 75],
			width: 700,
			height: 400,
			closeOnEscape: true
		})
		.dialog("open");
}

function clearDialog() {
	$("#opaqDiv").hide();
	$('#shareDialog iframe').attr("src","blank.html");
//    $(this).dialog('destroy');
}

function almConfig () {
	$('#shareDialog iframe').attr("src","ALM_Config.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  "Application Lifecycle Management (ALM) Integration",
			autoOpen: false,
			width: 650,
			height: 400,
			position: [($(window).width()-650)/2, 75],
			modal: true,
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}


function showReqDetails (tagObj_p, showLatest) {
	sendAction ("tag", "type=getTagLog&syncMode=" + showLatest + "&tag=" + tagObj_p.tag, function(data) {
//		if (data.length<=0) return "";
		var tagObj = tagObj_p;
		if (tagObj_p.originalRequirement) {
			tagObj = tagObj_p.originalRequirement;
		}
		if (tagObj_p.almRequirement) {
			tagObj = tagObj_p.almRequirement;
		}
//		if (showLatest && tagObj_p.almRequirement) {
//			tagObj = tagObj_p.almRequirement;
//		}
		// need to encode percent symbol
		var ret = "<table width='100%25'>";
		ret += "<tr><th colspan=4 class=header>ALM Requirement Details</th></tr>";
		var tagDesc = tagObj.desc;
		ret += "<tr><th valign=top>Req.&nbsp;Tag:</th><td>" + tagObj.tag + "</td>"
		    + "<th valign=top>Status:</th><td valign=top>" + tagObj.status + "</td></tr>"
		    + "<tr><th valign=top>Name:</th><td valign=top>" + tagObj.name + "</td>"
		    + "<th valign=top>Priority:</th><td valign=top>" + tagObj.priority + "</td></tr>"
		    + "<th valign=top>Modified&nbsp;Date:</th><td colspan=3 valign=top>" + tagObj.modifiedDate + "</td></tr>"
		    + "<tr><th valign=top>Description:</th><td colspan=3>" + tagDesc + "</td></tr>";
		if (tagObj.versions && tagObj.versions.length>0) {
			ret += "<tr><th valign=top>AUT&nbsp;Vrsn:</th><td colspan=3>"
				+ tagObj.versions.join("<br/>") + "</td></tr>";
		}
		if (tagObj.keywords && tagObj.reqGroup.length>0) {
			ret += "<tr><th valign=top>Req.&nbsp;Groups:</th><td colspan=3>"
				+ tagObj.reqGroup.join("<br/>") + "</td></tr>";
		}
		if (tagObj.keywords && tagObj.keywords.length>0) {
			ret += "<tr><th valign=top>Key&nbsp;Words:</th><td colspan=3>"
				+ tagObj.keywords.join("<br/>") + "</td></tr>";
		}
		if (tagObj.storyids && tagObj.storyids.length>0) {
			ret += "<tr><th valign=top>Story IDs:</th><td colspan=3>"
				+ tagObj.storyids.join("<br/>") + "</td></tr>";
		}
		if (tagObj.sprints && tagObj.sprints.length>0) {
			ret += "<tr><th valign=top>Sprints:</th><td colspan=3>"
				+ tagObj.sprints.join("<br/>") + "</td></tr>";
		}
		    
		if (showLatest) {
			ret += "<tr class='header'><th>Field Name</th><th>Old Value</th><th>New Value</th><th>Date</th></tr>";
			if (data.error) {
				ret += "<tr><td colspan='4'>*** Error: " + data.error + "***</td></tr>";
			}
			else if (data.alertMessage) {
				ret += "<tr><td colspan='4'>*** " + data.alertMessage + "***</td></tr>";
			}
			else {
				for (var i in data) {
					var logObj = data[i];
					ret += "<tr><td>" + logObj.newValue + "</td><td>" + logObj.fieldName + "</td><td>"
						+ logObj.oldValue + "</td><td>" + logObj.changeDate + "</td></tr>"; 
				}
			}
		}
		ret += "</table>";
		alertDialog(ret);
	});
}


// should not be used now
function runSearchModel(findOption) {
	runWinAction("Model", "runSearch", findOption);
}


function loadReqTagList(syncRefresh) {
	var cmdType = "getTagList";
	if (syncRefresh) cmdType = "syncTagList";
	sendAction("tag", "type=" + cmdType, function (data) {
		if (actionCallback(data)) return;
		curAppState.reqTagList = data;
		runWinAction("Model", "refreshReqTagList");
	});
}

function getReqTagList() {
	var retList = new Array();
	for (var i in curAppState.reqTagList) {
		var tag = curAppState.reqTagList[i];
		if (tag==null) continue;
		if (tag.diffFlag!="added") {
			retList.push(tag.originalRequirement);
		}
	}
	return retList;
}


var markSeqList = [
		{ label: "", val: "None"},
		{ label: "MarkedOnly PathFinder", val: "PathFinder"},
		{ label: "MarkedOnly PriorityPath", val: "PriorityPath"},
		{ label: "MarkedOnly Optimal", val: "MarkedOnlyOptimal"},
		{ label: "MarkedOnly Serial", val: "MarkedOnlySerial"}
	];
	
function setMark() {
	var markTitle = "<b>Model Execution in <a href='http://testoptimal.com/doku/doku.php?id=mark_mode' target=_blank>Mark Mode</a></b><hr/>Execute model to cover the states and transitions marked.<br/><i>Select a <a href='http://testoptimal.com/doku/doku.php?id=sequence_mode' target=_blank>sequencer</a> to enable Mark Mode</i>";
	selectDialog (markTitle, markSeqList, curAppState.lastMarkSeq, function() {
			curAppState.lastMarkSeq = getSelectedVal();
			if (curAppState.lastMarkSeq=="None") {
				setMode("modeMark", false);
				runWinAction("Model", "markMode", false);
			}
			else {
				setMode("modeMark", true);
				runWinAction("Model", "markMode", true);
			}
		});	
}

function toggleALM() {
	if (isModeEnabled("modeALM")) {
		setMode("modeALM", false);
		return;
	}
	var scxml = curAppState.nodeDataList["scxml"];
	if (scxml.pluginID.indexOf("ALM")>=0) {
		toggleMode("modeALM");
	}
	else {
		alertDialog("alm.not.enabled");
	}
}

function editStateTransAnnot (targetUID_p) {
	var propNode = curAppState.nodeDataList[targetUID_p];
	if (propNode==undefined) return;
	curAppState.curPropNodeData = propNode;
	var title = "Annotation for ";
	if (propNode.typeCode=="state") {
	   	title += resolveSysMsg("state") + ": " + propNode.stateid;
	}
	else {
		title += resolveSysMsg("transition") + ": " + propNode.event; 
	}
	
	$('#shareDialog iframe').attr("src","AnnotEditor.html");
	$("#opaqDiv").show();
	$('#shareDialog').dialog().dialog(
		{	title:  title,
			autoOpen: false,
			width: 700,
			height: 700,
			modal: true,
			position: [($(window).width()-700)/2, 75],
			close: function(ev, ui) {
	            clearDialog();  
	        },
			closeOnEscape: true,
			buttons: {
				"Ok": function() {
					runWinAction("Annot", "save");
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		})
		.dialog("open");
}

