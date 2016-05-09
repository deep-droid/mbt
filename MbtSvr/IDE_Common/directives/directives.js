// include after main app.js. contains a set of directives used by IDE app

MainModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

MainModule.directive('ngEscape', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 27) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEscape);
                });

                event.preventDefault();
            }
        });
    };
});

MainModule.directive('stopEvent', function () {
    return {
//        restrict: 'img',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });


MainModule.directive('autoFocus', function() {
    return {
        restrict: 'A',
        link: function(_scope, _element, attrs) {
        	if (attrs.autoFocus) {
                _element[0].focus();
        	}
        }
    };
});

MainModule.directive('view', function (IdeSize, IdeEvents, $rootScope) {
	return {
		scope: true,
		restrict: 'E',
    	transclude: true,
    	replace: true,
    	templateUrl: 'IDE_Common/directives/ViewTemplate.html',
		link: function (scope, element, attrs) {
			scope.elemid = attrs.viewid;
			scope.title = attrs.title;
			scope.modal = false;
			scope.showok = false;
			scope.showView = false;
			scope.ribbon.viewHeaderHeight = 25;
			
			element.find(".viewHeader").css({height: scope.ribbon.viewHeaderHeight+'px'});

			if (attrs.modal) {
				scope.modal = attrs.modal;
			}
			if (attrs.showok) {
				scope.showok = attrs.showok;
			}
			if (attrs.modal) {
				element.css({"z-index": 90});
			}
			else {
				element.css({"z-index": 60});
			}
				
			if (attrs.class) {
				element.addClass(attrs.class);
			}
			var viewWidth = attrs.width;
			if (viewWidth==undefined) {
				viewWidth = 200;
			}
			else if (viewWidth<=1) {
				viewWidth = Math.round(viewWidth * IdeSize.windowWidth);
			}
			var viewHeight = attrs.height;
			if (viewHeight==undefined) {
				viewHeight = 200;
			}
			else if (viewHeight<=1) {
				viewHeight = Math.round(viewHeight * IdeSize.windowHeight);
			}
			var viewTop = attrs.top;
			if (viewTop=="center") {
				viewTop = (IdeSize.windowHeight - viewHeight)/2;
			}
			else if (viewTop<=1) {
				viewTop = Math.round(viewTop * IdeSize.windowHeight);
			}
			var viewLeft = attrs.left;
			if (viewLeft=="center") {
				viewLeft = (IdeSize.windowWidth - viewWidth)/2;
			}
			else if (viewLeft<=1) {
				viewLeft = Math.round(attrs.left * IdeSize.windowWidth);
			}
			element.css({
				width: viewWidth + 'px',
				height: viewHeight + 'px',
				top: viewTop + 'px',
				left: viewLeft + 'px'
			});

			scope.selectView = function () {
				$rootScope.$broadcast("view_select", attrs.viewid);
			};

			scope.okView = function () {
				$rootScope.$broadcast("view_ok", attrs.viewid);
			};

			scope.closeView = function () {
				scope.showView = false;
				if (attrs.modal) {
					$rootScope.$broadcast("setModalMode", false);
				}
				else {
					element.css({"z-index": 60});
				}
				$rootScope.$broadcast("view_hide", attrs.viewid);
			};

			IdeEvents.regEvent (scope, "ribbon", "openView", function(event, message) {
				if (message==attrs.viewid) {
					scope.showView = true;
					$rootScope.$broadcast("view_select", attrs.viewid);
					if (attrs.modal) {
						$rootScope.$broadcast("setModalMode", true);
					}
					$rootScope.$broadcast("view_show", attrs.viewid);
				}
			});
			
			IdeEvents.regEvent (scope, "ribbon", "closeView", function(event, message) {
				if (message=="ALL" || message==attrs.viewid) {
					scope.closeView();
				}
			});
			
			IdeEvents.regEvent(scope, "_" + attrs.viewid, "view_select", function (event, message) {
				if (attrs.modal) return;
				
				if (message==attrs.viewid) {
					element.css({"z-index": 70});
				}
				else {
					element.css({"z-index": 60});
				}
		   	});
		   	
		}
	}
 });

MainModule.directive('draggable', function($document, $rootScope, IdeSize) {
	return function(scope, element, attrs) {
		var startX = 0, startY = 0; // start pos
		var dx, dy;
		var eX = 0, eY = 0; // moving pos
		var x = 0, y = 0; // stop pos
		var dragElement = element;
		if (attrs.draggable && attrs.draggable!="") {
			dragElement = element.find(attrs.draggable);
		}
		dragElement.css("cursor","move");
		
		element.css({
			position: 'absolute'
		});
		 
		dragElement.on('mousedown', function(event) {
			// Prevent default dragging of selected content
			dx = 0;
			dy = 0;
			eX = element.position().left;
			eY = element.position().top;
			event.preventDefault();
			startX = event.pageX;// - x;
			startY = event.pageY;// - y;
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
			$rootScope.$broadcast("setDragMode", true);
		});
		 
		function mousemove(event) {
			dx = event.pageX - startX;
			dy = event.pageY - startY;
			y = eY + dy;
			x = eX + dx;
			
			element.css({
				top: y + 'px',
				left: x + 'px'
			});
		}
		 
		function mouseup(event) {
			$rootScope.$broadcast("setDragMode", false);
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
			if (dx==0 && dy==0) {
				x = 0;
				y = 0;
			}
			if (scope.dragStop) {
				scope.dragStop(element, x, y);
			}
			else if (scope.paneDivider) {
				IdeSize.paneResized(scope, x);
			}
		}
	}
});

MainModule.directive('resizable', function($document, $rootScope, IdeEvents) {
	return function(scope, element, attrs) {
		var startX = 0, startY = 0; // start pos
		var elementWidth, elementHeight;
		var dx=0, dy=0;
		var minWidth = 50, minHeight = 50, maxWidth = 1000, maxHeight = 800;
		if (attrs.minWidth) {
			minWidth = parseInt(attrs.minWidth);
		}
		if (attrs.maxWidth) {
			maxWidth = parseInt(attrs.maxWidth);
		}
		if (attrs.minHeight) {
			minHeight = parseInt(attrs.minHeight);
		}
		if (attrs.maxHeight) {
			maxHeight = parseInt(attrs.maxHeight);
		}
		var resizers = element.find(attrs.resizer);
		elementWidth = parseInt(attrs.width);
		elementHeight = parseInt(attrs.height);
		element.css({
			left: attrs.left+"px",
			top: attrs.top + "px"
		});
		resizeElements();
		
		resizers.on('mousedown', function(event) {
			// Prevent default dragging of selected content
			event.preventDefault();
			startX = event.pageX;
			startY = event.pageY;
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
			$rootScope.$broadcast("setDragMode", true);
		});
		
	   	function resizeElements () {
			element.css({
				width: (elementWidth+dx) + "px",
				height: (elementHeight+dy) + "px"
			});
		
			if (attrs.resizable=="view") {
				element.find(".viewArea").css({
					height: (elementHeight+dy - scope.ribbon.viewHeaderHeight) + "px"
				})
			}
	   	}
	   	
		function mousemove(event) {
			event.preventDefault();
			dx = event.pageX - startX;
			dy = event.pageY - startY;
			var x = elementWidth + dx;
			var y = elementHeight + dy;
			
			if (x < minWidth || x > maxWidth ||
				y < minHeight || y > maxHeight) {
				startX = event.pageX;
				startY = event.pageY;
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
				$rootScope.$broadcast("setDragMode", false);
				if (x < minWidth) {
					elementWidth = minWidth;
				}
				else if (x > maxWidth) {
					elementWidth = maxWidth;
				}
				if (y < minHeight) {
					elementHeight = minHeight;
				}
				else if (y > maxHeight) {
					elementHeight = maxHeight;
				}
				dx = 0;
				dy = 0;
			}
			resizeElements();
		}
		 
		function mouseup(event) {
			$rootScope.$broadcast("setDragMode", false);
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
			elementWidth = elementWidth + dx;
			elementHeight = elementHeight + dy;
			dx = 0;
			dy = 0;
		}
	}
});


MainModule.directive('cusval', function() {
  return {
    require: 'ngModel',
    restrict: "A",
    // scope = the parent scope
    // elem = the element the directive is on
    // attr = a dictionary of attributes on the element
    // ctrl = the controller for ngModel.
    link: function(scope, ele, attrs, ctrl) {
//      scope.$watch(attrs.ngModel, function(oldVal, newVal) {
//    	  if (attrs.domainList=="YesNo") {
//    		  if (newVal!='Y' && newVal!='N') {
//    			  c.$setValidity('YesNoValidate', false);
//    		  }
//    	  }
//      });
    	
    	// add a parser that will process each time the value is 
        // parsed into the model when the user updates it.
        ctrl.$parsers.unshift(function(value) {
            // test and set the validity after update.
        	var valid = checkDomain (value, attrs.domain);
            ctrl.$setValidity(attrs.domain + 'Validate', valid);
            
            // if it's valid, return the value to the model, 
            // otherwise return undefined.
            return valid ? value : undefined;
        });
        
        // add a formatter that will process each time the value 
        // is updated on the DOM element.
        ctrl.$formatters.unshift(function(value) {
            // validate.
            ctrl.$setValidity(attrs.domain + 'Validate', checkDomain(value, attrs.domain));
            
            // return the value or nothing will be written to the DOM.
            return value;
        });    	
    }
  }
});

MainModule.directive('showHint', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
       	 	elem.bind('click', function() {
        	     elem.addClass('showhint').siblings().removeClass('showhint'); 
        	        // remove the class from the other sibling divs
        	});

            elem.bind('click', function(e) {
                elem.toggleClass('showhint');
                e.stopPropagation();
            });
            $(document).bind('click', function() {
                elem.removeClass('showhint');
            });
        }
    };
});

MainModule.directive("dynamicName",function($compile){
    return {
        restrict:"A",
        terminal:true,
        priority:1000,
        link:function(scope,element,attrs){
            element.attr('name', scope.$eval(attrs.dynamicName));
            element.removeAttr("dynamic-name");
            $compile(element)(scope);
        }
    };
});

MainModule.directive('propField2', function () {
	return {
		scope: {field: "=", fieldChanged: "&"},
		restrict: 'E',
    	transclude: false,
    	replace: true,
    	templateUrl: 'IDE_Common/directives/PropField2.html'
//    	link: function(scope, element, attrs, containerController) {
//		   scope.$watch('field.formVal', containerController.fieldChanged);
//    	}
	}
 });

MainModule.directive('propField', function () {
	return {
		scope: {field: "="},
		restrict: 'E',
    	transclude: false,
    	replace: true,
    	templateUrl: 'IDE_Common/directives/PropField.html'
	}
 });

MainModule.directive('paneDivider', function () {
	return {
		scope: false,
		restrict: 'E',
    	transclude: false,
    	replace: true,
    	template: "<div class=\"paneDivider\" ng-init=\"paneDivider=true;\" ng-style=\"{left: paneWidth_1+'px', bottom: 0, height: viewHeight+'px'}\" draggable title=\"drag divider to resize panes, click to hide/show left pane\"></div>"
	}
 });

// options-disabled="p.isinuse for p in ports"
MainModule.directive('optionsDisabled', function($parse) {
    var disableOptions = function(scope, attr, element, data, fnDisableIfTrue) {
		// refresh the disabled options in the select element.
		var options = element.find("option");
		for(var pos= 0,index=0;pos<options.length;pos++){
			var elem = angular.element(options[pos]);
			if(elem.val()!=""){
				var locals = {};
				locals[attr] = data[index];
				elem.attr("disabled", fnDisableIfTrue(scope, locals));
				index++;
			}
		}
	};
	return {
		priority: 0,
		require: 'ngModel',
		link: function(scope, iElement, iAttrs, ctrl) {
			// parse expression and build array of disabled options
			var expElements = iAttrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
			var attrToWatch = expElements[3];
			var fnDisableIfTrue = $parse(expElements[1]);
			scope.$watch(attrToWatch, function(newValue, oldValue) {
					if(newValue) {
						disableOptions(scope, expElements[2], iElement, newValue, fnDisableIfTrue);
					}
				}, true);
				
				// handle model updates properly
				scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
					var disOptions = $parse(attrToWatch)(scope);
					if(newValue) {
						disableOptions(scope, expElements[2], iElement, disOptions, fnDisableIfTrue);
					}
				});
			}
		};
});

function checkDomain (val, domainName) {
	if (domainName=="YesNo") {
		val = val.toUpperCase();
		if (val!='Y' && val!='N') {
			return false;
		}
		return true;
	}
	
	// others
	
	return true;
}