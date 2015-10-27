define(function (require) {
    var    
	WidgetModel = require('models/widgets/widget');

    var MediaModel = WidgetModel.extend({

        TAG: 'MediaModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            playlist: [],
            features: ['playlistfeature', 'playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen', 'playlist']
        }),

        _validOptions: [],

        initialize: function (options) {
            this._initializeSuper(options);
        },

        getFeatures: function () {
            return this.get('features');
        },

        getPlaylist: function (index) {
            return this.get('playlist');
        },

        _initializeMediaSuper: function (options) {
            MediaModel.prototype.initialize.call(this, options);
            // this._debug( 'settings', this._dump( window.Stylus.settings ) );
        }
    });

    return MediaModel;
});
