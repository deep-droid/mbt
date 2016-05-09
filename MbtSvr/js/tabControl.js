// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// tabControl.js

//programmatically select tab by simulating clicking on the tab page
var tabStatusList = new Array();

var allWinList = {
		"Console": {app: "", url: "webmbtConsole.html"},
		"FileList": {app: "ide", url: "webmbtFileList.html"},
		"Model": {app: "ide", url: "ModelEditor.html"},
		"Monitor": {app: "ide", url: "webmbtMonitor.html"},
		"MScript": {app: "ide", url: "MScriptEditor.html"},
		"MScriptLog": {app: "", url: "log/mscript.log"},
		"ScreenShot": {app: "ide", url: "webmbtScreenList.html"},
		"SeqTrace": {app: "ide", url: "webmbtMbtTrans.html"},
		"ServerLog": {app: "", url: "log/webmbtServer.log"},
		"Stats": {app: "ide", url: "ExecStat.html"},
		"UIMap": {app: "ide", url: "webmbtUIMap.html"},
		"Vars": {app: "ide", url: "webmbtVars.html"},
		"WinUIALog": {app: "", url: "log/UIA_Agent.log"},
		
 		"ServerList": {app: "svrMgr", url: "ServerList.html"},
		"ServerStats": {app: "svrMgr", url: "ServerUsage.html"},
		"LicenseKeys": {app: "svrMgr", url: "ServerLicenseList.html"},
		"ModelList": {app: "svrMgr", url: "ServerModelList.html"},
		"ExecBatch": {app: "svrMgr", url: "ServerExecBatchList.html"}
	}

var tabGroupList = new Array();

function initTabLayoutFromCookie () {
	try {
		for (i in tabGroupList) {
			var tabGroupID = tabGroupList[i].tabGroup;
			var cTemp = $.cookie("TO_" + tabGroupID);
			if (cTemp==null || cTemp==undefined || cTemp == "null") {
				continue;
			}
			else if (cTemp=="empty") {
				tabGroupList[i].tabList = new Array();
			}
			else {
				tabGroupList[i].tabList = cTemp.split(",");
			}
		}
	}
	catch (err) {
	}
}


function saveTabLayout () {
	// purge out empty tab entries
	for (var i in tabGroupList) {
		var tabGroupDef = tabGroupList[i];
		var newTabList = new Array();
		for (var j in tabGroupDef.tabList) {
			if (tabGroupDef.tabList[j]==null || tabGroupDef.tabList[j]=="") continue;
			newTabList[newTabList.length] = tabGroupDef.tabList[j];
		}
		tabGroupDef.tabList = newTabList;
	}

	for (i in tabGroupList) {
		var cTemp = tabGroupList[i].tabList.join(",");
		if (cTemp=="") cTemp = "empty";
		$.cookie("TO_" + tabGroupList[i].tabGroup, cTemp, {expires: 30});
	}
}


function isTabGroupEmpty(tabGroupID_p) {
	for (var i in tabGroupList) {
		var tabGroupDef = tabGroupList[i];
		if (tabGroupDef.tabGroup == tabGroupID_p) {
			return tabGroupDef.tabList.length<=0;
		}
	}
	return true;
}


var winCallbackFuncList = {};
var winList = new Array();

function addTabGroup(tabGroupID_p) {
	if (getTabGroupSize(tabGroupID_p)>0) return;
	
	// update tabGroupList from cookie setting
	for (i in tabGroupList) {
		var tabGroup = tabGroupList[i].tabGroup;
		if (tabGroup == tabGroupID_p) {
			initTabGroup(tabGroup, tabGroupList[i].detachable);
			var tabList = tabGroupList[i].tabList;
			for (j in tabList) {
				if (tabList[j]==null || tabList[j]=="") continue;
				addTab(tabGroup, tabList[j]);
			}
		}
	}
}

function getTabGroupDef (tabGroup_p) {
	for (i in tabGroupList) {
		var tabGroup = tabGroupList[i].tabGroup;
		if (tabGroup_p==tabGroup) return tabGroupList[i];
	}
	return null;
}

function initTabGroup(tabGroup_p, detachable_p) {
	$("#" + tabGroup_p).tabs();
	var htmlCode = "";
	if (detachable_p) {
		htmlCode = '<li id="tab_#{label}" class="tabLabel"><a href="#{href}">#{label}</a><img title="open in a new window or tab (depending on your browser setting)" src=\'img/expand.png\' onclick=\'tabToWin("' + tabGroup_p + '","#{label}");\'/></li>';
	}
	else {
		htmlCode = '<li id="tab_#{label}" class="tabLabel"><a href="#{href}">#{label}</a></li>';
	}
	$("#" + tabGroup_p).tabs({ tabTemplate: htmlCode ,
		select: function (event, ui) {
			var tabID2 = $(ui.panel).attr("id");
			var cb = getWinCallbackFunc(tabID2);
			if (cb) {
				cb.call(this, "display");
			}
			if (tabGroup_p == "paneLeft") {
				if (tabID2=="Model" && ($.browser.opera || $.browser.mozilla)) {
					$(".zoom").show();
				}
				else {
					$(".zoom").hide();
				}
			}
		}
	});
	
}


function addTab (tabGroup_p, tabID_p) {
	var frameSrc = allWinList[tabID_p].url;
	if (frameSrc==undefined || frameSrc=="") return;
	if (findTabGroup(tabID_p)!=null) return false;
	var htmlCode = "<iframe src='" + frameSrc + "' name='" + tabID_p + "' id='" + tabID_p + "' frameborder='0' style='width:100%;padding:0px;margin:0px;overflow:hidden;'></iframe>";
	$("#" + tabGroup_p + " .tabCnt").append (htmlCode);
	var tabIdx = $("#" + tabGroup_p).tabs("length");
	$("#" + tabGroup_p).tabs("add", "#" + tabID_p, tabID_p);
	if (tabStatusList[tabID_p]) {
		if (!tabStatusList[tabID_p].enabled) {
			$("#" + tabGroup_p).tabs("disable", tabIdx);
		}
	}
	else {
		tabStatusList[tabID_p] = new TabStatus(tabID_p, frameSrc);
	}
	
	windowResized();

	$("#tab_" + tabID_p).dblclick(function() {
		minMaxPane(tabGroup_p);
	});
	
	$("#tab_" + tabID_p).click(function() {
		windowResized();
	});
	
	var tabAdded = false;
	var tabGroupDef = null;
	for (i in tabGroupList) {
		if (!tabAdded && tabGroupList[i].tabGroup==tabGroup_p) {
			tabGroupDef = tabGroupList[i];
			for (j in tabGroupDef.tabList) {
				if (tabGroupDef.tabList[j]==null || tabGroupDef.tabList[j]!=tabID_p) continue;
				tabAdded = true;
				break;
			}
		}
	}
	if (!tabAdded) {
		tabGroupDef.tabList.push(tabID_p);
	}	
	return true;
}

function deleteTab (tabID_p) {
	var tabGroup = findTabGroup(tabID_p);
	if (tabGroup==null) return;
	$("#" + tabGroup).tabs("remove", findTabIndex(tabGroup, tabID_p));
	for (i in tabGroupList) {
		if (tabGroupList[i].tabGroup==tabGroup) {
			var tabGroupDef = tabGroupList[i];
			for (j in tabGroupDef.tabList) {
				if (tabGroupDef.tabList[j]==null || tabGroupDef.tabList[j]!=tabID_p) continue;
				tabGroupDef.tabList[j]=null;
				return;
			}
		}
	}
	return;
}


function enableTab(tabGroup_p, tabID_p) {
	var tabIdx = findTabIndex(tabGroup_p, tabID_p);
	$("#" + tabGroup_p).tabs("enable", tabIdx);
	tabStatusList[tabID_p].enabled = true;
}

function disableTabForWin(winID_p) {
	var tabGroup = findTabGroup(winID_p);
	var tabDisabled = disableTab (tabGroup, winID_p);
}


function disableTab(tabGroup_p, tabID_p) {
	if (isTabSelected(tabID_p)) {
		if (!selectOtherTab(tabGroup_p, tabID_p)) {
			return false;
		}
	}
	var tabIdx = findTabIndex(tabGroup_p, tabID_p);
	$("#" + tabGroup_p).tabs("disable", tabIdx);
	if (tabStatusList[tabID_p]) tabStatusList[tabID_p].enabled = false;
	return true;
}

function findTabGroup(tabID_p) {
	var ret = null;
	$(".tabGroup").each(function(i) {
		var tabGroup = $(this).attr("id");
		if ($(this).find("a[href=#" + tabID_p + "]").length>0) {
			ret = tabGroup;
		}
	});
	return ret;
}


// returns true if window/tab is currently open
function selectWin(winID_p) {
	var tabGroup = findTabGroup (winID_p);
	if (tabGroup && !isTabDisabled(winID_p)) {
		selectTab(winID_p);
		return true;
	}
	else {
		if (winList[winID_p]) {
			winList[winID_p].focus();
			return true;
		}
	}
	return false;
}

function closeAllWin() {
	for (i in winList) {
		if (winList[i]) {
			try { winList[i].close();} catch(err) {};
		}
	}
	winList = new Array();
}

function checkWinClosedAndRestoreTab() {
	for (var winName in winList) {
		if (winList[winName]) {
			if (winList[winName].closed) {
				winList[winName] = undefined;
				try { winList[winName].close();} catch(err) {};
				restoreTab(winName);
			}
		}
	}
}


function addWin(winObj, winName) {
//	if (winList[winName]) {
//		closeWin(winName);
//	}
	winList[winName] = winObj;
	winObj.focus();
}

function regWin(winObj, frameName_p, cbFunc_p) {
	winList [frameName_p] = winObj;
	winCallbackFuncList [frameName_p] = cbFunc_p;
}


function getWinCallbackFunc(frameName_p) {
	if (winCallbackFuncList[frameName_p]) {
		return winCallbackFuncList[frameName_p];
	}
	else if (window.frames[frameName_p]) {
		return window.frames[frameName_p].mainCallbackFunc;
	}
	else {
		return null;
	}
}

function regWinCallbackFunc(frameName_p, winCB_p) {
//	closeWin(frameName_p);
	winCallbackFuncList[frameName_p] = winCB_p;
}

function removeWinCallbackFunc(frameName_p) {
	winCallbackFuncList[frameName_p] = null;
}

function restoreTab(frameName_p) {
	removeWinCallbackFunc(frameName_p);
	var tabGroupID = findTabGroup(frameName_p);
	if (tabGroupID==null || tabGroupID=="") return;
	
	enableTab(tabGroupID, frameName_p);
	selectTab(frameName_p);
	refreshTab(frameName_p);
}

function closeWin(frameName_p) {
	if (frameName_p) {
		try {
			if (winList[frameName_p]) {
				winList[frameName_p].close();
			}
			winList[frameName_p] = undefined;
		}
		catch (err) {
			winList[frameName_p] = undefined;
		}
		winCallbackFuncList [frameName_p] = undefined;
		return;
	}
	
	for (var i in winList) {
		
		if (winList[i]) {
			try {
				winList[i].close();
				winList[i] = undefined;
			}
			catch (err) {
				winList[i] = undefined;
			}
			winCallbackFuncList [winList[i]] = undefined;
		}
	}
}


function runWinAction(frameName_p, action_p, params_p) {
	var cb = getWinCallbackFunc(frameName_p);
	if (cb) {
		return cb.apply(this, [action_p, params_p]);
	}
	else return null;
}

function runWinActionOnAllWins(action_p, params_p) {
	for (i in winCallbackFuncList) {
		if (winCallbackFuncList[i]) {
			try { winCallbackFuncList[i].apply(this, [action_p, params_p]);} 
			catch(err) {
//				alert(i + ":" + err);
			};
			
		}
	}
}

function selectOtherTab(tabGroup_p, tabID_p) {
	if (!isTabSelected(tabID_p)) return true;
	for (i in tabGroupList) {
		if (tabGroupList[i].tabGroup != tabGroup_p) continue;
		var aTabList = tabGroupList[i].tabList;
		for (j in aTabList) {
			if (aTabList[j]!=null && aTabList[j]!=tabID_p && !isTabDisabled(aTabList[j])) {
				selectTab(aTabList[j]);
				return true;
			}
		}
	}
	return false;
}

function getActiveTabCount (tabGroup_p) {
	var cnt = 0;
	for (i in tabGroupList) {
		if (tabGroupList[i].tabGroup != tabGroup_p) continue;
		var aTabList = tabGroupList[i].tabList;
		for (j in aTabList) {
			if (aTabList[j]!=null && !isTabDisabled(aTabList[j])) {
				cnt += 1;
			}
		}
	}
	return cnt;
}

function isTabSelected(tabID_p) {
	for (i in tabGroupList) {
		var selectedTabID = getSelectedTabID(tabGroupList[i].tabGroup);
		if (selectedTabID==tabID_p) return true;
	}
	return false;
}

function findTabIndex(tabGroup_p, tabID_p) {
	var ret = -1;
	$("#" + tabGroup_p + " li a").each(function(i) {
		if ($(this).attr("href")=="#" + tabID_p) {
			ret = i; 
		}
	});
	
	return ret;
}

function getTabGroupSize(tabGroup_p) {
	return $("#" + tabGroup_p + " li a").size();
}

function getTabID(tabGroup_p, tabIdx_p) {
	var elem = $("#" + tabGroup_p + " ui:nth-child(" + (tabIdx_p+1) + ")");
	if (elem) {
		var href2 = $(elem).find("a").attr("href");
		if (href2==undefined || href2=="") return null;
		return href2.substring(1);
	}
	else return null;
}

function getSelectedTabID(tabGroup_p) {
	var selectedTab = $('#' + tabGroup_p + " .ui-state-active");
	var href2 = $(selectedTab).find("a").attr("href");
	if (href2) return href2.substring(1);
	else return null;
}

function selectTab (tabID_p) {
	var tabGroup = findTabGroup (tabID_p);
	if (tabGroup==null) return;

	var tabIdx = findTabIndex(tabGroup, tabID_p);
	if (tabIdx < 0) return;	
	
	$("#" + tabGroup).tabs("option", 'active', tabIdx);
}



function isTabDisabled(tabID_p) {
	if (tabStatusList[tabID_p] && !tabStatusList[tabID_p].enabled) return true;
	else return false;
}

function removeTab (tabGroup_p, tabID_p) {
	var tabGroup = findTabGroup (tabID_p);
	if (tabGroup==null) return false;
	
	var tabIdx = findTabIndex(tabGroup, tabID_p);
	if (tabIdx < 0) return false;	
	
	$("#" + tabGroup).tabs("remove", tabIdx);
	
	winCallbackFuncList[tabID_p] = undefined;
	return true;
}


function tabToWin (tabGroup_p, tabID_p) {
	if (isTabDisabled(tabID_p)) {
		return; // tab disabled, can not max
	}
	else if (getActiveTabCount(tabGroup_p) <= 1) {
		alertDialog ("Single tab may not be opened in new window. Please add other tab to the pane and try again.");
	}
	else {
	 	openWin(tabID_p);
	}
}

TabStatus = function(tabID_p, frameSrc_p) {
	this.tabID = tabID_p;
	this.enabled = true;
	this.frameSrc = frameSrc_p;
}


function setupSideBarButtons(elems) {
//	$(elems).hover(function(){$(this).css("background-color", "#DDDDDD");}, function(){$(this).css("background-color", "")});
//	$(elems).mousedown(function(){$(this).css("background-color", "#AAAAAA");})
//			.mouseup(function(){$(this).css("background-color", "");});
}

function refreshTab (tabID_p) {
	$("#" + tabID_p).attr("src", $("#" + tabID_p).attr("src"));
}

function refreshTabGroup (tabGroup_p) {
	var selectedTabID = getSelectedTabID(tabGroup_p);
	if (!selectedTabID) return;
	
	refreshTab(selectedTabID);
}

function refreshFrame(frameID_p) {
	$("#" + frameID_p).attr("src", $("#" + frameID_p).attr("src"));
}

function openWin (winID_p) {
//	var tabGroup = findTabGroup (winID_p);
//	if (tabGroup) {
//		disableTab(tabGroup, winID_p);
//	}
	
	closeWin(winID_p);
	var winURL ="/MbtSvr/" + allWinList[winID_p].url;
	var winObj = window.open(winURL, "_" + winID_p);
	addWin(winObj, winID_p);
}

function refreshWin(winID_p) {
	var tabGroup = findTabGroup (winID_p);
	if (tabGroup==null || isTabDisabled(winID_p)) {
//		closeWin(winID_p);
//		openWin(winID_p);
		win = winList[winID_p].location.reload();
		
	}
	else {
		selectTab(tabGroup, winID_p);
		refreshTab(winID_p);
	}
}


function openWebPage (url_p, winID_p) {
	var winObj = window.open(url_p, winID_p);
	addWin(winObj, winID_p);
	winObj.focus();
}