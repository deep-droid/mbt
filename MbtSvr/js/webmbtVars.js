// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webMbtTrans.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}

var varList = new Array();

$(document).ready(function(){
	initFrame("Vars");
    $("#moreMenu").hover(function() {
    		var ckYes = "&#10004;";
    		var ck = "&nbsp;";
    		if (showUserVar) {
    			ck = ckYes;
    		}
    		$("#menuToggleUserVar .ck").html(ck);

    		var ck = "&nbsp;";
    		if (showSysVar) {
    			ck = ckYes;
    		}
    		$("#menuToggleSysVar .ck").html(ck);

    		var ck = "&nbsp;";
    		if (showDataset) {
    			ck = ckYes;
    		}
    		$("#menuToggleDataset .ck").html(ck);

    		$("#hoverMenu").show();
    	});
    $("#hoverMenu").hover(null, function() {
    		$(this).hide();
    	})
    	.click (function() {$("#hoverMenu").hide();});

	display();
	adjustHeight();
});

function display (refresh_p) {
	if (refresh_p || varList.length<=0) refresh();
}


function refresh() {
	parentWinObj.sendAction("debug", "type=getVars", function (data) {
		if (parentWinObj.actionCallback(data)) return;
		setVars(data);
	});
}

function reset() {
	$("#varList >*").remove();
}


function setVars (varList_p) {
	if (varList_p.length<=0) return;
	
	varList = varList_p;
	var varElem = $("#varList");
//	if ($("#varList tr").size()>0) {
//		updateFilter();
//	}
	
	$("#varList >*").remove();
	for (var i in varList) {
		var htmlCode = genVar(varList[i]);
		if (htmlCode) {
			$(htmlCode).appendTo($(varElem));
		}
	}

	$("tr.user").click(function() {
		var curVal = $(this).find(".val").text();
		var varName = $(this).find(".var").text();
		var msg = "<div>Edit Variable</div><br/><div>Variable: " + varName + "</div><div>Enter a new value:</div>";
		parentWinObj.promptDialog(msg, curVal, function() {
			var newVal = encodeURIComponent(parentWinObj.getPromptVal());
			parentWinObj.postAction("debug", "type=setVar&varName=" + varName + "&varVal=" + newVal, function(data) {
				if (data.error) {
					parentWinObj.alertDialog("Failed to set variable. Check Server Log for details");
				}
				else {
					refresh();
				}
			});
		});
	});
	
	$("tr.dataset").click(function() {
		var curVal = $(this).find(".val").html();
		var dsName = $(this).find(".var").text();
		var msg = "<div>Edit DataSet</div><br/><div>DataSet Name: " + dsName + "<br/>" + curVal + "</div><div>Enter a new row index (0-based):</div>";
		parentWinObj.promptDialog(msg, "", function() {
			var newVal = encodeURIComponent(parentWinObj.getPromptVal());
			parentWinObj.postAction("debug", "type=setVar&dsName=" + dsName + "&rowIdx=" + newVal, function(data) {
				if (data.error) {
					parentWinObj.alertDialog("Failed to set dataset row index. Check Server Log for details");
				}
				else {
					refresh();
				}
			});
		});
	});
	
	hideFilter();
	applyWatchList();
	applyFilter();
	
	$("#varList tr").hover(function(){$(this).addClass("hover");},
			function() { $(this).removeClass("hover");});
	
	adjustHeight();
	return;
}



function genVar(varDtl) {
	var ret;
	var aValList = [""];
	var varStatus = "(not set)";
	if (varDtl.valList!=null && varDtl.valList.length>0) {
		aValList = varDtl.valList;
		varStatus = "";
	}

	var varType = "sys";
	if (varDtl.type=="user") varType = "user";
	else if (varDtl.type=="dataset") varType="data";
	
	if (varDtl.isSet) {
		ret = "<tr class='" + varDtl.type + "'><td class=filter valign=top><input type=checkbox></input></td><td class='type' valign=top>" + varType + "</td><td class=var valign=top>" + varDtl.name + "</td><td class='val'><ul><li><pre>" + unescapeText(aValList.join("</pre></li><li><pre>")) + "</pre></li></ul></td></tr>";
		ret = ret.replace(/&lt;/g, '<');
		ret = ret.replace(/&gt;/g, '>');
	}
	else {
		ret = "<tr class='" + varDtl.type + "'><td class=filter valign=top><input type=checkbox></input></td><td class='type' valign=top>" + varType + "</td><td class=var valign=top>" + varDtl.name + "</td><td class='val' valign=top>" + unescapeText(aValList) + varStatus + "</td></tr>";
	}
	return ret;
}

function unescapeText(text_p) {
	text_p = decodeURIComponent(text_p);
//	text_p = unescape(text_p);
	
	text_p = text_p.replace(/\</g, "&lt;");
	text_p = text_p.replace(/\>/g, "&gt;");
	text_p = text_p.replace(/&lt;br&gt;/g, "<br>");
	return text_p;
}


var showUserVar = true;
var showSysVar = true;
var showDataset = true;
function toggleUserVar() {
	showUserVar = !showUserVar;
	applyFilter();
}

function toggleSysVar() {
	showSysVar = !showSysVar;
	applyFilter();
}

function toggleDataset() {
	showDataset = !showDataset;
	applyFilter();
}

var watchVarList = new Array();
function applyWatchList() {
	if (watchVarList.length==0) {
		watchVarList = new Array();
		for (var i in varList) {
			if (varList[i].type=="user" ||
			    varList[i].type=="dataset" ||
				varList[i].name=="curStateID" ||
				varList[i].name=="curTransID") {
				watchVarList[watchVarList.length] = varList[i].name;
			}
		};
	}
	
	$("#varList .var").each(function() {
		if (isVarWatched($(this).text())) {
			$(this).parent().find(".filter input").attr("checked", true);
		}
		else {
			$(this).parent().find(".filter input").attr("checked", false);
		}
	});
}

function showFilter() {
	$(".filter").show();
	$("#varList tr").show();
	$("#filterCount").hide();
	$("#hideFilter").show();
	$(".header .filter").attr("checked", false);
}

function updateFilter() {
	if (watchVarList==null) return;  // should only be populated after first load of varList
	
	watchVarList = new Array();
	$("#varList input:checked").each(function() {
		watchVarList[watchVarList.length] = $(this).parent().parent().find(".var").text();
	});
}


function hideFilter() {
	$(".filter").hide();
	$("#hideFilter").hide();
	$("#filterCount").show();
	updateFilter();
	applyFilter();
}

function applyFilter() {
	var normalMode = !($("#hideFilter").is(":visible"));
	if (normalMode) {
		$("#varList tr").hide();
		$(".filter input:checked").parent().parent().show();
	}
	else {
		$("#varList tr").show();
	}
	
	if (showUserVar) {
		$("#varList .user:visible").show();
	}
	else {
		$("#varList .user").hide();
	}
	if (showSysVar) {
		$("#varList .sys:visible").show();
	}
	else {
		$("#varList .sys").hide();
	}
	if (showDataset) {
		$("#varList .dataset:visible").show();
	}
	else {
		$("#varList .dataset").hide();
	}
	var cnt = $("#varList tr").size();
	var cntVisible = $("#varList tr:visible").size();
	$("#filterCount").text("showing " + cntVisible + "/" + cnt);
}

function isVarWatched(varName) {
	for (var i in watchVarList) {
		if (watchVarList[i]==varName) return true;
	}
	return false;
}

function toggleCheckAll(checked_p) {
	$("#varList tr:visible").find("input").attr("checked", checked_p);
}

function adjustHeight() {
	$("#varMainDiv").css("height", $(window).height()-35);
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset") {
		reset();
	}
	else if (action_p=="display") {
		if (parentWinObj) display(params_p);
		adjustHeight();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return varList.length>0;
	}
}
