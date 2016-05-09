

MainModule.controller("RibbonCtrl", function ($rootScope, $scope, $http, $window,
		IdeContext, IdeSize, IdeEvents, $location, $timeout, keyboardManager) {
	
	$scope.dragMode = false;
	$scope.modalMode = false;
	$scope.showAlert = false;
	$scope.kpiList = [];
		

    $scope.postMsg = function (msgType, msgText) {
		$rootScope.$broadcast("postMsg", {msgType: msgType, msgText: msgText});
    }


	$scope.ribbon = {
    		helpHintDelay: ribbonHelpHintDelay, 
	    	ribbonData: ribbonData,
	    	appCustBtnList: [],
	    	showTab: true,
	    	curWin: "File",	
		    appTitle: null,
		    shortcutList: []
	    };

    $scope.cust = {
    		custChanged: false,
    		custConfig: {}, // configuration from Svr
    		iconList: undefined,
    	    custIconSelected: undefined,
    	    custBtnCur: { btnObj: undefined,
					   tabObj: undefined,
					   sectionObj: undefined,
					   scKeyObj: undefined,
					   modKeyObj: undefined
					 },
    	    
    	    modifyKeyList: [ {name: "", ctrl: false, alt: false, shift:false, cmd: false },
    	                     {name: "Ctrl", ctrl: true, alt: false, shift:false, cmd: false },
    	                     {name: "Alt", ctrl: false, alt: true, shift:false, cmd: false },
    						 {name: "Ctrl+Alt", ctrl: true, alt: true, shift: false, cmd: false },
    						 {name: "Ctrl+Shift", ctrl: true, alt: false, shift: true, cmd: false},
    						 {name: "Alt+Shift", ctrl: false, alt: true, shift: true, cmd: false}
//    	                     {name: "Cmd", ctrl: false, alt:false, shift:false, cmd: true },
//    						 {name: "Cmd+Ctrl", ctrl: true, alt: false, shift: false, cmd: true },
//    						 {name: "Cmdl+Alt", ctrl: false, alt: true, shift: false, cmd: true },
//    						 {name: "Cmd+Shift", ctrl: false, alt:false, shift: true, cmd: true}
    						],
    	    scKeyList: [ { name: "", reqMod: false },
    	                 { name: "A", reqMod: true }, { name: "B", reqMod: true }, { name: "C", reqMod: true }, { name: "D", reqMod: true }, { name: "E", reqMod: true }, 
    	                 { name: "F", reqMod: true }, { name: "G", reqMod: true }, { name: "H", reqMod: true }, { name: "I", reqMod: true }, { name: "J", reqMod: true }, 
    	                 { name: "K", reqMod: true }, { name: "L", reqMod: true }, { name: "M", reqMod: true }, { name: "N", reqMod: true }, { name: "O", reqMod: true }, 
    	                 { name: "P", reqMod: true }, { name: "Q", reqMod: true }, { name: "R", reqMod: true }, { name: "S", reqMod: true }, { name: "T", reqMod: true }, 
    	                 { name: "U", reqMod: true }, { name: "V", reqMod: true }, { name: "W", reqMod: true }, { name: "X", reqMod: true }, { name: "Y", reqMod: true }, { name: 'Z', reqMod: true },
    	                 { name: "F1", reqMod: false }, { name: "F2", reqMod: false}, { name: "F3", reqMod: false}, { name: "F4", reqMod: false}, { name: "F5", reqMod: false}, { name: 'F6', reqMod: false},
    	                 { name: "F7", reqMod: false}, { name: "F8", reqMod: false}, { name: "F9", reqMod: false}, { name: "F10", reqMod: false}, { name: "F11", reqMod: false}, { name: 'F12', reqMod: false},
    	                 { name: "Left", reqMod: false}, { name: "Right", reqMod: false}, { name: "Up", reqMod: false}, { name: "Down", reqMod: false},
    	                 { name: "Esc", reqMod: false}, { name: "Tab", reqMod: false}, { name: "Space", reqMod: false}, { name: "Return", reqMod: false}, { name: "Enter", reqMod: false}, 
    	                 { name: "Backspace", reqMod: false}, { name: "Scroll", reqMod: false}, { name: "Pause", reqMod: false}, 
    	                 { name: "Break", reqMod: false}, { name: "Insert", reqMod: false}, { name: "Delete", reqMod: false}, { name: "End", reqMod: false}, 
    	                 { name: "PageUp", reqMod: false}, { name: "PageDown", reqMod: false}
					   ]
    	};
    
    // 
    $scope.applyCustConfig = function (custConfig) {
    	if (custConfig) {
        	$scope.cust.custConfig = custConfig;
    	}
    	$scope.ribbon.appCustBtnList.length = 0;
    	for (btnId in ribbonBtnList) {
    		var btnObj = ribbonBtnList[btnId];
    		if (btnObj.shortcut && btnObj.shortcut!= '') {
    			keyboardManager.unbind(btnObj.shortcut);
    		}
    		btnObj.btnImgId = undefined;
    		btnObj.shortcut = undefined;
    		btnObj.enabled = false;
    	}
    	$scope.ribbon.shortcutList = [];
    	for (btnId in $scope.cust.custConfig) {
    		var cfg = $scope.cust.custConfig [btnId];
    		var btnObj = ribbonBtnList ["btn"+ btnId];
    		if (btnObj) {
    			if (cfg.shortcut && cfg.shortcut!='') {
            		btnObj.shortcut = cfg.shortcut;
            		keyboardManager.bind(btnObj.shortcut, function(event, shortcut) {
            			$scope.execShortcut(shortcut);
            		});
            		$scope.ribbon.shortcutList.push(btnObj.shortcut);
    			}
    			if (cfg.btnImgId && cfg.btnImgId!='') {
            		btnObj.btnImgId = cfg.btnImgId;
    			}
    			btnObj.enabled = cfg.enabled;
    			if (cfg.enabled) {
    				$scope.ribbon.appCustBtnList.push(btnObj);
    			}
    		}
    		else {
    			$scope.cust.custConfig[btnId] = undefined;
				$rootScope.$broadcast("postMsg", {msgText: "ribbon customization ignored: " + btnId, msgType: "warn"});
    		}
    	}

    	$scope.ribbon.appCustBtnList.push(ribbonBtnList.btnCustRibbon);
    	
    }
    
    $scope.saveCustConfig = function () {
    	IdeContext.saveRibbonCust ($scope.cust.custConfig, function () {
        	$scope.cust.custChanged = false;
			$rootScope.$broadcast("postMsg", {msgText: "Ribbon toolbar custominzation saved", msgType: "info"});
    	});
    }
    
    $scope.custBtnSetShortcutKey = function () {
    	var shortcut = "";
    	if ($scope.cust.custBtnCur.modKeyObj.name=='') {
    		if ($scope.cust.custBtnCur.scKeyObj.name!='') {
            	shortcut = "+" + $scope.cust.custBtnCur.scKeyObj.name;
    		}
    	}
    	else {
        	shortcut = $scope.cust.custBtnCur.modKeyObj.name + 
        		"+" + $scope.cust.custBtnCur.scKeyObj.name;
    	}
    	$scope.cust.custBtnCur.btnObj.shortcut = shortcut;
    	
    	var cfg = $scope.getCustCfg($scope.cust.custBtnCur.btnObj.btnId);
    	cfg.shortcut = shortcut;
    	
    	$scope.saveCustConfig();
    	$scope.applyCustConfig();
    } 
    
    $scope.custClearShortcut = function () {
    	$scope.cust.custBtnCur.modKeyObj = $scope.cust.modifyKeyList[0];
    	$scope.cust.custBtnCur.scKeyObj = $scope.cust.scKeyList[0];
    	$scope.custBtnSetShortcutKey();
    }
    
    $scope.getCustCfg = function (btnId) {
    	var cfg = $scope.cust.custConfig[btnId];
    	if (cfg==null) {
    		cfg = {shortcut: "", btnImgId: undefined};
    		$scope.cust.custConfig[btnId] = cfg;
    	}
    	return cfg;
    }
    
    $scope.custBtnToggle = function(btnObj) {
    	var cfg = $scope.getCustCfg (btnObj.btnId);
    	cfg.enabled = btnObj.enabled;
    	$scope.applyCustConfig();
    	$scope.saveCustConfig();
    }
    
    $scope.resetCust = function () {
    	$scope.cust.custConfig = {};
    	$scope.saveCustConfig();
    	$scope.applyCustConfig();
    }

    $scope.openCustBtnDialog = function (tabObj, sectionObj, btnObj) {
    	if ($scope.cust.iconList==undefined) {
    		IdeContext.getRibbonIconList (function(iList) { 
    			$scope.cust.iconList = iList;
    			$scope.custBtnPrep(tabObj, sectionObj, btnObj);
    		});
    	}
    	else $scope.custBtnPrep(tabObj, sectionObj, btnObj);
    }

    $scope.custBtnPrep = function (tabObj, sectionObj, btnObj) {
    	angular.forEach($scope.cust.iconList, function(iconId) {
    		if (iconId==btnObj.btnImgId) {
    			$scope.cust.custIconSelected = iconId;
    		}
    	});

		$scope.cust.custBtnCur.btnObj = btnObj;
    	$scope.cust.custBtnCur.tabObj = tabObj;
    	$scope.cust.custBtnCur.sectionObj = sectionObj;
    	$scope.cust.custBtnCur.scKeyObj = $scope.cust.scKeyList[0];
    	$scope.cust.custBtnCur.modKeyObj = $scope.cust.modifyKeyList[0];
    	
    	if (btnObj.shortcut!=undefined && btnObj.shortcut!='') {
    		var lastIdx = btnObj.shortcut.lastIndexOf("+");
    		var sKey = btnObj.shortcut.substring(lastIdx+1);
    		var sMod = btnObj.shortcut.substring(0,lastIdx);
        	for (i in $scope.cust.scKeyList) {
        		var scKeyObj = $scope.cust.scKeyList[i];
        		if (scKeyObj.name==sKey) {
        			$scope.cust.custBtnCur.scKeyObj = scKeyObj;
        			break;
        		}
        	}
        	
        	for (i in $scope.cust.modifyKeyList) {
        		var modKeyObj = $scope.cust.modifyKeyList[i];
        		if (modKeyObj.name==sMod) {
        			$scope.cust.custBtnCur.modKeyObj = modKeyObj;
        			break;
        		}
        	}
        	
    	}
    	else {
        	$scope.cust.custBtnCur.modKeyObj = $scope.cust.modifyKeyList[0];
        	$scope.cust.custBtnCur.scKeyObj = $scope.cust.scKeyList[0];
    	}
    }
    
    $scope.closeCustBtnDialog = function () {
    	$scope.cust.custBtnCur.btnObj = undefined;
    }
    
    $scope.isIconSelected = function (iconId) {
    	if (iconId) {
    		if ($scope.cust.custIconSelected) {
            	return $scope.cust.custIconSelected == iconId;
    		}
    		else return false;
    	}
    	else {
    		return ($scope.cust.custIconSelected==undefined || $scope.cust.custIconSelected=='');
    	}
    }

    $scope.custBtnSetIcon = function (iconId) {
		$scope.cust.custBtnCur.btnObj.btnImgId = iconId;
		$scope.cust.custIconSelected = iconId;
    	var cfg = $scope.getCustCfg($scope.cust.custBtnCur.btnObj.btnId);
    	cfg.btnImgId = iconId;
    	$scope.saveCustConfig();
    }    
    
    $scope.getBtnImgId = function (btnObj_p, btnSize_p) {
    	if (btnObj_p==undefined) {
    		btnObj_p = $scope.cust.custBtnCur.btnObj;
    	}
    	
    	if (btnObj_p==undefined) return "Default";
    	
    	var imgId = btnObj_p.btnImgId;
    	
    	if (imgId==undefined) imgId = btnObj_p.defImgId;
    	if (imgId==undefined) imgId = "Default";
    	if (btnSize_p==undefined || btnSize_p=="small")  imgId = imgId + "-01";
    	else imgId = imgId + "-02";
    	return 'btn' + imgId;
    }
    

    $scope.toggleTab = function (clickedTab) {
		if (clickedTab.selected) {
			if (clickedTab.sectionList.length>0) {
				$scope.ribbon.showTab = !$scope.ribbon.showTab;
			}
		}
		else $scope.selectTab (clickedTab);
		IdeSize.setRibbonState ($scope.ribbon.showTab);
//		IdeSize.windowResized(false);
	};

    $scope.setTabDisabled = function (tabObj_p, disabled_p) {
		angular.forEach($scope.ribbon.ribbonData.tabList, function(tabObj) {
			if (tabObj.tabId==tabObj_p) { // obj or tab name
				tabObj_p = tabObj;
			}
		});
		
		tabObj_p.disabled = disabled_p;
    }
    
    $scope.selectTab = function (clickedTab) {
		angular.forEach($scope.ribbon.ribbonData.tabList, function(tabObj) {
			tabObj.selected = false;
			if (tabObj.tabId==clickedTab) {
				clickedTab = tabObj;
			}
		});
		
		clickedTab.selected = true;
		if (clickedTab.sectionList && clickedTab.sectionList.length>0) {
			$scope.ribbon.showTab = true;
		}
		else {
			$scope.ribbon.showTab = false;
		}
		IdeSize.setRibbonState( $scope.ribbon.showTab);
		
		$rootScope.$broadcast("RibbonTabSelected", clickedTab.tabId);
		
		if (clickedTab.winName) {
			$scope.ribbon.curWin = clickedTab.winName;
			$rootScope.$broadcast("RibbonWinSelected", clickedTab.winName);
		}
	};

    $scope.showDefTabForWin = function (winName) {
		if (winName){
    		angular.forEach($scope.ribbon.ribbonData.winList, function(iframeObj) {
    			if (winName==iframeObj.winName) {
    				if (!iframeObj.defaultTab.display) {
        				$scope.selectTab(iframeObj.defaultTab);
    				}
    				return;
    			}
    		});
		}
    }
    
    $scope.execShortcut = function (shortcut_p) {
    	shortcut_p = shortcut_p.toLowerCase();
    	for (btnId in $scope.cust.custConfig) {
    		var cfg = $scope.cust.custConfig [btnId];
    		var btnObj = ribbonBtnList ["btn"+ btnId];
    		if (btnObj.shortcut && btnObj.shortcut.toLowerCase()==shortcut_p) {
    			$scope.clickBtn(btnObj);
    			break;
    		}
    	}
    }
    
    $scope.clickBtn = function (btnObj) {
		if (btnObj.btnType=="toggle") {
			toggleRibbonBtn(btnObj);
		}
    	$scope.btnAction (btnObj);
    }

    $scope.btnAction = function (btnObj) {
		try {
			var cmd = btnObj.btnId;
			if (btnObj.btnAction=="url") {
				if (btnObj.btnSameWindow) {
					$window.location = btnObj.btnURL;
				}
				else openWin (btnObj.btnLabel, btnObj.btnURL);
			}
			else if (btnObj.btnAction=="route") {
				$location.path( btnObj.btnURL );
			}
			else if (btnObj.btnAction=="modal") {
				$scope.ribbon.currentModal = btnObj.btnId;
			}
			else if (btnObj.btnAction=="view") {
				$rootScope.$broadcast('openView', 'view'+btnObj.btnId);
			}
			else if (btnObj.btnAction=="event") {
				if (debug) {
					$rootScope.$broadcast("postMsg", {msgText: "raising ribbon event menu_" + btnObj.btnId, msgType: "info"});
				}
				$rootScope.$broadcast("menu_" + btnObj.btnId, btnObj);
			}
			else if (btnObj.actionWinName && btnObj.actionWinName=="IDE") {
				if ($scope[cmd]) {
					$scope[cmd].apply($scope, [btnObj]);
				}
				else {
					$scope.emit(cmd, {btnObj: btnObj})
				}
			}
			else {
				var winName = btnObj.tabObj.winName;
				if (btnObj.actionWinName) winName = btnObj.actionWinName;
				$scope.showDefTabForWin(winName);
				var ret = window.runWinAction (winName, "ide_menu_action", btnObj);
				if (ret == undefined ) {
					var msg = "Menu command not implemented: " + winName + " " + cmd;
					$rootScope.$broadcast("postMsg", {msgText: msg, msgType: "error"});
				}
			}
		}
		catch (e) {
			$rootScope.$broadcast("postMsg", {msgText: e, msgType: "error"});
		}
	};
	
    $scope.changeBtn = function (btnObj) {
    		$scope.btnAction(btnObj);
		};

	$scope.appCustSelect = function (mode) {
	    	alert(mode);
	    };

	$scope.windowResized = function () {
		$scope.viewHeight = IdeSize.viewHeight;
		$scope.viewWidth = IdeSize.viewWidth;
		$scope.ribbonHeight = IdeSize.ribbonHeight;
	}

    $scope.toggleFS = function () {
    	toggleFullScreen();
    }

    $scope.getKpiRanges = function (kpi_p) {
    	var list = [];
    	angular.forEach (kpi_p.rangeList, function(range_p) {
    		list.push(range_p.color + ": " + (range_p.min==''?'':range_p.min + kpi_p.suffix) + " -" +  (range_p.max==''?'':range_p.max + kpi_p.suffix));
    	});
    	
    	return list.join(";  ");
    }

	$scope.init = function () {
    	$scope.$on ("$destroy", function () {
			IdeEvents.unregAllEvents($scope, 'Ribbon');
		});
		
    	IdeContext.getRibbonCust($scope.applyCustConfig);
    	
		IdeEvents.regEvent ($scope, "ribbon", "setRibbonField", function(event, message) {
			if (message.appTitle) {
				$scope.ribbon.appTitle = message.appTitle;
			}
			if (message.edition) {
				$scope.ribbon.ribbonData.edition = message.edition;
			}
			if (message.version) {
				$scope.ribbon.ribbonData.version = message.version;
			}
		});

		IdeEvents.regEvent ($scope, "ribbon", "selectTab", function(event, message) {
			$scope.selectTab (message);
		});

		IdeEvents.regEvent ($scope, "ribbon", "showTab", function(event, message) {
			$scope.setTabDisabled (message, false);
		});
		
		IdeEvents.regEvent ($scope, "ribbon", "hideTab", function(event, message) {
			$scope.setTabDisabled (message, true);
		});

		IdeEvents.regEvent ($scope, "ribbon", "menu_FullScreen", function(event, message) {
			toggleFullScreen();
		});
		
		IdeEvents.regEvent ($scope, "ribbon", "menu_RibbonCust", function(event, message) {
			if ($scope.ribbon.curWin=="RibbonCust") {
				$scope.ribbon.curWin = $scope.ribbon.restoreWin;
			}
			else {
				$scope.ribbon.restoreWin = $scope.ribbon.curWin;
				$scope.ribbon.curWin = "RibbonCust";
				if ($scope.ribbon.showTab) {
					$scope.toggleTab($scope.ribbon.curTab);
				}
			}
		});
		
    	IdeEvents.regEvent ($scope, "ribbon", "setDragMode", function(event, message) {
    		$scope.dragMode = message;
    		$scope.$apply();
    	});
    	
    	IdeEvents.regEvent ($scope, "ribbon", "setModalMode", function(event, message) {
    		$scope.modalMode = message;
    	});


		IdeSize.addListener($scope);
    	$scope.windowResized();
    	
		IdeSize.setRibbonState ($scope.ribbon.showTab);
		
	    angular.forEach($scope.ribbon.ribbonData.tabList, function(tabObj) {
	    	tabObj.selected = false;
	    	if (tabObj==$scope.ribbon.ribbonData.initTab) {
		    	$scope.ribbon.curTab = tabObj;
	    	}
	    	
	    	angular.forEach(tabObj.sectionList, function(secObj) {
	    		angular.forEach(secObj.groupList, function(groupObj) {
	    			angular.forEach(groupObj.btnList, function(btnObj) {
	    				btnObj.tabObj = tabObj;
	    			});
	    		});
	    	});
	    });
    	$scope.toggleTab($scope.ribbon.curTab);
    	
    	IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getKPIList&published=true", function(retData) {
    		$scope.kpiList = retData.kpiList;
		});
    	

	};
	

	$scope.init ();
	
});



function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
