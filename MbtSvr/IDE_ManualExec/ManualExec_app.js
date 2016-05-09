//var debug = false;
//var MainModule = angular.module("Main", []);

MainModule.controller("mainCtrl", function ($rootScope, $scope, IdeContext, IdeEvents, IdeSize) {

	$scope.windowResized = function () {
		$scope.viewHeight = IdeSize.viewHeight;
		$scope.viewWidth = IdeSize.viewWidth;
		$scope.ribbonHeight = IdeSize.ribbonHeight;
	}
//        
//    $scope.getViewWidth = function () {
//    	return IdeSize.viewWidth;
//    }
//
//    $scope.getViewHeight = function () {
//    	return IdeSize.viewHeight;
//    }
//
//    $scope.getRibbonHeight = function () {
//    	return IdeSize.ribbonHeight;
//    }
//    

	$scope.winTitle = "Manual Test Execution";
	$scope.ribbonFields = { appTitle: IDE_Name + " - " + $scope.winTitle,
			  edition: "Trial", 
			  version: ""};

	$init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();

    	IdeContext.getCtx (function(returnData) {
			$scope.ribbonFields.edition = returnData.realprodlevel;
			$scope.ribbonFields.version = returnData.TestOptimalVersion;

			$rootScope.$broadcast("setRibbonField", $scope.ribbonFields);
			$rootScope.$broadcast("selectTab", "ManualExecSummary");
			$rootScope.$broadcast("appStarted");
		});

    	IdeEvents.regEvent($scope, "ManualExecApp", "manualExec_show", function (event, message) {
    		$scope.ribbonFields.appTitle = $scope.winTitle + " - " + message.ModelName;
			$rootScope.$broadcast("setRibbonField", $scope.ribbonFields);
		});
	}

	$init();
});
