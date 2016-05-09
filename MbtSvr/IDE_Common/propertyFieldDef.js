// this contains a list of field definition.  It also provides a 
// function to prepare the raw field retrieved from the server, e.g.
// resolving the message translation, yes/no field domain, etc.
var treeViewSortList = [
       {"code": "Auto", "desc": "Auto"}, 
       {"code": "Manual", "desc": "Manual"}
    ];

function restrictDevOnly() {
//	if (parentWinObj.isRuntime() || 
//		parentWinObj.curAppState.webmbtObj && 
//		parentWinObj.curAppState.webmbtObj.model.archiveModel) {
//		return "readonly";
//	}
//	else {
		return "";
//	}
}

var configPropDef = {
	"email": {},
	"prodlevel": { },
	"TestOptimalVersion": { },
	"releaseDate": {},
	"catCodes": { },
//	"MScriptWrap": {"type": "YesNo"},
//	"mScriptWrapAttr": {"type": "YesNo"},
//	"mScriptIndent": {"type": "number", "required": true, "min": 0, "max": 20 },
	"stateFlags": {"type": "text", style: "text-transform: uppercase", autoFocus: true}, 
	"transFlags": {"type": "text", style: "text-transform: uppercase"}, 
//	"scList": {"type": "text", style: "text-transform: uppercase" },
	"SvrMgrUrl": {"type": "url"},
	"DelSnapScreenOnModelStart": {"type": "YesNo"},
	"ideAutoStart": {"type": "YesNo"}
//	"defaultAUT": {"type": "YesNo"},
//	"modelTreeViewSort": {"type": "selectList", domain: treeViewSortList}
}

var licInfoPropDef = {
	"hostport": {},
	"osName": {},
	"osVersion": { },
	"javaVersion": {},
	"ipaddress": {},
	"TestOptimalVersion": { },
	"releaseDate": {},
	"edition": {},
	"sessionnum": {},
	"maxthreadnum": {},
	"licStatus": {},
	"expireDate": {},
	"authPluginList": {},
	"licEmail": {"type": "email", "required": true, autoFocus: true}, 
	"licKey": {"type": "text", "required": true},
	"TempLicToken": {"type": "text"},
	"licAck": {"type": "YesNo", "more": "I agree to <a href='http://testoptimal.com/TestOptimalLicense.pdf' target=_blank>license terms</a>" }
}

var mbtModeList= [{"code": "optimalSequence", "desc": "Optimal"},
  	    {"code": "randomSequence", "desc": "Random Walk - Markov"},
  	    {"code": "greedySequence", "desc": "Random Walk - Greedy"},
  	    {"code": "priorityPath", "desc": "Priority Path"},
  	    {"code": "pathFinder", "desc": "Path Finder"},
  	    {"code": "mCaseSerial", "desc": "MCase - Serial"},
  	    {"code": "mCaseOptimal", "desc": "MCase - Optimal"},
  		{"code": "BDTScenario", "desc": "BDT Scenario"}];

var coverageTypeList = [
          {"code": "alltrans", "desc": "Transition"}, 
          {"code": "allpaths", "desc": "Paths"}
       ];

function onChangeSequencer() {
  	alert("onChangeSequencer");
}
function onInitSequencer () {
  	alert("onInitSequencer");
}

var modelMBTDef = {
	"uid": {},
	"mode": {type: "selectList", required: true, defaultvalue: "optimalSequence", autoFocus: true, domain: mbtModeList, onChange: onChangeSequencer, onInit: onInitSequencer},
	"seed": {type: "number", min: 0, max: 99999999 },
	"seqParams": {type: "text" },
	"coverageType": {type: "selectList", required: true, defaultvalue: "alltrans", domain: coverageTypeList, restrictions: "nonConcurrent" },
	"stopAtFinalOnly": {type: "YesNo", required: true , restrictions: "nonConcurrent" },
	"stopcoverage": {type: "number", min: 0, max: 100 },
	"stopReqCoverage": {type: "number", min: 0, max: 100 },
	"stopcount": {type: "number", min: 0 },
	"stoptime": {type: "number", min: 0 },
	"stophomeruncount": {type: "number", min: 0, restritions: "nonConcurrent" },
	"stopexception": {type: "number", min: 0 },
	"execnum": {type: "number", min: 1, restictions: "nonBasic nonConcurrent" },
	"iterationdelay": {type: "number", min: 0, restictions: "nonBasic nonConcurrent" },
	"execthreadnum": {type: "number", min: 1, restrictions: "nonBasic nonConcurrent" },
	"threadspreaddelay": {type: "number", restictions: "nonBasic nonConcurrent" },
	"parallelMode": {type: "selectList", required: true, restictions: "nonBasic nonConcurrent", domain: [{code:"Shared", desc:"Shared"}, {code: "Duplicate", desc: "Duplicate"}]},
	"shufflePaths": {type: "YesNo", required: true, restrictions: "nonConcurrent" }
}

var browserTypeList = [
   	{"code": "", "desc": ""}, 
	{"code": "firefox", "desc": "FireFox"}, 
	{"code": "googlechrome", "desc": "Google Chrome"},
	{"code": "iexplore", "desc": "Internet Explorer"},
	{"code": "opera", "desc": "Opera"},
	{"code": "safari", "desc": "Safari"}, 
	{"code": "iphone", "desc": "iPhone"}, 
	{"code": "android", "desc": "Android"}, 
	{"code": "ipad", "desc": "iPad"}, 
	{"code": "htmlunit", "desc": "Simulated Browser"}
   	];

var testPathGraphTypeList = [{"code": "FSM", "desc": "FSM Graph"}, 
    {"code": "MSC", "desc": "MSC Chart"}
   	];

var modelTypeList = [{"code": "CFG", "desc": "Activity Diagram"},
	{"code": "FSM", "desc": "State Diagram"},
	{"code": "Mixed", "desc": "Mixed Diagram"}
   	];

var pluginList = [];

function editCheckModelPlugins() {
   	alert("editCheckModelPlugins");
   }
var sleepMultiplierList = [  {"code": "0", "desc": "disabled"},
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
var modelPropDef = {
	"uid": { },
	"filename": { },
	"desc": {type: "textarea", restrictions: "DevOnly", autoFocus: true},
	"pluginID": {type: "selectMulti", domain: pluginList, customCheck: editCheckModelPlugins },
	"url": {type: "text", width: "150%", required: true, buttons: "yes" },
	"browser": {type: "selectList", domain: browserTypeList, restrictions: "nonBasic" },
	"initVars": {type: "text", restrictions: "DevOnly", required: false },
	"uiMapUri": {type: "text", restrictions: "DevOnly" },
	"lastTestCaseRpt": {type: "text" },
	"testPathGraphType": {type: "selectList", required: true, domain: testPathGraphTypeList },
	"outputComment": {type: "YesNo", required: true },
	"modelType": {type: "selectList", required: true, domain: modelTypeList },
	"vrsn": {type: "text", restrictions: "DevOnly" },
	"aut": {type: "text", restrictions: "DevOnly" },
	"tagVrsn": {type: "text", restrictions: "DevOnly" },
	"build": { },
	"versionTO": {type: "text"},
	"suppressVerify": {type: "YesNo"},
	"suppressSubmodelVerify": {type: "YesNo"},
	"catCodes": {type: "text"},
	"backupDate": { },
	"archiveDate": { },
	"archiveVersionLabel": { },
	"maxhistorystat": {type: "number", min: 0 },
	"maxtranslog": {type: "number", min: 0 },
	"authusers": {type: "text" },
	"actiondelaymillis": {type: "number", min: 0, restrictions: "nonBasic" },
	"mscriptdelaymillis": {type: "number", min: 0, restrictions: "nonBasic" },
	"sleepMultiplier": {type: "selectList", domain: sleepMultiplierList },
	"javaclass": {type: "text", restrictions: "DevOnly nonBasic" },
	"refModelList": { },
	"savePassed": {type: "YesNo", required: true }
}
var reqConnTypeList = [
    {code: "", desc: ""},
    {code: "COM", desc: "DataSet (Data Design)"},
	{code: "EXCEL", desc: "Excel Worksheet (xls)"},
	{code: "FILE", desc: "File - CSV or TAB"},
	{code: "SQL", desc: "SQL - JDBC Database"},
	{code: "URL", desc: "URL - CSV or TAB over http"}
];

// to be populated at runtime
var bugConnTypeList = [];

var ALMFields = {
	"reqConnType": {type: "selectList", required: false, domain: reqConnTypeList },
	"reqConnParams": {type: "textarea", required: false},
	"bugConnType": {type: "selectList", required: false, domain: bugConnTypeList },
	"bugConnParams": {type: "textarea", required: false}
};

MainModule.factory ('FieldDef', function($rootScope, IdeContext) {
	var FieldDef = { 
    	fieldDefList: {
    		config: configPropDef,
    		licInfo: licInfoPropDef,
    		modelMBT: modelMBTDef,
    		modelProp: modelPropDef,
    		almProp: ALMFields
    	}
	}
	
	FieldDef.init = function () {
		var pList = IdeContext.getPluginList();
		pluginList.length = 0;
		angular.forEach(pList, function(pObj) {
			pluginList.push(pObj);
		}) ;
	}
	
	FieldDef.getFieldDef = function (fieldGroupName_p, fieldName_p) {
		var fieldGroup = FieldDef.fieldDefList[fieldGroupName_p];
		if (fieldGroup) {
			return fieldGroup[fieldName_p];
		}
		else return undefined;
	}

	FieldDef.getFieldDefList = function (fieldGroupName_p) {
		var fieldGroup = FieldDef.fieldDefList[fieldGroupName_p];
		return fieldGroup;
	}
	
	FieldDef.prepField = function (fieldDef_p, fieldName_p, rawFieldObj_p) {
		var msgDef = resolveMsg(fieldName_p);
		if (msgDef==undefined) {
			msgDef = {code: fieldName_p, desc: fieldName_p};
		}
		var fieldObj = {
			key: fieldName_p,
			msgDef: msgDef,
			formVal: rawFieldObj_p,
			val: rawFieldObj_p,
			sortNum: fieldDef_p.sortNum,
			fieldDef: fieldDef_p
		}
		
		if (fieldDef_p.type=="number") {
			fieldObj.formVal = parseInt(rawFieldObj_p);
		}
		else if (fieldDef_p.type=="selectList") {
			for (i=0; i<fieldDef_p.domain.length; i++) {
				if (fieldDef_p.domain[i].code==rawFieldObj_p) {
					fieldObj.formVal = fieldDef_p.domain[i];
					break;
				}
			}
		}
		else if (fieldDef_p.type=="selectMulti") {
			fieldObj.selectedList = [];
			fieldObj.selectDomain = [];
			angular.forEach(fieldDef_p.domain, function(domainObj_p) {
				fieldObj.selectDomain.push(domainObj_p)
				if (rawFieldObj_p.indexOf(domainObj_p.code)>=0) {
					domainObj_p.selected = true;
				}
				else domainObj_p.selected = false;
			});
		}
		if (fieldObj.fieldDef.type=="YesNo") {
			fieldObj.checked = fieldObj.val=="Y";
		}
		return fieldObj;
	}

	FieldDef.prepFieldList = function (fieldGroupName_p, rawFieldList_p) {
		var fieldList = [];
		var fieldDefList = FieldDef.getFieldDefList(fieldGroupName_p);
		angular.forEach(fieldDefList, function (fieldDef, fieldName) {
			var rawFieldObj = rawFieldList_p[fieldName];
			if (rawFieldObj!=undefined) {
				var fieldObj = FieldDef.prepField(fieldDef, fieldName, rawFieldObj);
				fieldList.push(fieldObj);
			}
		});
		
		return fieldList;
	}


	FieldDef.prepFieldForSave = function (scopeForm, fieldObj) {
		var changed = false;
		if (scopeForm[fieldObj.key] && scopeForm[fieldObj.key].$dirty ||
			fieldObj.fieldDef.type=="selectMulti") {
			changed = true;
		}
		if (fieldObj.fieldDef.type=="YesNo") {
			fieldObj.val = fieldObj.checked?"Y":"N";
		}
		else if (fieldObj.fieldDef.type=="selectList") {
			fieldObj.val = fieldObj.formVal.code;
		}
		else if (fieldObj.fieldDef.type=="selectMulti") {
			var pList = [];
			angular.forEach(fieldObj.selectedList, function(selectedObj_p) {
				pList.push(selectedObj_p.code);
			});
			fieldObj.val = pList.join(",");
		}
		else fieldObj.val = fieldObj.formVal;
		
		return changed;
	}
	
	FieldDef.init();
	
	return FieldDef;
});


