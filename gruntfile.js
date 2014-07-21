module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    simplemocha: {
      options: {
        globals: [],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
      },

      all: { src: ['test'] }
    },

    docco: {
      debug: {
        src: ['lib/index.js'],
        options: {
          output: 'docs',
          layout: 'parallel'
        }
      }
    },

    doxx: {
      all: {
        src: 'lib/index.js',
        target: 'docs/api',
        options: {
          title: 'flx'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-doxx');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', ['simplemocha', 'docco']);
};