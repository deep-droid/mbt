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
					 + "<td class=name>" + model.modelName + "</td>";
			if (model.arch) { 
				htmlCode += "<td nowrap>" + model.arch.updateDT + "</td>";
//					 + "<td>" + model.arch.updateEmail + "</td>"
			}
			else {
				htmlCode += "<td nowrap>" + model.lastModifiedDate + "</td>"
			}
			htmlCode += "</tr>";
		}

		$(htmlCode).appendTo($("#modelList tbody"));
		$("#modelList").tablesorter();
		
		$(".flexTooltip").flexTooltip({tooltipKeys: ["title", "url"]});
	});
});


function checkAll(checked_p) {
	$("#modelList input").attr("checked", checked_p);
}


function runSelected() {
	var modelList = new Array();
	$("#modelList input:checked").each(function() {
		modelList.push($(this).parent().parent().find(".name").text());
	});
	
	if (modelList.length<=0) {
		parent.alertDialog("No models are selected for execution.");
		return;
	}
	
	var statDesc = $("#statDesc").val();
	if (statDesc==undefined) statDesc = "";
	var email = $("#notifyEmail").val();
	if (email==undefined) email = "";
	var runOptions = $("#runOptions").val();
	if (runOptions==undefined) runOptions = "";
	else if (runOptions.indexOf("&")!=0) {
		runOptions = "&" + runOptions;
	}
	parent.sendAction ("modelAsyncAction", "cmd=exec&modelList=" + modelList.join(",") + "&notifyEmail=" + email + runOptions + "&statDesc=" + statDesc, function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
		}
		else {
			parent.alertDialog(data.alertMessage);
		}
		parent.closeDialog();
	});
}

