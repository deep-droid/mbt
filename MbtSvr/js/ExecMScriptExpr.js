// copyright, TestOptimal, LLC, all rights reserved.
// ExecMScriptExpr.js


window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

var mscriptMethodList = new Array();
var toPluginURL = "http://testoptimal.com/javaDoc/reference/com/webmbt/plugin/";

$(document).ready(function () {
	parent.sendAction("misc", "type=getMscriptMacroList", function(data) {
		mscriptMethodList = data;
		var sysOption = "<option value=''></option>";
		var pluginOption = "<option value=''></option>";
		var pluginFuncCount = 0;
		for (var i in mscriptMethodList) {
			if (mscriptMethodList[i].type=="sys") {
				sysOption += "<option value=\"" + mscriptMethodList[i].expr + "\">" + i  + "</option>";
			}
			else if (mscriptMethodList[i].type=="plugin") {
				pluginOption += "<option value=\"" + mscriptMethodList[i].expr + "\">" + i  + "</option>";
				pluginFuncCount += 1;
			}
		}
		$(sysOption).appendTo($("#sysFuncSelect"));
		$(pluginOption).appendTo($("#pluginFuncSelect"));
		if (pluginFuncCount <= 0) {
			$("#pluginFunc").hide();
		}
	});
	
	var pluginIDList = parent.curAppState.nodeDataList["scxml"].pluginID;
	pluginIDList = pluginIDList.split(",");
	var pluginLinks = "";
	for (var pIdx in pluginIDList) {
		pluginLinks += "<a class=pluginLink href='" + toPluginURL + pluginIDList[pIdx] + "Plugin.html' target=_blank>" + pluginIDList[pIdx] + "</a>"; 
	}	
	$(pluginLinks).appendTo($("#pluginList"));
	$("#mscriptExpr").val(parent.curAppState.lastMScriptExpr);
	if (parent.curAppState.autoExecMScript) {
		$('#execMScriptBtn').click();
	}
	
});

function execMScript() {
	var scriptText = $("#mscriptExpr").val();
	if (scriptText=="") {
		return;
	}
	
	$("#mscriptResult").val('');
	$("#mscriptResult").append($("<span>running mscript expression, please wait ...<span>"));
	parent.curAppState.lastMScriptExpr = scriptText;
	
	parent.postWithTimeout ("debug", {type: "execMScript", text:"Y", mscript: scriptText}, function (data) {
		data = data.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var rslt = decodeURIComponent(data.replace(/\+/g," ").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"'));
		$("#mscriptResult").val(rslt);
//		$("#mscriptResult").append($(rslt));
	}, "text", 20*60*1000);
}



function addFunc(funcSelectField_p) {
	parent.curAppState.lastMScriptExpr = $("#mscriptExpr").val();
	var funcSelected = $("#" + funcSelectField_p).val();
	var curIdx = getTextAreaCursor();
	if (curIdx<0) curIdx = 0;
	parent.curAppState.lastMScriptExpr = parent.curAppState.lastMScriptExpr.substring(0, curIdx) + funcSelected + parent.curAppState.lastMScriptExpr.substring(curIdx); 
	$("#mscriptExpr").val(parent.curAppState.lastMScriptExpr);
	$("#" + funcSelectField_p).val("");
}

function clearMScript() {
	$("#mscriptExpr").val("");
	$("#mscriptResult").val('');
}

function getTextAreaCursor() {
	var textareaIdx = parent.curAppState.lastMScriptExpr.length;
	var el = document.getElementById("mscriptExpr");
	if (el.selectionStart) { 
	    textareaIdx = el.selectionStart; 
	} 
	else if (document.selection) { 
	    el.focus(); 
	    var r = document.selection.createRange(); 
	    if (r == null) { 
	      textareaIdx = 0; 
	    } 
		else {
		    var re = el.createTextRange(), 
		    rc = re.duplicate(); 
		    re.moveToBookmark(r.getBookmark()); 
		    rc.setEndPoint('EndToStart', re); 
		
		    var add_newlines = 0;
		    for (var i=0; i<rc.text.length; i++) {
		      if (rc.text.substr(i, 2) == '\r\n') {
		        add_newlines += 2;
		        i++;
		      }
		    }
		    textareaIdx = rc.text.length - add_newlines; 
		}
	}
	return textareaIdx;
}