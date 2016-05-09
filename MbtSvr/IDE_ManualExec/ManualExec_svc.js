
MainModule.factory ('ManualExecSvc', function($rootScope, $http, IdeContext) {
	var ManualExecSvc = { };

	ManualExecSvc.getTest = function (successCB, errorCB) {
		IdeContext.callURL("/MbtSvr/app=websvc&action=dashboard&cmd=getStatsSum", successCB, errorCB);
	}
	
	return ManualExecSvc;
});
