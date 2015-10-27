define(function (require) {
    var
	WidgetsCollection = require('collections/widgets'),
	BaseModel = require('models/base');

    var PageModel = BaseModel.extend({

        TAG: 'PageModel',

        defaults: $.extend(true, {}, BaseModel.prototype.defaults, {

            id: 'page-0',
            title: 'Untitled',
            content: 'No content.',
            number: 0,
            widgets: new WidgetsCollection([], {}),
            isVisible: null,
            hasFocus: false

        }),

        getId: function () {
            return this.get('id');
        },

        setTitle: function (title) {
            this.set('title', title);
        },

        getTitle: function () {
            return this.get('title');
        },

        setContent: function (content) {
            this.set('content', content);
        },

        getContent: function () {
            return this.get('content');
        },

        setNumber: function (number) {
            this.set('number', number);
        },

        getNumber: function () {
            return this.get('number');
        },

        setWidgets: function (widgets) {
            this.set('widgets', widgets);
        },

        getWidgets: function () {
            return this.get('widgets');
        },

        setVisible: function (value) {
            var isVisible = (value !== false) ? true : false;
            this.set('isVisible', isVisible);
        },

        isVisible: function () {
            return this.get('isVisible');
        },

        setFocus: function (value) {
            var hasFocus = (value !== false) ? true : false;
            this.set('hasFocus', hasFocus);
        },

        hasFocus: function () {
            return this.get('hasFocus');
        }
    });

    PageModel.prototype.toString = function () {
        var title = this.get('title');
        var widgets = this.get('widgets');
        return '[' + this.TAG + ' : ' + this.id + ' : ' + title + ' : ' + widgets + ']';
    };

    return PageModel;
});
