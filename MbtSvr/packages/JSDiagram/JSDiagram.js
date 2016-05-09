// copyright 2008 - 2013, TestOptimal, LLC, all rights reserved.
// JSDiagram.js

JSDiagram = function () {
	return this;
}

JSDiagram.modelCanvas;
JSDiagram.modelCanvasID;
JSDiagram.nn6 = document.getElementById&&!document.all;
JSDiagram.markMode = false;

JSDiagram.curMouseEvent;
JSDiagram.dragEvent;
JSDiagram.multiDragStateList;
JSDiagram.dragUI;

JSDiagram.lastUID = 0;
JSDiagram.stateCtxMenuBindings = {};
JSDiagram.transCtxMenuBindings = {};
JSDiagram.swimlaneCtxMenuBindings = {};
JSDiagram.boxCtxMenuBindings = {};
JSDiagram.strategies = new Array();

JSDiagram.transList = new Array();
JSDiagram.stateList = new Array();
JSDiagram.hoverColor = "red";
JSDiagram.defaultTransColor = "#222222";
JSDiagram.TransHoverColor = "red";
JSDiagram.CharWidth = 7;
JSDiagram.LabelMinWidth = 25;
JSDiagram.LineImgObj;
JSDiagram.LineImgPath = "packages/JSDiagram/img/";
JSDiagram.MinTop = 1;
JSDiagram.MinLeft = 1;
JSDiagram.rightMouseDragStarted = false;
JSDiagram.newStateOffsetList = new Array();


/*************
 * Constants *
 *************/
JSDiagram.LEFT = 1;
JSDiagram.RIGHT = 2;
JSDiagram.UP = 4;
JSDiagram.DOWN = 8;
JSDiagram.HORIZONTAL = JSDiagram.LEFT + JSDiagram.RIGHT;
JSDiagram.VERTICAL = JSDiagram.UP + JSDiagram.DOWN;
JSDiagram.AUTO = JSDiagram.HORIZONTAL + JSDiagram.VERTICAL;
JSDiagram.STATE_MIN_WIDTH = 15;
JSDiagram.STATE_MIN_HEIGHT = 20;

JSDiagram.START = 0;
JSDiagram.END = 1;
JSDiagram.MIDDLE = 2;
JSDiagram.SCROLLBARS_WIDTH = 18;

JSDiagram.Thickness = 2;
JSDiagram.transEndImgOffset = 4;

JSDiagram.arrowImgList = new Array();
JSDiagram.arrowImgList[JSDiagram.LEFT] = "packages/JSDiagram/arrow_l_new.gif";
JSDiagram.arrowImgList[JSDiagram.RIGHT] = "packages/JSDiagram/arrow_r.gif";
JSDiagram.arrowImgList[JSDiagram.UP] = "packages/JSDiagram/arrow_u.gif";
JSDiagram.arrowImgList[JSDiagram.DOWN] = "packages/JSDiagram/arrow_d.gif";

JSDiagram.canvasWidth = 600;
JSDiagram.canvasHeight = 800;
JSDiagram.dragZindex = 9;

JSDiagram.callbackFunc;
JSDiagram.shiftCtrlKey = false;
JSDiagram.focusHelper;
JSDiagram.dragTally = 0;
JSDiagram.dragInterval = 2;

JSDiagram.down = 0;
JSDiagram.up = 0;

JSDiagram.branchLessThreshold = 0.49;
JSDiagram.branchMoreThreshold = 0.51;

JSDiagram.switchLessThreshold = 0.15;
JSDiagram.switchMoreThreshold = 0.85;

JSDiagram.dragDivStartX;
JSDiagram.dragDivStartY;
JSDiagram.dragLineDiv;

JSDiagram.dragStartFunc = function(ui) {
	JSDiagram.dragUI = ui;
}

JSDiagram.init = function (modelCanvasElem_p, modelCtxMenuBindings_p, 
	stateCtxMenuBindings_p, transCtxBindings_p, swimlaneCtxMenuBindings_p, boxCtxMenuBindings_p, callbackFunc_p) {
	JSDiagram.modelCanvas = $(modelCanvasElem_p);
	JSDiagram.modelCanvasID = $(modelCanvasElem_p).attr("id");
	$('<canvas id=arrowCanvas style="left:0; top:0; position:absolute;z-index: 5000;" height="2" width="2"></canvas>').appendTo(JSDiagram.modelCanvas);
	
	JSDiagram.callbackFunc = callbackFunc_p;
	
	if (stateCtxMenuBindings_p) {
		JSDiagram.stateCtxMenuBindings = stateCtxMenuBindings_p;
	}
	
	if (transCtxBindings_p) {
		JSDiagram.transCtxMenuBindings = transCtxBindings_p;
	}
	
	if (swimlaneCtxMenuBindings_p) {
		JSDiagram.swimlaneCtxMenuBindings = swimlaneCtxMenuBindings_p;
	}
	if (boxCtxMenuBindings_p) {
		JSDiagram.boxCtxMenuBindings = boxCtxMenuBindings_p;
	}

	//lasso
	$(JSDiagram.modelCanvas).selectable({
			filter: ".state", 
			tolerance: "fit",
			start: function(event, ui) {
				if (!event.ctrlKey && !event.shiftKey && !event.altKey) JSDiagram.clearMarks();
			},
			selected: function(event,ui) {
				if (JSDiagram.dragUI!=null || JSDiagram.dragEvent!=null) return false;
				
				if ($(ui.selected).hasClass("marked")) {
					return;
				}
				var stateUID = $(ui.selected).attr('id');
				var stateObj = JSDiagram.findState(stateUID);
				if (stateObj.readonly) return;
				$(stateObj.stateElem).jTagging(true, {class: "stateMark", addTag: JSDiagram.markMode});
				JSDiagram.callbackFunc('state', stateUID, 'marked', '', '');
	   		},
	   		stop: function (event, ui) {
	   		}
    	});
                                

	$(JSDiagram.modelCanvas).mousedown(function(event) {
		JSDiagram.dragDivStartX = event.pageX;
		JSDiagram.dragDivStartY = event.pageY;
	});

	JSDiagram.dragLineDiv = $("<div style='z-index: 99999; position: absolute; display:none; border:2px dashed orange'></div>").appendTo($(modelCanvas));

	$(JSDiagram.modelCanvas).mouseup(function(event) {
		JSDiagram.rightMouseDragStarted = false;
		JSDiagram.closeCtxMenu();
		JSDiagram.clearArrow();
		JSDiagram.dragDivStartX = -1;
		$(JSDiagram.dragLineDiv).hide();

		if (event.which==3) {
			JSDiagram.rightMouseDragStarted = true;
		}
		else {
	    	JSDiagram.rightMouseDragStarted = false;
		}
	});

	$(JSDiagram.modelCanvas).mousemove(function(event) {
		if ($("#opaqDiv").is(":visible")) return;
	    JSDiagram.curMouseEvent = event;
		if (JSDiagram.dragDivStartX < 0 || JSDiagram.dragUI!=null || JSDiagram.dragEvent!=null) return;
		
		var divWidth = event.pageX - JSDiagram.dragDivStartX;
		var divHeight = event.pageY - JSDiagram.dragDivStartY;
		
		var divX = JSDiagram.dragDivStartX;
		var divY = JSDiagram.dragDivStartY;
		if (divWidth < 0) {
			divWidth = -divWidth;
			divX = JSDiagram.dragDivStartX - divWidth;
		}		
		if (divHeight < 0) {
			divHeight = -divHeight;
			divY = JSDiagram.dragDivStartY - divHeight;
		}		

		divX = divX - $(modelCanvas).offset().left;
		divY = divY - $(modelCanvas).offset().top;
		$(JSDiagram.dragLineDiv).css({left: divX, top: divY, width: divWidth, height: divHeight});
		
		if (divWidth > 5 && divHeight > 5) {
			$(JSDiagram.dragLineDiv).show();
		}
	});
	
	$(document).keydown(function(event) {
			var keyCode = null;
			if (event.which) keyCode = event.which;
			else if (event.keyCode) keyCode = event.keyCode;
			if (event.shiftKey && event.ctrlKey) {
				JSDiagram.moveMarkedStates(keyCode, 1);
			}
			else if (event.shiftKey || event.ctrlKey) {
				JSDiagram.moveMarkedStates(keyCode, 5);
			}
		})
		.keyup(function(event) {
//			JSDiagram.shiftCtrlKey = false;
			var keyCode = null;
			if (event.which) keyCode = event.which;
			else if (event.keyCode) keyCode = event.keyCode;
			if (keyCode==46) {
				JSDiagram.deleteAllMarkedStateTrans();
			}
			
			// add code here for lasso
		});
		
	$(JSDiagram.modelCanvas).contextMenu(modelCtxMenuBindings_p.menuID,  {
			bindings: modelCtxMenuBindings_p,
	    	'onContextMenu': function (ui) {
	    		JSDiagram.dragEvent = null;
	    		JSDiagram.dragUI = null;
//	    		if (JSDiagram.dragEvent) return false;
	    		return true;
	    	},
	    	'onShowMenu': function(e, menu) {
	    		if (modelCtxMenuBindings_p.onShowMenu) {
	    			modelCtxMenuBindings_p.onShowMenu (e, menu);
	    		}
	    		return menu;
	    	},
	    	'menuStyle': modelCtxMenuBindings_p.menuStyle,
	    	'listingStyle': modelCtxMenuBindings_p.itemStyle,
	    	'itemHoverStyle': modelCtxMenuBindings_p.itemHoverStyle
	    })
	    .rightMouseUp(function(e) {
	    	JSDiagram.curMouseEvent = e;
			if (JSDiagram.dragEvent && (Math.abs(e.clientX-JSDiagram.dragEvent.clientX) > 10 || Math.abs(e.clientY-JSDiagram.dragEvent.clientY)>10)) {
				// new state and new trans
//				var newState = JSDiagram.addState("modelCanvas", {});
				var fromUID = $(JSDiagram.dragEvent.currentTarget).attr("id");
//				JSDiagram.addTrans({srcUID: fromUID, destUID: newState.stateUID});
				JSDiagram.callbackFunc('state', 'scxml', 'new', 'state/trans', {left: JSDiagram.getCurPosLeft(), top: JSDiagram.getCurPosTop(), srcUID: fromUID});
				e.stopPropagation();
				e.preventDefault();
			}
			JSDiagram.dragEvent = null;
    		JSDiagram.dragUI = null;
			JSDiagram.clearArrow();
			e.stopPropagation();
		});
		
	$(JSDiagram.modelCanvas).dblclick(function() {
		JSDiagram.callbackFunc('model', '', 'dblclick', 'canvas');
		JSDiagram.dragEvent = null;
		JSDiagram.dragUI = null;
		JSDiagram.closeCtxMenu();
		JSDiagram.clearArrow();
//		$(":focus.labelEdit").blur();
	})
	.click(function() {
		JSDiagram.closeCtxMenu();
		JSDiagram.callbackFunc('model', '', 'click', 'canvas');
		JSDiagram.dragEvent = null;
		JSDiagram.dragUI = null;
		JSDiagram.closeCtxMenu();
		JSDiagram.clearArrow();
	});
	

	
	var imgObj = $("<img style='display:none;position:absolute;z-index: 100;' id='dragLine' src='" + JSDiagram.LineImgPath + "1up.gif' />").appendTo(JSDiagram.modelCanvas);
	JSDiagram.LineImgObj = document.getElementById("dragLine");
	document.onmousemove = JSDiagram.mousemove
	
	// used to set focus to the document.
	JSDiagram.focusHelper = $('<input type="text" id="dummyField" style="position: absolute; left: -100; top: -100; z-index: -1; width:1px;"/>').appendTo(JSDiagram.modelCanvas);
}

JSDiagram.canvasDragStartEvent;


JSDiagram.closeCtxMenu = function () {
	$('#jqContextMenu').hide();
}

JSDiagram.setDocumentFocus = function () {
	$(JSDiagram.focusHelper).css({left: JSDiagram.getCurPosLeft() + "px", top: JSDiagram.getCurPosTop() + "px"}).focus().blur().css({left: "-100px", top: "-100px"});
}

JSDiagram.getUID = function () {
	var uid = JSDiagram.lastUID + 1;
	JSDiagram.lastUID = uid;
	return uid;
}


JSDiagram.getCurPosLeft = function() {
	if (JSDiagram.curMouseEvent) {
		var left = JSDiagram.nn6 ? JSDiagram.curMouseEvent.clientX : event.clientX;
		left = left + $("#wrapper").scrollLeft() + $("html").offset().left;
		return left;
	}
	else return 0;
}


JSDiagram.getCurPosTop = function() {
	if (JSDiagram.curMouseEvent) {
		var top = JSDiagram.nn6 ? JSDiagram.curMouseEvent.clientY : event.clientY;
		top = top + $("#wrapper").scrollTop() + $("html").offset().top;
		return top;
	}
	else return 0;
}

JSDiagram.getCurPosLeftInState = function(stateUID_p) {
	var left = JSDiagram.getCurPosLeft();
	if (left<=0) return 0;
	var stateObj = JSDiagram.findState(stateUID_p);
	left = left - stateObj.getAbsolutePosLeft();
	return left;
}

JSDiagram.getCurPosTopInState = function(stateUID_p) {
	var top = JSDiagram.getCurPosTop();
	if (top<=0) return 0;
	var stateObj = JSDiagram.findState(stateUID_p);
	top = top - stateObj.getAbsolutePosTop();
	return top;
}


JSDiagram.NewStateOffset = function (offsetTopMin_p, maxCol_p, maxRow_p) {
	this.offsetTopMin = offsetTopMin_p;
	this.maxCol = maxCol_p;
	this.maxRow = maxRow_p;
	this.colCount = 1;
	this.rowCount = 1;
	this.colDelta = 25;
	this.rowDelta = 30; 
	this.offsetLeftMin = 10;
	this.subModelName = null;
				
	// go diagnoally down, shift down to repeat group
	this.nextOffset = function (options_p, parentState_p) {
		if (!options_p.width) {
			options_p.width = 75;
			options_p.height = 50;
		}
	
		if (options_p.left==null || options_p.left < JSDiagram.MinLeft ||
		    options_p.top==null || options_p.top < JSDiagram.MinTop) {
			options_p.left = this.offsetLeftMin + (this.colCount-1) * this.colDelta;
			options_p.top = this.offsetTopMin + (this.rowCount-1) * this.rowDelta;
			if (this.rowCount >= this.maxRow) {
				if (this.colCount >= this.maxCol) {
					this.colCount = 1;
				}
				else this.colCount = this.colCount + 1;
				this.rowCount = 1;
			}
			else this.rowCount =  this.rowCount + 1;
		}
		
		// auto size parent state to ensure this child state is visible in its boundary
		if (parentState_p && !parentState_p.childrenHidden) {
//			if (parentState_p.getWidth() < (options_p.left + options_p.width)) {
//				parentState_p.setWidth(options_p.left + options_p.width);
//			}
//			
//			if (parentState_p.getHeight() < (options_p.top + options_p.height)) {
//				parentState_p.setHeight(options_p.top + options_p.height);
//			}
//			parentState_p.paint();
			parentState_p.checkBoundary(options_p.left + options_p.width, options_p.top + options_p.height);
		}
		
	}
}


JSDiagram.checkNewStateOptions = function (options_p, parentState_p) {
	var parentUID = "scxml";
	if (parentState_p) parentUID = parentState_p.stateUID;
	var offsetCheck = JSDiagram.newStateOffsetList [parentUID];
	if (offsetCheck == null) {
		if (parentUID=="scxml" || parentUID=="") {
			offsetCheck = new JSDiagram.NewStateOffset(35, 5, 5);
		}
		else offsetCheck = new JSDiagram.NewStateOffset(25, 3, 2);
		JSDiagram.newStateOffsetList[parentUID] = offsetCheck;
	}
	offsetCheck.nextOffset(options_p, parentState_p);
}

JSDiagram.State = function (parentUID_p, options_p) {
	this.stateElem;
	this.stateUID;
	this.readonly;
	this.parentState;
	this.left = null;
	this.top = null;
	this.absLeft = null;
	this.absTop = null;
	this.width = null;
	this.height = null;
	this.childrenHidden = false;
	this.subModelName = options_p.subModelName;
	this.resizeMinWidth = JSDiagram.STATE_MIN_WIDTH;
	this.resizeMinHeight = JSDiagram.STATE_MIN_HEIGHT;
	this.stateColor;
	this.isInitial = false;
	this.isFinal = false;

	this.setStateName = function (stateName_p) {
		var labelElem = $(this.stateElem).find(".ctnt .label:first");
		$(labelElem).html(stateName_p);
	}
	
	this.getStateName = function () {
		return $(this.stateElem).find(".ctnt .label:first").text();
	}
	
	this.isBranch = function () {
		if (this.notation && this.notation=="branch") return true;
		else return false;
	}
	
	this.isSwitch = function () {
		if (this.notation && this.notation=="switch") return true;
		else return false;
	}
	
	this.setColor = function (color_p) {
		this.stateColor = color_p;
		if (this.diamondCanvas) {
			if (this.isBranch()) {
				JSDiagram.addDiamond(this);
			}
			else {
				JSDiagram.addOctagon(this);
			}
		}
		else {
			$(this.stateElem).css("background-color", color_p);
		}
	}

	this.setHeadColor = function (color_p) {
		$(this.stateElem).find(".head").css("background-color", color_p);
	}
	
	this.setHeadTitle = function (title_p) {
		$(this.stateElem).find(".head:first").attr("title", title_p);
	}
	
	this.setTextColor = function (color_p) {
		$(this.stateElem).find(".label:first").css("color", color_p);
	}
	
	this.getWidth = function () {
		if (this.width==null) {
			this.width = JSDiagram.getCssPx(this.stateElem, "width");
		}
		return this.width;
	}
	
	this.checkBoundary = function (checkWidth_p, checkHeight_p) {
		var extended = false;
		if (this.getWidth() < checkWidth_p) {
			this.setWidth(checkWidth_p);
			extended = true;
		}

		if (this.getHeight() < checkHeight_p) {
			this.setHeight(checkHeight_p);
			extended = true;
		}
	
		if (extended) {
			this.paint();
		}
		
		if (this.parentState && !this.childrenHidden) {
			this.parentState.paint();
			if (extended) {
				this.parentState.checkBoundary(this.getPosLeft() + checkWidth_p, this.getPosTop() + checkHeight_p);
			}
		}
	}
	
	this.anyAncestorStateChildrenHidden = function() {
		if (this.parentState) {
			if (this.parentState.childrenHidden) return true;
			else return this.parentState.anyAncestorStateChildrenHidden();
		}
		else {
			return false;
		}
	}
	
	this.setWidth = function (width_p) {
		if (width_p==null || width_p <=JSDiagram.STATE_MIN_WIDTH)  return;
		this.width = width_p;
		$(this.stateElem).css("width",this.width);
		this.resizeMinWidth = Math.max(this.width, this.resizeMinWidth);
	}
	
	this.getHeight = function () {
		if (this.height==null) {
			this.height = JSDiagram.getCssPx(this.stateElem, "height");
		}
		return this.height;
	}

	this.setHeight = function (height_p) {
		if (height_p==null || height_p <=JSDiagram.STATE_MIN_HEIGHT)  return;
		this.height = height_p;
		$(this.stateElem).css("height", this.height);
		this.resizeMinHeight = Math.max(this.height, this.resizeMinHeight);
	}
	
	this.getPosLeft = function () {
		if (this.left==null) {
			this.left = JSDiagram.getCssPx(this.stateElem, "left");
		}
		return this.left;
	}
	
	this.getAbsolutePosLeft = function () {
//		var localLeft = JSDiagram.getCssPx(this.stateElem, "left");
		var localLeft = this.getPosLeft();
		if (this.parentState==null || this.parentState==undefined) {
			return localLeft;
		}
		else {
			return localLeft + this.parentState.getAbsolutePosLeft();
		}
	}

	this.getPosTop = function () {
		if (this.top==null) {
			this.top = JSDiagram.getCssPx(this.stateElem, "top");
		}
		return this.top;
	}
	
	this.setPos = function (left_p, top_p) {
		this.top = top_p;
		this.left = left_p;
		$(this.stateElem).css({left: left_p + "px", top: top_p + "px"});
		this.paint();
	}
	
	this.getAbsolutePosTop = function () {
//		var localTop = JSDiagram.getCssPx(this.stateElem, "top");
		var localTop = this.getPosTop();
		if (this.parentState==null || this.parentState==undefined) {
			return localTop;
		}
		else {
			return localTop + this.parentState.getAbsolutePosTop();
		}
	}

	this.setIconStatus = function (iconName_p, enabled_p) {
		if (enabled_p) {
			$(this.stateElem).find("." + iconName_p + ":first").show();
		}
		else {
			$(this.stateElem).find("." + iconName_p + ":first").hide();
		}
	}
	
	this.isIconEnabled = function (iconName_p) {
		$(this.stateElem).find("." + iconName_p + ":first").is(":visible");
	}

	
	this.addClass = function(class_p) {
		$(this.stateElem).addClass(class_p);
	}
		
	this.removeClass = function(class_p) {
		$(this.stateElem).removeClass(class_p);
	}
	
	this.addClassIcnR = function(icnName_p, class_p) {
		var elem = $(this.stateElem).find("." + icnName_p + ":first").addClass(class_p);
	}

	this.removeClassIcnR = function(icnName_p, class_p) {
		var elem = $(this.stateElem).find("." + icnName_p + ":first").removeClass(class_p);
	}

	this.toggleIconStatus = function (iconName_p) {
		if ($(this.stateElem).find("." + iconName_p + ":first").is (":visible")) {
			$(this.stateElem).find("." + iconName_p + ":first").hide();
		}
		else {
			$(this.stateElem).find("." + iconName_p + ":first").show();
		}
	}

	this.toggleBreak = function () {
		$(this.stateElem).find(".break:first").toggleClass("enabled");
	}

	this.isBreakEnabled = function() {
		return ($(this.stateElem).find(".break:first").hasClass("enabled"));
	}
	
	this.setBreak = function (break_p) {
		if (break_p) {
			if (this.isBreakEnabled()) return;
			$(this.stateElem).find(".break:first").addClass("enabled");
		}
		else {
			$(this.stateElem).find(".break:first").removeClass("enabled");
		}
	}
	
	this.isMarked = function() {
		return ($(this.stateElem).hasClass("marked"));
	}

	this.setMarked = function(marked_p) {
		$(this.stateElem).jTagging(marked_p, {class: "stateMark", addTag: JSDiagram.markMode});
	}

	this.setHeaderLabel = function (labelText_p) {
		$(this.stateElem).find(".head:first .headerLabel").html(labelText_p);
	}

	this.setStateFlags = function (flags_p) {
		$(this.stateElem).find(".stateFlags:first").html(flags_p);
	}
	
	this.checkOverflow = function () {
		if (this.childrenHidden || this.readonly) return;
		var newWidth = JSDiagram.STATE_MIN_WIDTH;
		var newHeight = JSDiagram.STATE_MIN_HEIGHT;
		for (var c in JSDiagram.stateList) {
			var childState = JSDiagram.stateList[c];
			if (childState==null || childState.parentState==null || childState.parentState.stateUID != this.stateUID) {
			    continue;
			}
			newWidth = Math.max (newWidth, childState.getPosLeft() + childState.getWidth());
			newHeight = Math.max (newHeight, childState.getPosTop() + childState.getHeight());
		}
		
		this.resizeMinWidth = newWidth;
		this.resizeMinHeight = newHeight;
	}
	
	this.hideChildren = function () {
		this.childrenHidden = true;
//		$(this.stateElem).find(".headerLabel:first").hide();
		$(this.stateElem).find(".head").attr("title", $(this.stateElem).find(".headerLabel:first").text());
		for (var i in JSDiagram.stateList) {
			var state = JSDiagram.stateList[i];
			if (state==undefined || state==null) continue;
			if (state.parentState == this ) {
				state.hide();
			}
		}
		this.resizeMinWidth = JSDiagram.STATE_MIN_WIDTH;
		this.resizeMinHeight = JSDiagram.STATE_MIN_HEIGHT;
	}
	
	this.showChildren = function () {
		this.childrenHidden = false;
		this.checkOverflow();
		if (this.getWidth() < this.resizeMinWidth) {
			this.setWidth(this.resizeMinWidth);
		}
		if (this.getHeight() < this.resizeMinHeight) {
			this.setHeight(this.resizeMinHeight);
		}
		$(this.stateElem).find(".headerLabel:first").show();
		for (var i in JSDiagram.stateList) {
			var state = JSDiagram.stateList[i];
			if (state==undefined || state==null) continue;
			if (state.parentState == this ) {
				state.show();
			}
		}
		this.paint();
	}
	
	this.updateInitFinalSymbols = function () {
		if ($(this.stateElem).is(":visible")) {
			if (this.initSym!=null) $(this.initSym).show();
			if (this.finalSym!=null) $(this.finalSym).show();
			if (this.isInitial) {
				if (this.initSym==null) {
					var htmlCode = "<img class='initSym' id='" + this.stateUID + "_init' src='img/initial.png'/>";
					this.initSym = $(htmlCode).appendTo(this.stateElem.parent());
				}
				$(this.initSym).css({left: (this.getPosLeft()+10)+"px", top: (this.getPosTop() - 26) + "px"});
			}
			else if (this.initSym) {
				$(this.initSym).remove();
				this.initSym = null;
			}
			
			if (this.isFinal) {
				if (this.finalSym==null) {
					var htmlCode = "<img class='finalSym' id='" + this.stateUID + "_final' src='img/final.png'/>";
					this.finalSym = $(htmlCode).appendTo(this.stateElem.parent());
				}
				$(this.finalSym).css({left: (this.getPosLeft()+this.getWidth() - 15)+"px", top: (this.getPosTop() + this.getHeight() + 2) + "px"});
			}
			else if (this.finalSym) {
				$(this.finalSym).remove();
				this.finalSym = null;
			}
		}
		else {
			if (this.initSym!=null) $(this.initSym).hide();
			if (this.finalSym!=null) $(this.finalSym).hide();
		}
	}

	this.init = function (parentUID_p, options_p) {
		if (options_p==null) options_p = {};
		this.childrenHidden = options_p.childrenHidden;
		this.subModelName = options_p.subModelName;
		
		var parentElem = $("#" + parentUID_p);
		this.parentState = JSDiagram.findState(parentUID_p);
		
		if (options_p.uid) {
			if (parseInt(options_p.uid) > JSDiagram.lastUID) JSDiagram.lastUID = parseInt(options_p.uid);
		}
		else {
			options_p.uid = JSDiagram.getUID();
			options_p.stateName = "state_" + options_p.uid;
		}
		this.stateUID = options_p.uid;

		this.notation = options_p.notation;
	
		var stateClass = "state";
		var resizable = true;
		var allowOutTrans = true;
		var allowInTrans = true;
		this.readonly = options_p.readonly;
		if (this.readonly) {
			stateClass += " readonly";
		}
		else {
			stateClass += " dropState";
		}

		this.isInitial = options_p.isInitial;
		this.isFinal = options_p.isFinal;

		if (this.notation) {
			if (this.notation=="branch") {
				stateClass = "branch " + stateClass;
			}
			else if (this.notation=="switch") {
				stateClass = "switch " + stateClass;
			}
		}	
				
		if (options_p.color) {
			this.stateColor = options_p.color;
		}
		
		JSDiagram.checkNewStateOptions (options_p, this.parentState);
		
		var htmlCode = "<div id='" + options_p.uid + "' class='" + stateClass + "' " 
				+ "style='left:" + options_p.left + "px; top:" + options_p.top + "px; height:" + options_p.height + "px; width:" + options_p.width + "px;'>"
				+ "</div>";
		this.stateElem = $(htmlCode).appendTo("#"+parentUID_p);
				
		var curState = this; // for use in event handlers
		
		if (options_p.notation && (options_p.notation=="branch" || options_p.notation=="switch")) {
			if (options_p.notation=="branch") {
				JSDiagram.addDiamond(curState);
			}
			else {
				JSDiagram.addOctagon(curState);
			}
			htmlCode = "<div class='head'>"
					+ "<center class='icn break' name='break' style='background:none; border:none;'><a href='javascript:void(0);'>&#149;</a></center>"
					+ "</div>"
					+ "<div class='ctnt'><center><span class='label'>" + options_p.stateName + "</span></center></div>";
			$(htmlCode).appendTo(this.stateElem);
		}
		else {
			htmlCode = "<div class='head' style='overflow:hidden; white-space:pre;'>"
					+ "<div class='icn break' name='break'><a href='javascript:void(0);'>&#149;</a></div>"
					+ "<span class='stateFlags'></span>"
					+ "<span class='headerLabel'></span>"
					+ "<div class='icnRDiv'>"
					+ "<div class='icnR liteUp' name='liteUp' title='Highlight surrounding states and transitions'><img src='packages/JSDiagram/light.gif'/></div>"
					+ "<div class='icnR comment' name='comment'><img src='packages/JSDiagram/notepad.png'/></div>"
					+ "</div>"
					+ "</div>"
					+ "<div class='ctnt'><center><span class='label'>" + options_p.stateName + "</span></center></div>";
//					+ "<div class='ctnt'><center><span class='label'>" + options_p.stateName + "</span><input class='labelEdit'></input></center></div>";
			$(htmlCode).appendTo(this.stateElem);
		}
							
		if (this.parentState && this.parentState.childrenHidden) {
			$(this.stateElem).hide();
		}
			
		if (options_p.hasComment) {
			this.addClassIcnR("comment", "exists");
		}
		
		if (options_p.stateFlags && options_p.stateFlags!="") {
			this.setStateFlags (options_p.stateFlags);
		}
		
		$(this.stateElem).find(".break:first").click(function(e) {
				e.stopPropagation();
				JSDiagram.callbackFunc('state', curState.stateUID, 'toggle', $(this).attr("name"), $(this).hasClass("enabled"));
			});
			
		$(this.stateElem).find(".icnR").click(function(e) {
				e.stopPropagation();
				JSDiagram.callbackFunc('state', curState.stateUID, 'click', $(this).attr("name"), '');
			});
		
		$(this.stateElem).contextMenu(JSDiagram.stateCtxMenuBindings.menuID, {
				bindings: JSDiagram.stateCtxMenuBindings,
				onContextMenu: function (e) {
					return true;
				},
		    	'onShowMenu': function(e, menu) {
		    		if (JSDiagram.stateCtxMenuBindings.onShowMenu) {
		    			JSDiagram.stateCtxMenuBindings.onShowMenu (e, menu);
		    		}
		    		return menu;
		    	},
			  	'menuStyle': stateCtxMenuBindings.menuStyle,
	    		'listingStyle': stateCtxMenuBindings.itemStyle,
	    		'itemHoverStyle': stateCtxMenuBindings.itemHoverStyle
			});
			
		$(this.stateElem).click(function(e) {
			JSDiagram.closeCtxMenu();
//			if ($(this).hasClass("readonly")) return;
			JSDiagram.setDocumentFocus();
			if (JSDiagram.dragUI && JSDiagram.dragUI.stateUID && !this.readonly) {
				var fromUID = JSDiagram.dragUI.stateUID;
				var toUID = $(e.currentTarget).attr("id");
				JSDiagram.callbackFunc('state', fromUID, 'new', 'trans', {destUID: toUID});
				JSDiagram.dragEvent = null;
				JSDiagram.dragUI = null;
			}
			
			else if ($(this).hasClass("marked")) {
				JSDiagram.findState(curState.stateUID).setMarked(false);
				JSDiagram.callbackFunc('state', curState.stateUID, 'unmarked', '', '');
			}
			else {
				if (!e.ctrlKey && !e.shiftKey && !e.altKey) JSDiagram.clearMarks();
				JSDiagram.findState(curState.stateUID).setMarked(true);
				JSDiagram.callbackFunc('state', curState.stateUID, 'marked', '', '');
			}
			JSDiagram.clearArrow();
			e.stopPropagation();
		});
		
			
		if (this.readonly) {
//			$(this.stateElem).attr("title", "SubModel state readonly, can not be changed, moved or deleted.");
		}
		else {
			if (resizable) {
				$(this.stateElem).resizable({handles: "e,w,s,n,se", autoHide: true}).resizable ({
					start: function(event,ui) {
						curState.checkOverflow();
						$(curState.stateElem).resizable("option", "minWidth", curState.resizeMinWidth);
						$(curState.stateElem).resizable("option", "minHeight", curState.resizeMinHeight);
					},
					resize: function(event,ui) {
						JSDiagram.dragDivStartX = -1;
						JSDiagram.dragTally = JSDiagram.dragTally + 1;
						if (JSDiagram.dragTally % JSDiagram.dragInterval==0) return;
						curState.paint();
					},
					stop: function(event,ui) {
						curState.paint();
						JSDiagram.callbackFunc('state', curState.stateUID, 'resize', {width: curState.getWidth(), height: curState.getHeight()}, '');
					},
					alsoResize: "." + curState.stateUID
				});
			}
							
			$(this.stateElem)
				.draggable().draggable({
					start: function(event, ui) {
						JSDiagram.dragEvent = event;
						JSDiagram.dragUI = ui;
						JSDiagram.multiDragStateList = new Array();
						JSDiagram.dragUID = $(ui.helper).attr("id");
						JSDiagram.dragTally = 0;
						
						if ($(ui.helper).hasClass("marked")) {
							$(".state.marked").each(function() {
								var aUID = $(this).attr("id");
								if (JSDiagram.dragUID==aUID) return;
								var pState = JSDiagram.findState(aUID);
								if (pState!=null && pState.parentState!=null) {
									pState = JSDiagram.findState(pState.parentState.stateUID);
									if ($(pState.stateElem).hasClass("marked")) return;
								}
								JSDiagram.multiDragStateList.push(JSDiagram.findState(aUID));
							});
						}
					},
					drag: function(event, ui) {
						var deltaX = ui.position.left - JSDiagram.dragUI.position.left;
						var deltaY = ui.position.top - JSDiagram.dragUI.position.top;
						if (deltaX<0 && curState.getPosLeft() <= JSDiagram.MinLeft ||
						    deltaY<0 && curState.getPosTop() <= JSDiagram.MinTop) {
						 	return false;
						}
						
						JSDiagram.dragTally = JSDiagram.dragTally + 1;
						if (JSDiagram.dragTally % JSDiagram.dragInterval==0) return;
						 
						curState.paint();
						for (var dI in JSDiagram.multiDragStateList) {
							if (!JSDiagram.multiDragStateList[dI].move(deltaX, deltaY)) return false;
						}
						JSDiagram.dragEvent = event;
						JSDiagram.dragUI = ui;
					},
					stop: function(event, ui) {
						// maybe updates the server with new position?
						curState.paint();
						JSDiagram.callbackFunc ('state', curState.stateUID, 'move', 'position', {left: curState.getPosLeft(), top: curState.getPosTop()}, '');
						
						for (var dI in JSDiagram.multiDragStateList) {
							var aStateObj = JSDiagram.multiDragStateList[dI];
							JSDiagram.callbackFunc ('state', aStateObj.stateUID, 'move', 'position', {left: aStateObj.getPosLeft(), top: aStateObj.getPosTop()}, '');
						}
						JSDiagram.clearDrag();
					},
					helper: "original",
					zIndex: JSDiagram.dragZindex,
					containment: "parent",
					scroll: true
				});
				
			$(this.stateElem).droppable().droppable({
					drop: function(event, ui) {
						var dragUID = $(ui.helper).attr("id");
						var stateObj = JSDiagram.findState(dragUID);
						if (stateObj) {
							JSDiagram.moveState(dragUID, curState.stateUID);
							JSDiagram.callbackFunc('state', dragUID, 'move', 'parent', curState.stateUID);
						}
						else {
							dragUID = $(ui.helper).attr("uid");
							var isArrow = $(ui.helper).hasClass("transEnd");
							var transObj = JSDiagram.findTrans(dragUID);
							if (isArrow) {
								if (curState.stateUID==transObj.destUID) {
									curState.changeTransRoute(dragUID, "end", ui.position, ui.offset);
								}
								else {
									transObj.moveDestState(curState.stateUID);
									JSDiagram.callbackFunc('trans', dragUID, 'move', 'dest', curState.stateUID);
								}
							}
							else {
								if (curState.stateUID==transObj.srcUID) {
									curState.changeTransRoute(dragUID, "start", ui.position, ui.offset);
								}
								else {
									transObj.moveSrcState(curState.stateUID);
									JSDiagram.callbackFunc('trans', dragUID, 'move', 'src', curState.stateUID);
								}
							}
						}
						
						// remove dropHover classes, droppable bug in handling dropping on nested element not clearing dropHover class on all ancestor states
						$(".dropHover").removeClass("dropHover");
					},
					accept: function(dragElem) {
						// only accept state or trans starter
						var isTransSource = $(dragElem).hasClass('transStart');
						var isTransTarget = $(dragElem).hasClass('transEnd');
						if (isTransSource && !allowOutTrans) return false;
						if (isTransTarget && !allowInTrans) return false;
						
						var isTransEnd = isTransSource || isTransTarget;
						if (isTransEnd) {
							// trans ends can not be dropped off on the same state
							var transUID = $(dragElem).attr("uid");
							var transObj = JSDiagram.findTrans(transUID);
							if ($(dragElem).hasClass('transStart')) {
								if (transObj.srcUID==curState.stateUID) return false;
								else return true;
							}
							else {
								if (transObj.destUID==curState.stateUID) return false;
								else return true;
							}
//							return true; // ok to drop on same state for changing trans routing. not quite ready yet.
						}
						
						// do not accept any states, bypass rest of the codes, 1/12/2012
						return false;
/*
 2/15/2016 to avoid javascript error logged to web console						
						if (!$(dragElem).hasClass('dropState')) return false;
		
						
						// not accept children states
						var aParent;
						aParent = $(dragElem).parents("#" + options_p.uid);
						if (aParent.length>0) return false;
						// this element must be either a sibling of dragElem or any of its ancestors is a sibling of dragElem
						var parentID = $(dragElem).parent().attr("id");
						aParent = $(this).parents("#" + parentID);
						if (aParent.length>0) return true;
						
						return false;
*/						
					},
		//			activeClass: 'dropActive',
					zIndex: JSDiagram.dragZindex,
					hoverClass: 'dropHover'
				});
				
			$(this.stateElem).mousedown (function(e) {
					if (e.which==3 && allowOutTrans) {
						JSDiagram.rightMouseDragStarted = true;
					}
					else {
						JSDiagram.rightMouseDragStarted = false;
					}
				})
			   	.rightMouseDown(function(e) {
			   		if (!curState.isFinal) {
						JSDiagram.dragEvent = e;
			    		JSDiagram.dragUI = e.target;
						e.stopPropagation();
					}
				})
				.rightMouseUp(function(e) {
					JSDiagram.curMouseEvent = e;
					if (!JSDiagram.dragEvent || (Math.abs(e.clientX - JSDiagram.dragEvent.clientX) < 10 && Math.abs(e.clientY - JSDiagram.dragEvent.clientY) < 10)) {
						JSDiagram.dragEvent = null;
						JSDiagram.dragUI = null;
						return;
					}
		
					// if dragging to the ancestoral state, then create a new state and new trans. THIS IS NOT POSSIBLE as children states can only be dragged around within its parent state.
					if ($(JSDiagram.dragEvent.currentTarget).parents("#" + $(e.currentTarget).attr("id")).length>0) {
						var parentUID = $(e.currentTarget).attr("id");
						var fromUID = $(JSDiagram.dragEvent.currentTarget).attr("id");
						parentStateObj = JSDiagram.findState(parentUID);
						var newStateLeft = JSDiagram.getCurPosLeftInState(parentUID); // JSDiagram.getCurPosLeft() - parentStateObj.getAbsolutePosLeft();
						var newStateTop = JSDiagram.getCurPosTopInState(parentUID); // JSDiagram.getCurPosTop() - parentStateObj.getAbsolutePosTop();
						JSDiagram.callbackFunc('state', parentUID, 'new', 'state/trans', {left: newStateLeft, top: newStateTop, srcUID: fromUID});
					}
					else if ($(e.currentTarget).parents("#" + $(JSDiagram.dragEvent.currentTarget).attr("id")).length<=0) {
						var fromUID = $(JSDiagram.dragEvent.currentTarget).attr("id");
						var toUID = $(e.currentTarget).attr("id");
//						if (!curState.isInitial) {
							JSDiagram.callbackFunc('state', fromUID, 'new', 'trans', {destUID: toUID});
//						}
					}
		
					JSDiagram.dragEvent = null;
		    		JSDiagram.dragUI = null;
					JSDiagram.clearArrow();
					JSDiagram.closeCtxMenu();
					e.stopPropagation();
				});
			
			$(this.stateElem).find(".head:first").dblclick(function(e) {
					JSDiagram.callbackFunc('state', curState.stateUID, 'dblclick', 'head', '');
					e.stopPropagation();
				});
			if (this.stateColor) {
				this.setColor(this.stateColor);
			}
//			$(this.stateElem).css("background-color", options_p.color);
			$(this.stateElem).find(".label:first").css("color", options_p.textColor)
				.dblclick(function(e) {
					e.stopPropagation();
					JSDiagram.callbackFunc('state', curState.stateUID, 'edit', 'stateName', '');
				});
		}
	}

	
	this.init(parentUID_p, options_p);
	
	this.savePosition = function() {
		JSDiagram.callbackFunc ('state', this.stateUID, 'move', 'position', {left: this.getPosLeft(), top: this.getPosTop()}, '');
	}
	
	
	this.changeTransRoute = function (transUID_p, type_p, position_p, offset_p) {
		var transObj = JSDiagram.findTrans(transUID_p);
		if (transObj==null) return;
		var left = this.getPosLeft();
		var top = this.getPosTop();
		var bottom = top + this.getHeight();
		var right = left + this.getWidth();
		var minAbs = 999999;
		left = Math.abs(offset_p.left - left);
		minAbs = Math.min(left, minAbs);
		right = Math.abs(offset_p.left - right);
		minAbs = Math.min(right, minAbs);
		top = Math.abs(offset_p.top - top);
		minAbs = Math.min(top, minAbs);
		bottom = Math.abs(offset_p.top - bottom);
		minAbs = Math.min(bottom, minAbs);
		
		if (minAbs==left) {
			if (type_p=="start") {
				transObj.startOrient = JSDiagram.LEFT;
				transObj.endOrient = JSDiagram.AUTO;
			}
			else {
				transObj.startOrient = JSDiagram.AUTO;
				transObj.endOrient = JSDiagram.RIGHT;
			}
		}
		else if (minAbs==right) {
			if (type_p=="start") {
				transObj.startOrient = JSDiagram.RIGHT;
				transObj.endOrient = JSDiagram.AUTO;
			}
			else {
				transObj.startOrient = JSDiagram.AUTO;
				transObj.endOrient = JSDiagram.LEFT;
			}
		}
		else if (minAbs==top) {
			if (type_p=="start") {
				transObj.startOrient = JSDiagram.UP;
				transObj.endOrient = JSDiagram.AUTO;
			}
			else {
				transObj.startOrient = JSDiagram.AUTO;
				transObj.endOrient = JSDiagram.DOWN;
			}
		}
		else {
			if (type_p=="start") {
				transObj.startOrient = JSDiagram.DOWN;
				transObj.endOrient = JSDiagram.AUTO;
			}
			else {
				transObj.startOrient = JSDiagram.AUTO;
				transObj.endOrient = JSDiagram.UP;
			}
		}
		this.paint();
	}
	
	
	this.paint = function () {
		var trans;
		this.width = null;
		this.height = null;
		this.left = null;
		this.top = null;
		
		if (this.getWidth() <= JSDiagram.STATE_MIN_WIDTH) {
			$(this.stateElem).find(".ctnt:first").hide();
		}
		else {
			$(this.stateElem).find(".ctnt:first").show();
		}
		
		for (i in JSDiagram.transList) {
			trans = JSDiagram.transList[i];
			if (trans==undefined || trans==null) continue;
			if (trans.srcUID==this.stateUID || trans.destUID==this.stateUID) {
				trans.paint();
			}
		}
		
		this.updateInitFinalSymbols();
		
		$(this.stateElem).find(".state").each(function() {
			JSDiagram.findState ($(this).attr("id")).paint();
		});
	}

	this.deleteObj = function () {
		// first delete trans 
		for (var i in JSDiagram.transList) {
			var trans = JSDiagram.transList[i];
			if (trans==undefined || trans==null) continue;
			if (trans.srcUID==this.stateUID || trans.destUID==this.stateUID) {
				trans.deleteObj();
			}
		}
		
		if (this.initSym) $(this.initSym).remove();
		if (this.finalSym) $(this.finalSym).remove();

		// delete child states
		var thisStateIdx = -1;
		for (var j in JSDiagram.stateList) {
			var state = JSDiagram.stateList[j];
			if (state==null) continue;
			if (state.stateUID==this.stateUID) {
				thisStateIdx = j;
			}
			else if (state.parentState && state.parentState.stateUID==this.stateUID) {
				state.deleteObj();
			}
		}

		// remove this state info
		JSDiagram.stateList[thisStateIdx] = null;
		$(this.stateElem).remove(); 
	}

	this.show = function () {
		$(this.stateElem).show();
		this.updateInitFinalSymbols();
		for (var i in JSDiagram.transList) {
			var trans = JSDiagram.transList[i];
			if (trans==undefined || trans==null) continue;
			if (trans.srcUID==this.stateUID || trans.destUID==this.stateUID) {
				trans.show();
			}
		}
	}

	this.hide = function () {
		$(this.stateElem).hide();
		this.updateInitFinalSymbols();
		for (var i in JSDiagram.transList) {
			var trans = JSDiagram.transList[i];
			if (trans==undefined || trans==null) continue;
			if (trans.srcUID==this.stateUID || trans.destUID==this.stateUID) {
				trans.hide();
			}
		}
	}
			
	this.move = function (deltaX_p, deltaY_p) {
		var x = this.getPosLeft(); //JSDiagram.getCssPx(this.stateElem, 'left');
		var y = this.getPosTop(); //JSDiagram.getCssPx(this.stateElem, 'top');
		x += deltaX_p;
		y += deltaY_p;
		this.left = x;
		this.top = y;
		if (x<=JSDiagram.MinLeft || y<=JSDiagram.MinTop) return false;
		this.stateElem.css("left", x + "px").css("top", y + "px");
		
		this.paint();
		return true;
	}
	
}

JSDiagram.addState = function (parentUID_p, options_p) {
	var state = new JSDiagram.State(parentUID_p, options_p);
	JSDiagram.stateList.push(state);
	state.paint();
	return state;
}


JSDiagram.moveState = function (stateUID_p, newParentUID_p, offsetPx_p) {
	var stateObj = JSDiagram.findState(stateUID_p);
	if (newParentUID_p) {
		var newParentStateObj = JSDiagram.findState(newParentUID_p);
		newParentUID_p = "#" + newParentUID_p;
		stateObj.parentState = newParentStateObj;
	}
	else {
		newParentUID_p = "body";
		stateObj.parentState = null;
	}

	var newParent = $(newParentUID_p);
	if (!offsetPx_p) offsetPx_p = Math.random()* 100;
	var dropLeft = offsetPx_p; // JSDiagram.curMouseEvent.clientX + offsetPx_p - JSDiagram.getCssPx(newParent, "left");
	var dropTop = offsetPx_p; // JSDiagram.curMouseEvent.clientY + offsetPx_p - JSDiagram.getCssPx(newParent, "top");

	$("#" + stateUID_p).appendTo(newParentUID_p).draggable().draggable("option","containment", "parent")
		.draggable({start: dragStartFunc})
		.css({left: dropLeft, top: dropTop});
	
	stateObj.paint();
}


JSDiagram.addTrans = function (options_p) {
	var isNew = true;
	if (options_p.uid) isNew = false;
	
	var trans = new JSDiagram.Trans (options_p);
	JSDiagram.transList.push (trans);
	trans.paint();
	
	if (isNew) {
		JSDiagram.callbackFunc('state', trans.srcUID, 'new', 'trans', trans.destUID);
	}
	return options_p.uid;
}

JSDiagram.Trans = function (options_p) {
	this.transUID;
	this.labelElem;
	this.arrowElem;
	this.breakElem;
	this.segElemList = new Array();

	this.srcUID;
	this.destUID;
	this.srcState;
	this.destState;
	
	this.strategyIdx;
	this.lastPath;

	this.labelOffsetLeft;
	this.labelOffsetTop;

	this.startFract;
	this.midFract;
	this.endFract;
	this.midOffset;

	this.startOrient;
	this.endOrient;
	this.startOrientPref = 0;
	this.endOrientPref = 0;

	this.elemColor;
	this.readonly;
	
	this.labelWidth;
	this.labelHeight;
	
	this.beforeMoveLabelLeft;
	this.beforeMoveLabelTop;

	this.moveSrcState = function (newSrcUID_p) {
		this.srcUID = newSrcUID_p;
		this.srcState = JSDiagram.findState(this.srcUID);
		this.startOrient = JSDiagram.AUTO;
		this.endOrient = JSDiagram.AUTO;
		this.paint();
	}

	this.moveDestState = function (newDestUID_p) {
		this.destUID = newDestUID_p;
		this.destState = JSDiagram.findState(this.destUID);
		this.startOrient = JSDiagram.AUTO;
		this.endOrient = JSDiagram.AUTO;
		this.paint();
	}
	
	this.getWidth = function () {
		return JSDiagram.getCssPx(this.labelElem, "width");
	}
	
	this.getHeight = function () {
		return JSDiagram.getCssPx(this.labelElem, "height");
	}
	
	
	// methods	
	this.init = function (options_p) {
		if (options_p==null) options_p = {};
		if (options_p.uid) {
			if (parseInt(options_p.uid) > JSDiagram.lastUID) JSDiagram.lastUID = parseInt(options_p.uid);
		}
		else {
			options_p.uid = JSDiagram.getUID();
		}
//		if (!options_p.transName || options_p.transName=="") {
//			options_p.transName = "trans_" + options_p.uid;
//		}

		this.transUID = options_p.uid;
		this.srcUID = options_p.srcUID;
		this.destUID = options_p.destUID;
		this.srcState = JSDiagram.findState(this.srcUID);
		this.destState = JSDiagram.findState(this.destUID);
		this.readonly = options_p.readonly;
		var readonlyClass = "";
		if (this.readonly) readonlyClass = " readonly";
		
		var curTrans = this;
	
		var htmlCode = "<div id='" + options_p.uid + "' class='trans trans_" + options_p.uid + readonlyClass + "'>"
					 + "<span class='label transName'>" + options_p.transName + "</span>"
//					 + "<input class='labelEdit'></input> "
					 + "<span class='transFlags'></span>"
					 + "<span class='transLink comment' name='comment'>"
					 + "<img src='packages/JSDiagram/notepad.png'/>"
					 + "</span></div>";
		this.labelElem = $(htmlCode).appendTo(JSDiagram.modelCanvas);

		if (options_p.transName=="") {
			this.setTransNameVisibility(false);
		}
		
		if (!options_p.labelOffsetLeft || options_p.labelOffsetLeft=="") {
			this.labelOffsetLeft = 0;
		}
		else this.labelOffsetLeft = options_p.labelOffsetLeft;
		
		if (!options_p.labelOffsetTop || options_p.labelOffsetTop=="") {
			this.labelOffsetTop = 0;
		}
		else this.labelOffsetTop = options_p.labelOffsetTop;
		
		if (!options_p.startFract) {
			this.startFract = Math.min(0.8, Math.max(0.2, Math.random()));
		}
		else this.startFract = options_p.startFract;
		
		if (!options_p.midFract) {
			this.midFract = Math.min(0.8, Math.max(0.2, Math.random()));
		}
		else this.midFract = options_p.midFract;
		
		if (!options_p.endFract) {
			this.endFract = Math.min(0.8, Math.max(0.2, Math.random()));
		}
		else this.endFract = options_p.endFract;
		
		if (!options_p.midOffset) {
			this.midOffset = JSDiagram.InitMidOffset;
		}
		else this.midOffset = options_p.midOffset;

		if (!options_p.startOrient) {
			this.startOrient = JSDiagram.AUTO;
		}
		else this.startOrient = options_p.startOrient;
		
		if (!options_p.endOrient) {
			this.endOrient = JSDiagram.AUTO;
		}
		else this.endOrient = options_p.endOrient;

		if (options_p.color==undefined || options_p.color.trim() == "") {
			options_p.color = JSDiagram.defaultTransColor;
		}

		if (options_p.width>25) {
			$(this.labelElem).css("width", options_p.width);
		}
		else {
			$(this.labelElem).css("width", 100);
		}

		if (options_p.height>10) {
			$(this.labelElem).css("height", options_p.height);
		}
		else {
			$(this.labelElem).css("height", 12);
		}

		this.elemColor = options_p.color;
		$(this.labelElem).css("color", this.elemColor);

		if (options_p.transFlags && options_p.transFlags!="") {
			this.setTransFlags (options_p.transFlags);
		}
		
		if (options_p.hasComment) {
			this.addClassTag("comment", "exists");
		}
		
		this.labelWidth = JSDiagram.getCssPx(this.labelElem, "width");
		this.labelHeight = JSDiagram.getCssPx(this.labelElem, "height");
		
		this.segElemList[0] = this.createSegment(0);
		this.segElemList[1] = this.createSegment(1);
		this.segElemList[2] = this.createSegment(2);
		this.segElemList[3] = this.createSegment(3);

		$(this.labelElem).find(".transLink").click(function(e) {
				JSDiagram.callbackFunc ('trans', curTrans.transUID, 'click', $(this).attr("name"), '');
			});

		// add arrow
		this.breakElem = $("<div class='break transStart' style='width:9px;height:9px;border-radius:5px;' uid='" + this.transUID + "'></div>").appendTo(this.segElemList[0]);
		this.arrowElem = $("<img class='arrow transEnd' style='width:9px;height:9px;' src='packages/JSDiagram/arrow.gif' uid='" + this.transUID + "'/>").appendTo(this.segElemList[3]);
		$(this.arrowElem).css("background-color", options_p.color);
		
		$(this.labelElem).contextMenu(JSDiagram.transCtxMenuBindings.menuID, {
				bindings: JSDiagram.transCtxMenuBindings,
				onContextMenu: function (e) {
					JSDiagram.dragEvent = null;
		    		JSDiagram.dragUI = null;
					return true;
				},
		    	'onShowMenu': function(e, menu) {
		    		if (JSDiagram.transCtxMenuBindings.onShowMenu) {
		    			JSDiagram.transCtxMenuBindings.onShowMenu (e, menu);
		    		}
		    		return menu;
		    	},
			  	'menuStyle': JSDiagram.transCtxMenuBindings.menuStyle,
	    		'listingStyle': JSDiagram.transCtxMenuBindings.itemStyle,
	    		'itemHoverStyle': JSDiagram.transCtxMenuBindings.itemHoverStyle
			});

		$(this.labelElem).find(".transName")
			.hover(function() {
				curTrans.setColor2(JSDiagram.hoverColor);
			}, function () {
				curTrans.restoreColor();
			});
		
		if (this.srcState.parentState) {
			 if (this.srcState.anyAncestorStateChildrenHidden()) {
				this.hide();
			}
		}

		$(this.labelElem)
			.click(function(e) {
				JSDiagram.setDocumentFocus();
				if ($(this).hasClass("marked")) {
					curTrans.setMarked(false); 
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'unmarked', '', '');
				}
				else {
					if (!e.ctrlKey && !e.shiftKey && !e.altKey) JSDiagram.clearMarks();
					curTrans.setMarked(true); 
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'marked', '', '');
				}
				e.stopPropagation();
			});
		
		// setup ctxMenu and drag drop events		
		if (this.readonly) {
			$(this.breakElem).click(function(e) {
					JSDiagram.dragEvent = null;
		    		JSDiagram.dragUI = null;
					e.stopPropagation();
					JSDiagram.callbackFunc ('trans', $(this).attr("uid"), 'toggle', 'break', $(this).hasClass("enabled"));
				});
			$(this.breakElem, this.arrowElem).draggable().draggable({
				revert: "invalid", 
				zIndex: JSDiagram.dragZindex,
				start: function(event, ui) {
					JSDiagram.dragEvent = null;
		    		JSDiagram.dragUI = null;
		    		return false;
		    	},
		    	stop: function(event, ui) {
					JSDiagram.clearDrag();
		    	}
			});
			return;
		}

		$(this.labelElem).resizable({
				resize: function(event,ui) {
					// starting the resize
					JSDiagram.dragDivStartX = -1;
				},
				stop: function(event,ui) {
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'resize', {width: curTrans.getWidth(), height: curTrans.getHeight()}, '');
				},
				handles: "all",
				minWidth: 50,
				minHeight: 15
			})
			.hover(
				function() {
					$(this).css("border", "1px solid #AAAAAA");
				}, 
				function() {
					$(this).css("border", "none");
				}
			);
		
		$(this.labelElem).draggable()
			.draggable({
				start: function(event, ui) {
					curTrans.beforeMoveLabelLeft = JSDiagram.getCssPx(ui.helper, "left");
					curTrans.beforeMoveLabelTop = JSDiagram.getCssPx(ui.helper, "top");
					JSDiagram.dragUI = ui;
				},
				drag: function(event, ui) {
	//				JSDiagram.paintTrans(event, ui);
	// update label position
	
				},
				stop: function(event, ui) {
					// maybe updates the server with new position?
					curTrans.labelOffsetLeft += JSDiagram.getCssPx(ui.helper, "left") - curTrans.beforeMoveLabelLeft;
					curTrans.labelOffsetTop += JSDiagram.getCssPx(ui.helper, "top") - curTrans.beforeMoveLabelTop;
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'move', 'label', 
						{ 	labelOffsetLeft: curTrans.labelOffsetLeft, 
							labelOffsetTop: curTrans.labelOffsetTop
						});
					JSDiagram.clearDrag();
				},
				helper: "original",
				zIndex: JSDiagram.dragZindex,
				addClasses: false
			});
		$(this.labelElem).find(".transName")
			.dblclick(function(e) {
				JSDiagram.callbackFunc('trans', curTrans.transUID, 'edit', 'transName', '');
				e.stopPropagation();
			});


		$(this.breakElem).mousedown(function(e) {
				JSDiagram.dragEvent = e;
	    		JSDiagram.dragUI = null;
			})
			.click(function(e) {
				JSDiagram.dragEvent = null;
	    		JSDiagram.dragUI = null;
				if (JSDiagram.dragEvent && (Math.abs(e.clientX-JSDiagram.dragEvent.clientX) > 10 || Math.abs(e.clientY-JSDiagram.dragEvent.clientY)>10)) {
					return;
				}

				e.stopPropagation();
				JSDiagram.callbackFunc ('trans', $(this).attr("uid"), 'toggle', 'break', $(this).hasClass("enabled"));
			});
		$(this.arrowElem).mousedown(function(e) {
				JSDiagram.dragEvent = e;
	    		JSDiagram.dragUI = null;
			});
		$(this.arrowElem).draggable().draggable({ 
			revert: "invalid", 
			zIndex: JSDiagram.dragZindex,
			start: function(event, ui) {
				JSDiagram.dragEvent = event;
	    		JSDiagram.dragUI = null;
	    	},
	    	stop: function(event, ui) {
				JSDiagram.clearDrag();
	    	}
		});
		
		$(this.breakElem).draggable().draggable({
			revert: "invalid", 
			zIndex: JSDiagram.dragZindex,
			start: function(event, ui) {
				JSDiagram.dragEvent = event;
	    		JSDiagram.dragUI = null;
	    	},
	    	stop: function(event, ui) {
				JSDiagram.clearDrag();
	    	}
		});

	}	

	this.setTransNameVisibility = function (show_p) {
		if (show_p) {
			$(this.labelElem).find(".transName").show();
		}
		else {
			$(this.labelElem).find(".transName").hide();
		}
	}
	
	this.createSegment = function (segIdx_p) {
		var htmlCode = "<div id='" + this.transUID + "_" + segIdx_p + "' class='trans seg trans_" + this.transUID + "' uid='" + this.transUID + "' idx='" + segIdx_p + "'></div>";
		var segElem = $(htmlCode).appendTo(JSDiagram.modelCanvas);
		if (this.elemColor || this.elemColor!="") {
			$(segElem).css("background-color", this.elemColor);
		}			
		
		$(segElem).hover(function() {
					var trans = JSDiagram.findTrans($(this).attr("uid"));
					trans.setHover(JSDiagram.TransHoverColor);
				}, function () {
					var trans = JSDiagram.findTrans($(this).attr("uid"));
					trans.clearHover();
			})
			.dblclick(function(e) {
				var transUID = $(this).attr("uid");
				JSDiagram.callbackFunc('trans', transUID, 'dblclick', 'segment', '');
				e.stopPropagation();
			})
			.contextMenu(JSDiagram.transCtxMenuBindings.menuID, {
				bindings: JSDiagram.transCtxMenuBindings,
				onContextMenu: function (e) {
					JSDiagram.dragEvent = null;
		    		JSDiagram.dragUI = null;
					return true;
				},
		    	'onShowMenu': function(e, menu) {
		    		if (JSDiagram.transCtxMenuBindings.onShowMenu) {
		    			JSDiagram.transCtxMenuBindings.onShowMenu (e, menu);
		    		}
		    		return menu;
		    	},
			  	'menuStyle': JSDiagram.transCtxMenuBindings.menuStyle,
	    		'listingStyle': JSDiagram.transCtxMenuBindings.itemStyle,
	    		'itemHoverStyle': JSDiagram.transCtxMenuBindings.itemHoverStyle
			});
		
		
		if (this.readonly) {
			return segElem;
		}
		
		$(segElem).draggable()
			.draggable({
				start: function(event, ui) {
					JSDiagram.dragEvent = event;
				},
				drag: function(event, ui) {
					var transUID = $(ui.helper).attr("uid");
					var idx = $(ui.helper).attr("idx");
					var trans = JSDiagram.findTrans(transUID);
					if (idx==0 || idx == 3) {
						trans.segmentMoved(idx);
					}
					var s = JSDiagram.strategies[trans.strategyIdx];
					var ret = s.dragSegment(trans, idx);
					trans.paint();
					return ret;
				},
				stop: function(event, ui) {
					// maybe updates the server with new position?
					var transUID = $(ui.helper).attr("uid");
					var trans = JSDiagram.findTrans(transUID);
					trans.paint();
					trans.savePosition();
					JSDiagram.clearDrag();
				},
				helper: "original",
				zIndex: JSDiagram.dragZindex,
				addClasses: false
			})
			.click(function(e) {
				JSDiagram.setDocumentFocus();
				var curTrans = JSDiagram.findTrans($(this).attr("uid"));
				if ($(this).hasClass("marked")) {
					curTrans.setMarked(false);
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'unmarked', '', '');
				}
				else {
//					if (!JSDiagram.shiftCtrlKey) JSDiagram.clearMarks();
					if (!e.ctrlKey && !e.shiftKey && !e.altKey) JSDiagram.clearMarks();
					curTrans.setMarked(true);
					JSDiagram.callbackFunc('trans', curTrans.transUID, 'marked', '', '');
				}
				e.stopPropagation();
			});
	
			
		// setup events
		
		return segElem;
	}
	
	this.addClassTag = function (elemClass_p, class_p) {
//		var elem = $(this.labelElem).find("." + elemClass_p + " img");
		var elem = $(this.labelElem).find("." + elemClass_p).addClass(class_p);
//		JSDiagram.addImgTag(elem, class_p);
	}
	
	this.removeClassTag = function (elemClass_p, class_p) {
//		var elem = $(this.labelElem).find("." + elemClass_p + " img");
		var elem = $(this.labelElem).find("." + elemClass_p).removeClass(class_p);
//		JSDiagram.removeImgTag(elem);
	}
	
	this.restoreColor = function () {
		$(this.labelElem).css("color", this.elemColor);
		$(this.arrowElem).css("background-color", this.elemColor);
//		$(this.breakElem).css("background-color", this.elemColor);
		$(this.segElemList[0]).css("background-color", this.elemColor);
		$(this.segElemList[1]).css("background-color", this.elemColor);
		$(this.segElemList[2]).css("background-color", this.elemColor);
		$(this.segElemList[3]).css("background-color", this.elemColor);
	}
	
//	this.isEditEnabled = function() {
//		if ($(this.labelElem).find(".labelEdit").is(":visible")) return true;
//		else return false;
//	}
	
	this.addClass = function (class_p) {
		$(this.labelElem).addClass(class_p);
//		$(this.arrowElem).addClass(class_p);
//		$(this.breakElem).addClass(class_p);
		$(this.segElemList[0]).addClass(class_p);
		$(this.segElemList[1]).addClass(class_p);
		$(this.segElemList[2]).addClass(class_p);
		$(this.segElemList[3]).addClass(class_p);
	}
	
	this.removeClass = function (class_p) {
		$(this.labelElem).removeClass(class_p);
//		$(this.arrowElem).removeClass(class_p);
//		$(this.breakElem).removeClass(class_p);
		$(this.segElemList[0]).removeClass(class_p);
		$(this.segElemList[1]).removeClass(class_p);
		$(this.segElemList[2]).removeClass(class_p);
		$(this.segElemList[3]).removeClass(class_p);
	}
	
	this.setMarked = function (marked_p) {
		if (marked_p) {
			this.addClass("marked");
		}
		else {
			this.removeClass("marked");
		}
		
		$(this.labelElem).jTagging(marked_p, {class: "transMark", addTag: JSDiagram.markMode});
	}
	
	this.segmentMoved = function (segIdx_p) {
		var orient;
		var stateObj;
		if (segIdx_p==0) {
			orient = this.startOrient;
			stateObj = this.srcState;
		}
		else if (segIdx_p==3) {
			orient = this.endOrient;
			stateObj = this.destState;
		}
		
		var newFract;
		var ckStart;
		var ckLength;
		var ckPos;
		if (orient == JSDiagram.UP || orient == JSDiagram.DOWN) {
				ckStart = stateObj.getAbsolutePosLeft();
				ckLength = stateObj.getWidth();
				ckPos = JSDiagram.getCssPx(this.segElemList[segIdx_p], "left");
				newFract = this.calcFract(ckStart, ckLength, ckPos);
				if (segIdx_p==0) {
					this.startFract = newFract;
				}
				else {
					this.endFract = newFract;
				}
		}
		else if (orient == JSDiagram.LEFT || orient == JSDiagram.RIGHT) {
				ckStart = stateObj.getAbsolutePosTop();
				ckLength = stateObj.getHeight();
				ckPos = JSDiagram.getCssPx(this.segElemList[segIdx_p], "top");
				newFract = this.calcFract(ckStart, ckLength, ckPos);
				if (segIdx_p==0) {
					this.startFract = newFract;
				}
				else {
					this.endFract = newFract;
				}
		}
	}
	
	
	this.savePosition = function () {
		JSDiagram.callbackFunc('trans', this.transUID, 'move', 'segment', 
			{	startFract: this.startFract, 
				midFract: this.midFract, 
				endFract: this.endFract,
				startOrient: this.startOrient,
				endOrient: this.endOrient,
				midOffset: this.midOffset
			});
	}
	
	
	this.calcFract = function (startPos_p, length_p, calcPos_p) {
		var fract = ((parseInt(calcPos_p) - parseInt(startPos_p)) / parseInt(length_p));
		fract = Math.round(fract * 100) /100;
		return fract;
	}
	
	this.pathList = null;
	this.findBestPath = function () {
		var i;
		var maxFitness = 0;
		var fitness;
		var s;
		var bestPath;

		if (this.srcState.isBranch()) {
			this.startFract = 0.50;
		}

		if (this.srcState.isSwitch()) {
			if (this.startFract < JSDiagram.switchLessThreshold) {
				this.startFract = JSDiagram.switchLessThreshold;
			}
			else if (this.startFract > JSDiagram.switchMoreThreshold) {
				this.startFract = JSDiagram.switchMoreThreshold;
			}
		}

		if (this.destState.isBranch()) {
			this.endFract = 0.50;
		}

		if (this.destState.isSwitch()) {
			if (this.endFract < JSDiagram.switchLessThreshold) {
				this.endFract = JSDiagram.switchLessThreshold;
			}
			else if (this.endFract > JSDiagram.switchMoreThreshold) {
				this.endFract = JSDiagram.switchMoreThreshold;
			}
		}
		
		if (this.pathList==null) {
			this.pathList = new Array();
			for(i in JSDiagram.strategies) {
				this.pathList.push(new JSDiagram.ConnectorPath(this, i));
			}
		}
		
			
		// check if any strategy is possible with preferredOrientation
		for(i in JSDiagram.strategies) {
			fitness = 0;
			s = JSDiagram.strategies[i];
			var path = this.pathList[i]; // new JSDiagram.ConnectorPath(this, i);
			path.init();
			if(s.isApplicable(path)) {
				fitness++;
				// check resulting orientation against the preferred orientations
				if((path.seg0Orient & this.startOrientPref) != 0) {
					fitness += 4;
				}
				if((path.seg0Orient & this.startOrient) != 0) {
					fitness += 2;
				}
				else if (this.haveCommonOrient(path.seg0Orient, this.startOrient)) {
					fitness++;
				}
				if((path.seg3Orient & this.endOrientPref) != 0) {
					fitness += 4;
				}
				if((path.seg3Orient & this.endOrient) != 0) {
					fitness += 2;
				}
				else if (this.haveCommonOrient(path.seg3Orient, this.endOrient)) {
					fitness++;
				}
			}
	
			if (s.strategyName=="Any") {
				if (maxFitness<=0) bestPath = path;
			}
			else if(fitness > maxFitness) {
				bestPath = path;
				maxFitness = fitness;
			}
			
			if (maxFitness >= 13) break;
		}
		
		this.startOrientPref = 0;
		this.endOrientPref = 0;
		return bestPath;
	}
	
	this.haveCommonOrient = function (orient1_p, orient2_p) {
		if ((orient1_p & JSDiagram.HORIZONTAL!=0) && (orient2_p & JSDiagram.HORIZONTAL!=0)) return true;
		if ((orient1_p & JSDiagram.VERTICAL!=0) && (orient2_p & JSDiagram.VERTICAL!=0)) return true;
		return false;
	}
	
	
	this.paint = function () {
		var path = this.findBestPath();
		this.lastPath = path;
		path.calcPath();
		
		this.strategyIdx = path.strategyIdx;
		this.startOrient = path.seg0Orient;
		this.endOrient = path.seg3Orient;
		if (!this.readonly) {
			JSDiagram.strategies[this.strategyIdx].setContainment(path);
		}	
		this.paintArrow(path);
		this.paintBreak(path);
		this.paintSegment(this.segElemList[0], 0, path.seg0Orient, path.startLeft, path.startTop, path.seg0Length);
		this.paintSegment(this.segElemList[1], 1, path.seg1Orient, path.seg1Left, path.seg1Top, path.seg1Length);
		this.paintSegment(this.segElemList[2], 2, path.seg2Orient, path.seg2Left, path.seg2Top, path.seg2Length);
		this.paintSegment(this.segElemList[3], 3, path.seg3Orient, path.seg3Left, path.seg3Top, path.seg3Length);
		this.paintTransLabel(path);
	}
	
	this.setSegmentDragContainment = function (segElem_p, stateElem_p, segIdx_p, orient_p) {
		var start;
		var length;
		var other;
		if (segIdx_p==0 || segIdx_p==3) {
			if (orient_p==JSDiagram.UP || orient_p==JSDiagram.DOWN) {
				start = JSDiagram.getCssPx(stateElem_p, "left");
				length = JSDiagram.getCssPx(stateElem_p, "width");
				other = JSDiagram.getCssPx(segElem_p, "top");
				$(segElem_p).draggable().draggable("option", "containment", [start, other, start+length, other])
					.draggable({start: dragStartFunc});
			}
			else {
				start = JSDiagram.getCssPx(stateElem_p, "top");
				length = JSDiagram.getCssPx(stateElem_p, "height");
				other = JSDiagram.getCssPx(segElem_p, "left");
				$(segElem_p).draggable().draggable("option", "containment", [other, start, other, start+length])
					.draggable({start: dragStartFunc});
			}
		}
		else {
			if (orient_p==JSDiagram.UP || orient_p==JSDiagram.DOWN) {
				start = 0;
				length = JSDiagram.getCssPx(JSDiagram.modelCanvas, "width");
				other = JSDiagram.getCssPx(segElem_p, "top");
				$(segElem_p).draggable().draggable("option", "containment", [start, other, start+length, other])
					.draggable({start: dragStartFunc});
			}
			else {
				start = 0;
				length = JSDiagram.getCssPx(JSDiagram.modelCanvas, "height");
				other = JSDiagram.getCssPx(segElem_p, "left");
				$(segElem_p).draggable().draggable("option", "containment", [other, start, other, start+length])
					.draggable({start: dragStartFunc});
			}
		}
	}


	
	this.paintTransLabel = function (path_p) {
		if (isNaN(this.labelOffsetLeft)) {
			this.labelOffsetLeft = 0;
		}
		else {
			this.labelOffsetLeft = parseInt(this.labelOffsetLeft);
		}
	
		if (isNaN(this.labelOffsetTop)) {
			this.labelOffsetTop = 0;
		}
		else {
			this.labelOffsetTop = parseInt(this.labelOffsetTop);
		}
		
		path_p.labelLeft = path_p.startLeft;
		path_p.labelTop = path_p.startTop;
		if(path_p.seg0Orient == JSDiagram.LEFT) {
			path_p.labelLeft -= this.labelWidth + 5;
		}
		else if(path_p.seg0Orient == JSDiagram.UP) {
			path_p.labelTop -= this.labelHeight;
		}
		else if(path_p.seg0Orient_p == JSDiagram.RIGHT) {
			path_p.labelLeft += 5;
		}
		else if(path_p.seg0Orient == JSDiagram.DOWN) {
			path_p.labelTop += 0;
		}
	
		// TODO: advanced placement: adjust based on strategy.
		
		if (this.labelOffsetLeft!=0) {
		 var i=0;
		}
		path_p.labelLeft += this.labelOffsetLeft;
		path_p.labelTop += this.labelOffsetTop;
		
		$(this.labelElem).css("left", path_p.labelLeft + "px");
		$(this.labelElem).css("top", path_p.labelTop + "px");
	}
	
	this.paintBreak = function (path_p) {
		var left = path_p.startLeft;
		var top = path_p.startTop;
		var elemHeight = JSDiagram.getCssPx(this.breakElem, "height");
		var elemWidth = JSDiagram.getCssPx(this.breakElem, "width");
		var floatDir = "left";
		var floatType = "horizontal";
		
		switch (path_p.seg0Orient) {
			case JSDiagram.LEFT:
				top -= elemHeight / 2;
				left -= elemWidth;
				$(this.breakElem).css("position", "relative").css("align","top").css("top", -JSDiagram.transEndImgOffset).css("left", 'none').css("float", "right");

				break;
			case JSDiagram.RIGHT:
				$(this.breakElem).css("position", "relative").css("align","top").css("top", -JSDiagram.transEndImgOffset).css("left", 0).css("float", "left");

				top -= elemHeight / 2;
				break;
			case JSDiagram.DOWN:
				left -= elemWidth / 2;
				$(this.breakElem).css("position", "relative").css("align","top").css("top", 0).css("left", -JSDiagram.transEndImgOffset).css("float", "");
				break;
			case JSDiagram.UP:
				top -= elemHeight;
				left -= elemWidth / 2;
				$(this.breakElem).css("position", "relative").css("align","top").css("top", this.lastPath.seg0Length-elemHeight).css("left", -JSDiagram.transEndImgOffset).css("float", "");
				break;
		}
		

//		$(this.breakElem).css("left", left + "px").css("top", top + "px");
	}


	this.paintArrow = function (path_p) {
		var left = path_p.endLeft;
		var top = path_p.endTop;
		$(this.arrowElem).attr("src", JSDiagram.arrowImgList[path_p.seg3Orient]);
		var elemHeight = JSDiagram.getCssPx(this.arrowElem, "height");
		var elemWidth = JSDiagram.getCssPx(this.arrowElem, "width");
		switch (path_p.seg3Orient) {
			case JSDiagram.RIGHT:
				top -= elemHeight / 2;
				left -= elemWidth;
				$(this.arrowElem).css("position", "relative").css("align","top").css("top", -JSDiagram.transEndImgOffset).css("left", "").css("float", "right");
				break;
			case JSDiagram.LEFT:
				top -= elemHeight / 2;
				left += 0;
				$(this.arrowElem).css("position", "relative").css("align","top").css("top", -JSDiagram.transEndImgOffset).css("left", "").css("float", "left");
				break;
			case JSDiagram.UP:
				left -= elemWidth / 2;
				top += 0;
				$(this.arrowElem).css("position", "relative").css("align","top").css("top", 0).css("left", -JSDiagram.transEndImgOffset).css("float", "");
				break;
			case JSDiagram.DOWN:
				top -= elemHeight;
				left -= elemWidth / 2;
				$(this.arrowElem).css("position", "relative").css("align","top").css("top", this.lastPath.seg3Length - elemHeight).css("left", -JSDiagram.transEndImgOffset).css("float", "");
				break;
		}
//		$(this.arrowElem).css("display","inline-block");
//		$(this.segElemList[3]).css("vertical-align", floatDir);
		
//		$(this.arrowElem).css("left", left + "px").css("top", top + "px");
	}
	
	
	this.paintSegment = function (segElem_p, segIdx_p, orient_p, startLeft_p, startTop_p, length_p) {
		switch(orient_p) {
			case JSDiagram.LEFT:
				$(segElem_p).css("left", (startLeft_p - length_p) + "px");				
				$(segElem_p).css("top", startTop_p + "px");
				$(segElem_p).css("width", length_p + "px");
				$(segElem_p).css("height", JSDiagram.Thickness + "px");
				break;
			case JSDiagram.RIGHT:
				$(segElem_p).css("left", startLeft_p + "px");
				$(segElem_p).css("top", startTop_p + "px");
				if(segIdx_p < 3) {
					$(segElem_p).css("width", length_p + JSDiagram.Thickness + "px");
				}
				else {
					$(segElem_p).css("width", length_p + "px");
				}
				$(segElem_p).css("height", JSDiagram.Thickness + "px");
				break;
			case JSDiagram.UP:
				$(segElem_p).css("left", startLeft_p + "px");
				$(segElem_p).css("top", (startTop_p - length_p) + "px");
				$(segElem_p).css("width", JSDiagram.Thickness + "px");
				$(segElem_p).css("height", length_p + "px");
				break;
			case JSDiagram.DOWN:
				$(segElem_p).css("left", startLeft_p + "px");
				$(segElem_p).css("top", startTop_p + "px");
				$(segElem_p).css("width", JSDiagram.Thickness + "px");
				if (segIdx_p < 3) {
					$(segElem_p).css("height", length_p + JSDiagram.Thickness + "px");
				}
				else {
					$(segElem_p).css("height", length_p + "px");
				}
				break;
		}
	}


	this.isMarked = function () {
		return $(this.labelElem).hasClass("marked");
	}
	
	
	this.setColor = function (color_p) {
		if (color_p==undefined || color_p.trim()=="") color_p = JSDiagram.defaultTransColor;
		this.elemColor = color_p;
		this.setColor2 (color_p);
	}

	this.setColor2 = function (color_p) {
		$(this.labelElem).css("color", color_p);
		$(this.arrowElem).css("background-color", color_p);
//		$(this.breakElem).css("background-color", color_p);
		$(this.segElemList[0]).css("background-color", color_p);
		$(this.segElemList[1]).css("background-color", color_p);
		$(this.segElemList[2]).css("background-color", color_p);
		$(this.segElemList[3]).css("background-color", color_p);
	}

	this.setTitle = function (title_p) {
		$(this.labelElem).attr("title", title_p);
	}
	
	this.setHover = function (color_p) {
		var border = "1px solid " + color_p;
		$(this.labelElem).css("color", color_p);
		$(this.segElemList[0]).css("border", border);
		$(this.segElemList[1]).css("border", border);
		$(this.segElemList[2]).css("border", border);
		$(this.segElemList[3]).css("border", border);
	}
	
	this.clearHover = function () {
		$(this.labelElem).css("color", this.elemColor);
		$(this.segElemList[0]).css("border", "");
		$(this.segElemList[1]).css("border", "");
		$(this.segElemList[2]).css("border", "");
		$(this.segElemList[3]).css("border", "");
	}
	
	this.setBreak = function (break_p) {
		if (break_p) {
			if (!this.isBreakEnabled()) {
				$(this.breakElem).addClass("enabled");
			}
		}
		else $(this.breakElem).removeClass("enabled");
	}
	
	this.isBreakEnabled = function () {
		return $(this.breakElem).hasClass("enabled");
	}
	
	this.toggleBreak = function () {
		$(this.breakElem).toggleClass("enabled");
	}

	
	this.setTransName = function (transName_p) {
		$(this.labelElem).find(".transName").text (transName_p);
		if (transName_p=="") {
			this.setTransNameVisibility (false);
		}
		else {
			this.setTransNameVisibility (true);
		}
	}

	this.getTransName = function () {
		return $(this.labelElem).find(".transName").text ();
	}

	this.setTransFlags = function (flags_p) {
		$(this.labelElem).find(".transFlags").html(flags_p);
	}
	

	this.deleteObj = function () {
		$(".trans_" + this.transUID).remove();
		for (i in JSDiagram.transList) {
			var trans = JSDiagram.transList[i];
			if (trans==undefined || trans==null) continue;
			if (trans && trans.transUID==this.transUID) {
				JSDiagram.transList[i] = null;
				return;
			}
		}
	}
	
	this.hide = function () {
		$(".trans_" + this.transUID).hide();
	}
	
	this.show = function () {
		$(".trans_" + this.transUID).show();
	}

	this.init(options_p);
	
}

JSDiagram.findTrans = function (transUID_p) {
	for (i in JSDiagram.transList) {
		var trans = JSDiagram.transList[i];
		if (trans==undefined || trans==null) continue;
		if (trans && trans.transUID==transUID_p) return trans;
	}
	return null;
}

JSDiagram.ConnectorPath = function (trans_p, strategyIdx_p) {
	this.trans = trans_p;
	this.strategyIdx = strategyIdx_p;
	
	this.startLeft;
	this.startTop;
	this.endLeft;
	this.endTop;
	
	this.seg0Orient;
	this.seg0Length;
	this.seg1Orient;
	this.seg1Length;
	this.seg2Orient;
	this.seg2Length;
	this.seg3Orient;
	this.seg3Length;
	
	// derived
	this.seg1Left;
	this.seg1Top;
	this.seg2Left;
	this.seg2Top;
	this.seg3Left;
	this.seg3Top;

	this.sourceLeft = this.trans.srcState.getAbsolutePosLeft();
	this.sourceWidth = this.trans.srcState.getWidth() + 2;
	this.sourceTop = this.trans.srcState.getAbsolutePosTop();
	this.sourceHeight = this.trans.srcState.getHeight() + 2;

	this.destinationLeft = this.trans.destState.getAbsolutePosLeft();
	this.destinationWidth = this.trans.destState.getWidth() + 2;
	this.destinationTop = this.trans.destState.getAbsolutePosTop();
	this.destinationHeight = this.trans.destState.getHeight() + 2;

	this.init = function () {
		this.sourceLeft = this.trans.srcState.getAbsolutePosLeft();
		this.sourceWidth = this.trans.srcState.getWidth() + 2;
		this.sourceTop = this.trans.srcState.getAbsolutePosTop();
		this.sourceHeight = this.trans.srcState.getHeight() + 2;
	
		this.destinationLeft = this.trans.destState.getAbsolutePosLeft();
		this.destinationWidth = this.trans.destState.getWidth() + 2;
		this.destinationTop = this.trans.destState.getAbsolutePosTop();
		this.destinationHeight = this.trans.destState.getHeight() + 2;
	}
	
	this.calcPath = function () {
		this.seg1Left = this.calcNextLeft (this.startLeft, this.seg0Orient, this.seg0Length);
		this.seg2Left = this.calcNextLeft (this.seg1Left, this.seg1Orient, this.seg1Length);
		this.seg3Left = this.calcNextLeft (this.seg2Left, this.seg2Orient, this.seg2Length);

		this.seg1Top = this.calcNextTop (this.startTop, this.seg0Orient, this.seg0Length);
		this.seg2Top = this.calcNextTop (this.seg1Top, this.seg1Orient, this.seg1Length);
		this.seg3Top = this.calcNextTop (this.seg2Top, this.seg2Orient, this.seg2Length);
		
		var posRight = JSDiagram.canvasWidth;
		var posBottom = JSDiagram.canvasHeight;
		
		posRight = Math.max(posRight, this.seg1Left);
		posRight = Math.max(posRight, this.seg2Left);
		posBottom = Math.max(posBottom, this.seg1Top);
		posBottom = Math.max(posBottom, this.seg2Top);
//		JSDiagram.checkSize(posRight, posBottom);
	}
	
	this.calcNextLeft = function (startLeft_p, orient_p, length_p) {
		var nextLeft = startLeft_p;
		switch (orient_p) {
			case JSDiagram.LEFT:
				nextLeft -= length_p;
				break;
			case JSDiagram.RIGHT:
				nextLeft += length_p;
				break;
		}
		return nextLeft;
	}
	
	this.calcNextTop = function (startTop_p, orient_p, length_p) {
		var nextTop = startTop_p;
		switch (orient_p) {
			case JSDiagram.UP:
				nextTop -= length_p;
				break;
			case JSDiagram.DOWN:
				nextTop += length_p;
				break;
		}
		return nextTop;
	}
	
	this.cornerLength = function () {
		return Math.abs(this.startLeft - this.endLeft) + Math.abs(this.startTop - this.endTop);
	}
}




JSDiagram.getCssPx = function (uiElem_p, pxAttrName_p) {
/*	if (pxAttrName_p=="left") {
		return $(uiElem_p).position().left;
	}
	else if (pxAttrName_p=="left") {
		return $(uiElem_p).position().top;
	}
	else if (pxAttrName_p=="width") {
		return $(uiElem_p).width();
	}
	else if (pxAttrName_p=="height") {
		return $(uiElem_p).height();
	}
	else {
*/		var pxVal = $(uiElem_p).css(pxAttrName_p);
		if (pxVal) {
			pxVal = parseInt(pxVal.substring(0, pxVal.length-2));
		}
		else pxVal = 0;
		return pxVal;
//	}
}


JSDiagram.deleteAllMarkedStateTrans = function() {
	var uidList = new Array();
	var uid;
	$(".state.marked").each(function() {
		uid = $(this).attr("id");
		var stateObj = JSDiagram.findState(uid);
		if (!stateObj.readonly) {
			uidList.push(uid);
		}
	});
	
	$(".trans.marked").each(function() {
		uid = $(this).attr("id");
		if (uid.indexOf("_")>0) return;
		var transObj = JSDiagram.findTrans(uid);
		if (!transObj.readonly) {
			uidList.push(uid);
		}
	});
	if (uidList.length>0) {
		JSDiagram.callbackFunc('stateTrans', uid, 'delete', "uidList", uidList);
	}
}


JSDiagram.findState = function (stateUID_p) {
	for (i in JSDiagram.stateList) {
		var state = JSDiagram.stateList[i];
		if (state && state.stateUID==stateUID_p) {
			return state;
		}
	}
	
	return null;
}

JSDiagram.setCanvasSize = function (width_p, height_p) {
	$(JSDiagram.modelCanvas).css("width", width_p + "px").css("height", height_p + "px");
}

JSDiagram.getCanvasWidth = function () {
	return JSDiagram.getCssPx(JSDiagram.modelCanvas, "width");
}

JSDiagram.getCanvasHeight = function () {
	return JSDiagram.getCssPx(JSDiagram.modelCanvas, "height");
}

JSDiagram.checkSize = function (width_p, height_p) {
	width_p += 50;
	height_p += 50;
	var changed = false;
	if (width_p > JSDiagram.canvasWidth) {
		changed = true;
		JSDiagram.canvasWidth = width_p;
	}
	if (height_p > JSDiagram.canvasHeight) {
		changed = true;
		JSDiagram.canvasHeight = height_p;
	}
	
	if (changed) {
		JSDiagram.setCanvasSize(JSDiagram.canvasWidth, JSDiagram.canvasHeight);
		window.onresize();
	}
}


JSDiagram.setBackgroundColor = function (color_p) {
	if (color_p=="#") color_p = "";
	$(JSDiagram.modelCanvas).css("background-color", color_p);
}

JSDiagram.getAllStates = function () {
	var ret = new Array();
	$(".state").each(function() {
		ret.push(JSDiagram.State($(this).attr("id")));
	});
	
	return ret;
}


JSDiagram.removeClass = function (class_p) {
	JSDiagram.removeClassAllState (class_p);
	JSDiagram.removeClassAllTrans (class_p);
}


JSDiagram.removeClassAllState = function (class_p) {
	$(".state").removeClass(class_p);
}

JSDiagram.removeClassAllTrans = function (class_p) {
	$(".trans").removeClass(class_p);
}


JSDiagram.clearBreaks = function () {
	$(".break").removeClass("enabled");
}

JSDiagram.clearMarks = function () {
	jTagging.clearMarks();
}

JSDiagram.getMarkedStates = function () {
	return $(".state.marked");
}

JSDiagram.getMarkedTrans = function () {
	return $(".trans.marked");
}


JSDiagram.clearAllPausedAt = function (pausedClassList_p) {
	for (i in pausedClassList_p) {
		var className = pausedClassList_p[i];
		$("." + className).removeClass(className);
	}
}

JSDiagram.getAllMarkedUID = function () {
	var retMarkedList = new Array();
/*
	var uid = null;
	$(".state.marked").each(function() {
		uid = $(this).attr("id");
		retMarkedList.push(uid);
	});
	
	$(".trans.marked").parent().each(function() {
		uid = $(this).attr("id");
		retMarkedList.push(uid);
	});
*/	
	retMarkedList = jTagging.getMarked();
	return retMarkedList;
}

JSDiagram.scrollTo = function (uid_p) {
	var stateTransObj = JSDiagram.findState(uid_p);
	var elem;
	var elemLeft = 0;
	var elemTop = 0;
	var elemWidth = 75;
	var elemHeight = 75;
	
	if (stateTransObj) {
		elem = stateTransObj.stateElem;
		elemLeft = stateTransObj.getAbsolutePosLeft();
		elemTop = stateTransObj.getAbsolutePosTop();
		elemWidth = stateTransObj.getWidth();
		elemHeight = stateTransObj.getHeight();
	}
	else {
		stateTransObj = JSDiagram.findTrans(uid_p);
		if (!stateTransObj) return;
		elem = stateTransObj.labelElem;
		elemLeft = JSDiagram.getCssPx(elem, "left");
		elemTop = JSDiagram.getCssPx(elem, "top");
		elemWidth = $(stateTransObj.labelElem).width();
		elemHeight = $(stateTransObj.labelElem).height();
	}
	$(JSDiagram.focusHelper).css({left: elemLeft + "px", top: elemTop + "px"}).focus().blur();
	var offset = $(JSDiagram.focusHelper).offset();

	var winHeight = $(window).height();
	var winWidth = $(window).width();
	var adjust = false;
	if (offset.left<=50) {
		adjust = true;
		offset.left -= 50;
	}
	else if (offset.left + elemWidth >= winWidth) {
		adjust = true;
		offset.left += elemWidth; // - (winWidth - offset.left);
	}
	if (offset.top<=50) {
		adjust = true;
		offset.top -= 50;
	}
	else if (offset.top + elemHeight >= winHeight) {
		adjust = true;
		offset.top += elemHeight; // - (winHeight - offset.height);
	}
	if (adjust) {
		$(JSDiagram.focusHelper).offset(offset).focus();
	}
	$(JSDiagram.focusHelper).css({left: "-100px", top: "-100px"});
}

JSDiagram.scrollTo2 = function (uid_p) {
	var stateTransObj = JSDiagram.findState(uid_p);
	var elem;
	var elemLeft = 0;
	var elemTop = JSDiagram.getCssPx(elem, "top");
	if (stateTransObj) {
		elem = stateTransObj.stateElem;
		elemLeft = stateTransObj.getAbsolutePosLeft();
		elemTop = stateTransObj.getAbsolutePosTop();
	}
	else {
		stateTransObj = JSDiagram.findTrans(uid_p);
		if (!stateTransObj) return;
		elem = stateTransObj.labelElem;
		elemLeft = JSDiagram.getCssPx(elem, "left");
		elemTop = JSDiagram.getCssPx(elem, "top");
	}

	var elemRight = elemLeft + JSDiagram.getCssPx(elem, "width");
	var elemBottom = elemTop + JSDiagram.getCssPx(elem, "height");

	var wrapper = $(JSDiagram.modelCanvas).parent();
	var viewportwidth = JSDiagram.getCssPx(wrapper, "width");
	var viewportheight = JSDiagram.getCssPx(wrapper, "height");

	var scrollLeft = $(wrapper).scrollLeft();
	var scrollTop = $(wrapper).scrollTop();
	var scrollRight = scrollLeft + viewportwidth;	
	var scrollBottom = scrollTop + viewportheight;
	
	var slackLeft = 50;
	var slackTop = 50;
	
	var scrollLeftDelta = elemRight + slackLeft - scrollRight;
	var scrollLeftFinal;
	if (scrollLeftDelta < 0) {
		scrollLeftDelta = scrollLeft - (elemLeft - slackLeft);
		if (scrollLeftDelta < 0) {
			scrollLeftDelta = 0;
			scrollLeftFinal = "+=0";
		}
		else {
			scrollLeftFinal = "-=" + scrollLeftDelta;
		}
	}
	else {
		scrollLeftFinal = "+=" + scrollLeftDelta;
	}
	
	var scrollTopDelta = elemBottom + slackTop - scrollBottom;
	var scrollTopFinal;
	if (scrollTopDelta < 0) {
		scrollTopDelta = scrollTop - (elemTop - slackTop);
		if (scrollTopDelta < 0) {
			scrollTopDelta = 0;
			scrollTopFinal = "+=0";
		}
		else {
			scrollTopFinal = "-=" + scrollTopDelta;
		}
	}
	else {
		scrollTopFinal = "+=" + scrollTopDelta;
	}
	
	
	$(JSDiagram.modelCanvas).parent().animate({
			scrollLeft: scrollLeftFinal,
			scrollTop: scrollTopFinal
		}, 10);	

}


JSDiagram.alignMarkedLeft = function () {
	var theMost = 99999;
	var stateList = new Array();
	var statePos;
	var stateObj;
	$(".state.marked").each(function() {
		var aUID = $(this).attr("id");
		stateObj = JSDiagram.findState(aUID);
		stateList.push(stateObj);
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'left')
		if (statePos < theMost) theMost = statePos;
	});
	
	if (theMost >= 99999) return;
	for (var i in stateList) {
		stateObj = stateList[i];
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'left')
		stateList[i].move(theMost - statePos, 0);
	}
	JSDiagram.savePosition(stateList);
}

JSDiagram.alignMarkedRight = function () {
	var theMost = -1;
	var stateList = new Array();
	var statePos;
	var stateObj;
	var stateWidth;
	$(".state.marked").each(function() {
		var aUID = $(this).attr("id");
		stateObj = JSDiagram.findState(aUID);
		stateList.push(stateObj);
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'left');
		stateWidth = JSDiagram.getCssPx(stateObj.stateElem, 'width');
		statePos += stateWidth;
		if (statePos > theMost) theMost = statePos;
	});
	
	if (theMost <= 0) return;
	for (var i in stateList) {
		stateObj = stateList[i];
		stateWidth = JSDiagram.getCssPx(stateObj.stateElem, 'width');
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'left');
		stateList[i].move(theMost - stateWidth - statePos, 0);
	}
	JSDiagram.savePosition(stateList);
}

JSDiagram.alignMarkedTop = function () {
	var theMost = 99999;
	var stateList = new Array();
	var statePos;
	var stateObj;
	$(".state.marked").each(function() {
		var aUID = $(this).attr("id");
		stateObj = JSDiagram.findState(aUID);
		stateList.push(stateObj);
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'top');
		if (statePos < theMost) theMost = statePos;
	});
	
	if (theMost >= 99999) return;
	for (var i in stateList) {
		stateObj = stateList[i];
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'top');
		stateList[i].move(0, theMost - statePos);
	}
	JSDiagram.savePosition(stateList);
}

JSDiagram.alignMarkedBottom = function () {
	var theMost = -1;
	var stateList = new Array();
	var statePos;
	var stateObj;
	var stateHeight;
	$(".state.marked").each(function() {
		var aUID = $(this).attr("id");
		stateObj = JSDiagram.findState(aUID);
		stateList.push(stateObj);
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'top');
		stateHeight = JSDiagram.getCssPx(stateObj.stateElem, 'height');
		statePos += stateHeight;
		if (statePos > theMost) theMost = statePos;
	});
	
	if (theMost <= 0) return;
	for (var i in stateList) {
		stateObj = stateList[i];
		statePos = JSDiagram.getCssPx(stateObj.stateElem, 'top');
		stateHeight = JSDiagram.getCssPx(stateObj.stateElem, 'height');
		stateList[i].move(0, theMost - stateHeight - statePos);
	}
	
	JSDiagram.savePosition(stateList);
}

JSDiagram.savePosition = function (stateTransList_p) {
	if (stateTransList_p.savePosition) {
		stateTransList_p.savePosition();
		return;
	}
	
	for (var i in stateTransList_p) {
		stateTransList_p[i].savePosition();
	}
}


var incomingTransList = new Array();
var outgoingTransList = new Array();
var liteupStateUID;
var liteupStateClass;
var liteupIncomingClass;
var liteupOutgoingClass;
var liteupInterval = 250;
JSDiagram.propagateClass = function (stateUID_p, startClass_p, incomingClass_p, outgoingClass_p) {
	incomingTransList = new Array();
	outgoingTransList = new Array();
	liteupStateUID = stateUID_p;
	liteupStateClass = startClass_p;
	liteupIncomingClass = incomingClass_p;
	liteupOutgoingClass = outgoingClass_p;
	
	for (i in JSDiagram.transList) {
		var trans = JSDiagram.transList[i];
		if (trans==undefined || trans==null) continue;
		if (trans.destUID==stateUID_p) {
			incomingTransList.push(trans);
		}
		else if (trans.srcUID==liteupStateUID) {
			outgoingTransList.push(trans);
		}
	}

	JSDiagram.liteupIncoming();
}

JSDiagram.liteupIncoming = function () {
	var destStateObj;
	var transObj;
	for (var i in incomingTransList) {
		transObj = incomingTransList[i];
		JSDiagram.hiliteElem(transObj.transUID, {color: liteupIncomingClass});

		destStateObj = JSDiagram.findState(transObj.srcUID);
		if (destStateObj.stateUID!=liteupStateUID) {
			JSDiagram.hiliteElem(destStateObj.stateUID, {color: liteupIncomingClass});
		}
	}
	
	setTimeout(JSDiagram.liteupState, liteupInterval);
}

JSDiagram.liteupState = function () {
	JSDiagram.hiliteElem(liteupStateUID, {color: liteupStateClass});
	setTimeout(JSDiagram.liteupOutgoing, {color: liteupInterval});
}

JSDiagram.liteupOutgoing = function () {
	var destStateObj;
	var transObj;
	for (var i in outgoingTransList) {
		transObj = outgoingTransList[i];
		JSDiagram.hiliteElem(transObj.transUID, {color: liteupOutgoingClass});
		
		destStateObj = JSDiagram.findState(transObj.destUID);
		if (destStateObj.stateUID!=liteupStateUID) {
			JSDiagram.hiliteElem(destStateObj.stateUID, {color: liteupOutgoingClass});
		}
	}
	return null;
}


JSDiagram.addImgTag = function (imgElem_p, class_p) {
	var imgSrc = $(imgElem_p).attr("src");
	var idx = imgSrc.indexOf(".");
	var imgExt = imgSrc.substring(idx);
	imgSrc = imgSrc.substring(0, idx);
	idx = imgSrc.indexOf("_");
	if (idx>0) {
		imgSrc = imgSrc.substring(0, idx);
	}
	imgSrc += "_" + class_p + imgExt;
	$(imgElem_p).attr("src", imgSrc);
}

JSDiagram.removeImgTag = function (imgElem_p) {
	var imgSrc = $(imgElem_p).attr("src");
	var idx = imgSrc.indexOf(".");
	var imgExt = imgSrc.substring(idx);
	imgSrc = imgSrc.substring(0, idx);
	idx = imgSrc.indexOf("_");
	if (idx>0) {
		imgSrc = imgSrc.substring(0, idx);
	}
	imgSrc += imgExt;
	$(imgElem_p).attr("src", imgSrc);
}


JSDiagram.mousemove = function (evt) {

	if (!JSDiagram.rightMouseDragStarted) return;
	if( !evt ) evt = event;
	if (JSDiagram.dragUI && JSDiagram.dragUI.stateUID) {
		var leftOffSet = $("#wrapper").scrollLeft() + $("html").offset().left;
		var topOffSet = $("#wrapper").scrollTop() + $("html").offset().top - 25;
		var fromState = JSDiagram.dragUI;

		var fromX = fromState.getAbsolutePosLeft() + leftOffSet + Math.round(fromState.getWidth()/2);
		var fromY = fromState.getAbsolutePosTop() + topOffSet + Math.round(fromState.getHeight()/2);
		var toX = evt.clientX+leftOffSet;
		var toY = evt.clientY+topOffSet;
		
		JSDiagram.drawArrow(fromX, fromY, toX, toY);
		JSDiagram.closeCtxMenu();
	}
	else if (JSDiagram.dragEvent) {
		var leftOffSet = $("#wrapper").scrollLeft() + $("html").offset().left;
		var topOffSet = $("#wrapper").scrollTop() + $("html").offset().top - 25;
		var fromX = JSDiagram.dragEvent.clientX+leftOffSet;
		var fromY = JSDiagram.dragEvent.clientY+topOffSet;
		var toX = evt.clientX+leftOffSet;
		var toY = evt.clientY+topOffSet;
		JSDiagram.drawArrow(fromX, fromY, toX, toY);
		JSDiagram.closeCtxMenu();
	}
	else JSDiagram.clearArrow();
}

var hiliteList = new Array();

JSDiagram.clearHilite = function (uid_p) {
	if (uid_p) {
		$("#" + uid_p + "H").remove();
		$("#" + uid_p + "H0").remove();
		$("#" + uid_p + "H1").remove();
		$("#" + uid_p + "H2").remove();
		$("#" + uid_p + "H3").remove();
	}
	else {
		$(".hilite").remove();
	}
}

JSDiagram.hiliteElem = function (uid_p, options_p) {
	var uidH = uid_p + "H";
	var elemObj = JSDiagram.findState(uid_p);
	var cloneElem;
	var elemStyle = {position: "absolute", left: "0px", top: "0px"};
		
	if (elemObj) {
		if (elemObj.isBranch()) {
			JSDiagram.addTriangle(elemObj.stateElem, uidH, 'hilite', 
				options_p.color, 1, 1, elemObj.getWidth(), Math.round(elemObj.getHeight()/2));
			return;
		}
		else if (elemObj.isSwitch()) {
			JSDiagram.addOctagonHead(elemObj.stateElem, uidH, 'hilite', 
				options_p.color, 1, 1, elemObj.getWidth(), Math.round(elemObj.getHeight()*JSDiagram.switchLessThreshold));
			return;
		}
		cloneElem = $("#" + uidH);
		if (cloneElem.size()>0) {
			$(cloneElem).css("background-color", options_p.color).find(".head, .icnR, .icn").css("background-color", options_p.color);
			if (options_p.title) {
				$(cloneElem).attr("title", options_p.title);
			}
			return;
		}
		
		var stateElemClass = {"background-color": options_p.color};//, opacity: opacityFloat, filter: "alpha(opacity = " + opacityAlpha + ")"};
		cloneElem = elemObj.stateElem.clone().attr("id", uidH).removeClass("state");
		$(cloneElem).find(".state").remove();
		$(cloneElem).find(".ctnt").remove();
		$(cloneElem).find("div.ui-resizable-handle").remove();
		$(cloneElem).css("height", "20px").css(elemStyle).addClass("hilite").css(stateElemClass).appendTo(elemObj.stateElem); //.parent());
		$(cloneElem).find(".head").css(stateElemClass);
		if (options_p.zIndex) {
			$(cloneElem).css("z-index", options_p.zIndex);
		}
		$(cloneElem).find(".icn, .icnR").css("background-color", options_p.color);
		if (options_p.htmlText) {
			$(cloneElem).html(options_p.htmlText);
		}
		if (options_p.title) {
			$(cloneElem).attr("title", options_p.title);
		}
		return;
	}
	
	elemObj = JSDiagram.findTrans(uid_p);
	if (elemObj) {
		var segClass = {"background-color": options_p.color, border: "1px solid " + options_p.color}; //, opacity: opacityFloat, filter: "alpha(opacity = " + opacityAlpha + ")"};
		var endClass = {"background-color": options_p.color}; //, opacity: opacityFloat, filter: "alpha(opacity = " + opacityAlpha + ")"};
		var transLabelClass = {"background-color": options_p.color};//, opacity: opacityFloat, filter: "alpha(opacity = " + opacityAlpha + ")"};

		cloneElem = $("#" + uidH);
		if (cloneElem.size()>0) {
			$(cloneElem).find(".transName").css("background-color", options_p.color);
			$("#"+uidH+"0").css("background-color", options_p.color).find(".arrow, .break").css("background-color", options_p.color);
			$("#"+uidH+"1").css("background-color", options_p.color);
			$("#"+uidH+"2").css("background-color", options_p.color);
			$("#"+uidH+"3").css("background-color", options_p.color).find(".arrow, .break").css("background-color", options_p.color);
			if (options_p.title) {
				$(cloneElem).attr("title", options_p.title);
				$("#"+uidH+"0").attr("title", options_p.title);
			}
			return;
		}
		
		cloneElem = $(elemObj.labelElem).clone().css(elemStyle).addClass("hilite").attr("id", uidH).appendTo(elemObj.labelElem).find(".transName").css(transLabelClass);
		if (options_p.htmlText) {
			$(elemObj.labelElem).html(options_p.htmlText);
		}
		var firstSegClone = $(elemObj.segElemList[0]).clone();
		$(firstSegClone).css(elemStyle).addClass("hilite").css(segClass).attr("id",uidH+"0").appendTo(elemObj.segElemList[0]).find(".arrow, .break").css(endClass);
		$(elemObj.segElemList[1]).clone().css(elemStyle).addClass("hilite").css(segClass).attr("id",uidH+"1").appendTo(elemObj.segElemList[1]);
		$(elemObj.segElemList[2]).clone().css(elemStyle).addClass("hilite").css(segClass).attr("id",uidH+"2").appendTo(elemObj.segElemList[2]);
		$(elemObj.segElemList[3]).clone().css(elemStyle).addClass("hilite").css(segClass).attr("id",uidH+"3").appendTo(elemObj.segElemList[3]).find(".arrow, .break").css(endClass);
		if (options_p.title) {
			$(cloneElem).attr("title", options_p.title);
			$(firstSegClone).attr("title", options_p.title);
		}
		return;
	}
}

JSDiagram.startAddTrans = function (stateUID_p) {
	JSDiagram.dragUI = JSDiagram.findState(stateUID_p);
}


JSDiagram.moveTransTarget = function (transUID_p, newTargetUID_p) {
	var transObj = JSDiagram.findTrans(transUID_p);
	transObj.moveDestState(newTargetUID_p);
}

JSDiagram.mark = function (uid_p) {
	var elemObj = JSDiagram.findState(uid_p);
	if (!elemObj) {
		elemObj = JSDiagram.findTrans(uid_p);
	}
	
	if (elemObj) {
		elemObj.setMarked(true);
	}
}

JSDiagram.markAllStates = function (parentUID_p) {
	for (var i in JSDiagram.stateList) {
		var state = JSDiagram.stateList[i];
		if (state==null) continue;
		if (parentUID_p==null) {
			if (state.parentState!=null) continue;
		}
		else if (state.parentState==null) {
			if (parentUID_p!=null) continue;
		}
		else if (state.parentState.stateUID!=parentUID_p) continue;
		state.setMarked(true);
	}
}


JSDiagram.osVersion = function () {
	// This script sets OSName variable as follows:
	// "Windows"    for all versions of Windows
	// "MacOS"      for all versions of Macintosh OS
	// "Linux"      for all versions of Linux
	// "UNIX"       for all other UNIX flavors 
	// "Unknown OS" indicates failure to detect the OS
	
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	return OSName;
}

JSDiagram.moveMarkedStates = function(keyCode_p, delta_p) {
	var deltaX = 0;
	var deltaY = 0;
	if (keyCode_p==37) { // left
		deltaX = -delta_p;
	}
	else if (keyCode_p==38) { // up
		deltaY = -delta_p;
	}
	else if (keyCode_p==39) { // right
		deltaX = delta_p;
	}
	else if (keyCode_p==40) { // down
		deltaY = delta_p;
	}

	if (deltaX==0 && deltaY==0) return;
	
    var moveOK = true;
    var allMarkedUIDs = JSDiagram.getAllMarkedUID();
	for (var dI in allMarkedUIDs) {
		var stateObj = JSDiagram.findState(allMarkedUIDs[dI]);
		if (stateObj==null) continue;
		moveOK = moveOK && stateObj.move(deltaX, deltaY);
		JSDiagram.callbackFunc ('state', allMarkedUIDs[dI], 'move', 'position', {left: stateObj.getPosLeft(), top: stateObj.getPosTop()}, '');
	}

	if (!moveOK) {
		// some didn't move, but that's ok
	}
	
}

JSDiagram.setStateMarked = function(stateUID_p, marked_p) {
	var state = JSDiagram.findState(stateUID_p);
	if (state) state.setMarked(marked_p);
}

JSDiagram.setTransMarked = function(transUID_p, marked_p) {
	var trans = JSDiagram.findTrans(transUID_p);
	if (trans) trans.setMarked(marked_p);
}

JSDiagram.clearDrag = function () {
	JSDiagram.dragEvent = null;
	JSDiagram.dragUI = null;
	JSDiagram.clearArrow();
}

JSDiagram.drawArrow = function (fromx, fromy, tox, toy) {
	var canvasElem = document.getElementById("arrowCanvas");
	JSDiagram.clearArrow();

	if (tox>fromx) {
		tox -= 5;
	}
	else {
		tox += 10;
	}
	
	if (toy>fromy) {
		toy -= 5;
	}
	else {
		toy += 10;
	}
	
	var sizeWidth = Math.abs(fromx - tox) + 3;
	var sizeHeight = Math.abs(fromy - toy) + 3;

	var offsetLeft = Math.min(fromx, tox);
	var offsetTop = Math.min(fromy, toy);
	fromx = fromx - offsetLeft;
	fromy = fromy - offsetTop;
	tox = tox - offsetLeft;
	toy = toy - offsetTop;
	if (tox<fromx) {
		tox += 3;
	}
	
	if (toy < fromy) {
		toy += 3;
	}
	
	$(canvasElem).css("left", offsetLeft).css("top", offsetTop);
	canvasElem.width = Math.max(sizeWidth+1, 5);
	canvasElem.height = Math.max(sizeHeight + 1, 5);
	var context = canvasElem.getContext("2d");
	context.strokeStyle = "orange";
	context.beginPath();
	var headlen = 10;	// length of head in pixels
	var dx = tox-fromx;
	var dy = toy-fromy;
	var angle = Math.atan2(dy,dx);
	context.moveTo(fromx, fromy);
	context.lineTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
	context.moveTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
	context.stroke();
}

JSDiagram.clearArrow = function () {
	var arrowCanvas = document.getElementById("arrowCanvas");
	var arrowCtx = arrowCanvas.getContext("2d");
  	arrowCtx.clearRect(0, 0, arrowCanvas.width, arrowCanvas.height);
  	var w = arrowCanvas.width;
  	arrowCanvas.width = 1;
  	arrowCanvas.height = 1;
}

JSDiagram.addDiamond = function (stateObj_p) {
	var context = null;
	if (stateObj_p.diamondCanvas==null) {
		var htmlC = "<canvas style='z-index:-1;position:absolute; top:0; left:0;' class='diamond " + stateObj_p.stateUID + "'></canvas>";
		var diamondElem = $(htmlC).appendTo(stateObj_p.stateElem);
		stateObj_p.diamondCanvas = $(diamondElem)[0];
		stateObj_p.diamondCanvas.width = stateObj_p.getWidth();
		stateObj_p.diamondCanvas.height = stateObj_p.getHeight();
		context = stateObj_p.diamondCanvas.getContext("2d");
	}
	else {
		context = stateObj_p.diamondCanvas.getContext("2d");
 		context.clearRect(0, 0, stateObj_p.diamondCanvas.width, stateObj_p.diamondCanvas.height);
  		stateObj_p.diamondCanvas.width = 1;
  		stateObj_p.diamondCanvas.width = stateObj_p.getWidth();
	}
	context.strokeStyle = "#333333";
	if (stateObj_p.stateColor) {
		context.fillStyle = stateObj_p.stateColor;
	}
   	context.beginPath();
	var midX = stateObj_p.diamondCanvas.width / 2;
	var midY = stateObj_p.diamondCanvas.height / 2;
	context.moveTo(1, midY);
	context.lineTo(midX, 1);
	context.lineTo(stateObj_p.diamondCanvas.width-1, midY);
	context.lineTo(midX, stateObj_p.diamondCanvas.height-1);
	context.lineTo(1, midY);
	context.stroke();
	if (stateObj_p.stateColor) {
		context.fill();
	}
	return;
}

JSDiagram.addTriangle = function (parentElem_p, elemID_p, 
 	class_p, color_p, left_p, top_p, width_p, height_p) {
	var context = null;
	var htmlC = "<canvas id='" + elemID_p + "'"
			+ " style='z-index:-1;position:absolute; top: " 
			+ top_p + "px; left: " + left_p + "px; width:" + width_p 
			+ "px; height:" + height_p + "px;' class='triangle " 
			+ class_p + "'></canvas>";
	var canvasElem = $(htmlC).appendTo(parentElem_p);
	canvasObj = $(canvasElem)[0];
	canvasObj.width = width_p;
	canvasObj.height = height_p;
	context = canvasObj.getContext("2d");
	context.strokeStyle = color_p;
	context.fillStyle = color_p;
   	context.beginPath();
	var midX = canvasObj.width / 2;
	context.moveTo(1, canvasObj.height-1);
	context.lineTo(midX, 1);
	context.lineTo(canvasObj.width-1, canvasObj.height-1);
	context.lineTo(1, canvasObj.height-1);
	context.stroke();
	context.fill();
	return canvasElem;
}

JSDiagram.addOctagon = function (stateObj_p) {
	var context = null;
	if (stateObj_p.diamondCanvas==null) {
		var htmlC = "<canvas style='z-index:-1;position:absolute; top:0; left:0;' class='octagon " + stateObj_p.stateUID + "'></canvas>";
		var diamondElem = $(htmlC).appendTo(stateObj_p.stateElem);
		stateObj_p.diamondCanvas = $(diamondElem)[0];
		stateObj_p.diamondCanvas.width = stateObj_p.getWidth();
		stateObj_p.diamondCanvas.height = stateObj_p.getHeight();
		context = stateObj_p.diamondCanvas.getContext("2d");
	}
	else {
		context = stateObj_p.diamondCanvas.getContext("2d");
 		context.clearRect(0, 0, stateObj_p.diamondCanvas.width, stateObj_p.diamondCanvas.height);
  		stateObj_p.diamondCanvas.width = 1;
  		stateObj_p.diamondCanvas.width = stateObj_p.getWidth();
	}
	context.strokeStyle = "#333333";
	if (stateObj_p.stateColor) {
		context.fillStyle = stateObj_p.stateColor;
	}
   	context.beginPath();
   	var oWidth = stateObj_p.diamondCanvas.width;
   	var oHeight = stateObj_p.diamondCanvas.height;
	var offsetX = Math.round(oWidth * JSDiagram.switchLessThreshold);
	var offsetY = Math.round(oHeight * JSDiagram.switchLessThreshold);
	context.moveTo(offsetX, 1);
	context.lineTo(oWidth - offsetX, 1);
	context.lineTo(oWidth, offsetY);
	context.lineTo(oWidth, oHeight - offsetY);
	context.lineTo(oWidth - offsetX, oHeight);
	context.lineTo(offsetX, oHeight);
	context.lineTo(1, oHeight - offsetY);
	context.lineTo(1, offsetY);
	context.lineTo(offsetX, 1);
	context.stroke();
	if (stateObj_p.stateColor) {
		context.fill();
	}
	return;
}

JSDiagram.addOctagonHead = function (parentElem_p, elemID_p, 
 	class_p, color_p, left_p, top_p, width_p, height_p) {
	var context = null;
	var htmlC = "<canvas id='" + elemID_p + "'"
			+ " style='z-index:-1;position:absolute; top: " 
			+ top_p + "px; left: " + left_p + "px; width:" + width_p 
			+ "px; height:" + height_p + "px;' class='octagon " 
			+ class_p + "'></canvas>";
	var canvasElem = $(htmlC).appendTo(parentElem_p);
	canvasObj = $(canvasElem)[0];
	canvasObj.width = width_p;
	canvasObj.height = height_p;
	var offsetX = Math.round(canvasObj.width * JSDiagram.switchLessThreshold);
	var offsetY = canvasObj.height;
	context = canvasObj.getContext("2d");
	context.strokeStyle = color_p;
	context.fillStyle = color_p;
   	context.beginPath();
	context.moveTo(offsetX, 1);
	context.lineTo(canvasObj.width - offsetX, 1);
	context.lineTo(canvasObj.width, offsetY);
	context.lineTo(1, offsetY);
	context.lineTo(offsetX, 1);
	context.stroke();
	context.fill();
	return canvasElem;
}

JSDiagram.addSwimlane = function (swimlaneProp_p) {
	$("#" + swimlaneProp_p.uid).remove();
	
	var htmlCode = "<div id='" + swimlaneProp_p.uid + "' class='swimlane " + swimlaneProp_p.orient + "' style='" + swimlaneProp_p.style + "'>"
		+ "<table border=0 cellspacing=0 cellpading=0 width=100% height=100%>";
	var totalSize = 0;
	if (swimlaneProp_p.orient=="vertical") {
		htmlCode += "<tr class=header><td align=center class='swimlText' colspan=" + swimlaneProp_p.laneCount + ">" + swimlaneProp_p.name + "</td></tr>"
			+ "<tr class=laneHeader>";
		for (var i=0; i<swimlaneProp_p.laneCount; i++) {
			htmlCode += "<td id=s" + i + " class='laneHeader' align=center height=20 width='" + swimlaneProp_p.lanes[i].size + "'>" + swimlaneProp_p.lanes[i].name + "</td>";
			totalSize += parseInt(swimlaneProp_p.lanes[i].size);
		}
		htmlCode += "</tr><tr>";
		htmlCode += "</tr>";
	}
	else {
		var vText = swimlaneProp_p.name.replace(/ /g, '&nbsp;');
		htmlCode += "<tr id=s1><td valign=middle class='header' width='1%' rowspan=" + swimlaneProp_p.laneCount + "><div class='swimText vertical'>" + vText + "</div></td>"
			+ "<td class='laneHeader' valign=middle align=center width=1%><div class='swimText vertical'>" + swimlaneProp_p.lanes[0].name.replace(/ /g, '&nbsp;') + "</div></td>"
			+ "<td width='*' class=lane height='" + swimlaneProp_p.lanes[0].size + "'>&nbsp;</td></tr>";
		totalSize += parseInt(swimlaneProp_p.lanes[0].size);
		for (var i=1; i<swimlaneProp_p.laneCount; i++) {
			htmlCode += "<tr><td laneID=" + i + " class='laneHeader' valign=middle><div class='swimText vertical'>" + swimlaneProp_p.lanes[i].name.replace(/ /g, '&nbsp;') + "</div></td><td class='lane' height='" + swimlaneProp_p.lanes[i].size + "'>&nbsp;</td></tr>";
			totalSize += parseInt(swimlaneProp_p.lanes[i].size);
		}
	}
	var resizeDir = "s";
	if (swimlaneProp_p.orient=="vertical") resizeDir = "e";
	htmlCode += "</table></div>";
	
	var sLane = $(htmlCode).appendTo(JSDiagram.modelCanvas);
	
	$(sLane).draggable().draggable({
			drag: function(event, ui) {
				JSDiagram.dragEvent = null;
	    		JSDiagram.dragUI = null;
	    		var horOrient = $(ui.helper).hasClass("horizontal");
				JSDiagram.dragDivStartX = -1;
	    		
				if (!horOrient && ui.position.left <0 ||
					horOrient && ui.position.top <0) {
					return false;
				}
			},
			handle: ".header, .laneHeader",
			stop: function(event, ui) {
				var newPos = 0;
				if (swimlaneProp_p.orient=="vertical") {
					newSize = $(ui.helper).css("left");
				}
				else {
					newSize = $(ui.helper).css("top");
				}
				JSDiagram.callbackFunc ('swimlane', $(this).attr("id"), 'move', newSize);
			},
			helper: "original",
			zIndex: 0,
			containment: "parent",
			scroll: true
		});
		
		$(sLane).find(".header, .laneHeader").dblclick(function() {
			JSDiagram.callbackFunc('swimlane', $(this).parents("div").attr("id"), 'dblclick', '');
		})
		.contextMenu(JSDiagram.swimlaneCtxMenuBindings.menuID, {
			bindings: JSDiagram.swimlaneCtxMenuBindings,
			onContextMenu: function (e) {
				return true;
			},
	    	'onShowMenu': function(e, menu) {
	    		if (JSDiagram.swimlaneCtxMenuBindings.onShowMenu) {
	    			JSDiagram.swimlaneCtxMenuBindings.onShowMenu (e, menu);
	    		}
	    		return menu;
	    	},
		  	'menuStyle': swimlaneCtxMenuBindings.menuStyle,
    		'listingStyle': swimlaneCtxMenuBindings.itemStyle,
    		'itemHoverStyle': swimlaneCtxMenuBindings.itemHoverStyle
		});
		
	if (swimlaneProp_p.orient=="vertical") {
 		$(sLane).css("left", swimlaneProp_p.offset).css("width", totalSize);
		$(sLane).draggable("option", "axis", "x");
		var cumLeft = 0;
		for (var i=0; i<swimlaneProp_p.laneCount; i++) {
			cumLeft += parseInt(swimlaneProp_p.lanes[i].size);
			var dividerTop = "25px";
			if (i==swimlaneProp_p.laneCount-1) {
				dividerTop = "0px";
			}
			$("<div class='hDivider' uid='" + swimlaneProp_p.uid + "' laneID='" + i + "'>&nbsp;</div>").appendTo($(sLane))
				.css("left", cumLeft+"px").css("top", dividerTop)
				.draggable()
				.draggable({
					start: function(event, ui) {
						JSDiagram.swimStart = JSDiagram.getCssPx(ui.helper,"left");
					},
					stop: function(event, ui) {
						var delta = parseInt(JSDiagram.getCssPx(ui.helper, "left")) - parseInt(JSDiagram.swimStart);
						var laneID = $(ui.helper).attr("laneID");
						JSDiagram.callbackFunc ('swimlane', $(ui.helper).attr("uid"), 'resize', laneID, delta);
					}
				});
		}
 	}
 	else {
 		$(sLane).css("top", swimlaneProp_p.offset).css("height", totalSize);
		$(sLane).draggable("option", "axis", "y");
		var topAdjust = -swimlaneProp_p.name.length * 10 /2;
 	
	 	$(sLane).find(".vertical").stop().animate( 
	 		{ rotation: 360},
		  	{ duration: 500, step: function(now, fx) {
		      		$(this).css({"transform": "rotate(90deg)"});
		    	}
			}
		).css("width","25px").show();
		$(sLane).find(".vertical").each (function() {
			var adjust = $(this).text().length*6/2;
		 	$(this).css("top", (-adjust) +"px");
		});
		
		var cumTop = 0;
		for (var i=0; i<swimlaneProp_p.laneCount; i++) {
			cumTop += parseInt(swimlaneProp_p.lanes[i].size);
			var dividerLeft = "37px";
			if (i==swimlaneProp_p.laneCount-1) {
				dividerLeft = "0px";
			}
			
			var dividerPos = 0;
			$("<div class='vDivider' uid='" + swimlaneProp_p.uid + "' laneID='" + i + "'>&nbsp;</div>").appendTo($(sLane))
				.css("top", cumTop+"px").css("left", dividerLeft)
				.draggable()
				.draggable({
					start: function(event, ui) {
						JSDiagram.swimStart = JSDiagram.getCssPx(ui.helper,"top");
					},
					stop: function(event, ui) {
						var delta = parseInt(JSDiagram.getCssPx(ui.helper, "top")) - parseInt(JSDiagram.swimStart);
						var laneID = $(ui.helper).attr("laneID");
						JSDiagram.callbackFunc ('swimlane', $(ui.helper).attr("uid"), 'resize', laneID, delta);

					}, helper: "clone"
				});
		}
 	}
}

JSDiagram.swimStart = 0;


JSDiagram.clearSwimlanes = function () {
	$(".swimlane").remove();
}


JSDiagram.addBox = function (boxProp_p) {
	$("#" + boxProp_p.uid).remove();
	var htmlCode = "<div id='" + boxProp_p.uid + "' class='box'/>"
	var sBox = $(htmlCode).appendTo(JSDiagram.modelCanvas);
	htmlCode = "<div class='head' style='overflow:hidden; white-space:pre;'><center><span class='label'></span></center></div>";
	$(htmlCode).appendTo(sBox);
	JSDiagram.updateBox (boxProp_p);
	
	$(sBox).draggable().draggable({
		drag: function(event, ui) {
			JSDiagram.dragEvent = event;
			JSDiagram.dragUI = ui;
		},
		start: function (event,ui) {
			JSDiagram.boxStart.left = parseInt(JSDiagram.getCssPx(ui.helper, "left"));
			JSDiagram.boxStart.top = parseInt(JSDiagram.getCssPx(ui.helper, "top"));
		},
		stop: function(event, ui) {
			var left = parseInt(JSDiagram.getCssPx(ui.helper,"left"));
			var top = parseInt(JSDiagram.getCssPx(ui.helper,"top"));
			$(sBox).css("left", left+"px").css("top",top+"px");
			JSDiagram.callbackFunc ('box', $(this).attr("id"), 'move', {left: left, top: top});
			JSDiagram.clearDrag();
		}, helper: "clone"
	})
	.resizable({handles: "e,w,s,n,se", autoHide: true}).resizable ({
		start: function(event,ui) {
			JSDiagram.dragEvent = event;
			JSDiagram.dragUI = ui;
		},
		resize: function(event,ui) {
		},
		stop: function(event,ui) {
			JSDiagram.callbackFunc('box', $(this).attr("id"), 'resize', {width: parseInt(JSDiagram.getCssPx(ui.helper,"width")), height: parseInt(JSDiagram.getCssPx(ui.helper,"height"))}, '');
			JSDiagram.clearDrag();
		}
	});
	
	$(sBox).find(".head").dblclick(function() {
		JSDiagram.callbackFunc('box', $(this).parents("div").attr("id"), 'dblclick', '');
	})
	.contextMenu(JSDiagram.boxCtxMenuBindings.menuID, {
		bindings: JSDiagram.boxCtxMenuBindings,
		onContextMenu: function (e) {
			return true;
		},
    	'onShowMenu': function(e, menu) {
    		if (JSDiagram.boxCtxMenuBindings.onShowMenu) {
    			JSDiagram.boxCtxMenuBindings.onShowMenu (e, menu);
    		}
    		return menu;
    	},
	  	'menuStyle': boxCtxMenuBindings.menuStyle,
		'listingStyle': boxCtxMenuBindings.itemStyle,
		'itemHoverStyle': boxCtxMenuBindings.itemHoverStyle
	});
}

JSDiagram.boxStart = {};
JSDiagram.updateBox = function (boxProp_p) {
	$("#"+boxProp_p.uid).css({left: boxProp_p.left + "px",
		top: boxProp_p.top + "px",
		width: boxProp_p.width + "px",
		height: boxProp_p.height + "px",
		"border-style": boxProp_p.borderStyle,
		"border-width": boxProp_p.borderWidth + "px",
		"border-color": boxProp_p.color});
	$("#"+boxProp_p.uid + " .label").html(boxProp_p.name);
	$("#"+boxProp_p.uid + " .head").css({"background-color": boxProp_p.color, "color": boxProp_p.textColor});
}

JSDiagram.clearBoxes = function () {
	$(".box").remove();
}

