MainModule.factory ('FileSvc', function(IdeContext) {
	var FileSvc = { 
		curFile: ""
	};

	FileSvc.newFolder = function (parentFolderPath, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=fileAction&cmd=newFolder&curFolder=" + parentFolderPath;
		IdeContext.callURL (url, successCB, errorCB);
	};
	
	FileSvc.saveBin = function (binID, allTags, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=saveBin&binID=" + binID + "&allTags=" + allTags;
		IdeContext.callURL (url, successCB, errorCB);
	};
	
	FileSvc.renameBin = function (binID, newBinName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=saveBin&binID=" + binID + "&name=" + newBinName;
		IdeContext.callURL (url, successCB, errorCB);
	};
	
	FileSvc.renameFile = function (curFileName, newFileName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=fileAction&cmd=renameFile&fileType=" + fileObj.type + "&curFilePath=" + fileObj.filePath + "&oldName=" + curFileName + "&newName=" + newFileName;
		IdeContext.callURL (url, successCB, errorCB);
	};
	
	FileSvc.deleteFiles = function (filePathList, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=fileAction&cmd=deleteFiles&filePaths=" + filePathList.join(";");
		IdeContext.callURL (url, successCB, errorCB);
	};

	FileSvc.addTag = function (tagName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=addTag&name=" + tagName;
		IdeContext.callURL (url, successCB, errorCB);
	};
	
	FileSvc.deleteTag = function (tagID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=deleteTag&tagID=" + tagID;
		IdeContext.callURL (url, successCB, errorCB);
	};

	FileSvc.addBin = function (binName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=addBin&binName=" + binName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	FileSvc.deleteBin = function (binID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=deleteBin&binID=" + binID;
		IdeContext.callURL(url, successCB, errorCB);
	};

	FileSvc.addBinTag = function (binID, tagID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=addBinTag&binID=" + binID + "&tagId=" + tagID;
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.deleteBinTag = function (binID, tagID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=deleteBinTag&binID=" + binID + "&tagId=" + tagID;
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.deleteFileTag = function (fileID, tagID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=deleteFileTag&fileID=" + fileID + "&tagId=" + tagID;
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.addFileTag = function (fileID, tagID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=addFileTag&fileID=" + fileID + "&tagId=" + tagID;
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.getBinList = function (successCB, errorCB) {
		var	url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=binList";
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.getTagList = function (successCB, errorCB) {
		var	url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=tagList";
		IdeContext.callURL(url, successCB, errorCB);
	};

	FileSvc.getFolder = function (folderPath, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelBinning&cmd=folderList&curFolder=" + folderPath;
		IdeContext.callURL(url, successCB, errorCB);
	};

	FileSvc.getStatsList = function (modelName, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelAction&cmd=getStatsList&modelName=" + modelName;
		IdeContext.callURL(url, successCB, errorCB);
	};

	FileSvc.getExecStats = function (execID, successCB, errorCB) {
		var url = "/MbtSvr/app=webmbt&action=modelAction&cmd=getExecStats&execID=" + execID;
		IdeContext.callURL(url, successCB, errorCB);
	};
	
	FileSvc.getFileList = function (url, successCB, errorCB) {
		IdeContext.callURL(url, successCB, errorCB);
	};
	

	FileSvc.findArrayObj = function (arrayList, fieldName, fieldValue) {
		if (fieldValue==undefined || arrayList==undefined) return undefined;
		
		angular.forEach (arrayList, function (rowObj) {
			if (rowObj[fieldName] && rowobj[fieldName]==fieldValue) {
				return rowObj;
			}
		});
		return undefined;
	};
	
	return FileSvc;
})
