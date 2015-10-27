define(function (require) {
    var
    JQueryCookie = require('jquery.cookie'),
	PagesCollection = require('collections/pages'),
	BaseModel = require('models/base');

    var ApplicationModel = BaseModel.extend({

        TAG: 'ApplicationModel',

        defaults: $.extend(true, {}, BaseModel.prototype.defaults, {
            documentTitle: '',
            isFocusingOnPage: false,
            pageNumberCurrent: 0,
            pageNumberLast: 0,
            pages: new PagesCollection([], {}),
            viewIsSmall: null
        }),

        initialize: function (options) {
            this._initializeBase(options);
        },

        setDocumentTitle: function (documentTitle) {
            this.set('documentTitle', documentTitle);
        },

        getDocumentTitle: function () {
            return this.get('documentTitle');
        },

        setFocusingOnPage: function (isFocusingOnPage) {
            this.set('isFocusingOnPage', isFocusingOnPage);
        },

        isFocusingOnPage: function () {
            return this.get('isFocusingOnPage');
        },

        getPageNumberCurrent: function () {
            return this.get('pageNumberCurrent');
        },

        getPageNumberLast: function () {
            return this.get('pageNumberLast');
        },

        setPages: function (pages) {
            this.set('pages', pages);
        },

        getPages: function () {
            return this.get('pages');
        },

        setViewIsSmall: function (viewIsSmall) {
            this.set('viewIsSmall', viewIsSmall);
        },

        getViewIsSmall: function () {
            return this.get('viewIsSmall');
        },

        getPage: function (pageNumber) {
            if (!pageNumber) {
                pageNumber = this._value(this.getPageNumberCurrent(), 1);
            }
            var page = this.get('pages').findWhere({
                number: pageNumber
            });
            return page;
        },

        setPageNumber: function (pageNumber) {
            if (this.isFocusingOnPage()) {
                return false;
            }
            this.setFocusingOnPage(true);
            var pageNumber = this._value(pageNumber, 1);
            var number = Math.round(pageNumber, 10);
            var total = this.get('pages').size();
            if (number < 1) {
                number = 1;
            } else if (number > total) {
                number = total;
            }
            this.set('pageNumberLast', this.get('pageNumberCurrent'));
            this.set('pageNumberCurrent', number);
            this.trigger('pageNumberUpdated', number);
            return true;
        },

        generateData: function (settings) {

            var urlEncode = function (value) {
                if (!value) {
                    return value;
                }
                return value.replace(/ /g, '%20');
            };

            var settings = (typeof settings !== 'undefined') ? settings : {};
            var data = {};

            var scripts = document.getElementsByTagName('script');
            var index = scripts[0].src.indexOf('scripts/modernizr.js');
            data.stylus_path = scripts[0].src.substring(0, index);

            var location = window.location.href.toString();

            /* Offline? */

            data.isOffline = (location.substring(0, 4) !== 'http') ? true : false;

            if (!data.isOffline && settings.project_folder_online) {
                settings.project_folder = settings.project_folder_online;
            }
            data.project_folder = settings.project_folder;

            /* Set the url of course */

            var page_path_full = urlEncode(location);

            data.page_path_full = page_path_full;
            settings.project_folder = urlEncode(settings.project_folder);

            var index = page_path_full.indexOf('?');
            data.page_path_params = (index > -1) ? page_path_full.substring(index) : '';

            var delim = settings.project_folder + '/';
            var i = page_path_full.indexOf(delim);

            data.project_path = page_path_full.substring(0, i) + delim;

            var j = page_path_full.indexOf(data.page_path_params);
            data.page_path = (index > -1) ? page_path_full.substring(i, j) : page_path_full.substring(i);

            return data;

        }
    });

    return ApplicationModel;

});
