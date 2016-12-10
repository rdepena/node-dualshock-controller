var files = ['gruntfile.js',
    'src/*.js',
    'src/inputProcessors/*.js',
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
            files: files,
            options: {
                reporterOutput: "",
                node: true,
                globals: {
                    describe: true,
                    it: true,
                    beforeEach: true
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
