'use strict';
module.exports = function(grunt) {

  // project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        indent: 2,
        strict: true,
        trailing: true,
        maxdepth: 3,
        white: false,
        laxcomma: true,
        expr: true,
        es5: true,
        //envir
        node: true,
        globals: {}
      },
      server: [
        'Gruntfile.js',
        'app.js',
        'src/**/*.js',
        'conf/**/*.js',
        'docs/*.js',
        'test/**/*.js'
      ],
      front: {
        options: {
          node: false,
          browser: true
        },
        files: {
          src: [
            'public/javascripts/commons.js'
          ]
        }
      }
    },
    watch: {
      server: {
        files: '<%= jshint.server %>',
        tasks: 'default',
        options: {
          interrupt: true,
          debounceDelay: 500
        }
      },
      front: {
        files: '<%= jshint.front.files.src %>',
        tasks: 'default',
        options: {
          interrupt: true,
          debounceDelay: 500
        }
      }
    },
    simplemocha: {
      all: {
        src: "test/**/*.js",
        options: {
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
      }
    }
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // default tasks
  grunt.registerTask('default', ['jshint', 'simplemocha']);
  grunt.registerTask('test', ['simplemocha']);
};
