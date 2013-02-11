module.exports = function(grunt) {
  'use strict';

  // project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      all: ['grunt.js', 'app.js', 'app/**/*.js', 'conf/**/*.js', 'test/**/*.js', 'public/javascripts/commons.js']
    },
    jshint: {
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: false,
        newcap : true,
        noarg: true,
        nonew: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        strict: true,
        trailing: true,
        maxdepth: 3,
        white: false,
        laxcomma: true,
        expr: true,
        es5: true,
        //envir
        browser: true,
        jquery: true,
        node: true
      },
      globals: {
        // clinet
        markdown: true,
        FB: true,
        // mocha
        describe: true,
        it: true,
        before: true,
        beforeEach: true,
        after: true,
        afterEach: true
      }
    },
    watch: {
      files: '<config:lint.all>',
      tasks: 'default'
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

  grunt.loadNpmTasks('grunt-simple-mocha');

  // default tasks
  grunt.registerTask('default', 'lint simplemocha');
  grunt.registerTask('test', 'simplemocha');
};
