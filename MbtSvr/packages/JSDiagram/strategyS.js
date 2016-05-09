JSDiagram.S_minMidSegLength = 5;
JSDiagram.S_minGap = 20;
		
JSDiagram.Strategy_Right_Z = function () {
	this.strategyName = "Right_Z";
	this.isApplicable = function(path_p) {

		var gap;

		path_p.startLeft = path_p.sourceLeft + path_p.sourceWidth;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.RIGHT;
		path_p.seg3Orient = JSDiagram.RIGHT;
		
		// straight line if mid seg length < JSDiagram.S_minMidSegLength
		if (Math.abs(path_p.startTop - path_p.endTop)<=JSDiagram.S_minMidSegLength) {
			path_p.endTop = path_p.startTop;
		}
		
		gap = path_p.endLeft - path_p.startLeft;
		if (gap < JSDiagram.S_minGap) { 
			return false;
		}

		gap = Math.abs(gap);
		path_p.seg0Length = Math.floor(gap * path_p.trans.midFract);
		path_p.seg3Length = gap - path_p.seg0Length;
		path_p.seg1Length = Math.abs(path_p.startTop - path_p.endTop);
		if (path_p.startTop <= path_p.endTop) {
			path_p.seg1Orient = JSDiagram.DOWN;
		}
		else {
			path_p.seg1Orient = JSDiagram.UP;
		}
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
			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[1], "left") - trans_p.lastPath.startLeft) / (trans_p.lastPath.endLeft - trans_p.lastPath.startLeft);
			if (trans_p.midFract <= 0) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.AUTO;
				trans_p.startFract = 0.9;
				trans_p.midFract = 0.25;
				ret = false;
			}
			else if (trans_p.midFract >= 1.0) {
				trans_p.startOrientPref = JSDiagram.AUTO;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.endFract = 0.1;
				trans_p.midFract = 0.25;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.DOWN;
				trans_p.endFract =  0.1;
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



JSDiagram.Strategy_Left_Z = function () {
	this.strategyName = "Left_Z";
	
	this.isApplicable = function(path_p) {
		var gap;
		path_p.startLeft = path_p.sourceLeft;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft + path_p.destinationWidth;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.LEFT;
		path_p.seg3Orient = JSDiagram.LEFT;

		// straight line if mid seg length < JSDiagram.S_minMidSegLength
		if (Math.abs(path_p.startTop - path_p.endTop)<=JSDiagram.S_minMidSegLength) {
			path_p.endTop = path_p.startTop;
		}
		
		gap = path_p.startLeft - path_p.endLeft;
		if (gap < JSDiagram.S_minGap) {
			return false;
		}

		gap = Math.abs (gap);
		path_p.seg0Length = Math.floor(gap * path_p.trans.midFract);
		path_p.seg3Length = gap - path_p.seg0Length;
		path_p.seg1Length = Math.abs(path_p.startTop - path_p.endTop);
		if (path_p.startTop <= path_p.endTop) {
			path_p.seg1Orient = JSDiagram.DOWN;
		}
		else {
			path_p.seg1Orient = JSDiagram.UP;
		}
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	// only change the connector's fract attrs.
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
			trans_p.midFract = (trans_p.lastPath.startLeft - JSDiagram.getCssPx(trans_p.segElemList[1], "left")) / (trans_p.lastPath.startLeft - trans_p.lastPath.endLeft);
			if (trans_p.midFract <= 0) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.AUTO;
				trans_p.startFract = 0.1;
				trans_p.midFract = 0.25;
				ret = false;
			}
			else if (trans_p.midFract >= 1.0) {
				trans_p.startOrientPref = JSDiagram.AUTO;
				trans_p.endOrientPref = JSDiagram.VERTICAL;
				trans_p.endFract = 0.9;
				trans_p.midFract = 0.25;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.VERTICAL;
				trans_p.endOrientPref = JSDiagram.DOWN;
				trans_p.endFract =  0.9;
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


JSDiagram.Strategy_Up_Z = function () {
	this.strategyName = "Up_Z";

	this.isApplicable = function(path_p) {
		var gap;
	
		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth  * path_p.trans.startFract);
		path_p.startTop = path_p.sourceTop;
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);
		path_p.endTop = path_p.destinationTop + path_p.destinationHeight;
		path_p.seg0Orient = JSDiagram.UP;
		path_p.seg3Orient = JSDiagram.UP;

		// straight line if mid seg length < JSDiagram.S_minMidSegLength
		if (Math.abs(path_p.startLeft - path_p.endLeft)<=JSDiagram.S_minMidSegLength) {
			path_p.endLeft = path_p.startLeft;
		}
		
		gap = path_p.startTop - path_p.endTop;
		if (gap < JSDiagram.S_minGap) {
			return false;
		}
		gap = Math.abs(gap);
		path_p.seg0Length = Math.floor(gap * path_p.trans.midFract);
		path_p.seg3Length = gap - path_p.seg0Length;
		path_p.seg1Length = Math.abs(path_p.startLeft - path_p.endLeft);
		if (path_p.startLeft <= path_p.endLeft) {
			path_p.seg1Orient = JSDiagram.RIGHT;
		}
		else {
			path_p.seg1Orient = JSDiagram.LEFT;
		}
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
			trans_p.midFract = (trans_p.lastPath.startTop - JSDiagram.getCssPx(trans_p.segElemList[1], "top")) / (trans_p.lastPath.startTop - trans_p.lastPath.endTop);
			if (trans_p.midFract <= 0) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.AUTO;
				trans_p.startFract = 0.1;
				trans_p.midFract = 0.25;
				ret = false;
			}
			else if (trans_p.midFract >= 1.0) {
				trans_p.startOrientPref = JSDiagram.AUTO;
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endFract = 0.9;
				trans_p.midFract = 0.25;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.endOrientPref = JSDiagram.RIGHT;
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endFract =  0.9;
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


JSDiagram.Strategy_Down_Z = function () {
	this.strategyName = "Down_Z";
	
	this.isApplicable = function(path_p) {
		var gap;
		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth  * path_p.trans.startFract);
		path_p.startTop = path_p.sourceTop + path_p.sourceHeight;
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);
		path_p.endTop = path_p.destinationTop;
		path_p.seg0Orient = JSDiagram.DOWN;
		path_p.seg3Orient = JSDiagram.DOWN;


		// straight line if mid seg length < JSDiagram.S_minMidSegLength
		if (Math.abs(path_p.startLeft - path_p.endLeft)<=JSDiagram.S_minMidSegLength) {
			path_p.endLeft = path_p.startLeft;
		}
		
		gap = path_p.endTop - path_p.startTop;
		if (gap < JSDiagram.S_minGap) {
			return false;
		}

		gap = Math.abs(gap);
		path_p.seg0Length = Math.floor(gap * path_p.trans.midFract);
		path_p.seg3Length = gap - path_p.seg0Length;
		path_p.seg1Length = Math.abs(path_p.startLeft - path_p.endLeft);
		if (path_p.startLeft <= path_p.endLeft) {
			path_p.seg1Orient = JSDiagram.RIGHT;
		}
		else {
			path_p.seg1Orient = JSDiagram.LEFT;
		}
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
			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[1], "top") - trans_p.lastPath.startTop) / (trans_p.lastPath.endTop - trans_p.lastPath.startTop);
			if (trans_p.midFract <= 0) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.AUTO;
				trans_p.startFract = 0.9;
				trans_p.midFract = 0.25;
				ret = false;
			}
			else if (trans_p.midFract >= 1.0) {
				trans_p.endOrientPref = JSDiagram.HORIZONTAL;
				trans_p.startOrientPref = JSDiagram.AUTO;
				trans_p.endFract = 0.1;
				trans_p.midFract = 0.25;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.RIGHT;
				trans_p.endFract =  0.1;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.HORIZONTAL;
				trans_p.endOrientPref = JSDiagram.LEFT;
				trans_p.endFract = 0.1;
				ret = false;
			}
		}
		return ret;
	}
}



JSDiagram.strategies.push (new JSDiagram.Strategy_Left_Z());
JSDiagram.strategies.push (new JSDiagram.Strategy_Right_Z());
JSDiagram.strategies.push (new JSDiagram.Strategy_Up_Z());
JSDiagram.strategies.push (new JSDiagram.Strategy_Down_Z());
