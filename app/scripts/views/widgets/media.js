define(function (require) {
    var
	MediaElement = require('mediaelement'),
	MediaElementPlaylist = require('mediaelement.playlist'),
	WidgetView = require('views/widgets/widget');

    var MediaView = WidgetView.extend({

        TAG: 'MediaView',

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        _playerLoaded: false,

        initialize: function (options) {

            this._initializeSuper(options);

            this.notifier.on({
                'beforePageLoseFocus': this._onBeforePageLoseFocus,
                'pageVisibilityChanged': this._onPageVisibilityChanged
            }, this);

            var _this = this,
            prop = 'file-',
            playlist = [],
            $items = this.$elSimpleContent.find('p, li');

            if ($items.length < 1) {
                $items = this.$elSimpleContent;
            }

            $items.each(function () {

                var text = $(this).text();
                var start = text.indexOf(prop);
                var end = text.indexOf(' ', start);
                end = (end <= start) ? text.length : end;

                var file = $.trim(text.substring(start, end));
                var title = $.trim(text.replace(file, ''));
                file = file.replace(prop, '');
                title = (title.length < 1) ? file : title;

                var config = {
                    file: file,
                    title: title
                };

                playlist.push(config);

            });
            this.model.set('playlist', playlist);

        },

        afterRender: function () {
            this.$elMediaContent = $('#' + this.model.getParentId()).find('.media-content');
        },

        _loadPlayer: function () {
            // Override.
        },

        _initializeMediaSuper: function (options) {
            MediaView.prototype.initialize.call(this, options);
        },

        _onBeforePageLoseFocus: function (page) {
            if (this.player && this.isOnPage(page)) {
                this.player.pause();
            }
        },

        _onPlayerLoaded: function (node) {
            var player = node.player;
            if (this.playlist) {
                node.addEventListener('pause', function (event) {
                    player.togglePlaylistDisplay(player, player.layers, player.options, 'show');
                });
            } else {
                player.playlistToggle.unbind('click').find('button').css({
                    'cursor': 'default',
                    'outline': 0
                }).attr('title', 'No Playlist');
            }
        },

        _onPageVisibilityChanged: function (page) {
            var isVisible = page.isVisible();
            if (isVisible && this._playerLoaded) {
                // Resize to correct width increase during page transition.
                this._resize();
            } else if (this._playerLoaded) {
                return false;
            } else if (isVisible && this.isOnPage(page)) {
                // Load the player.
                this._playerLoaded = true;
                this._loadPlayer();
            }
        },

        _resize: function () {
            $(window).trigger('resize');
        }
    });

    return MediaView;
});
