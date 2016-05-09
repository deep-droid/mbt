MainModule.controller("UIMapCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef, BDT_Svc ) {
	$scope.UIMapList = [];
	$scope.uiImageList = [];
	  
	$scope.refresh = function () {
    	BDT_Svc.getUIMap (function(uiMapList_p) {
    		$scope.UIMapList.length = 0;
    		angular.forEach(uiMapList_p, function (uiMap_p) {
    			angular.forEach(uiMap_p.appList, function(app_p) {
    				angular.forEach(app_p.winList, function(win_p) {
    					angular.forEach(win_p.elemList, function(elem_p) {
    						var uiElem = {
    							app: app_p.app,
    							win: win_p.win,
    							uiid: elem_p.uiid,
    							desc: elem_p.desc,
    							loc: elem_p.loc,
    							uiMapDef: uiMap_p,
    							appDef: app_p,
    							winDef: win_p,
    							elemDef: elem_p
    						}
    						$scope.UIMapList.push(uiElem);
    					});
    				});
    			});
    		});
    	});
    	
    	BDT_Svc.getUIImageList (function (uiImageList_p) {
    		$scope.uiImageList = uiImageList_p;
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

    $scope.takeImage = function () {
    	var alertMsg = "";
    	if ($scope.imageName=='') {
    		alertMsg += "Image name required.  ";
    	}
    	var imageNameAlt = $scope.imageName + ".png";
		for (i in $scope.uiImageList) {
	    	var fName = $scope.uiImageList[i].fName;
			if (fName==$scope.imageName ||
				fName==imageNameAlt) {
				alertMsg += "Image name already exists: " + $scope.imageName + ".  ";
				break;
			}
		}

		if (alertMsg!='') {
    		$rootScope.$broadcast("postMsg", {msgType: "alert", msgText: alertMsg});
    	}
    	else {
    		BDT_Svc.takeImage($scope.imageName, $scope.screenID, function (data) {
    			$scope.uiImageList.push(data);
    		});
    	}
    }
    
    $scope.deleteImage = function (img_p) {
    	BDT_Svc.deleteUIImage (img_p.fName, function (data) {
    		var delIndex = -1;
    		for (i in $scope.uiImageList) {
    			if ($scope.uiImageList[i]==img_p) {
    				delIndex = i;
    			}
    		}
    		
    		if (delIndex) {
    			$scope.uiImageList.splice(delIndex,1);
    		}
    	});
    }
    
    $scope.init = function () {
		var screenID = "UIMap";
		
    	IdeEvents.regEvent($scope, screenID, "menu_UIMap", function (event, message) {
    		$rootScope.$broadcast("openView", "viewUIMap");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewUIMap") {
				$scope.UIMapFieldList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewUIMap") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

    	$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };

    $scope.init();
});

