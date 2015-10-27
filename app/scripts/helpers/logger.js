define(function (require) {
    var
	Backbone = require('backbone');

    var singleton;

    var LoggerModel = Backbone.Model.extend({

        TAG: 'LoggerModel',

        defaults: {
            debugEnabled: false
        },

        setDebugEnabled: function (debugEnabled) {
            this.set('debugEnabled', debugEnabled);
        },

        /**
         * Returns the nested key/value pairs of an object as a string.
         * @param {Object} obj
         */
        dump: function (obj) {
            var out = '';
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] == 'object')
                        out += key + ': ' + '[ ' + this.dump(obj[key]) + '] ';
                    else
                        out += key + ': ' + obj[key] + ' / ';
                }
            }
            return out;
        },

        /**
		 * Outputs a given value to the web browser console.
		 * @param {Object} value
		 */
        log: function (value) {
            if (window.console && window.console.log) {
                window.console.log(value);
            }
        },

        /**
		 * Outputs the given values to the web browser console with additional formatting.
		 * @param {Object} label
		 * @param {Object} value
		 * @param {Object} returnString
		 */
        debug: function (tag, label, value, returnString) {
            var debugEnabled = this.get('debugEnabled');
            if (!debugEnabled) {
                return false;
            }
            tag = (typeof tag == 'undefined') ? this.TAG : tag;
            label = (typeof label == 'undefined') ? 'No label' : label;
            value = (typeof value == 'undefined') ? 'No value' : value;
            returnString = (returnString !== true) ? false : true;
            var msg = tag + ' :: ' + label + ' : ' + value;
            if (returnString) {
                return msg;
            }
            this.log(msg);
        },

    });

    if (typeof singleton === 'undefined') {
        singleton = new LoggerModel();
    }

    return singleton;
});
