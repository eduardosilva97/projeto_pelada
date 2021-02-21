/***
 * PrimeFaces methods override 
 * */
if(typeof PrimeFaces !== 'undefined'){
	/***
	 * Primefaces skinInput override
	 * - onfocus input icon toggle */
	PrimeFaces._oldSkinInput = PrimeFaces.skinInput;
	PrimeFaces.skinInput = function(){
		this._oldSkinInput.apply(this, arguments);
		
		//on focus icon toggle
		var $input = arguments[0];
		var $iconWrapper = $input.parents('.field-icon-wrapper:first');
		if($iconWrapper.find('[show-onfocus]').length > 0){
			$input.unbind('focus.onFocusIcon');
			$input.unbind('blur.onFocusIcon');
			$input.bind('focus.onFocusIcon',function(){
				$iconWrapper.addClass('wrapper-focused');
			}).bind('blur.onFocusIcon',function(){
				$iconWrapper.removeClass('wrapper-focused');
			});
		}
	}

	/***
     * Primefaces GMap override
     * - custom marker (label/text on marker)
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerLabel
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions */
	if(typeof PrimeFaces.widget.GMap !== 'undefined'){
        PrimeFaces.widget.GMap = PrimeFaces.widget.GMap.extend({
            configureMarkers: function(){
                this._super();

                if(this.cfg.markersAuxData != null){
                    for (var c = 0; c < this.cfg.markersAuxData.length; c++) {
                        var markerData = this.cfg.markersAuxData[c];
                        if(markerData.id != null){
                            var _marker = this.cfg.markers.filter(function(o){
                                return markerData.id == o.id;
                            });
                            if(_marker.length > 0){
                                _marker = _marker[0];
                                _marker.setLabel({color: markerData.labelColor, text: markerData.label, fontSize: (markerData.labelSize != null) ? markerData.labelSize : "12px"});
                            }
                        }
                    }
                }

            }
        });
    }

    /***
     * Primefaces AccordionPanel override
     * - ignore local "savedState" (bug on update)
     * */
    PrimeFaces.widget.AccordionPanel = PrimeFaces.widget.AccordionPanel.extend({
        saveState: function() {
            if(!this.jq.hasClass('ignore-local-state')){
                this._super();
            }
        }
    });

	/***
     * Primefaces Fieldset override
     * - local state holder implementation (recover toggle state after update without bean binds)
     * */
    PrimeFaces.widget.Fieldset = PrimeFaces.widget.Fieldset.extend({
        init: function(a) {
            this._super(a);
            if (this.cfg.toggleable && !this.jq.hasClass('ignore-local-stateholder')) {
                this.useClientStateHolder = true;
                var _currentState = this.getCurrentState(); //recover current state
                if(_currentState != null){
                    this.cfg.collapsed = _currentState.collapsed;
                    if(this.cfg.collapsed){
                        this.content.slideUp(0);
                    } else {
                        this.content.slideDown(0);
                    }
                    this.updateToggleState(!this.cfg.collapsed);
                }
            }
        },
        toggle: function(b) {
            var $target = $(b.target);
            var _classesToSkip = '.ui-button,.prevent-toggle';
            var _parentsToSkip = _classesToSkip.split(',').join(':first,')+':first';
            if(!$target.is(_classesToSkip) && $target.parents(_parentsToSkip).length == 0){
                this._super(b);
            }
        },
        updateToggleState: function(a) {
            this._super(a);
            if(this.useClientStateHolder){
                this.setCurrentState({collapsed: this.cfg.collapsed});
            }
        },
        setCurrentState: function(state){
            CustomComponents.fieldsetClientStateHolder[this.widgetVar] = state;
        },
        getCurrentState: function(){
            return CustomComponents.fieldsetClientStateHolder[this.widgetVar];
        }
    });
    
    

    PrimeFaces.widget.PickList = PrimeFaces.widget.PickList.extend({
		/***
		 * Primefaces PickList init override
		 * - labels i18n (fix for labels as attributes on uicomponent)
		 * */
		init: function(c){
            this._super(c);
            if(!this.jq.hasClass('manual-i18n')) {
                this.setupI18n();
            }
		},
        setupI18n: function(){
			var _locale = PrimeFaces.getLocaleSettings();
			if(_locale != null){
				this.setButtonTitle('.ui-picklist-button-add', _locale.add);
                this.setButtonTitle('.ui-picklist-button-add-all', _locale.addAll);
                this.setButtonTitle('.ui-picklist-button-remove', _locale.remove);
                this.setButtonTitle('.ui-picklist-button-remove-all', _locale.removeAll);
			}
		},
		setButtonTitle: function(selector, title){
        	if(title != null){
                $(this.jqId + " " + selector).attr('title', title);
			}
		}
    });

    PrimeFaces.widget.AutoComplete = PrimeFaces.widget.AutoComplete.extend({
        /***
         * Primefaces Autocomplete init override
         * - default emptyMessage i18n
         * */
        init: function(a) {
            this._super(a);
            this.setupI18n();
        },
        setupI18n: function(){
            var _locale = PrimeFaces.getLocaleSettings();
            if(_locale != null){
                if(this.cfg.emptyMessage == null && _locale.emptyMessage != null){
                    this.cfg.emptyMessage = _locale.emptyMessage;
                }
            }
        },
        /***
         * Primefaces Autocomplete showSuggestions override
         * */
        showSuggestions: function () {
            this.hide(); //hack: bug on position when parent have position relative;
            this._super.apply(this, arguments);
        },

        /***
         * Primefaces Autocomplete alignPanel override
         * - possibility to apply margins on panel via css
         * */
        alignPanel: function(){
            this._super.apply(this, arguments);

            //panel width - panel margins
            var _margins = 20;
            var _w = parseInt(this.panel.css('width'),10);
            var _l = parseInt(this.panel.css('left'),10);

            this.panel.css({
                'width':(_w - _margins)+'px',
                'left': (_l + _margins/2)+'px'
            });
            //---------
		},

		/***
		 * bindKeyEvents override
		 * - new event implementation (clearText)
		 * */
        bindKeyEvents: function(){
            this._super.apply(this, arguments);

            if (this.cfg.behaviors) {
            	//clearText
                var c = this.cfg.behaviors.clearText;
                if (c) {
                    var a = {
                        params: [{
                            name: this.id + "_clearText",
                            value: ""
                        }]
                    };

                    var _keyupClearEventTimeout;
                    this.input.on("keyup blur", function() {
                        var $input = $(this);
                        clearTimeout(_keyupClearEventTimeout);
                        _keyupClearEventTimeout = setTimeout(function(){
                            if($input.val() == ''){
                                c.call(this, a); //invoke clearText event
                            }
                        },100);
                    });

                }
            }

		}
    });
	
	/***
	 * Primefaces Menubar init override
	 * - menu vertical setup
	 * */
	PrimeFaces.widget.Menubar.prototype._oldInit = PrimeFaces.widget.Menubar.prototype.init;
	PrimeFaces.widget.Menubar.prototype.init = function(a){
		if($(PrimeFaces.escapeClientId(a.id)).hasClass('vertical-menu')){
			a.toggleEvent = "click";
			a.isVerticalMenu = true;
		}
		this._oldInit.apply(this,arguments);

		if(this.jq.hasClass('remove-empty-submenu')){
			this.rootLinks.each(function(){
				var $li = $(this).parent();
				var $submenu = $li.find('.ui-menu-list');
				if($submenu.length > 0 && $submenu.find('> .ui-menuitem').length == 0){
                    $li.remove();
				}
			});
		}

	}
	
	PrimeFaces.widget.Menubar.prototype._oldBindClickModeEvents = PrimeFaces.widget.Menubar.prototype.bindClickModeEvents;
	PrimeFaces.widget.Menubar.prototype.bindClickModeEvents = function(){
		var _this = this;
		if(_this.cfg.isVerticalMenu){
			
			_this.links.filter(".ui-submenu-link").off("click.verticalmenu").on("click.verticalmenu", function(e) {
				
				var $link = $(this);
				
				if(!_this.jq.hasClass('in-search-mode') && !_this.retractMode){ //prevent navigation in search mode

		        	var $itemParent = $link.parent();
		        	var $groupChildren = $itemParent.find('>ul:first');
		        	
		        	//close opened items
		        	_this.jq.find('.submenu-vertical-visible > a').not(function(i,o){
		        		var _return = o === $link.get(0);
		        		$link.parents('.submenu-vertical-visible').find('>a').each(function(){
		        			_return = (o === this)?true:_return;
		        		});
		        		return _return;
		        	}).trigger("click.verticalmenu");
		        	
		        	if($itemParent.hasClass('submenu-vertical-visible')){ //hide
		        		$groupChildren.stop().animate({height: '0px'},'fast',function(){
		        			$groupChildren.css({height:''});
		        			$itemParent.removeClass('submenu-vertical-visible');
		        		});
		        	} else { //show	        		
		        		$groupChildren.addClass('temp-show-submenu');
		        		var _tempHeight = $groupChildren.outerHeight();
		        		$groupChildren.removeClass('temp-show-submenu').css({height:'0px'});
		        		$itemParent.addClass('submenu-vertical-visible');
		        		$groupChildren.stop().animate({height:_tempHeight+'px'},'fast',function(){
		        			$groupChildren.css({height:''});
		        		});
		        	}
		        	
				} else if (_this.retractMode){
					
					CustomComponents.menuRetract(_this.widgetVar, function(){ //on expand/retract complete
						$link.trigger("click.verticalmenu");
					});
					
				}
	        	
	            e.preventDefault()
	        })
			
		} else {
			_this._oldBindClickModeEvents.apply(this,arguments);
		}
	}
	
	PrimeFaces.widget.Menubar.prototype.menuRetract = function(retract){
		var _this = this;
		if(retract){
			if(_this.searchInput != null){
				_this.searchInput.value = '';
				CustomComponents.searchMenuItem(_this.widgetVar,_this.searchInput,0);
			}
			_this.links.filter(".ui-submenu-link").filter(function(){ return $(this).parent().hasClass('submenu-vertical-visible') }).trigger('click');
		}
		_this.retractMode = retract;
	}
	

	
	/***
	 * Primefaces OverlayPanel / ButtonPanel
	 * - overlayPanel/button integration */
	PrimeFaces.widget.OverlayPanel.prototype._oldInit = PrimeFaces.widget.OverlayPanel.prototype.init;
	PrimeFaces.widget.OverlayPanel.prototype.init = function(){
		this._oldInit.apply(this,arguments);
		if(this.target.hasClass('panel-button')){
			this.jq.addClass('panel-button-overlay');
		}
	}
	
	PrimeFaces.widget.OverlayPanel.prototype._old_show = PrimeFaces.widget.OverlayPanel.prototype._show;
	PrimeFaces.widget.OverlayPanel.prototype._show = function(){
		this._old_show.apply(this,arguments);
		this.target.addClass('overlay-panel-visible');
	}
	
	PrimeFaces.widget.OverlayPanel.prototype._oldHide = PrimeFaces.widget.OverlayPanel.prototype.hide;
	PrimeFaces.widget.OverlayPanel.prototype.hide = function(){
		this._oldHide.apply(this,arguments);
		this.target.removeClass('overlay-panel-visible');
	}

    /***
     * Primefaces Extensions CKEditor
     * - custom config / toolbar
     * */
	if(typeof PrimeFaces.widget.ExtCKEditor !== 'undefined') {
        PrimeFaces.widget.ExtCKEditor = PrimeFaces.widget.ExtCKEditor.extend({
            init: function (cfg) {
                cfg.customConfig = (cfg.customConfig == null) ? PrimeFaces.getFacesResource('/js/ckeditor.js', 'default', PrimeFacesExt.VERSION) : cfg.customConfig;
                this._super(cfg);
            }
        });
    }

	/***
	* Primefaces TriStateCheckbox
	* - custom layout
	* */
    PrimeFaces.widget.TriStateCheckbox = PrimeFaces.widget.TriStateCheckbox.extend({
		init: function(b){
            this._super(b);
            this.stateClassPrefix = 'state-';

            this.refreshStateClass();
		},
		toggle: function(d){
            var _oldVal = this.input.val();
			this._super(d);
            if (!this.disabled) {
            	this.refreshStateClass(_oldVal);
            }
		},
        refreshStateClass: function(oldN){
			if(typeof oldN !== 'undefined'){
				this.jq.removeClass(this.stateClassPrefix+oldN);
			}
            this.jq.addClass(this.stateClassPrefix+this.input.val());
		}
	});

    /***
	 * Primefaces MenuButton
	 * - default-button styled
    * */
    PrimeFaces.widget.MenuButton = PrimeFaces.widget.MenuButton.extend({
		init: function(b){
            this._super(b);
            if(this.jq.hasClass('default-button') && this.menuitems.length > 0){
            	var _classToCopy = this.jq.attr('class');
                this.button.addClass(_classToCopy).removeClass('ui-menubutton');
                this.jq.attr('class', 'ui-menubutton');
                this.menu.addClass('custom-menubutton');

            	if(this.menuitems.length ==1) {
            	    var $singleItem = this.menuitems.find('a:first');
                    $singleItem.attr('class', this.button.attr('class'));

                    this.button.replaceWith($singleItem);
                }
			}
		}
	});

    /***
     * Primefaces TabMenu
     * - activeIndex by url and rel attribute
     * */
    PrimeFaces.widget.TabMenu = PrimeFaces.widget.TabMenu.extend({
        init: function(a) {
            this._super(a);

            var _currentLocation = document.location.href;
            if(_currentLocation != null) {
                var linksWithRel = this.items.find('a[rel]');
                if (linksWithRel.length > 0) {
                    this.items.removeClass('ui-state-active');
                    linksWithRel.filter(function () {
                        var _r = false;
                        $.each($(this).attr('rel').split('|'), function(a,b){
                            if(_currentLocation.indexOf(b) >= 0) {
                                _r = true;
                                return;
                            }
                        });
                        return _r;
                    }).parent().addClass('ui-state-active');
                }
            }

        }
    });

    /***
     * Primefaces Datatable
     * - sortable hint
     * */
    PrimeFaces.widget.DataTable = PrimeFaces.widget.DataTable.extend({
        init: function(a) {
            this._super(a);
            if(this.jq.hasClass('show-legends')) {
                this.setupIconLegends();
            }
        },
        bindSortEvents: function(){
            this._super();
            this.refreshSortHints();
        },
        postUpdateData: function(){
            this._super();
            this.refreshSortHints();
        },
        refreshSortHints: function(){
            this.sortableColumns.each(function(){
                var _title = $(this).attr('aria-label');
                $(this).attr('title', _title);
            });
        },
        setupIconLegends: function(){
            var _that = this;
            var _legends = {};
            this.jq.find('.fa').each(function(){
                var $this = $(this);
                var _title = $this.attr('title');
                    _title = (_title != null) ? _title : $this.parent().attr('title');
                if(_title != null){
                    _legends[_title] = {title:_title, styleClass:CustomComponents.extractIconLegendStyleClass($this.attr('class'))};
                }
            });

            var $legendsUl = $('<ul class="icon-legends" />');
            for(var pName in _legends){
                var _legend = _legends[pName];
                $legendsUl.append($('<li><i class="'+_legend.styleClass+'"></i> '+_legend.title+'</li>'));
            }
            $legendsUl.insertAfter(this.jq.find('.ui-datatable-tablewrapper'));

        }
    });

    /***
	 * Primefaces Tabview
	 * - on window resize treatment
	 * */
    PrimeFaces.widget.TabView = PrimeFaces.widget.TabView.extend({
        initScrolling: function(){
        	var _that = this;
        	$(window).off('resize.'+_that.cfg.widgetVar);
            _that._super();
            if(_that.cfg.scrollable){
            	_that._resizeTimeout = 0;
                $(window).on('resize.'+_that.cfg.widgetVar, function(){
                	clearTimeout(_that._resizeTimeout);
                    _that._resizeTimeout = setTimeout(function(){
                        //hide first
                        _that.navscroller.css("padding-left", "0px");
                        _that.navcrollerLeft.hide();
                        _that.navcrollerRight.hide();

                        var _scrollNumber = parseInt(_that.navContainer.css('margin-left'));
                        _scrollNumber = (!isNaN(_scrollNumber))?-_scrollNumber:0;
                        _that.scroll(_scrollNumber);

                        //refresh state
                        _that.initScrolling.apply(_that, arguments);
					}, 400);
				});
			}
		}
	});

    /***
	 * Primefaces InputMask
	 * - multiple masks separated by comma
	 * --- alternate between masks by mask X content length
	 * */
    PrimeFaces.widget.InputMask = PrimeFaces.widget.InputMask.extend({
        init: function (a) {

            var $jq = $(PrimeFaces.escapeClientId(a.id));
            if ($jq.hasClass('custom-inputmask')) {
                if (a.mask != null && a.mask.indexOf(',') >= 0) {
                    a.masks = a.mask.split(',');
                    a.masks.sort(function (a, b) {
                        return a.length - b.length;
                    });
                    a.mask = a.masks[0];

                    $jq.data('initValue', $jq.val());
                }
            }

            this._super(a);

            this.setupMultipleMasks();
        },
        setupMultipleMasks: function () {
            var _that = this;
            if (_that.cfg.masks != null && $.isArray(_that.cfg.masks)) {
                _that.jq
                    .off('paste.' + _that.cfg.widgetVar)
                    .on('paste.' + _that.cfg.widgetVar, function (e) {
                        setTimeout(function () {
                            var _pasted = _that.removeSpecialChars(_that.jq.val());
                            _that.jq.trigger('keyup.' + _that.cfg.widgetVar, [{pasted: _pasted}]);
                        }, 0);
                    })
                    .off('keypress.' + _that.cfg.widgetVar)
                    .on('keypress.' + _that.cfg.widgetVar, function (e) {
                        var _char = String.fromCharCode(e.which);
                        _that.jq.data('lastChar', _char);

                    }).off('keyup.' + _that.cfg.widgetVar)
                    .on('keyup.' + _that.cfg.widgetVar, function (e, data) {
                        var _char = _that.jq.data('lastChar');
                        _that.jq.removeData('lastChar');

                        var _lastValue = _that.jq.data('lastVal');
                        _lastValue = (_lastValue != null) ? _that.removeSpecialChars(_lastValue) : "";
                        var _currentValue = _that.removeSpecialChars((data != null && data.initVal != null) ? data.initVal : _that.jq.val());
                        var _currentSize = _currentValue.length;
                        var _futureValue = _currentValue + ((_char != null) ? _char : "");
                        var _fullMasked = _that.jq.data('full-masked');

                        if (_currentSize < _lastValue.length) {
                            _fullMasked = false;
                        }

                        if (_futureValue != _lastValue) { //value change
                            var _currentPattern = _that.cfg.masks.filter(function (o) {
                                return _that.getOnlyReservedChars(o).length >= (_currentSize + ((_fullMasked) ? 1 : 0));
                            }); //next pattern
                            _currentPattern = (_currentPattern.length > 0) ? _currentPattern[0] : _that.cfg.mask;
                            var _newMaskSize = _that.getOnlyReservedChars(_currentPattern).length;

                            var _isDataPasted = (data != null && data.pasted != null);
                            if (_that.cfg.mask != _currentPattern || _isDataPasted) { //mask change

                                var _updateMaskHandler = function (value) {
                                    _that.cfg.mask = _currentPattern;

                                    _that.cfg._autoclear = _that.cfg.autoclear;
                                    _that.cfg.autoclear = false;

                                    _that.jq.unmask();
                                    _that.jq.val(value);
                                    _that.jq.mask(_that.cfg.mask, _that.cfg);

                                    _that.cfg.autoclear = _that.cfg._autoclear;

                                    var _currentFormattedVal = _that.jq.val();
                                    var _currentCleanVal = _that.removeSpecialChars(_currentFormattedVal);
                                    CustomComponents.setCaretPosition(_that.jq.get(0), _currentFormattedVal.lastIndexOf(_currentCleanVal[_currentCleanVal.length - 1]) + 1);

                                    _that.jq.data('lastVal', _that.jq.val());
                                };

                                if (_isDataPasted) {
                                    setTimeout(function () { //hack for content pasted X async events from $.mask plugin
                                        _updateMaskHandler(data.pasted);
                                    }, 0);
                                } else {
                                    _updateMaskHandler(_futureValue);
                                }

                            }

                        }

                        _that.jq.data('lastVal', _that.jq.val());
                        _that.jq.data('full-masked', _currentSize >= _newMaskSize); //pattern is completed

                    });

                var _initVal = _that.jq.data('initValue');
                if (_initVal != null) {
                    _that.jq.trigger('keyup.' + _that.cfg.widgetVar, {initVal: _initVal});
                }
            }
        },
        removeSpecialChars: function (str) {
            return str.replace(/[^0-9|a-z|A-Z]/gi, '');
        },
		getOnlyReservedChars: function(str){
            return str.replace(/[^a|9]/gi, ''); //only "a" and "9" (input mask reserved chars)
		}
    });

	/***
	 * Primefaces Growl
	 * - fix zIndex specific by CustomComponents.zIndexBase
	 * */
    PrimeFaces.widget.Growl = PrimeFaces.widget.Growl.extend({
		init: function(a){
			this._super(a);

			var _that = this;
			var $closeAllBtn = $('<a href="javascript:;" class="fa fa-times-circle"></a>');
            $closeAllBtn.click(function(){
            	var _speed = 600;
                _that.jq.find('.ui-growl-item-container').slideUp(_speed, "easeInOutCirc", function() {
                    $(this).remove();
                });
                setTimeout(function(){
					_that.setupCollapseMode();
				},_speed+100);

			});
			this.jq.append($closeAllBtn);
		},
        show: function(b){
            PrimeFaces.zindex += CustomComponents.zIndexBase; //increment
            this._super(b);
            PrimeFaces.zindex -= CustomComponents.zIndexBase; //restore
        },
        renderMessage: function(e){

        	//force label when message comes with id of component
        	var _message = e.detail;
        	if(_message != null){
        		var _id = _message.split(' ');
				if(_id.length > 0){
					_id = _id[0];
					if(_id.substr(_id.length - 1) != ":"){
						var $label = CustomComponents.findLabelsByForAttr(_id);
						if($label.length > 0){
							var _text = $label.contents().get(0);
							if (_text != null) {
								_text = _text.nodeValue;
							} else {
								_text = $label.attr("data-p-label");
							}
                            if(_text != null && _text != ""){
								e.detail = e.detail.replace(_id, _text);
								console.log("Forcing label '"+_text+"' from client...");
							}
						}
					}
				}
			}

            this._super(e);
            this.setupCollapseMode();
		},
		setupCollapseMode: function(){
            var _totalMessages = this.jq.find('>.ui-growl-item-container').length;
            if(_totalMessages > CustomComponents.maxMessagesGrowlCollapse){
                this.jq.addClass('growl-collapse');
            } else {
                this.jq.removeClass('growl-collapse');
            }
		},
        removeMessage: function(m){
		    var _that = this;
            _that._super(m);
            setTimeout(function(){
                _that.setupCollapseMode();
            }, 1000);
        }
    });

    /***
     * Primefaces Dialog
     * - fix zIndex specific by CustomComponents.zIndexBase
     * */
    PrimeFaces.widget.Dialog = PrimeFaces.widget.Dialog.extend({
        _show: function(){
            PrimeFaces.zindex += CustomComponents.zIndexBase; //increment
            this._super();

            CustomComponents.handleLockScrollbars();
        },
        onHide: function(a, b) {
            this._super(a, b);
            PrimeFaces.zindex -= CustomComponents.zIndexBase; //restore

            CustomComponents.handleLockScrollbars();
		}
    });

    /***
     * Primefaces ConfirmDialog / PrimeFaces.confirm override
     * - support to multiple confirmDialogs by severity (danger|warning|normal)
     * 		- include "confirm-{severity}" on styleClass attribute of your action component;
	 * 		- fix zIndex specific by CustomComponents.zIndexBase
     * */
    PrimeFaces.confirmDialogWidgets = [];
    PrimeFaces.widget.ConfirmDialog = PrimeFaces.widget.ConfirmDialog.extend({
		init: function(){
            var _this = this;

            this._super.apply(this, arguments);

            _this.confirmType = 'normal';
            if(_this.jq.hasClass('confirm-danger')){
                _this.confirmType = 'danger';
            } else if (_this.jq.hasClass('confirm-warning')){
                _this.confirmType = 'warning';
            }

            var _savedItem = PrimeFaces.confirmDialogWidgets.filter(function(o,i){
                if(o.cfg.id == _this.cfg.id){
                    PrimeFaces.confirmDialogWidgets[i] = _this;
                    return true;
                }
            });

            if(_savedItem.length == 0){
                PrimeFaces.confirmDialogWidgets.push(_this);
            }

        },
		_show: PrimeFaces.widget.Dialog.prototype._show,
        onHide: PrimeFaces.widget.Dialog.prototype.onHide
    });

    /***
     * Primefaces DynamicDialog
     * - fix zIndex specific by CustomComponents.zIndexBase
     * */
    PrimeFaces.widget.DynamicDialog = PrimeFaces.widget.DynamicDialog.extend({
        _show: function(){
            PrimeFaces.zindex += CustomComponents.zIndexBase; //increment
            this._super();

            CustomComponents.handleLockScrollbars();

            //auto resize dynamic dialogs
			var _that = this;
			var _lastHeight = _that.jq.height();
            _that.resizeInterval = setInterval(function(){
            	if(_lastHeight != _that.jq.height()){
                    _that.initPosition();
				}
			}, 300);

		},
        onHide: function(a, b) {
            this._super(a, b);

            //clear resize interval
            var _that = this;
            if(_that.resizeInterval != null){
            	clearInterval(_that.resizeInterval);
			}

            PrimeFaces.zindex -= CustomComponents.zIndexBase; //restore

            CustomComponents.handleLockScrollbars();
        }
    });

    /***
	 * Primefaces LightBox
	 * - fileupload image zoom handler
	 * - <p:lightBox styleClass="image-upload full"> with link with styleClass="lightbox-link"
	 * */
    PrimeFaces.widget.LightBox = PrimeFaces.widget.LightBox.extend({
		init: function(a){
			if($(PrimeFaces.escapeClientId(a.id)).hasClass('image-upload')){
				this.customInit(a);
			} else {
                this._super(a);
            }
		},
		customInit: function(a){
            PrimeFaces.widget.BaseWidget.prototype.init.apply(this, arguments);

            //get fileupload image link
            this.links = this.jq.find("a.lightbox-link");

            //get fileupload image preview
			var $img = this.jq.find('img:first');
			if($img.length > 0){
                this.links.attr('href',$img.attr('src'));
			}

            this.createPanel();
            if (this.cfg.mode === "image") {
                this.setupImaging()
            } else {
                if (this.cfg.mode === "inline") {
                    this.setupInline()
                } else {
                    if (this.cfg.mode === "iframe") {
                        this.setupIframe()
                    }
                }
            }
            this.bindCommonEvents();
            if (this.cfg.visible) {
                this.links.eq(0).click()
            }
            this.panel.data("widget", this);
            this.links.data("primefaces-lightbox-trigger", true).find("*").data("primefaces-lightbox-trigger", true)
		}
	});

	/***
	 * Primefaces FileUpload
	 * - custom layout (single-line / fixed position warnings/infos)
	 * */
	if(typeof PrimeFaces.widget.FileUpload !== 'undefined'){

        PrimeFaces.widget.FileUpload = PrimeFaces.widget.FileUpload.extend({
            init: function(a){
                var _that = this;
                var $preJQ = $(PrimeFaces.escapeClientId(a.id));
                if($preJQ.length > 0 && $($preJQ).hasClass('clean-fileupload')){

                    _that.isCleanLayout = true;

                    //oncomplete
                    var _customOnComplete = function(){
                        _that.customOnComplete.apply(this, arguments);
                    }

                    if(a.oncomplete != null){
                        var _oldOnComplete = a.oncomplete;
                        a.oncomplete = function(){
                            _oldOnComplete.apply(this,arguments);
                            _customOnComplete.apply(this,arguments);
                        }
                    } else {
                        a.oncomplete = _customOnComplete;
                    }

                }

                this._super.apply(this, arguments);

                if(_that.isCleanLayout && this.clearMessageLink!=null){
                    //append content to body
                    this.content.addClass('clean-fileupload-content-outside').appendTo($('body'));

                    //close messages
                    this.clearMessageLink.on("click.fileupload", function(c) {
                        if(_that.files == null || _that.files.length == 0){
                            _that.closeFixedContent();
                        }
                    });
                }

            },
            validate: function(){
                if(this.isCleanLayout){
                    this.configGlobalGrowls();
                    this.openFixedContent();
                }
                return this._super.apply(this, arguments);
            },
            clear: function(){
                this._super.apply(this, arguments);
                if(this.isCleanLayout){
                    this.closeFixedContent();
                }
            },
            removeFileRow: function(a){
                this._super.apply(this, arguments);
                if(this.isCleanLayout && a && a.length > 0 && a.parent().children().length == 1){
                    this.closeFixedContent();
                }
            },
            customOnComplete: function(){
                this.closeFixedContent();
            },
            closeFixedContent: function(){
                this.content.removeClass('visible').css({'z-index':CustomComponents.zIndexBase});
            },
            openFixedContent: function(){
                this.content.addClass('visible').css({'z-index': PrimeFaces.zindex});
            },
            configGlobalGrowls: function(){
                if(this.globalGrowls == null || this.globalGrowls.length == 0) {
                    this.globalGrowls = [];
                    for (var pName in PrimeFaces.widgets) {
                        var _w = PrimeFaces.widgets[pName];
                        if (_w instanceof PrimeFaces.widget.Growl && pName.indexOf('_global') >= 0) {
                            this.globalGrowls.push(_w);
                        }
                    }
                }
            },
            hasGlobalGrowls: function(){
                return this.globalGrowls != null && this.globalGrowls.length > 0;
            },
            showMessage: function(c) {
                if(this.hasGlobalGrowls()){

                    this.closeFixedContent();

                    var a = c.summary
                        , b = "";
                    if (c.filename && c.filesize) {
                        b = this.cfg.messageTemplate.replace("{name}", c.filename).replace("{size}", this.formatSize(c.filesize))
                    }

                    for(var i=0; i < this.globalGrowls.length; i++){
                        var _growl = this.globalGrowls[i];
                        _growl.removeAll();
                        _growl.show([{"summary": a, "detail": b, "severity": "error"}]);
                    }

                } else {
                    this._super(c);
                }

            }
        });
		
	}
	
	/***
	 * Primefaces Chart styles
	 * */
	if(typeof PrimeFaces.widget.Chart !== 'undefined'){
		PrimeFaces.widget.Chart.prototype._oldConfigure = PrimeFaces.widget.Chart.prototype.configure;
		PrimeFaces.widget.Chart.prototype.configure = function(){
			
			var _customCfg = CustomComponents.chartSetup[this.cfg.type];
			if(_customCfg != null){
				this.cfg = $.extend({},this.cfg,_customCfg);
			}
			this._oldConfigure.apply(this, arguments);			
		}
	}
	
	/***
	 * Primefaces AjaxStatus 
	 * - support for custom loading message 
	 * */
	PrimeFaces.widget.AjaxStatus.prototype._oldInit = PrimeFaces.widget.AjaxStatus.prototype.init;
	PrimeFaces.widget.AjaxStatus.prototype.init = function(){
		var _this = this;

        _this._triggerTimeout;

		_this._oldInit.apply(this, arguments);
		
		_this.loadingText = _this.jq.find('.loading-indicator .text span');
		_this.initMessage = _this.loadingText.html();
		
		//GLOBAL LOADING
		window[_this.cfg.widgetVar] = _this;
	}
	
	PrimeFaces.widget.AjaxStatus.prototype.setMessage = function(msg){		
		this.message = (msg == null) ? this.initMessage : msg;
	}
	
	PrimeFaces.widget.AjaxStatus.prototype.updateMessage = function(){
		this.loadingText.html(this.message);
	}
	
	PrimeFaces.widget.AjaxStatus.prototype.resetMessage = function(){
		this.message = this.initMessage;
	}

    PrimeFaces.widget.AjaxStatus.prototype.show = function(message){
        this.setMessage(message);
        this.trigger("start");
    }

    PrimeFaces.widget.AjaxStatus.prototype.hide = function(){
        this.trigger();
    }
	
	PrimeFaces.widget.AjaxStatus.prototype._oldTrigger = PrimeFaces.widget.AjaxStatus.prototype.trigger;
	PrimeFaces.widget.AjaxStatus.prototype.trigger = function(){
		var _that = this;
        var _originalArgs = arguments;

		//this timeout prevents screen flickering when the ajax request runs very fast
        clearTimeout(_that._triggerTimeout);
        _that._triggerTimeout = setTimeout(function(){
            _that.updateMessage();
            _that._oldTrigger.apply(_that, _originalArgs);
            _that.resetMessage();
        }, CustomComponents.ajaxStatusTimeout);

	}
	
	PrimeFaces._oldConfirm = PrimeFaces.confirm;
	PrimeFaces.confirm = function(o){
		var $button = PrimeFaces.expressions.SearchExpressionFacade.resolveComponentsAsSelector(o.source);
		if($button.length > 0){
			var _confirmType = 'normal';
			if($button.hasClass('confirm-danger')){
				_confirmType = 'danger';
			} else if ($button.hasClass('confirm-warning')){
				_confirmType = 'warning';
			}
			
			var _confirmDialog = PrimeFaces.confirmDialogWidgets.filter(function(o,i){
				return o.confirmType == _confirmType;
			});
			if(_confirmDialog.length > 0){
				PrimeFaces.confirmDialog = _confirmDialog[0];
			}
		}
		
		this._oldConfirm.apply(this,arguments);
	}
	
	//CHARTISTJSF
	if(typeof ChartistJSF !== 'undefined' && ChartistJSF.widget != null && ChartistJSF.widget.Chart != null){
		
		ChartistJSF.widget.Chart = ChartistJSF.widget.Chart.extend({
			init : function(cfg) {
				var _that = this;
				
				var $customContainer = $(PrimeFaces.escapeClientId(cfg.id)).parent();
				if($customContainer.hasClass('custom-chartist')){
					_that.customContainer = $customContainer;
					
					if(cfg.type == 'Pie'){ //PIE
						
						var _total = cfg.data.series.reduce(function(a,b){ return a+b; });
						cfg.options.labelInterpolationFnc = function(a,b) {
							
							try {
								var _pct = Math.round(cfg.data.series[b] / _total * 100) + '%';
								return _pct;
							} catch(e){
								console.log(e);
							}
							
							return a;
						}
						
						//defaults for custom-chartist PIE
						cfg.options.labelOffset = 23;
						cfg.options.labelPosition = "outside";
						cfg.options.labelDirection = "explode";
						
					} else if(cfg.type == 'Bar'){ //BAR
						
					}
					
					//defaults for custom-chartist
					cfg.options.chartPadding = 0;
					
					//custom options from data-options
					var _opts = _that.customContainer.data('options');
					if(_opts != null){
						$.extend(cfg.options, _opts);
						
						//distributed series support
						if(_opts.distributeSeries){
							if($.isArray(cfg.data.series)){
								cfg.data.series = cfg.data.series[0].data;
							}
						}
						
					}

				}
				
				_that._super(cfg);
				
				if(_that.customContainer != null){
					_that.generateLegend();
					
					if(cfg.type == 'Pie'){ //PIE
						
						//real outside labels
						if(cfg.options.labelPosition == 'outside'){
							var $labels = $('<span class="ct-labels-group" />');
							_that.jq.addClass('outside-labels').append($labels);
							
							_that.chart.on('created', function(){
								$labels.html('');
								$(_that.chart.svg._node).find('[class~="ct-label"]').each(function(){ //[class~=] workaround for edge/ie
									var $label = $('<span class="ct-label" />');
									$label.css({
										top: $(this).attr('dy')+'px',
										left: $(this).attr('dx')+'px'
									})
									.text($(this).text());
									
									$labels.append($label);
								});
							});
						}
						
					} else if(cfg.type == 'Bar'){ //BAR
						
					}
					
					//resize hidden fix
					_that.chart._oldResizeListener = _that.chart.resizeListener;
					_that.chart.resizeListener = function(){
						if(_that.chart.container.offsetHeight > 0){
							_that.chart._oldResizeListener.apply(_that.chart, arguments);
						}
					}
				}
				
			},
			generateLegend : function(){
				var _that = this;
				
				if(_that.data.labels != null && $.isArray(_that.data.labels)){
					var $legendContainer = $('<div class="ccmp-legends"><ul></ul></div>');
					var $list = $legendContainer.find('ul');
					var _c = ['a','b','c','d','e','f','g'];
					var _cI = 0;
					$.each(_that.data.labels, function(a,b){
						var _l = _c[_cI];
						$list.append('<li class="ct-series-'+_l+'">'+b+'</li>');
						
						_cI = (_cI == _c.length) ? 0 : _cI+1;
					});
					
					_that.customContainer.append($legendContainer);
				}
			}
		});
		
	}
	
}

/***
 * CustomComponents 
 * */
	var menuRetraido = false;
	
	window.addEventListener('resize', function(){
		verificaTamanho();
	});
	
	function verificaTamanho(){
		if (screen.width < 1281){
			if(!menuRetraido)
				CustomComponents.menuRetract('mainMenu')
		} else {
			if(menuRetraido)
				CustomComponents.menuRetract('mainMenu')
		}
	}
	
	
	var CustomComponents = {
        ajaxStatusTimeout: 200,
        fieldsetClientStateHolder: {},
		customValidationStyleClass: 'custom-validation-style',
		defaultValidationStyleClass: 'ui-state-error',
		maxMessagesGrowlCollapse: 6,
    	zIndexBase: 1100, //header z-index
		Base: {
			constructor: function(cfg){
				this.cfg = cfg;
				this.cfg.widgetVar = CustomComponents.escapeID((this.cfg.widgetVar||this.cfg.id));
				this.jq = PrimeFaces.expressions.SearchExpressionFacade.resolveComponentsAsSelector(this.cfg.id);
				
				this.init();
				
				PrimeFaces.widgets[this.cfg.widgetVar] = this;
			},
			init:function(){},
			extend: function(source){
				var _base = function(){ this.constructor.apply(this,arguments); };
				source = $.extend({},this,source);
				for(var pName in source){
					_base.prototype[pName] = source[pName];
				}
				return _base;
			}
		},
		removerAcentos: function(s){
			var map={"â":"a","Â":"A","à":"a","À":"A","á":"a","Á":"A","ã":"a","Ã":"A","ê":"e","Ê":"E","è":"e","È":"E","é":"e","É":"E","î":"i","Î":"I","ì":"i","Ì":"I","í":"i","Í":"I","õ":"o","Õ":"O","ô":"o","Ô":"O","ò":"o","Ò":"O","ó":"o","Ó":"O","ü":"u","Ü":"U","û":"u","Û":"U","ú":"u","Ú":"U","ù":"u","Ù":"U","ç":"c","Ç":"C"};
			return s.replace(/[\W\[\] ]/g,function(a){return map[a]||a})
		},
		searchMenuItem:function(widgetVar,input,searchTimeout){
			searchTimeout = (searchTimeout == null)? 300 : searchTimeout ;
			var _w = PF(widgetVar);
			var _input = input;
			_w.searchInput = input;
			
			
			
			var _searchHandler = function(){
				var _text = _input.value;
				if(_text.length > 0){
					_w.jq.addClass('in-search-mode');
				} else {
					_w.jq.removeClass('in-search-mode');
				}
				
				var _parents = _w.links.parent().removeClass('search-visible').removeClass('search-visible-highlight');
				_w.links.filter(function(i,o){
					return CustomComponents.removerAcentos($(o).text().toUpperCase()).indexOf(CustomComponents.removerAcentos(_text.toUpperCase())) > -1;
				}).parent().addClass('search-visible search-visible-highlight').parents('.ui-menu-parent').addClass('search-visible');
				
			};
			
			if(searchTimeout > 0){
				clearTimeout(_w.__searchMenuTimeout);
				_w.__searchMenuTimeout = setTimeout(_searchHandler, searchTimeout);
			} else {
				_searchHandler.apply(this,arguments);
			}
			
			
		},
		menuRetract: function(widgetVar,onRetractExpand){
			//menu toggler
			var _w = PF(widgetVar);
			var $body = $('body');
			var _animationTime = 500;
			
			if(menuRetraido)
				menuRetraido = false;
			else
				menuRetraido = true;
			
			if(!$body.hasClass('menu-compact-opening')){
				if(!$body.hasClass('menu-compact-prepare')){
					_w.menuRetract(true);
					$body.addClass('menu-compact-prepare').addClass('menu-compact-opening');
					setTimeout(function(){
						$body.addClass('menu-compact');
						setTimeout(function(){
							$body.removeClass('menu-compact-opening');
							
							if(onRetractExpand!=null){
								onRetractExpand.apply(this,arguments);
							}
						},_animationTime);
					},1);
				} else {
					$body.addClass('menu-compact-opening').removeClass('menu-compact');
					setTimeout(function(){
						$body.removeClass('menu-compact-opening').removeClass('menu-compact-prepare');
						_w.menuRetract(false);
						
						if(onRetractExpand!=null){
							onRetractExpand.apply(this,arguments);
						}
						
					},_animationTime);
				}
			}
			
		},
		removeTag: function(id){
			$(PrimeFaces.escapeClientId(id)).remove();
		},
    	downloadStatusBehavior: function(setup){

		    setTimeout(function(){ //issue when called after oncomplete of another ajax behavior (loading already visible)
                var _escapedID = CustomComponents.escapeID(setup.sourceId);
                PrimeFaces.monitorDownload(function(){ //start

                        PrimeFaces.deleteCookie("primefaces.download_"+_escapedID);

                        setup.onStart(setup);
                        if(setup.isGlobal) {
                            $(document).trigger("pfAjaxStart");
                        }

                    }, function(){ //complete

                        var pfSettings = {pfSettings: {source: setup.sourceId}};
                        var _onCompleteHandler = function(){
                            setup.onComplete(setup);
                        };
                        if(setup.isGlobal) {
                            $(document).bind("pfAjaxComplete", _onCompleteHandler);
                            $(document).trigger("pfAjaxComplete", [pfSettings]);
                            $(document).unbind("pfAjaxComplete", _onCompleteHandler);
                        } else {
                            _onCompleteHandler();
                            var _namespace = '.blockAfterAction_' + _escapedID;
                            $(document).trigger("pfAjaxComplete"+_namespace, [pfSettings]);
                        }

                    },
                    _escapedID
                );
            },0);

		},
		blockAfterAction: function(id){
			var $component = PrimeFaces.expressions.SearchExpressionFacade.resolveComponentsAsSelector(id);
			
			if(!$component.hasClass('btn-block')){
				var _btnOnClickBackup = CustomComponents.getOnClickFromStash(id);
				
				if(typeof _btnOnClickBackup === 'undefined'){
					var _namespace = '.blockAfterAction_' + CustomComponents.escapeID(id);
					
					var _oncompleteHandler = function(a,b,c){
						var $component = PrimeFaces.expressions.SearchExpressionFacade.resolveComponentsAsSelector(b.pfSettings.source);
						if($component.hasClass('btn-block')){
							CustomComponents.unblockButton($component);
						}
						var _namespace = '.blockAfterAction_' + CustomComponents.escapeID(b.pfSettings.source);
						$(document).unbind(a.type+_namespace);
						
						//scan/refresh other components
						var _onClickStash = $(document).data('onClickStash') || {};
						for(var pName in _onClickStash){
							CustomComponents.blockButton(PrimeFaces.expressions.SearchExpressionFacade.resolveComponentsAsSelector(_onClickStash[pName].id));
						}
					}
					
					$(document).bind("pfAjaxError"+_namespace, _oncompleteHandler);
					$(document).bind("pfAjaxComplete"+_namespace, _oncompleteHandler);
					
				}
				
				CustomComponents.blockButton($component);
				
			}
			
		},
		blockButton:function($btn){
			if($btn.length > 0 && !$btn.hasClass('btn-block')){
				$btn.addClass('btn-block');
				
				var _onClickStash = $(document).data('onClickStash') || {};
				var _id = $btn.attr('id');
				_onClickStash[CustomComponents.escapeID(_id)] = {id:_id,handler:$btn[0].onclick};
				$(document).data('onClickStash',_onClickStash);
				
				$btn[0].onclick = function(){ return false; };
			}
		},
		unblockButton:function($btn){
			if($btn.length > 0){
				$btn[0].onclick = CustomComponents.getOnClickFromStash($btn.attr('id'), true);
				$btn.removeClass('btn-block');
			}
		},
		getOnClickFromStash:function(id, remove){
			var _onClickStash = $(document).data('onClickStash') || {};
			remove = remove || false;
			
			var _fn = _onClickStash[CustomComponents.escapeID(id)];
				_fn = (_fn != null)?_fn.handler:undefined;
			
			if(remove){
				delete _onClickStash[CustomComponents.escapeID(id)];
			}
			
			return _fn;
		},
		onLoadDashboardWidget:function(xhr){
			try {
				var $widget = $(PrimeFaces.escapeClientId(xhr.pfSettings.source)).parent();
				$widget.removeClass('loading');
				
			} catch (e) {
				console.error('A requisição não retornou os atributos esperados!');
				console.error(e);
			}
		},
    	setCaretPosition:function(elem, caretPos) {
			if(elem != null) {
				if(elem.createTextRange) {
					var range = elem.createTextRange();
					range.move('character', caretPos);
					range.select();
				}
				else {
					if(elem.selectionStart) {
						elem.focus();
						elem.setSelectionRange(caretPos, caretPos);
					}
					else
						elem.focus();
				}
			}
		},
		escapeID:function(id){
			return id.replace(/:/g,'_');
		},
    	validationFailed:function(strIDs){
            //clear all error styles
            CustomComponents.clearValidationFailed();

			if(strIDs != null && strIDs != ""){
				//find all components/labels and style them
				var _errorClass = CustomComponents.defaultValidationStyleClass + ' ' + CustomComponents.customValidationStyleClass;
				var arrIDs = strIDs.split(",");
				if(arrIDs.length > 0){
				    var _globalGrowl = PF('growl_global');
				    var _growlChanged = false;
					for(var i=0; i< arrIDs.length; i++){
						var _id = arrIDs[i];
						var $component = $(PrimeFaces.escapeClientId(_id));
						if($component.length > 0){
                            $component.addClass(_errorClass); //mark component error
                            var $label = CustomComponents.findLabelsByForAttr(_id);
                            if($label.length > 0){
                                $label.addClass(_errorClass); //mark label error
                                if(_globalGrowl != null && CustomComponents.updateGrowlCfg(_globalGrowl, $label, $component, i)){
                                    _growlChanged = true;
                                }
							}
						}
					}

					//refresh growl
                    if(_growlChanged && _globalGrowl != null){
                        _globalGrowl.refresh(_globalGrowl.cfg);
                    }

				}
			}
		},
		clearValidationFailed:function(){
            $('.'+CustomComponents.customValidationStyleClass)
                .removeClass(CustomComponents.customValidationStyleClass)
                .removeClass(CustomComponents.defaultValidationStyleClass);
		},
        updateGrowlCfg:function(growlWidget, $label, $component, msgIndex){
            if (growlWidget.cfg.msgs != null && growlWidget.cfg.msgs[msgIndex] != null) {
            	var labelContent = $label.contents().get(0);
            	var _textLabel = null;
            	if (labelContent != null) {
            		_textLabel = labelContent.nodeValue;
            	} else {
            		_textLabel = $label.attr("data-p-label");
            	}
                if (_textLabel != null && growlWidget.cfg.msgs[msgIndex].detail.indexOf(_textLabel.trim()) >= 0) {
                    growlWidget.cfg.msgs[msgIndex].detail = '<a href="javascript:;" onclick="CustomComponents.focusComponent(\''+$component.attr('id')+'\')">'+growlWidget.cfg.msgs[msgIndex].detail+'</a>';
                    growlWidget.cfg.escape = false;
                    return true;
                }
            }
            return false;
        },
        focusComponent: function(componentID){

            var $component = $(PrimeFaces.escapeClientId(componentID));

            if($component.length == 1){
                try {
                    if(!$component.is(':visible')){
                        $component.parents('.ui-tabs-panel').each(function(){
                            var $item = $(this);
                            $item.parents('.ui-tabs:first').find('> .ui-tabs-navscroller > .ui-tabs-nav > li:eq('+$item.index()+')').click();
                        });
                    }

                    //scrollTo and focus
                    $('.pulse-focused').removeClass('pulse-focused');
                    var c = $component.offset();
                    var _top = c.top - $('.main-header:first').outerHeight() - 80;
                    $('html,body').stop().animate({scrollTop:_top},'fast',null,function(){
                        $component.focus();
                        $component.addClass('pulse-focused');
                        setTimeout(function(){
                            $component.removeClass('pulse-focused');
                        },1000);
                    });
                    //------------------

                } catch(e){
                    console.warn('Component '+componentID+' not focusable!');
                }
            }
        },
		findLabelsByForAttr:function(_id){
            var $label = $('label[for="'+_id+'"],label[for="'+_id+'_input"],label[for="'+_id+'_focus"]');
            if ($label.length > 0) {
                $label = $label.filter(':first');
			} else {
				var $input = $('input[id="'+_id+'"],input[id="'+_id+'_input"],input[id="'+_id+'_focus"]');
				if ($input.length > 0) {
					$input = $input.filter(':first');
				}
				return $input;
			}
			return $label;
		},
        fullScreen:function() {
            var el = document.documentElement,
            rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
            rfs.call(el);
        },
        handleLockScrollbars: function(){
		    setTimeout(function(){ //force async
                var _lockClass = 'locked-scrollbar';
                var _lockBarClass = 'scrollbar-space';
                var $overlays = $('.ui-widget-overlay.ui-dialog-mask');
                var $body = $('body');

                if($overlays.length > 0){
                    $body.addClass(_lockClass);
                    if($body.get(0).scrollHeight > $body.height()){
                        $body.addClass(_lockBarClass);
                    }
                } else {
                    $body.removeClass(_lockClass).removeClass(_lockBarClass);
                }
            }, 0);
        },
        customRemoteCommand: function(setup){
            setup.action();
            if(setup.behaviors != null && setup.behaviors.submit != null){
                setup.behaviors.submit();
            }
        },
        extractIconLegendStyleClass: function(fullStyleClass){
            var _styleClass = "fa ";
            var _match = fullStyleClass.match(/(fa-[^\s]*)/);
            if(_match != null && _match.length > 0){
                _styleClass += _match[0].replace(/\s/gi,'');
            }
            return _styleClass;
        },
        printViewByID: function(id){
            CustomComponents.printView($(PrimeFaces.escapeClientId(id)));
        },
        printViewBySelector: function(sel){
            CustomComponents.printView($(sel));
        },
        printView: function($elem){
            if($elem.length == 0){
                console.error("Nenhum elemento encontrado.");
                return false;
            }

            $('body').addClass('printing-view');
            var $dummyHeight = $('<div class="dummy-height-box"></div>');
            $dummyHeight.css('height', $elem.outerHeight(true));
            $('body').append($dummyHeight);

            html2canvas($elem.get(0), {
                onrendered: function(canvas) {

                    var $img = $('<img class="img-to-print" />');
                    $img.attr('src', canvas.toDataURL("image/png"));
                    $('body').append($img);

                    var clearPrintViewStyles = function() {
                        $('.dummy-height-box').remove();
                        $('.img-to-print').remove();
                        $('body').removeClass('printing-view');
                    };

                    //---- after print event
                    if(!CustomComponents.printingEventCache) {
                        if (window.matchMedia) {
                            var mediaQueryList = window.matchMedia('print');
                            mediaQueryList.addListener(function (mql) {
                                if (!mql.matches) {
                                    clearPrintViewStyles();
                                }
                            });
                        }
                        window.onafterprint = clearPrintViewStyles;
                        CustomComponents.printingEventCache = true;
                    }
                    //--// after print event

                    setTimeout(function(){
                        window.print();
                    }, 1);

                }
            });
        }
};


/***
 * CustomComponents / TogglePanel */

CustomComponents.TogglePanel = CustomComponents.Base.extend({
	init: function(){
		this.btnToggle = this.jq.find('.btn-toggle-panel:first');
		this.content = this.jq.find('.toggle-panel-content');
		this.text = this.btnToggle.find('.text:first');
		this.icon = this.btnToggle.find('i:first');
		this.bindEvents();
		
		this.hide(0);
	},
	bindEvents: function(){
		var _this = this;
		this.btnToggle.click(function(){
			if(_this.jq.hasClass('visible-toggle-panel')){
				_this.hide('fast');
			} else {
				_this.show('fast');
			}
		});
	},
	show: function(speed){
		var _this = this;
		this.text.text(this.cfg.hideText);
		this.icon.attr('class',this.cfg.hideIcon);
		this.content.stop().slideDown(speed, function(){
			_this.jq.addClass('visible-toggle-panel');
		});
	},
	hide: function(speed){
		var _this = this;
		this.text.text(this.cfg.showText);
		this.icon.attr('class',this.cfg.showIcon);
		this.content.stop().slideUp(speed, function(){
			_this.jq.removeClass('visible-toggle-panel');
		});
	}
});

if(typeof PrimeFaces.widget.Chart !== 'undefined'){
	CustomComponents.chartSetup = {
		pie: {
			renderer:$.jqplot.PieRenderer,
	        rendererOptions:{
	             sliceMargin: 2,
	             startAngle: -90,
	             dataLabelPositionFactor: 0.5
	         },
			showDataLabels: true,
			gridPadding: { top: 0, bottom: 0, left: 0, right: 0 },
			seriesColors: ["#EAA228","#579575","#D93600"],
			shadow: false,
			borderWidth: 0,
			grid: {
				background: 'transparent',
				shadow: false,
				borderWidth: 0
			},
			legend:{
	            show:true, 
	            placement: 'outside', 
	            rendererOptions: {
	                numberRows: 1
	            }, 
	            location:'s'
			}
		}
	};
}

/***
 * jQuery behaviours
 * */
if(typeof $ !== 'undefined'){
	
	$(function(){
		if(typeof ResizeSensor !== 'undefined' && typeof $.fn.perfectScrollbar !== 'undefined'){
			$('.perfect-scrollbar').each(function(){
				var $this = $(this).wrapInner('<div class="inner-resizable"></div>');
				var $wrapper = $this.find('.inner-resizable:first');
				$this.perfectScrollbar({suppressScrollX:true});
				var resizeSensor = new ResizeSensor($wrapper, function() {
				    $this.perfectScrollbar('update');
				});
				
				$this.data('resizesensor', resizeSensor);
				
			});
		}
		
		//top compact
		window._isTopCompact = false;
		var _initTopHeight 	= 20;
		var _resizeCompactTimeout;

		$(window).scroll(function(){
			var _scrollTop = $(this).scrollTop();

			if(!window._isTopCompact && _scrollTop >= _initTopHeight){
				$('body').addClass('top-compact');
				window._isTopCompact = true;
			} else if(window._isTopCompact && _scrollTop < _initTopHeight) {
				$('body').removeClass('top-compact');
				window._isTopCompact = false;
			}

			//trigger resize (fix absolute oneMenu bug)
			clearTimeout(_resizeCompactTimeout);
            _resizeCompactTimeout = setTimeout(function(){
			    $(window).trigger('resize');
            }, 400);
			
		}).trigger('scroll');
		
	});
	
}

/***
 * Global Functions
 * */

//Show primefaces dialog, given widgetVar
function dShow(widgetVar, args){
	if(validatePrimeArgs(args)){
		return;
	}
	PF(widgetVar).show();
}

//Hide primefaces dialog, given widgetVar
function dHide(widgetVar, args){
    if(validatePrimeArgs(args)){
        return;
    }
    PF(widgetVar).hide();
}

function validatePrimeArgs(args){
	return args != null && typeof args !== 'undefined' && args.validationFailed;
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function valideMaxSize(evt, maxLenght) {
	var caller = evt.target || evt.srcElement;
	if (caller.value.length >= maxLenght) {
		caller.value = caller.value.substring(0, maxLenght);
		return false
	}
	return true;
}

function valideMaxSizeOnlyNumber(evt, maxLenght) {
	return isNumberKey(evt) && valideMaxSize(evt, maxLenght);
}

function formatBindFilterGridPrime(element, maxLenght, onlyNumber) {
	$(element).bind('paste', function() {
       setTimeout(function() { 
    	  if (onlyNumber) {
    		 $(element).val($(element).val().replace(new RegExp("[^0-9]", "g"), ''));
    	  }
          var data = $(element).val() ;
          if (data.length >= maxLenght) {
        	  $(element).val(data.substring(0, maxLenght));
      	  }
       });
    });
}

function pasteOnlyNumberAndMaxSize(element, maxLenght) {
	formatBindFilterGridPrime(element, maxLenght, true);
}

function pasteMaxSize(element, maxLenght) {
	formatBindFilterGridPrime(element, maxLenght, false);
}

function formatInputFilterGridPrimeOnlyNumber(element, maxSize) {
	element.onkeypress = function(){ return valideMaxSizeOnlyNumber(event, maxSize); };
	pasteOnlyNumberAndMaxSize(element, maxSize);
}

function formatInputFilterGridPrime(element, maxSize) {
	element.onkeypress = function(){ return valideMaxSize(event, maxSize); };
	pasteMaxSize(element, maxSize);
}

//PROMISE COMPAT
if(typeof Promise === 'undefined' && typeof ES6Promise !== 'undefined'){
    var Promise = ES6Promise;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}