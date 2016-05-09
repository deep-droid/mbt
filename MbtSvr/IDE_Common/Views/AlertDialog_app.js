

MainModule.controller("AlertCtrl", function($scope, IdeEvents, $rootScope) {
	$scope.msgList = [];
	
	$scope.closeAlert = function () {
		$rootScope.$broadcast("closeView", "viewAlert");
	}

	$scope.init = function () {
		var screenID = "AlertDialog";
    	IdeEvents.regEvent($scope, "viewAlert", "postMsg", function (event, message) {
			if (message.msgType=='alert' || message.msgType=="error") {
				message.msgText = translateMsg(message.msgText);
				$scope.msgList.push(message);
				$rootScope.$broadcast("openView", "viewAlert");
				setTimeout($scope.focus);
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_hide", function (event, message) {
			if (message=="viewAlert") {
				$scope.msgList = [];
			}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewAlert") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});
    	
    	IdeEvents.regEvent($scope, screenID, "view_ESCAPE", function (event, message) {
    		if (message=="viewAlert") {
    			$rootScope.$broadcast("closeView", message);
    		}
    	});


		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, screenID);
		});
    };
    
    $scope.focus = function () {
    	$("#alertDialog .autoClose").focus();    
    }

    $scope.init();
});
