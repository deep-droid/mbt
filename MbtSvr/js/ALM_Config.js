// copyright TestOptimal, LLC, all rights reserved.
// ALM_Config.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}


$(document).ready(function() {

	loadALM_Config();
	
	$("#refreshTagList").click(function() {
		toggleTagListTable(true);
		refreshTagList();
	});

	var scxml = parent.curAppState.nodeDataList["scxml"];
	if ((","+scxml.pluginID+",").indexOf(",ALM,")>=0) {
		$("#msg").text("ALM plugin is activated.");
	}
	else {
		$("#msg").text("ALM plugin is NOT activated. You can enable ALM plugin in Model Property Dialog.");
	}
		
	$(".msg").click(function() {
		$(this).hide();
	});
});

function loadALM_Config() {
	$("#lookupReqGroup").hide();
	parent.sendActionUtil("tag", "type=getConfigALM", function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		
		var i;
		var reqListElem = $("#reqmgtAddOn");
		for (i in data.reqAddOnList) {
			var addOnID = data.reqAddOnList[i];
			$(reqListElem).append("<option value='" + addOnID + "'>" + addOnID + "</option>");
		}

		var bugListElem = $("#defectAddOn");
		for (i in data.bugAddOnList) {
			var addOnID = data.bugAddOnList[i];
			$(bugListElem).append("<option value='" + addOnID + "'>" + addOnID + "</option>");
		}

		if (data.config.DEFECT) {
			$("#defectAddOn").val(data.config.DEFECT.addOnID);
//			$("#defectConnInfo").val(data.config.DEFECT.connInfo);
			$("#defectParams").val(data.config.DEFECT.params.join("\n"));
		}
		
		if (data.config.REQMGT) {
			$("#reqmgtAddOn").val(data.config.REQMGT.addOnID);
//			$("#reqmgtConnInfo").val(data.config.REQMGT.connInfo);
			$("#reqmgtParams").val(data.config.REQMGT.params.join("\n"));
			showHideReqGroup (data.config.REQMGT.addOnID);
		}

		if (data.config.TESTMGT) {
			$("#testAddOn").val(data.config.TESTMGT.addOnID);
//			$("#testConnInfo").val(data.config.TESTMGT.connInfo);
			$("#testParams").val(data.config.TESTMGT.params.join("\m"));
		}
		
		$("#saveReqmgtBtn").click(function() {
			saveReqTag ();
		});
		
		$("#saveDefectBtn").click(function() {
			saveDefect ();
		});
		
		if (parent.containsPlugin("ALM")) {
			$(".ALM").show();
		}
		
		$("#reqmgtAddOn").change(function() {
			var val = $(this).val();
			showHideReqGroup(val);
		});
		
		$("#lookupReqGroup").click(showLookupReqGroup);
	});
}


function showHideReqGroup (val) {
	if (val=="COM" || val=="FILE" || val=="EXCEL" || val=="SQL" || val=="URL") {
		$("#lookupReqGroup").hide();
	}
	else $("#lookupReqGroup").show();
}

function showLookupReqGroup() {
	parent.sendActionUtil("tag", "type=getReqGroupList", function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		var reqGroupList = data;
		if (data.length<=0) {
			parent.alertDialog("No Requirement Group(s) found in current ALM Project");
			return;
		}
		reqGroupList.unshift("");
		var curReqGroupList = getCurReqGroup();
		parent.multiSelectDialog("Select one or more Requirement Group(s) from the list below:", reqGroupList, curReqGroupList, setLookupReqGroup);	
	});
}

function getCurReqGroup () {
	var reqTxt = $("#reqmgtParams").val();
	var reqList = reqTxt.split("\n");
	for (i in reqList) {
		var reqItem = reqList[i];
		if (reqItem.indexOf("REQ_GROUP=")>=0) {
			reqGroup = reqItem.substring(reqItem.indexOf("=")+1);
			return reqGroup.split(",");
		}
	}
	return [];
}

function setLookupReqGroup () {
	var groupList = parent.getMultiSelectedList("");
	var reqTxt = $("#reqmgtParams").val();
	var reqList = reqTxt.split("\n");
	var reqGroup = undefined;
	if (groupList.length>0) {
		reqGroup = "REQ_GROUP=" + groupList.join(",");
	}
	var newReqList = [];
	for (var i in reqList) {
		var reqItem = reqList[i];
		if (reqItem.indexOf("REQ_GROUP=")>=0) {
			if (reqGroup!=undefined) {
				newReqList.push(reqGroup);
				reqGroup = undefined;
			}
		}
		else {
			newReqList.push(reqItem);
		}
	}
	if (reqGroup!= undefined) {
		newReqList.push(reqGroup);
	}
	reqTxt = newReqList.join("\n");
	$("#reqmgtParams").val(reqTxt);
}

function saveDefect () {
	$("#defectMsg").hide();
	var paramObj = {
			type: "saveDEFECT", 
			addOnID: $("#defectAddOn").val(), 
//			connInfo: $("#defectConnInfo").val(), 
			params: $("#defectParams").val()
		};
		
	parent.postActionUtil("tag", paramObj, function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		else {
//			parent.alertDialog("Changes saved.");
			$("#defectMsg").show();
		}
	}, "json");
}


function saveReqTag () {
	$("#reqMsg").hide();
	var paramObj = {
			type: "saveREQMGT", 
			addOnID: $("#reqmgtAddOn").val(), 
//			connInfo: $("#reqmgtConnInfo").val(), 
			params: $("#reqmgtParams").val()
		};	
	
	parent.postActionUtil("tag", paramObj, function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		else {
//			parent.alertDialog("Changes saved.");
			$("#reqMsg").show();
		}
	}, "json");
}


function openReqView() {
	parent.runWinAction('Model','popupReqView');
	parent.closeDialog();
}

function openDefectView() {
	parent.runWinAction('Model','popupDefectsView');
	parent.closeDialog();
}
