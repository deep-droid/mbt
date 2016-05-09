// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtProperty.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}
var markdown = new MarkdownDeep.Markdown();

var curUID;
var preMdText = "";
var readonly;

$(document).ready(function() {
	initFrame("Annot");
	loadAnnot(parentWinObj.curAppState.curPropNodeData, false);
	
//	$(document).keypress(function(event) {
//	    var keycode = (event.keyCode ? event.keyCode : event.which);
//	    if(keycode == '13') {
//		    save();
//		    parentWinObj.closeDialog();
//    	}
//	});
});

function cancel() {
	return;
}

function loadAnnot(nodeData_p, readonly_p) {
	if (nodeData_p==null) return;
	curUID = nodeData_p.uid;
	readonly = readonly_p;
	if (nodeData_p.readOnly=="Y" || parentWinObj.isRuntime()) readonly = true;

	parentWinObj.sendAction("annot", "cmd=get&uid=" + curUID, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		else {
			preMdText = data.annot;
			$("#mdd_editor").val(data.annot);
			 $("textarea.mdd_editor").MarkdownDeep({ 
				    help_location: "packages/markdown/js/mdd_help.html",
				    disableTabHandling:true
				 });
			$("#mdd_editor").focus();
		}
	});
	
}

function save () {
	var mdText = $("#mdd_editor").val();
	if (mdText==preMdText) return;
	parentWinObj.postAction("annot", {cmd: "save", uid: curUID, annot: mdText}, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		else {
			parentWinObj.setModelChanged(true);
		}
	});
}


function restrictDevOnly() {
	if (parentWinObj.isRuntime() || 
		parentWinObj.curAppState.webmbtObj && 
		parentWinObj.curAppState.webmbtObj.model.archiveModel) {
		return "readonly";
	}
	else {
		return "";
	}
}


function mainCallbackFunc(action_p, params_p) {
	if (action_p=="save") {
		save();
	}
}


