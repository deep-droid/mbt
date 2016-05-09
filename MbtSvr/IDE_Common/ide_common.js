
MainModule.factory ('IdeContext', function($rootScope, $http, IdeEvents) {
	var IdeContext = { 
    	curSession: null,
    	prevSession: null,
		config: null
	}

	IdeContext.callURL = function (url, successCB, errorCB, alertCB) {
		$rootScope.$broadcast("postMsg", {msgText: url, msgType: "info"});
		url = url + "&rnd="+new Date().getTime();
		$http.get(url)
			.success(function(returnData, status) {
				if (returnData.error) {
					$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: returnData.error});
					if (errorCB) errorCB(returnData);
				}
				else if (returnData.alertMessage && returnData.alertMessage!='ok') {
					$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: returnData.alertMessage});
					if (alertCB) alertCB(returnData);
					else if (errorCB) errorCB(returnData);
				}
				else {
					if (successCB) successCB(returnData);
				}
			})
			.error(function(returnData, status) {
				$rootScope.$broadcast('postMsg', {msgText: status, msgType: 'error'});
				if (errorCB) errorCB(returnData);
			});
	};

	// this is preferred method to post. data must be {attr1:val1, attr2:val2}
	IdeContext.post2 = function (url, data, successCB, errorCB) {
		$rootScope.$broadcast("postMsg", {msgText: 'post ' + url, msgType: "info"});
		var djson = JSON.stringify(data);
		url = url + "&rnd="+new Date().getTime();
		$http.post (url, djson)
			.success(function(returnData, status) {
				if (returnData.error) {
					$rootScope.$broadcast('postMsg', {msgType:'alert', msgText: returnData.error});
					if (errorCB) errorCB(returnData);
				}
				else {
					if (successCB) successCB(returnData);
				}
			})
			.error(function(returnData, status) {
				$rootScope.$broadcast('postMsg', {msgText: status, msgType: 'error'});
				if (errorCB) errorCB(returnData);
			});
	};

	// only used by ModelExecStats_app.js to store entire json string.
	IdeContext.post = function (url, data, successCB, errorCB) {
		$rootScope.$broadcast("postMsg", {msgText: 'post ' + url, msgType: "info"});
		var djson = JSON.stringify(data);
		try {
			url = url + "&rnd="+new Date().getTime();
			$.post (url, djson, successCB, "json");
		}
		catch (err) {
			if (errorCB) errorCB(err);
			else alert(err);
		}
	};

	IdeContext.refreshCtx = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=getCtx";
		IdeContext.callURL (url, function(returnData) {
				IdeContext.config = returnData.config;
				if (successCB) successCB(IdeContext.config);
			}, errorCB);
	}
	
	IdeContext.getRibbonCust = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=getRibbonCust";
		IdeContext.callURL (url, function(returnData) {
				if (successCB) successCB(returnData);
			}, errorCB);
	}

	IdeContext.saveRibbonCust = function (custConfig, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=saveRibbonCust";
		IdeContext.post2 (url, custConfig, function(returnData) {
				if (successCB) successCB(returnData);
			}, errorCB);
	}
	
	IdeContext.getRibbonIconList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=getRibbonIconList";
		IdeContext.callURL (url, function(returnData) {
				if (successCB) successCB(returnData);
			}, errorCB);
	}

	IdeContext.getCtx = function (successCB, errorCB) {
		if (IdeContext.config==null) {
			IdeContext.refreshCtx (successCB, errorCB);
		}
		else {
			if (successCB) {
				successCB (IdeContext.config);
			}
		}
	}

	IdeContext.saveConfig = function (name_p, val_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=setConfig&key=" + name_p + "&val=" + val_p;
		IdeContext.callURL (url, successCB, errorCB);
	}

	IdeContext.getLicInfo = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=getLicInfo";
		IdeContext.callURL (url, successCB, errorCB);
	}
	
	IdeContext.saveLicInfo = function (email_p, licKey_p, licToken_p, successCB, errorCB) {
		email_p = encodeURIComponent(email_p);
		licKey_p = encodeURIComponent(licKey_p);
		licToken_p = encodeURIComponent(licToken_p);
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=setLicInfo&licAck=Y&licEmail=" + email_p + "&licKey=" + licKey_p + "&TempLicToken=" + licToken_p;
		IdeContext.callURL (url, successCB, errorCB);
	}

	IdeContext.getAbout = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=appContext&cmd=getAbout";
		IdeContext.callURL (url, successCB, errorCB);
	}
	
	IdeContext.checkUpdates = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=config&cmd=checkUpdates";
		IdeContext.callURL (url, successCB, errorCB);
	}
	
	IdeContext.getLog = function (logURL, successCB, errorCB) {
		var url = "/MbtSvr/" + logURL;
		IdeContext.callURL (url, successCB, errorCB);
	}
	
	IdeContext.getPluginList = function () {
		var pluginDesc = {
 				ALM: "Integration - ALM", 
 				BA: "Business Analysis/Prototype", 
				BDT: "Behavior-Driven Testing (BDT)", 
				SEQOUT: "Test Case Generation (offline mbt)", 
				SELENIUM: "Web App Testing" , 
				SERVICE: "WebSvc/Database Testing" , 
				DATAGEN: "Test Data Generation Util", 
				DATADESIGN: "Test Data Design (Pairwise)" , 
				WINUIA: "Windows App Testing" , 
				JAVAUIA: "Java UI/Applet Testing", 
				JAVAAPP: "Java App (non UI) Testing", 
				LOAD: "Performance/Load Testing" , 
				REMOTETRIGGER: "Integration - Send Triggers", 
				REMOTECOMMAND: "Integration - Send Commands"
		};
		var pluginList = IdeContext.config.pluginList;
		angular.forEach(pluginList, function(plugin_p) {
			var desc = pluginDesc[plugin_p.code.toUpperCase()];
			if (desc) {
				plugin_p.desc = desc;
			}
		});
		return pluginList;
	}

	IdeContext.openModel = function (modelName, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=webmbt&action=sessionAction&cmd=openModel&mbtFile=" + modelName, successCB, errorCB);
	};
	

	IdeContext.findArrayObj = function (arrayList, fieldName, fieldValue) {
		if (fieldValue==undefined || arrayList==undefined) return undefined;
		
		angular.forEach (arrayList, function (rowObj) {
			if (rowObj[fieldName] && rowobj[fieldName]==fieldValue) {
				return rowObj;
			}
		});
		return undefined;
	};
	
	IdeContext.navLeftHide = function (scope_p, pageID_p) {
		var vCount = angular.element('#' + pageID_p + ':visible').length;
		if (vCount<=0) return false;
		if (scope_p.splitPct>0) {
    		scope_p.preSplitPct = scope_p.splitPct;
    		scope_p.splitPct = 0;
		}
		return true;
	};
	
	IdeContext.navLeftShow = function (scope_p, pageID_p) { 
		var vCount = angular.element('#' + pageID_p + ':visible').length;
		if (vCount<=0) return false;
		if (scope_p.preSplitPct<=0) {
			scope_p.preSplitPct = 30;
		}
		scope_p.splitPct = scope_p.preSplitPct;
		return true;
	};


	
	return IdeContext;
});


MainModule.factory ('IdeSize', function($rootScope) {
	var IdeSize = { 
			windowWidth: 0,
			windowHeight: 0,
			ribbonTabVisible: true,
	    	ribbonShortHeight: 48,
	    	ribbonTallHeight: 119,
			ribbonHeight: 33,
			viewWidth: 600,
			viewHeight: 500,
			listeners: []
	};
	
	IdeSize.addListener = function (listener) {
		IdeSize.listeners.push(listener);
	};
	
	IdeSize.setRibbonState = function (ribbonTabVisible) {
		IdeSize.ribbonTabVisible= ribbonTabVisible;
		IdeSize.windowResized();
	};
	
	IdeSize.paneResized = function (dragScope, stopLeft) {
    	if (stopLeft==0) {
    		if (dragScope.splitPct==0) {
        		dragScope.splitPct = dragScope.preSplitPct;
        	}
    		else {
        		dragScope.preSplitPct = dragScope.splitPct;
        		dragScope.splitPct = 0;
    		}
    	}
    	else {
    		dragScope.splitPct = Math.round(100 * stopLeft / dragScope.viewWidth);
    	}
		dragScope.windowResized();
		dragScope.$apply();
	}
	
	IdeSize.windowResized = function (applyRibbonScope) {
		IdeSize.windowWidth = window.innerWidth;
		IdeSize.windowHeight = window.innerHeight;
		IdeSize.viewWidth = IdeSize.windowWidth;
		if (IdeSize.ribbonTabVisible) {
			IdeSize.ribbonHeight = IdeSize.ribbonTallHeight;
		}
		else {
			IdeSize.ribbonHeight = IdeSize.ribbonShortHeight;
		}
		IdeSize.viewHeight = IdeSize.windowHeight - IdeSize.ribbonHeight;

//		$rootScope.$broadcast("postMsg", {msgType:"info", msgText: window.innerHeight + ";" + IdeSize.viewHeight  + "; " + IdeSize.ribbonHeight})
		
		for (var i in IdeSize.listeners) {
			try {
				IdeSize.listeners[i].windowResized();
				if (applyRibbonScope) {
					IdeSize.listeners[i].$apply();
				}
			}
			catch (err) {
				alert('failed calling windowResized() on listener ' + i + ': ' + err);
			}
		}
	}

	window.onresize = function() {
		IdeSize.windowResized(true);
	}
	
	return IdeSize;
});

MainModule.factory ('IdeUtil', function($rootScope) {
	var IdeUtil = {}; 
	
	IdeUtil.applyFilter = function (list_p, attrName_p, searchText_p, hideAttrName_p) {
		var regExp = undefined;
		var startsWith = true;
		var endsWith = true;
		searchText_p = searchText_p.trim();
		if (searchText_p.length>0 && searchText_p.substring(0,1)=="/") {
			regExp = new RegExp(searchText_p.substring(1));
		}
		else {
			if (searchText_p.indexOf("*")==0) {
				searchText_p = searchText_p.substring(1);
			}
			else {
				endsWith = false;
			}
			if (searchText_p.length>0 && searchText_p.substring(searchText_p.length-1)=="*") {
				searchText_p = searchText_p.substring(0, searchText_p.length-1);
			}
			else {
				startsWith = false;
			}
			if (!startsWith && !endsWith) {
				startsWith = true;
				endsWith = true;
			}
		}
		for (i in list_p) {
			var checkObj = list_p[i];
			if (checkObj==undefined || checkObj==null) {
				continue;
			}
			var matched = false;
	    	if (regExp) {
	    		matched = regExp.test(checkObj[attrName_p]);
	    	}
	    	else {
	    		// case insensitive search, default contains
	    		var searchText = searchText_p.toUpperCase();
	    		if (searchText=='') {
	    			matched = true;
	    		}
	    		else {
		    		var objText = checkObj[attrName_p].toUpperCase();
		    		var idx = objText.indexOf(searchText);
		    		if (idx<0) {
		    			matched = false;
		    		}
		    		else if (startsWith && endsWith) {
		    			matched = (idx>=0);
			    	}
		    		else if (startsWith) {
		    			matched = (idx==0);
			    	}
			    	else if (endsWith) {
			    		matched = (searchText == objText.substring(objText.length-searchText.length));
			    	}
	    		}
	    	}
			checkObj.hide = !matched;
		}
	}
	
	return IdeUtil;
});


function mainActionCallback(action, params) {
	if (window[action]) {
		try {
			return window[action].apply(window, [params]);
		}
		catch (err) {
			alert(err);
		}
	}
	return null;
}

function ide_menu_action (btnObj) {
	var ret = mainActionCallback("menu_" + btnObj.btnId, btnObj);
	if (ret) return ret;

	var scope = $("body").scope();
	if (scope && scope[btnObj.btnId]) {
		try {
			var ret = scope[btnObj.btnId].apply(scope, [btnObj]);
			if (ret==undefined) return true;
			else return ret;
		}
		catch (err) {
			alert(err);
		}
	}
}

function appInit(winName) {
	window.parentWinObj = parent;
	if (window.opener) {
		window.parentWinObj = window.opener;
	}
	
	if (window.parentWinObj.regCB) window.parentWinObj.regCB (winName, window);
}

function runWinAction (winName, action, params) {
//	return window.parentWinObj.runWinAction(winName, action, params);
}


function setSelected (list_p, selectedItem_p) {
	for (i in list_p) {
		list_p[i].selected = false;
	}
	selectedItem_p.selected = true;
}

//from http://blog.pothoven.net/2006/07/get-request-parameters-through.html
function getRequestParam ( parameterName ) {
	var queryString = window.top.location.search.substring(1);
	// Add "=" to the parameter name (i.e. parameterName=value)
	var parameterName = parameterName + "=";
	if ( queryString.length > 0 ) {
	// Find the beginning of the string
		begin = queryString.indexOf ( parameterName );
		// If the parameter name is not found, skip it, otherwise return the value
		if ( begin != -1 ) {
			// Add the length (integer) to the beginning
			begin += parameterName.length;
			// Multiple parameters are separated by the "&" sign
			end = queryString.indexOf ( "&" , begin );
			if ( end == -1 ) {
				end = queryString.length
			}
			// Return the string
			return unescape ( queryString.substring ( begin, end ) );
		}
		// Return "null" if no parameter has been found
		return "null";
	}
}


