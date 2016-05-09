MainModule.controller("ModelMBTCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef, BDT_Svc ) {
	$scope.mbtFieldList = [];
	
	$scope.refresh = function () {
    	BDT_Svc.getMBTSetting (function(config_p) {
    		$scope.mbtFieldList = FieldDef.prepFieldList ("modelMBT", config_p, $scope);
    	});
	}
	 
    $scope.init = function () {
		var screenID = "ModelMBT";
		
    	IdeEvents.regEvent($scope, screenID, "menu_ModelMBT", function (event, message) {
    		$rootScope.$broadcast("openView", "viewModelMBT");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewModelMBT") {
				$scope.configList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewModelMBT") {
				if ($scope.modelMBTForm.$invalid) {
					$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: 'there are validation errors'});
				}
				else {
		    		$scope.saveUpdates();
		    		$rootScope.$broadcast("closeView", message);
				}
			}
		});

		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };

    $scope.saveUpdates = function () {
		angular.forEach($scope.mbtFieldList, function (fieldObj) {
			if (FieldDef.prepFieldForSave($scope.modelMBTForm, fieldObj)) {
				$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "Saving mbt setting " + fieldObj.key + " to " + fieldObj.val});
				BDT_Svc.saveMBTSetting (fieldObj.key, fieldObj.val);
			}
		});
    }
    
    $scope.init();
});

