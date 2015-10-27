define(function (require) {
    var
	MediaView = require('views/widgets/media');

    var AudioView = MediaView.extend({

        TAG: 'AudioView',

        template: JST['app/scripts/templates/widgets/audio.ejs'],

        //defaults: $.extend(true, {}, MediaView.prototype.defaults, {
        //}),

        initialize: function (options) {
            this._initializeMediaSuper(options);
        },

        _loadPlayer: function () {

            var id = this.id + '-audio',
            features = this.model.getFeatures(),
            height = this.model.getHeight();

            this.player = new MediaElementPlayer('#' + id, {
                audioHeight: height,
                enablePluginDebug: true,
                features: features,
                mode: 'native',
                startVolume: 1,
                success: this._onPlayerLoaded
            });

        }
    });

    return AudioView;
});
