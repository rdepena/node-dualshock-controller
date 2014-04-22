// Module dependencies.
var Gyro = require('../lib/gyro'),
    assert = require('assert'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    config = require('../lib/config');

describe('the Gyro component', function() {
    'use strict';

    var mockConfig = [{
        name: "dirrection",
        directionPin: 0,
        valuePin: 1
    }],
        instance = [{
            name: 'process'
        }],
        dataA = [1, 130],
        dataB = [2, 130],
        emitter,
        spy,
        gyro;

    beforeEach(function() {
        emitter = new EventEmitter();
        spy = sinon.spy();
        config.setOptions({
            accelerometerSmoothing: false
        });
        config.setControllerConfig({
            motionInputs: mockConfig
        });
        gyro = new Gyro(emitter);
    });

    describe('object instance', function() {

        it('should have the following shape', function() {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof gyro[method.name], 'function');
            });
        });
    });

    describe('process()', function() {

        it('should envoke the dirrection:motion event with positive values', function() {
            emitter.on('dirrection:motion', spy);
            gyro.process(dataA);
            assert.equal(spy.called, true);
            var expectedValue = {
                direction: 1,
                value: 125
            },
                spyArgument = spy.args[0][0];

            assert.equal(spyArgument.direction, expectedValue.direction);
            assert.equal(spyArgument.value, expectedValue.value);
        });

        it('should envoke the dirrection event with negative values.', function() {
            emitter.on('dirrection:motion', spy);
            gyro.process(dataB);
            assert.equal(spy.called, true);
            var expectedValue = {
                direction: 2,
                value: -130
            },
                spyArgument = spy.args[0][0];

            assert.equal(spyArgument.direction, expectedValue.direction);
            assert.equal(spyArgument.value, expectedValue.value);
        });
    });

});
