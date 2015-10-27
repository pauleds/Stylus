define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var FeatureModel = WidgetModel.extend({

        TAG: 'FeatureModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            title: null,
            content: null,
            featureType: ''
        }),

        _validOptions: ['alignIcon', 'icon', 'color'],

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
        },

        setFeatureType: function (featureType) {
            this.set('featureType', featureType);
        },

        getFeatureType: function () {
            return this.get('featureType');
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

    return FeatureModel;
});
