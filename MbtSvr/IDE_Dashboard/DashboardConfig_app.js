
MainModule.controller("DashConfigCtrl", function ($rootScope, $scope, $http, IdeEvents, IdeSize, DashboardSvc) {
	$scope.screenID = "DashCConfig";
	
	$scope.headerHeight = 25;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.fieldDefList = {
    		dashDur: "Duration of historical execution stats to be included in Dashboard Trend Charts.  This duration interval must be less than the Stats Duration.",
    		statsDur: "Dashboard ETL purges old execution stats from the system. Execution stats outside this duration interval are automatically purged, even if their stats keep ind is set to true."
    };

    $scope.svrList = [];
    $scope.etlExpanded = false;
    
    $scope.refreshSvrList = function () {
    	DashboardSvc.getSvrList(function(retData) {
    		$scope.svrList = retData;
    		
    		angular.forEach ($scope.svrList, function (svr) {
    			svr.schedActive = (svr.schedActive=='true');
    		})
    	});
    	DashboardSvc.getDashDur (function(retData) {
    		$scope.dashDur = retData.dashDur;
    		$scope.statsDur = retData.statsDur;
    	});
    }
    
    $scope.updHost = function (svr_p) {
    	DashboardSvc.updateSvr(svr_p.etlID, 'Host', svr_p.host);
    }
    
    $scope.updPort = function (svr_p) {
    	DashboardSvc.updateSvr(svr_p.etlID, 'Port', svr_p.port);
    }

    $scope.updSchedDay = function (svr_p) {
    	DashboardSvc.updateSvr(svr_p.etlID, 'SchedDay', svr_p.schedDayInt, function(svr2_p) {
    		svr_p.nextRunDT = svr2_p.nextRunDT;
    	});
    }

    $scope.updSchedTime = function (svr_p) {
    	DashboardSvc.updateSvr(svr_p.etlID, 'SchedTime', svr_p.schedTime, function(svr2_p) {
    		svr_p.nextRunDT = svr2_p.nextRunDT;
    		svr_p.schedTime = svr2_p.schedTime;
    	});
    }

    $scope.updActive = function (svr_p) {
    	DashboardSvc.updateSvr(svr_p.etlID, 'SchedActive', svr_p.schedActive, function(svr2_p) {
    		svr_p.nextRunDT = svr2_p.nextRunDT;
    		svr_p.schedActive = (svr2_p.schedActive=='true');
    	});
    }

    $scope.setDashDur = function () {
    	DashboardSvc.setDashDur($scope.dashDur, $scope.statsDur);
    }

    $scope.init = function () {

		IdeSize.addListener($scope);
    	$scope.windowResized();
    	
    	$scope.refreshSvrList();
    	
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, $scope.screenID);
		});

		
		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgRefresh", function (event, message) {
			$scope.refreshSvrList();
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgAddSvr", function (event, message) {
			DashboardSvc.addSvr(function (svrData) {
				svrData.schedActive = (svrData.schedActive=='true');
				$scope.svrList.push(svrData);
			});
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgDelSvr", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.svrList, function(svr_p) {
				if (svr_p.checked) {
					checkCount += 1;
					DashboardSvc.delSvr(svr_p.etlID, function (retData) {
						var idx = $scope.svrList.indexOf(svr_p);
						$scope.svrList.splice(idx,1);
					});
				}
			});
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No servers are selected to delete."});
			}
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgRun", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.svrList, function(svr_p) {
				if (svr_p.checked) {
					checkCount += 1;
					DashboardSvc.runSvrETL(svr_p.etlID, function (retData) {
						var idx = $scope.svrList.indexOf(svr_p);
						retData.schedActive = (retData.schedActive=='true');
						retData.checked = svr_p.checked;
						$scope.svrList [idx] = retData;
					});
				}
			});
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No servers are selected for immediate ETL execution."});
			}
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgMore", function (event, message) {
			$scope.etlExpanded = true;
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgLess", function (event, message) {
			$scope.etlExpanded = false;
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DashCfgPing", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.svrList, function(svr_p) {
				if (svr_p.checked) {
					checkCount += 1;
					DashboardSvc.pingSvr(svr_p.etlID, function (retData) {
						var msg = "Ping " + svr_p.host + ":" + svr_p.port + ": " + retData.ping;
						$rootScope.$broadcast("postMsg", {msgText: msg, msgType: "alert"});
					});
				}
			});
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No servers are selected to ping."});
			}
		});

    };
    
	$scope.init();
});

