
function resolveStatus (cntObj_p) {
	if (cntObj_p.failed && cntObj_p.failed>0) return 'failed';
	if (cntObj_p.blocked && cntObj_p.blocked>0) return "blocked";
	if (cntObj_p.passed && cntObj_p.passed>0) {
		if (cntObj_p.partial && cntObj_p.partial>0 || cntObj_p.none && cntObj_p.none>0) return "partial";
		else return "passed";
	}
	return "none";
}

//var MainModule = angular.module("Main", ['ngAnimate']);
MainModule.controller("SummaryCtrl", function($scope, IdeContext, IdeSize, IdeEvents) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

	$scope.TestCase = {};

	
	$scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		var screenID = "TestCaseSummary";
    	$scope.$on("$destroy", function () {
    		IdeContext.unregAllEvents($scope, screenID);
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
			$scope.TestCase = message;
		});
    };
    
    $scope.init();
});


MainModule.controller("ReqCtrl", function($rootScope, $scope, IdeEvents, IdeContext, IdeSize) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.TestCase = undefined;

    $scope.setCurTestCase = function (tcObj_p) {
    	$rootScope.$broadcast("selectTab", "ManualExecTC");
    	$rootScope.$broadcast("manualExec_selectTC", tcObj_p);
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	var screenID = "ManualExecReq";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
			$scope.TestCase = message;
		});
    };

    $scope.init();

});


MainModule.controller("StatusCtrl", function($rootScope, $scope, IdeEvents, IdeContext, IdeSize) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.TestCase = undefined;
	$scope.ExecSum = {
			tcNum: 0,
			tcCount: {done: '', passed: '', blocked: '', failed: '', none: '', partial: ''},
			tcStatusList: {done: [], passed: [], failed: [], blocked: [], partial: [], none: []},
			reqCount: {done: '', passed: '', blocked: '', failed: '', none: '', partial: ''},
			reqStatusList: {done: [], passed: [], failed: [], blocked: [], partial: [], none: []}
		};
	
	$scope.calcCountMsg = function (cnt, total) {
		var msg = cnt + ' / ' + (Math.round(cnt * 100 / total)) + '%';
		return msg;
	}
	

	$scope.calcExecSum = function () {
		var tcCntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
		$scope.ExecSum.tcStatusList.done.length = 0;
		$scope.ExecSum.tcStatusList.passed.length = 0;
		$scope.ExecSum.tcStatusList.failed.length = 0;
		$scope.ExecSum.tcStatusList.blocked.length = 0;
		$scope.ExecSum.tcStatusList.partial.length = 0;
		$scope.ExecSum.tcStatusList.none.length = 0;
		$scope.ExecSum.tcNum = $scope.TestCase.TestCaseList.length;
		angular.forEach($scope.TestCase.TestCaseList, function (tcObj_p) {
			if (tcObj_p.status==undefined || tcObj_p.status=="") tcObj_p.status = "none";
			tcCntObj [tcObj_p.status] = tcCntObj[tcObj_p.status] + 1;
			$scope.ExecSum.tcStatusList[tcObj_p.status].push(tcObj_p.tcID);
			if (tcObj_p.status == 'passed' || tcObj_p.status=='failed' || tcObj_p.status=='blocked') {
				tcCntObj.done = tcCntObj.done + 1;
				$scope.ExecSum.tcStatusList.done.push(tcObj_p.tcID);
			}
		});
		
		$scope.ExecSum.tcCount.passed = $scope.calcCountMsg (tcCntObj.passed, $scope.ExecSum.tcNum);
		$scope.ExecSum.tcCount.blocked = $scope.calcCountMsg (tcCntObj.blocked, $scope.ExecSum.tcNum);
		$scope.ExecSum.tcCount.failed = $scope.calcCountMsg (tcCntObj.failed, $scope.ExecSum.tcNum);
		$scope.ExecSum.tcCount.done = $scope.calcCountMsg (tcCntObj.done, $scope.ExecSum.tcNum);
		$scope.ExecSum.tcCount.partial = $scope.calcCountMsg (tcCntObj.partial, $scope.ExecSum.tcNum);
		$scope.ExecSum.tcCount.none = $scope.calcCountMsg (tcCntObj.none, $scope.ExecSum.tcNum);
		$scope.ExecSum.reqStatusList.done.length = 0;
		$scope.ExecSum.reqStatusList.passed.length = 0;
		$scope.ExecSum.reqStatusList.failed.length = 0;
		$scope.ExecSum.reqStatusList.blocked.length = 0;
		$scope.ExecSum.reqStatusList.partial.length = 0;
		$scope.ExecSum.reqStatusList.none.length = 0;
		
		var reqCntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
		angular.forEach($scope.TestCase.RequirementList, function (reqObj_p) {
			var reqCnt = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
			var reqStatus = 'none';
			angular.forEach($scope.TestCase.TestCaseList, function(tcObj_p) {
				reqStatus = tcObj_p.ReqStatusList[reqObj_p.tag];
				if (reqStatus==undefined) reqStatus = "none";
				reqCnt[reqStatus] = reqCnt[reqStatus] + 1;
			});
			
			reqStatus = resolveStatus(reqCnt);
			reqCntObj[reqStatus] = reqCntObj[reqStatus] + 1;
			if ($scope.ExecSum.reqStatusList[reqStatus].indexOf(reqObj_p.tag)<0) {
				$scope.ExecSum.reqStatusList[reqStatus].push(reqObj_p.tag);
			}
			if (reqStatus == 'passed' || reqStatus=='failed' || reqStatus=='blocked') {
				reqCntObj.done = reqCntObj.done + 1;
				if ($scope.ExecSum.reqStatusList.done.indexOf(reqObj_p.tag)<0) {
					$scope.ExecSum.reqStatusList.done.push(reqObj_p.tag);
				}
			}
		});
		
		$scope.ExecSum.reqNum = $scope.TestCase.RequirementList.length;
		$scope.ExecSum.reqCount.passed = $scope.calcCountMsg (reqCntObj.passed, $scope.ExecSum.reqNum);
		$scope.ExecSum.reqCount.blocked = $scope.calcCountMsg (reqCntObj.blocked, $scope.ExecSum.reqNum);
		$scope.ExecSum.reqCount.failed = $scope.calcCountMsg (reqCntObj.failed, $scope.ExecSum.reqNum);
		$scope.ExecSum.reqCount.done = $scope.calcCountMsg (reqCntObj.done, $scope.ExecSum.reqNum);
		$scope.ExecSum.reqCount.partial = $scope.calcCountMsg (reqCntObj.partial, $scope.ExecSum.reqNum);
		$scope.ExecSum.reqCount.none = $scope.calcCountMsg (reqCntObj.none, $scope.ExecSum.reqNum);
	}

    $scope.setCurTestCase = function (tcObj_p) {
    	$rootScope.$broadcast("selectTab", "ManualExecTC");
    	$rootScope.$broadcast("manualExec_selectTC", tcObj_p);
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	var screenID = "ManualExecStatus";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
    		$scope.TestCase = message;
		});
    	
    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='ManualExecStatus') {
        		$scope.calcExecSum();
    		}
		});
    };
    
    
    $scope.init();

});


MainModule.controller("DefectsCtrl", function($rootScope, $scope, IdeEvents, IdeContext, IdeSize) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.TestCase = undefined;
    $scope.defectList = [];
    
	$scope.getDefectList = function () {
		var url = "/MbtSvr/app=webmbt&action=defect&cmd=defectsList";
		$http.get(url)
			.success(function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					angular.forEach(returnData, function(defect_p) {
						defect_p.desc = unescape(defect_p.desc);
						defect_p.desc = defect_p.desc.trim();
						if (defect_p.desc=="<br/>") {
							defect_p.desc = "";
						}
					});
					$scope.defectList = returnData;
					$scope.defectLoaded = true;
				}
				else {
					logMsg("error", "Unable to retrieve defect list: " + returnData.error);
				}
			})
			.error(function(retData, status) {
				if (status==undefined) status = "not found";
				logMsg("error", "Unable to retrieve defect list: " + status);
			});
	}

    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	var screenID = "ManualExecDefects";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
    		$scope.TestCase = message;
    		$scope.defectList.length = 0;
    		$scope.defectLoaded = false;
		});

    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
			if (message=='ManualExecDefects' && !$scope.defectLoaded) {
				$scope.getDefectList();
			}
		});
    };

    $scope.init();

});



MainModule.controller("PreambleCtrl", function($rootScope, $scope, IdeEvents, IdeContext, IdeSize) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }


    $scope.TestCase = undefined;

    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	var screenID = "ManualExecPreamble";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
			$scope.TestCase = message;
		});
    };

    $scope.init();

});


MainModule.controller("PostambleCtrl", function($rootScope, $scope, IdeEvents, IdeContext, IdeSize) {
	$scope.headerHeight = 0;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }


    $scope.TestCase = undefined;

    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	var screenID = "ManualExecPostamble";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
			$scope.TestCase = message;
		});
    };

    $scope.init();

});


//this determines the order color is used for each type in chart
var reqStatusColors = ["green", "orange", "yellow", "gray"];
d3.scale.reqStatusColors = function() {
	return d3.scale.ordinal().range(reqStatusColors);
};
function getReqByStatus(TestCase) {
	var valueList = {passed: [], failed: [], blocked: [], none: []};
	var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
	for (i in TestCase.RequirementList) {
		var req = TestCase.RequirementList[i];
		var tag = req.tag;
		var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
		for (j in TestCase.TestCaseList) {
			var tc = TestCase.TestCaseList[j];
			for (k in tc.stepList) {
				var step = tc.stepList[k];
				for (m in step.verifyList) {
					var verify = step.verifyList[m];
					if (verify.tags.indexOf(tag)>=0 && reqCountList[verify.status]>=0) {
						reqCountList[verify.status] += 1;
					}	
				}
			}
			
		}
		valueList.passed.push({x: tag, y: reqCountList.passed});
		valueList.failed.push({x: tag, y: reqCountList.failed});
		valueList.blocked.push({x: tag, y: reqCountList.blocked});
		valueList.none.push({x: tag, y: reqCountList.none});
	}
	var graphData = [];
	graphData.push({ key: "Passed", values: valueList.passed});
	graphData.push({ key: "Failed", values: valueList.failed});
	graphData.push({ key: "Blocked", values: valueList.blocked});
	graphData.push({ key: "Not Covered", values: valueList.none});
	return graphData;
}

function drawReqByStatus(TestCase) {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d.x })
	        .y(function(d) { return d.y })		
			.color(d3.scale.reqStatusColors().range())
			.showControls(true);

	    //chart.xAxis.tickFormat(function(d) { return d;});

	    chart.yAxis.tickFormat(d3.format('d'));
	    
	    chart.multibar.stacked(true);

		chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
		//force nvd3 to show all labels
		chart.reduceXTicks(false);
		
		var data = getReqByStatus(TestCase);
	    d3.select('#reqByPriority')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);

	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
		setTimeout(chart.update,1500)
	    
		return chart;
	});
}

function getReqByTC(TestCase) {
	var valueList = {passed: [], failed: [], blocked: [], none: []};
	var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
	for (i in TestCase.TestCaseList) {
		var tc = TestCase.TestCaseList[i];
		var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
		for (j in TestCase.RequirementList) {
			var req = TestCase.RequirementList[j];
			var tag = req.tag;
			if (tc.RequirementList.indexOf(tag)<0) continue;
			var st = tc.ReqStatusList[tag];
			if (st==undefined || st=='none') reqCountList.none++;
			else if (st=='failed') reqCountList.failed++;
			else if (st=='passed') reqCountList.passed++;
			else if (st=='blocked') reqCountList.blocked++;
		}
		valueList.passed.push({x: tc.tcID, y: reqCountList.passed});
		valueList.failed.push({x: tc.tcID, y: reqCountList.failed});
		valueList.blocked.push({x: tc.tcID, y: reqCountList.blocked});
		valueList.none.push({x: tc.tcID, y: reqCountList.none});
	}
	var graphData = [];
	graphData.push({ key: "Passed", values: valueList.passed});
	graphData.push({ key: "Failed", values: valueList.failed});
	graphData.push({ key: "Blocked", values: valueList.blocked});
	graphData.push({ key: "Not Covered", values: valueList.none});
	return graphData;
}

function drawReqByTC(TestCase) {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d.x })
	        .y(function(d) { return d.y })		
			.color(d3.scale.reqStatusColors().range())
			.showControls(true);

	    //chart.xAxis.tickFormat(function(d) { return d;});

	    chart.yAxis.tickFormat(d3.format('d'));
	    
	    chart.multibar.stacked(true);

		chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
		//force nvd3 to show all labels
		chart.reduceXTicks(false);
		
		var data = getReqByTC(TestCase);
	    d3.select('#reqByTestCase')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);
	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
		setTimeout(chart.update,1500)
	    
	    return chart;
	});
}
function getReqByAssert(TestCase) {
	var valueList = {passed: [], failed: [], blocked: [], none: []};
	var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
	for (i in TestCase.TestCaseList) {
		var tc = TestCase.TestCaseList[i];
		var reqCountList = { passed: 0, failed: 0, blocked: 0, none: 0 };
		for (k in tc.stepList) {
			var step = tc.stepList[k];
			for (m in step.verifyList) {
				var verify = step.verifyList[m];
				reqCountList[verify.status] += 1;
			}
		}
		valueList.passed.push({x: tc.tcID, y: reqCountList.passed});
		valueList.failed.push({x: tc.tcID, y: reqCountList.failed});
		valueList.blocked.push({x: tc.tcID, y: reqCountList.blocked});
		valueList.none.push({x: tc.tcID, y: reqCountList.none});
	}
	var graphData = [];
	graphData.push({ key: "Passed", values: valueList.passed});
	graphData.push({ key: "Failed", values: valueList.failed});
	graphData.push({ key: "Blocked", values: valueList.blocked});
	graphData.push({ key: "Not Covered", values: valueList.none});
	return graphData;
}

function drawReqByAssert(TestCase) {
	nv.addGraph(function() {
	    var width = 350,
	        height = 260;

	    var chart = nv.models.multiBarChart()
			.x(function(d) { return d.x })
	        .y(function(d) { return d.y })		
			.color(d3.scale.reqStatusColors().range())
			.showControls(true);

	    //chart.xAxis.tickFormat(function(d) { return d;});

	    chart.yAxis.tickFormat(d3.format('d'));
	    
	    chart.multibar.stacked(true);

		chart.xAxis
		  .staggerLabels(false)
		  .rotateLabels(-35);
		
		//force nvd3 to show all labels
		chart.reduceXTicks(false);
		
		var data = getReqByAssert(TestCase);
	    d3.select('#testCaseExec')
	        .datum(data)
			//.attr('width', width)
			.attr('height', height)
			.transition()
			.duration(500)
			.call(chart);
	    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		nv.utils.windowResize(chart.update);
		setTimeout(chart.update,1500)
	    return chart;
	});
}


//
//
//var stList = ["partial","passed","blocked","failed","none"];
//
MainModule.controller("ProgressCtrl", function($rootScope, $scope, IdeSize, IdeEvents, IdeContext) {

    $scope.TestCase = undefined;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

	$scope.genCharts = function (chartID_p) {
		drawReqByStatus($scope.TestCase);
		drawReqByTC($scope.TestCase);
		drawReqByAssert($scope.TestCase);
	}

	$scope.init = function () {
    	var screenID = "ManualExecStatus";
		IdeSize.addListener($scope);
    	$scope.windowResized();

		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "manualExec_show", function (event, message) {
    		$scope.TestCase = message;
		});
		
    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='ManualExecProgress')
			$scope.genCharts();
		});

    };

    $scope.init();

});




MainModule.controller("TestCaseCtrl", function($scope, $http, $rootScope, IdeEvents, IdeContext, IdeSize) {
	$scope.preSplitPct = 10;
	$scope.splitPct = 10;
	$scope.headerHeight = 30;
	
    $scope.windowResized = function (runApply) {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 5;
		if (runApply) $scope.$apply();
    }
	
	$scope.TestCase = {};
	$scope.msgList = []; // msg object {time, type, msg}
	$scope.defectList = [];
	$scope.almEnabled = false;
	$scope.almActivated = false;
	
	$scope.curTestCase = {};
	$scope.changePending = false;
	

	$scope.setCurTestCase = function (tcObj_p) {
		if (tcObj_p.tcID==undefined) {
			var tcID = tcObj_p;
			for (var i in $scope.TestCase.TestCaseList) {
				var tcObj2 = $scope.TestCase.TestCaseList[i];
				if (tcID == tcObj2.tcID) {
					tcObj_p = tcObj2;
					break;
				}
			}
		}
		
		$scope.curTestCase = tcObj_p;
//		$scope.switchMode("testcase");
	}
	
	$scope.save = function () {
		var tcJSON = JSON.stringify ($scope.TestCase);
		var url = "/MbtSvr/app=webmbt&action=TestCase&cmd=saveTestCaseJSON";
		var params = {testcaseJSON: tcJSON};
		$.post(url, params, function(returnData) {
			if (returnData.alertMessage) {
				if (returnData.alertMessage=="ok") {
					$scope.changePending = false;
					$scope.logMsg("info", "Changes saved");
					$scope.$apply();
				}
				else {
					$scope.logMsg("error", "Error saving Test Case Report: " + returnData.alertMessage);
				}
			}
			else {
				$scope.logMsg("error", "Failed saving test case execution status.");
			}
		}, "json");
	}

	$scope.saveALM = function () {
//		if ($scope.almPendingChangeCount > 0) {
//			$scope.switchMode('ALMPendingChange');
//			return;
//		}
		
		var url = "";
		$scope.almChangeList = [];
		$scope.TestCase.almPendingChange = false;
		$scope.almPendingChangeCount = 0;
		$scope.almPendingChangeTotal = 0;
		if ($scope.almActivated) {
			angular.forEach($scope.TestCase.TestCaseList, function(tcObj_p) {
				$scope.saveChangeTestCase(tcObj_p);
			});
		}
		else {
			$scope.logMsg('alert', 'ALM is not activated.');
		}
		
		$scope.$apply();
//		}
//		else {
//			angular.forEach($scope.TestCase.TestCaseList, function(tcObj_p) {
//				$scope.clearChanged(tcObj_p);
//			});
//		}
	}

	$scope.saveChangeTestCase = function (tcObj_p) {
		if (tcObj_p.changed) {
			angular.forEach(tcObj_p.stepList, function(stepObj_p) {
				$scope.saveChangeStep(tcObj_p, stepObj_p);
			});
		}
	}

	$scope.saveChangeStep = function (tcObj_p, stepObj_p) {
		if (!stepObj_p.changed) {
			return;
		}
		
		angular.forEach(stepObj_p.verifyList, function(verifyObj_p) {
			$scope.saveVerifyItem(tcObj_p, stepObj_p, verifyObj_p);
		});
	}

	$scope.saveVerifyItem = function (tcObj_p, stepObj_p, verifyObj_p) {
		if (!verifyObj_p.changed) {
			return;
		}
		
		// changes that don't affect ALM
		if (verifyObj_p.status=="none" || verifyObj_p.status=="" || verifyObj_p.status=="blocked" ||
			verifyObj_p.tags.length<=0 && (verifyObj_p.assertID==undefined || verifyObj_p.assertID=='')) {
			verifyObj_p.changed = false;
			$scope.evalTestStepChanged(tcObj_p, stepObj_p);
			return;
		}

		var msg = tcObj_p.tcID + "[step: " + (tcObj_p.stepList.indexOf(stepObj_p)+1);
		if (verifyObj_p.tags.length>0) {
			msg += ", req: " + verifyObj_p.tags.join(" ");
		}
		if (verifyObj_p.assertID!='') {
			msg += ", assertID: " + verifyObj_p.assertID;
		}
		msg += "]";
		
		$scope.logMsg('info', 'Updating ALM for ' + msg);
//		var defectRecord = { "tcID": tcObj_p.tcID, 
//				  "step": tcObj_p.stepList.indexOf(stepObj_p)+1, 
//				  "tag": verifyObj_p.tags.join(";"), 
//				  "assertID": verifyObj_p.assertID, 
//				  "status": verifyObj_p.status, 
//				  "userCmt": verifyObj_p.statusCmt,
////				  "execMsg":verifyObj_p.msg,
//				  "execMsg":verifyObj_p.elseMsg,
//				  "saved": ''
//				};
		var defectRecord = undefined;
		var execMsg = verifyObj_p.msg;
		if (verifyObj_p.status!='passed') {
			execMsg = verifyObj_p.elseMsg;
		}
	    defectRecord = { "tcID": tcObj_p.tcID, 
			  "step": tcObj_p.stepList.indexOf(stepObj_p)+1, 
			  "tag": verifyObj_p.tags.join(";"), 
			  "assertID": verifyObj_p.assertID, 
			  "status": verifyObj_p.status, 
			  "userCmt": verifyObj_p.statusCmt,
			  "execMsg": execMsg,
			  "saved": ''
			};
    
		$scope.almChangeList.push(defectRecord);
		$scope.almPendingChangeCount += 1;
		$scope.almPendingChangeTotal += 1;
		$.post("/MbtSvr/app=webmbt&action=defect&cmd=updateDefect", defectRecord, 
			function(data) {
				if (data.alertMessage && data.alertMessage=="ok") {
					verifyObj_p.changed = false;
					defectRecord.saved = 'saved';
					$scope.changePending = true;
					$scope.almPendingChangeCount -= 1;

					$scope.evalTestStepChanged(tcObj_p, stepObj_p);
					if ($scope.almPendingChangeCount<=0) {
						$scope.save();
					}
				}
				else {
					if (data.alertMessage) {
						defectRecord.errorMsg = data.alertMessage;
						$scope.logMsg("error", data.alertMessage);
					}
					else if (data.error) {
						defectRecord.errorMsg = data.error;
						$scope.logMsg("error", data.error);
					}
					else {
						defectRecord.errorMsg = data;
						$scope.logMsg("error", data);
					}
				}
			});
	}

	$scope.evalTestStepChanged = function (tcObj_p, stepObj_p) {
		stepObj_p.changed = false;
		angular.forEach(stepObj_p.verifyList, function (verifyObj_p) {
			if (verifyObj_p.changed) {
				stepObj_p.changed = true;
			}
		});
		
		$scope.evalTestCaseChanged (tcObj_p);
	}
	
	$scope.evalTestCaseChanged = function (tcObj_p) {
		tcObj_p.changed = false;
		angular.forEach(tcObj_p.stepList, function(stepObj_p) {
			if (stepObj_p.changed) {
				tcObj_p.changed = true;
			}
		})
		$scope.$apply();
	}
	
	$scope.logMsg = function (msgType, msgText) {
		$scope.msgList.push({
			time: new Date,
			type: msgType,
			msg: msgText
		});
		
		if (msgType=="info") return;
		if ($scope.mode=="log") return;
		$scope.logMsgPending = true;
	}
	
	$scope.clearLogMsg = function () {
		$scope.msgList = [];
	}
	
	$scope.initTestCase = function () {
		$scope.curTestCase = null;
		angular.forEach($scope.TestCase.TestCaseList, function (tcObj_p) {
			if ($scope.curTestCase==null) {
				$scope.curTestCase = tcObj_p;
			}
			if (tcObj_p.status == undefined) tcObj_p.status = '';
//			tcObj_p.changed = false;
			if (tcObj_p.ReqStatusList==undefined) {
				tcObj_p.ReqStatusList = {};
				angular.forEach(tcObj_p.RequirementList, function (reqObj_p) {
					tcObj_p.ReqStatusList[reqObj_p.tag] = '';
				});
			}
			
//			$scope.clearChanged (tcObj_p);
		});
	}
	
	$scope.clearChanged = function (tcObj_p) {
		tcObj_p.changed = false;
		angular.forEach(tcObj_p.stepList, function(stepObj_p) {
			stepObj_p.changed = false;
			angular.forEach(stepObj_p.verifyList, function(verifyObj_p) {
				verifyObj_p.changed = false;
			});
		});
	}
	
	$scope.getReqDefn = function (reqTag_p) {
		angular.forEach($scope.TestCase.RequirementList, function (reqObj_p) {
			if (reqObj_p.tag==reqTag_p) return reqObj_p;
		});
		return null;
	}
	
	$scope.setChangePending = function () {
		$scope.changePending = true;
		$scope.TestCase.almPendingChange = true;
	}
	
	$scope.toggleAssertItemStatus = function (tcObj_p, stepObj_p, verifyObj_p, status_p) {
		if (verifyObj_p.status==status_p) {
			status_p = 'none';
		}
		$scope.setAssertItemStatus (tcObj_p, stepObj_p, verifyObj_p, status_p);
	}
	
	$scope.setAssertItemStatus = function (tcObj_p, stepObj_p, verifyObj_p, status_p) {
		$scope.setChangePending();
		verifyObj_p.status = status_p;
		angular.forEach(verifyObj_p.tags, function (tag_p) {
			$scope.updReqExecStatus(tcObj_p, tag_p);
		});
		
		verifyObj_p.changed = true;
		$scope.updTestStepStatus (tcObj_p, stepObj_p);
	}

//	$scope.resolveStatus = function (cntObj_p) {
//		if (cntObj_p.failed && cntObj_p.failed>0) return 'failed';
//		if (cntObj_p.blocked && cntObj_p.blocked>0) return "blocked";
//		if (cntObj_p.passed && cntObj_p.passed>0) {
//			if (cntObj_p.partial && cntObj_p.partial>0 || cntObj_p.none && cntObj_p.none>0) return "partial";
//			else return "passed";
//		}
//		return "none";
//	}
	
	$scope.reqStatusSym = {
		passed: "&#x2713;",
		partial: "&#x2713;",
		failed: "&#x2717;",
		blocked: "&#x2717;",
		none: ""
	}
	
	$scope.getReqStatusSym = function (tcObj_p, reqTag_p) {
		return $scope.reqStatusSym [tcObj_p.ReqStatusList[reqTag_p]];
	}
	
	$scope.updTestCaseStatus = function (tcObj_p) {
		var cntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0  };
		angular.forEach(tcObj_p.stepList, function(stepObj_p) {
			if (stepObj_p.status==undefined || stepObj_p.status=="") stepObj_p.status=='none';
			cntObj[stepObj_p.status] = cntObj[stepObj_p.status] + 1;
		});
		
		var status = resolveStatus (cntObj);
		tcObj_p.status = status;
		tcObj_p.changed = true;
	}

	$scope.updTestStepStatus = function (tcObj_p, stepObj_p) {
		var cntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0  };
		angular.forEach(stepObj_p.verifyList, function(verifyObj_p) {
			if (verifyObj_p.type!='assert') {
				verifyObj_p.status = "passed";
			}
			if (verifyObj_p.status==undefined || verifyObj_p.status=="") verifyObj_p.status=='none';
			cntObj[verifyObj_p.status] = cntObj[verifyObj_p.status] + 1;
		});
		
		var status = resolveStatus (cntObj);
		stepObj_p.status = status;
		stepObj_p.changed = true;
		$scope.updTestCaseStatus (tcObj_p);
	}
	
	$scope.updReqExecStatus = function (tcObj_p, reqTag_p) {
		var cntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0  };
		angular.forEach(tcObj_p.stepList, function (stepObj_p) {
			angular.forEach(stepObj_p.verifyList, function (verifyItem_p) {
				if (verifyItem_p.type!="assert") {
					cntObj.passed = cntObj.passed + 1;
				}
				else if (verifyItem_p.tags.indexOf(reqTag_p)>=0) {
					if (verifyItem_p.status==undefined || verifyItem_p.status=="") verifyItem_p.status = "none";
					cntObj[verifyItem_p.status] = cntObj[verifyItem_p.status] + 1;
				}
			});
		});
		
		var status = resolveStatus(cntObj);
		tcObj_p.ReqStatusList[reqTag_p] = status;
	}
	
	$scope.checkAll = function (tcObj_p, stepObj_p, status_p) {
		if (stepObj_p) {
			angular.forEach(stepObj_p.verifyList, function(assertItem_p) {
				$scope.setAssertItemStatus (tcObj_p, stepObj_p, assertItem_p, status_p);
			});
		}
		else {
			angular.forEach(tcObj_p.stepList, function (stepObj_p) {
				angular.forEach(stepObj_p.verifyList, function(assertItem_p) {
					$scope.setAssertItemStatus (tcObj_p, stepObj_p, assertItem_p, status_p);
				});
			});
		}
	}


	// resets all fields to default and sets changesPending=true (save button)
	$scope.resetTestCase = function (tcObj_p) {
		angular.forEach(tcObj_p.stepList, function (stepObj_p) {
			angular.forEach(stepObj_p.verifyList, function(assertItem_p) {
				$scope.setAssertItemStatus (tcObj_p, stepObj_p, assertItem_p, "none");
				assertItem_p.statusCmt = "";
			});
		});
		
//		if (skipCalc_p) return;
		$scope.changePending = true;
//		$scope.calcExecSum();
	}
	
	$scope.resetAll = function () {
		$scope.changePending = true;
		$scope.TestCase.almChangePending = false;
		angular.forEach($scope.TestCase.TestCaseList, function (tcObj_p) {
			$scope.resetTestCase(tcObj_p);
		});
		
//		$scope.calcExecSum();
	}
	
	$scope.getTestCase = function () {
		$http.get("/MbtSvr/app=webmbt&action=TestCase&cmd=getTestCaseJSON")
			.success(function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.TestCase = returnData;
					$scope.initTestCase(returnData);
					$scope.logMsg("info", "retrieved test cases from server");
//					setTimeout(documentReady);
					$rootScope.$broadcast("manualExec_show", $scope.TestCase);
				}
				else {
					$scope.logMsg("error", "Unable to retrieve Test Case Report: " + returnData.error);
				}
			})
			.error(function(retData, status) {
				if (status==undefined) status = "not found";
				$scope.logMsg("error", "Unable to retrieve Test Case Report: " + status);
			});
	}

	$scope.checkALM = function() {
		$http.get("/MbtSvr/app=webmbt&action=defect&cmd=almStatus") 
			.success(function(data, status) {
				if (data.alertMessage) {
					$scope.logMsg("error", "unable to confirm ALM status: " + data.alertMessage);
				}
				else {
					$scope.almEnabled = data.almStatus;
					if ($scope.almEnabled) {
						$scope.almActivated = true;
						$scope.logMsg("info", "ALM is enabled for the model");
					}
					else {
						$scope.logMsg("info", "ALM has not been enabled for the model. Changes will not be pushed to ALM system");
					}
				}
			})
			.error(function(retData,status) {
				if (status==undefined) status = "not found";
				$scope.logMsg("error", "Unable to check ALM status: " + status);
			});
	}


	$scope.print = function () {
		window.open('/MbtSvr/ManualExecPrint.html', '_blank');
	}
	
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	
    	var screenID = 'TestExecTC';
		$scope.checkALM();
    	$scope.getTestCase();
    	$scope.$on("$destroy", function () {
    		IdeContext.unregAllEvents($scope, screenID);
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "manualExec_selectTC", function (event, tcObj_p) {
    		$scope.setCurTestCase(tcObj_p);
		});
    	
    };

    $scope.init();

});



