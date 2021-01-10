// Module dependencies.
var Smoothing = require('../src/smoothing'),
    assert = require('assert');

describe('the smoothing component', function() {
    'use strict';

    var smoothing,
        nonSmoothing,
        //an instance should have the following functions.
        instance = [{
            name: 'readLastPosition'
        }, {
            name: 'addToBuffer'
        }, {
            name: 'smooth'
        }];

    beforeEach(function() {
        smoothing = new Smoothing(true);
        nonSmoothing = new Smoothing(false);
        for (var i = 0; i < 5; i++) {
            nonSmoothing.addToBuffer('testNonSmoothing', i);
            smoothing.addToBuffer('one', i);
            smoothing.addToBuffer('two', i + 1);
            smoothing.addToBuffer('testSmoothing', i);
        }
    });

    describe('object instance', function() {
        it('should have the following shape', function() {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof smoothing[method.name], 'function');
            });
        });
    });

    describe('addToBuffer()', function() {
        it('should add values to the buffer', function() {
            smoothing.addToBuffer('one', 6);
            smoothing.addToBuffer('two', 7);

            assert.equal(smoothing.readLastPosition('one'), 6);
            assert.equal(smoothing.readLastPosition('two'), 7);
        });
    });

    describe('readLastPosition()', function() {
        it('should handle buffers for different objects', function() {
            assert.equal(smoothing.readLastPosition('one'), 4);
            assert.equal(smoothing.readLastPosition('two'), 5);
        });
    });

    describe('smooth()', function() {
        it('should return expected values when smoothing', function() {
            //with the data set smoothing of 6 should be 3.
            assert.equal(smoothing.smooth('testSmoothing', 6), 3);
            //with the data set smoothing of 8 should be 4.
            assert.equal(smoothing.smooth('testSmoothing', 8), 4);
        });

        it('should return expected values when not smoothing', function() {
            //with smoothing turned off 9 should return 9
            assert.equal(nonSmoothing.smooth('testNonSmoothing', 9), 9);
            //with smoothing turned off 6 should return 6
            assert.equal(nonSmoothing.smooth('testNonSmoothing', 6), 6);
        });
    });
});
