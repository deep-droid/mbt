MainModule.controller("ScreenShotCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef, BDT_Svc ) {
	$scope.screenshotList = [];
	$scope.checkAll = false;
	
	$scope.refresh = function () {
    	BDT_Svc.getScreenShotList (function(retData) {
    		$scope.screenshotList = retData.snapScreenFiles;
    	});
	}
	 
    $scope.sort = {
    	column: '',
        descending: false
    }    
    
    $scope.changeSorting = function(column) {
    	var sort = $scope.sort;
 	   	if (sort.column == column) {
        	sort.descending = !sort.descending;
 	   	} else {
 	   		sort.column = column;
 	   		sort.descending = false;
 	   	}
    }

    $scope.toggleCheckAll = function () {
    	var checkIt = !$scope.checkAll;
    	angular.forEach($scope.screenshotList, function(screenshot_p) {
    		screenshot_p.checked = checkIt;
    	});
    }
    
    $scope.delScreenshots = function () {
    	angular.forEach($scope.screenshotList, function (screenshot_p) {
    		if (screenshot_p.checked) {
            	BDT_Svc.delScreenShot(screenshot_p.fname, function (retData) {
            		var idx = $scope.screenshotList.indexOf(screenshot_p);
            		$scope.screenshotList.splice(idx,1);
            	});
    		}
    	});
    }
    
    $scope.init = function () {
		var screenID = "ScreenShot";
		
    	IdeEvents.regEvent($scope, screenID, "menu_ScreenShot", function (event, message) {
    		$rootScope.$broadcast("openView", "viewScreenShot");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewScreenShot") {
				$scope.screenshotList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewScreenShot") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };

    $scope.init();
});

