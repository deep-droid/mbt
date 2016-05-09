MainModule.controller("ModelPropCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef, BDT_Svc ) {
	$scope.modelPropList = [];

	$scope.multiSelectedItems = [];
	$scope.multiSelectDomain = [];
	
	$scope.refresh = function () {
    	BDT_Svc.getModelProp (function(config_p) {
    		$scope.modelPropList = FieldDef.prepFieldList ("modelProp", config_p, $scope);
    	});
	}
	
	$scope.fieldChanged = function (field, newVal) {
		return "not now";
	}
	
	$scope.saveModelProp = function () {
		return "form failed";
	}

    $scope.init = function () {
    	var screenID = "ModelProp";
    	IdeEvents.regEvent($scope, screenID, "menu_ModelProp", function (event, message) {
    		$rootScope.$broadcast("openView", "viewModelProp");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewModelProp") {
				$scope.modelPropList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewModelProp") {
				if ($scope.modelPropForm.$invalid) {
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
		angular.forEach($scope.modelPropList, function (fieldObj) {
			if (FieldDef.prepFieldForSave($scope.modelPropForm, fieldObj)) {
				$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "saving model property " + fieldObj.key + " to " + fieldObj.val});
				BDT_Svc.saveModelProp (fieldObj.key, fieldObj.val);
			}
		});
    }
    
    $scope.init();
});

