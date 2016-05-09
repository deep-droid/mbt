var tabDashboard = {
	tabId: "Dashboard",
    tabTitle: "Dashboard",
    winName: "Dashboard",
    condenseAtWidth: 800,
    sectionList: [
    ]
}

var tabDashTrend = {
	tabId: "DashTrend",
    tabTitle: "Trend",
    winName: "DashTrend",
    condenseAtWidth: 800,
    sectionList: [
    ]
}

var tabDashRpt = {
	tabId: "DashRpt",
    tabTitle: "Reports",
    winName: "DashRpt",
    condenseAtWidth: 800,
    sectionList: [ 
      {
 	     sectionTitle: "Project List",
 	     groupList: [
  	        {
  	    	   btnSize: "small",
  	    	   btnList: [ ribbonBtnList.btnHideList, ribbonBtnList.btnShowList ]
      	    },
 	        {
 	    	   btnSize: "large",
 	    	   btnList: [ ribbonBtnList.btnDashRptRefresh ]
     	    }
        ]
      },
      {
   	     sectionTitle: "Static Coverage",
   	     groupList: [
   	        {
   	    	   btnSize: "small",
   	    	   btnList: [ ribbonBtnList.btnDashRptModelReqStatic, ribbonBtnList.btnDashRptReqStatic ]
       	    }
          ]
       },
      {
  	     sectionTitle: "Traceability",
  	     groupList: [
  	        {
  	    	   btnSize: "small",
  	    	   btnList: [ ribbonBtnList.btnDashRptModelReqTrace, ribbonBtnList.btnDashRptReqTrace ]
      	    }
         ]
      },
      {
   	     sectionTitle: "Exec. Coverage",
   	     groupList: [
   	        {
   	    	   btnSize: "small",
   	    	   btnList: [ ribbonBtnList.btnDashRptModelReqCov, ribbonBtnList.btnDashRptReqCov ]
       	    }
          ]
       },
      {
   	     sectionTitle: "Failure Details",
   	     groupList: [
   	        {
   	    	   btnSize: "small",
   	    	   btnList: [ ribbonBtnList.btnDashRptModelReqFailed, ribbonBtnList.btnDashRptReqFailed ]
       	    }
          ]
      },
      {
   	     sectionTitle: "Execution",
   	     groupList: [
   	        {
   	    	   btnSize: "large",
   	    	   btnList: [ ribbonBtnList.btnDashRptModelTC ]
       	    }
          ]
      }
   ]
}

var tabProject = {
	tabId: "Projects",
    tabTitle: "Projects",
    winName: "Projects",
    condenseAtWidth: 350,
    sectionList: [
      {
   	     sectionTitle: "Project List",
   	     groupList: [
	        {
	    	   btnSize: "small",
	    	   btnList: [ ribbonBtnList.btnHideList, ribbonBtnList.btnShowList ]
		    },
   	        {
   	    	   btnSize: "large",
   	    	   btnList: [ ribbonBtnList.btnKpiRefresh ]
       	    }
          ]
       },
	   {
	   	   sectionTitle: "Project",
	   	   groupList: [
	   	      {
	   	    	  btnSize: "large",
	   	    	  btnList: [ ribbonBtnList.btnDashNewProj, ribbonBtnList.btnDashDelProj, ribbonBtnList.btnDashRefreshProj ]
	       	  }
	         ]
	   }
    ]
}

var tabKPI = {
	tabId: "KPI",
    tabTitle: "KPI",
    winName: "KPI",
    condenseAtWidth: 655,
    sectionList: [
       {
  	     sectionTitle: "KPI List",
  	     groupList: [
  	        {
  	    	   btnSize: "small",
  	    	   btnList: [ ribbonBtnList.btnHideList, ribbonBtnList.btnShowList ]
      	    },
	        {
  	    	   btnSize: "large",
  	    	   btnList: [ ribbonBtnList.btnKpiAdd, ribbonBtnList.btnKpiDel, ribbonBtnList.btnKpiRefresh ]
      	    }
         ]
      },

      {
  	    sectionTitle: "KPI",
  	    groupList: [
  	      {
  	    	  btnSize: "large",
  	    	  btnList: [ ribbonBtnList.btnKpiHistDel ]
      	  }
        ]
      },
      {
	    sectionTitle: "KPI Range",
	    groupList: [
	      {
	    	  btnSize: "large",
	    	  btnList: [ ribbonBtnList.btnKpiAddRange, ribbonBtnList.btnKpiDelRange ]
    	  }
	    ]
      }
  ]
}


var tabDashConfig = {
	tabId: "DashConfig",
    tabTitle: "ETL",
    winName: "DashConfig",
    condenseAtWidth: 800,
    sectionList: [ 
      {
  	     sectionTitle: "Edit",
  	     groupList: [
  	        {
  	    	   btnSize: "large",
  	    	   btnList: [ ribbonBtnList.btnDashCfgAddSvr, ribbonBtnList.btnDashCfgDelSvr 
  	    	            ]
      	    }
         ]
      },
      {
   	     sectionTitle: "Execution",
   	     groupList: [
   	        {
	    	   btnSize: "large",
	    	   btnList: [ ribbonBtnList.btnDashCfgRefresh, ribbonBtnList.btnDashCfgPing, ribbonBtnList.btnDashCfgRun
	    	            ]
    	    },
   	        {
 	    	   btnSize: "small",
 	    	   btnList: [ ribbonBtnList.btnDashCfgMore, ribbonBtnList.btnDashCfgLess
 	    	            ]
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
	tabList: [ tabDashboard, tabDashTrend, tabDashRpt, tabProject, tabKPI, tabDashConfig, tabHelp ],
	initTab: tabDashboard
}

