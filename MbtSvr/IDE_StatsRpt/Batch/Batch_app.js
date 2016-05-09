

MainModule.controller("BatchCtrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, IdeUtil) {
	$scope.batchList = [];
	$scope.curBatch = {};
	
	$scope.prevSplitPct = 30;
	$scope.splitPct = 30;
	$scope.headerHeight = 25;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.batchList, "desc", filter, "hide"); 
    	return;
    }


	$scope.getBatchList = function () {
		var url = "/MbtSvr/app=websvc&action=statSvc&cmd=batchList";
		IdeContext.callURL(url, function(returnData) {
			if (returnData.alertMessage==undefined) {
				$scope.batchList = returnData.batchList;
				$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "retrieved execution batch list from server"});
			}
			else {
				$scope.logMsg("error", "Unable to retrieve execution batch list: " + returnData.error);
				$rootScope.$broadcast("postMsg", {msgType: "error", msgText: "Unable to retrieve execution batch list: " + returnData.error});
			}
		});
	}


	$scope.openModel = function (modelName_p, cbFunc_p) {
		var url = "/MbtSvr/app=websvc&action=statSvc&cmd=openModel&model=" + modelName_p;
		IdeContext.callURL(url, function(returnData) {
			if (returnData.alertMessage==undefined) {
				$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model info from server"});
				if (cbFunc_p) {
					cbFunc_p.apply();
				}
			}
			else {
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model info: " + returnData.alertMessage});
			}
		});
	}

	$scope.openModelExec = function (execObj_p) {
		$scope.openModel (execObj_p.modelName, function(returnData) {
			var url = "/MbtSvr/app=websvc&action=statSvc&cmd=modelExec&model=" + execObj_p.modelName + "&execID=" + execObj_p.execID;
			IdeContext.callURL(url, function(returnData) {
				if (returnData.alertMessage==undefined) {
					$scope.curModelExec = returnData;
					setSelected ($scope.curBatch.execList, execObj_p);
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model exec from server"});
					$rootScope.$broadcast("showModelExec", $scope.curModelExec);
					$rootScope.$broadcast("showTab", "Requirement");
					$rootScope.$broadcast("showTab", "TestCase");
					$rootScope.$broadcast("selectTab", "Requirement");
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model exec: " + returnData.alertMessage});
				}
			});
		});
	}


	$scope.openBatch = function (batchObj_p) {
		$scope.curBatch = batchObj_p;
		angular.forEach($scope.batchList, function (batchObj2_p) {
			batchObj2_p.selected = false;
		});
		$scope.curBatch.selected = true;
	}		
    

    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	$scope.getBatchList();
    	
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'Batch');
		});
		
		IdeEvents.regEvent($scope, "Batch", "renameModelExec", function (event, message) {
			angular.forEach ($scope.curBatch.execList, function(execObj_p) {
				if (execObj_p.execID==message.execID) {
					execObj_p.statDesc = message.statDesc;
				}
			});
		});		

    };
    
	$scope.init();
});


