define(function (require) {
    var
	PageModel = require('models/page'),
	BaseCollection = require('collections/base');

    var PagesCollection = BaseCollection.extend({

        TAG: 'PagesCollection',

        model: PageModel,

        initialize: function (options) {
            this._initializeBase(options);
        },
    });

    return PagesCollection;
});
