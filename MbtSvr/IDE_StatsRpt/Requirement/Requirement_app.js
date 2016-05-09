// stColorList is also defined in Coverage_app.js
var stColorList = {
		partial: "#89bbd8",
		passed: "#4da944",
		blocked: "#f26522",
		failed: "#c6080d",
		none: "#672d8b",
		done: "#ce1797"
};


MainModule.controller("ReqCtrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents) {
	$scope.headerHeight = 20;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

	$scope.stColorList = stColorList;

    $scope.curModelExec = {};
    $scope.refreshReqList = function () {
    	
    }
    
    $scope.gotoTestCase = function (tcObj_p) {
    	$rootScope.$broadcast("showTestCase", tcObj_p.tcID);
    	$rootScope.$broadcast("selectTab", "TestCase");
    }
    
    $scope.saveStatDesc = function () {
    	var url = "/MbtSvr/app=websvc&action=statSvc&cmd=saveStatDesc&model=" + $scope.curModelExec.modelExec.modelName + "&execID=" + $scope.curModelExec.modelExec.execID + "&statDesc=" + $scope.curModelExec.modelExec.statDesc;
    	IdeContext.callURL (url, function() {
    		$rootScope.$broadcast("renameModelExec", {execID: $scope.curModelExec.modelExec.execID, statDesc: $scope.curModelExec.modelExec.statDesc});
    	});
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		$scope.refreshReqList();
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'Requirement');
		});
		
		IdeEvents.regEvent($scope, "requirement", "menu_Refresh", function (event, message) {
			if (tabRequirement.selected) {
				$scope.refreshReqList();
			}
		});
		
		IdeEvents.regEvent($scope, "requirement", "showModelExec", function (event, message) {
			$scope.curModelExec = message;
		});

    };
    
	$scope.init();
});
