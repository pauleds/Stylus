/*!
 * Stylus: Content Enhancement.
 *
 * Stylus enables anyone to quickly and easily create engaging,
 * self-contained modules of online content with enhanced interactivity,
 * usability and accessibility features.
 * 
 * @author	Paul Edwards [ http://pauleds.com/ ]
 * @version	2.2.0
 * @license	MIT License
 *
 * http://stylus.pauleds.com/
 * 
 */
define(function (require) {
    var
    Logger = require('helpers/logger'),
	ApplicationRouter = require('routes/application'),
	LayoutManager = require('layoutmanager'),
	Backbone = require('backbone');

    var Constants = {
        APP_ID: 'stylus-ce',
        APP_NAMESPACE: 'Stylus',
        APP_NAME: 'Stylus',
        APP_VERSION: '2.2.0',
        APP_SETTINGS: 'StylusSettings'
    };

    // Settings.

    var Defaults = {
        debug: false,
        media_audio_path: 'media/av/',
        media_video_path: 'media/av/',
        project_folder: 'stylus-content',
        project_folder_online: 'stylus-content'
    }

    var customSettings = window[Constants.APP_SETTINGS];

    // The application.
    var app = {
        name: Constants.APP_NAME,
        version: Constants.APP_VERSION,
        settings: null,
        data: null,
        app: null
    };

    // Setup the application.
    var setup = {

        _log: function (value) {
            Logger.log(value);
        },

        _debug: function (label, value, returnString) {
            Logger.debug(this.TAG, label, value, returnString);
        },

        _dump: function (obj) {
            Logger.dump(obj);
        },

        /**
		 * Returns the value of the given variable.
		 * If the variable is undefined then the given defaultValue is returned.
		 * This is useful for when the existence of a variable is not known and
		 * a default value needs to be set.
		 * @param {Object} variable
		 * @param {Object} defaultValue
		 */
        _value: function (variable, defaultValue) {
            if (typeof variable !== 'undefined') {
                return variable;
            } else if (typeof defaultValue !== 'undefined') {
                return defaultValue;
            } else {
                throw new Error('No variable or defaultValue can be found.');
            }
        },

        /**
		 * Initialise helpers. This includes extending the Backbone router, collection,
		 * model and view objects with additional custom helper functions.
		 */
        _initHelpers: function () {

            // Router
            _.extend(Backbone.Router.prototype, {
                _dump: this._dump,
                _log: this._log,
                _debug: this._debug,
                _value: this._value
            });

            // Collection
            _.extend(Backbone.Collection.prototype, {
                _dump: this._dump,
                _log: this._log,
                _debug: this._debug,
                _value: this._value,
                toString: function () {
                    var str = Object.prototype.toString.call(this);
                    return str + ' [size: ' + this.size() + ']';
                }
            });

            // Model
            _.extend(Backbone.Model.prototype, {
                _dump: this._dump,
                _log: this._log,
                _debug: this._debug,
                _value: this._value
            });

            // View
            _.extend(Backbone.View.prototype, {
                _dump: this._dump,
                _log: this._log,
                _debug: this._debug,
                _value: this._value
            });

        },

        /**
		 * Merge user-provided custom settings with application defaults
		 * and save in app.settings property.
		 */
        _mergeSettings: function () {
            var msg = Constants.APP_NAME + ' : ' + Constants.APP_SETTINGS;
            // Check for user settings customisation.
            if (customSettings) {
                // Merge defaults with user customisations.
                app.settings = $.extend(true, {}, Defaults, customSettings);
                this._log(msg + ' found. Settings merged with defaults.');
            } else {
                // Use defaults.
                app.settings = Defaults;
                this._log(msg + ' not found. Using default settings.');
            }
            // Log debug setting.
            msg = Constants.APP_NAME + ' : ';
            if (app.settings.debug) {
                msg = msg + 'Debugging enabled.';
            } else {
                msg = msg + 'Debugging disabled. Comments end.';
            }
            this._log(msg);
            // Update Logger with debug setting.
            Logger.setDebugEnabled(app.settings.debug);
        },

        /**
		 * Initialise setup.
		 */
        init: function () {

            this._mergeSettings();
            this._initHelpers();

            Object.prototype.toString = function () {
                var object = (this.TAG) ? this.TAG : 'Object';
                return '[' + object + ']';
            };

            // Configure Backbone LayoutManager.
            Backbone.Layout.configure({
                prefix: 'templates/',
                fetchTemplate: function (path) {
                    var JST = window.JST || {};
                    if (JST[path]) {
                        return JST[path];
                    }
                    var done = this.async();
                    $.get(path, function (contents) {
                        done(_.template(contents));
                    }, 'text');
                }
            });

            // Store master router and data on application namespace.
            app.app = new ApplicationRouter();
            app.data = app.app.model.generateData(app.settings);

            // Clean up.
            delete window[Constants.APP_SETTINGS];
        }
    };

    setup.init();

    window[Constants.APP_NAMESPACE] = app;

});
