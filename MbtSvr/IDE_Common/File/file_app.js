

MainModule.controller("FileCtrl", function($rootScope, $scope, $http, IdeSize, IdeEvents, IdeContext, FileSvc) {
	$scope.preSplitPct = 30;
	$scope.splitPct = 30;
	$scope.headerHeight = 25;
	
    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
    }

	
	$scope.header_height = 17;
	$scope.dividerWidth = 5;

	$scope.dragStop = function (elem, stopLeft, stopTop) {
		$scope.splitPct = Math.round(100 * stopLeft / $scope.viewWidth);
		$scope.windowResized();
		$scope.$apply();
	};
	
	$scope.folderContext = {
			rootFolder: {name: "root/", type: "root", filePath: "", expanded: false},
			curFolder: null,
			history: []
		};
	
	$scope.curBin = {
			name: "", 
			tagList: [], 
			allTags: true,
			fileList: []
		};
	
	
	$scope.curFilter = {
			getURL: "",
			getType: "",
			tagList: [],
			allTags: true,
			fileList: [],
			search: {
				searchText: "",
				type: "contains"
			}
		};
	
	$scope.binList = [];
	$scope.tagList = [];

    $scope.checkAllModels = function(preChecked) {
		angular.forEach($scope.curFilter.fileList, function(fileInfo) {
			fileInfo.selected = !preChecked;
		});
    }
    
    $scope.toggleTAllTags = function() {
    	$scope.curFilter.allTags = !$scope.curFilter.allTags;
    	if ($scope.curFilter.getType == "bin") {
    		FileSvc.saveBin($scope.curBin.binID, $scope.curFilter.allTags, function() {
				$scope.curBin.allTags = $scope.curFilter.allTags;
				$scope.openBin($scope.curBin);
    		});
    	}
    	else {
    		$scope.applyFilterTags();
    	}
    };

    $scope.renameFile = function(fileObj, newFileName) {
    	if (newFileName==fileObj.name) return;
    	FileSvc.renameFile (fileObj.name, newFileName, function() {
			fileObj.name = newFileName;
			fileObj.filePath = fileObj.filePath.substring(0,fileObj.filePath.lastIndexOf(newFileName)) + newFileName;
			if (fileObj.type=="folder") {
				$scope.folderContext.curFolder.folderList = null;
			}
    	});
    };


    $scope.fileDeleteSelected = function(fileType) {
    	var delList = [];
    	angular.forEach($scope.curFilter.fileList, function(fileObj) {
			if (fileObj.selected && !fileObj.hide && 
				(fileType=="ALL" || fileObj.type==fileType)) {
				delList.push(fileObj);
			}
		});
		$scope.deleteFiles (delList);
	};

    $scope.deleteFiles = function(fileObjList) {
    	var filePathList = [];
    	angular.forEach (fileObjList, function(fileObj) {
    		filePathList.push(fileObj.filePath);
    	});
    	
    	FileSvc.deleteFiles (filePathList, $scope.refreshFileList, $scope.refreshFileList);
    };

    
    $scope.binNameChanged = function() {
    	FileSvc.renameBin ($scope.curBin.binID, $scope.curBin.name);
    };

    $scope.addTag = function (tagName) {
    	FileSvc.addTag (tagName, function(returnData) {
			$scope.tagList.splice(0,0, returnData.tagInfo);
    	});
    };
    
    $scope.deleteTag = function(tagObj) {
    	FileSvc.deleteTag (tagObj.tagID, function () {
			$scope.tagList.splice($scope.tagList.indexOf(tagObj),1);
			$scope.curFilter.getType = "tags";
    	});
    };

    $scope.addBin = function(binName) {
    	if (binName==undefined) return;
    	binName = binName.trim();
    	if (binName=='') return;
    	FileSvc.addBin (binName, function(returnData) {
			$scope.binList.splice(0,0, returnData.binInfo);
			$scope.curBin = $scope.binList[0];
			$scope.curFilter.getType = "bin";
    	});
    };

    $scope.deleteBin = function(binObj) {
    	FileSvc.deleteBin (binObj.binID, function() {
			$scope.binList.splice($scope.binList.indexOf(binObj),1);
			$scope.curFilter.getType = "tags";
    	})
    };

    $scope.addFilterTag = function(tagObj) {
    	var tagList = $scope.curFilter.tagList;
    	for (var i in tagList) {
    		if (tagList[i].name==tagObj.name) {
    			return;
    		}
    	}

    	if ($scope.curFilter.getType=="bin") {
	    	$scope.curFilter.tagList.push(tagObj);
	    	if ($scope.curFilter.getType=="bin") {
	    		FileSvc.addBinTag ( $scope.curBin.binID, tagObj.tagID, function() {
    	    		if (!$scope.curFilter.allTags) {
    	    			$scope.refreshFileList();
    	    		}
    	    		$scope.applyFilterTags();
	    		});
	    	}
	    	else $scope.applyFilterTags();
    	}
    	else {
			$scope.curFilter.tagList.push(tagObj);
			$scope.applyFilterTags();
    	}
    };
    
    $scope.addTagToSelectedFiles = function(tagObj) {
		angular.forEach($scope.curFilter.fileList, function(fileObj) {
			if (fileObj.selected && !fileObj.hide) {
				$scope.addFileTag(fileObj, tagObj);
			}
		});
    }
	
    $scope.deleteFilterTag = function (tagObj) {
    	var tagList = [];
    	var tagListOld = $scope.curFilter.tagList;
    	for (var i in tagListOld) {
    		if (tagListOld[i].name!=tagObj.name) {
    			tagList.push(tagListOld[i]);
    		}
    	}
    	
    	if ($scope.curFilter.getType=="bin") {
    		FileSvc.deleteBinTag ($scope.curBin.binID, tagObj.tagID, function() {
		    	$scope.curFilter.tagList = tagList;
		    	$scope.curBin.tagList = tagList;
	    		$scope.applyFilterTags();
    		});
    		
    		if (!$scope.curFilter.allTags) {
    			$scope.refreshFileList();
    		}
    	}
    	else {
	    	$scope.curFilter.tagList = tagList;
    		$scope.applyFilterTags();
    	}
    };
    
    $scope.deleteFileTag = function (fileObj, tagObj) {
    	FileSvc.deleteFileTag (fileObj.fileID, tagObj.tagID, function() {
			fileObj.tagList = returnData.tagList;
    		$scope.applyFilterTags();
    	})
    };

    $scope.addFileTag = function (fileObj, tagObj) {
    	if (fileObj.type!="folder") {
    		FileSvc.addFileTag (fileObj.fileID, tagObj.tagID, function() {
				fileObj.tagList = returnData.tagList;
    		});
    	}
    };

    $scope.openFolder = function (folderObj) {
		var historyIdx = $scope.folderContext.history.indexOf(folderObj);
		if (historyIdx>=0) {
			$scope.folderContext.history.splice(historyIdx);
		}
		$scope.curFilter.search.searchText = "";
		$scope.folderContext.history.push(folderObj);
		$scope.displayFolder(folderObj);
    };

    $scope.displayFolder = function (folderObj) {
		$scope.curFilter.getType = "folder";
		$scope.curFilter.getURL = "/MbtSvr/app=webmbt&action=modelBinning&cmd=fileByFolder&curFolder=" + folderObj.filePath;
		$scope.folderContext.curFolder = folderObj;
		$scope.curFilter.tagList = [];
		$scope.curFilter.allTags = true;
		$scope.refreshFileList();
    };

    $scope.displayCurrentFolder = function() {
		$scope.displayFolder($scope.folderContext.curFolder);
	};
    
    $scope.prevFolder = function() {
		var historyIdx = $scope.folderContext.history.indexOf($scope.folderContext.curFolder) - 1;
		if (historyIdx<0) {
			historyIdx = 0;
		}
		$scope.displayFolder($scope.folderContext.history [historyIdx]);
	};
    
    $scope.nextFolder = function() {
		var historyIdx = $scope.folderContext.history.indexOf($scope.folderContext.curFolder) + 1;
		if (historyIdx >= $scope.folderContext.history.length) {
			historyIdx = $scope.folderContext.history.length-1;
		}
		$scope.displayFolder($scope.folderContext.history [historyIdx]);
	};
    
    $scope.openBin = function(binObj) {
    	$scope.curBin = binObj;
    	$scope.curFilter.allTags = binObj.allTags;
		$scope.curFilter.tagList = binObj.tagList;
		$scope.curFilter.getType = "bin";
		$scope.curFilter.getURL = "/MbtSvr/app=webmbt&action=modelBinning&cmd=fileByBin&binID=" + $scope.curBin.binID;
    	$scope.refreshFileList();
    };
    
    $scope.searchFile = function () {
    	$scope.curFilter.getType = "search";
		$scope.curFilter.getURL = "/MbtSvr/app=webmbt&action=modelBinning&cmd=fileByFolder&curFolder=ALL";
    	$scope.curFilter.allTags = true;
		$scope.curFilter.tagList = [];
    	$scope.refreshFileList();
    };
    
	$scope.refreshFileList = function () {
		FileSvc.getFileList ($scope.curFilter.getURL, function(returnData) {
			if ($scope.curFilter.getType=="bin") {
				$scope.curBin.fileList = returnData.fileList;
			}
			$scope.curFilter.fileList = returnData.fileList;
			if ($scope.curFilter.getType=="search") {
				$scope.applyFilterSearch();
			}
			else {
				$scope.applyFilterTags();
			}
		});
    };

    $scope.refreshBinList = function () {
    	FileSvc.getBinList(function(returnData) {
			$scope.binList = returnData.binList;
    	});
    };

    $scope.refreshTagList = function () {
    	FileSvc.getTagList (function(returnData) {
			$scope.tagList = returnData.tagList;
    	});
    };

    $scope.togglePane = function (seqNum) {
    	if ($scope.showPane_seq == seqNum) {
    		$scope.showPane_seq = 0;
    	}
    	else $scope.showPane_seq = seqNum;
    }
    
    $scope.toggleFolder = function(folderObj) {
    	folderObj.expanded = !folderObj.expanded;
    	if (folderObj.expanded && folderObj.folderList==undefined) {
    		$scope.retrieveFolder(folderObj);
    	}
    };
    
    $scope.refreshRootFolder = function () {
    	$scope.folderContext.curFolder = $scope.folderContext.rootFolder;
    	$scope.folderContext.curFolder.folderList = undefined;
    	$scope.folderContext.curFolder.expanded = false;
    	$scope.toggleFolder($scope.folderContext.curFolder);
    	$scope.openFolder($scope.folderContext.curFolder);
    }
    
    $scope.retrieveFolder = function (folderObj) {
    	FileSvc.getFolder (folderObj.filePath, function(returnData) {
    		folderObj.folderList = returnData.folderList;
    	});
    }

    $scope.applyFilterSearch = function() {
    	var searchType = $scope.curFilter.search.type;
    	var searchText = $scope.curFilter.search.searchText;
    	var regexp = "";
    	if (searchType=="regexp") {
    		regexp = new RegExp(searchText);
    	}
    	else {
    		searchText = searchText.toUpperCase();
    	}
    	angular.forEach($scope.curFilter.fileList, function (fileObj) {
    		var matched = false;
	    	if (searchType=="regexp") {
	    		matched = regexp.test(fileObj.name);
	    	}
	    	else {
	    		var fileText = fileObj.name.toUpperCase();
	    		var idx = fileText.indexOf(searchText);
	    		if (idx<0) {
	    			match = false;
	    		}
	    		else if (searchType=="contains") {
	    			matched = (idx>=0);
		    	}
	    		else if (searchType=="startsWith") {
	    			matched = (idx==0);
		    	}
		    	else if (searchType=="endsWith") {
		    		matched = (idx + searchText.length == fileText.length);
		    	}
	    	}
			fileObj.hide = !matched;
    	});
    }
    
    $scope.applyFilterTags = function() {
    	var resetHide = true;
    	if ($scope.curFilter.getType=="search") {
	    	$scope.applyFilterSearch();
	    	resetHide = false;
    	}
    	var allTags = $scope.curFilter.allTags;
    	var tagList = $scope.curFilter.tagList;
    	angular.forEach($scope.curFilter.fileList, function (fileObj) {
    		if (!fileObj.hide || resetHide) {
    			var matchCount = 0;
	    		angular.forEach(tagList, function (tagObj) {
	    			var matched = false;
	    			for(var i in fileObj.tagList) {
		    			if (tagObj.name==fileObj.tagList[i].name) {
		    				matched = true;
	    					break;
		    			}
	    			}
	    			if (matched) matchCount += 1;
	    		});
	    		
				if (allTags) {
					if (matchCount<tagList.length) {
						fileObj.hide = true;
					}
					else fileObj.hide = false;
				}
				else {
					if (matchCount < 1 && tagList.length>0) {
						fileObj.hide = true;
					}
					else fileObj.hide = false;
				}
    		}
    	});
    };
    
    $scope.openFile = function (fileObj) {
    	if (fileObj.type=="folder") {
    		$scope.openFolder(fileObj);
    	}
    	else if (fileObj.type=="model") {
    		$rootScope.$broadcast("selectTab", "Model");
			$rootScope.$broadcast("openModel", {modelName: fileObj.name, path: ''});
    	}
    	else if (fileObj.type=="dataset") {
    		$rootScope.$broadcast("selectTab", "DataDesign");
			$rootScope.$broadcast("openDataSet", {dsName: fileObj.name, path: fileObj.filePath});
    	}
    	else {
    		alert ("Unable to open unknown file type: " + fileObj.type);
    	}
    };
    
    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();

		$scope.refreshBinList();
		$scope.refreshTagList();
//		$scope.refreshFileList();
		$scope.refreshRootFolder();
		$scope.folderContext.curFolder = $scope.folderContext.rootFolder;
		$scope.toggleFolder ($scope.folderContext.rootFolder);
		$scope.openFolder ($scope.folderContext.rootFolder);
		
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'File');
		});

		
		IdeEvents.regEvent($scope, "file", "menu_FolderNew", function (event, message) {
			FileSvc.newFolder($scope.folderContext.curFolder.filePath, function() {
				$scope.refreshModelList();
			});
		});

		IdeEvents.regEvent($scope, "file", "menu_FolderNew", function (event, message) {
			var parentFolder = $scope.folderContext.curFolder.filePath;
			FileSvc.newFolder(parentFolder, function(retData) {
				if (parentFolder=="") parentFolder = "root";
				$rootScope.$broadcast("postMsg", {msgText: "Created folder in " + parentFolder + "/", msgType: "info"})
			});
		});
		
		IdeEvents.regEvent($scope, "file", "menu_DeleteAllSelected", function (event, message) {
    		$scope.fileDeleteSelected ("ALL");
		});
    };
    
	$scope.init();
});


