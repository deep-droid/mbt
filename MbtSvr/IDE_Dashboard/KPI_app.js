

MainModule.controller("KPICtrl", function($rootScope, $scope, $http, IdeSize, DashboardSvc, IdeContext, IdeEvents, IdeUtil) {
	$scope.splitPct = 15;
	$scope.preSplitPct = 15;
	$scope.headerHeight = 2;
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.kpiList, "name", filter, "hide"); 
    	return;
    }

    $scope.fieldDefList = {
    		Color: "Color name or HTML color code, e.g. ORANGE, BLUE, #110000.",
    		Min: "Minimum value for the KPI range, leave it blank for open ended range.",
    		Max: "Maximum value for the KPI range, leave it blank for open ended range."
    };

    $scope.screenID = "KPI";
	$scope.kpiList = [];
	$scope.curKPI = undefined;
	$scope.localElemList = [];
	$scope.remoteElemList = [];
	
	$scope.elemList = [];
	
	$scope.durList = [
   	   {name: "Today", desc: "Today"},
	   {name: "Yesterday", desc: "Yesterday"},
	   {name: "Last2Days", desc: "Last 2 days"},
	   {name: "Last7Days", desc: "Last 7 days"},
	   {name: "ThisWeek", desc: "This week"},
	   {name: "LastWeek", desc: "Last week"},
	   {name: "Last2Weeks", desc: "Last 2 weeks"},
	   {name: "ThisMonth", desc: "This month"},
	   {name: "LastMonth", desc: "Last month"},
	   {name: "Last2Months", desc: "Last 2 months"},
	   {name: "YearToDate", desc: "Year to date"}
	];
	
	$scope.refreshKpiList = function () {
		DashboardSvc.getKPIList(
			function(returnData) {
				if (returnData.alertMessage==undefined) {
					$scope.kpiList = returnData.kpiList;
					$scope.localElemList = returnData.kpiElemList;
					$rootScope.$broadcast("postMsg", { msgType: "info", msgText: "retrieved KPI list from server"});
					if ($scope.kpiList.length>0) {
						var lastKPI = $scope.curKPI;
						$scope.curKPI = undefined;
						angular.forEach($scope.kpiList, function (kpi_p) {
							$scope.prepDashboardFlag (kpi_p);
							
							if (lastKPI && kpi_p.kpiID == lastKPI.kpiID) {
								$scope.curKPI = kpi_p;
							}
						});

						if ($scope.curKPI==undefined && $scope.kpiList.length>0) {
							$scope.curKPI = $scope.kpiList[0];
						}
						setTimeout($scope.openKPI, 50);
					}
				}
				else {
					$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve KPI list: " + returnData.alertMessage});
				}
			},
			function(retData, status) {
				if (status==undefined) status = "not found";
				$rootScope.$broadcast("postMsg", { msgType: "error", msgText: "Unable to retrieve KPI list: " + status});
			});
	}

	$scope.prepDashboardFlag = function (kpi_p) {
		if (kpi_p.dashboard=="true") {
			kpi_p.dashboard = true;
		}
		else {
			kpi_p.dashboard = false;
		}
	}
	
    $scope.getKpiElem = function (elemName_p, hostURL_p) {
    	var eList = $scope.localElemList;
    	if (hostURL_p && hostURL_p!='') {
        	eList = $scope.remoteElemList;
    	}
    	
    	if ($scope.elemList.length==0) {
        	$scope.elemList.length=0;
        	for (i in eList) {
        		$scope.elemList.push(eList[i]);
        	}
    	}
    	
    	for (i in eList) {
    		var elem = eList[i];
    		if (elem.name==elemName_p) {
    			return elem;
    		}
    	}
    	return undefined;
    }

    $scope.getKpiDur = function (durName_p) {
    	for (i in $scope.durList) {
    		var dur = $scope.durList[i];
    		if (dur.name==durName_p) {
    			return dur;
    		}
    	}
    	return undefined;
    }

    $scope.addKPI = function () {
		DashboardSvc.addKPI(
			function(returnData, status) {
				$scope.prepDashboardFlag (returnData);
				returnData.elemSelected = $scope.getKpiElem(returnData.elem);
				$scope.kpiList.push(returnData);
				$scope.openKPI(returnData);
			}
		);
    }

    $scope.delKPI = function (kpi_p) {
		DashboardSvc.delKPI(kpi_p.kpiID,
			function(returnData, status) {
				var idx = $scope.kpiList.indexOf(kpi_p);
				$scope.kpiList.splice(idx,1);
				if ($scope.curKPI==kpi_p) $scope.curKPI = undefined;
			}
		);
    }
    
    $scope.replaceKPI = function (kpi_p) {
    	$scope.openKPI(kpi_p);
    }
    
    $scope.toggleKpiDashboard = function (kpi_p) {
    	kpi_p.dashboard = !kpi_p.dashboard;
    	$scope.saveKpiDashboard(kpi_p);
    }

    $scope.saveKpiDashboard = function (kpi_p) {
    	if (kpi_p==undefined) {
    		kpi_p = $scope.curKPI;
    	}
		DashboardSvc.updKPI(kpi_p.kpiID, "dashboard", kpi_p.dashboard);
    }

    $scope.saveKpiName = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "name", $scope.curKPI.name);
    }

    $scope.saveKpiHostURL = function () {
    	if ($scope.curKPI.hostURL && $scope.curKPI.hostURL.trim()!='') {
    		$scope.curKPI.remote = true;
    	}
    	else $scope.curKPI.remote = false;
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "hostURL", $scope.curKPI.hostURL, $scope.replaceKPI);
    }

    $scope.saveKpiDesc = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "desc", $scope.curKPI.desc);
    }

    $scope.saveKpiSeqNum = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "seqNum", $scope.curKPI.seqNum);
    }

    $scope.saveKpiElem = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "elem", $scope.curKPI.elemSelected.name, $scope.replaceKPI);
    }

    $scope.saveKpiDur = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "durType", $scope.curKPI.durSelected.name, $scope.replaceKPI);
    }

    $scope.saveKpiSuffix = function () {
    	DashboardSvc.updKPI($scope.curKPI.kpiID, "suffix", $scope.curKPI.suffix);
    }

    $scope.addRange = function () {
    	DashboardSvc.addKPIRange($scope.curKPI.kpiID,
			function(returnData) {
				$scope.curKPI.rangeList.push(returnData);
				$scope.replaceKPI(returnData);
			}
		);
    }

    $scope.delRange = function (range_p) {
    	DashboardSvc.delKPIRange($scope.curKPI.kpiID, range_p.idx,
			function(returnData) {
				var idx = $scope.curKPI.rangeList.indexOf(range_p);
				$scope.curKPI.rangeList.splice(idx,1);
				$scope.replaceKPI(returnData);
			}
		);
    }

    $scope.setRange = function (range_p) {
    	DashboardSvc.setKPIRange($scope.curKPI.kpiID, range_p);
    }

	$scope.checkAllRanges = function (allRangeChecked) {
		angular.forEach($scope.curKPI.rangeList, function (range_p) {
			range_p.checked = allRangeChecked;
		});
	}
	
    $scope.openKPI = function (kpi_p) {
    	if ($scope.kpiList.length<=0) return;
    	if ($scope.curKPI==undefined) {
    		$scope.curKPI = $scope.kpiList[0];
    	}
    	for (i in $scope.kpiList) {
    		var kpi2 = $scope.kpiList[i];
    		kpi2.selected = false;
    		if (kpi_p && kpi2.name==kpi_p.name) {
        		$scope.kpiList[i] = kpi_p;
        		$scope.curKPI = kpi_p;
    		}
    	}
    	
    	$scope.curKPI.selected = true;
		$scope.elemList.length = 0;
		if ($scope.curKPI.hostURL && $scope.curKPI.hostURL.trim().length>0) {
			$scope.curKPI.remote = true;
	    	DashboardSvc.getRemoteKPIList ($scope.curKPI.kpiID, function(retData){
	    		$scope.remoteElemList.length = 0;
	    		angular.forEach(retData.kpiList, function(rKpi_p) {
	    			$scope.remoteElemList.push({name: rKpi_p.name, desc: rKpi_p.desc});
	    		});
	        	$scope.curKPI.elemSelected = $scope.getKpiElem($scope.curKPI.elem, $scope.curKPI.hostURL);
	    	});
		}
		else {
			$scope.curKPI.remote = false;
	    	$scope.curKPI.elemSelected = $scope.getKpiElem($scope.curKPI.elem, $scope.curKPI.hostURL);
		}
    	$scope.curKPI.durSelected = $scope.getKpiDur($scope.curKPI.durType);
    	
    }
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, $scope.screenID);
		});
		
		IdeEvents.regEvent($scope, $scope.screenID, "menu_RefreshKPIList", function (event, message) {
			$scope.refreshKpiList();
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_NewKPI", function (event, message) {
			$scope.addKPI();
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_DelKPI", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.kpiList, function (kpi_p) {
				if (kpi_p.checked) {
					checkCount += 1;
					$scope.delKPI(kpi_p);
				}
			});
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No KPIs are selected to delete."});
			}
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_KpiDelRange", function (event, message) {
			var checkCount = 0;
			angular.forEach($scope.curKPI.rangeList, function (range_p) {
				if (range_p.checked) {
					checkCount += 1;
					$scope.delRange(range_p);
				}
			});
			
			if (checkCount==0) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "No KPI ranges are selected to delete."});
			}
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_KpiAddRange", function (event, message) {
			$scope.addRange();
		});
		
		IdeEvents.regEvent($scope, $scope.screenID, "menu_KpiHistDel", function (event, message) {
	    	DashboardSvc.delKPIHist ($scope.curKPI.kpiID, function(retData) {
				$rootScope.$broadcast("postMsg", { msgType: "alert", msgText: "History has been deleted for current KPI."});
	    	});
		});

		IdeEvents.regEvent($scope, $scope.screenID, "menu_HideList", function (event, message) {
    		if (IdeContext.navLeftHide($scope, 'KPI')) {
        		$scope.windowResized();
    		}
		});
		
    	IdeEvents.regEvent($scope, $scope.screenID, "menu_ShowList", function (event, message) { 
    		if (IdeContext.navLeftShow($scope, 'KPI')) {
        		$scope.windowResized();
    		}
		});


		$scope.refreshKpiList();
    };
    
	$scope.init();
});
