

MainModule.controller("HelpCtrl", function($rootScope, $sce, $scope, IdeSize, IdeContext, IdeEvents) {
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
    }

    $scope.iframeSRC = ribbonBtnList.btnHelpTutorials.btnURL;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    
    $scope.showComp = "iframe";
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'Help');
		});
		
    	IdeEvents.regEvent($scope, "Help", "menu_HelpWiki", function (event, message) {
    		$scope.showComp = 'iframe';
    		$rootScope.$broadcast("closeView", "ALL");
    		$scope.iframeSRC = message.btnURL;
		});
    	IdeEvents.regEvent($scope, "Help", "menu_HelpUserGuide", function (event, message) {
    		$scope.showComp = 'iframe';
    		$rootScope.$broadcast("closeView", "ALL");
    		$scope.iframeSRC = message.btnURL;
		});

    	IdeEvents.regEvent($scope, "Help", ["menu_LogServer", "menu_LogMScript", "menu_LogWinUIA"], function (event, message) {
    		$scope.showComp = 'log';
    		IdeContext.getLog(message.btnURL, function(returnData) {
    			$scope.logMsgList = returnData;
    		});
		});

    	var evtList = ['menu_HelpOverview',
                       'menu_HelpTutorials',
                       'menu_HelpForum',
                       'menu_HelpTicket',
                       "menu_HelpMScriptSeqOut",
                       "menu_HelpMScriptBA",
                       "menu_HelpMScriptLoad",
                       "menu_HelpMScriptDataGen",
                       "menu_HelpMScriptDataDesign",
                       "menu_HelpMScriptService",
                       "menu_HelpMScriptSelenium",
                       "menu_HelpMScriptWinUIA",
                       "menu_HelpMScriptJavaUIA",
                       "menu_HelpMScriptJavaApp",
                       "menu_HelpMScriptTriggerCmd",
                       "menu_HelpMScriptSys"];

       	IdeEvents.regEvent($scope, "Help", evtList, function (event, message) {
    		$scope.showComp = 'iframe';
    		$scope.iframeSRC = message.btnURL;
		});
    };
    
    $scope.init();
});


MainModule.controller("LicInfoCtrl", function($rootScope, $scope, IdeContext, FieldDef, IdeEvents) {
	$scope.infoFieldList = [];
	$scope.licFieldList = [];
	$scope.pluginField = {};
	$scope.alert = undefined;
	$scope.exceptions = undefined;
	$scope.licInfoForm = {};
	
    $scope.openLicInfo = function () {
    	$scope.infoFieldList = [];
    	$scope.licFieldList = [];
    	$scope.pluginField = {};
    	$scope.alert = undefined;
    	$scope.exceptions = undefined;
    	
    	IdeContext.getLicInfo(function(licInfo_p) {
    		var licInfoList = FieldDef.prepFieldList("licInfo", licInfo_p);
    		$scope.alert = licInfo_p.alert;
    		$scope.exceptions = licInfo_p.exceptions;
    		angular.forEach(licInfoList, function(field_p) {
    			if (field_p.key=="authPluginList") {
    				$scope.pluginField = field_p;
    			}
    			else if (field_p.key=="licEmail" ||
    					 field_p.key=="licKey" ||
    					 field_p.key=="licAck" ||
    					 field_p.key=="TempLicToken" ||
    					 field_p.key=="exceptions" ||
    					 field_p.key=="alert") {
    				$scope.licFieldList.push(field_p);
    			}
    			else $scope.infoFieldList.push(field_p);
    		});
    		
    		$rootScope.$broadcast("openView", "viewLicInfo");
    	});
    }
    
    $scope.init = function () {
    	IdeContext.getLicInfo(function(licInfo_p) {
    		if (licInfo_p.licStatus!='Valid' ||
    	    	licInfo_p.exceptions) {
        		$scope.openLicInfo();
    		}
    	});
    	
    	IdeEvents.regEvent($scope, "LicInfo", "menu_LicInfo", function (event, message) {
    		$scope.openLicInfo();
		});
    	
    	IdeEvents.regEvent($scope, "LicInfo", "view_hide", function (event, message) {
			if (message=="viewLicInfo") {
				$scope.licInfoList = [];
			}
		});

    	IdeEvents.regEvent($scope, "LicInfo", "view_ok", function (event, message) {
			if (message=="viewLicInfo") {
	    		$scope.saveUpdates();
			}
		});

		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'LicInfo');
		});
		
    };

    $scope.saveUpdates = function () {
    	var licTerms = $scope.licInfoForm.licAck.$viewValue;
		if (licTerms==false) {
//			$scope.licInfoForm.licAck.$setValidity('required', false);
			$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: 'You must also accept License Terms.'});
			return;
		}
		if ($scope.licInfoForm.$invalid) {
			$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: 'Please correct the errors.'});
			return;
		}
		
    	var licEmail = $scope.licInfoForm.licEmail.$viewValue;
    	var licKey = $scope.licInfoForm.licKey.$viewValue;
    	var TempLicToken = $scope.licInfoForm.TempLicToken.$viewValue;
    	if (TempLicToken==undefined) TempLicToken = "";
		IdeContext.saveLicInfo(licEmail, licKey, TempLicToken, function() {
    		$rootScope.$broadcast("closeView", "viewLicInfo");
		});
    }
    
    $scope.init();
});

MainModule.controller("SysInfoCtrl", function($scope, $rootScope, IdeContext, IdeSize, IdeEvents, FieldDef ) {
	$scope.configList = [];
	$scope.refresh = function () {
    	IdeContext.refreshCtx(function(config_p) {
    		$scope.configList = FieldDef.prepFieldList ("config", config_p);
    		$rootScope.$broadcast("openView", "viewSysInfo");
    	});
	}
	
    $scope.init = function () {
    	screenID = "sysInfo";

    	IdeEvents.regEvent($scope, screenID, "view_ESCAPE", function (event, message) {
    		if (message=="viewSysInfo") {
    			$rootScope.$broadcast("closeView", message);
    		}
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_SysInfo", function (event, message) {
			$scope.refresh();
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewSysInfo") {
				$scope.configList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewSysInfo") {
				if ($scope.sysInfoForm.$invalid) {
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
		var fieldDefList = FieldDef.getFieldDefList("config");
		angular.forEach($scope.configList, function (fieldObj) {
			if (FieldDef.prepFieldForSave($scope.sysInfoForm, fieldObj)) {
				$rootScope.$broadcast("postMsg", {msgType: "info", msgText: "setting config " + fieldObj.key + " to " + fieldObj.val});
				IdeContext.saveConfig(fieldObj.key, fieldObj.val);
			}
		});
    }
    
    $scope.init();
});

MainModule.controller("AboutCtrl", function($rootScope, $scope, IdeSize, IdeContext, IdeEvents) {
	$scope.about = {
	        header: "TestOptimal BasicMBT",
	        summary: "A Model-Based Test Design & Test Automation Tool",
	        features: []
	};

	$scope.closeAbout = function () {
		$rootScope.$broadcast("closeView", "viewHelpAbout");
	}
    
    $scope.init = function () {
    	var screenID = "helpAbout";
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    	
		IdeEvents.regEvent($scope, screenID, "menu_HelpAbout", function (event, message) {
       		IdeContext.getAbout(function(retObj) {
       			$scope.about = retObj;
        		$rootScope.$broadcast("openView", "viewHelpAbout");
        		setTimeout(function() {$("#about .autoClose").focus();});
       		});
		});

		IdeEvents.regEvent($scope, screenID, "view_ESCAPE", function (event, message) {
    		if (message=="viewHelpAbout") {
    			$rootScope.$broadcast("closeView", message);
    		}
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewHelpAbout") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});


    };
    
    $scope.init();
});

MainModule.controller("CheckUpdatesCtrl", function($rootScope, $scope, IdeSize, IdeContext, IdeEvents) {
	$scope.updatesLog = "";
    var screenID = "checkUpdates";

	$scope.closeCheckUpdates = function () {
		$rootScope.$broadcast("closeView", "viewCheckUpdates");
	}

    $scope.init = function () {
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
		
    	IdeEvents.regEvent($scope, screenID, "view_ESCAPE", function (event, message) {
    		if (message=="viewCheckUpdates") {
    			$rootScope.$broadcast("closeView", message);
    		}
    	});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewCheckUpdates") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

       	IdeEvents.regEvent($scope, screenID, "menu_CheckUpdates", function (event, message) {
       		IdeContext.checkUpdates(function(retObj) {
       			$scope.updatesLog = retObj;
        		$rootScope.$broadcast("openView", "viewCheckUpdates");
        		setTimeout(function() {$("#checkUpdatesTO .autoClose").focus(); });
       		});
		});
    };
    
    $scope.init();
});
