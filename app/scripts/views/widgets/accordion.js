define(function (require) {
    var
	WidgetView = require('views/widgets/widget');

    var AccordionView = WidgetView.extend({

        TAG: 'AccordionView',

        template: JST['app/scripts/templates/widgets/accordion.ejs'],

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        initialize: function (options) {

            this._initializeSuper(options);

            this.notifier.on({
                'applicationReady': this._onApplicationReady
            }, this);

            var parentId = this.model.getParentId();
            var panels = [];

            this.$elSimpleContent.find('h3').each(function (index) {

                var $header = $(this);
                var id = parentId + '-panel-' + index;
                var title = $.trim($header.text());
                var $content = $header.next();
                var content = $.trim($content.html());

                panels.push({
                    id: id,
                    title: title,
                    content: content
                });

            });

            this.model.setPanels(panels);

        },

        afterRender: function () {

            var _this = this,
            isIconLeft = this.model.isIconLeft(),
            isIconRight = this.model.isIconRight(),
            $accordion = this.$el.find('.accordion'),
            $items = $accordion.find(' > li');

            // Add radius corners to first and last accordion items.
            $items.first().find('> a').addClass('radius-tl radius-tr');
            var $aLast = $items.last().find('> a');
            var radius = 'radius-bl radius-br';
            $aLast.addClass(radius);
            $aLast.next().addClass(radius);

            // Animate accordion item opening.
            $accordion.on('click.fndtn.accordion', 'li', function (event) {
                var $item = $(this);
                if (!$item.hasClass('active')) {
                    $item.find('.content').stop().slideDown(300);
                }
            });

            // Process accordion toggle.
            $accordion.on('toggled', function (event) {
                $items.each(function () {
                    var $item = $(this);
                    var isActive = $item.hasClass('active');
                    // Animate closing if item not active.
                    if (!isActive) {
                        $item.find('.content').stop().slideUp(300);
                    }
                    // Add/Remove radius corners from very last item.
                    if ($item.is(':last-child')) {
                        if (isActive) {
                            $aLast.removeClass(radius);
                        } else {
                            $aLast.addClass(radius);
                        }
                    }
                });
            });

            $items.each(function () {
                var $item = $(this);
                var $heading = $item.find('> a');
                var $content = $item.find('.content');
                // Process header icons.
                if (isIconLeft || isIconRight) {
                    _this._addHeadingIcon($heading, $content, isIconLeft);
                }
            });

        },

        _processData: function (data) {
            if (!data || !data.state) {
                return false;
            }
            var state, key, value, selector;
            state = data.state.split('-');
            key = state[0];
            if (key === 'open' || key === 'close' || key === 'toggle') {
                value = parseInt(state[1], 10);
                if (value > 0) {
                    selector = ':nth-child(' + value + ')';
                }
            } else {
                return false;
            }
            return {
                method: key,
                options: {
                    selector: selector
                }
            };
        },

        _onApplicationReady: function (application) {
            var _this = this,
            $accordion = this.$el.find('.accordion'),
            originalId = this.model.getOriginalId(),
            state = this.model.getInitialState();

            if (state) {
                var config = _this._processData({
                    state: state
                });
                if (config) {
                    $accordion.foundation('accordion', config.method, config.options);
                }
            }

            $('a[href="#' + originalId + '"]').each(function () {
                var $a = $(this);
                var id = _this.id + '-' + originalId;
                var data = $a.data('stylus');
                if (data[0]) {
                    var config = _this._processData(data[0]);
                    if (config) {
                        $a.removeAttr('href').click(function () {
                            $accordion.foundation('accordion', config.method, config.options);
                        });
                    }
                }
            });

        }
    });

    return AccordionView;
});
