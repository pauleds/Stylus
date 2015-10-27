define(function (require) {
    var
	JQueryJScrollPane = require('jquery.jscrollpane'),
	JQueryMouseWheel = require('jquery.mousewheel'),
	JQueryMouseWheelIntent = require('jquery.mwheelIntent'),
	BaseView = require('views/base');

    var ContentsView = BaseView.extend({

        TAG: 'ContentsView',

        template: JST['app/scripts/templates/contents.ejs'],

        _scrollpaneLoaded: false,

        initialize: function (options) {

            this._initializeBase(options);

            this.notifier.on({
                'applicationReady': this._onApplicationReady,
                'focusOnPageComplete': this._onFocusOnPageComplete,
                'viewSizeUpdated': this._onViewSizeUpdated
            }, this);

        },

        serialize: function () {
            return {
                pages: this.model
            };
        },

        _onApplicationReady: function (appModel) {
            this._onViewSizeUpdated(appModel.get('viewIsSmall'));
        },

        _onFocusOnPageComplete: function (page) {
            var number = page.get('number');
            this.$el.find('li').removeClass('active');
            this.$el.find('li.link-page-' + number).addClass('active');
        },

        _onViewSizeUpdated: function (viewIsSmall) {
            if (!this._scrollpaneLoaded && viewIsSmall == false) {
                this._updateMenu();
            }
        },

        _updateMenu: function () {
            // Apply stylised scroll bar to drop-down menu, but only the once.
            if (this._scrollpaneLoaded) {
                return false;
            }
            this._scrollpaneLoaded = true;
            var _this = this;
            var $elContentsMenu = $('#navitem-contents-menu');
            var width = 220;
            $elContentsMenu.jScrollPane({
                verticalGutter: 0,
                horizontalGutter: 0,
                contentWidth: width,
                pauledsPaneWidth: width,
                mouseWheelSpeed: 20
            });
        }
    });

    return ContentsView;
});
