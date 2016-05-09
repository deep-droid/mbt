// ModelViewRequirements.js - copyright 2008-2013 TestOptimal, LLC
var reqTagList = new Array();
var metaList = null;
var syncMode = false;

var reqCtxMenuBindings = {
	'menuID': 'ctxMenuReq',
	'reqDetails': function(ui) {
		var tag = $(ui).find(".tag").text();
		showReqDetails(tag);
	},
	'reqDelete': function(ui) {
		var tag = $(ui).find(".tag").text();
		var tagRowID = $(ui).attr("id");
		deleteReqTag(tagRowID, tag);
	},
	'reqCoverag': function(ui) {
		var tag = $(ui).find(".tag").text();
		showReqCoverage(tag);
	},
	'onShowMenu': function (e, menu) {
		if ($("#tagList .syncMode:visible").size()>0) {
			$(menu).find(".syncMode").hide();
		}
		return menu;
	},
    menuStyle: {
      listStyle: 'none',
      margin: '0px',
      backgroundColor: viewCtxMenuBkgColor,
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-radius': '5px',
      width: '125px'
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


function popupReqView () {
	if (regView("reqViewPanel")) {
		initReqView();
	}
	parentWinObj.loadReqTagList(false);
	
	bringViewToFront("reqViewPanel");
	$("#reqViewPanel").show();
}


function initReqView() {
	$("#reqViewPanel").draggable().draggable(
		{  cancel: '#reqViewCnt', 
		   start: function() { bringViewToFront("reqViewPanel"); }
		})
		.resizable(
			{ alsoResize: '#reqViewCnt', 
			  minHeight: 75, 
			  handles: "all", 
			  minWidth: 200
			})
		.click(function() {	bringViewToFront("reqViewPanel");});

	bringViewToFront ("reqViewPanel");
		
	$("#reqViewClose").click(function() {
		closeReqViewPanel();
	});
		
	$("#saveReqBtn").click(function() {
		saveReqTag ();
	});
	

	$("#showReqCoverageBtn").click(function() {
		showAllReqCoverages ();
	});

	$("#syncReqBtn").click(function() {
		syncReq ();
	});

	$("#filterBtn").click(function() {
		openFilter ();
	});
	
	$("#closeFilter").click(function() {
		applyFilter();
		$("#filterSPAN").hide();
	});
	
	$("#filterValue").keyup(function() {
		applyFilter();
	}).click(function() {
		$(this).select().focus();
	});
	
	$("#filterType").change(function() {
		applyFilter();
	})
	.click(function() {
		$(this).focus();
	});
	
}

function saveReqTag () {
	var paramObj = {
			type: "saveReqTags", 
			params: $("#reqmgtParams").val(), 
			importList: new Array()
		};	
	$("#tagList .importCheckBox:checked:visible").each(function() {
		paramObj.importList.push($(this).parent().parent().find(".tag").text());
	});
	paramObj.importList = paramObj.importList.join(",");
	
	parent.postActionUtil("tag", paramObj, function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		else {
			parentWinObj.loadReqTagList(false);
//			parent.alertDialog("Changes saved.");
			parentWinObj.curAppState.nodeDataList["scxml"].lastReqRefreshDate = $.datepicker.formatDate("yy-mm-dd", new Date());
		}
	});
}


function reloadTagList() {
	reqTagList = parentWinObj.curAppState.reqTagList;
	
	appendTagList(reqTagList);
	if (syncMode) {
		$("#importAllToggle").click(function() {
			if ($(this).is(":checked")) {
				$("#tagList tr:visible .importCheckBox").attr("checked", "checked");
			}
			else {
				$("#tagList tr:visible .importCheckBox").removeAttr("checked");
			}
		});
		
		$("#asOfReq").text("(as of " + $.datepicker.formatDate('yy-mm-dd', new Date()) + ")");
		$("#saveReqBtn").show();
		$("#syncReqBtn").hide();
		$(".syncMode").show();
	}
	else {
		var asOf = "";
		var scxml = parentWinObj.curAppState.nodeDataList["scxml"];
		if (scxml.lastReqRefreshDate!="") {
			asOf = "(as of " + scxml.lastReqRefreshDate + ")";
		}
		$("#asOfReq").text(asOf);
		$(".syncMode").hide();
		$("#saveReqBtn").hide();
		$("#syncReqBtn").show();
	}
	
	syncMode = false;	
	

	$("#tagList tbody tr").contextMenu(reqCtxMenuBindings.menuID,  {
		bindings: reqCtxMenuBindings,
		'onShowMenu': reqCtxMenuBindings.onShowMenu,
    	'menuStyle': reqCtxMenuBindings.menuStyle,
    	'listingStyle': reqCtxMenuBindings.itemStyle,
    	'itemHoverStyle': reqCtxMenuBindings.itemHoverStyle
    })
    .dblclick(function() {
		var tag = $(this).find(".tag").text();
		showReqDetails(tag);
	});	
    
    $("#tagList tbody td:not(.chkbx)").click(function() {
		var tag = $(this).parent().find(".tag").text();
		highlightReqCoverage(tag);
	});
	
	
	$("#tagList").tablesorter();
/*	
	$("#tagList").colResizable({
		liveDrag:true, 
		minWidth:10,
		gripInnerHtml:"<div class='grip'></div>", 
		draggingClass:"dragging" 
		// onResize:columnResized
		});	
*/
}


function appendTagList(reqTagList_p) {
	$("#tagList>*").remove();
	$("<thead>"
	  +"<tr>"
	  +"<th class='syncMode {sorter: false}' title='Import requirements to model.' align='center'><input type=checkbox id=importAllToggle></input></th>"
	  +"<th>Req.Tag&nbsp;</th>"
	  +"<th>Name&nbsp;</th>"
	  +"<th class='syncMode' align=center title='Change flags: changed, added, retired'>Flags&nbsp;&nbsp;&nbsp;&nbsp;</th>"
	  +"<th class='reqAttr status' align=center title='Status of the requirement.'>Status&nbsp;&nbsp;&nbsp;&nbsp;</th>"
	  +"<th class='reqAttr desc'>Description</th>"
	  +"<th class='modifiedDate'>Mod.&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;</th>"
	  +"<th class='reqAttr versions'>AUT&nbsp;Versions&nbsp;&nbsp;</th>"
	  +"<th class='reqAttr reqGroup'>Req. Group</th>"
	  +"<th class='reqAttr sprints'>Sprints</th>"
	  +"<th class='reqAttr keywords'>Keywords</th>"
	  +"<th class='reqAttr storyids'>User&nbsp;Stories&nbsp;&nbsp;</th>"
	  +"</tr>"
	  +"</thead>"
	  +"<tbody>"
	  +"</tbody>").appendTo("#tagList");
	  	
	for (var i in reqTagList_p) {
		var htmlCode = "";	
		var tag = reqTagList_p[i];

		var tagCode = tag.tag;
		var req = tag.originalRequirement;
		if (syncMode && tag.almRequirement) {
			req = tag.almRequirement;
			if (tag.diffFlag=="") {
				continue;
			}
		}
		if (req==undefined) continue;

		var tagName = req.name;
		var tagDesc = req.desc;
		var tagStatus = req.status;
		
		var tagFlagText = tag.diffFlag;
		
		var checkboxTag = "&nbsp;";
		var checkedString = "";
		if (tag.diffFlag!="added") {
			checkedString = "checked";
		}
		if (tag.diffFlag!="") {
			checkboxTag = "<input type=checkbox class=importCheckBox " + checkedString + "></input>";
		}
		htmlCode += "<tr id='tag_" + i + "'>"
				 + "<td class='syncMode chkbx' align=center>" + checkboxTag + "</td>"
				 + "<td valign=top class='tag'>" + tagCode + "</td>"
				 + "<td class='reqname'>" + tagName + "</td>"
				 + "<td class='tagFlag syncMode'>" + tagFlagText + "</td>"
				 + "<td class='reqAttr status'>" + req.status + "</td>"
				 + "<td class='reqAttr desc'>" + req.desc + "</td>"
				 + "<td class='reqAttr modifiedDate'>" + req.modifiedDate + "</td>"
				 + "<td class='reqAttr versions'>" + req.versions.join(",") + "</td>"
				 + "<td class='reqAttr reqGroup'>" + req.reqGroup.join(",") + "</td>"
				 + "<td class='reqAttr sprints'>" + req.sprints.join(",") + "</td>"
				 + "<td class='reqAttr keywords'>" + req.keywords.join(",") + "</td>"
				 + "<td class='reqAttr storyids'>" + req.storyids.join(",") + "</td>"
				 + "</tr>";
		var reqElem = $(htmlCode).appendTo("#tagList tbody");
	}
	

	if (reqTagList_p.length<=0) {
		var msg = "Click Sync to import requirements from ALM";
		if (syncMode) msg = "No requirements have been changed since last Sync";
		$("<tr><td colspan=9>" + msg + "</td><tr>").appendTo("#tagList");	
	}
	
	return;
}


function showReqDetails (tag_p) {
	var tag = null;
	var showLatest = $(".syncMode:visible").length>0;
	for (var i in reqTagList) {
		var tagTemp = reqTagList[i];
		if (tagTemp.tag==tag_p) {
			parentWinObj.showReqDetails(tagTemp, showLatest);
			return;
		}
	}
	parentWinObj.alertDialog("Requirement tag not found: " + tag_p);
}

function deleteReqTag (rowID_p, tag) {
	parent.sendAction ("tag", "type=delete&tag=" + tag, function(data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		parentWinObj.loadReqTagList(false);
	});
}


function highlightReqCoverage(tag) {
	var findOption = {};
	findOption.searchExpr = tag;
	findOption.findState = true;
	findOption.findTrans = true;
	findOption.findTags = true;
	findOption.findName = false;
	findOption.findMScript = false;
	findOption.findDesc = false;
	findOption.findStereotype = false;
	findOption.findMarkThem = false;
	findOption.invertSelection = false;
	runSearch(findOption);
}

function showAllReqCoverages() {
	$("#tagList tbody tr").attr("class","");
	parentWinObj.sendAction("tag", "type=getTagCoverage", function (data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		var tagCoverageList = data; // key on tag 
		for (var i in reqTagList) {
			var tag = reqTagList[i];
			if (tag==null) continue;
//			if (tag.diffFlag=="added") continue;
			if (tagCoverageList[tag.tag] && tagCoverageList[tag.tag]!="") {
				$("#tag_" + i).addClass("reqCovered");
			}
			else {
				$("#tag_" + i).addClass("reqNotCovered");
			}
		}
	});	
}


function syncReq () {
	syncMode = true;
	parentWinObj.loadReqTagList(true);
	$("#tagList tbody tr").remove();
	$("<tr><td colspan=5>Retrieving requirements, please wait...</td><tr>").appendTo("#tagList");	
}


function closeReqViewPanel () {
	$("#reqViewPanel").hide();
}


function openFilter() {
	parentWinObj.sendAction("tag", "type=getTagMetaData", function (data) {
		if (data.error) {
			parent.alertDialog(data.error);
			return;
		}
		
		metaList = data;
		
	});
	
	$("#filterSPAN").show();
	$("#filterValue").click();
}

function applyFilter() {
	var filterType = $("#filterType").val();
	var filterValue = $("#filterValue").val();
	if (filterValue=="") {
		$("#tagList tbody tr").show();
		$("#filterBtn").removeClass("selected");
		return;
	}
	
	$("#filterBtn").addClass("selected");
	var lowFilterValue = filterValue.toLowerCase();
	var regExprFlag = "i";
	if (lowFilterValue != filterValue) {
		regExprFlag = "";
	}
	
	$("#tagList tbody tr").hide().filter(function() {
			var trText;
//			if (filterType=="reqname" || filterType=="tag" || filterType=="reqstatus") {
				trText = $(this).find("." + filterType).text();
//			}
//			else {
//				trText = $(this).attr(filterType);
//			}
			if (trText==undefined) return false;

			if (trText.match(filterValue, regExprFlag)) {
				return true;
			}
			else return false;
		}).show();
}
