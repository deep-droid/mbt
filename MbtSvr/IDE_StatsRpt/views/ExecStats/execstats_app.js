MainModule.config(function($routeProvider) {
	$routeProvider.
		when('/statsList', {
			templateUrl: 'ide/views/ExecStats/StatsList.html',
			controller: 'statsListCtrl'
		}).
		when('/showExecStats/:execId', {
			templateUrl: 'ide/views/ExecStats/ExecStats.html',
			controller: 'execStatsCtrl'
		}).
		otherwise ({
			redirectTo: '/statsList'
		});
});

MainModule.controller("statsListCtrl", function ($scope, IdeContext, IdeSize) {
    $scope.curModelName = undefined;
    $scope.execStatsList = [];

    $scope.toggleTravMsg = function (statsObj) {
    	if (statsObj.L1.length + statsObj.L2.length +
    		statsObj.L3.length + statsObj.L4.length +
    		statsObj.L5.length > 0) {
    		statsObj.showMsg=!statsObj.showMsg;
    	}
    };
    
    $scope.reloadStatsList = function () {
    	IdeContext.getStatsList ("", function(returnData) {
    		$scope.execStatsList = returnData.statsInfo.execStatsList;
    		$scope.curModelName = returnData.statsInfo.modelName;
    	});
    };

    $scope.init = function() {
    	IdeContext.getCtx(function() {
    		$scope.reloadStatsList();
    	});
    };
    
    $scope.init();
});

MainModule.controller("execStatsCtrl", function ($scope, IdeContext, $routeParams) {
	$scope.execStats = undefined;
    $scope.loadExecStats = function (execId) {
		IdeContext.getExecStats(execId, function(returnData) {
			$scope.execStats = returnData.statsInfo.execStats;
		});
    };
    
	$scope.loadExecStats ($routeParams.execId);
    
});
