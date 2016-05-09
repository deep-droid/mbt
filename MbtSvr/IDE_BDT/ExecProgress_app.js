
MainModule.controller("ExecProgressCtrl", function($rootScope, $scope, IdeEvents, IdeContext, BDT_Svc) {

    $scope.fieldDefList = {
		example: "Field interaction group is used to group fields to have the specified interaction strength that is different from the strength set for the dataset. For example you may use pairwise strength for the dataset except for a set of fields you want to have 4-wise strength to increase the test coverage."
    };
    
    postMsg = function (msgType, msgText) {
		$rootScope.$broadcast("postMsg", {msgType: msgType, msgText: msgText});
    }
    
    $scope.execProg = {};

    $scope.refreshProgress = function () {
    	BDT_Svc.getProgress (function (retData) {
    		$scope.execProg = retData;
    	});
    }
    
    $scope.highlightMScript = function (lid_p) {
    	lid_p.selected = true;
    	// line in Editor is 0-based
    	$rootScope.$broadcast ("MScript_MarkerExec", {markerType: "E", line: lid_p.lid-1});
    }
    $scope.clearMScriptHighlight = function () {
    	$rootScope.$broadcast ("menu_MScriptMarkerClear", "E");
    	angular.forEach($scope.execProg.lidHist, function(lid_p) {
    		lid_p.selected = false;
    	});
    }

    $scope.init = function () {
    	var screenID = "ExecProgress";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "menu_BDTMonitor", function (event, message) {
    		$rootScope.$broadcast("openView", "viewExecProgress");
    		$scope.refreshProgress();
		});


    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewExecProgress") {
	    		$rootScope.$broadcast("closeView", "viewExecProgress");
			}
		});
    };

    
    $scope.init();

});


