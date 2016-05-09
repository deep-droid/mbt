// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ModelRepo.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

var modelName = "";

$(document).ready(function() {
	modelName = parent.curAppState.modelName;
	refresh();
});



function refresh() {
	$("#archList tbody tr").remove();
	parent.sendAction("archive", "cmd=modelArchList&modelName=" + modelName, function(archList) {
		if (parent.actionCallback(archList)) {
			parent.closeDialog();
			return;
		}
		var htmlCode = "";
		for (var i in archList) {
			var arch = archList[i];
			htmlCode += "<tr id='arch_" + arch.archID + "'>"
					 + "<td>" + arch.archID + "</td>"
					 + "<td>" + arch.modelVersion + "</td>"
					 + "<td>" + arch.uploadDT + "</td>"
					 + "<td>" + arch.comments + "</td>"
					 + "<td>" + arch.uploadEmail + "</td>"
					 + "</tr>";
		}

		$(htmlCode).appendTo($("#archList tbody"));
		$("#archList").tablesorter();
		

		$("#archList tbody tr").contextMenu(ctxMenuBindings.menuID,  {
				bindings: ctxMenuBindings,
				'onShowMenu': ctxMenuBindings.onShowMenu,
		    	'menuStyle': ctxMenuBindings.menuStyle,
		    	'listingStyle': ctxMenuBindings.itemStyle,
		    	'itemHoverStyle': ctxMenuBindings.itemHoverStyle
		    });
	});

}

var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";
var ctxMenuBindings = {
	'menuID': 'ctxMenu',
	'delArch': function(ui) {
		var archID = $(ui).attr("id").substring(5);
		delModelArch(archID);
	},
	'checkoutArch': function(ui) {
		var archID = $(ui).attr("id").substring(5);
		checkoutArch(archID);
	},
	'onShowMenu': function (e, menu) {
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: ctxMenuBkgColor,
      'padding-top': '5px',
      'padding-bottom': '5px',
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


function checkinModel() {
	var checkinCmt = $("#checkinCmt").val();
	parent.sendAction("archive", "cmd=deployModelList&modelList=" + modelName + "&comment=" + encodeURIComponent(checkinCmt), function(data) {
		parent.actionCallback(data);
		refresh();
	});
	
}

function checkoutArch (archID_p) {
	parent.sendAction("archive", "cmd=checkout&model=" + modelName + "&archID=" + archID_p, function(data) {
		parent.actionCallback(data);
		if (data.errorMsg==undefined) {
			parent.revertModel();
		}
	});
}

function delModelArch (archID_p) {
	parent.sendAction("archive", "cmd=del&model=" + modelName + "&archID=" + archID_p, function(data) {
		parent.actionCallback(data);
		refresh();
	});
}