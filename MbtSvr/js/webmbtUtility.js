// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtUtility.js

$.ajaxSetup({
	"error":function(xhr,status,error) { 
		if (error) {
	       alert("Ajax Error: " + status + ":" + error + ".\nPlease submit this error and text displayed at the next screen to support@testoptimal.com.");
	       alert(xhr.responseText);
	    }
     }
}); 


$(document).ready(function(){
	$(document).bind('reveal.facebox', function() {
	    var height = $(window).height() - 100;
	    if (height < 50) return;
	    
	    if ($('.alertTable').length<=0) return;
	    
	    var tableHeight = $('.alertTable').height();
	    if (tableHeight > height) {
	    	$(".alertTable").css("height", height + "px");
//		    $('#facebox .content').css('height', height + 'px');
		}
		else {
//		    $('#facebox .content').css('height', tableHeight + 'px');
		}
	    
	    var tableWidth = $('#facebox').width();
	    var winWidth = $("#facebox").width() + 25;
	    if ($(window).width()<winWidth) winWidth = $(windown).width()-25;
    	$(".alertTable").css("width", winWidth + "px");
	    
//	    alert(tableWidth + "," + winWidth + "," + $("#facebox").width());
	    
	    $('#facebox').css('top', ($(window).scrollTop() + 50) + 'px');
	});
    

});


var scrollFaceBox = false;
function scrollToFacebox(){
	if (!scrollFaceBox) return;
	
	var theElement = document.getElementById("facebox");
	var selectedPosX = 0;
	var selectedPosY = 0;
	while (theElement!=null) {
		selectedPosX += theElement.offsetLeft;
		selectedPosY += theElement.offsetTop;
		theElement = theElement.offsetParent;
	}
	window.scroll(0, selectedPosY);
}

// dialog and confirm popup, requires faxbox.js
function alertDialog(msg_p) {
	if (inIFrame && parentWinObj) {
		parentWinObj.alertDialog(msg_p);
		return;
	}
	
	msg_p = msg_p.replace(/"/g, "'");
//	alertDialogBase( msg_p);
	setTimeout (function() { alertDialogBase( msg_p);}, 300);
}


// dialog and confirm popup, requires faxbox.js
function alertDialogBase(msg_p) {
//	if (msg_p=="change.saved" || msg_p=="model.started") {
//		setTimeout ("jQuery(document).trigger('close.facebox')", 1200);
//	}
	msg_p = translateMsg(msg_p);
	if ($("#facebox").is(":visible")) {
		$("#alertMsg").append("<p>" + msg_p+"</p>");
		$(document).trigger('reveal.facebox');
	}
	else {
		jQuery.facebox("<div class=alertTable style='overflow:auto;'><span id=alertMsg><p>" + msg_p + "</p></span>"
	    	+ "<br/><button style='float:right;margin-top: 8px;' id=alertOkBtn onclick='closeAlertDialog();'>OK</button>"
			+ "</div>");
	}
	
	$("#facebox #alertOkBtn").focus();
}

function closeAlertDialog() {
	$.facebox.close();
}

function plainDialog(msg_p, yesFunc, focusFieldID_p, cbFunc) {
	if (inIFrame && parentWinObj) {
		parentWinObj.plainDialog(msg_p, yesFunc, focusFieldID_p, cbFunc);
		return;
	}
	
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	if ($("#facebox").is(":visible")) {
		$("#alertMsg").append("<p>" + msg_p+"</p>");
		$(document).trigger('reveal.facebox');
	}
	else {
		jQuery.facebox("<div class=alertTable style='overflow:auto;'><span id=alertMsg><p>" + msg_p + "</p></span><br/><button style='float:right;margin-top: 8px;' id=dialogOkBtn>OK</button></div>");
	}
	if (focusFieldID_p) {
		$("#" + focusFieldID_p).focus().select();
	}
	else {
		$("#dialogOkBtn").focus();
	}

	$("#dialogOkBtn").click(function() { confirmDialogAction(true); });
	if (cbFunc) {
		cbFunc.apply();
	}
}

function getDialogField(fldID_p) {
	var firstChar = fldID_p.substring(0,1);
	if (firstChar!="." && firstChar!="#") {
		fldID_p = "#" + fldID_p; 
	}
	return $(fldID_p);
}

var mbtYesFunc;
var mbtNoFunc;
function confirmDialog(msg_p, yesFunc, noFunc, okLabel, cancelLabel) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = noFunc;
	msg_p = translateMsg(msg_p);
	if (okLabel==undefined || okLabel=="") okLabel = "OK";
	if (cancelLabel==undefined || cancelLabel=="") cancelLabel = "Cancel";
	jQuery.facebox("<div class='alertTable'><span id=alertMsg><p>" + msg_p + "</p></span>"
	    	+ "<br/><div style='float:right;'><button id=okBtn onclick='javascript:confirmDialogAction(true)'>"
	    	+ okLabel + "</button><button id=cancelBtn onclick='javascript:confirmDialogAction(false);'>"
	    	+ cancelLabel + "</button></div></div>");
//	scrollToFacebox();
	$("#cancelBtn").focus();
}

function confirmDialogAction(action_p) {
	$.facebox.close();
	if (action_p==true) {
		if (mbtYesFunc!=undefined) mbtYesFunc.apply();
	}
	else {
		if (mbtNoFunc!=undefined) mbtNoFunc.apply();
	}
//	scrollToFacebox();
}

function promptDialog(msg_p, defaultValue_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	jQuery.facebox("<div class='alertTable'><span id=alertMsg><p>" + msg_p + "</p></span>"
			+ "<input type='text' size='60' id='promptField' value=\"" + defaultValue_p + "\" onkeypress='dialogDefaultAction(event);'/>"
	    	+ "<br/><button style='float:right;margin-top: 8px;' id=dialogOkBtn onclick='javascript:confirmDialogAction(true)'>OK</button></div>");
//	scrollToFacebox();
	$("#promptField").focus();
}

function getPromptVal() {
	return $("#promptField").val();
}

function promptSelectDialog(msg_p, selectLabel_p,  optionList_p, promptLabel_p, defaultValue_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	var selectHtml = "<div class='alertTable'><span id=alertMsg><p>" + msg_p + "</p></span>"
		+ "<table><tr><td>" + selectLabel_p + "</td><td><select id='selectField' onkeypress='dialogDefaultAction(event,\"okBtn\");'>";
	for (var i=0; i<optionList_p.length; i++) {
		var selected = "";
		var optionLabel = optionList_p[i];
		var optionVal = optionLabel;
		if (optionLabel.val) {
			optionVal = optionLabel.val;
			optionLabel = optionLabel.label;
		}
		if (optionVal==defaultValue_p) selected = "selected";
		selectHtml = selectHtml + "<option value=\"" + optionVal + "\" " + selected + ">" 
			+ optionLabel + "</option>";
	}
	selectHtml += "</td></tr><tr><td>" + promptLabel_p + "</td><td><input type='text' size='60' id='promptField' value=\"" + defaultValue_p + "\" onkeypress='dialogDefaultAction(event);'/></td></tr>"
	    	+ "</table><button style='float:right;' id=dialogOkBtn onclick='javascript:confirmDialogAction(true)'>OK</button></div>";
	jQuery.facebox(selectHtml);
//	scrollToFacebox();
	$("#selectField").focus();
//	$("#promptField").focus();
}

function selectDialog(msg_p, optionList_p, defaultValue_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	var selectHtml = "<div class='alertTable'><span id=alertMsg><p>" + msg_p + "</p></span>"
		+ "<br><select id='selectField' onkeypress='dialogDefaultAction(event);'>";
	for (var i=0; i<optionList_p.length; i++) {
		var selected = "";
		var optionLabel = optionList_p[i];
		var optionVal = optionLabel;
		if (optionLabel.val) {
			optionVal = optionLabel.val;
			optionLabel = optionLabel.label;
		}
		if (optionVal==defaultValue_p) selected = "selected";
		selectHtml = selectHtml + "<option value=\"" + optionVal + "\" " + selected + ">" 
			+ optionLabel + "</option>";
	}
	selectHtml = selectHtml + "</select>"
		+ "<br><button style='float:right;' id=dialogOkBtn onclick='javascript:confirmDialogAction(true)'>OK</button></div>"
	
	jQuery.facebox(selectHtml);
//	scrollToFacebox();
	$("#selectField").focus();
}

function multiSelectDialog(msg_p, optionList_p, selectedList_p, yesFunc) {
	mbtYesFunc = yesFunc;
	mbtNoFunc = null;
	msg_p = translateMsg(msg_p);
	var selectHtml = "<div class='alertTable'><span id=alertMsg><p>" + msg_p + "</p></span>"
		+ "<br><select id='selectField' multiple='multiple' onkeypress='dialogDefaultAction(event);'>";
	for (var i=0; i<optionList_p.length; i++) {
		var selected = "";
		if (findIndex(selectedList_p, optionList_p[i])>=0) selected = "selected";
		selectHtml = selectHtml + "<option value=\"" + optionList_p[i] + "\" " + selected + ">" 
			+ optionList_p[i] + "</option>";
	}
	selectHtml = selectHtml + "</select>"
		+ "<br><button style='float:right;' id=dialogOkBtn onclick='javascript:confirmDialogAction(true)'>OK</button></div>"
	
	jQuery.facebox(selectHtml);
//	scrollToFacebox();
	$("#selectField").focus();
}

function findIndex(list_p, matchValue_p) {
	for (var i in list_p) {
		if (matchValue_p== list_p[i]) {
			return i;
		}
	}
	return -1;
}

function getMultiSelectedList(ignoreVal_p) {
	var retList = [];
	$("#selectField option:selected").each(function() {
		var val = $(this).val();
		if (ignoreVal_p!=undefined && val!=ignoreVal_p) {
			retList.push(val);
		} 
	});
	return retList;
}

function getSelectedVal() {
	return $("#selectField option:selected").val();
}

function getSelectedLabel() {
	return $("#selectField option:selected").text();
}

// used by facebox for default action on enter key
function dialogDefaultAction(e) {
  // look for window.event in case event isn't passed in
  if (window.event) { 
  	 e = window.event; 
  }
  if (e.keyCode == 13) {
     $("#dialogOkBtn").click();
  }
} 

function attachToSession(mbtSessionID_p) {
	createCookie("attachToSession", mbtSessionID_p, 0);
}

// cookies functions: 0 days  - good until browser closes, -1 days - trashed right after creation
function createCookie(name,value,days) {
	if (document.cookie) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
}

function readCookie(name) {
	if (document.cookie) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
function genHttpRequestURL (action, params) {
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	url = url + "&" + params;
	return url;
}

function sendActionUtil (action, params, callbackFunc) {
	// assumes params are already encoded
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	url = url + "&updateSeq=" + updateSeq + "&" + params;
	if (callbackFunc==undefined) callbackFunc = actionCallback;
	$.getJSON(url, callbackFunc);
}


function postActionUtil (action, params, callbackFunc, dataType) {
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
	// url = url + "&" + params;
	params.updateSeq = updateSeq;
	if (callbackFunc==undefined) callbackFunc = actionCallbackPost;
	try {
		if (dataType) {
			$.post(url, params, callbackFunc, dataType);
		}
		else {
			$.post(url, params, callbackFunc);
		}
	}
	catch (err) {
		alert(err);
	}
}


function postWithTimeout ( action, data, callbackFunc, timeoutMS ) {      
	var url = 'app=webmbt&action=' + action + '&rand='+Math.random();
    var settings = {
      type : "POST", //predefine request type to POST
      'url'  : url,
      'data' : data,
      'success' : callbackFunc,
      'timeout' : timeoutMS
    };
    $.ajax(settings)
}
    
function isShade(rowNum_p) {
	if (Math.floor(rowNum_p/5)%2==1) return true;
	else return false;
}



//domainQuery list
var excludeQueryList = new Array();
excludeQueryList["eventscript"] = new Array("setMbtVar");

function isExpandable(typeCode_p) {
	if (typeCode_p==undefined) return false;
	if (typeCode_p=="state" || typeCode_p=="usecase" || typeCode_p=="mbt" ||
		typeCode_p=="scxml") {
		return true;
	}
	else {
		return false;
	}
}

function PopupWin(page,IEWidth,IEHeight,NNWidth,NNHeight) {

	var MyBrowser = navigator.appName;

	if (MyBrowser == "Netscape") {
		var myWinWidth = (window.screen.width/2) - (NNWidth/2);
		var myWinHeight = (window.screen.height/2) - ((NNHeight/2) + 50);

		var myWin = window.open(page,"MainWin","width=" + NNWidth + ",height=" + NNHeight + ",screenX=" + myWinWidth + ",screenY=" + myWinHeight + ",left=" + myWinWidth + ",top=" + myWinHeight + ",scrollbars=yes,toolbar=0,status=0,menubar=0,resizable=0,titlebar=no");
	}
	else {
		var myWinWidth = (window.screen.width/2) - (IEWidth/2);
		var myWinHeight = (window.screen.height/2) - ((IEHeight/2) + 50);
		var myWin = window.open(page,"MainWin","width=" + IEWidth + ",height=" + IEHeight + ",screenX=" + myWinWidth + ",screenY=" + myWinHeight + ",left=" + myWinWidth + ",top=" + myWinHeight + ",scrollbars=yes,toolbar=0,status=0,menubar=0,resizable=0,titlebar=no");

	}
	myWin.focus();
}


// replaces strA with strB in text string passed in.
function replaceAll(text, strA, strB) {
    return text.replace( new RegExp(strA,"g"), strB );    
}


//javascript object to prop=value string
function toString(obj) {
	var str="";
	if (obj==undefined) return "undefined";
	if (obj.length<=0) return "";
	for(prop in obj) {
		if (!(obj[prop] instanceof Array)) str += prop + "="+ encodeURIComponent(obj[prop]) + "&";
	}
	return (str);
}


function resetObj (nodeData_p) {
	for (prop in nodeData_p) {
		nodeData_p[prop] = "";
	}
}

function getDisplayTime(time_p) {
	var timeString = "";
	if (time_p.getHours()<10) timeString = "0" + time_p.getHours();
	else timeString = time_p.getHours();
	
	if (time_p.getMinutes()<10) timeString += ":0" + time_p.getMinutes();
	else timeString += ":" + time_p.getMinutes();
	
	if (time_p.getSeconds()<10) timeString += ":0" + time_p.getSeconds();
	else timeString += ":" + time_p.getSeconds();
	return timeString;
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}


//replaces the @snapTS:nnnnn@ with hyper link to display screenshot.
function resolveSnapID(msg_p, execID_p) {
	var snapIdx = msg_p.indexOf("@snapTS:");
	var execID = "";
	if (execID_p) {
		execID = "&execID=" + execID_p;
	}
	while (snapIdx>=0) {
		var snapId = msg_p.substring(snapIdx+8);
		var snapIdx2 = snapId.indexOf("@");
		var msgTail = snapId.substring(snapIdx2+1);
		snapId = snapId.substring(0, snapIdx2);
		msg_p = msg_p.substring(0, snapIdx) 
			+ " <a href='app=webmbt&action=getSnapScreen&snapTime=" + snapId 
			+ execID + "&rand=" + Math.random() + "' target='_blank'>ScreenShot</a>" + msgTail;
		snapIdx = msg_p.indexOf("@snapTS:");
	}
	return msg_p;
}

var updateSeq = "";
function getUpdateSeq() {
	sendAction("getModelData", "updateSeq", function(data) {
		updateSeq = data;
	});
}


function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}
function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}


function toDecode(msg) {
	return decodeURIComponent (msg.replace(/\+/g,  " "));
}
