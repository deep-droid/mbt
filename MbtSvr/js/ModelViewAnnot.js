// ModelViewAnnot.js - copyright 2008-2013 TestOptimal, LLC
var pathThreadIdx = 0; // first thread
var pathIdx = 0; // first path
var stepIdx = -1; // 0-based array index, current annot -1
var threadTotalAnnot = 0; 

function popupAnnotView () {
	if (regView("annotViewPanel")) {
		initAnnotView();
	}
	pathThredIdx = 0;
	pathIdx = 0;
	stepIdx = -1;
	bringViewToFront("annotViewPanel");
	$("#annotViewPanel").show();
	$("#pathThreadIdx").change(function() {
		pathThreadIdx = $(this).val();
		refreshAnnot({threadIdx: pathThreadIdx});
	});
	$("#pathIdx").change(function() {
		pathIdx = $(this).val();
		stepIdx = -1;
		refreshAnnot({threadIdx: pathThreadIdx, pathIdx: pathIdx});
	});
	refreshAnnot({threadIdx: pathThreadIdx});
}

function showCurAnnot() {
	refreshAnnot({threadIdx: pathThreadIdx, stepIdx: -1});
}

function refreshAnnot (param) {
	param.cmd = "viewAnnot";
	parentWinObj.postActionUtil ("annot", param, function(data) {
		if (data=="") {
			$("#annotViewCnt").html("");
			return;
		}
		var markdown = new MarkdownDeep.Markdown();
		markdown.ExtraMode = true;
		markdown.SafeMode = false;
		
		var idx = data.indexOf(":");
		var strList = data.substring(0,idx).split(",");
		data = data.substring(idx+1);
		pathThreadIdx = parseInt(strList[0]);
		$("#pathThreadIdx").val(pathThreadIdx);
		pathIdx = parseInt(strList[1]);
		$("#pathIdx").val(pathIdx);
		stepIdx = parseInt(strList[2]);
		$("#pathStepIdx").html(stepIdx);
		threadTotalAnnot = parseInt(strList[3])-1;
		var output=markdown.Transform(data);
		$("#annotViewCnt").html(output);
	    $( "#annotIdxSlider" ).slider("option", "max", threadTotalAnnot).slider("value",stepIdx);
	}, "text");
}

function sliderRefresh() {
	stepIdx = $( "#annotIdxSlider" ).slider("value");
	refreshAnnot({threadIdx: pathThreadIdx, stepIdx: stepIdx});
}

function sliderMove (event, ui) {
	stepIdx = ui.value;
	$("#pathStepIdx").html(stepIdx);
}

function initAnnotView() {
	$("#annotViewPanel")
		.draggable()
//		.draggable(
//			{  cancel: '#annotViewCnt', 
//			   start: function() { bringViewToFront("annotViewPanel"); }
//			})
		.resizable({ alsoResize: '#annotViewCnt', minHeight: 200, handles: "all", minWidth: 300 })
		.click(function() {	bringViewToFront("annotViewPanel");});

	bringViewToFront ("annotViewPanel");
		
	$("#annotViewClose").click(function() {
		closeAnnotViewPanel();
	});
	
	$("#refreshAnnotBtn").click(function() {
		refreshAnnot ({threadIdx: pathThreadIdx, stepIdx: stepIdx});
	});
    $( "#annotIdxSlider" ).slider(
    	{ min:0,
    	  stop: sliderRefresh,
    	  slide: sliderMove
   		}
    );
    
    $("#pathStepBack").click(function() {
    	if (stepIdx==0) return;
		refreshAnnot ({threadIdx: pathThreadIdx, stepIdx: stepIdx-1});
    });
    $("#pathStepNext").click(function() {
		refreshAnnot ({threadIdx: pathThreadIdx, stepIdx: stepIdx+1});
    });
}

function closeAnnotViewPanel () {
	$("#annotViewPanel").hide();
}


