
var tabUIRepo = {
	tabId: "UIRepo",
    tabTitle: "UIRepo",
    winName: "UIRepo",
    condenseAtWidth: 350,
    sectionList: [ 
  	    {
	        sectionTitle: "UI List",
        	groupList: [
	      	   {
	   	    	   btnSize: "small",
	   	    	   btnList: [ ribbonBtnList.btnShowList, ribbonBtnList.btnHideList]
	   	       },
	      	   {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnRefreshList ]
		   	   }
	   	    ]
	    },
  	    {
	        sectionTitle: "Edit",
        	groupList: [
	      	   {
	   	    	   btnSize: "large",
	   	    	   btnList: [ ribbonBtnList.btnNewUIPage, ribbonBtnList.btnNewUIElem, ribbonBtnList.btnDel ]
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
	tabList: [ tabUIRepo, tabHelp],
	initTab: tabUIRepo
}


