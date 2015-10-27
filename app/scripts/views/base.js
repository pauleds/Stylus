define(function (require) {
    var
	JST = require('templates'),
	Layout = require('layoutmanager'),
	Backbone = require('backbone');

    var BaseView = Backbone.View.extend({

        TAG: 'BaseView',

        el: false,
        manage: true,

        notifier: null,

        initialize: function (options) {
            this.notifier = options.notifier;
        },

        serialize: function () {
            return {
                model: this.model
            };
        },

        _sendEvent: function (name, value, delay) {
            if (!this.notifier) {
                this._debug('ERROR: _sendEvent() : Notifier not found.', this.id);
                return false;
            }
            var _this = this;
            var delay = (typeof delay !== 'undefined') ? delay : 100;
            setTimeout(function () {
                _this.notifier.trigger(name, value);
            }, delay);
            return true;
        },

        _initializeBase: function (options) {
            BaseView.prototype.initialize.call(this, options);
        }
    });

    return BaseView;
});
