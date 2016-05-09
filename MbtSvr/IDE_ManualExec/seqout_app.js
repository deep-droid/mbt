
$(document).ready(function() {
	$(".graph img").dblclick(function() {
		var tbWidth = $(".testcase").width();
		$(this).height(($(this).height()*tbWidth/$(this).width()) + "px");
		$(this).width(tbWidth+"px");
	}).attr("title","Double click to resize the image to fill the width of the screen.");
});

var MainModule = angular.module("Main", []);
MainModule.controller("TestCaseCtrl", function($scope, $http) {
	$scope.TestCase = {};
	$scope.ExecSum = {
			tcNum: 0,
			tcCount: {done: '', passed: '', failed: '', blocked: '', none: '', partial: ''},
			tcStatusList: {},
			reqCount: {done: '', passed: '', failed: '', blocked: '', none: '', partial: ''},
			reqStatusList: {}
		};
		
	$scope.getTestCase = function () {
		$http.get("/MbtSvr/app=webmbt&action=TestCase&cmd=getTestCaseJSON")
			.success(function(returnData, status) {
				if (returnData.error==undefined) {
					$scope.TestCase = returnData;
					$scope.initTestCase(returnData);
				}
				else {
					alert("Unable to retrieve Test Case Report (rptName=" + rptName + ": " + returnData.error);
				}
			})
			.error(function(retData, status) {
				if (status==undefined) status = "not found";
				alert("Unable to retrieve Test Case Report (rptName=" + rptName + ": " + status);
			});
	}
	
	$scope.initTestCase = function () {
		angular.forEach($scope.TestCase.TestCaseList, function (tcObj_p) {
			if (tcObj_p.status == undefined) tcObj_p.status = '';
			if (tcObj_p.ReqStatusList==undefined) {
				tcObj_p.ReqStatusList = {};
				angular.forEach(tcObj_p.RequirementList, function (reqObj_p) {
					tcObj_p.ReqStatusList[reqObj_p.tag] = '';
				});
			}
		});
	}
	
	
	$scope.getReqDefn = function (reqTag_p) {
		angular.forEach($scope.TestCase.RequirementList, function (reqObj_p) {
			if (reqObj_p.tag==reqTag_p) return reqObj_p;
		});
		return null;
	}
	
	$scope.setAssertItemStatus = function (tcObj_p, stepObj_p, verifyObj_p, status_p) {
		verifyObj_p.status = status_p;
		angular.forEach(verifyObj_p.tags, function (tag_p) {
			$scope.updReqExecStatus(tcObj_p, tag_p);
		});
		$scope.updTestStepStatus (tcObj_p, stepObj_p);
	}

	$scope.resolveStatus = function (cntObj_p) {
		if (cntObj_p.failed && cntObj_p.failed>0) return 'failed';
		if (cntObj_p.blocked && cntObj_p.blocked>0) return "blocked";
		if (cntObj_p.passed && cntObj_p.passed>0) {
			if (cntObj_p.partial && cntObj_p.partial>0 || cntObj_p.none && cntObj_p.none>0) return "partial";
			else return "passed";
		}
		return "none";
	}
	
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
		
		var status = $scope.resolveStatus (cntObj);
		tcObj_p.status = status;
	}

	$scope.updTestStepStatus = function (tcObj_p, stepObj_p) {
		var cntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0  };
		angular.forEach(stepObj_p.verifyList, function(verifyObj_p) {
			if (verifyObj_p.status==undefined || verifyObj_p.status=="") verifyObj_p.status=='none';
			cntObj[verifyObj_p.status] = cntObj[verifyObj_p.status] + 1;
		});
		
		var status = $scope.resolveStatus (cntObj);
		stepObj_p.status = status;
		
		$scope.updTestCaseStatus (tcObj_p);
	}
	
	$scope.updReqExecStatus = function (tcObj_p, reqTag_p) {
		var cntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0  };
		angular.forEach(tcObj_p.stepList, function (stepObj_p) {
			angular.forEach(stepObj_p.verifyList, function (verifyItem_p) {
				if (verifyItem_p.tags.indexOf(reqTag_p)>=0) {
					if (verifyItem_p.status==undefined || verifyItem_p.status=="") verifyItem_p.status = "none";
					cntObj[verifyItem_p.status] = cntObj[verifyItem_p.status] + 1;
				}
			});
		});
		
		var status = $scope.resolveStatus(cntObj);
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

	$scope.calcCountMsg = function (cnt, total) {
		var msg = cnt + ' / ' + (Math.round(cnt * 100 / total)) + '%';
		return msg;
	}
	
	$scope.calcExecSum = function () {
		var tcCntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
		$scope.ExecSum.tcStatusList.done = [];
		$scope.ExecSum.tcStatusList.passed = [];
		$scope.ExecSum.tcStatusList.failed = [];
		$scope.ExecSum.tcStatusList.blocked = [];
		$scope.ExecSum.tcStatusList.partial = [];
		$scope.ExecSum.tcStatusList.none = [];
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
		$scope.ExecSum.reqStatusList.done = [];
		$scope.ExecSum.reqStatusList.passed = [];
		$scope.ExecSum.reqStatusList.failed = [];
		$scope.ExecSum.reqStatusList.blocked = [];
		$scope.ExecSum.reqStatusList.partial = [];
		$scope.ExecSum.reqStatusList.none = [];
		
		var reqCntObj = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
		angular.forEach($scope.TestCase.RequirementList, function (reqObj_p) {
			var reqCnt = { failed: 0, blocked: 0, passed: 0, none: 0, partial: 0, done: 0};
			var reqStatus = 'none';
			angular.forEach($scope.TestCase.TestCaseList, function(tcObj_p) {
				reqStatus = tcObj_p.ReqStatusList[reqObj_p.tag];
				if (reqStatus==undefined) reqStatus = "none";
				reqCnt[reqStatus] = reqCnt[reqStatus] + 1;
			});
			
			reqStatus = $scope.resolveStatus(reqCnt);
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

	$scope.resetAll = function () {
		angular.forEach($scope.TestCase.TestCaseList, function (tcObj_p) {
			angular.forEach(tcObj_p.stepList, function (stepObj_p) {
				angular.forEach(stepObj_p.verifyList, function(assertItem_p) {
					$scope.setAssertItemStatus (tcObj_p, stepObj_p, assertItem_p, "none");
					assertItem_p.statusCmt = "";
				});
			});
		});
		
		$scope.calcExecSum();
	}
	
    $scope.init = function () {
    	$scope.getTestCase();
    	
    	$scope.$on("$destroy", function () {
    		IdeContext.unregAllEvents($scope, 'TestCaseExec');
    	});
    	
    };
    
	
	
    $scope.init();
	
	
	
});

function resizeAll() {
	$(".graph img").filter(function() {
		return ($(this).width() > $(".testcase").width());
	}).dblclick();
}

function getRequestFile (  ) {
	var queryString = window.top.location.search.substring(1);
	var plist = queryString.split("/");
	var file = plist[plist.length-1];
	return file;
}

