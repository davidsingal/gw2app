'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    root: 'public',

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= root %>/.tmp',
            '<%= root %>/dist'
          ]
        }]
      },
      app: '<%= root %>/.tmp'
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        '*.js',
        '<%= root %>/app/scripts/{,*/}{,*/}*.js'
      ]
    },

    requirejs: {
      options: {
        optimize: 'uglify',
        preserveLicenseComments: false,
        useStrict: true,
        wrap: false
      },
      dist: {
        options: {
          baseUrl: '<%= root %>/app/scripts',
          include: 'main',
          out: '<%= root %>/dist/scripts/main.js',
          mainConfigFile: '<%= root %>/app/scripts/main.js',
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          '<%= root %>/dist/vendor/requirejs/require.js': ['<%= root %>/app/vendor/requirejs/require.js']
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root %>/app/images',
          src: '{,*/}{,*/}{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= root %>/dist/images'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= root %>/dist/styles/main.css': [
            '<%= root %>/app/vendor/normalize-css/normalize.css',
            '<%= root %>/app/vendor/leaflet-dist/leaflet.css',
            '<%= root %>/app/styles/{,*/}*.css'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= root %>/app',
          dest: '<%= root %>/dist',
          src: [
            '*.{ico,png,txt}'
          ]
        }]
      }
    },

    watch: {
      options: {
        spawn: false
      },
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint']
      }
    }

  });

  grunt.registerTask('default', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean:dist',
    'requirejs',
    'uglify',
    'imagemin',
    'cssmin',
    'copy'
  ]);

};
