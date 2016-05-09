
function disableKeys(event) {
	var code;
	if (!event) event = window.event;
	if (event.keyCode) code = event.keyCode;
	else if (event.which) code = event.which;
	var keyChar = String.fromCharCode(code);
	var keyCharUp = keyChar.toUpperCase();
	if (event.keyCode==116) { // only works in FF
		event.preventDefault();
		if (event.stopPropagation) {
		    event.stopPropagation();
		} 
	    event.cancelBubble = true;
		if (eventKeyCode) event.keyCode = 0;
		return false;
	}
	else return true;
}

// document.onkeydown = disableKeys;
// document.onkeypress = disableKeys;
// document.onkeyup = disableKeys;
$(document).ready(function(){
	$(window).resize(function() {
	  resizeAll();
	});
	
	$(".assertItem .statusSelect").change(function() {
		var reqStatus = "";
	    $(this).find("option:selected").each (function() {
	    	reqStatus = $(this).text();
		});

		var cellClass = "";
		var tcDIV = $(this).parents(".testcaseDIV");
		var caseID = $(tcDIV).attr("id");
		// re-evaluate the status for this tag by going through all steps in this test case.
		$(this).parent().find(".tag").each(function() {
			var tagPassedCount = 0;
			var tagFailedCount = 0;
			var tagBlockedCount = 0;
			var tagUncheckedCount = 0;
			var tag = $(this).text();
			$(tcDIV).find(".colVerify span[tag='" + tag + "']").each(function() {
				var tagChecked = "";
				if (statusSelectStyle) {
					tagChecked = $(this).parents(".assertItem").find("select option:selected").text();
				}
				else {
//					tagChecked = $(this).parents(".assertItem").find("input[@type='radio']:checked").val();
					tagChecked = $(this).parents(".assertItem").find("input.statusSelect:checked").val();
				}
							
				if (tagChecked=="passed") {
					tagPassedCount = tagPassedCount + 1;
				}
				else if (tagChecked == "failed") {
					tagFailedCount = tagFailedCount + 1;
				}
				else if (tagChecked == "blocked") {
					tagBlockedCount = tagBlockedCount + 1;
				}
				else {
					tagUncheckedCount = tagUncheckedCount + 1;
				}
			});

			// set the color (class) for test case tag cell
			$("."+ caseID + "_ndx td").each(function() {
				var cellTag = $(this).attr("tag");
				
				if (cellTag && cellTag==tag) {
					cellClass = "";
					if (tagPassedCount==0 && tagFailedCount==0 && tagBlockedCount==0) {
						cellClass = "reqCheck";
					}
					else if (tagFailedCount > 0) {
						cellClass = "failed";
					}
					else if (tagBlockedCount > 0) {
						cellClass = "blocked";
					}
					else if (tagPassedCount > 0 && tagUncheckedCount > 0) {
						cellClass = "partial";
					}
					else if (tagPassedCount > 0){
						cellClass = "passed";
					}
					else {
						cellClass = "reqCheck";
					}
					
					$(this).attr("class", cellClass).attr("title",cellClass);
				}
			});

		});
		
		
		var tcPassedCount = $("."+ caseID + "_ndx .passed").filter(function() { return $(this).attr("tag")!=undefined;}).length;
		var tcFailedCount = $("."+ caseID + "_ndx .failed").filter(function() { return $(this).attr("tag")!=undefined;}).length;
		var tcBlockedCount = $("."+ caseID + "_ndx .blocked").filter(function() { return $(this).attr("tag")!=undefined;}).length;
		var tcPartialCount = $("."+ caseID + "_ndx .partial").filter(function() { return $(this).attr("tag")!=undefined;;}).length;
		var tcUncheckedCount = $("."+ caseID + "_ndx .reqCheck").filter(function() { return $(this).attr("tag")!=undefined;;}).length;
	
//		alert("passed:" + tcPassedCount + ", failed:" + tcFailedCount + ", blocked:" + tcBlockedCount + ", partial:" + tcPartialCount + ", unco:" + tcUncheckedCount);
		
		// set color for testcase column
		cellClass = "";
		if (tcFailedCount > 0) {
			cellClass = "failed";
		}
		else if (tcBlockedCount > 0) {
			cellClass = "blocked";
		}
		else if (tcPartialCount > 0 || tcPassedCount > 0 && tcUncheckedCount > 0) {
			cellClass = "partial";
		}
		else if (tcPassedCount > 0 && tcUncheckedCount ==0){
			cellClass = "passed";
		}
		else {
			cellClass = "";
		}
		
		$("." + caseID + "_ndx th:first-child").attr("class", cellClass).attr("title", cellClass);
	});
	
	$(".graph img").dblclick(function() {
		var tbWidth = $(".testcase").width();
		$(this).height(($(this).height()*tbWidth/$(this).width()) + "px");
		$(this).width(tbWidth+"px");
	}).attr("title","Double click to resize the image to fill the width of the screen.");
	
	
	$(".testcaseDIV .tableHeader")
			.attr("title","Double click to add a note to the test case.")
			.dblclick(function() {
		var testcaseDIV = $(this).parents(".testcaseDIV");
		curTestCase = $(testcaseDIV).attr("id");
		addTesterNote(curTestCase, "");
	});
	
	
	$(".testcaseDIV .testcaseTR")
			.attr("title","Double click to add a note to the test case for the step")
			.dblclick(function() {
		var testcaseDIV = $(this).parents(".testcaseDIV");
		curTestCase = $(testcaseDIV).attr("id");
		addTesterNote(curTestCase, "Step " + $(this).find(".colNum").text() + " (" + findAllTags(this) + "): ");
/*		
		var testerNotes = $(testcaseDIV).find(".testerNotes");
		var newNodeText = $(testerNotes).val();
		if (newNodeText!="") {
			newNodeText = newNodeText + "\r\n";		
		}
		newNodeText = newNodeText + "Step " + $(this).find(".colNum").text() + " (" + findAllTags(this) + "): \r\n";
		$("#testerNotesPopup textarea").val(newNodeText);
		$("#testerNotesPopup .tcName").text(curTestCase);
		$("#testerNotesPopup").show();
		$("#testerNotesPopup textarea").focus();
*/
	});
	
	$("#testerNotesPopup .closeBtn").click(function() {
		var noteText = $("#testerNotesPopup textarea").val().replace(/^\s+|\s+$/g,"");
		if (noteText!="") {
//			noteText = noteText.replace(/\r\n?/g, '<br />').replace(/\n/g, '<br />');
			var textareaText = $("#"+curTestCase).find(".testerNotes").val();
			if (textareaText!="") {
				textareaText += "\n";
			}
			$("#"+curTestCase).find(".testerNotes").val(textareaText + noteText);
		}
		$("#testerNotesPopup").hide();
	});
	
	$("select.statusSelect").change(function() {
		if ($(this).find("option:selected").val()=="failed") {
			$(this).next(".failedCmt").show().focus();
		}
		else {
			$(this).next(".failedCmt").hide();
		}
	});

	$(".radioLabel, input.statusSelect, select.statusSelect").attr("title", " ");
	
	$("input.statusSelect").click(function() {
		if ($(this).val()=="failed") {
			$(this).parent().find(".failedCmt").show().focus();
		}
		else {
			$(this).parent().find(".failedCmt").hide();
		}
	});
	
	$(".checkAllCase").click(function() {
		var checkVal = $(this).text();
		$(this).parent().parent().parent().find("input.statusSelect[value=" + checkVal + "]").click();
		$(this).parent().parent().parent().find("select.statusSelect").val(checkVal)
			.change();
	});
		
	$(".checkAllStep").click(function() {
		var checkVal = $(this).text();
		$(this).parent().parent().find("input.statusSelect[value=" + checkVal + "]").click();
		$(this).parent().parent().find("select.statusSelect").val(checkVal)
			.change();
	});
		
	$(".statusSelect").change(function() {
		if ($("#saveBtn").is(":visible")) {
			$(this).parents(".assertItem").find(".updDefect").attr("checked", true);
//			$(this).attr("changed", "true");
		}
	});

	centerNotesField();
	
	resizeAll();
	
	initTestCaseReport();
	
	
	$("#almClose").click(function() {
		$("#defectRecordsPopup").hide();
	});
	
	$("#defectStatus").click(showDefectRecords);
});

function addTesterNote(testcaseID, appendNote) {
	curTestCase = testcaseID;
	var testerNotes = $("#"+testcaseID).find(".testerNotes");
	$("#testerNotesPopup textarea").val(appendNote);
	$("#testerNotesPopup .tcName").text(testcaseID);
	$("#testerNotesPopup").show();
	$("#testerNotesPopup textarea").focus();
}

function clearTesterNote(curTestCaseID) {
	$("#"+curTestCase).find(".testerNotes").val("");
}

function buildExecSummary() {
	// calc testcase stats
	var caseTotalList = getTestCaseList($("#tcList:first [tcID]"));
	var caseTotal = caseTotalList.length;
	$("#casesAvailable .measure").html(caseTotal);
	
	var casePassedList = getTestCaseList($("#tcList:first [tcID].passed"));
	var casePassed = casePassedList.length;
	$("#casesPassed .measure").html(makeCountPct(casePassed, caseTotal));
	$("#casesPassed .measureList").html(makeListHtml(casePassedList));

	var caseFailedList = getTestCaseList($("#tcList:first [tcID].failed"));
	var caseFailed = caseFailedList.length;
	$("#casesFailed .measure").html(makeCountPct(caseFailed, caseTotal));
	$("#casesFailed .measureList").html(makeListHtml(caseFailedList));

	var caseBlockedList = getTestCaseList($("#tcList:first [tcID].blocked"));
	var caseBlocked = caseBlockedList.length;
	$("#casesBlocked .measure").html(makeCountPct(caseBlocked, caseTotal));
	$("#casesBlocked .measureList").html(makeListHtml(caseBlockedList));

	var caseCompletedList = casePassedList.concat(caseFailedList).concat(caseBlockedList);
	var caseCompleted = casePassed + caseFailed + caseBlocked;
	$("#casesCompleted .measure").html(makeCountPct(caseCompleted,caseTotal));
	$("#casesCompleted .measureList").html(makeListHtml(caseCompletedList));

	var casePartialList = getTestCaseList($("#tcList:first [tcID].partial"));
	var casePartial = casePartialList.length;

	var caseNotRunList = substractList(caseTotalList, caseCompletedList);	
	var caseNotRun = caseTotal - caseCompleted;
	$("#casesNotRun .measure").html(makeCountPct(caseNotRun, caseTotal));
	$("#casesNotRun .measureList").html(makeListHtml(caseNotRunList));
	
	// calc req stats
	var reqList = new Array();
	var reqIdList = new Array();

	$("#tcList [tag]").each (function() {
		var reqTag = $(this).attr("tag");
		var reqStatus = $(this).attr("class");
		if (typeof(reqList[reqTag])=="undefined") {
			reqList [reqTag] = {status: reqStatus, reqCheck:0, passed: 0, blocked: 0, partial: 0};
			reqList[reqTag][reqStatus] = 1;
			reqIdList [reqIdList.length] = reqTag;
		}
		else {
			var curReqStatus = reqList[reqTag].status;
			reqList[reqTag][reqStatus] = reqList[reqTag][reqStatus] + 1;
			if (reqStatus=="failed") {
				reqList[reqTag].status = "failed";
			}
			else if (reqStatus=="blocked") {
				if (curReqStatus=="reqCheck" || curReqStatus=="passed") {
					reqList[reqTag].status = "blocked";
				}
			}
			else if (reqStatus=="reqCheck") {
				if (curReqStatus=="passed") {
					reqList[reqTag].status = "partial";
				}
			}
			else if (reqStatus=="partial") {
				if (curReqStatus=="passed") {
					reqList[reqTag].status = "partial";
				}
			}
			else { // passed
				if (curReqStatus=="reqCheck") {
					reqList[reqTag].status = "passed";
				}
			}
		}
	});
	
	var totalReqCheck = $("#tcList [tag]").size(); // total number of coverage points
	var reqCheckCount = $("#tcList .reqCheck[tag]").size(); // number of coverage points not executed
	var completePct = Math.round(100 - reqCheckCount*100/totalReqCheck);
	$("#completePct").html("( " + completePct + "% executed )");
	
	calcAndMark(reqList, "full", "reqmtExecFull");
	calcAndMark(reqList, "partial", "reqmtExecPartial");
	calcAndMark(reqList, "passed", "reqmtPassed");
	calcAndMark(reqList, "failed", "reqmtFailed");
	calcAndMark(reqList, "blocked", "reqmtBlocked");
	calcAndMark(reqList, "reqCheck", "reqmtNotRun");	
}

function calcAndMark(reqList, status, elemName) {
	var tempReqList = findReqByStatus(reqList, status);
	var tempReqCheck = tempReqList.length;
	$("#" + elemName + " .measure").html(makeCountPct(tempReqCheck, totalReqCount)); // totalReqCount from seqout.xsl
	$("#" + elemName + " .measureList").html(makeListHtml(tempReqList));
}

function findReqByStatus(reqList, status) {
	var retList = new Array();
	for (var reqId in reqList) {
		if (reqList[reqId].status == status || 
			status=="full" && reqList[reqId]["reqCheck"] == 0 ||
			status=="partial" && (reqList[reqId].status==status ||
				reqList[reqId].status!="reqCheck" && reqList[reqId]["reqCheck"]>0) ) {
			retList[retList.length] = reqId;
		}
	}
	return retList;
}

function makeCountPct(aCount, totalCount) {
	return aCount + " / " + Math.round(aCount*100/totalCount) + "%";
}

function getTestCaseList (elem) {
	var retList = new Array();
	$(elem).each(function() {
		var tcClass = $(this).parent().attr("class");
		tcClass = tcClass.substring(0, tcClass.indexOf("_ndx"));
		if (!arrayContains(retList, tcClass)) {
		    retList[retList.length] = tcClass;
		}
	 });
	 
	return retList;
}

function getReqCheckList (elem) {
	var retList = new Array();
	$(elem).each(function() {
		var tag = $(this).attr("tag");
//		if (!arrayContains(retList, tag)) {
		    retList[retList.length] = tag;
//		}
	 });
	 
	return retList;
}

function makeListHtml(aList) {
	if (aList.length>0) {
		return "<ul class='summaryUL'><li>" + aList.join("</li><li>") + "</li></ul>";
	}
	else {
		return "";
	}
}

function arrayContains(aList, aValue) {
	for (var j=0; j<aList.length; j++) {
		if ( aList[j]==aValue) {
		   return true;
		}
	}
	return false;
}

function substractList(originalList, remList) {
	var retList = new Array();
	for (var i=0; i<originalList.length; i++) {
		if (!arrayContains(remList, originalList[i])) {
			retList[retList.length] = originalList[i];
		}
	}
	return retList;
}


function findAllTags(stepElem_p) {
	var ret = "";
	$(stepElem_p).find(".tag").each (function() {
		if (ret != "") {
			ret = ret + ",";
		}
		ret = ret + $(this).text();
	});
	
	return ret;
}


var curTestCase = "";

function centerNotesField() {
	document.getElementById('testerNotesPopup').left = Math.round(($(window).width()-$("#testerNotesPopup").width())/2);
	document.getElementById('testerNotesPopup').top = Math.round(($(window).height()-$("#testerNotesPopup").height())/2);
}

function resizeAll() {
	$(".graph img").filter(function() {
		return ($(this).width()>$(".testcase").width());
	}).dblclick();
}

// not used.
function writeout() { // get documentElement content
    var generatedhtml = document.documentElement.innerHTML // multiline flag does not seem to work in all browsers... workaround
    generatedhtml = generatedhtml.replace(/[\r\n]+/g,"###") // remove all script tags
    generatedhtml = generatedhtml.replace(/<script.*?<\/script>/gi,"") // write back newlines (multiline flag)
    generatedhtml = generatedhtml.replace(/#{3,}/g,"\n") // get rid of element generating this..
    generatedhtml = generatedhtml.replace(/<div id=["']?writeoutdiv["']? onclick=["']?writeout\(\)["']?>writeout<\/div>/i,"");
	top.consoleRef=window.open('','TO_CASE',
	  'width=350,height=250'
	   +',menubar=0'
	   +',toolbar=1'
	   +',status=0'
	   +',scrollbars=1'
	   +',resizable=1');
	top.consoleRef.document.writeln(generatedhtml);
	top.consoleRef.document.execCommand("SaveAs");
	top.consoleRef.document.close();
}

function gotoStep (stepID) {
	location.href = "#" + stepID;
}


function resetTestCaseReport() {
	$(".updDefect").attr("checked", false);
	var formObj = document.getElementById(tcFormUID);
	$(".failedCmt").hide();
	for(i=0; i<formObj.elements.length; i++) {
		var formField = formObj.elements[i];
		var fieldType = formField.type;
		if (fieldType == 'checkbox') { formField.checked = false; }
		else if (fieldType == 'radio') { 
			formField.checked = false; 
			$(formField).trigger("change");
		}
		else if (fieldType == 'select-one') {
			formField.options.selectedIndex = 0 
			$(formField).trigger("change");
		}
		else { formField.value = ""; }
	}
	setTimeout (clearDefectChanged, 50);
}

function clearDefectChanged() {
	$(".updDefect").attr("checked", false);
//	$(".statusSelect").attr("changed", "");
	updateDefectSaveCount(0,0);
}

function saveTestCaseReport() {
	saveDefects();
	saveForm (tcFormUID);
	return;
}

function initTestCaseReport() {
	$("#saveBtn").click(saveTestCaseReport);
	$("#resetBtn").click(resetTestCaseReport);
	$("#printBtn").click(printReport);
	$("#resizeBtn").click(resizeAll);
	$("#defectStatus").click(showDefectRecords);
	
	retrieveForm (tcFormUID);
	
	checkALM ();
	return;
}

var almEnabled = false;
function checkALM() {
	$(".updDefect").attr("disabled", "disabled");
	$.post("/MbtSvr/app=webmbt&action=defect&cmd=almStatus", 
		function(data) {
			if (data.alertMessage) {
				alert(data.alertMessage);
			}
			else {
				if (data.almStatus==true) {
					$(".updDefect").attr("checked", false).removeAttr("disabled");
					$("#saveBtn").val("Save ALM");
					almEnabled = true;
				}
				else {
					$(".updDefect").hide();
				}
			}
		});
}


function printReport() {
	window.print();
}


function retrieveForm(formID_p) {
	$.post(
		"/MbtSvr/app=webmbt&action=cookie&cmd=getCookie", 
		{"cookieName": formID_p}, 
		function(data) {
			restoreForm(formID_p, data);
			$("#saveBtn").show();
		});
}

function saveForm (formID) {
	var formData = packageFormData (formID);
	$.post(
		"/MbtSvr/app=webmbt&action=cookie&cmd=saveCookie", 
		{"cookieName": formID, "cookieValue": formData}, 
		function(data) {
			if (data.alertMessage && data.alertMessage=="ok") {
				if (!almEnabled) alert("Changes saved " + formID);
			}
			else {
				alert("Save failed");
			}
		});
}

function restoreForm (formID, formData) {  
	if(formData==null || formData==undefined || formData=="") {
		return;
	}
	
	var cookieArray = formData.split('#cf#');
	var formObj = document.getElementById(formID);
	if(cookieArray.length == formObj.elements.length) {
		var elemLength = formObj.elements.length;
		var formFieldList = new Array();
		for(i=0; i<elemLength; i++) {
			var formField = formObj.elements[i];
			var arrayVal = cookieArray[i];
			if(arrayVal.substring(0,6) == 'select') { 
				var idx = arrayVal.substring(7, arrayVal.length-1);
				if (idx>0) {
					formField.options.selectedIndex = idx; 
					formFieldList.push(formField);
				}
			}
			else if((arrayVal == 'cbtrue') || (arrayVal == 'rbtrue')) { 
				formField.checked = true; 
				formFieldList.push(formField);
			}
			else if((cookieArray[i] == 'cbfalse') || (cookieArray[i] == 'rbfalse')) { 
//				formField.checked = false; 
//				formFieldList.push(formField);
			}
			else { formField.value = (arrayVal) ? arrayVal : ''; }
		}
		for (i=0; i<formFieldList.length; i++) {
			$(formFieldList[i]).trigger("change");
		}
	}
	
	$(".failedCmt").each(function() {
		if ($(this).val()!="") {
			$(this).show();
		}
	});
}


function packageFormData (formID) {
	var formObj = document.getElementById(formID);
	if (formObj==undefined) return "";
	var cookieValue = "";
	for(i=0; i < formObj.elements.length; i++) {
		var formField = formObj.elements[i];
		var fieldType = formField.type;
		if (fieldType == 'password') { passValue = ''; }
		else if (fieldType == 'checkbox') { passValue = 'cb' + formField.checked; }
		else if (fieldType == 'radio') { passValue = 'rb' + formField.checked; }
		else if (fieldType == 'select-one') { passValue = 'select' + formField.options.selectedIndex; }
		else { passValue = formField.value; }
		cookieValue = cookieValue + passValue + '#cf#';
	}

	cookieValue = cookieValue.substring(0, cookieValue.length-4); // Remove last delimiter
	return cookieValue;
}

function updateDefectSaveCount(defectCount, savedCount) {
	var statusItem = $("#defectStatus");
	if (defectCount<=0) {
		statusItem.hide();
	}
	else {
		statusItem.show();
		$(statusItem).find("#defectCount").text(defectCount);
		$(statusItem).find("#savedCount").text(savedCount);
	}
}

var defectRecordsSaved = [];

function saveDefects() {
	if (!almEnabled) {
		$(".updDefect:checked").attr("checked", false);
		return;
	}
	var defectCount = 0;
	var savedCount = 0;
	defectRecordsSaved = new Array();
	updateDefectSaveCount(defectCount, savedCount);
	$(".updDefect:checked").each(function() {
		var cmt = "";
		var itemStatus = "";
		var theItem = $(this).parents(".assertItem").find(".statusSelect");
		if (theItem.length>1) {
			theItem = $(theItem).parent().find(".statusSelect:checked");
		}
		itemStatus = $(theItem).val();
		var assertItem = $(this).parents(".assertItem");
		var tag = assertItem.find("#tagListItem").attr("tag");
		if (itemStatus=="failed") {
			cmt = assertItem.find(".failedCmt").val();
		}
		var assertID = assertItem.attr("assertid");
		
		var stepItem = $(this).parents(".testcaseTR");
		var stepNum = $(stepItem).find(".colNum").text();
		var tcItem = $(stepItem).parents(".testcaseDIV");
		var tcID = $(tcItem).attr("id");
		defectCount += 1;
		updateDefectSaveCount(defectCount, savedCount);
		$("#defectCount").text(defectCount);
		var defectRecord = { "tcID": tcID, 
				  "step": stepNum, 
				  "tag": tag, 
				  "assertID": assertID, 
				  "status": itemStatus, 
				  "statusCmt": cmt
				};
		defectRecord.saveMsg = "";
		defectRecordsSaved.push(defectRecord);
		$.post("/MbtSvr/app=webmbt&action=defect&cmd=updateDefect", defectRecord, 
			function(data) {
				if (data.alertMessage && data.alertMessage=="ok") {
					savedCount += 1;
					updateDefectSaveCount(defectCount, savedCount);
					$(assertItem).find(".updDefect").attr("checked", false);
					defectRecord.saved = true;
				}
				else {
					defectRecord.save = false;
					if (data.alertMessage) {
						defectRecord.saveMsg = data.alertMessage;
					}
					else if (data.error) {
						defectRecord.saveMsg = data.error;
					}
					else {
						defectReord.saveMsg = data;
					}
				}
			});
	})
}

function showDefectRecords () {
	var msgList = new Array();
	$("#defCnt").text(defectRecordsSaved.length);
	for (i in defectRecordsSaved) {
		var defect = defectRecordsSaved[i];
		var checkMark = ""
		if (defect.saved) {
			checkMark = "&#x2713; Saved";
		}
		else {
			checkMark = "&#x2717; Errored";
		}
		var msg = "<tr defSeqNum='" + i + "'>" 
			    + "<td>" + defect.tcID + "</td>" 
				+ "<td>" + defect.step + "</td>" 
				+ "<td>" + defect.assertID + "</td>" 
				+ "<td>" + defect.tag + "</td>" 
				+ "<td class='defLink'>" + checkMark + "</td>"
				+ "</tr>";
		msgList.push(msg);
	}
	$("#defectRecordsPopup tbody>*").remove();
	$("#defectRecordsPopup tbody").append($(msgList.join()));
	$("#defectRecordsPopup").show();
	$(".defLink").click(function() {
		var seq = $(this).parent().attr("defSeqNum");
		alert(defectRecordsSaved[seq].saveMsg);
	});
}