MainModule.controller("ALMPropCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef, BDT_Svc ) {
	$scope.fieldList = {
		"reqConnType": {},
		"reqParams": {},
		"bugConnType": {},
		"bugParams": {}
	};
	
	$scope.refresh = function () {
    	BDT_Svc.getALMProp (function(almConfig_p) {
    		reqConnTypeList.length = 0;
    		reqConnTypeList.push({code: "EXCEL", desc: "Excel Worksheet (xls)"});
    		reqConnTypeList.push({code: "FILE", desc: "File - CSV or TAB"});
    		reqConnTypeList.push({code: "SQL", desc: "SQL - JDBC Database"});
    		reqConnTypeList.push({code: "URL", desc: "URL - CSV or TAB over http"});
       		
       		angular.forEach(almConfig_p.reqAddOnList, function (addOn_p) {
       			reqConnTypeList.push({code: addOn_p, desc: addOn_p});
       		});
       		
       		bugConnTypeList.length = 0;
       		angular.forEach(almConfig_p.bugAddOnList, function (addOn_p) {
       			bugConnTypeList.push({code: addOn_p, desc: addOn_p});
       		});
       		
    		$scope.fieldList.reqConnType = FieldDef.prepField(ALMFields.reqConnType, "reqConnType", almConfig_p.config.REQMGT?almConfig_p.config.REQMGT.addOnID:"");
    		$scope.fieldList.reqConnParams = FieldDef.prepField(ALMFields.reqConnParams, "reqConnParams", almConfig_p.config.REQMGT?almConfig_p.config.REQMGT.params.join("\n"):"");
    		$scope.fieldList.bugConnType = FieldDef.prepField(ALMFields.bugConnType, "bugConnType", almConfig_p.config.DEFECT?almConfig_p.config.DEFECT.addOnID:"");
    		$scope.fieldList.bugConnParams = FieldDef.prepField(ALMFields.bugConnParams, "bugConnParams", almConfig_p.config.DEFECT?almConfig_p.config.DEFECT.params.join("\n"):"");
    	});
	}
	 
    $scope.init = function () {
		var screenID = "ALMProp";

    	IdeEvents.regEvent($scope, screenID, "menu_ALMProp", function (event, message) {
    		$rootScope.$broadcast("openView", "viewALMProp");
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewALMProp") {
				$scope.configList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewALMProp") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };

    $scope.saveReqConfig = function () {
		FieldDef.prepFieldForSave($scope.ALMPropForm, $scope.fieldList.reqConnType);
		FieldDef.prepFieldForSave($scope.ALMPropForm, $scope.fieldList.reqConnParams);
		$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "Saving ALM Property REQMGT"});
		BDT_Svc.saveALMProp ("REQMGT", $scope.fieldList.reqConnType.val, $scope.fieldList.reqConnParams.val);
    }
    
    $scope.saveBugConfig = function () {
		FieldDef.prepFieldForSave($scope.ALMPropForm, $scope.fieldList.bugConnType);
		FieldDef.prepFieldForSave($scope.ALMPropForm, $scope.fieldList.bugConnParams);
		$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "Saving ALM Property DEFECT"});
		BDT_Svc.saveALMProp ("DEFECT", $scope.fieldList.bugConnType.val, $scope.fieldList.bugConnParams.val);
    }

    $scope.init();
});

