// copyright 2008-2016, TestOptimal LLC
// webmbtBuilder.js

var autWin;
window.addEventListener("message", handleAUTMessage, false);

function openAUT () {
	var autURL = curAppState.nodeDataList.scxml.url;
	var idx = autURL.toLowerCase().indexOf ("selenium:");
	if (idx >= 0) {
		autURL = autURL.substring(idx);
		idx = autURL.indexOf(";");
		if (idx > 0) {
			autURL = autURL.substring(0,idx);
		}
	}
	else if (autURL.toLowerCase().indexOf("http") < 0) {
		autURL = "_blank";
	}

	if (autWin && !autWin.closed) {
		autWin.location.href = autURL;
	}
	else {
		autWin = window.open(autURL, "AUT - TestOptimal"); //, "height=750,width=1250,scrollbars=1,resizable=1,location=1");
		setTimeout(turnWebmbtOn, 500);
		setTimeout(turnWebmbtOn, 1500);
		setTimeout(turnWebmbtOn, 2500);
	}
	autWin.focus();
}

function turnWebmbtOn () {
	var msgObj = {cmd: "webmbtOn"};
	sendMsgAUT (msgObj);	
}

function sendMsgAUT (msgObj) {
	msgObj.svrMsg = true;
	autWin.postMessage(msgObj, "*");
}

function handleAUTMessage (event) {
	if (event.data.svrMsg) return;
   	var cmdAction = event.data.cmd;
    if (cmdAction=="closeAUT") {
    	autWin.close();
    	autWin = undefined;
    }
    else if (cmdAction=="webmbtReady") {
		turnWebmbtOn();
    }
  	else if (cmdAction=="NewState") {
  		aNewState (event.data, event.data.scriptList, event.data.fieldList);
	}
	else if (cmdAction == "NewTrans") {
  		aNewTrans (event.data.scriptList, event.data.fieldList);
	}
	else if (cmdAction == "AppendTrans") {
		aAppendScript(event.data.scriptList, event.data.fieldList);
	}
    else {
  		alertDialog ("Invalid WebMBT command: " + cmdAction);
	}
}

// all functions prefixed with "a" are functions to be called by the 
// the window which opens TestOptimal workbench browser.

var ddtFieldList;
var scriptList;

function aNewState(page_p, scriptList_p, ddtFieldList_p) {

	scriptList = scriptList_p;
	ddtFieldList = ddtFieldList_p;

	if (isRuntime()) {
		alertDialog("Runtime server does not support WebMBT Builder");
		return;
	}
	
	if (page_p==null) {
		alertDialog("Unable to create state. AUT page not loaded.");
		return;
	}

	if (curAppState.curNodeData==null) {
		curAppState.curNodeData = curAppState.nodeDataList["scxml"];
	}
	
//	var parentState = curAppState.curNodeData;
//	if (parentState.typeCode=="transition") {
//		parentState = curAppState.nodeDataList[parentState.parentuid];
//	}
//	else if (parentState.typeCode=="usecase" || parentState.typeCode=="mbt") {
//		parentState = curAppState.nodeDataList["scxml"];
//	}

	var stateList = getStateList();
	stateList.push({label: "", val: "scxml"});
	stateList = sortStateList(stateList);
	promptSelectDialog("Create New State", "Parent&nbsp;State:", stateList, "State&nbsp;ID:", page_p.pageTitle, function() {
		var newStateID = getPromptVal();
		var parentStateUID = getSelectedVal();
		if (newStateID=="") return;
		page_p.pageUrl = ""; // no reset url for state.
		var stateNode = newNode(parentStateUID, "state", true, {stateid: newStateID, xmlScript: getMScript("onentry"), desc: page_p.pageDesc, stateurl: page_p.pageUrl});
		if (stateNode==null) {
			alertDialog("Failed to create state " + newStateID);
		}
	});
	
	return;
}


function aNewTrans(scriptList_p, ddtFieldList_p) {
	scriptList = scriptList_p;
	ddtFieldList = ddtFieldList_p;
	if (isRuntime()) {
		alertDialog ("Runtime server does not support WebMBT Builder");
		return;
	}
	var stateNode = curAppState.curNodeData;
	if (stateNode==null) {
		stateNode = curAppState.nodeDataList["scxml"];
	}
	else if (stateNode.typeCode=="transition") {
		stateNode = curAppState.nodeDataList[stateNode.parentuid];
	}
//	if (sourceStateID) {
//		stateNode = findStateByStateID(sourceStateID);
//	}
	if (stateNode == null || stateNode.typeCode != "state") {
		alertDialog ("Not in a state context. Please select a state.");
		return;
	}
	
	var actionScriptObj = getMainScriptObj();
	var eventID = "";
	var eventDesc = "";
	if (actionScriptObj) {
		eventID = actionScriptObj.elemName;
		eventDesc = actionScriptObj.elemDesc;
	}
	
	promptSelectDialog ("Create New Transition", "From&nbsp;State:</td><td>" + stateNode.stateid + "</td></tr><tr><td>To&nbsp;State:", getStateList(), "Trans&nbsp;ID:", eventID, function() {
		var targetStateID = getSelectedLabel();
		eventID = getPromptVal();
		if (eventID=="") return;
		if (!eventDesc || eventDesc=="") {
			eventDesc = eventID;
		}
		var aNode = newNode(stateNode.uid, "transition", true, 
			{desc: eventDesc, event: eventID, xmlScript: getMScript("action"), target: targetStateID }, transCreatedCB);
		if (aNode==null || aNode==undefined) {
			alertDialog ("Unable to create transition " + eventID);
		}
	});
	
	return;
}

function aAppendScript(scriptList_p, ddtFieldList_p) {
	scriptList = scriptList_p;
	ddtFieldList = ddtFieldList_p;
	if (isRuntime()) {
		alertDialog ("Runtime server does not support WebMBT Builder");
		return;
	}
	var curNode = curAppState.curNodeData;
	if (curNode.typeCode=="state") {
		var reqParams = {
			nodeType: "state",
			xmlScript: getMScript("onentry"),
			scriptType: "onentry",
			cmd: "append",
			stateId: curNode.stateid
		}
	
		postAction("mscriptSave", reqParams, function(data) {
			if (data.error) {
				alertDialog(data.error);
			}
			if (ddtFieldList && ddtFieldList.length>0) {
				alertDialog("Data fields can not be added to state.");
			}
			else {
				startEditMScript({uid: curNode.uid});
			}
		});
	}
	else if (curNode.typeCode=="transition") {
		var stateid = curAppState.nodeDataList[curNode.parentuid].stateid;
		var eventid = curNode.event;
		var reqParams = {
			nodeType: "transition",
			xmlScript: getMScript("action"),
			scriptType: "action",
			cmd: "append",
			stateId: stateid,
			eventId: eventid
		}
	
		postAction("mscriptSave", reqParams, function(data) {
			if (data.error) {
				alertDialog(data.error);
			}
			else {
				startEditMScript({uid: curNode.uid});
				addDataSetFields(curNode, "Added mscript/dataset field to transition " + eventid);
			}
		}, "json");
	}
	else {
		alertDialog ("Please select a state or transition in the model you wish to append the script to.");
		return;
	}
	
	setModelChanged(true);
	return;
}

// ddtFieldList object:
//	field.elemID = elementID_p;
//	field.elemXpath = elemXpath_p;
//	field.fieldType = fieldType_p;
//	field.domain = fieldDomain_p;
//	field.ddtType = ddtType_p;
function addDataSetFields(transObj_p, msg_p) {
	if (ddtFieldList.length<=0) return;

	var fields = { cmd: "addFieldList", uid: transObj_p.uid };
	var fieldIdx = 0;
	for (var i in ddtFieldList) {
		fieldIdx += 1;
		var ddtField = ddtFieldList[i];
		var groupCode = ddtField.ddtType;
		if (groupCode=="assertField") {
			groupCode = "V";
		}
		else groupCode = "0";
		
		var fieldDomain = ddtField.domain;
		if (fieldDomain.length>0) fieldDomain = fieldDomain.join("|");
		fields["fieldName" + fieldIdx] = ddtField.elemID;
		fields["fieldDomain" + fieldIdx] = fieldDomain;
		fields["group" + fieldIdx] = groupCode;
	};

	fields.fieldNum = fieldIdx;
	if (fieldIdx>0) refreshUID (transObj_p.uid);
	
	postAction("transDS", fields, function(data) {
		if (data.error) {
			alertDialog(data.error);
		}
		else {
			startEditMScript({uid: transObj_p.uid});
			if (msg_p) alertDialog (msg_p);
		}
	}, "json");

	return;
}


// scriptList object:
//	script.eid = nextEID();
//	script.mscript = script_p;
//	script.elemName = elemName_p;
//	script.elemDesc = elemDesc_p;
//	script.scriptType = scriptType_p;
function getMScript (scriptType_p) {
	if (!scriptList) return "";
	var actionScript = "";
	for (var i in scriptList) {
		actionScript += scriptList[i].mscript;
	}
	actionScript = "<script type=\"" + scriptType_p + "\">" + actionScript + "</script>";
	return actionScript;
}

function getMainScriptObj() {
	if (!scriptList) return null;
	for (var i=scriptList.length-1; i>=0; i--) {
		if (scriptList[i] && scriptList[i].elemName && scriptList[i].elemName!="") return scriptList[i];
	}
	return null;
}


function transCreatedCB (transObjList_p) {
	var transObj = null;
	if (transObjList_p==null) return;	
	transObj = transObjList_p[transObjList_p.length-1];
	addDataSetFields(transObj);
	return;
}


function getStateList () {
	var retList = new Array();
	for (i in curAppState.nodeDataList) {
		var tempNodeData = curAppState.nodeDataList[i];
		if (tempNodeData && tempNodeData.typeCode=="state" &&
			tempNodeData.uid && tempNodeData.parentuid && tempNodeData.readOnly=="N") {
			retList.push({label: tempNodeData.stateid, val: tempNodeData.uid});
		}
	}
	return sortStateList(retList);
}

function sortStateList(stateList_p) {
	stateList_p.sort(function(a,b) { 
		if (a.label == b.label) return 0;
		else if (a.label < b.label) return -1;
		else return 1; });
	return stateList_p;
}

function aGetCurState() {
	if (curAppState.curNodeData) {
		if (curAppState.curNodeData.typeCode=="state" || curAppState.curNodeData.typeCode=="scxml") return curAppState.curNodeData;
		else if (curAppState.curNodeData.typeCode=="transition") return nodeDataList[curAppState.curNodeData.parentuid];
	}
	return null;
}

function aGetCurTrans() {
	if (curAppState.curNodeData && curAppState.curNodeData.typeCode=="transition") return curAppState.curNodeData;
	else return null;
}

function setProperty(fieldName_p, fieldValue_p) {
	if (curAppState.curNodeData) {
		curAppState.curNodeData[fieldName_p] = fieldValue_p;
		saveProperty(curAppState.curNodeData);
	}
}

// returns the element id of last click mscript for the transition.
function aGetTransElementID(uid_p) {
	var aTrans = nodeDataList[uid_p];
	var aState = nodeDataList[aTrans.parentuid];
	var mscript = $.ajax({url: "app=webmbt&action=mscriptGet&stateId=" + aState.stateid + "&eventId=" + aTrans.event + "&scriptType=action", async: false}).responseText;
	if (mscript) {
		var idx = mscript.lastIndexOf("$click");
		if (idx<0) return "";
		
		mscript = mscript.substring(idx+6);
		idx = mscript.indexOf("('");
		if (idx<0) return "";

		mscript = mscript.substring(idx+2);
		idx = mscript.indexOf("')\"");
		if (idx<0) return "";

		mscript = mscript.substring(0, idx);
		return mscript;
	}
	else return "";
}


function aSaveStateDOM (stateID_p, stateDOM_p) {
	postAction ("uiState", {type: "saveStateDOM", stateid: stateID_p, stateDOM: stateDOM_p}, function(retMsg_p) {
		data = eval("data="+retMsg_p);
		if (actionCallback(data)) return;
	});
}

function aFindState(pageDOM_p) {
	var serializer = new XMLSerializer();
	var dom = serializer.serializeToString(pageDOM_p);
	
	postAction ("uiState", {type: "matchStateDOM", stateDOM: dom}, function(retMsg_p) {
		data = eval("data="+retMsg_p);
		if (actionCallback(data)) return;
	});
}
