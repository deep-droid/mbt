var tabBatch = {
	tabId: "Batch",
    tabTitle: "Batch",
    winName: "Batch",
    condenseAtWidth: 800,
    sectionList: [
    ]
}

var tabModel = {
	tabId: "Model",
    tabTitle: "Model",
    winName: "Model",
    condenseAtWidth: 350,
    sectionList: [ ]
}

var tabRun = {
	tabId: "Run",
    tabTitle: "Run",
    winName: "Run",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabRequirement = {
	tabId: "Requirement",
    tabTitle: "Requirement",
    winName: "Requirement",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabCoverage = {
	tabId: "Coverage",
    tabTitle: "Coverage",
    winName: "Coverage",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabTestCase = {
	tabId: "TestCase",
    tabTitle: "Test Cases",
    winName: "TestCase",
    condenseAtWidth: 655,
    sectionList: [
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
	tabList: [ tabBatch, tabModel, tabRequirement, tabTestCase, tabHelp ],
	initTab: tabModel
}

