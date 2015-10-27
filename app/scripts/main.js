require.config({

    baseUrl: 'scripts',

    paths: {

        /**
		 * Core.
		 *
		 * jquery: jQuery library.
		 * underscore: Underscore utility library.
		 * backbone: Backbone MV* library.
		 * layoutmanager: Layout and template manager for Backbone.
		 * foundation: Foundation responsive front-end framework.
		 */

        'jquery': '../bower_components/jquery/dist/jquery',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'layoutmanager': '../bower_components/layoutmanager/backbone.layoutmanager',
        'foundation' : '../bower_components/foundation/js/foundation',
        
        /**
		 * Foundation dependencies.
		 *
		 * fastclick: Remove click delays on browsers with touch UIs.
		 * jquery.cookie: Cookie management for reading, writing and deleting cookies.
		 */

        'fastclick': '../bower_components/fastclick/lib/fastclick',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie',

        /**
		 * Enhancements.
		 *
		 * flexslider: A fully responsive jQuery slider plugin.
		 * hammer: A javascript library for multi-touch gestures.
		 * jquery.jscrollpane: Cross-browser custom scrollbars.
		 * jquery.mousewheel: Cross-browser mouse wheel support.
		 * jquery.mwheelIntent: Increase the usability of the mousewheel in nested scroll areas.
		 * jquery.hoverintent: Detect user intent through mouse movement.
		 * mediaelement: Cross-browser HTML5 media player.
		 * waypoints: Execute functions on element scroll.
		 */

        'flexslider': '../bower_components/flexslider/jquery.flexslider',
        'hammer': '../bower_components/hammerjs/hammer.min',
        'jquery.jscrollpane': '../bower_components/jquery.jscrollpane/jquery.jscrollpane.min',
        'jquery.mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel.min',
        'jquery.mwheelIntent': '../bower_components/jquery.jscrollpane/mwheelIntent',
        'jquery.hoverintent': '../bower_components/jquery-hoverIntent-jmalonzo/jquery.hoverIntent',
        'mediaelement': '../bower_components/mediaelement/build/mediaelement-and-player.min',
        'mediaelement.playlist': '../lib/mediaelement-playlist/mediaelement-playlist-plugin.min',
        'waypoints': '../bower_components/waypoints/lib/jquery.waypoints.min'

    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'layoutmanager': {
            deps: ['backbone'],
            exports: 'Backbone.LayoutManager'
        },
        'foundation': {
            deps: ['jquery', 'fastclick', 'jquery.cookie'],
            exports: 'foundation'
        },
        'jquery.mousewheel': {
            deps: ['jquery'],
            exports: 'jQuery.fn.mousewheel'
        },
        'jquery.mwheelIntent': {
            deps: ['jquery', 'jquery.mousewheel'],
            exports: 'jQuery.fn.mwheelIntent'
        },
        'jquery.jscrollpane': {
            deps: ['jquery', 'jquery.mousewheel', 'jquery.mwheelIntent'],
            exports: 'jQuery.fn.jscrollpane'
        },
        'waypoints': {
            deps: ['jquery'],
            exports: 'jQuery.fn.waypoint'
        },
        'flexslider': {
            deps: ['jquery'],
        },
        'mediaelement': {
            deps: ['jquery'],
            exports: 'mejs'
        },
        'mediaelement.playlist': {
            deps: ['jquery', 'mediaelement'],
            exports: 'mejs'
        }

    }

});

require(['app']);