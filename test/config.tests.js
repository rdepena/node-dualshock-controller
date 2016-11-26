'use strict';

var assert = require('assert');

describe('The Config component', function() {
    var mockConfig = {
            vendorId: 1556,
            productId: 616
        },
        mockOptions = {
            config: 'dualShock3',
            accelerometerSmoothing: true,
            logging: false
        },
        instance = [{
            name: 'setOptions'
        }, {
            name: 'getOptions'
        }, {
            name: 'setControllerConfig'
        }, {
            name: 'getControllerConfig'
        }],
        defaultOptionsInstance = [{
            name: 'config'
        }, {
            name: 'accelerometerSmoothing'
        }, {
            name: 'analogStickSmoothing'
        }],
        configA,
        configB;

    beforeEach(function() {
        configA = require('../src/config');
        configB = require('../src/config');
    });


    describe('object instance', function() {
        it('should have the following shape', function() {
            instance.forEach(function(method) {
                assert.equal(typeof configA[method.name], 'function');
            });
        });
    });

    describe('option methods', function() {
        it('should be able to save options', function() {
            configA.setOptions(mockOptions);
            assert.equal(configA.getOptions(), mockOptions);
        });

        it('should provide a single object accross instances', function() {
            configA.setOptions(mockOptions);
            assert.equal(configA.getOptions(), configB.getOptions());
        });
    });

    describe('controllerConfig methods', function() {
        it('should be able to save controllerConfig settings', function() {
            configA.setControllerConfig(mockConfig);
            //change the object
            mockConfig.vendorId = 22;
            assert.equal(configA.getControllerConfig(), mockConfig);
        });

        it('should provide a single object accross instances', function() {
            configA.setControllerConfig(mockConfig);
            assert.equal(configA.getControllerConfig(), configB.getControllerConfig());
        });
    });

    describe('default values', function() {
        beforeEach(function() {
            configA.setOptions();
        });
        it('should apply default values', function() {
            var ops = configA.getOptions();
            defaultOptionsInstance.forEach(function(property) {
                assert.notEqual(ops[property.name], void 0);
            });
        });
        it('should load default config', function() {
            var controllerConfig = configA.getControllerConfig();
            assert.notEqual(controllerConfig, null);
            assert.notEqual(controllerConfig, void 0);
        });
    });
});
