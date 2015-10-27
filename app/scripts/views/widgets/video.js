define(function (require) {
    var
	MediaView = require('views/widgets/media');

    var VideoView = MediaView.extend({

        TAG: 'VideoView',

        template: JST['app/scripts/templates/widgets/video.ejs'],

        //defaults: $.extend(true, {}, MediaView.prototype.defaults, {
        //}),

        initialize: function (options) {
            this._initializeMediaSuper(options);
        },

        _loadPlayer: function () {

            var id = this.id + '-video';
            var features = this.model.getFeatures();

            this.player = new MediaElementPlayer('#' + id, {
                enablePluginDebug: true,
                features: features,
                mode: 'native',
                startVolume: 1,
                success: this._onPlayerLoaded
            });

        }
    });

    return VideoView;
});
