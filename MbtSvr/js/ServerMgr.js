// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// ServerMgr.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	handleJsError(errMsg, fileName, lineNum);
}


function handleJsError (errMsg, fileName, lineNum) {
	try {
		logMsg ("errMsg: " + errMsg + "; fileName:" + fileName + "; lineNum: " + lineNum, 1);
	}
	catch (err) {
		//
	}
}

var edition = "Community";
var config;

// for opening execStats only
var curAppState = {
	execID: -1,
	modelOpen: true,
	modelName: null
}


$.ajaxSetup({
	"error":function(xhr,status,error) { 
       alert(status + ":" + error);
     }
}); 
   
function actionCallback(actionObj_p) {
	if (actionObj_p.error) {
		var errMsg = actionObj_p.error.replace("java.lang.Exception: ", "");
		errMsg = translateMsg(errMsg);
		setTimeout('alertDialog("Error: ' + errMsg + '")', 150);
		return true;
	}
	
	if (actionObj_p.alertMessage) {
		if (actionObj_p.alertMessage!="ok") {
			alertDialog (actionObj_p.alertMessage);
		}
		return true;
	}
	return false;
}


function sendAction (action, params, callbackFunc) {
	sendActionUtil (action, params, callbackFunc);
}

function updAppHeaderInfo() {
	var editionTitle = "TestOptimal " + config.TestOptimalVersion;
	var editionProdLevel = config.realprodlevel; //prodlevel;
	if (editionProdLevel=="Expired") {
		editionTitle += ", Date Expired: " + config.expirationdate;
		$("#edition").addClass("expired");
	}
	$("#edition").html(editionProdLevel).attr("title", editionTitle);
	$("#toVer").text("ver. " + config.TestOptimalVersion);
}

function getConfigProperty(name_p) {
	return config[name_p];
}

$(document).ready(function(){
	$("#headerSection").dblclick(function() {
		window.open("ServerMgr.html", 'TestOptimal','fullscreen=yes');
		window.location = 'blank.html';
	});
//	window.fullScreen = true; // only works in FF
	

	tabGroupList = [
		{ tabGroup: "svrMgr", detachable: true, 
			tabList: ["ServerList", "ServerStats", "LicenseKeys", "ModelList", "ExecBatch"]}
	];

	initTabLayoutFromCookie();

	window.onresize = windowResizedNormal; 
	windowResizedNormal();
	jQuery().zoom(this.windowResizedNormal);
	window.onbeforeunload = checkClosing;
	
    $('a[rel*=facebox]').facebox({
        loading_image : '/js/facebox/loading.gif',
        close_image   : '/js/facebox/closelabel.gif'
    }) 

	sendActionUtil ("config", "cmd=getConfigJson", function(data) {
		config = data.config;
		edition = config.prodlevel;
		setTimeout (updAppHeaderInfo, 1000);
		addTabGroup("svrMgr");
		if (!data.config.licenseStatus) {
			setLicense();
		}
	});

	$(document).bind('reveal.facebox', function() {
	    var height = $(window).height() - 150;
	    if (height < 50) return;
	    
	    if ($('.alertTable').length<=0) return;
	    
	    var tableHeight = $('.alertTable').height();
	    if (tableHeight > height) {
		    $('#facebox .content').css('height', height + 'px');
		}
		else {
		    $('#facebox .content').css('height', tableHeight + 'px');
		}
	    $('#facebox').css('top', ($(window).scrollTop() + 50) + 'px');
	});

});


function checkClosing() {
	closeAllWin();
}

function shutdownServer() {
	confirmDialog("Do you wish to shut down TestOptimal server?", function () {
		sendAction("ping", "cmd=shutdown", function (data) {
			alertDialog("Shutdown request submitted");
		});
	});
}


function checkUpdates() {
	postActionUtil("config", "cmd=checkUpdates", function(data) {
		if (data.indexOf('{"error":')==0) {
			var msg = data.substring(10,data.length-2);
			alertDialog(msg);
		}
		else alertDialog(data);
	});
}

function validateLicenses () {
	postActionUtil("license", "cmd=valAllLic", function(data) {
		if (data.indexOf('{"error":')==0) {
			var msg = data.substring(10,data.length-2);
			alertDialog(msg);
		}
		else alertDialog(data);
		runWinAction("LicenseKeys", "refresh");
	});
	alertDialog("Submitted request to validate all licenses");
}

function aboutWebMBT() {
	sendAction("config","cmd=about", function(data) {
		if (actionCallback(data)) return;
		alertDialog(data.about);
	});
}


function editConfig() {
	window.open("webmbtMain.html", "TestOptimal", "status=yes, width=600,height=300,toolbar=no,menubar=no,location=no,resizable=yes");

}


function setLicense() {
	$('#shareDialog iframe').attr("src","ManageLicense.html");
	$('#shareDialog').dialog(
		{	title:  "Manage License",
			width: 500,
			height: 400,
			position: [($(window).width()-500)/2, 75],
			modal: true,
			close: function(ev, ui) {
				 $("#opaqDiv").hide();
	            $(this).dialog('destroy');
	        },
			closeOnEscape: true,
			buttons: { }
		})
		.dialog("open");
}

function refresh() {
	refreshTabGroup("svrMgr");
}

function addLic() {
	var htmlCode = "<table id='addLicSection'>"
			+ "<tr><td>License Name:</td><td><input type='text' class='licName' value='' size='40'></input></td>"
			+ "</tr>"
			+ "<tr><td>License Email:</td><td><input type='text' class='licEmail' value='' size='40'></input></td>"
			+ "</tr>"
			+ "<tr><td>License Key:</td><td><input type='text' class='licKey' value='' size='80'></input></td>"
			+ "</tr>"
			+ "<tr><td>Category Code:</td><td><input type='text' class='catCode' value='' size='80'></input></td>"
			+ "</tr>"
			+ "</table>";
	plainDialog(htmlCode, addLicCheck);
}

function addLicCheck() {
	var licName = $("#addLicSection .licName").val();
	if (licName=="") {
		alertDialog("License Name required.");
		return;
	}
	
	var licKey = $("#addLicSection .licKey").val();
	if (licKey=="") {
		alertDialog("License Key required.");
		return;
	}

	var licEmail = $("#addLicSection .licEmail").val();
	if (licEmail=="") {
		alertDialog("License Email required.");
		return;
	}

	var catCode = $("#addLicSection .catCode").val();
	selectTab("LicenseKeys");
	
	runWinAction ("LicenseKeys", "addLic", {licName: licName, licEmail: licEmail, licKey: licKey, catCode: catCode});
	$.facebox.close();	
}

function addSvr() {
	var htmlCode = "<table id='addSvrSection'>"
			+ "<tr><td nowrap>Server Host:</td><td><input type='text' class='hostName' value='' size='40'></input></td>"
			+ "</tr>"
			+ "<tr><td nowrap>Server Port:</td><td><input type='text' class='portNum' value='' size='10'></input></td>"
			+ "</tr>"
			+ "<tr><td nowrap>Edition:</td><td><input type='text' class='edition' value='' size='10'></input></td>"
			+ "</tr>"
			+ "<tr><td nowrap>Category Codes:</td><td><input type='text' class='catCodes' value='' size='100'></input></td>"
			+ "</tr>"
			+ "<tr><td nowrap>Start Command:</td><td><input type='text' class='startCmd' value='' size='100'></input></td>"
			+ "</tr>"
			+ "</table>";
	plainDialog(htmlCode, addSvrCheck);

}


function addSvrCheck() {
	var hostName = $("#addSvrSection .hostName").val();
	if (hostName=="") {
		alertDialog("HostName required.");
		return;
	}
	
	var portNum = $("#addSvrSection .portNum").val();
	if (portNum=="") {
		alertDialog("Port# required.");
		return;
	}

	var edition = $("#addSvrSection .edition").val();
	var startCmd = $("#addSvrSection .startCmd").val();
	var catCodes = $("#addSvrSection .catCodes").val();
	$.facebox.close();
	
	runWinAction("ServerList", "addSvr", {hostName: hostName, portNum: portNum, catCodes: catCodes, edition: edition, startCmd: startCmd});
	selectTab("ServerList");
}


function compactDB() {
	postActionUtil("ping", "cmd=compactDB", function(data) {
		alertDialog("Compact DB request sent");
	});
}

function startAllSvr() {
	runWinAction("ServerList", "startAllSvr");
	selectTab("ServerList");
}

function stopAllSvr() {
	runWinAction("ServerList", "stopAllSvr");
}

function renewLicAllSvr() {
	runWinAction("ServerList", "renewLicAllSvr");
}

function syncModel() {
	runWinAction("ModelList", "syncModel");
}

function delArch(archID_p) {
	$.facebox.close();
	runWinAction("ModelList", "delArch", archID_p);
}

function actionCallback(actionObj_p) {
	if (actionObj_p.error) {
		var errMsg = actionObj_p.error.replace("java.lang.Exception: ", "");
		errMsg = translateMsg(errMsg);
		setTimeout('alertDialog("Error: ' + errMsg + '")', 150);
		return true;
	}
	
	if (actionObj_p.alertMessage) {
		if (actionObj_p.alertMessage!="ok") {
			alertDialog (actionObj_p.alertMessage);
		}
		return true;
	}
	
	return false;
}


// for IDE, it uses windowResized() in navigate.js
function windowResizedNormal() {
	$("#svrMgrMain").css("height", $(window).height() - 50);
}


function openServerLog() {
	openWin("ServerLog");
}

function openConsole() {
	openWin("Console");
}

function editConfig () {
	curAppState.curNodeData = config;
	$('#shareDialog iframe').attr("src","PropertyEditor.html");
	
	$('#shareDialog').dialog(
		{	title:  "Config",
			width: 600,
			height: 500,
			closeOnEscape: true,
			autoOpen: false,
			modal: true,
			buttons: {
				"Ok": function() {
					runWinAction("Property", "save");
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		})
		.dialog("open");
}

function saveConfig() {
	logMsg("save config", 2);
	postAction ("saveConfig", config, function (retMsg_p) {
		data = eval("data="+retMsg_p);
		if (actionCallback(data)) return;
	});
}


function batchRun () {
	$('#shareDialog iframe').attr("src","BatchRun.html");
	$('#shareDialog').dialog(
		{	title:  "Batch Run Models",
			width: 700,
			height: 500,
			modal: true,
			buttons: { }
		})
		.dialog("open");
}


function batchDelete () {
	$('#shareDialog iframe').attr("src","BatchDeleteArchModel.html");
	$('#shareDialog').dialog().dialog(
		{	title:  "Batch Delete Models",
			width: 700,
			height: 500,
			modal: true,
			buttons: { }
		})
		.dialog("open");
}

function submitDeleteModels (modelList_p) {
	runWinAction('ModelList', 'delModels', modelList_p);
}

function closeDialog() {
	$("#shareDialog").dialog("close");
}

function postAction (action, params, callbackFunc) {
	logMsg ("postAction: " + action + ", " + params, 3);
	postActionUtil (action, params, callbackFunc);
}

//logs a message to console with default log level
function logMsg (msg_p, logLevel_p) {
	runWinAction("Console", "logMsg", {level: logLevel_p, msg: msg_p});
}

function expLicList() {
	runWinAction ("LicenseKeys", "expLicList");
}

function expSvrList() {
	runWinAction ("ServerList", "expSvrList");
}
