
JSDiagram.Strategy_Any = function () {
	
	this.isApplicable = function(path_p) {
		path_p.startLeft = path_p.sourceLeft;
		path_p.startTop = path_p.sourceTop;
		path_p.seg0Orient = JSDiagram.RIGHT;
		path_p.seg0Length = 0;
		path_p.seq1Length = 0;
		path_p.seg1Orient = JSDiagram.DOWN;
		path_p.seg2Length = 0;
		path_p.seg2Orient = path_p.seg1Orient;
		path_p.endLeft = path_p.destinationLeft;
		path_p.endTop = path_p.destinationTop;
		path_p.seg3Orient = JSDiagram.LEFT;
		path_p.seg3Length = 0;
		return true;
	}
	
	this.setContainment = function (path_p) {
	
	}
}


JSDiagram.strategies.push (new JSDiagram.Strategy_Any());
