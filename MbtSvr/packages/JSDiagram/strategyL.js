// L strategy,  Normal L is Down_L (first segment direction)
JSDiagram.L_minGap = 0;

JSDiagram.Strategy_Right_L = function () {
	this.strategyName = "Right_L";
	
	this.isApplicable = function(path_p) {
		var gap;
	
		path_p.startLeft = path_p.sourceLeft + path_p.sourceWidth;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);

		gap = 	path_p.endLeft - path_p.startLeft;
		if (gap < 2 * JSDiagram.L_minGap ||
			Math.abs(path_p.startTop - path_p.endTop) < JSDiagram.L_minGap) {
			return false;
		}
		if (path_p.startTop >= path_p.destinationTop && 
			path_p.startTop <= path_p.destinationTop + path_p.destinationHeight) {
			return false;
		}

		if (path_p.startTop >= path_p.destinationTop) {
			path_p.endTop = path_p.destinationTop + path_p.destinationHeight;
			path_p.seg3Orient = JSDiagram.UP;
		}
		else {
			path_p.endTop = path_p.destinationTop;
			path_p.seg3Orient = JSDiagram.DOWN;
		}
		
		gap = Math.abs(gap);
		path_p.seg0Length = gap;
		path_p.seg0Orient = JSDiagram.RIGHT;
		path_p.seg1Length = 0;
		path_p.seg1Orient = path_p.seg0Orient;
		path_p.seg3Length = Math.abs(path_p.startTop - path_p.endTop);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
		
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	
	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchLessThreshold) {
				trans_p.startOrientPref = JSDiagram.UP;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.DOWN;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			var startTop = JSDiagram.getCssPx(trans_p.segElemList[0], "top");
			var endTop = JSDiagram.getCssPx(trans_p.segElemList[3], "top");
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchLessThreshold) {
				if (startTop <= endTop) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.1;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.RIGHT;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				if (startTop <= endTop) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.LEFT;
			}
		}
		return ret;
	}
}

JSDiagram.Strategy_Left_L = function () {
	this.strategyName = "Left_L";
	
	this.isApplicable = function(path_p) {
		var gap;
		path_p.startLeft = path_p.sourceLeft;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);

		gap = path_p.startLeft - path_p.endLeft;
		if (gap < 2 * JSDiagram.L_minGap ||
			Math.abs(path_p.startTop - path_p.endTop) < JSDiagram.L_minGap) {
			return false;
		}
		if (path_p.startTop >= path_p.destinationTop && 
			path_p.startTop <= path_p.destinationTop + path_p.destinationHeight) {
			return false;
		}


		if (path_p.startTop >= path_p.destinationTop) {
			path_p.endTop = path_p.destinationTop + path_p.destinationHeight;
			path_p.seg3Orient = JSDiagram.UP;
		}
		else {
			path_p.endTop = path_p.destinationTop;
			path_p.seg3Orient = JSDiagram.DOWN;
		}
		

		gap = Math.abs(gap);
		path_p.seg0Length = gap;
		path_p.seg0Orient = JSDiagram.LEFT;
		path_p.seg1Length = 0;
		path_p.seg1Orient = path_p.seg0Orient;
		path_p.seg3Length = Math.abs(path_p.startTop - path_p.endTop);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchLessThreshold) {
				trans_p.startOrientPref = JSDiagram.UP;
				trans_p.startFract = 0.1;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.DOWN;
				trans_p.startFract = 0.1;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			var startTop = JSDiagram.getCssPx(trans_p.segElemList[0], "top");
			var endTop = JSDiagram.getCssPx(trans_p.segElemList[3], "top");
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchLessThreshold) {
				if (startTop <= endTop) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.RIGHT;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				if (startTop <= endTop) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.LEFT;
			}
		}
		
		return ret;
	}
}


JSDiagram.Strategy_Up_L = function () {
	this.strategyName = "Up_L";
	
	this.isApplicable = function(path_p) {
		var gap;
		
		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth * path_p.trans.startFract);;
		path_p.startTop = path_p.sourceTop;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);

		gap = path_p.startTop - path_p.endTop;
		if (gap < 2 * JSDiagram.L_minGap ||
			Math.abs(path_p.startLeft - path_p.endLeft) < JSDiagram.L_minGap) {
			return false;
		}
		if (path_p.startLeft >= path_p.destinationLeft && 
			path_p.startLeft <= path_p.destinationLeft+path_p.destinationWidth) {
			return false;
		}
		
		if (path_p.startLeft < path_p.destinationLeft) {
			path_p.endLeft = path_p.destinationLeft;
			path_p.seg3Orient = JSDiagram.RIGHT;
		}
		else if (path_p.startLeft > path_p.destinationLeft + path_p.destinationWidth) {
			path_p.endLeft = path_p.destinationLeft + path_p.destinationWidth;
			path_p.seg3Orient = JSDiagram.LEFT;
		}


		gap = Math.abs(gap);
		path_p.seg0Length = gap;
		path_p.seg0Orient = JSDiagram.UP;
		path_p.seg1Length = 0;
		path_p.seg1Orient = path_p.seg0Orient;
		path_p.seg3Length = Math.abs(path_p.startLeft - path_p.endLeft);
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchLessThreshold) {
				trans_p.startOrientPref = JSDiagram.LEFT;
				trans_p.startFract = 0.1;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.RIGHT;
				trans_p.startFract = 0.1;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			var startLeft = JSDiagram.getCssPx(trans_p.segElemList[0], "left");
			var endLeft = JSDiagram.getCssPx(trans_p.segElemList[3], "left");
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchLessThreshold) {
				if (startLeft <= endLeft) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.DOWN;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				if (startLeft <= endLeft) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.UP;
			}
		}
		
		return ret;
	}
}



JSDiagram.Strategy_Down_L = function () {
	this.strategyName = "Down_L";
	
	this.isApplicable = function(path_p) {
		var gap;

		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth * path_p.trans.startFract);;
		path_p.startTop = path_p.sourceTop + path_p.sourceHeight;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);

		gap = path_p.endTop - path_p.startTop;
		if (gap < 2 * JSDiagram.L_minGap ||
			Math.abs(path_p.startLeft - path_p.endLeft) < JSDiagram.L_minGap) {
			return false;
		}
		
		if (path_p.startLeft >= path_p.destinationLeft && 
			path_p.startLeft <= path_p.destinationLeft+path_p.destinationWidth) {
			return false;
		}
		

		if (path_p.startLeft < path_p.destinationLeft) {
			path_p.endLeft = path_p.destinationLeft;
			path_p.seg3Orient = JSDiagram.RIGHT;
		}
		else if (path_p.startLeft > path_p.destinationLeft + path_p.destinationWidth) {
			path_p.endLeft = path_p.destinationLeft + path_p.destinationWidth;
			path_p.seg3Orient = JSDiagram.LEFT;
		}


		gap = Math.abs(gap);
		path_p.seg0Length = gap;
		path_p.seg0Orient = JSDiagram.DOWN;
		path_p.seg1Length = 0;
		path_p.seg1Orient = path_p.seg0Orient;
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.seg2Length = 0;
		path_p.seg3Length = Math.abs(path_p.startLeft - path_p.endLeft);
		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchLessThreshold) {
				trans_p.startOrientPref = JSDiagram.LEFT;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrientPref = JSDiagram.RIGHT;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			var startLeft = JSDiagram.getCssPx(trans_p.segElemList[0], "left");
			var endLeft = JSDiagram.getCssPx(trans_p.segElemList[3], "left");
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchLessThreshold) {
				if (startLeft <= endLeft) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.DOWN;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				if (startLeft <= endLeft) {
					trans_p.endFract = 0.1;
					ret = false;
				}
				else {
					trans_p.endFract = 0.9;
					ret = false;
				}
				trans_p.endOrientPref = JSDiagram.UP;
			}
		}
		return ret;
	}
}

JSDiagram.strategies.push (new JSDiagram.Strategy_Right_L());
JSDiagram.strategies.push (new JSDiagram.Strategy_Left_L());
JSDiagram.strategies.push (new JSDiagram.Strategy_Up_L());
JSDiagram.strategies.push (new JSDiagram.Strategy_Down_L());
