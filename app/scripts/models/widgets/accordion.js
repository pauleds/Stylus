define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var AccordionModel = WidgetModel.extend({

        TAG: 'AccordionModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            panels: [],
        }),

        _validOptions: ['alignIcon', 'multiple', 'persistent', 'state'],

        initialize: function (options) {
            this._initializeSuper(options);
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
        },

        getInitialState: function () {
            return this.get('state');
        },

        isMultipleEnabled: function () {
            var value = this.get('multiple');
            return (value === 'enabled') ? true : false;
        },

        isToggleableEnabled: function () {
            var value = this.get('persistent');
            return (value === 'enabled') ? false : true;
        }
    });

    return AccordionModel;
});
