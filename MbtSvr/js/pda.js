// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// pda.js

var nodeTypeLabelList = {"scxml": "model", "state": "state", "transition": "trans", "mbt": "mbt", "usecase": "mCase", "step": "step" }
var modelObj;
var nodeDataList = new Array();

var pluginList;
var orient = "N"; // S for side
var subModelList;
var curTab="";

$(document).ready(function() {
	
	$("#model").addClass("tabSelected");
	// landscape, change span to td
	$("#tabHeader .tabLabel").click(function() {
		$("#tabHeader span").removeClass("tabSelected");
		$(this).addClass("tabSelected");
		if (curTab==$(this).attr("id")) {
			changeOrient();
		}
		
		else curTab = $(this).attr("id");

		$(".tab").hide();
		$("#" + curTab + "Div").show();
		eval("click_" + curTab + "()");
		
	});

	init();


	
});


function genUrl(action_p, params) {
	var url = 'app=webmbt&action=' + action_p + '&rand='+Math.random();
	url = url + "&" + params;
	return url;
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return undefined;
}

sendAction ("config", "cmd=getConfigJson", function(data) {
	if (actionCallback(data)) return;
	nodeDataList[data.config.uid] = data.config;
	edition = data.config.prodlevel;
	var tempPluginList = data.config.pluginList;

	pluginList = new Array();
	for (i in tempPluginList) {
		var tempVal = new CodeDesc();
		tempVal.code = tempPluginList[i];
		tempVal.desc = tempVal.code;
		pluginList[pluginList.length] = tempVal;
	}
	pluginList = pluginList.sort(compCodeDesc);
	
});

sendAction("mbtFileList", "type=subModel", function (data) {
	if (actionCallback(data)) return;
	var tempSubModelList = data;
	subModelList = new Array();
	for (i in tempSubModelList) {
		var tempVal = new CodeDesc();
		tempVal.code = tempSubModelList[i];
		tempVal.desc = tempVal.code;
		subModelList[subModelList.length] = tempVal;
	}
	subModelList = subModelList.sort(compCodeDesc);
});

function init () {
    $('a[rel*=facebox]').facebox({
        loading_image : 'js/facebox/loading.gif',
        close_image   : 'js/facebox/closelabel.gif'
    });
    

	$("#execProgressBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#stateCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#transCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#jvmMemBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: false} );
	
	$("#statsDiv .stateCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: false} );
	$("#statsDiv .transCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: false} );

	$(".statsFilter").click(function() {
		$(".statsFilter").removeClass("hoverOver");
		$(this).addClass("hoverOver");
		statsFilter($(this).html());
	});

	$.getJSON(genUrl("getModelJson", ""), function(data) {
		if (data.model) {
			refreshModel(data);
			editProperty(data.model, false, false);
		}
		else {
			$("#fList").click();
		}
	});

	$("#mbtPropDiv input").change(function() {
		propChanged();
	});
	$("#mbtPropDiv select").change(function() {
		propChanged();
	});

	//$(".wide").hide();
	init_normal();

}



//dialog and confirm popup, requires faxbox.js
function alertDialog(msg_p) {
	if (msg_p=="change.saved") setTimeout ("jQuery(document).trigger('close.facebox')", 1200);
	msg_p = translateMsg(msg_p);
	if ($("#facebox").is(":visible")) {
		$("#alertMsg").append("<p>"+msg_p+"</p>");
	}
	else {
		jQuery.facebox("<table><tr><td id=alertMsg><p>" + msg_p + "</p></td></tr></table>");
	};
}


var mbtYesFunc;
var mbtNoFunc;
function confirmDialog(msg_p, yesFunc, noFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = noFunc;
	msg_p = translateMsg(msg_p);
	jQuery.facebox("<table><tr><td id=alertMsg><p>" + msg_p + "</p></td></tr>"
	    	+ "<tr><td><br><button id=okBtn onclick='javascript:confirmDialogAction(true)'>ok</button><button onclick='javascript:confirmDialogAction(false);'>cancel</button></td></tr></table>");
}

function confirmDialogAction(action_p) {
	$.facebox.close();
	if (action_p==true) {
		if (mbtYesFunc!=undefined) mbtYesFunc.apply();
	}
	else {
		if (mbtNoFunc!=undefined) mbtNoFunc.apply();
	}
}

function promptDialog(msg_p, defaultValue_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	jQuery.facebox("<table><tr><td id=alertMsg><p>" + msg_p + "</p></td></tr>"
			+ "<tr><td><br><input type='text' size='60' id='promptField' value=\"" + defaultValue_p + "\"/></td></tr>"
	    	+ "<tr><td><br><button id=okBtn onclick='javascript:confirmDialogAction(true)'>ok</button></td></tr></table>");
}

function selectDialog(msg_p, optionList_p, defaultValue_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	var selectHtml = "<table><tr><td id=alertMsg><p>" + msg_p + "</p></td></tr>"
		+ "<tr><td><br><select id='selectField'>";
	for (var i=0; i<optionList_p.length; i++) {
		var selected = "";
		if (optionList_p[i]==defaultValue_p) selected = "selected";
		selectHtml = selectHtml + "<option value=\"" + optionList_p[i] + "\" " + selected + ">" 
			+ optionList_p[i] + "</option>";
	}
	selectHtml = selectHtml + "</select></td></tr>"
		+ "<tr><td><br><button id=okBtn onclick='javascript:confirmDialogAction(true)'>ok</button></td></tr></table>"
	
	jQuery.facebox(selectHtml);
}



function isShade(rowNum_p) {
	if (Math.floor(rowNum_p/1)%2==1) return true;
	else return false;
}

var seqNum = 0; 
var monitorTimeout; 

function clearPendingRequest() {
	seqNum = seqNum + 1; // to clear timeout checking
	$("#loadingImg").hide();
}

function sendAction (action, params, callbackFunc) {
	if (callbackFunc==undefined) callbackFunc = actionCallback;
	$.getJSON(genUrl(action, params), callbackFunc);
}

function postAction (action, params, callbackFunc) {
	var url = genUrl(action, "");
	if (callbackFunc==undefined) callbackFunc = actionCallbackPost;

	$.post(url, params, callbackFunc);
}
 
  
// generic action callback, return true if the action has been taken care of by this function
function actionCallback(actionObj_p) {
	
	clearPendingRequest();
	if (actionObj_p.error && actionObj_p.error=="model.not.open" || actionObj_p.status && actionObj_p.status=="model.not.open") {
		setTimeout("reloadFileList()", 1000);
		return true;
	}
	if (actionObj_p.error) {
		actionObj_p.error = actionObj_p.error.replace("java.lang.Exception: ", "");
		alertDialog("Error: " + translateMsg(actionObj_p.error));
		return true;
	}
	
	if (actionObj_p.alertMessage) {
		if (actionObj_p.alertMessage!="ok") alertDialog (actionObj_p.alertMessage);
		return true;
	}
	return false;
}

// generic action callback, return true if the action has been taken care of by this function
function actionCallbackPost(message_p) {
	var actionObj = eval("actionObj=" + message_p);
	return actionCallback(actionObj);
}


function PopupWin(page,IEWidth,IEHeight,NNWidth,NNHeight) {

	var MyBrowser = navigator.appName;

	if (MyBrowser == "Netscape") {
		var myWinWidth = (window.screen.width/2) - (NNWidth/2);
		var myWinHeight = (window.screen.height/2) - ((NNHeight/2) + 50);

		var myWin = window.open(page,"MainWin","width=" + NNWidth + ",height=" + NNHeight + ",screenX=" + myWinWidth + ",screenY=" + myWinHeight + ",left=" + myWinWidth + ",top=" + myWinHeight + ",scrollbars=yes,toolbar=0,status=0,menubar=0,resizable=0,titlebar=no");
	}
	else {
		var myWinWidth = (window.screen.width/2) - (IEWidth/2);
		var myWinHeight = (window.screen.height/2) - ((IEHeight/2) + 50);
		var myWin = window.open(page,"MainWin","width=" + IEWidth + ",height=" + IEHeight + ",screenX=" + myWinWidth + ",screenY=" + myWinHeight + ",left=" + myWinWidth + ",top=" + myWinHeight + ",scrollbars=yes,toolbar=0,status=0,menubar=0,resizable=0,titlebar=no");

	}
	myWin.focus();
}

function updateOrientation(){  

    switch(window.orientation){  
        case 0:  
        // "normal"
		init_normal();  
        	break;  
    
        case -90:  
         // "right";  
		init_side();
          break;  
    
        case 90:  
          // "left";
		init_side();  
          	break;  
    
        case 180:  
         // "flipped";  
		init_normal();
         	break;  
     }  
 
}


function init_normal() {
	orient = "N";
	$(".normal").show();
	$(".wide").hide();
	$("#mbtPropDiv input").removeClass("inputWide").addClass("inputNormal");
	$("#mbtPropDiv textarea").removeClass("inputWide").addClass("inputNormal");
}

function init_side() {
	orient = "S";
	$(".normal").hide();
	$(".wide").show();
	$("#mbtPropDiv input").removeClass("inputNormal").addClass("inputWide");
	$("#mbtPropDiv textarea").removeClass("inputNormal").addClass("inputWide");
}


function refreshPda() {
	eval ("refresh_" + $(".tabSelected").attr("id") + "()");
	initOrient();
}


function initOrient() {
	if (orient=="S") {
		init_side();
	}
	else {
		init_normal();
	}
}

function changeOrient() {
	if (orient=="N") {
		init_side();
	}
	else {
		init_normal();
	}
}

//pdaExec.js

function click_exec() {

}


//start button: start or resume
function startButton() {
	if (modelObj) {
		if (modelObj.status=="" || modelObj.status=="stopped" || modelObj.status=="errored") {
			execMbt(true, false);
		}
		else if (modelObj.status=="paused") {
			continueMbt();
			fastHotSync();
		}
		else alertDialog("is.executing");
	}
	else alertDialog ("model.not.open");
}

function clearPaused() {
	$("#scxmlPaused").hide();
	$("#"+modelObj.pausedUID + " .paused").hide();
	modelObj.pausedUID=undefined;
}

function continueMbt () {
	clearPaused();
	sendAction ("continue", "");
}

function stopButton() {
	if (modelObj) {
		if (modelObj.status=="exec" || modelObj.status=="paused" || modelObj.status=="errored") {
			stopMbt();
			regularHotSync();
		}
	}
	else alertDialog ("model.not.open");
}

//pause button: pause or stepScript
function pauseButton() {
	if (modelObj) {
		if (modelObj.status=="exec") {
			sendAction ("pause", "");
		}
		else if (modelObj.status=="paused") {
			stepScript();
			fastHotSync();
		}
		else alertDialog("pause.invalid");
	}
	else alertDialog ("model.not.open");
}

function execMbt (fullRun_p, debug_p) {
	clearPaused();
	if (fullRun_p && debug_p) sendAction ("start", "debug=y");
	else if (fullRun_p && !debug_p) sendAction ("start", "");
	else if (!fullRun_p && debug_p) sendAction ("start", "dryRun=y&debug=y");
	else sendAction ("start", "dryRun=y");
}

function stopMbt () {
	sendAction ("stop", "");
}

function resumeMbt () {
	clearPaused();
	sendAction ("resume", "");
}



//process syn actions from the server
function refresh_exec() {
	sendAction("sync", "", function (actions_p) {
		if (actions_p.action==undefined || actions_p.action.length<=0) {
			return;
		}
		for (j=0; j<actions_p.action.length; j++) {
			if (actions_p.action[j].syncAction=="started") {
				modelObj.status = "exec";
				if (actions_p.action[j].value!="") alertDialog(actions_p.action[j].value);
			}
			else if (actions_p.action[j].syncAction=="paused") {
				modelObj.status = "paused";
				setPausedAt(actions_p.action[j]);
			}
			else if (actions_p.action[j].syncAction=="ended") {
				modelObj.status = "stopped";
				loadCurrentStat();
				alertDialog(translateMsg("mbt.exec.done", actions_p.action[j].value));
			}
			
			else if (actions_p.action[j].syncAction=="errored") {
				modelObj.status = "errored";
				alertDialog(translateMsg("mbt.exec.aborted", actions_p.action[j].value));
			}
			else if (actions_p.action[j].syncAction=="warning") {
				alertDialog(translateMsg("mbt.exec.warning", actions_p.action[j].value));
			}
			else if (actions_p.action[j].syncAction=="execstatus") {
				updateProgress(actions_p.action[j].value);
			}
			else if (actions_p.action[j].syncAction=="remotesessions") {
//				updateRemoteSessions(actions_p.action[j].value);
			}
		}
	});
}


//update the stat progress fields
function updateProgress(execStatus_p) {
	if (execStatus_p==undefined) {
		$(".execProgress").hide();
//		reset();
	}
	else {
		$("#endTime").text(execStatus_p.endTime);
		$("#startTime").text(execStatus_p.startTime);
		$("#exceptCount").text(execStatus_p.perfOverall.excepts.count);
		$("#elapseTime").text(execStatus_p.elapseTime);
		$("#remaining").text(execStatus_p.remainingTime);
		if (execStatus_p.remainingTime=="00:00:00") $("#remaining").hide();
		else $("#remaining").show();
		if (parseInt(execStatus_p.progressPcnt)>=0 && parseInt(execStatus_p.progressPcnt)<100) {
			$("#execProgressBar").progressBar(parseInt(execStatus_p.progressPcnt));
			$(".execProgress").show();
		}
		else {
			$("#execProgressBar").progressBar(100);
			$(".execProgress").hide();
		}
		$("#dryRunFlag").text(execStatus_p.dryRunFlag);
		if (execStatus_p.debugFlag) $("#debugFlag").text("(debug)");
		else $("#debugFlag").text("");
		$("#stateTraversal").text(execStatus_p.stateTraversal);
		$("#stateCovered").text(execStatus_p.stateCovered);
		$("#mStateCoverage").text(execStatus_p.stateCoverage + "%");
		$("#stateUncovered").text(execStatus_p.stateUncovered);
		$("#transTraversal").text(execStatus_p.transTraversal);
		$("#transCovered").text(execStatus_p.transCovered);
		$("#mTransCoverage").text(execStatus_p.transCoverage + "%");
		$("#transUncovered").text(execStatus_p.transUncovered);
		$("#mbtMode").text(execStatus_p.mbtMode);
		$("#numLoop").text(execStatus_p.numLoop);
		$("#numThread").text(execStatus_p.numThread);
		if (execStatus_p.execStatus=="UNKNOWN") $("#execStatus").text("");
		else $("#execStatus").text(translateMsg(execStatus_p.execStatus));
		if (execStatus_p.execStatus=="STARTED") modelObj.status = "exec";
		else if (execStatus_p.execStatus=="PAUSED") modelObj.status = "paused";
		
		$("#exceptCount").text(execStatus_p.execeptCount);
		
		$("#jvmStat").text(execStatus_p.memoryMax);
		$("#jvmMemBar").progressBar(parseInt(execStatus_p.memoryUsedPct));
		$("#activeThreads").text(execStatus_p.activeThreads);
		$("#stopTransCoverage").text(execStatus_p.stopTransCoverage);
		$("#stopTransCount").text(execStatus_p.stopTransCount);
		$("#stopElapseTime").text(execStatus_p.stopMinute);
	}
}

function updateNextUpdate(updateTime) {
	$("#updateTime").html(updateTime);
}


//pdaFiles.js

function click_fList() {
	if (fileList==null) reloadFileList();
}

function refresh_fList() {
	reloadFileList();
}

function reloadFileList () {
	$.getJSON(genUrl("mbtFileList", ""), function (data) {
//		if (actionCallback(data)) return;
		showFileList(data.modelList);
	});
}


var fileList = null;
function showFileList (fileList_p) {
	fileList = new Array();
	$("#filelist > *").remove();
	for (i in fileList_p) {
		var shadeClass="";
//		if (isShade(i)) shadeClass="shade";
		fileList[i] = fileList_p[i].fname;
		var trObj = "<tr id='" + i + "' class='clickable " + shadeClass + "'><td><span class='filename' id='" + fileList_p[i].fname + "_FN'>"+fileList_p[i].fname
				  +"</span></td><td class='dateModified full' nowrap><span class='filename'>"
				  +fileList_p[i].lastmodified
				  +"</span></td></tr>";
		$(trObj).appendTo($("#filelist"));
	}

	$("#fListDiv .clickable").click(function () {
		$("#fListDiv .clickable").removeClass("selected");
		$(this).addClass("selected");
		openFile($(this).attr("id"));
	});
	
	$(".full").hide();
}

function openFile(fileID_p) {

	$.getJSON(genUrl("open", "mbtfile="+fileList[fileID_p]), function (data) {
		if (actionCallback(data)) return;
		if (data.status && data.status=="ok") {
			$.getJSON(genUrl("getModelJson", ""), function(data) {
				if (actionCallback(data)) return;
				refreshModel(data);
				editProperty(modelObj, false, false);
			});
		}
	});
}

//pdaModel.js

function click_model() {

}

var curNodeData;

function getNodeLabel(nodeData_p) {
	var nodeLabel = nodeTypeLabelList [nodeData_p.typeCode];
	var retString = "<span class='clickable ";
	if (nodeData_p.typeCode=="state" && nodeData_p.submodel!="") retString = retString + "submodelicon";
	else retString = retString + "nodeicon";
	retString = retString + "'>" + nodeLabel + "</span>";
	return retString;
}

function getLabel(nodeData_p) {
	var labelText = "";
	if (nodeData_p.typeCode=="scxml") return nodeData_p.filename;
	else if (nodeData_p.typeCode=="mbt") return "Mode: " + nodeData_p.mode;
	else if (nodeData_p.typeCode=="state") return nodeData_p.stateid;
	else if (nodeData_p.typeCode=="transition") return nodeData_p.event + " &rarr; " + nodeData_p.target;
	else if (nodeData_p.typeCode=="usecase") return nodeData_p.usecasename;
	else if (nodeData_p.typeCode=="step") {
		var tempState = nodeDataList[nodeData_p.stateuid];
		var tempTrans = undefined;
		if (nodeData_p.transuid) tempTrans = nodeDataList[nodeData_p.transuid];
		if (tempTrans) {
			return tempState.stateid + ": " + tempTrans.event;
		}
		else {
			return tempState.stateid;
		}
	}
	return "???";
}

function refreshModel(jsonObj_p) {
	modelObj = jsonObj_p.model;
	
	var expandList = new Array();
	expandList[0] = modelObj;
	nodeDataList["mbt"] = modelObj.mbt;
	nodeDataList["scxml"] = modelObj;
	while (expandList.length>0) {
		expandList = loadSubStates(expandList);
	}
	
	$("#modelDiv ul>*").remove();
	addTreeNode("modelDiv", modelObj);
	$("#" + modelObj.uid +" .label:first").after(" <a href='app=webmbt&action=webmbtGraph&rand=" + Math.random() + "' id='modelGraph' target='_blank'>Graph</a> <a href='app=webmbt&action=mscriptGet&rand=" + Math.random() + "' id='modelMscript' target='_blank'>mScript</a><span id='scxmlPaused'></span>");
	
	modelObj.status = "";
	$("#"+modelObj.uid + " .expand:first").click();
	$("#model").click();
	
}


function loadSubStates (expandList_p) {
	var newExpandList = new Array();
	for (k=0; k<expandList_p.length; k++) {
		for (i=0; i<expandList_p[k].childrenStates.length; i++) {
			nodeDataList[expandList_p[k].childrenStates[i].uid] = expandList_p[k].childrenStates[i];
			expandList_p[k].childrenStates[i].parentuid = expandList_p[k].uid;
			for (j=0; j<expandList_p[k].childrenStates[i].transitions.length; j++) {
				nodeDataList[expandList_p[k].childrenStates[i].transitions[j].uid]= expandList_p[k].childrenStates[i].transitions[j];
				expandList_p[k].childrenStates[i].transitions[j].parentuid=expandList_p[k].childrenStates[i].uid;
			}
			if (expandList_p[k].childrenStates[i].childrenStates && expandList_p[k].childrenStates[i].childrenStates.length>0) {
				newExpandList[newExpandList.length] = expandList_p[k].childrenStates[i];
			}
		}
	}
	return newExpandList;
}

function expandTrunkNode(nodeDataObj_p) {
	var childrenNodeList;
	if (nodeDataObj_p.typeCode=="mbt") {
		childrenNodeList = nodeDataObj_p.usecases;
	}
	else if (nodeDataObj_p.typeCode=="usecase") {
		childrenNodeList = nodeDataObj_p.steps;
	}
	else if (nodeDataObj_p.typeCode=="scxml") {
		addTreeNode(modelObj.uid, modelObj.mbt);
		childrenNodeList = nodeDataObj_p.childrenStates;
	}
	else if (nodeDataObj_p.typeCode=="state") {
		for (var j in nodeDataObj_p.transitions) {
			if (nodeDataObj_p.transitions[j]) {
				addTreeNode(nodeDataObj_p.uid, nodeDataObj_p.transitions[j]);
			}
		}

		childrenNodeList = nodeDataObj_p.childrenStates;
	}
	
	for (var i in childrenNodeList) {
		if (childrenNodeList[i]) {
			addTreeNode(nodeDataObj_p.uid, childrenNodeList[i]);
		}
	}
}

function isTrunkNode(typeCode_p) {
	if (typeCode_p=="state" || typeCode_p=="mbt" || typeCode_p=="usecase" || typeCode_p=="scxml") return true;
	else return false;
}

function addTreeNode(parentUID_p, nodeDataObj_p) {
	nodeDataList[nodeDataObj_p.uid] = nodeDataObj_p;

	var trunkNodeInd = isTrunkNode(nodeDataObj_p.typeCode);
	var nodeImg = "&#8226;";
	var ulTag = "";
	var ctlTags = "";
	if (nodeDataObj_p.typeCode=="state" || nodeDataObj_p.typeCode=="transition") {
		ctlTags = "<span>I</span>"
				+ "<span>F</span>"
				+ "<span class='breakpoint ind'>b</span>"
				+ "<span class='paused ind'>Paused</span>";
	}
	else if (nodeDataObj_p.typeCode=="usecase" || nodeDataObj_p.typeCode=="step") {
		ctlTags = "<span class='disabled ind'>D</span>";
	}


	if (trunkNodeInd) {
		ulTag = "<ul></ul>";
		nodeImg = "+";
	}
	var htmlCode = "<li class='node "+nodeDataObj_p.typeCode+ "' id='"+nodeDataObj_p.uid
		+ "'><span class='expand clickable'>" + nodeImg + "&nbsp;</span><span class='label'>" 
		+ getNodeLabel(nodeDataObj_p) + " <span class='labeltext clickable'>" + getLabel(nodeDataObj_p)
		+ "</span>" + ctlTags + "</span>" + ulTag + "</li>";
	$(htmlCode).appendTo($("#"+parentUID_p +" ul:first"));
	if (trunkNodeInd) {
		$("#" + nodeDataObj_p.uid + " .expand").click(function () { 
			var uid=$(this).parent().attr("id");
			if ($(this).parent().find("ul:first").toggle().is(":visible")) {
				$(this).parent().find(".expand:first").html("&#8211;");
			}
			else {
				$(this).parent().find(".expand:first").html("+");
			}
		});
	}

	
	$("#" + nodeDataObj_p.uid + " .nodeicon").click(function() {
			$("#modelDiv li").removeClass("selectedNode");
			$(this).parent().parent().addClass("selectedNode");

			var uid = $(this).parent().parent().attr("id");
			curNodeData = nodeDataList[uid];
			editProperty(curNodeData, false, false);
			openMScript(curNodeData);
		});
 	
	$("#" + nodeDataObj_p.uid + " .labeltext").click(function() {
			$("#modelDiv li").removeClass("selectedNode");
			$(this).parent().parent().addClass("selectedNode");

			var uid = $(this).parent().parent().attr("id");
			curNodeData = nodeDataList[uid];
			editProperty(curNodeData, false, false);
			$("#mbtProp").click();
		});	
//	$("#" + nodeDataObj_p.uid + " .expand").hover(
//		function() {
//			$(".node.expand").removeClass("hoverOver");
//			$(this).addClass("hoverOver");
//		}, 
//		function() {
//			$(this).removeClass("hoverOver");
//		});	

	$("#" + nodeDataObj_p.uid + " .clickable").hover(
		function() {
			$("#modelDiv .clickable").removeClass("hoverOver");
			$(this).addClass("hoverOver");
		}, 
		function() {
			$(this).removeClass("hoverOver");
		});


	if (nodeDataObj_p.isinitial=="Y") {
		$("#" + nodeDataObj_p.uid + " .initial").show();
	}
	if (nodeDataObj_p.isfinal=="Y") {
		$("#" + nodeDataObj_p.uid + " .final").show();
	}

	if (nodeDataObj_p.breakpoint=="Y") {
		$("#" + nodeDataObj_p.uid + " .breakpoint").show();
	}
	
	if (nodeDataObj_p.disabled=="Y") {
		$("#" + nodeDataObj_p.uid +" .disabled").show();
	}
	
	$("#" + nodeDataObj_p.uid + " .label");
	
	if (trunkNodeInd) expandTrunkNode(nodeDataObj_p);
}



//updates the tree with the node data change
function updateNode (nodeData_p) {
	$("#"+nodeData_p.uid +" .labeltext").html(getLabel(nodeData_p));
	if (nodeData_p.isinitial=="Y") {
		$("#"+nodeData_p.uid + " .initialstate").show();
	}
	else {
		$("#"+nodeData_p.uid + " .initialstate").hide();
	}
	if (nodeData_p.isfinal=="Y") {
		$("#"+nodeData_p.uid + " .finalstate").show();
	}
	else {
		$("#"+nodeData_p.uid + " .finalstate").hide();
	}
}

//pdaProp.js

var curNodeData;

var formChanged;
var nodeDataParam;
var assignDefaultParam;
var readonlyParam;

function reset_prop() {
	$("#property tr").remove();
}

function click_mbtProp() {
}

function refresh_mbtProp() {

}





$(document).ready(function(){
	var edition;
});




function setFormChanged(changed_p) {
	if (changed_p) {
		formChanged = true;
		$("#mbtPropDiv button").attr("disabled", false);
	}
	else {
		formChanged = undefined;
		$("#mbtPropDiv button").attr("disabled", true);
	}
}

function propCancel() {
	setFormChanged(false);
	editPropertyInternal (curNodeData, assignDefaultParam, readonlyParam);
}



function editProperty(nodeData_p, assignDefault_p, readonly_p) {

	curNodeData = nodeData_p;
	assignDefaultParam = assignDefault_p;
	readonlyParam = readonly_p;
	if (formChanged) {
		parent.confirmDialog("change.ok2discard", propCancel);
	}
	else {
		editPropertyInternal (nodeData_p, assignDefault_p, readonly_p);
		setFormChanged(false);
		$("#mbtPropDiv button").show();
		if (nodeData_p.typeCode=="config") $("#propOk").hide();
		else $("#configSave").hide();
		
	}
}


function editPropertyInternal(nodeData_p, assignDefault_p, readonly_p) {
	reset_prop();
	var propObj = resolveMsg(nodeData_p.typeCode);
	
	$("#propertyType").text(propObj.code);
	$("#propertyLabel").text(getPropertyLabel(nodeData_p));
	$("#uid").text(nodeData_p.uid);

	curNodeData = nodeData_p;
//	setPropertyTitle (curNodeData.typeCode);
//	if (nodeData_p.uid==undefined) formChanged = true;
	var firstEditable = true;
	var focusField;
	var idx2 = 0;
	var shadeClass = "";
	if (nodeData_p.readOnly=="Y") readonly_p = true;
	
	for(prop in nodeData_p) {
		var editCheck = editAttr[curNodeData.typeCode+"."+prop];
		var curValue = curNodeData[prop];
		var propLabel = prop;
		propObj = resolveMsg(prop);
		var propTitle = "";
		if (propObj!=undefined) {
			propTitle = propObj.desc;
			propLabel = propObj.code;
		}
		
		if (editCheck) {
			if (isShade(idx2)) shadeClass = "shade";
			else shadeClass = "";
			idx2=idx2+1;

			if (editCheck.edit==editable) {
				if (assignDefault_p && (nodeData_p.uid==undefined || nodeData_p.uid<=0 || curValue==undefined || curValue=="")) {
					curValue = editCheck.defaultvalue;
				}
				if (curValue==undefined) curValue = "";
				if (editCheck.required) {
					propLabel += "*";
				}
				
				var readonlyTag = "";
				if (readonly_p) readonlyTag = "readonly";
				
				if (editCheck.type=="textarea") {
					$("#property").append("<tr class='"+shadeClass+"'><td valign='top' title='"+propTitle+"'>"+propLabel+"</td><td valign='top'><textarea rows='5' " + readonlyTag + " class='"+curNodeData.typeCode+"' id="+prop+">"+curValue+"</textarea></td></tr>");
				}
				else if (editCheck.domainQuery==undefined || readonlyTag!="") {
					$("#property").append("<tr class='"+shadeClass+"'><td title='"+propTitle+"'>"+propLabel+"</td><td><input " + readonlyTag + " class='"+curNodeData.typeCode+"' id="+prop+" type=text value=\""+curValue+"\"/></td></tr>");
				}
				else {
					$("#property").append("<tr class='"+shadeClass+"'><td title='"+propTitle+"'>"+propLabel+"</td><td><select " + readonlyTag + " class='"+curNodeData.typeCode+"' id="+prop+" value=\""+curValue+"\"/></td></tr>");
					var valList = editCheck.domainQuery();
					
// TODO:					$("#thread").removeOption(/./).addOption(valList, false).sortOptions(true);

					
					if (editCheck.required==undefined) {
						$("#"+prop).append("<option value=''></option>");
					}
					var classTag="";
					var disabledStr = "";
					var separatorFound=false;
					for (d in valList) {
						if (valList[d]!=undefined) {
							var selected="";
							if (valList[d].code!="" && valList[d].code==curValue) selected = "selected";
							else selected = "";
							disabledStr = "";
							
							if (separatorFound) {
								if ((valList[d].desc+" ").indexOf("--")==0) {
									disabledStr = "disabled='disabled'";
									if (classTag=="") classTag="class='shade'";
									else classTag = "";
								}
							}
							else {
//								if (isShade(d)) classTag = "class='shade'";
								classTag = "";
							}
							
							$("#"+prop).append("<option "+classTag+" value='"+valList[d].code+"' " + selected + " " + disabledStr + ">"+valList[d].desc+"</option>");
						}
					}
					
					
				}
				
				if (!readonly_p) {
				
					if (editCheck.required) {
						$("#"+prop).blur(function() {
							if ($(this).val()==undefined || $(this).val()=="") {
								alertDialog(translateMsg("field.required", translateMsg($(this).parent().prev("td").text())));
							}
						});
					}
					
					$("#"+prop).change(function() {
						var thisValue = $(this).val();
						if (thisValue.indexOf("\"")>=0) {
							alertDialog(translateMsg("char.not.allowed", "&quot;"));
							return;
						}
						
						if (thisValue==undefined) return;
	
						// custom edit check
						var f = getEditCheck($(this), "customCheck");
						if (f && !f()) return;
						
						var excludeQuery = getEditCheck($(this), "excludeQuery");
						if (excludeQuery==undefined) return;
						var excludes = excludeQueryList[excludeQuery]
						if(excludes==undefined) return;
						for (k in excludes) {
							if (thisValue.indexOf(excludes[k])>=0) {
								alertDialog(translateMsg("field.not2contain", translateMsg($(this).parent().prev("td").text()), excludes[k]));
							}
						}
					});
	
					if (editCheck.min) {
						$("#"+prop).change(function() {
							if ($(this).val()=="") return;
							if (parseInt($(this).val()) != $(this).val()) {
								alertDialog(translateMsg("field.value.not.numeric", $(this).val()));					
							}
							var checkValue = getEditCheck($(this), "min");
							if (parseInt($(this).val())<checkValue) {
								alertDialog(translateMsg("field.value.min", translateMsg($(this).parent().prev("td").text()), checkValue));
							}
						});
					}
					if (editCheck.max) {
						$("#"+prop).change(function() {
							if ($(this).val()=="") return;
							if (parseInt($(this).val()) != $(this).val()) {
								alertDialog(translateMsg("field.value.not.numeric", $(this).val()));					
							}
							var checkValue = getEditCheck($(this), "max");
							if (parseInt($(this).val())>checkValue) {
								alertDialog(translateMsg("field.value.max", translateMsg($(this).parent().prev("td").text()), checkValue));
							}
						});
					}
					$("#"+prop).change(function() {
						setFormChanged(true);
					});
				}
				if (firstEditable) {
					focusField = prop;
					firstEditable = false;
				}
			}
			else {
				$("#property").append("<tr class='"+shadeClass+"'><td valign='top' title='"+propTitle+"'>"+propLabel+"</td><td><span id='" + prop + "'>"+translateMsg(curNodeData[prop])+"</span></td></tr>");
			}
		}
		
		
	} // for 
	
	if (nodeData_p.typeCode=="scxml" && nodeData_p.filename==undefined || nodeData_p.filename=="") {
		formChanged = true;
		$("#filename").focus();
	}

	if (nodeData_p.typeCode=="scxml") {
			$("#javaclass").parent().append("<a href='app=webmbt&action=genJava' target=_blank title='Generate a skeleton java code from the model.'>generate</a>");
	}
	
	if (nodeData_p.typeCode=="transition" && nodeData_p.dataset && nodeData_p.dataset!="") {
		$("#dataset").parent().append("&nbsp;&nbsp;<a href='webmbtDataSet.html' target=_MbtDDT title='Edit data set'>Edit&nbsp;DataSet</a>");
	}

	initOrient();
//	if (focusField!=undefined) document.getElementById(focusField).focus();
}


function propSave() {
	for(prop in curNodeData) {
		var editCheck = editAttr[curNodeData.typeCode+"."+prop];
		if (editCheck && editCheck.edit == editable) {
			curNodeData[prop] = $("#"+prop).val();
//			parent.alertDialog("changing: " + prop + " to value: " + $("#"+prop).val());
		}
	}
}

function configSave () {
	propSave();
	saveConfig();
	setFormChanged(false);
}

function propOk () {
	propSave();
	saveProperty (curNodeData);
	setFormChanged(false);
	if (curNodeData.uid==undefined && curNodeData.typeCode=="state") {
		addDomainValue("state.id", curNodeData.stateid);
	}
}




//saves the property changes
function saveProperty (nodeData_p) {
	if (nodeData_p.uid==undefined || nodeData_p.uid=="") {
		postAction ("addNode", nodeData_p, function (retMsg_p) {
			data = eval("data="+retMsg_p);
			if (actionCallback(data)) return;
			addNodes(data.addnodes.nodelist); 
			});
	}
	else {
		postAction ("updateNode", nodeData_p);
		updateNode(nodeData_p);
	}
}

function getEditCheck(field_p, prop_p) {
	var editCheck = editAttr[curNodeData.typeCode+"."+$(field_p).attr("id")];
	if (editCheck) return editCheck[prop_p];
	else return $(field_p).val();
}

// custom edit check functions
function editCheckFilename () {
	var filename = $("#filename").val();
	var idx = filename.lastIndexOf(".scxml");
	if (idx>0) {
		filename = filename.substring(0,idx);
			$("#filename").val(filename);
	}
	if (filename.indexOf("/")>=0 || filename.indexOf("\\")>=0) {
		alertDialog ("file.name.illegal.char");
		return false;
	}
	else {
		return true;
	}
}

//custom edit check functions
function editCheckStateID () {
	var stateid = $("#stateid").val().toUpperCase();
	if (stateid=="GRAPH" || stateid.indexOf(" ")>=0 || stateid.indexOf("-")>=0) {
		alertDialog("stateid.illegal");
		return false;
	}
	else return true;
}

function validateJavaClass() {
	if (formChanged) {
		alertDialog("change.save.first");
		return;
	}
	
	sendAction("validateJava", "", function(data) { 
		if (actionCallback(data)) return;
		alertDialog(data.validateJava);
	});
}

//propert attributes
var editable = 1;
var readonly = 2;
var editAttr = new Array()

editAttr ["scxml.filename"] = {"edit": readonly, "customCheck": editCheckFilename, "restriction": "devOnly" };
editAttr ["scxml.desc"] = {"edit": editable, "required": true, "type": "textarea", "restriction": "devOnly" };
editAttr ["scxml.uid"] = {"edit": readonly };
editAttr ["scxml.backupDate"] = {"edit": readonly };
editAttr ["scxml.color"] = { "edit": editable, "domainQuery": graphColorListQuery };
editAttr ["scxml.graphlayout"] = {"edit": editable, "required": true, "domainQuery": mbtGraphLayoutQuery };
editAttr ["scxml.maxhistorystat"] = {"edit": editable, "min": 0, "max": 5 };
editAttr ["scxml.maxhistorystatE"] = {"edit": editable, "min": 0 };
editAttr ["scxml.maxtranslog"] = {"edit": editable, "min": 0 };
editAttr ["scxml.authusers"] = {"edit": editable };
editAttr ["scxml.actiondelaymillis"] = {"edit": editable, "min": 0, "max": 300000 };
editAttr ["scxml.javaclass"] = {"edit": editable, "restriction": "devOnly" };
editAttr ["scxml.browserversionid"] = {"edit": editable, "domainQuery": browserTypeListQuery };
editAttr ["scxml.archiveDate"] = {"edit": readonly };
editAttr ["scxml.archiveVersionLabel"] = {"edit": readonly };
editAttr ["scxml.refModelList"] = {"edit": readonly };
//editAttr ["scxml.expandSubmodel"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery };

editAttr ["scxml.url"] = {"edit": editable };
editAttr ["scxml.pluginID"] = {"edit": editable, "optional": true, "domainQuery": pluginListQuery };
editAttr ["state.uid"] = {"edit": readonly };
editAttr ["state.stateid"] = {"edit": editable, "required": true, "customCheck": editCheckStateID, "restriction": "devOnly" };
editAttr ["state.isinitial"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": "devOnly" };
editAttr ["state.isfinal"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": "devOnly" };
editAttr ["state.desc"] = {"edit": editable, "required": true, "type": "textarea", "restriction": "devOnly" };
editAttr ["state.color"] = { "edit": editable, "domainQuery": graphColorListQuery };
editAttr ["state.stateurl"] = {"edit": editable, "required": false };
editAttr ["state.submodel"] = {"edit": editable, "domainQuery": subModelListQuery, "restriction": "devOnly" };
editAttr ["transition.uid"] = {"edit": readonly };
editAttr ["transition.event"] = {"edit": editable, "required": true, "restriction": "devOnly" };
editAttr ["transition.target"] = {"edit": editable, "required": true, "domainQuery": stateQuery, "restriction": "devOnly" };
editAttr ["transition.weight"] = {"edit": editable, "defaultvalue": 5, "domainQuery": transWeightQuery };
editAttr ["transition.traverses"] = {"edit": editable, "required": true, "defaultvalue": 1, "min": 0, "max": 100 };
editAttr ["transition.maxmillis"] = {"edit": editable, "min": 0, "max": 300000 };
editAttr ["transition.actiondelaymillis"] = {"edit": editable, "min": 0, "max": 300000 };
editAttr ["transition.desc"] = {"edit": editable, "required": true, "type":"textarea", "restriction": "devOnly" };
editAttr ["transition.color"] = { "edit": editable, "domainQuery": graphColorListQuery };
editAttr ["transition.url"] = { "edit": editable, "restriction": "devOnly"  };
//editAttr ["transition.submodelFinalState"] = { "edit": editable, "restriction": "devOnly"  };
editAttr ["transition.dataset"] = { "edit": editable, "restriction": "devOnly" };
editAttr ["mbt.execnum"] = {"edit": editable, "min": 1 };
editAttr ["mbt.execthreadnum"] = {"edit": editable, "min": 1, "max": 2};
editAttr ["mbt.execthreadnumE"] = {"edit": editable, "min": 1};
editAttr ["mbt.mode"] = {"edit": editable, "required": true, "defaultvalue": "optimalSequence", "domainQuery": mbtModeQuery };
editAttr ["mbt.coverageType"] = {"edit": editable, "required": true, "defaultvalue": "alltrans", "domainQuery": coverageTypeQuery };
editAttr ["mbt.seed"] = {"edit": editable, "min": 0, "max": 99999999 };
editAttr ["mbt.stopcoverage"] = {"edit": editable, "required": false, "max": 100, "domainQuery": mbtStopcoverageQuery };
editAttr ["mbt.stopcount"] = {"edit": editable, "min": 1 };
editAttr ["mbt.stoptime"] = {"edit": editable, "min": 1 };
editAttr ["mbt.uid"] = {"edit": readonly };
editAttr ["config.adminusers"] = {"edit": editable };
editAttr ["config.authclass"] = {"edit": editable };
editAttr ["config.authrealm"] = {"edit": editable };
editAttr ["config.licenseexception"] = {"edit": readonly };
editAttr ["config.alert"] = {"edit": readonly };
editAttr ["config.hideDemoApps"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery };
editAttr ["config.osName"] = {"edit": readonly };
editAttr ["config.osVersion"] = {"edit": readonly };
editAttr ["config.javaVersion"] = {"edit": readonly };
editAttr ["config.plugins"] = {"edit": editable, "type": "textarea" };
editAttr ["config.TestOptimalVersion"] = {"edit": readonly };
editAttr ["config.hostport"] = {"edit": readonly };
editAttr ["config.email"] = {"edit": editable, "required": true };
editAttr ["config.licensekey"] = {"edit": editable, "required": true };
editAttr ["config.expirationdate"] = {"edit": readonly };
editAttr ["config.exceptions"] = {"edit": readonly };
editAttr ["config.prodlevel"] = {"edit": readonly };
editAttr ["config.sessionnum"] = {"edit": readonly };

editAttr ["usecase.uid"] = {"edit": readonly };
editAttr ["usecase.usecasename"] = {"edit": editable, "required": true };
editAttr ["usecase.desc"] = {"edit": editable, "required": true, "type": "textarea" };
editAttr ["usecase.numexec"] = {"edit": editable, "min": 1 };
editAttr ["usecase.color"] = { "edit": editable, "domainQuery": graphColorListQuery };
editAttr ["step.uid"] = {"edit": readonly };
editAttr ["step.state"] = {"edit": readonly };
editAttr ["step.event"] = {"edit": readonly };
editAttr ["step.desc"] = {"edit": editable, "required": true, "type": "textarea" };


function getEditCheck(name_p) {
	var eCheck = editAttr[name_p];
	if (eCheck==undefined) return eCheck;
	if (readonlyParam || parent.edition=="Runtime" && eCheck.restriction=="devOnly") {
		eCheck.edit = readonly;
	}
	return eCheck;
}


function CodeDesc (code_p, desc_p) {
	this.code = code_p;
	this.desc = desc_p;
}


//returns the list of states for dropdown field
function stateQuery () {
	var retList = new Array();
	for (i in nodeDataList) {
		var tempNodeData = nodeDataList[i];
		if (tempNodeData && tempNodeData.typeCode=="state" &&
			tempNodeData.uid && tempNodeData.parentuid && tempNodeData.readOnly=="N") {
			var tempVal = new CodeDesc();
			tempVal.code = tempNodeData.stateid;
			tempVal.desc = tempNodeData.stateid;
			retList[retList.length] = tempVal;
		}
	}
	return retList.sort(compCodeDesc);
}

function subModelListQuery () {
	return subModelList;

}


function compCodeDesc(code1, code2) {
	if (code1.desc.toUpperCase()>code2.desc.toUpperCase()) return 1;
	else return -11;
}

var mbtStopcoverageList = [
   			{"code": 0, "desc": "" }, 
			{"code": 10, "desc": "10%" }, 
			{"code": 20, "desc": "20%" }, 
			{"code": 25, "desc": "25%" }, 
			{"code": 30, "desc": "30%" }, 
			{"code": 40, "desc": "40%" }, 
			{"code": 50, "desc": "50%" }, 
			{"code": 60, "desc": "60%" }, 
			{"code": 70, "desc": "70%" },
			{"code": 75, "desc": "75%" },
			{"code": 80, "desc": "80%" },
			{"code": 85, "desc": "85%" },
			{"code": 90, "desc": "90%" },
			{"code": 95, "desc": "95%" },
			{"code": 100, "desc": "100%" }];
function mbtStopcoverageQuery () {
	return mbtStopcoverageList;
}

var coverageTypeList = [
                        {"code": "alltrans", "desc": "Transition"}, 
                        {"code": "allpaths", "desc": "Paths"}
                     ];

function coverageTypeQuery () {
	return coverageTypeList;
}

var browserTypeList = [
  			{"code": "iexplore_6", "desc": "IExplore 6"}, 
  			{"code": "iexplore_7", "desc": "IExplore 7"}, 
  			{"code": "firefox_2", "desc": "FireFox 2"}, 
  			{"code": "firefox_3", "desc": "FireFox 3"}, 
  			{"code": "chrome", "desc": "FireFox Chrome"}, 
  			{"code": "safari", "desc": "Safari"}, 
  			{"code": "opera", "desc": "Opera"}, 
  			{"code": "konqueror", "desc": "Konqueror"}, 
  			{"code": "custom", "desc": "Custom"}];

           			
function browserTypeListQuery () {
	return browserTypeList;
}

var transWeightList = [
			{"code": 1, "desc": 1}, 
			{"code": 2, "desc": 2}, 
			{"code": 3, "desc": 3}, 
			{"code": 4, "desc": 4}, 
			{"code": 5, "desc": 5}, 
			{"code": 6, "desc": 6}, 
			{"code": 7, "desc": 7}, 
			{"code": 8, "desc": 8},
			{"code": 9, "desc": 9},
			{"code": 10, "desc": 10}];
function transWeightQuery () {
	return transWeightList;
}

var yesNoList = [{"code": "Y", "desc": "Y"},
                 {"code": "N", "desc": "N"}];
function yesNoQuery () {
	return yesNoList;
}


function pluginListQuery () {
	return pluginList;
}


var enableDisableList = [{"code": "Y", "desc": "Enabled"},
                         {"code": "N", "desc": "Disabled"}];

function enableDisableQuery () {
	return enableDisableList;
}

var graphLayoutList = [
             {"code": "LR", "desc": "Left->Right"},
             {"code": "TB", "desc": "Top->Bottom"} ];
// x11 color scheme                       
var graphColorList = [
     {"code": "", "desc": "--Whites--"},
     {"code": "antiquewhite", "desc": "antiquewhite"},
     {"code": "azure", "desc": "azure"},
     {"code": "bisque", "desc": "bisque"},

     {"code": "", "desc": "--Greys--"},
     {"code": "black", "desc": "black"},
     {"code": "darkslategray", "desc": "darkslategray"},
     {"code": "dimgray", "desc": "dimgray"},
     {"code": "gray", "desc": "gray"},
     
     {"code": "", "desc": "--Reds--"},
     {"code": "crimson", "desc": "crimson"},
     {"code": "deeppink", "desc": "deeppink"},
     {"code": "firebrick", "desc": "firebrick"},
     {"code": "hotpink", "desc": "hotpink"},
     {"code": "lightcoral", "desc": "lightcoral"},
     {"code": "pink", "desc": "pink"},
     {"code": "red", "desc": "red"},
     {"code": "salmon", "desc": "salmon"},
     {"code": "tomato", "desc": "tomato"},
     
     {"code": "", "desc": "--Browns--"},
     {"code": "brown", "desc": "brown"},
     {"code": "burlywood", "desc": "burlywood"},
     {"code": "chocolate", "desc": "chocolate"},
     {"code": "rosybrown", "desc": "rosybrown"},
     {"code": "saddlebrown", "desc": "saddlebrown"},
     {"code": "sandybrown", "desc": "sandybrown"},
     {"code": "tan", "desc": "tan"},
     
     {"code": "", "desc": "--Oranges--"},
     {"code": "darkorange", "desc": "darkorange"},
     {"code": "orange", "desc": "orange"},
     {"code": "orangered", "desc": "orangered"},
     
     {"code": "", "desc": "--Yellows--"},
     {"code": "gold", "desc": "gold"},
     {"code": "yellow", "desc": "yellow"},
     
     {"code": "", "desc": "--Greens--"},
     {"code": "chartreuse", "desc": "chartreuse"},
     {"code": "darkgreen", "desc": "darkgreen"},
     {"code": "darkolivegreen", "desc": "darkolivegreen"},
     {"code": "darkseagreen", "desc": "darkseagreen"},
     {"code": "forestgreen", "desc": "forestgreen"},
     {"code": "lawngreen", "desc": "lawngreen"},
     {"code": "yellowgreen", "desc": "yellowgreen"},

     {"code": "", "desc": "--Cyans--"},
     {"code": "aquamarine", "desc": "aquamarine"},
     {"code": "cyan", "desc": "cyan"},
     {"code": "turquoise", "desc": "turquoise"},
     
     {"code": "", "desc": "--Blues--"},
     {"code": "blue", "desc": "blue"},
     {"code": "cadetblue", "desc": "cadetblue"},
     {"code": "cornflowerblue", "desc": "cornflowerblue"},
     {"code": "darkslateblue", "desc": "darkslateblue"},
     {"code": "indigo", "desc": "indigo"},
     {"code": "midnightblue", "desc": "midnightblue"},
     {"code": "royalblue", "desc": "royalblue"},
     
     {"code": "", "desc": "--Magentas--"},
     {"code": "blueviolet", "desc": "blueviolet"},
     {"code": "darkorchid", "desc": "darkorchid"},
     {"code": "orchid", "desc": "orchid"},
     {"code": "purple", "desc": "purple"},
     {"code": "violet", "desc": "violet"}
     
     ];

function graphColorListQuery () {
	return graphColorList;
}


var mbtModeList = [
          {"code": "optimalSequence", "desc": "optimalSequence"}, 
          {"code": "randomSequence", "desc": "randomSequence"}, 
          {"code": "greedySequence", "desc": "greedySequence"},
          {"code": "mCaseSerial", "desc": "mCaseSerial"},
          {"code": "mCaseOptimal", "desc": "mCaseOptimal"}];
function mbtModeQuery () {
	return mbtModeList;
}

function mbtGraphLayoutQuery () {
	return graphLayoutList;
}



function getPropertyLabel (nodeData_p) {
	var labelText = "";
	if (nodeData_p.typeCode=="state") {
		labelText = nodeData_p.stateid;
	}
	else if (nodeData_p.typeCode=="transition") labelText = nodeData_p.event + " --> " + nodeData_p.target;
	else if (nodeData_p.typeCode=="usecase") labelText = nodeData_p.usecasename;
	else if (nodeData_p.typeCode=="step") {
		var tempTrans = nodeDataList[nodeData_p.transuid];
		if (tempTrans) {
			var tempState = nodeDataList[tempTrans.parentuid];
			if (tempState) {
				labelText = tempState.stateid + "." + tempTrans.event;
			}
			else {
				labelText = tempState.stateid;
			}
		}
	}
	return labelText;
}


function setBackupDate() {
	var newBackupDate = (new Date()).toLocaleString();
	$("#backupDate").text(newBackupDate);
	 nodeDataList["scxml"].backupDate = newBackupDate;
}


// adon methods
function setProperty(fieldName_p, fieldValue_p) {
	$("#" + fieldName_p).val(fieldValue_p);
}

function getCurTrans() {
	return curNodeData;
}

function getCurState() {
	return nodeDataList[curNodeData.parentuid];
}

function getModelName() {
	return nodeDataList["scxml"].filename;
}

//pdaSeqLog.js

var exceptionList;
// var threadList;
var threadSelected;
var stateTransSelected;

function click_seqLog() {
//	alert("clicked seqLog");
}

function reset () {
	$("#mbttrans > *").remove();
}

function refresh_seqLog() {
	sendAction("getMbtTrans", "", function (data) {
		if (actionCallback(data)) return;
		setMbtTrans(data.mbttrans);
	});
}


function setMbtTrans (mbttrans) {
//	threadList = new Array();
	exceptionList = new Array();
	threadSelected = "ALL";
	stateTransSelected = "ALL";
	$("#transLogSize").text(nodeDataList["scxml"].maxtranslog);
	
	var threadList = new Array();
	
	reset();
	$("#seqLogDiv .typeFilter").change(function() {
		filterType($(this).find("option:selected").val());
	});

	if (mbttrans==undefined) return;
	var mbttransTable = $("#mbttrans");
	var idx2=0;
	var htmlCode="<option value='ALL'></option>";
	var curTime = "";
	for (i=0; i<mbttrans.length; i++) {
		var suffix = "";
		if (mbttrans[i].timestamp.substring(0,5)!=curTime) {
			curTime = mbttrans[i].timestamp.substring(0,5);
			var transNode = $("<tr class='time' style='border-top:1px dashed white'><td align=left colspan=4>" + curTime + "</td></tr>").appendTo(mbttransTable);
			
		} 

		if (mbttrans[i].errMsg!="") {
			exceptionList[i] = mbttrans[i].errMsg;
			var transNode = $("<tr class='"+mbttrans[i].type+"' onclick='javascript:alertDialog(exceptionList["+i+"]);'><td align=left>&nbsp;"+mbttrans[i].timestamp.substring(6) + "</td><td align=center class=wide>" 
					+ "t"+mbttrans[i].threadid + "</td><td align=left>"
					+ mbttrans[i].type.substring(0,5) + "</td><td align=center>"+getLogDesc(mbttrans[i].uid) + suffix + "</td></tr>").appendTo(mbttransTable);
			$(transNode).addClass("exception");
		}
		else {
			var transNode = $("<tr class='"+mbttrans[i].type+"'><td align=left>&nbsp;"+mbttrans[i].timestamp.substring(6) + "</td><td align=center class=wide>" 
					+ "t"+mbttrans[i].threadid + "</td><td align=center>"
					+ mbttrans[i].type.substring(0,5) + "</td><td align=left>"+getLogDesc(mbttrans[i].uid) + suffix + "</td></tr>").appendTo(mbttransTable);
		}
		$(transNode).addClass("thread-"+mbttrans[i].threadid);
		if (threadList[mbttrans[i].threadid]==undefined) {
			threadList[mbttrans[i].threadid]=true;
			htmlCode = htmlCode + "<option value='" + mbttrans[i].threadid + "'>t" + mbttrans[i].threadid + "</option>";
		}
		if (isShade(idx2)) {
			$(transNode).addClass("shade");
		}
		idx2=idx2+1;

	}

	
	
//	$("#thread").removeOption(/./).addOption(threadList, false).sortOptions(true);
	$(htmlCode).appendTo($("#thread"));
	
	return;
}

function getDispTime(time_p) {
	return time_p.substring(6);
}

function getLogDesc(uid_p) {
	var nodeData = nodeDataList[uid_p];
	if (nodeData==undefined) return "unknown("+uid_p+")";
	if (nodeData.typeCode=="state") return nodeData.stateid;
	if (nodeData.typeCode=="transition") {
		var parentState = nodeDataList[nodeData.parentuid];
		return parentState.stateid + ": " + nodeData.event;
	}
	return "unknown("+uid_p+")";
	
}



function filterType(filter_p) {
	stateTransSelected = filter_p;

	filterRows();
}

function filterThread(filter_p) {
	threadSelected = filter_p;
	filterRows();
}

function filterRows () {
	$("#mbttrans tr").show();
	if (threadSelected!="ALL") $("#mbttrans tr").not(".thread-"+threadSelected).hide();
	if (stateTransSelected=="stateOnly") $("#mbttrans tr").not(".State").hide();
	else if (stateTransSelected=="transOnly") $("#mbttrans tr").not(".Transition").hide();
	return;
}

function openTravGraph() {
	window.open('app=webmbt&action=traversalGraph&mode=Log&threadId='+threadSelected);
}

//pdaStats.js

var statID=-1;
var LmsgList = new Array();

function click_stats() {

}


function refresh_stats() {
	loadStat(statID);
}


// retrieve current mbt stat
function loadCurrentStat() {
	loadStat(-1);
}

function loadStat (statID_p) {
	sendAction("mbtStatsList", "cmd=getStats&execID=" + statID_p, function(data) { 
		if (actionCallback(data)) return;
		setStat(data.mbtstat);
	});
}

function formatDelta (fieldID_p, actualNum_p, averageNum_p, alertUp_p) {
	var changeDir = parseInt(actualNum_p) - parseInt(averageNum_p);
	var upClass = 'alert';
	var downClass = 'normal'
	if (!alertUp_p) {
		upClass = 'normal';
		downClass = 'alert';
	}
	var labelText = actualNum_p;
	if (changeDir>0) labelText = actualNum_p + "<span class='"+upClass+"'>&uarr;</span>";
	else if (changeDir<0) labelText = actualNum_p + "<span class='"+downClass+"'>&darr;</span>";

	$(fieldID_p).html(labelText);
//    			.attr("title", "Average is " + averageNum_p);
}

function setSummary(statObj_p) {
	
	if (statObj_p.statid<0) $("#statDesc").text("Current MBT Execution");
	else $("#statDesc").text("Past MBT Execution: " + statObj_p.statDesc);
	
	$("#statsDiv .browser").text(statObj_p.browser);
	$("#statsDiv .plugins").text(statObj_p.plugin);

	$("#statsDiv .mbtMode").text(statObj_p.mbtMode);
	$("#statsDiv .numLoop").text(statObj_p.numLoop);
	$("#statsDiv .numThread").text(statObj_p.numThread);
	
	$("#statsDiv .startTime").text(statObj_p.startTime);
	$("#statsDiv .endTime").text(statObj_p.endTime);
	$("#statsDiv .elapseTime").text(statObj_p.elapseTime);
	
	$("#statsDiv .stateCoverageBar").progressBar(parseInt(statObj_p.stateCoverage));
//	  					  .attr("title", "Average is " + statObj_p.stateCoverageAvg);
	var diff = parseInt(statObj_p.stateCoverage) - parseInt(statObj_p.stateCoverageAvg);
	if (diff>0) {
		$("#statsDiv .stateCoverageDir").html("<span class='normal'>&uarr;</span>");
	}
	else if (diff<0) {
		$("#statsDiv .stateCoverageDir").html("<span class='alert'>&darr;</span>");
	}
	formatDelta("#statsDiv .stateTraversal", statObj_p.stateTraversal, statObj_p.stateTraversalTotalAvg, true);
	formatDelta("#statsDiv .stateCovered", statObj_p.stateCovered, statObj_p.stateCoveredAvg, false);
	$("#statsDiv .stateUncovered").text(parseInt(statObj_p.stateCount) - parseInt(statObj_p.stateCovered));

	$("#statsDiv .transCoverageBar").progressBar(parseInt(statObj_p.transCoverage));
//						  .attr("title", "Average is " + statObj_p.transCoverageAvg);
	diff = parseInt(statObj_p.transCoverage) - parseInt(statObj_p.transCoverageAvg);

	$("#statsDiv .stateCoveragePct").html(statObj_p.stateCoverage);
	$("#statsDiv .transCoveragePct").html(statObj_p.transCoverage);

	if (diff > 0) {
		$("#transCoverageDir").html("<span class='normal'>&uarr;</span>");
	}
	else if (diff < 0){
		$("#transCoverageDir").html("<span class='alert'>&darr;</span>");
	}
	formatDelta("#statsDiv .transTraversal", statObj_p.transTraversal, statObj_p.transTraversalAvg, true);
	formatDelta("#statsDiv .transCovered", statObj_p.transCovered, statObj_p.transCoveredAvg, false);
	$("#statsDiv .transUncovered").text(parseInt(statObj_p.transCount) - parseInt(statObj_p.transCovered));
	
	formatDelta("#statsDiv .exceptCount", statObj_p.exceptCount, statObj_p.exceptCountAvg, true);
}

// sets the stat into the display
var stat_i;
function setStat (statObj_p) {
	setSummary(statObj_p);
	
	var mbtObj = nodeDataList["mbt"];
	$("#mode").text(mbtObj.mode);
	if (statObj_p==undefined || statObj_p.update==undefined) {
		$("#statetransstats tr").not(".header").remove();
	}
	if (statObj_p==undefined) return;

	statID = statObj_p.statid;
	if (statID=="-1") {
		$(".current").show();
		$(".hist").hide();
	}
	else {
		$(".current").hide();
		$(".hist").show();
	}

	var mbtstatlist = $("#statetransstats"); 

	// create nonTraversal row
	var htmlCode = "<tr id='nonTraversal' class='shade' width='100%'><td align='left' class=sampleSize>Other Exceptions</td>";
	htmlCode += "<td align='center' class='sampleSize'>"+ statObj_p.sysExceptCount + "</td>" 
			+ "<td class='allExp'>&nbsp</td>";
	htmlCode += "<td class='wide' align='center'><span class='L1'>&nbsp;</span></td>"
		+"<td class='wide' align='center'><span class='L2'>&nbsp;</span></td>"
		+"<td class='wide' align='center'><span class='L3'>&nbsp;</span></td>"
		+"<td class='wide' align='center'><span class='L4'>&nbsp;</span></td>"
		+"<td class='wide' align='center'><span class='L5'>&nbsp;</span></td>";
	htmlCode += "<td align='right' colspan='2' valign='middle' class='wide'>&nbsp;</td>";
	htmlCode += "</tr>";
	$(htmlCode).appendTo($(mbtstatlist));
	statRow = $("#nonTraversal");
	$(statRow).addClass("nonTraversal");

	LmsgList["nonTraversal"] = statObj_p;
	if (statObj_p.L1.length>0) {
		$(statRow).find(".L1").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L1');\">"+statObj_p.L1.length+"</a>");
	}
	if (statObj_p.L2.length>0) {
		$(statRow).find(".L2").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L2');\">"+statObj_p.L2.length+"</a>");
	}
	if (statObj_p.L3.length>0) {
		$(statRow).find(".L3").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L3');\">"+statObj_p.L3.length+"</a>");
	}
	if (statObj_p.L4.length>0) {
		$(statRow).find(".L4").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L4');\">"+statObj_p.L4.length+"</a>");
	}
	if (statObj_p.L5.length>0) {
		$(statRow).find(".L5").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L5');\">"+statObj_p.L5.length+"</a>");
	}

	// create transition/state rows
	for (stat_i in statObj_p.statList) {
		var statKey = statObj_p.statList[stat_i].statkey.replace(".", "0");
		var idxDot = statObj_p.statList[stat_i].statkey.indexOf(".");
		var statKeyDesc =  statObj_p.statList[stat_i].statkey;
		var statType = "state";
		if (idxDot>0) {
			statType = "transition";
			statKeyDesc = statObj_p.statList[stat_i].statkey.substring(0, idxDot) + ": " + statObj_p.statList[stat_i].statkey.substring (idxDot+1);
		}
		var shadeClass = "";
		if (isShade(stat_i)) {
			shadeClass = "shade";
		}
		var statRow = $("#"+statKey);
		var maxOver = statObj_p.statList[stat_i].overLimit;
		if (maxOver==undefined || maxOver=="0") maxOver = "";
		if (statObj_p.update) {
			$(statRow + " .sampleSize").text(statObj_p.statList[stat_i].sampleSize);
			$(statRow + " .L1").text(statObj_p.statList[stat_i].L1.length);
			$(statRow + " .L2").text(statObj_p.statList[stat_i].L2.length);
			$(statRow + " .L3").text(statObj_p.statList[stat_i].L3.length);
			$(statRow + " .L4").text(statObj_p.statList[stat_i].L4.length);
			$(statRow + " .L5").text(statObj_p.statList[stat_i].L5.length);
//			$(statRow + " .L").text(statObj_p.statList[stat_i].L.length);
		}
		else {
			var isTrans = statKeyDesc.indexOf(":");
			var htmlCode = "<tr id='" + statKey + "' class='"+shadeClass+"'><td align='left' class=numField>" + statKeyDesc + "</td>";
			if (isTrans>=0) htmlCode += "<td align='center' class='sampleSize'>"+ statObj_p.statList[stat_i].sampleSize + "</td>";
			else htmlCode += "<td align='center' class='sampleSize'>&nbsp;</td>";
			htmlCode += "<td class='allExp' align='center'><span class='L'>&nbsp;</span></td>"
				+"<td class='wide' align='center'><span class='L1'>&nbsp;</span></td>"
				+"<td class='wide' align='center'><span class='L2'>&nbsp;</span></td>"
				+"<td class='wide' align='center'><span class='L3'>&nbsp;</span></td>"
				+"<td class='wide' align='center'><span class='L4'>&nbsp;</span></td>"
				+"<td class='wide' align='center'><span class='L5'>&nbsp;</span></td>";
			if (isTrans>=0) htmlCode += "<td align='right' valign='middle' class='wide'><div class='bar'><div class='barMid'></div></div></td>"
				+"<td align='left' class='wide'><span class='average'>" +statObj_p.statList[stat_i].average+"</span></td>";
			else htmlCode += "<td align='right' class='wide' valign='middle' colspan='2'>&nbsp;</td>";
			htmlCode += "</tr>";
			$(htmlCode).appendTo($(mbtstatlist));
			statRow = $("#"+statKey);
			$(statRow).addClass(statType);
			$(statRow + " .levelExp span").click(function() { 
				if (parseInt($(this).html(), 0)>0) {
					popupExceptMsg($(this).parent().parent().attr("id"), $(this).attr("class"));
				}
			});

		}
		
		LmsgList[statKey] = statObj_p.statList[stat_i];
		if (statObj_p.statList[stat_i].L1.length>0) {
			formatDelta("#"+statKey+" .L1 a", statObj_p.statList[stat_i].L1.length, statObj_p.statList[stat_i].HL1Avg, true);
		}
		if (statObj_p.statList[stat_i].L2.length>0) {
			formatDelta("#"+statKey+" .L2 a", statObj_p.statList[stat_i].L2.length, statObj_p.statList[stat_i].HL2Avg, true);
		}
		if (statObj_p.statList[stat_i].L3.length>0) {
			formatDelta("#"+statKey+" .L3 a", statObj_p.statList[stat_i].L3.length, statObj_p.statList[stat_i].HL3Avg, true);
		}
		if (statObj_p.statList[stat_i].L4.length>0) {
			formatDelta("#"+statKey+" .L4 a", statObj_p.statList[stat_i].L4.length, statObj_p.statList[stat_i].HL4Avg, true);
		}
		if (statObj_p.statList[stat_i].L5.length>0) {
			formatDelta("#"+statKey+" .L5 a", statObj_p.statList[stat_i].L5.length, statObj_p.statList[stat_i].HL5Avg, true);
		}

		var histoBar = $("#"+statKey+" .bar");
		var intervalStart = Math.round(parseInt(statObj_p.statList[stat_i].average)*0.8);
		var intervalEnd = Math.round(parseInt(statObj_p.statList[stat_i].average)*1.2);
		if (statObj_p.statList[stat_i].Haverage && parseInt(statObj_p.statList[stat_i].Hstddev)>0) {
			intervalStart = Math.round(parseInt(statObj_p.statList[stat_i].Haverage) - 3*parseInt(statObj_p.statList[stat_i].Hstddev));
			intervalEnd = Math.round(parseInt(statObj_p.statList[stat_i].Haverage) + 3*parseInt(statObj_p.statList[stat_i].Hstddev));
		}
		else if (statObj_p.statList[stat_i].stddev && parseInt(statObj_p.statList[stat_i].stddev)>0) {
			intervalStart = Math.round(parseInt(statObj_p.statList[stat_i].average) - 3*parseInt(statObj_p.statList[stat_i].stddev));
			intervalEnd = Math.round(parseInt(statObj_p.statList[stat_i].average) + 3*parseInt(statObj_p.statList[stat_i].stddev));
		}
		if (intervalStart<0) intervalStart = 0;
		
		var hoverMsg = "mean: " + statObj_p.statList[stat_i].Haverage + "\n"
			+ "99% confidence range: " + intervalStart + "," + intervalEnd + "\n";
//		$(histoBar).attr("title", hoverMsg);
		var barWidth = $(histoBar).find(".bar").css("width");
		if (barWidth && barWidth!="auto") {
		 	barWidth = parseInt(barWidth.substring(0, barWidth.indexOf("px")));
		}
		else {
		 	barWidth = 100;
		}
		if (barWidth=="NaN") barWidth=100;
		barWidth = parseInt(barWidth)
		var histoPct = 0;
		if (intervalEnd-intervalStart>0) histoPct = (parseInt(statObj_p.statList[stat_i].average) - intervalStart) / (intervalEnd - intervalStart);
		if (histoPct<0) {
			histoPct = 0;
		}
		if (histoPct>1) {
			histoPct = 1;
		}
		var histoMidPos = Math.round((barWidth-2) * histoPct);
		$(histoBar).find(".barMid").css("left", histoMidPos + "px");
	}
	
	setDataSetStatList(statObj_p.dsStatList);
}


function setDataSetStatList(dsStatList_p) {
	$("#dsStatListRows tr").remove();

	var htmlCode="";
	for (stat_i in dsStatList_p) {
		var shadeClass = "";
		if (isShade(stat_i)) {
			shadeClass = "shade";
		}
		var tempStat = dsStatList_p[stat_i];
		htmlCode = "<tr " + shadeClass + "><td>" + tempStat.dsName + "</td><td align=center>" 
			+ tempStat.total + "</td><td align=center>" + tempStat.min + "</td><td align=center>" + tempStat.max 
			+ "</td><td align=center>" + tempStat.avg + "</td></tr>";
		$(htmlCode).appendTo($("#dsStatsRows"));
	}
	return;
}

function popupExceptMsg (statKey_p, level_p) {
	if (LmsgList[statKey_p]==undefined) return;
    if (LmsgList[statKey_p][level_p]==undefined) return;

	var msg = genString(LmsgList[statKey_p][level_p]);
	if (msg==undefined) return;
	alertDialog(msg);
}
	
	
var prop1;
function genString(msgList_p) {
	if (msgList_p==undefined || msgList_p.length<=0) {
		return undefined;
	}
	var msg = "<ol>";
	for (prop1 in msgList_p) {
		msg += "<li>"+msgList_p[prop1] + "</li>";
	}
	msg += "</ol>";
	return msg;
}


function saveStat () {
	// check if model execution has completed successfully
	sendAction ("saveStat", "statDesc=" + $("#curStatDesc").val());
}

function statsFilter(filter_p) {
	$("#statetransstats tr").show();
	if (filter_p=="ALL") return; 
	else if (filter_p=="State") $("#statetransstats tr").not(".header").not(".state").hide();
	else $("#statetransstats tr").not(".header").not(".transition").hide();
}


