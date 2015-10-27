define(function (require) {
    var
	WidgetsCollection = require('collections/widgets'),
	BaseView = require('views/base');

    var WIDGETS_ALL = 'stylus-widget-';
    var WIDGETS = {
        ACCORDION: 'accordion',
        AUDIO: 'audio',
        BUTTON: 'button',
        DIALOG: 'dialog',
        FEATURE: 'feature',
        SLIDER: 'slider',
        TABS: 'tabs',
        VIDEO: 'video'
    };

    var PageView = BaseView.extend({

        TAG: 'PageView',

        template: JST['app/scripts/templates/page.ejs'],

        initialize: function (options) {

            this._initializeBase(options);

            var _this = this;

            this.listenTo(this.model, 'change:isVisible', this._onChangeVisibility);

            // Process original widget content.
            var pageId = this.id;
            var $originalWidgets = $('#' + pageId).find('[class^="' + WIDGETS_ALL + '"],[class*=" ' + WIDGETS_ALL + '"]');
            var widgetModels = [];

            $originalWidgets.each(function (index) {

                var $originalWidget = $(this);
                var number = index + 1;
                var widgetId = pageId + '-w' + number;
                var widgetDefinition = _this._getWidgetDefinition($originalWidget);

                if (widgetDefinition) {

                    var widgetType = widgetDefinition.widgetType;

                    $originalWidget.addClass('simple-content').wrap('<div id="' + widgetId + '" class="stylus-widget widget-' + widgetType + '" />');

                    var id = widgetId + '-widget';

                    var widgetModel = new widgetDefinition.modelClass({
                        id: id,
                        parentId: widgetId,
                        classArray: widgetDefinition.classArray,
                        simpleContent: $originalWidget.parent().html()
                    });

                    var widgetView = new widgetDefinition.viewClass({
                        id: id,
                        model: widgetModel,
                        notifier: _this.notifier
                    });

                    _this.setView('#' + widgetId, widgetView, true);

                    $originalWidget.remove();
                    widgetModels.push(widgetModel);

                }

            });

            var $this = $('#' + this.id);
            var title = $.trim($this.find('.header h2').first().text());
            var content = $.trim($this.find('.content').html());

            this.model.set('title', title);
            this.model.set('content', content);
            this.model.set('widgets', new WidgetsCollection(widgetModels, {}));

        },

        serialize: function () {
            return {
                page: this.model
            };
        },

        afterRender: function () {
            // this._debug( 'afterRender', this.id );
        },

        _onChangeVisibility: function (model) {
            var isVisible = model.get('isVisible');
            if (isVisible) {
                this.$el.stop(true, true).show().css({
                    'opacity': 1,
                    'left': '0px',
                    'visibility': 'visible'
                });

            } else {
                this.$el.stop(true, true).hide().css({
                    'opacity': 0,
                    'left': '0px',
                    'visibility': 'hidden'
                });
            };
            this.notifier.trigger('pageVisibilityChanged', this.model);
        },

        show: function () {
            this.model.setVisible(true);
        },

        hide: function () {
            this.model.setVisible(false);
        },

        loseFocus: function (transition, onComplete) {

            var _this = this;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this._afterLoseFocus();
                onComplete();
            };

            this._beforeLoseFocus();

            if (transition === 'slideLeftFadeOut') {
                this._slideLeftFadeOut(_onComplete);
            } else if (transition === 'slideRightFadeOut') {
                this._slideRightFadeOut(_onComplete);
            } else {
                _onComplete();
            }

        },

        gainFocus: function (transition, onComplete) {

            var _this = this;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this._afterGainFocus();
                onComplete();
            };

            this._beforeGainFocus();

            if (transition === 'slideLeftFadeIn') {
                this._slideLeftFadeIn(_onComplete);
            } else if (transition === 'slideRightFadeIn') {
                this._slideRightFadeIn(_onComplete);
            } else {
                _onComplete();
            }

        },

        _slideLeftFadeIn: function (onComplete) {

            var _this = this;
            var duration = 280;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this.model.setVisible(true);
                onComplete();
            };

            this.$el.stop(true, true).css({
                'left': '20px',
                'opacity': 0,
                'position': 'relative',
                'visibility': 'hidden'
            }).show().css({
                'visibility': 'visible'
            }).animate({
                opacity: 1,
                left: '0px'
            }, duration, _onComplete);

        },

        _slideRightFadeIn: function (onComplete) {

            var _this = this;
            var duration = 280;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this.model.setVisible(true);
                onComplete();
            };

            this.$el.stop(true, true).css({
                'left': '-20px',
                'opacity': 0,
                'position': 'relative',
                'visibility': 'hidden'
            }).show().css({
                'visibility': 'visible'
            }).animate({
                opacity: 1,
                left: '0px'
            }, duration, _onComplete);

        },

        _slideLeftFadeOut: function (onComplete) {

            var _this = this;
            var duration = 280;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this.model.setVisible(false);
                onComplete();
            };

            this.$el.stop(true, true).animate({
                opacity: 0,
                left: '-20px',
                visibility: 'hidden'
            }, duration, _onComplete);

        },

        _slideRightFadeOut: function (onComplete) {

            var _this = this;
            var duration = 280;
            var onComplete = this._value(onComplete, function () {
            });

            var _onComplete = function () {
                _this.model.setVisible(false);
                onComplete();
            };

            this.$el.stop(true, true).animate({
                opacity: 0,
                left: '20px',
                visibility: 'hidden'
            }, duration, _onComplete);

        },

        _beforeGainFocus: function () {
            // this._debug( '_beforeGainFocus', this.model.getId( ) );
            this._sendEvent('beforePageGainFocus', this.model);
        },

        _afterGainFocus: function () {
            this.model.setFocus(true);
            // this._debug( '_afterGainFocus', this.model.getId( ) );
            this._sendEvent('afterPageGainFocus', this.model);
        },

        _beforeLoseFocus: function () {
            // this._debug( '_beforeLoseFocus', this.model.getId( ) );
            this._sendEvent('beforePageLoseFocus', this.model);
        },

        _afterLoseFocus: function () {
            this.model.setFocus(false);
            // this._debug( '_afterLoseFocus', this.model.getId( ) );
            this._sendEvent('afterPageLoseFocus', this.model);
        },

        _getWidgetDefinition: function ($widget) {
            var classArray = $widget.attr('class').split(' ');
            classArray = this._value(classArray, []);
            var length = classArray.length;
            for (var i = 0; i < length; i++) {
                var item = classArray[i];
                if (item.substring(0, WIDGETS_ALL.length) === WIDGETS_ALL) {
                    var widgetType = item.substring(WIDGETS_ALL.length);
                    var modelClass, viewClass;
                    if (widgetType === WIDGETS.ACCORDION) {
                        modelClass = require('models/widgets/accordion');
                        viewClass = require('views/widgets/accordion');
                    } else if (widgetType === WIDGETS.AUDIO) {
                        modelClass = require('models/widgets/audio');
                        viewClass = require('views/widgets/audio');
                    } else if (widgetType === WIDGETS.BUTTON) {
                        modelClass = require('models/widgets/button');
                        viewClass = require('views/widgets/button');
                    } else if (widgetType === WIDGETS.DIALOG) {
                        modelClass = require('models/widgets/dialog');
                        viewClass = require('views/widgets/dialog');
                    } else if (widgetType === WIDGETS.FEATURE) {
                        modelClass = require('models/widgets/feature');
                        viewClass = require('views/widgets/feature');
                    } else if (widgetType === WIDGETS.SLIDER) {
                        modelClass = require('models/widgets/slider');
                        viewClass = require('views/widgets/slider');
                    } else if (widgetType === WIDGETS.TABS) {
                        modelClass = require('models/widgets/tabs');
                        viewClass = require('views/widgets/tabs');
                    } else if (widgetType === WIDGETS.VIDEO) {
                        modelClass = require('models/widgets/video');
                        viewClass = require('views/widgets/video');
                    }
                    if (typeof modelClass == 'undefined' || typeof viewClass == 'undefined') {
                        // throw new Error( this._debug( 'Widget type not valid.', widgetType, true ) );
                        this._debug('ERROR', 'Widget type not valid: stylus-widget-' + widgetType);
                        return false;
                    }
                    return {
                        modelClass: modelClass,
                        viewClass: viewClass,
                        widgetType: widgetType,
                        classArray: classArray
                    };
                }
            };
        }
    });

    PageView.prototype.toString = function () {
        var id = this.id;
        var widgets = this.getViews().value().length;
        return '[' + this.TAG + ' : ' + id + ' : ' + widgets + ']';
    };

    return PageView;
});
