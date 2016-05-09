
MainModule.controller("ModelCtrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, IdeUtil) {
	// common section
	$scope.splitPct = 30;
	$scope.headerHeight = 2;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }
	
    // app specific
	$scope.curModel = undefined;
	$scope.curModelExec = undefined;
	$scope.modelList = [];
	
	$scope.refreshModelList = function () {
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=modelList",
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.modelList = returnData;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model list from server"});
					setTimeout ($scope.openDefModel,50);
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model list: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model list: " + status});
			});
	}

	$scope.openDefModel = function () {		
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=getCurModel",
			function(modelName) {
				if (modelName.length>1) {
					var model = undefined;
					for (i in $scope.modelList) {
						if ($scope.modelList[i].name == modelName) {
							model = $scope.modelList[i];
							break;
						}
					}
					if (model) {
						$scope.openModel (model);
					}
				}
			});
	}

	$scope.openModel = function (model_p, cbFunc_p) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=openModel&model=" + model_p.name,
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.curModel = returnData;
					setSelected ($scope.modelList, model_p);
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model info from server"});
					$scope.getModelExecList();
					if (cbFunc_p) {
						cbFunc_p.apply();
					}
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model info: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model info: " + status});
			});
	}

	$scope.getModelExecList = function () {
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=modelExecList&model=" + $scope.curModel.name,
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.curModel.execList = returnData;
//					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model exec List from server"});
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model exec List: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model exec list: " + status});
			});
	}

	$scope.openModelExec = function (execObj_p) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=modelExec&execID=" + execObj_p.execID + "&model=" + $scope.curModel.name,
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.curModelExec = returnData;
					setSelected ($scope.curModel.execList, execObj_p);
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model exec from server"});
					$rootScope.$broadcast("showModelExec", $scope.curModelExec);
					$rootScope.$broadcast("showTab", "Requirement");
					$rootScope.$broadcast("showTab", "TestCase");
					$rootScope.$broadcast("selectTab", "Requirement");
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model exec: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve model exec: " + status});
			});
	}

	$scope.toggleKeep = function (execObj_p) {
		if (execObj_p.keep==undefined) execObj_p.keep=false;
		var newKeep = !execObj_p.keep;
		var url = "/MbtSvr/app=websvc&action=statSvc&cmd=setModelExecKeep&execID=" + execObj_p.execID + "&keep=" + newKeep + "&model=" + $scope.curModel.name;
		IdeContext.callURL(url, function(returnData) {
			if (returnData.alertMessage=="ok") {
				execObj_p.keep = newKeep;
				$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "set model exec keep flag to " + newKeep});
			}
			else {
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to set keep flag for model exec: " + returnData.alertMessage});
			}
		});
	}

	$scope.deleteModelExec = function (execObj_p) {
		var newKeep = !execObj_p.keep;
		var url = "/MbtSvr/app=websvc&action=statSvc&cmd=delModelExec&execID=" + execObj_p.execID + "&model=" + $scope.curModel.name;
		IdeContext.callURL(url, function(returnData) {
			if (returnData.alertMessage=="ok") {
				$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "deleted model exec with execID: " + execObj_p.execID});
				var idx = $scope.curModel.execList.indexOf(execObj_p);
				$scope.curModel.execList[idx] = undefined;
				if ($scope.curModelExec == execObj_p) {
					$scope.curModelExec = undefined;
				}
			}
			else {
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to set keep flag for model exec: " + returnData.alertMessage});
			}
		});
	}
	
    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.modelList, "name", filter, "hide"); 
    	return;
    }

    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();

    	$scope.refreshModelList();
    	
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, 'Model');
		});
		
		$rootScope.$broadcast("hideTab", "Requirement");
		$rootScope.$broadcast("hideTab", "TestCase");
		
		IdeEvents.regEvent($scope, "model", "menu_Refresh", function (event, message) {
			if (tabModel.selected) {
				$scope.refreshModelList();
			}
		});

		IdeEvents.regEvent($scope, "model", "openModelExec", function (event, message) {
			var modelObj = undefined;
			angular.forEach ($scope.modelList, function(modelObj_p) {
				if (modelObj_p.modelName==message.modelName) {
					modelObj = modelObj_p;
				}
			});
			
			if (modelObj==undefined) {
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "model not found: " + message.modelName});
				return;
			}
			$scope.openModel(message.modelName, function() {
				var execObj = undefined;
				angular.forEach ($scope.curModel.execList, function(execObj_p) {
					if (execObj_p.execID==message.execID) {
						execObj = execObj_p;
					}
				})
				if (execObj==undefined) {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "model execution notfound: model " + message.modelName + ", execID " + message.execID });
					return;
				}
				$scope.openModelExec(execObj);
			});
		});
		
		IdeEvents.regEvent($scope, "model", "renameModelExec", function (event, message) {
			angular.forEach ($scope.curModel.execList, function(execObj_p) {
				if (execObj_p.execID==message.execID) {
					execObj_p.statDesc = message.statDesc;
				}
			});
		});		
    };
    
	$scope.init();
});


