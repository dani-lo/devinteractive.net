module.exports = function(grunt) {

  "use strict";
  //
  grunt.initConfig({
    express: {
        all: {
            options: {
                port: 5000,
                hostname: "0.0.0.0",
                livereload: true
            }
        }
    },
    karma: {
        unit: {
            configFile: 'karma.conf.js'
        }
    },
    es6transpiler: {
        dist: {
            files: {
                'app.es6.js': 'app.js'
            }
        }
    },
    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: ['src/scripts/main.js', 'src/scripts/**/*.js'],
        dest: 'public/dist/js/devinteractive.js'
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      beforeconcat: ['src/scripts/**/*.js']//,
      //afterconcat: ['dist/output.js']
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/dist/js/devinteractive.min.js'
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "public/dist/css/main.css": "src/styles/main.less"
        }
      }
    },
    watch: {
      files: ['src/styles/modules/*.less', 'src/styles/*.less', 'src/scripts/**/*.js'], // which files to watch
      tasks: ['buildcss', 'buildjs'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-es6-transpiler');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('buildjs', ['jshint','concat', 'uglify']);
  grunt.registerTask('buildcss', ['less']);
  grunt.registerTask('buildserver', ['es6transpiler']);
  grunt.registerTask('wrun', ['watch']);
  grunt.registerTask('deploy', ['uglify', 'less']);

};