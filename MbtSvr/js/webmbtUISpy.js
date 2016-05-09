// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webMbtTrans.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	alertDialog ("errMsg: " + errMsg + "; fileName:" + fileName + "; lineNum: " + lineNum);
}

var curStateID;
var FrameName = "frameUISpy";
var curUIElem;
var curXmlElem;
var parentWinObj=undefined;
var uiXml = "";

$(document).ready(function(){
    $('a[rel*=facebox]').facebox({
        loading_image : '/js/facebox/loading.gif',
        close_image   : '/js/facebox/closelabel.gif'
    }) 

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
    

	if (window.opener) {
		parentWinObj = window.opener;
		parentWinObj.regWin(window, FrameName, mainCallbackFunc);
		window.onunload = function() { parentWinObj.detachWin(FrameName); };
		curStateID = getRequestParam ("stateID");
	}
//	else {
//		parent.iFrameReady(FrameName);
//		parentWinObj = parent;
//	}

    // find the state to display

	viewVisual();
	loadUIMapList();
//	window.onbeforeunload = checkClosing;
});

//function checkClosing() {
//	parentWinObj.restoreTab(FrameName);
//}

function viewVisual() {
	postActionUtil("uiState", "type=stateXml&state=" + curStateID + "&randNum=" + Math.random(), setUIComponents, "xml");
}

function loadUiXML() {
	postActionUtil("uiState", "type=stateXml&state=" + curStateID + "&randNum=" + Math.random(), function(data) {
			parentWinObj.actionCallback(data);
			if (data.error) setTimeout("alertDialog('" + data.error + "')", 200);
			else uiXml = $(data);
		}, "xml");
}


// from http://blog.pothoven.net/2006/07/get-request-parameters-through.html
function getRequestParam ( parameterName ) {
	var queryString = window.top.location.search.substring(1);
	// Add "=" to the parameter name (i.e. parameterName=value)
	var parameterName = parameterName + "=";
	if ( queryString.length > 0 ) {
	// Find the beginning of the string
		begin = queryString.indexOf ( parameterName );
		// If the parameter name is not found, skip it, otherwise return the value
		if ( begin != -1 ) {
			// Add the length (integer) to the beginning
			begin += parameterName.length;
			// Multiple parameters are separated by the "&" sign
			end = queryString.indexOf ( "&" , begin );
			if ( end == -1 ) {
				end = queryString.length
			}
			// Return the string
			return unescape ( queryString.substring ( begin, end ) );
		}
		// Return "null" if no parameter has been found
		return "null";
	}
}

function setUIComponents (uiCompList) {
	uiXml = $(uiCompList);
	
	$("#uiComponents .ui").remove();
	var uiComponents = $("#uiComponents"); // $("#uiComponents ul");
	$(uiComponents).css("background-image","url('/MbtSvr/app=webmbt&action=uiState&type=stateImg&state=" + curStateID + "&randNum=" + Math.random() + "')");

	$(uiCompList).find("Window").find("Control").each(function()
	{
	    $(uiComponents).append(genControlHtml(this, uiCompList));
	});

	var stateUI = $(uiCompList).find("StateUI");
	$(stateUI).find("UIElement").each(function() {
		var ctrlID = $(this).attr("controlID");
		if (ctrlID==undefined || ctrlID=="") return;
		$("#" + ctrlID + " .ind").addClass("mapped");
		var xmlElem = $(uiCompList).find("//Control[@controlID='" + ctrlID + "']");
		$(xmlElem).attr("ElementID", $(this).attr("ElementID"))
			      .attr("Locator", $(this).attr("Locator"));
	});
	
		
	$(uiComponents).find(".ui").click(
		function() { 
//				$(this).removeClass("uiHhover");
				clickElem(this);
//				parentWinObj.sendAction("uispy", "cmd=hiliteControl&id=" + $(this).attr("ID")); 
			}
		);
	$(uiComponents).find(".ui .innerDiv").hover(
			function() { $(this).addClass("uiHover");}, 
			function() { $(this).removeClass("uiHover"); }
		);

	$(uiComponents).find(".ui").contextMenu(
 		{ menu: 'elemMenu' },
 		function(action, el, pos) {
 			if (action=="newTrans") {
 				newTrans(el);
 			}
 			else if (action=="clickElem") {
 				curStateID = "curState";
 				clickElem(el);
 			}
 			else if (action=="editElem") {
 				editElem(el);
 			}
 			else {
 				alertDialog("Invalid menu action: " + action);
 			}
 		},
 		elemMenuInit
    );

	$(uiComponents).contextMenu(
 		{ menu: 'winMenu' },
 		function(action, el, pos) {
 			if (action=="newState") {
 				newState();
 			}
 			else if (action=="refresh") {
 				refresh();
 			}
 			else if (action=="viewXml") {
 				viewXML();
 			}
 			else {
 				alertDialog("Invalid menu action: " + action);
 			}
 		},
 		winMenuInit
    );
	
		
	return;
}


function elemMenuInit(elem) {
	curUIElem = elem;
	var ctrlID = $(elem).attr("id");

	var xmlElem = $(uiXml).find("Control[ctrlID=" + ctrlID + "]");
	curXmlElem = xmlElem;
	var uiid = $(xmlElem).attr("ElementID");
	if (uiid==undefined || uiid=="") {
		$("#newTrans").hide();
	}
	else {
		$("#newTrans").show();
	}
	
	if (parentWinObj.execMode=="exec" && parentWinObj.curAppState.nodeDataList["mbt"].mode=="modelingSequence") {
		$("#clickElem").show();
	}
	else {
		$("#clickElem").hide();
	}
}

function winMenuInit(el) {
	return;
//	var clickUid = $(el).attr("id");
}

function editElem(elem) {
	curUIElem = elem;
	var ctrlID = $(elem).attr("id");
	showUIID(elem);
}

function newTrans(elem) {
	// click to bring up next ui, then create trans, call server for best matched state id
	clickElem(elem, localNewTrans);
}

function localNewTrans(targetStateID) {
	var ctrlID = $(curUIElem).attr("id");
	var xmlElem = $(uiXml).find("Control[ctrlID=" + ctrlID + "]");
	curXmlElem = xmlElem;
	var uiid = $(xmlElem).attr("ElementID");
	var name = $(xmlElem).attr("Name");
	if (name==undefined || name=="") name = uiid;

	var msg = parentWinObj.aNewTrans(uiid, name, "<action code=\"$click_win('map=" + uiid + "')\"/>", curStateID, targetStateID);
	if (msg) {
		setTimeout("alertDialog('" + msg + "')", 200);
	}
}


// elem - html element
function clickElem(elem, clickElemCb) {

	curUIElem = elem;
	var ctrlID = $(elem).attr("id");
	var xmlElem = $(uiXml).find("Control[ctrlID=" + ctrlID + "]");
	curXmlElem = xmlElem;
	var coords = $(xmlElem).attr("clickCoords");
	if (coords==null) {
		coords = $(xmlElem).attr("Bounds");
		var coordsPieces = coords.split(",");
		if (coordsPieces.length==4) {
			coords = Math.round(parseInt(coordsPieces[0]) + parseInt(coordsPieces[2])/8) + ","
			 	   + Math.round(parseInt(coordsPieces[1]) + parseInt(coordsPieces[3])/8);
		}
	}
	
	parentWinObj.sendAction("uiState", "type=clickElem&locator=" + coords, function(data) {
		parentWinObj.actionCallback(data);
		if (data.error) setTimeout("alertDialog(\"" + data.error + "\")", 200);
		else if (clickElemCb) {
			if (data.stateID) {
				clickElemCb.apply(this, [data.stateID]);
			}
			else {
				clickElemCb.apply(this, ["curState"]);
			}
		}
		else {
			reloadPage(data.stateID);
		}
	});
}

function reloadPage(stateID) {
	if (stateID==undefined || stateID=="") stateID = "curState";
	var idx = window.location.href.indexOf("?stateID=");
	if (idx<0) {
		window.location.href = window.location.href + "&stateID=" + stateID;
	}
	else {
		idx += 9;
		window.location.href = window.location.href.substring(0, idx) + stateID;
	}
}

function refresh() {
	parentWinObj.sendAction("uiState", "type=refreshUI", function(data) {
		parentWinObj.actionCallback(data);
		if (data.error) setTimeout("alertDialog('" + data.error + "')", 200);
		else reloadPage(data.stateID);
	});
}

var NextStateID = 0;
function getNextStateID() {
	NextStateID += 1;
	return NextStateID;
}

function newState() {
	var sID = getNextStateID();
	alert(parentWinObj.curAppState.nodeDataList.scxml.uid);
	parentWinObj.editProperty(parentWinObj.curAppState.nodeDataList.scxml.uid);
	parentWinObj.aNewState("state_" + sID, "state_" + sID, "");
}

function addElem() {
	closeDialog();
	var ctrlID = $(curUIElem).attr("id");
	var uiid = $("#propUIID").val();
	var locator = $("#propLoc").val();
	
	if (uiid==undefined || uiid=="" || locator==undefined || locator=="") {
		alertDialog("stateui.field.required");
		return;
	}

	var ckExpr = getCheckExpr();
		
	parentWinObj.sendAction("uiState", "type=newUIElement&stateID=" + curStateID + "&uiid=" + uiid + "&locator=" + encodeURIComponent(locator) + ckExpr, function(data) {
		parentWinObj.actionCallback(data);
		if (data.error) setTimeout("alertDialog('" + data.error + "')", 200);
		else {
			$(curXmlElem).attr("ElementID", uiid);
			$(curXmlElem).attr("Locator", locator);
			loadUiXML();
//			updateAttrFromPopup();
//			$(curUIElem).find(".ind").addClass("mapped");
			$(curUIElem).addClass("mapped");
		}
	});
}


function getCheckExpr() {
	var ckExpr = "";
	$("#uiElemProp tr.ck input").each(function() {
		var ckVal = $(this).val();
		if (ckVal==undefined || ckVal=="") return;
		var ckName = $(this).parent().prev().prev().html();
		ckExpr += "&ck_" + ckName + "=" + encodeURIComponent(ckVal);
	});
	return ckExpr;
}


function delElem() {
	closeDialog();
	var ctrlID = $(curUIElem).attr("id");
	var uiid = $(curXmlElem).attr("ElementID");
	parentWinObj.sendAction("uiState", "type=deleteUIElement&stateID=" + curStateID + "&uiid=" + uiid, function(data) {
		parentWinObj.actionCallback(data);
		if (data.error) setTimeout("alertDialog('" + data.error + "')", 200);
		else {
			$(curXmlElem).attr("ElementID", "");
			$(curXmlElem).attr("Locator", "");
//			$(curUIElem).find(".ind").removeClass("mapped");
			$(curUIElem).removeClass("mapped");
		}
	});
}

function updElem(uiid_p) {
	closeDialog();
	var ctrlID = $(curUIElem).attr("id");
	var uiid = $(curXmlElem).attr("ElementID");
	var newUIID = $("#propUIID").val();
	var locator = $("#propLoc").val();
	if (newUIID==undefined || newUIID=="" || locator==undefined || locator=="") {
		setTimeout("alertDialog('stateui.field.required')", 200);
		return;
	}

	var ckExpr = getCheckExpr();

	parentWinObj.sendAction("uiState", "type=updateUIElement&stateID=" + curStateID + "&uiid=" + uiid + "&newUIID=" + newUIID + "&locator=" + encodeURIComponent(locator) + ckExpr, function(data) {
		parentWinObj.actionCallback(data);
		if (data.error) setTimeout("alertDialog('" + data.error + "')", 200);
		else {
			$(curXmlElem).attr("ElementID", newUIID);
			$(curXmlElem).attr("Locator", locator);
			loadUiXML();
		}
	});
}

var controlSeq = 0;
function genControlHtml(control, uiXml) {
	var boundsStr = $(control).attr("Bounds");
	if (boundsStr == undefined || boundsStr=="") {
		return "";
	}

	var ctrlID = $(control).attr("ctrlID");
	var offScreen = $(control).attr("OffScreen");
	if (offScreen && offScreen.toLowerCase() == "true") return;

	var contentElement = false;
	var cntElem= $(control).attr("ContentElement");
	if (cntElem && cntElem.toLowerCase() == "true") {
		contentElement = true;
	}
	
	var type = $(control).attr("Type");
	if ((type == "list item" || type == "separator" || 
	     type == "menu item" || type == "list view") &&
		parseInt($(control).attr("left")) <= 3) return;
		
	var moreStyle="";
	if (offScreen=="True") {
		moreStyle = " display:none;"
	}

	var styleCode = "position: fixed; left:" + $(control).attr("left")
	 	+ "px; top:" + $(control).attr("top")
	 	+ "px; width:" + $(control).attr("width") 
	 	+ "px; height:" + $(control).attr("height")
	 	+ "px; " + moreStyle + "'";
	 	
	var titleCode = $(control).attr("ElementID");
	if (titleCode && titleCode!="") {
		titleCode = "Element " + titleCode;
	}
	else titleCode = "";
	
	 	
	var indClass = $(control).attr("ElementID");
	if (indClass==undefined || indClass=="") indClass = ""
	else indClass = "mapped";
	
	if ($(control).find("Control").size()==0) {
		indClass += " zControl";
	}
	
	var code = "<div class='ui " + indClass + "' style='" + styleCode + "'"
	 	+ " id='" + ctrlID + "'"
	 	+ " title='" + titleCode + "'>"
	 	+ "<div class='innerDiv'></div>";
	 code += "</div>";
	 
	return code;
	
}


function viewXML() {
	window.open("/MbtSvr/app=webmbt&action=uiState&type=stateXml&state=" + curStateID + "&randNum=" + Math.random());
}

function reset() {
	$(".ui").remove();
	$("#visualViewer").attr("src", "/MbtSvr/img/blank.png");
}

function adjustHeight(topPaneHeight, bottomPaneHeight) {
    // includes header from the parent and one header and one footer from this editor
	$("#uiComponents").css("height", bottomPaneHeight - 25);
}

function showUIID(elem) {
	curUIElem = elem;
	var ctrlID = $(elem).attr("id");
	
	var xmlElem = $(uiXml).find("Control[ctrlID=" + ctrlID + "]");
	curXmlElem = xmlElem;
	
	var uiDesc = "<table id=uiElemProp cellspacing=0 cellspacing=0 width=\'100%25\' border=1>";
	var uiid = $(xmlElem).attr("ElementID");
	if (uiid==undefined) uiid = "";
	var locator = $(xmlElem).attr("Locator");
	if (locator==undefined) locator = "";
	var uiidTitle = "";
	if (hasUIMapList()) uiidTitle="title='right click to select from UIMap List'";
	uiDesc += "<tr><td>ElementID</td><td colspan=2><input " + uiidTitle + " style='width: 300px;' type=text id=propUIID value='" + uiid + "'/></td></tr>";
	if (locator=="") {
		locator = getLocator(xmlElem);
	}
	uiDesc += "<tr><td>Locator</td><td colspan=2><input type=text style='width: 300px;' id=propLoc value=\\'" + locator + "\\'/></td></tr>";
	var attrs = $(xmlElem).listAttributes();
	for (var i = 0; i < attrs.length; i++) {
		var attrName = attrs[i];
		if (attrName.indexOf("ck_")==0 || attrName<'A') continue;
		var attrVal = $(xmlElem).attr(attrs[i]);
		var ckExpr = $(xmlElem).attr("ck_"+attrName);
		if (ckExpr==undefined) ckExpr = "";
     	if (attrName!="ElementID" && attrName!="Locator") {
			 uiDesc += "<tr class=ck><td>" + attrName + "</td><td>" + attrVal + "</td><td><input type=text value='" + ckExpr + "'/></td></tr>";
		}
	}
	

	uiDesc += "<tr style='height: 50px;'><td colspan=3 valign=bottom>";
	if (uiid=="") {
		uiDesc += "<button id=addElem onclick='addElem();'>Add Elem</button>";
	}
	else {
		uiDesc += "<button id=updElem onclick='updElem();'>Update Elem</button>"
		    + "<button id=delElem onclick='delElem();'>Delete Elem</button>";
	}
	uiDesc += "</td></tr>";
	uiDesc += "</table>";
	alertDialog(uiDesc);
	setTimeout("setupCtxUIMapMenu()", 100);
}

function getLocator (xmlElem) {
	var locator = "";
	if ($(xmlElem).attr("AutomationId")=="") {
		locator = "//Control[@Bounds=" + $(xmlElem).attr("Bounds") + "]";
	}
	else {
		locator = "id=" + $(xmlElem).attr("AutomationId");
	}
	return locator;
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight(params_p.topPaneHeight, params_p.bottomPaneHeight);
	}
	else if (action_p=="stateUI") {
		curStateID = params_p.stateID;
		viewVisual();
	}
	else {
		alert("unknown action: " + action_p);
	}
}

function closeDialog() {
	jQuery(document).trigger('close.facebox');
}

var uiMapList = new Array();

function loadUIMapList() {
	parentWinObj.sendAction("uispy", "cmd=getUIMapList", function (data) {
		if (parentWinObj.actionCallback(data)) return;
		populateUIMapMenu(data);
	});
}

function populateUIMapMenu(uiMapList_p) {
	uiMapList = uiMapList_p;
	if (uiMapList==undefined) return;
	if (uiMapList.length==0) return;
	
	var htmlCode = "";
	var uiMapMenu = $("#uiMapListMenu");
	for (var i in uiMapList) {
		htmlCode = "<li title=\"" + uiMapList[i].desc + " (" + uiMapList[i].app + "/" + uiMapList[i].win + ")\">"
				 + "<a href=\"#" + i + "\">" 
				 + uiMapList[i].uiid + "</a></li>";
		$(uiMapMenu).append(htmlCode);
	}
}

function hasUIMapList() {
	if ($("#uiMapListMenu li").size()>0) return true;
	return false;
}


function setupCtxUIMapMenu() {
	if (!hasUIMapList()) return;
	
	$("#propUIID").contextMenu(
 		{ menu: 'uiMapListMenu' },
 		function(action, el, pos) {
 			$("#propUIID").val(uiMapList[action].uiid);
 			$("#propLoc").val(uiMapList[action].loc);
 		}
    );

}