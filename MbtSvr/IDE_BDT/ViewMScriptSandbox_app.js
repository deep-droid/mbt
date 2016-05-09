
function formatTS(ts) {
	// Create an array with the current month, day and time
	var date = [ ts.getMonth() + 1, ts.getDate(), ts.getFullYear() ];
	 
	// Create an array with the current hour, minute and second
	var time = [ ts.getHours(), ts.getMinutes(), ts.getSeconds() ];
	 
	// Determine AM or PM suffix based on the hour
	var suffix = ( time[0] < 12 ) ? "AM" : "PM";
	 
	// Convert hour from military time
	time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
	 
	// If hour is 0, set it to 12
	time[0] = time[0] || 12;
	 
	// If seconds and minutes are less than 10, add a zero
	for ( var i = 1; i < 3; i++ ) {
		if ( time[i] < 10 ) {
			time[i] = "0" + time[i];
		}
	}
	 
	// Return the formatted string
	return date.join("/") + " " + time.join(":") + " " + suffix;
} 

MainModule.controller("MScriptSandboxCtrl", function($rootScope, $scope, $http, IdeEvents, BDT_Svc, IdeContext) {
    $scope.assistList = {tagList: ['Feature', 'GIVEN', 'WHEN','THEN', 'if', 'while', 'break','continue', 'else', 'assertTrue', 'assertFalse'], 
			 constList: [], funcList: [], uimapList: [], macroList: [] 
    };
    $scope.cm = undefined;
    $scope.mscriptTextDebug = "";
    $scope.mscriptOutput = [];
    
    $scope.editorOptions = {
    	lineNumbers: true,
    	readOnly: false,
    	lineWrapping : false,
    	styleActiveLine: true,
    	autoCloseBrackets: true,
    	extraKeys: {
		  'Ctrl-Space': 'autocomplete', 
		  'Ctrl-Right': function(cm) {
				  var cur = cm.getCursor();
				  var curLine = cm.getLine(cur.line);
				  var idx = curLine.indexOf("'", cur.ch);
				  if (idx>0) {
					  idx = curLine.indexOf("'", idx+1);
				  }
				  if (idx>0) {
					  var idx2 = curLine.indexOf("'", idx+1);
					  if (idx2>0) {
						  cm.doc.setSelection({line: cur.line, ch: idx+1}, {line: cur.line, ch: idx2});
					  }
					  else {
						  cm.doc.setCursor({line: cur.line, ch: idx+1});
					  }
				  }
		  	   },
		  'Ctrl-Left': function(cm) {
				  var cur = cm.getCursor();
				  var curLine = cm.getLine(cur.line);
				  curLine = curLine.substring(0, cur.ch);
				  var idx = curLine.lastIndexOf("'");
				  if (idx>0) {
					  curLine = curLine.substring(0, idx-1);
					  idx = curLine.lastIndexOf("'");
				  }
				  var idx2 = 0;
				  if (idx>0) {
					  curLine = curLine.substring(0, idx-1);
					  idx2 = idx;
					  idx = curLine.lastIndexOf("'");
				  }
				  if (idx>0) {
					  if (idx2 >0) {
						  cm.doc.setSelection({line: cur.line, ch: idx+1}, {line: cur.line, ch: idx2});
					  }
					  else cm.doc.setCursor({line: cur.line, ch: idx+1});
				  }
		  	  }
		  },
		mode: {name: "mscript", assistList: $scope.assistList}, //"xml"},
	  	gutters: ["CodeMirror-linenumbers"],
	  	highlightSelectionMatches: {showToken: /\w/}
    };
  
    $scope.codemirrorLoaded = function (cm) {
    	$scope.cm = cm;
    	$scope.mscriptTextDebug = "";
    }

	$scope.hintSelected = function (cm, data, completion) {
		cm.replaceRange(completion.text, completion.from || data.from,
                completion.to || data.to, "complete");
		var idx = completion.text.indexOf("'");
		if (idx>0) {
			cm.setCursor({line: data.to.line, ch: data.from.ch + idx+1});
		}
	}
	
	$scope.executeMScript = function () {
		var mscript = "";
		if ($scope.cm.somethingSelected()) {
			mscript = $scope.cm.getSelection();
		}
		else {
			var cur = $scope.cm.getCursor();
			mscript = $scope.cm.getLine(cur.line);
		}
		$scope.mscriptOutput.length = 0;
		$scope.mscriptOutput.push("-- start " + formatTS(new Date()));
		BDT_Svc.execMScript(mscript, function(retData) {
			for (i in retData) {
				$scope.mscriptOutput.push(retData[i]);
			}
			$scope.mscriptOutput.push("-- end " + formatTS(new Date()));
		});
	}
	
	$scope.executeMScriptAll = function () {
		$scope.mscriptOutput.length = 0;
		$scope.mscriptOutput.push("-- start " + formatTS(new Date()));
		BDT_Svc.execMScript( $scope.mscriptTextDebug, function(retData) {
			for (i in retData) {
				$scope.mscriptOutput.push(retData[i]);
			}
			$scope.mscriptOutput.push("-- end " + formatTS(new Date()));
		});
	}

    $scope.init = function () {
    	var screenID = "MScriptSandbox";
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptSandbox", function (event, message) {
    		$rootScope.$broadcast("openView", "viewMScriptSandbox");
		});

    	IdeEvents.regEvent($scope, screenID, "view_show", function (event, message) {
    		if (message=='viewMScriptSandbox') {
    			$scope.cm.refresh();
    		}
		});

    	IdeEvents.regEvent($scope, screenID, "view_ok", function (event, message) {
			if (message=="viewMScriptSandbox") {
	    		$rootScope.$broadcast("closeView", message);
			}
		});

    	IdeEvents.regEvent($scope, screenID, "sandbox_execMScript", function (event, message) {
    		$rootScope.$broadcast("openView", "viewMScriptSandbox");
    		$scope.mscriptTextDebug = message;
    		$scope.executeMScriptAll();
		});

    	IdeEvents.regEvent($scope, screenID, "app_modelOpen", function (event, message) {
			BDT_Svc.getAssistList (function(retData) {
				$scope.assistList.constList.length=0;
				$scope.assistList.funcList.length=0;
				$scope.assistList.uimapList.length=0;
				var constList = $scope.assistList.constList;
				var funcList = $scope.assistList.funcList;
				var uimapList = $scope.assistList.uimapList;
				for (funcName in retData) {
					var funcObj = retData[funcName];
					if (funcObj.type=='op' || funcObj.type=='bool' || funcObj.type=='dsMode') {
						constList.push({displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr});
					}
					else if (funcObj.type=='uimap') {
						var cmp = {displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr};
						uimapList.push(cmp);
					}
					else if (funcObj.type=='macro') {
						var cmp = {displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr};
						macroList.push(cmp);
					}
					else {
						var cmp = {displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr};
						funcList.push(cmp);
					}
				}
			});
    	});
    };

    
    $scope.init();

});


