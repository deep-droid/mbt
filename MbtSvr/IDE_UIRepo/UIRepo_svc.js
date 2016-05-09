MainModule.factory ('UIRepo_Svc', function($rootScope, IdeContext, $http) {
	var UIRepo_Svc = {}; 

	UIRepo_Svc.getPageList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=pageList";
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	UIRepo_Svc.getPage = function (pageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=getPage&pageID=" + pageName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.clearPageModels = function (pageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=clearPageModels&pageID=" + pageName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.newPage = function (newPageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=newPage&pageID=" + newPageName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.pageAddElem = function (pageName, elemName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=pageAddElem&pageID=" + pageName + "&elemID=" + elemName;
		
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.pageDelElem = function (pageName, elemName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=pageDelElem&pageID=" + pageName + "&elemID=" + elemName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.pageDelElemAll = function (pageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=pageDelElemAll&pageID=" + pageName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.setPage = function (pageName, page, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=setPage&pageID=" + pageName;
		IdeContext.post2(url, page, successCB, errorCB);
	};

	UIRepo_Svc.setPageElem = function (pageName, elemName, elemObj, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=setPageElem&pageID=" + pageName + "&elemID=" + elemName;
		IdeContext.post2(url, elemObj, successCB, errorCB);
	};

	UIRepo_Svc.delElem = function (pageName, elemName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=pageDelElem&pageID=" + pageName + "&elemID=" + elemName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.delPage = function (pageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uiRepo&cmd=delPage&pageID=" + pageName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	UIRepo_Svc.getUIImageList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=getUIImageList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	UIRepo_Svc.takeImage = function (imageName, screenID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=snapUI&uiMapID=" + imageName + "&screenID=" + screenID;
		IdeContext.callURL(url, successCB, errorCB);
	}

	UIRepo_Svc.deleteUIImage = function (imageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=delUIImage&uiMapID=" + imageName;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	return UIRepo_Svc;
});
