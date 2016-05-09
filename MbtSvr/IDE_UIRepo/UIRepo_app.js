MainModule.controller("mainCtrl", function ($rootScope, $scope, IdeSize, IdeContext, IdeEvents) {

	$scope.windowResized = function () {
		$scope.viewHeight = IdeSize.viewHeight;
		$scope.viewWidth = IdeSize.viewWidth;
		$scope.ribbonHeight = IdeSize.ribbonHeight;
	}
    
	$scope.postEvent = function (eventID, data) {
		$rootScope.$broadcast(eventID, data);
	}
	
	$init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		IdeContext.getCtx (function(returnData) {
			var ribbonFields = { appTitle: IDE_Name + " - UI Repository",
					  edition: returnData.realprodlevel, 
					  version: returnData.TestOptimalVersion};
			$rootScope.$broadcast("setRibbonField", ribbonFields);
			$rootScope.$broadcast("appStarted");
		});
	}

	$init();
});

