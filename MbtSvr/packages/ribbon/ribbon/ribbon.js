/*
 * that is $(ribbon) object while $.fn is ribbon elem?
 */

(function( $ ){
	$.fn.ribbon = function(inOptions) {
		var id = "ribbon";
		var that = function() { 
			return thatRet;
		};
		
		var thatRet = that;
		that.selectedTabIndex = -1;
		that.showHeader = true;
		var tabNames = [];
		that.options = inOptions;
		
		that.appCtxList = {};
		that.curAppCode = null;
		
		var ribObj = null;
		
		$.fn.selectTab = function(tabName) {
			that.selectedTabIndex = 0;
			for (idx in tabNames) {
				if (tabNames[idx] == tabName) {
					$('#ribbon-tab-header-' + idx).click();
					return;
				}
			}
		}
		
		$.fn.enable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].enable) {
					this[0].enable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).enable();
				});
			}				
		}
				
		$.fn.disable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].disable) {
					this[0].disable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).disable();
				});
			}				
		}
	
		$.fn.isEnabled = function() {
			if (this[0] && this[0].isEnabled) {
				return this[0].isEnabled();
			} 
			else {
				return true;
			}
		}

		$.fn.saveAppCtx =  function(appCode, appName) {
			var ctx = {};
			ctx.winTitle = that.options.winTitle;
			ctx.appCode = appCode;
			ctx.appName = appName;
			ctx.selectedTabIndex = that.selectedTabIndex;
			ctx.showHeader = that.showHeader;
			ctx.btnList = {};
			$(this).removeAppCtx(ctx.appCode);
			$(".ribbon-button").each(function() {
				var btnCtx = { "isVisible": $(this).is(":visible") };
				ctx.btnList[$(this).attr("id")] = btnCtx;
				if ($(this).hasClass("btn-toggle")) {
					btnCtx.btnOn = $(this).hasClass("btn-on");
					btnCtx.type = "btn-toggle";
				}
				else if ($(this).find("input").size()>0) {
					btnCtx.type = "input";
					btnCtx.val = $(this).find("input").val();
				}
				else if ($(this).find("select").size()>0) {
					btnCtx.type = "select";
					btnCtx.val = $(this).find("input").val();
				}
			});
			that.appCtxList [appCode] = ctx;
			that.curAppCode = appCode;
			$(that.contentElem).find("#ribbon-sidebar").append("<div class='appCtx' appCode='" + appCode + "'>" + appCode + "</div>")
			if ($(".appCtx").size()>1) {
				$("#ribbon-sidebar").show();
			}
			else {
				$("#ribbon-sidebar").hide();
			}
			that.resize();
		}
		
		$.fn.removeAppCtx = function(appCode) {
			$(that.contentElem).find("#ribbon-sidebar .appCtx").each(function() {
				if ($(this).attr("appCode")==appCode) {
					$(this).remove();
					that.appCtxList[appCode] = undefined;
				}
			});
		}
		
		$.fn.switchAppCtx = function (newAppCode) {
			if (that.curAppCode) {
				this.saveAppCtx(that.curAppCode);
			}
			
			that.curAppCode = newAppCode;
			var ctx = that.appCtxList[that.curAppCode];
			if (ctx) {
				that.options.winTitle = ctx.winTitle;
				$(".ribbon-window-title").html (ctx.winTitle);
				that.appCode = ctx.appCode;
				that.selectedTabIndex = ctx.selectedTabIndex;
				that.showHeader = ctx.showHeader;
				for (var btnElemID in ctx.btnList) {
					var btnCtx = ctx.btnList[btnElemID];
					var btnElem = $("#"+btnElemID);
					if (btnElem) {
						if (btnCtx.type=="btn-toggle") {
							$(btnElem).removeClass("btn-on");
							if (btnCtx.btnOn) {
								$(btnElem).addClass("btn-on");
							}
						}
						else if (btnCtx.type=="input") {
							$(btnElem).find("input").val(btnCtx.val);
						}
						else if (btnCtx.type=="select") {
							$(btnElem).find("select").val(btnCtx.val);
						}
						if (btnCtx.isVisible) {
							$(btnElem).show();
						}
						else {
							$(btnElem).hide();
						}
					}
				}
			}
		}
		
		$.fn.setWindowTitle = function (winTitle) {
			that.options.winTitle = winTitle;
			$(".ribbon-window-title").html(that.options.winTitle);
			return this;
		}
		
		$.fn.toggleSection = function (btnID) {
			
			var aa = $("[id^=" + btnID +"]");
			$("[id^=" + btnID +"]").each(function() {
				if ($(this).parent().hasClass("stack-group")) {
					$(this).parent().find(".ribbon-button").removeClass("ribbon-button-large").addClass("ribbon-button-small");
				}
			});
			
		}
		
		
		$.fn.addAppCustomButton = function (btnID) {
			return that.addAppCustomButton(btnID);
		}
		
		$.fn.removeAppCustomButton = function (btnID) {
			return that.removeAppCustomButton(btnID);
		}

		that.init = function(id) {
			if (that.options.winTitle==undefined) {
				that.options.winTitle = "";
			}
		
			ribObj = $('<div id="ribbon">' + 
					   '  <div id="ribbon-header">' +
					   '     <div class="ribbon-custom-section" id="ribbon-app-custom">' +
					   '        <span class="ribbon-custom-btn-section"></span>' +
					   '        <span class="ribbon-custom-section-sep"></span>' +
					   '        <span id="ribbon-app-custom-btn"><img src="img/minBottom.png"/></span>' +
					   '     </div>' +
					   '     <span class="ribbon-window-title"></span>' +
					   '  </div>' + 
					   '  <div id="ribbon-tab-header-strip">' +
//					   '     <div clas="ribbon-tab-custom-section" id="ribbon-tab-custom">' +
//					   '        <span class="ribbon-custom-btn-section"></span>' +
//					   '        <span class="ribbon-custom-section-sep"></span>' +
//					   '        <span id="ribbon-tab-custom-btn"><img src="img/minBottom.png"/></span>' +
//					   '     </div>' +
					   '   </div>' +
					   '</div>').appendTo("body");
			
			ribObj.find('.ribbon-window-title').html(that.options.winTitle);
			
			ribObj.append($(".ribbon-tab"));
			ribObj.find('.ribbon-tab').each(function(index) {
				that.addTab(this, index);
			});
			
			ribObj.find("#ribbon-app-custom-btn").click(function() {
				that.showCustomization(false);
			});

			ribObj.find("#ribbon-tab-custom-btn").click(function() {
				that.showCustomization(true);
			});

			ribObj.find('.ribbon-button').each(function(index) {
				that.addRibbonButton(this);
			});
			
			ribObj.find('.ribbon-section').each(function(index) {
				$(this).after('<div class="ribbon-section-sep"></div>');
			});

			ribObj.find('div').attr('unselectable', 'on');
			ribObj.find('span').attr('unselectable', 'on');
			ribObj.attr('unselectable', 'on');

			that.contentElem = $('<div id="ribbon-content"><div id="ribbon-sidebar"></div><div id="ribbon-page"></div></div>').insertAfter(ribObj);
			$(".ribbon-tab-content").appendTo(that.contentElem.find("#ribbon-page"));
			
			that.switchToTabByIndex(that.selectedTabIndex);
			ribObj.resize();		
			window.onresize = that.resize; 
			return this;
		}
		
		
		that.addTab = function (tabElem, index) {
			var id = $(tabElem).attr('id');
			if (id == undefined || id == null)
			{
				$(tabElem).attr('id', 'tab-'+index);
				id = 'tab-'+index;
			}
			tabNames[index] = id;
		
			var title = $(tabElem).find('.ribbon-title');
			var header = ribObj.find('#ribbon-tab-header-strip');
			header.append('<div id="ribbon-tab-header-'+index+'" class="ribbon-tab-header"></div>');
			var thisTabHeader = header.find('#ribbon-tab-header-'+index);
			thisTabHeader.append(title);
			thisTabHeader.click(function() {
				that.switchToTabByIndex(index);
			});
			
			$('<div clas="ribbon-tab-custom-section" style="position:absolute; right: 0px; width:50px;border:1px solid yellow;align-horizontal:right;">' +
			   '   <span class="ribbon-custom-btn-section"></span>' +
			   '   <span class="ribbon-custom-section-sep"></span>' +
			   '   <span id="ribbon-tab-custom-btn"><img src="img/minBottom.png"/></span>' +
			   '</div>').appendTo(tabElem);
			
			$(tabElem).hide();
			return this;
		}
		
		that.addRibbonButton = function (btnElem) {
			var title = $(btnElem).find('.button-title');
			title.detach();
			$(btnElem).append(title);
			
			var el = $(btnElem);
			
			btnElem.enable = function() {
				el.removeClass('disabled');
			}
			btnElem.disable = function() {
				el.addClass('disabled');
			}
			btnElem.isEnabled = function() {
				return !el.hasClass('disabled');
			}
			btnElem.isOn = function() {
				return el.hasClass('btn-on');
			}
			btnElem.isOff = function() {
				return !el.hasClass('btn-on');
			}
							
			btnElem.turnOn = function() {
				el.addClass('btn-on');
			}
			btnElem.turnOff = function() {
				el.removeClass('btn-on');
			}
			
			if (el.hasClass("btn-toggle")) {
				$(btnElem).click(function() {
					$(btnElem).toggleClass("btn-on");
					if (that.options.cbFunc) {
						that.options.cbFunc.apply(this, [{type: "change",  id: $(btnElem).attr("id"), val: $(btnElem).hasClass("btn-on")}]);
					}
				});
			}
			else if ($(btnElem).find("input").size()>0) {
				$(btnElem).find("input").change(function() {
					if (that.options.cbFunc) {
						that.options.cbFunc.apply (this, [{type: "change",  id: $(this).parent().attr("id"), val: $(this).val()}]);
					}
				});
			}
			else if ($(btnElem).find("select").size()>0) {
				$(btnElem).find("select").change(function() {
					if (that.options.cbFunc) {
						that.options.cbFunc.apply (this, [{type: "change", id: $(this).parent().attr("id"), val: $(this).val()}]);
					}
				});
			}
			else {
				$(btnElem).click(function() {
					if (that.options.cbFunc) {
						that.options.cbFunc.apply(this, [{type: "click", id: $(this).attr("id"), val: ""}]);
					}
				});
			}
							
			if ($(btnElem).find('.ribbon-hot').length==0) {
				$(btnElem).find('.ribbon-normal').addClass('ribbon-hot');
			}			
			if ($(btnElem).find('.ribbon-disabled').length==0) {
				$(btnElem).find('.ribbon-normal').addClass('ribbon-disabled');
				$(btnElem).find('.ribbon-normal').addClass('ribbon-implicit-disabled');
			}
			
			$(btnElem).mousedown(function() {
				$(btnElem).addClass('ribbon-mousedown');
			})
			.mouseup(function() {
				$(btnElem).removeClass('ribbon-mousedown');
			});

			$(btnElem).tooltip({
				bodyHandler: function () {
					if (!$(this).isEnabled()) { 
						$('#tooltip').css('visibility', 'hidden');
						return '';
					}
					
					var tor = '';
					if (jQuery(this).children('.button-help').size() > 0) {
						tor = (jQuery(this).children('.button-help').html());
					}
					else {
						tor = '';
					}

					if (tor == '') {
						$('#tooltip').css('visibility', 'hidden');
						return '';
					}

					$('#tooltip').css('visibility', 'visible');
					return tor;
				},
				left: 0,
				extraClass: 'ribbon-tooltip'
			});
		}
		
		that.switchToTabByIndex = function(index) {
			var headerStrip = $('#ribbon #ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			$('#ribbon .ribbon-tab').hide();
			headerStrip.find('#ribbon-tab-header-'+index).addClass('sel');
			if (this.selectedTabIndex==index) {
				this.showHeader = !this.showHeader;
			}
			else {
				this.showHeader = true;
			}
			this.selectedTabIndex = index;
			$('#ribbon #'+tabNames[index]).show();
			var tabLabelElem = $('#ribbon #'+tabNames[index]);
			var appElem = tabLabelElem.attr("app-elem");
			if (appElem==undefined) {
				appElem = that.options.defAppElem;
			}
			if (appElem) {
				$(".ribbon-tab-content").hide();
				$("#" + appElem + ".ribbon-tab-content").show();
			}
			$(ribbon).resize();
			return this;
		}
		
		
		/*
		 * 
		 * #ribbon.backstage .ribbon-backstage .top
		 * .page .top
		 * #ribbon .padding-top
		 * #ribbon .ribbon-custom-section height
		 * #ribbon .ribbon-tab .height (??)
		 * #ribbon.backstage .ribbon-backstage .top (??)
		 * #ribbon .ribbon-section height (??)
		 */
		that.resize = function() {
			var appHeaderTall = 137;
			var appHeaderShort = 49;
			var sidebarWidth = 25;
			var appHeaderHeight = appHeaderShort;
			var appWidth = $(window).width();
			
			if (that.showHeader) {
				appHeaderHeight = appHeaderTall;
			}
			
			var pageWidth = appWidth;
			if ($("#ribbon-sidebar").is(":visible")) {
				pageWidth = pageWidth - sidebarWidth - 1;
			}
			
			var appContentHeight = $(window).height() - appHeaderHeight;
			$("#ribbon").css({height: appHeaderHeight});
			$("#ribbon-content").css({height: appContentHeight + "px", top: appHeaderHeight + "px"});
			$("#ribbon-page").css({width: pageWidth + "px"});

			that.checkOverflow();
			return this;
		}
		
		that.getCurTab = function() {
			var curTab = $("#ribbon .ribbon-tab").get(that.selectedTabIndex);
			return curTab;
		}
		
		that.checkOverflow = function () {
			var curTab = that.getCurTab();
			$(curTab).find(".stack-group").removeClass("condensed");
			if (that.isOverflow(curTab)) {
				$(curTab).find(".stack-group").addClass("condensed");
			}
		}
		
		that.isOverflow = function(curTab) {
			  var ret = false;
			  $(curTab).find(".ribbon-section").each(function() {
				  var el = $(this).get(0);
				  if (el.offsetTop < curTab.offsetTop ||
				      el.offsetTop + el.offsetHeight > curTab.offsetTop + curTab.offsetHeight) {
				   	  ret = true;
				  }
			  });
			  return ret;
		}
	
		that.addCustomButton = function (btnID, custTab) {
			var custElem;
			if (custTab) {
				var curTab = $(that.getCurTab());
				custElem = $(curTab).find(".ribbon-custom-btn-section");
			}
			else {
				custElem = $("#ribbon-app-custom .ribbon-custom-btn-section");
			}
			
			if ($(custElem).find("#" + btnID).size()>0) {
				return;
			}
			
			var btnElemClone = $(".ribbon-section #" + btnID).clone()
					.removeClass("ribbon-button-large")
					.addClass("ribbon-button-small");
			btnElemClone.find(".button-title").remove();
			
			$(custElem).append(btnElemClone);
			that.addRibbonButton(btnElemClone);

			return this;
		}

		that.removeCustomButton = function (btnID, custTab) {
			$("#ribbon-app-custom #" + btnID).remove();
		}
		
		that.showCustomization = function (tabCust) {
			var custTabList = that.getTabBtnList(tabCust);
			var divID = (tabCust)?"tabCustomDIV":"appCustomDIV";
			var btnTxt = "<div id='" + divID + "'><div class='close'>x</div><ol class='cust-tabList'>";
			for (idx in custTabList) {
				var tab = custTabList[idx];
				btnTxt += "<li>" + tab.tab + ":<ol class='cust-btnList'>";
				for (jdx in tab.btnList) {
					var btnObj = tab.btnList[jdx];
					btnTxt += "<li><input type='checkbox' " + (btnObj.checked?"checked":"") + " btnid='" + btnObj.id + "'/>" + tab.btnList[jdx].label + "</li>";
				}
				btnTxt += "</ol></li>";
			}
			btnTxt += "</ol></div>"
			that.initCustomization = function() {
				var custDiv = $("<div id='" + divID + "'/>").appendTo("body");
			}

			var custDIV = $(btnTxt).appendTo("body").css("height", $(window).height()-50 + "px");
			$(custDIV).find(".cust-btnList input").change(function() {
				if ($(this).attr("checked")) {
					that.addCustomButton($(this).attr("btnid"), tabCust);
				}
				else {
					that.removeCustomButton($(this).attr("btnid"), tabCust);
				}
			});
			
			$(custDIV).find(".close").click(function() {
				$("#" + divID).remove();
			});

		}
		
		that.getTabBtnList = function (tabCust) {
			var list = [];
			var tabElemList = null;
			var custElem;
			if (tabCust) {
				tabElemList = that.getCurTab();
				custElem = $("#ribbon-tab-custom");
			}
			else {
				tabElemList = $("#ribbon .ribbon-tab");
				custElem = $("#ribbon-app-custom");
			}
			$(tabElemList).find(".ribbon-section").each(function() {
				var tabObj = {"tab": $(this).find(".section-title").html(), "btnList":[]};
				list.push(tabObj);
				$(this).find(".ribbon-button").each(function() {
					var btnLabel = $(this).find(".button-title").html();
					if (btnLabel==undefined) {
						btnLabel = $(this).attr("name");
					}
					
					var btnID = $(this).attr("id");
					var btnChecked = $(custElem).find("#" + btnID).size()>0;
					
					var btnObj = {"id": btnID, 
								  "checked": btnChecked,
								  "label": btnLabel};
					
					tabObj.btnList.push(btnObj);
				});
			});
			return list;
		}
		
		
		that.init(id);
	
		$.fn.ribbon = that;
	};

})( jQuery );

