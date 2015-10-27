define(function (require) {
    var
	ContentsView = require('views/contents'),
	ContentsSmallView = require('views/contentsSmall'),
	OptionsView = require('views/options'),
	JQueryHoverIntent = require('jquery.hoverintent'),
	BaseView = require('views/base');

    var NavbarView = BaseView.extend({

        TAG: 'NavbarView',

        id: 'header-navigation',

        template: JST['app/scripts/templates/navbar.ejs'],

        initialize: function (options) {

            this._initializeBase(options);

            this.listenTo(this.model, 'paginationUpdated', this._onPaginationUpdated);

            this.setViews({

                '#navitem-contents-small-menu-inner': new ContentsSmallView({
                    id: 'navitem-contents-small-menu-items',
                    model: options.pages,
                    notifier: this.notifier
                }),

                '#navitem-contents-menu-inner': new ContentsView({
                    id: 'navitem-contents-menu-items',
                    model: options.pages,
                    notifier: this.notifier
                })

            });

        },

        serialize: function () {
            return {
                navbar: this.model
            };
        },

        afterRender: function () {

            var _this = this;

            this.$elInfo = this.$el.find('#navitem-info > h1 span.info');
            this.$elPrevious = this.$el.find('#navitem-previous > a');
            this.$elNext = this.$el.find('#navitem-next > a');

            // Apply hide delay to contents menu to prevent accidental mouse out.
            var $elContents = this.$el.find('#navitem-contents');
            var $elContentsMenu = this.$el.find('#navitem-contents-menu');
            var className = 'hover';
            $elContentsMenu.hoverIntent({
                timeout: 800,
                over: function () {
                    $elContents.addClass(className);
                },
                out: function () {
                    $elContents.removeClass(className);
                }
            });

            this.$elContents = $elContents;

            return this;

        },

        _onPaginationUpdated: function (pagination) {

            if (!this.$elInfo) {
                return false;
            }

            var pagesTotal = pagination.getPagesTotal(),
			pageInfo = pagination.getPageInfo(),
			pageNumberCurrent = pagination.getPageNumberCurrent(),
			pageNumberPrevious = pagination.getPageNumberPrevious(),
			pageNumberNext = pagination.getPageNumberNext(),
			href = '#/page/';

            this.$elPrevious.attr('href', href + pageNumberPrevious).removeClass();
            this.$elNext.attr('href', href + pageNumberNext).removeClass();

            if (pagesTotal < 2) {
                pageInfo = 'Showing all content';
                this.$elPrevious.addClass('hidden');
                this.$elNext.addClass('hidden');
                this.$elContents.addClass('hidden');
                this.$el.find('#navitem-contents-small').addClass('hidden');
                this.$el.find('.toggle-topbar').addClass('hidden');
            }

            this.$elInfo.text(pageInfo);

            if (pageNumberCurrent == 1) {
                this.$elPrevious.addClass('disabled');
            } else if (pageNumberCurrent == pagesTotal) {
                this.$elNext.addClass('disabled');
            }

        }
    });

    return NavbarView;
});
