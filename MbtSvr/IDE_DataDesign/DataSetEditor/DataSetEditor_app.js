

MainModule.controller("DSCtrl", function($rootScope, $scope, $http, IdeSize, IdeContext, IdeEvents, DataDesignSvc, IdeUtil) {
	$scope.preSplitPct = 30;
	$scope.splitPct = 30;
	$scope.headerHeight = 25;
	
	$scope.ruleLeftWidth = 450;
	$scope.ruleWidth = 225;
	$scope.fieldMinWidth = 50;
	$scope.fieldLeftWidth = 150;
	$scope.fieldWidth = 125;

    $scope.windowResized = function () {
    	$scope.viewHeight = IdeSize.viewHeight;
    	$scope.viewWidth = IdeSize.viewWidth;
		$scope.paneWidth_1 = Math.round(IdeSize.viewWidth * $scope.splitPct/100);
		$scope.paneWidth_2 = $scope.viewWidth - $scope.paneWidth_1 - 1;
		$scope.ruleWidth = $scope.paneWidth_2 - $scope.ruleLeftWidth;
		if ($scope.dataset.fields && $scope.dataset.fields.length>0) {
			var f = 0;
			angular.forEach($scope.dataset.fields, function(d) {
				if (!d.hidden) {
					f += 1;
				}
			});
		
			$scope.fieldWidth = Math.floor(($scope.paneWidth_2 - $scope.fieldLeftWidth)/f);
			$scope.fieldWidth = Math.max($scope.fieldMinWidth, $scope.fieldWidth);
		}
    }

	$scope.dsList = [];
	$scope.curDS = {};
	$scope.curFieldObj = {};
    
	$scope.strengthList = [
            { val: 'pairWise', label:'Pairwise'},
            { val: 'threeWise', label:'3-Wise'},
            { val: 'fourWise', label: '4-Wise' },
            { val: 'fiveWise', label: '5-Wise' },
            { val: 'sixWise', label: '6-Wise' },
            { val: 'full', label: 'Full' }
        ];

	$scope.algorithmList = [
	        { val: 'ipof', label: 'IPOF', title: 'for moderate size matrix ( < 20 vars, 10 values/par), allow mixed strength'},
	        { val: 'ipof2', label: 'IPOF2', title: 'for moderate size matrix ( < 20 vars, 10 values/par), no mixed strength'},
	        { val: 'ipog', label: 'IPOG', title: 'for moderate size matrix ( < 20 vars, 10 values/par), allow mixed strength'},
	        { val: 'ipog_d', label: 'IPOG-D', title: 'for larger size matrix ( > 20 vars, 10 values/par), no mixed strength'},
	        { val: 'ipog_r', label: 'IPOG-R', title: 'for moderate size matrix ( < 20 vars, 10 values/par), no mixed strength'},
	        { val: 'ipog_hybrid', label: 'IPOG-Hybrid', title: 'for moderate size matrix ( < 20 vars, 10 values/par), no mixed strength'}
	    ];

	$scope.fileTypeList = [
        	{label: "CSV File", val: "csv"},
        	{label: "Excel", val: "excel"}, 
        	{label: "Tab File", val: "tsv"}
        ];

    $scope.couplingGroupOptions = [
        	{label: " ", val: " "}, 
        	{label: "Group 1", val: "1"}, 
        	{label: "Group 2", val: "2"}, 
        	{label: "Group 3", val: "3"}, 
        	{label: "Group 4", val: "4"}, 
        	{label: "Group 5", val: "5"}, 
        	{label: "Group 6", val: "6"}, 
        	{label: "Group 7", val: "7"}, 
        	{label: "Group 8", val: "8"}, 
        	{label: "Group 9", val: "9"}, 
        	{label: "Group 10", val: "10"}, 
        	{label: "Group 11", val: "11"}, 
        	{label: "Group 12", val: "12"}, 
        	{label: "Group 13", val: "13"}, 
        	{label: "Group 14", val: "14"}, 
        	{label: "Group 15", val: "15"}, 
        	{label: "Group 16", val: "16"}, 
        	{label: "Group 17", val: "17"}, 
        	{label: "Group 18", val: "18"}, 
        	{label: "Group 19", val: "19"}, 
        	{label: "Group 20", val: "20"}, 
        	{label: "Group 21", val: "21"}, 
        	{label: "Group 22", val: "22"}, 
        	{label: "Group 23", val: "23"}, 
        	{label: "Group 24", val: "24"}, 
        	{label: "Group 25", val: "25"}, 
        	{label: "Verify", val: "V"}
        ];

    $scope.fieldDefList = {
    		dsInteractionGroup: "Field interaction group is used to group fields to have the specified interaction strength that is different from the strength set for the dataset. For example you may use pairwise strength for the dataset except for a set of fields you want to have 4-wise strength to increase the test coverage.",
    		dsStrength: "Strength determins how many combinations to generate to achieve the desired test coverage. Optios are pairwise, 3-wise, ... 6-wise and full combinatorial. While pairwise may provide sufficient test coverage with minimum test combinations for most common situation, there are situations that you may need to choose other algorithms e.g. 3-wise to improve the test coverage.",
    		dsPartField: "Partition Field is used to divide dataset rows into groups.  Each distinct value in the partition field forms a partition. The partition is then used by a speific thread when running the model with multiple threads.",
    		dsRuleName: "Rules are used to filter out certain combinations that are either infeasible or undesired.  Rule names must be unique within dataset. Any combinations that do not meet any of the rules will be removed.",
    		dsRuleExpr: "Rules are expressed in simplified algebraic expression, e.g. f1 > 2 and f2 = 'ABC', or IF f1 > 2 THEN f3 > 20.",
    		dsPlugin: "Plugin(s) provides mscript functions to aid in test data generation. E.g. $randEmail() from DataGen plugin generates a random email addresses.",
    		dsGenMode: "Mode affects the generation speed, default IPOG. Certain data set may benefit from using a specific mode. IPOF: for moderate size matrix ( < 20 vars, 10 values/var), allow mixed strength; IPOF2 - for moderate size matrix ( < 20 vars, 10 values/var), no mixed strength; IPOG - for moderate size matrix ( < 20 vars, 10 values/var), allow mixed strength; IPOG-D - for larger size matrix ( > 20 vars, 10 values/var), no mixed strength; IPOG-R - for moderate size matrix ( < 20 vars, 10 values/var), no mixed strength; IPOG-Hybrid - for moderate size matrix ( < 20 vars, 10 values/var), no mixed strength.",
    		dsCoupling: "Couping group is used to force fields in the group to use the values from the same index. E.g. CreditCardType has domain VISA, MASTER and CreditCardNum has visa# and master#. In this case, by assigning these fields in the same coupling group, the system will ensure CreditCardType and CreditCardNum have the matching value.",
    		dsDomain: "List of discrete values for the field. Blank is allowed but must not placed as the last row. Use domain to list boundary values to be tested. You may use MScript expression to generate the data, e.g. $randEmail() from DataGen plugin."
    };
    
    $scope.dataset = {};
    $scope.selectedRowList = [];
    
    postMsg = function (msgType, msgText) {
		$rootScope.$broadcast("postMsg", {msgType: msgType, msgText: msgText});
    }

    $scope.updateSelectedRowList = function () {
    	$scope.selectedRowList = [];
    	angular.forEach($scope.dataset.rows, function(rowObj) {
    		if (rowObj.selected) {
    			$scope.selectedRowList.push(rowObj);
    		}
    	});
    }
    
    $scope.applyFilter = function(filter) {
    	IdeUtil.applyFilter($scope.dsList, "dsName", filter, "hide"); 
    	$scope.windowResized();
    	return;
    }

	$scope.getDSList = function () {
		var lastDSName = undefined;
		if ($scope.dataset && $scope.dataset.dsName) {
			lastDSName = $scope.dataset.dsName;
		}
		DataDesignSvc.getDSList (function(data) {
			var newList = [];
			angular.forEach(data, function (dsName) {
				newList.push({dsName: dsName, selected: false});
			})
			$scope.dsList = newList;
			if (lastDSName) {
				var dsObj = $scope.findDSObj(lastDSName);
				if (dsObj) {
					$scope.openDS(dsObj);
				}
			}
			postMsg ("info", "retrieved dsList from server");
		});
	}
	
	$scope.setCurField = function (fieldObj) {
		$scope.curFieldObj = fieldObj;
	}
	
	$scope.openDS = function (dsObj_p) {
		angular.forEach($scope.dsList, function(dsObj2_p) {
			if (dsObj2_p) {
				dsObj2_p.selected = false;
			}
		});
		dsObj_p.selected = true;
		$rootScope.$broadcast("openDS", {dsName: dsObj_p.dsName, filePath: ''});
	}

	$scope.selectStrength = function (strength_p) {
		$scope.dataset.strength = strength_p;
		$scope.dataset.strengthObj = undefined;
		for (i in $scope.strengthList) {
			if ($scope.strengthList[i].val==$scope.dataset.strength) {
				$scope.dataset.strengthObj = $scope.strengthList[i];
				break;
			}
		}
	}

	$scope.prepForDisplay = function (dsObj_p) {
		if (dsObj_p.pluginList==undefined) {
			var pList = IdeContext.getPluginList();
			dsObj_p.pluginList = [];
			angular.forEach(pList, function(plugin_p) {
				if (plugin_p.cat.indexOf("DATA")>=0 || plugin_p.cat.indexOf("SERVICE")>=0) {
					dsObj_p.pluginList.push(plugin_p);
				}
			});
		}
		var temp = "," + dsObj_p.plugins + ",";
		angular.forEach(dsObj_p.pluginList, function (plugin_p) {
			if (temp.indexOf("," + plugin_p.code + ",")>=0) {
				plugin_p.selected = true;
			}
			else {
				plugin_p.selected = false;
			}
		});
		
		$scope.dataset.partFieldObj = undefined;
		for (i in $scope.dataset.fields) {
			if ($scope.dataset.fields[i].fieldName==$scope.dataset.partField) {
				$scope.dataset.partFieldObj = $scope.dataset.fields[i];
				break;
			}
		}
		
		$scope.selectStrength($scope.dataset.strength);
		
		angular.forEach($scope.algorithmList, function(alg_p) {
			if (alg_p.val==dsObj_p.algorithm) {
				alg_p.selected = true;
			}
			else alg_p.selected = false;
		});
		
		$scope.dataset.algorithmList = $scope.algorithmList;
		
		angular.forEach($scope.selectedRowList, function(selectedRowObj) {
			angular.forEach($scope.dataset.rows, function (rowObj) {
				if (rowObj._rowno==selectedRowObj._rowno) {
					rowObj.selected = true;
				}
			});
		});
	}
	
	$scope.findOption = function (optionList, fieldName, optionVal) {
		for (var i in optionList) {
			var opt = optionList[i];
			if (opt[fieldName]==optionVal) {
				return opt;
			}
		}
		return null;
	}
	
	$scope.loadDS = function (dsName) {
		postMsg("info", "openning dataset " + dsName);
		DataDesignSvc.getDS(dsName, function(returnData) {
			if (returnData.dsName) {
				$scope.displayDataSet(returnData);
			}
			$rootScope.$broadcast("showTab", "Field");
			$rootScope.$broadcast("showTab", "DataTable");
		});
	}
	
    $scope.findDSObj = function (dsName_p) {
    	var foundDS = null;
		angular.forEach($scope.dsList, function(dsObj_p) {
			if (dsObj_p.dsName==dsName_p) {
				foundDS = dsObj_p;
			}
		});
		return foundDS;
    }
    
	$scope.renameDS = function () {
		var originalDSName = $scope.dataset.originalDSName;
		if (originalDSName==$scope.dataset.dsName) {
			return;
		}
		
		DataDesignSvc.renameDS (originalDSName, $scope.dataset.dsName, function(returnData) {
				$scope.dataset.originalDSName = $scope.dataset.dsName;
				angular.forEach($scope.dsList, function(dsObj_p) {
					if (dsObj_p.dsName==originalDSName) {
						dsObj_p.dsName = $scope.dataset.dsName;
					}
				});
				$rootScope.$broadcast("DSRenamed", {originalDSName: originalDSName, newDSName: $scope.dataset.dsName});
				postMsg ("info", "Data set renamed from " + originalDSName + " to " + $scope.dataset.dsName);
			},
			function (returnData) {
				postMsg ("error", 'Failed to rename current dataset to ' + $scope.dataset.dsName);
				$scope.dataset.dsName = originalDSName;
			}
		);
	}

	$scope.savePlugins = function () {
		var pList = [];
		angular.forEach($scope.dataset.pluginListSelected, function(pluginObj_p) {
			pList.push(pluginObj_p.code);
		});
		var newPlugins = pList.join(",");
		DataDesignSvc.changePlugins ($scope.dataset.dsName, newPlugins, function (returnData) {
			$scope.dataset.plugins = newPlugins;
//			$scope.prepForDisplay($scope.dataset);
		}, function (returnData) {
//			$scope.prepForDisplay($scope.dataset);
			postMsg("error", "Failed to save plugin list.");
		});
	}
	
	$scope.saveAlgorithm = function () {
		var selectedAlg = "";
		angular.forEach($scope.dataset.algorithmListSelected, function(algObj_p) {
			if (algObj_p.selected){
				selectedAlg = algObj_p.val;
			}
		});
		postMsg("info", "Changing Mode to " + selectedAlg);
		DataDesignSvc.changeAlgorithm ($scope.dataset.dsName, selectedAlg, function() {
			//ok
		});
	}
	
	$scope.saveStrength = function () {
		$scope.dataset.strength = $scope.dataset.strengthObj.val;
		postMsg("info", "Changing Strength to " + $scope.dataset.strength);
		DataDesignSvc.changeStrength ($scope.dataset.dsName, $scope.dataset.strength, function() {
			//ok
		});
	}
	
	$scope.savePartField = function () {
		$scope.dataset.partField = $scope.dataset.partFieldObj.fieldName;
		postMsg("info", "Changing Partition Field to " + $scope.dataset.partField);
		DataDesignSvc.changePartField ($scope.dataset.dsName, $scope.dataset.partField, function() {
			//ok
		});
	}

	$scope.checkAllFields = function (selected_p) {
		angular.forEach ($scope.dataset.fields, function(fieldObj_p) {
			if (!fieldObj_p.hidden) {
				fieldObj_p.selected = selected_p;
			}
		});
	}

	$scope.checkAllRows = function (selected_p) {
		angular.forEach($scope.dataset.rows, function(rowObj) {
			rowObj.selected = selected_p;
		});
	}
	
	$scope.saveMScriptClass = function () {
		DataDesignSvc.changeMScriptClass ($scope.dataset.dsName, $scope.dataset.mscriptImplClassPath, function() {
			// ok
		});
	}


	$scope.changeFieldName = function (fieldObj) {
		DataDesignSvc.changeFieldName ($scope.dataset.dsName, fieldObj.fieldIdx, fieldObj.fieldName);
	}

	$scope.changeFieldGroup = function (fieldObj) {
		DataDesignSvc.changeFieldGroup ($scope.dataset.dsName, fieldObj.fieldIdx, fieldObj.groupOpt.val, function() {
			fieldObj.group = fieldObj.groupOpt.val;
		});
	}
	
	$scope.changeFieldRelID = function  (fieldObj) {
		var relID = "";
		if (fieldObj.relIDOpt) {
			relID = fieldObj.relIDOpt.relID;
			fieldObj.relIDOpt.refCount += 1;
		}
		
		var otherObj = $scope.findOption($scope.dataset.relations, "relID", fieldObj.relID);
		if (otherObj) {
			otherObj.refCount -= 1;
		}
		
		DataDesignSvc.changeFieldRelID ($scope.dataset.dsName, fieldObj.fieldIdx, relID, function() {
			fieldObj.relID = fieldObj.relIDOpt.val;
		});
	}
	
	$scope.changeFieldDomain = function (fieldObj) {
		DataDesignSvc.changeFieldDomain ($scope.dataset.dsName, fieldObj.fieldIdx, fieldObj.domainText)
	}

	$scope.deleteField = function (fieldObj) {
		DataDesignSvc.deleteField ($scope.dataset.dsName, fieldObj.fieldIdx, function() {
			$scope.dataset.fields.splice($scope.dataset.fields.indexOf(fieldObj),1);
		});
	}
	
	$scope.deleteRel = function (relObj) {
		DataDesignSvc.deleteRel ($scope.dataset.dsName, relObj.relIdx, function() {
			$scope.dataset.relations.splice($scope.dataset.relations.indexOf(relObj),1);
		});
	}
	
	$scope.changeRelID = function (relObj) {
		DataDesignSvc.changeRelID($scope.dataset.dsName, relObj.relIdx, relObj.relIDOpt.val, function() {
			relObj.relID = relObj.relIDOpt.val;
		});
	}

	$scope.changeRelStrength = function (relObj) {
		DataDesignSvc.changeRelStrength($scope.dataset.dsName, relObj.relIdx, relObj.strengthOpt.val, function() {
			relObj.strength = relObj.strengthOpt.val;
		});
	}
	
	$scope.addField = function () {
		DataDesignSvc.addField ($scope.dataset.dsName, function(retData) {
			$scope.dataset.fields.push(retData);
		});
	}

	
	$scope.addRelation = function () {
		DataDesignSvc.addRelation($scope.dataset.dsName, function(retData) {
			$scope.dataset.relations.push(retData);
		});
	}

	$scope.addRule = function () {
		DataDesignSvc.addRule ($scope.dataset.dsName, function(retData) {
			$scope.dataset.rules.push(retData);
		});
	}
	
	$scope.deleteRule = function (ruleObj) {
		DataDesignSvc.deleteRule ($scope.dataset.dsName, ruleObj.ruleIdx, function(retData) {
			$scope.dataset.rules.splice($scope.dataset.rules.indexOf(ruleObj),1);
		});
	}

	$scope.changeRuleName = function (ruleObj) {
		DataDesignSvc.changeRuleName($scope.dataset.dsName, ruleObj.ruleIdx, ruleObj.ruleName);
	}
	
	$scope.changeRuleExpr = function (ruleObj) {
		DataDesignSvc.changeRuleExpr ($scope.dataset.dsName, ruleObj.ruleIdx, ruleObj.ruleExpr);
	}

	$scope.deleteDataRows = function () {
		if ($scope.selectedRowList.length==0) {
    		postMsg("alert", "No rows selected");
    		return;
		}
		
		angular.forEach($scope.selectedRowList, function (rowObj) {
			DataDesignSvc.deleteDataRow ($scope.dataset.dsName, rowObj._rowno, function(retData) {
				$scope.dataset.rows.splice($scope.dataset.rows.indexOf(rowObj),1);
			});
		});
		
		$scope.selectedRowList = [];
	}
	
	$scope.changeDataRow = function (rowObj, fieldName) {
		DataDesignSvc.changeDataRow ($scope.dataset.dsName, rowObj._rowno, fieldName, rowObj[fieldName]);
	}
	
	$scope.moveDataRows = function (direction) {
		var rowIdxList = [];
		angular.forEach($scope.selectedRowList, function(row) {
			rowIdxList.push(row._rowno);
		});
		
		if (rowIdxList.length==0) {
    		postMsg("alert", "No rows selected");
    		return;
		}
		DataDesignSvc.moveDataRow ($scope.dataset.dsName, rowIdxList, direction, function() {
			$scope.loadDS($scope.dataset.dsName);
		});
	}

	$scope.addDataRow = function () {
		DataDesignSvc.addDataRow ($scope.dataset.dsName, function() {
			$scope.loadDS($scope.dataset.dsName);
		});
	}
	
	$scope.DataSetRegen = function (alg_p) {
    	if ($scope.dataset.dsName==undefined) {
    		postMsg("warn", "No data set is open");
    	}
    	else {
    		if (alg_p) {
        		$scope.selectStrength(alg_p);
    		}
    		DataDesignSvc.regenDataTable ($scope.dataset.dsName, $scope.dataset.strength, function(retData) {
    			$scope.displayDataSet(retData);
    		});
    	}
	}
		
	$scope.saveAs = function (newDSName) {
		DataDesignSvc.saveAs($scope.dataset.dsName, newDSName);
	}
	
	$scope.moveField = function (fieldObj, direction) {
		var idx = $scope.dataset.fields.indexOf(fieldObj);
		if (idx<0) return;
		var targetFieldObj = $scope.dataset.fields[idx + direction];
		if (targetFieldObj==undefined) return;
		DataDesignSvc.moveField($scope.dataset.dsName, fieldObj.fieldIdx, direction, function() {
			$scope.dataset.fields[idx] = targetFieldObj;
			$scope.dataset.fields[idx + direction] = fieldObj;
		});
	}
	
	$scope.sortDataTable = function (fieldName) {
		$scope.predicate = fieldName;
		$scope.reverse = !$scope.reverse;
	}
	
	$scope.displayDataSet = function (dataset) {
		$scope.dataset = dataset;
		$scope.dataset.originalDSName = $scope.dataset.dsName;
		
		angular.forEach($scope.dataset.fields, function(fieldObj) {
			fieldObj.groupOpt = $scope.findOption($scope.couplingGroupOptions, "val", fieldObj.group);
			fieldObj.relIDOpt = $scope.findOption($scope.dataset.relations, "relID", fieldObj.relID);
			if (fieldObj.relIDOpt) {
				if (fieldObj.relIDOpt.refCount) {
					fieldObj.relIDOpt.refCount += 1;
				}
				else {
					fieldObj.relIDOpt.refCount = 1;
				}
			}
			fieldObj.domainText = fieldObj.domain.join("\n");
		});
		
		angular.forEach($scope.dataset.relations, function(relObj) {
			relObj.strengthOpt = $scope.findOption($scope.strengthList, "val", relObj.strength);
		});
		
		$scope.prepForDisplay($scope.dataset);

		$scope.windowResized();
	}


    $scope.init = function () {
    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	$scope.getDSList();
		$scope.$on("$destroy", function() {
			IdeEvents.unregAllEvents($scope, 'DataDesign');
		});
		
    	IdeEvents.regEvent($scope, "DataDesign", "menu_NewDS", function (event, message) {
    		var newDSName = "New_DS";
    		var i = 0;
    		angular.forEach($scope.dsList, function (dsObj_p) {
    			if (newDSName==dsObj_p.dsName) {
    				i = i+1;
    				newDSName = "New_DS_" + i;
    			}
    		});
			DataDesignSvc.newDS(newDSName, function() {
				var newDS = {dsName: newDSName, selected: true};
				$scope.dsList.push(newDS);
				$scope.openDS (newDS);
				postMsg('info', 'New DS created ' + newDSName);
			});
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_SaveAsDS", function (event, message) {
    		if ($scope.dataset.dsName==undefined) {
    			postMsg ("warn", "Dataopen");
    			return;
    		}
    		
    		var newDSName = "Copy " + $scope.dataset.dsName;
    		var i = 0;
    		angular.forEach($scope.dsList, function (dsObj_p) {
    			if (newDSName==dsObj_p.dsName) {
    				i = i+1;
    				newDSName = "Copy " + newDSName;
    			}
    		})
			DataDesignSvc.saveAs($scope.dataset.dsName, newDSName, function() {
				var newDS = {dsName: newDSName, selected: true};
				$scope.dsList.push(newDS);
				$scope.openDS (newDS);
				postMsg ('info', 'Current dataset cloned to ' + newDSName);
			});
		});

    	
    	IdeEvents.regEvent($scope, "DataDesign", "menu_RefreshDSList", function (event, message) {
    		$scope.getDSList();
    	});
    	
    	IdeEvents.regEvent($scope, "DataDesign", "menu_DSToggleRows", function (event, message) {
    		angular.forEach($scope.dataset.rows, function(rowObj) {
    			rowObj.selected = !rowObj.selected;
    		});
    	});
    	
    	IdeEvents.regEvent($scope, "DataDesign", "menu_DSResetRows", function (event, message) {
    		angular.forEach($scope.dataset.rows, function(rowObj) {
    			rowObj.selected = false;
    		});
    	});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_DelDS", function (event, message) {
    		var delList = [];
    		angular.forEach($scope.dsList, function(dsObj_p) {
    			if (dsObj_p && (dsObj_p.hide==undefined || !dsObj_p.hide) && dsObj_p.selected) {
    				delList.push(dsObj_p);
    			}
    		});
			if (delList.length>0 && confirm ('Do you wish to delete selected ' + delList.length + ' data set(s)?')) {
	    		angular.forEach(delList, function(dsObj_p) {
    				DataDesignSvc.deleteDS (dsObj_p.dsName, function() {
    						if (dsObj_p==$scope.dataset) {
    							$scope.dataset = {};
    						}
							var idx = $scope.dsList.indexOf(dsObj_p);
							if (idx>=0) {
								$scope.dsList.splice(idx,1);
								postMsg ("info", "Deleted dataset " + dsObj_p.dsName);
							}
	    				}, function() {
	    					postMsg ("error", "Failed to delete dataset " + dsObj_p.dsName);
	    				}
    				);
	    		});
			}
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_HideDSList", function (event, message) {
    		if ($scope.splitPct>0) {
        		$scope.preSplitPct = $scope.splitPct;
        		$scope.splitPct = 0;
    		}
    		$scope.windowResized();
		});
		
    	IdeEvents.regEvent($scope, "DataDesign", "menu_ShowDSList", function (event, message) { 
    		if ($scope.preSplitPct<=0) {
    			$scope.preSplitPct = 30;
    		}
    		$scope.splitPct = $scope.preSplitPct;
    		$scope.windowResized();
		});
    	
    	IdeEvents.regEvent($scope, "DataDesign", "DSRenamed", function (event, message) {			 	
			angular.forEach($scope.dsList, function(dsObj_p) {
				if (dsObj_p && dsObj_p.dsName==message.originalDSName) {
					dsObj_p.dsName = message.newDSName;
				}
			});
		});

    	IdeSize.addListener($scope);
    	$scope.windowResized();
    	
		$scope.$on("$destroy", function() {
			IdeContext.unregAllEvents($scope, 'DataDesign');
		});

    	IdeEvents.regEvent($scope, "DataDesign", "openDS", function (event, message) {
    		$scope.selectedRowList = [];
    		$scope.loadDS(message.dsName);
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_RefreshDS", function (event, message) {
    		$scope.loadDS($scope.dataset.dsName);
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_DelDSField", function (event, message) {
    		var delList = [];
			angular.forEach($scope.dataset.fields, function (fieldObj_p) {
				if (fieldObj_p.selected && !fieldObj_p.hidden) {
					delList.push(fieldObj_p);
				}
			});
			if (delList.length>0 && confirm ('Do you wish to delete selected ' + delList.length + ' field(s)?')) {
				angular.forEach(delList, function (fieldObj_p) {
					$scope.deleteField(fieldObj_p);
				});
			}
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_AddDSField", function (event, message) {
			$scope.addField();
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_HideDSField", function (event, message) {
			angular.forEach($scope.dataset.fields, function (fieldObj_p) {
				if (fieldObj_p.selected) {
					fieldObj_p.hidden = true;
				}
			});
			$scope.windowResized();
    	});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_ShowDSField", function (event, message) {
			angular.forEach($scope.dataset.fields, function (fieldObj_p) {
				if (fieldObj_p.selected) {
					fieldObj_p.hidden = false;
				}
			});
			$scope.windowResized();
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_LeftDSField", function (event, message) {
			angular.forEach($scope.dataset.fields, function (fieldObj_p, idx_p) {
				if (fieldObj_p && !fieldObj_p.hidden && fieldObj_p.selected && idx_p>0) {
					$scope.moveField(fieldObj_p, -1);
				}
			});
		});
    	
    	IdeEvents.regEvent($scope, "DataDesign", "menu_RightDSField", function (event, message) {
			angular.forEach($scope.dataset.fields, function (fieldObj_p, idx_p) {
				if (fieldObj_p && !fieldObj_p.hidden && fieldObj_p.selected && (idx_p+1)<$scope.dataset.fields.length) {
					$scope.moveField(fieldObj_p, 1);
				}
			});
		});
    	
    	IdeEvents.regEvent($scope, "DataDesign", "menu_SortDS", function (event, message) {
    		var sortNum = 0;
			angular.forEach($scope.dataset.fields, function (fieldObj_p, idx_p) {
				if (fieldObj_p.selected && !fieldObj_p.hidden) {
					sortNum += 1;
					if (sortNum > 1) {
						postMsg ("warn", "More than one fields are selected.");
						return;
					}
					$scope.sortDataTable(fieldObj_p.fieldName);
				}
			});
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_DelDSRow", function (event, message) {
    		$scope.deleteDataRows();
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_MoveDSRowUp", function (event, message) {
    		$scope.moveDataRows("up");
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_MoveDSRowDown", function (event, message) {
    		$scope.moveDataRows("down");
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_MoveDSRowTop", function (event, message) {
    		$scope.moveDataRows("top");
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_MoveDSRowBottom", function (event, message) {
    		$scope.moveDataRows("bottom");
		});


    	IdeEvents.regEvent($scope, "DataDesign", "menu_AddRowDS", function (event, message) {
    		$scope.addDataRow();
		});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_Gen2WiseDS", function (event, message) {
    		$scope.DataSetRegen("pairWise");
    	});
    	IdeEvents.regEvent($scope, "DataDesign", "menu_Gen3WiseDS", function (event, message) {
    		$scope.DataSetRegen("threeWise");
    	});
    	IdeEvents.regEvent($scope, "DataDesign", "menu_Gen4WiseDS", function (event, message) {
    		$scope.DataSetRegen("fourWise");
    	});
    	IdeEvents.regEvent($scope, "DataDesign", "menu_Gen5WiseDS", function (event, message) {
    		$scope.DataSetRegen("fiveWise");
    	});
    	IdeEvents.regEvent($scope, "DataDesign", "menu_Gen6WiseDS", function (event, message) {
    		$scope.DataSetRegen("sixWise");
    	});
    	IdeEvents.regEvent($scope, "DataDesign", "menu_GenFullDS", function (event, message) {
    		$scope.DataSetRegen("full");
    	});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_ExportDS", function (event, message) {
    		if ($scope.dataset.dsName==undefined || $scope.dataset.dsName==null) {
				postMsg ("warn", "Data set not open.");
				return;
    		}
    		var exportFileType = ribbonBtnList.btnFormatDS.btnSelectedVal.val;
    		var urlPath = "app=webmbt&action=combDS&cmd=exportDS&dsName=" + $scope.dataset.dsName 
    				+ "&fileType=" + exportFileType;
    		window.open(urlPath, 'TestOptimal - Data Set (' + $scope.dataset.dsName + "'");
    	});

    	IdeEvents.regEvent($scope, "DataDesign", "menu_ImportDS", function (event, message) {
    		if ($scope.dataset.dsName==undefined) {
				postMsg ("warn", "Data set not open.");
				return;
    		}
    		var url = "app=webmbt&action=combDS&cmd=importDS&dsName=" + $scope.dataset.dsName;
    	    $('#fileupload, #dataSetSection').fileupload({
    	        url: url,
    	        dataType: 'json',
    			formData: {example: 'test'},
    	        done: function (e, data) {
    	        	if (data.result.error) {
    					postMsg ("error", "File upload error: " + data.result.error);
    					return;
    	        	}
    	        	if (data.result.files.length!=1) {
    					postMsg ("error", "File upload error: no files selected to import");
    					return;
    	        	}
    	        	if (data.result.files[0].error!=undefined) {
    					postMsg ("error", "File upload error: " + data.result.files[0].error);
    	            	return;
    				}
					postMsg ("info", "Imported file " + data + " for data set " + $scope.dataset.dsName);
    				$scope.loadDS($scope.dataset.dsName);
    	        },
//    		      change: function (e, data) {
//    			        $.each(data.files, function (index, file) {
//    			            alert('Selected file: ' + file.name);
//    			        });
//    			    },
    	        drop: function(e,data) {
    	            $.each(data.result.files, function (index, file) {
    					postMsg ("info", "File upload a dropped file: " + file.name);
    		        });
    	        }
    	    });
    		$("#fileupload").show().click().hide();
    	});
    	
		$rootScope.$broadcast("hideTab", "Field");
		$rootScope.$broadcast("hideTab", "DataTable");
    };

    $scope.init();
});

