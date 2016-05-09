
var winList = [];
var cbList = [];

function addWin(winName, winObj) {
	cbList[winName] = winObj;
	winList[winName] = winObj;
}

function regCB(winName, winObj) {
	cbList[winName] = winObj;
	
	if (winName=="Model") {
		
		if ($("body").scope().appContext.curSession) {
			try {
				fetchModel($("body").scope().appContext.curSession.val);
			}
			catch (e) {
				alert("error openning model " + e);
			}
		}
//		else {
//			alert("Model window not ready to load model " + window.ribbonScope.appContext.curSession.val);
//		}
	}
}

function closeWin(winName) {
	if (cbList[winName]) {
		try {
			cbList[winName] = undefined;
			winList[winName].close();
		}
		catch (err) {
			//
		}
		winList[winName] = undefined;
	}
}

function closeAllWin(exceptList) {
	for (var winName in winList) {
		if (exceptList==undefined || exceptList.indexOf(winName)<0) {
			closeWin(winName);
		}
	}
}

function runWinAction(winName, action, params) {
	var ret = undefined;
	if (winName=="Main") {
		if (window[action]) {
			ret = window[action].apply(this, [params]);
		}
	}
	else {
		if (cbList[winName] && cbList[winName].mainActionCallback) {
			ret = cbList[winName].mainActionCallback(action, params);
		}
	}
	return ret;
}

function runWinActionAll(action, params) {
	var runCnt = 0;
	for (var winName in cbList) {
		var ret = runWinAction(winName, action, params);
		if (ret) runCnt += 1;
	}
	return runCnt;
}

function openWin (winName, winURL) {
	closeWin(winName);
	var winObj = window.open(winURL, "_" + winName);
	addWin(winName, winObj);
	winObj.focus();
}

function refreshWin(winName) {
	winList[winName].location.reload();
}

function getRibbon () {
	return window.ribbon;
}


// Main window commands
function ModelClose(action, params) {
	alert('closeing ' + angular.element("body").scope().appContext.curModel);
	removeSession(angular.element("body").scope().appContext.curModel);
}

function ide_openModel(modelName) {
	alert('ide_openModel');
	angular.element("body").scope().selectTab(tabModel);
	angular.element("body").scope().openModel (modelName);
}

function ide_openDataSet (dsName) {
	alert('ide_openDataSet');
	angular.element("body").scope().selectTab(tabDataDesign);
	// add code to set current dataset
}
