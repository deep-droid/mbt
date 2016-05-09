//var debug = false;
//var MainModule = angular.module("Main", []);

MainModule.controller("mainCtrl", function ($rootScope, $scope, IdeContext, IdeEvents) {
    
    $scope.getViewWidth = function () {
    	return IdeSize.viewWidth;
    }

    $scope.getViewHeight = function () {
    	return IdeSize.viewHeight;
    }

    $scope.getRibbonHeight = function () {
    	return IdeSize.ribbonHeight;
    }
    
	$init = function () {
		IdeContext.getCtx (function(returnData) {
			var ribbonFields = { appTitle: IDE_Name + " - Dashboard & Execution Summary",
					  edition: returnData.realprodlevel, 
					  version: returnData.TestOptimalVersion};

			$rootScope.$broadcast("setRibbonField", ribbonFields);
			$rootScope.$broadcast("selectTab", "Dashboard");
			$rootScope.$broadcast("appStarted");
			
			if (ribbonFields.edition!='Dashboard') {
				$rootScope.$broadcast("hideTab", "DashConfig");
			}
		});
	}

	$init();
});


