define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var DialogModel = WidgetModel.extend({

        TAG: 'DialogModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            title: null,
            content: null
        }),

        _validOptions: [],

        initialize: function (options) {
            this._initializeSuper(options);
        },

        setTitle: function (title) {
            this.set('title', title);
        },

        getTitle: function () {
            return this.get('title');
        },

        setContent: function (content) {
            this.set('content', content);
        },

        getContent: function () {
            return this.get('content');
        }
    });

    return DialogModel;
});
