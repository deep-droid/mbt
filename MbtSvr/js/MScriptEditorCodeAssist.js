// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// mScriptCodeAssist.js

// TODO: hover msg for macro, add class
//     add assert.tags options
// 

// var keys = {"uArr": 38, "dArr": 40, "lArr": 37, "rArr": 38, "enter": 13, "tab": 9, "bspace": 8, "keyA": 65, "keyz": 122};
// var keys = {"esc": 27, "space": 32, "enter": 13, "uArr": 38, "dArr": 40, "lArr": 37, "rArr": 38, "enter": 13, "tab": 9, "bspace": 8, "keyA": 65, "keyC": 67, "keyV": 86, "keyz": 122};
// var codeAssistKeys = [keys.uArr, keys.dArr, keys.enter, keys.tab, keys.bspace, keys.lArr];
var reqTagList = new Array(); // loaded by first ctrl-r


var popFieldObj;
var sel;

var mscriptMethodList = new Array();
var tagList = {
	"action": {expr: '<action code=""/>', tooltip: "run mscript expression"},
	"assert": {expr: '<assert value1=""\n\top="eq"\n\tvalue2=""\n\telse=""\n\tpassed=""\n\ttags=""\n\tassertID=""/>', tooltip: "assert a condition and trigger specified failure message if assert fails" },
//	"assertSeqOut": {expr: '<assert passed=""\n\telse=""\n\ttags=""\n\tassertID=""/>', tooltip: "For SeqOut only: prints passed message to expected column with requirement linkage" },
	"comments": {expr: '<!--\n\t\n-->', tooltip: "code comments/description" },
	"dataset": {expr: '<dataset id=""\n\tdb=""\n\tmode="replace"\n\tautorewind="true">\n</dataset>', tooltip: "define a dataset" },
	"db": {expr: '<db connectionstring="jdbc:"\n\tdriverclass=""\n\tid=""\n\tuser=""\n\tpassword="" />', tooltip: "define a db connection" },
	"execSQL": {expr: '<execSQL db="">\n</execSQL>', tooltip: "execute an sql statement" },
	"field": {expr: '<field id="" value="" />', tooltip: "add a field to a rowdata tag" },
	"func": {expr: '<func name="">\n</func>', tooltip: "user defined function" },
	"guard": {expr: '<guard value1=""\n\top="eq"\n\tvalue2=""/>', tooltip: "define guard condition in <i>Guard</i> trigger." },
	"if": {expr: '<if value1=""\n\top="eq"\n\tvalue2="">\n</if>', tooltip: "enclose a set of scripts to run when condition evaluates to true" },
	"if-then-else": {expr: '<if value1=""\n\top="eq"\n\tvalue2="">\n\t<then>\n\t</then>\n\t<else>\n\t</else>\n</if>', tooltip: "specify if/else structure" },
	"log": {expr: '<log message="" level="" />', tooltip: "log a message to mscript log file" },
	"mbt": {expr: '<mbt>\n</mbt>', tooltip: "script holder for all mbt triggers" },
	"rowdata": {expr: '<rowdata>\n</rowdata>', tooltip: "add a row to a dataset" },
	"scriptlet": {expr: '<scriptlet type="SeleniumScript">\n</scriptlet>', tooltip: "execute Selenium IDE Script (copy html tbody content from Selenium IDE) - BETA" },
	"seqout": {expr: '<seqout><output></output></seqout>', tooltip: "write to seqout file" },
	"sql": {expr: '<sql db="">\n</sql>', tooltip: "specify sql statement for db tag" },
	"state": {expr: '<state id="">\n</state>', tooltip: "script holder for all state triggers" },
	"transition": {expr: '<transition event="">\n</transition>', tooltip: "script holder for all transition triggers" },
	"while": {expr: '<while value1=""\n\top="eq"\n\tvalue2=""\n\tmaxLoopNum=""\n\tloopVar=""\n\tlabel="">\n</while>', tooltip: "while loop, may contain other script tags" }
};


var optionList;
var acMethodName = "";
var mScriptMethodKey = "|plugin|sys|";

var tagAttrOptionList = {
		"action.code": mScriptMethodKey,
		"assert.value1": mScriptMethodKey,
		"assert.value2": mScriptMethodKey,
		"assert.op": "|op|",
		"assert.else": mScriptMethodKey,
		"assert.tags": "|reqTag|",
		"assert.passed": mScriptMethodKey,
		"dataset.db": mScriptMethodKey,
		"dataset.autorewind": "|bool|",
		"dataset.mode": "|dsMode|",
		"guard.value1": mScriptMethodKey,
		"guard.value2": mScriptMethodKey,
		"guard.op": "|op|",
		"if.value1": mScriptMethodKey,
		"if.value2": mScriptMethodKey,
		"if.op": "|op|",
		"log.message": mScriptMethodKey,
		"log.level": "|level|",
		"while.value1": mScriptMethodKey,
		"while.value2": mScriptMethodKey,
		"while.loopVar": mScriptMethodKey,
		"while.maxLoopNum": mScriptMethodKey,
		"while.op": "|op|"
	};

function initCodeAssist() {
	popFieldObj = document.getElementById("attrOptionSelect");
	sel = document.getElementById("popupSelect");
    CodeMirror.on(sel, "click", pick);
    CodeMirror.on(sel, "keydown", function(event) {
        var code = event.keyCode;
        // Enter
        if (code == 13) {
        	CodeMirror.e_stop(event); 
        	pick();
        }
        // Escape
        else if (code == 27) {
        	CodeMirror.e_stop(event); 
        	closeCodeAssistPopup(); 
        	editor.focus();
        }
    });	

}

function closeCodeAssistPopup() {
   $(popFieldObj).hide();
}

function pick() {
   var expr = acSelectHandler(sel.options[sel.selectedIndex].value);
   if (expr.indexOf("<assert value1=")==0 && parentWinObj.pluginEnabled("SeqOut")) {
	   expr = '<assert else=""\n\tpassed=""\n\ttags=""\n\tassertID=""/>';
   }
   var idx = expr.indexOf("@tooltip:");
   if (idx>0) {
   		expr = expr.substring(0, idx);
   }
   expr = expr.replace(/&#13;&#10;/g,"\n");
   expr = expr.replace(/&#10;/g,"\n");
   expr = expr.replace(/&#13;/g,"\r");
   expr = expr.replace(/&#09;/g,"\t");
   expr = expr.replace(/&#34;/g,"\"");
   var cur = editor.getCursor(false);
   
   idx = expr.indexOf("<!--");
	if (idx>=0) {
		// handling comment tag
   		curCh = 4;
		curLineNum = cur.line;
		expr = addPadding(expr, cur.ch);
		editor.replaceSelection(expr); //, {line: cur.line, ch: cur.ch}, {line: cur.line, ch: cur.ch});
		closeCodeAssistPopup();
		editor.focus();
		editor.setCursor(cur.line, idx+4);
   		return;
   	}
   
    idx = expr.indexOf('""');
    if (idx<=0) {
   		idx = expr.indexOf("'");
   		if (idx<=0) {
   			idx = expr.length-1;
   		}
    }
    curLineNum = cur.line;
    var selStr = editor.getSelection();
    if (selStr) {
    	idx -= selStr.length;
    }
    
	expr = addPadding(expr, cur.ch);
    editor.replaceSelection(expr);
   	closeCodeAssistPopup();
	editor.focus();
	editor.setCursor(cur.line, cur.ch+idx+1);
	
    return;
}

function addPadding(expr, charNum) {
    // format tag or macro
    if (this.assistType) {
    	var padding = "                                                                                             ".substring(0,charNum);
    	expr = expr.replace(/\n/g, "\n"+padding);
    }
    return expr;
}

var acSelectHandler;
var acOptionList;
var assistType = "";


function caExpr(assistType_p) {
	assistType = assistType_p;
	acOptionList = mscriptMethodList;
	var typeFilter = tagAttrOptionList[curTagName+"."+curAttrName];
	if (typeFilter==undefined) {
		return;
	}
	
	if (curAttrName=="tags") {
		caReqTag(true);
	}
	else {
		var title = "sys & plugin";
		if (assistType_p=="sys" || assistType_p=="plugin") {
			typeFilter = "|" + assistType_p + "|";
			title = assistType_p;
		}
		
	    acSelectHandler = acTagOption;
		popupCodeAssist(title, typeFilter);
	}
	return true;
}


function caMacro() {
	assistType = "macro";
	
    var cur = editor.getCursor(false);
    var token = editor.getTokenAt(cur);
    acOptionList = mscriptMethodList;
    acSelectHandler = acTagOption;
    var typeFilter = "|macro|";
	popupCodeAssist("macro", typeFilter);
	return true;
}

function caUiMap() {
	assistType = "uimap";
	
    var cur = editor.getCursor(false);
    var token = editor.getTokenAt(cur);
    acOptionList = mscriptMethodList;
    acSelectHandler = acTagOption;
    var typeFilter = "|uimap|";
	popupCodeAssist("ui map", typeFilter);
	return true;
}

function showReqDetails (tag_p) {
	var tag = null;
	for (var i in reqTagList) {
		var tagTemp = reqTagList[i];
		if (tagTemp.tag==tag_p) {
			parentWinObj.showReqDetails(tagTemp, false);
			return;
		}
	}
	parentWinObj.alertDialog("Requirement tag not found: " + tag_p);
}
	
function caReqTag(caOnly_p) {
	assistType = "reqTag";
	setCurContextVars();
	reqTagList = parentWinObj.getReqTagList(true);
	
	if (!caOnly_p && curAttrName && curAttrName=="tags" && curString!="") {
		showReqDetails(curString);
		return;
	}
	
    var cur = editor.getCursor(false);
    var token = editor.getTokenAt(cur);
    
    acOptionList = reqTagList;
    acSelectHandler = acReqTag;
    var typeFilter = "|reqTag|";
	popupCodeAssist("requirement", typeFilter);
	
	return true;
}

function caScriptTag() {
	assistType = "scriptTag";
	
    var cur = editor.getCursor(false);
    var token = editor.getTokenAt(cur);
    acOptionList = tagList;
    acSelectHandler = acTag;
    var typeFilter = "";
	popupCodeAssist("script tag", typeFilter);
	return true;
}

function popupCodeAssist(titleText, filter_p) {
	$(popFieldObj).find(".title").html(titleText);
	
	$(popFieldObj).find(".innerMenu select>*").remove();
	if (filter_p=="|reqTag|") {
		$.each(acOptionList, function(val, funcObj) {
			if (funcObj.diffFlag!="added") {
				var htmlCode = '<option title="' + funcObj.name + '" value="' + val + '">' + funcObj.tag + '</option>' ;
			    $(popFieldObj).find(" .innerMenu select").append(htmlCode);
			}
		});	
	}
	else {
		$.each(acOptionList, function(val, funcObj) {
			if (filter_p=="" || filter_p.indexOf("|"+funcObj.type+"|")>=0) {
				var htmlCode = '<option title="' + funcObj.tooltip + '" value="' + val + '">' + val + '</option>';
			    $(popFieldObj).find(" .innerMenu select").append(htmlCode);
			}
		});	
	}
			
	$(popFieldObj).show();
    editor.addWidget(editor.getCursor(false), popFieldObj, true);
	$(popFieldObj).find(".innerMenu select option:first").attr("selected", "selected");
	$(popFieldObj).find(".innerMenu select").focus();

	$(popFieldObj).find(".innerMenu select>*").hover(function(){$(this).addClass("hover");},
			function() { $(this).removeClass("hover");});
}



function findReqTag(tag) {
	for (var i in reqTagList) {
		if (reqTagList[i].tag==tag) {
			return reqTagList[i];
		}
	}
	return;
}

function acTagOption(val) {
	var expr = mscriptMethodList[val].expr;
	return expr;
}

function acReqTag(val) {
	if (curAttrName=="tags") {
		return reqTagList[val].tag;
	}
	else {
		return "$addTagCheck('" + reqTagList[val].tag + "','','')";
	}
}


function acTag(val) {
	return tagList[val].expr;
}


function parseSeCodeLine(cmd_p, target_p, val_p) {
	target_p = replaceInvalidChar(target_p);
	val_p = replaceInvalidChar(val_p);
	var mcode = "<action code=\"$" + cmd_p + "('" + target_p + "','" + val_p + "')\"/>\n";
	return mcode;
}

function replaceInvalidChar(str_p) {
	return str_p.replace(/</g, "[lt]");
}


function parseSeCode(seCode_p, insertBeforePos_p) {
	var seDOM = $(seCode_p).find("tbody tr");
	if (seDOM==null) {
		alertDialog("Invalid SeleniumIDE source code.");
		return;
	}
	
	var mscriptCode = "";
	$(seDOM).each(function(idx) {
		var tdList = $(this).find("td");
		var mCode = parseSeCodeLine($(tdList[0]).html(), $(tdList[1]).html(), $(tdList[2]).html());
		editor.replaceRange(mCode, insertBeforePos_p);
	});
	return;
}


// search dialog
function initSearch() {
	var btnElem = document.getElementById("nextBtn");
    CodeMirror.on(btnElem, "click", searchNext);
	btnElem = document.getElementById("prevBtn");
    CodeMirror.on(btnElem, "click", searchPrev);
	btnElem = document.getElementById("replaceBtn");
    CodeMirror.on(btnElem, "click", replaceText);
	btnElem = document.getElementById("replaceAllBtn");
    CodeMirror.on(btnElem, "click", replaceAllText);
	btnElem = document.getElementById("closeSrch");
    CodeMirror.on(btnElem, "click", closeSearch);
	btnElem = document.getElementById("srchField");
    CodeMirror.on(btnElem, "click", function(event) {
		CodeMirror.e_stop(event);
    	if ($("#srchField").val()=="search text") {
    		$("#srchField").val("").css("font-color", "#000000");
    	}
    });
    
	btnElem = document.getElementById("replaceField");
    CodeMirror.on(btnElem, "focus", function(event) {
		CodeMirror.e_stop(event);
		$("#searchDialog .replace").show();
    	if ($("#replaceField").val()=="replace text") {
    		$("#replaceField").val("").css("font-color", "#000000");
    	}
    });
    CodeMirror.on(btnElem, "click", function(event) {
		CodeMirror.e_stop(event);
	});
    
	btnElem = document.getElementById("searchDialog");
    CodeMirror.on(btnElem, "click", function(event) {CodeMirror.e_stop(event); closeSearch();});

    var srchField = document.getElementById("srchField");
    CodeMirror.on(srchField, "keydown", function(event) {
        var code = event.keyCode;
        // Enter
        if (code == 13) {searchNext(event);}
        // Escape
        else if (code == 27) {CodeMirror.e_stop(event); closeSearch();}
        else if (code == 38) { searchPrevUpArrow();}
        else if (code == 40) { searchNextDownArrow();}
        else {
        	searchCursor = null;
        	setTimeout(searchNext, 50);
        }
    });	
    
    var srchField = document.getElementById("replaceField");
    CodeMirror.on(srchField, "keydown", function(event) {
        var code = event.keyCode;
        // Enter
        if (code == 13) {replaceText(event);}
        // Escape
        else if (code == 27) {CodeMirror.e_stop(event); closeSearch();}
        else if (code == 38) { searchPrevUpArrow();}
        else if (code == 40) { searchNextDownArrow();}
    });	

    $("#srchField, #replaceField").focus(function() {
    	this.select();
    });
}

function openSearch() {
	$("#searchDialog").show();
	$("#searchDialog .replace").hide();
	$("#searchMsg").text("");
	searchStartPos = editor.getCursor();
	$("#srchField").focus();
	
	if (setCurContextVars()) {
		var scriptText = editor.getSelection();
		$("#srchField").val(scriptText);
	}
}

function getSearchCursor(searchStartPos) {
	if (searchStartPos || searchCursor==null) {
		var query = $("#srchField").val();
	    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
	    if (isRE) {
	    	query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");
	    }
	    if (searchStartPos==null) {
		    searchStartPos = editor.getCursor();
		    searchStartPos.ch = 0;
		}
	 	searchCursor = editor.getSearchCursor(query, searchStartPos, typeof query == "string" && query == query.toLowerCase());
	 }
	 return searchCursor;
}

var searchCursor = null;
var searchStartPos = null;
var lastSearchNext = true;
var lastSearchMatchFrom = undefined;

function searchNext(event) {
	if (event) CodeMirror.e_stop(event);
	var cursor = getSearchCursor();
	var found = cursor.findNext();
	// any key down has no event
	if (found && event && lastSearchMatchFrom &&
		cursor.from().line == lastSearchMatchFrom.line &&
		cursor.from().ch == lastSearchMatchFrom.ch) {
		found = cursor.findNext();
	}
	
	if (found) {
		editor.setSelection(cursor.from(), cursor.to());
		lastSearchMatchFrom = cursor.from();
	}
	lastSearchNext = true;
}
 
function searchPrevUpArrow() {
	searchPrev(true);
}

function searchNextDownArrow() {
	searchNext(true);
}

function searchPrev(event) {
	if (event) CodeMirror.e_stop(event);
	var cursor = getSearchCursor();
	var found = cursor.findPrevious();
	if (found && event && lastSearchMatchFrom && 
		cursor.from().line == lastSearchMatchFrom.line &&
		cursor.from().ch == lastSearchMatchFrom.ch) {
		found = cursor.findPrevious();
	}
	if (found) {
		editor.setSelection(cursor.from(), cursor.to());
		lastSearchMatchFrom = cursor.from();
	}
	lastSearchNext = false;
}

function replaceText(event) {
	if (event) CodeMirror.e_stop(event);
	var cursor = getSearchCursor();
	cursor.replace($("#replaceField").val());
	var dir = "Prev";
	if (lastSearchNext) {
		searchNext();
		dir = "Next";
	}
	else {
		searchPrev();
	}
	
	$("#searchMsg").text("Replaced " + dir + ": 1");
}

function replaceAllText(event) {
	if (event) CodeMirror.e_stop(event);
	var cursor = getSearchCursor({line: 0, ch: 0});
	var replaceString = $("#replaceField").val();
	var replaceCount = 0;
	var foundMatch = cursor.findNext();

	while (foundMatch) {
		cursor.replace(replaceString);
		replaceCount += 1;
		foundMatch = cursor.findNext();
//		if (!foundMatch) break;
	}
	
	$("#searchMsg").text("Replaced " + replaceCount + " occurrence(s)");
	editor.focus();
}

function closeSearch() {
	$("#searchDialog").hide();
	searchCursor = null;
	editor.focus();
}


// requires customization to fold.js: added forceFold, two IFs using forceFold
function foldAll(foldIt_p) {
	var lineText = null;
	var lineIdx = 0;
	var nextLineIdx = 0;
	var foldLineNum = 0;
	var foldEndToken = null;
	while (true) {
		lineText = editor.getLine(nextLineIdx);
		if (lineText==null) break;
		lineIdx = nextLineIdx;
		nextLineIdx += 1;
		var lineTrim = lineText.trim();
		if (lineText==null) break;
		if (foldEndToken==null) {
			if (lineTrim.substring(lineTrim.length-2)=="/>" ||
				lineTrim.indexOf("<mscript")==0) {
				continue;
			}
			var idx = lineText.indexOf("<");
			if (idx<0) continue;
			foldEndToken = lineText.substring(0, idx+1);
			foldLineNum = lineIdx;
		}
		else {
			if (lineText.indexOf(foldEndToken)!=0) continue;

			if (lineText.substring(foldEndToken.length, foldEndToken.length+1)=="/") {
				foldFunc_XML(editor, foldLineNum, foldIt_p);
			}
			foldEndToken = null;
		}
	}
	editor.focus();
}

// compiling mscript
function initCompile() {
	var btnElem = document.getElementById("compNextBtn");
    CodeMirror.on(btnElem, "click", compileNext);
	btnElem = document.getElementById("compPrevBtn");
    CodeMirror.on(btnElem, "click", compilePrev);
	btnElem = document.getElementById("closeCompile");
    CodeMirror.on(btnElem, "click", closeCompileDialog);
	btnElem = document.getElementById("compileDialog");
    CodeMirror.on(btnElem, "click", function(event) {CodeMirror.e_stop(event); closeCompileDialog();});
}


var errorList = null;
var errorIdx = -1;
var errorMark = null;
function openCompile (errorList_p, notify_p) {
	if (parentWinObj.actionCallback(errorList_p)) return;
	
	$("#compileDialog").show();
	$("#compMsg").text("");
	$("#compileErrorNum").text("");
	$("#compileDialog").focus();
	errorList = errorList_p;
	
	if (errorList.length == 0) {
		if (notify_p) {
			$("#compNextBtn, #compPrevBtn").hide();
			$("#compileErrorLoc").text("");
			$("#compileErrorNum").text("");
			$("#compileMsg").text("No compiling errors found.");
		}
		return;
	}
	
	// display errors
    for (var i = 0; i < errorList.length; ++i) {
    	errorIdx = i;
       	highlightError();
    }
      
	$("#compNextBtn, #compPrevBtn").show();
	errorIdx = -1;
	compileNext();
}

function closeCompileDialog() {
	$("#compileDialog").hide();
	
	for (var i = 0; i < errorList.length; ++i) {
      	editor.removeLineWidget(errorList[i].widget);
		errorList[i].errorMark.clear();
    }
    errorList.length = 0;
	
	editor.focus();
}

function clearError(id_p) {
	var idLoc = id_p.substring(4);
	editor.removeLineWidget(errorList[idLoc].widget);
	errorList[idLoc].errorMark.clear();
}

function compilePrev(event) {
	if (event) CodeMirror.e_stop(event);
	errorIdx -= 1;
	if (errorIdx < 0) {
		errorIdx = 0;
	}
	gotoError();
}

function compileNext(event) {
	if (event) CodeMirror.e_stop(event);
	errorIdx += 1;
	if (errorIdx >= errorList.length) {
		errorIdx = errorList.length-1;
	}
	gotoError();
}

function gotoError() {
	var errorObj = errorList[errorIdx];
	editor.setCursor(errorObj.errorPos);
	$("#compileMsg").text(errorObj.msg);
	$("#compileErrorNum").text((errorIdx+1) + " of " + errorList.length);
	if (errorObj.errorPos) {
		$("#compileErrorLoc").text(" at line " + (errorObj.errorPos.line+1));
	}
	else {
		$("#compileErrorLoc").text("at lid='" + errorObj.lid + "' not found" );
	}
	editor.focus();
}

function highlightError() {
	var errorObj = errorList[errorIdx];
	var lineNum = findLineByLid (errorObj.lid);
	if (lineNum==null) {
		return;
	}
	
	var compCursor = editor.getSearchCursor(errorObj.attr, {line: lineNum, ch: 1});
	if (!compCursor.findNext()) {
		return;
	}
	
	lineNum = compCursor.from().line;
	var fromPos = {line: lineNum, ch: compCursor.from().ch};
	fromPos.ch += parseInt(errorObj.charIdx) + errorObj.attr.length;
	var toPos = {line: lineNum, ch: fromPos.ch};
	toPos.ch += errorObj.attr.length;
	editor.setCursor(fromPos);
	errorObj.errorMark = editor.markText(fromPos, toPos, {className: "cmpErr"});
	errorObj.errorPos = {line: lineNum, ch: fromPos.ch};
		
    var msg = document.createElement("div");
    msg.id = "err_" + errorIdx;
    msg.title = "click to clear this error";
    var icon = msg.appendChild(document.createElement("span"));
    icon.innerHTML = (errorIdx + 1);
    icon.className = "cmp-err-icon";
    msg.appendChild(document.createTextNode(errorObj.msg));
    msg.className = "cmp-err-widget";
    errorObj.widget = editor.addLineWidget(errorObj.errorPos.line-1, msg, {coverGutter: false, noHScroll: true}); 
	$(msg).click(function() {
		clearError($(this).attr("id"));
	});	
 	return;
}


// goto dialog
var curOnLID = true;
function initGoto() {
	var btnElem = document.getElementById("gotoLineBtn");
    CodeMirror.on(btnElem, "click", gotoLine);
    
	btnElem = document.getElementById("lidField");
    CodeMirror.on(btnElem, "keydown", function(event) {
    	curOnLID = true;
        var code = event.keyCode;
        if (code == 13) { if (gotoLine(event)) closeGoto();}
        else if (code == 27) {CodeMirror.e_stop(event); closeGoto();}
    });	
    CodeMirror.on(btnElem, "click", function(event) {
    	curOnLID = true;
    	CodeMirror.e_stop(event);
    });
    
    btnElem = document.getElementById("lineNumField");
    CodeMirror.on(btnElem, "keydown", function(event) {
    	curOnLID = false;
        var code = event.keyCode;
        if (code == 13) {if (gotoLine(event)) closeGoto();}
        else if (code == 27) {CodeMirror.e_stop(event); closeGoto();}
    });
    CodeMirror.on(btnElem, "click", function(event) {
    	curOnLID = false;
    	CodeMirror.e_stop(event);
    });
    
    $("#lineNumField, #lidField").focus(function() {
    	$(this).select();
    });
    
	btnElem = document.getElementById("gotoDialog");
    CodeMirror.on(btnElem, "click", function(event) {
		closeGoto();
	});
}

function openGoto () {
	$("#gotoDialog").show();
	curOnLID = true;
	$("#gotoMsg").text("");
	$("#lineNumField").val("");
	$("#lidField").val("").focus();
}

function closeGoto () {
	$("#gotoDialog").hide();
	editor.focus();
}

function gotoLine(event) {
	$("#gotoMsg").text("");
	if (event) CodeMirror.e_stop(event);
	var lid = $("#lidField").val();
	var lineNum = $("#lineNumField").val();
	if (curOnLID && lid!="" || lineNum=="") {
		if (lid=="") return true;
		
		lineNum = findLineByLid(lid);
		if (lineNum==null) {
			$("#gotoMsg").text("LineID " + lid + " not found");
			return false;
		}
		else {
			editor.setCursor({line: lineNum, ch: 0});
			$("#gotoMsg").text("LineID " + lid + " found at line " + lineNum);
			return true;
		}
	}
	else { 
		lineNum = parseInt(lineNum);
		if (lineNum <=0 || lineNum > editor.lineCount()) {
			$("#gotoMsg").text("Line Number " + lineNum + " out of range");
			return false;
		}
		else {
			editor.setCursor({line: (lineNum-1), ch: 0});
			return true;
		}
	}
}

// validates mscript function
function isFuncValid(funcName_p) {
	var distList = mscriptMethodList.distFuncList;
	var idx = funcName_p.indexOf(".");
	if (idx>0) {
		funcName_p = funcName_p.substring(idx+1);
	}
	if (distList[funcName_p]) return true;
	else return false;
}

function mscriptModeImpl (config, parserConfig) {
    var mscriptOverlay = {
	    token: function(stream, state) {
	        var ch;
		    var RE = /[0-9a-zA-Z._ (]/;
	        if (stream.match("\$")) {
			   	var chCount = 0;
			   	var funcName = "";
	        	while ((ch = stream.next()) != null) {
			  		chCount+=1;
				    if (!ch.match(RE)) return null;
				    if (ch == "$") return null;
		            if (ch == "(") {
					    if (chCount<=1) return null;
						break;
				  	}
			  		funcName += ch;
				  	var nextCh = stream.peek();
				  	if (ch==" " && (nextCh!="(" && nextCh!=" ")) return null;
				}
				if (chCount > 0) stream.backUp(1);
				if (isFuncValid(funcName)) {
		        	return "mscriptFunc";
		        }
		        else return null;
		    }
	      	while (stream.next() != null && !stream.match("\$", false)) {}
	      	return null;
	    }
  	};
  	return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mscriptOverlay);
}
