// Module dependencies.
var Analogs = require('../src/analogs'),
    assert = require('assert'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    config = require('../src/config');

describe('the Analogs component', function() {
    'use strict';

    var mockConfig = [{
            "name": "analog",
            "x": 0,
            "y": 1
        }],
        instance = [{
            name: 'process'
        }],
        dataA = [50, 65],
        dataB = [0, 0],
        analogs,
        emitter,
        spy;

    beforeEach(function() {
        emitter = new EventEmitter();
        config.setOptions({
            analogStickSmoothing: false
        });
        config.setControllerConfig({
            analogSticks: mockConfig
        });
        analogs = new Analogs(emitter);
        spy = new sinon.spy();
    });

    describe('object instance', function() {
        it('should have the following shape', function() {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof analogs[method.name], 'function');
            });
        });
    });

    describe('move events', function() {
        it('should invoke the move event', function() {
            emitter.on('analog:move', spy);
            analogs.process(dataA);

            assert.equal(spy.called, true);
        });
        it('should not invoke the move event', function() {
            emitter.on('analog:move', spy);
            analogs.process(dataB);

            assert.equal(spy.called, false);
        });
        it('should invoke the move event with zero', function() {
            analogs.process(dataA);
            emitter.on('analog:move', spy);
            analogs.process(dataB);

            assert.equal(spy.called, true);
        });
    });

    describe('return values', function() {
        it('should return the analog values', function() {
            emitter.on('analog:move', spy);
            analogs.process(dataA);
            var expectedValue = {
                    x: 50,
                    y: 65
                },
                spyArgument = spy.args[0][0];

            assert.equal(expectedValue.x, spyArgument.x);
            assert.equal(expectedValue.y, spyArgument.y);
            assert.equal(spy.called, true);
        });
    });

});
