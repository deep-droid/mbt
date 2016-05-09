// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webMbtTrans.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}

$(document).ready(function(){
	initFrame("SeqTrace");
	$("#execMenu img").hover(function(){$(this).css("border", "1px solid gray");}, function(){$(this).css("border", "1px solid #AAAAAA")});
	$("#execMenu img").mousedown(function(){$(this).css("border", "1px solid red");})
					  .mouseup(function(){$(this).css("border", "1px solid #AAAAAA");})
					  .mouseout(function(){$(this).css("border", "1px solid #AAAAAA");});
	if (!inIFrame || parentWinObj.isTabSelected(FrameName)) {
		display();
	}
	
	if (parentWinObj.isModelCFG()) {
		$("#stateTransTravLabel").text("Node/Edge Traversals");
		$(".fsm").hide();
	}
	else {
		$(".cfg").hide();
	}
	
	adjustHeight();
});



var exceptionList;
var threadList;
var threadSelected;
var stateTransSelected;

function display (refresh_p) {
	if (isEmpty() || refresh_p) refresh();
}

function isEmpty () {
	if ($("mbttrans tr").size()>0) return false;
	else return true;
}

function reset () {
	$("mbttrans>*").remove();
}

function refresh() {
	parentWinObj.sendAction("mbtStatsList", "cmd=getMbtTrans&execID=" + parentWinObj.curAppState.execID, function (data) {
		if (parentWinObj.actionCallback(data)) return;
		setMbtTrans(data.mbttrans);
	});
}


function setMbtTrans (mbttrans) {
	threadList = new Array();
	exceptionList = new Array();
	threadSelected = "ALL";
	stateTransSelected = "ALL";
	if (typeof(parentWinObj.curAppState.nodeDataList["scxml"])=="undefined") return;
	$("#transLogSize").text(parentWinObj.curAppState.nodeDataList["scxml"].maxtranslog);
	
	threadList["ALL"]="All";
	
	if (mbttrans==undefined) return;
	$("#mbttrans>*").remove();
	var mbttransTable = $("#mbttrans");
	var idx2=0;
	for (i=0; i<mbttrans.length; i++) {
		var typeCode = 	"S";
		if (mbttrans[i].trans) typeCode = "T";	
		var threadClass = "t" + mbttrans[i].thread;
		
		if (mbttrans[i].errMsg.length>0) {
			exceptionList[i] = parentWinObj.resolveSnapID("<ol><li>"+mbttrans[i].errMsg.join("</li><li>")+"</li></ol>", parentWinObj.curAppState.execID);
			var transNode = $("<tr class='" + typeCode + " " + threadClass + "'><td onclick='javascript:alertDialog(exceptionList["+i+"]);'>"
					+ "<span class='thread'>t-" + mbttrans[i].thread + "</span>"
					+ "<span class='type'>" + typeCode + "</span>" + getLogDesc(mbttrans[i]) + "</td></tr>>").appendTo(mbttransTable);
			$(transNode).addClass("exception");
		}
		else {
			var transNode = $("<tr class='" + typeCode + " " + threadClass + "'><td>"
					+ "<span class='thread'>t-" + mbttrans[i].thread + "</span>"
					+ "<span class='type'>" + typeCode + "</span>" + getLogDesc(mbttrans[i]) + "</td></tr>").appendTo(mbttransTable);
		}
		$(transNode).addClass("t"+mbttrans[i].thread);
		threadList[mbttrans[i].thread]="t-"+mbttrans[i].thread;
//		if (isShade(idx2)) {
//			$(transNode).addClass("shade");
//		}
//		idx2=idx2+1;

	}
	filterType($("#type").val());
	
	
	$("#thread").removeOption(/./).addOption(threadList, false).sortOptions(true);
	
	$("#mbttrans tr").hover(function(){$(this).addClass("hover");},
			function() { $(this).removeClass("hover");});
	return;
}



function getLogDesc(mbttransObj) {
	if (mbttransObj.trans) {
		return mbttransObj.state + ": " + mbttransObj.trans;
	}
	else {
		return mbttransObj.state;
	}
}



function filterType(filter_p) {
	stateTransSelected = filter_p;
	filterRows();
}

function filterThread(filter_p) {
	threadSelected = filter_p;
	filterRows();
}

function filterRows () {
	$("#mbttrans tr").show();
	if (threadSelected!="ALL") $("#mbttrans tr").not(".t"+threadSelected).hide();
	if (stateTransSelected=="STATE") {
		var a = $("#mbttrans tr");
		var b = $("#mbttrans tr").not(".S");
		$("#mbttrans tr").not(".S").hide();
	}
	else if (stateTransSelected=="TRANS") $("#mbttrans tr").not(".T").hide();
	return;
}

function openTravGraph() {
	parentWinObj.openTravGraphWithParam("mode=Log&threadId=" + threadSelected);// + "&execID=" + parentWinObj.curAppState.execID);
}

function adjustHeight() {
	$("#seqListMain").css("height", $(window).height() - 32);
}


// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset" || action_p=="cancel") {
		reset();
	}
	else if (action_p=="display") {
		display(params_p);
		adjustHeight();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return !isEmpty();
	}
	else {
		alert("SeqTrace - unknown action: " + action_p);
	}
}