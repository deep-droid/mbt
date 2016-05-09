var tabFile = {
	tabId: "File",
    tabTitle: "File",
    winName: "DataSetEditor",
    condenseAtWidth: 800,
    sectionList: [
	    {
	        sectionTitle: "DataSet List",
	        groupList: [
 	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnShowDSList, ribbonBtnList.btnHideDSList ]
	   	       },
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnRefreshDSList ]
	   	       }
		   	]
	    },
        {
          	sectionTitle: "DataSet",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnNewDS, ribbonBtnList.btnDelDS, ribbonBtnList.btnRefreshDS ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnSaveAsDS, ribbonBtnList.btnImportDS ]
     	       }
     	    ]
        }
    ]
}

var tabField = {
	tabId: "Field",
    tabTitle: "Field",
    winName: "DataSetEditor",
    condenseAtWidth: 350,
    sectionList: [ 
	    {
	      	sectionTitle: "",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnAddDSField ]
	   	       }
	   	    ]
	    },
        {
        	sectionTitle: "Selected Fields",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnDelDSField ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnLeftDSField, ribbonBtnList.btnRightDSField ]
	   	       },
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [  ribbonBtnList.btnHideDSField ]
	   	       }
	   	    ]
        },
        {
        	sectionTitle: "",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnShowDSField]
	   	       }
	   	    ]
        }
    ]
}

var tabRules = {
	tabId: "Rules",
    tabTitle: "Rules",
    winName: "DataSetEditor",
    condenseAtWidth: 655,
    sectionList: [ ]
}


var tabDataTable = {
	tabId: "DataTable",
    tabTitle: "Data Table",
    winName: "DataSetEditor",
    condenseAtWidth: 655,
    sectionList: [ 
      {
        	sectionTitle: "Generate",
        	groupList: [
     	       {
     	    	   btnSize: "large",
     	    	   btnList: [ ribbonBtnList.btnGen2WiseDS, ribbonBtnList.btnGen3WiseDS ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnGen4WiseDS, ribbonBtnList.btnGen5WiseDS ]
     	       },
     	       {
     	    	   btnSize: "small",
     	    	   btnList: [ ribbonBtnList.btnGen6WiseDS, ribbonBtnList.btnGenFullDS ]
     	       }
     	    ]
      },
      {
	      	sectionTitle: "DataTable",
	      	groupList: [
	      	   {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnAddRowDS, ribbonBtnList.btnSortDS ]
	   	       }
	      	]
      },
      {
	       	sectionTitle: "Selected Rows",
	      	groupList: [
	   	       {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnDelDSRow, ribbonBtnList.btnDSToggleRows, ribbonBtnList.btnDSResetRows ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [  ribbonBtnList.btnMoveDSRowUp, ribbonBtnList.btnMoveDSRowDown ]
	   	       },
	   	       {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnMoveDSRowTop, ribbonBtnList.btnMoveDSRowBottom ]
	   	       }
	   	    ]
      }
    ]
}


//var tabMisc = {
//	tabId: "Misc",
//    tabTitle: "Misc",
//    sectionList: [
//        {
//        	sectionTitle: "Current Tab",
//        	groupList: [
//     	       {
//     	    	   btnSize: "large",
//     	    	   btnList: [ ribbonBtnList.refreshTab ]
//     	       },
//     	       {
//     	    	   btnSize: "small",
//     	    	   btnList: [ ribbonBtnList.btnHelpOverview, ribbonBtnList.btnHelpUserGuide, ribbonBtnList.btnHelpTutorials ]
//     	       }
//     	    ]
//        }
//    ]
//}


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
    	    	   btnList: [  ribbonBtnList.btnHelpMScriptDataGen, ribbonBtnList.btnHelpMScriptDataDesign ]
    	       }
    	    ]
      },
      {
   	  sectionTitle: "Log Files",
   	  groupList: [
   	       {
   	    	   btnSize: "large",
   	    	   btnList: [ribbonBtnList.btnLogServer, ribbonBtnList.btnLogIDE ]
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
	tabList: [ tabFile, tabField, tabDataTable, tabHelp],
	initTab: tabFile
}


