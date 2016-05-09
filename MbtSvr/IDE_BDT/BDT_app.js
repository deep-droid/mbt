//var debug = false;
//var MainModule = angular.module("Main", []);

MainModule.controller("mainCtrl", function ($rootScope, $scope, IdeSize, IdeContext, IdeEvents) {
//	$scope.dragMode = false; // used by draggable and resizable
//	$scope.modalMode = false; // used by Modal Dialog
//	$scope.showAlert = false;

	$scope.windowResized = function () {
		$scope.viewHeight = IdeSize.viewHeight;
		$scope.viewWidth = IdeSize.viewWidth;
		$scope.ribbonHeight = IdeSize.ribbonHeight;
	}
    
	$scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: 'nocursor',
        mode: 'xml',
    };
	 
	$init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
//    	IdeEvents.regEvent ($scope, "main", "setDragMode", function(event, message) {
//    		$scope.dragMode = message;
//    		$scope.$apply();
//    	});
//    	
//    	IdeEvents.regEvent ($scope, "main", "setModalMode", function(event, message) {
//    		$scope.modalMode = message;
////    		$scope.$apply();
//    	});

		IdeContext.getCtx (function(returnData) {
			var ribbonFields = { appTitle: IDE_Name + " - Behavior-Driven Testing (BDT)",
					  edition: returnData.realprodlevel, 
					  version: returnData.TestOptimalVersion};

			$rootScope.$broadcast("setRibbonField", ribbonFields);
			$rootScope.$broadcast("appStarted");
		});
		
//		setTimeout (initCM, 50);
	}

	$init();
});


//MainModule.config(['$routeProvider', function($routeProvider) {
//	$routeProvider.when('/File', {templateUrl: 'ide/File/File.html', controller: 'FileCtrl'});
//	$routeProvider.when('/DataDesign', {templateUrl: 'ide/DataDesign/DataDesign.html', controller: 'DataDesignCtrl'});
//	$routeProvider.when('/Model', {templateUrl: 'ide/Model/Model.html', controller: 'ModelCtrl'});
//	$routeProvider.otherwise({redirectTo: '/File'});
//}]);
