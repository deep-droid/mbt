var debug = false;
//var mbtSessionList = [];
var MainModule = angular.module("Main", ['ui.bootstrap','multi-select', 'qtip2', 'ui.codemirror']); // , 'xeditable'

var IDE_Name = "TestOptimal";

// common injection utilities
MainModule.factory ('IdeEvents', function($rootScope) {
	var IdeEvents = { 
		eventRegList: {}
	}

	IdeEvents.regEvent = function (ownerScope, ownerName, eventNames, eventHandler) {
		var evtList = IdeEvents.eventRegList[ownerName];
		if (evtList==undefined) {
			evtList = [];
			IdeEvents.eventRegList[ownerName] = evtList;
		}
		
		var evtList = eventNames;
		if (!$.isArray(eventNames)) {
			evtList = eventNames.split(" ");
		}
		angular.forEach(evtList, function(eventName) {
			if (evtList[eventName]) {
				// unregister previous handler
				evtList[eventName].apply();
				$rootScope.$broadcast('postMsg', {msgText: 'registering duplicate event ' + ownerName + ':' +  eventName, msgType: 'error'});
			}
			if (debug) $rootScope.$broadcast('postMsg', {msgText: 'registering event ' + eventName, msgType: 'info'});
			evtList[eventName] = $rootScope.$on(eventName, eventHandler);
		});
	}

	IdeEvents.unregAllEvents = function (ownerScope, ownerName) {
		var evtList = IdeEvents.eventRegList[ownerScope];
		if (evtList==undefined) return;
		var cnt = 0;
		for (var i in evtList) {
			// unregister events
			evtList[i].apply();
			cnt ++;
		}
		if (debug) alert('unregistering ' + ownerName + ' ' + cnt + ' events');
		IdeEvents.eventRegList[ownerName] = undefined;
	}
	
	return IdeEvents;
});

//MainModule.run(function(editableOptions) {
//  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
//});

