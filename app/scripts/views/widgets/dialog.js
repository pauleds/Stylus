define(function (require) {
    var
	WidgetView = require('views/widgets/widget');

    var DialogView = WidgetView.extend({

        TAG: 'DialogView',

        template: JST['app/scripts/templates/widgets/dialog.ejs'],

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        initialize: function (options) {

            this._initializeSuper(options);

            var _this = this,
            parentId = this.model.getParentId(),
            originalId = this.model.getOriginalId();

            var title = this.$elSimpleContent.attr('title');
            if (title) {
                title = $.trim(title);
            } else {
                var $title = this.$elSimpleContent.find('h3:first-child');
                title = $.trim($title.text());
                $title.remove();
            }
            if (title) {
                this.model.setTitle(title);
            }

            var content = $.trim(this.$elSimpleContent.html());
            this.model.setContent(content);

            var $links = $('a');
            $links.each(function (index) {
                var $a = $(this);
                var href = $a.attr('href');
                // _this._debug( href, originalId );
                if (href === '#' + originalId) {
                    $a.removeAttr('href').addClass('radius button');
                    $a.attr('data-reveal-id', _this.model.id + '-dialog');
                    $a.prepend('<span class="fa fa-external-link-square fa-3"></span>');

                    if (!title) {
                        this.model.setTitle($.trim($a.html()));
                    }

                }
            });

            this.notifier.on({
                'pageEnhancementChanged': this._onPageEnhancementChanged
            }, this);

        },

        _onPageEnhancementChanged: function (page) {

            var attrFrom, attrTo;
            if (this.$el.find('.view-simple-content').hasClass('active')) {
                attrFrom = 'data-reveal-id';
                attrTo = 'data-reveal-id-disabled';
            } else {
                attrFrom = 'data-reveal-id-disabled';
                attrTo = 'data-reveal-id';
            }

            var $dialogLinks = $('a[' + attrFrom + '="' + this.id + '-dialog"]');
            $dialogLinks.each(function (index) {
                var $link = $(this);
                var value = $link.attr(attrFrom);
                $link.attr(attrTo, value).removeAttr(attrFrom);
            });

        },

        afterRender: function () {

            var _this = this;

            var $document = $(document);
            $document.foundation('reveal', 'reflow');

            $document.on('opened.fndtn.reveal', '[data-reveal]', function (event) {
                _this._sendEvent('enableGestures', false);
            });

            $document.on('closed.fndtn.reveal', '[data-reveal]', function (event) {
                _this._sendEvent('enableGestures', true);
            });

        }
    });

    return DialogView;
});

