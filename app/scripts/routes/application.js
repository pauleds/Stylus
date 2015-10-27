define(function (require) {
    var
	ApplicationModel = require('models/application'),
	ApplicationView = require('views/application'),
	Foundation = require('foundation'),
	Backbone = require('backbone');

    var ApplicationRouter = Backbone.Router.extend({

        TAG: 'ApplicationRouter',

        routes: {
            '': 'index',
            'page/:number(/:view)': 'page', // #page/1
        },

        initialize: function (options) {

            $('body').attr('id', 'app-root');

            // Remove helper css file (for authoring) if exists.
            $('#stylus-helper-css').remove();

            // Show plain version of document if requested.
            if (window.location.href.indexOf('/stylus-plain') > -1) {
                $('body').addClass('stylus-plain');
                $('#document-footer').addClass('text-align-center');
                $('#document-info').attr('style', 'display: block !important');
                return true;
            }

            this.notifier = _.extend({}, Backbone.Events);

            this.model = new ApplicationModel({});

            this.view = new ApplicationView({
                model: this.model,
                notifier: this.notifier
            });

            this.notifier.on({
                'scrolledPageChange': this._onScrolledPageChanged
            }, this);

            this.view.render().$el.prependTo('body');

            Backbone.history.start();

        },

        index: function (pageNumber) {
            this._routeToPage(1);
        },

        page: function (pageNumber, viewType) {
            var succeeded = this.model.setPageNumber(pageNumber);
            if (!succeeded) {
                var pageNumber = this.model.getPageNumberCurrent();
                this._routeToPage(pageNumber);
            }
        },

        _onScrolledPageChanged: function (pageNumber) {
            this._routeToPage(pageNumber);
        },

        _routeToPage: function (pageNumber) {
            this.navigate('//page/' + pageNumber);
        }
    });

    return ApplicationRouter;
});
