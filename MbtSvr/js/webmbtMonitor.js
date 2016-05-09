// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtMonitor.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}

$(document).ready(function(){
	initFrame("Monitor");
	
	if (parentWinObj.curAppState.edition=="BasicMBT") {
		$(".nonBasic").hide();
	}
	
	if (!parentWinObj.curAppState.modelOpen) {
		return;
	}
	
	$("#execProgressBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#stateCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#transCoverageBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	$("#jvmMemBar").progressBar({ barImage: 'img/progressbg_orange.gif', showText: true} );
	
	if (parentWinObj.isModelCFG()) {
		$("#stateLabel").text("Node");
		$("#transLabel").text("Edge");
		$("#stateLabel2").text("Node");
		$("#transLabel2").text("Edge");
		$("#transCoverageLabel").text("Edge Coverage:");
		$("#transTravCountLabel").text("Edge Trav Count:");
		
	}
	adjustHeight();
	
	runUpdate();
});


function reset() {
	$(".field").text("");
	$("#execProgressBar").progressBar(0);
	$("#stateCoverageBar").progressBar(0);
	$("#transCoverageBar").progressBar(0);
	$("#jvmMemBar").progressBar(0);
}

// update the stat progress fields
function updateProgress(statusJSON_p) {
	if (statusJSON_p==undefined) {
		reset();
		return;
	}
	
	if (statusJSON_p.execStatus) {
		updateExecStats (statusJSON_p.execStatus);
		updatePerfStats (statusJSON_p.perfStats);
		updateRemoteCommandStats (statusJSON_p.cmdstats);
		updateRemoteSessions (statusJSON_p.agents);
	}
}
	
function updateExecStats(execStatus_p) {
	var execStatus = execStatus_p.execStatus;
	if (execStatus == "STARTED") execStatus = "RUNNING";
	if (execStatus!="UNKNOWN") {
		$("#execStatus").text(parentWinObj.translateMsg(execStatus));
	}
	
	$("#endTime").text(execStatus_p.endTime);
	$("#startTime").text(execStatus_p.startTime);
	$("#elapseTime").text(execStatus_p.elapseTime);
	$("#remaining").text(execStatus_p.remainingTime);
	if (parseInt(execStatus_p.progressPcnt)>=0) {
		$("#execProgressBar").progressBar(parseInt(execStatus_p.progressPcnt));
	}
	else {
		$("#execProgressBar").progressBar(100);
	}
	
	$("#dryRunFlag").text(execStatus_p.dryRunFlag);
	$("#debugFlag").text(execStatus_p.debugFlag);
	$("#stateTraversal").text(execStatus_p.stateTraversal);
	$("#stateCovered").text(execStatus_p.stateCovered);
	$("#stateCoverageBar").progressBar(parseInt(execStatus_p.stateCoverage));
	$("#stateUncovered").text(execStatus_p.stateUncovered);
	$("#transTraversal").text(execStatus_p.transTraversal);
	$("#transCovered").text(execStatus_p.transCovered);
	$("#transCoverageBar").progressBar(parseInt(execStatus_p.transCoverage));
	$("#transUncovered").text(execStatus_p.transUncovered);
	
	if (parentWinObj.curAppState.runMode=="modeling") {
		$("#mbtMode").text("Modeling");
	}
	else {
		$("#mbtMode").text(execStatus_p.mbtMode);
	}
	$("#numLoop").text(execStatus_p.numLoop);
	$("#numThread").text(execStatus_p.numThread);
	
	$("#jvmStat").text(execStatus_p.memoryMax);
	$("#jvmMemBar").progressBar(parseInt(execStatus_p.memoryUsedPct));
	$("#activeThreads").text(execStatus_p.activeThreads);
	$("#stopTransCoverage").text(execStatus_p.stopTransCoverage);
	$("#stopReqCoverage").text(execStatus_p.stopReqCoverage);
	$("#stopTransCount").text(execStatus_p.stopTransCount);
	$("#stopElapseTime").text(execStatus_p.stopMinute);
	$("#stopException").text(execStatus_p.stopException);
	$("#stopPathCount").text(execStatus_p.stopPathCount);
	$("#stopMsg").text(execStatus_p.stopMsg);
}

function updatePerfStats(perfStats_p) {
	$("#perfTCCount").text(perfStats_p.overall.testcase.count);
	$("#perfTCAvg").text(perfStats_p.overall.testcase.avg);
	$("#perfTCRate").text(perfStats_p.overall.testcase.rate);
	$("#perfTCMin").text(perfStats_p.overall.testcase.min);
	$("#perfTCMax").text(perfStats_p.overall.testcase.max);
	
	$("#perfStatesCount").text(perfStats_p.overall.states.count);
	$("#perfStatesAvg").text(perfStats_p.overall.states.avg);
	$("#perfStatesRate").text(perfStats_p.overall.states.rate);
	$("#perfStatesMin").text(perfStats_p.overall.states.min);
	$("#perfStatesMax").text(perfStats_p.overall.states.max);

	$("#perfTransCount").text(perfStats_p.overall.trans.count);
	$("#perfTransAvg").text(perfStats_p.overall.trans.avg);
	$("#perfTransRate").text(perfStats_p.overall.trans.rate);
	$("#perfTransMin").text(perfStats_p.overall.trans.min);
	$("#perfTransMax").text(perfStats_p.overall.trans.max);

	$("#exceptCount").text(perfStats_p.overall.excepts.count);
	$("#exceptAvg").text(perfStats_p.overall.excepts.avg);
	$("#exceptRate").text(perfStats_p.overall.excepts.rate);
	$("#exceptMin").text(perfStats_p.overall.excepts.min);
	$("#exceptMax").text(perfStats_p.overall.excepts.max);

	if (perfStats_p.workers) {
		$("#perfStatSec tbody>*").remove();
		for (var i in perfStats_p.workers) {
			var workerStats = perfStats_p.workers[i];
			var shade = "";
			if (i%2==0) shade = "class=shade";
			var htmlP = '<tr ' + shade + '>' +
			'<td class="label" rowspan=4>t' + i + '</td>' +
			'<td class="label">Test Cases</td>' +
			'<td align="center"><span class="field">' + workerStats.testcase.rate + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.testcase.count + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.testcase.avg + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.testcase.min + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.testcase.max + '</span></td>' +
			'</tr>' +
			'<tr ' + shade + '>' +
			'<td class="label">States</td>' +
			'<td align="center"><span class="field">' + workerStats.states.rate + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.states.count + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.states.avg + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.states.min + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.states.max + '</span></td>' +
			'</tr>' +
			'<tr ' + shade + '>' +
			'<td class="label">Trans</td>' +
			'<td align="center"><span class="field">' + workerStats.trans.rate + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.trans.count + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.trans.avg + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.trans.min + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.trans.max + '</span></td>' +
			'</tr>' +
			'<tr ' + shade + '>' +
			'<td class="label">Exceptions</td>' +
			'<td align="center"><span class="field">' + workerStats.excepts.rate + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.excepts.count + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.excepts.avg + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.excepts.min + '</span></td>' +
			'<td align="center"><span class="field">' + workerStats.excepts.max + '</span></td>' +
			'</tr>';
			$(htmlP).appendTo($("#perfStatSec tbody"));
			
		}
	}

}
	

function updateRemoteCommandStats(cmdStats_p) {
	var pluginListTemp = parentWinObj.curAppState.nodeDataList["scxml"].pluginID;
	$(".rmtAgent").hide();
	if (pluginListTemp==undefined) {
		return;
	}
	else {
		pluginListTemp = pluginListTemp.toUpperCase();
		if (pluginListTemp.indexOf("REMOTETRIGGER")<0 && pluginListTemp.indexOf("REMOTECOMMAND")<0) return;
	}
	
	$(".rmtAgent").show();
	
//	$("#remotecmds").show();
	$("#cmdStats>*").remove();
	var cmdStats = $("#cmdStats");
	var htmlCode;
	for (i=0; i<cmdStats_p.length; i++) {
		var shadeClass="";
		if (parentWinObj.isShade(i)) {
			shadeClass = "class='shade'";
		}
		
		var cmdStat = cmdStats_p[i];

		htmlCode = "<tr " + shadeClass + "><td>" + cmdStat.cmd + "</td><td align=center>" + cmdStat.stat.count 
			+ "</td><td align=center>" + cmdStat.stat.avg + "</td><td align=center>" + cmdStat.stat.min + "</td><td align=center>" 
			+ cmdStat.stat.max + "</td><td align=center>" + cmdStat.stat.stdev + "</td></tr>";
		$(htmlCode).appendTo($(cmdStats));
	}
}

function updateRemoteSessions(sessionInfo_p) {
	if (sessionInfo_p.agents && sessionInfo_p.agents.length>0) {
		$("#remotesessions").show();
	}
	else {
		$("#remotesessions").hide();
	}
	
	$("#remotesessions tbody tr").remove();
	if (sessionInfo_p==undefined) return;

	$("#assignedCount").text(sessionInfo_p.assigned);
	$("#unassignedCount").text(sessionInfo_p.unassigned);
	var sessList = $("#remotesessions tbody");
	var htmlCode;
	var i;
	for (i=0; i<sessionInfo_p.agents.length; i++) {
		var agentSess = sessionInfo_p.agents[i];
		var shadeClass="";
		if (parentWinObj.isShade(i)) {
			shadeClass = "class='shade'";
		}
		if (agentSess.status=="TimedOut") shadeClass = "class='alert'";
		htmlCode = "<tr " + shadeClass + "><td align=center>" + agentSess.agentid + "</td><td align=center>" + agentSess.status 
			+ "</td><td align=center>" + agentSess.reqtime + "</td><td align=center>" + agentSess.count + "</td><td align=center>" 
			+ agentSess.avgexec + "</td>";
		htmlCode += "<td><ul>";
		if (agentSess.curCmd!="") {
			htmlCode += "<li>cur: "+agentSess.curCmd+"</li>";
		}
		if (agentSess.prevCmd!="") {
			htmlCode += "<li>prev: "+agentSess.prevCmd+"</li>";
		}
		for (var j in agentSess.cmdQue) {
			htmlCode += "<li>next: "+agentSess.cmdQue[j]+"</li>";
		}
		htmlCode += "</ul></td></tr>";
		$(htmlCode).appendTo($(sessList));
	}
}


function snapScreen() {
	parentWinObj.sendAction ("snapScreen", "");
}

function setStarting() {
	$("#execStatus").text("STARTING");
}

function adjustHeight() {
	$("#monitorMain").css("height", $(window).height() - 34);
}

var execModeDisplayList = {exec: "Executing", paused: "Paused", STARTED: "Running", INTERRUPTED: "Interrupted", ERRORED: "Errored" }

function runUpdate() {
	parentWinObj.sendAction('debug', 'type=execStats', updateProgress);
}

function clearCmdStats () {
	parentWinObj.sendAction('debug', 'type=clearRmtCmdStats', function(data) {
		parentWinObj.actionCallback(data);
	});
}



// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
		return;
	}
	else if (action_p=="reset" || action_p=="cancel") {
		reset();
	}
	else if (action_p=="display") {
		runUpdate();
		adjustHeight();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return true;
	}
	else if (action_p=="setStarting") {
		setStarting();
	}
	else if (action_p=="setExecMode") {
		var status = execModelDisplayList[params_p];
		if (status) $("#execStatus").html (status);
	}
	else if (action_p=="updateProgress") {
		if (params_p==undefined) {
			if (parentWinObj && parentWinObj.curAppState.execMode=="exec") {
				runUpdate();
			}
		}
		else {
			updateProgress(params_p);
		}
	}
	else if (action_p=="updateRemoteSessions") {
		updateRemoteSessions(params_p);
	}
	else if (action_p=="updateRemoteCommandStats") {
		updateRemoteCommandStats(params_p);
	}
	else if (action_p=="updateSyncClock") {
		$("#syncClock").html(params_p);
	}
	else {
		alert("Monitor - unknown action: " + action_p);
	}
}
