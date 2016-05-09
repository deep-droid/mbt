// copyright 20013, TestOptimal, LLC, all rights reserved.
// BatchModelCoverage.js

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
					 + "<td class=name>" + model.modelName + "</td>";
			if (model.arch) { 
				htmlCode += "<td nowrap>" + model.arch.updateDT + "</td>";
			}
			else {
				htmlCode += "<td nowrap>" + model.lastModifiedDate + "</td>"
			}
			htmlCode += "</tr>";
		}

		$(htmlCode).appendTo($("#modelList tbody"));
		$("#modelList").tablesorter();
	});
	
});

function checkAll(checked_p) {
	$("#modelList input").attr("checked",checked_p);
}

function reportSelected() {
	var modelList = new Array();
	$("#modelList input:checked").each(function() {
		modelList.push($(this).parent().parent().find(".name").text());
	});
	
	var checkinCmt = $("#checkinCmt").val();
	var rptName = "CoverageByModels";
	var rptURL = "/MbtSvr/app=webrpt&name=" + rptName + "&modelList=" + encodeURIComponent(modelList.join(",")) + "&comments=" + encodeURIComponent(checkinCmt);
	var winObj = window.open(rptURL, rptName);
	if (winObj) {
		parent.addWin(winObj, rptName);
	}
	else {
		alertDialog("popup.blocker");
	}

//	parent.closeDialog();
}


