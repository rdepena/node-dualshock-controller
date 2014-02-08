var files = ['gruntfile.js',
                'lib/*.js',
                'lib/inputProcessors/*.js',
                'test/*.js',
                'examples/*.js'];
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: files,
            tasks: ['jshint', 'mochaTest']
        },
        jshint: {
            // define the files to lint
            files: files,
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
