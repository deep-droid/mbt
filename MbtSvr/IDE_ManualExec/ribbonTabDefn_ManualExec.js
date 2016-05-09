var tabSummary = {
	tabId: "ManualExecSummary",
    tabTitle: "Summary",
    winName: "ManualExecSummary",
    condenseAtWidth: 800,
    sectionList: [
    ]
}

var tabReq = {
	tabId: "ManualExecReq",
    tabTitle: "Requirements",
    winName: "ManualExecReq",
    condenseAtWidth: 350,
    sectionList: [ ]
}

var tabStatus = {
	tabId: "ManualExecStatus",
    tabTitle: "Exec Status",
    winName: "ManualExecStatus",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabProgress = {
	tabId: "ManualExecProgress",
    tabTitle: "Progress",
    winName: "ManualExecProgress",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabDefects = {
	tabId: "ManualExecDefects",
    tabTitle: "Defects",
    winName: "ManualExecDefects",
    condenseAtWidth: 655,
    sectionList: [ ]
}

var tabPreamble = {
	tabId: "ManualExecPreamble",
    tabTitle: "Preamble",
    winName: "ManualExecPreamble",
    condenseAtWidth: 655,
    sectionList: [
    ]
}

var tabPostamble = {
	tabId: "ManualExecPostabmle",
    tabTitle: "Postamble",
    winName: "ManualExecPostamble",
    condenseAtWidth: 655,
    sectionList: [
    ]
}

var tabTC = {
	tabId: "ManualExecTC",
    tabTitle: "Test Cases",
    winName: "ManualExecTC",
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
	tabList: [ tabSummary, tabReq, tabPreamble, tabTC, tabPostamble, tabStatus, tabProgress, tabDefects, tabHelp ],
	initTab: tabSummary
}

