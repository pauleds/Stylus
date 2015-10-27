/// <binding BeforeBuild='build' />
//'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function( grunt ) {

	/**
	 * load-grunt-tasks
	 * Load multiple grunt tasks using globbing patterns.
	 */
	require('load-grunt-tasks')( grunt );

	/**
	 * time-grunt
	 * Displays the execution time of grunt tasks.
	 */
	require('time-grunt')( grunt ); 

	/**
	 * Define the configuration for all the tasks
	 */
	grunt.initConfig( {

		// Project settings
		appConfig : {
			app : 'app',
			dist: 'dist'
		},

		/**
		 * grunt-contrib-requirejs
		 * Optimize RequireJS projects using r.js.
		 */
		requirejs : {
			dist : {
				options : {
					almond : true,
					baseUrl : '<%= appConfig.app %>/scripts/',
					include : [ 'main' ],
					insertRequire : [ 'main' ],
					mainConfigFile : '<%= appConfig.app %>/scripts/main.js',
					name : '../bower_components/almond/almond',
					optimize : 'none',
					out : '.tmp/concat/scripts/main.js',
					paths : {
						'templates' : '../../.tmp/scripts/templates'
					},
					preserveLicenseComments : true,
					wrap : true,
					done : function( done, output ) {
						grunt.log.success( "requirejs done!" );
						done( );
					}
				}
			}
		},

		/**
		 * grunt-contrib-watch
		 * Run predefined tasks whenever watched file patterns are added,
		 * changed or deleted.
		 */
		watch : {
			js : {
				files : [ '<%= appConfig.app %>/scripts/{,*/}*.js' ],
				tasks : [ 'jshint' ],
				options : {
					livereload : true
				}
			},
			jstest : {
				files : [ 'test/spec/{,*/}*.js' ],
				tasks : [ 'test:watch' ]
			},
			jst : {
				files : [ '<%= appConfig.app %>/scripts/templates/{,*/}*.ejs' ],
				tasks : [ 'jst' ]
			},
			gruntfile : {
				files : [ 'Gruntfile.js' ]
			},
			compass : {
				files : [ '<%= appConfig.app %>/styles/{,*/}*.{scss,sass}' ],
				tasks : [ 'compass:server', 'autoprefixer' ]
			},
			styles : {
				files : [ '<%= appConfig.app %>/styles/{,*/}*.css' ],
				tasks : [ 'newer:copy:styles', 'autoprefixer' ]
			},
			livereload : {
				options : {
					livereload : '<%= connect.options.livereload %>'
				},
				files : [ '<%= appConfig.app %>/{,*/}*.html', '.tmp/styles/{,*/}*.css', '<%= appConfig.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}' ]
			}
		},

		/**
		 * grunt-bower-requirejs
		 * Automagically wire-up installed Bower components into your RequireJS config.
		 */
		bower : {
			all : {
				rjsConfig : '<%= appConfig.app %>/scripts/main.js'
			}
		},

		/**
		 * grunt-contrib-jst
		 * Precompile Underscore templates to JST file.
		 */
		jst : {
			options : {
				amd : true
			},
			compile : {
				files : {
					'.tmp/scripts/templates.js' : [ '<%= appConfig.app %>/scripts/templates/{,*/}*.ejs' ]
				}
			}
		},

		/**
		 * grunt-contrib-connect
		 * Start a connect web server.
		 */
		connect : {
			options : {
				port : 9002,
				livereload : 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname : 'localhost'
			},
			// connect-livereload
			livereload : {
				options : {
					open : false,
					base : [ '.tmp', '<%= appConfig.app %>' ]
				}
			},
			test : {
				options : {
					port : 9001,
					base : [ '.tmp', 'test', '<%= appConfig.app %>' ]
				}
			},
			dist : {
				options : {
					open : false,
					base : '<%= appConfig.dist %>',
					livereload : false
				}
			}
		},

		/**
		 * grunt-open
		 * Open urls and files from a grunt task.
		 */
		open : {
			server : {
				path : 'http://localhost:<%= connect.options.port %>'
			}
		},

		/**
		 * grunt-contrib-clean
		 * Clean files and folders.
		 */
		clean : {
			dist : {
				files : [ {
					dot : true,
					src : [ '.tmp', '<%= appConfig.dist %>/*', '!<%= appConfig.dist %>/.git*' ]
				} ]
			},
			server : '.tmp'
		},

		/**
		 * grunt-contrib-jshint
		 * Validate files with JSHint.
		 */
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require( 'jshint-stylish' )
			},
			all : [ 'Gruntfile.js', '<%= appConfig.app %>/scripts/{,*/}*.js', '!<%= appConfig.app %>/scripts/vendor/*', 'test/spec/{,*/}*.js' ]
		},

		/**
		 * grunt-mocha
		 * Automatically run client-side mocha specs via grunt/mocha/PhantomJS.
		 */
		mocha : {
			all : {
				options : {
					run : true,
					urls : [ 'http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html' ]
				}
			}
		},

		/**
		 * grunt-contrib-compass
		 * Compile Sass to CSS using Compass.
		 */
		compass : {
			options : {
				sassDir : '<%= appConfig.app %>/styles',
				cssDir : '.tmp/styles',
				generatedImagesDir : '.tmp/images/generated',
				imagesDir : '<%= appConfig.app %>/images',
				javascriptsDir : '<%= appConfig.app %>/scripts',
				fontsDir : '<%= appConfig.app %>/bower_components/font-awesome/fonts',
				importPath : '<%= appConfig.app %>/bower_components',
				httpImagesPath : '/images',
				httpGeneratedImagesPath : '/images/generated',
				httpFontsPath : '/styles/fonts',
				relativeAssets : false,
				assetCacheBuster : false
			},
			dist : {
				options : {
					generatedImagesDir : '<%= appConfig.dist %>/images/generated'
				}
			},
			server : {
				options : {
					debugInfo : true
				}
			}
		},

		/**
		 * grunt-autoprefixer
		 * Autoprefixer parses CSS and adds vendor-prefixed CSS properties
		 * using the Can I Use database.
		 */
		autoprefixer : {
			options : {
				browsers : [ 'last 1 version' ]
			},
			dist : {
				files : [ {
					expand : true,
					cwd : '.tmp/styles/',
					src : '{,*/}*.css',
					dest : '.tmp/styles/'
				} ]
			}
		},

		/**
		 * grunt-rev
		 * Static file asset revisioning through content hashing.
		 */
		rev : {
			dist : {
				files : {
					src : [ '<%= appConfig.dist %>/scripts/{,*/}*.js', '<%= appConfig.dist %>/styles/{,*/}*.css', '<%= appConfig.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}', '<%= appConfig.dist %>/styles/fonts/{,*/}*.*' ]
				}
			}
		},

		/**
		 * grunt-contrib-uglify
		 * Minify files with UglifyJS.
		 */
		uglify : {
			dist : {
				options : {
					preserveComments : 'some',
				},
				files : {
				    '<%= appConfig.dist %>/scripts/main.js': ['.tmp/concat/scripts/main.js'],
				    '<%= appConfig.dist %>/scripts/modernizr.js': ['<%= appConfig.app %>/bower_components/modernizr/modernizr.js']
				},
			}
		},

		/**
		 * grunt-usemin
		 * Replaces references to non-optimized scripts or stylesheets into a
		 * set of HTML files (or any templates/views).
		 */

		// Prepares the configuration to transform specific construction (blocks)
		// in the scrutinized file into a single line, targeting an optimized version
		// of the files.
		useminPrepare : {
			html : '<%= appConfig.app %>/index.html',
			options : {
				dest : '<%= appConfig.dist %>'
			}

		},

		// Replaces the blocks by the file they reference, and replaces all references
		// to assets by their revisioned version if it is found on the disk.
		// This target modifies the files it is working on.
		usemin : {
			options : {
				assetsDirs : [ '<%= appConfig.dist %>' ]
			},
			html : [ '<%= appConfig.dist %>/{,*/}*.html' ],
			css : [ '<%= appConfig.dist %>/styles/{,*/}*.css' ]
		},

		/**
		 * grunt-contrib-cssmin
		 * Compress CSS files.
		 */
		cssmin : {
			dist : {
				files : {
					'<%= appConfig.dist %>/styles/main.css' : [ //
					'.tmp/styles/imports.css', //
					'.tmp/styles/main.css'
					]
				}
			}
		},

		/**
		 * grunt-contrib-htmlmin
		 * Minify HTML.
		 */
		htmlmin : {
			dist : {
				options : {
					// collapseBooleanAttributes : true,
					// collapseWhitespace : true,
					// removeAttributeQuotes : true,
					// removeCommentsFromCDATA : true,
					// removeEmptyAttributes : true,
					// removeOptionalTags : true,
					// removeRedundantAttributes : true,
					// useShortDoctype : true
				},
				files : [ {
					expand : true,
					cwd : '<%= appConfig.dist %>',
					src : '{,*/}*.html',
					dest : '<%= appConfig.dist %>'
				} ]
			}
		},

		/**
		 * grunt-contrib-copy
		 * Copy files and folders.
		 * Copies remaining files to places other tasks can use.
		 */
		copy : {
			dist : {
				files : [ {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>',
					dest : '<%= appConfig.dist %>',
					src : [ '*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.{png,jpg,jpeg,gif,webp}', '{,*/}*.{html,css,php,png}', 'styles/fonts/{,*/}*.*', 'gAssets/{,*/}*.{jpg,jpeg,png,mp3}', 'bower_components/' + ( this.includeCompass ? 'sass-' : '' ) + 'bootstrap/' + ( this.includeCompass ? 'fonts/' : 'dist/fonts/' ) + '*.*' ]
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>',
					dest : '<%= appConfig.dist %>/styles/fonts',
					src : [ 'bower_components/font-awesome/fonts/{,*/}*.*' ],
					flatten : true
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>',
					dest : '<%= appConfig.dist %>/styles/fonts',
					src : [ 'bower_components/flexslider/fonts/{,*/}*.*' ],
					flatten : true
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>',
					dest : '<%= appConfig.dist %>/styles/mediaelement',
					src : [ 'bower_components/mediaelement/build/{,*/}*.*' ],
					flatten : true
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>',
					dest : '<%= appConfig.dist %>/styles/mediaelement-playlist',
					src : [ 'lib/mediaelement-playlist/{,*/}*.*' ],
					flatten : true
				}, {
				    expand : true,
				    dot : true,
				    cwd : '<%= appConfig.app %>',
				    dest: '<%= appConfig.dist %>/scripts',
				    src: ['bower_components/modernizr/modernizr.js'],
				    flatten : true
				}, {
					expand : true,
					cwd : '<%= appConfig.app %>/images/',
					src : [ '**/*.{png,jpg,jpeg,gif}' ],
					dest : '<%= appConfig.dist %>/images/'
				},
				//
				{
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/demo/images/',
					dest : '<%= appConfig.dist %>/demo/images/',
					src : '{,*/}*.*'
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/demo/media/av/',
					dest : '<%= appConfig.dist %>/demo/media/av/',
					src : '{,*/}*.*'
				},
				//
				{
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/',
					dest : '<%= appConfig.dist %>/',
					src : '*.js'
				} ]
			},
			styles : {
				files : [ {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/styles',
					dest : '.tmp/styles/',
					src : '{,*/}*.css'
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/bower_components/font-awesome/fonts',
					dest : '.tmp/styles/fonts/',
					src : '{,*/}*.*',
					flatten : true
				}, {
					expand : true,
					dot : true,
					cwd : '<%= appConfig.app %>/bower_components/jquery-ui/themes/smoothness/images',
					dest : '.tmp/styles/images/',
					src : '{,*/}*.*',
					flatten : true
				} ]
			},
			dev : {
				files : [ {
					expand : true,
					dot : true,
					cwd : '.tmp/concat/scripts/',
					dest : '<%= appConfig.dist %>/scripts/',
					src : '{,*/}*.js'
				}, {
					expand : true,
					dot : true,
					cwd : '.tmp/styles/',
					dest : '<%= appConfig.dist %>/styles/',
					src : '{,*/}*.css'
				} ]
			}
		},

		/**
		 * grunt-modernizr
		 * Generates a custom Modernizr build that includes only referenced tests.
		 */
		modernizr : {
			dist : {
				devFile : '<%= appConfig.app %>/bower_components/modernizr/modernizr.js',
				dest : '<%= appConfig.dist %>/scripts/modernizr.js',
				files : {
					src : [ '<%= appConfig.dist %>/scripts/{,*/}*.js', '<%= appConfig.dist %>/styles/{,*/}*.css', '!<%= appConfig.dist %>/scripts/vendor/*' ]
				},
				uglify : true
			}
		},

		/**
		 * grunt-concurrent
		 * Run grunt tasks concurrently.
		 * Run some tasks in parallel to speed up build process
		 */
		concurrent : {
			server : [ 'compass:server', 'copy:styles' ],
			test : [ 'copy:styles' ],
			dist : [ 'compass', 'copy:styles' ] // , 'imagemin', 'svgmin'
		}
	} );

	/**
	 *
	 */
	grunt.registerTask( 'createTemplate', function( ) {
		grunt.file.write( '.tmp/scripts/templates.js', 'this.JST = this.JST || {};' );
	} );

	/**
	 * Task: serve
	 */
	grunt.registerTask( 'serve', function( target ) {
		if ( target === 'dist' ) {
			return grunt.task.run( [ 'build', 'connect:dist:keepalive' ] );
		}
		grunt.task.run( [ 'clean:server', 'createTemplate', 'jst', 'concurrent:server', 'autoprefixer', 'connect:livereload', 'open', 'watch' ] );
	} );

	/**
	 * Task: test
	 */
	grunt.registerTask( 'test', function( target ) {
		if ( target !== 'watch' ) {
			grunt.task.run( [ 'clean:server', 'createTemplate', 'jst', 'concurrent:test', 'autoprefixer' ] );
		}
		grunt.task.run( [ 'connect:test', 'mocha' ] );
	} );

	/**
	 * Task: build-rjs
	 */
	grunt.registerTask( 'build-rjs', [ 'requirejs:dist' ] );

	/**
	 * Task: devbuild
	 */
	grunt.registerTask( 'devbuild', [ 'clean:dist', 'createTemplate', 'jst', 'useminPrepare', 'concurrent:dist', 'autoprefixer', 'requirejs:dist', 'copy:dev', 'copy:dist', 'cssmin' ] );

	/**
	 * Task: build
	 */
	grunt.registerTask('build', ['clean:dist', 'createTemplate', 'jst', 'useminPrepare', 'concurrent:dist', 'autoprefixer', 'requirejs:dist', 'copy:dist', 'uglify:dist', 'usemin', 'cssmin', 'htmlmin']); //'concat', 

	/**
	 * Task: default
	 */
	grunt.registerTask( 'default', [ 'newer:jshint', 'test', 'build' ] );

};
