// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerLicenseList.js

var licList = [];


var ctxMenuColor = "#333333";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";

var ctxMenuBindings = {
	'menuID': 'ctxMenu',
	"addLic": function(ui) {
		parentWinObj.addLic();
	},
	"deleteLic": function(ui) {
		deleteLic($(ui).find(".name").html());
	},
	"renameLic": function(ui) {
		renameLic($(ui).find(".name").html());
	},
	"licDetails": function(ui) {
		showLicDetails($(ui).find(".name").html());
	},
	"editCatCode": function(ui) {
		editCatCode($(ui).find(".name").html(), $(ui).find(".cat").html());
	},
	"shutdownSvr": function(ui) {
		shutdownServer($(ui).find(".name").html());
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
      width: '120px',
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

	initFrame("LicenseKeys");
	refresh();
	adjustHeight();
	
	window.onbeforeunload = checkClosing;
});

function checkClosing() {
	if (!inIFrame) parentWinObj.restoreTab("LicenseKeys");
}


function display() {
	refresh();
}

function refresh() {
	parentWinObj.sendActionUtil("license", "cmd=getLicList", function(data) {
		licList = data.licList;
		displayLicList();
	});
}


function displayLicList() {
	$("#licList>*").remove();
	for (var i in licList) {
		var lic = licList[i];
		var svrStatusClass = "";
		var svrStatusTitle = "";
		var svrLimitClass = " class=sessLimit";
		if (lic.isExpired) {
			svrStatusClass=' class=expired';
			svrStatusTitle = ' title="License has expired."';
		}
		else if (lic.instanceCount >= lic.instanceLimit) {
			svrLimitClass = ' class="sessLimit licExhausted"';
			svrStatusTitle = ' title="All license instances have been used."';
		}
		else if (lic.catCode!='') {
			svrStatusTitle = ' title="For Runtime servers assigned category code ' + lic.catCode + '"';
		}
		
        var htmlCode = "<tr" + svrStatusClass + svrStatusTitle + "><td class=name align=left>" + lic.name + "</td>"
        	+ "<td align=center class=cat>" + lic.catCode + "</td>" 
        	+ "<td align=center class=edition>" + lic.edition + "</td>" 
        	+ "<td align=center class=sess>" + lic.sessionLimit + "</td><td align=center>" + lic.threadLimit +"</td>"
        	+ "<td align=center " + svrLimitClass + ">" + lic.instanceLimit + "</td><td align=center>" + lic.instanceCount + "</td>"
        	+ "<td align=center class=licStatus>" + lic.licStatus + "</td>"
        	+ "<td align=center class=expireDate>" + lic.expireDate + "</td"
        	+ "</tr>";
        htmlCode += "</td></tr>";
        $(htmlCode).appendTo("#licList");
    }
    
    $("#licList tr").contextMenu(ctxMenuBindings.menuID,  {
			bindings: ctxMenuBindings,
			'onShowMenu': ctxMenuBindings.onShowMenu,
	    	'menuStyle': ctxMenuBindings.menuStyle,
	    	'listingStyle': ctxMenuBindings.itemStyle,
	    	'itemHoverStyle': ctxMenuBindings.itemHoverStyle
	    });

}



function menuInit() {
	$(".ctxMenuItem").show();
}


function addLic(licName, licEmail, licKey, catCode) {
	parentWinObj.sendActionUtil("license", "cmd=addLic&name=" + licName + "&licEmail=" + licEmail 
		+ "&licKey=" + parentWinObj.encodeURIComponent(licKey) + "&catCode=" + catCode, function(data) {
		if (data.error) {
			setTimeout("parentWinObj.alertDialog('" + data.error +"')", 1000);
		}
		refresh();
	});
}


function renameLic(oldLicName) {
	parentWinObj.promptDialog("Enter new license name for " + oldLicName + ":", "", function() {
		var newLicName = parentWinObj.getPromptVal();
		if (newLicName=="" || newLicName==oldLicName) {
			return;
		}
		setTimeout("renameLicAction('" + oldLicName + "','" + newLicName + "')", 50);
	});
}

function renameLicAction(oldLicName, newLicName) {		
	parentWinObj.sendActionUtil("license", "cmd=renameLic&oldName=" + oldLicName + "&newName=" + newLicName, 
	function(data) {
		if (data.error) {
			setTimeout('parentWinObj.alertDialog("' + data.error + '")',20);
		}
		else {
			refresh();
		}
	});
}

function editCatCode(licName, oldCatCode) {
	parentWinObj.promptDialog("Edit category code", oldCatCode, function() {
		var newCatCode = parentWinObj.getPromptVal();
		setTimeout("saveCatCode('" + licName + "','" + newCatCode + "')", 50);
	});
}

function saveCatCode(licName, catCode) {		
	parentWinObj.sendActionUtil("license", "cmd=setLicCatCode&licName=" + licName + "&catCode=" + catCode,
		function(data) {
		if (data.error) {
			setTimeout('parentWinObj.alertDialog("' + data.error + '")',20);
		}
		else {
			refresh();
		}
	});
}

function deleteLic (licName) {		
	parentWinObj.sendActionUtil("license", "cmd=deleteLic&name=" + licName, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		else {
			refresh();
		}
	});
}

function shutdownServer (licName) {
	parentWinObj.sendActionUtil("license", "cmd=shutdownSvrByLic&name=" + licName, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		else {
			refresh();
			var msg = data;
			if (data.alert) {
				msg = data.alert;
			}
			parentWiObj.alertDialg(data.alert);
		}
	});
}


function showLicDetails(licName) {
	var licObj = null;
	for (i in licList) {
		if (licList[i].name==licName) {
			licObj = licList[i];
			break;
		}
	}
	
	if (licObj==null) {
		return;
	}

	var htmlCode = "<table><tr><td colspan='2'  style='font-weight:bold;border-bottom: 1px solid #333333'>License Details for " + licObj.name + "</td></tr>" 
			     + "<tr><td>Name:</td><td>" + licObj.name + "</td></tr>" 
			     + "<tr><td>Email:</td><td>" + licObj.email + "</td></tr>" 
			     + "<tr><td>Edition:</td><td>" + licObj.edition + "</td></tr>" 
			     + "<tr><td>Instances:</td><td>" + licObj.instanceLimit + "</td></tr>" 
			     + "<tr><td>Sessions:</td><td>" + licObj.sessionLimit + "</td></tr>" 
			     + "<tr><td>Threads:</td><td>" + licObj.threadLimit + "</td></tr>" 
			     + "<tr><td>Category Code(s):</td><td>" + licObj.catCode + "</td></tr>" 
			     + "<tr><td>License Status:</td><td>" + licObj.licStatus + "</td></tr>" 
			     + "<tr><td>Expiration:</td><td>" + licObj.expireDate + "</td></tr>" 
			     + "<tr><td valign='top'>Plugin List:</td><td>" + licObj.authPluginList.replace(/,/g, "<br/>") + "</td></tr>" 
			     + "</table></table>";
	parentWinObj.alertDialog(htmlCode);
}

function expLicList () {		
	window.open("app=websvc&action=license&cmd=expLicList", "expLicList");
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
	else if (action_p=="refresh") {
		refresh();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="expLicList") {
		expLicList();
	}
	else if (action_p=="addLic") {
	 	addLic (params_p.licName, params_p.licEmail, params_p.licKey, params_p.catCode);
	}
}
