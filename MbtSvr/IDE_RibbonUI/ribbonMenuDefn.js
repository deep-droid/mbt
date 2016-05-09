// mbtSessionList must be defined for ribbon to work
var mbtSessionList = [
// This list is populated from server
//       {label: "Session 1", val: "model abc"},
    ];

// millis delay before showing help hint on menu items.
var ribbonHelpHintDelay = 1500;

var sequencerList = [
       {val: "Optimal", label: "optimalSequencer"},
       {val: "Random", label: "Random"},
       {val: "Greedy", label: "GreedySequencer"},
       {val: "Path Finder", label: "PathFinder"},
       {val: "Priority Path", label: "PriorityPath"},
       {val: "MCase Serial", label: "MCaseSerial"},
       {val: "MCase Optimal", label: "MCaseOptimal"}
    ];

var modelFormatList = [
	     {val: "GraphML", label: "GraphML"},
	     {val: "GraphXML", label: "GraphXML"},
	     {val: "SCXML", label: "SCXML"},
	     {val: "XMI", label: "UML/XMI"}
	];

var dsFormatList = [
	     {val: "Excel", label: "Excel 2003(.xls)"},
	     {val: "TAB", label: "Tab Delimited File (tab)"},
	     {val: "CSV", label: "Comma Delimited File (csv)"}
  	];


// add new menu btn to ribbonBtnList. This is a shared common menu btn list among all apps.
// make sure btnId is unique
// btnType: optional - list, toggle
// btnAction: event, url, route, modal, view, IDE (function call)

var ribbonBtnList = { 

	btnRefreshTab: {
		btnId: "RefreshTab",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh currently selected tab"
	},

	btnModelNew: {
		btnId: "ModelNew",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create a new model"
	},

	btnDataSetNew: {
		btnId: "DataSetNew",
		btnLabel: "Data Set",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create a new data set"
	},
	
	btnFolderNew: {
		btnId: "FolderNew",
		btnLabel: "New Folder",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create a new folder"
	},
	
	btnModelSave: {
		btnId: "ModelSave",
		btnLabel: "Save",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Save",
		btnHelp: "Save changes to the current model."
	},
	
	btnModelSaveAs: {
		btnId: "ModelSaveAs",
		btnLabel: "Save As",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Save",
		btnHelp: "Save a copy of current model to a new name."
	},
	
	btnScreenShot: {
		btnId: "ScreenShot",
		btnLabel: "ScreenShot",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Camera",
		btnHelp: "open model screenshot list view."
	},
	
	
	btnDeleteAllSelected: {
		btnId: "DeleteAllSelected",
		btnLabel: "Delete Selected",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete selected datasets, models and folders."
	},
	
	
	btnModelRevert: {
		btnId: "ModelRevert",
		btnLabel: "Revert",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Re-opens current model without saving the changes."
	},
	
	
	btnModelBackup: {
		btnId: "ModelBackup",
		btnLabel: "Backup",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Takes a backup of current model replacing previous backup."
	},
	
	btnModelRestore: {
		btnId: "ModelRestore",
		btnLabel: "Restore",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Restores current model from previous backup."
	},
	
	btnModelCloseCurrent: {
		btnId: "ModelCloseCurrent",
		btnLabel: "Close",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Closes current model."
	},
	
	btnModelCloseOthers: {
		btnId: "ModelCloseOthers",
		btnLabel: "Close Other",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Close all open models except current model."
	},
	
	btnModelCloseAll: {
		btnId: "ModelCloseAll",
		btnLabel: "Close All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Close all open models including current model."
	},
	
	
	btnSessionList: {
		btnId: "SessionList",
		btnLabel: "",
		btnMode: "normal",
		btnSelected: false,
		btnType: "list",
		btnAction: "event",
		btnHelp: "Switch to another model session.",
		btnSelectedVal: mbtSessionList[0],
		btnSelectList: mbtSessionList
	},
	
	btnSessionPrev: {
		btnId: "SessionPrev",
		btnLabel: "Prev Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Switch to previous model session."
	},
	
	
	btnImportModel: {
		btnId: "ImportModel",
		btnLabel: "Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Import",
		btnHelp: "Import another TestOptimal model into current model."
	},
	
	btnImportGraphML: {
		btnId: "ImportGraphML",
		btnLabel: "GraphML",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Import GraphML model into current model."
	},
	
	btnImportGraphXML: {
		btnId: "ImportGraphXML",
		btnLabel: "GraphXML",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Import GraphXML model into current model."
	},
	
	btnImportSCXML: {
		btnId: "ImportSCXML",
		btnLabel: "SCXML",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Import SCXML model into current model."
	},
	
	btnImportXMI: {
		btnId: "ImportXMI",
		btnLabel: "XMI",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Import XMI model into current model."
	},
	
	btnSysInfo: {
		btnId: "SysInfo",
		btnLabel: "Config",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "SysConfig",
		btnHelp: "Set up TestOptimal and IDE preferences."
	},
	
	
	btnConnSvrMgr: {
		btnId: "ConnSvrMgr",
		btnLabel: "Connect SvrMgr",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "SysConfig",
		btnHelp: "Connects to SvrMgr for checking in models and submitting model execution to remote Runtime Servers."
	},

	btnLicInfo: {
		btnId: "LicInfo",
		btnLabel: "License",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "License",
		btnHelp: "Manage license key."
	},
	
	
	btnCheckUpdates: {
		btnId: "CheckUpdates",
		btnLabel: "Updates",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Updates",
		btnHelp: "Check for software updates."
	},
	
	
	
	btnShutdown: {
		btnId: "Shutdown",
		btnLabel: "Shutdown Server",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Shuts down TestOptimal server, you may also shut down TestOptimal server through Server Console in SysTray."
	},
	
	btnMScript: {
		btnId: "MScript",
		btnLabel: "MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "view",
		defImgId: "MScript",
		btnHelp: "Open MScript Editor"
	},
	
	
	btnModelMBT: {
		btnId: "ModelMBT",
		btnLabel: "MBT",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "SysConfig",
		btnHelp: "Model execution settings."
	},
	
	
	btnUIMap: {
		btnId: "UIMap",
		btnLabel: "UI Map",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ModelProp",
		btnHelp: "Model UI Map List and Sikuli-based UI Image List/Creation."
	},
	
	btnModelProp: {
		btnId: "ModelProp",
		btnLabel: "Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ModelProp",
		btnHelp: "Model property view."
	},
	
	btnALMProp: {
		btnId: "ALMProp",
		btnLabel: "ALM",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Cycle",
		btnHelp: "ALM property view."
	},
		
	btnReqList: {
		btnId: "ReqList",
		btnLabel: "Reqmt",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReqGraph",
		btnHelp: "ALM property view."
	},
		
	btnModelCanvas: {
		btnId: "ModelCanvas",
		btnLabel: "Canvas",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Edit Canvas Settings."
	},
	
	btnModelState: {
		btnId: "ModelState",
		btnLabel: "State",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "State/Process mode: click on canvas to create a state/process or click on an existing state/process to create a sub-state/process."
	},
	
	
	btnModelSwitch: {
		btnId: "ModelSwitch",
		btnLabel: "Switch",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "Switch mode: click on canvas to create a switch/branch node or click on a an existing state/process to create a switch/branch within the state/process."
	},
	
	
	btnModelBranch: {
		btnId: "ModelBranch",
		btnLabel: "Branch",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "Branch mode: click on canvas to create a branch node or click on an existing state/process to create a branch node within the state/process."
	},
	
	btnModelSyncV: {
		btnId: "ModelSyncV",
		btnLabel: "SyncBar-V",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create a vertical SyncBar."
	},
	
	
	btnModelSyncH: {
		btnId: "ModelSyncH",
		btnLabel: "SyncBar-H",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create a horizontal SyncBar."
	},
	
	btnModelInitial: {
		btnId: "ModelInitial",
		btnLabel: "Initial",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create an initial node."
	},
	
	
	btnModelFinal: {
		btnId: "ModelFinal",
		btnLabel: "Final",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create a final node."
	},
	
	btnModelStraight: {
		btnId: "ModelStraight",
		btnLabel: "Straight",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create straight edges."
	},
	
	btnModelCurve: {
		btnId: "ModelCurve",
		btnLabel: "Curve",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create curve edges."
	},
	
	btnModelZigzag: {
		btnId: "ModelZigzag",
		btnLabel: "Zigzag",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnToggleName: "modelNewMode",
		btnHelp: "To create 90 degree zig-zag edges."
	},
	
	btnModelUndo: {
		btnId: "ModelUndo",
		btnLabel: "Undo",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event"
	},
	
	btnModelRedo: {
		btnId: "ModelRedo",
		btnLabel: "Redo",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event"
	},
	
	btnModelEditDelete: {
		btnId: "ModelEditDelete",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Deleted marked nodes/edges."
	},
	
	btnModelLayout: {
		btnId: "ModelLayout",
		btnLabel: "Layout",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Auto layout diagram."
	},
	
	btnModelLasso: {
		btnId: "ModelLasso",
		btnLabel: "Lasso",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "For marking nodes by mouse-drag a rectangular shape."
	},
	
	btnModelSearch: {
		btnId: "ModelSearch",
		btnLabel: "Find",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Search for nodes/edges with option to mark them."
	},
	
	btnModelMark: {
		btnId: "ModelMark",
		btnLabel: "Mark",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "Mark/Select nodes by mouse clicking."
	},
	
	btnModelMarkClear: {
		btnId: "ModelMarkClear",
		btnLabel: "Clear All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Clear all marks."
	},
	
	btnModelMarkAll: {
		btnId: "ModelMarkAll",
		btnLabel: "Mark All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Mark/Select all nodes."
	},
	
	btnModelZoomIn: {
		btnId: "ModelZoomIn",
		btnLabel: "Zoom In",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event"
	},
	
	btnModelZoomOut: {
		btnId: "ModelZoomOut",
		btnLabel: "Zoom Out",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event"
	},
	
	btnModelZoomReset: {
		btnId: "ModelZoomReset",
		btnLabel: "Zoom 100%",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Reset zoom to 100%."
	},
	
	btnModelAlignTop: {
		btnId: "ModelAlignTop",
		btnLabel: "Top",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes horizontally to the top."
	},
	
	btnModelAlignMiddle: {
		btnId: "ModelAlignMiddle",
		btnLabel: "Middle",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes horizontally to the middle."
	},
	
	btnModelAlignBottom: {
		btnId: "ModelAlignBottom",
		btnLabel: "Bottom",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes horizontally to the bottom."
	},
	
	btnModelAlignLeft: {
		btnId: "ModelAlignLeft",
		btnLabel: "Left",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes vertically to the left border."
	},
	
	btnModelAlignCenter: {
		btnId: "ModelAlignCenter",
		btnLabel: "Center",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes vertically to the center."
	},
	
	btnModelAlignRight: {
		btnId: "ModelAlignRight",
		btnLabel: "Right",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Align selected nodes vertically to the right border."
	},
	
	
	btnViewMCase: {
		btnId: "ViewMCase",
		btnLabel: "MCase",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open MCase View"
	},
	
	
	btnViewRequirement: {
		btnId: "ViewRequirement",
		btnLabel: "Requirement",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open Requirement View"
	},
	
	
	btnViewDefect: {
		btnId: "ViewDefect",
		btnLabel: "Defect",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open Defect View"
	},
	
	
	btnViewGuard: {
		btnId: "ViewGuard",
		btnLabel: "Guard",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open Guard View"
	},
	
	btnViewTreeView: {
		btnId: "ViewTree",
		btnLabel: "TreeView",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open Tree View"
	},
	btnViewExecContext: {
		btnId: "ExecContext",
		btnLabel: "Context",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Open Execution Context view"
	},
	
	btnExecStart: {
		btnId: "ExecStart",
		btnLabel: "Run",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Execute current model"
	},
	
	btnExecAnimate: {
		btnId: "ExecAnimate",
		btnLabel: "Animate",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Start model execution in animate mode."
	},
	
	btnDebugStart: {
		btnId: "DebugStart",
		btnLabel: "Debug",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Start model execution in debug mode - pause at initial state/node."
	},

	btnStartPlay: {
		btnId: "StartPlay",
		btnLabel: "Play",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Play",
		btnHelp: "Start and animate model execution."
	},
	
	btnExecStop: {
		btnId: "ExecStop",
		btnLabel: "Abort",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Stop current model execution."
	},
	
	
	btnExecStopOther: {
		btnId: "ExecStopOther",
		btnLabel: "Others",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Stop all model executions except current model execution."
	},
	
	btnExecStopAll: {
		btnId: "ExecStopAll",
		btnLabel: "All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Stop all model executions including current model execution."
	},
	
	
	btnDebugStepTrav: {
		btnId: "DebugStepTrav",
		btnLabel: "Step Traversal",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Step over to next traversal (state or transition)."
	},
	
	btnDebugStepMScript: {
		btnId: "DebugStepMScript",
		btnLabel: "Step MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Step into next MScript tag."
	},
	
	
	btnDebugJumpMScript: {
		btnId: "DebugJumpMScript",
		btnLabel: "Jump MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Resume execution and pause at a speific MScript line."
	},
	
	
	btnExecAnimateSetting: {
		btnId: "ExecAnimateSetting",
		btnLabel: "Animation",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Change animation settings."
	},
	
	
	btnExecALM: {
		btnId: "ExecALM",
		btnLabel: "ALM",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "Check to create/update defects to ALM at the end of model execution."
	},
	
	btnExecAUT: {
		btnId: "ExecAUT",
		btnLabel: "AUT",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "Check to allow plugin(s) to interact with AUT."
	},
	
	btnExecSequencer: {
		btnId: "ExecSequencer",
		btnLabel: "",
		btnMode: "normal",
		btnSelected: false,
		btnType: "list",
		btnHelp: "Check to allow plugin(s) to interact with AUT.",
		btnSelectedVal: sequencerList[0],
		btnSelectList: sequencerList
	},
	
	
	btnSeqKeepSubmodel: {
		btnId: "SeqKeepSubmodel",
		btnLabel: "Keep SubModel",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "Check to keep sub-model's sequencer, uncheck to force sub-models to use main model's sequencer."
	},
	
	
	
	btnSeqMarkedOnly: {
		btnId: "SeqMarkedOnly",
		btnLabel: "Marked Only",
		btnMode: "normal",
		btnSelected: false,
		btnType: "toggle",
		btnHelp: "Cover marked states/transitions only."
	},
	
	
	btnBatchLocal: {
		btnId: "ExecBatchLocal",
		btnLabel: "Batch Local",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Executes a set of models on local TestOptimal server."
	},
	
	
	btnBatchRemote: {
		btnId: "ExecBatchRemote",
		btnLabel: "Batch Remote",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Executes a set of models on Remote TestOptimal Runime servers."
	},
	
	btnGoMBT: {
		btnId: "GoMBT",
		btnLabel: "MBT IDE",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnSameWindow: true,
		btnURL: "webmbtMain.html",
		defImgId: "TO",
		btnHelp: "Switch to ProMBT IDE"
	},
	
	btnViewStats: {
		btnId: "ViewStats",
		btnLabel: "Stats",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnURL: "IDE_ExecStats.html",
		btnHelp: "Open Stats View for current model execution."
	},
	
	btnViewMonitor: {
		btnId: "ViewMonitor",
		btnLabel: "Monitor",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "view",
		btnHelp: "Open Monitor view for current model execution."
	},
	
	btnMScriptEditor: {
		btnId: "MScriptEditor",
		btnLabel: "MScript Editor",
		btnMode: "normal",
		winURL: "IDE_MScriptEditor.html",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScript",
		btnHelp: "Open MScript Editor."
	},
	
	
	btnLogServer: {
		btnId: "LogServer",
		btnLabel: "Server",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "LogServer",
		btnURL: "log/webmbtServer.log",
		btnHelp: "Open TestOptimal server log file."
	},
	
	btnLogMScript: {
		btnId: "LogMScript",
		btnLabel: "MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "LogMScript",
		btnURL: "log/mscript.log",
		btnHelp: "Open MSript log file."
	},
	
	btnLogIDE: {
		btnId: "LogIDE",
		btnLabel: "Console",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "LogMisc",
		btnURL: "",
		btnHelp: "Open IDE Console Log."
	},
	
	btnLogWinUIA: {
		btnId: "LogWinUIA",
		btnLabel: "WinUIA",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "LogMisc",
		btnURL: "log/UIA_Agent.log",
		btnHelp: "Open WinUIA plugin log file."
	},
	
	
	btnRptExecStats: {
		btnId: "RptExecStats",
		btnLabel: "Stats",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Opens Execution Stats window for realtime model execution stats."
	},
	
	
	btnRptTestCase: {
		btnId: "RptTestCase",
		btnLabel: "Test Case",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Opens Test Case Report/Output for current model execution."
	},
	
	btnRptMScript: {
		btnId: "RptMScript",
		btnLabel: "MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Opens MScript coverage for current model execution."
	},
	
	btnRptBatch: {
		btnId: "RptBatch",
		btnLabel: "Batch",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Opens Batch Execution List for current model."
	},
	
	
	btnRptModelReview: {
		btnId: "RptModelReview",
		btnLabel: "Review",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Opens Model Review report for current model."
	},
	
	btnRptReqCoverage: {
		btnId: "RptReqCoverage",
		btnLabel: "Requirement",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReqGraph",
		btnHelp: "Requirement coverage report for a selected set of models."
	},
	
	btnGraphTestCase: {
		btnId: "GraphTestCase",
		btnLabel: "Test Case",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Display Test Cases in Message Sequence Chart (MSC)."
	},
	
	btnGraphTraversal: {
		btnId: "GraphTraversal",
		btnLabel: "Traversal",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Display test sequence traversal graph of current model execution."
	},
	
	btnGraphCoverage: {
		btnId: "GraphCoverage",
		btnLabel: "Coverage",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "CovGraph",
		btnHelp: "Display model coverage for current model execution."
	},
	
	btnGraphInterModel: {
		btnId: "GraphInterModel",
		btnLabel: "Inter-Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Model-Model message communication sequence chart."
	},
	
	btnHelpOverview: {
		btnId: "HelpOverview",
		btnLabel: "Overview",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		defImgId: "HelpOverview",
		btnURL: "http://testoptimal.com/tutorials/TestOptimal_MBT-Intro/TestOptimal_MBT-Intro.html",
		btnHelp: "TestOptimal overview."
	},
	
	
	
	btnHelpUserGuide: {
		btnId: "HelpUserGuide",
		btnLabel: "User Guide",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnURL: "http://testoptimal.com/wiki",
		btnHelp: "TestOptimal IDE User Guide."
	},
	
	btnHelpWiki: {
		btnId: "HelpWiki",
		btnLabel: "Wiki",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		defImgId: "HelpDoc",
		btnURL: "http://testoptimal.com/wiki",
		btnHelp: "Online Wiki at TestOptimal.com."
	},
	
	btnHelpTutorials: {
		btnId: "HelpTutorials",
		btnLabel: "Tutorials",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "HelpTutorials",
		btnURL: "http://testoptimal.com/tutorials/TutorialList.html",
		btnHelp: "Online Tutorials at TestOptimal.com."
	},

	btnHelpMScriptDataGen: {
		btnId: "HelpMScriptDataGen",
		btnLabel: "DataGen",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptPlugin",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=DataGen",
		btnHelp: "Plugin MScript functions - DataGen."
	},
	
	btnHelpMScriptService: {
		btnId: "HelpMScriptService",
		btnLabel: "Service",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptService",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=Service",
		btnHelp: "Plugin MScript functions - Service."
	},
	
	
	btnHelpMScriptSelenium: {
		btnId: "HelpMScriptSelenium",
		btnLabel: "Selenium",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptWeb",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=Selenium",
		btnHelp: "Plugin MScript functions - Selenium."
	},
	
	btnHelpMScriptWinUIA: {
		btnId: "HelpMScriptWinUIA",
		btnLabel: "WinUIA",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptWin",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=WinUIA",
		btnHelp: "Plugin MScript functions - WinUIA."
	},

	btnHelpMScriptSys: {
		btnId: "HelpMScriptSys",
		btnLabel: "System",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptPlugin",
		btnURL: "http://testoptimal.com/support?id=MScript-Sys",
		btnHelp: "System MScript functions."
	},
	
	
	btnHelpMScriptAll: {
		btnId: "HelpMScriptAll",
		btnLabel: "All Plugins",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		defImgId: "MScriptPlugin",
		btnURL: "http://testoptimal.com/doku/doku.php?id=mscriptfunc",
		btnHelp: "opens MScript functions for all plugins"
	},
	
	btnHelpMScriptDataDesign: {
		btnId: "HelpMScriptDataDesign",
		btnLabel: "DataDesign",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptPlugin",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=DataDesign",
		btnHelp: "Plugin MScript functions - DataDesign."
	},

	btnHelpMScriptWebSvc: {
		btnId: "HelpMScriptWebSvc",
		btnLabel: "WebSvc",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MScriptPlugin",
		btnURL: "http://testoptimal.com/support?id=MScript-Plugin&plugin=WebSvc",
		btnHelp: "Plugin MScript functions - WebSvc."
	},

	btnHelpTicket: {
		btnId: "HelpTicket",
		btnLabel: "Help Desk",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "TechSupport",
		btnURL: "http://testoptimal.com/support",
		btnHelp: "Submit a support ticket."
	},
	
	btnHelpForum: {
		btnId: "HelpForum",
		btnLabel: "Forum",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnURL: "http://testoptimal.com/forum",
		defImgId: "QandA",
		btnHelp: "Post question to online discussion forum / user group."
	},
	
	btnHelpAbout: {
		btnId: "HelpAbout",
		btnLabel: "About",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "TO",
		btnHelp: "About TestOptimal"
	},

	// DataDesign 
	btnNewDS: {
		btnId: "NewDS",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create new dataset"
	},
	
	btnDelDS: {
		btnId: "DelDS",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "delete current dataset"
	},

	btnDelDSRow: {
		btnId: "DelDSRow",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "delete selected rows"
	},
	
	btnMoveDSRowUp: {
		btnId: "MoveDSRowUp",
		btnLabel: "Move Up",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MoveUp",
		btnHelp: "move the selected rows up one row"
	},
	
	btnMoveDSRowDown: {
		btnId: "MoveDSRowDown",
		btnLabel: "Move Down",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MoveDown",
		btnHelp: "move the selected rows down one row"
	},
	
	btnMoveDSRowTop: {
		btnId: "MoveDSRowTop",
		btnLabel: "Move Top",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MoveTop",
		btnHelp: "move the selected rows to the top"
	},
	
	btnMoveDSRowBottom: {
		btnId: "MoveDSRowBottom",
		btnLabel: "Move Bottom",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MoveBottom",
		btnHelp: "move the selected rows to the bottom"
	},
	
	
	btnDSToggleRows: {
		btnId: "DSToggleRows",
		btnLabel: "Toggle",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ToggleRows",
		btnHelp: "Toggle checkboxes for all rows"
	},
	
	btnDSResetRows: {
		btnId: "DSResetRows",
		btnLabel: "Reset",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ResetRows",
		btnHelp: "Reset checkboxes for all rows"
	},
	
	
	btnSaveAsDS: {
		btnId: "SaveAsDS",
		btnLabel: "Save As",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Save",
		btnHelp: "make a copy of current dataset"
	},

	btnRefreshDS: {
		btnId: "RefreshDS",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh current dataset from disk"
	},

	btnImportDS: {
		btnId: "ImportDS",
		btnLabel: "Import",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Import",
		btnHelp: "import data table from a file into current dataset"
	},
	
	btnExportDS: {
		btnId: "ExportDS",
		btnLabel: "Export",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Export",
		btnHelp: "export current dataset to a file"
	},
	
	btnFormatDS: {
		btnId: "FormatDS",
		btnLabel: "Format",
		btnMode: "normal",
		btnSelected: false,
		btnType: "list",
		btnHelp: "DataSet export file format",
		btnSelectedVal: dsFormatList[0],
		btnSelectList: dsFormatList
	},

	btnShowDSList: {
		btnId: "ShowDSList",
		btnLabel: "Show",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSShowList",
		btnHelp: "make dataset list pane visible"
	},
	
	btnRefreshDSList: {
		btnId: "RefreshDSList",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh dataset list"
	},
	
	btnHideDSList: {
		btnId: "HideDSList",
		btnLabel: "Hide",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSHideList",
		btnHelp: "hide dataset list pane"
	},
	
	btnDelDSField: {
		btnId: "DelDSField",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSFieldDelete",
		btnHelp: "delete selected (checked) dataset fields"
	},

	btnAddDSField: {
		btnId: "AddDSField",
		btnLabel: "Add",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSAddField",
		btnHelp: "add a new field to current dataset"
	},

	btnLeftDSField: {
		btnId: "LeftDSField",
		btnLabel: "Shift Left",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSFieldLeft",
		btnHelp: "shift selected dataset fields to the left"
	},

	btnRightDSField: {
		btnId: "RightDSField",
		btnLabel: "Shift Right",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSFieldRight",
		btnHelp: "shift selected dataset fields to right"
	},

	btnHideDSField: {
		btnId: "HideDSField",
		btnLabel: "Hide",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSFieldHide",
		btnHelp: "hide selected dataset fields"
	},
	
	btnShowDSField: {
		btnId: "ShowDSField",
		btnLabel: "Show All Fields",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSFieldShowAll",
		btnHelp: "show all hidden dataset fields"
	},


	btnSortDS: {
		btnId: "SortDS",
		btnLabel: "Sort",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSTableSort",
		btnHelp: "sort datatable on the selected dataset field"
	},

	btnAddRowDS: {
		btnId: "AddRowDS",
		btnLabel: "Add Row",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSTableAddRow",
		btnHelp: "add a row to datatable"
	},
	
	btnGen2WiseDS: {
		btnId: "Gen2WiseDS",
		btnLabel: "Pairwise",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGen2Wise",
		btnHelp: "generate data table using Pairwise algorithm"
	},
	
	btnGen3WiseDS: {
		btnId: "Gen3WiseDS",
		btnLabel: "3-Wise",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGen3Wise",
		btnHelp: "generate data table using 3-wise algorithm"
	},
	
	btnGen4WiseDS: {
		btnId: "Gen4WiseDS",
		btnLabel: "4-Wise",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGen4Wise",
		btnHelp: "generate data table using 4-wise algorithm"
	},
	
	btnGen5WiseDS: {
		btnId: "Gen5WiseDS",
		btnLabel: "5-Wise",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGen5Wise",
		btnHelp: "generate data table using 5-wise algorithm"
	},
	
	btnGen6WiseDS: {
		btnId: "Gen6WiseDS",
		btnLabel: "6-Wise",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGen6Wise",
		btnHelp: "generate data table using 6-wise algorithm"
	},
	
	btnGenFullDS: {
		btnId: "GenFullDS",
		btnLabel: "Full",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSGenFull",
		btnHelp: "generate data table using full combinatorial algorithm"
	},
	
	btnFullScreen: {
		btnId: "FullScreen",
		btnLabel: "Toggle",
		btnMode: "normal",
		btnAction: "event",
		defImgId: "ToggleFS",
		btnHelp: "Toggle full screen mode"
	},

	
	// BDT
	btnDSVar: {
		btnId: "DSVar",
		btnLabel: "Var/Data",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Var",
		btnHelp: "Open DataSet & Variable view."
	},
	
	btnMScriptSandbox: {
		btnId: "MScriptSandbox",
		btnLabel: "Sandbox",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ExecMScript",
		btnHelp: "Open MScript Sandbox view."
	},

	btnRefreshBDTList: {
		btnId: "RefreshBDTList",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh BDT List"
	},
	
	btnNewUIElem: {
		btnId: "NewUIElem",
		btnLabel: "New Elem",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create new UI element"
	},

	btnNewUIPage: {
		btnId: "NewUIPage",
		btnLabel: "New Page",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create new UI page"
	},

	btnRefreshList: {
		btnId: "RefreshList",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh list"
	},
	
	btnNewBDT: {
		btnId: "NewBDT",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "create new BDT"
	},
	
	btnDelBDT: {
		btnId: "DelBDT",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "delete selected BDTs"
	},

	btnDel: {
		btnId: "Del",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "delete the selected items"
	},

	btnSaveAsBDT: {
		btnId: "SaveAsBDT",
		btnLabel: "Save As",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Save",
		btnHelp: "make a copy of current BDT"
	},

	btnRefreshBDT: {
		btnId: "RefreshBDT",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "refresh current BDT from disk"
	},

	btnAcquireModelLock: {
		btnId: "AcquireModelLock",
		btnLabel: "Lock Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Cycle",
		btnHelp: "Take over model lock."
	},

	btnSaveBDT: {
		btnId: "SaveBDT",
		btnLabel: "Save",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Save",
		btnHelp: "Save changes to the current BDT."
	},
	
	btnRunBDT: {
		btnId: "RunBDT",
		btnLabel: "Start",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Run",
		btnHelp: "Start BDT execution"
	},
	
	
	btnDebugBDT: {
		btnId: "DebugBDT",
		btnLabel: "Debug",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Debug",
		btnHelp: "Start BDT execution in debug mode"
	},

	btnExecMScript: {
		btnId: "ExecMScript",
		btnLabel: "MScript",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "RunMScript",
		btnHelp: "Execute current MScript line or selected MScript lines (excluding if/while)."
	},


	btnStepOverBDT: {
		btnId: "StepOverBDT",
		btnLabel: "Step Over",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "StepOver",
		btnHelp: "Step over"
	},

	btnClearAllBreakBDT: {
		btnId: "ClearAllBreakBDT",
		btnLabel: "Clear Breaks",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Eraser",
		btnHelp: "Clear all breakpoints"
	},

	btnToggleBreakBDT: {
		btnId: "ToggleBreakBDT",
		btnLabel: "Toggle Break",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Breakpoint",
		btnHelp: "Toggle breakpoint at cursor position"
	},

	btnResumeBDT: {
		btnId: "ResumeBDT",
		btnLabel: "Resume",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Resume",
		btnHelp: "Resume execution until next breakpoint"
	},

	btnPauseBDT: {
		btnId: "PauseBDT",
		btnLabel: "Pause",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Pause",
		btnHelp: "Pause current execution"
	},
	

	btnStopBDT: {
		btnId: "StopBDT",
		btnLabel: "Stop",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Stop",
		btnHelp: "Stop current BDT execution"
	},
	
	btnBDTMonitor: {
		btnId: "BDTMonitor",
		btnLabel: "Progress",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Monitor",
		btnHelp: "BDT execution Monitor."
	},
	
	// MScript edits
	btnMScriptUndo: {
		btnId: "MScriptUndo",
		btnLabel: "Undo",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Undo",
		btnHelp: "Undo MScript edits"
	},


	btnMScriptMarkerCursor: {
		btnId: "MScriptMarkerCursor",
		btnLabel: "Bookmark",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MarkerC",
		btnHelp: "Add a bookmark at cursor position"
	},

	btnMScriptMarkerLine: {
		btnId: "MScriptMarkerLine",
		btnLabel: "Ftr/Scen",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "MarkerL",
		btnHelp: "Mark Feature and Scenario for execution"
	},

	btnMScriptMarkerClear: {
		btnId: "MScriptMarkerClear",
		btnLabel: "Clear All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Eraser",
		btnHelp: "Clear MScript markers"
	},

	btnMScriptRedo: {
		btnId: "MScriptRedo",
		btnLabel: "Redo",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Redo",
		btnHelp: "Redo MScript edits"
	},

	btnMScriptFind: {
		btnId: "MScriptFind",
		btnLabel: "Find",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Search",
		btnHelp: "Search for matching text"
	},

	btnMScriptReplace: {
		btnId: "MScriptReplace",
		btnLabel: "Replace",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Replace",
		btnHelp: "Find and replace text"
	},

	btnMScripJumptTo: {
		btnId: "MScriptJumpTo",
		btnLabel: "Jump To",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Jump",
		btnHelp: "Jumpt to a specific line/mscript LID"
	},

	btnMScriptCompile: {
		btnId: "MScriptCompile",
		btnLabel: "Compile",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "CheckList",
		btnHelp: "Check for any MScript syntax errors"
	},

	btnMScriptExpandAll: {
		btnId: "MScriptExpandAll",
		btnLabel: "UnFold All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ExpandAll",
		btnHelp: "Expand all levels of MScript"
	},

	btnMScriptFoldAll: {
		btnId: "MScriptFoldAll",
		btnLabel: "Fold All",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "FoldAll",
		btnHelp: "Fold all levels of MScript"
	},

	btnMScriptComment: {
		btnId: "MScriptComment",
		btnLabel: "Comment",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Comment",
		btnHelp: "Turn selected MScript into comment by adding // to each line"
	},

	btnMScriptGoBottom: {
		btnId: "MScriptGoBottom",
		btnLabel: "Go Bottom",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "GoBottom",
		btnHelp: "Move cursor to the bottom of the document"
	},

	btnMScriptGoTop: {
		btnId: "MScriptGoTop",
		btnLabel: "Go Top",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "GoTop",
		btnHelp: "Move cursor to the start of the document"
	},

	btnMScriptFoldFeature: {
		btnId: "MScriptFoldFeature",
		btnLabel: "Features",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "FoldToggle",
		btnHelp: "Toggle folding at all Features"
	},

	btnMScriptFoldScenario: {
		btnId: "MScriptFoldScenario",
		btnLabel: "Scenarios",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "FoldToggle",
		btnHelp: "Toggle folding at all Scenarios"
	},

	btnMScriptFoldTrigger: {
		btnId: "MScriptFoldTrigger",
		btnLabel: "Triggers",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "FoldToggle",
		btnHelp: "Toggle folding at all trigger types: Given, When, Then and Prep"
	},

	btnMScriptIndentMore: {
		btnId: "MScriptIndentMore",
		btnLabel: "Shift Right",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ShiftRight",
		btnHelp: "Shift current line or selected lines to the right (indent)"
	},

	btnMScriptIndentLess: {
		btnId: "MScriptIndentLess",
		btnLabel: "Shift Left",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ShiftLeft",
		btnHelp: "Shift current line or selected lines to the left (un-indent)"
	},

	btnMScriptFormat: {
		btnId: "MScriptFormat",
		btnLabel: "Format",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Format",
		btnHelp: "Format MScript"
	},

	
	
	//
	btnSeqGraph: {
		btnId: "SeqGraph",
		btnLabel: "Test Seq.",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		defImgId: "SeqGraph",
		btnURL: "GraphSequence.html?type=SequenceGraph&execID=-1",
		btnHelp: "Test Sequence Graph."
	},
	
	btnExecMSC: {
		btnId: "ExecMSC",
		btnLabel: "Test Cases",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		defImgId: "MSCGraph",
		btnURL: "GraphTravMsgSeqChart.html?type=travMSC&execID=-1",
		btnHelp: "Test Cases in MSC."
	},

	btnDashNewProj: {
		btnId: "NewProj",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "Create a new project."
	},

	btnDashDelProj: {
		btnId: "DelProj",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete selected projects."
	},

	btnDashRefreshProj: {
		btnId: "RefreshProj",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "Refresh project list."
	},

	btnKpiAdd: {
		btnId: "NewKPI",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "New KPI."
	},

	btnKpiDel: {
		btnId: "DelKPI",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete selected KPIs."
	},

	btnKpiHistDel: {
		btnId: "KpiHistDel",
		btnLabel: "Del Hist",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete KPI history."
	},

	btnKpiRefresh: {
		btnId: "RefreshKPIList",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "Refresh KPI List"
	},

	btnKpiAddRange: {
		btnId: "KpiAddRange",
		btnLabel: "Add",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "Add a KPI range"
	},

	btnKpiDelRange: {
		btnId: "KpiDelRange",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete selected KPI ranges"
	},

	btnDashRptModelReqStatic: {
		btnId: "DashRptModelReqStatic",
		btnLabel: "By Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportA",
		btnHelp: "Requirement static analysis by model for current project"
	},

	btnDashRptReqStatic: {
		btnId: "DashRptReqStatic",
		btnLabel: "By Req.",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportA",
		btnHelp: "Requirement static analysis for current project"
	},

	btnDashRptModelReqTrace: {
		btnId: "DashRptModelReqTrace",
		btnLabel: "By Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportB",
		btnHelp: "Requirement traceability by model for current project"
	},

	btnDashRptReqTrace: {
		btnId: "DashRptReqTrace",
		btnLabel: "By Req.",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportB",
		btnHelp: "Requirement traceability for current project"
	},

	btnDashRptModelReqCov: {
		btnId: "DashRptModelReqCov",
		btnLabel: "By Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportC",
		btnHelp: "Requirement execution coverage by model for current project"
	},

	btnDashRptReqCov: {
		btnId: "DashRptReqCov",
		btnLabel: "By Req.",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportC",
		btnHelp: "Requirement execution coverage for current project"
	},

	btnDashRptModelReqFailed: {
		btnId: "DashRptModelReqFailed",
		btnLabel: "By Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportD",
		btnHelp: "Failed requirement details by model for current project"
	},


	btnDashRptReqFailed: {
		btnId: "DashRptReqFailed",
		btnLabel: "By Req.",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportD",
		btnHelp: "Failed requirement details for current project"
	},

	btnDashRptModelTC: {
		btnId: "DashRptModelTC",
		btnLabel: "By Model",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "ReportE",
		btnHelp: "Test cases executed by model"
	},
	
	
	btnDashRptRefresh: {
		btnId: "DashRptRefresh",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "Refresh project list"
	},

	btnDashCfgDelSvr: {
		btnId: "DashCfgDelSvr",
		btnLabel: "Delete",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Delete",
		btnHelp: "Delete selected servers"
	},


	btnDashCfgAddSvr: {
		btnId: "DashCfgAddSvr",
		btnLabel: "New",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "New",
		btnHelp: "Add a server"
	},

	btnDashCfgRun: {
		btnId: "DashCfgRun",
		btnLabel: "Execute",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Run",
		btnHelp: "Execute server update jobs immediately"
	},

	btnDashCfgRefresh: {
		btnId: "DashCfgRefresh",
		btnLabel: "Refresh",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Refresh",
		btnHelp: "Refresh server list"
	},

	btnDashCfgPing: {
		btnId: "DashCfgPing",
		btnLabel: "Ping",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "Updates",
		btnHelp: "Ping selected servers"
	},

	btnDashCfgMore: {
		btnId: "DashCfgMore",
		btnLabel: "More",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSShowList",
		btnHelp: "Show more columns in server list"
	},
	btnDashCfgLess: {
		btnId: "DashCfgLess",
		btnLabel: "Less",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSHideList",
		btnHelp: "Show less columns in server list"
	},
	
	btnHideList: {
		btnId: "HideList",
		btnLabel: "Hide",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSHideList",
		btnHelp: "Hide list on the left pane"
	},
	
	btnShowList: {
		btnId: "ShowList",
		btnLabel: "Show",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		defImgId: "DSShowList",
		btnHelp: "Show list on the left pane"
	},
	
	btnManageStats: {
		btnId: "ManageStats",
		btnLabel: "Stats",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnURL: "StatsRpt_Main.html",
		defImgId: "SysConfig",
		btnHelp: "Open Manage Stats application"
	},
	
	btnTestCaseOutput: {
		btnId: "TestCaseOutput",
		btnLabel: "Test Cases",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "url",
		btnURL: "app=webrpt&name=TestCaseRpt",
		defImgId: "CheckList",
		btnHelp: "Open Test Case Reports/Output"
	},

		
	// btnCustRibbon must be the last
	btnCustRibbon: {
		btnId: "RibbonCust",
		btnLabel: "Customize",
		btnMode: "normal",
		btnSelected: false,
		btnAction: "event",
		btnHelp: "Toolbar customization",
		defImgId: "CustToolbar",
		isCustBtnActive: true
	}	
}

toggleRibbonBtn = function (btnObj) {
	if (btnObj.btnType!="toggle") return;
	if (btnObj.btnToggleName && !btnObj.btnOn) {
		for (var btnID in ribbonBtnList) {
			var checkBtnObj = ribbonBtnList[btnID];
			if (checkBtnObj!=btnObj && checkBtnObj.btnToggleName && 
				checkBtnObj.btnToggleName==btnObj.btnToggleName) {
				checkBtnObj.btnOn = false;
			}
		}
	}
	
	btnObj.btnOn = !btnObj.btnOn;
}
