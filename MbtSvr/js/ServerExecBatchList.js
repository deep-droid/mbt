// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerExecBatch.js

var batchList = null;

var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";

var ctxMenuBindings = {
	'menuID': 'ctxMenu',
	"deleteBatchExec": function(ui) {
		deleteBatchExec('deleteBatchExec', parseInt($(ui).attr("batchID")));
	},
	"deleteBatchOnly": function(ui) {
		deleteBatchOnly('deleteBatchOnly', parseInt($(ui).attr("batchID")));
	},
	onShowMenu: function(ui, menu) {
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      'padding-top': '5px',
      'padding-bottom': '5px',
      backgroundColor: ctxMenuBkgColor,
      width: '85px',
      'border-radius': '5px'
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
function sendAction (action, params, callbackFunc) {
	parentWinObj.sendAction (action, params, callbackFunc);
}

function actionCallback(actionObj_p) {
	return parentWinObj.actionCallback(actionObj_p);
}


$(document).ready(function() {

	initFrame("ExecBatch");
	refresh();
	adjustHeight();
	
	window.onbeforeunload = checkClosing;
});


function checkClosing() {
	if (!inIFrame) parentWinObj.restoreTab("ExecBatch");
}



// called by parent win
function display() {
	refresh();
}

function refresh() {
	parentWinObj.sendActionUtil("license", "cmd=getBatchList", function(data) {
		batchList = data.batchList;
		displayBatchList();
	});
}

function displayBatchList() {
	$("#batchList tbody>*").remove();
	for (var i in batchList) {
		var shadeClass = "";
		if (parentWinObj.isShade(i)) shadeClass = "shade";
		var batch = batchList[i];
        var htmlCode = "<tr class='batch " + shadeClass + "' id='batch_" + i + "' batchID='" + batch.batchID + "'>"
        	+ "<td>" + (parseInt(i)+1) + "</td><td><span class='ctrl'><img src='img/plus.png'/></span>" + batch.desc + " (id:" + batch.batchID + ")</td><td>" + batch.startTS + "</td><td>" + batch.endTS + "</td><td>" + batch.execSvr + "</td>"
        	+ "</tr>";
		for (j in batch.execList) {
			var exec = batch.execList[j];
			var lblPrefix = "";
			if (exec.batchGroup && exec.batchGroup.length>0) {
				lblPrefix = exec.batchGroup + ": ";
			}
			htmlCode += "<tr style='display:none;' class='batch_" + i + " modelExec " + shadeClass + "' execID='" + exec.execID + "' batchID='" + batch.batchID + "'><td>&nbsp;</td><td class='modelName'>"
				+ lblPrefix + exec.modelName + "</td><td>" + exec.startTime + "</td><td>" + exec.endTime + "</td><td>" + exec.svrHost + ":" + exec.svrPort + "</td></tr>";
		}
        $(htmlCode).appendTo("#batchList tbody");
    }

    $("#batchList .ctrl img").click(function() {
    	if ($(this).attr("src").indexOf("plus.png")>0) {
    		$(this).attr("src", "img/minus.png");
    		$("." + $(this).parent().parent().parent().attr("id")).show();
    	}
    	else {
    		$(this).attr("src", "img/plus.png");
    		$("." + $(this).parent().parent().parent().attr("id")).hide();
    	}
    });
    
    
    $("#batchList .batch").contextMenu(ctxMenuBindings.menuID,  {
			bindings: ctxMenuBindings,
			'onShowMenu': ctxMenuBindings.onShowMenu,
	    	'menuStyle': ctxMenuBindings.menuStyle,
	    	'listingStyle': ctxMenuBindings.itemStyle,
	    	'itemHoverStyle': ctxMenuBindings.itemHoverStyle
	    });

	$("#batchList tbody tr").hover(function() { $(this).addClass("hover"); }, function() {$(this).removeClass("hover"); });
	

    $("#batchList tbody tr.modelExec").click(function() { 
    	openModelStat($(this).attr("batchID"), $(this).attr("execID"));
    });
}
    

function menuInit(el) {
// nothing for now
}


function deleteBatchExec(deleteCmd_p, batchIdx_p) {
	parentWinObj.sendActionUtil("license", "cmd=" + deleteCmd_p + "&batchID=" + batchList[batchIdx_p].batchID,
		function(data) {
			if (data==null) {
				setTimeout('parentWinObj.alertDialog("Error deleting batch ' + (batchIdx_p+1) + '")',50 );
				return;
			}
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error deleting batch ' + (batchIdx_p+1) + ': ' + data.error + '")',50 );
				return;
			}
			$("#batch_" + batchIdx_p).remove();
			$(".batch_" + batchIdx_p).remove();
//			setTimeout('parentWinObj.alertDialog("Batch ' + (batchIdx_p+1) + ' deleted.")',50 );
		}
	);
}

function openModelStat(batchID_p, execID_p) {
	parentWinObj.curAppState.execID = execID_p;
	var modelName = null;
	for (var i in batchList) {
		if (batchList[i].batchID==batchID_p) {
			var execList = batchList[i].execList;
			for (var j in execList) {
				if (execList[j].execID==execID_p) {
					modelName = execList[j].modelName;
					break;
				}
			}
			if (modelName!=null) break;
		}
	}
	parentWinObj.curAppState.modelName = modelName;
	parentWinObj.openWebPage("/MbtSvr/app=webrpt&name=View Exec Stats&MODEL=" + modelName + "&EXECID=" + execID_p, "ModelStats");
}


function adjustHeight(topPaneHeight, bottomPaneHeight) {
//	$("#statsMain").css("height", $(window).height() - 50);
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset") {
		reset();
	}
	else if (action_p=="display") {
		display(params_p);
	}
	else if (action_p=="close") {
		// nothing
	}
}