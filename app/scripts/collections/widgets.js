define(function (require) {
    var
	WidgetModel = require('models/widgets/widget'),
	BaseCollection = require('collections/base');

    var WidgetsCollection = BaseCollection.extend({

        TAG: 'WidgetsCollection',

        model: WidgetModel,

        initialize: function (options) {
            this._initializeBase(options);
        }
    });

    return WidgetsCollection;
});
