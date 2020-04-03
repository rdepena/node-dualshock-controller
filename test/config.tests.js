'use strict';

var assert = require('assert'),
    Config = require('../src/config');

describe('The Config component', function() {
    var mockOptions = {
            config: 'dualShock3',
            accelerometerSmoothing: true,
            logging: false
        },
        defaultOptions = [{
            name: 'config'
        }, {
            name: 'accelerometerSmoothing'
        }, {
            name: 'analogStickSmoothing'
        }];

    describe('object instance', function() {
        var config = new Config(mockOptions);

        describe('config property', function () {
            it('should be present', function () {
                assert(config.hasOwnProperty('options'), 'missing a "options" property');
            });

            it('should be an object', function () {
                assert.equal(typeof config.options, 'object');
            });

            it('should include all given properties', function () {
                for (var option in mockOptions) {
                    assert.equal(config.options[option], mockOptions[option]);
                }
            });
        });

        describe('controller property', function () {
            it('should be present', function () {
                assert(config.hasOwnProperty('controller'), 'missing a "controller" property');
            });

            it('should be an object', function () {
                assert.equal(typeof config.controller, 'object');
            });

            it('should reflect a resolved controller config', function () {
                assert(config.controller.hasOwnProperty('vendorId'));
                assert(config.controller.hasOwnProperty('productId'));
            });
        });
    });

    describe('default values', function() {
        it('should apply default values', function() {
            var config = new Config();
            defaultOptions.forEach(function(property) {
                assert.notEqual(config.options[property.name], void 0);
            });
        });
        it('should load default config', function() {
            var config = new Config();
            assert.notEqual(config.controller, null);
            assert.notEqual(config.controller, void 0);
        });
    });
});
