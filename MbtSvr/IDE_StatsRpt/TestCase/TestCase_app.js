

MainModule.controller("TestCaseCtrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, IdeUtil) {
	$scope.splitPct = 15;
	$scope.headerHeight = 2;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.curModelExec.tcList, "tcID", filter, "hide"); 
    	return;
    }


	$scope.curTestCase = {};
	$scope.curModelExec = {};

    $scope.refreshTestCaseList = function () {
    	
    }
    
    $scope.openTestCase = function (tcObj_p) {
    	$scope.curTestCase = tcObj_p;
    	angular.forEach ($scope.curModelExec.tcList, function(tcObj2_p) {
    		tcObj2_p.selected = false;
    	});
    	$scope.curTestCase.selected = true;
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		$scope.refreshTestCaseList();
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'TestCase');
		});
		
		IdeEvents.regEvent($scope, "testcase", "menu_Refresh", function (event, message) {
			if (tabTestCase.selected) {
				$scope.refreshTestCaseList();
			}
		});

		IdeEvents.regEvent($scope, "testcase", "showModelExec", function (event, message) {
			$scope.curModelExec = message;
		});

		IdeEvents.regEvent($scope, "testcase", "showTestCase", function (event, message) {
			var tcID = message;
			angular.forEach ($scope.curModelExec.tcList, function(tcObj_p) {
				if (tcObj_p.tcID==tcID) {
					$scope.openTestCase(tcObj_p);
				}
			});
		});

    };
    
	$scope.init();
});
