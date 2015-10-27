define(function (require) {
    var
	BaseView = require('views/base');

    var roundValue = function (value) {
        return Math.round(value * 10) / 10;
    };

    var ContentsSmallView = BaseView.extend({

        TAG: 'ContentsSmallView',

        template: JST['app/scripts/templates/contents.ejs'],

        initialize: function (options) {

            this._initializeBase(options);

            this.notifier.on({
                'applicationReady': this._onApplicationReady,
                'focusOnPageComplete': this._onFocusOnPageComplete
            }, this);

        },

        serialize: function () {
            return {
                pages: this.model
            };
        },

        _onApplicationReady: function (appModel) {
            this._updateMenu();
        },

        _onFocusOnPageComplete: function (page) {
            var number = page.get('number');
            var className = 'active';
            this.$el.find('li').removeClass(className);
            this.$el.find('li.link-page-' + number).addClass(className);
        },

        _updateMenu: function () {
            // Force a scroll back to current page if current page is selected.
            var _this = this;
            this.$el.find('a').click(function () {
                var href = $(this).attr('href');
                var hrefNumber = roundValue(href.substring(href.lastIndexOf('/') + 1));
                var url = location.href;
                var urlNumber = roundValue(url.substring(url.lastIndexOf('/') + 1));
                if (hrefNumber === urlNumber) {
                    _this.notifier.trigger('contentsSmallMenuClosed', hrefNumber);
                }
            });
        }
    });
    return ContentsSmallView;
});
