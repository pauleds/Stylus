define(function (require) {
    var
	WidgetModel = require('models/widgets/widget');

    var SliderModel = WidgetModel.extend({

        TAG: 'SliderModel',

        defaults: $.extend(true, {}, WidgetModel.prototype.defaults, {
            animation: 'slide',
            animationLoop: true,
            itemWidth: 640,
            pauseOnHover: true,
            smoothHeight: false,
            slideshow: true,
            panels: []
        }),

        _validOptions: ['caption', 'animation', 'animationLoop', 'itemWidth', 'pauseOnHover', 'smoothHeight', 'slideshow'],

        initialize: function (options) {
            this._initializeSuper(options);

            this.set('animationLoop', this._toBoolean(this.get('animationLoop')));
            this.set('itemWidth', this._toInteger(this.get('itemWidth')));
            this.set('pauseOnHover', this._toBoolean(this.get('pauseOnHover')));
            this.set('smoothHeight', this._toBoolean(this.get('smoothHeight')));
            this.set('slideshow', this._toBoolean(this.get('slideshow')));

            if (this.get('smoothHeight')) {
                this.set('slideshow', false);
            }

        },

        setPanels: function (panels) {
            this.set('panels', panels);
        },

        getPanels: function () {
            return this.get('panels');
        },

        getConfig: function () {

            var config = {

                namespace: 'wfs-',
                selector: '.wfs-slides > li',

                animation: this.get('animation'),
                animationLoop: this.get('animationLoop'),
                itemWidth: this.get('itemWidth'),
                pauseOnHover: this.get('pauseOnHover'),
                smoothHeight: this.get('smoothHeight'),
                slideshow: this.get('slideshow')

            };

            // this._debug( 'getConfig', this._dump( config ) );

            return config;

        },

        isCaptionTop: function () {
            return ('top' === this.get('caption'));
        },
        isCaptionBottom: function () {
            return ('bottom' === this.get('caption'));
        }
    });

    return SliderModel;
});
