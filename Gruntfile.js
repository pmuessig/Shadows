module.exports = function ( grunt ) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var taskConfig = {
        
        
        jshint:{
            gruntfile: [
                'Gruntfile.js'
            ],
            files:['js/*.js'],
        },

        less: {
            options: {
                paths: ["css/"]
            },
            // target name
            development: {
                // no need for files, the config below should work
                expand: true,
                cwd:    "css",
                src:    ["*.less"],
                dest:  'css/',
                ext:    ".css"
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [ 'jshint:gruntfile' ],
                options: {
                    livereload: true
                }
            },
            less: {
                files: [ 'css/*.less' ],
                tasks: [ 'less' ]
            },
            html: {
                files: [ 'index.html'],
            },
            js:{
                files:['js/*.js'],
                tasks: [ 'jshint:files' ],
            }
          },
    };

    grunt.initConfig(taskConfig);

    grunt.registerTask( 'default', [
        'less'
    ]);

};