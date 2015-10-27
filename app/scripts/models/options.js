define(function (require) {
    var
	JQueryCookie = require('jquery.cookie'),
	BaseModel = require('models/base');

    var COOKIE = {
        PAGE_SIMPLE: 'stylus_page_simple',
        PAGE_VIEW: 'stylus_page_view',
        TEXT_CONTRAST: 'stylus_text_contrast',
        TEXT_SIZE: 'stylus_text_size'
    };

    var _roundValue = function (value) {
        return Math.round(value * 10) / 10;
    };

    var OptionsModel = BaseModel.extend({

        TAG: 'OptionsModel',

        defaults: $.extend(true, {}, BaseModel.prototype.defaults, {

            pageSimple: null,
            pageView: null,

            textContrast: null,
            textSize: null,

            textSizeOriginal: 1,
            textSizePx: null,
            textSizeOriginalPx: null,
            textSizeMin: 0.8,
            textSizeMax: 7,
            textSizeStep: 0.2

        }),

        getPageSimple: function () {
            return this.get('pageSimple');
        },

        getPageView: function () {
            return this.get('pageView');
        },

        getPageViewIsSuccessive: function () {
            return (this.get('pageView') === 'successive');
        },

        getTextContrast: function () {
            return this.get('textContrast');
        },

        getTextSize: function () {
            return this.get('textSize');
        },

        getTextSizePx: function () {
            return this.get('textSizePx');
        },

        getTextSizeOriginal: function () {
            return this.get('textSizeOriginal');
        },

        getTextSizeOriginalPx: function () {
            return this.get('textSizeOriginalPx');
        },

        getTextSizeMin: function () {
            return this.get('textSizeMin');
        },

        getTextSizeMax: function () {
            return this.get('textSizeMax');
        },

        getTextSizeStep: function () {
            return this.get('textSizeStep');
        },

        start: function () {

            var textSize = this._getCookie(COOKIE.TEXT_SIZE);
            this.updateTextSize(textSize);

            var textContrast = this._getCookie(COOKIE.TEXT_CONTRAST);
            this.updateTextContrast(textContrast);

            var pageView = this._getCookie(COOKIE.PAGE_VIEW);
            this.updatePageView(pageView);

            var pageSimple = this._getCookie(COOKIE.PAGE_SIMPLE);
            this.updatePageSimple(pageSimple);

        },

        updateTextSize: function (value, command) {
            value = (typeof value !== 'undefined') ? value : 1;
            var textSize = parseFloat(value, 10);
            if (command == 0) {
                textSize = this.getTextSizeOriginal();
            } else if (command == 1) {
                if (textSize < this.getTextSizeMax()) {
                    textSize = _roundValue(textSize + this.getTextSizeStep());
                }
            } else if (command == -1) {
                if (textSize > this.getTextSizeMin()) {
                    textSize = _roundValue(textSize - this.getTextSizeStep());
                }
            }
            var textSizeOriginalPx = parseFloat(this.getTextSizeOriginalPx(), 10);
            this.set('textSize', textSize);
            this.set('textSizePx', textSizeOriginalPx * textSize);
            this._setCookie(COOKIE.TEXT_SIZE, textSize);
        },

        updateTextContrast: function (value) {
            var textContrast = (typeof value !== 'undefined') ? value : 'contrast-black-on-white';
            this.set('textContrast', textContrast);
            this._setCookie(COOKIE.TEXT_CONTRAST, textContrast);
        },

        updatePageView: function (value) {
            value = (typeof value !== 'undefined') ? value : 'successive';
            var pageView = (value !== 'successive') ? value : 'successive';
            this.set('pageView', pageView);
            this._setCookie(COOKIE.PAGE_VIEW, pageView);
        },

        updatePageSimple: function (value) {
            var pageSimple = (typeof value !== 'undefined') ? this._toBoolean(value) : false;
            this.set('pageSimple', pageSimple);
            this._setCookie(COOKIE.PAGE_SIMPLE, pageSimple);
        },

        _setCookie: function (key, value, exdays) {
            exdays = (typeof exdays !== 'undefined') ? exdays : 14;
            $.cookie(key, value, {
                expires: exdays,
                path: '/'
            });
            // this._debug( '_setCookie/' + key, $.cookie( key ) );
        },

        _getCookie: function (key) {
            // this._debug( '_getCookie/' + key, $.cookie( key ) );
            return $.cookie(key);
        }
    });

    return OptionsModel;
});
