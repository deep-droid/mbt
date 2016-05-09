// cm specific
/* cm javascript.js modification, replace following keywords function definition
  // keywords function is cusotmmized by TO
  // keywords function is cusotmmized by TO
  var keywords = function(){
	    function kw(type) {return {type: type, style: "keyword"};}
	    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
	    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

	    var jsKeywords = {
		"FEATURE": kw("if"), "FTR_PREP": kw("if"), "SCENARIO": kw("if"),"GIVEN": kw("if"),"WHEN": kw("if"),"THEN": kw("if"),"PREP": kw("if"),"SETUP": kw("if"),"TEARDOWN": kw("if"),
		"FUNCTION": kw("function"), "EXCEPTION": kw("if"), "ERROR": kw("if"), "if": kw("if"), "while": A, "else": B, "assertTrue": kw("if"), "assertFalse": kw("if"),
	      "true": atom, "false": atom
	    };

	    // Extend the 'normal' keywords with the TypeScript language extensions
	    if (isTS) {
	      var type = {type: "variable", style: "variable-3"};
	      var tsKeywords = {

	        // types
	        "string": type, "number": type, "bool": type, "any": type
	      };

	      for (var attr in tsKeywords) {
	        jsKeywords[attr] = tsKeywords[attr];
	      }
	    }

	    return jsKeywords;
	  }();

*/

// code assist list
var cmHintList = {};

function makeBreakpointMarker() {
  var marker = document.createElement("div");
  marker.innerHTML = "<div style='width: 8px; height: 8px; position:relative; top:2px; background-color: #5c97bf; border-radius: 4px;'></div>";
  return marker;
}

// mscript func list retrieved from server
var mscriptMethodList = {};

function isFuncValid(funcName_p) {
	var idx = funcName_p.indexOf(".");
	if (idx>0) {
		funcName_p = funcName_p.substring(idx+1);
	}
	if (mscriptMethodList[funcName_p]) return true;
	else return false;
}

function mscriptModeImpl (config, parserConfig) {
    var mscriptOverlay = {
	    token: function(stream, state) {
	        var ch;
		    var RE = /[0-9a-zA-Z._ (]/;
	        if (stream.match("\$")) {
			   	var chCount = 0;
			   	var funcName = "";
	        	while ((ch = stream.next()) != null) {
			  		chCount+=1;
				    if (!ch.match(RE)) return null;
				    if (ch == "$") return null;
		            if (ch == "(") {
					    if (chCount<=1) return null;
						break;
				  	}
			  		funcName += ch;
				  	var nextCh = stream.peek();
				  	if (ch==" " && (nextCh!="(" && nextCh!=" ")) return null;
				}
				if (chCount > 0) stream.backUp(1);
				if (isFuncValid(funcName)) {
		        	return "mscriptFunc";
		        }
		        else return null;
		    }
	      	while (stream.next() != null && !stream.match("\$", false)) {}
	      	return null;
	    }
  	};
  	return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "javascript"), mscriptOverlay);
}

CodeMirror.defineMode("mscript", mscriptModeImpl);

MainModule.controller("BDT_Ctrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, BDT_Svc, IdeUtil) {
	$scope.preSplitPct = 30;
	$scope.splitPct = 30;
	$scope.headerHeight = 25;
	
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

	$scope.BDTList = [];
	$scope.marker = {
			markerList: {C: [], E: [], L: []}, 
			execNum: 0, 
			curNum: 0, 
			lineNum: 0, 

			lineMarkerList: [], 
			lineWidgetNum: 0,
			pausedAtElem: undefined
	};
	
    $scope.cm = undefined;
    $scope.breakpoints = [];
	
    $scope.fieldDefList = {
		example: "Field interaction group is used to group fields to have the specified interaction strength that is different from the strength set for the dataset. For example you may use pairwise strength for the dataset except for a set of fields you want to have 4-wise strength to increase the test coverage."
    };
    
    $scope.curBDT = undefined;
    $scope.mscriptText = "";
    $scope.mscriptRefresh = false;
    $scope.assistList = {
    	tagList: [
    	   'else',
           {displayText: 'Exception', text: 'EXCEPTION {\n\t\n}\n'},
           {displayText: 'Feature', text: 'FEATURE {\n\t\n}\n'},
           {displayText: 'Feature Prep', text: '\tFTR_PREP {\n\t\t\n\t}\n'},
           {displayText: 'Function', text: 'FUNCTION {\n\t\n}\n'},
           'if',
           {displayText: 'Scenario', text: '\tSCENARIO: {\n\t\tGIVEN: {\n\n\t\t}\n\t\tWHEN: {\n\n\t\t}\n\t\tTHEN: {\n\n\t\t}\n\t}\n'}, 
           {displayText: 'Setup', text: 'SETUP {\n\t\n}\n'},
           {displayText: 'Teardown', text: 'TEARDOWN {\n\t\n}\n'},
           'while'], 
		 constList: [], funcList: [], uiMapList: [], macroList: [], reqList: [] 
	};
    
    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.BDTList, "modelName", filter, "hide"); 
    	return;
    }

    $scope.editorOptions = {
	      lineNumbers: true,
	      readOnly: false,
	      lineWrapping : false,
	      styleActiveLine: true,
	      indentUnit: 4,
	      tabSize: 4,
	      autoCloseBrackets: true,
		  extraKeys: {
			  'Ctrl-Space': 'autocomplete', 
			  'Cmd-Space': 'autocomplete', 
		      'Ctrl-E': function (cm) {
		    	  $scope.execMScript();
			  },
		      'Cmd-E': function (cm) {
		    	  $scope.execMScript();
			  },
		      'Ctrl-R': function (cm) {
		    	  cm.showHint({hintType: 'Req'});
			  },
		      'Cmd-R': function (cm) {
		    	  cm.showHint({hintType: 'Req'});
			  },
		      'Ctrl-U': function (cm) {
		    	  cm.showHint({hintType: 'UiMap'});
			  },
		      'Cmd-U': function (cm) {
		    	  cm.showHint({hintType: 'UiMap'});
			  },
		      'Ctrl-M': function (cm) {
		    	  cm.showHint({hintType: 'Macro'});
			  },
		      'Cmd-M': function (cm) {
		    	  cm.showHint({hintType: 'Macro'});
			  },
			  'Ctrl-Q': function(cm){ cm.foldCode(cm.getCursor()); },
			  'Cmd-Q': function(cm){ cm.foldCode(cm.getCursor()); },
		      'Ctrl-/': 'toggleComment',
		      'Cmd-/': 'toggleComment',
		      'Ctrl-Right': function(cm) { $scope.nextParam(cm); },
		      'Cmd-Right': function(cm) { $scope.nextParam(cm); },
		      'Ctrl-Left': function(cm) { $scope.prevParam(cm); },
		      'Cmd-Left': function(cm) { $scope.prevParam(cm); },
		  },
			  
		  mode: {name: "mscript", assistList: $scope.assistList}, //"xml"},
//		  mode: {name: 'javascript', assistList: $scope.assistList},
		  gutters: [ "pausedAt", "CodeMirror-linenumbers", "breakpoints", "CodeMirror-foldgutter"],
		  foldGutter: true,
		  highlightSelectionMatches: {showToken: /\w/}
    };
    
    $scope.codemirrorLoaded = function (cm) {
    	$scope.cm = cm;
    	cm.on("gutterClick", $scope.toggleBreakpoint);

		cm.foldCode(CodeMirror.Pos(13, 0));
		cmHintList =  $scope.assistList;
    }

    $scope.nextParam = function (cm) {
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
    }

	$scope.prevParam = function(cm) {
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

	$scope.clearMarkersByType = function (markerType_p) {
		angular.forEach($scope.marker.markerList[markerType_p], function (marker_p) {
//			if (marker_p.parentNode) marker_p.parentNode.removeChild(marker_p);
			marker_p.clear();
		});
		$scope.marker.markerList[markerType_p].length = 0;
	}
	
	$scope.clearMarkers = function (markerType_p) {
		$scope.clearMarkersByType("C");
		$scope.clearMarkersByType("E");
		$scope.clearMarkersByType("L");
		$scope.clearMarkerLines();
		$scope.clearPausedAt();
	}

	$scope.clearMarkerLines = function () {
		$scope.marker.lineWidgetNum = 0;
		angular.forEach($scope.marker.lineMarkerList, function (marker_p) {
			marker_p.clear();
		});
		$scope.marker.lineMarkerList.length = 0;
	}

	$scope.addMarkerLine = function (line, markerClass, markerText, scrollToView_p) {
	    var msg = document.createElement("div");
//	    msg.title = "click to clear this marker line";
	    $scope.marker.lineWidgetNum++;
	    var icon = msg.appendChild(document.createElement("span"));
	    icon.innerHTML = $scope.marker.lineWidgetNum;
	    icon.className = "MScriptMarkerIcon";
	    msg.appendChild(document.createTextNode(markerText));
	    msg.className = "MScriptMarkerLine " + markerClass;
	    $scope.marker.lineMarkerList.push($scope.cm.addLineWidget(line, msg, {above:true, coverGutter: false, noHScroll: true})); 
	    if (scrollToView_p) {
	    	$scope.cm.scrollIntoView ({line: line, ch: 0}, 50);
	    }
	}
	
	$scope.addMarker = function (line, ch, markerType) {
		var markerClassList = {C: "markerCursor", E: "markerExec", L: "markerLine"};
		var markerText = "?";
		var markerClass = markerClassList[markerType];
		markerText = markerType + ($scope.marker.markerList[markerType].length + 1);
		var marker = document.createElement("span");
		marker.innerHTML = "<span class='MScriptMarker " + markerClass + "' title='click to remove this marker'>" + markerText + "</span>";
		marker.line = line+1; // back to 1-based
		marker.markerType = markerType;
		var bookmark = $scope.cm.setBookmark({line: line, ch: ch}, {widget:marker});
		$scope.marker.markerList[markerType].push(bookmark);
		$(marker).click(function() {
			$(this).remove();
		});	
		
		return marker;
	}

	$scope.getMarkerList = function (markerType_p) {
		var retList = [];
		for (i in $scope.marker.markerList) {
			var marker = $scope.marker.markerList[i];
			if (marker.markerType==markerType_p && $(marker).is(":visible")) {
				retList.push(marker);
			}
		}
		return retList;
	}

	$scope.getRunMarkerList = function () {
		var retList = [];
		angular.forEach($scope.getMarkerList ("L"), function (marker_p) {
			if (marker_p.uid) {
				retList.push(marker_p.uid);
			}
		});
		return retList;
	}
	
    $scope.toggleBreakpoint = function(cm, n, gutterID) {
    	if (gutterID!="CodeMirror-foldgutter") {
    		var info = cm.lineInfo(n);
    		var breakOn = false;
    		if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
        		cm.setGutterMarker(n, "breakpoints", null);
    			BDT_Svc.removeBreakpoint (n+1);
    		}
    		else {
        		var breakpoint = cm.setGutterMarker(n, "breakpoints", makeBreakpointMarker());
        		$scope.breakpoints.push(breakpoint);
    			BDT_Svc.setBreakpoint(n+1);
    		}
    	}
	}

    $scope.execMScript = function () {
		var mscript = "";
		if ($scope.cm.somethingSelected()) {
			mscript = $scope.cm.getSelection();
		}
		else {
			var cur = $scope.cm.getCursor();
			mscript = $scope.cm.getLine(cur.line);
		}
		
		$rootScope.$broadcast("sandbox_execMScript", mscript);
//		BDT_Svc.execMScript(mscript, function(retData) {
//			postMsg('info', "MScript Exec Result: " + retData);
//		});
    }

    $scope.setBreakpoint = function(n) {
		var info = $scope.cm.lineInfo(n);
		var breakOn = false;
		if (info.gutterMarkers && info.gutterMarkers.breakpoints) return;
		var breakpoint = $scope.cm.setGutterMarker(n, "breakpoints", makeBreakpointMarker());
		BDT_Svc.setBreakpoint(n+1);
		$scope.breakpoints.push(breakpoint);
	}

	$scope.getBDTList = function () {
		var lastModelName = undefined;
		if ($scope.curBDT && $scope.curBDT.modelName) {
			lastModelName = $scope.curBDT.modelName;
		}
		BDT_Svc.getBDTList (function(data) {
			var newList = [];
			var curModel = data.curModel;
			angular.forEach(data.modelList, function (modelName) {
				var modelObj = {modelName: modelName, selected: false};
				newList.push(modelObj);
				if (curModel.modelName==modelName) {
					$scope.curBDT = modelObj;
					lastModelName = modelObj.modelName;
					if (curModel.execStatus=='RUNNING' || curModel.execStatus=='PAUSED') {
						$scope.curBDT.exec = true;
					}
				}
			});
			
			$scope.BDTList = newList;
			if (lastModelName) {
				var BDTObj = $scope.findBDTObj(lastModelName);
				if (BDTObj) {
					$scope.openBDT(BDTObj);
				}
			}
		});
	}
	
	$scope.openBDT = function (BDTObj_p) {
		angular.forEach($scope.BDTList, function(BDTObj2_p) {
			if (BDTObj2_p) {
				BDTObj2_p.selected = false;
			}
		});
		BDTObj_p.selected = true;
		$scope.loadBDT ( BDTObj_p.modelName);
	}
	
	$scope.loadBDT = function (modelName) {
		if (modelName == undefined) {
			modelName = $scope.curBDT.modelName;
		}
		
		BDT_Svc.getBDT(modelName, function(returnData) {
			if (returnData.modelName) {
				$scope.displayBDT(returnData);
				$scope.startHotSync ();
			}
		});
		
		$scope.clearAllBreakpoints();
		$scope.clearMarkers();
	}
	

	$scope.clearAllBreakpoints = function () {
		angular.forEach($scope.breakpoints, function (lid_p) {
			$scope.cm.setGutterMarker(lid_p, "breakpoints", null);
		});
	}

	$scope.displayBDT = function (BDT) {
		$scope.curBDT = BDT;
		
		$scope.curBDT.originalModelName = $scope.curBDT.modelName;
		$scope.clearAllBreakpoints();
//		angular.forEach($scope.breakpoints, function (lid_p) {
//		  $scope.cm.setGutterMarker(lid_p, "breakpoints", null);
//		});
		$scope.breakpoints.length = 0;
		
		$rootScope.$broadcast("app_modelOpen", $scope.curBDT.modelName);
		
		BDT_Svc.getAssistList (function(retData) {
			$scope.assistList.constList.length=0;
			$scope.assistList.funcList.length=0;
			var constList = $scope.assistList.constList;
			var funcList = $scope.assistList.funcList;
			var reqList = $scope.assistList.reqList;
			mscriptMethodList.length = 0;
			for (funcName in retData) {
				var funcObj = retData[funcName];
				if (funcObj.type=='op' || funcObj.type=='bool' || funcObj.type=='dsMode') {
					constList.push({displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr});
				}
				else {
					var cmp = {displayText: funcName, hint: $scope.hintSelected, text: funcObj.expr};
					funcList.push(cmp);
					var idx2 = funcName.indexOf('(');
					if (idx2>0) funcName = funcName.substring(0,idx2);
					mscriptMethodList[funcName] = true;
				}
			}
		});

		
    	BDT_Svc.getUiMapList (function(retData) {
    		$scope.assistList.uiMapList.length = 0;
    		var uiMapList = $scope.assistList.uiMapList;
    		for (mapID in retData) {
    			var mapObj = retData[mapID];
    			uiMapList.push({displayText: mapID, hint: $scope.hintSelected, text: mapObj.expr});
    		};
    	});

		
    	BDT_Svc.getReqList (function(retData) {
    		$scope.assistList.reqList.length = 0;
    		var reqList = $scope.assistList.reqList;
    		angular.forEach(retData, function (reqObj) {
    			reqList.push({displayText: reqObj.tag, hint: $scope.hintSelected, text: reqObj.tag});
    		});
    	});

    	setTimeout($scope.showBreakpoints, 50);
		$scope.windowResized();
		
//		var idx = 0;
//		var modelName = BDT.modelName;
//		for (var i in $scope.BDTList) {
//			if ($scope.BDTList[i].modelName==modelName) {
//				jQuery('#BDTList').scrollTop(jQuery('#BDTList li:nth-child(' + idx + ')').position().top);
//			}
//		}
	}

	$scope.showBreakpoints = function () {
		BDT_Svc.getBreakpoints (function(retData) {
			angular.forEach (retData, function (breakLID_p) {
				if (breakLID_p.indexOf("L")==0) {
					var n = parseInt(breakLID_p.substring(1))-1;
					$scope.breakpoints.push(n);
					$scope.cm.setGutterMarker(n, "breakpoints", makeBreakpointMarker());
				}
			});
		});
	}
	
	$scope.hintSelected = function (cm, data, completion) {
		cm.replaceRange(completion.text, completion.from || data.from,
                completion.to || data.to, "complete");
		var idx = completion.text.indexOf("'");
		if (idx>0) {
			var nextIdx = completion.text.indexOf("'", idx+1);
			cm.doc.setSelection({line: data.to.line, ch: data.from.ch + idx+1}, {line: data.to.line, ch: data.from.ch + nextIdx})
		}
	}
	
	$scope.saveBDT = function () {
		postMsg("info", "saving BDT model");
		BDT_Svc.saveBDT($scope.curBDT.script, function(scriptErrorList_p)  {
			$scope.showMScriptError(scriptErrorList_p, "MScript changes saved", "MScript saved with compiling errors", true);
		});
	}
	
    $scope.findBDTObj = function (modelName_p) {
    	var foundBDT = null;
		angular.forEach($scope.BDTList, function(BDTObj_p) {
			if (BDTObj_p.modelName==modelName_p) {
				foundBDT = BDTObj_p;
			}
		});
		return foundBDT;
    }
    
    $scope.showExecStats = function () {
    	$scope.stopHotSync();
		BDT_Svc.getExecStats ($scope.curBDT.modelName, 0, function(stats_p) {
	    	var statsClass = "execStatsPassed";
	    	$scope.clearMarkerLines();
	    	if (stats_p.modelExec.tcCount<=0 && stats_p.modelExec.failCount<=0) return;
	    	
	    	if (stats_p.modelExec.status=="failed" || stats_p.modelExec.failCount>0) {
	    		statsClass = "execStatsFailed";
	    	}
	    	var markerText = "TestCases Executed: " + stats_p.modelExec.tcCount + "; Failures Found: " + stats_p.modelExec.failCount;
	    	$scope.addMarkerLine(0, statsClass, markerText, true);
    		$scope.cm.scrollIntoView({line: 0, ch:1}, 50);
	    	angular.forEach(stats_p.tcList, function (tcObj_p) {
	    		if (tcObj_p.tcStatus=='failed') {
	        		angular.forEach(tcObj_p.StepList, function (stepObj_p) {
	        			if (stepObj_p.status=='failed') {
	        				angular.forEach(stepObj_p.itemList, function (itemObj_p) {
	        					if (itemObj_p.status=='failed') {
	        				    	markerText = "Failed [" + itemObj_p.lid + "]: " + itemObj_p.execMsg;
	        				    	$scope.addMarkerLine(parseInt(itemObj_p.lid)-1, "execStatsFailed", markerText, false);
	        					}
	        				});
	        			}
	        		});
	    		}
	    	});
		});
    }
    
	$scope.renameBDT = function () {
		if ($scope.curBDT.originalModelName==$scope.curBDT.modelName) {
			return;
		}
		
		BDT_Svc.renameBDT ($scope.curBDT.originalModelName, $scope.curBDT.modelName, 
			function(returnData) {
				for (i in $scope.BDTList) {
					var BDTObj = $scope.BDTList[i];
					if (BDTObj.modelName==$scope.curBDT.originalModelName) {
						BDTObj.modelName = $scope.curBDT.modelName;
						break;
					}
				}
				$rootScope.$broadcast("GroupRenamed", {originBDTupName: $scope.curBDT.originalModelName, newmodelName: $scope.curBDT.modelName});
				postMsg ("info", "BDT renamed from " + originalModelName + " to " + $scope.curBDT.modelName);
				$scope.curBDT.originalModelName = $scope.curBDT.modelName;
			},
			function (returnData) {
				postMsg ("error", 'Failed to rename current BDT to ' + $scope.curBDT.modelName);
				$scope.curBDT.modelName = $scope.curBDT.originalModelName;
			}
		);
	}

	$scope.stepOver = function () {
    	IdeContext.callURL("/MbtSvr/app=webmbt&action=stepScript", function() {
    		$scope.startHotSync();
    	});
	}

	$scope.toggleFold = function (startKeyWordsList_p) {
	   $scope.cm.operation(function() {
	       for (var l = $scope.cm.firstLine(); l <= $scope.cm.lastLine(); ++l) {
	    	   var line = $scope.cm.getLine(l);
	    	   for (var i=0; i<startKeyWordsList_p.length; i++) {
		    	   if (startKeyWordsList_p[i].test(line)) {
			    	   $scope.cm.foldCode({line: l, ch: 0}, null, "toggleFold");
			    	   break;
		    	   }
	    	   }
	       }
	    });
	}
	
	$scope.showMScriptError = function (scriptErrorList_p, successMsg_p, errorMsg_p) {
		if (scriptErrorList_p.length==0) {
	    	$scope.addMarkerLine(0, "compileSuccess", successMsg_p, true);
		}
		else {
	    	$scope.addMarkerLine(0, "compileError", errorMsg_p + ": " + scriptErrorList_p.length, true);
			angular.forEach(scriptErrorList_p, function (parserErr_p) {
				var errMsg = parserErr_p.lid + ": " + parserErr_p.errMsg;
		    	$scope.addMarkerLine(parserErr_p.lid-1, "compileError", errMsg, false);
			});
		}
	}
	
	$scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();    	
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, screenID);
		});

    	var screenID = 'BDT_Editor';
    	
		$scope.pausedAtMarker = document.createElement("div");
		$scope.pausedAtMarker.innerHTML = "<img src='img/PausedAt.png' style='width:10px;'/>";

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptGoTop", function (event, message) {
    		$scope.cm.execCommand("goDocStart");
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptGoBottom", function (event, message) {
    		$scope.cm.execCommand("goDocEnd");
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptIndentLess", function (event, message) {
    		$scope.cm.execCommand("indentLess");
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptIndentMore", function (event, message) {
    		$scope.cm.execCommand("indentMore");
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_NewBDT", function (event, message) {
    		var newmodelName = "New_BDT";
    		var i = 0;
    		angular.forEach($scope.BDTList, function (BDTObj_p) {
    			if (newmodelName==BDTObj_p.modelName) {
    				i = i+1;
    				newmodelName = "New_BDT_" + i;
    			}
    		});
			BDT_Svc.newBDT(newmodelName, function() {
				var newBDT = {modelName: newmodelName, selected: true};
				$scope.BDTList.push(newBDT);
				$scope.openBDT (newBDT);
				postMsg('info', 'New BDT created ' + newmodelName);
			});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_SaveAsBDT", function (event, message) {
    		var newmodelName = $scope.curBDT.modelName + "_Copy";
    		var i = 0;
    		angular.forEach($scope.BDTList, function (BDTObj_p) {
    			if (newmodelName==BDTObj_p.modelName) {
    				i = i+1;
    				newmodelName = newmodelName + "_Copy";
    			}
    		})
			BDT_Svc.saveAs($scope.curBDT.modelName, newmodelName, function() {
				var newBDT = {modelName: newmodelName, selected: true};
				$scope.BDTList.splice (i,i, newBDT);
				$scope.openBDT (newBDT);
				postMsg ('info', 'Current BDT cloned to ' + newmodelName);
			});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptCompile", function (event, message) {
			BDT_Svc.compileBDT($scope.curBDT.script, function(scriptErrorList_p) {
				$scope.showMScriptError(scriptErrorList_p, "MScript compiled without errors", "MScript compiled with errors", true);
			});
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_SaveBDT", function (event, message) {
    		$scope.saveBDT();
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_RefreshBDTList", function (event, message) {
    		$scope.getBDTList();
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptComment", function (event, message) {
    		$scope.cm.execCommand("toggleComment");
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_DelBDT", function (event, message) {
    		var delList = [];
    		angular.forEach($scope.BDTList, function(BDTObj_p) {
    			if (BDTObj_p && (BDTObj_p.hide==undefined || !BDTObj_p.hide) && BDTObj_p.selected) {
    				delList.push(BDTObj_p);
    			}
    		});
			if (delList.length>0 && confirm ('Do you wish to delete selected ' + delList.length + ' BDT(s)?')) {
	    		angular.forEach(delList, function(BDTObj_p) {
    				BDT_Svc.delBDT (BDTObj_p.modelName, function() {
    						if (BDTObj_p==$scope.BDT) {
    							$scope.BDT = {};
    						}
							var idx = $scope.BDTList.indexOf(BDTObj_p);
							if (idx>=0) {
								$scope.BDTList.splice(idx,1);
								postMsg ("info", "Deleted BDT " + BDTObj_p.modelName);
							}
							if (BDTObj_p.modelName==$scope.curBDT.modelName) {
								$scope.curBDT = undefined;
							}
	    				}
    				);
	    		});
			}
		});

//    	IdeEvents.regEvent($scope, screenID, "menu_HideBDTList", function (event, message) {
//    		if ($scope.splitPct>0) {
//        		$scope.preSplitPct = $scope.splitPct;
//        		$scope.splitPct = 0;
//    		}
//    		$scope.windowResized();
//		});
//		
//    	IdeEvents.regEvent($scope, screenID, "menu_ShowBDTList", function (event, message) { 
//    		if ($scope.preSplitPct<=0) {
//    			$scope.preSplitPct = 30;
//    		}
//    		$scope.splitPct = $scope.preSplitPct;
//    		$scope.windowResized();
//		});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_RefreshBDT", function (event, message) {
    		$scope.loadBDT($scope.curBDT.modelName);
		});

    	IdeEvents.regEvent($scope, screenID, "menu_RefreshBDTExec", function (event, message) {
    		BDT_Svc.getBDTStats ($scope.curBDT.modelName);
		});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_StopBDT", function (event, message) {
    		if ($scope.curBDT==undefined) {
        		postMsg("alert", "Model not open");
    		}
    		else if ($scope.curBDT.exec) {
        		$scope.curBDT.play = false;
    			BDT_Svc.stopBDT ($scope.curBDT.modelName, function(retData) {
    	        	$scope.startHotSync();
    			});
    		}
    		else {
        		postMsg("alert", "Model not executing");
    		}
		});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_RunBDT", function (event, message) {
        	$scope.clearMarkerLines();
    		$scope.clearPausedAt();
    		
    		if ($scope.curBDT==undefined || $scope.curBDT.modelName=="") {
        		postMsg("alert", "Model not open");
        		return;
    		}
    		if ($scope.curBDT.exec) {
    			BDT_Svc.continueBDT($scope.curBDT.modelName);
    			setTimeout($scope.startHotSync, 1000);
    			return;
    		}

    		$scope.curBDT.play = false;
    		BDT_Svc.runBDT ($scope.getRunMarkerList(), function(returnData) {
        		$scope.curBDT.exec = true;
        		postMsg("info", "model started");
        	    setTimeout($scope.startHotSync,1000);
    		});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_PauseBDT", function (event, message) {
    		$scope.clearPausedAt();
    		if ($scope.curBDT==undefined || $scope.curBDT.modelName=="") {
        		postMsg("alert", "Model not open");
        		return;
    		}
    		if (!$scope.curBDT.exec) {
    			postMsg ("alert", "Model not executing");
    			return;
    		}
    		$scope.curBDT.play = false;
    		BDT_Svc.pauseBDT ($scope.curBDT.modelName, function(returnData) {
        		postMsg("info", "Pause request submitted");
        	    $scope.startHotSync();
    		});
		});

    	IdeEvents.regEvent($scope, screenID, "menu_ResumeBDT", function (event, message) {
    		$scope.clearPausedAt();
    		if ($scope.curBDT==undefined || $scope.curBDT.modelName=="") {
        		postMsg("alert", "Model not open");
        		return;
    		}
    		if ($scope.curBDT.exec) {
        		$scope.curBDT.play = false;
        		BDT_Svc.resumeBDT ($scope.curBDT.modelName, function(returnData) {
        			$scope.startHotSync();
            		postMsg("info", "Resume request submitted");
        		});
    		}
    		else {
        		postMsg("alert", "Model not executing");
    		}
		});

    	IdeEvents.regEvent($scope, screenID, "menu_DebugBDT", function (event, message) {
    		$scope.clearPausedAt();
        	$scope.clearMarkerLines();
    		if ($scope.curBDT==undefined) {
        		postMsg("alert", "Model not open");
        		return;
    		}
    		if ($scope.curBDT.exec) {
    			postMsg ("alert", "Model already executing");
    			return;
    		}
    		
    		$scope.curBDT.play = false;
    		BDT_Svc.debugBDT ($scope.getRunMarkerList(), function(retData) {
        		$scope.curBDT.exec = true;
    			postMsg ("info", "BDT execution started in debug mode.");
    			$scope.startHotSync();
    		});
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "menu_StartPlay", function (event, message) { 
    		$scope.clearPausedAt();
        	$scope.clearMarkerLines();
    		if ($scope.curBDT==undefined) {
        		postMsg("alert", "Model not open");
        		return;
    		}
    		if ($scope.curBDT.exec) {
        		$scope.curBDT.play = true;
        		$scope.stepOver();
    			return;
    		}
    		$scope.setBreakpoint(1);
    		BDT_Svc.playBDT ($scope.getRunMarkerList(), function(retData) {
        		$scope.curBDT.exec = true;
        		$scope.curBDT.play = true;
    			postMsg ("info", "BDT execution started in play/animate mode.");
        	    $scope.startHotSync();
    		});
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_StepOverBDT", function (event, message) {
    		$scope.stepOver();
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptFind", function (event, message) {
    		$scope.cm.execCommand('find');
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptReplace", function (event, message) {
    		$scope.cm.execCommand('replace');
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptRedo", function (event, message) {
    		$scope.cm.redo();
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptUndo", function (event, message) {
    		$scope.cm.undo();
    	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_MScriptExpandAll", function (event, message) {
		   $scope.cm.operation(function() {
		       for (var l = $scope.cm.firstLine(); l <= $scope.cm.lastLine(); ++l) {
		    	   $scope.cm.foldCode({line: l, ch: 0}, null, "unfold");
		       }
		    });
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptFoldAll", function (event, message) {
		   $scope.cm.operation(function() {
		       for (var l = $scope.cm.firstLine(); l <= $scope.cm.lastLine(); ++l) {
		    	   $scope.cm.foldCode({line: l, ch: 0}, null, "fold");
		       }
		    });
   		
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptFoldFeature", function (event, message) {
		   $scope.toggleFold ([new RegExp('^\\s*SETUP\\b','i'), new RegExp('^\\s*TEARDOWN\\b','i'), new RegExp('^\\s*FEATURE\\b','i')]);
    	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptFoldScenario", function (event, message) {
 		   $scope.toggleFold ([new RegExp('^\\s*PREP\\b','i'), new RegExp('^\\s*SCENARIO\\b','i')]);
     	});

    	IdeEvents.regEvent($scope, screenID, "menu_MScriptFoldTrigger", function (event, message) {
 		   $scope.toggleFold ([new RegExp('^\\s*GIVEN\\b','i'), new RegExp('^\\s*WHEN\\b','i'), new RegExp('^\\s*THEN\\b','i')]);
      	});

    	IdeEvents.regEvent($scope, screenID, "menu_ToggleBreakBDT", function (event, message) {
    		var cur = $scope.cm.getCursor();
    		$scope.toggleBreakpoint($scope.cm, cur.line, "breakpoints");
     	});
    	
    	IdeEvents.regEvent($scope, screenID, "menu_ClearAllBreakBDT", function (event, message) {
    		$scope.clearAllBreakpoints();
     	});

    	
    	IdeEvents.regEvent($scope, $scope.screenID, "menu_HideList", function (event, message) {
    		if (IdeContext.navLeftHide ($scope, 'BDT_Editor')) {
    			$scope.windowResized();
    		}
    	});
    	
    	IdeEvents.regEvent($scope, $scope.screenID, "menu_ShowList", function (event, message) { 
    		if (IdeContext.navLeftShow ($scope, 'BDT_Editor')) {
    			$scope.windowResized();
    		}
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "MScript_MarkerExec", function (event, message) { 
    		$scope.addMarker (message.line, 0, message.markerType);
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "menu_MScriptMarkerCursor", function (event, message) { 
    		var cur = $scope.cm.getCursor();
    		$scope.addMarker(cur.line, cur.ch, 'C');
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "menu_MScriptMarkerLine", function (event, message) { 
    		var cur = $scope.cm.getCursor();
    		BDT_Svc.getUID (cur.line+1, function(retData) {
    			if (retData.uid == undefined || retData.uid=="") return;
    			var foundI = -1;
    			for (var i=0; i<$scope.marker.markerList.length; i++) {
    				var marker = $scope.marker.markerList[i];
    				if (marker.uid && marker.uid==retData.uid) {
    					foundI = i;
    					if (marker.parentNode) marker.parentNode.removeChild(marker);
    					$scope.marker.markerList.splice(foundI,1);
    					return;
    				}
    			}
        		var marker = $scope.addMarker(retData.lid-1, 0, 'L');
        		marker.uid = retData.uid;
    		});
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "menu_MScriptMarkerClear", function (event, message) { 
    		if (message.btnId) {
        		$scope.clearMarkers();
    		}
    		else {
        		$scope.clearMarkersByType(message);
    		}
    	});

    	IdeEvents.regEvent($scope, $scope.screenID, "menu_ExecMScript", function (event, message) { 
    		$scope.execMScript();
    	});

    	
    	IdeEvents.regEvent($scope, screenID, "RibbonTabSelected", function (event, message) {
    		if (message=='TestSuite') {
        		IdeContext.navLeftShow ($scope, 'BDT_Editor');
    			$scope.windowResized();
    		}
    		else {
        		IdeContext.navLeftHide ($scope, 'BDT_Editor');
    			$scope.windowResized();
    		}
		});

    	IdeEvents.regEvent($scope, screenID, "menu_AcquireModelLock", function (event, message) {
    		BDT_Svc.acquireModelLock(function(data) {
    			if (data.error) {
        			postMsg ("warn", data.error);
    			}
    			else {
        			postMsg ("info", data.alertMessage);
    			}
    		});
    	});

    	$scope.getBDTList();
    };

    $scope.init();
    $scope.lastPausedAtLID = 0;
    $scope.hotSyncStopTime = undefined; // sets to the time when hotsyn is to be stopped
    $scope.hotSyncBlocked = true;
    
    $scope.startHotSync = function () {
    	$scope.hotSyncStopTime = undefined;
    	$scope.hotSyncBlocked = false;
    }

    $scope.stopHotSync = function (extraMillis) {
		$scope.hotSyncStopTime = (new Date()).getTime();
		if (extraMillis>0) $scope.hotSyncStopTime += extraMillis;
    }
    
    $scope.hotSync = function () {
    	if ($scope.hotSyncBlocked) return;
    	if ($scope.hotSyncStopTime==undefined || $scope.hotSyncStopTime > (new Date()).getTime()) {
    		$scope.getPausedAt();
    	}
    }

    setInterval($scope.hotSync, 450);

    $scope.clearPausedAt = function () {
//		if ($scope.marker.pausedAtElem && $scope.marker.pausedAtElem.parentNode) {
//			$scope.marker.pausedAtElem.parentNode.removeChild($scope.marker.pausedAtElem);
//		}
   		if ($scope.lastPausedAtLID>0) {
   			$scope.cm.setGutterMarker($scope.lastPausedAtLID-1, "pausedAt", null);
//   			$scope.cm.doc.removeLineClass($scope.lastPausedAtLID, 'background', 'pausedAt');
  		}
    }
    
    $scope.getPausedAt = function () {
    	$scope.hotSyncBlocked = true;
    	BDT_Svc.getSysMsg (function (msgList_p) {
    		angular.forEach(msgList_p, function (msg_p) {
    			postMsg(msg_p.level, msg_p.msg);
    		});
    	});
    	
    	if ($scope.curBDT==undefined) {
    		$scope.stopHotSync(500);
    		return;
    	}
    	
    	BDT_Svc.getPausedAt (function (retData) {
        	$scope.hotSyncBlocked = false;
    		var pausedAt = retData.pausedAt[0];
    		if (retData.running=='RUNNING' || retData.running=="PAUSED" && pausedAt==undefined) {
        		$scope.curBDT.exec = true;
    			$scope.hotSyncStopTime = undefined;
    		}
    		else if (retData.running=='PAUSED') {
        		$scope.curBDT.exec = true;
    			$scope.stopHotSync (50);  
        		if ($scope.curBDT.play) {
        			setTimeout($scope.stepOver, 1000);
    			}
    		}
    		else {
    			$scope.stopHotSync ();
    			if ($scope.curBDT.exec) {
					$scope.showExecStats();
    			}
        		$scope.curBDT.exec = false;
//    			$scope.clearPausedAt();
    			return;
    		}

    		if (pausedAt && pausedAt.lid>=0) {
        		$scope.clearPausedAt();
        		postMsg ("info", "uid=" + pausedAt.uid + ", lid=" + pausedAt.lid + ", " + pausedAt.desc);
        		cur = $scope.cm.getCursor();
        		$scope.cm.setGutterMarker(pausedAt.lid-1, "pausedAt", $scope.pausedAtMarker);
        		$scope.lastPausedAtLID = pausedAt.lid;
        		$scope.cm.scrollIntoView({line: $scope.lastPausedAtLID, ch:1}, 50);
        		
        	}
    	});
    }
});


