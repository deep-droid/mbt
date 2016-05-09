
MainModule.controller("UIRepo_Ctrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, UIRepo_Svc, IdeUtil) {
	$scope.preSplitPct = 30;
	$scope.splitPct = 30;
	$scope.headerHeight = 25;
	
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

	$scope.pageList = [];

	$scope.curObj; 
	$scope.curPage;
	
	$scope.autWin;
	$scope.openAUT = function () {
		if ($scope.autWin && !$scope.autWin.closed) {
			$scope.autWin.location.href = $scope.curObj.autURL;
		}
		else {
			$scope.autWin = window.open($scope.curObj.autURL, "AUT - UICapture TestOptimal"); //, "height=750,width=1250,scrollbars=1,resizable=1,location=1");
			setTimeout($scope.turnUICaptureOn, 500);
			setTimeout($scope.turnUICaptureOn, 1500);
			setTimeout($scope.turnUICaptureOn, 2500);
		}
		$scope.autWin.focus();
	}
	
	$scope.turnUICaptureOn = function () {
		var msgObj = {cmd: "uicaptureOn"};
		$scope.sendMsgAUT (msgObj);	
	}
	
	$scope.sendMsgAUT = function (msgObj) {
		msgObj.svrMsg = true;
		$scope.autWin.postMessage(msgObj, "*");
	}
	
	$scope.handleAUTMessage = function (event) {
		if (event.data.svrMsg) return;
	   	var cmdAction = event.data.cmd;
	    if (cmdAction=="closeAUT") {
	    	$scope.autWin.close();
	    	$scope.autWin = undefined;
	    }
	    else if (cmdAction=="uicaptureReady") {
			$scope.turnUICaptureOn();
	    }
	    else if (cmdAction=="AddField") {
	    	if ($scope.curPage==undefined) {
				$scope.postMsg('alert', 'Unable to add element. No page is selected.');
	    	}
	    	else {
		    	$scope.addElem (event.data.name, event.data);
	    	}
	    }
	}
	
    $scope.postMsg = function (msgType, msgText) {
		$rootScope.$broadcast("postMsg", {msgType: msgType, msgText: msgText});
    }

    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.pageList, "name", filter, "hide");
    	angular.forEach($scope.pageList, function (page) {
    		if (page.hide && page.tags.indexOf(filter)>=0) {
    			page.hide = false;
    		}
    	});
    }

	$scope.refreshUIList = function () {
		UIRepo_Svc.getPageList (function(data) {
			$scope.pageList = data;
			var firstPage = undefined;
			var oldPageName = undefined;
			if ($scope.curPage) oldPageName = $scope.curPage.name;
			$scope.curObj = undefined;
			$scope.curPage = undefined;
						
			angular.forEach($scope.pageList, function(page2) {
				if (firstPage==undefined) firstPage = page2;
				page2._name = page2.name;
				page2.selected = false;
				if (page2._name == oldPageName) {
					$scope.openPage (page2);
					firstPage = page2;
				}
			});
			if ($scope.curPage==undefined && firstPage) {
				$scope.openPage(firstPage);
			}
		});
	}
	
	$scope.toggleExpand = function (page) {
		if (page.elemList==undefined) {
			UIRepo_Svc.getPage (page.name, function(data) {
				page.expanded = true;
				page.elemList = data.elemList;
				page.modelList = data.modelList;
				angular.forEach(page.elemList, function(elem2) {
					elem2._name = elem2.name;
					elem2.uiCat = "elem";
					elem2.selected = false;
					elem2.domainString = elem2.domain.join("\n");
				});
			});
		}
		else page.expanded=!page.expanded;
	}
	
	$scope.clearModelList = function (page) {
		UIRepo_Svc.clearPageModels (page.name, function(data) {
			$scope.curObj.modelList.length = 0;
		});
	}
	
	$scope.openPage = function (page) {
		if (page.expanded==undefined || page===$scope.curObj) {
			$scope.toggleExpand(page);
		}
		$scope.curPage = page;
		$scope.curObj = page;
	}
	
	$scope.openElem = function (elem) {
		if ($scope.curObj && $scope.curObj.changed) {
			$scope.postMsg('error', 'Changes not saved. Please save or cancel the changes first.');
			return;
		}
		$scope.curObj = elem;
		$scope.curObjBck = Object.assign({}, elem);
		for (i in $scope.pageList) {
			var page = $scope.pageList[i];
			var eList = page.elemList;
			for (j in eList) {
				if (eList[j]===elem) {
					$scope.curPage = page;
				}
			}
		}
	}
	
	$scope.setChanged = function () {
		$scope.curObj.changed = true;
	}
	
	$scope.cancelCur = function () {
		for (i in $scope.curObjBck) {
			$scope.curObj[i] = $scope.curObjBck[i];
		}
		$scope.curObj.changed = false;
	}
	
	$scope.saveCur = function () {
		if ($scope.curObj.uiCat=="elem") {
			UIRepo_Svc.setPageElem ($scope.curPage.name, $scope.curObj._name, $scope.curObj, 
				function(returnData) {
					$scope.curObj.changed = false;
					$scope.curObj._name = $scope.curObj.name;
					$scope.postMsg ("info", "UI Elem " + $scope.curObj._name + " change saved");
				},
				function (returnData) {
					$scope.postMsg ("error", 'Failed to save changes to UI ' + $scope.curObj._name + ", " + returnData);
				}
			);
		}
		else {
			UIRepo_Svc.setPage ($scope.curObj._name, $scope.curObj, 
				function(returnData) {
					$scope.curObj.changed = false;
					$scope.curObj._name = $scope.curObj.name;
					$scope.curObj.elemList = undefined;
					$scope.curObj.expanded = false;
					$scope.postMsg ("info", "UI Page " + $scope.curObj._name + " change saved");
				},
				function (returnData) {
					$scope.postMsg ("error", 'Failed to save changes to UI Page ' + $scope.curObj._name );
				}
			);
		}
	}

	$scope.addElem = function (elemName, elemAttr) {
		var curPage = $scope.curPage;
		if (elemName=="") elemName = "Elem";
		var newName = elemName;
		var i = 0;
		angular.forEach(curPage.elemList, function (elem) {
			if (elem.deleted == undefined && newName==elem.name) {
				i = i+1;
				newName = elemName + "_" + i;
			}
		});

		UIRepo_Svc.pageAddElem(curPage.name, newName, function(data) {
			data._name = data.name;
			data.pageName = curPage.name;
			data.uiCat = "elem";
			if (elemAttr) {
				data.elemType = elemAttr.elemType;
				data.desc = elemAttr.desc;
				data.locType = elemAttr.locType;
				data.locator = elemAttr.locator;
				data.domain = elemAttr.domain;
				if (data.domain && data.domain.length>0) {
					data.domainString = elemAttr.domain.join("\n");
				}
			}
			
			curPage.elemList.push(data);
			if (curPage.expanded == undefined || !curPage.expanded) {
				$scope.toggleExpand(curPage);
			};
			$scope.openElem(data);
			if (elemAttr) {
				$scope.setChanged();
			}
			$scope.postMsg('info', 'New Elem created ' + newName);
		});
	}
	
	$scope.deleteCur = function () {
		if ($scope.curObj===$scope.curPage) {
			$scope.deletePage($scope.curObj);
		}
		else {
			$scope.curObj.pageName = $scope.curPage.name;
			$scope.deleteElem($scope.curObj);
		}
	}
	
	$scope.deletePage = function (page) {
		UIRepo_Svc.delPage (page.name, function(data) {
			if (page==$scope.curObj) {
				$scope.curPage = undefined;
				$scope.curObj = undefined;
			}
			page.deleted = true;
			$scope.postMsg ("info", "Deleted Page " + page.name);
		},
		function (data) {
			$scope.postMsg ("warn", "Failed to deleted Page " + page.name);
		});
	}

	$scope.deleteElem = function (elem) {
		UIRepo_Svc.delElem (elem.pageName, elem._name, function(data) {
			if (elem===$scope.curObj) {
				$scope.curObj = undefined;
			}
			elem.deleted = true;
			$scope.postMsg ("info", "Deleted Element " + elem.name);
		},
		function (data) {
			$scope.postMsg ("warn", "Failed to delete Element " + elem.name);
		});
	}
	
	$scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();    	
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	var screenID = 'UIRepo';
    	
    	IdeEvents.regEvent($scope, screenID, "menu_NewUIElem", function (event, message) {
    		if ($scope.curObj==undefined) {
				$scope.postMsg ("alert", 'Please select the page you wish to add element to.')
    			return;
    		}
    		
    		$scope.addElem ("Elem");
		});

    	IdeEvents.regEvent($scope, screenID, "menu_NewUIPage", function (event, message) {
    		var newName = "Page_1";
    		var i = 1;
    		angular.forEach($scope.pageList, function (page) {
    			if (page.deleted == undefined && newName==page.name) {
    				i = i+1;
    				newName = "Page_" + i;
    			}
    		});
			UIRepo_Svc.newPage(newName, function(data) {
				data._name = data.name;
				$scope.pageList.push(data);
				$scope.openPage(data);
				$scope.postMsg('info', 'New Page created ' + newName);
			});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_Del", function (event, message) {
    		var delPageList = [];
    		var delElemList = [];
    		angular.forEach($scope.pageList, function(page) {
    			if ((page.hide==undefined || !page.hide) && page.selected && page.deleted == undefined) {
    				delPageList.push(page);
    			}
        		angular.forEach(page.elemList, function(elem) {
        			if ((elem.hide==undefined || !elem.hide) && elem.selected && elem.deleted == undefined) {
        				elem.pageName = page.name;
        				delElemList.push(elem);
        			}
        		});
    		});
    		
    		angular.forEach(delPageList, function(page) {
    			$scope.deletePage (page);
    		});
    		
    		angular.forEach(delElemList, function(elem) {
    			$scope.deleteElem(elem);
    		});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_HideList", function (event, message) {
    		if (IdeContext.navLeftHide ($scope, 'UIRepo')) {
    			$scope.windowResized();
    		}
		});
		
    	IdeEvents.regEvent($scope, screenID, "menu_ShowList", function (event, message) { 
    		if (IdeContext.navLeftShow ($scope, 'UIRepo')) {
    			$scope.windowResized();
    		}
		});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_RefreshList", function (event, message) {
    		$scope.refreshUIList();
		});

    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='UIList') {
        		IdeContext.navLeftShow ($scope, 'UIRepo');
    			$scope.windowResized();
    		}
    		else {
        		IdeContext.navLeftHide ($scope, 'UIRepo');
    			$scope.windowResized();
    		}
		});

		window.addEventListener("message", $scope.handleAUTMessage, false);
	
    	$scope.refreshUIList();
    };

    $scope.init();
});

