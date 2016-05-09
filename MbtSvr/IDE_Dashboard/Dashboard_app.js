
  
/*************customize color*******************/

//standard colors:["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

var reqPriorityColors = ["purple", "blue", "green", "gray"];
d3.scale.reqPriorityColors = function() {
	return d3.scale.ordinal().range(reqPriorityColors);
};
var tcStatusColors = ["green", "orange", "yellow","gray"];
d3.scale.tcStatusColors = function() {
	return d3.scale.ordinal().range(tcStatusColors);
};
//defect Severity Level
var defectSeverityLevelColors = ["gray","blue", "#2ca02c",  "#9467bd", "#8c564b"];
d3.scale.defectSeverityLevelColors = function() {
	return d3.scale.ordinal().range(defectSeverityLevelColors);
};
//colors for req status
var reqStatusColors = ["green", "orange", "yellow", "gray", "pink"];
d3.scale.reqStatusColors = function() {
	return d3.scale.ordinal().range(reqStatusColors);
};

//kpi colors
var kpiColorList = [];
d3.scale.kpiColors = function() {
	return d3.scale.ordinal().range(kpiColorList);
};

var projNameTruncLength = 6;

var statsSum = {};

/********1. Requirement Summary***************/
function getReqByPriority() {
	var graphData = [];
	var dashboard = statsSum.dashboard;
	graphData.push({ key: "High", y: dashboard.reqCountH});
	graphData.push({ key: "Medium", y: dashboard.reqCountM});
	graphData.push({ key: "Low", y: dashboard.reqCountL});
	graphData.push({ key: "Other", y: dashboard.reqCountO});
	
	return graphData;
}


function getReqByStatus() {
	var graphData = [];
	var dashboard = statsSum.dashboard;
	graphData.push({ key: "Passed", y: dashboard.reqPassCount});
	graphData.push({ key: "Failed", y: dashboard.reqFailCount});
	graphData.push({ key: "Blocked", y: dashboard.reqBlockCount});
	graphData.push({ key: "No-Cover", y: dashboard.reqNCCount});
	
	return graphData;
}

function getReqByExec() {
	var dashboard = statsSum.dashboard;
	var graphData = [];
	graphData.push({ key: "High", values: [{x:"Passed", y:dashboard.reqPassCountH}, {x:"Failed", y:dashboard.reqFailCountH}, {x:"Blocked", y:dashboard.reqBlockCountH}, {x:"No-Cover", y:dashboard.reqNCCountH}]});
	graphData.push({ key: "Medium", values: [{x:"Passed", y:dashboard.reqPassCountM}, {x:"Failed",  y:dashboard.reqFailCountM}, {x:"Blocked", y:dashboard.reqBlockCountM}, {x:"No-Cover", y:dashboard.reqNCCountM}]});
	graphData.push({ key: "Low", values: [{x:"Passed", y:dashboard.reqPassCountL}, {x:"Failed", y:dashboard.reqFailCountL}, {x:"Blocked", y:dashboard.reqBlockCountL}, {x:"No-Cover", y:dashboard.reqNCCountL}]});
	graphData.push({ key: "Other", values: [{x:"Passed", y:dashboard.reqPassCountO}, {x:"Failed", y:dashboard.reqFailCountO}, {x:"Blocked", y:dashboard.reqBlockCountO}, {x:"No-Cover", y:dashboard.reqNCCountO}]});
	return graphData;
}

function drawReqByPriority() {
	nv.addGraph(function() {
	    var width = 350,
	    height = 260;

	    var chart = nv.models.pieChart()
	        .x(function(d) { return d.key })
	        .y(function(d) { return d.y })
	        .color(d3.scale.reqStatusColors().range())
	        .showLegend(true)
	        .showLabels(false);

		  chart.pie.valueFormat(d3.format('d'));
	      d3.select("#reqByPriority")
	          .datum(getReqByStatus())
			  .transition()
			  .duration(1200)
	          //.attr('width', width)
	          .attr('height', height)
	          .call(chart);

	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
		setTimeout(chart.update,1500)
	    
	    return chart;
	});
}

function drawReqByStatus() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d.x })
	        .y(function(d) { return d.y })		
			.color(d3.scale.reqPriorityColors().range())
			.showControls(true);

	    //chart.xAxis.tickFormat(function(d) { return d;});

	    chart.yAxis.tickFormat(d3.format('d'));
	    
	    chart.multibar.stacked(true);

		chart.xAxis
		  .staggerLabels(false);
//		  .rotateLabels(-35);
		
		//force nvd3 to show all labels
		chart.reduceXTicks(false);
		
		var data = getReqByExec();
	    d3.select('#ReqByStatus')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);
		
	    return chart;
	});
}

/********2. Test Case Summary***************/
function getTCByPriority() {
	var dashboard = statsSum.dashboard;
	var graphData = [];	
	graphData.push({ key: "Passed", y: dashboard.tcPassCount});
	graphData.push({ key: "Failed", y: dashboard.tcFailCount});
	graphData.push({ key: "Blocked", y: dashboard.tcBlockCount});
	graphData.push({ key: "Partial", y: dashboard.tcPartialCount});
	return graphData;
}
function getTCByProject() {
	var projData = statsSum.projData;
	var graphData = [];	 
	projData.forEach(function(project){
		graphData.push({ key: project.project, values: [["Passed", project.stats.tcPassCount], ["Failed", project.stats.tcFailCount], ["Blocked", project.stats.tcBlockCount], ["Partial", project.stats.tcPartialCount]]});
	});	
	
	return graphData;
}

function drawTCByStatus () {
	nv.addGraph(function() {
	    var width = 350,
	    height = 260;

	    var chart = nv.models.pieChart()
	        .x(function(d) { return d.key })
	        .y(function(d) { return d.y })
	        .color(d3.scale.tcStatusColors().range())
	        //.width(width)
	        //.height(height)
	        .showLegend(true)
	        .showLabels(false);
		chart.pie.valueFormat(d3.format('d'));
		
	    d3.select("#TCByStatus")
	          .datum(getTCByPriority())
			  .transition()
			  .duration(1200)
	          //.attr('width', width)
	          .attr('height', height)
	          .call(chart);

	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
	    setTimeout(chart.update, 500)
	    return chart;
	});
}


function drawTCByProj() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d[0]; })
	        .y(function(d) { return d[1]; })
		.showControls(true)
		.legendKey(function(d){
			if(d.key.length > projNameTruncLength){
				return d.key.substring(0,projNameTruncLength)+"...";
			}
			return d.key;
		});
	    
		chart.xAxis
		  .staggerLabels(false);
//		  .rotateLabels(-35);
		  
	    chart.reduceXTicks(false);

	    chart.yAxis.tickFormat(d3.format('d'));
	    
	    chart.multibar.stacked(true);
		var data = getTCByProject();
//	    console.log(data);	
	    d3.select('#TCByProject')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);
	    
	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

/********3. Defects Summary***************/
function getDefectBySeverity() {	
	var dashboard = statsSum.dashboard;
	var graphData = [];	
	graphData.push({ key: "L1", y: dashboard.defectL1});
	graphData.push({ key: "L2", y: dashboard.defectL2});
	graphData.push({ key: "L3", y: dashboard.defectL3});
	graphData.push({ key: "L4", y: dashboard.defectL4});
	graphData.push({ key: "L5", y: dashboard.defectL5});
	return graphData;
}
function getDefectByProject() {
	var projData = statsSum.projData;
	var graphData = [];
	projData.forEach(function(project){
		graphData.push({ key: project.project, values: [["L1", project.stats.defectL1], ["L2", project.stats.defectL2], ["L3", project.stats.defectL3], ["L4", project.stats.defectL4], ["L5", project.stats.defectL5]]});
	});	
	
	return graphData;
}

function drawDefectBySeverity() {
	nv.addGraph(function() {
	    var width = 350,
	    height = 260;

	    var chart = nv.models.pieChart()
	        .x(function(d) { return d.key })
	        .y(function(d) { return d.y })
	        .color(d3.scale.defectSeverityLevelColors().range())
	        //.width(width)
	        .height(height)
	        .showLegend(true)
	        .showLabels(false);

	      d3.select("#DefectBySeverity")
	          .datum(getDefectBySeverity())
			  .transition()
			  .duration(1200)
	          //.attr('width', width)
	          .attr('height', height)
	          .call(chart);

	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
	    
	    return chart;
	});
}

function drawDefectByProject() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d[0]; })
	        .y(function(d) { return d[1]; })
			.showControls(true)
			.legendKey(function(d){
				if(d.key.length > projNameTruncLength){
					return d.key.substring(0,projNameTruncLength)+"...";
				}
				return d.key;
			});

	    //chart.xAxis.tickFormat(d3.format(',f'));

	    chart.yAxis.tickFormat(d3.format('d'));
	    //force nvd3 to show all labels
		chart.reduceXTicks(false);
		
	    chart.multibar.stacked(true);
		var data = getDefectByProject();
//	    console.log(data);	
	    d3.select('#DefectByProject')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}



/********4. Historical Trend - Requirement***************/
function getHistReqByStatus() {
	var summaryTrendData = statsSum.summaryTrendData;
	var graphData = [];	
	var passedValues = 	new Array();
	var failedValues = 	new Array();
	var blockedValues = new Array();
	var partialValues = new Array();	

	summaryTrendData.forEach(function(summaryTrend){
		passedValues.push([summaryTrend.date, summaryTrend.stats.reqPassCount]);
		failedValues.push([summaryTrend.date, summaryTrend.stats.reqFailCount]);
		blockedValues.push([summaryTrend.date, summaryTrend.stats.reqBlockCount]);
		partialValues.push([summaryTrend.date, summaryTrend.stats.reqNCCount]);
	});	

	graphData.push({key:"Passed", values: passedValues});
	graphData.push({key:"Failed", values: failedValues});
	graphData.push({key:"Blocked", values: blockedValues});
	graphData.push({key:"Not-Cover", values: partialValues});
	
	return graphData;
}

function getHistReqByProject() {
	var projTrendData = statsSum.projTrendData;
	var projData = statsSum.projData;
	
	var graphData = [];	
	var projTrendDataObj = new Object();
	projData.forEach(function(project){
		projTrendDataObj[project.project] = new Array();
	});

	//https://github.com/cmaurer/angularjs-nvd3-directives/issues/112
	//d3 is sensitive to the length of the data in each series. It is important that they be the same length, otherwise you will get errors like these.
	//Uncaught TypeError: Cannot read property '1' of undefined
	
	projTrendData.forEach(function(projTrend){	
		projData.forEach(function(project){
			var found = false;
			projTrend.histStats.forEach(function(histStats){				
				if(histStats.project == project.project){
					projTrendDataObj[histStats.project].push([projTrend.date, histStats.stats.reqCount]);
					found = true;
				}
			});		
			//It is important that they be the same length,
			if(!found){
				projTrendDataObj[project.project].push([projTrend.date, 0]);
			}
		});		
	});	
	
	projData.forEach(function(project){
		graphData.push({key:project.project, values:projTrendDataObj[project.project]});
	});	
//	console.log(graphData);
	return graphData;
}

function drawHistReqByStatus() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
					  .color(d3.scale.reqStatusColors().range())
	                  .clipEdge(true);

		var data = getHistReqByStatus();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
		
	    chart.xAxis
				.tickFormat(function(d) { 
				  return d3.time.format('%m-%d')(new Date(d)) 
				});

	    chart.yAxis.tickFormat(d3.format('d'));
	    
		chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
//	    console.log(data);	
	    d3.select('#HistReqByStatus')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

function drawHistReqByProject() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
					  //.color(d3.scale.reqStatusColors().range())
	                  .clipEdge(true)
					  .legendKey(function(d){
						if(d.key.length > projNameTruncLength){
							return d.key.substring(0,projNameTruncLength)+"...";
						}
						return d.key;
					  });

		var data = getHistReqByProject();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

	    chart.yAxis.tickFormat(d3.format('d'));
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
	    d3.select('#HistReqByProject')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

/********5.Historical Trend - Test Case Execution***************/
function getHistTCByStatus() {
	var graphData = [];	
	var passedValues = 	new Array();
	var failedValues = 	new Array();
	var blockedValues = 	new Array();
	var partialValues = 	new Array();	

	var summaryTrendData = statsSum.summaryTrendData;
	summaryTrendData.forEach(function(summaryTrend){
		passedValues.push([summaryTrend.date, summaryTrend.stats.tcPassCount]);
		failedValues.push([summaryTrend.date, summaryTrend.stats.tcFailCount]);
		blockedValues.push([summaryTrend.date, summaryTrend.stats.tcBlockCount]);
		partialValues.push([summaryTrend.date, summaryTrend.stats.tcPartialCount]);
	});	

	graphData.push({key:"Passed", values: passedValues});
	graphData.push({key:"Failed", values: failedValues});
	graphData.push({key:"Blocked", values: blockedValues});
	graphData.push({key:"Partial", values: partialValues});
	
	return graphData;
}

function getHistTcByProject() {
	var projData = statsSum.projData;
	var projTrendData = statsSum.projTrendData;
	var graphData = [];	
	var projTrendDataObj = new Object();
	projData.forEach(function(project){
		projTrendDataObj[project.project] = new Array();
	});
	
	projTrendData.forEach(function(projTrend){	
		projData.forEach(function(project){
			var found = false;
			projTrend.histStats.forEach(function(histStats){				
				if(histStats.project == project.project){
					projTrendDataObj[histStats.project].push([projTrend.date, histStats.stats.tcCount]);
					found = true;
				}
			});		
			//It is important that they be the same length,
			if(!found){
				projTrendDataObj[project.project].push([projTrend.date, 0]);
			}
		});		
	});	
	
	projData.forEach(function(project){
		graphData.push({key:project.project, values:projTrendDataObj[project.project]});
	});	
//	console.log(graphData);
	return graphData;
}

function drawHistTCByStatus() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
					  .color(d3.scale.tcStatusColors().range())
	                  .clipEdge(true);

		var data = getHistTCByStatus();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
			});

		chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		  
	    chart.yAxis.tickFormat(d3.format('d'));
	    
//	    console.log(data);	
	    d3.select('#HistTCByStatus')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

function drawHistTCByProject() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
	                  .clipEdge(true)
					.legendKey(function(d){
						if(d.key.length > projNameTruncLength){
							return d.key.substring(0,projNameTruncLength)+"...";
						}
						return d.key;
					});

	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

		var data = getHistTcByProject();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
	    chart.yAxis.tickFormat(d3.format('d'));
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
	    d3.select('#HistTCByProject')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}


/********6.Historical Trend - Defects***************/
function getHistDefectByStatus() {
	var graphData = [];	
	var l1Values = 	new Array();
	var l2Values = 	new Array();
	var l3Values = 	new Array();
	var l4Values = 	new Array();	
	var l5Values = 	new Array();	

	var summaryTrendData = statsSum.summaryTrendData;
	summaryTrendData.forEach(function(summaryTrend){
		l1Values.push([summaryTrend.date, summaryTrend.stats.defectL1]);
		l2Values.push([summaryTrend.date, summaryTrend.stats.defectL2]);
		l3Values.push([summaryTrend.date, summaryTrend.stats.defectL3]);
		l4Values.push([summaryTrend.date, summaryTrend.stats.defectL4]);
		l5Values.push([summaryTrend.date, summaryTrend.stats.defectL5]);
	});	

	graphData.push({key:"L1", values: l1Values});
	graphData.push({key:"L2", values: l2Values});
	graphData.push({key:"L3", values: l3Values});
	graphData.push({key:"L4", values: l4Values});
	graphData.push({key:"L5", values: l5Values});
	
	return graphData;
}

function getHistDefectByProject() {
	var graphData = [];	
	var projData = statsSum.projData;
	var projTrendData = statsSum.projTrendData;
	
	var projTrendDataObj = new Object();
	projData.forEach(function(project){
		projTrendDataObj[project.project] = new Array();
	});
	
	projTrendData.forEach(function(projTrend){	
		projData.forEach(function(project){
			var found = false;
			projTrend.histStats.forEach(function(histStats){				
				if(histStats.project == project.project){
					projTrendDataObj[histStats.project].push([projTrend.date, histStats.stats.defectCount]);
					found = true;
				}
			});		
			//It is important that they be the same length,
			if(!found){
				projTrendDataObj[project.project].push([projTrend.date, 0]);
			}
		});		
	});	
	
	projData.forEach(function(project){
		graphData.push({key:project.project, values:projTrendDataObj[project.project]});
	});	
//	console.log(graphData);
	return graphData;
}

function drawHistDefectByStatus() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
					  .color(d3.scale.defectSeverityLevelColors().range())
	                  .clipEdge(true);

	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

		var data = getHistDefectByStatus();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
	    chart.yAxis.tickFormat(d3.format('d'));
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
//	    console.log(data);	
	    d3.select('#HistDefectByStatus')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

function drawHistDefectByProject() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
	                  .clipEdge(true)
					.legendKey(function(d){
						if(d.key.length > projNameTruncLength){
							return d.key.substring(0,projNameTruncLength)+"...";
						}
						return d.key;
					});

	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

	    chart.yAxis.tickFormat(d3.format('d'));
		
		var data = getHistDefectByProject();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
		
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
	    d3.select('#HistDefectByProject')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

// draw kpi hist
function getHistKPIVal() {
	var graphData = [];	
	var trendData = statsSum.kpiTrendData.kpiValHist;
	
	for (kpiName in trendData){
		var dataArray = new Array();
		trendData[kpiName].forEach (function(dataObj){
			dataArray.push([dataObj.date, dataObj.val]);
		});
		graphData.push ({key: kpiName, values: dataArray});
	}	

	//	console.log(graphData);
	return graphData;
}

function getHistKPIColor() {
	var graphData = [];	
	var trendData = statsSum.kpiTrendData.kpiColorHist;
	var colorCountList = {};
	kpiColors = [];
	for (var i in trendData) {
		var dataArray = new Array();
		var dateElem = trendData[i];
		dateElem.colorCounts.forEach (function(dataObj){
			var color = dataObj.color;
			var cnt = colorCountList[color];
			if (cnt==undefined) {
				colorCountList[color] = 1;
				kpiColors.push(color);
			}
			else {
				colorCountList[color] = cnt + 1;
			}
			dataArray.push([dateElem.date, cnt]);
		});
		graphData.push ({key: color, values: dataArray});
	}	

	//	console.log(graphData);
	return graphData;
}

function drawHistKPIVal() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
	                  .clipEdge(true)
					.legendKey(function(d){
						if (d.key.charAt(0)=='#') {
							d.key = d.key.substring(1);
						}
						if(d.key.length > projNameTruncLength){
							return d.key.substring(0,projNameTruncLength)+"...";
						}
						return d.key;
					});

	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

	    chart.yAxis.tickFormat(d3.format('d'));
		
		var data = getHistKPIVal();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
		
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
	    d3.select('#HistKPIVal')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

function drawHistKPIColor() {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	 	var chart = nv.models.stackedAreaChart()
	                  .margin({right: 100})
	                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
	                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
	                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
	                  .rightAlignYAxis(false)      //Let's move the y-axis to the left side.
	                  .transitionDuration(500)
	                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
					  .color(d3.scale.kpiColors().range())
	                  .clipEdge(true)
					.legendKey(function(d){
						if (d.key.charAt(0)=='#') {
							d.key = d.key.substring(1);
						}
						if(d.key.length > projNameTruncLength){
							return d.key.substring(0,projNameTruncLength)+"...";
						}
						return d.key;
					});

	    chart.xAxis
	        .tickFormat(function(d) { 
	          return d3.time.format('%m-%d')(new Date(d)) 
	    });

	    chart.yAxis.tickFormat(d3.format('d'));
		
		var data = getHistKPIColor();
		if(data.length > 0) {
			chart.xAxis.tickValues(data[0].values.map( function(d){return d[0];} ) );
		}
		
	    chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
	    d3.select('#HistKPIColor')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    nv.utils.windowResize(chart.update);

	    return chart;
	});
}

MainModule.controller("DashCtrl", function ($rootScope, $scope, $http, IdeEvents, IdeSize, DashboardSvc) {
	$scope.headerHeight = 25;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
        $scope.dashTrendChartDrawn = false;
        $scope.dashboardChartDrawn = false;
    }

    
    $scope.statsSum = {};

    $scope.statsSumLoaded = false;
    
    $scope.refreshDashboard = function () {
 		DashboardSvc.getStatsSum (function (returnData) {
 			$scope.statsSum = returnData;
 			var dashboard = $scope.statsSum.dashboard;
 			
 			$scope.summaryReq = [
 			     		   		{status: "Passed", high: dashboard.reqPassCountH, medium: dashboard.reqPassCountM, low: dashboard.reqPassCountL, other: dashboard.reqPassCountO, total: dashboard.reqPassCountH+dashboard.reqPassCountM+dashboard.reqPassCountL+dashboard.reqPassCountO },
 			     		   		{status: "Failed", high: dashboard.reqFailCountH, medium: dashboard.reqFailCountM, low: dashboard.reqFailCountL, other: dashboard.reqFailCountO, total: dashboard.reqFailCountH+dashboard.reqFailCountM+dashboard.reqFailCountL+dashboard.reqFailCountO },
 			     		   		{status: "Blocked", high: dashboard.reqBlockCountH, medium: dashboard.reqBlockCountM, low: dashboard.reqBlockCountL, other: dashboard.reqBlockCountO, total: dashboard.reqBlockCountH+dashboard.reqBlockCountM+dashboard.reqBlockCountL+dashboard.reqBlockCountO },
 			     		   		{status: "No-Cover", high: dashboard.reqNCCountH, medium: dashboard.reqNCCountM, low: dashboard.reqNCCountL, other: dashboard.reqNCCountO, total: dashboard.reqNCCountH+dashboard.reqNCCountM+dashboard.reqNCCountL+dashboard.reqNCCountO }
 			     		   ];
 	 		$scope.summaryReqTotal = {
 	 				countH: dashboard.reqPassCountH + dashboard.reqFailCountH + dashboard.reqBlockCountH + dashboard.reqNCCountH, 
 	 				countM: dashboard.reqPassCountM + dashboard.reqFailCountM + dashboard.reqBlockCountM + dashboard.reqNCCountM, 
 	 				countL: dashboard.reqPassCountL + dashboard.reqFailCountL + dashboard.reqBlockCountL + dashboard.reqNCCountL,
 	 				countO: dashboard.reqPassCountO + dashboard.reqFailCountO + dashboard.reqBlockCountO + dashboard.reqNCCountO
 	 		}
 	 		
 	 		for (var i=1;  i<$scope.summaryReq.length; i++) {
 	 			if ($scope.summaryReq[i].high <=0) $scope.summaryReq[i].high = undefined;
 	 			if ($scope.summaryReq[i].medium <=0) $scope.summaryReq[i].medium = undefined;
 	 			if ($scope.summaryReq[i].low <=0) $scope.summaryReq[i].low = undefined;
 	 			if ($scope.summaryReq[i].other <=0) $scope.summaryReq[i].other = undefined;
 	 			if ($scope.summaryReq[i].total <=0) $scope.summaryReq[i].total = undefined;
 	 		}
 	 		
 	 		$scope.tcExec = {
 	 			tcCount: dashboard.tcCount,
 	 			tcFailCount: dashboard.tcFailCount,
 	 			tcBlockCount: dashboard.tcBlockCount,
 	 			tcPartialCount: dashboard.tcPartialCount,
 	 			tcStepCount: dashboard.tcStepCount
 	 		}
 	 		
 	 		$scope.kpiList = $scope.statsSum.kpiData;
 	 		
 	 		statsSum = $scope.statsSum;
 	 		
 	 	    $scope.test = Math.random();
 	 	    $scope.statsSumLoaded = true;
 	 	    
 	 		$scope.drawDashboardCharts();
 	 		
// 			d3.selectAll(".nv-bar").on('click',
//               function(){
//                 	console.log("test");
//	           });
//
// 			$rootScope.$broadcast("refreshDashboard", "");
 	 		
 	 		if ($scope.statsSum.alert) {
 	 			$rootScope.$broadcast("postMsg", {msgType: "alert", msgText: $scope.statsSum.alert});
 	 		}
 		});
    }

    $scope.getKpiRanges = function (kpi_p) {
    	var list = [];
    	angular.forEach (kpi_p.rangeList, function(range_p) {
    		list.push(range_p.color + ": " + (range_p.min==''?'':range_p.min + kpi_p.suffix) + " -" +  (range_p.max==''?'':range_p.max + kpi_p.suffix));
    	});
    	
    	return list.join(";  ");
    }

    
    $scope.drawDashboardCharts = function () {
		drawReqByPriority();
		drawReqByStatus();
 		drawTCByStatus ();
		drawTCByProj();
 		drawDefectByProject();
 		drawDefectBySeverity();
    }

    $scope.init = function () {
    	var screenID = "Dashboard";
		IdeSize.addListener($scope);
    	$scope.windowResized();
    	
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, $scope.screenID);
		});
		
		$scope.refreshDashboard();
		
    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='Dashboard' && $scope.statsSumLoaded) {
    			$scope.drawDashboardCharts();
    		}
    	});
    };
    
	$scope.init();
});

MainModule.controller("TrendCtrl", function ($rootScope, $scope, $http, IdeEvents, IdeSize, DashboardSvc) {
	$scope.headerHeight = 25;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.getKpiRanges = function (kpi_p) {
    	var list = [];
    	angular.forEach (kpi_p.rangeList, function(range_p) {
    		list.push(range_p.color + ": " + (range_p.min==''?'':range_p.min + kpi_p.suffix) + " -" +  (range_p.max==''?'':range_p.max + kpi_p.suffix));
    	});
    	
    	return list.join(";  ");
    }

    $scope.drawDashTrendCharts = function () {
        if ($scope.dashTrendChartDrawn) return;
 	    $scope.dashTrendChartDrawn = true;
		drawHistReqByProject();
 		drawHistReqByStatus();
 		drawHistTCByProject();
 		drawHistTCByStatus();
 		drawHistDefectByStatus();
 		drawHistDefectByProject();
 		drawHistKPIVal();
// 		drawHistKPIColor();
    }
    
    $scope.initDone = false;
    $scope.init = function () {
    	var screenID = "Trend";
		IdeSize.addListener($scope);
    	$scope.windowResized();
    	
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, $scope.screenID);
		});
		
    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='DashTrend') {
    			$scope.drawDashTrendCharts();
    		}

    	});
    };
    
	$scope.init();
});

