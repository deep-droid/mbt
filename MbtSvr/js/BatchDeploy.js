// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// BatchDeploy.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

$(document).ready(function() {
	parent.sendAction("archive", "cmd=modelList", function(modelList) {
		if (parent.actionCallback(modelList)) {
			parent.closeDialog();
			return;
		}
		var htmlCode = "";
		for (var i in modelList) {
			var model = modelList[i];
			htmlCode+= "<tr id='modelList' class=";
			if (model.deployed) htmlCode += "deployed";
			else htmlCode += "modified";
			htmlCode += "><td>" + (parseInt(i)+1) + "</td><td><input type=checkbox ";
			if (!model.deployed) {
				htmlCode += "checked";
			}
			htmlCode += "/></td><td class=name>" + model.modelName 
				+ "</td><td nowrap>" + model.modifiedDate + "</td><td nowrap>" + model.deployedDate + "</td></tr>";
		}

		$(htmlCode).appendTo($("#modelList tbody"));
		$("#modelList").tablesorter({sortList:[[0,0]], widgets: ['zebra']});
	});
	
});

function checkAll(checked_p) {
	$("#modelList input").attr("checked",checked_p);
}

function deploySelected() {
	var modelList = new Array();
	$("#modelList input:checked").each(function() {
		modelList.push($(this).parent().parent().find(".name").text());
	});
	
	var checkinCmt = $("#checkinCmt").val();
	parent.sendAction("archive", "cmd=deployModelList&modelList=" + modelList.join(",") + "&comment=" + encodeURIComponent(checkinCmt), function(data) {
		parent.actionCallback(data);
	});
	
	parent.alertDialog("archive.submitted");
//	parent.closeDialog();
}

