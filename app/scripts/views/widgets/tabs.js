define(function (require) {
    var
	WidgetView = require('views/widgets/widget');

    var TabsView = WidgetView.extend({

        TAG: 'TabsView',

        template: JST['app/scripts/templates/widgets/tabs.ejs'],

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        _viewIsSmall: null,

        initialize: function (options) {

            this._initializeSuper(options);

            var parentId = this.model.getParentId();
            var panels = [];

            this.$elSimpleContent.find('h3').each(function (index) {

                var $header = $(this);
                var id = parentId + '-panel-' + index;
                var title = $.trim($header.text());
                var content = $.trim($header.next().html());

                panels.push({
                    id: id,
                    title: title,
                    content: content
                });

            });

            this.model.setPanels(panels);

            this.notifier.on({
                'viewSizeUpdated': this._onViewSizeUpdated,
                'windowResize': this._onWindowResize
            }, this);

        },

        afterRender: function () {

            var _this = this;
            var isVertical = this.model.isVertical();
            var $a = this.$el.find('li > a');

            // Add radius corners to tab headers.
            $a.each(function () {
                if (isVertical) {
                    $a.addClass('radius-tl radius-bl');
                } else {
                    $a.addClass('radius-tl radius-tr');
                }
            });

            // Process header icons.
            var isIconLeft = this.model.isIconLeft();
            var isIconRight = this.model.isIconRight();

            if (!isIconLeft && !isIconRight) {
                return false;
            }

            var $items = this.$el.find('.widget-body .tab-title');
            $items.each(function () {
                var $item = $(this);
                var $heading = $item.find(' > a ');
                var $content = _this.$el.find('#' + $heading.attr('href').substring(1));
                _this._addHeadingIcon($heading, $content, isIconLeft);
            });

            // Ensure panel min-height equals vertical tabs height.
            this._onWindowResize(this._viewIsSmall);

        },

        _onViewSizeUpdated: function (viewIsSmall) {

            this._viewIsSmall = viewIsSmall;

            // Re-apply radius corners to tab headers.
            var isVertical = this.model.isVertical();
            var $ul = this.$el.find('ul.tabs');
            var $a = this.$el.find('li > a');
            $a.each(function () {
                $a.removeClass('radius-tl radius-tr radius-bl radius-br');
                if (viewIsSmall) {
                    $a.first().addClass('radius-tl radius-tr');
                    // Ensure all tabs look like the vertical version of tabs on small screens. It just looks better.
                    $ul.addClass('vertical');
                } else {
                    if (isVertical) {
                        $a.addClass('radius-tl radius-bl');
                    } else {
                        $a.addClass('radius-tl radius-tr');
                        // Restore non-vertical appearance on larger screens.
                        $ul.removeClass('vertical');
                    }
                }
            });

        },

        _onWindowResize: function (viewIsSmall) {

            if (!this.model.isVertical()) {
                return false;
            }

            var _this = this;
            var height = this.$el.find('ul.tabs').height();
            if (height > 0) {
                var $content = this.$el.find('section.content').each(function () {
                    $(this).css('min-height', height);
                });
            }
        }
    });

    return TabsView;
});
