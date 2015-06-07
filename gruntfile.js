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
    },

    'gh-pages': {
      options: {
        branch: 'gh-pages',
        base: 'docs'
      },
      deploy: {
        options: {
          user: {
            name: 'gh-pages',
            email: 'etn@etnbrd.com'
          },
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/etnbrd/flx-lib.git',
          message: 'publish gh-pages (auto)' + getDeployMessage(),
          silent: true
        },
        src: ['**/*']
      }
    }

  });

  function getDeployMessage() {
    var ret = '\n\n';
    if (process.env.TRAVIS !== 'true') {
      ret += 'missing env vars for travis-ci';
      return ret;
    }
    ret += 'branch: ' + process.env.TRAVIS_BRANCH + '\n';
    ret += 'SHA: ' + process.env.TRAVIS_COMMIT + '\n';
    ret += 'range SHA: ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
    ret += 'build id: ' + process.env.TRAVIS_BUILD_ID + '\n';
    ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
    return ret;
  }

  function deploy(){
    // if (process.env.TRAVIS === 'true' && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false') {
      grunt.log.writeln('executing deployment');
      grunt.task.run('gh-pages:deploy');
    // } else {
      // grunt.log.writeln('skipped deployment');
    // }
  }

  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-doxx');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['simplemocha', 'docco']);

  grunt.registerTask('deploy', deploy);
  grunt.registerTask('publish', ['docco', 'deploy']);
};