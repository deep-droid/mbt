// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerModelList.js

var modelList = [];

var modelDetails;

var selectIdx;

var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";

var ctxMenuBindings = {
	'menuID': 'ctxMenu',
	"del": function(ui) {
		delModel($(ui).attr("id"));
	},
	"details": function(ui) {
		showModelDetails($(ui).attr("id"));
	},
	"stats": function(ui) {
		showModelStats($(ui).attr("id"));
	},
	"exec": function(ui) {
		execModel($(ui).attr("id"));
	},
	onShowMenu: function(ui, menu) {
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      'padding-top': '5px',
      'padding-bottom': '5px',
      width: '100px',
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

$(document).ready(function() {

	initFrame("ModelList");
	refresh();
	
	adjustHeight();
	
	window.onbeforeunload = checkClosing;
});

function checkClosing() {
	if (!inIFrame) parentWinObj.restoreTab("ModelList");
}

function display() {
	refresh();
}

function refresh() {
	parentWinObj.sendActionUtil("license", "cmd=getModelList", function(data) {
		modelList = data.modelList;
		displayModelList();
	});
}

function displayModelList() {
	$("#modelList>*").remove();
	$("#modelListHeader>*").remove();
	var htmlCode = "<tr>"
				+ "<th class='rightBar'></th>"
				+ '<th align=left class="rightBar header">Model Name</th>'
				+ '<th class="rightBar header {sorter:"text"}">TO Version</th>'
				+ '<th class="rightBar header {sorter:"text"}">Model Version</th>'
				+ '<th class="rightBar header {sorter:"text"}">Upload Date</th>'
				+ '<th class="rightBar header">Upload Email</th>'
				+ '<th class="rightBar header {sorter:"text"}">Sync Date</th>'
				+ '<th class="header">Cat Codes</th>'
			+ '</tr>';
	$(htmlCode).appendTo($("#modelListHeader"));	
	for (var i in modelList) {
		var model = modelList[i];
		var shadeClass = "";
//		if (parentWinObj.isShade(i)) shadeClass = "class=shade";
        var htmlCode = "<tr id='" + i + "' " + shadeClass + " modelName='" + model.modelName + "'>"
        	+ "<td class='rightBar'>" + (parseInt(i)+1) + "</td>" 
        	+ "<td align=left valign=top class='rightBar'>" + model.modelName + "</td>"
        	+ "<td align=center valign=top class='rightBar'>" + model.arch.toVersion + "</td>" 
        	+ "<td align=center valign=top class='rightBar'>" + model.arch.modelVersion +"</td>"
        	+ "<td align=center valign=top class='rightBar'>" + model.arch.updateDT + "</td>"
        	+ "<td align=center valign=top class='rightBar'>" + model.arch.updateEmail + "</td>"
        	+ "<td align=center valign=top class='rightBar'>" + model.arch.syncDT + "</td>"
        	+ "<td align=center valign=top>" + model.arch.catCodes + "</td>"
        	+ "</tr>";
        $(htmlCode).appendTo("#modelList");
    }
	$("#modelListTB").tablesorter();
	
    
    $("#modelList tr").contextMenu(ctxMenuBindings.menuID,  {
			bindings: ctxMenuBindings,
			'onShowMenu': ctxMenuBindings.onShowMenu,
	    	'menuStyle': ctxMenuBindings.menuStyle,
	    	'listingStyle': ctxMenuBindings.itemStyle,
	    	'itemHoverStyle': ctxMenuBindings.itemHoverStyle
	    });
}



function menuInit(el) {
	$(".ctxMenuItem").show();
//	if ($(el).find(".autoStart").html()!="true") {
//		$(".ctxMenuItem #start").hide();
//	}
}


function showModelDetails(selectIdx_p) {
	var modelName = modelList[selectIdx_p].modelName;
	parentWinObj.sendActionUtil("license", "cmd=getModelArchives&model=" + modelName + "&pwd=",
		function(data) {
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error getting details for model ' + modelName + '")',50 );
			}
			else {
				modelDetails = data;
				setTimeout('displayModelDetails()', 50);
			}
		}
	);
}

function showModelStats(selectIdx_p) {
	var modelName = modelList[selectIdx_p].modelName;
	parentWinObj.curAppState.modelName = modelName;
	parentWinObj.curAppState.execID = -1;
	parentWinObj.openWebPage("/MbtSvr/app=webrpt&name=Model Stats List&MODEL=" + modelName, "ModelStats");
}

function delArch(archID_p) {
//	parentWinObj.confirmDialog("arch.delete.confirm", function() {
		parentWinObj.sendActionUtil("license", "cmd=deleteArch&archID=" + archID_p + "&pwd=", 
			function(data) {
				refresh();
				if (parentWinObj.actionCallback(data)) return;
				setTimeout('parentWinObj.alertDialog("Unable to delete model archive ID ' + archID + '")',50 );
			}
		);
//	});
}


function displayModelDetails() {

	var htmlCode = "<table border=1 id=archListPopup cellspacing=1><tr><th colspan=9 align=center>Archives for Model " + modelDetails.modelName + " <small>(To back out to previous archive, delete latest archive)</small></th></tr>";
	htmlCode += "<tr><th align=center></th><th align=center>ID</th><th align=center>Date</th><th align=center>Model<br/>Ver.</th><th align=center>TO<br/>Ver.</th>" 
			+ "<th align=center>Created<br/>By</th><th align=center>Sync<br/>Date</th><th>Comment</td><th>Cat. Codes</th></tr>";
	
	var delOK = true;
//	if (modelDetails.archList.length<=1) {
//		delOK = false;
//	}
	
	for (i in modelDetails.archList) {
		htmlCode += "<tr><td align=center>";
		if (delOK) {
			htmlCode += "<a class=arch href='javascript:delArch(" + modelDetails.archList[i].archID + ");' title='Deletes this model archive and all model executions associated with it.'>del</a>";
		}
		else {
			htmlCode += "&nbsp;";
		}
		htmlCode += "</td>" 
				+ "<td align=center>" + modelDetails.archList[i].archID + "</td>"
				+ "<td align=center>" + modelDetails.archList[i].updateDT + "</td>"
				+ "<td align=center>" + modelDetails.archList[i].modelVersion + "</td>"
				+ "<td align=center>" + modelDetails.archList[i].toVersion + "</td>"
				+ "<td align=center>" + modelDetails.archList[i].updateEmail + " (" + modelDetails.archList[i].updateHostPort + ", " + modelDetails.archList[i].updateIP + ")</td>"
				+ "<td align=center>" + modelDetails.archList[i].syncDT + "</td>"
				+ "<td align=center>" + unescapeText(modelDetails.archList[i].comment) + "</td>"
				+ "<td align=center>" + modelDetails.archList[i].catCodes + "</td>"
				+ "</tr>";
	}
	htmlCode += "</table><br/>";
	parentWinObj.alertDialog(htmlCode);
}

function unescapeText(text_p) {
	text_p = unescape(text_p);
	text_p = text_p.replace(/\</g, "&lt;");
	text_p = text_p.replace(/\>/g, "&gt;");
	text_p = text_p.replace(/&lt;br&gt;/g, "<br>");
	return text_p;
}

function delModel(modelIdx_p) {
	var modelName = modelList[modelIdx_p].modelName;
	parentWinObj.sendActionUtil("license", "cmd=deleteModel&model=" + modelName + "&pwd=", 
		function(data) {
			refresh();
			if (parentWinObj.actionCallback(data)) return;
			setTimeout('parentWinObj.alertDialog("Unable to delete model ' + modelName + '")',50 );
		}
	);
}

function delModelByName(modelName_p) {
	parentWinObj.sendActionUtil("license", "cmd=deleteModel&model=" + modelName_p + "&pwd=", 
		function(data) {
			parentWinObj.actionCallback(data);
			if (data.error==undefined) {
				$("#modelList tr[modelName='" + modelName_p + "']").remove();
			}
		}
	);
}

function execModel(modelIdx_p) {
	var modelName = modelList[modelIdx_p].modelName;
	parentWinObj.sendActionUtil ("start", "type=rmtExec&model=" + modelName, function(data) {
		parentWinObj.actionCallback(data);
	});
}


function syncModel() {
	parentWinObj.sendActionUtil("license", "cmd=syncModel", function(data) {
		refresh();
		if (parentWinObj.actionCallback(data)) return;
		setTimeout('parentWinObj.alertDialog("Sync failed")',50 );
	});
	
	parentWinObj.alertDialog("sync.submitted");
}

function delModels(modelList_p) {
	for (var i in modelList_p) {
		delModelByName(modelList_p[i]);
	}
	
	parent.alertDialog("Delete " + modelList_p.length + " model(s) request is completed");
}


function adjustHeight(topPaneHeight, bottomPaneHeight) {
//	$("#main").css("height", $(window).height() - 15);
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
	else if (action_p=="syncModel") {
		syncModel();
	}
	else if (action_p=="delArch") {
		delArch(params_p);
	}
	else if (action_p=="delModels") {
		delModels(params_p);
	}
}
