var files = ['gruntfile.js',
    'lib/*.js',
    'lib/inputProcessors/*.js',
    'test/*.js',
    'examples/*.js'
];
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: files,
            tasks: ['default']
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
        },
        jsbeautifier: {
            files: files,
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['jshint', 'mochaTest', 'jsbeautifier']);
};
