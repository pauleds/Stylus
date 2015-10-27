define(function (require) {
    var
	JQueryCookie = require('jquery.cookie'),
	BaseView = require('views/base');

    var OptionsView = BaseView.extend({

        TAG: 'OptionsView',

        template: JST['app/scripts/templates/options.ejs'],

        _sliderValue: null,

        initialize: function (options) {

            this._initializeBase(options);

            this.listenTo(this.model, 'change:pageSimple', this._onChangePageSimple);
            this.listenTo(this.model, 'change:pageView', this._onChangePageView);
            this.listenTo(this.model, 'change:textContrast', this._onChangeTextContrast);
            this.listenTo(this.model, 'change:textSize', this._onChangeTextSize);

        },

        serialize: function () {
            var model = this.model;
            return {
                textSize: model.getTextSize(),
                textSizeMin: model.getTextSizeMin(),
                textSizeMax: model.getTextSizeMax(),
                textSizeStep: model.getTextSizeStep()
            };
        },

        afterRender: function () {

            var _this = this;

            this.$document = $(document);

            $(document).foundation('slider', 'reflow');

            /*****/

            this.$elReload = $('#page-view-reload');
            this.$elDuplicate = $('#page-view-duplicate');
            this.$elPlain = $('#page-view-plain');
            this.$elPrint = $('#page-view-print');

            this.$elReload.click(function (event) {
                _this._sendEvent('optionsViewPage', 'reload', 300);
            });

            this.$elDuplicate.click(function (event) {
                _this._sendEvent('optionsViewPage', 'duplicate', 300);
            });

            this.$elPlain.click(function (event) {
                _this._sendEvent('optionsViewPage', 'plain', 300);
            });

            this.$elPrint.click(function (event) {
                _this._sendEvent('optionsViewPage', 'print', 300);
            });

            /*****/

            this.$elSimple = $('#page-view-simple');
            this.$elEnhanced = $('#page-view-enhanced');

            this.$elSimple.click(function (event) {
                _this.model.updatePageSimple(true);
                _this._closeMenu();
            });

            this.$elEnhanced.click(function (event) {
                _this.model.updatePageSimple(false);
                _this._closeMenu();
            });

            /*****/

            this.$elSuccessive = $('#page-view-successive');
            this.$elContinuous = $('#page-view-continuous');

            this.$elSuccessive.click(function (event) {
                _this.$elContinuous.removeClass('active');
                _this.$elSuccessive.addClass('active');
                _this.model.updatePageView('successive');
                _this._closeMenu();
            });

            this.$elContinuous.click(function (event) {
                _this.$elContinuous.addClass('active');
                _this.$elSuccessive.removeClass('active');
                _this.model.updatePageView('continuous');
                _this._closeMenu();
            });

            /*****/

            this.$elTextSizeSlider = $('#text-size-slider');
            this.$elTextSizeReset = $('#text-size-reset');
            this.$elTextSizeIncrease = $('#text-size-increase');
            this.$elTextSizeDecrease = $('#text-size-decrease');

            this.$elTextSizeSlider.on('change.fndtn.slider', function () {
                _this._processTextSizeValue();
            });

            this.$elTextSizeReset.click(function (event) {
                _this._processTextSizeValue(0);
            });

            this.$elTextSizeIncrease.click(function (event) {
                _this._processTextSizeValue(1);
            });

            this.$elTextSizeDecrease.click(function (event) {
                _this._processTextSizeValue(-1);
            });

            /*****/

            this.$elTextContrastButtons = this.$el.find('#text-contrast .button');
            this.$elTextContrastButtons.each(function (index) {
                var $button = $(this);
                var value = $button.find('> span').attr('class');
                $button.click(function (event) {
                    _this.model.updateTextContrast(value);
                });
            });

            this.$elTextSizeSample = $('#text-size-sample');
            this.listenTo(this.model, 'change:textSizePx', function (options) {
                _this.$elTextSizeSample.css('font-size', options.getTextSizePx());
            });

            this.model.start();

        },

        _onChangePageSimple: function (model) {
            var pageSimple = model.getPageSimple();
            this.$elSimple.removeClass('active');
            this.$elEnhanced.removeClass('active');
            if (pageSimple === true) {
                this.$elSimple.addClass('active');
            } else {
                this.$elEnhanced.addClass('active');
            }
            // this._debug( '_onChangePageSimple', pageSimple );
        },

        _onChangePageView: function (model) {
            var pageView = model.getPageView();
            this.$elSuccessive.removeClass('active');
            this.$elContinuous.removeClass('active');
            if (pageView === 'successive') {
                this.$elSuccessive.addClass('active');
            } else {
                this.$elContinuous.addClass('active');
            }
            // this._debug( '_onChangePageView', pageView );
        },

        _onChangeTextSize: function (model) {
            var textSize = model.getTextSize();
            if (this._sliderValue !== textSize) {
                this._setTextSizeSliderValue(textSize);
            }
            // this._debug( '_onChangeTextSize', textSize );
        },

        _onChangeTextContrast: function (model) {
            var textContrast = model.getTextContrast();
            var $div = this.$elTextSizeSample.find('> div');
            $div.removeClass().addClass(textContrast);
            this.$elTextContrastButtons.removeClass('active');
            $('.' + textContrast).parent().addClass('active');
            // this._debug( '_onChangeTextContrast', textContrast );
        },

        _processTextSizeValue: function (command) {
            var sliderValue = this._getTextSizeSliderValue();
            if (this._sliderValue === sliderValue && typeof command === 'undefined') {
                return false;
            } else if (this._sliderValue == null) {
                this._sliderValue = sliderValue;
                return false;
            }
            this._sliderValue = sliderValue;
            this.model.updateTextSize(sliderValue, command);
        },

        _getTextSizeSliderValue: function () {
            return this.$elTextSizeSlider.attr('data-slider');
        },

        _setTextSizeSliderValue: function (value) {
            this.$elTextSizeSlider.foundation('slider', 'set_value', value);
        },

        _closeMenu: function (name, value) {
            if (typeof name !== 'undefined') {
                var _this = this;
                this.$document.on('closed.fndtn.reveal', '[data-reveal]', function () {
                    _this._sendEvent(name, value, 300);
                });
            }
            this.$el.foundation('reveal', 'close');
        }
    });

    return OptionsView;
});
