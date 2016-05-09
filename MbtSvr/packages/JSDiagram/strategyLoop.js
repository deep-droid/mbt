JSDiagram.Loop_minMidSegLength = 10;

JSDiagram.Strategy_Right_O = function () {
	this.strategyName = "Right_O";
	this.InitMidOffset = 15;
	
	this.isApplicable = function(path_p) {
//		var cornerLength;
		
		if (path_p.trans.srcUID!=path_p.trans.destUID) {
			return false;
		}

		path_p.startLeft = path_p.sourceLeft + path_p.sourceWidth;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);
		path_p.endTop = path_p.destinationTop;
		path_p.seg0Orient = JSDiagram.RIGHT;
		path_p.seg3Orient = JSDiagram.DOWN;

//		cornerLength = path_p.cornerLength();
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		path_p.seg0Length = path_p.trans.midOffset;
		path_p.seg3Length = path_p.seg0Length;
		path_p.seg1Orient = JSDiagram.UP;
		path_p.seg1Length = path_p.seg3Length + path_p.startTop - path_p.sourceTop;
		path_p.seg2Orient = JSDiagram.LEFT;
		path_p.seg2Length = path_p.seg0Length + path_p.destinationWidth - (path_p.endLeft - path_p.destinationLeft);

		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[2]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchLessThreshold) {
				trans_p.startOrient = JSDiagram.UP;
				trans_p.endOrient = JSDiagram.RIGHT;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.DOWN;
				trans_p.endOrient = JSDiagram.LEFT;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[1], "left") - trans_p.lastPath.startLeft) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = JSDiagram.getCssPx(trans_p.segElemList[1], "left") - trans_p.lastPath.startLeft;
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 2) {
//			trans_p.midFract = (trans_p.lastPath.endTop - JSDiagram.getCssPx(trans_p.segElemList[2], "top")) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = trans_p.lastPath.endTop - JSDiagram.getCssPx(trans_p.segElemList[2], "top");
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.RIGHT;
				trans_p.startOrient = JSDiagram.UP;
				trans_p.endFract = 0.2;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.LEFT;
				trans_p.startOrient = JSDiagram.DOWN;
				trans_p.endFract = 0.2;
				ret = false;
			}
		}
		return ret;
	}
}

JSDiagram.Strategy_Up_O = function () {
	this.strategyName = "Up_O";
	
	this.isApplicable = function(path_p) {
//		var cornerLength;
		if (path_p.trans.srcUID!=path_p.trans.destUID) {
			return false;
		}
		
		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth * path_p.trans.startFract);
		path_p.startTop = path_p.sourceTop;
		path_p.endLeft = path_p.destinationLeft;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.UP;
		path_p.seg3Orient = JSDiagram.RIGHT;

//		cornerLength = path_p.cornerLength();
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		path_p.seg0Length = path_p.trans.midOffset;
		path_p.seg3Length = path_p.seg0Length;
		path_p.seg1Orient = JSDiagram.LEFT;
		path_p.seg1Length = path_p.seg3Length + path_p.startLeft - path_p.sourceLeft;
		path_p.seg2Orient = JSDiagram.DOWN;
		path_p.seg2Length = path_p.seg0Length + path_p.endTop - path_p.destinationTop;

		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[2]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.LEFT;
				trans_p.endOrient = JSDiagram.UP;
				trans_p.startFract = 0.2;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.RIGHT;
				trans_p.endOrient = JSDiagram.DOWN;
				trans_p.startFract = 0.2;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			trans_p.midFract = (trans_p.lastPath.startTop - JSDiagram.getCssPx(trans_p.segElemList[1], "top")) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = trans_p.lastPath.startTop - JSDiagram.getCssPx(trans_p.segElemList[1], "top");
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 2) {
//			trans_p.midFract = (trans_p.lastPath.endLeft - JSDiagram.getCssPx(trans_p.segElemList[2], "left")) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = trans_p.lastPath.endLeft - JSDiagram.getCssPx(trans_p.segElemList[2], "left");
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.DOWN;
				trans_p.startOrient = JSDiagram.RIGHT;
				trans_p.endFract = 0.2;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.UP;
				trans_p.startOrient = JSDiagram.LEFT;
				trans_p.endFract = 0.2;
				ret = false;
			}
		}
		return ret;
	}
}


JSDiagram.Strategy_Left_O = function () {
	this.strategyName = "Left_O";
		
	this.isApplicable = function(path_p) {
//		var cornerLength;
		if (path_p.trans.srcUID!=path_p.trans.destUID) {
			return false;
		}
		
		path_p.startLeft = path_p.sourceLeft;
		path_p.startTop = path_p.sourceTop + Math.floor(path_p.sourceHeight * path_p.trans.startFract);
		path_p.endLeft = path_p.destinationLeft + Math.floor(path_p.destinationWidth * path_p.trans.endFract);
		path_p.endTop = path_p.destinationTop + path_p.destinationHeight;
		path_p.seg0Orient = JSDiagram.LEFT;
		path_p.seg3Orient = JSDiagram.UP;

//		cornerLength = path_p.cornerLength();
//		path_p.seg0Length = Math.floor(cornerLength * path_p.trans.midFract);
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		path_p.seg0Length = path_p.trans.midOffset;
		path_p.seg3Length = path_p.seg0Length;
		path_p.seg1Orient = JSDiagram.DOWN;
		path_p.seg1Length = path_p.seg3Length + path_p.sourceHeight - (path_p.startTop - path_p.sourceTop);
		path_p.seg2Orient = JSDiagram.RIGHT;
		path_p.seg2Length = path_p.seg0Length + path_p.endLeft - path_p.destinationLeft;

		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[2]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "x");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.UP;
				trans_p.endOrient = JSDiagram.RIGHT;
				trans_p.startFract = 0.2;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.DOWN;
				trans_p.endOrient = JSDiagram.LEFT;
				trans_p.startFract = 0.2;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			trans_p.midFract = (trans_p.lastPath.startLeft - JSDiagram.getCssPx(trans_p.segElemList[1], "left")) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = trans_p.lastPath.startLeft - JSDiagram.getCssPx(trans_p.segElemList[1], "left");
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 2) {
//			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[2], "top") - trans_p.lastPath.endTop) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = JSDiagram.getCssPx(trans_p.segElemList[2], "top") - trans_p.lastPath.endTop;
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.RIGHT;
				trans_p.startOrient = JSDiagram.UP;
				trans_p.endFract = 0.9;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.LEFT;
				trans_p.startOrient = JSDiagram.DOWN;
				trans_p.endFract = 0.9;
				ret = false;
			}
		}
		return ret;
	}
}


JSDiagram.Strategy_Down_O = function () {
	this.strategyName = "Down_O";
	this.InitMidOffset = 15;
	
	this.isApplicable = function(path_p) {
//		var cornerLength;

		if (path_p.trans.srcUID!=path_p.trans.destUID) {
			return false;
		}
		
		path_p.startLeft = path_p.sourceLeft + Math.floor(path_p.sourceWidth * path_p.trans.startFract);
		path_p.startTop = path_p.sourceTop + path_p.sourceHeight;
		path_p.endLeft = path_p.destinationLeft + path_p.destinationWidth;
		path_p.endTop = path_p.destinationTop + Math.floor(path_p.destinationHeight * path_p.trans.endFract);
		path_p.seg0Orient = JSDiagram.DOWN;
		path_p.seg3Orient = JSDiagram.LEFT;

//		cornerLength = path_p.cornerLength();
//		path_p.seg0Length = Math.floor(cornerLength * path_p.trans.midFract);
		if (path_p.trans.midOffset==undefined) path_p.trans.midOffset = this.InitMidOffset;
		path_p.seg0Length = path_p.trans.midOffset;
		path_p.seg3Length = path_p.seg0Length;
		path_p.seg1Orient = JSDiagram.RIGHT;
		path_p.seg1Length = path_p.seg3Length + path_p.sourceWidth - (path_p.startLeft - path_p.sourceLeft);
		path_p.seg2Orient = JSDiagram.UP;
		path_p.seg2Length = path_p.seg0Length + path_p.destinationHeight - (path_p.endTop - path_p.destinationTop);

		return true;
	}
	
	this.setContainment = function (path_p) {
		$(path_p.trans.segElemList[0]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[1]).draggable().draggable("option", "axis", "y");
		$(path_p.trans.segElemList[2]).draggable().draggable("option", "axis", "x");
		$(path_p.trans.segElemList[3]).draggable().draggable("option", "axis", "y");
	}

	this.dragSegment = function (trans_p, segIdx_p) {
		var ret = true;
		if (segIdx_p == 0) {
			if (trans_p.startFract<=0 || trans_p.srcState.isBranch() && trans_p.startFract<JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.LEFT;
				trans_p.endOrient = JSDiagram.UP;
				trans_p.startFract = 0.9;
				ret = false;
			}
			else if (trans_p.startFract>=1 || trans_p.srcState.isBranch() && trans_p.startFract>JSDiagram.branchMoreThreshold) {
				trans_p.startOrient = JSDiagram.RIGHT;
				trans_p.endOrient = JSDiagram.DOWN;
				trans_p.startFract = 0.9;
				ret = false;
			}
		}
		else if (segIdx_p == 1) {
//			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[1], "top") - trans_p.lastPath.startTop) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = JSDiagram.getCssPx(trans_p.segElemList[1], "top") - trans_p.lastPath.startTop;
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 2) {
//			trans_p.midFract = (JSDiagram.getCssPx(trans_p.segElemList[2], "left") - trans_p.lastPath.endLeft) / trans_p.lastPath.cornerLength();
			trans_p.midOffset = JSDiagram.getCssPx(trans_p.segElemList[2], "left") - trans_p.lastPath.endLeft;
			if (trans_p.midOffset < JSDiagram.Loop_minMidSegLength) {
				trans_p.midOffset = JSDiagram.Loop_minMidSegLength;
				ret = false;
			}
		}
		else if (segIdx_p == 3) {
			if (trans_p.endFract <= 0 || trans_p.destState.isBranch() && trans_p.endFract<JSDiagram.branchMoreThreshold) {
				trans_p.endOrient = JSDiagram.DOWN;
				trans_p.startOrient = JSDiagram.RIGHT;
				trans_p.endFract = 0.9;
				ret = false;
			}
			else if (trans_p.endFract>=1 || trans_p.destState.isBranch() && trans_p.endFract>0.5) {
				trans_p.endOrient = JSDiagram.UP;
				trans_p.startOrient = JSDiagram.LEFT;
				trans_p.endFract = 0.9;
				ret = false;
			}
		}
		
		return ret;
	}
}


JSDiagram.strategies.push (new JSDiagram.Strategy_Right_O());
JSDiagram.strategies.push (new JSDiagram.Strategy_Up_O());
JSDiagram.strategies.push (new JSDiagram.Strategy_Left_O());
JSDiagram.strategies.push (new JSDiagram.Strategy_Down_O());
