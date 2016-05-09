// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// GraphUtil.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	opener.handleJsError(errMsg, fileName, lineNum);
}

function printGraph() {
	window.print();
	return false;
}

var currentZoom = 1;
    
function zoomIn() {
	$("#graphImg").width($("#graphImg").width()*1.1);
	$("#graphImg").height($("#graphImg").height()*1.1);
}

function zoomOut() {
	$("#graphImg").width($("#graphImg").width()*0.9);
	$("#graphImg").height($("#graphImg").height()*0.9);
}

function saveGraph() {
	open (graphURL + "&save=true");
}


function windowResized() {
	mapObj.resizeBox($(window).width(), $(window).height()-25);
}

var mapObj;

$(document).ready(function() {
	init();
});


var graphURL = "img/blank.png";
function loadGraph(type_p, moreParams_p) {
	graphURL = "app=webmbt&action=webmbtGraph&" + window.top.location.search.substring(1);
	var modelName = getRequestParam("modelName");
	var graphTitle = type_p;
	if (modelName && modelName!="" && modelName!=="null") {
		graphTitle = "Model: " + modelName;
	}
	
	if (moreParams_p==undefined) {
		moreParams_p = "";
	}
	else {
		moreParams_p = "&" + moreParams_p;
	}
	graphURL = graphURL + moreParams_p;

	var htmlCode = "<div id='floatMenu'>"
		+ "<span id=graphTitle>" + graphTitle + "</span>"
		+ "<span id=btnSpan>"
		+ "<span class='btn' onclick='zoomIn();'>zoom in</span>"
		+ "<span class='btn' onclick='zoomOut();'>zoom out</span>"
		+ "<span class='btn' onclick='printGraph();'>Print</span>"
		+ "<span class='btn' onclick='saveGraph();'>Save</span>"
		+ "</span></div>"
		+ "<div id='graphMain'>"
		+ "<img src='" + graphURL + "' id='graphImg'></img>"
		+ "</div>";
	$(htmlCode).appendTo ($("body"));
	
	$(window).bind('resize', windowResized);

	// spryMap
	var winHeight = $(window).height();
	var winWidth = $(window).width();
	
	mapObj = new SpryMap({id : "graphImg",
                         height: winHeight-25,
                         width: winWidth,
                         startX: 200,
                         startY: 200,
                         cssClass: "mappy"});
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
