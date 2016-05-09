// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// BatchRun.js


window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

$(document).ready(function() {
	parent.sendActionUtil("license", "cmd=getModelList", function(data) {
		if (parent.actionCallback(data)) {
			parent.closeDialog();
			return;
		}
		var modelList = data.modelList;
		var htmlCode = "";
		for (var i in modelList) {
			var model = modelList[i];
			htmlCode += "<tr id='modelList'><td>" + (parseInt(i)+1) + "</td>"
					 + "<td><input type=checkbox /></td>"
					 + "<td class=name>" + model.modelName + "</td>" 
					 + "<td nowrap>" + model.arch.updateDT + "</td>"
					 + "<td>" + model.arch.updateEmail + "</td>"
					 + "</tr>";
		}

		$(htmlCode).appendTo($("#modelList tbody"));;
		$("#modelList").tablesorter({sortList:[[0,1]], widgets: ['zebra']})
	});
});

function checkAll(checked_p) {
	$("#modelList input").attr("checked",checked_p);
}


function delSelected() {
	var modelList = new Array();
	$("#modelList input:checked").each(function() {
		modelList.push($(this).parent().parent().find(".name").text());
	});
	parent.submitDeleteModels(modelList);
	parent.closeDialog();
}

