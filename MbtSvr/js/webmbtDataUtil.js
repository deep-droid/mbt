// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtDataUtil.js, utility to access webmbt data structure

function findStateByStateID(stateID) {
	for (i in curAppState.nodeDataList) {
		if (curAppState.nodeDataList[i].typeCode=="state" && curAppState.nodeDataList[i].stateid==stateID) return curAppState.nodeDataList[i];
	}
	return null;
}

function findStateTransByTransID(stateObj, transID) {
	for (i in stateObj.transitions) {
		if (stateObj.transitions[i].event==transID) {
			return stateObj.transitions[i];
		}
	}
	return null;
}

function moveParentNode (actionObj_p) {
	var tempChildNode = curAppState.nodeDataList[actionObj_p.uid];
	var tempOldParentNode = curAppState.nodeDataList[tempChildNode.parentuid];
	var tempNewParentNode = curAppState.nodeDataList[actionObj_p.parentuid];
	
	if (tempChildNode.typeCode=="state") {
		removeChildFromList(tempOldParentNode.childrenStates, tempChildNode.uid);
		tempNewParentNode.childrenStates[tempNewParentNode.childrenStates.length] = tempChildNode;
	}
	else if (tempChildNode.typeCode=="transition") {
		removeChildFromList(tempOldParentNode.transitions, tempChildNode.uid);
		tempNewParentNode.transitions[tempNewParentNode.transitions.length] = tempChildNode;
	}
	tempChildNode.parentuid = actionObj_p.parentuid;
	runWinAction("TreeView", "moveParentNode", {uid: actionObj_p.uid, newParentUID: actionObj_p.parentuid});
	setModelChanged (true);
}


// removes a child node from the list passed in.  The list can be a child states list or a transtion list
function removeChildFromList (parentChildrenList_p, childuid_p) {
	for (childI in parentChildrenList_p) {
		var tempChild = parentChildrenList_p[childI];
		if (tempChild!=undefined && tempChild.uid == childuid_p) {
			parentChildrenList_p[childI] = undefined;
			return;
		}
	}
	return;
}


// adds a new node to the model, note the node is already added to the server.
function addNodes(nodeDataList_p) {
	for (nodeIdx in nodeDataList_p) {
		curAppState.nodeDataList[nodeDataList_p[nodeIdx].uid] = nodeDataList_p[nodeIdx];
		runWinAction("TreeView", "addNode", nodeDataList_p[nodeIdx]);
		runWinAction("Model", "addNode", nodeDataList_p[nodeIdx]);
	}
}


// creates a new node
function newNode (parentUID_p, typeCode_p, save_p, propertyList_p, cbFunc_p) {
	if (curAppState.modelOpen) {
		logMsg("newNode (" + parentUID_p + "," + typeCode_p+")", 3);
		var nodeObj = jQuery.extend({}, curAppState.nodeDataList["template."+typeCode_p]);
		if (propertyList_p) {
			for (var p in propertyList_p) {
				nodeObj[p] = propertyList_p[p];
			}
		}
		nodeObj.parentuid = parentUID_p;
		if (save_p) saveProperty(nodeObj, cbFunc_p);
		else {
			if (typeCode_p=="usecase") {
				editProperty (nodeObj, 600, 280);
			}
			else if (typeCode_p=="box") {
				editBoxProperty (nodeObj);
			}
			else if (typeCode_p=="swimlane") {
				editSwimlaneProperty (nodeObj);
			}
			else {
				editProperty (nodeObj); //, true, false);
			}
		}
		return nodeObj;
	}
}

// create a new step by copying the transition passed in or create steps for all transitions of the state passed in.
function newStep (usecaseNode_p, fromNode_p) {
	if (curAppState.modelOpen) {
		var nodeObj = curAppState.nodeDataList["template.step"];
		nodeObj.parentuid = usecaseNode_p.uid;
		nodeObj.uid=undefined;
		
		if (fromNode_p.typeCode=="state") {
			logMsg("add state to mCase:" + usecaseNode_p.usecasename, 3);
			nodeObj["stateuid"] = fromNode_p.uid;
			nodeObj["transuid"] = undefined;
		}
		else {
			logMsg("add transition to mCase:" + usecaseNode_p.usecasename, 3);
			nodeObj["transuid"] = fromNode_p.uid;
			nodeObj["stateuid"] = fromNode_p.parentuid;
		}
		sendAction ("addNode", toString(nodeObj), function (data) {
			if (actionCallback(data)) return;
			for (i in data.addnodes.nodelist) {
				var node = data.addnodes.nodelist[i];
				var mcase = curAppState.nodeDataList[node.parentuid];
				mcase.steps.push(node);
				curAppState.nodeDataList[node.uid] = node;
			}
			addNodes(data.addnodes.nodelist); 
		});
	}
}

//create a new  node by copying another passed in of another state or test case
function newNodeCopy (parentNode_p, copyNode_p) {
	logMsg("newNodeCopy", 3);
	var nodeObj = curAppState.nodeDataList["template."+copyNode_p.typeCode];

	for (prop in copyNode_p) {
		nodeObj[prop] = copyNode_p[prop];
	}
	nodeObj.parentuid = parentNode_p.uid;
	nodeObj.uid=undefined;
	editPropertyNode(nodeObj); //, false, false);
}

// create a new child node of current selected node
//function newChildNode (typeCode_p) {
//	newNode(window.frames["frameModel"].leftUID, typeCode_p);
//}


function stateIdRenamedAction (stateNode, oldStateId_p) {
	for (var i in curAppState.nodeDataList) {
		var state = curAppState.nodeDataList[i];
		if (state && state.typeCode=="state") {
			for (var j in state.transitions) {
				var trans = state.transitions[j];
				if (trans && trans.target==oldStateId_p) {
					trans.target = stateNode.stateid;
				}
			}
		}
	}
}


function CodeDesc (code_p, desc_p) {
	this.code = code_p;
	this.desc = desc_p;
}

