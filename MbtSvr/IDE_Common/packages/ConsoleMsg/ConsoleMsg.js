
MainModule.controller("ConsoleMsg", function ($scope, $rootScope, IdeEvents) {
    $scope.msg = {
    	msgList: [],
    	maxLength: 14,
    	msgTimeoutMillis: 10000,
    	msgClearTimer: undefined
    };
    
    $scope.okMsg = function () {
    	$scope.msg.show=false;
    	$scope.cancelMsgTimeout(); 
    	$scope.msg.expanded=false;
    }
    
    $scope.expandMsg  = function () {
    	$scope.cancelMsgTimeout(); 
    	$scope.msg.expanded = $scope.msg.show;
    }
    
	IdeEvents.regEvent ($scope, "ConsoleMsg", "postMsg", function(event, message) {
		if (message.msgText==undefined || message.msgText=="") return;
		if (!$scope.msg.expanded) {
			$scope.cancelMsgTimeout();
			$scope.msg.msgClearTimer = setTimeout (function() {
				$scope.msg.show = false;
				$scope.$apply();
			}, $scope.msg.msgTimeoutMillis);
		}

		if (message.msgType==undefined || message.msgType=="" ||
			(message.msgType!="warn" && message.msgType!="error" &&
			 message.msgType!="alert")) {
			message.msgType = "info";
		}
		message.timestamp = new Date();
		$scope.msg.msgList.push (message);
		$scope.msg.show = true;
		$scope.checkMsgLength();
	});
	
	$scope.checkMsgLength = function () {
		if ($scope.msg.maxLength==undefined) {
			$scope.msg.maxLengh = 25;
		}
		if ($scope.msg.msgList.length>$scope.msg.maxLength) {
			$scope.msg.msgList.splice(0, $scope.msg.msgList.length-$scope.msg.maxLength);
		}
	};
	
	$scope.clearMsg = function () {
		$scope.msg.show = false;
		$scope.msg.msgList.length = 0;
	};

	$scope.cancelMsgTimeout = function () {
		if ($scope.msg.msgClearTimer) {
			clearTimeout($scope.msg.msgClearTimer);
			$scope.msg.msgClearTimer = undefined;
		}
	};
	
	IdeEvents.regEvent ($scope, "main", "menu_LogIDE", function(event, message) {
		$scope.msg.expanded = true;
		$scope.msg.show = true;
	});
	
});
