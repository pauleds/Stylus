define(function (require) {
    var
	MediaModel = require('models/widgets/media');

    var AudioModel = MediaModel.extend({

        TAG: 'AudioModel',

        //defaults: $.extend(true, {}, MediaModel.prototype.defaults, {
        //}),

        _validOptions: ['height'],

        initialize: function (options) {
            this._initializeMediaSuper(options);
        },

        getHeight: function () {
            return this.get('height');
        },

        getPath: function () {
            var path = Stylus.data.project_path + Stylus.settings.media_audio_path;
            this._debug('getPath', path);
            return path;
        }
    });

    return AudioModel;
});
