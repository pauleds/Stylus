define(function (require) {
    var
	FlexSlider = require('flexslider'),
	WidgetView = require('views/widgets/widget');

    var SliderView = WidgetView.extend({

        TAG: 'SliderView',

        template: JST['app/scripts/templates/widgets/slider.ejs'],

        _sliderLoaded: false,

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

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
                'pageEnhancementChanged': this._onPageEnhancementChanged,
                'pageVisibilityChanged': this._onPageVisibilityChanged
            }, this);

        },

        _onPageEnhancementChanged: function (page) {
            if (page.isVisible() && this._sliderLoaded) {
                this._resize();
            }
        },

        _onPageVisibilityChanged: function (page) {
            var isVisible = page.isVisible();
            if (isVisible && !this._sliderLoaded && this.isOnPage(page)) {
                this._sliderLoaded = true;
                $('#' + this.id + '-slider').flexslider(this.model.getConfig());
            }
        },

        _resize: function () {
            $(window).trigger('resize');
        }
    });

    return SliderView;
});
