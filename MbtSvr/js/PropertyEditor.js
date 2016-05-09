// copyright 2008 - 2012, TestOptimal, LLC, all rights reserved.
// webmbtProperty.js

window.onerror = function gotError (errMsg, fileName, lineNum) {
	parentWinObj.handleJsError(errMsg, fileName, lineNum);
}

var curNodeData;

var assignDefaultParam;
var readonlyParam;

$(document).ready(function() {
	initFrame("Property");
	loadProperty(parentWinObj.curAppState.curPropNodeData, true, false);
	
	$(document).keypress(function(event) {
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13') {
		    save();
		    parentWinObj.closeDialog();
    	}
	});
});


function cancel() {
	return;
}

function loadCanvasProp(canvasProp) {
	var modelProp = parentWinObj.curAppState.nodeDataList["scxml"];
	canvasProp.color = modelProp.color;
	canvasProp.canvasWidth = modelProp.canvasWidth;
	canvasProp.canvasHeight = modelProp.canvasHeight;
	canvasProp.zoomPct = modelProp.zoomPct;
	canvasProp.showStateFlags = modelProp.showStateFlags;
	canvasProp.showTransFlags = modelProp.showTransFlags;
	canvasProp.graphlayout = modelProp.graphlayout;
//	canvasProp.expandSubmodel = modelProp.expandSubmodel;
//	canvasProp.shortLabel = modelProp.shortLabel;
}

function loadProperty(nodeData_p, assignDefault_p, readonly_p) {
	if (nodeData_p==null) return;
	if (nodeData_p.typeCode=="canvasProp") {
		loadCanvasProp(nodeData_p);
	}
	else if (nodeData_p.typeCode=="stateFilter" || nodeData_p.typeCode=="transitionFilter") {
		var filter = findSubModelStateFilter (nodeData_p);
		nodeData_p.markedRemoved = filter.markedRemoved;
		nodeData_p.penaltyValue = filter.penaltyValue;
		nodeData_p.traverseTimes = filter.traverseTimes;
		nodeData_p.targetUID = filter.targetUID;
		nodeData_p.stateUID = filter.stateUID;
		nodeData_p.stateID = filter.stateID;
		nodeData_p.event = filter.event;
		nodeData_p.type = filter.type;
	}
	curNodeData = nodeData_p;
	assignDefaultParam = assignDefault_p;
	readonlyParam = readonly_p;
	
	var propObj = parentWinObj.resolveMsg(nodeData_p.typeCode);

	curNodeData = nodeData_p;

	var idx2 = 0;
	if (nodeData_p.readOnly=="Y") readonly_p = true;

	for(prop in nodeData_p) {
		var editCheck = getEditCheckDef(curNodeData.typeCode+"."+prop);
		if (editCheck==null) continue;
		
		var curValue = curNodeData[prop];
		var propLabel = prop;
		propObj = parentWinObj.resolveMsg(prop);
		var propTitle = "";
		
		if (propObj!=undefined) {
			propTitle = propObj.desc;
			propLabel = propObj.code;
		}

		if (editCheck) {
//			if (parentWinObj.isShade(idx2)) shadeClass = "shade";
//			else shadeClass = "";
			idx2=idx2+1;

			var editCheckDomainQuery = null;
			if (editCheck.domainQuery) {
				editCheckDomainQuery = editCheck.domainQuery();
			}

			if (editCheck.edit==editable) {
				if (assignDefault_p && editCheck.defaultvalue && (nodeData_p.uid==undefined || nodeData_p.uid<=0 || curValue==undefined || curValue=="")) {
					curValue = editCheck.defaultvalue;
				}
				if (curValue==undefined) curValue = "";
				
				var readonlyTag = "";
				if (readonly_p) readonlyTag = "readonly";
				
				if (editCheck.type=="textarea") {
					$("#property").append("<tr><td valign='top' nowrap title='"+propTitle+"'>"+propLabel+"</td><td valign='top'><textarea rows='3' " + readonlyTag + " class='"+curNodeData.typeCode + " " + editCheck.editClass +"' id="+prop+">"+curValue+"</textarea></td></tr>");
				}
				else if (editCheck.type=="color") {
					$("#property").append("<tr><td valign='top' nowrap title='"+propTitle+"'>"+propLabel+"</td><td><input type='text' " + readonlyTag + " class='kolorPicker "+curNodeData.typeCode + " " + editCheck.editClass + "' id="+prop+" value=\""+curValue+"\"/></td></tr>");
				}
				else if (editCheckDomainQuery==null || editCheckDomainQuery.length==0 || readonlyTag!="") {
					$("#property").append("<tr><td nowrap valign='top' title='"+propTitle+"'>"+propLabel+"</td><td><input " + readonlyTag + " class='"+curNodeData.typeCode + " " + editCheck.editClass + "' id="+prop+" type=text value=\""+curValue+"\"/></td></tr>");
				}
				else if (editCheck.type=="multi" && editCheckDomainQuery!=null) {
					var valList = curValue.split(",");
					var selList = editCheckDomainQuery;
					var tempHtml = "<tr><td nowrap valign='top' title='" + propTitle + "'>" + propLabel + "</td><td>"
						+ "<ul class='multi " + curNodeData.typeCode + " " + editCheck.editClass + "' id='" + prop + "' >";
					for (var i2 in selList) {
						var iidx = checkFromList(selList[i2].code, valList, "checked");
						tempHtml += "<li><input type='checkbox' style='display:inline;' value='" + selList[i2].code + "' " + iidx + "/>&nbsp;" + selList[i2].desc + "</li>";
					}
					tempHtml += "</ul></td></tr>";
					$("#property").append(tempHtml);
				}
				else if (editCheck.type=="multiselect" && editCheckDomainQuery!=null && editCheckDomainQuery.length>0) {
					var valList = curValue.split(";");
					var tempHtml = "<tr><td nowrap title='" + propTitle + "'>" + propLabel + "</td><td nowrap>"
						+ "<select multiple='multiple' class='multiselect " + curNodeData.typeCode + " " + editCheck.editClass + "' id='" + prop + "' >";
					for (var i2 in editCheckDomainQuery) {
						var iidx = checkFromList(editCheckDomainQuery[i2].code, valList, "selected");
						tempHtml += "<option value='" + editCheckDomainQuery[i2].code + "' " + iidx + ">" + editCheckDomainQuery[i2].code + " - " + editCheckDomainQuery[i2].desc + "</option>";
					}
					tempHtml += "</select></td></tr>";
					$("#property").append(tempHtml);
					tagField = curValue;
					$("#"+prop).multiselect({header: false, selectedList: 4, selectedText: multiSelectLabel, click: multiSelectClick, position: {my:"center", at: "center"}});
					if (readonly_p) {
						$("#"+prop).multiselect("disable");
					}
				}
				else {
					$("#property").append("<tr><td nowrap title='"+propTitle+"'>"+propLabel+"</td><td><select " + readonlyTag + " class='"+curNodeData.typeCode + " " + editCheck.editClass + "' id="+prop+" value=\""+curValue+"\"/></td></tr>");
					var valList = editCheckDomainQuery; //editCheck.domainQuery();
					
// TODO:					$("#thread").removeOption(/./).addOption(valList, false).sortOptions(true);

					
					if (editCheck.required==undefined) {
						$("#"+prop).append("<option value=''></option>");
					}
					var classTag="";
					var disabledStr = "";
					var separatorFound=false;
					for (d in valList) {
						if (valList[d]!=undefined) {
							var selected="";
							if (valList[d].code!="" && valList[d].code==curValue) selected = "selected";
							else selected = "";
							disabledStr = "";
							
							if (separatorFound) {
								if ((valList[d].desc+" ").indexOf("--")==0) {
									disabledStr = "disabled='disabled'";
									if (classTag=="") classTag="class='shade'";
									else classTag = "";
								}
							}
							else {
								if (parentWinObj.isShade(d)) classTag = "class='shade'";
								else classTag = "";
							}
							
							$("#"+prop).append("<option "+classTag+" value='"+valList[d].code+"' " + selected + " " + disabledStr + ">"+valList[d].desc+"</option>");
						}
					}
				}
				
				if (!readonly_p) {
					if (editCheck.type=="multi") {
						$("#"+prop + " input").change(function() {
							changeHandler(this, prop);
						});	
					}
					else {
						$("#"+prop).change(function() {
							changeHandler(this, prop);
						});
					}
						
					if (editCheck.min!=undefined) {
						$("#"+prop).change(function() {
							if ($(this).val()=="") return;
							if (parseInt($(this).val()) != $(this).val()) {
								parentWinObj.alertDialog(parentWinObj.translateMsg("field.value.not.numeric", $(this).val()));					
							}
							var checkValue = getEditCheck($(this), "min");
							if (parseInt($(this).val())<checkValue) {
								parentWinObj.alertDialog(parentWinObj.translateMsg("field.value.min", parentWinObj.translateMsg($(this).parent().prev("td").text()), checkValue));
							}
						});
					}
					if (editCheck.max!=undefined) {
						$("#"+prop).change(function() {
							if ($(this).val()=="") return;
							if (parseInt($(this).val()) != $(this).val()) {
								parentWinObj.alertDialog(parentWinObj.translateMsg("field.value.not.numeric", $(this).val()));					
							}
							var checkValue = getEditCheck($(this), "max");
							if (parseInt($(this).val())>checkValue) {
								parentWinObj.alertDialog(parentWinObj.translateMsg("field.value.max", parentWinObj.translateMsg($(this).parent().prev("td").text()), checkValue));
							}
						});
					}
				}

				if (editCheck.onChange) {
					$("#"+prop).change(editCheck.onChange);
				}
			}
			else {
				if (editCheck.url) {
					$("#property").append("<tr><td valign='top' nowrap title='"+propTitle+"'>"+propLabel+"</td><td width='100%'><a href='javascript:parentWinObj.reloadMScriptEditTab(\"" + editCheck.url 
							+ "\");'><span id='" + prop + "'>"+parentWinObj.translateMsg(curNodeData[prop])+"</span></a></td></tr>");
				}
				else {
					$("#property").append("<tr><td valign='top' nowrap title='"+propTitle+"'>"+propLabel+"</td><td><span id='" + prop + "'>"+parentWinObj.translateMsg(curNodeData[prop])+"</span></td></tr>");
				}
			}
		}
		
		
	} // for 

	if (nodeData_p.typeCode=="scxml") {
			$("#javaclass").parent().append("<a href='app=webmbt&action=genJava' target=_blank title='Generate a skeleton java code from the model.'>generate</a>");
	}
	
//	if (nodeData_p.typeCode=="transition" && nodeData_p.dataset && nodeData_p.dataset!="") {
//		$("#dataset").parent().append("&nbsp;&nbsp;<a href='javascript:parentWinObj.selectTab(\"tabDSEditor\");' title='Edit data set'>Edit&nbsp;DataSet</a>");
//	}
	
	if (parentWinObj.isRuntime()) {
		$("#backupDate").parent().append(" &nbsp;<a href='javascript:showArchiveChange();' title='display changes made to this archival model'>Model Change History</a>");
	}
	else if (parentWinObj.curAppState.edition == "BasicMBT") {
		$(".nonBasic").parent().parent().hide();
	}
	
	// apply onInit handler
	for(prop in nodeData_p) {
		var editCheck = getEditCheckDef(curNodeData.typeCode+"."+prop);
		if (editCheck && editCheck.onInit) {
			editCheck.onInit.apply();
		}
	}
}

function changeHandler(elem, prop) {
	var thisValue = $(elem).val();
	if (thisValue==undefined) return;

	thisValue = validateFieldValue(prop, thisValue);
	$(elem).val(thisValue);

	// custom edit check
	var f = getEditCheck($(elem), "customCheck");
	
	if (f instanceof Function && !f(elem)) return;
	
	var excludeQuery = getEditCheck($(elem), "excludeQuery");
	if (excludeQuery==undefined) return;
	var excludes = parentWinObj.excludeQueryList[excludeQuery]
	if(excludes==undefined) return;
	for (k in excludes) {
		if (thisValue.indexOf(excludes[k])>=0) {
			parentWinObj.alertDialog(parentWinObj.translateMsg("field.not2contain", parentWinObj.translateMsg($(elem).parent().prev("td").text()), excludes[k]));
		}
	}
}


function propSave() {
	var ret = new Array();
	for(prop in curNodeData) {
		var editCheck = getEditCheckDef(curNodeData.typeCode+"."+prop);
		if (editCheck==undefined || editCheck==null || editCheck.edit != editable) {
			continue;
		}
		if (editCheck.required && editCheck.type==undefined && $("#"+prop).val()=="") {
			$("#"+prop).parent().prev().addClass("failed");
			var failField = resolveMsg(prop);
			if (failField==undefined) failField = prop
			else failField = failField.code;
			ret[ret.length] = failField;
		}
	}

	if (ret.length>0) {
		parentWinObj.alertDialog("Save failed due to following error, please correct:<br/>Required fields missing values: <ul><li>" + ret.join("</li><li>") + "</li></ul>");
		return false;
	}
		
	for(prop in curNodeData) {
		var editCheck = getEditCheckDef(curNodeData.typeCode+"."+prop);
		if (editCheck==undefined || editCheck==null || editCheck.edit != editable) {
			continue;
		}
		if (editCheck.type && editCheck.type=="multi") {
			var arrList = new Array();
			$("#"+prop + " :checked").each(function() {
				arrList[arrList.length] = $(this).val();
			});
			curNodeData[prop] = arrList.join(",");
		}
		else if (editCheck.type && editCheck.type=="multiselect" && editCheck.domainQuery().length>0) {
			var multiOpt = $("#"+prop).multiselect("getChecked");
			if (multiOpt.length<=0) tagField = "";
			curNodeData[prop] = tagField;
		}
		else {
			var propVal = $("#"+prop).val();
			if (prop=="targetUID" && curNodeData.typeCode=="transition") {
				var newTargetNode = parentWinObj.curAppState.nodeDataList[propVal];
				if (newTargetNode) {
					curNodeData.target = newTargetNode.stateid;
				}
			}
			curNodeData[prop] = propVal;
		}
	}	
	return true; // save good
}

function configSave () {
	propSave();
	parentWinObj.saveConfig();
}

function save () {
	if (curNodeData.typeCode=="config") {
		configSave();
	}
	else if (curNodeData.typeCode=="newModel") {
		if (!propSave()) return;
		parentWinObj.createNewModel(curNodeData);
	}
	else if (curNodeData.typeCode=="stateFilter") {
		if (!propSave()) return;
		saveStateFilter(curNodeData);
	}
	else if (curNodeData.typeCode=="transitionFilter") {
		if (!propSave()) return;
		saveTransFilter(curNodeData);
	}
	else {
		var oldStateId;
		if (curNodeData.typeCode=="state") {
			oldStateId = curNodeData.stateid;
		}
		if (!propSave()) return;
		
		if (curNodeData.typeCode=="state" && oldStateId!=curNodeData.stateid) {
			parentWinObj.stateIdRenamedAction(curNodeData, oldStateId);
		}
		if (curNodeData.typeCode=="canvasProp") {
			var modelProp = parentWinObj.curAppState.nodeDataList["scxml"];
			modelProp.color = curNodeData.color;
			modelProp.canvasWidth = curNodeData.canvasWidth;
			modelProp.canvasHeight = curNodeData.canvasHeight;
			modelProp.zoomPct = curNodeData.zoomPct;
			modelProp.showStateFlags = curNodeData.showStateFlags;
			modelProp.showTransFlags = curNodeData.showTransFlags;
			modelProp.graphlayout = curNodeData.graphlayout;
//			modelProp.expandSubmodel = curNodeData.expandSubmodel;
//			modelProp.shortLabel = curNodeData.shortLabel;
			curNodeData = modelProp;
		}
		parentWinObj.saveProperty (curNodeData);
		if (curNodeData.uid==undefined && curNodeData.typeCode=="state") {
			parentWinObj.addDomainValue("state.id", curNodeData.stateid);
		}
	}
}

function getEditCheck(field_p, prop_p) {
	var id = $(field_p).attr("id");
	if (id==undefined || id=="") {
		id = $(field_p).parent().parent().attr("id");
	}
	var editCheck = editAttr[curNodeData.typeCode+"."+id];
	if (editCheck) return editCheck[prop_p];
	else return $(field_p).val();
}

// custom edit check functions
function editCheckFilename () {
	var filename = $("#filename").val();
	var idx = filename.lastIndexOf(".scxml"); // handle old mode file names
	if (idx>0) {
		filename = filename.substring(0,idx);
			$("#filename").val(filename);
	}
	if (filename.indexOf("/")>=0 || filename.indexOf("\\")>=0) {
		parentWinObj.alertDialog ("file.name.illegal.char");
		return false;
	}
	else {
		return true;
	}
}

//custom edit check functions
function editCheckStateID (elem) {
	var stateid = $("#stateid").val().toUpperCase();
	if (stateid=="GRAPH" || stateid.indexOf(" ")>=0 || stateid.indexOf("-")>=0) {
		parentWinObj.alertDialog("stateid.illegal");
		return false;
	}
	else return true;
}

//custom edit check functions
function editCheckModelPlugins (elem) {
	var curPluginID = $(elem).val().toUpperCase();
	if (!$(elem).is(":checked")) {
		if (curPluginID=="ALM") {
			parentWinObj.setMode("modeALM", false);
		}
		return true;
	}

	var tOut = $("#lastTestCaseRpt").val();
	if (tOut==undefined || tOut=="") tOut = "TestCaseReport";
	var tOutLow = tOut.toLowerCase();

	if (curPluginID != "OWASP" && curPluginID != "SELENIUM") {
		return true;
	}
	
	var checkPluginID = "OWASP";
	if (curPluginID == "OWASP") {
		checkPluginID = "SELENIUM";	
	}

	$("#pluginID :checked").each(function() {
		if ($(this).val().toUpperCase() == checkPluginID) {
			parentWinObj.alertDialog("webplugin.ambiguous");
			$(this).attr("checked", "false");
			return false;
		}
	});

	
	return true;
}


function validateFieldValue(fieldName_p, fieldValue_p) {
	
	var msgObj = parentWinObj.resolveMsg(fieldName_p);
	if (msgObj) {
		fieldName_p = msgObj.code;
	}
	if (fieldValue_p.indexOf("\"")>=0) {
		fieldValue_p = parentWinObj.replaceAll(fieldValue_p, "\"", "'");
		parentWinObj.alertDialog(parentWinObj.translateMsg("char.not.allowed", "&quot;", fieldName_p, "'"));
	}
//	if (fieldValue_p.indexOf("&")>=0) {
//		fieldValue_p = parentWinObj.replaceAll(fieldValue_p, "&", "@");
//		parentWinObj.alertDialog(parentWinObj.translateMsg("char.not.allowed", "&amp;", fieldName_p, "@"));
//	}
	return fieldValue_p;
}

//propert attributes
var editable = 1;
var readonly = 2;
var editAttr = new Array()


editAttr ["canvasProp.color"] = { "edit": editable, "type": "color", "editClass": "f200" };
editAttr ["canvasProp.canvasWidth"] = {"edit": editable, "min": 100 , "editClass": "f50" };
editAttr ["canvasProp.canvasHeight"] = {"edit": editable, "min": 100 , "editClass": "f50" };
editAttr ["canvasProp.zoomPct"] = {"edit": editable, "min": 25, "max":250, "editClass": "f50", "onInit": initZoom };
editAttr ["canvasProp.showStateFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"};
editAttr ["canvasProp.showTransFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"};
editAttr ["canvasProp.graphlayout"] = {"edit": editable, "restriction": restrictDevOnly, "domainQuery": graphLayoutQuery, "editClass": "f100"};
//editAttr ["canvasProp.expandSubmodel"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};
//editAttr ["canvasProp.shortLabel"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};

editAttr ["newModel.curFolder"] = {"edit": readonly };
editAttr ["newModel.filename"] = {"edit": editable, "required": true, "customCheck": editCheckFilename, "restriction": restrictDevOnly, "editClass": "f400" };
editAttr ["newModel.desc"] = {"edit": editable, "required": false, "type": "textarea", "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["newModel.url"] = {"edit": editable , "editClass": "f400" };
editAttr ["newModel.browser"] = {"edit": editable, "required": false, "domainQuery": browserTypeListQuery , "editClass": "f200 nonBasic" };
editAttr ["newModel.pluginID"] = {"edit": editable, "optional": true, "domainQuery": pluginListQuery , "editClass": "", "type": "multi", "customCheck": editCheckModelPlugins };
editAttr ["newModel.modelType"] = {"edit": editable, "required": true, "domainQuery": modelTypeListQuery , "editClass": ""};
editAttr ["newModel.template"] = {"edit": editable, "required": true, "domainQuery": templateListQuery , "editClass": ""};

editAttr ["stateFilter.markedRemoved"] = {"edit": editable, "required": true , "restriction": restrictDevOnly, "domainQuery": yesNoQuery};
editAttr ["stateFilter.penaltyValue"] = {"edit": editable, "required": false, "restriction": restrictDevOnly, "editClass": "f100" };

editAttr ["transitionFilter.markedRemoved"] = {"edit": editable, "required": true , "restriction": restrictDevOnly, "domainQuery": yesNoQuery};
editAttr ["transitionFilter.penaltyValue"] = {"edit": editable, "required": false, "restriction": restrictDevOnly, "editClass": "f100", min: 1 };
editAttr ["transitionFilter.traverseTimes"] = {"edit": editable, "required": false, "restriction": restrictDevOnly, "editClass": "f100", min: 0 };

editAttr ["scxml.filename"] = {"edit": readonly, "customCheck": editCheckFilename, "restriction": restrictDevOnly, "editClass": "f400" };
editAttr ["scxml.desc"] = {"edit": editable, "required": false, "type": "textarea", "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.vrsn"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.aut"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.catCodes"] = {"edit": editable, "editClass": "f400" };
editAttr ["scxml.tagVrsn"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.build"] = {"edit": readonly , "editClass": "" };
//editAttr ["scxml.tagUri"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.uiMapUri"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.suppressVerify"] = {"edit": editable, "domainQuery": yesNoQuery};
editAttr ["scxml.suppressSubmodelVerify"] = {"edit": editable, "domainQuery": yesNoQuery};
editAttr ["scxml.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["scxml.backupDate"] = {"edit": readonly , "editClass": "" };
editAttr ["scxml.initVars"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["scxml.maxhistorystat"] = {"edit": editable, "min": 0 , "editClass": "f50" };
editAttr ["scxml.maxtranslog"] = {"edit": editable, "min": 0 , "editClass": "f50" };
editAttr ["scxml.authusers"] = {"edit": editable , "editClass": "f200" };
editAttr ["scxml.actiondelaymillis"] = {"edit": editable, "editClass": "f400 nonBasic" };
editAttr ["scxml.mscriptdelaymillis"] = {"edit": editable, "editClass": "f400 nonBasic" };
editAttr ["scxml.javaclass"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f350 nonBasic" };
editAttr ["scxml.browser"] = {"edit": editable, "domainQuery": browserTypeListQuery , "editClass": "f200 nonBasic" };
editAttr ["scxml.archiveDate"] = {"edit": readonly , "editClass": "" };
editAttr ["scxml.archiveVersionLabel"] = {"edit": readonly , "editClass": "" };
editAttr ["scxml.refModelList"] = {"edit": readonly , "editClass": "" };
editAttr ["scxml.versionTO"] = {"edit": readonly, "required": false, "editClass": "" };
editAttr ["scxml.lastTestCaseRpt"] = {"edit": editable, "required": true, "defaultvalue": "", "editClass": "f400" };
editAttr ["scxml.outputComment"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery };
editAttr ["scxml.savePassed"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery };
editAttr ["scxml.testPathGraphType"] = {"edit": editable, "required": true, "domainQuery": testPathGraphTypeQuery, "editClass": "f400" };

editAttr ["scxml.modelType"] = {"edit": editable, "required": true, "domainQuery": modelTypeListQuery , "editClass": ""};
editAttr ["scxml.url"] = {"edit": editable , "editClass": "f400" };
editAttr ["scxml.pluginID"] = {"edit": editable, "optional": true, "domainQuery": pluginListQuery , "editClass": "", "type": "multi", "customCheck": editCheckModelPlugins };
editAttr ["scxml.sleepMultiplier"] = {"edit": editable, "optional": true, "domainQuery": sleepMultiplierListQuery , "editClass": ""};
//editAttr ["scxml.showStateFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"}; //, "type": "multiselect", "domainQuery": stateFlagsQuery};
//editAttr ["scxml.showTransFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"}; //, "type": "multiselect", "domainQuery": transFlagsQuery};


editAttr ["state.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["state.stateid"] = {"edit": editable, "required": true, "customCheck": editCheckStateID, "restriction": restrictDevOnly , "editClass": "f400", "onChange": onChangeStateID };
editAttr ["state.isinitial"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};
editAttr ["state.isfinal"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};
editAttr ["state.finalMustExit"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};
//editAttr ["state.allowByPass"] = {"edit": editable, "required": true, "defaultvalue": "N", "domainQuery": yesNoQuery, "restriction": restrictDevOnly};
editAttr ["state.desc"] = {"edit": editable, "required": false, "type": "textarea", "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["state.tags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400", "type": "multiselect", "domainQuery": tagQuery};
editAttr ["state.assertID"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["state.color"] = { "edit": editable, "type": "color", "editClass": "f200" };
editAttr ["state.maxmillis"] = {"edit": editable, "min": 0, "max": 300000 , "editClass": "f50 nonBasic" };
editAttr ["state.textColor"] = { "edit": editable, "type": "color", "editClass": "f200" };
editAttr ["state.stateurl"] = {"edit": editable, "required": false , "editClass": "f400" };
editAttr ["state.entrydelaymillis"] = {"edit": editable, "editClass": "f400 nonBasic" };
editAttr ["state.subModel"] = {"edit": editable, "domainQuery": subModelListQuery, "restriction": restrictDevOnly, "onInit": onChangeSubModel, "onChange": onChangeSubModel, "editClass": "f400" };
editAttr ["state.subModelFilter"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["state.subModelPrefix"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["state.activateType"] = {"edit": editable, "domainQuery": activateTypeQuery, "restriction": restrictConcurrentType , "editClass": "f200" };
editAttr ["state.activateThreshold"] = {"edit": editable, "min": 0 , "editClass": "f50 nonBasic", "restriction": restrictConcurrentType };
editAttr ["state.firingType"] = {"edit": editable, "domainQuery": firingTypeQuery, "restriction": restrictConcurrentType , "editClass": "f200" };
editAttr ["state.stereotype"] = {"edit": editable, "domainQuery": stateStereotypeQuery, "editClass": "f200" };
editAttr ["state.subModelSequencer"] = {"edit": editable, "domainQuery": subModelSequencerQuery, "editClass": "f200", "onChange": onChangeSubModelSequencer, "onInit": onChangeSubModelSequencer};

editAttr ["transition.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["transition.event"] = {"edit": editable, "required": true, "restriction": restrictDevOnly , "editClass": "f400", "onChange": onChangeEvent };
editAttr ["transition.targetUID"] = {"edit": editable, "required": true, "domainQuery": stateQuery, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.weight"] = {"edit": editable, "defaultvalue": 5, "min": 0, "max": 100, "editClass": "f50" };
editAttr ["transition.traverses"] = {"edit": editable, "required": true, "defaultvalue": 1, "min": 0 , "editClass": "f50" };
editAttr ["transition.maxmillis"] = {"edit": editable, "min": 0, "max": 300000 , "editClass": "f50 nonBasic" };
editAttr ["transition.actiondelaymillis"] = {"edit": editable, "editClass": "f400 nonBasic" };
editAttr ["transition.desc"] = {"edit": editable, "required": false, "type":"textarea", "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.tags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400", type: "multiselect", "domainQuery": tagQuery};
editAttr ["transition.assertID"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.guard"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.set"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.guardHint"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.satisfyingHint"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["transition.color"] = { "edit": editable, "type": "color", "editClass": "f150" };
editAttr ["transition.stereotype"] = {"edit": editable, "domainQuery": transStereotypeQuery, "editClass": "f200" };
editAttr ["transition.url"] = { "edit": editable, "restriction": restrictDevOnly  , "editClass": "f400" };
//editAttr ["transition.submodelFinalState"] = { "edit": editable, "restriction": restrictDevOnly  , "editClass": "f400", "domainQuery": subModelFinalStateListQuery, "onInit": onSubModelTrans };

editAttr ["mbt.execnum"] = {"edit": editable, "min": 1 , "editClass": "f50 nonConcurrent" };
//editAttr ["mbt.seqByMainModel"] = {"edit": editable, required: true, "domainQuery": subModelSeqModeQuery, "editClass": "f200" };
editAttr ["mbt.iterationdelay"] = {"edit": editable, "editClass": "f50 nonBasic nonConcurrent" };
editAttr ["mbt.threadspreaddelay"] = {"edit": editable, "editClass": "f50 nonBasic nonConcurrent"};
editAttr ["mbt.parallelMode"] = {"edit": editable, "required": true, "editClass": "nonBasic nonConcurrent", "domainQuery": parallelModeQuery};
editAttr ["mbt.execthreadnum"] = {"edit": editable, "min": 1, "editClass": "f50 nonBasic nonConcurrent" };
editAttr ["mbt.mode"] = {"edit": editable, "required": true, "defaultvalue": "optimalSequence", "domainQuery": mbtModeQuery , "editClass": "f200", "onChange": onChangeSequencer, "onInit": onInitSequencer};
editAttr ["mbt.coverageType"] = {"edit": editable, "required": true, "defaultvalue": "alltrans", "domainQuery": coverageTypeQuery , "editClass": "f150 nonConcurrent" };
editAttr ["mbt.seed"] = {"edit": editable, "min": 0, "max": 99999999 , "editClass": "f100" };
editAttr ["mbt.seqParams"] = {"edit": editable, "editClass": "f200" };
editAttr ["mbt.shufflePaths"] = {"edit": editable, "required": true , "domainQuery": yesNoQuery, "editClass": "nonConcurrent" };
editAttr ["mbt.stopAtFinalOnly"] = {"edit": editable, "required": true , "domainQuery": yesNoQuery, "editClass": "nonConcurrent" };
editAttr ["mbt.stopcoverage"] = {"edit": editable, "required": false, "max": 100, "domainQuery": mbtStopcoverageQuery, "editClass": "f100" };
editAttr ["mbt.stopReqCoverage"] = {"edit": editable, "required": false, "max": 100, "domainQuery": mbtStopcoverageQuery, "editClass": "f100" };
editAttr ["mbt.stopcount"] = {"edit": editable, "min": 1 , "editClass": "f50" };
editAttr ["mbt.stoptime"] = {"edit": editable, "min": 1 , "editClass": "f50" };
editAttr ["mbt.stophomeruncount"] = {"edit": editable, "min": 1 , "editClass": "f50 nonConcurrent" };
editAttr ["mbt.stopexception"] = {"edit": editable, "min": 0 , "editClass": "f50" };
editAttr ["mbt.uid"] = {"edit": readonly , "editClass": "" };

editAttr ["swimlane.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["swimlane.swimlaneName"] = {"edit": editable, "editClass": "f400" };
editAttr ["swimlane.swimlaneCssStyle"] = {"edit": editable, "editClass": "f400" };
editAttr ["swimlane.laneLabels"] = {"edit": editable, "editClass": "f400" };
editAttr ["swimlane.swimlaneOrient"] = {"edit": editable, "required": true, "domainQuery": swimlaneOrientationQuery, "editClass": "f100" };

editAttr ["box.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["box.name"] = {"edit": editable, "required": true, "editClass": "f400" };
editAttr ["box.desc"] = {"edit": editable, "required": true, "type": "textarea", "editClass": "f400" };
editAttr ["box.cssStyle"] = {"edit": editable, "editClass": "f400" };
editAttr ["box.color"] = {"edit": editable, "type": "color", "editClass": "f100" };
editAttr ["box.textColor"] = {"edit": editable, "type": "color", "editClass": "f100" };
editAttr ["box.left"] = {"edit": editable, "required": true,  "editClass": "f100" };
editAttr ["box.top"] = {"edit": editable, "required": true,  "editClass": "f100" };
editAttr ["box.width"] = {"edit": editable, "required": true, "editClass": "f100" };
editAttr ["box.height"] = {"edit": editable, "required": true, "editClass": "f100" };
editAttr ["box.borderWidth"] = {"edit": editable, "required": true, "editClass": "f100" };
editAttr ["box.borderStyle"] = {"edit": editable, "required": true, "domainQuery": borderStyleQuery, "editClass": "f100" };

editAttr ["config.alert"] = {"edit": readonly , "editClass": "" };
editAttr ["config.adminusers"] = {"edit": editable , "editClass": "f400" };
editAttr ["config.authclass"] = {"edit": editable , "editClass": "f400" };
editAttr ["config.authrealm"] = {"edit": editable , "editClass": "f400" };
editAttr ["config.catCodes"] = {"edit": readonly , "editClass": "" };
editAttr ["config.DelSnapScreenOnModelStart"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};
editAttr ["config.stateFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"}; //, "type": "multiselect", "domainQuery": stateFlagsQuery};
editAttr ["config.transFlags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400"}; //, "type": "multiselect", "domainQuery": transFlagsQuery};
editAttr ["config.modelTreeViewSort"] = {"edit": editable, "editClass": "f100", "domainQuery": treeViewSortQuery};

editAttr ["config.ideAutoStart"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};
editAttr ["config.issuedate"] = {"edit": readonly, "editClass": "f50" };
editAttr ["config.licenseexception"] = {"edit": readonly , "editClass": "" };
editAttr ["config.licType"] = {"edit": readonly, "editClass": "" };
editAttr ["config.graphShowWeight"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};
editAttr ["config.MScriptWrap"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};
editAttr ["config.mScriptWrapAttr"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};
editAttr ["config.defaultAUT"] = {"edit": editable, "required": true, "domainQuery": yesNoQuery};

editAttr ["config.osName"] = {"edit": readonly , "editClass": "" };
editAttr ["config.osVersion"] = {"edit": readonly , "editClass": "" };
editAttr ["config.javaVersion"] = {"edit": readonly , "editClass": "" };
editAttr ["config.TestOptimalVersion"] = {"edit": readonly , "editClass": "" };
editAttr ["config.hostport"] = {"edit": readonly , "editClass": "" };
editAttr ["config.ipaddress"] = {"edit": readonly , "editClass": "" };
editAttr ["config.email"] = {"edit": readonly };
editAttr ["config.licensekey"] = {"edit": readonly };
editAttr ["config.expirationdate"] = {"edit": readonly , "editClass": "" };
editAttr ["config.exceptions"] = {"edit": readonly , "editClass": "" };
editAttr ["config.prodlevel"] = {"edit": readonly , "editClass": "" };
editAttr ["config.releaseDate"] = {"edit": readonly , "editClass": "" };
editAttr ["config.sessionnum"] = {"edit": readonly , "editClass": "nonBasic" };
editAttr ["config.maxthreadnum"] = {"edit": readonly , "editClass": "nonBasic" };
editAttr ["config.scList"] = {"edit": editable , "editClass": "f400" };
editAttr ["config.SvrMgrUrl"] = {"edit": editable , "editClass": "f400" };
editAttr ["config.mScriptIndent"] = {"edit": editable , "editClass": "f50", "min": 0, "max": 20 };

editAttr ["usecase.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["usecase.usecasename"] = {"edit": editable, "required": true , "editClass": "f400" };
editAttr ["usecase.desc"] = {"edit": editable, "required": false, "type": "textarea" , "editClass": "f400" };
editAttr ["usecase.tags"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400", type: "multiselect", "domainQuery": tagQuery };
editAttr ["usecase.assertID"] = {"edit": editable, "restriction": restrictDevOnly , "editClass": "f400" };
editAttr ["usecase.numexec"] = {"edit": editable, "defaultvalue": 1, "min": 1 , "editClass": "f50" };
editAttr ["usecase.penaltyValue"] = {"edit": editable, "defaultvalue": 10000, "required": false, "min": 1, "editClass": "f100" };
editAttr ["step.uid"] = {"edit": readonly , "editClass": "" };
editAttr ["step.state"] = {"edit": readonly , "editClass": "" };
editAttr ["step.event"] = {"edit": readonly , "editClass": "" };
editAttr ["step.desc"] = {"edit": editable, "required": false, "type": "textarea" , "editClass": "f400" };
editAttr ["step.removeFlag"] = {"edit": editable, "required": false, "domainQuery": yesNoQuery};

function restrictDevOnly() {
	if (parentWinObj.isRuntime() || 
		parentWinObj.curAppState.webmbtObj && 
		parentWinObj.curAppState.webmbtObj.model.archiveModel) {
		return "readonly";
	}
	else {
		return "";
	}
}

function restrictConcurrentType() {
	if (parentWinObj.curAppState.nodeDataList.config.realprodlevel!="Enterprise") return "hide";
	return restrictDevOnly();
}

function getEditCheckDef(name_p) {
	var eCheck = editAttr[name_p];
	if (eCheck==undefined) return eCheck;
	var restriction = "";
	if (eCheck.restriction && eCheck.restriction!="") {
		restriction = eCheck.restriction.apply();
	}
	if (restriction=="hide") return null;
	
	if (readonlyParam ||  restriction=="readonly") {
		eCheck = parentWinObj.clone(eCheck);
		eCheck.edit = readonly;
	}
	return eCheck;
}


function CodeDesc (code_p, desc_p) {
	this.code = code_p;
	this.desc = desc_p;
}


//returns the list of states for dropdown field
function stateQuery () {
	var retList = new Array();
	for (i in parentWinObj.curAppState.nodeDataList) {
		var tempNodeData = parentWinObj.curAppState.nodeDataList[i];
		if (tempNodeData && tempNodeData.typeCode=="state" &&
			tempNodeData.uid && tempNodeData.parentuid && tempNodeData.readOnly=="N") {
			var tempVal = new CodeDesc();
//			tempVal.code = tempNodeData.stateid;
			tempVal.code = tempNodeData.uid;
			tempVal.desc = tempNodeData.stateid;
			retList[retList.length] = tempVal;
		}
	}
	return retList.sort(compCodeDesc);
}

var subModelList;
function subModelListQuery () {
	if (subModelList) return subModelList;
	subModelList = new Array();
	for (i in parentWinObj.curAppState.subModelList) {
		var tempVal = new CodeDesc();
		tempVal.code = parentWinObj.curAppState.subModelList[i];
		tempVal.desc = tempVal.code;
		subModelList[subModelList.length] = tempVal;
	}
	subModelList = subModelList.sort(compCodeDesc);
	return subModelList;
}

var pluginList = undefined;

function pluginListQuery () {
	var pluginList = new Array();
	if (parentWinObj.curAppState.pluginList!=undefined) {
		pluginList = parentWinObj.curAppState.pluginList;
	}
	pluginList = pluginList.sort(compCodeDesc);
	return pluginList;
}

function compCodeDesc(code1, code2) {
	if (code1.desc.toUpperCase()>code2.desc.toUpperCase()) return 1;
	else return -11;
}

var mbtStopcoverageList = [
   			{"code": 0, "desc": "" }, 
			{"code": 10, "desc": "10%" }, 
			{"code": 20, "desc": "20%" }, 
			{"code": 25, "desc": "25%" }, 
			{"code": 30, "desc": "30%" }, 
			{"code": 40, "desc": "40%" }, 
			{"code": 50, "desc": "50%" }, 
			{"code": 60, "desc": "60%" }, 
			{"code": 70, "desc": "70%" },
			{"code": 75, "desc": "75%" },
			{"code": 80, "desc": "80%" },
			{"code": 85, "desc": "85%" },
			{"code": 90, "desc": "90%" },
			{"code": 95, "desc": "95%" },
			{"code": 100, "desc": "100%" }];
function mbtStopcoverageQuery () {
	return mbtStopcoverageList;
}

var browserTypeList = [
  			{"code": "firefox", "desc": "FireFox"}, 
  			{"code": "googlechrome", "desc": "Google Chrome"},
  			{"code": "iexplore", "desc": "Internet Explorer"},
  			{"code": "opera", "desc": "Opera"},
  			{"code": "safari", "desc": "Safari"}, 
  			{"code": "iphone", "desc": "iPhone"}, 
  			{"code": "android", "desc": "Android"}, 
  			{"code": "ipad", "desc": "iPad"}, 
  			{"code": "htmlunit", "desc": "Simulated Browser"}];

function browserTypeListQuery () {
	return browserTypeList;
}

function subModelSeqModeQuery () {
	return [
  			{"code": "N", "desc": "Use Sub-Model"},
  			{"code": "Y", "desc": "Use Main-Model"} 
	];
}

function subModelSequencerQuery () {
	return [
           {"code": "optimalSequence", "desc": "Optimal"},
           {"code": "randomSequence", "desc": "Random Walk - Markov"},
           {"code": "greedySequence", "desc": "Random Walk - Greedy"},
           {"code": "priorityPath", "desc": "Priority Path"},
           {"code": "pathFinder", "desc": "Path Finder"},
           {"code": "mCaseSerial", "desc": "MCase - Serial"},
           {"code": "mCaseOptimal", "desc": "MCase - Optimal"}
    ];
}

var treeViewSortList = [
  			{"code": "Auto", "desc": "Auto"}, 
  			{"code": "Manual", "desc": "Manual"}];

function treeViewSortQuery () {
	return treeViewSortList;
}


var swimlaneOrientationList = [
  			{"code": "horizontal", "desc": "Horizontal"}, 
  			{"code": "vertical", "desc": "Vertical"}
  		];

function swimlaneOrientationQuery () {
	return swimlaneOrientationList;
}

var borderStyleList = [
 			{"code": "none", "desc": "none"}, 
 			{"code": "dotted", "desc": "dotted"},
 			{"code": "dashed", "desc": "dashed"},
 			{"code": "solid", "desc": "solid"},
 			{"code": "double", "desc": "double"},
 			{"code": "groove", "desc": "groove"},
 			{"code": "ridge", "desc": "ridge"},
 			{"code": "inset", "desc": "inset"},
 			{"code": "outset", "desc": "outset"}
 		];
function borderStyleQuery () {
	return borderStyleList;
}

var activateTypeList = [
  			{"code": "TRAV_COUNT", "desc": "Traversal count - default"}, 
  			{"code": "TRANS_COUNT", "desc": "Transition count"}, 
  			{"code": "VAR", "desc": "By path var _activateState"},
  			{"code": "WEIGHT", "desc": "Sum of transition weight"}];

function activateTypeQuery () {
	return activateTypeList;
}


var firingTypeList = [
  			{"code": "RANDOM", "desc": "Random - default"}, 
  			{"code": "VAR", "desc": "Transition in path var _triggerTransName"}, 
  			{"code": "ALL", "desc": "All transitions"}];

function firingTypeQuery () {
	return firingTypeList;
}


function stateStereotypeQuery () {
	return parent.curAppState.nodeDataList["config"].stateStereotypeList;
}

function transStereotypeQuery () {
	return parent.curAppState.nodeDataList["config"].transStereotypeList;
}

var modelTypeList = [
	{"code": "CFG", "desc": "Activity Diagram"},
	{"code": "FSM", "desc": "State Diagram"},
	{"code": "Mixed", "desc": "Mixed Diagram"}];

function modelTypeListQuery()  {
	return modelTypeList;
}

function templateListQuery()  {
	var templateList = [];
	var tList = parent.curAppState.nodeDataList["config"].templateList;
	for (i in tList) {
		templateList.push({code: tList[i], desc: tList[i]});
	}
	return templateList;
}

var yesNoList = [{"code": "Y", "desc": "Yes"},
                 {"code": "N", "desc": "No"}];
function yesNoQuery () {
	return yesNoList;
}

function transLogModeQuery () {
	return [{"code": "Y", "desc": "Discard New"},
            {"code": "N", "desc": "Override Old"}];
}

var enableDisableList = [{"code": "Y", "desc": "Enabled"},
                         {"code": "N", "desc": "Disabled"}];

function enableDisableQuery () {
	return enableDisableList;
}

function tagQuery() {
	var tagList = new Array();
	var reqTagList = parentWinObj.getReqTagList();
	for (var i in reqTagList) {
		var tagObj = reqTagList[i];
		var aItem = new CodeDesc();
		aItem.code = tagObj.tag;
		aItem.desc = tagObj.name;
		tagList[tagList.length] = aItem;
	}
	return tagList;
}

var sleepMultiplierList = [
					  {"code": "0", "desc": "disabled"},
					  {"code": "0.25", "desc": "x 0.25"},
					  {"code": "0.50", "desc": "x 0.50"},
					  {"code": "0.75", "desc": "x 0.75"},
					  {"code": "1.25", "desc": "x 1.25"},
					  {"code": "1.50", "desc": "x 1.50"},
					  {"code": "1.75", "desc": "x 1.75"}, 
					  {"code": "2.0", "desc": "x 2"},
					  {"code": "3.0", "desc": "x 3"},
					  {"code": "5.0", "desc": "x 5"} 
						];

function sleepMultiplierListQuery() {
	return sleepMultiplierList;
}



var stateFlagsList = [
					  {"code": "D", "desc": "Get Data Flag"},
					  {"code": "R", "desc": "Requirements Flag"},
					  {"code": "V", "desc": "Set Var Flag"}
						];

function stateFlagsQuery() {
	return stateFlagsList;
}

var transFlagsList = [
					  {"code": "D", "desc": "Get Data Flag"},
					  {"code": "F", "desc": "Final Transition Flag"},
					  {"code": "G", "desc": "Guard Flag"},
					  {"code": "M", "desc": "Mutliple Traversals Required"},
					  {"code": "R", "desc": "Requirements Flag"},
					  {"code": "V", "desc": "Set Var Flag"},
					  {"code": "W", "desc": "Transition Weight"}
						];

function transFlagsQuery() {
	return transFlagsList;
}


var labelPosList = [
  			{"code": "start", "desc": "Start"}, 
  			{"code": "mid", "desc": "Middle"}, 
  			{"code": "end", "desc": "End"}];

function labelPosQuery () {
	return labelPosList;
}

var graphLayoutList = [
             {"code": "Horizontal", "desc": "Left->Right"},
             {"code": "Vertical", "desc": "Top->Bottom"} ];
             
function graphLayoutQuery () {
	return graphLayoutList;
}

var mbtModeList = [
          {"code": "optimalSequence", "desc": "Optimal"},
          {"code": "randomSequence", "desc": "Random Walk - Markov"},
          {"code": "greedySequence", "desc": "Random Walk - Greedy"},
          {"code": "priorityPath", "desc": "Priority Path"},
          {"code": "pathFinder", "desc": "Path Finder"},
          {"code": "mCaseSerial", "desc": "MCase - Serial"},
          {"code": "mCaseOptimal", "desc": "MCase - Optimal"}
//		  {"code": "BDTScenario", "desc": "BDT Scenario"}
		  ];
var concChecked = false;
function mbtModeQuery () {
	if (!concChecked && parentWinObj.curAppState.realEdition=="Enterprise" || 
		parentWinObj.isRuntime()) {
		mbtModeList[mbtModeList.length] = {"code": "ConcurrentSequence", "desc": "Concurrent"};
		concChecked = true;
	}
	return mbtModeList;
}

var coverageTypeList = [
          {"code": "alltrans", "desc": "Transition"}, 
          {"code": "allpaths", "desc": "Paths"}
       ];

function coverageTypeQuery () {
	return coverageTypeList;
}


var parallelModeList = [
          {"code": "Duplicate", "desc": "Duplicate"}, 
          {"code": "Shared", "desc": "Shared"}
       ];


function parallelModeQuery () {
	return parallelModeList;
}


var testPathGraphTypeList = [
          {"code": "FSM", "desc": "FSM Graph"}, 
          {"code": "MSC", "desc": "MSC Chart"}
	];

function testPathGraphTypeQuery() {
	return testPathGraphTypeList;
}


// no longer need to control, visible all the times
function onChangeSubModelSequencer () {
//	var newVal = $("#subModelSequencer option:selected").val();
//	if (newVal=="") {
//		$("#subModelPrefix, #finalMustExit, #subModelFilter").parent().parent().hide();
//		$("#finalMustExit").val("N");
//		$("#finalMustExit").parent().parent().hide();
//		$("#subModelFilter").parent().parent().hide();
//	}
//	else {
//		$("#subModelPrefix, #finalMustExit, #subModelFilter").parent().parent().show();
//		$("#subModelPrefix").parent().parent().show();
//		$("#finalMustExit").parent().parent().show();
//		$("#subModelFilter").parent().parent().show();
//	}
}

function removeInvalidStateTransChar (newName) {
	return newName.replace(/\/|\\|\t/g, '');
}

function onChangeEvent () {
	var newName = $("#event").val();
	$("#event").val(removeInvalidStateTransChar(newName));
}

function onChangeStateID () {
	var newName = $("#stateid").val();
	$("#stateid").val(removeInvalidStateTransChar(newName));
}

function onChangeSequencer() {
	var newVal = $("#mode option:selected").val();

	$(".nonConcurrent").parent().parent().show();
	if (newVal=="ConcurrentSequence") {
		$(".nonConcurrent").parent().parent().hide();
		return;
	}
	
	
	if (newVal!="optimalSequence") {
		$("#coverageType").parent().parent().hide();
	}
	else {
		$("#coverageType").parent().parent().show();
	}
	
	if (newVal=="ConcurrentSequence" || newVal=="randomSequence" || newVal=="greedySequence") {
		$("#parallelMode").parent().parent().hide();
//		if ($("#stopcoverage").val()=='0') {
//			$("#stopcoverage").val(100);
//		}
	}
	else {
		$("#parallelMode").parent().parent().show();
//		$("#stopcoverage").val(0);
//		$("#stopcoverage option[value='0']").html("");
	}
	

}

function onInitSequencer() {
	onChangeSequencer();
}

//function onSubModelTrans () {
//	if (parentWinObj.curAppState.nodeDataList[curNodeData.parentuid].subModelFinalStateList==undefined) {
//		$("#submodelFinalState").parent().parent().hide();	
//	}
//}

// addon methods
function setProperty(fieldName_p, fieldValue_p) {
	fieldValue_p = validateFieldValue(fieldName_p, fieldValue_p);
	
	$("#" + fieldName_p).val(fieldValue_p);
}

function getCurTrans() {
	return curNodeData;
}

function getCurState() {
	return parentWinObj.curAppState.nodeDataList[curNodeData.parentuid];
}

function showArchiveChange() {
	parentWinObj.sendAction("getArchChanges", "", function(data) {
		if (parentWinObj.actionCallback(data)) return;
		parentWinObj.alertDialog("<ol><li>" + data.changelog.join("</li><li>") + "</li></ol>");
	});
}

function showTags() {
	var tags = $("#tags").val();
	if (tags=="") {
		parentWinObj.alertDialog("");
		return;
	}
	
	parentWinObj.sendAction("tag", "type=getDesc&tags=" + tags, function (data) {
		if (parentWinObj.actionCallback(data)) return;

		var msg = "";
		for (var i in data) {
			if (i > 0) msg += "<br/>";
			msg += data[i].tag + ": " + data[i].desc;
		}
		parentWinObj.alertDialog(msg);
	});
}

// returns checked or blank
function checkFromList(val_p, list_p, foundReturn) {
	for (var i in list_p) {
		if (list_p[i]==val_p) return foundReturn;
	}
	return '';
}

var tagField = "";
function multiSelectLabel (numChecked, numTotal, checkedItems) {
	var ret = "";
	for (var i in checkedItems) {
		if (ret!="") ret += ";";
		ret = ret + checkedItems[i].value;
	}
	tagField = ret;
	return ret;
}

function multiSelectClick() {
//	setFormChanged(true);
}

function onChangeSubModel() {
	if ($("#subModel").val()=="") {
		$("#subModelSequencer").parent().parent().hide();
		$("#subModelSequencer").val("");
		$("#subModelPrefix, #finalMustExit, #subModelFilter").parent().parent().hide();
//		$("#finalMustExit").hide();
//		$("#subModelFilter").hide();
	}
	else {
		$("#subModelSequencer").parent().parent().show();
		$("#subModelPrefix, #finalMustExit, #subModelFilter").parent().parent().show();
//		$("#finalMustExit").show();
//		$("#subModelFilter").show();
	}
}

function mainCallbackFunc(action_p, params_p) {
	if (action_p=="save") {
		save();
	}
	else if (action_p=="isChanged") {
		return false; // should not be called as this is a dialog window
	}
	else if (action_p=="adjustHeight") {
		return;// no need
	}
}


function saveStateFilter(filter_p) {
	parentWinObj.sendAction("submodel", "type=updateStateFilter&stateUID=" + filter_p.stateUID 
		+ "&targetUID=" + filter_p.targetUID + "&markedRemoved=" + filter_p.markedRemoved
		+ "&penaltyValue=" + filter_p.penaltyValue, function(data) {
		// update/remove filter from nodeData
		setSubModelStateFilter (filter_p);

		// notify model editor to update diagram
		parentWinObj.runWinAction("Model", "updateSubModelStateTrans", filter_p);
		parentWinObj.setModelChanged(true);
	});
}


function saveTransFilter(filter_p) {
	parentWinObj.sendAction("submodel", "type=updateTransFilter&stateUID=" + filter_p.stateUID 
		+ "&targetUID=" + filter_p.targetUID + "&markedRemoved=" + filter_p.markedRemoved
		+ "&penaltyValue=" + filter_p.penaltyValue + "&traverseTimes=" + filter_p.traverseTimes, function(data) {
		// update/remove filter from nodeData
		setSubModelStateFilter (filter_p);
		
		// notify model editor to update diagram
		parentWinObj.runWinAction("Model", "updateSubModelStateTrans", filter_p);
		parentWinObj.setModelChanged(true);
	});
}


function setSubModelStateFilter (filterNode_p) {
	var stateNode = parentWinObj.curAppState.nodeDataList[filterNode_p.stateUID];
	if (stateNode==undefined) return;
	
	for (var i in stateNode.filterList) {
		var filter = stateNode.filterList[i];
		if (filter && filter.type==filterNode_p.type && filter.stateID==filterNode_p.stateID &&
			(filter.type=="state" || filter.event == filterNode_p.event)) {
			if (filterNode_p.markedRemoved=="N" && filterNode_p.penaltyValue=="" && (filterNode_p.type=="state" || filterNode_p.traverseTimes=="")) {
				stateNode.filterList[i] = undefined;
			}
			else stateNode.filterList[i] = filterNode_p;
			return;
		}
	}
	
	if (filterNode_p.markedRemoved=="Y" || filterNode_p.penaltyValue!="" || filterNode_p.type=="transition" && filterNode_p.traverseTimes!="") {
		stateNode.filterList[stateNode.filterList.length] = filterNode_p;
	}
	return; // not found
}

function findSubModelStateFilter (filter_p) {
	var stateNode = parentWinObj.curAppState.nodeDataList[filter_p.stateUID];
	if (stateNode==undefined) return;
	
	var targetNode = parentWinObj.curAppState.nodeDataList[filter_p.targetUID];
	if (targetNode==undefined) return;
	
	var targetStateNode = targetNode;
	if (targetNode.typeCode=="transition") {
		targetStateNode = parentWinObj.curAppState.nodeDataList[targetStateNode.parentuid]
		if (targetStateNode==undefined) return;
	}
	
	for (var i in stateNode.filterList) {
		var filter = stateNode.filterList[i];
		if (filter && filter.type==targetNode.typeCode && filter.stateID==targetStateNode.stateid
				&& (filter.type=="state" || filter.event == targetNode.event)) {
			filter.type = filter_p.type;
			filter.stateUID = filter_p.stateUID;
			filter.targetUID = filter_p.targetUID;
			return filter;
		}
	}
	
	filter = {
		type: targetNode.typeCode,
		stateID: targetStateNode.stateid,
		markedRemoved: "N",
		penaltyValue: "",
		stateUID: stateNode.uid,
		targetUID: targetNode.uid
	};
		
	if (targetNode.typeCode == "transition") {
		filter.traverseTimes = "";
		filter.event = targetNode.event;
	}
	
	
	return filter;
}


function initZoom() {
	if ($.browser.webkit) {
		$("#zoomPct").parent().parent().hide();
	}
}