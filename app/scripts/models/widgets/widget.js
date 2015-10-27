define(function (require) {
    var
	BaseModel = require('models/base');

    var WidgetModel = BaseModel.extend({

        TAG: 'WidgetModel',

        defaults: $.extend(true, {}, BaseModel.prototype.defaults, {
            originalId: null,
            parentId: '',
            simpleContent: '',
            viewIsSimple: false,
            data: []
        }),

        _validOptions: [],

        initialize: function (options) {

            this._initializeBase(options);

            // Process user-defined widget options.
            var _this = this,
			validOptions = this._validOptions,
			classArray = options.classArray,
            data = [];

            _.each(classArray, function (item) {
                var index = item.indexOf('-');
                if (index > -1) {
                    // Potential key-value pair found.
                    var option = item.substring(0, index);
                    var value = item.substring(index + 1);
                    if (_.contains(validOptions, option)) {
                        // Valid option found.
                        // _this._debug( option, value );
                        _this.set(option, value);
                    } else if (option !== 'stylus') {
                        var obj = {};
                        obj[option] = value;
                        data.push(obj);
                    }
                }

            }, this);

            this.set('data', data);

        },

        getOriginalId: function () {
            return this.get('originalId');
        },

        setOriginalId: function (originalId) {
            // if ( typeof originalId !== 'undefined' ) {
            // this._debug( 'setOriginalId', originalId );
            // }
            this.set('originalId', originalId);
        },

        getParentId: function () {
            return this.get('parentId');
        },

        getSimpleContent: function () {
            return this.get('simpleContent');
        },

        setViewIsSimple: function (viewIsSimple) {
            // this._debug( 'setViewIsSimple', viewIsSimple );
            this.set('viewIsSimple', viewIsSimple);
        },

        getViewIsSimple: function () {
            return this.get('viewIsSimple');
        },

        getData: function () {
            return this.get('data');
        },

        _initializeSuper: function (options) {
            WidgetModel.prototype.initialize.call(this, options);
        }
    });

    WidgetModel.prototype.toString = function () {
        return '[' + this.TAG + ']';
    };

    return WidgetModel;
});
