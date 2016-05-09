MainModule.factory ('DataDesignSvc', function($rootScope, IdeContext, $http) {
	var DataDesignSvc = { 
	}

	DataDesignSvc.getDSList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=getDSList";
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	DataDesignSvc.newDS = function (newDSName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=newDS&dsName=" + newDSName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.renameDS = function (oldDSName, newDSName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setDSName&dsName=" + oldDSName + "&newDSName=" + newDSName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeStrength = function (dsName, strength, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setOverallStrength&dsName=" + dsName 
					+ "&strength=" + strength;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changePartField = function (dsName, fieldName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setPartField&dsName=" + dsName 
					+ "&fieldName=" + fieldName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeAlgorithm = function (dsName, algorithm, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setAlgorithm&dsName=" + dsName 
					+ "&algorithm=" + algorithm;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changePlugins = function (dsName, plugins, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setPlugins&dsName=" + dsName 
					+ "&plugins=" + plugins;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeMScriptClass = function (dsName, classPath, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setMScriptImpl&dsName=" + dsName 
					+ "&classPath=" + classPath;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeFieldName = function (dsName, fieldIdx, newFieldName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=renField&dsName=" + dsName 
					+ "&index=" + fieldIdx 
					+ "&fieldName=" + newFieldName;
		IdeContext.callURL(url, successCB, errorCB);
	};


	DataDesignSvc.changeFieldGroup = function (dsName, fieldIdx, group, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setFieldGroup&dsName=" + dsName 
					+ "&index=" + fieldIdx + "&group=" + group;
		IdeContext.callURL(url, successCB, errorCB);
	};


	DataDesignSvc.changeFieldRelID = function (dsName, fieldIdx, relID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setFieldRelation&dsName=" + dsName  
					+ "&index=" + fieldIdx + "&relID=" + relID;
		IdeContext.callURL(url, successCB, errorCB);
	};


	DataDesignSvc.changeFieldDomain = function (dsName, fieldIdx, domainText, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setFieldDomain&dsName=" + dsName 
					 + "&index=" + fieldIdx
					 + "&domain=" + encodeURIComponent(domainText);
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.deleteField = function (dsName, fieldIdx, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=delField&dsName=" + dsName
					 + "&index=" + fieldIdx;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.deleteRel = function (dsName, relIdx, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=delRelation&dsName=" + dsName 
					+ "&relIdx=" + relIdx;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeRelID = function (dsName, relIdx, newRelID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setRelationID&dsName=" + dsName
					+ "&relIdx=" + relIdx + "&relID=" + newRelID;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeRelStrength = function (dsName, relIdx, newStrength, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setRelationStrength&dsName=" + dsName 
			+ "&relIdx=" + relIdx + "&strength=" + newStrength;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.addField = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=addField&dsName=" + dsName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.addRelation = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=addRelation&dsName=" + dsName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.addRule = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=addRule&dsName=" + dsName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.deleteRule = function (dsName, ruleIdx, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=delRule&dsName=" + dsName 
					+ "&ruleIdx=" + ruleIdx;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeRuleName = function (dsName, ruleIdx, ruleName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setRuleName&dsName=" + dsName 
					+ "&ruleIdx=" + ruleIdx + "&ruleName=" + ruleName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeRuleExpr = function (dsName, ruleIdx, ruleExpr, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setRuleExpr&dsName=" + dsName 
					+ "&ruleIdx=" + ruleIdx + "&ruleExpr=" + ruleExpr;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.deleteDataRow = function (dsName, rowIdx, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=delDataRow&dsName=" + dsName 
					+ "&rowIdx=" + rowIdx;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.changeDataRow = function (dsName, rowIdx, fieldName, newVal, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=setFieldValue&dsName=" + dsName 
		 			+ "&rowIdx=" + rowIdx 
		 			+ "&fieldName=" + fieldName
					+ "&newVal=" + newVal;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.moveDataRow = function (dsName, rowIdxList, direction, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=moveRow&dsName=" + dsName 
		 			+ "&rowIdxList=" + rowIdxList.join(",") 
		 			+ "&direction=" + direction;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.addDataRow = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=addDataRow&dsName=" + dsName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.regenDataTable = function (dsName, strength_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=genData2&dsName=" + dsName + "&strength=" + strength_p;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.deleteDS = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=delDS&dsName=" + dsName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.saveAs = function (dsName, newDSName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=saveAsDS&dsName=" + dsName 
					+ "&newDsName=" + newDSName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.moveField = function (dsName, fieldIdx, direction, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=moveField2&dsName=" + dsName 
					+ "&fieldIdx=" + fieldIdx + "&direction=" + direction;
		IdeContext.callURL(url, successCB, errorCB);
	};

	DataDesignSvc.getDS = function (dsName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=combDS&cmd=getDS2&dsName=" + dsName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	
	return DataDesignSvc;
});
