// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var Pos = CodeMirror.Pos;

  function mscriptHint(editor, options) {
	var cur = editor.getCursor();
	var token = editor.getTokenAt(cur);

    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;
	var context = null;
	var aList = [];
	var from = Pos(cur.line, token.start);
    var to = Pos(cur.line, token.end);
    
    if (options.hintType==undefined) {
    	options.hintType = '';
    }
    if (options.hintType=='Req') {
    	aList = cmHintList.reqList;
		from.ch = cur.ch;
		to.ch = cur.ch;
    }
    else if (options.hintType=='UiMap') {
    	aList =  cmHintList.uiMapList;
		from.ch = cur.ch;
		to.ch = cur.ch;
    }
    else if (options.hintType=='Macro') {
    	aList = cmHintList.macroList;
		from.ch = cur.ch;
		to.ch = cur.ch;
    }
//    else if (token.string.trim()=='') {
    else if (editor.getLine(cur.line).trim()=='') {
		aList = cmHintList.tagList;
	}
	else {
		var curLine = editor.getLine(cur.line);
	  	var str = curLine.substring(0, cur.ch);
		var mNames = ["$"];
//		if (!str.endsWith("$")) {
		if (str.match("\\$$")!="$") {
			mNames = str.match(/\$[a-zA-Z][a-zA-Z0-9_]*.?[a-zA-Z_][a-zA-Z0-9_]*$/);
			if (!mNames) {
				mNames = str.match(/\$[a-zA-Z]$/g);
			}
		}
		if (mNames) {
			fName = mNames[0];
			from.ch = cur.ch - fName.length;
			to.ch = cur.ch;
			aList = cmHintList.funcList;
			fName = fName.substring(1, fName.length);
		  	var idx = str.lastIndexOf(".");
		  	var plugin = undefined;
		  	if (idx>=0) {
		  		plugin = fName.substring(0,idx);
		  		fName = fName.substring(idx+1);
		  	}
		  	fName = fName.toUpperCase();
		  	var bList = [];
		  	for (i in aList) {
		  		var aObj = aList[i];
		  		if ((fName=="" || aObj.displayText.toUpperCase().indexOf(fName)==0) && 
		  			(plugin==undefined || aObj.plugin==plugin) ) {
		  			bList.push(aObj);
		  		}
		  	}
			aList = bList;
		}
		else {
			aList = cmHintList.constList;
		  	var fName = str.toUpperCase();
		  	var idx = Math.max(fName.lastIndexOf(" "), fName.lastIndexOf("("), fName.lastIndexOf("'"), fName.lastIndexOf(","));
		  	if (idx>=0) fName = fName.substring(idx+1);
			from.ch = cur.ch - fName.length;
			to.ch = cur.ch;
		  	var bList = [];
		  	for (i in aList) {
		  		var aObj = aList[i];
		  		if ((fName=="" || aObj.displayText.toUpperCase().indexOf(fName)==0) && 
		  			(plugin==undefined || aObj.plugin==plugin) ) {
		  			bList.push(aObj);
		  		}
		  	}
			aList = bList;
		}
	}

    return {list: aList,
            from: from,
            to: to};
  }

  CodeMirror.registerHelper("hint", "javascript", mscriptHint);
});
