
MainModule.controller("DSVarCtrl", function($rootScope, $scope, $http, IdeEvents, BDT_Svc, IdeContext) {

    $scope.fieldDefList = {
		example: "Field interaction group is used to group fields to have the specified interaction strength that is different from the strength set for the dataset. For example you may use pairwise strength for the dataset except for a set of fields you want to have 4-wise strength to increase the test coverage."
    };

    $scope.varList = [];
    $scope.checkAllVars = false;
    $scope.toggleCheckAllVars = function () {
    	angular.forEach($scope.varList, function(varObj_p) {
    		varObj_p.checked = $scope.checkAllVars;
    	});
    }
    
    $scope.refreshVarList = function () {
    	BDT_Svc.getVarList (function (retData) {
    		$scope.varList = retData;
    	});
    }

    $scope.setVar = function (varObj_p) {
    	BDT_Svc.setVar (varObj_p.name, varObj_p.val);
    }

    $scope.init = function () {
    	var screenID = "VarDS";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "menu_DSVar", function (event, message) {
    		$rootScope.$broadcast("openView", "viewDSVar");
    		$scope.refreshVarList();
		});
    };

    
    $scope.init();

});


