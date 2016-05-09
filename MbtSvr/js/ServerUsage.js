// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerUsage.js

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(refresh);

var svrList;

var viewMemData;
var viewSessionsData;
var viewThreadsData;

var viewHourlyMode = true;
var viewMaxMetrics = true;

var filterCatCode = "ALL";
var filterSvrName = "ALL";

var hourlyMemData;
var hourlySessionsData;
var hourlyThreadsData;

var dailyMemData;
var dailySessionsData;
var dailyThreadsData;


var hourlyMaxMemData;
var hourlyMaxSessionsData;
var hourlyMaxThreadsData;

var dailyMaxMemData;
var dailyMaxSessionsData;
var dailyMaxThreadsData;


var stacked = true;
var chartWidthPx = 1200;
var chartHeightPx = 400;

$(document).ready(function() {
	initFrame("ServerStats");
	window.onbeforeunload = checkClosing;
	adjustHeight();
});

function checkClosing() {
	if (!inIFrame) parentWinObj.restoreTab("ServerStats");
}



function display() {
	refresh();
}

function refresh() {
	parentWinObj.sendActionUtil("license", "cmd=getSvrUsage", function(data) {
		svrList = data.svrList;
		if (svrList.length<=0) {
			parentWinObj.alertDialog("No servers stats available");
			return;
		}

		hourlyMemData = google.visualization.arrayToDataTable(data.hourlyMemStats);
		hourlySessionsData = google.visualization.arrayToDataTable(data.hourlySessionsStats);
		hourlyThreadsData = google.visualization.arrayToDataTable(data.hourlyThreadsStats);
	
		dailyMemData = google.visualization.arrayToDataTable(data.dailyMemStats);
		dailySessionsData = google.visualization.arrayToDataTable(data.dailySessionsStats);
		dailyThreadsData = google.visualization.arrayToDataTable(data.dailyThreadsStats);

		hourlyMaxMemData = google.visualization.arrayToDataTable(data.hourlyMaxMemStats);
		hourlyMaxSessionsData = google.visualization.arrayToDataTable(data.hourlyMaxSessionsStats);
		hourlyMaxThreadsData = google.visualization.arrayToDataTable(data.hourlyMaxThreadsStats);
	
		dailyMaxMemData = google.visualization.arrayToDataTable(data.dailyMaxMemStats);
		dailyMaxSessionsData = google.visualization.arrayToDataTable(data.dailyMaxSessionsStats);
		dailyMaxThreadsData = google.visualization.arrayToDataTable(data.dailyMaxThreadsStats);

		var catList = [];
		var svrCodeList = [];

		$("#svrList option").remove();
		for (var i in svrList) {
			svrCodeList.push(svrList[i].name);
			for (var j in svrList[i].cat) {
				catList.push(svrList[i].cat[j]);
			}
		}
		svrCodeList.sort();
		calList = getDistinctList(catList).sort();

		$("<option value='ALL'></option>").appendTo($("#svrList"));
		for (var k in svrCodeList) {
			$("<option value='" + svrCodeList[k] + "'>" + svrCodeList[k] + "</option>").appendTo($("#svrList"));
		}
				
		$("#catList option").remove();
		$("<option value='ALL'></option>").appendTo($("#catList"));
		for (var k in calList) {
			$("<option value='" + calList[k] + "'>" + calList[k] + "</option>").appendTo($("#catList"));
		}
		
		if (viewHourlyMode) {
			setHourlyView();
		}
		else {
			setDailyView();
		}
	});
}

function getDistinctList(list_p) {
   var a = [];
    var l = list_p.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If list_p[i] is found later in the array
        if (list_p[i] === list_p[j])
          j = ++i;
      }
      a.push(list_p[i]);
    }
    return a;
}


function setHourlyView() {
	viewHourlyMode = true;
	drawChart();
}

function setDailyView() {
	viewHourlyMode = false;
	drawChart();
}


function filterSvr(obj) {
	filterSvrName = obj.value;
	drawChart();
}

function selectMetrics(obj) {
	if (obj.value=="Avg") {
		viewMaxMetrics = false;
	}
	else {
		viewMaxMetrics = true;
	}
	drawChart();
}

function filterCat(obj) {
	filterCatCode = obj.value;
	drawChart();
}

function setStackedChart(stacked_p) {
	stacked = stacked_p;
	drawChart();
}

function setWidth(newWidth) {
	chartWidthPx = 800;
	chartWidthPx = parseInt(newWidth);
	drawChart();
}

function setHeight(newHeight) {
	chartHeightPx = 400;
	chartHeightPx = parseInt(newHeight);
	drawChart();
}

function applyViewFilter() {
	if (viewMaxMetrics) {
		if (viewHourlyMode) {
			viewMemData = new google.visualization.DataView(hourlyMaxMemData);
			viewSessionsData = new google.visualization.DataView(hourlyMaxSessionsData);
			viewThreadsData = new google.visualization.DataView(hourlyMaxThreadsData);
		}
		else {
			viewMemData = new google.visualization.DataView(dailyMaxMemData);
			viewSessionsData = new google.visualization.DataView(dailyMaxSessionsData);
			viewThreadsData = new google.visualization.DataView(dailyMaxThreadsData);
		}
	}
	else {
		if (viewHourlyMode) {
			viewMemData = new google.visualization.DataView(hourlyMemData);
			viewSessionsData = new google.visualization.DataView(hourlySessionsData);
			viewThreadsData = new google.visualization.DataView(hourlyThreadsData);
		}
		else {
			viewMemData = new google.visualization.DataView(dailyMemData);
			viewSessionsData = new google.visualization.DataView(dailySessionsData);
			viewThreadsData = new google.visualization.DataView(dailyThreadsData);
		}
	}
		
	var colList = [];
	colList.push(0);
	for (var i in svrList) {
		if ((filterSvrName=="ALL" || svrList[i].name==filterSvrName) &&
			(filterCatCode=="ALL" || svrList[i].cat.join(",").indexOf(filterCatCode)>=0)) {
			colList.push(parseInt(i)+1);
		}
	}
	
	var colTxt = ".setColumns([" + colList.join(",") + "])";
	eval("viewMemData" + colTxt);
	eval("viewSessionsData" + colTxt);
	eval("viewThreadsData" + colTxt);
}

function drawChart() {
	applyViewFilter();	
	
	var memChart = new google.visualization.ColumnChart(document.getElementById('memUsage'));
	var sessionChart = new google.visualization.ColumnChart(document.getElementById('sessionUsage'));
	var threadChart = new google.visualization.ColumnChart(document.getElementById('threadUsage'));

	if (viewHourlyMode) {
		memChart.draw(viewMemData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx,title: 'Memory Usage % (Hourly)', hAxis: {textPosition: 'out', showTextEvery: 1, title: 'Hour of Day', titleTextStyle: {color: 'blue'}}});
		sessionChart.draw(viewSessionsData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx, title: 'Session Count (Hourly)', hAxis: {showTextEvery: 1, title: 'Hour of Day', titleTextStyle: {color: 'blue'}}});
		threadChart.draw(viewThreadsData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx, title: 'Threads Count (Hourly)', hAxis: {showTextEvery: 1, title: 'Hour of Day', titleTextStyle: {color: 'blue'}}}); 
	}
	else {
		memChart.draw(viewMemData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx, title: 'Memory Usage (Daily)', hAxis: {textPosition: 'out', showTextEvery: 1, title: 'Day of Month', titleTextStyle: {color: 'red'}}});
		sessionChart.draw(viewSessionsData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx, title: 'Session Stats (Daily)', hAxis: {textPosition: 'out', showTextEvery: 1, title: 'Day of Month', titleTextStyle: {color: 'red'}}});
		threadChart.draw(viewThreadsData, {isStacked: stacked, width: chartWidthPx, height: chartHeightPx, title: 'Threads Stats (Daily)', hAxis: {textPosition: 'out', showTextEvery: 1, title: 'Day of Month', titleTextStyle: {color: 'red'}}});
	}
}


function adjustHeight() {
	$("#chartArea").css("height", $(window).height() - 30);
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
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return statLoaded;
	}
}