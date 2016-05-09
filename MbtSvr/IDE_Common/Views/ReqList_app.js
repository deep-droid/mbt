MainModule.controller("ReqListCtrl", function($scope, $rootScope, IdeEvents, BDT_Svc ) {
	$scope.reqList = [];
	$scope.checkAll = false;
	
    $scope.sort = {
    	column: '',
        descending: false
    }    
    
    $scope.filter = {};

//    $scope.applyFilter = function () {
//    	angular.forEach($scope.reqList, function (reqObj_p) {
//    		reqObj_p.hide = false;
//    	});
//    	for (key in $scope.filter) {
//    		var val = $scope.filter[key];
//    		if (val && val!='') {
//    	    	angular.forEach($scope.reqList, function (reqObj2_p) {
//    	    		if (reqObj2_p.)
//    	    		reqObj2_p.hide = false;
//    	    	});
//    		}
//    	}
//    }
//    
    $scope.changeSorting = function(column) {
    	var sort = $scope.sort;
 	   	if (sort.column == column) {
        	sort.descending = !sort.descending;
 	   	} else {
 	   		sort.column = column;
 	   		sort.descending = false;
 	   	}
    }

	$scope.refresh = function () {
    	BDT_Svc.getTagListFromALM (function(reqList_p) {
    		$scope.reqList = reqList_p;
    	});
	}
	 

    $scope.toggleCheckAll = function () {
    	var checkIt = !$scope.checkAll;
    	angular.forEach($scope.reqList, function(reqObj_p) {
    		if (reqObj_p.diffFlag!='') reqObj_p.checked = checkIt;
    	});
    }
   
    
    $scope.applyUpdates = function () {
		var importList = [];
    	angular.forEach($scope.reqList, function(reqObj_p) {
    		if (reqObj_p.checked) importList.push(reqObj_p.tag);
    	});
    	
    	if (importList.length<=0) return;
    	
    	BDT_Svc.applyReqUpdates(importList, function (retData) {
        	angular.forEach($scope.reqList, function(reqObj_p) {
        		if (reqObj_p.checked) {
        			reqObj_p.diffFlag = '';
        			reqObj_p.checked = false;
        		}
        	});
    	});
    }
    
    
    $scope.init = function () {
		var screenID = "ReqList";
		
    	IdeEvents.regEvent($scope, screenID, "menu_ReqList", function (event, message) {
    		$rootScope.$broadcast("openView", "viewReqList");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewReqList") {
				$scope.ReqListFieldList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewReqList") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

    	$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };

    $scope.init();
});

