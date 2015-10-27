define(function (require) {
    var
	BaseModel = require('models/base');

    var PaginationModel = BaseModel.extend({

        TAG: 'PaginationModel',

        defaults: $.extend(true, {}, BaseModel.prototype.defaults, {
            pageInfo: 'Loading...',
            pageNumberCurrent: 0,
            pageNumberPrevious: 0,
            pageNumberNext: 0,
            pagesTotal: 0
        }),

        initialize: function (options) {

        },

        getPageInfo: function () {
            return this.get('pageInfo');
        },

        getPageNumberCurrent: function () {
            return this.get('pageNumberCurrent');
        },

        getPageNumberPrevious: function () {
            return this.get('pageNumberPrevious');
        },

        getPageNumberNext: function () {
            return this.get('pageNumberNext');
        },

        getPagesTotal: function () {
            return this.get('pagesTotal');
        },

        update: function (page, pages) {

            var numberCurrent = page.get('number');
            var pagesTotal = pages.size();
            var numberPrevious = (numberCurrent - 1 < 1) ? 1 : numberCurrent - 1;
            var numberNext = (numberCurrent + 1 > pagesTotal) ? pagesTotal : numberCurrent + 1;

            this.set('pageInfo', 'Page ' + numberCurrent + ' of ' + pagesTotal);
            this.set('pageNumberCurrent', numberCurrent);
            this.set('pageNumberPrevious', numberPrevious);
            this.set('pageNumberNext', numberNext);
            this.set('pagesTotal', pagesTotal);

            this.trigger('paginationUpdated', this);

        }
    });

    return PaginationModel;
});
