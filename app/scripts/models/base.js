define(function (require) {
    var
	Backbone = require('backbone');

    var BaseModel = Backbone.Model.extend({

        TAG: 'BaseModel',

        initialize: function (options) {
            // this._debug( 'initialize: ', this.get( 'id' ) );
        },

        _toBoolean: function (value) {
            if (value === true || value === 'true') {
                return true;
            } else {
                return false;
            }
        },

        _toInteger: function (value) {
            return parseInt(value, 10);
        },

        _initializeBase: function (options) {
            BaseModel.prototype.initialize.call(this, options);
        }
    });

    return BaseModel;
});
