// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// MsgSeqChart.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

$(document).ready(function() {
	initFrame("WinExecMSC");
	refresh();
});


function display (refresh_p) {
	refresh();
}


function refresh() {
	$("#mscGraph").attr("src","app=webmbt&action=webmbtGraph&type=execMSC&rand=" + Math.random());
}

function reset() {
	$("#mscGraph").attr("src","img/blank.png");
}

function adjustHeight(topPaneHeight, bottomPaneHeight) {
    // includes header from the parent and one header and one footer from this editor
	$("#mscMain").css("height", bottomPaneHeight - 52);
}


// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight(params_p.topPaneHeight, params_p.bottomPaneHeight);
	}
	else if ("execMSC") {
		refresh();
	}
	else {
		alert("unknown action: " + action_p);
	}
}
