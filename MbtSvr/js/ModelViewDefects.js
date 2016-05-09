// ModelViewDefects.js - copyright 2008-2013 TestOptimal, LLC
var defectsCtxMenuBindings = {
	'menuID': 'ctxMenuDefect',
	'defectDetails': function(ui) {
		var defIdx = $(ui).attr('defIdx');
		showDefectDetails(defIdx);
	},
	'defectReplay': function(ui) {
		var defIdx = $(ui).attr('defIdx');
		replayDefect(defIdx);
	},
	'defectMCase': function(ui) {
		var defIdx = $(ui).attr('defIdx');
		defectToMCase(defIdx);
	},
	'onShowMenu': function (e, menu) {
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

function popupDefectsView () {
	if (regView("defectsViewPanel")) {
		initDefectsView();
	}
	showDefectsLoading();
	
	reloadDefectsList(false);
	
	bringViewToFront("defectsViewPanel");
	$("#defectsViewPanel").show();
}

function showDefectsLoading() {
	$("#defectsList tbody tr").remove();
	
	$("<tr><td colspan=4>Retrieving defectss, please wait...</td><tr>").appendTo("#defectsList tbody");	
}

function initDefectsView() {
	$("#defectsViewPanel").draggable().draggable(
		{  cancel: '#defectsViewCnt', 
		   start: function() { bringViewToFront("defectsViewPanel"); }
		})
		.resizable({ alsoResize: '#defectsViewCnt', minHeight: 75, handles: "all", minWidth: 100 })
		.click(function() {	bringViewToFront("defectsViewPanel");});

	bringViewToFront ("defectsViewPanel");
		
	$("#defectsViewClose").click(function() {
		closeDefectsViewPanel();
	});
	
	$("#refreshDefectsBtn").click(function() {
		reloadDefectsList(true);
	});
}

var defectsList = undefined;
function reloadDefectsList(forceRefresh_p) {
	if (defectsList && !forceRefresh_p) {
		showDefectsList();
	}
	else {
		parent.sendAction("defect", "cmd=defectsList", function(data) {
			if (data.error) {
				parent.alertDialog(data.error);
				return;
			}
			else {
				defectsList = data;
				showDefectsList();
			}
		});
	}
}

function refreshDefectsBtn() {
	refreshDefectsList(true);
}

function showDefectsList() {	
	$("#defectsList tbody tr").remove();
	
	var htmlCode = "";	
	for (var i in defectsList) {
		var defect = defectsList[i];
		i = parseInt(i);
		htmlCode += "<tr defIdx='" + i + "'>"
				 + "<td class='defect'>" + (i+1) + "</td>"
				 + "<td class='assertID'>" + defect.assertID + "</td>"
				 + "<td>" + defect.defectID + "</td>"
				 + "<td>" + defect.reqTag + "</td>"
				 + "</tr>";
	}
	$(htmlCode).appendTo("#defectsList tbody");
	
	$("#defectsList tbody tr").contextMenu(defectsCtxMenuBindings.menuID,  {
		bindings: defectsCtxMenuBindings,
		'onShowMenu': defectsCtxMenuBindings.onShowMenu,
    	'menuStyle': defectsCtxMenuBindings.menuStyle,
    	'listingStyle': defectsCtxMenuBindings.itemStyle,
    	'itemHoverStyle': defectsCtxMenuBindings.itemHoverStyle
	})
/*	
	.dblclick(function(e) {
		e.stopPropagation();
		e.preventDefault();
		var defIdx = $(this).attr('defIdx');
		showDefectDetails(defIdx);
    })
*/
    .click(function() {
		var defectIdx = $(this).attr('defIdx');
		highlightDefectPath(defectIdx);
	});	

}

function showDefectDetails (defIdx_p) {
	var defect = defectsList[defIdx_p];
	if (defect) {
		displayDefectDetails(defect);
	}
	else {
		parent.alertDialog("Defect not found: " + defIdx_p);
	}
}

function replayDefect (defIdx_p) {
	var defect = defectsList[defIdx_p];
	if (defect) {
		parent.setMode("modeMark", true);
		JSDiagram.markMode = true;
		
		parent.curAppState.lastMarkSeq = "MarkedOnlySerial";
		highlightDefectPath(defIdx_p);
		parent.sendAction("defect", "cmd=defectReplay&defectIdx=" + defIdx_p, function(data) {
			if (data.error) {
				parent.alertDialog(data.error);
				return;
			}
			else {
				parent.playButton();
				parent.setMode("modeMark", true);
				JSDiagram.markMode = true;
			}
		});
	}
	else {
		parent.alertDialog("Defect not found: " + defIdx_p);
	}
}

function displayDefectDetails (defect_p) {
	var htmlCode = "<table id='defectDetails'>"
	    + "<tr class=header><th colspan=4>Defect Details</th></tr>"
	  	+ "<tr class='hoverHiLite'><th align=left>Assert ID:</th><td>" + defect_p.assertID + "</td><th align=left>Status:</td><td>" + defect_p.status + "</td></tr>"
        + "<tr class='hoverHiLite'><th align=left>Defect ID:</th><td>" + defect_p.defectID + "</td><th align=left>Requirement:</td><td>" + defect_p.reqTag + "</td></tr>"
        + "<tr class='hoverHiLite'><th align=left valign=top>Description:</th><td cospan=3>" + parent.toDecode(defect_p.desc) + "</td></tr>"
        + "<tr class='hoverHiLite'><th align=left valign=top>trace:</th><td>" + defect_p.trace.join("<br/>") + "</td></tr>"
        + "<tr class='hoverHiLite'><th align=left valign=top>More Info:</th><td colspan=3>" + defect_p.infoList.join("<br/>") + "</td></tr>"
        + "<tr class='hoverHiLite'><th align=left valign=top>Change Log:</th><td colspan=3>" + defect_p.changeLog.join("<br/>") + "</td></tr>"
        + "</table>";
	parent.alertDialog(htmlCode);
}

function defectToMCase (defIdx_p) {
	var defect = defectsList[defIdx_p];
	parent.alertDialog("defect to ALM not yet implemented yet");
}


function highlightDefectPath(defIdx_p) {
	var defect = defectsList[defIdx_p];
	if (defect) {
		runPasteTrace(defect.trace.join("\n"));
	}
}


function closeDefectsViewPanel () {
	$("#defectsViewPanel").hide();
}


