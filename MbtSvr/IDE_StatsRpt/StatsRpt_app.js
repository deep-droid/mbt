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
			var ribbonFields = { appTitle: IDE_Name + " - Test Execution Stats",
					  edition: returnData.realprodlevel, 
					  version: returnData.TestOptimalVersion};

			$rootScope.$broadcast("setRibbonField", ribbonFields);
			$rootScope.$broadcast("selectTab", "Model");
			$rootScope.$broadcast("appStarted");
		});
	}

	$init();
});


//MainModule.config(['$routeProvider', function($routeProvider) {
//	$routeProvider.when('/File', {templateUrl: 'ide/File/File.html', controller: 'FileCtrl'});
//	$routeProvider.when('/DataDesign', {templateUrl: 'ide/DataDesign/DataDesign.html', controller: 'DataDesignCtrl'});
//	$routeProvider.when('/Model', {templateUrl: 'ide/Model/Model.html', controller: 'ModelCtrl'});
//	$routeProvider.otherwise({redirectTo: '/File'});
//}]);

