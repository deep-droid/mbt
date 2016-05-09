
MainModule.factory ('DashboardSvc', function($rootScope, $http, IdeContext) {
	var DashboardSvc = { };

	DashboardSvc.getStatsSum = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getStatsSum", successCB, errorCB);
	}
	
	DashboardSvc.getSvrList = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getSvrList", successCB, errorCB);
	}

	DashboardSvc.updateSvr = function (etlID, colName, colVal, successCB, errorCB, alertCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=updSvr&etlID=" + etlID + "&attrName=" + colName + "&val=" + colVal, successCB, errorCB, alertCB);
	}

	DashboardSvc.addSvr = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=addSvr", successCB, errorCB);
	}

	DashboardSvc.runSvrETL = function (etlID, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=runSvrETL&etlID=" + etlID, successCB, errorCB);
	}

	DashboardSvc.delSvr = function (etlID, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=delSvr&etlID=" + etlID, successCB, errorCB);
	}

	DashboardSvc.pingSvr = function (etlID, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=pingSvr&etlID=" + etlID, successCB, errorCB);
	}

	DashboardSvc.getKPIList = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getKpiList", successCB, errorCB);
	}

	DashboardSvc.getRemoteKPIList = function (kpiID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getRemoteKpiList&kpiID=" + kpiID_p, successCB, errorCB);
	}

	DashboardSvc.addKPI = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=addKPI", successCB, errorCB);
	}

	DashboardSvc.delKPI = function (kpiID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=delKPI&kpiID=" + kpiID_p, successCB, errorCB);
	}
	
	DashboardSvc.delKPIHist = function (kpiID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=delKPIHist&kpiID=" + kpiID_p, successCB, errorCB);
	}
	
	DashboardSvc.updKPI = function (kpiID_p, attrName_p, attrVal_p, successCB, errorCB) {
		attrVal_p = encodeURI(attrVal_p);
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=updKPI&kpiID=" + kpiID_p + "&attrName=" + attrName_p + "&attrValue=" + attrVal_p, successCB, errorCB);
    }

	DashboardSvc.addKPIRange = function (kpiID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=updKPI&kpiID=" + kpiID_p + "&attrName=addRange", successCB, errorCB);
    }

	DashboardSvc.delKPIRange = function (kpiID_p, rangeIdx_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=updKPI&kpiID=" + kpiID_p + "&attrName=delRange&idx=" + rangeIdx_p, successCB, errorCB);
    }

	DashboardSvc.setKPIRange = function (kpiID_p, range_p, successCB, errorCB) {
    	var url = "/MbtSvr/app=websvc&action=dashboard&cmd=updKPI&kpiID=" + kpiID_p 
		+ "&attrName=setRange&idx=" + range_p.idx
		+ "&color=" + range_p.color + "&min=" + range_p.min 
		+ "&max=" + range_p.max;
		IdeContext.callURL(url, successCB, errorCB);
    }

	DashboardSvc.getProjList = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=projList", successCB, errorCB);
	}
			
	DashboardSvc.setProjName = function (projID_p, projName_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=setProjName&projID=" + projID_p + "&project=" + projName_p, successCB, errorCB);
	}
	
	DashboardSvc.setProjActive = function (projID_p, projActive_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=setProjActive&projID=" + projID_p + "&projActive=" + projActive_p, successCB, errorCB);
	}
	
	DashboardSvc.delProj = function (projID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=delProj&projID=" + projID_p, successCB, errorCB);
	}
	
	DashboardSvc.delProjModel = function (projID_p, modelID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=delProjModel&projID=" + projID_p + "&modelID=" + modelID_p, successCB, errorCB);
	}

	DashboardSvc.addProjModel = function (projID_p, modelID_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=addProjModel&projID=" + projID_p + "&modelID=" + modelID_p, successCB, errorCB);
	}
	
	DashboardSvc.newProj = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=newProj", successCB, errorCB);
	}
	
	DashboardSvc.openDashRpt = function (project_p, rptName_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=dashRpt&rptName=" + rptName_p + "&project=" + project_p, successCB, errorCB);
	}
	
	DashboardSvc.getDashDur = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getDashDur", successCB, errorCB);
	}

	DashboardSvc.setDashDur = function (dashDur_p, statsDur_p, successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=setDashDur&dashDur=" + dashDur_p + "&statsDur=" + statsDur_p, successCB, errorCB);
	}

	return DashboardSvc;
	
});
