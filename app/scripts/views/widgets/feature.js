define(function (require) {
    var
	WidgetView = require('views/widgets/widget');

    var FeatureView = WidgetView.extend({

        TAG: 'FeatureView',

        template: JST['app/scripts/templates/widgets/feature.ejs'],

        //defaults: $.extend(true, {}, WidgetView.prototype.defaults, {
        //}),

        initialize: function (options) {

            this._initializeSuper(options);

            var $header = this.$elSimpleContent.find('h3:first-child');
            var title = $.trim($header.text());
            $header.remove();
            var content = $.trim(this.$elSimpleContent.html());

            this.model.setTitle(title);
            this.model.setContent(content);

        }
    });

    return FeatureView;
});
