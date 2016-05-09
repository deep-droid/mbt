// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtFileLst.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

var curFolder = "";
var ctxMenuColor = "#111111";
var ctxMenuBkgColor = "#DCE9F0";
var ctxMenuHoverColor = "#000000";
var ctxMenuHoverBkgColor = "#F2F7FA";

var modelCtxMenuBindings = {
	'menuID': 'ctxMenuModel',
	'restoreFile': function(ui) {
		var fileIdx = $(ui).attr("id");
		restoreFile(fileIdx);
	},
	'deleteFile': function(ui) {
		var fileIdx = $(ui).attr("id");
		deleteFile(fileIdx);
	},
	'copyNode': function(ui) {
		var fileIdx = $(ui).attr("id");
		copyNode(fileIdx);
	},
	'asyncExec': function(ui) {
		var fileIdx = $(ui).attr("id");
		asyncExec(fileIdx);
	},
	'deployModel': function(ui) {
		var fileIdx = $(ui).attr("id");
		deployModel(fileIdx);
	},
	'onShowMenu': function (e, menu) {
		if (!parent.curAppState.nodeDataList["config"].conSvrMgr) {
			$(menu).find("#deployModelMenu").hide();
		}
		
		if (!fromNodeName) {
			$(menu).find(".reqModel").hide();
		}
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


var headerCtxMenuBindings = {
	'menuID': 'ctxMenuCurFolder',
	'pasteToCurFolder': function(ui) {
		var fileIdx = $("#curFolder").html();
		pasteToFolder(fileIdx);
	},
	'moveToCurFolder': function(ui) {
		var fileIdx = $("#curFolder").html();
		moveToFolder(fileIdx);
	},
	'batchRun': function(ui) {
		var fileIdx = $("#curFolder").html();
		batchRun(fileIdx);
	},
	'batchDeploy': function(ui) {
		batchDeploy();
	},
	'onShowMenu': function (e, menu) {
		if (!parent.curAppState.nodeDataList["config"].conSvrMgr) {
			$(menu).find("#batchDeployMenu").hide();
		}
		
		if (!fromNodeName) {
			$(menu).find(".reqModel").hide();
		}
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



var folderCtxMenuBindings = {
	'menuID': 'ctxMenuFolder',
	'deleteFolder': function(ui) {
		var fileIdx = $(ui).attr("id");
		deleteFolder(fileIdx);
	},
	'pasteToFolder': function(ui) {
		var fileIdx = $(ui).attr("id");
		pasteToFolder(fileIdx);
	},
	'moveToFolder': function(ui) {
		var fileIdx = $(ui).attr("id");
		moveToFolder(fileIdx);
	},
	'onShowMenu': function (e, menu) {		
		if (!fromNodeName) {
			$(menu).find(".reqModel").hide();
		}
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


var dsCtxMenuBindings = {
	'menuID': 'ctxMenuDS',
	'deleteDS': function(ui) {
		var fileIdx = $(ui).attr("id");
		deleteDS(fileIdx);
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

function reset() {
// nothing
}

$(document).ready(function() {
	initFrame("FileList");
	if (parent.isRuntime()) {
			$(".devOnly").hide();
	}
	else {
		$(".rtOnly").attr("disabled", true);
	}

	$(".btn img").hover(function(){ $(this).addClass("actionBtnHover");}, function(){ $(this).removeClass("actionBtnHover");});
	
	$("#fileHeader").contextMenu(headerCtxMenuBindings.menuID,  {
			bindings: headerCtxMenuBindings,
			'onShowMenu': headerCtxMenuBindings.onShowMenu,
	    	'menuStyle': headerCtxMenuBindings.menuStyle,
	    	'listingStyle': headerCtxMenuBindings.itemStyle,
	    	'itemHoverStyle': headerCtxMenuBindings.itemHoverStyle
	    })

	$("#curFolder").contextMenu(headerCtxMenuBindings.menuID,  {
			bindings: headerCtxMenuBindings,
			'onShowMenu': headerCtxMenuBindings.onShowMenu,
	    	'menuStyle': headerCtxMenuBindings.menuStyle,
	    	'listingStyle': headerCtxMenuBindings.itemStyle,
	    	'itemHoverStyle': headerCtxMenuBindings.itemHoverStyle
	    })
    
    $("#searchField").enterKey(searchModel);
    adjustHeight();
	display();
});

function display(refresh_p) {
	searchMode = false;
	parent.sendAction("mbtFileList", "curFolder=" + curFolder, function (data) {
		if (parent.actionCallback(data)) return;
		curFolder = data.curFolder;
		showFileList(data.modelList, data.security);
	});
	
}

function searchModel () {
	var searchVal = $("#searchField").val();
	if (searchVal=="") return;
	
	parent.sendAction("mbtFileList", "type=search&pattern=" + searchVal, function (data) {
		if (parent.actionCallback(data)) return;
		curFolder = data.curFolder;
		searchMode = true;
		showFileList(data.modelList, data.security);
	});
}

function removeFile(file_p) {
	for (i in fileList) {
		if (fileList[i].fname==file_p) {
			$("#"+i).remove();
			return;
		}
	}
}

var fileList = new Array();
var searchMode = false;

function showFileList (fileList_p, securityEnabled) {
	fileList = fileList_p;
	$("#fileTable > *").remove();
	$("<thead><tr style='background-color: #F4F1E8;'><th>&nbsp;</th>"
		+ "<th align='left' class='modelname' width='60%'>&nbsp;Model Name</th>"
		+ "<th align='left' class='plugin' width='25%'>&nbsp;Plugin</th>"
		+ "<th align='left' class='lastmodified {sorter: \'text\'}' width='10%' nowrap>&nbsp;Modified Date</th></tr></thead><tbody id='filelist'></tbody>").appendTo("#fileTable");
	
	var trObj;
	$(".folderCtl").hide();
	if (searchMode) {
		var curTmp = curFolder;
		if (curTmp=="") curTmp = "Root";
		$("#gotoFolder .folderPath").html(curTmp);
		$("#gotoFolder").show();
	}
	else if (curFolder=="") {
		$("#curFolder").html("Root").show();
	}
	else {
		$("#curFolder").html(curFolder).show();
		$("#upFolder").show();
	}

	for (i in fileList_p) {
//		var shadeClass="";
//		if (parent.isShade(i)) shadeClass="shade";
		
//		fileList[i] = fileList_p[i].fname;
		var fileObj = fileList_p[i];
		
		var modelTypeChar = "";
		var imgTag = "model.png";
		var typeC = "m";
		var titleTxt = "title='Path: " + fileObj.path + ";\n";
		if (fileList_p[i].type=="modelArch") {
			modelTypeChar = "arch";
			imgTag = "modelArch.png";
			typeC = "a";
			titleTxt += "Type: arch;\n";
		}
		else if (fileList_p[i].type=="folder") {
			imgTag = "folder.png";
			typeC = "f";
			titleTxt += "Type: folder;\n";
		}
		else if (fileList_p[i].type=="dataset") {
			imgTag = "dataset.png";
			typeC = "d";
			titleTxt += "Type: dataset;\n";
		}
		else {
			titleTxt += "Type: model;\n";
		}
		titleTxt += "Last Modified: " + fileObj.lastmodified + ";\n";
		titleTxt += "Plugin(s): " + fileObj.plugins;
		titleTxt += "'";
		
		var optionalPath = "";
		if (searchMode) optionalPath = "<span class='path'>(" + fileObj.path + ")</span>";
		
		var modelPath = fileObj.path;
		if (modelPath=="") modelPath = "Root";
		var plugins = fileObj.plugins;
		if (plugins.length>0) {
			plugins = "<span class=plugins>" + plugins + "</span>";
		}
		
		imgTag = "<img src='img/" + imgTag + "' " + titleTxt + "/>";
		trObj = "<tr id='" + i + "' class='file " + fileObj.type + "' fileType='" + typeC + "'>" 
			  + "<td>" + imgTag + "</td><td class='fileItem' style='padding-top: 4px'>" + fileObj.fname + optionalPath + "</td>"
			  + "<td style='padding-top: 4px'>" + plugins + "</td><td style='padding-top: 4px' nowrap>" + fileObj.lastmodified + "</td></tr>";
		if (fileObj.fname=="_dataSetLib") {
			$("#filelist tr:first").before($(trObj));
		}
		else {
			$(trObj).appendTo($("#filelist"));
		}
	}

	$("#fileTable").tablesorter(
		{
			textExtraction:function(s){
		        if($(s).find('img').length == 0) return $(s).text();
		        return $(s).find('img').attr('src');
	        }
		}
	);
		
	$("tr.file").click(function () {
		$(this).removeClass("hover");
		$(this).removeClass("selected");
		$(this).addClass("selected");
		openFile($(this).attr("id"));
	});
    
	$("tr.model").contextMenu(modelCtxMenuBindings.menuID,  {
		bindings: modelCtxMenuBindings,
		'onShowMenu': modelCtxMenuBindings.onShowMenu,
    	'menuStyle': modelCtxMenuBindings.menuStyle,
    	'listingStyle': modelCtxMenuBindings.itemStyle,
    	'itemHoverStyle': modelCtxMenuBindings.itemHoverStyle
    });
    
	$("tr.archModel").contextMenu(modelCtxMenuBindings.menuID,  {
		bindings: modelCtxMenuBindings,
		'onShowMenu': modelCtxMenuBindings.onShowMenu,
    	'menuStyle': modelCtxMenuBindings.menuStyle,
    	'listingStyle': modelCtxMenuBindings.itemStyle,
    	'itemHoverStyle': modelCtxMenuBindings.itemHoverStyle
    });
    
	$("tr.folder").contextMenu(folderCtxMenuBindings.menuID,  {
		bindings: folderCtxMenuBindings,
		'onShowMenu': folderCtxMenuBindings.onShowMenu,
    	'menuStyle': folderCtxMenuBindings.menuStyle,
    	'listingStyle': folderCtxMenuBindings.itemStyle,
    	'itemHoverStyle': folderCtxMenuBindings.itemHoverStyle
    });
    
	$("tr.dataset").contextMenu(dsCtxMenuBindings.menuID,  {
		bindings: dsCtxMenuBindings,
		'onShowMenu': dsCtxMenuBindings.onShowMenu,
    	'menuStyle': dsCtxMenuBindings.menuStyle,
    	'listingStyle': dsCtxMenuBindings.itemStyle,
    	'itemHoverStyle': dsCtxMenuBindings.itemHoverStyle
    });
}

var fileId;

function ctxMenuCallback(el) {
	fileId = $(el).parent().attr("id");
	$(".fileItem").removeClass("selected");

	$(".ctxMenuItem").hide();
	
	if (fileId=="fileHeader") {
		$(".ctxMenuItem[selects*='c']").show();
	}
	else {
		$(".ctxMenuItem[selects*='" + $("#" + fileId).attr("fileType") +"']").show();
		$("#" + fileId).find(".fileItem").addClass("selected");
	}
	
	if (!parent.curAppState.nodeDataList["config"].conSvrMgr) {
		$("#deployModelMenu").hide();
	}
	
	if (!fromNodeName) {
		$(".reqModel").hide();
	}
}


function deleteFile(fileIdx_p) {
	parent.confirmDialog(parent.translateMsg("delete.confirm", fileList[fileIdx_p].fname), function () {
		parent.sendAction ("deleteFile", "curFolder=" + curFolder + "&mbtfile=" + fileList[fileIdx_p].fname, function (data) { 
			if (parent.actionCallback(data)) return;
			removeFile(data.deletedfile);
			parent.alertDialog(parent.translateMsg("model.deleted", data.deletedfile));
		});
	});
}


// use delete mbt model for deleting folder for now
function deleteFolder(folderFileIdx_p) {
	parent.confirmDialog(parent.translateMsg("delete.confirm", fileList[folderFileIdx_p].fname), function () {
		parent.sendAction ("deleteFile", "curFolder=" + curFolder + "&mbtfile=" + fileList[folderFileIdx_p].fname, function (data) { 
			if (parent.actionCallback(data)) return;
			removeFile(data.deletedfile);
			parent.alertDialog(parent.translateMsg("model.deleted", data.deletedfile));
		});
	});
}

function deleteDS(fileIdx_p) {
	var fileName = fileList[fileIdx_p].fname;
	parent.confirmDialog(parent.translateMsg("item.delete.confirm", "data set " + fileName), function () {
		parent.sendAction ("combDS", "cmd=delDS&dsName=" + fileName, function (data) { 
			if (data.alertMessage && data.alertMessage=="ok") {
				removeFile(fileName);
				parent.alertDialog(parent.translateMsg("item.deleted", "Data set" + fileName));
			}
			else {
				parent.actionCallback(data);
			}
		});
	});
}

function openFile(curFileID) {
	if (curFileID=="Root") {
		curFolder = "Root";
		display(true);
		return;
	}
	
	if (curFileID=="upFolder") {
		if (curFolder.indexOf("/")<0) curFolder = "Root";
		else curFolder = curFolder.substring(0, curFolder.lastIndexOf("/"));
		display(true);
		return;
	}
	
	if (fileList[curFileID].type=="folder") {
		curFolder = curFolder + "/" + fileList[curFileID].fname;
		display(true);
		return;
	}
	
	if (fileList[curFileID].type=="dataset") {
		curFolder = curFolder + "/" + fileList[curFileID].fname;
		parentWinObj.closeWin("DataDesigner");
		parentWinObj.openDataDesigner("dsName=" + fileList[curFileID].fname);
		return;
	}

	if (parent.isModelChanged()) {
		parent.confirmDialog(parent.translateMsg("model.changed"), function () {
			parent.setModelChanged(false);
			parent.openModel(fileList[curFileID].fname);
		});
	}
	else {
		try{
			parent.openModel(fileList[curFileID].fname);
		}
		catch (err) {
			alert(err);
		}
	}

}

function restoreFile(fileIdx_p) {
	parent.confirmDialog(parent.translateMsg("restore.confirm", fileList[fileIdx_p].fname), function () {
		parent.sendAction("restore", "mbtFile="+fileList[fileIdx_p].fname, function(data) {
			parent.actionCallback(data);
			setTimeout(modelRestored, 100);
		});
	});
}

function getCopyModelName() {
	if (fromNodeType && fromNodeType!="f") {
		return fromNodeName;
	}
}

function modelRestored() {
	parent.alertDialog ('model.restored');
}

var fromNodeName;
var fromNodeType; 
function copyNode(nodeFileIdx_p) {
	var fromNodeID = nodeFileIdx_p;
	fromNodeName = fileList[fromNodeID].fname;
	fromNodeType = $("#" + fromNodeID).attr("fileType");
}

function pasteToCurFolder (folderName_p) {
	if (fromNodeName) {
		var params = "type=copyModel&modelName=" + fromNodeName;
		if (folderName_p) {
			params += "&toFolder=" + folderName_p;
		}
		parent.sendAction("mbtFileList", params, function(data) {
			parent.actionCallback(data);
			fromNodeName = undefined;
			fromNodeType = undefined;
			setTimeout('display(true)', 100);
		});
	}
	else {
		parent.alertDialog("model.notselected");
	}
}


function pasteToFolder (folderFileIdx_p) {
	if (fromNodeName) {
		var params = "type=copyModel&modelName=" + fromNodeName;
		if (fileList[folderFileIdx_p]) {
			params += "&toFolder=" + fileList[folderFileIdx_p].fname;
		}
		else {
			params += "&toFolder=" + folderFileIdx_p;
		}
		parent.sendAction("mbtFileList", params, function(data) {
			parent.actionCallback(data);
			fromNodeName = undefined;
			fromNodeType = undefined;
			setTimeout('display(true)', 100);
		});
	}
	else {
		parent.alertDialog("model.notselected");
	}
}


function moveToFolder (folderFileIdx_p) {
	if (fromNodeName) {
		var params = "type=moveModel&modelName=" + fromNodeName;
		if (fileList[folderFileIdx_p]) {
			params += "&toFolder=" + fileList[folderFileIdx_p].fname;
		}
		else {
			params += "&toFolder=" + folderFileIdx_p;
		}
		parent.sendAction("mbtFileList", params, function(data) {
			parent.actionCallback(data);
			fromNodeName = undefined;
			fromNodeType = undefined;
			setTimeout('display(true)', 100);
		});
	}
	else {
		parent.alertDialog("model.notselected");
	}
}


function moveToCurFolder () {
	if (fromNodeName) {
		var params = "type=moveModel&modelName=" + fromNodeName;
		if (curFolder) {
			params += "&toFolder=" + curFolder;
		}
		parent.sendAction("mbtFileList", params, function(data) {
			parent.actionCallback(data);
			fromNodeName = undefined;
			fromNodeType = undefined;
			setTimeout('display(true)', 100);
		});
	}
	else {
		parent.alertDialog("model.notselected");
	}
}


function cleanFolder (folderName_p) {
	var params = "type=cleanFolder&folder=" + folderName_p;
	parent.sendAction("mbtFileList", params, function(data) {
		parent.actionCallback(data);
	});
}

function batchRun() {
	parent.batchRun();
}


function checkSearch(e) {
  // look for window.event in case event isn't passed in
  if (window.event) { 
  	 e = window.event; 
  }
  if (e.keyCode == 13) {
     $("#searchImg").click();
  }
} 


function asyncExec(fileIdx_p) {
	parent.sendAction ("modelAsyncAction", "cmd=exec&modelList=" + fileList[fileIdx_p].fname + "&statDesc=", function(data) {
		parent.actionCallback(data);
		parent.retrieveSessionMenu();
	});
}

function deployModel(fileIdx_p) {
	parent.submitArchRequest(fileList[fileIdx_p].fname);
}


function batchDeploy () {
	parent.batchDeploy();
}


function adjustHeight() {
	$("#fileMain").css({height: $(window).height() - 32, width: $(window).width()});
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset" || action_p=="cancel") {
		return;
	}
	else if (action_p=="display") {
		display();
	}
	else if (action_p=="close") {
		// nothing
	}
	else if (action_p=="isLoaded") {
		return true;
	}
	else if (action_p=="getCopyModelName") {
		return getCopyModelName();
	}
	else if (action_p=="getCurFolder") {
		return curFolder;
	}
	else {
		alert("FileList - unknown action: " + action_p);
	}
}

