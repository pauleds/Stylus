define(function (require) {
    var
	Backbone = require('backbone');

    var BaseCollection = Backbone.Collection.extend({

        TAG: 'BaseCollection',

        _initializeBase: function (options) {
            BaseCollection.prototype.initialize.call(this, options);
        }
    });

    BaseCollection.prototype.toString = function () {
        var contents = '';
        if (this.size() > 0) {
            contents += ' : ';
            this.each(function (model) {
                contents += model;
            }, this);
        }
        return '[' + this.TAG + ' : ' + this.size() + contents + ']';
    };

    return BaseCollection;
});
