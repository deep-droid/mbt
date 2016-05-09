// ModelView.js - copyright 2008-2012 TestOptimal, LLC
var viewCtxMenuBkgColor = "#DCE9F0";
var hiliteMarkedColor = "#FFCC99";

var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";
var manualSort = true; // for treeview, init from config but changes saved for this editor session


var tvStateCtxMenuBindings = {
	'menuID': 'tvStateCtx',
	'stateProp': function(ui) {
		var uid = $(ui).attr("uid");
		parentWinObj.editStateProperty(uid);
	},
	'stateNotepad': function(ui) {
		var uid = $(ui).attr("uid");
		popupNotePad(uid);
	},
	'addStateReq': function(ui) {
		var uid = $(ui).attr("uid");
		var stateObj = JSDiagram.findState(uid);
		addStateToServerReq(uid, 0, 0, true, "");
	},
	'addVertSyncReq': function(ui) {
		var uid = $(ui).attr("uid");
		addStateToServerReq(uid, 0, 0, true, "BV");
	},
	'addHorzSyncReq': function(ui) {
		var uid = $(ui).attr("uid");
		addStateToServerReq(uid, 0, 0, true, "BH");
	},
	'addBranchReq': function(ui) {
		var uid = $(ui).attr("uid");
		var stateObj = JSDiagram.findState(uid);
		addStateToServerReq(uid, 0, 0, true, "B");
	},
	'addInitialReq': function(ui) {
		var uid = $(ui).attr("uid");
		var stateObj = JSDiagram.findState(uid);
		addStateToServerReq(uid, 0, 0, false, "Initial");
	},
	'addFinalReq': function(ui) {
		var uid = $(ui).attr("uid");
		var stateObj = JSDiagram.findState(uid);
		addStateToServerReq(uid, 0, 0, false, "Final");
	},
	'delState': function(ui) {
		var uid = $(ui).attr("uid");
		var stateObj = JSDiagram.findState(uid);
		JSDiagram.clearHilite(uid);
		deleteState(stateObj);
	},
	'addTrans': function(ui, curTarget, e) {
		var uid = $(ui).attr("uid");
		addTransToServerReq(uid, uid, true);
	},
	'addMCase': function(ui) {
		var uid = $(ui).attr("uid");
		addStateToMCaseReq (uid);
	},
	'moveUp': function(ui) {
		moveUp (ui);
	},
	'moveDown': function(ui) {
		moveDown (ui);
	},
	'toggleBreak': function(ui) {
		var uid = $(ui).attr("uid");
		toggleBreak(uid);
	},
	'tvGuardView': function(ui) {
		var uid = $(ui).attr("uid");
		popupGuardsView (uid);
	},
	'pasteTrans': function(ui) {
		var srcStateUID = $(ui).attr("uid");
		parentWinObj.setModelChanged(true);
		copyPasteTrans(srcStateUID);
	},

	'onShowMenu': function (e, menu) {
		var stateUID = $(e.target).attr("uid");
		var stateObj = JSDiagram.findState(stateUID);
		if (stateObj.readonly) {
			$(menu).find("li").hide();
			$(menu).find(".readonly").show();
		}
		checkMenuCFG(menu);
		
		var markedTransList = JSDiagram.getMarkedTrans();
		if (markedTransList.length <=0) {
			$(menu).find("#pasteTrans").hide();
		}
		
		if (manualSort) {
			$(menu).find(".updown").show();
		}
		else {
			$(menu).find(".updown").hide();
		}

		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: viewCtxMenuBkgColor,
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



var tvTransCtxMenuBindings = {
	'menuID': 'tvTransCtx',
	'transProp': function(ui) {
		var uid = $(ui).attr("uid");
		parentWinObj.editTransProperty(uid);
	},
	'transDataSet': function(ui) {
		var uid = $(ui).attr("uid");
		parentWinObj.startDataSet({uid: uid});
	},
	'transNotepad': function(ui) {
		var uid = $(ui).attr("uid");
		popupNotePad(uid);
	},
	'delTrans': function(ui) {
		var uid = $(ui).attr("uid");
		var transObj = JSDiagram.findTrans(uid);
		deleteTrans(transObj);
	},
	'addMCase': function(ui) {
		var uid = $(ui).attr("uid");
		addTransToMCaseReq(uid);
	},
	'moveUp': function(ui) {
		moveUp (ui);
	},
	'moveDown': function(ui) {
		moveDown (ui);
	},
	'toggleBreak': function(ui) {
		var uid = $(ui).attr("uid");
		toggleBreak(uid);
	},
	'onShowMenu': function (e, menu) {
		var transUID = $(e.target).attr("uid");
		var transObj = JSDiagram.findTrans(transUID);
		if (transObj && transObj.readonly) {
			$(menu).find("li").hide();
			$(menu).find(".readonly").show();
		}

		checkMenuCFG(menu);
		
		if (manualSort) {
			$(menu).find(".updown").show();
		}
		else {
			$(menu).find(".updown").hide();
		}
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: viewCtxMenuBkgColor,
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

var mcaseCtxMenuBindings = {
	'menuID': 'ctxMenuMCase',
	'mcaseProp': function(ui) {
		var uid = $(ui).attr("uid");
		parentWinObj.editMCaseProperty(uid);
	},
	'mcaseNotepad': function(ui) {
		var uid = $(ui).attr("uid");
		popupNotePad(uid);
	},
	'delMCase': function(ui) {
		var uid = $(ui).attr("uid");
		var msg = "Do you wish to delete mCase " + $(ui).html() + "?";
		delMCaseReq(uid, msg);
	},
	'toggleDisable': function(ui) {
		var uid = $(ui).attr("uid");
		toggleDisable(uid);
	},
	'moveUp': function(ui) {
		moveUp (ui);
	},
	'moveDown': function(ui) {
		moveDown (ui);
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: viewCtxMenuBkgColor,
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


var stepCtxMenuBindings = {
	'menuID': 'ctxMenuStep',
	'stepProp': function(ui) {
		var uid = $(ui).attr("uid");
		parentWinObj.editStepProperty(uid);
	},
	'stepNotepad': function(ui) {
		var uid = $(ui).attr("uid");
		popupNotePad(uid);
	},
	'delStep': function(ui) {
		var uid = $(ui).attr("uid");
//		var labelElem = $(ui).parent().parent();// $(ui).parent().parent().find("span.label");
//		var msg = "Do you wish to delete step " + $(labelElem).html() + "?";
		delMCaseItem(uid);
	},
	'toggleDisable': function(ui) {
		var uid = $(ui).attr("uid");
		toggleDisable(uid);
	},
	'moveUp': function(ui) {
		moveUp (ui);
	},
	'moveDown': function(ui) {
		moveDown (ui);
	},
	menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: viewCtxMenuBkgColor,
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

function updateViews(nodeData_p) {
	if (nodeData_p.typeCode=="usecase") {
		$("#mcaseViewPanel .label[uid="+ nodeData_p.uid + "]").text(nodeData_p.usecasename);
	}
	else if (nodeData_p.typeCode=="state") {
		$("#treeViewPanel .label[uid=" + nodeData_p.uid + "]").text(nodeData_p.stateid);
	}
	else if (nodeData_p.typeCode=="transition") {
		var elem = $("#treeViewPanel .label[uid=" + nodeData_p.uid + "]");
		$(elem).find(".transName").text(nodeData_p.event);
		$(elem).find(".targetState").text(nodeData_p.target);
	}
}

function delTransFromView (transObj_p) {
	if (isTreeViewOpen()) {
		$("#stateList li span.label[uid=" + transObj_p.transUID + "]").parent().parent().remove();
	}
}

// also delete all incoming trans too
function delStateFromView (stateObj_p) {
	if (isTreeViewOpen()) {
		$("#stateList li span.label[uid=" + stateObj_p.stateUID + "]").parent().parent().remove();
		$("#stateList li span.label[targetUID=" + stateObj_p.stateUID + "]").parent().parent().remove();
	}
}

function getStateList () {
	var nodeList = parentWinObj.curAppState.nodeDataList["scxml"].childrenStates;
	var retList = new Array();
	for (var uid in nodeList) {
		var stateNode = nodeList[uid];
		if (stateNode && stateNode.typeCode=="state") {
			retList.push(stateNode);
		}
	}
	
	return retList;	
}



function stateSorter(a,b) {
	if (a.stateid == b.stateid) return 0;
	else if (a.stateid < b.stateid) return -1;
	else return 1;
}

function transSorter(a,b) {
	if (a==null || b==null) return 0;
	if (a.event == b.event) return 0;
	else if (a.event < b.event) return -1;
	else return 1;
}

function isTreeViewOpen () {
	return $("#treeViewPanel").is(":visible");
}

function popupTreeView () {
	if (regView("treeViewPanel")) {
		manualSort = (parentWinObj.getConfigProperty("modelTreeViewSort")=="Manual");
		
		$("#treeViewPanel").draggable().draggable(
			{  cancel: '#treeViewCnt', 
			   start: function() { bringViewToFront("treeViewPanel");}
			})
			.resizable({ alsoResize: '#treeViewCnt', minHeight: 75, handles: "all", minWidth: 180 })
			.click(function() {	bringViewToFront("treeViewPanel");});
		$("#treeViewClose").click(function() {
			closeTreeViewPanel();
		});
	}

	bringViewToFront("treeViewPanel");
	$("#stateList>*").remove();

	var nodeList = getStateList();
	for (var uid in nodeList) {
		var stateNode = nodeList[uid];
		loadState(stateNode, $("#stateList"));
	}

	// refresh the breakpoints
	nodeAttrList = new Array();
	var uid;
	var elemObj 
	for (k in parentWinObj.curAppState.breakpoints) {
		uid = parentWinObj.curAppState.breakpoints[k]
		if (uid.indexOf("L")==0) continue;
		var nodeData = parentWinObj.curAppState.nodeDataList[uid];
		if (nodeData) {
			tvUpdateBreak(nodeData.uid, true);
		}
	}

	$("#stateList").treeview({control:"#treeViewPanel .treecontrol"});
	

	$("#treeViewPanel").show();
}



function closeTreeViewPanel () {
	$("#treeViewPanel").hide();
	$("#stateList > *").remove();
}

function loadState(stateNode_p, parentElem_p) {
	var readonly = "";
	if (stateNode_p.readOnly=="Y") readonly = " readonly";
	var html = "<li class='closed'><div><span class='nodeIcon tvStateNode" + readonly + "'>S</span><span class='label' uid='" + stateNode_p.uid + "'>" + stateNode_p.stateid + "</span></div>";

	//	if (!stateNode_p.childrenStates || stateNode_p.childrenStates.length<=0) return html;
	html += "<ul></ul>";
	html += "</li>";
	var stateElem = $(html).appendTo(parentElem_p);
	$(stateElem).find(".label:first").contextMenu(tvStateCtxMenuBindings.menuID,  {
			bindings: tvStateCtxMenuBindings,
			'onShowMenu': tvStateCtxMenuBindings.onShowMenu,
	    	'menuStyle': tvStateCtxMenuBindings.menuStyle,
	    	'listingStyle': tvStateCtxMenuBindings.itemStyle,
	    	'itemHoverStyle': tvStateCtxMenuBindings.itemHoverStyle
	    })
		.click(function() {
			var uid = $(this).attr("uid");
			selectTreeViewNode(uid);
			JSDiagram.scrollTo(uid);
			JSDiagram.clearHilite();
			JSDiagram.hiliteElem (uid, {color: hiliteMarkedColor});
			JSDiagram.clearMarks();
			JSDiagram.setStateMarked(uid, true);
			parentWinObj.startEditMScript({uid: uid});
		}).dblclick(function() {
			var uid = $(this).attr("uid");
			parentWinObj.editStateProperty(uid);
		});
	
	var ulElem = $(stateElem).find("ul:first");
	if (stateNode_p.transitions.length>0) {
		for (var i in stateNode_p.transitions) {
			var trans = stateNode_p.transitions[i];
			if (!trans) continue;
			loadTrans(trans, ulElem);
		}
	}
	

	$(stateElem).find(".nodeIcon:first").click(function() {
		var uid = $(this).next().attr("uid");
		toggleBreak(uid);
	});

	if (stateNode_p.childrenStates && stateNode_p.childrenStates.length > 0) {
		var childrenStates = stateNode_p.childrenStates.sort(stateSorter);
		for (var i in childrenStates) {
			var childState = childrenStates[i];
			if (!childState) continue;
			loadState (childState, ulElem);
		}
	}
	
	return stateElem;
}

function tvMoveTransToNewState(transUID_p, newStateUID_p) {
	if (isTreeViewOpen()) {
		var transNode = $("#stateList li span.label[uid=" + transUID_p + "]").parent().parent();
	
		$("#stateList li span.label[uid=" + newStateUID_p + "]").parent().parent().append(transNode);
	}
}

function selectTreeViewNode(uid_p) {
	$("#treeViewPanel .tvSelected").removeClass("tvSelected");
	$("#treeViewPanel .label[uid=" + uid_p + "]").addClass("tvSelected");
}


function loadTrans(transData_p, stateElem_p) {
	var readonly = "";
	if (transData_p.readOnly=="Y") readonly = " readonly";
	var html = "<li class='closed'><div><span class='nodeIcon tvTransNode" + readonly + "'>T</span><span class='label' uid='" + transData_p.uid + "' targetUID='" + transData_p.targetUID + "'><span class='transName'>" + transData_p.event + "</span>&nbsp;<font color='red'><b>&rarr;</b></font>&nbsp;<span class='targetState'>" + transData_p.target + "</span></span></div></li>";
	var transElem = $(html).appendTo(stateElem_p);
	
	$(transElem).find(".label:first")
		.contextMenu(tvTransCtxMenuBindings.menuID,  {
			bindings: tvTransCtxMenuBindings,
			'onShowMenu': tvTransCtxMenuBindings.onShowMenu,
	    	'menuStyle': tvTransCtxMenuBindings.menuStyle,
	    	'listingStyle': tvTransCtxMenuBindings.itemStyle,
	    	'itemHoverStyle': tvTransCtxMenuBindings.itemHoverStyle
	    })
		.click(function() {
			var uid = $(this).attr("uid");
			selectTreeViewNode(uid);
			JSDiagram.scrollTo(uid);
			JSDiagram.clearHilite();
			JSDiagram.hiliteElem (uid, {color: hiliteMarkedColor});
			JSDiagram.clearMarks();
			JSDiagram.setTransMarked(uid, true);
			parentWinObj.startEditMScript({uid: uid});
		}).dblclick(function() {
			var uid = $(this).attr("uid");
			parentWinObj.editTransProperty(uid);
		});
	
	$(transElem).find(".nodeIcon:first").click(function() {
		var uid = $(this).next().attr("uid");
		toggleBreak(uid);
	});

	return transElem;
}


function isMCaseViewOpen () {
	return $("#mcaseViewPanel").is(":visible");
}

function stopAll(e) {
			e.stopPropagation();
			e.preventDefault();
			return false;

}

//var MCaseViewInit = false;
function popupMCaseView () {
	if (regView("mcaseViewPanel")) {
		$("#mcaseViewPanel").draggable().draggable(
			{  cancel: '#mcaseViewCnt', 
			   start: function() { bringViewToFront("mcaseViewPanel");}
			})
			.resizable({ alsoResize: '#mcaseViewCnt', handles: "all", minHeight: 75, minWidth: 180 })
			.click(function() {	bringViewToFront("mcaseViewPanel");});
		$("#mcaseViewClose").click(function() {
			closeMCaseViewPanel();
		});

		$("#mcaseViewPanel .treecontrol .plusU").click(function() {
			parentWinObj.newNode(parentWinObj.curAppState.nodeDataList["mbt"], 'usecase');
		});
		
		$("#mcaseViewPanel").click(function(e) { stopAll(e);})
		     .hover(function(e) {stopAll(e);}).mousedown(function(e){stopAll(e);});
	}

	bringViewToFront("mcaseViewPanel");
	$("#mcaseList>*").remove();

//	var nodeList = getStateList();
	var mbt = parentWinObj.curAppState.nodeDataList["mbt"];
	var i = 0;
	var mcaseObj;
	var mcaseUL = $("#mcaseList");
	
	for (i in mbt.usecases) {
		if (mbt.usecases[i]==undefined) continue; 
		mcaseObj = mbt.usecases[i];
		if (!mcaseObj) continue;
		loadMCase(mcaseObj, mcaseUL);
	}
	
	$("#mcaseList").treeview();
	parentWinObj.sendAction("debug", "type=getDisableds", function(disableds) {
		for (var d in disableds) {
			var uid2 = disableds[d];
			toggleDisable(uid2);
		}
	});
	
	tvSetPausedAt();

	$("#mcaseViewPanel").show();
}


function closeMCaseViewPanel () {
	$("#mcaseViewPanel").hide();
	$("#mcaseList > *").remove();
}

function loadMCase(mcase_p, mcaseUL_p) {
	var html = "<li class='closed'><div><span class='nodeIcon mCaseNode disInd'>u</span><span class='label' uid='" + mcase_p.uid + "'>" + mcase_p.usecasename + "</span></div>";
	html += "<ul></ul>";
	html += "</li>";
	var mcaseElem = $(html).appendTo(mcaseUL_p);
	$(mcaseElem).find(".label:first").contextMenu(mcaseCtxMenuBindings.menuID,  {
		bindings: mcaseCtxMenuBindings,
		'onShowMenu': mcaseCtxMenuBindings.onShowMenu,
    	'menuStyle': mcaseCtxMenuBindings.menuStyle,
    	'listingStyle': mcaseCtxMenuBindings.itemStyle,
    	'itemHoverStyle': mcaseCtxMenuBindings.itemHoverStyle
    })
    .click(function() {
		var uid = $(this).attr("uid");
		var elemObj = parentWinObj.curAppState.nodeDataList[uid];
		JSDiagram.clearMarks();
		JSDiagram.clearHilite();
		var firstUID = undefined;
		for (var j in elemObj.steps) {
			var stepObj = elemObj.steps[j];
			if (!stepObj) continue;
			var targetUID = "";
			if (stepObj.transuid) targetUID = stepObj.transuid;
			else targetUID = stepObj.stateuid;
			JSDiagram.mark(targetUID);
			if (!firstUID) firstUID = targetUID;
		}
		parentWinObj.startEditMScript({uid: uid});
		if (firstUID) {
			JSDiagram.scrollTo(firstUID);
		}
	}).dblclick(function() {
		var uid = $(this).attr("uid");
		parentWinObj.editMCaseProperty(uid);
	});
	
	$(mcaseElem).find(".disInd:first").click(function() {
		var uid = $(this).next().attr("uid");
		toggleDisable (uid);
	});

	var stepListElem = $(mcaseElem).find("ul:first");
	var j=0;
	for (j in mcase_p.steps) {
		var stepObj = mcase_p.steps[j];
		if (!stepObj) continue;
		loadStep(stepObj, stepListElem);
	}	
	return mcaseElem;
}


function loadStep (stepObj_p, stepListElem_p) {
	var stepLabel = "";
	var tempState = parentWinObj.curAppState.nodeDataList[stepObj_p.stateuid];
	var tempTrans = undefined;
	if (stepObj_p.transuid) tempTrans = parentWinObj.curAppState.nodeDataList[stepObj_p.transuid];
	var srcUID = "";
	var nodeType = "";
	if (tempTrans) {
		stepLabel = tempState.stateid + ": " + tempTrans.event;
		srcUID = tempTrans.uid;
		nodeType = "T";
	}
	else {
		stepLabel = tempState.stateid;
		srcUID = tempState.uid;
		nodeType = "S";
	}
	html = "<li class='closed'><div><span class='nodeIcon stepNode disInd'>" + nodeType + "</span><span class='label' uid='" + stepObj_p.uid + "' srcUID='" + srcUID + "'>" + stepLabel + "</span></div></li>";
	var stepElem = $(html).appendTo(stepListElem_p);
	$(stepElem).find(".label:first").contextMenu(stepCtxMenuBindings.menuID,  {
		bindings: stepCtxMenuBindings,
		'onShowMenu': stepCtxMenuBindings.onShowMenu,
    	'menuStyle': stepCtxMenuBindings.menuStyle,
    	'listingStyle': stepCtxMenuBindings.itemStyle,
    	'itemHoverStyle': stepCtxMenuBindings.itemHoverStyle
    })
    .click(function() {
		var uid = $(this).attr("uid");
		var elemObj = parentWinObj.curAppState.nodeDataList[uid];
		var firstUID = undefined;
		JSDiagram.clearHilite();
		if (elemObj.transuid) {
			JSDiagram.hiliteElem (elemObj.transuid, {color: hiliteMarkedColor});
			firstUID = elemObj.transuid;
		}
		else if (elemObj.stateuid) {
			JSDiagram.hiliteElem (elemObj.stateuid, {color: hiliteMarkedColor});
			firstUID = elemObj.stateuid;
		}
		JSDiagram.scrollTo(firstUID);
	}).dblclick(function() {
		var uid = $(this).attr("uid");
		parentWinObj.editStepProperty(uid);
	});	

	$(stepElem).find(".disInd:first").click(function() {
		var uid = $(this).next().attr("uid");
		toggleDisable (uid);
	});
	
	setStepRemoveFlag (stepObj_p);
	
	return stepElem;
}


function addToMCase (uidList_p) {
	var mcaseList = new Array();
	var mbt = parentWinObj.curAppState.nodeDataList["mbt"];
	for (i in mbt.usecases) {
		if (mbt.usecases[i]) {
			mcaseList.push({label: mbt.usecases[i].usecasename, val: mbt.usecases[i].uid});
		}
	}
	
	parentWinObj.selectDialog("Add Selected States/Transition to MCase", mcaseList, "", function() {
		var mcaseUID = parentWinObj.getSelectedVal();
		if (mcaseUID=="") return;
		var mcaseObj = parentWinObj.curAppState.nodeDataList[mcaseUID];
		if (mcaseObj==null) {
			return;
		}
		
		var transList = new Array();
		for (var j in uidList_p) {
			// expand state
			var nodeData = parentWinObj.curAppState.nodeDataList[uidList_p[j]];
			if (nodeData.typeCode=="transition") {
				transList.push(nodeData);
				continue;
			}
			for ( var k in nodeData.transitions) {
				var trans = nodeData.transitions[k];
				if (trans!=null) transList.push(trans);
			}
		}
		
		for (var j in transList) {
			parentWinObj.newStep(mcaseObj, transList[j]);
		}
		parentWinObj.setModelChanged(true);
	});
}

function setStepRemoveFlag(stepObj_p) {
	var disElem = $("#mcaseList .label[uid=" + stepObj_p.uid + "]").parent().find(".disInd:first");
	$(disElem).removeClass("removed").attr("title","");
	if (stepObj_p.removeFlag=="Y") {
		$(disElem).addClass("removed").attr("title","Transition to be removed before executing MCase");
	}
}

function delMCaseReq(uid_p, msg_p) {
	var nodeData = parentWinObj.curAppState.nodeDataList[uid_p];
	parentWinObj.confirmDialog(msg_p, function() {
		delMCaseItem(uid_p);
	});
}

function delMCaseItem(uid_p) {
	parentWinObj.sendAction("deleteNode", "uid=" + uid_p, function (data) {
		if (parent.actionCallback(data)) return;
		for (nodeIdx in data.deletenodes.nodelist) {
			var delNode = data.deletenodes.nodelist[nodeIdx];
			var delUID = delNode.uid;
			$("#mcaseList .label[uid=" + delUID + "]").parent().parent().remove();
			parentWinObj.curAppState.nodeDataList[delUID] = undefined;
			if (delNode.typeCode=="usecase") {
				var mcaseList = parentWinObj.curAppState.nodeDataList["mbt"].usecases;
				for (var i in mcaseList) {
					if (mcaseList[i] && mcaseList[i].uid==delUID) {
						mcaseList[i] = undefined;
						break;
					}
				}
			}
			else if (delNode.typeCode=="step") {
				var stepList = parentWinObj.curAppState.nodeDataList[delNode.parentuid].steps;
				for (var i in stepList) {
					if (stepList[i] && stepList[i].uid==delUID) {
						stepList[i] = undefined;
						break;
					}
				}
			}
		}
		parentWinObj.setModelChanged (true);
	});
}

function toggleDisable(uid_p) {
	var disElem = $("#mcaseList .label[uid=" + uid_p + "]").parent().find(".disInd:first").toggleClass("disabledOn");
	if ($(disElem).hasClass("disabledOn")) {
		parentWinObj.sendAction("setDisabled", "uid="+uid_p);
		$(disElem).parent().parent().attr("title", "Disabled");
	}
	else {
		parentWinObj.sendAction("removeDisabled", "uid="+uid_p);
		$(disElem).parent().parent().attr("title", "");
	}
}

function disableAllMCase() {
	$("#mcaseList .mCaseNode").each(function() {
		var disInd = $(this).hasClass("disabledOn");
		if (!disInd) {
			var uid = $(this).next().attr("uid");
			$(this).addClass("disabledOn");
			parentWinObj.sendAction("setDisabled", "uid="+uid);
			$(this).parent().parent().attr("title", "Disabled");
		}
	});
}

function enableAllMCase() {
	$("#mcaseList .mCaseNode").each(function() {
		var disInd = $(this).hasClass("disabledOn");
		if (disInd) {
			var uid = $(this).next().attr("uid");
			$(this).removeClass("disabledOn");
			parentWinObj.sendAction("removeDisabled", "uid="+uid);
			$(this).parent().parent().attr("title", "");
		}
	});
}

function addModelMCase(nodeData_p) {
	if (isMCaseViewOpen()) {
		var elem = loadMCase(nodeData_p, $("#mcaseList"));
		$("#mcaseList").treeview({
			add: elem
		});
	}
}

function addModelStep (nodeData_p) {
	if (isMCaseViewOpen()) {
		var mcaseElem = $("#mcaseList li .label[uid=" + nodeData_p.parentuid + "]").parent().parent().find("ul:first");
		var elem = loadStep (nodeData_p, mcaseElem);
		$("#mcaseList").treeview ({
			add: elem
		});
	}
}

function addNodeToViews (nodeData_p) {
	if (nodeData_p.typeCode=="usecase") {
		addModelMCase (nodeData_p);
	}
	else if (nodeData_p.typeCode=="step") {
		addModelStep (nodeData_p);
	}
	else if (nodeData_p.typeCode=="state") {
		var parentStateElem = $("#stateList");
		if (nodeData_p.parentuid && parentWinObj.curAppState.nodeDataList[nodeData_p.parentuid].typeCode=="state") {
			parentStateElem = $("#stateList li .label[uid=" + nodeData_p.parentuid + "]").parent().parent().find("ul:first");
		}
		var elem = loadState(nodeData_p, parentStateElem);
		$("#stateList").treeview({
			add: elem
		});
	}
	else if (nodeData_p.typeCode=="transition") {
		var parentStateElem = $("#stateList li .label[uid=" + nodeData_p.parentuid + "]").parent().parent().find("ul:first");
		var elem = loadTrans(nodeData_p, parentStateElem);
		$("#stateList").treeview({
			add: elem
		});
	}
}

// todo: make break an icon
function tvUpdateBreak(uid_p, breakEnabled_p) {
	var liElem = $("#stateList [uid=" + uid_p + "]").parent().find(".nodeIcon");
	if (breakEnabled_p) $(liElem).addClass("breakEnabled");
	else $(liElem).removeClass("breakEnabled");
}

function tvClearBreaks() {
	$("#stateList .nodeIcon").removeClass("breakEnabled");
}

function tvSetPausedAt(uid_p) {
	$("#stateList .pausedAt").removeClass("pausedAt");
	var pausedAt = parentWinObj.curAppState.getPausedAt();
	if (pausedAt==null && parentWinObj.curAppState.pausedTrailingList.length>0) {
		pausedAt = parentWinObj.curAppState.pausedTrailingList[0];
	}
	
	if (pausedAt==null) return;
	var liElem = $("#stateList [uid=" + pausedAt.uid + "]");
	$(liElem).addClass("pausedAt");
}

function tvClearPausedAt() {
	$("#stateList .pausedAt").removeClass("pausedAt");
}

function moveUp (ui) {
	var uid = $(ui).attr("uid");
	var curElem = $(ui).parent().parent();
	var beforeElem = $(curElem).prev();
	if (!beforeElem) return;
	parentWinObj.sendAction("moveNode", "uid="+uid + "&direction=up", function(data) {
		parentWinObj.reloadModel();
		curElem.insertBefore(beforeElem);
		parentWinObj.setModelChanged (true);
	});
}

function moveDown (ui) {
	var uid = $(ui).attr("uid");
	var curElem = $(ui).parent().parent();
	var afterElem = $(curElem).next();
	if (!afterElem) return;
	parentWinObj.sendAction("moveNode", "uid="+uid + "&direction=down", function(data) {
		parentWinObj.reloadModel();
		curElem.insertAfter(afterElem);
		parentWinObj.setModelChanged (true);
	});
}


//var GuardsViewInit = false;
function popupGuardsView (uid_p) {
	if (regView("guardsViewPanel")) {
		$("#guardsViewPanel").draggable().draggable(
			{   cancel: '#guardsViewCnt',
			    start: function() {bringViewToFront("guardsViewPanel");}
			})
			.resizable({ alsoResize: '#guardsViewCnt', handles: "all", minHeight: 75, minWidth: 100 })
			.click(function() {	bringViewToFront("guardsViewPanel");});
		$("#guardsViewClose").click(function() {
			closeGuardsViewPanel();
		});
	}
	refreshGuardsView(uid_p);
	
	bringViewToFront("guardsViewPanel");
	$("#guardsViewPanel").show();
}

function refreshGuardsView (uid_p) {
	parentWinObj.sendAction("mscriptGet", "cmd=getStateTransGuards&scriptType=guards&stateuid=" + uid_p, function(data) { 
			$("#guardsList>*").remove();
			$("#guardsStateName").html(data.stateid);
			var guardsTB = $("#guardsList");
			for (i in data.transList) {
				var trans = data.transList[i];
				var guardClass = "";
				if (!trans.evalStatus) {
					guardClass = "class='guardFailed'";
				}
				
				
				var transGuard = unescape(trans.transGuard);
				var guardScript = unescape(trans.guardScript).replace(/</g, '&lt;').replace(/>/g, '&gt;');
				var html = "<li " + guardClass + ">" + trans.event + "<br/>";
				if (transGuard!="") {
					html += transGuard;
				}
				if (guardScript!="") {
					html += "<pre>" + guardScript + "</pre>";
				}
				html += "</li>";
				$(html).appendTo(guardsTB);
			}
		});
}


function closeGuardsViewPanel () {
	$("#guardsViewPanel").hide();
	$("#guardsList > *").remove();
}



var viewList = new Array();
// returns false if view already registered
function regView (viewID_p) {
	for (var i in viewList) {
		if (viewList[i]==viewID_p) {
			return false;
		}
	}
	viewList.push(viewID_p);
	return true;
}

function bringViewToFront(viewID_p) {
	var viewZIndexFront = 20002;
	var viewZIndexBack = 20001;
	for (var i in viewList) {
		if (viewList[i]!=viewID_p) {
			$("#" + viewList[i]).css("z-index", viewZIndexBack);
		}
	}
	$("#" + viewID_p).css("z-index", viewZIndexFront);
	return;
}


/*
function bringViewToFront(viewID_p) {
	var viewZIndexFront = 20002;
	var viewZIndexBack = 20001;
	if (viewID_p=="mcaseViewPanel") {
		$("#mcaseViewPanel").css("z-index", viewZIndexFront);
		$("#treeViewPanel").css("z-index", viewZIndexBack);
		$("#guardsViewPanel").css("z-index", viewZIndexBack);
		$("#reqViewPanel").css("z-index", viewZIndexBack);
	}
	else if (viewID_p=="treeViewPanel") {
		$("#mcaseViewPanel").css("z-index", viewZIndexBack);
		$("#treeViewPanel").css("z-index", viewZIndexFront);
		$("#guardsViewPanel").css("z-index", viewZIndexBack);
		$("#reqViewPanel").css("z-index", viewZIndexBack);
	}
	else if (viewID_p=="guardsViewPanel") {
		$("#mcaseViewPanel").css("z-index", viewZIndexBack);
		$("#treeViewPanel").css("z-index", viewZIndexBack);
		$("#guardsViewPanel").css("z-index", viewZIndexFront);
		$("#reqViewPanel").css("z-index", viewZIndexBack);
	}
	else {
		$("#mcaseViewPanel").css("z-index", viewZIndexBack);
		$("#treeViewPanel").css("z-index", viewZIndexBack);
		$("#guardsViewPanel").css("z-index", viewZIndexBack);
		$("#reqViewPanel").css("z-index", viewZIndexFront);
	}
}

*/

function isViewOpen (viewID_p) {
	return $("#" + viewID_p).is(":visible");
}