
MainModule.controller("ProjModelCtrl", function($rootScope, $scope, $http, IdeSize, DashboardSvc, IdeContext, IdeEvents, IdeUtil) {
	// common section
	$scope.splitPct = 20;
	$scope.preSplitPct = 20;
	$scope.headerHeight = 2;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }
	
    // app specific
	$scope.curProj = undefined;
	$scope.projList = [];
	$scope.modelList = [];
	$scope.showAll = true;
	
	$scope.toggleShowAll = function () {
		$scope.showAll = !$scope.showAll;
	}
	
	$scope.refreshProjList = function () {
		DashboardSvc.getProjList(
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.projList = returnData;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved project list from server"});
					if ($scope.projList.length>0) {
						if ($scope.curProj==undefined) $scope.curProj = $scope.projList[0];
						setTimeout($scope.openProj, 50);
					}
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve project list: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve project list: " + status});
			});
	}

	$scope.getModelList = function () {
		IdeContext.callURL("/MbtSvr/app=websvc&action=statSvc&cmd=modelList",
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.modelList = returnData;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved model list from server"});
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

	$scope.openProj = function (proj_p) {
		if (proj_p) {
			$scope.curProj = proj_p;
		}
		else {
			if ($scope.curProj==undefined) return;
			var curProjID = $scope.curProj.projID;
			$scope.curProj = undefined;
			for (i in $scope.projList) {
				if ($scope.projList[i].projID==curProjID) {
					$scope.curProj = $scope.projList[i];
					break;
				}
			}
		}
	}

	$scope.changeProjName = function () {
		DashboardSvc.setProjName ($scope.curProj.projID, $scope.curProj.project);
	} 	


	$scope.toggleProjActive = function (proj_p) {
		var projActive = 'Y';
		if (proj_p.projActive=='Y') {
			projActive = 'N';
		}
		DashboardSvc.setProjActive(proj_p.projID, projActive,
			function(returnData, status) {
				if (returnData.alertMessage=="ok") {
					proj_p.projActive = projActive;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "changed project active to " + proj_p.projActive});
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to change project active: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to change project active: " + status});
			});
	}


	$scope.delProj = function (proj_p) {
		DashboardSvc.delProj(proj_p.projID, function(returnData) {
			if (returnData.alertMessage=="ok") {
				$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "deleted project with projectID: " + proj_p.projID});
				var idx = $scope.projList.indexOf(proj_p);
				$scope.projList.splice(idx,1);
				if ($scope.curProj==proj_p) $scope.curProj = undefined;
			}
			else {
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to delete project with projID=" + proj_p.projID + ":" + returnData.alertMessage});
			}
		});
	}
	
	$scope.isProjModel = function (model_p) {
		if ($scope.curProj==undefined || $scope.curProj.modelList==undefined) return false;
		
		for (i in $scope.curProj.modelList) {
			var cModel = $scope.curProj.modelList[i];
			if (cModel.modelID == model_p.modelID) {
				return true;
			}
		}
		return false;
	}

	$scope.toggleProjModel = function (model_p) {
		for (i in $scope.curProj.modelList) {
			var cModel = $scope.curProj.modelList[i];
			if (cModel.modelID == model_p.modelID) {
				DashboardSvc.delProjModel($scope.curProj.projID, model_p.modelID,
					function(returnData, status) {
						if (returnData.alertMessage=="ok") {
							$scope.curProj.modelList.splice(i,1);
						}
						else {
							$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to delete model to project: " + returnData.alertMessage});
						}
					},
					function(retData, status) {
						if (status==undefined) status = "not found";
						$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to delete model to project: " + status});
					});
				return;
			}
		}
		DashboardSvc.addProjModel($scope.curProj.projID, model_p.modelID,
			function(returnData, status) {
				if (returnData.alertMessage=="ok") {
					$scope.curProj.modelList.push(model_p);
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to add model to project: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to add model to project: " + status});
			});
	}

	
    $scope.applyProjFilter = function(filter) {
    	IdeUtil.applyFilter($scope.projList, "project", filter, "hide"); 
    	return;
    }

    $scope.applyModelFilter = function(filter) {
    	IdeUtil.applyFilter($scope.modelList, "name", filter, "hide"); 
    	return;
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();

    	$scope.getModelList();
    	$scope.refreshProjList();
    	
    	var screenID = "Project";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});
		
		IdeEvents.regEvent($scope, screenID, "menu_RefreshProj", function (event, message) {
			$scope.refreshProjList();
		});

		IdeEvents.regEvent($scope, screenID, "menu_DelProj", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.projList, function (proj_p) {
				if (proj_p.checked) {
					checkCount += 1;
					$scope.delProj(proj_p);
				}
			});
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No projects are selected to delete."});
			}
		});
		
		IdeEvents.regEvent($scope, screenID, "menu_NewProj", function (event, message) {
			DashboardSvc.newProj(
				function(returnData, status) {
					if (returnData.alertMessage==undefined) {
						$scope.curProj = returnData;
						$scope.projList.push(returnData);
						$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "created new project: " + returnData.project});
					}
					else {
						$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to create new project:" + returnData.alertMessage});
					}
				}
			);
		});
		
	    
    	IdeEvents.regEvent($scope, $scope.screenID, "menu_HideList", function (event, message) {
    		if (IdeContext.navLeftHide($scope, 'Projects')) {
        		$scope.windowResized();
    		}
		});
		
    	IdeEvents.regEvent($scope, $scope.screenID, "menu_ShowList", function (event, message) { 
    		if (IdeContext.navLeftShow($scope, 'Projects')) {
        		$scope.windowResized();
    		}
		});
		
    };
    
	$scope.init();
});


