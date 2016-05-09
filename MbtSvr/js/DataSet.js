// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtDataSet.js

// known limitation: field values, names, etc can not contain http reserved char & or =.

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parent.handleJsError(errMsg, fileName, lineNum);
}

var scrollFaceBox = true;
var curNodeData;

//predefined lists for options. group 0 does not participate in algorithm, blank for individual field.
var groupOptions = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "V"];


function resetDSLogic () {
  	var alg = $("#algorithm").val();
	if (alg=="DataSource") {
		$(".devOnly").hide();
		$(".comDS").hide();
		$(".extDS").show();
		readOnly = " readonly ";
	}
	else {
		$(".devOnly").show();
		$(".comDS").show();
		$(".extDS").hide();
		readOnly = "";
	}
}

$(document).ready(function() {
	$(".btn img").hover(function(){ $(this).addClass("actionBtnHover");}, function(){ $(this).removeClass("actionBtnHover");});
	
	curNodeData = parent.curAppState.curPropNodeData;
	loadDS();

    $("#dsName").change(function() {
		parent.sendAction("transDS", "cmd=setDsName&uid=" + curNodeData.uid + "&dsName=" + $(this).val(), function(data) {
			if (data.error) {
				alertDialog(data.error);
				return;
			}
			curNodeData.dataset = $(this).val();
			parent.saveProperty(curNodeData);
			parent.setModelChanged(true);
		});
    });

    $("#autoRefresh").change(function() {
    	var thisChecked = $(this).is(":checked");
		parent.sendAction("transDS", "cmd=setAutoRefresh&uid=" + curNodeData.uid + "&autoRefresh=" + thisChecked, function(data) {
			if (data.error) {
				alertDialog(data.error);
				return;
			}
		});
    });


    $("#algorithm").change(function() {
    	var alg = $(this).val();
		parent.sendAction("transDS", "cmd=setAlgorithm&uid=" + curNodeData.uid + "&algorithm=" + alg, function(data) {
			if (data.error) {
				alertDialog(data.error);
				return;
			}
			resetDSLogic();
			loadDS();
		});
    });
    
    $("#randRetrieval").change(function() {
    	
    	var thisChecked = $(this).is(":checked");
		parent.sendAction("transDS", "cmd=setRandRetrieval&uid=" + curNodeData.uid + "&random=" + thisChecked, function(data) {
			if (data.error) {
				alertDialog(data.error);
				return;
			}
		});
    });
    
    resetDSLogic();
    
//	parent.sendAction("transDS", "cmd=getUserFuncList", processUserFuncList);
});


function countVerifyField() {
	var cnt = 0;
	$("#dsFieldListBody .group").each(function() {
		var thisVal = $(this).val();
		if (thisVal=="V") {
			cnt += 1;
		}
	});
	return cnt;
}

function loadDS() {
	if (curNodeData==undefined) return;
	var showStartRowNum = $("#startRowNum").val().trim();
	if (showStartRowNum!="") {
		showStartRowNum -= 1;
	}
	var showEndRowNum = $("#endRowNum").val().trim();
	if (showEndRowNum!="") {
		showEndRowNum -= 1;
	}
	
	parent.sendAction("transDS", "cmd=getDS&uid=" + curNodeData.uid + "&showStartRowNum=" + showStartRowNum + "&showEndRowNum=" + showEndRowNum, function(dataset_p) {
			displayDS(dataset_p);
			displayData(dataset_p);
		});
}


var readOnly = "";
function displayDS (dataset_p) {
	if (dataset_p.error) {
		alertDialog(dataset_p.error);
		return;
	}
	
	if (dataset_p==undefined) {
		return;
	}

	$("#dsTableHead tr").remove();
	$("#dsTableBody tr").remove();
	$("#dsFieldListBody tr").remove();
	$("#dsName").val(dataset_p.dsName);
	$("#extDSName").text(dataset_p.extDsName);
	if (dataset_p.algorithm=="DataSource") {
		readOnly = " readonly ";
	}
	$("#algorithm").val(dataset_p.algorithm);
	if (dataset_p.persist) {
		$("#persist").attr("checked", true);
	}
	if (dataset_p.random) {
		$("#randRetrieval").attr("checked", true);
	}

	if (dataset_p.autoRefresh) {
		$("#autoRefresh").attr("checked", true);
	}
	
	var htmlCode = htmlCode + "<tr>";
	var fieldObj;
	var idx;
	var fieldList = dataset_p.fields;

	// field list 
	htmlCode = "";
	for (idx=0; idx<fieldList.length; idx++) {
		fieldObj = fieldList[idx];
		var curFieldGroup = fieldObj.fieldgroup;
		var fieldClass = "";
		if (fieldObj.fieldName=="_partField") fieldClass = "class=hideField";
		htmlCode = '<tr ' + fieldClass + '><td valign=top><img class="del comDS" src="img/delete.png"/></td><td valign=top><input class="fName" /></td><td valign=top>' 
			   + '<select class="group" /></td><td><textarea class="domain" rows=3 cols=40></textarea></td></tr>';
		var fieldElem = $(htmlCode).appendTo("#dsFieldListBody");
		$(fieldElem).attr("idx", idx);
		$(fieldElem).find(".fName").val(fieldObj.fieldName).change(function() {
			var fIdx = $(this).parent().parent().attr("idx");
			parent.sendAction("transDS", "cmd=renField&uid=" + curNodeData.uid + "&index=" + fIdx + "&fieldName=" + $(this).val(), function(data) {
				if (data.error) {
					alertDialog(data.error);
					return;
				}
			});
		});

		var selElem = $(fieldElem).find(".group");
		var selOpt;
		if (selElem.prop) {
			selOpt = selElem.prop("options");
		}
		else {
			selOpt = selElem.attr("options");
		}
		for (var i in groupOptions) {
			selOpt[selOpt.length] = new Option(groupOptions[i], groupOptions[i]);
		}
		$(selElem).val(fieldObj.group);
		$(selElem).change(function() {
			var fIdx = $(this).parent().parent().attr("idx");
			parent.sendAction("transDS", "cmd=setFieldGroup&uid=" + curNodeData.uid + "&index=" + fIdx + "&group=" + $(this).val(), function(data) {
				if (data.error) {
					alertDialog(data.error);
					return;
				}
			});
		});

		$(fieldElem).find(".domain").val(fieldObj.domain.join("\n")).change(function() {
			var fIdx = $(this).parent().parent().attr("idx");
			parent.sendAction("transDS", "cmd=setFieldDomain&uid=" + curNodeData.uid + "&index=" + fIdx + "&domain=" + encodeURIComponent($(this).val()), function(data) {
				if (data.error) {
					alertDialog(data.error);
					return;
				}
			});
		});
		
		$(fieldElem).find("img.del").click(function() {
			var fIdx = $(this).parent().parent().attr("idx");
			parent.sendAction("transDS", "cmd=delField&uid=" + curNodeData.uid + "&index=" + fIdx, function(data) {
				if (data.error) {
					alertDialog(data.error);
					return;
				}
				if ($("#dsFieldListBody tr").size()<=1) {
					curNodeData.dataset = "";
					parent.refreshUID(curNodeData.uid);
				}
				loadDS();
			});
		});
	}
	
	resetDSLogic();
}


function addField () {
	parent.sendAction("transDS", "cmd=addField&uid=" + curNodeData.uid + "&fieldName=xxx", function(data) {
		if (data.error) {
			alertDialog(data.error);
			return;
		}
		parent.refreshUID(curNodeData.uid);
		loadDS();
	});
}


function genData() {
	parent.sendAction("transDS", "cmd=genData&uid=" + curNodeData.uid, displayData);
}

function displayData(dataset_p) {
	$("#dsTableHead tr").remove();
	$("#dsTableBody tr").remove();

	$("#showTotal").text(dataset_p.totalRowCount);
	if (dataset_p.startRowNum!=undefined) {
		$("#startRowNum").val(parseInt(dataset_p.startRowNum)+1);
	}
	if (dataset_p.endRowNum!=undefined) {
		$("#endRowNum").val(parseInt(dataset_p.endRowNum)+1);
	}
	
	var htmlCode = '<tr><th class="{sorter: false}"></th><th align=right class="header"></th>';

	$("#dsFieldListBody .fName").each(function() {
		var fieldName = $(this).val();
		if (fieldName=="_partField") fieldName = "Partition";
		htmlCode = htmlCode + '<th align=left class="header"><span>' + fieldName + '</span></th>';
	});
	htmlCode = htmlCode + "</tr>";
	$(htmlCode).appendTo("#dsTableHead");

	htmlCode = "";
	var rowRecord;
	var rowIdx;
	for (rowIdx in dataset_p.rows) {
		rowIdx = parseInt(rowIdx);
//		if (rowIdx<=0) continue;
		rowRecord = dataset_p.rows[rowIdx];
		var shadeClass = "";
		if (parent.isShade(rowIdx)) shadeClass="class=shade";
		htmlCode = "<tr " + shadeClass + " rowIdx='" + (rowIdx+dataset_p.startRowNum) + "'><td><img class='delDataRow comDS' src='img/delete.png'/></td><td valign=top>" + (rowIdx+1+dataset_p.startRowNum) + "</td>";
		for (var fIdx in rowRecord) {
			htmlCode += "<td valign=top fieldIdx='" + fIdx + "'><span class=hidden>" + rowRecord[fIdx] + "</span><input type=text value=\"" + rowRecord[fIdx] + "\"" + readOnly + "/></td>";
		}
		htmlCode += "</tr>";
		var dataRow = $(htmlCode).appendTo("#dsTableBody");
		$(dataRow).find("img.delDataRow").click(function() {
			var rowIdx = $(this).parent().parent().attr("rowIdx");
			parent.sendAction("transDS", "cmd=delDataRow&uid=" + curNodeData.uid + "&rowIdx=" + rowIdx, function(data) {
				if (data.error) {
					alertDialog(data.error);
					return;
				}
				loadDS();
			});
		});
		
	}
	
	$("#dsTableBody input").change(function(){
		var rowIdx = $(this).parent().parent().attr("rowIdx");
		var fieldIdx = $(this).parent().attr("fieldIdx");
		$(this).prev().html($(this).val());
		$(this).parents("table").trigger("update");
	 	parent.sendAction("transDS", "cmd=setFieldValue&uid=" + curNodeData.uid + "&rowIdx=" + rowIdx + "&fieldIdx=" + fieldIdx
				+ "&newVal=" + $(this).val(),
				function(data) {
			if (data.error) {
				alertDialog(data.error);
				return;
			}
		});
	});
	
	$("#dsTable").tablesorter();
}


function addDataRow () {
	parent.sendAction("transDS", "cmd=addDataRow&uid=" + curNodeData.uid, function(data) {
		if (data.error) {
			alertDialog(data.error);
			return;
		}
		loadDS();
	});
}


function regen() {
	$("#startRowNum").val("");
	$("#endRowNum").val("");
	parent.sendAction("transDS", "cmd=genData&uid=" + curNodeData.uid, function(data) {
		if (data.error) {
			alertDialog(data.error);
			return;
		}
		setTimeout(loadDS, 50);
	});
}



function importDS () {
	var extDsName = $("#extDSName").text();
	parent.promptDialog ("Import URI: <hr/>Enter file name to import the data. File extension is used to determine the file type, for example: .csv, .txt, .xls. By default first sheet is read from .xls file, use 'file.xls;sheetname' to read specific sheet from .xls file.  Files must reside in /dataset/ folder. <br/>If importing dataset created with DataDesigner, enter dataset name with file extension '.ds'.<br/>You can also import other data sources like database and url, see <a href='http://testoptimal.com/doku/doku.php?id=dataset_editor&s[]=transition&s[]=dataset#dataset_import' target=_blank>Transition Dataet Import</a> for more details.", extDsName, function() {
		var newExtDsName = parent.getPromptVal();
		if (newExtDsName==extDsName) return;
		parent.sendAction("transDS", "cmd=importDS&uid=" + curNodeData.uid + "&extDsName=" + newExtDsName, 
				function(retData) {
			if (retData.error) {
				parent.alertDialog(retData.error);
			}
			else loadDS();
		});
	});
	
}

