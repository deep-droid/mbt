MainModule.factory ('BDT_Svc', function($rootScope, IdeContext, $http) {
	var BDT_Svc = { 
		cachedModelJSON: undefined
	}

	BDT_Svc.getBDTList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getBDTList";
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	BDT_Svc.newBDT = function (newBDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=newBDT&model=" + newBDTName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.renameBDT = function (oldBDTName, newBDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=renModel&modelName=" + oldBDTName + "&newModelName=" + newBDTName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.delBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=delBDT&model=" + BDTName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.saveBDT = function (script, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=saveScript";
		IdeContext.post2(url, {script: script}, successCB, errorCB);
	};

	BDT_Svc.compileBDT = function (script, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=compileScript";
		IdeContext.post2(url, {script: script}, successCB, errorCB);
	};

	BDT_Svc.saveAs = function (BDTName, newBDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=saveAsModel&modelName=" + BDTName 
					+ "&newModelName=" + newBDTName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getBDT&model=" + BDTName; 
		BDT_Svc.cachedModelJSON = undefined;
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.runBDT = function (markUIDList_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=execModel&trackLidLimit=0";
		if (markUIDList_p && markUIDList_p.length>0) {
			url += "&markList=" + markUIDList_p.join(",");
		}
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	BDT_Svc.debugBDT = function (markUIDList_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=execModel&debug=y&trackLidLimit=0";
		if (markUIDList_p && markUIDList_p.length>0) {
			url += "&markList=" + markUIDList_p.join(",");
		}
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.playBDT = function (markUIDList_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=execModel&debug=y&trackLidLimit=0";
		if (markUIDList_p && markUIDList_p.length>0) {
			url += "&markList=" + markUIDList_p.join(",");
		}
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.stopBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=session&cmd=stopExec&model=" + BDTName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.pauseBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=pause&model=" + BDTName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.resumeBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=resume&model=" + BDTName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.continueBDT = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=continue&model=" + BDTName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getBDTStats = function (BDTName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=getStats&model=" + BDTName; 
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getReqList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=getTagList";
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getAssistList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=misc&type=getAssistList";
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getUiMapList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=misc&type=getUiMapList";
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getReqList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=getTagList";
		IdeContext.callURL(url, successCB, errorCB);
	};

	BDT_Svc.getBreakpoints = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=debug&type=getBreakpoints";
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.removeBreakpoint = function (lid, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=removeBreak&uid=L" + lid;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.setBreakpoint = function (lid, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=setBreak&uid=L" + lid;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	
	BDT_Svc.getVarList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getVarList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.setVar = function (varName_p, varVal_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=setVarVal&name=" + varName_p + "&val=" + varVal_p;
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.getProgress = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=debug&type=execStats";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.execMScript = function (mscript_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=execMScript";
		IdeContext.post2(url, {mscript: mscript_p}, successCB, errorCB);
	}

	BDT_Svc.getPausedAt = function (successCB, errorCB) {
    	var url = "/MbtSvr/app=webmbt&action=debug&type=getPausedAt";
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.getModelJSON = function (successCB, errorCB) {
		if (BDT_Svc.cachedModelJSON == undefined) {
	    	var url = "/MbtSvr/app=webmbt&action=getModelJson";
			IdeContext.callURL(url, successCB, errorCB);
		}
		else {
			successCB (BDT_Svc.cachedModelJSON);
		}
	}
	
	BDT_Svc.getMBTSetting = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getMBTSetting";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.saveMBTSetting = function (attrName_p, attrVal_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=updMBTSetting";
		IdeContext.post2(url, {name: attrName_p, val: attrVal_p}, successCB, errorCB);
	}
	
	BDT_Svc.getModelProp = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getModelProp";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.saveModelProp = function (attrName_p, attrVal_p, successCB, errorCB) {
//		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=updModelProp&name=" + attrName_p + "&val=" + attrVal_p;
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=updModelProp";
		IdeContext.post2(url, {name: attrName_p, val: attrVal_p}, successCB, errorCB);
	}
	
	BDT_Svc.getSysMsg = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getSysMsg";
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.getExecStats = function (modelName_p, execID_p, successCB, errorCB) {
		var url = "/MbtSvr/app=websvc&action=statSvc&cmd=modelExec&execID=" + execID_p + "&model=" + modelName_p;	
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.getUID = function (lineNum_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getUID&lid=" + lineNum_p;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.getALMProp = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=getConfigALM";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.saveALMProp = function (almCompID_p, addOnID_p, addOnParams_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=alm&type=save" + almCompID_p + "&addOnID=" + addOnID_p;
		IdeContext.post2(url, {params: addOnParams_p}, successCB, errorCB);
	}
	
	BDT_Svc.getUIMap = function (successCB, errorCB) {
//		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=getUIMapList";
		var url = "/MbtSvr/app=webmbt&action=BDT&cmd=getUIMapList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.getScreenShotList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=mbtScreenList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.delScreenShot = function (screenshotID_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=deleteScreenFile&mbtFile=" + screenshotID_p;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.getTagList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=getTagList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.getTagListFromALM = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=syncTagList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.applyReqUpdates = function (importList_p, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=tag&type=saveReqTags&importList=" + importList_p.join(",");
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.getUIImageList = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=getUIImageList";
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.takeImage = function (imageName, screenID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=snapUI&uiMapID=" + imageName + "&screenID=" + screenID;
		IdeContext.callURL(url, successCB, errorCB);
	}

	BDT_Svc.deleteUIImage = function (imageName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=uispy&cmd=delUIImage&uiMapID=" + imageName;
		IdeContext.callURL(url, successCB, errorCB);
	}
	
	BDT_Svc.acquireModelLock = function (successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=session&cmd=forceLock";
		IdeContext.callURL(url, successCB, errorCB);
	}
	return BDT_Svc;
});
