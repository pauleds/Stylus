define(function (require) {
    var
	BaseView = require('views/base');

    var WidgetView = BaseView.extend({

        TAG: 'WidgetView',

        template: JST['app/scripts/templates/widgets/widget.ejs'],

        //defaults: $.extend(true, {}, BaseView.prototype.defaults, {
        //}),

        initialize: function (options) {

            this._initializeBase(options);

            var _this = this;

            var parentId = this.model.getParentId();
            this.$elSimpleContent = $('#' + parentId).find('.simple-content');

            var originalId = this.$elSimpleContent.attr('id');
            this.model.setOriginalId(originalId);

        },

        serialize: function () {
            return {
                widget: this.model
            };
        },

        _addHeadingIcon: function ($heading, $content, isIconLeft) {

            if (!$heading.length || !$content.length) {
                this._debug('_addHeadingIcon', 'heading:' + $heading.length + ' content:' + $content.length);
                return false;
            }

            var $image = $content.find('img:first, .fa:first');
            if (!$image.length) {
                return false;
            }
            $image = $image.first();

            var iconHtmlClasses = (isIconLeft) ? ' icon-left' : ' icon-right';

            var $icon = $image.clone().removeClass('hide').removeClass(function (index, css) {
                return (css.match(/(^|\s)align-\S+/g) || []).join(' ');
            });
            $heading.wrapInner('<span class="heading-text' + iconHtmlClasses + '" />');

            if ($icon.hasClass('fa')) {
                $icon.removeClass('fa-1x fa-3x fa-4x fa-5x').addClass('fa-2x fa-fw');
                $heading.addClass('icon-fa');
            }

            if ($image.hasClass('hide')) {
                var $parent = $image.parent();
                $image.remove();
                if ($parent.is(':empty')) {
                    $parent.remove();
                }
            }

            var spanIcon = '<span class="heading-icon' + iconHtmlClasses + '" />';
            if (isIconLeft) {
                $(spanIcon).prependTo($heading).html($icon);
            } else {
                $(spanIcon).appendTo($heading).html($icon);
            }

        },

        _initializeSuper: function (options) {
            WidgetView.prototype.initialize.call(this, options);
        },

        isOnPage: function (page) {
            if (typeof page == 'undefined') {
                return false;
            }
            return (this.id.indexOf(page.getId() + '-') > -1);
        }
    });

    WidgetView.prototype.toString = function () {
        return '[' + this.TAG + ']';
    };

    return WidgetView;
});
