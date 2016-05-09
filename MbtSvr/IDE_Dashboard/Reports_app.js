
MainModule.controller("DashRptCtrl", function($rootScope, $scope, DashboardSvc, IdeContext, IdeSize, IdeEvents, IdeUtil) {
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
	$scope.projTraceRpt = undefined;
	$scope.curProj = undefined;
	$scope.projList = [];
	$scope.curRpt = {rptName: "", rptDesc: ""};
	
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
		$scope.refreshRpt();
	}


	$scope.rptList = {
			"ProjModelReqTrace": "Requirement Traceability by Model for Project ",
			"ProjModelReqFailed": "Failed Requirements by Model for Project",
			"ProjReqTrace": "Requirement Coverage for Project ",
			"ProjReqFailed": "Failed Requirements for Project ",
			"ProjModelTC":	"Test Case Execution by Model for Project "
		}

	$scope.refreshRpt = function (rptName_p) {
		if (rptName_p) {
			$scope.curRpt.rptName = rptName_p;
			$scope.curRpt.rptDesc = $scope.rptList[rptName_p];
		}
		if ($scope.curProj==undefined) return;
		
		DashboardSvc.openDashRpt($scope.curProj.project, $scope.curRpt.rptName,
			function(returnData, status) {
				if (returnData.alertMessage==undefined) {
					$scope.projTraceRpt = returnData;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved project requirement traceability report from server"});
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve project requirement traceability: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve project requirement traceability: " + status});
			});
	}

    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();

    	$scope.refreshRpt ("ProjModelReqTrace");
    	
    	$scope.refreshProjList();
    	
    	var screenID = "DashRpt";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});
		
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptModelReqStatic", function (event, message) {
			$scope.refreshRpt("ProjModelReqStaticTrace");
		});		
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptReqStatic", function (event, message) {
			$scope.refreshRpt("ProjReqStaticTrace");
		});		

		IdeEvents.regEvent($scope, screenID, "menu_DashRptModelReqCov", function (event, message) {
			$scope.refreshRpt("ProjModelReqExecCoverage");
		});		

		IdeEvents.regEvent($scope, screenID, "menu_DashRptReqCov", function (event, message) {
			$scope.refreshRpt("ProjReqExecCoverage");
		});		
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptReqTrace", function (event, message) {
			$scope.refreshRpt("ProjReqTrace");
		});		
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptModelReqTrace", function (event, message) {
			$scope.refreshRpt("ProjModelReqTrace");
		});		

		IdeEvents.regEvent($scope, screenID, "menu_DashRptModelReqFailed", function (event, message) {
			$scope.refreshRpt("ProjModelReqFailed");
		});		
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptReqFailed", function (event, message) {
			$scope.refreshRpt("ProjReqFailed");
		});
		
		IdeEvents.regEvent($scope, screenID, "menu_DashRptModelTC", function (event, message) {
			$scope.refreshRpt("ProjModelTC");
		});		
    
		IdeEvents.regEvent($scope, screenID, "menu_DashRptRefresh", function (event, message) {
	    	$scope.refreshProjList();
		});		
    
    	IdeEvents.regEvent($scope, screenID, "menu_HideList", function (event, message) {
    		if (IdeContext.navLeftHide($scope, 'DashRpt')) {
        		$scope.windowResized();
    		}
		});
		
    	IdeEvents.regEvent($scope, screenID, "menu_ShowList", function (event, message) { 
    		if (IdeContext.navLeftShow($scope, 'DashRpt')) {
        		$scope.windowResized();
    		}
		});

    };
    
	$scope.init();
});


