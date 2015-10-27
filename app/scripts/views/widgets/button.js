define(function (require) {
    var
	WidgetView = require('views/widgets/widget');

    var ButtonView = WidgetView.extend({

        TAG: 'ButtonView',

        template: JST['app/scripts/templates/widgets/button.ejs'],

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        initialize: function (options) {

            this._initializeSuper(options);

            var $a = this.$elSimpleContent;
            var link = $a.attr('href');
            var label = $a.text();

            this.model.setLink(link);
            this.model.setLabel(label);

        },

        afterRender: function () {
            var data = this.model.get('data');
            var jsonString = JSON.stringify(data);
            this.$el.attr('data-stylus', jsonString);
        }
    });

    return ButtonView;
});
