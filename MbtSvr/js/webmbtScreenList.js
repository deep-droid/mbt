// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtScreenList.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}

var screenLoaded = false;
function display(refresh_p) {
	if (!parentWinObj.curAppState.modelOpen || screenLoaded && !refresh_p) return;
	parentWinObj.sendAction("mbtScreenList", "", function (data) { 
		if (parentWinObj.actionCallback(data)) return;
		showScreenList(data.snapScreenFiles); 
		screenLoaded = true;
	});
}

$(document).ready(function(){
	initFrame("ScreenShot");

    $("#moreMenu").hover(function() {
    		$("#hoverMenu").show();
    	});
    $("#hoverMenu").hover(null, function() {
    		$(this).hide();
    	})
    	.click (function() {$("#hoverMenu").hide();});


	adjustHeight();
	display();	
});

function reset () {
	$("#filelist tr").not(".header").remove();
}

function deleteFile() {
	var checkedNum = $(".checkbox:checked").size();
	if (checkedNum<=0) {
		parentWinObj.alertDialog("delete.select.file");
		return;
	}
	
	parentWinObj.confirmDialog(parentWinObj.translateMsg("delete.snapscreen.confirm"), function () {
		$(".checkbox:checked").each (function (loopIdx) {
			parentWinObj.sendAction("deleteScreenFile", "mbtFile=" + $(this).attr("id"));
			$(this).parent().parent().remove();
		});
	});
}



function showScreenList (fileList_p) {
	reset();
	var fileList = new Array();
	for (i in fileList_p) {
		var shadeClass="";
//		if (parentWinObj.isShade(i)) shadeClass="shade";
		
		fileList[i] = fileList_p[i].fname;
		var trObj = "<tr id='" + i + "' class='" + shadeClass + "'><td><input type=checkbox id="
//				  +fileList_p[i].fname+" class=checkbox></td><td><a href='/model/" + parentWinObj.curAppState.webmbtObj.folderPath + "/" + parentWinObj.curAppState.webmbtObj.model.filename + "/snapscreen/" 
				  +fileList_p[i].fname+" class=checkbox></td><td><a href='/model/snapscreen/" 
				  + fileList_p[i].fname + "' class='filename' id='" + fileList_p[i].fname 
				  + "' target=_blank>"+ fileList_p[i].fname
				  +"</a></td><td class=dateModified nowrap>"
				  +fileList_p[i].lastmodified
				  +"</td></tr>";
		$(trObj).appendTo($("#filelist"));
	}

	$("#filelist tr").click(function () {
		$("#filelist tr").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$("#checkAll").click(function(){
		if ($(this).is(":checked")) {
			$(".checkbox").attr("checked", true);
		}
		else {
			$(".checkbox").attr("checked", false);
		}
	});
	
	$("#filelist tr").hover(
			function() {
				$("#filelist tr").removeClass("hover"); 
				$(this).addClass("hover");}, 
			function() {$(this).removeClass("hover");
		});

	
}

		
function adjustHeight() {
    // includes header from the parent and one header and one footer from this editor
	$("#screenListMain").css("height", $(window).height() - 35); // less the footer delete button
}

// callback by webmbtMain.js
function mainCallbackFunc(action_p, params_p) {
	if (action_p=="adjustHeight") {
		adjustHeight();
	}
	else if (action_p=="reset") {
		reset();
	}
	else if (action_p=="display") {
		display(params_p);
		adjustHeight();
	}
	else if (action_p=="close") {
		// nothing
	}
}