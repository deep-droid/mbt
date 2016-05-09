// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// navigate.js

var maximized = 0;
var startMouseX;
var curMouseX;
var startMouseY;
var curMouseY;

var lastExpandPaneId = "";

var appContentHeight;
var panesWrapperWidth;
var paneLeftWidth;
var paneTopRightHeight;
var paneLeftWidthPct;
var paneTopRightHeightPct;

var appHeaderHeight = 37;
var tabHeaderHeight = 25;
var hSplitterThickness = 8;
var vSplitterThickness = 8;
var sideBarWidth = 28;
var resetLeftWidthPct = 70;
var resetTopRightHeightPct = 60;

try {
	var cTemp = $.cookie("TO_LeftWidthPct");
	if (cTemp!=null && cTemp!="" && cTemp!="NaN") {
		resetLeftWidthPct = parseInt(cTemp);
	}
	cTemp = $.cookie("TO_TopRightHeightPct");
	if (cTemp!=null && cTemp!="" && cTemp!="NaN") {
		resetTopRightHeightPct = parseInt(cTemp);
	}
}
catch (err) {
	resetDefault();
}

// reset IDE Layout, webmbtMain.js has default layout setting.
function resetDefault() {
	resetLeftWidthPct = 70;
	resetTopRightHeightPct = 60;
	resetAllPanes();
	recalcDefault();
	tabGroupList = [
		{ tabGroup: "paneLeft", detachable: false, tabList: ["FileList", "Model"]},
		{ tabGroup: "paneTopRight", detachable: true, tabList: ["Monitor", "Stats", "Vars", "UIMap"]},
		{ tabGroup: "paneBottomRight", detachable: true, tabList: ["MScript", "SeqTrace", "ScreenShot"]}
	];
	saveTabLayout();
	refreshIde();
}


function resetAllPanes() {
	paneLeftWidthPct = resetLeftWidthPct;
	paneTopRightHeightPct = resetTopRightHeightPct;
	$(".hideShow").show();
	if (resetLeftWidthPct < 10 || resetLeftWidthPct > 90 || 
	    resetTopRightHeightPct < 10 || resetTopRightHeightPct > 90) {
		resetDefault();	
	}
	windowResized();
	maximized = 0;
}

function recalcDefault() {
	// write to cookie if enabled
	resetLeftWidthPct = Math.round(paneLeftWidth * 100 / panesWrapperWidth);
	resetTopRightHeightPct = Math.round(paneTopRightHeight * 100 / appContentHeight);
	paneLeftWidthPct = resetLeftWidthPct;
	paneTopRightHeightPct = resetTopRightHeightPct;
	
	$.cookie("TO_LeftWidthPct", resetLeftWidthPct, {expires: 30});
	$.cookie("TO_TopRightHeightPct", resetTopRightHeightPct,  {expires: 30});
}



function windowResized() {
	var setVal;
	$("#paneLeft").show();
	$("#paneRight").show();
	$("#paneTopRight").show();
	$("#paneBottomRight").show();
	
	var verticalDividerHeight = vSplitterThickness;

	appContentHeight = $(window).height() - appHeaderHeight; // - tabHeaderHeight;
	panesWrapperWidth = $(window).width() - sideBarWidth;

	if (isTabGroupEmpty("paneTopRight")) {
		paneTopRightHeightPct = 0;
		verticalDividerHeight = 0;
	}

	if (isTabGroupEmpty("paneBottomRight")) {
		paneTopRightHeightPct = 100;
		verticalDividerHeight = 0;
	}
	
	if (verticalDividerHeight==0) {
		$("#vDivider").hide();
	}
	else {
		$("#vDivider").show();
	}
	
//	$("#appContent").css("height", appContentHeight-50);
	$("#appContent").css("height", appContentHeight); // + tabHeaderHeight);
	$("#panesWrapper").css("width", panesWrapperWidth);

	paneLeftWidth = Math.round(panesWrapperWidth * paneLeftWidthPct / 100);
	if (paneLeftWidthPct <= 0) {
		$("#paneLeft").hide();
	}
	else if (paneLeftWidthPct >= 100) {
		$("#paneRight").hide();
	}
	$("#paneLeft").css("width", paneLeftWidth);
	$("#paneLeft iframe").css("height", appContentHeight - tabHeaderHeight);

	setVal = panesWrapperWidth - paneLeftWidth - hSplitterThickness;
	$("#paneRight").css("width", setVal);

	paneTopRightHeight = Math.round((appContentHeight) * paneTopRightHeightPct / 100);
	if (paneTopRightHeightPct <= 0) {
		$("#paneTopRight").hide();
		paneTopRightHeight = 0;
	}
	else if (paneTopRightHeightPct >= 100) {
		$("#paneBottomRight").hide();
		paneTopRightHeight = appContentHeight - verticalDividerHeight
	}
	$("#paneTopRight").css("height", paneTopRightHeight);
	$("#paneTopRight iframe").css("height", paneTopRightHeight - tabHeaderHeight);

	var paneBottomRight = appContentHeight - paneTopRightHeight - verticalDividerHeight;
	$("#paneBottomRight").css("height", paneBottomRight);
	$("#paneBottomRight iframe").css("height", paneBottomRight - tabHeaderHeight);
	
	$("#ghostDividerH").css("height", appContentHeight); // + tabHeaderHeight);
	$("#ghostDividerV").css("width", panesWrapperWidth - paneLeftWidth - hSplitterThickness);

	// zoom handling, only model iframe for now	
	if (curAppState.modelOpen && !$.browser.webkit) {
		var zoomFactor = 1.0;
		try {
			zoomFactor = parseInt(curAppState.nodeDataList["scxml"].zoomPct)/100.0;
		}
		catch (e2) {
		}
		if (zoomFactor<=0) zoomFactor = 1.0;
		var pixelMultipler = 1/zoomFactor;
		$("#Model").css(
			{"zoom": zoomFactor, 
			 "-moz-transform": "scale("+zoomFactor + ")", 
			 "-moz-transform-origin": "0 0",
			 "-o-transform": "scale("+zoomFactor+")", 
			 "-o-transform-origin": "0 0",
			 "-webkit-transform": "scale("+zoomFactor+")",
			 "-webkit-transform-origin": "0 0"
			 });
		$("#Model").css("width", $("#paneLeft").width()*pixelMultipler + "px");
		$("#Model").css("height", ((appContentHeight-tabHeaderHeight)*pixelMultipler) + "px");
	}
	runWinActionOnAllWins("adjustHeight");
}


function maxLeftPane() {
	// set left pane to 100% wide
	paneLeftWidthPct = 100;
	windowResized();
	maximized = 1;
	lastExpandPaneId = "paneLeft";
}

function minLeftPane() {
	// set left pane to 100% wide
	paneLeftWidthPct = 0;
	windowResized();
	lastExpandPaneId = "paneRight";
}

function maxTopRightPane() {
	minLeftPane();
	minBottomRightPane();
	$(".hideShow").hide();
	maximized = 1;
}

function maxBottomRightPane() {
	minLeftPane();
	minTopRightPane();
	$(".hideShow").hide();
	maximized = 1;
}

function minTopRightPane() {
	paneTopRightHeightPct = 0;
	$(".hideShow").hide();
	windowResized();
}

function minBottomRightPane() {
	paneTopRightHeightPct = 100;
	$(".hideShow").hide();
	windowResized();
}

function minMaxPane (paneID) {
	if (maximized == 1) {
		 resetAllPanes(); // resest maximized 
		 return;
	}

	if (paneID=="paneLeft") {
		maxLeftPane();
	}
	else if (paneID=="paneTopRight") {
		maxTopRightPane();
	}
	else if (paneID=="paneBottomRight") {
		maxBottomRightPane();
	}
}



function windowResizedNormal() {
	appContentHeight = $(window).height() - appHeaderHeight - appHeaderHeight;
	$(".appContent").css("height", appContentHeight);
}


var mouseStartPos;
function hDividerDownAction(elem) {
	mouseStartPos = null;
	$("#appContent").css("pointer-events","none");
 	$("#hDivider").addClass("moving");
 	document.body.style.cursor = 'col-resize';
	$("#opaqDiv").show();
 	
 	$("body").mouseup(hDividerUpAction);
	$("body").bind("mousemove", function(e) {
		mouseStartPos = e.clientX;
		var delta = mouseStartPos - sideBarWidth - paneLeftWidth;
		paneLeftWidth = paneLeftWidth + delta;
		recalcDefault();
		windowResized();
    });
}


function hDividerUpAction(e) {
	if (mouseStartPos==null) return;
	$("#opaqDiv").hide();
	$("#appContent").css("pointer-events","auto");
	$("body").unbind('mouseup', hDividerUpAction);
	$("body").unbind("mousemove");
 	$("#hDivider").removeClass("moving");
 	document.body.style.cursor = 'default';
}

function vDividerDownAction(elem) {
	mouseStartPos = null;
	$("#opaqDiv").show();
 	document.body.style.cursor = 'row-resize';
	$("#appContent").css("pointer-events","none");
 	$("#vDivider").addClass("moving");
	$("body").mouseup(vDividerUpAction);
	$("body").bind("mousemove", function(e){
		mouseStartPos = e.clientY;
		var delta = mouseStartPos - appHeaderHeight - paneTopRightHeight;
		paneTopRightHeight = paneTopRightHeight + delta;
		recalcDefault();
		windowResized();
    });
}

function vDividerUpAction() {
	if (mouseStartPos==null) return;
	$("#opaqDiv").hide();
	$("#appContent").css("pointer-events","auto");
	$("body").unbind('mouseup', vDividerUpAction);
	$("body").unbind("mousemove");
 	$("#vDivider").removeClass("moving");
 	document.body.style.cursor = 'default';
}

