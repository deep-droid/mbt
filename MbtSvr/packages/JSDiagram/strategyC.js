// Normal C shape (start segment Left), end segment going right
JSDiagram.C_minSegLength = 10;

JSDiagram.Strategy_Right_C = function () {
	this.strategyName = "Right_C";
	this.InitMidOffset = 15;
	
	this.isApplicable = function(path_p) {
//		var cHeight;

		path_p.startLeft = path_p.sourceLeft + path_p.sourceWidth;
		path_p.endLeft = path_p.destinationLeft + path_p.destinationWidth;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.RIGHT;
		path_p.seg3Orient = JSDiagram.LEFT;

		var endMinusStart = path_p.endLeft - path_p.startLeft;
		// test if start seg is blocked by dest state
//		if (endMinusStart >= 0 && path_p.startTop >= path_p.destinationTop && 
//			path_p.startTop <= path_p.destinationTop + path_p.destinationHeight) {
//			return false;
//		}
//		else if (endMinusStart < 0 && path_p.endTop >= path_p.sourceTop && 
//			path_p.endTop <= path_p.sourceTop + path_p.sourceHeight)  {
//			return false;
//		}
		
//		this.cHeight = Math.abs(path_p.endTop - path_p.startTop);
//		var delta = Math.floor(this.cHeight * path_p.trans.midFract);
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		else if (path_p.trans.midOffset < JSDiagram.C_minSegLength) path_p.trans.midOffset = JSDiagram.C_minSegLength;
		var delta = path_p.trans.midOffset;
		if (endMinusStart <= 0) {
			path_p.seg0Length = delta;
			path_p.seg3Length = Math.abs(endMinusStart) + delta;
		}
		else {
			path_p.seg0Length = Math.abs(endMinusStart) + delta;
			path_p.seg3Length = delta;
		}
		
		if (path_p.startTop <= path_p.endTop) {
			path_p.seg1Orient = JSDiagram.DOWN;
		}
		else path_p.seg1Orient = JSDiagram.UP;

		path_p.seg1Length = Math.abs(path_p.startTop - path_p.endTop);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
		
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.UP;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.DOWN;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			var cHeight = Math.abs(trans_p.lastPath.startTop - trans_p.lastPath.endTop);
//			trans_p.midFract = ((JSDiagram.getCssPx(trans_p.segElemList[1], "left") - trans_p.lastPath.seg1Left) + Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length)) / cHeight;
			trans_p.midOffset = ((JSDiagram.getCssPx(trans_p.segElemList[1], "left") - trans_p.lastPath.seg1Left) + Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length));
			if (trans_p.midOffset <= 0) {
				if (Math.abs(trans_p.lastPath.seg0Length - trans_p.lastPath.seg3Length) <= 15) { // vertically lined up closely
					var srcDescGap = Math.min(Math.abs(trans_p.lastPath.sourceTop - trans_p.lastPath.destinationTop - trans_p.lastPath.destinationHeight),
							Math.abs(trans_p.lastPath.sourceTop+trans_p.lastPath.sourceHeight - trans_p.lastPath.destinationTop));
					if (srcDescGap > 15) {
						trans_p.startOrientPref = JSDiagram.VERTICAL;
						trans_p.endOrientPref = JSDiagram.VERTICAL;
						trans_p.midFract = 0.25;
						trans_p.startFract = 0.9;
						trans_p.endFract = 0.9;
						trans_p.midOffset = this.InitMidOffset;
					}
					else {
						trans_p.startOrientPref = JSDiagram.LEFT;
						trans_p.endOrientPref = JSDiagram.RIGHT;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					ret = false;
				}
				else {
					if (trans_p.lastPath.seg0Length <= trans_p.lastPath.seg3Length) {
						trans_p.startOrientPref = JSDiagram.VERTICAL;
						trans_p.startFract = 0.9;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
					else {
						trans_p.endOrientPref = JSDiagram.VERTICAL;
						trans_p.endFract = 0.9;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
				}
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.DOWN;
				trans_p.endFract = 0.9;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.UP;
				trans_p.endFract = 0.9;
				ret = false;
			}
		}
		return ret;
	}
}


// Normal C shape (start segment Left)
JSDiagram.Strategy_Left_C = function () {
	this.strategyName = "Left_C";
	this.InitMidOffset = 15;

	this.isApplicable = function(path_p) {
//		var cHeight = 10;
		path_p.startLeft = path_p.sourceLeft;
		path_p.endLeft = path_p.destinationLeft;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.LEFT;
		path_p.seg3Orient = JSDiagram.RIGHT;

//		this.cHeight = Math.abs(path_p.endTop - path_p.startTop);
		var startMinusEnd = path_p.startLeft - path_p.endLeft;
//		if (startMinusEnd >= 0 && path_p.startTop >= path_p.destinationTop && 
//			path_p.startTop <= path_p.destinationTop + path_p.destinationHeight) {
//			return false;
//		}
//		if (startMinusEnd <= 0 && path_p.endTop >= path_p.sourceTop && 
//			path_p.endTop <= path_p.sourceTop + path_p.sourceHeight)  {
//			return false;
//		}

//		var delta = Math.floor(this.cHeight * path_p.trans.midFract);
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		else if (path_p.trans.midOffset < JSDiagram.C_minSegLength) path_p.trans.midOffset = JSDiagram.C_minSegLength;
		var delta = path_p.trans.midOffset;

		if (startMinusEnd >= 0) {
			path_p.seg0Length = Math.abs(startMinusEnd) + delta;
			path_p.seg3Length = delta;
		}
		else {
			path_p.seg0Length = delta;
			path_p.seg3Length = Math.abs(startMinusEnd) + delta;
		}

		
		if (path_p.startTop <= path_p.endTop) {
			path_p.seg1Orient = JSDiagram.DOWN;
		}
		else path_p.seg1Orient = JSDiagram.UP;

		path_p.seg1Length = Math.abs(path_p.endTop - path_p.startTop);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.UP;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.startFract = 0.1;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.DOWN;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.startFract = 0.1;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			var cHeight = Math.abs(trans_p.lastPath.startTop - trans_p.lastPath.endTop);
//			trans_p.midFract = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (trans_p.lastPath.seg1Left - JSDiagram.getCssPx(trans_p.segElemList[1], "left"))) / cHeight;
			trans_p.midOffset = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (trans_p.lastPath.seg1Left - JSDiagram.getCssPx(trans_p.segElemList[1], "left")));
			
			if (trans_p.midOffset <= 0) {
				if (Math.abs(trans_p.lastPath.seg0Length - trans_p.lastPath.seg3Length) <= 15) {
					var srcDescGap = Math.min(Math.abs(trans_p.lastPath.sourceTop - trans_p.lastPath.destinationTop - trans_p.lastPath.destinationHeight),
							Math.abs(trans_p.lastPath.sourceTop+trans_p.lastPath.sourceHeight - trans_p.lastPath.destinationTop));
					if (srcDescGap > 15) {
						trans_p.startOrientPref = JSDiagram.VERTICAL;
						trans_p.endOrientPref = JSDiagram.VERTICAL;
						trans_p.startFract = 0.1;
						trans_p.endFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					else {
						trans_p.startOrientPref = JSDiagram.RIGHT;
						trans_p.endOrientPref = JSDiagram.LEFT;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					ret = false;
				}
				else { // turn it to L or other
					if (trans_p.lastPath.seg0Length <= trans_p.lastPath.seg3Length) {
						trans_p.startOrientPref = JSDiagram.VERTICAL;
						trans_p.startFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
					else {
						trans_p.endOrientPref = JSDiagram.VERTICAL;
						trans_p.endFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
				}

			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.DOWN;
				trans_p.endFract = 0.1;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.UP;
				trans_p.endFract = 0.1;
				ret = false;
			}
		}
		return ret;
	}
}



// n shape (start segment UP)
JSDiagram.Strategy_Up_U = function () {
	this.strategyName = "UP_U";
	this.InitMidOffset = 15;

	this.isApplicable = function(path_p) {
//		var cHeight;

		path_p.startLeft = Math.floor(path_p.sourceLeft + path_p.sourceWidth * path_p.trans.startFract);
		path_p.endLeft = Math.floor(path_p.destinationLeft + path_p.destinationWidth * path_p.trans.endFract);
		path_p.startTop = path_p.sourceTop;
		path_p.endTop = path_p.destinationTop;
		path_p.seg0Orient = JSDiagram.UP;
		path_p.seg3Orient = JSDiagram.DOWN;

		var startMinusEndGap = path_p.startTop - path_p.endTop;
//		if (startMinusEndGap >= 0 && path_p.startLeft >= path_p.destinationLeft &&
//			path_p.startLeft <= path_p.destinationLeft + path_p.destinationWidth) {
//			return false;
//		}
//		if (startMinusEndGap <=0 && path_p.endLeft >= path_p.sourceLeft && 
//			path_p.endLeft <= path_p.sourceLeft + path_p.sourceWidth)  {
//			return false;
//		}
		
//		this.cHeight = Math.abs(path_p.startLeft - path_p.endLeft);
//		var delta = Math.floor(this.cHeight * path_p.trans.midFract);
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		else if (path_p.trans.midOffset < JSDiagram.C_minSegLength) path_p.trans.midOffset = JSDiagram.C_minSegLength;
		var delta = path_p.trans.midOffset;
		if (startMinusEndGap <=0) {
			path_p.seg0Length = delta;
			path_p.seg3Length = Math.abs(startMinusEndGap) + delta;
		}
		else {
			path_p.seg0Length = Math.abs(startMinusEndGap) + delta;
			path_p.seg3Length = delta;
		}
		
		if (path_p.startLeft <= path_p.endLeft) {
			path_p.seg1Orient = JSDiagram.RIGHT;
		}
		else path_p.seg1Orient = JSDiagram.LEFT;

		path_p.seg1Length = Math.abs(path_p.startLeft - path_p.endLeft);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.LEFT;
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.startFract = 0.1;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.RIGHT;
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.startFract = 0.1;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
			var cHeight = Math.abs(trans_p.lastPath.startLeft - trans_p.lastPath.endLeft);
//			trans_p.midFract = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (trans_p.lastPath.seg1Top - JSDiagram.getCssPx(trans_p.segElemList[1], "top"))) / cHeight;
			trans_p.midOffset = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (trans_p.lastPath.seg1Top - JSDiagram.getCssPx(trans_p.segElemList[1], "top")));

			if (trans_p.midOffset <= 0) {
				if (Math.abs(trans_p.lastPath.seg0Length - trans_p.lastPath.seg3Length) <= 15) {
					var srcDescGap = Math.min(Math.abs(trans_p.lastPath.sourceLeft - trans_p.lastPath.destinationLeft - trans_p.lastPath.destinationWidth),
							Math.abs(trans_p.lastPath.sourceLeft+trans_p.lastPath.sourceWidth - trans_p.lastPath.destinationLeft));
					if (srcDescGap > 15) {
						trans_p.startOrientPref = JSDiagram.HORIZONTAL;
						trans_p.endOrientPref = JSDiagram.HORIZONTAL;
						trans_p.startFract = 0.1;
						trans_p.endFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					else {
						trans_p.startOrientPref = JSDiagram.DOWN;
						trans_p.endOrientPref = JSDiagram.UP;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					ret = false;
				}
				else { // turn to L or other
					if (trans_p.lastPath.seg0Length <= trans_p.lastPath.seg3Length) {
						trans_p.startOrientPref = JSDiagram.HORIZONTAL;
						trans_p.startFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
					else {
						trans_p.endOrientPref = JSDiagram.HORIZONTAL;
						trans_p.endFract = 0.1;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
				}
			}
			else if (trans_p.midFract >= 1.0) {
				trans_p.startOrient = JSDiagram.DOWN;
				trans_p.midFract = 0.5;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.RIGHT;
				trans_p.endFract = 0.9;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.LEFT;
				trans_p.endFract = 0.9;
				ret = false;
			}
		}
		return ret;
	}
}


// up-side-down u shape (start segment DOWN)
JSDiagram.Strategy_Down_U = function () {
	this.strategyName = "Down_U";
	this.InitMidOffset = 15;

	this.isApplicable = function(path_p) {
//		var cHeight;
		path_p.startLeft = Math.floor(path_p.sourceLeft + path_p.sourceWidth * path_p.trans.startFract);
		path_p.endLeft = Math.floor(path_p.destinationLeft + path_p.destinationWidth * path_p.trans.endFract);
		path_p.startTop = path_p.sourceTop + path_p.sourceHeight;
		path_p.endTop = path_p.destinationTop + path_p.destinationHeight;
		path_p.seg0Orient = JSDiagram.DOWN;
		path_p.seg3Orient = JSDiagram.UP;

		var startMinusEndGap = path_p.startTop - path_p.endTop;
//		if (startMinusEndGap <= 0 && path_p.startLeft >= path_p.destinationLeft &&
//			 path_p.startLeft <= path_p.destinationLeft + path_p.destinationWidth) {
//			return false;
//		}
//		if (startMinusEndGap >= 0 && path_p.endLeft >= path_p.sourceLeft &&
//			path_p.endLeft <= path_p.sourceLeft + path_p.sourceWidth)  {
//			return false;
//		}
		
//		this.cHeight = Math.abs (path_p.startLeft - path_p.endLeft);
//		var delta = Math.floor( this.cHeight * path_p.trans.midFract)
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		else if (path_p.trans.midOffset < JSDiagram.C_minSegLength) path_p.trans.midOffset = JSDiagram.C_minSegLength;
		var delta = path_p.trans.midOffset;
		if (startMinusEndGap <=0) {
			path_p.seg0Length = Math.abs(startMinusEndGap) + delta;
			path_p.seg3Length = delta;
		}
		else {
			path_p.seg0Length = delta;
			path_p.seg3Length = Math.abs(startMinusEndGap) + delta;
		}
		if (path_p.startLeft <= path_p.endLeft) {
			path_p.seg1Orient = JSDiagram.RIGHT;
		}
		else path_p.seg1Orient = JSDiagram.LEFT;

		path_p.seg1Length = Math.abs (path_p.startLeft - path_p.endLeft);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.LEFT;
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.RIGHT;
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			var cHeight = Math.abs(trans_p.lastPath.startLeft - trans_p.lastPath.endLeft);
//			trans_p.midFract = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (JSDiagram.getCssPx(trans_p.segElemList[1], "top") - trans_p.lastPath.seg1Top)) / cHeight;
			trans_p.midOffset = (Math.min(trans_p.lastPath.seg0Length, trans_p.lastPath.seg3Length) + (JSDiagram.getCssPx(trans_p.segElemList[1], "top") - trans_p.lastPath.seg1Top));
			if (trans_p.midOffset <= 0) {
				if (Math.abs(trans_p.lastPath.seg0Length - trans_p.lastPath.seg3Length) <= 15) {
					var srcDescGap = Math.min(Math.abs(trans_p.lastPath.sourceLeft - trans_p.lastPath.destinationLeft - trans_p.lastPath.destinationWidth),
							Math.abs(trans_p.lastPath.sourceLeft+trans_p.lastPath.sourceWidth - trans_p.lastPath.destinationLeft));
					if (srcDescGap > 15) {
						trans_p.startOrientPref = JSDiagram.HORIZONTAL;
						trans_p.endOrientPref = JSDiagram.HORIZONTAL;
						trans_p.startFract = 0.9;
						trans_p.endFract = 0.9;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					else {
						trans_p.startOrientPref = JSDiagram.UP;
						trans_p.endOrientPref = JSDiagram.DOWN;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
					}
					ret = false;
				}
				else {
					if (trans_p.lastPath.seg0Length <= trans_p.lastPath.seg3Length) {
						trans_p.startOrientPref = JSDiagram.HORIZONTAL;
						trans_p.startFract = 0.9;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
					else {
						trans_p.endOrientPref = JSDiagram.HORIZONTAL;
						trans_p.endFract = 0.9;
						trans_p.midFract = 0.25;
						trans_p.midOffset = this.InitMidOffset;
						ret = false;
					}
				}
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.RIGHT;
				trans_p.endFract = 0.9;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.LEFT;
				trans_p.endFract = 0.9;
				ret = false;
			}
		}
		return ret;
	}
}


JSDiagram.strategies.push (new JSDiagram.Strategy_Left_C());
JSDiagram.strategies.push (new JSDiagram.Strategy_Right_C());
JSDiagram.strategies.push (new JSDiagram.Strategy_Up_U());
JSDiagram.strategies.push (new JSDiagram.Strategy_Down_U());

