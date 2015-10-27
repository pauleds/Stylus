define(function (require) {
    var
	MediaModel = require('models/widgets/media');

    var VideoModel = MediaModel.extend({

        TAG: 'VideoModel',

        //defaults: $.extend(true, {}, MediaModel.prototype.defaults, {
        //}),

        _validOptions: ['width'],

        initialize: function (options) {
            this._initializeMediaSuper(options);
        },

        getWidth: function () {
            return this.get('width');
        },

        getPath: function () {
            var path = Stylus.data.project_path + Stylus.settings.media_video_path;
            this._debug('getPath', path);
            return path;
        }
    });

    return VideoModel;
});
