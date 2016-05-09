// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtStat.js

var parentWinObj=null;
var statLoaded = false;

$(document).ready(function() {
	initFrame("Stats");
	
//	setupMiniButtons($("#covGraphSpan img"));
//	$(".btn img").hover(function(){ $(this).addClass("actionBtnHover");}, function(){ $(this).removeClass("actionBtnHover");});

	if (!inIFrame || parentWinObj.isTabSelected(FrameName)) {
		display();
	}

    $("#moreMenu").hover(function() {
    		$("#hoverMenu").show();
    	});
    $("#hoverMenu").hover(null, function() {
    		$(this).hide();
    	})
    	.click (function() {$("#hoverMenu").hide();});

	if (parentWinObj.isModelCFG()) {
		$("#stateOnlyLabel").text("Node Only");
		$("#coverageStateLabel").text("Node");
		$("#coverageTransLabel").text("Edge");
		$("#stateTransLabel").text("Node: Edge");
	}
		
	adjustHeight();
	
});


var tagPassMsgList;
var tagFailMsgList;
var batchExecList = null;

var LmsgList = new Array();

function reset() {
	$(".field").text("");
	$("#stateCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#transCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#tagsCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	statLoaded = false;
}

function display (refresh_p) {
	if (!parentWinObj.curAppState.modelOpen) return;
	loadExecStatList();

	var execID = getRequestParam("execID");
	if (execID==null) {
		 execID = parentWinObj.curAppState.execID;
	}
	loadStat(execID);
}


// retrieve current mbt stat
function loadCurrentStat() {
//	if (parentWinObj.isRunning()) parentWinObj.fastHotSync();
	loadStat(-1);
}

function manageStats () {
	parentWinObj.openStatsRpt();
}

function loadStat (execID_p) {
	batchExecList = null;
	$("#batch").hide();
	if (execID_p<0) {
		$(".hist").hide();
		$("#statID .current").show().attr("selected", true);
	}
	else $(".hist").show();
	
	parentWinObj.sendAction("mbtStatsList", "cmd=getStats&execID=" + execID_p, function(data) { 
		if (parentWinObj.actionCallback(data)) return;
		
		setStat(data);
		statLoaded = true;
		parentWinObj.curAppState.execID = execID_p;
	});
}

function loadExecStatList() {
	var modelParam = "";
	if (parentWinObj.curAppState.modelName) {
		modelParam = "&model=" + parentWinObj.curAppState.modelName;
	}
	parentWinObj.sendAction("mbtStatsList", "cmd=getStatsList" + modelParam, function (data) {
		parentWinObj.actionCallback(data);
		setMbtStatList(data.mbtstatlist); 
	});
}


// add stat list dropdown list
function setMbtStatList (statHistList_p) {
	$("#statID option").remove();
	
	$("#statID").append("<option value=-1 class='current'>Current Execution</option>");
	if (statHistList_p==undefined) return;
	if (statHistList_p.length<=0) return;
	
	for (i in statHistList_p) {
		$("#statID").append("<option value=" + statHistList_p[i].execID + " keep='" + statHistList_p[i].keep + "' title='" + statHistList_p[i].sequencer
			+ ", " + statHistList_p[i].plugins.replace(/,/g, ", ") + ", "+ statHistList_p[i].browser +"'>"
			+ statHistList_p[i].statDesc + "</option>");
	}

	$("#statID option[keep=Y]").each(function() {
		$(this).append("<img src=img/lock.png");
	});
}

function loadBatchExecStat(batchExecIdx_p) {
	parentWinObj.sendAction("mbtStatsList", "cmd=getStats&execID=" + batchExecList[batchExecIdx_p].execID + "&modelName=" + batchExecList[batchExecIdx_p].modelName, function(data) { 
		if (parentWinObj.actionCallback(data)) return;
		setStat(data);
		statLoaded = true;
	});
}

function loadBatchExecList(batchID_p) {
	parentWinObj.sendAction("mbtStatsList", "cmd=getExecBatch&batchID=" + batchID_p, function(data) { 
		if (parentWinObj.actionCallback(data)) return;
		batchExecList = data.execList;
		
		$(".batch select option").remove();
		var batchDesc = data.desc + " (batchID:" + data.batchID + "; start:" + data.startTS + ")";
		$("#batchExecTitle").attr("title", batchDesc);
		var htmlCode = "";
		for (var ii in data.execList) {
			var selected = "";
			if (parentWinObj.curAppState.execID==data.execList[ii].execID) {
				selected = "selected";
			}
			htmlCode += "<option value=" + ii + " " + selected + ">" + data.execList[ii].modelName + "(" +
					data.execList[ii].svrHost + ":" + data.execList[ii].svrPort  + ")</option>";
		}

		if (htmlCode!="") {
			$(htmlCode).appendTo($(".batch select"));
			$(".batch").show();
			$(".curView").hide();
		}
		else {
			$(".batch").hide();
			$(".curView").show();
		}
	});
}

function setStat (statObj_p) {
	parentWinObj.curAppState.execID = statObj_p.modelExec.execID;
	if (parentWinObj.curAppState.execID>0 && batchExecList==null && statObj_p.modelExec.batchID>0) {
		loadBatchExecList(statObj_p.modelExec.batchID);
	}
	
	setSummary(statObj_p);
	setTravStatList(statObj_p);
	setTagsStatList(statObj_p);
	
}

function formatDelta (fieldID_p, actualNum_p, averageNum_p, alertUp_p) {
	var changeDir = Math.floor(parseInt(actualNum_p) - parseInt(averageNum_p));
	var upClass = 'normal'; //'alert';
	var downClass = 'normal'
//	if (!alertUp_p) {
//		upClass = 'normal';
//		downClass = 'alert';
//	}
	var labelText = actualNum_p;
	if (changeDir>0) labelText = actualNum_p + "<span class='"+upClass+"'>&uarr;</span>";
	else if (changeDir<0) labelText = actualNum_p + "<span class='"+downClass+"'>&darr;</span>";
	
	$(fieldID_p).html(labelText).attr("title", "Average is " + averageNum_p);
}

function setSummary(statObj_p) {
	$("title").text("Model: " + statObj_p.modelExec.modelName);
	if (statObj_p.modelExec.execID<0) $("#statDesc").val("");
	else $("#statDesc").val(statObj_p.modelExec.statDesc);
			
	$("#browser").text(statObj_p.modelExec.browser);
	$("#plugins").text(statObj_p.modelExec.plugins);

	$("#mbtMode").text(statObj_p.modelExec.sequencer);
	$("#numLoop").text(statObj_p.modelExec.numLoop);
	$("#numThread").text(statObj_p.modelExec.numThread);
	
	$("#startTime").text(statObj_p.modelExec.startTime);
	$("#endTime").text(statObj_p.modelExec.endTime);
	$("#elapseTime").text(statObj_p.modelExec.elapseTime);
	
	$("#stateCoverageBar").progressBar(statObj_p.modelExec.stateCovPct);
	$("#stateTraversal").text(statObj_p.modelExec.stateTravCount);
	$("#stateCovered").text(statObj_p.modelExec.stateCovCount);
	$("#stateUncovered").text(statObj_p.modelExec.stateCount - statObj_p.modelExec.stateCovCount);

	$("#transCoverageBar").progressBar(statObj_p.modelExec.transCovPct);
	$("#transTraversal").text(statObj_p.modelExec.transTravCount);
	$("#transCovered").text(statObj_p.modelExec.transCovCount);
	$("#transUncovered").text(statObj_p.modelExec.transCount - statObj_p.modelExec.transCovCount);

	$("#tagsCoverageBar").progressBar(statObj_p.modelExec.tagCovPct);
	$("#tagsTraversal").text(statObj_p.modelExec.tagTravCount);
	$("#tagsCovered").text(statObj_p.modelExec.tagCovCount);
	$("#tagsUncovered").text(statObj_p.modelExec.tagCount-statObj_p.modelExec.tagCovCount);

//	if (statObj_p.mscript && statObj_p.modelExec.execID<0) {
		$("#mscriptStat").show();
		$("#mscriptCoverageBar").progressBar(statObj_p.modelExec.coveragePct);
		$("#mscriptCovered").text(statObj_p.modelExec.mscriptExec);
		$("#mscriptUncovered").text(statObj_p.modelExec.mscriptNotExec);
		$("#mscriptTraversals").text(statObj_p.modelExec.mscriptTraversals);
//	}
//	else {
//		$("#mscriptStat").hide();
//	}	
//	$("#exceptCount").text(statObj_p.modelExec.exceptCount);
}

// sets the stat into the display
var stat_i;

function setTravStatList(statObj_p) {
//	var mbtObj = parentWinObj.curAppState.nodeDataList["mbt"];
	$("#mode").text(statObj_p.modelExec.sequencer);
	if (statObj_p==undefined || statObj_p.update==undefined) {
		$("#statetransstats tbody tr").remove();
	}
	if (statObj_p==undefined) return;

	var mbtstatlist = $("#statetransstats"); 

	// create nonTraversal row
//	$("#sysExceptCount").text(statObj_p.modelExec.sysExceptCount.val);
	statRow = $("#nonTraversal");
	$(statRow).addClass("nonTraversal");

	LmsgList["nonTraversal"] = statObj_p.msgList;
	if (statObj_p.msgList.L1.length>0) {
		$(statRow).find(".L1").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L1');\">"+statObj_p.msgList.L1.length+"</a>");
	}
	if (statObj_p.msgList.L2.length>0) {
		$(statRow).find(".L2").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L2');\">"+statObj_p.msgList.L2.length+"</a>");
	}
	if (statObj_p.msgList.L3.length>0) {
		$(statRow).find(".L3").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L3');\">"+statObj_p.msgList.L3.length+"</a>");
	}
	if (statObj_p.msgList.L4.length>0) {
		$(statRow).find(".L4").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L4');\">"+statObj_p.msgList.L4.length+"</a>");
	}
	if (statObj_p.msgList.L5.length>0) {
		$(statRow).find(".L5").html("<a href=\"javascript:popupExceptMsg('nonTraversal', 'L5');\">"+statObj_p.msgList.L5.length+"</a>");
	}
	
	// create transition/state rows
	for (stat_i in statObj_p.statList) {
		var statKeyDesc =  statObj_p.statList[stat_i].statKey;
		var statKey = statKeyDesc.replace(/\./g, "_")
			.replace(/ /g, "_").replace(/\|/g, "_").replace(/#/g, "").replace(/\?/g, "_")
			.replace(/\*/g, "");
		var idxDot = statKeyDesc.indexOf(".");
		var statType = "state";
		if (idxDot>0) {
			statType = "transition";
			statKeyDesc = statKeyDesc.substring(0, idxDot) + ": " + statKeyDesc.substring (idxDot+1);
		}
		var shadeClass = "";
//		if (isShade(stat_i)) {
//			shadeClass = "shade";
//		}
		var statRow = $("#"+statKey);
		var maxOver = statObj_p.statList[stat_i].overLimit;
		if (maxOver==undefined || maxOver=="0") maxOver = "";
		if (statObj_p.update) {
			$(statRow + " .sampleSize").text(statObj_p.statList[stat_i].travCount);
			$(statRow + " .L1").text(statObj_p.statList[stat_i].L1.length);
			$(statRow + " .L2").text(statObj_p.statList[stat_i].L2.length);
			$(statRow + " .L3").text(statObj_p.statList[stat_i].L3.length);
			$(statRow + " .L4").text(statObj_p.statList[stat_i].L4.length);
			$(statRow + " .L5").text(statObj_p.statList[stat_i].L5.length);
			if (statObj_p.statList[stat_i].slowCount>0) $(statRow + " .Perf a").text(statObj_p.statList[stat_i].slowCount);
		}
		else {
			var isTrans = statKeyDesc.indexOf(":");
			var htmlCode = "<tr id='" + statKey + "' class='"+shadeClass+"'><td align='left' class=numField>" + statKeyDesc + "</td>";
			if (isTrans>=0) htmlCode += "<td class=numField align='center' class='sampleSize'>"+ statObj_p.statList[stat_i].travCount + "</td>";
			else htmlCode += "<td class=numField align='center' class='sampleSize'>&nbsp;</td>";
			htmlCode += "<td class=numField align='center'><span class='L1'>&nbsp;</span></td>"
				+"<td class=numField align='center'><span class='L2'>&nbsp;</span></td>"
				+"<td class=numField align='center'><span class='L3'>&nbsp;</span></td>"
				+"<td class=numField align='center'><span class='L4'>&nbsp;</span></td>"
				+"<td class=numField align='center'><span class='L5'>&nbsp;</span></td>"
				+"<td class=numField align='center'><span class='Perf'>&nbsp;</span></td>";
			
			if (statObj_p.statList[stat_i].rsp.val<0) {
//				htmlCode +="<td colspan=2>&nbsp;</td>";
				statObj_p.statList[stat_i].rsp.val = 0;
			}
//			else {	
				htmlCode += "<td align='right' valign='middle'><div class='bar'><div class='barMid'></div></div></td>";
				htmlCode += "<td align='left' class='barNum'>(<span class='average'>" +statObj_p.statList[stat_i].rsp.val+"</span><small><i>ms</i></small>)</td>";
//			}
			htmlCode += "</tr>";
			$(htmlCode).appendTo($(mbtstatlist));
			statRow = $("#"+statKey);
			$(statRow).addClass(statType);
		}
		
		LmsgList[statKey] = statObj_p.statList[stat_i];
		if (statObj_p.statList[stat_i].L1.length>0) {
			$(statRow).find(".L1").html("<a href=\"javascript:popupExceptMsg('"+statKey+"', 'L1');\">"+statObj_p.statList[stat_i].L1.length+"</a>");
		}
		if (statObj_p.statList[stat_i].L2.length>0) {
			$(statRow).find(".L2").html("<a href=\"javascript:popupExceptMsg('"+statKey+"', 'L2');\">"+statObj_p.statList[stat_i].L2.length+"</a>");
		}
		if (statObj_p.statList[stat_i].L3.length>0) {
			$(statRow).find(".L3").html("<a href=\"javascript:popupExceptMsg('"+statKey+"', 'L3');\">"+statObj_p.statList[stat_i].L3.length+"</a>");
		}
		if (statObj_p.statList[stat_i].L4.length>0) {
			$(statRow).find(".L4").html("<a href=\"javascript:popupExceptMsg('"+statKey+"', 'L4');\">"+statObj_p.statList[stat_i].L4.length+"</a>");
		}
		if (statObj_p.statList[stat_i].L5.length>0) {
			$(statRow).find(".L5").html("<a href=\"javascript:popupExceptMsg('"+statKey+"', 'L5');\">"+statObj_p.statList[stat_i].L5.length+"</a>");
		}
		if (statObj_p.statList[stat_i].slowCount>0) {
			$(statRow).find(".Perf").html("<a href=\"javascript:popupPerfMsg('"+statKey+"');\">"+statObj_p.statList[stat_i].slowCount+"</a>");
		}
		
		if (statObj_p.statList[stat_i].rsp) {
			var histoBar = $("#"+statKey+" .bar");
			var intervalStart = Math.round(statObj_p.statList[stat_i].rsp.val*0.8);
			var intervalEnd = Math.round(statObj_p.statList[stat_i].rsp.val*1.2);
			if (statObj_p.statList[stat_i].rsp.stdev > 0) {
				intervalStart = Math.round(statObj_p.statList[stat_i].rsp.avg - 3*statObj_p.statList[stat_i].rsp.stdev);
				intervalEnd = Math.round(statObj_p.statList[stat_i].rsp.avg + 3*statObj_p.statList[stat_i].rsp.stdev);
			}
	
			if (intervalStart<0) intervalStart = 0;
			
			var hoverMsg = "mean: " + statObj_p.statList[stat_i].rsp.avg + "; "
				+ "99% confidence range: " + intervalStart + " - " + intervalEnd;
			$(histoBar).attr("title", hoverMsg);
			var barWidth = $(histoBar).find(".bar").css("width");
			if (barWidth && barWidth!="auto") {
			 	barWidth = parseInt(barWidth.substring(0, barWidth.indexOf("px")));
			}
			else {
			 	barWidth = 100;
			}
			if (barWidth=="NaN") barWidth=100;
			barWidth = parseInt(barWidth)
			var histoPct = 0;
			if (intervalEnd-intervalStart>0) histoPct = (statObj_p.statList[stat_i].rsp.val - intervalStart) / (intervalEnd - intervalStart);
			if (histoPct<0) {
				histoPct = 0;
			}
			if (histoPct>1) {
				histoPct = 1;
			}
			var histoMidPos = Math.round((barWidth-2) * histoPct);
			$(histoBar).find(".barMid").css("left", histoMidPos + "px");
		}
	}
}

function setTagsStatList(statObj_p) {
	
	$("#tagstats tbody tr").remove();
	if (statObj_p==undefined) return;

	tagPassMsgList = new Array();
	tagFailMsgList = new Array();
	var mbtstatlist = $("#tagstats"); 

	// create nonTraversal row
	for (stat_i in statObj_p.tags) {
		var loopStat = statObj_p.tags[stat_i];
		var statKey = loopStat.tag;
		var priorityCode = loopStat.priority;
		var pIdx = statKey.indexOf(":");
		if (pIdx>0) {
			priorityCode = statKey.substring(0,pIdx);
			statKey = statKey.substring(pIdx+1);
		}
		
		var shadeClass = "";
//		if (isShade(stat_i)) {
//			shadeClass = "shade";
//		}
		var htmlCode = "<tr id='" + statKey + "' class=-_'" + priorityCode + "'>"
			+ "<td class='tagName'>" + statKey + "</td>"
			+ "<td width=1>" + priorityCode + "</td>";
		htmlCode += "<td class='numField passTrav' align='center'>" + loopStat.passCount + "</td>"
			+"<td class='numField failTrav' align='center'>" + loopStat.failCount + "</td>";

		htmlCode += "</tr>";
		$(htmlCode).appendTo($(mbtstatlist));
		tagPassMsgList[statKey] = loopStat.passMsgs;
		tagFailMsgList[statKey] = loopStat.failMsgs;
	}
	
	$(".passTrav").click(function() {
		var tagID = $(this).parent().attr("id");
		showTagMsg(tagID + ": Passed Traversals", "State.Transition", tagPassMsgList[tagID]);
	});

	$(".failTrav").click(function() {
		var tagID = $(this).parent().attr("id");
		showTagMsg(tagID + ": Failed Traversals", "State.Transition", tagFailMsgList[tagID]);
	});

}

function showTagMsg(title_p, columnLabel_p, msgList_p) {
	var msgText = "<div id=msgDialog><div class='header'>" + title_p + "</div>" +
		"<div><ol>";
	for (var i in msgList_p) {
		var msgTag = msgList_p[i];
		
		msgText += "<li>";
		if (msgTag.state) {
			msgText +=  msgTag.state;
			if (msgTag.trans) {
				msgText += "." + msgTag.trans;
			}
			if (msgTag.assertID!="") {
				msgText += " (" + msgTag.assertID + ")"; 
			}
			msgText += ": ";
		}
		msgText += msgTag.msg + "</li>";
	}
	msgText += "</ol></div></div>";
	alertDialog(resolveSnapID(msgText, parentWinObj.curAppState.execID));
//	alertDialog(msgText);
}

function popupPerfMsg(statKey_p) {
	alertDialog("Number of slow traversals: " 
			+ $("#" + statKey_p + " .Perf a").text());
	
}

function popupExceptMsg (statKey_p, level_p) {
	if (LmsgList[statKey_p]==undefined) return;
    if (LmsgList[statKey_p][level_p]==undefined) return;

	var msg = getExceptLevelMsg(statKey_p, level_p);
	if (msg==undefined) return;
	alertDialog(resolveSnapID(msg, parentWinObj.curAppState.execID));
}

function getExceptLevelMsg (statKey_p, level_p) {
	
	if (LmsgList[statKey_p][level_p]) {
		var msg = genString(LmsgList[statKey_p][level_p]);
		if (msg==undefined) return null;
		return resolveSnapID(msg, parentWinObj.curAppState.execID);
	}
	else return null;
}

// msg key is: stateId.eventId
function getExceptMsg (statKey_p) {
	var retMsg = "";
	try {
		var tempMsg = getExceptLevelMsg(statKey_p, "L1");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
		tempMsg = getExceptLevelMsg(statKey_p, "L2");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
		tempMsg = getExceptLevelMsg(statKey_p, "L3");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
		tempMsg = getExceptLevelMsg(statKey_p, "L4");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
		tempMsg = getExceptLevelMsg(statKey_p, "L5");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
		tempMsg = getExceptLevelMsg(statKey_p, "Perf");
		if (tempMsg && tempMsg!="") {
			retMsg += tempMsg + "<br>";
		}
	}
	catch (err){
		retMsg = "";
	}
	return retMsg;
}

var prop1;
function genString(msgList_p) {
	if (msgList_p==undefined || msgList_p.length<=0) {
		return undefined;
	}
	var msg = "<ol>";
	for (prop1 in msgList_p) {
		msg += "<li>"+msgList_p[prop1] + "</li>";
	}
	msg += "</ol>";
	return msg;
}



function filterType(filter_p) {
	$("#statetransstats tbody tr").show();
	if (filter_p=="ALL") return; 
	else if (filter_p=="STATE") $("#statetransstats tbody tr").not(".header").not(".state").hide();
	else $("#statetransstats tbody tr").not(".header").not(".transition").hide();
}

function toggleHide(elemID_p) {
	if ($("#"+elemID_p).is(":visible")) {
		$("#"+elemID_p).hide();
		$("#hide_" +elemID_p).attr("src", "img/plus.png");
	}
	else {
		$("#"+elemID_p).show();
		$("#hide_" +elemID_p).attr("src", "img/minus.png");
	}
}

// view stat in tab delimited format
/* no longer needed
function publishStat() {
	if (parentWinObj.curAppState.execID<=0) {
		alertDialog("stats.publish.not.allowed");
		return;
	}

	parentWinObj.sendAction("mbtStatsList", "cmd=publishStats&execID=" + parentWinObj.curAppState.execID, function(data) { 
		parentWinObj.actionCallback(data);
		statsReport = window.open("/model/" + parentWinObj.curAppState.webmbtObj.folderPath + "/" + parentWinObj.curAppState.nodeDataList["scxml"].filename + "/report/index.html", "ModelReport");
		statsReport.focus();
	});
}

function viewStat() {
	$.post("/MbtSvr/css/webmbtStat.css", "", function(data) {
		var newWin = window.open();
		var newDoc = newWin.document;
		var bodyHtml = $("body").html();
		newDoc.write("<style>"+data+"</style><h1>TestOptimal Stats Export</h1>" + bodyHtml);
		newDoc.close();
	}, "text");
}
*/

function showCurStats() {
	$(".hist").hide();
	$(".batch").hide();
	$(".curView").show();
}


function deleteStat() {
	parentWinObj.sendAction("mbtStatsList", "cmd=deleteStats&execID=" + parentWinObj.curAppState.execID, function(data) {
		parent.actionCallback(data);
		parentWinObj.curAppState.execID = -1;
		parentWinObj.refreshFrame("Stats");
	});
}


function openCoverageGraph() {
	parentWinObj.openCoverageGraph("execID=" + parentWinObj.curAppState.execID);
}

function openTravMSC() {
	parentWinObj.openTravMSC("execID=" + parentWinObj.curAppState.execID);
}

function getexecID() {
	return parentWinObj.curAppState.execID;
}


// from http://blog.pothoven.net/2006/07/get-request-parameters-through.html
function getRequestParam ( parameterName ) {
	var queryString = window.top.location.search.substring(1);
	// Add "=" to the parameter name (i.e. parameterName=value)
	var parameterName = parameterName + "=";
	if ( queryString.length > 0 ) {
	// Find the beginning of the string
		begin = queryString.indexOf ( parameterName );
		// If the parameter name is not found, skip it, otherwise return the value
		if ( begin != -1 ) {
			// Add the length (integer) to the beginning
			begin += parameterName.length;
			// Multiple parameters are separated by the "&" sign
			end = queryString.indexOf ( "&" , begin );
			if ( end == -1 ) {
				end = queryString.length
			}
			// Return the string
			return unescape ( queryString.substring ( begin, end ) );
		}
		// Return "null" if no parameter has been found
		return null;
	}
}

function adjustHeight() {
	$("#statsMain").css("height", $(window).height() - 32);
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
		display(params_p);
		adjustHeight();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return statLoaded;
	}
	else if (action_p=="loadStat") {
		loadStat(params_p);
	}
	else if (action_p=="loadCurrentStat") {
		loadCurrentStat();
	}
}

