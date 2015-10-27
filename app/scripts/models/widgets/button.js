define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var ButtonModel = WidgetModel.extend({

        TAG: 'ButtonModel',

        //defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
        //}),

        _validOptions: ['alignIcon', 'icon'],

        initialize: function (options) {
            this._initializeSuper(options);
        },

        setLink: function (link) {
            this.set('link', link);
        },

        getLink: function () {
            return this.get('link');
        },

        setLabel: function (label) {
            this.set('label', label);
        },

        getLabel: function () {
            return this.get('label');
        },

        setIcon: function (icon) {
            this.set('icon', icon);
        },

        getIcon: function () {
            return this.get('icon');
        },

        isIconLeft: function () {
            return ('left' === this.get('alignIcon'));
        },

        isIconRight: function () {
            return ('right' === this.get('alignIcon'));
        }

    });

    return ButtonModel;
});
