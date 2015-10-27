define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var TabsModel = WidgetModel.extend({

        TAG: 'TabsModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            align: 'horizontal',
            panels: []
        }),

        _validOptions: ['align', 'alignIcon'],

        initialize: function (options) {
            this._initializeSuper(options);
        },

        isVertical: function () {
            return ('vertical' === this.get('align'));
        },

        setPanels: function (panels) {
            this.set('panels', panels);
        },

        getPanels: function () {
            return this.get('panels');
        },

        isIconLeft: function () {
            return ('left' === this.get('alignIcon'));
        },

        isIconRight: function () {
            return ('right' === this.get('alignIcon'));
        }
    });

    return TabsModel;
});
