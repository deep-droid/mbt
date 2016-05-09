// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerList.js

var svrList = [];
var svrLicExcept = [];

var svrDetail;
var svrUsageDetail;

var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";

var svrCtxMenuBindings = {
	'menuID': 'ctxMenu',
	'ping': function(ui) {
		pingSvr($(ui).attr("id"));
	},
	'svrLog': function(ui) {
		showSvrLog($(ui).attr("id"));
	},
	"add": function(ui) {
		parentWinObj.addSvr();
	},
	
	"del": function(ui) {
		deleteSvr($(ui).attr("id"));
	},
	"start": function(ui) {
		startSvr($(ui).attr("id"));
	},
	"stop": function(ui) {
		shutdownSvr($(ui).attr("id"));
	},
	"details": function(ui) {
		showSvrDetails($(ui).attr("id"));
	},
	"cmd": function(ui) {
		editStartCmd($(ui).attr("id"));
	},
	"editCat": function(ui) {
		editCatCode($(ui).attr("id"), $(ui).find(".catCode").html());
	},
	"editEdition": function(ui) {
		editEdition($(ui).attr("id"), $(ui).find(".edition").html());
	},
	"interrupt": function(ui) {
		interruptSvr($(ui).attr("id"));
	},
	"svrIDE": function(ui) {
		svrIDE($(ui).attr("id"));
	},
	"renewLic": function(ui) {
		renewLic($(ui).attr("id"));
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

	initFrame("ServerList");
	refresh();
	
	adjustHeight();
	
	window.onbeforeunload = checkClosing;
});


function checkClosing() {
	if (!inIFrame) parentWinObj.restoreTab("ServerList");
}

function display() {
	refresh();
}

function refresh() {
	parentWinObj.sendActionUtil("license", "cmd=getSvrList", function(data) {
		svrList = data.svrList;
		svrLicExcept = data.svrLicExcept;
		displaySvrList();
	});
}

function displaySvrList() {
	$("#svrList>*").remove();
	for (var i in svrList) {
		var shadeClass = "";
		if (parentWinObj.isShade(i)) shadeClass = " shade";

		var svr = svrList[i];
		var hostPort = svr.host + ":" + svr.port;
		var svrClass = "";
		if (svr.autoStart=="true") {
			svrClass = "remoteStart";
		}
		
		var syncMsg = "";
		if (svr.syncMsg && svr.syncMsg.length>5) {
			var i2 = svr.syncMsg.indexOf("<br/>");
			if (i2>0) {
				syncMsg = svr.syncMsg.substring (0, i2);
			}
		}
		
		var svrLicAuth = svr.authTS;
		if (svrLicExcept[hostPort.toLowerCase()]) {
			svrLicAuth = svrLicExcept[hostPort.toLowerCase()];
		}
        var htmlCode = "<tr id='" + i + "' class='" + svrClass + " " + shadeClass + "'><td align=left valign=top>" + hostPort + "</td>"
        	+ "<td align=left valign=top>" + svr.name + "</td>" 
        	+ "<td align=center class=edition valign=top>" + svr.edition + "</td>" 
        	+ "<td align=center class=catCode valign=top>" + svr.catCodes +"</td>"
        	+ "<td align=center valign=top>" + svr.autoStart + "</td>"
        	+ "<td align=center valign=top  class='" + svr.status + "'>" + svr.status + "</td>"
        	+ "<td align=center valign=top>" + svrLicAuth + "</td>"
        	+ "<td align=center valign=top>" + svr.lastTS +"</td>"
        	+ "<td align=center valign=top>" + svr.sessions + " / " + svr.sessionLimit + "</td>"
        	+ "<td align=center valign=top>" + svr.threads + " / " + svr.threadLimit + "</td>"
        	+ "<td align=center valign=top>" + svr.syncTS + "</td>"
        	+ "<td align=left valign=top>" + syncMsg + "</td>";
        
        htmlCode += "</tr>";

        $(htmlCode).appendTo("#svrList");
    }
    
    $("#svrList tr").contextMenu(svrCtxMenuBindings.menuID,  {
			bindings: svrCtxMenuBindings,
			'onShowMenu': svrCtxMenuBindings.onShowMenu,
	    	'menuStyle': svrCtxMenuBindings.menuStyle,
	    	'listingStyle': svrCtxMenuBindings.itemStyle,
	    	'itemHoverStyle': svrCtxMenuBindings.itemHoverStyle
	    });
}



function menuInit(el) {
	$(".ctxMenuItem").show();
	if (!$(el).hasClass("remoteStart")) {
		$("#start").hide();
	}
}


function showSvrDetails(svrIdx_p) {
	var hostPort = svrList[svrIdx_p].host + ":" + svrList[svrIdx_p].port;
	parentWinObj.sendActionUtil("license", "cmd=getDetail&host=" + svrList[svrIdx_p].host + "&port=" + svrList[svrIdx_p].port + "&pwd=",
		function(data) {
			if (data==null) {
				setTimeout('parentWinObj.alertDialog("Error contacting ' + hostPort + '")',50 );
				return;
			}
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error getting details from ' + hostPort + '")',50 );
			}
			else {
				svrDetail = data;
				setTimeout('displaySvrDetails(' + svrIdx_p + ')', 50);
			}
		}
	);
}


function getUsageUrl(svrIdx_p) {
	var hostPort = svrList[svrIdx_p].host + ":" + svrList[svrIdx_p].port;
	parentWinObj.sendActionUtil("license", "cmd=getOneSvrUsage&host=" + svrList[svrIdx_p].host + "&port=" + svrList[svrIdx_p].port + "&pwd=",
		function(data) {
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error getting server usage stats from ' + hostPort + '")',50 );
			}
			else {
				svrUsageDetail = data;
				setTimeout('displaySvrUsage()', 50);
			}
		}
	);
}


function displaySvrDetails(svrIdx_p) {
	var htmlCode = "<table border=1><tr><th colspan=2>TestOptimal Server at " + svrDetail.hostInfo.host + ":" + svrDetail.hostInfo.port + " <small>(" + svrDetail.hostInfo.ipAddress + ")</small></th></tr>";
	htmlCode += "<tr><td>Memory</td><td>" + svrDetail.memUsed + " (max: " + svrDetail.memMax + ")</td></tr>";
	htmlCode += "<tr><td>Threads</td><td>" + svrDetail.threads + " (limit: " + svrDetail.threadsLimit + ")</td></tr>";
	htmlCode += "<tr><td>Edition</td><td>" + svrDetail.hostInfo.edition + "</td></tr>";
	htmlCode += "<tr><td>Version</td><td>" + svrDetail.hostInfo.version + "</td></tr>";
	htmlCode += "<tr><td>License Status</td><td>" + svrDetail.hostInfo.licenseStatus + "</td></tr>";
	if (svrDetail.hostInfo.alert!="") {
		htmlCode += "<tr><td>Alert</td><td>" + svrDetail.hostInfo.alert + "</td></tr>";
	}
	htmlCode += "<tr><td valign=top>Model Sync</td><td>" + svrList[svrIdx_p].syncMsg + "</td></tr>";
	htmlCode += "<tr><td>Date/Time Started</td><td>" + svrDetail.hostInfo.startDT + "</td></tr>";

	htmlCode += "<tr><td valign=top>Models</td><td><ol>";
	svrDetail.modelList.sort();
	for (var i in svrDetail.modelList) {
		htmlCode += "<li>" + svrDetail.modelList[i] + "</li>";
	}
	htmlCode += "</ol></td></tr>";
	
	htmlCode += "<tr><td valign=top>Sessions</td><td><ol>";
	for (var i in svrDetail.sessionList) {
		var sess = svrDetail.sessionList[i];
		htmlCode += "<li>sessionID: " + sess.sessionID + "<br/>"
			     + "model: " + sess.model + "<br/>"
			     + "mode: " + sess.mode + "<br/>"
			     + "browser: " + sess.browser + "<br/>"
			     + "progress: " + sess.progress + "<br/>"
			     + "threads: " + sess.threads + "<br/>"
			     + "status: " + sess.status + "<br/>"
			     + "start time: " + sess.startTime + "<br/>"
			     + "end time: " + sess.endTime + "<br/>";
			     + "elapse: " + sess.elapseTime + "</li>"
	}
	htmlCode += "</ol></td></tr>";

	htmlCode += "</table>";
	parentWinObj.alertDialog(htmlCode);

}


function shutdownSvr(svrIdx_p) {
	var hostPort = svrList[svrIdx_p].host + ":" + svrList[svrIdx_p].port;
	parentWinObj.sendActionUtil("license", "cmd=shutdownSvr&host=" + svrList[svrIdx_p].host + "&port=" + svrList[svrIdx_p].port + "&pwd=", 
		function(data) {
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error sending shutdown command to ' + hostPort + '")',50 );
			}
			else {
				setTimeout('parentWinObj.alertDialog("Shutdown request sent to ' + hostPort + '")', 50);
			}
			refresh();
		}
	);
}


function startSvr(svrIdx_p) {
	var hostPort = svrList[svrIdx_p].host + ":" + svrList[svrIdx_p].port;
	parentWinObj.sendActionUtil("license", "cmd=startSvr&host=" + svrList[svrIdx_p].host + "&port=" + svrList[svrIdx_p].port + "&pwd=", 
		function(data) {
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("Error starting server on ' + hostPort + '")',50 );
			}
			else {
				setTimeout('parentWinObj.alertDialog("Started server on ' + hostPort + '")', 50);
			}
			refresh();
		}
	);
	
	parentWinObj.alertDialog("Starting server " + hostPort + " ...");
}

function pingSvr(svrIdx_p) {
	var hostPort = svrList[svrIdx_p].host + ":" + svrList[svrIdx_p].port;
	parentWinObj.sendActionUtil("license", "cmd=pingSvr&host=" + svrList[svrIdx_p].host + "&port=" + svrList[svrIdx_p].port + "&pwd=", 
		function(data) {
			if (data.error) {
				setTimeout('parentWinObj.alertDialog("TestOptimal server instance ' + hostPort + ' did not respond to ping")',50 );
			}
			else {
				setTimeout('parentWinObj.alertDialog("Ping ' + hostPort + ': ok")',50);
			}
			refresh();
		}
	);
}

function addSvr(hostName, portNum, catCodes, edition, startCmd) {
	parentWinObj.sendActionUtil("license", "cmd=addSvr&host=" + hostName + "&port=" + portNum + "&catCodes=" + catCodes + "&edition=" + edition + "&startCmd=" + parentWinObj.encodeURIComponent(startCmd), function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}



function deleteSvr(svrIdx) {
	parentWinObj.sendActionUtil("license", "cmd=deleteSvr&host=" + svrList[svrIdx].host + "&port=" + svrList[svrIdx].port, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}


function interruptSvr(svrIdx) {
	parentWinObj.sendActionUtil("license", "cmd=interruptSvr&host=" + svrList[svrIdx].host + "&port=" + svrList[svrIdx].port, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}

function svrIDE(svrIdx) {
	window.open("http://" + svrList[svrIdx].host + ":" + svrList[svrIdx].port);
}

function editStartCmd(svrIdx) {
	parentWinObj.postActionUtil("license", "cmd=getStartCmd&host=" + svrList[svrIdx].host + "&port=" + svrList[svrIdx].port, function(data) {	
		var startCmd = data;
		if (startCmd==undefined || startCmd==null || startCmd == "null") startCmd = "";
		parentWinObj.promptDialog("Edit Svr StartCmd", startCmd, function () {
			var newCmd = parentWinObj.getPromptVal();
			setTimeout("saveStartCmd('" + svrList[svrIdx].host + "'," + svrList[svrIdx].port + ",'" + parentWinObj.encodeURIComponent(newCmd) + "')", 20);
		});
	});
}


function editCatCode(svrIdx, catCode) {
	if (catCode==undefined || catCode==null || catCode == "null") catCode = "";
	parentWinObj.promptDialog("Edit Server Category Codes (separate by comma)", catCode, function () {
		var newCatCode = parentWinObj.getPromptVal();
		setTimeout("saveCatCode('" + svrList[svrIdx].host + "'," + svrList[svrIdx].port + ",'" + newCatCode + "')", 20);
	});
}


function editEdition(svrIdx, edition) {
	if (edition==undefined || edition==null || edition == "null") edition = "";
	parentWinObj.promptDialog("Edit Server Edition", edition, function () {
		var newEdition = parentWinObj.getPromptVal();
		setTimeout("saveEdition('" + svrList[svrIdx].host + "'," + svrList[svrIdx].port + ",'" + newEdition + "')", 20);
	});
}


function saveCatCode (hostName, port, newCatCode) {
	parentWinObj.sendActionUtil("license", "cmd=setSvrCatCode&host=" + hostName + "&port=" + port + "&catCode=" + newCatCode, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}

function saveEdition (hostName, port, newEdition) {
	parentWinObj.sendActionUtil("license", "cmd=setSvrEdition&host=" + hostName + "&port=" + port + "&edition=" + newEdition, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}


function saveStartCmd (hostName, port, startCmd) {
	parentWinObj.sendActionUtil("license", "cmd=setStartCmd&host=" + hostName + "&port=" + port + "&startCmd=" + parentWinObj.encodeURIComponent(startCmd), function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
		}
	});
}


function showSvrLog(svrIdx) {
	parentWinObj.openWebPage("http://" + svrList[svrIdx].host + ":" + svrList[svrIdx].port + "/MbtSvr/log/webmbtServer.log", "RUNTIME_LOG");
}


function startAllSvr() {
	parentWinObj.sendActionUtil("license", "cmd=startAllSvr", function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
			parentWinObj.alertDialog("Start all servers completed");
		}
	});
	parentWinObj.alertDialog("Starting all servers ... ");
}

function stopAllSvr() {
	parentWinObj.sendActionUtil("license", "cmd=stopAllSvr", function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
			refresh();
		}
		else {
			refresh();
			parentWinObj.alertDialog("Stop all servers completed");
		}
	});
}

function renewLic(svrIdx) {
	parentWinObj.sendActionUtil("license", "cmd=renewLic&host=" + svrList[svrIdx].host + "&port=" + svrList[svrIdx].port, function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		refresh();
	});
}

function renewLicAllSvr() {
	parentWinObj.sendActionUtil("license", "cmd=renewLicAll", function(data) {
		if (data.error) {
			parentWinObj.alertDialog(data.error);
		}
		refresh();
	});
}

function expSvrList () {		
	window.open("app=websvc&action=license&cmd=expSvrList", "expSvrList");
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
	else if (action_p=="renewLicAllSvr") {
		renewLicAllSvr();
	}
	else if (action_p=="startAllSvr") {
		startAllSvr();
	}
	else if (action_p=="stopAllSvr") {
		stopAllSvr();
	}
	else if (action_p=="expSvrList") {
		expSvrList();
	}
	else if (action_p=="addSvr") {
		addSvr (params_p.hostName, params_p.portNum, params_p.catCodes, params_p.edition, params_p.startCmd);
	}
}