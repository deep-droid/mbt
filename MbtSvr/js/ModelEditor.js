// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ModelEditor.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	if (parentWinObj) parentWinObj.handleJsError(errMsg, fileName, lineNum);
}


zIndexHiliteItem = 9;

var modelObj;
var modelLoaded = false;
var pausedClassList = ["#FFCC99", "#FFCC99"];//["paused", "paused-alt"];
var trailingClassList = ["#FFEEAA", "#FFEEAA"];//["paused-t0", "paused-t1"];
var modelCanvas;

var incomingClass = "#F5F500"; // "liteupIn";
var startClass = "#FF7F50"; // "liteupStart";
var outgoingClass = "#A6D785"; // "liteupOut";
var liteupStateObj = null;
var notepadUID;
var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";
var curStateNode; // state node last clicked on (regardless if it's selected/marked or not
var SubModelColor = "#FFFDCF";

//var cutStateUID;

var modelCtxMenuBindings = {
	'menuID': 'ctxMenuModel',
	'editModelProp': function(ui) {
		parentWinObj.modelPropDialog();
	},
	'editCanvasProp': function(ui) {
		parentWinObj.canvasProperty();
	},
	'modelNotepad': function(ui) {
		popupNotePad("scxml");
	},
	'showCoverage': function(ui) {
		showCoverage(false);
	},
	'showUncovered': function(ui) {
		showUncovered();
	},
	'autoLayout': function(ui) {
		autoLayout();
	},
	'openSearch': function(ui) {
		openSearch();
	},
	'alignLeft': function(ui) {
		JSDiagram.alignMarkedLeft();
		parentWinObj.setModelChanged(true);
	},
	'alignRight': function(ui) {
		JSDiagram.alignMarkedRight();
		parentWinObj.setModelChanged(true);
	},
	'alignTop': function(ui) {
		JSDiagram.alignMarkedTop();
		parentWinObj.setModelChanged(true);
	},
	'alignBottom': function(ui) {
		JSDiagram.alignMarkedBottom();
		parentWinObj.setModelChanged(true);
	},
	'startReplay': function(ui) {
		replayPausedAt();
	},
	'stopReplay': function(ui) {
		stopReplayPausedAt();
	},
	'addStateReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "");
	},
	'addVertSyncReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "BV");
	},
	'addHorzSyncReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "BH");
	},
	'addBranchReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "B");
	},
	'addSwitchReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "W");
	},
	'addInitialReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "Initial");
	},
	'addFinalReq': function(ui) {
		addStateToServerReq(null, JSDiagram.getCurPosLeft(), JSDiagram.getCurPosTop(), false, "Final");
	},
	'addSwimlaneReq': function(ui) {
		parentWinObj.newNode(parentWinObj.curAppState.nodeDataList["misc"].uid, 'swimlane');
	},
	'addBoxReq': function(ui) {
		parentWinObj.newNode(parentWinObj.curAppState.nodeDataList["misc"].uid, 'box', false, {left: JSDiagram.getCurPosLeft(), top: JSDiagram.getCurPosTop()});
	},
	'pasteState': function(ui) {
		JSDiagram.getMarkedStates().each(function() {
			var cutStateUID = $(this).attr("id");
			JSDiagram.moveState(cutStateUID, "modelCanvas");
			moveStateToNewParent (cutStateUID, "", true);
		});
		parentWinObj.setModelChanged(true);
		JSDiagram.clearMarks();
	},
	'insSubModel': function(ui) {
		insertSubModel('');
	},
	'clearBreaks': function(ui) {
		parentWinObj.clearBreaks();
	},
	'clearMarks': function(ui) {
		JSDiagram.clearMarks();
		parentWinObj.setCurStateTrans(null);
	},
	'markAll': function(ui) {
		JSDiagram.markAllStates(null);
		parentWinObj.setCurStateTrans(null);
	},
	'showAllSubModels': function(ui) {
		showAllSubModels();
	},
	'hideAllSubModels': function(ui) {
		hideAllSubModels();
	},
	'onShowMenu': function (e, menu) {
		var subModelName = parentWinObj.getCopyModelName();
		if (!subModelName || subModelName=="") {
			$(menu).find("#insSubModel").hide();
		}
		
		checkMenuCFG(menu);
		if (parentWinObj.isMBBA()) {
			$(menu).find(".mbba").show();
		}
		else {
			$(menu).find(".mbba").hide();
		}
		
		markedStateList = JSDiagram.getMarkedStates();
		if (markedStateList.length<=0) {
			$(menu).find(".pasteState").hide();	
		}
		
		if (markedStateList.length<=1) {
			$(menu).find(".align").hide();
		}
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      width: '125px',
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px'
    },
    itemStyle: {
      margin: '0px',
      color: ctxMenuColor,
      display: 'block',
      cursor: 'default',
      backgroundColor: ctxMenuBkgColor
    },
    itemHoverStyle: {
      color: ctxMenuHoverColor,
      backgroundColor: ctxMenuHoverBkgColor
    }
}


var stateCtxMenuBindings = {
	'menuID': 'ctxMenuState',
	'stateProp': function(ui) {
		var uid = $(ui).attr("id");
		var state = JSDiagram.findState(uid);
		if (state) {
			if (state.readonly) {
				parentWinObj.editStateTransFilter(state.parentState.stateUID, uid);
			}
			else {
				parentWinObj.editStateProperty(uid);
			}
		}
	},
	'stateAnnot': function(ui) {
		var uid = $(ui).attr("id");
		parentWinObj.editStateTransAnnot(uid);
	},
	'stateMScript': function(ui) {
		parentWinObj.startEditMScript({uid: $(ui).attr("id"), trigger: "all"});
	},
	'stateNotepad': function(ui) {
		popupNotePad($(ui).attr("id"));
	},
	'openSubModel': function(ui) {
		openSubModel($(ui).attr("id"));
	},
	'showSubModel': function(ui) {
		var uid = $(ui).attr("id");
		showSubModel(uid);
		if (parentWinObj.isModelCFG()) {
			$(menu).find(".cfg").show();
		}
		else {
			$(menu).find(".cfg").hide();
		}
	},
	'hideSubModel': function(ui) {
		var uid = $(ui).attr("id");
		hideSubModel(uid);
	},
	'showSubStates': function(ui) {
		var uid = $(ui).attr("id");
		showSubStates(uid);
	},
	'hideSubStates': function(ui) {
		var uid = $(ui).attr("id");
		hideSubStates(uid);
	},
	'markSubStates': function(ui) {
		var parentUID = $(ui).attr("id");
		JSDiagram.markAllStates(parentUID);
		parentWinObj.setCurStateTrans(null);
	},
	'addStateReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "");
	},
	'addVertSyncReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "BV");
	},
	'addHorzSyncReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "BH");
	},
	'addBranchReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "B");
	},
	'addWitchReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "W");
	},
	'addInitialReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "Initial");
	},
	'addFinalReq': function(ui) {
		var parentUID = $(ui).attr("id");
		addStateToServerReq(parentUID, JSDiagram.getCurPosLeftInState(parentUID), JSDiagram.getCurPosTopInState(parentUID), false, "Final");
	},
	'delState': function(ui) {
		var delUID = $(ui).attr("id");
		var stateObj = JSDiagram.findState(delUID);
		deleteState(stateObj);
	},
	'alignLeft': function(ui) {
		JSDiagram.alignMarkedLeft();
		parentWinObj.setModelChanged(true);
	},
	'alignRight': function(ui) {
		JSDiagram.alignMarkedRight();
		parentWinObj.setModelChanged(true);
	},
	'alignTop': function(ui) {
		JSDiagram.alignMarkedTop();
		parentWinObj.setModelChanged(true);
	},
	'alignBottom': function(ui) {
		JSDiagram.alignMarkedBottom();
		parentWinObj.setModelChanged(true);
	},
	'pasteState': function(ui) {
		var parentStateUID = $(ui).attr("id");
		JSDiagram.getMarkedStates().each(function() {
			var cutStateUID = $(this).attr("id");
			if (cutStateUID!=parentStateUID) {
				JSDiagram.moveState(cutStateUID, parentStateUID);
				moveStateToNewParent (cutStateUID, parentStateUID, true);
			}
		});
		
		parentWinObj.setModelChanged(true);
		JSDiagram.clearMarks();
	},
	'addTrans': function(ui, curTarget, e) {
		JSDiagram.startAddTrans($(ui).attr("id"), e);
	},
	'pasteTrans': function(ui) {
		var srcStateUID = $(ui).attr("id");
		parentWinObj.setModelChanged(true);
		copyPasteTrans(srcStateUID);
	},
	'insStateSubModel': function(ui) {
		// if any  and move the  states
		insertSubModel($(ui).attr("id"));
	},
	'addMCase': function(ui) {
		var uid = $(ui).attr("id");
		addStateToMCaseReq(uid);
	},
	'toggleStateBreak': function(ui) {
		var uid = $(ui).attr("id");
		toggleBreak(uid);
	},
	'guardView': function(ui) {
		var uid = $(ui).attr("id");
		popupGuardsView(uid);
	},
	'onShowMenu': function (e, menu) {
		var stateUID = $(e.target).attr("id");
		if (stateUID==undefined) {
			stateUID = $(e.target).parents(".state:first").attr("id");
		}

		var stateObj = JSDiagram.findState(stateUID);
		if (stateObj.readonly) {
			$(menu).find("li").hide();
			$(menu).find(".readonly").show();
			checkMenuCFG(menu);
			return;
		}
		checkMenuCFG(menu);
		
		var stateNode = parentWinObj.curAppState.nodeDataList[stateUID];
		if (!stateObj.isBranch() && stateNode.subModel!="") {
			$(menu).find("#openSubModel").show();
		}
		else {
			$(menu).find("#openSubModel").hide();
		}

		if (stateObj.isBranch()) {
			$(menu).find("#addStateReq, #markSubStates, #addBranchReq").hide();
		}
		
		var subModelName = parentWinObj.getCopyModelName();
		if (stateObj.isBranch() || !subModelName || subModelName=="") {
			$(menu).find("#insStateSubModel").hide();
		}
		$(menu).find("#showSubModel, #hideSubModel").hide();
		if (stateObj.subModelName && stateObj.subModelName!="") {
			if (stateObj.childrenHidden) {
				$(menu).find("#showSubModel").show();
			}
			else {
				$(menu).find("#hideSubModel").show();
			}
		}

		$(menu).find("#showSubStates, #hideSubStates").hide();
		if (stateNode.childrenStates && stateNode.childrenStates.length>0 && (stateObj.subModelName==undefined || stateObj.subModelName=="")) {
			if (stateObj.childrenHidden) {
				$(menu).find("#showSubStates").show();
			}
			else {
				$(menu).find("#hideSubStates").show();
			}
		}

		if (stateObj.isBranch()) {
			$(menu).find(".subState").hide();
		}
		
		markedStateList = JSDiagram.getMarkedStates();
		if (markedStateList.length<=0) {
			$(menu).find(".pasteState").hide();	
		}
		
		if (markedStateList.length<=1) {
			$(menu).find(".align").hide();
		}
		
		var markedTransList = JSDiagram.getMarkedTrans();
		if (markedTransList.length <=0) {
			$(menu).find("#pasteTrans").hide();
		}
		
		if (stateObj.isFinal) {
			$(menu).find("#addTrans").hide();
		}
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px',
      width: '125px'
    },
    itemStyle: {
      margin: '0px',
      color: ctxMenuColor,
      display: 'block',
      cursor: 'default',
      padding: '0px',
      backgroundColor: ctxMenuBkgColor
    },
    itemHoverStyle: {
      color: ctxMenuHoverColor,
      backgroundColor: ctxMenuHoverBkgColor
    }
}

function checkMenuCFG(menu) {
	if (parentWinObj.isModelCFG()) {
//		$(menu).find(".cfg").show();
		$(menu).find(".efsm").hide();
		$(menu).find(".menuNodeType").text("Process");
		$(menu).find(".menuEdgeType").text("Edge");
	}
	else if (parentWinObj.isModelFSM()) {
		$(menu).find(".cfg").hide();
//		$(menu).find(".efsm").show();
		$(menu).find(".menuNodeType").text("State");
		$(menu).find(".menuEdgeType").text("Transition");
	}
	else {
		$(menu).find(".fsm").hide();
		$(menu).find(".menuNodeType").text("Node");
		$(menu).find(".menuEdgeType").text("Edge");
	}
}

var transCtxMenuBindings = {
	'menuID': 'ctxMenuTrans',
	'transProp': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		var trans = JSDiagram.findTrans(uid);
		if (trans) {
			if (trans.readonly) {
				var stateTemp = trans.srcState.parentState;
				parentWinObj.editStateTransFilter(stateTemp.stateUID, uid);
			}
			else {
				parentWinObj.editTransProperty(uid);
			}
		}
		
	},
	'transAnnot': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		parentWinObj.editStateTransAnnot(uid);
	},
	'transMScript': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		parentWinObj.startEditMScript({uid: uid, trigger: "all"});
	},
	'transDataSet': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		parentWinObj.startDataSet({uid: uid});
	},
	'transNotepad': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		popupNotePad(uid);
	},
	'delTrans': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		var transObj = JSDiagram.findTrans(uid);
		if (transObj) {
			deleteTrans(transObj);
		}
	},
	'copyTrans': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		var markedUIDList = JSDiagram.getAllMarkedUID();
		if (markedUIDList.length==1 && JSDiagram.findTrans(markedUIDList[0])!=null && markedUIDList[0]!=uid) {
			copyTrans(markedUIDList[0], uid);
		}
	},
	'addMCase': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		addTransToMCaseReq(uid);
	},
	'toggleTransBreak': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		toggleBreak(uid);
	},
	'reverseTrans': function(ui) {
		var uid = $(ui).attr("uid");
		if (uid==undefined) uid = $(ui).attr("id");
		reverseTrans(uid);
	},
	'onShowMenu': function (e, menu) {
		var transUID = $(e.target).attr("uid");
		if (transUID==undefined) transUID = $(e.target).attr("id");
		if (transUID==undefined) transUID = $(e.target).parent().attr("id");
		var transObj = JSDiagram.findTrans(transUID);
		if (transObj && transObj.readonly) {
			$(menu).find("li").hide();
			$(menu).find(".readonly").show();
			checkMenuCFG(menu);
			return;
		}
		checkMenuCFG(menu);

		var markedUIDList = JSDiagram.getAllMarkedUID();
		if (markedUIDList.length!=1 || JSDiagram.findTrans(markedUIDList[0])==null) {
			$(menu).find("#copyTrans").hide();
		}
		
		return menu;
	
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px',
      width: '125px'
    },
    itemStyle: {
      margin: '0px',
      color: ctxMenuColor,
      display: 'block',
      cursor: 'default',
      padding: '0px',
      backgroundColor: ctxMenuBkgColor
    },
    itemHoverStyle: {
      color: ctxMenuHoverColor,
      backgroundColor: ctxMenuHoverBkgColor
    }
}


var swimlaneCtxMenuBindings = {
	'menuID': 'ctxMenuSwimlane',
	'editProp': function(ui) {
		var uid = $(ui).parents("div").attr("id");
		parentWinObj.editSwimlaneProperty(uid);
	},
	'delSwimlane': function(ui) {
		var uid = $(ui).parents("div").attr("id");
		deleteSwimlane(uid);
	},
	'onShowMenu': function (e, menu) {
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      width: '125px',
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px'
    },
    itemStyle: {
      margin: '0px',
      color: ctxMenuColor,
      display: 'block',
      cursor: 'default',
      backgroundColor: ctxMenuBkgColor
    },
    itemHoverStyle: {
      color: ctxMenuHoverColor,
      backgroundColor: ctxMenuHoverBkgColor
    }
}

var boxCtxMenuBindings = {
	'menuID': 'ctxMenuBox',
	'editProp': function(ui) {
		var uid = $(ui).parents("div").attr("id");
		parentWinObj.editBoxProperty(uid);
	},
	'delBox': function(ui) {
		var uid = $(ui).parents("div").attr("id");
		deleteBox(uid);
	},
	'onShowMenu': function (e, menu) {
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      width: '125px',
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px'
    },
    itemStyle: {
      margin: '0px',
      color: ctxMenuColor,
      display: 'block',
      cursor: 'default',
      backgroundColor: ctxMenuBkgColor
    },
    itemHoverStyle: {
      color: ctxMenuHoverColor,
      backgroundColor: ctxMenuHoverBkgColor
    }
}


function deleteStateTrans(uidList) {
	parentWinObj.postActionUtil("deleteNode", "uidList=" + uidList.join(","), function (data) {
		parentWinObj.actionCallback(data);
		var delNodeList = data.deletenodes.nodelist;
		for (var i in delNodeList) {
			var node = delNodeList[i];
			if (node.typeCode=="state") {
				var stateObj = JSDiagram.findState(node.uid);
				if (stateObj) {
					stateObj.deleteObj();
					delStateFromView(stateObj);
				}
			}
			else if (node.typeCode=="transition") {
				var transObj = JSDiagram.findTrans(node.uid);
				if (transObj) {
					transObj.deleteObj();
					delTransFromView(transObj);
				}
			}
			parentWinObj.curAppState.nodeDataList[node.uid] = null;
		}
		parentWinObj.reloadModel();
		parentWinObj.setModelChanged(true);
	}, "json");
}

function deleteState(stateObj_p) {
	if (stateObj_p) {
		parentWinObj.sendAction("deleteNode", "uid=" + stateObj_p.stateUID, function (data) {
			parentWinObj.actionCallback(data);
			stateObj_p.deleteObj();
			parentWinObj.curAppState.nodeDataList[stateObj_p.stateUID] = null;
			parentWinObj.reloadModel();
			delStateFromView(stateObj_p);
			parentWinObj.setModelChanged(true);
		});
	}
}

function deleteTrans(transObj_p) {
	if (transObj_p) {
		parentWinObj.sendAction("deleteNode", "uid=" + transObj_p.transUID, function (data) {
			parentWinObj.actionCallback(data);
			transObj_p.deleteObj();
			parentWinObj.curAppState.nodeDataList[transObj_p.transUID] = null;
			parentWinObj.reloadModel();
			parentWinObj.setModelChanged(true);
			delTransFromView(transObj_p);
		});
	}
}

function insertSubModel(parentUID_p) {
	var subModelName = parentWinObj.getCopyModelName();
	if (subModelName) {
		parentWinObj.sendAction("submodel", "type=import&stateUID=" + parentUID_p + "&subModelName=" + subModelName, function (data) {
			parentWinObj.actionCallback(data);
			if (data.error) return;
			parentWinObj.reloadModel();
			parentWinObj.setModelChanged(true);
		});
	}
}



$(document).ready(function() {
	startLoad();
	
	$("#editLabel").keyup(function(event) {
		var keyCode = null;
		if (event.which) keyCode = event.which;
		else if (event.keyCode) keyCode = event.keyCode;
		if (keyCode==46) {
			event.stopPropagation();
			event.preventDefault();
		}
	});
});


function startLoad() {
	initFrame("Model");
	modelCanvas = $("#modelCanvas");
	JSDiagram.init (modelCanvas, modelCtxMenuBindings, stateCtxMenuBindings, 
		transCtxMenuBindings, swimlaneCtxMenuBindings, boxCtxMenuBindings, callbackAction);
	window.onresize = adjustHeight;
	adjustHeight();


	$("#notePad").draggable();
	
	$("#opaqDiv").click(function() {
		closeEditLabel();
		$(this).hide();
		$("#notePad").hide(100);
		var uid = $("#notePad").attr("uid");
		if (uid) {
			var nodeData = parentWinObj.curAppState.nodeDataList[uid];
			var note = $("#notePad textarea").val().replace(/\n/g,"[newline]");
			if (note!=nodeData.notepad) {
				nodeData.notepad = encodeURI(note);
				parentWinObj.saveProperty(nodeData);
			}
		}
	});
	
	$("#dummyField").focus().blur();

	$("#rtMsg").click(function() {
		clearRtMsg();
	});
	
	$(document).click(function() {
		clearRtMsg();
	});

	display();

	var scxmlData = parentWinObj.curAppState.nodeDataList['scxml'];
	if (scxmlData.notepad.length>0) {
		popupNotePad('scxml');
	}

}

function reset() {
	// nothing to do for now
}

function display(refresh_p) {
	if (parentWinObj.curAppState==undefined || !parentWinObj.curAppState.modelOpen || modelLoaded && !refresh_p) return;
	refreshModel();
}

function moveStateToNewParent(stateUID_p, newParentUID_p, bypassRefresh_p) {
	parentWinObj.sendAction("moveParentNode", "uid=" + stateUID_p + "&parentuid=" + newParentUID_p, function (data) {
		if (parentWinObj.actionCallback(data)) return;

		// move nodeDataList too
		var stateNodeData = parentWinObj.curAppState.nodeDataList[stateUID_p];
		var oldParentStateNode = parentWinObj.curAppState.nodeDataList[stateNodeData.parentuid];
		
		for (i in oldParentStateNode.childrenStates) {
			if (oldParentStateNode.childrenStates[i] && oldParentStateNode.childrenStates[i].uid==stateUID_p) {
				oldParentStateNode.childrenStates[i] = null;
			}
		}
		if (newParentUID_p=="") newParentUID_p = "scxml";
		var newParentStateNode = parentWinObj.curAppState.nodeDataList[newParentUID_p];
		newParentStateNode.childrenStates.push(stateNodeData);
	});
}

function addStateToServerReq(parentUID_p, left_p, top_p, editProp_p, stereotype_p) {
	if (left_p == undefined) left_p = 0;
	if (top_p == undefined) top_p = 0;
	
	var addtlParams = "";
	if (stereotype_p==undefined) stereotype_p = "";
	else if (stereotype_p=="Initial") {
		addtlParams = "&isInitial=true";
		stereotype_p = "";
	}
	else if (stereotype_p=="Final") {
		addtlParams = "&isFinal=true";
		stereotype_p = "";
	}
	if (parentUID_p) {
		parentWinObj.sendAction("addNode", "cmd=addState&parentuid=" + parentUID_p + "&left=" + left_p + "&top=" + top_p
			+ "&stereotype=" + stereotype_p + addtlParams, 
			function(data) {
				if (parentWinObj.actionCallback(data)) return;
				addStateTrans(data.addnodes.nodelist);
				parentWinObj.reloadModel();
				parentWinObj.setModelChanged(true);
				if (editProp_p) {
					parentWinObj.editStateProperty(data.addnodes.nodelist[0]);
				}
			}
		);
	}
	else {
		var scxmlNode = parentWinObj.curAppState.nodeDataList["scxml"];
		parentWinObj.sendAction("addNode", "cmd=addState&parentuid=" + scxmlNode.uid + "&left=" + left_p + "&top=" + top_p 
			+ "&stereotype=" + stereotype_p + addtlParams, 
			function(data) {
				if (parentWinObj.actionCallback(data)) return;
				addStateTrans(data.addnodes.nodelist);
				parentWinObj.setModelChanged(true);
				parentWinObj.reloadModel();
				if (editProp_p) {
					parentWinObj.editTransProperty(data.addnodes.nodelist[0]);
				}
			}
		);
	}
}


// save state/trans positions back to the server.
function savePosition (nodeDataList_p) {
	for (var nodeIdx in nodeDataList_p) {
		if (nodeDataList_p[nodeIdx].typeCode=="usecase" || nodeDataList_p[nodeIdx].typeCode=="step") continue;
		var nodeData = nodeDataList_p[nodeIdx];
		var elemObj = JSDiagram.findState(nodeData.uid);
		if (elemObj==null) elemObj = JSDiagram.findTrans(nodeData.uid);
		if (elemObj!=null) elemObj.savePosition();
	}
}

function callbackAction (type_p, uid_p, action_p, param1_p, param2_p) {
//	self.status = 'uid: ' + uid_p + ", action: " + action_p + ", type: " + type_p + ", param1:" + param1_p + ", param2:" + param2_p;

	if (type_p=="stateTrans") {
		deleteStateTrans(param2_p);
	}	
	else if (type_p=="state") {
		var stateNodeData = parentWinObj.curAppState.nodeDataList[uid_p];
		var stateObj = JSDiagram.findState(uid_p);
		if (action_p=="toggle") {
			if (param1_p=="break") {
				toggleBreak(uid_p);
				return;
			}
		}
//		else if (action_p=="delete") {
//			deleteState(stateObj);
//		}
		else if (action_p=="check") {
			if (param1_p=="rename") {
				var loopStateNode; 
				if (param2_p=="" || param2_p==stateNodeData.stateid) return false;
				for (var uid in parentWinObj.curAppState.nodeDataList) {
					loopStateNode = parentWinObj.curAppState.nodeDataList[uid];
					if (loopStateNode.typeCode!="state") continue;
					if (loopStateNode.uid!=stateNodeData.uid &&
						loopStateNode.stateid==param2_p) {
						parentWinObj.alertDialog("State name " + param2_p + " already exists");
						return false;
					}
				}
				return true;
			}
			else return true;
		}
		else if (action_p=="click") {
			if (param1_p=="comment") {
				popupNotePad(uid_p);
				return;
			}
			else if (param1_p=="liteUp") {
				liteUp(stateObj);
				return;
			}
		}
		else if (action_p=="move") {
			if (param1_p=="position") {
				stateNodeData.left = param2_p.left;
				stateNodeData.top = param2_p.top;
			}
			else if (param1_p=="parent") {
				// move to a new parent
				moveStateToNewParent(uid_p, param2_p);
			}
		}
		else if (action_p=="resize") {
			stateNodeData.width = param1_p.width;
			stateNodeData.height = param1_p.height;
		}
		else if (action_p=="dblclick") {
			if (param1_p=="head") {
				parentWinObj.setCurStateTrans(uid_p);
				parentWinObj.editStateProperty(uid_p);
				return;
			}
		}
		else if (action_p=="new") {
			clearLiteUp();
			if (param1_p=="state") {
				if (uid_p=="" || uid_p=="scxml" || uid_p=="modelCanvas") {
					uid_p = parentWinObj.curAppState.nodeDataList["scxml"].uid;
				}
				addStateToServerReq(uid_p, param2_p.left, param2_p.top, "");
			}
			else if (param1_p=="state/trans") {
				if (uid_p=="" || uid_p=="scxml" || uid_p=="modelCanvas") {
					uid_p = parentWinObj.curAppState.nodeDataList["scxml"].uid;
				}
			 	var srcStateTemp = JSDiagram.findState(param2_p.srcUID);
//			 	if (srcStateTemp.isFinal) {
//			 		parentWinObj.alertDialog("Final state/node should not have outgoing transition/edge.");
//			 	}
				parentWinObj.sendAction("addNode", "cmd=addStateTrans&parentuid=" + uid_p + "&left=" + param2_p.left + "&top=" + param2_p.top + "&srcUID=" + param2_p.srcUID, function(data) {
					parentWinObj.reloadModel();
					if (parentWinObj.actionCallback(data)) return;
					addStateTrans(data.addnodes.nodelist);
					parentWinObj.setModelChanged(true);
					savePosition (data.addnodes.nodelist);
				});
			}
			else if (param1_p=="trans") {
			 	var destStateTemp = JSDiagram.findState(param2_p.destUID);
//			 	if (destStateTemp.isInitial && !destStateTemp.isFinal) {
//			 		parentWinObj.alertDialog("Initial state/node should not have incoming transition/edge.");
//			 	}
//				if (stateObj.isFinal && !stateObj.isInitial) {
//			 		parentWinObj.alertDialog("Final state/node should not have outgoing transition/edge.");
//				}			
				addTransToServerReq(uid_p, param2_p.destUID);
			}
		}
		else if (action_p=="edit") {
			if (param1_p=="stateName") {
				editLabel(stateNodeData);
			}
		}
		else if (action_p=="marked") {
			curStateNode = stateNodeData; 
			selectTreeViewNode(uid_p);
			clearLiteUp();
			var newState = parentWinObj.setCurStateTrans(uid_p);
			parentWinObj.startEditMScript({uid: uid_p});
			$(modelCanvas).click();
			refreshGuardsView(uid_p);
			return;
		}
		else if (action_p=="unmarked") {
			curStateNode = stateNodeData;
			clearLiteUp();
			parentWinObj.setCurStateTrans(null);
			parentWinObj.startEditMScript({uid: uid_p});
//			JSDiagram.hiliteElem (uid_p, {color: hiliteMarkedColor});
			refreshGuardsView(uid_p);
			return;
		}
		else {
			alert("unknown state action " + action_p);
			return;
		}
		
		parentWinObj.saveProperty(stateNodeData);
	}
	else if (type_p=="trans") {
		var transNodeData = parentWinObj.curAppState.nodeDataList[uid_p];
		if (action_p=="move") {
			if (param1_p=="segment") {
				transNodeData.startFract = param2_p.startFract;
				transNodeData.midFract = param2_p.midFract;
				transNodeData.endFract = param2_p.endFract;
				transNodeData.midOffset = param2_p.midOffset;
				transNodeData.startOrient = getOrientName(param2_p.startOrient);
				transNodeData.endOrient = getOrientName(param2_p.endOrient);
			}
			else if (param1_p=="label") {
				transNodeData.labelOffsetLeft = param2_p.labelOffsetLeft;
				transNodeData.labelOffsetTop = param2_p.labelOffsetTop;
			}
			else if (param1_p=="src") {
				var originalParentUID = transNodeData.parentuid;
				parentWinObj.sendAction("moveParentNode", "uid=" + uid_p + "&parentuid=" + param2_p, function (data) { 
					if (parentWinObj.actionCallback(data)) return;

					// move nodeDataList too
					var oldParentStateNode = parentWinObj.curAppState.nodeDataList[originalParentUID];
					for (i in oldParentStateNode.transitions) {
						if (oldParentStateNode.transitions[i] && oldParentStateNode.transitions[i].uid==uid_p) {
							oldParentStateNode.transitions[i] = null;
						}
					}
					var newParentStateNode = parentWinObj.curAppState.nodeDataList[param2_p];
					newParentStateNode.transitions.push(transNodeData);
					transNodeData.parentuid = param2_p;
				});
			}
			else if (param1_p=="dest") {
				var transObj = JSDiagram.findTrans(uid_p);
				var targetNodeData = parentWinObj.curAppState.nodeDataList[param2_p];
				transNodeData.targetUID = param2_p;
				transNodeData.target = targetNodeData.stateid;
				parentWinObj.saveProperty(transNodeData);
			}
		}
		else if (action_p=="toggle") {
			if (param1_p=="break") {
				toggleBreak(uid_p);
//				parentWinObj.toggleBreak(uid_p);
//				var transObj = JSDiagram.findTrans(uid_p);
//				tvUpdateBreak(uid_p, transObj.isBreakEnabled());
				return;
			}
		}
		else if (action_p=="check") {
			if (param1_p=="rename") {
				if (param2_p=="" || param2_p==transNodeData.event) return false; 
				var stateNodeData = parentWinObj.curAppState.nodeDataList[transNodeData.parentuid];
				for (var i in stateNodeData.transitions) {
					if (stateNodeData.transitions[i].uid!=transNodeData.uid &&
					    stateNodeData.transitions[i].event==param2_p) {
						parentWinObj.alertDialog("Transition name " + param2_p + " already exists for state " + stateNodeData.stateid);
						return false;
					}
				}
				return true;
			}
			else return true;
		}
		else if (action_p=="dblclick") {
			if (param1_p=="segment") {
				parentWinObj.setCurStateTrans(uid_p);
				var transObj = JSDiagram.findTrans(uid_p);
				if (transObj.readonly) {
					var stateTemp = transObj.srcState.parentState;
					parentWinObj.editStateTransFilter(stateTemp.stateUID, uid_p);
				}
				else {
					parentWinObj.editTransProperty(uid_p);
				}
				
				return;
			}
		}
		else if (action_p=="click") {
			if (param1_p=="comment") {
				popupNotePad(uid_p);
				return;
			}
		}
		else if (action_p=="edit") {
			if (param1_p=="transName") {
				editLabel (transNodeData);
			}
		}
		else if (action_p=="marked") {
			clearLiteUp();
			parentWinObj.setCurStateTrans(uid_p);
			parentWinObj.startEditMScript({uid: uid_p});
			$(modelCanvas).click();

			selectTreeViewNode(uid_p);
			return;
		}
		else if (action_p=="unmarked") {
			clearLiteUp();
			parentWinObj.setCurStateTrans(null);
			parentWinObj.startEditMScript({uid: uid_p});
			var transObj = JSDiagram.findTrans(uid_p);

			selectTreeViewNode(uid_p);
			return;
		}
//		else if (action_p=="delete") {
//			var transObj = JSDiagram.findTrans(uid_p);
//			deleteTrans(transObj);
//		}
		else if (action_p=="resize") {
			transNodeData.width = param1_p.width;
			transNodeData.height = param1_p.height;
		}
		else {
			alert("invalid trans action " + action_p);
			return;
		}
	
		parentWinObj.saveProperty(transNodeData);
	}
	else if (type_p=="model") {
		clearRtMsg();
		if (action_p=="dblclick") {
			clearLiteUp();
			JSDiagram.clearMarks();
			clearPaused();
		}
		else if (action_p=="click") {
			clearLiteUp();
			$("#modelCanvas").focus();
		}
	}
	else if (type_p=="swimlane") {
		clearRtMsg();
		if (action_p=="dblclick") {
			parentWinObj.editSwimlaneProperty(uid_p);
		}
		else if (action_p=="delete") {
			deleteSwimlane(param1_p);
		}
		else if (action_p=="edit") {
			parentWinObj.editSwimlaneProperty(uid_p);
		}
		else if (action_p=="move") {
			var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
			nodeData.swimlaneOffset = param1_p;
			saveSwimlane (uid_p);
		}
		else if (action_p=="resize") {
			var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
			var sizeList = new Array();
			if (nodeData.laneSizes) sizeList = nodeData.laneSizes.split(",");
			if (sizeList[param1_p]) {
				sizeList[param1_p] = parseInt(sizeList[param1_p]) + parseInt(param2_p);
			}
			nodeData.laneSizes = sizeList.join(",");
			saveSwimlane (uid_p);
			addModelSwimlane(nodeData);
		}
	}
	else if (type_p=="box") {
		clearRtMsg();
		if (action_p=="dblclick") {
			parentWinObj.editBoxProperty(uid_p);
		}
		else if (action_p=="delete") {
			deleteBox(param1_p);
		}
		else if (action_p=="edit") {
			parentWinObj.editBoxProperty(uid_p);
		}
		else if (action_p=="move") {
			var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
			nodeData.left = param1_p.left;
			nodeData.top = param1_p.top;
			saveBox (uid_p);
		}
		else if (action_p=="resize") {
			var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
			nodeData.width = param1_p.width;
			nodeData.height = param1_p.height;
			saveBox (uid_p);
//			addModelBox(nodeData);
		}
	}
	else {
		
	}
}

function updateTransTarget(oldStateID_p, newStateID_p) {
	for (var uid in parentWinObj.curAppState.nodeDataList) {
		var stateNode = parentWinObj.curAppState.nodeDataList[uid];
		if (stateNode.typeCode!="state") continue;
		for (var i in stateNode.transitions) {
			var transNode = stateNode.transitions[i];
			if (transNode && transNode.target==oldStateID_p) {
				transNode.target = newStateID_p;
			}
		}
	}
}


function getOrientName (orientKey_p) {
	orientKey_p = parseInt(orientKey_p);
	if (orientKey_p==JSDiagram.LEFT) return "left";
	if (orientKey_p==JSDiagram.RIGHT) return "right";
	if (orientKey_p==JSDiagram.UP) return "up";
	if (orientKey_p==JSDiagram.DOWN) return "down";
	return "auto";
}

function resolveOrient(orientName_p) {
	if (orientName_p=="up") return JSDiagram.UP;
	else if (orientName_p=="down") return JSDiagram.DOWN;
	else if (orientName_p=="left") return JSDiagram.LEFT;
	else if (orientName_p=="right") return JSDiagram.RIGHT;
	else return JSDiagram.AUTO;
}



function refreshModel() {
	if (parentWinObj.curAppState.webmbtObj==undefined || parentWinObj.curAppState.webmbtObj.model==undefined) {
		return;
	}

	displayModelName();
	var scxmlNode = parentWinObj.curAppState.nodeDataList["scxml"];
		
	modelLoaded = true;
	modelObj = parentWinObj.curAppState.webmbtObj.model;
	for (i in modelObj.childrenStates) {
		var stateNode = modelObj.childrenStates[i];
		if (stateNode) {
			addModelState("modelCanvas", stateNode);
		}
	}
	
	
	for (j in modelObj.childrenStates) {
		var stateNode = modelObj.childrenStates[j];
		if (stateNode) {
			addModelTransByState(stateNode);
		}
	}
	
	for (k in modelObj.misc.swimlanes) {
		addModelSwimlane(modelObj.misc.swimlanes[k]);
	}

	for (k in modelObj.misc.boxes) {
		addModelBox(modelObj.misc.boxes[k]);
	}

	// refresh the breakpoints and disableds
	nodeAttrList = new Array();
	var uid;
	var elemObj 
	for (k in parentWinObj.curAppState.breakpoints) {
		uid = parentWinObj.curAppState.breakpoints[k]
		if (uid.indexOf("L")==0) continue;
		var nodeData = parentWinObj.curAppState.nodeDataList[uid];
		if (nodeData) {
			if (nodeData.typeCode=="state") {
				elemObj = JSDiagram.findState(uid);
				if (elemObj) elemObj.setBreak(true);
			}
			else if (nodeData.typeCode=="transition") {
				elemObj = JSDiagram.findTrans(uid);
				if (elemObj) elemObj.setBreak(true);
			}
		}
	}
	
	JSDiagram.setBackgroundColor(scxmlNode.color);
	resizeCanvas(scxmlNode.canvasWidth, scxmlNode.canvasHeight);

	// set SubModel Trans shade based on mcase selected for the submodel state
	setSubModelTransShade();
	
	setPausedAt();
	if (isTreeViewOpen()) {
		popupTreeView();
	}

}


var TransShadeColorList = { required: "", optional: "#215d7d", removed: "#AAAAAA" };
var StateShadeColorList = { required: "", optional: "#b7e3f4", removed: "#CCCCCC" };

function setSubModelTransShade() {
	parentWinObj.sendAction("submodel", "type=getSubModelTransList", function(data) {
		for (var i in data) {
			var uidFilter = data[i];
			setSubModelStateTransStatus(uidFilter.uid, uidFilter.status, "SubModel Filter");
		}
		var modelObj = parentWinObj.curAppState.webmbtObj.model;
		for (j in modelObj.childrenStates) {
			var stateNode = modelObj.childrenStates[j];
			if (stateNode && stateNode.filterList.length>0) {
				for (k in stateNode.filterList) {
					if (stateNode.filterList[k]) {
						setSubModelStateTransByFilter(stateNode.filterList[k]);
					}
				}
			}
		}
	});
}

function setSubModelStateTransByFilter(filter_p) {
	var status = "required";
	var title = "";
	if (filter_p.type == "state") {
		if (filter_p.markedRemoved=="Y") {
			status = "removed";
			title = "State is marked Removed";
		}
	}
	else {
		if (filter_p.markedRemoved=="Y") {
			status = "removed";
			title = "Transition is marked Removed";
		}
		else if (filter_p.traverseTimes!="" && filter_p.traverseTimes<=0) {
			status = "optional";
			title = "Transition is marked Optional";
		}
	}
	setSubModelStateTransStatus (filter_p.targetUID, status, title);
}

function setSubModelStateTransStatus (uid_p, status_p, title_p) {
	var elem = JSDiagram.findTrans(uid_p);
	if (elem==null) {
		elem = JSDiagram.findState(uid_p);
		elem.setHeadColor(StateShadeColorList[status_p]);
		elem.setHeadTitle(title_p);
	}
	else {
		elem.setColor(TransShadeColorList[status_p]);
		elem.setTitle(title_p);
	}
}

function displayModelName() {
	var scxmlNode = parentWinObj.curAppState.nodeDataList["scxml"];
	$("#modelName .name").text(scxmlNode.filename);
	$("#modelName .name").attr("title", "Model Path: /" + scxmlNode.folderPath);
}

function addModelState(parentUID_p, stateNode_p) {
	var stateObj = {
		uid: stateNode_p.uid,
		stateName: stateNode_p.stateid,
		color: stateNode_p.color,
		textColor: stateNode_p.textColor,
		width: stateNode_p.width,
		height: stateNode_p.height,
		left: stateNode_p.left,
		top: stateNode_p.top,
		hasComment: stateNode_p.notepad!="",
		stateFlags: "",
		readonly: isTrue(stateNode_p.readOnly),
		subModelName: stateNode_p.subModel,
		childrenHidden: isTrue(stateNode_p.hideSubModel),
		notation: null,
		isInitial: false,
		isFinal: false
	}

	if (stateNode_p.stereotype=="B") {
		stateObj.notation = "branch";
	}

	if (stateNode_p.stereotype=="W") {
		stateObj.notation = "switch";
	}
	
	if (stateNode_p.isinitial=="Y") {
		stateObj.isInitial = true;
	}

	if (stateNode_p.isfinal=="Y") {
		stateObj.isFinal = true;
	}
	
	if (stateNode_p.subModel!="") {
		stateObj.color = SubModelColor;
	}
	
	stateObj.stateFlags = getStateFlags(stateNode_p);

	var state = JSDiagram.addState (parentUID_p, stateObj);
	if (stateNode_p.subModel && stateNode_p.subModel!="") {
		var headerLabel = "SubModel: " + stateNode_p.subModel;
		var title = "";
		if (stateNode_p.subModelFilter!='') title = stateNode_p.subModelFilter;
		if (stateNode_p.filterList.length>0) {
			if (stateNode_p.subModelFilter!='') title += "; ";
			title = "has state/transition filters set";
		}
		if (title!="") {
			headerLabel += " <span class='filter' title='" + title + "'>filter</span>";
		}
		state.setHeaderLabel(headerLabel);
	}
	 
	for (j in stateNode_p.childrenStates) {
		if (stateNode_p.childrenStates[j]) {
			addModelState(stateNode_p.uid, stateNode_p.childrenStates[j]);
		}
	}
	
	addNodeToViews(stateNode_p);
}

function addModelTransByState(stateNode_p) {
	for (j in stateNode_p.transitions) {
		addModelTrans(stateNode_p, stateNode_p.transitions[j]);
	}
	
	for (j in stateNode_p.childrenStates) {
		 if (stateNode_p.childrenStates[j]) {
			addModelTransByState(stateNode_p.childrenStates[j]);
		}
	}
	
}


var orientNameToIntList = { left: JSDiagram.LEFT, right: JSDiagram.RIGHT, up: JSDiagram.UP, down: JSDiagram.DOWN, auto: JSDiagram.AUTO}
function addModelTrans(stateNode_p, transNode_p) {
	if (transNode_p==null) return;
	var transObj = {
		uid: transNode_p.uid,
		srcUID: stateNode_p.uid,
		destUID: transNode_p.targetUID,
		labelOffsetLeft: transNode_p.labelOffsetLeft,
		labelOffsetTop: transNode_p.labelOffsetTop,
		transName: transNode_p.event,
		startFract: transNode_p.startFract,
		midFract: transNode_p.midFract,
		endFract: transNode_p.endFract,
		midOffset: transNode_p.midOffset,
		startOrient: JSDiagram.AUTO,
		endOrient: JSDiagram.AUTO,
		width: transNode_p.width,
		height: transNode_p.height,
		color: transNode_p.color,
		readonly: isTrue(transNode_p.readOnly),
		transFlags: "",
		hasComment: transNode_p.notepad!=""
	}
	if (transNode_p.event.indexOf("*")==0) {
		transObj.transName = "";
	}
	
	if (transNode_p.startOrient && orientNameToIntList[transNode_p.startOrient]) {
		transObj.startOrient = orientNameToIntList[transNode_p.startOrient];
	}
	
	if (transNode_p.endOrient && orientNameToIntList[transNode_p.endOrient]) {
		transObj.endOrient = orientNameToIntList[transNode_p.endOrient];
	}

	transObj.transFlags = getTransFlags(transNode_p);
	
	JSDiagram.addTrans (transObj);

	addNodeToViews(transNode_p);
}

function addModelSwimlane(swimlaneNode_p) {
	if (swimlaneNode_p==null) return;
	var laneList = new Array();
	if (swimlaneNode_p.laneLabels) laneList = swimlaneNode_p.laneLabels.split(",");
	if (laneList.length==0) laneList = ["lane1"];
	var swimlaneObj = {
		uid: swimlaneNode_p.uid,
		name: swimlaneNode_p.swimlaneName,
		orient: swimlaneNode_p.swimlaneOrient,
		offset: swimlaneNode_p.swimlaneOffset,
		style: swimlaneNode_p.swimlaneCssStyle,
		laneCount: laneList.length,
		lanes: []
	}
	var sizeList = new Array();
	if (swimlaneNode_p.laneSizes) sizeList = swimlaneNode_p.laneSizes.split(",");
	for (var i in laneList) {
		var size = "";
		if (i<sizeList.length) size = sizeList[i];
		else {
			size = 100;
			sizeList[i] = size;
		}
		swimlaneObj.lanes.push({name: laneList[i], size: size});
	}
	
	swimlaneNode_p.laneSizes = sizeList.join(",");
	JSDiagram.addSwimlane (swimlaneObj);
}


function saveSwimlane(uid_p) {
//	$(".swimlane").each(function() {
//		var uid = $(this).attr("id");
		var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
		parentWinObj.saveProperty(nodeData);
//	});
}

function editSwimlane (uid_p) {
	parentWinObj.editSwimlaneProperty(uid_p);
}

function deleteSwimlane (uid_p) {
	parentWinObj.sendAction("deleteNode", "uid=" + uid_p, function (data) {
		parentWinObj.actionCallback(data);
		$("#" + uid_p).remove();
		parentWinObj.reloadModel();
		parentWinObj.setModelChanged(true);
	});
}

function addModelBox(boxNode_p) {
	if (boxNode_p==null) return;
	var boxObj = {
		uid: boxNode_p.uid,
		name: boxNode_p.name,
		color: boxNode_p.color,
		textColor: boxNode_p.textColor,
		cssStyle: boxNode_p.cssStyle,
		left: boxNode_p.left,
		top: boxNode_p.top,
		width: boxNode_p.width,
		height: boxNode_p.height,
		borderWidth: boxNode_p.borderWidth,
		borderStyle: boxNode_p.borderStyle
	}
	JSDiagram.addBox (boxObj);
}

function saveBox(uid_p) {
	var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
	parentWinObj.saveProperty(nodeData);
}

function editBox (uid_p) {
	parentWinObj.editBoxProperty(uid_p);
}

function deleteBox (uid_p) {
	parentWinObj.sendAction("deleteNode", "uid=" + uid_p, function (data) {
		parentWinObj.actionCallback(data);
		$("#" + uid_p).remove();
		parentWinObj.reloadModel();
		parentWinObj.setModelChanged(true);
	});
}

var activateTypeList = {"TRAV_COUNT": {
							"label": "Activate state when traversal count reaches ", 
							"flag": "t"},
					"TRANS_COUNT": {
							"label": "Activate state when distinct transition count reaches ", 
							"flag": "T"},
					"VAR": {
							"label": "Activate state when value of path var _activateState exceeds ", 
							"flag": "v"},
					"WEIGHT": {
							"label": "Activate state when sum of traversal weight exceeds ",
							"flag": "w"}
					};
var firingTypeList = {"RANDOM": {
							"label": "Randomly select one transition to execute.", 
							"flag": "r"},
  					  "VAR": {
  					  		"label": "Execute transition in path var _triggerTransName.", 
  					  		"flag": "v"},
  					  "ALL": {
  					  		"label": "Execute all available transitions",
  					  		"flag": "*"}
  					  };

function getStateFlags(nodeData_p) {
	var stateFlagsElem = "";
	var title;

	title = "";
	var stateFlagsList = parentWinObj.curAppState.nodeDataList["scxml"].showStateFlags;
	if (stateFlagsList=="") {
		stateFlagsList = parentWinObj.curAppState.nodeDataList["config"].stateFlags;
	}
	if (stateFlagsList==undefined || stateFlagsList=="") {
		return "";
	}	
	stateFlagsList = stateFlagsList.split(";");
	var flagI;
	for (flagI in stateFlagsList) {
		if (stateFlagsList[flagI]=="A") {
			var activateType = nodeData_p.activateType;
			if (activateType=="") {
				activateType = "TRAV_COUNT";
			}
			var activateThreshold = nodeData_p.activateThreshold;
			if (activateThreshold == "") {
				activateThreshold == "1";
			}
			var firingType = nodeData_p.firingType;
			if (firingType=="") {
				firingType = "RANDOM";
			}
			if (activateType=="TRAV_COUNT" && activateThreshold=="1" && firingType=="RANDOM") {
				continue;
			}
			title = "title='" + activateTypeList[activateType].label + activateThreshold + "; " + firingTypeList[firingType].label + "'";
			var flags = activateTypeList[activateType].flag + activateThreshold + "-" + firingTypeList[firingType].flag;
	 		stateFlagsElem += "<span class='activateType' " + title + ">" + flags + "</span>";
		}
		else if (stateFlagsList[flagI]=="V") {
			if (nodeData_p.setVars) {
				title= "title=\"Contains $setVar() script\"";
		 		stateFlagsElem += "<span " + title + ">V</span>";
			}
		}
		else if (stateFlagsList[flagI] == "D") {
			if (nodeData_p.getDatas) {
				title= "title=\"Contains $getData() script\"";
		 		stateFlagsElem += "<span " + title + ">D</span>";
			}
		}
		else if (stateFlagsList[flagI] == "R") {
			if (nodeData_p.addTagCheck || nodeData_p.tags!="") {
				if (!nodeData_p.addTagCheck) title = "title='Requirement Tags: " + nodeData_p.tags + "'";
				else if (nodeData_p.tags=="") title= "title='Referencing requirement tags in MScript'";
				else title = "title='Requirement Tags: " + nodeData_p.tags + " and referencing requirement tags in MScript'";
		 		stateFlagsElem += "<span " + title + ">R</span>";
			}
		}
		else if (stateFlagsList[flagI] == "S") {
			if (nodeData_p.stereotype!="" && nodeData_p.stereotype!="BH" && nodeData_p.stereotype!="BV" && nodeData_p.stereotype!="B") {
				if (nodeData_p.stereotype!="") title = "title='Stereotype " + nodeData_p.stereotype + "'";
		 		stateFlagsElem += "<span class='stereotypeFlag' " + title + ">" + nodeData_p.stereotype + "</span>";
			}
		}
	}
	return stateFlagsElem;
}

function getTransFlags(nodeData_p) {
	var transFlagsElem = "";
	var title;
	var transFlagsList = parentWinObj.curAppState.nodeDataList["scxml"].showTransFlags;
	if (transFlagsList=="") {
		transFlagsList = parentWinObj.curAppState.nodeDataList.config.transFlags;
	}
	if (transFlagsList==undefined || transFlagsList=="") {
		return "";
	}	
	transFlagsList = transFlagsList.split(";");
	var flagI;
	for (flagI in transFlagsList) {
		// make transFlagsElem
		if (transFlagsList[flagI]=="G") {
			if (nodeData_p.guardTrigger || nodeData_p.guard!="") {
				title = "";
				if (!nodeData_p.guardTrigger) title = "title=\"Guard cond: " + nodeData_p.guard + "\"";
				else if (nodeData_p.guard=="") title= "title=\"Guard trigger\"";
				else title = "title=\"Guard cond: " + nodeData_p.guard + " and trigger\"";
		 		transFlagsElem += "<span " + title + ">G</span>";
			}
		}

//		else if (transFlagsList[flagI] == "F") {
//			if (nodeData_p.submodelFinalState!="") {
//				transFlagsElem += "<span title=\"From submodel final state: " + nodeData_p.submodelFinalState + "\">F</span>";
//			}
//		}
		
		else if (transFlagsList[flagI] == "V") {
			if (nodeData_p.setVars || nodeData_p.set!="") {
				if (!nodeData_p.setVars) title = "title=\"Set: " + nodeData_p.set + "\"";
				else if (nodeData_p.set=="") title= "title=\"Contains $setVar() script\"";
				else title = "title=\"Set: " + nodeData_p.set + " and contains $setVar() script\"";
		 		transFlagsElem += "<span " + title + ">V</span>";
			}
		}

		else if (transFlagsList[flagI] == "D") {
			if (nodeData_p.getDatas || nodeData_p.dataset!="") {
				if (!nodeData_p.getDatas) title = "title=\"DataSet: " + nodeData_p.dataset + "\"";
				else if (nodeData_p.dataset=="") title= "title=\"Contains $getData() script\"";
				else title = "title=\"DataSet: " + nodeData_p.dataset + " and contains $getData() script\"";
		 		transFlagsElem += "<span " + title + ">D</span>";
			}
		}
		
		else if (transFlagsList[flagI] == "R") {
			if (nodeData_p.addTagCheck || nodeData_p.tags!="") {
				if (!nodeData_p.addTagCheck) title = "title=\"Requirement Tags: " + nodeData_p.tags + "\"";
				else if (nodeData_p.tags=="") title= "title=\"Referencing requirement tags in MScript\"";
				else title = "title=\"Requirement Tags: " + nodeData_p.tags + " and referencing requirement tags in MScript\"";
		 		transFlagsElem += "<span " + title + ">R</span>";
			}
		}
		else if (transFlagsList[flagI] == "T") {
			if (nodeData_p.traverses != '1') {
				title = "title=\"Multiple traverses required\"";
		 		transFlagsElem += "<span " + title + ">T:" + nodeData_p.traverses + "</span>";
			}
		}
		
		else if (transFlagsList[flagI] == "W" && nodeData_p.weight) {
			title = "title=\"Transition weight\"";
	 		transFlagsElem += "<span " + title + ">W:" + nodeData_p.weight + "</span>";
		}
		
		else if (transFlagsList[flagI] == "S") {
			if (nodeData_p.stereotype!="") {
				if (nodeData_p.stereotype!="") title = "title='Stereotype " + nodeData_p.stereotype + "'";
		 		transFlagsElem += "<span class='stereotypeFlag' " + title + ">" + nodeData_p.stereotype + "</span>";
			}
		}
		
	}
	return transFlagsElem;
}

function reset() {
	// nothing as this frame should be closed
}



// needs to change to .label fields
function setTransLabel(transID_p, srcLabel_p, midLabel_p, destLabel_p) {
	$("#" + transID_p + " .source-label").html(srcLabel_p);
	$("#" + transID_p + " .middle-label").html(midLabel_p);
	$("#" + transID_p + " .destination-label").html(destLabel_p);
}

function setStateLabel(stateID_p, label_p) {
	JSDiagram.setStateLabel(stateID_p, label_p);
}



function resizeCanvas(width_p, height_p) {
	JSDiagram.setCanvasSize(width_p, height_p);
	adjustHeight();
}



function parsePos (pos_p) {
	if (pos_p.indexOf("px")>0) {
		return parseInt(pos_p.substring(0, pos_p.length-2));
	}
	else return pos_p;
}

function setPausedAt() {
	replayDelayMillis = 100;
	replayEachClear = false;
	incrIdx = REPLAY_FORWARD;
	var execMode = parentWinObj.curAppState.execMode;
	procPausedAt(parentWinObj.curAppState.pausedAtList, parentWinObj.curAppState.pausedTrailingList);
	tvSetPausedAt();
}


// set paused, obtain which state/trans and lid from curAppState.
var pausedList;
var trailingList; // most recent first
var pausedIdx;
var trailingIdx;
var replayDelayMillis;
var incrIdx = REPLAY_BACKWARD;
var replayTravNum;
var replayEachClear = false;

function procPausedAt(pausedAtList1_p, pausedAtList2_p) {
	var pausedAtList = pausedAtList1_p;
//	replayEachClear = false;
	
	if (pausedAtList2_p.length==0) {
		clearPaused();
	}
	var oldPausedList = pausedList;
	var oldTrailingList = trailingList;
	
	pausedList = new Array();
	trailingList = new Array();
//	JSDiagram.clearHilite();
	
	var elemObj;
	var uid;
	var nodeData;
	var segNum = 0;
	var pausedUID = "";
	for (var i=0; i<pausedAtList.length; i++) {
		uid = pausedAtList[i].uid;
		if (uid.indexOf("L")==0) continue;
		pausedList.push(uid);
		segNum += 1;
		
		if (pausedUID=="") {
			pausedUID = uid;
		}
	}
	
	pausedAtList = pausedAtList2_p;
	segNum = 0;
	for (var i=0; i<pausedAtList.length; i++) {
		uid = pausedAtList[i].uid;
		if (pausedUID !="") {
			trailingList.push(uid);
			segNum += 1;
		}
		else {
			pausedList.push(uid);
			pausedUID = uid;
		}
	}

	// limit to the replayTravNum traversals only. trailingList is sorted most recent first
	if (replayTravNum > 0) {
		var trailingListNew = new Array();
		for (var i=0; i<trailingList.length && i < replayTravNum; i++) {
			trailingListNew.push(trailingList[i]);
		}
		trailingList = trailingListNew;
	}	
	
	if (incrIdx > 0) {
		pausedIdx = 0;
		trailingIdx = 0;
	}
	else {
		pausedIdx = pausedList.length-1;
		trailingIdx = trailingList.length-1;
	}
//	playPausedAt();
	if (pausedList.length>0 || trailingList.length>0) {
		for (var jj = 1; oldTrailingList && jj<oldTrailingList.length; jj++) {
			JSDiagram.clearHilite(oldTrailingList[jj]);
		}
		if (parentWinObj.isModeEnabled("modeCov")) {
			showCoverage(true);
		}
		else {
			playPausedAt();
		}
		JSDiagram.scrollTo(pausedUID);
	}
	else {
		clearPaused();
	}
}


function playPausedAt() {
	var pausedObj = null;
	var segNum;
	var nodeData;
	var opacityFloat = 1.0;
	if ((incrIdx > 0 || incrIdx < 0 && trailingIdx < 0) && 
				pausedIdx >= 0 && pausedIdx < pausedList.length) {
		pausedObj = pausedList [pausedIdx];
		seqNum = pausedIdx;
		if (seqNum >= pausedClassList.length) seqNum = pausedClassList.length-1;
		nodeData = parentWinObj.curAppState.nodeDataList[pausedObj];
		if (nodeData.childrenstates && nodeData.childrenstates.length>0) opacityFloat = 0.7;
		if (replayEachClear) {
			clearPaused();
		}

		JSDiagram.hiliteElem(pausedObj, {color: pausedClassList[seqNum], opacityFloat: opacityFloat, zIndex: zIndexHiliteItem});
		showGuardsStatus(pausedObj);
		pausedIdx += incrIdx;
	}
	else if ((incrIdx > 0 && pausedIdx >= pausedList.length || incrIdx < 0) && 
				trailingIdx >=0 && trailingIdx < trailingList.length) {
		pausedObj = trailingList [trailingIdx];
		seqNum = trailingIdx;
		if (seqNum >= trailingClassList.length) seqNum = trailingClassList.length-1;
		nodeData = parentWinObj.curAppState.nodeDataList[pausedObj];
		if (nodeData.childrenstates && nodeData.childrenstates.length>0) opacityFloat = 0.7;
		if (replayEachClear) {
			clearPaused();
		}

		JSDiagram.hiliteElem(pausedObj, {color: trailingClassList[seqNum], opacityFloat: opacityFloat, zIndex: zIndexHiliteItem});
		trailingIdx += incrIdx;
	}
	
	if (pausedObj) {
		if (replayDelayMillis==undefined || replayDelayMillis == null) replayDelayMillis = 100;
		setTimeout(playPausedAt, replayDelayMillis);
	}
}

var REPLAY_FORWARD = -1;
var REPLAY_BACKWARD = 1;
// -1 for forward, +1 for backward, this is due to trailings are stored most recent first.
function replayPausedAt () {
	incrIdx = REPLAY_FORWARD;
	replayTravNum = 0; // for all
	replayEachClear = true;
	
	var dialogHtml = "<b>Replay last traversal up to the current state/transition</b><br/>" 
			+ "<table>"
			+ "<tr><td title='Replay traversals direction'>Direction:</td><td><input type=radio name='repDir' id='repFwd' value='forward' checked>Forward</input><input type=radio name='repDir' id='repBwd' value='backward'>Backward</input></td></tr>"
			+ "<tr><td title='Delay between traversals'>Delay:</td><td><input id='repDelay' value='500'/> (default 500 milliseconds)</td></tr>"
			+ "<tr><td title='Number of traversals leading to the current state/transition'>Traversals:</td><td><input id='repNumTrav' value='10'/> (default 10)</td></tr>"
			+ "<tr><td title='Highlight two traversals besides the current replay state/transition'>Trailing:</td><td><input type=radio name='repTrailing' id='replTrailingClear' checked>Clear</input><input type=radio name='repTrailing'>Keep</input></td></tr>"
			+ "</table>";

	parent.plainDialog(dialogHtml, function () {
		var fld = parent.getDialogField('repFwd');
		if ($(fld).is(":checked")) {
			incrIdx = REPLAY_FORWARD;
		}
		else {
			incrIdx = REPLAY_BACKWARD;
		}
		fld = parent.getDialogField('repDelay');
		replayDelayMillis = $(fld).val();

		if (replayDelayMillis=="") {
			replayDelayMillis = 500;
		}
		else {
			replayDelayMillis = parseInt(replayDelayMillis);
		}

		fld = parent.getDialogField('replTrailingClear');
		replayEachClear = $(fld).is(":checked");

		fld = parent.getDialogField('repNumTrav');
		replayTravNum = $(fld).val();
		if (replayTravNum=="") {
			replayTravNum = 10;
		}
		else {
			replayTravNum = parseInt(replayTravNum);
		}
		
		parent.sendAction("debug", "type=getPausedAt&trailingNum=" + replayTravNum + "&execID=" + parent.curAppState.execID, function(data) {
			if (parent.actionCallback(data)) return;
			procPausedAt(data.pausedAt, data.trailing);
		});
	});	
}

function stopReplayPausedAt () {
	pausedIdx = -1;
	trailingIdx = -1;
}

function clearPaused() {
	JSDiagram.clearHilite();
	tvClearPausedAt();
}

function stateMScript(uid_p) {
	parentWinObj.startEditMScript({uid: uid_p});
}

function transMScript(uid_p) {
	parentWinObj.startEditMScript({uid: uid_p});
}


function transDataSet(uid_p) {
	parentWinObj.startDataSet({uid: uid_p});
}



function isTrue (val_p) {
	if (val_p=="Y" || val_p==true || val_p==1) return true;
	else return false;
}

// update state, trans, model, etc. attr change
function updateNode(nodeData_p) {
	if (nodeData_p.typeCode=="state") {
		var stateObj = JSDiagram.findState(nodeData_p.uid);
		stateObj.setStateName(nodeData_p.stateid);
		
		stateObj.isInitial = nodeData_p.isinitial=="Y";
		stateObj.isFinal = nodeData_p.isfinal=="Y";
		stateObj.updateInitFinalSymbols();
		
		var nodeColor = nodeData_p.color;
		if (nodeColor=="#") nodeColor = "";
		if (nodeData_p.subModel!="") {
			nodeColor = SubModelColor;
		}
		stateObj.setColor (nodeColor);
		
		if (nodeData_p.textColor=="#") nodeData_p.textColor = "";
		stateObj.setTextColor (nodeData_p.textColor);
	
		if (nodeData_p.notepad=="") {
			stateObj.removeClassIcnR("comment", "exists");
		}
		else {
			stateObj.addClassIcnR("comment", "exists");
		}
		stateObj.setStateFlags (getStateFlags(nodeData_p));
	}
	else if (nodeData_p.typeCode=="transition") {
		var transObj = JSDiagram.findTrans(nodeData_p.uid);
		if (nodeData_p.event.indexOf("*")==0) {
			transObj.setTransName("");
		}
		else {
			transObj.setTransName (nodeData_p.event);
		}
		if (nodeData_p.color=="#") nodeData_p.color = "";
		transObj.setColor (nodeData_p.color);
		transObj.setTransFlags (getTransFlags(nodeData_p));

		if (nodeData_p.notepad=="") {
			transObj.removeClassTag("comment", "exists");
		}
		else {
			transObj.addClassTag("comment", "exists");
		}
		
		// if target has changed, update diagram only HERE: XXX targetUID is not changed, use target (state id) 
		if (transObj.destUID!=nodeData_p.targetUID) {
			JSDiagram.moveTransTarget (transObj.transUID, nodeData_p.targetUID);
		}
	}
	else if (nodeData_p.typeCode=="scxml" || nodeData_p.typeCode=="canvasProp") {
		JSDiagram.setBackgroundColor(nodeData_p.color);
		resizeCanvas(nodeData_p.canvasWidth, nodeData_p.canvasHeight);
	}
	else if (nodeData_p.typeCode=="step") {
	    setStepRemoveFlag (nodeData_p);
	}
	else if (nodeData_p.typeCode=="swimlane") {
	    addModelSwimlane (nodeData_p);
	}
	else if (nodeData_p.typeCode=="box") {
	    addModelBox (nodeData_p);
	}

	updateViews(nodeData_p);
}

function copyTrans(fromUID_p, targetUID_p) {
	parentWinObj.sendAction("updateNode", "cmd=copyTrans&fromUID=" + fromUID_p + "&targetUID=" + targetUID_p, function(data) {
		if (parentWinObj.actionCallback(data)) return;
		parentWinObj.refreshUID(targetUID_p);
	});
}

function clearBreaks() {
	JSDiagram.clearBreaks();
	tvClearBreaks();
}


function clearAnimate() {
	return; // nothing to do so far
}

function liteUp(stateObj_p) {
	var toggleOff = false;
	if (liteupStateObj && liteupStateObj==stateObj_p) toggleOff = true;
	clearLiteUp();
	if (toggleOff) return;
	JSDiagram.propagateClass(stateObj_p.stateUID, startClass, incomingClass, outgoingClass);
	liteupStateObj = stateObj_p;
}

function clearLiteUp() {
	liteupStateObj = null;
	JSDiagram.clearHilite();
	setPausedAt();
}


// adds a new node to the model, note the node is already added to the server.
function addStateTrans (nodeDataList_p) {
	var lastNodeData = null;
	var editTransSend = true;
	for (nodeIdx in nodeDataList_p) {
		var curNodeData = nodeDataList_p[nodeIdx];
		if (curNodeData.typeCode=="state" || curNodeData.typeCode=="transition") {
			lastNodeData = curNodeData;
			parentWinObj.curAppState.nodeDataList[lastNodeData.uid] = lastNodeData;
			if (lastNodeData.typeCode=="state") {
				var parentUID = lastNodeData.parentuid;
				var typeCode = parentWinObj.curAppState.nodeDataList[parentUID].typeCode;
				if (typeCode=="scxml") parentUID = "modelCanvas";
				addModelState (parentUID, lastNodeData);
			}
			else if (lastNodeData.typeCode=="transition") {
				addModelTrans (parentWinObj.curAppState.nodeDataList[lastNodeData.parentuid], lastNodeData);
				if (editTransSend) {
					parentWinObj.startEditMScript({uid: lastNodeData.uid});
					editTransSend = false;
				}
			}
		}
		else if (curNodeData.typeCode=="swimlane") {
			addModelSwimlane (curNodeData);
		}
		else if (curNodeData.typeCode=="box") {
			addModelBox (curNodeData);
		}
		else {
			addNodeToViews(curNodeData);	
		}
	}
}

function addTransToServerReq(srcUID_p, destUID_p, editProp_p) {
	parentWinObj.sendAction("addNode", "cmd=addTrans&srcUID=" + srcUID_p + "&destUID=" + destUID_p, function(data) {
		parentWinObj.reloadModel();
		if (parentWinObj.actionCallback(data)) return;
		addStateTrans(data.addnodes.nodelist);
		parentWinObj.setModelChanged(true);
		savePosition (data.addnodes.nodelist);
		if (editProp_p) {
			parentWinObj.editTransProperty(data.addnodes.nodelist[0]);
		}
	});
}

function popupNotePad(uid_p) {
	JSDiagram.scrollTo(uid_p);
	JSDiagram.clearHilite();
	var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
	
	$("#opaqDiv").show();
	var noteLabel = nodeData.typeCode + ": ";
	var noteLeft = JSDiagram.getCurPosLeft();
	var noteTop = JSDiagram.getCurPosTop();
	if (nodeData.typeCode=="state") {
		noteLabel += nodeData.stateid;
		var stateObj = JSDiagram.findState(uid_p);
		noteLeft = stateObj.getAbsolutePosLeft() + 5;
		noteTop = stateObj.getAbsolutePosTop() + 30;
	}
	else if (nodeData.typeCode=="transition") {
		noteLabel += nodeData.event;
		var transObj = JSDiagram.findTrans(uid_p);
		noteLeft = transObj.lastPath.labelLeft + 5;
		noteTop = transObj.lastPath.labelTop + 30;
	}
	else if (nodeData.typeCode=="usecase") {
		noteLabel = "mCase: " + nodeData.usecasename;
		noteLeft = $("#mcaseViewPanel").css("left");
		noteTop = $("#mcaseViewPanel").css("top");
	}
	else if (nodeData.typeCode=="step") {
		if (nodeData.transuid) {
			noteLabel += parentWinObj.curAppState.nodeDataList[nodeData.transuid].event;
		}
		else {
			noteLabel += parentWinObj.curAppState.nodeDataList[nodeData.stateuid].stateid;
		}
		noteLeft = $("#mcaseViewPanel").css("left");
		noteTop = $("#mcaseViewPanel").css("top");
	}
	else if (nodeData.typeCode=="scxml") {
		noteLabel = "Model";
	}
	
	$("#notePad .noteHeader").text(noteLabel);
	$("#notePad").css("left", noteLeft).css("top", noteTop).attr("uid", uid_p).show(100);
	$("#notePad textarea").focus();
	$("#notePad textarea").val(decodeURI(nodeData.notepad).replace(/\[newline]/g,"\n"));
//	$("#notePad textarea").val(decodeURI(nodeData.notepad));
	var input = $("#notePad textarea")[0];
	if (input.setSelectionRange) {
	    input.focus();
	    input.setSelectionRange(0, 0);
	}
    else if (input.createTextRange) {
	    var range = input.createTextRange();
	    range.collapse(true);
	    range.moveEnd('character', 0);
	    range.moveStart('character', 0);
	    range.select();
    }
}

var editNodeData;
function closeEditLabel () {
	if (editNodeData && $("#editLabel").is(":visible")) {
		$("#editLabel").hide();
		var newLabel = $("#editLabel textarea").val();
		var width = $("#editLabel textarea").css("width");
		width = width.substring(0, width.length-2);
		width = Math.round(parseFloat(width));
		editNodeData.width = width;
		if (editNodeData.typeCode=="state") {
			var oldStateId = editNodeData.stateid;
			editNodeData.stateid = removeInvalidStateTransChar(newLabel);
			parentWinObj.stateIdRenamedAction(editNodeData, oldStateId);
		}
		else {
			editNodeData.event = removeInvalidStateTransChar(newLabel);
		}
		parentWinObj.saveProperty(editNodeData, function() {
			parentWinObj.setCurStateTrans(editNodeData.uid);
		});
	}
}

function removeInvalidStateTransChar (newName) {
	return newName.replace(/\/|\\|\t/g, '');
}

function editLabel(editNodeData_p) {
	editNodeData = editNodeData_p;
	JSDiagram.clearHilite();
	$("#opaqDiv").show();
	var noteLeft;
	var noteTop;
	var noteWidth;
	var label = "";
	var uid = "";
	if (editNodeData_p.typeCode=="state") {
		label = editNodeData_p.stateid;
		var editObj = JSDiagram.findState(editNodeData_p.uid);
		noteLeft = editObj.getAbsolutePosLeft() + 5;
		noteTop = editObj.getAbsolutePosTop() + 25;
		noteWidth = editObj.getWidth();
	}
	else {
		label = editNodeData_p.event;
		var editObj = JSDiagram.findTrans(editNodeData_p.uid);
		noteLeft = editObj.lastPath.labelLeft;
		noteTop = editObj.lastPath.labelTop;
		noteWidth = editObj.getWidth();
	}
	$("#editLabel").css({left: noteLeft, top: noteTop, width: noteWidth})
		.attr("uid", uid).show(100);
	$("#editLabel textarea").css("width", noteWidth).focus();
	$("#editLabel textarea").val(decodeURI(label));
}

function saveStateTransPositions() {
	var nodeDataList = parentWinObj.curAppState.nodeDataList;
	var stateObj;
	var transObj;
	var nodeData;
	for (i in nodeDataList) {
		var nodeData = nodeDataList[i];
		if (nodeData==null) continue;
		if (nodeData.typeCode=="state") {
			stateObj = JSDiagram.findState(nodeData.uid);
			nodeData.left = stateObj.getPosLeft();
			nodeData.top = stateObj.getPosTop();
			nodeData.width = stateObj.getPosWidth();
			nodeData.height = stateObj.getPosHeight();
		}
		else if (nodeData=="transition") {
			transObj = JSDiagram.findTrans(nodeData.uid);
			nodeData.startFract = transObj.startFract;
			nodeData.midFract = transObj.midFract;
			nodeData.endFract = transObj.endFract;
			nodeData.midOffset = transObj.midOffset;
			nodeData.startOrient = getOrientName(transObj.startOrient);
			nodeData.endOrient = getOrientName(transObj.endOrient);
		}
		parentWinObj.saveProperty(nodeData);
	}
}



function adjustHeight() {
	// retrieve default setting from cookies
	appContentHeight = $(window).height();
	panesWrapperWidth = $(window).width();
	$("#wrapper").css("height", (appContentHeight -25) + "px").css("width", panesWrapperWidth + "px");
	return;
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset" || action_p=="cancel") {
		reset();
	}
	else if (action_p=="setBreak") {
		setBreak(params_p.uid, params_p.val);
	}
	else if (action_p=="clearBreaks") {
		clearBreaks();
	}
	else if (action_p=="display") {
		display();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return modelLoaded;
	}
	else if (action_p=="clearPaused") {
		clearPaused();
		showStatusMsg("");
	}
	else if (action_p=="setPausedAt") {
		if (parentWinObj) setPausedAt();
		showCurAnnot();
	}
	else if (action_p=="updateNode") {
		updateNode(params_p);
	}
	else if (action_p=="clearAnimate") {
		if (parentWinObj) clearAnimate();
		showStatusMsg("");
	}
	else if (action_p=="playButton") {
		playButton();
	}
	else if (action_p=="addState/Trans") {
		addStateTrans(params_p);
	}
	else if (action_p=="addNode") {
		addStateTrans([params_p]);
	}
	else if (action_p=="save") {
		saveStateTransPositions();
	}
	else if (action_p=="getAllMarkedUID") {
		return JSDiagram.getAllMarkedUID();
	}
	else if (action_p=="runSearch") {
		runSearch(params_p);
	}
	else if (action_p=="sysMsg") {
		showStatusMsg(params_p.msg);
	}
	else if (action_p=="pausedAtMsg") {
		showStatusMsg(params_p.msg);
	}
	else if (action_p=="renameModel") {
		displayModelName();
	}
	else if (action_p=="popupTreeView") {
		popupTreeView();
	}
	else if (action_p=="popupMCaseView") {
		popupMCaseView();
	}
	else if (action_p=="popupGuardsView") {
		popupGuardsView();
	}
	else if (action_p=="popupReqView") {
		popupReqView();
	}
	else if (action_p=="popupDefectsView") {
		popupDefectsView();
	}
	else if (action_p=="popupAnnotView") {
		popupAnnotView();
	}
	else if (action_p=="updateSubModelStateTrans") {
		setSubModelStateTransByFilter(params_p);
	}
	else if (action_p=="refreshReqTagList") {
		if ($("#reqViewPanel").is(":visible")) {
			reloadTagList();
		}
	}
	else if (action_p=="printModel") {
		printModel();
	}	
	else if (action_p=="markMode") {
		JSDiagram.markMode = params_p;
	}
	else {
		alert("Model unknown action: " + action_p);
	}
}

// release 0.4.0 issue - stil have arrow/anchor issue css3
function printModel() {
	var canvasBody = document.getElementById("wrapper");
    html2canvas(canvasBody, {
	    onrendered: function(canvas) {
		    $(canvasBody).hide();
		    document.body.appendChild(canvas);
	    },
	    width: 3000,
		height: 3000
    });
}


var autoCancelMsgMillis = 8000;
var cancelRtMsg = null;
function clearRtMsg() {
	if (cancelRtMsg) {
		clearTimeout (cancelRtMsg);
		cancelRtMsg = null;
	}
	$("#rtMsg").hide();
}

function showStatusMsg(msg_p) {
	if (msg_p=="") return;
	var isPausedMsg = msg_p.indexOf("Paused At:")==0;
	if (cancelRtMsg) {
		clearTimeout (cancelRtMsg);
		cancelRtMsg = null;
		var lastMsg = $("#rtMsg").html();
		if (isPausedMsg) {
			var msgList = lastMsg.split("Paused At:");
			if (msgList[msgList.length-1].indexOf("<br>")>0) {
				$("#rtMsg").html($("#rtMsg").html() + "<br/>" + msg_p).show();
			}
			else {
				$("#rtMsg").html(msg_p).show();
			}
		}
		else {
			$("#rtMsg").html($("#rtMsg").html() + "<br/>" + msg_p).show();
		}
	}
	else {
		if (isPausedMsg) {
			$("#rtMsg").html(msg_p).show();
		}
		else {
			$("#rtMsg").html("Sys Msg: " + msg_p).show();
		}
	}
	cancelRtMsg = setTimeout (clearRtMsg, autoCancelMsgMillis);
}


function addStateToMCaseReq(uid_p) {
	var stateObj = JSDiagram.findState(uid_p);
	if (stateObj.isMarked()) {
		addToMCase(JSDiagram.getAllMarkedUID());
	}
	else addToMCase([uid_p]);
}

function addTransToMCaseReq(uid_p) {
	var transObj = JSDiagram.findTrans(uid_p);
	if (transObj.isMarked()) {
		addToMCase(JSDiagram.getAllMarkedUID());
	}
	else addToMCase([uid_p]);
}

function toggleBreak(uid_p) {
	parentWinObj.toggleBreak(uid_p);
}

function setBreak(uid_p, breakOn_p) {
	var graphNodeObj = JSDiagram.findState(uid_p);
	if (graphNodeObj==null) {
		graphNodeObj = JSDiagram.findTrans(uid_p);
	}
	graphNodeObj.setBreak(breakOn_p);
	tvUpdateBreak(uid_p, breakOn_p);
}


function showCoverage(showPausedAt_p) {
	parentWinObj.sendAction("debug", "type=getCoverageStats&execID=" + parentWinObj.curAppState.execID, function(coverageStats) {
		for (var uid in coverageStats) {
			var elemColor = coverageStats[uid];
			if (elemColor=="crimson") continue; // ignore uncovered
			if (elemColor=="gold") elemColor = "#9BC4E2";
			else if (elemColor=="darkgreen") elemColor = "#A6D785";
			JSDiagram.hiliteElem(uid, {color: elemColor, opacityFloat: 0.5, zIndex: zIndexHiliteItem});
		}
		if (showPausedAt_p) {
			playPausedAt();
		}
	});
}

function showUncovered () {
	parentWinObj.sendAction("debug", "type=getCoverageStats&execID=" + parentWinObj.curAppState.execID, function(coverageStats) {
		for (var uid in coverageStats) {
			var elemColor = coverageStats[uid];
			if (elemColor=="gold") elemColor = "#9BC4E2";
			else if (elemColor=="crimson") elemColor = 'ORANGE';
			else if (elemColor=="darkgreen") continue;
			JSDiagram.hiliteElem(uid, {color: elemColor, opacityFloat: 0.5, zIndex: zIndexHiliteItem});
		}
	});
}


function showGuardsStatus(pausedUID_p) {
	if (!parentWinObj.curAppState.hiliteFailedGuards) {
		return;
	}
	
	var stateObj = parentWinObj.curAppState.nodeDataList[pausedUID_p];
	if (stateObj==null) return;
	refreshGuardsView(pausedUID_p);
	parentWinObj.sendAction("debug", "type=getGuardsStatus&stateUID=" + pausedUID_p, function(data) {
		for (var i in data.transList) {
			var trans = data.transList[i];
			if (trans.evalStatus) continue;
			trailingList.push(trans.uid);
			JSDiagram.hiliteElem(trans.uid, {color: "yellow", opacityFloat: 0.5, zIndex: zIndexHiliteItem, title: "guard condition failed"});
		}
	});
}


function copyPasteTrans(srcStateUID) {
	var markedUIDList = JSDiagram.getAllMarkedUID();
	var markedTransCount = 0;
	
	for (var i in markedUIDList) {
		var fromTrans = JSDiagram.findTrans(markedUIDList[i]);
		if (fromTrans==null) continue;
		parentWinObj.sendAction("addNode", "cmd=pasteTrans&srcStateUID=" + srcStateUID + "&fromTransUID=" + fromTrans.transUID, function(data) {
			parentWinObj.reloadModel();
			if (parentWinObj.actionCallback(data)) return;
			addStateTrans(data.addnodes.nodelist);
			parentWinObj.setModelChanged(true);
			savePosition (data.addnodes.nodelist);
		});
		markedTransCount = markedTransCount + 1;
	}

	if (markedTransCount <=0) {
		parentWinObj.alertDialog("No transitions are selected for paste.");
		return;
	}
		
}

function reverseTrans(transUID_p) {
	var transNodeData = parentWinObj.curAppState.nodeDataList[transUID_p];
	if (transNodeData==null) return;
	
	var srcUID = transNodeData.parentuid;
	var destUID = transNodeData.targetUID;
		
	parentWinObj.sendAction("moveParentNode", "uid=" + transUID_p + "&parentuid=" + destUID, function (data) { 
		if (parentWinObj.actionCallback(data)) return;

		var transObj = JSDiagram.findTrans(transUID_p);
		transObj.moveSrcState(destUID);

		// move nodeDataList too
		var oldParentStateNode = parentWinObj.curAppState.nodeDataList[srcUID];
		for (i in oldParentStateNode.transitions) {
			if (oldParentStateNode.transitions[i] && oldParentStateNode.transitions[i].uid==transUID_p) {
				oldParentStateNode.transitions[i] = null;
			}
		}
		var newParentStateNode = parentWinObj.curAppState.nodeDataList[destUID];
		newParentStateNode.transitions.push(transNodeData);
		transNodeData.parentuid = destUID;
		
		transObj.moveDestState(srcUID);
		transNodeData.targetUID = srcUID;
		transNodeData.target = oldParentStateNode.stateid;
		parentWinObj.saveProperty(transNodeData);
		tvMoveTransToNewState(transUID_p, destUID);

		// need to refresh MScript so that the trans gets the correct parent state if it is being edited in mscript		
		parentWinObj.refreshWin("MScript");
	});
}

function openSubModel(uid_p) {
	var stateNodeData = parentWinObj.curAppState.nodeDataList[uid_p];
	parentWinObj.openModel(stateNodeData.subModel);
}


var findOption = {searchExpr: ""};

function openSearch() {
	var htmlCode = "<div><b>Find and Mark/Highlight States/Transitions</b><hr/></div><table>"
			+ "<tr><td colspan=2><i>Enter lowercase for case insensitive search, /expr/ for RegExpr search</i></td></tr>"
			+ "<tr><td>Action: </td><td><input type=radio name=modeMarkHighlight id=modelMark checked>Mark</input>&nbsp;"
			+ "<input type=radio name=modeMarkHighlight id=modelHighlight checked>Highlight</input></td></tr>"
			+ "<tr><td>Search For: </td><td><input type=checkbox id=modelFindState checked>States</input>&nbsp;"
			+ "<input type=checkbox id=modelFindTrans checked>Transitions</input></td></tr>"
			+ "<tr id=byMode><td>Mode: </td><td><input type=radio name=searchMode id=bySearch checked>Text Search</input>"
			+ "<input type=radio name=searchMode id=byTrace>Paste Trace</input></td></tr>"
			+ '<tr class=textSrchMode><td>Text or RegExpr: </td><td><input type=text size=50 id=searchText value="' + findOption.searchExpr + '"/></td></tr>'
			+ '<tr class=textSrchMode><td valign=top>Match On: </td><td>'
			+ '<input type=checkbox id=modelSearchName checked>State/Trans Name</input>&nbsp;'
			+ '<input type=checkbox id=modelSearchDesc>Description</input>&nbsp;'
			+ '<input type=checkbox id=modelSearchStereotype>Stereotype</input><br/>'
			+ '<input type=checkbox id=modelSearchTag>Tags</input>&nbsp;'
			+ '<input type=checkbox id=modelSearchMScript>MScript</input></td></tr>'
			+ "<tr class=textSrchMode><td title='to perform the action on the elements not match the selection criteria specified'>Invert Selection:</td><td><input type=checkbox name=modelInvert id=modelInvert/></td></tr>"
			+ "<tr class=pasteTraceMode><td title='mark state/transitions by trace text' valign=top>Trace Text:</td><td><textarea id=traceText rows=5 cols=40/></td></tr>"
			+ "</table>";
	parentWinObj.plainDialog (htmlCode, function() {
		findOption.searchExpr = parentWinObj.getDialogField("searchText").val();
		if (parentWinObj.getDialogField("bySearch").is(":checked")) {
			if (findOption.searchExpr=="") return;
			findOption.findState = parentWinObj.getDialogField("modelFindState").is(":checked");
			findOption.findTrans = parentWinObj.getDialogField("modelFindTrans").is(":checked");
			findOption.findTags = parentWinObj.getDialogField("modelSearchTag").is(":checked");
			findOption.findName = parentWinObj.getDialogField("modelSearchName").is(":checked");
			findOption.findMScript = parentWinObj.getDialogField("modelSearchMScript").is(":checked");
			findOption.findDesc = parentWinObj.getDialogField("modelSearchDesc").is(":checked");
			findOption.findStereotype = parentWinObj.getDialogField("modelSearchStereotype").is(":checked");
	
			findOption.findMarkThem = parentWinObj.getDialogField("modelMark").is(":checked");
			findOption.invertSelection = parentWinObj.getDialogField("modelInvert").is(":checked");
	
			runSearch(findOption);
		}
		else {
			var pasteText = parentWinObj.getDialogField("traceText").val();
			if (pasteText=="") return;
			runPasteTrace(pasteText);
		}
	}, "searchText", function() {
		checkSearchMode();
		parentWinObj.getDialogField("byMode input").click(checkSearchMode);
	});
	
}

function checkSearchMode() {
	if (parentWinObj.getDialogField("bySearch").is(":checked")) {
		parentWinObj.getDialogField(".textSrchMode").show();
		parentWinObj.getDialogField(".pasteTraceMode").hide();
	}
	else {
		parentWinObj.getDialogField(".textSrchMode").hide();
		parentWinObj.getDialogField(".pasteTraceMode").show();
		parentWinObj.getDialogField("#traceText").focus();
		parentWinObj.getDialogField("#modelFindTrans").attr("checked", true);
		parentWinObj.getDialogField("#modelMark").attr("checked", true);
	}
}

function runPasteTrace(pasteText_p) {
	var textList = pasteText_p.split("\n");
	var stateObj = null;
	var exceptList = new Array();
	JSDiagram.clearHilite();
	JSDiagram.clearMarks();
	for (var i in textList) {
		if (textList[i]=="") continue;
		var foundIt = false;
		if (textList[i].indexOf("state ")==0 || textList[i].indexOf("State ")==0) {
			var stateID = textList[i].substring(6).trim();
			stateObj = parentWinObj.findStateByStateID(stateID);
			if (stateObj!=null) {
				foundIt = true;
				JSDiagram.mark (stateObj.uid);
			}
		}
		else if (textList[i].indexOf("transition ")==0 || textList[i].indexOf("Transition ")==0) {
			if (stateObj!=null) {
				var transID = textList[i].substring(11).trim();
				var transObj = parentWinObj.findStateTransByTransID (stateObj, transID);
				if (transObj!=null) {
					foundIt = true;
					JSDiagram.mark (transObj.uid);
				}
			}
		}
		if (!foundIt) {
			exceptList.push("Invalid " + textList[i]);
		}
	}	
	if (exceptList.length>0) {
		setTimeout ('parentWinObj.alertDialog("' + exceptList.join("<br/>") + '")', 200);
	}
	return;
}

function runSearch (findOption_p) {
	findOption = findOption_p;
	JSDiagram.clearHilite();
	JSDiagram.clearMarks();
	var params = "type=stateTrans&findState=" + findOption.findState + "&findTrans=" + findOption.findTrans
				+ "&inTag=" + findOption.findTags + "&inName=" + findOption.findName + "&inMScript=" + findOption.findMScript + "&inDesc=" + findOption.findDesc
				+ "&inStereotype=" + findOption.findStereotype + "&expr=" + findOption.searchExpr;
	parentWinObj.sendAction("find", params, function (data) {
			if (parentWinObj.actionCallback(data)) return;
			searchUIDList = data;
			setTimeout(markStateTrans, 50);
		});
}

var searchUIDList = null;
function markStateTrans() {
	if (searchUIDList==null) return;
	
	JSDiagram.clearMarks();
	var findMode = "marked";
	if (!findOption.findMarkThem) findMode = "highlighted";

	var cntStates = 0;
	if (findOption.invertSelection) {
		var nodeDataList = parentWinObj.curAppState.nodeDataList;
		for (var n in nodeDataList) {
			var curNode = nodeDataList[n];
			if (curNode.typeCode!="state" && curNode.typeCode!="transition") {
				continue;
			}
			
			var actionOnIt = true;
			for (var i in searchUIDList) {
				if (searchUIDList[i]==curNode.uid) {
					actionOnIt = false;
					break;
				}
			}

			if (actionOnIt) {
				if (findOption.findMarkThem) {
					JSDiagram.mark (curNode.uid);
				}
				else {
					JSDiagram.hiliteElem(curNode.uid, {color: "#FFcc99", opacityFloat: 0.5, zIndex: zIndexHiliteItem});
				}
				cntStates++;
				if (cntStates==1) {
					JSDiagram.scrollTo(curNode.uid);
				}
			}
		}
	}
	else {
		for (var i in searchUIDList) {
			if (findOption.findMarkThem) {
				JSDiagram.mark (searchUIDList[i]);
			}
			else {
				JSDiagram.hiliteElem(searchUIDList[i], {color: "#FFcc99", opacityFloat: 0.5, zIndex: zIndexHiliteItem});
			}
			cntStates++;
			if (cntStates==1) {
				JSDiagram.scrollTo(searchUIDList[i]);
			}
		}
	}
	
	if (cntStates<=0) {
		parentWinObj.alertDialog("Not states/transition found to match search criteria.");
	}
}

function showSubModel(uid_p) {
	var state = JSDiagram.findState(uid_p);
	if (state) {
		state.showChildren();
		var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
		nodeData.hideSubModel = "N";
		parentWinObj.saveProperty(nodeData);
	}
}

function hideSubModel(uid_p) {
	var state = JSDiagram.findState(uid_p);
	if (state) {
		state.hideChildren();
		var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
		nodeData.hideSubModel = "Y";
		parentWinObj.saveProperty(nodeData);
	}
}

function showSubStates(uid_p) {
	var state = JSDiagram.findState(uid_p);
	if (state) {
		state.showChildren();
	}
}

function hideSubStates(uid_p) {
	var state = JSDiagram.findState(uid_p);
	if (state) {
		state.hideChildren();
	}
}

function showAllSubModels() {
	for (var i in parentWinObj.curAppState.nodeDataList) {
		var nodeData = parentWinObj.curAppState.nodeDataList[i];
		if (nodeData && nodeData.typeCode=="state" && 
			nodeData.subModel!="") {
			showSubModel(nodeData.uid);
		}
	}
}

function hideAllSubModels() {
	for (var i in parentWinObj.curAppState.nodeDataList) {
		var nodeData = parentWinObj.curAppState.nodeDataList[i];
		if (nodeData && nodeData.typeCode=="state" && 
			nodeData.subModel!="") {
			hideSubModel(nodeData.uid);
		}
	}
}

function autoLayout () {
	parentWinObj.sendAction("misc", "type=getDAGRE", function (data) { 
		if (parentWinObj.actionCallback(data)) return;
	
		var g = new dagre.Digraph();
		for (var si in data.stateList) {
			var state = data.stateList[si];
			g.addNode(state.uid, { label: state.label,  width: state.width, height: state.height });
		}
		for (var ei in data.edgeList) {
			var edge = data.edgeList[ei];
			g.addEdge(edge.uid, edge.from, edge.to);
		}
		
		var layout = dagre.layout().run(g);
		for (var uid in layout._nodes) {
			var node = layout._nodes[uid];
			var state = JSDiagram.findState (uid);
			state.setPos (node.value.x, node.value.y);
			var stateNodeData = parentWinObj.curAppState.nodeDataList[uid];
			stateNodeData.left = node.value.x;
			stateNodeData.top = node.value.y;
			parentWinObj.saveProperty(stateNodeData);
		}
	});
}
