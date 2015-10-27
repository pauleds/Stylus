define(function (require) {
    var    
	NavbarView = require('views/navbar'),
	OptionsModel = require('models/options'),
	OptionsView = require('views/options'),
	PageModel = require('models/page'),
	PageView = require('views/page'),
	PagesCollection = require('collections/pages'),
	PaginationModel = require('models/pagination'),
	Hammer = require('hammer'),
	Waypoints = require('waypoints'),
	BaseView = require('views/base');

    var
	OPACITY_ACTIVE = 0.8,
	OPACITY_INACTIVE = 0.1;

    var ApplicationView = BaseView.extend({

        TAG: 'ApplicationView',

        id: 'app-stylus',

        template: JST['app/scripts/templates/application.ejs'],

        navbar: null,
        options: null,
        pagination: null,

        _didUserScroll: false,
        _offsetTop: 75,
        _viewIsSuccessive: false,

        initialize: function (options) {

            this._initializeBase(options);

            var _this = this;

            if ($('#document-pages').length > 0) {
                $('#document-pages').attr('id', 'pages-temp');
            }

            // Detect window resizing.
            $(window).on('resize', Foundation.utils.throttle(function (event) {
                var isSmallOnly = Foundation.utils.is_small_only();
                _this.model.set('viewIsSmall', isSmallOnly);
                _this._sendEvent('windowResize', isSmallOnly);
            }, 500));

            // Respond to window resizing.
            this.listenTo(this.model, 'change:viewIsSmall', function (event) {
                var viewIsSmall = this.model.getViewIsSmall();
                _this._sendEvent('viewSizeUpdated', viewIsSmall);
                if (viewIsSmall) {
                    this.$el.addClass('view-small');
                } else {
                    this.$el.removeClass('view-small');
                }
            });

            // Process original page content.
            var $originalPages = $('#pages-temp .page');
            var pageModels = [];
            $originalPages.each(function (index) {
                var $originalPage = $(this);
                var number = index + 1;
                var pageId = 'page-' + number;
                $originalPage.attr('id', pageId);
                var pageModel = new PageModel({
                    id: pageId,
                    number: number
                });
                var pageView = new PageView({
                    id: pageId,
                    model: pageModel,
                    notifier: _this.notifier
                });
                $originalPage.remove();
                pageModels.push(pageModel);
                _this.setView('#document-pages', pageView, true);
            });
            this.model.set('pages', new PagesCollection(pageModels, {}));

            this.notifier.on({
                'enableGestures': this._enableGestures,
                'optionsViewPage': this._onOptionsViewPage,
            }, this);

        },

        serialize: function () {
            return {
                app: this.model
            };
        },

        afterRender: function () {

            var _this = this;

            this.$el.addClass('view-successive');

            // Process rendered DOM elements.
            var $documentHeader = $('#document-header');
            var $documentFooter = $('#document-footer');
            var $documentInfo = $('#document-info');

            var documentTitle = $.trim($documentHeader.find(' > h1').first().text());
            this.model.set('documentTitle', documentTitle);

            $documentInfo.prepend('<h3>' + documentTitle + '</h3>');

            var htmlInner = '<div class="inner clearfix" />';
            $documentHeader.wrapInner(htmlInner).prependTo('#app-main');
            $documentFooter.wrapInner(htmlInner).appendTo('#app-main');
            $documentInfo.wrapInner(htmlInner).appendTo('#app-main');

            this.$elAppMain = $('#app-main');

            // Add footer nav and store references to links.
            var $appFooter = this.$el.find('#app-footer');
            $appFooter.prepend(JST['app/scripts/templates/pagenav-pagination.ejs']());
            $appFooter.prepend(JST['app/scripts/templates/pagenav-other.ejs']());

            var $pagenav = this.$el.find('.pagenav');
            this.$elPagenavOther = this.$el.find('#pagenav-other');
            this.$elPagenavPagination = this.$el.find('#pagenav-pagination');
            this.$elAlign = this.$elPagenavOther.find('#pagitem-align > a');
            this.$elOptions = this.$elPagenavOther.find('#pagitem-options > a');
            this.$elPrevious = this.$elPagenavPagination.find('#pagitem-previous > a');
            this.$elNext = this.$elPagenavPagination.find('#pagitem-next > a');

            if (this.model.getPages().length < 2) {
                this.$elPagenavPagination.addClass('hidden');
            }

            // Add footer nav hover behaviour.
            $pagenav.find('a').each(function (index, element) {
                var $a = $(this);
                $a.stop().fadeTo(10, OPACITY_INACTIVE);
                // Fade in/out on hover.
                $a.hover(function () {
                    $a.stop().fadeTo(300, OPACITY_ACTIVE);
                }, function () {
                    $a.stop().fadeTo(300, OPACITY_INACTIVE);
                });
                // Remove focus state for touch screens.
                $a.click(function () {
                    this.blur();
                });
            });

            // Add footer nav alignment behaviour.
            this.$elAlign.click(function (event) {
                var $a = $(this);
                $a.stop().fadeTo(10, OPACITY_INACTIVE);
                _this.$elPagenavOther.toggleClass('a-left a-right');
                _this.$elPagenavPagination.toggleClass('a-left a-right');
                if (_this.$elPagenavOther.hasClass('a-left')) {
                    _this.$elPagenavOther.prepend(_this.$elAlign.parent());
                } else {
                    _this.$elPagenavOther.append(_this.$elAlign.parent());
                }
            });

            // Add header nav.
            this.pagination = new PaginationModel({});

            this.navbar = new NavbarView({
                model: this.pagination,
                notifier: this.notifier,
                pages: this.model.getPages()
            });

            this.listenTo(this.model, 'pageNumberUpdated', this._onPageNumberUpdated);
            this.listenTo(this.pagination, 'paginationUpdated', this._onPaginationUpdated);

            this.navbar.render().promise().done(function () {
                _this._afterNavbarRender();
            });

        },

        _afterNavbarRender: function () {

            var _this = this;

            this.navbar.$el.appendTo('#app-header');

            // Final preparations.
            this._resize();
            $('#pages-temp').remove();

            this._initScrollTriggers();
            this._initGestures();
            this._initEnhancements();
            this._initOptions();
            this._initTracking();

            // var documentInfoHtml = $( '#document-info' ).html( );

            this.$el.find('#app-info-menu').append(JST['app/scripts/templates/info.ejs']());
            this.$el.find('#info-menu-document-title').html(this.model.getDocumentTitle());
            this.$el.find('#info-menu-document-info').html($('#document-info').html());

            // Add event listeners.
            this.notifier.on({
                'applicationReady': this._onApplicationReady,
                'contentsSmallMenuClosed': this._onContentsSmallMenuClosed
            }, this);

            // Start Foundation.
            $(document).foundation({
                tabs: {
                    scroll_to_content: false
                }
            });

            this._sendEvent('applicationReady', this.model);

        },

        _initTracking: function () {

            var _this = this;

            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] ||
				function () {
				    (i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'gaStylus');

            (function (strFunctionName) {

                // Define.
                var id = 'UA-43325899-1';
                var name = 'stylusTracker';
                var options = {
                    'name': name,
                    'siteSpeedSampleRate': 50,
                    'alwaysSendReferrer': true,
                    'cookieName': '_gaStylus'
                };

                // Create.
                var fn = window[strFunctionName];
                fn('create', id, options);

                // Set.
                fn(name + '.set', 'anonymizeIp', true);
                fn(name + '.set', 'appName', window.Stylus.name);
                fn(name + '.set', 'appVersion', window.Stylus.version);

                // Send.
                var pagePath = window.location.pathname;
                var pageTitle = document.title;
                _this._debug(pageTitle, pagePath);
                fn(name + '.send', 'pageview', {
                    'page': pagePath,
                    'title': pageTitle
                });

            })('gaStylus');

        },

        _initOptions: function () {

            var _this = this;

            this.$elViewEnhancedContent = this.$el.find('.view-enhanced-content');
            this.$elViewSimpleContent = this.$el.find('.view-simple-content');

            this.$el.find('#app-about-menu').append(JST['app/scripts/templates/about.ejs']());

            this.options = new OptionsModel({
                textSizeOriginalPx: this.$elAppMain.css('font-size')
            });

            var optionsView = new OptionsView({
                id: 'options-menu-main',
                model: this.options,
                notifier: this.notifier
            });

            this.setView('#app-options-menu', optionsView);
            optionsView.render().promise().done(function () {
                $(document).foundation('reveal', 'reflow');
            });

            // Respond to page view change (successive/continuous).
            this.listenTo(this.options, 'change:pageView', function (model) {
                var viewIsSuccessive = model.getPageViewIsSuccessive();
                this._viewIsSuccessive = viewIsSuccessive;

                this.model.getPages().each(function (page) {
                    page.setVisible(!viewIsSuccessive);
                }, this);
                this.model.getPage().setVisible(true);

                var delay = 300;
                this._enableScrollTriggers(false);
                if (viewIsSuccessive) {
                    this.$el.addClass('view-successive');
                    this._scrollToTop({
                        delay: delay
                    });
                } else {
                    this.$el.removeClass('view-successive');
                    var page = this.model.getPage();
                    var params = {
                        onComplete: function (event) {
                            _this._enableScrollTriggers(true);
                        },
                        delay: delay
                    };
                    if (page.getNumber() === 1) {
                        this._scrollToTop(params);
                    } else {
                        params.offset = (_this._offsetTop * -1) + 2;
                        this._scrollToElement('#' + page.getId(), params);
                    }

                }
                this._resize();
                _this._sendEvent('viewSuccessiveUpdated', viewIsSuccessive);
            });

            this.listenTo(this.options, 'change:pageSimple', function (model) {
                var pageSimple = model.getPageSimple();
                // _this._debug( 'pageSimple', pageSimple );

                if (pageSimple === true) {
                    this.$elViewEnhancedContent.addClass('inactive').removeClass('active');
                    this.$elViewSimpleContent.addClass('active').removeClass('inactive');
                    // this.$el.addClass( 'view-simple' );
                } else {
                    this.$elViewEnhancedContent.addClass('active').removeClass('inactive');
                    this.$elViewSimpleContent.addClass('inactive').removeClass('active');
                    // this.$el.removeClass( 'view-simple' );
                }

                this.notifier.trigger('pageEnhancementChanged', this.model.getPage());

                this._resize();

            });

            this.listenTo(this.options, 'change:textSizePx', function (model) {
                _this.$elAppMain.css('font-size', model.getTextSizePx());
                _this.$elAppMain.find('.reveal-modal:not(#options-menu)').css('font-size', model.getTextSizePx());
            });

            this.listenTo(this.options, 'change:textContrast', function (model) {
                var textContrast = model.getTextContrast();
                if (textContrast === 'contrast-black-on-white') {
                    textContrast = 'contrast-default';
                }
                $('body').removeClass(function (index, css) {
                    return (css.match(/(^|\s)contrast-\S+/g) || []).join(' ');
                }).addClass(textContrast);
                _this.$el.find('.page > .inner').removeClass().addClass('inner ' + textContrast);
            });

        },

        _initEnhancements: function () {

            var aDownload = 'a[download]:not(.stylus-ui-button),a[class^="download"]:not(.stylus-ui-button),a[class*="download"]:not(.stylus-ui-button)';
            var aNewWindow = 'a[target*=_blank]:not(.stylus-ui-button),a[rel*=external]:not(.stylus-ui-button)';
            var aEmail = 'a[href^="mailto:"]:not(.stylus-ui-button)';
            var icon;

            icon = '<span class="fa fa-download"></span>';
            $(aDownload).each(function (index) {
                var icon = '<span class="fa fa-download"></span>';
                var $a = $(this);
                $a.attr('title', 'Download file');
                if ($a.hasClass('button')) {
                    $a.prepend(icon);
                } else {
                    $a.append(icon);
                }
            });

            icon = ' <span class="fa fa-external-link"></span>';
            $(aNewWindow).each(function (index) {
                var $a = $(this);
                $a.attr('title', 'Opens in a new window');
                $a.click(function () {
                    window.open(this.href);
                    return false;
                });
                if ($a.hasClass('button')) {
                    $a.prepend(icon);
                } else {
                    $a.append(icon);
                }
            });

            icon = '<span class="fa fa-envelope-o"></span>';
            $(aEmail).each(function (index) {
                var $a = $(this);
                $a.attr('title', 'Opens in your default e-mail software.');
                if ($a.hasClass('button')) {
                    $a.prepend(icon);
                } else {
                    $a.append(icon);
                }
            });

            // Remove empty p tags.
            $('p').each(function () {
                var $p = $(this);
                if ($p.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $p.remove();
            });

        },

        _initGestures: function () {
            var _this = this;
            var el = document.getElementById('app-root');
            this.gestures = new Hammer.Manager(el, {
                recognizers: [[Hammer.Swipe, {
                    threshold: 50,
                    direction: Hammer.DIRECTION_HORIZONTAL
                }]]
            });
            this.gestures.on('swipe', function (event) {
                var href;
                if (Hammer.DIRECTION_LEFT == event.direction) {
                    href = _this.$elNext.attr('href');
                } else if (Hammer.DIRECTION_RIGHT == event.direction) {
                    href = _this.$elPrevious.attr('href');
                } else {
                    return false;
                }
                window.location.href = href;
            });
        },

        _initScrollTriggers: function () {

            var _this = this;
            var $pages = this.$el.find('div.page');
            var offsetTop = this._offsetTop;

            var triggerPageChange = function (id) {
                var page = _this.model.getPages().findWhere({
                    id: id
                });
                _this._didUserScroll = true;
                _this._sendEvent('scrolledPageChange', page.get('number'));
            };

            // Add trigger to all page headers.
            $pages.waypoint(function (direction) {
                var id = this.element.id;
                triggerPageChange(id);
            }, {
                offset: offsetTop
            });

            // Add trigger to last page / document bottom.
            var id = $pages.last().attr('id');
            this.$el.find('#app-footer').waypoint(function (direction) {
                triggerPageChange(id);
            }, {
                offset: 'bottom-in-view'
            });

            // Return to current page if small contents menu closes without selection.
            this.navbar.$('li.toggle-topbar > a ').click(function () {
                _this._enableScrollTriggers(false);
                var isContentsSmallMenuExpanded = !_this.$el.find('nav.top-bar').hasClass('expanded');
                if (!isContentsSmallMenuExpanded) {
                    var pageNumber = _this.model.getPage().get('number');
                    _this._focusOnPage({
                        pageNumber: pageNumber,
                        isSamePage: true,
                        delay: 300
                    });
                }
            });

            this._enableScrollTriggers(true);

        },

        _enableGestures: function (value) {
            var enable = (value !== false) ? true : false;
            this.gestures.set({
                enable: enable
            });
        },

        _enableScrollTriggers: function (value) {
            var enable = (value !== false) ? true : false;
            if (this._viewIsSuccessive) {
                Waypoint.disableAll();
                return false;
            }
            if (enable) {
                Waypoint.enableAll();
            } else {
                Waypoint.disableAll();
            }
        },

        _scrollTo: function (scrollTop, params) {

            var _this = this;
            var scrollTop = this._value(scrollTop, 0);
            var params = this._value(params, {});
            var duration = this._value(params.duration, 800);
            var onComplete = this._value(params.onComplete, function () {
            });

            _this._enableScrollTriggers(false);

            var callbackProcessed = false;
            var callback = function () {
                if (!callbackProcessed) {
                    callbackProcessed = true;
                    _this._enableScrollTriggers();
                    onComplete();
                }
            };

            $('html, body').stop(true).animate({
                scrollTop: scrollTop,
                easing: 'swing'
            }, duration, callback);

        },

        _scrollToElement: function (element, params) {
            var $el = $(element);
            if (!$el.length) {
                // throw new Error( this._debug( 'DOM element not found.', element, true ) );
                this._debug('ERROR: DOM element not found.', element);
                return false;
            }
            var params = this._value(params, {});
            var offset = this._value(params.offset, 0);
            var scrollTop = $el.offset().top + offset;
            this._scrollTo(scrollTop, params);
        },

        _scrollToTop: function (params) {
            this._scrollTo(0, params);
        },

        _focusOnPage: function (params) {

            var _this = this;
            var params = this._value(params, {});
            var pageNumber = this._value(params.pageNumber, this.model.getPageNumberCurrent());
            var delay = this._value(params.delay, 100);
            var isSamePage = this._value(params.isSamePage, false);

            var page = this.model.getPage(pageNumber);
            var id = page.get('id');
            var pages = this.model.getPages();

            var pageNumberLast = this.model.get('pageNumberLast');
            var pageLast = this.model.getPage(pageNumberLast);

            var didUserScroll = this._didUserScroll;
            this._didUserScroll = false;

            this._sendEvent('focusOnPageStart', page);

            var notifyPageChangeComplete = function () {
                _this.model.setFocusingOnPage(false);
                _this.pagination.update(page, pages);
                _this._sendEvent('focusOnPageComplete', page);
            };

            var performContinuousFocusOnPage = function () {

                _this.getView({
                    model: pageLast
                }).loseFocus();

                _this.getView({
                    model: page
                }).gainFocus();

                if (didUserScroll) {
                    notifyPageChangeComplete();
                } else {
                    var params = {
                        offset: (_this._offsetTop * -1) + 2, // extra 2px to prevent scroll triggers from firing.
                        onComplete: notifyPageChangeComplete
                    };
                    if (pageNumber == 1) {
                        _this._scrollToTop(params);
                    } else {
                        _this._scrollToElement('#' + id, params);
                    }
                }

            };

            var performSuccessiveFocusOnPage = function () {

                if (isSamePage) {
                    notifyPageChangeComplete();
                    return false;
                }

                if (pageNumberLast < 1) {
                    _this.getView({
                        model: page
                    }).show();
                    notifyPageChangeComplete();
                    return false;
                }

                if (pageNumberLast < pageNumber) {

                    _this.getView({
                        model: pageLast
                    }).loseFocus('slideLeftFadeOut', function () {
                        _this.getView({
                            model: page
                        }).gainFocus('slideLeftFadeIn', function () {
                            _this._scrollToTop({
                                duration: 300
                            });
                            notifyPageChangeComplete();
                        });
                    });

                } else {

                    _this.getView({
                        model: pageLast
                    }).loseFocus('slideRightFadeOut', function () {
                        _this.getView({
                            model: page
                        }).gainFocus('slideRightFadeIn', function () {
                            _this._scrollToTop({
                                duration: 300
                            });
                            notifyPageChangeComplete();
                        });
                    });

                }

            };

            if (this._viewIsSuccessive) {
                performSuccessiveFocusOnPage();
            } else {
                setTimeout(performContinuousFocusOnPage, delay);
            }

        },

        _onApplicationReady: function (appModel) {
            if (this._viewIsSuccessive) {
                var pages = this.model.getPages();
                pages.each(function (page) {
                    page.setVisible(false);
                });
            }
            this._focusOnPage({
                delay: 300
            });

        },

        _onContentsSmallMenuClosed: function (pageNumber) {
            this._focusOnPage({
                pageNumber: pageNumber,
                isSamePage: true
            });
        },

        _onOptionsViewPage: function (value) {
            if (value === 'reload') {
                window.location.reload(true);
            } else if (value === 'duplicate') {
                window.open(window.location.href);
            } else if (value === 'plain') {
                window.open(window.location.href + '/stylus-plain');
            } else if (value === 'print') {
                window.print();
            }
        },

        _onPageNumberUpdated: function (pageNumber) {
            this._focusOnPage({
                pageNumber: pageNumber
            });
        },

        _onPaginationUpdated: function (pagination) {

            var pageNumberPrevious = pagination.getPageNumberPrevious();
            var pageNumberNext = pagination.getPageNumberNext();
            var href = '#/page/';

            this.$elPrevious.attr('href', href + pageNumberPrevious);
            this.$elNext.attr('href', href + pageNumberNext);

        },

        _resize: function () {
            $(window).trigger('resize');
        }
    });

    return ApplicationView;
});
