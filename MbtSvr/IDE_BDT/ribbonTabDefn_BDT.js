
var tabTestSuite = {
	tabId: "TestSuite",
    tabTitle: "Test Suite",
    winName: "BDT_Editor",
    condenseAtWidth: 350,
    sectionList: [ 
  	    {
	        sectionTitle: "File",
        	groupList: [
	      	   {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnShowList, ribbonBtnList.btnHideList]
	   	       },
	      	   {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnDelBDT]
		   	   }
	   	    ]
	    },
        {
          	sectionTitle: "Test Suite",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [  ribbonBtnList.btnNewBDT, ribbonBtnList.btnSaveBDT ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnSaveAsBDT, ribbonBtnList.btnRefreshBDTList ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [  ribbonBtnList.btnScreenShot, ribbonBtnList.btnAcquireModelLock ]
     	       }
     	    ]
        },
        {
          	sectionTitle: "Properties",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnModelProp ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnALMProp, ribbonBtnList.btnModelMBT ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnUIMap, ribbonBtnList.btnReqList ]
     	       }
     	    ]
        },
        {
          	sectionTitle: "Misc",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnGoMBT ]
     	       }
     	    ]
        }
    ]
}

var tabBDTExec = {
	tabId: "BDTExec",
    tabTitle: "Run",
    winName: "BDT_Editor",
    condenseAtWidth: 350,
    sectionList: [ 
  	    {
	      	sectionTitle: "File",
	      	groupList: [
   	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnShowList, ribbonBtnList.btnHideList ]
	   	       }
   	   	    ]
  	    },
        {
          	sectionTitle: "Properties",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnModelProp ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnALMProp, ribbonBtnList.btnModelMBT ]
     	       }
     	    ]
        },
	    {
	      	sectionTitle: "Execution",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnRunBDT, ribbonBtnList.btnStartPlay ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnStopBDT, ribbonBtnList.btnPauseBDT ]
	   	       }
	   	    ]
	    },
	    {
	      	sectionTitle: "Debug",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [  ribbonBtnList.btnDebugBDT]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnStepOverBDT,  ribbonBtnList.btnResumeBDT ]
	   	       },
 	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [  ribbonBtnList.btnToggleBreakBDT, ribbonBtnList.btnClearAllBreakBDT ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptSandbox, ribbonBtnList.btnExecMScript ]
	   	       }
	   	    ]
	    },
	    {
	      	sectionTitle: "Monitor",
	      	groupList: [
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnDSVar, ribbonBtnList.btnBDTMonitor ]
	   	       }
	   	    ]
	    },
	    {
	      	sectionTitle: "Exec Stats",
	      	groupList: [
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnSeqGraph, ribbonBtnList.btnExecMSC ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnManageStats, ribbonBtnList.btnTestCaseOutput ]
	   	       }
	   	    ]
	    },
   	    {
   	      	sectionTitle: "Markers",
   	      	groupList: [
  	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptMarkerCursor,  ribbonBtnList.btnMScriptMarkerLine ]
	   	       },
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnMScriptMarkerClear ]
	   	       }
	   	    ]
	    }
    ]
}

var tabMScriptEdit = {
	tabId: "MScriptEditor",
    tabTitle: "MScript",
    winName: "BDT_Editor",
    condenseAtWidth: 800,
    sectionList: [ 
  	    {
	      	sectionTitle: "Test Suite List",
	      	groupList: [
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnShowList, ribbonBtnList.btnHideList ]
	   	       },
   	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnSaveBDT ]
	   	       }
	   	    ]
	    },
  	    {
	        sectionTitle: "Edit",
        	groupList: [
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptUndo, ribbonBtnList.btnMScriptRedo ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptComment, ribbonBtnList.btnMScriptCompile ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptIndentLess,  ribbonBtnList.btnMScriptIndentMore ]
	   	       }
	   	    ]
	    },
        {
          	sectionTitle: "Search",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnMScriptFind, ribbonBtnList.btnMScriptReplace ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnMScriptGoTop, ribbonBtnList.btnMScriptGoBottom ]
     	       }
     	      
     	    ]
        },
	    {
	      	sectionTitle: "Format",
	      	groupList: [
 	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnMScriptFoldScenario  ]
	   	       },
 	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptFoldFeature,  ribbonBtnList.btnMScriptFoldTrigger  ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptFoldAll,  ribbonBtnList.btnMScriptExpandAll ]
	   	       }
	   	    ]
	    },
   	    {
   	      	sectionTitle: "Markers",
   	      	groupList: [
  	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMScriptMarkerCursor,  ribbonBtnList.btnMScriptMarkerLine ]
	   	       },
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnMScriptMarkerClear ]
	   	       }
	   	    ]
	    }
    ]
}



var tabHelp = {
	tabId: "Help",
    tabTitle: "Help",
    winName: "Help",
    condenseAtWidth: 655,
    sectionList: [
       {
    	   sectionTitle: "Guides & Support",
    	   groupList: [
    	      {
    	    	  btnSize: "large",
    	    	  btnList: [ ribbonBtnList.btnHelpWiki ]
        	  },
        	  {
        		  btnSize: "small",
        		  btnList: [ ribbonBtnList.btnHelpOverview, ribbonBtnList.btnHelpTutorials ]
        	  },
    	      {
    	    	  btnSize: "small",
    	    	  btnList: [ribbonBtnList.btnHelpForum, ribbonBtnList.btnHelpTicket ]
        	  }
          ]
       },
       {
     	  sectionTitle: "MScript Functions",
     	  groupList: [
        	   {
        	       btnSize: "large",
     	    	   btnList: [ribbonBtnList.btnHelpMScriptSys ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnHelpMScriptSelenium, ribbonBtnList.btnHelpMScriptWinUIA ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnHelpMScriptService, ribbonBtnList.btnHelpMScriptDataGen ]
     	       },
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnHelpMScriptAll ]
     	       }
     	    ]
       },
       {
	   	  sectionTitle: "Log Files",
	   	  groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ribbonBtnList.btnLogMScript ]
	   	       },
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ribbonBtnList.btnLogServer ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ribbonBtnList.btnLogIDE, ribbonBtnList.btnLogWinUIA ]
	   	       }
	   	    ]
       },
       {
    	   sectionTitle: "System",
    	   groupList: [
    	      {
    	    	  btnSize: "small",
    	    	  btnList: [ribbonBtnList.btnSysInfo, ribbonBtnList.btnLicInfo]
			  },
    	      {
    	    	  btnSize: "small",
    	    	  btnList: [ribbonBtnList.btnCheckUpdates, ribbonBtnList.btnHelpAbout]
			  }
           ]
       }
    ]
}



var ribbonData = {
	edition: "Trial",
	imgFolder: "IDE_RibbonUI/img/",
	tabList: [ tabTestSuite, tabMScriptEdit, tabBDTExec, tabHelp],
	initTab: tabTestSuite
}


