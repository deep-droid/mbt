// copyright 2008 - 2015, TestOptimal, LLC, all rights reserved.
// webMbtTrans.js

$(document).ready(function(){
	initFrame("UIMap");
});

MainModule.controller("mainCtrl", function ($rootScope, $scope, IdeSize, IdeContext, IdeEvents) {
	$scope.windowResized = function () {
		$scope.viewHeight = $(window).height();
		$scope.viewWidth = $(window).width();
	}
	
	$scope.uiMapList = [];
	$scope.uiPageList = [{name:'loading ...', dummy: true}];
	$scope.uiRepoApp = undefined;
	
	$scope.refresh = function () {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=getUIMapList", function(retData) {
			$scope.uiMapList = retData;
			loaded = true;
			for (var i in $scope.uiMapList) {
				if (!$scope.uiMapList[i].readonly && $scope.uiMapList[i].appList.length > 0) {
					$scope.uiRepoApp = $scope.uiMapList[i].appList[0];
					break;
				}
			}
		}, function (retData) {
			alert(retData.error);
		});
	}
	
	$scope.addUIPage = function (uiPage) {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=addUIPage&uiPageID=" + uiPage.name, function(retData) {
			if ($scope.uiRepoApp==undefined) {
				$scope.refresh();
			}
			else {
				var foundI = -1;
				for (i in $scope.uiRepoApp.winList) {
					if ($scope.uiRepoApp.winList[i].win==retData.win) {
						foundI = i;
						break;
					}
				}
				if (foundI >= 0) {
					$scope.uiRepoApp.winList[foundI] = retData;
				}
				else {
					$scope.uiRepoApp.winList.push(retData);
				}
			}
		}, function (retData) {
			alert(retData.error);
		});
	}
	
	$scope.delUIPage = function (uiApp, uiWin) {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=delUIPage&appID=UIRepo&uiPageID=" + uiWin.win, function(retData) {
			$scope.delWin (uiApp, uiWin);
		}, function (retData) {
			alert(retData.error);
		});
	}

	$scope.delUIElem = function (uiApp, uiWin, elem) {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=delUIElem&appID=UIRepo&uiPageID=" + uiWin.win + "&uiid=" + elem.uiid, function(retData) {
			for (var i in uiWin.elemList) {
				if (uiWin.elemList[i]==elem) {
					uiWin.elemList.splice(i,1);
					if (uiWin.elemList.length<=0) {
						$scope.delWin (uiApp, uiWin);
						return;
					}
				}
			}
		}, function (retData) {
			alert(retData.error);
		});
	}
	
	$scope.delWin = function (uiApp, uiWin) {
		for (var i in uiApp.winList) {
			if (uiApp.winList[i] == uiWin) {
				uiApp.winList.splice(i,1);
				return;
			}
		}
	}
	
	$scope.collapseAll = function () {
		angular.forEach($scope.uiMapList, function (uiMap) {
			angular.forEach(uiMap.appList, function(uiApp) {
				angular.forEach(uiApp.winList, function (uiWin) {
					uiWin.expanded = false;
				});
			});
		});
	}
	
	$scope.delUIItem = function (appObj, winObj, elemObj) {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=delUIItem&app=" + appObj.app + "&win=" + winObj.win + "&uiid=" + elemObj.uiid, function(retData) {
			for (var i in winObj.elemList) {
				if (winObj.elemList[i]===elemObj) {
					winObj.elemList.splice(i);
					return;
				}
			}
		}, function (retData) {
			alert(retData.error);
		});
	}
	
	$scope.loadUIPageList = function () {
		if ($scope.uiPageList.length > 1 || $scope.uiPageList[0].desc) {
			return;
		}
		IdeContext.callURL("/MbtSvr/app=webmbt&action=uiMap&cmd=uiPageList", function(retData) {
			$scope.uiPageList = retData;
		});
	}
	
	$scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
		
    	$scope.refresh ();
	}
	
	$scope.init();
});


// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	var scope = $("body").scope();
	if (scope) {
		if (action_p=="adjustHeight") {
			scope.windowResized();
		}
		else if (action_p=="reset" || action_p=="cancel") {
			scope.refresh();
		}
		else if (action_p=="display") {
			scope.refresh(params_p);
		}
		else if (action_p=="close") {
			// nothing
		}
		else if (action_p=="isLoaded") {
			return loaded;
		}
		else {
			alert("UIMap - unknown action: " + action_p);
		}
	}
}

$('.dropdown-menu input').click(function (e) {
    e.stopPropagation();
});
