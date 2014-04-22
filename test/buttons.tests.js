// Module dependencies.
var Buttons = require('../lib/buttons'),
    assert = require('assert'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter;

describe('the Buttons component', function() {
    'use strict';

    var mockConfig = [{
        "name": "button",
        "buttonBlock": 0,
        "buttonValue": "0x08",
        "analogPin": 1
    }, {
        "name": "dpadUp",
        "buttonBlock": 5,
        "buttonValue": "0x00",
        "mask": "0xF"
    }, {
        "name": "dpadDown",
        "buttonBlock": 5,
        "buttonValue": "0x01",
        "mask": "0xF"
    }],
        instance = [{
            name: 'process'
        }],
        dataA = [8, 170],
        dataB = [0, 0],
        buttons,
        emitter,
        spy;

    beforeEach(function() {
        emitter = new EventEmitter();
        buttons = new Buttons(emitter, mockConfig);
        spy = new sinon.spy();
    });

    describe('object instance', function() {
        it('should have the following shape', function() {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof buttons[method.name], 'function');
            });
        });
    });

    describe('press events', function() {
        it('should envoke the button:press', function() {
            emitter.on('button:press', spy);
            buttons.process(dataA);

            assert.equal(spy.called, true);
        });
        it('should not envoke the button:press', function() {
            emitter.on('button:release', spy);
            buttons.process(dataB);

            assert.equal(spy.called, false);
        });
    });

    describe('release events', function() {
        it('should envoke the button:release', function() {
            emitter.on('button:release', spy);
            buttons.process(dataA);
            buttons.process(dataB);

            assert.equal(spy.called, true);
        });
        it('should not envoke the button:release', function() {
            emitter.on('button:release', spy);
            buttons.process(dataA);

            assert.equal(spy.called, false);
        });
    });

    describe('button analog', function() {
        it('should raise the analog event', function() {
            emitter.on('button:analog', spy);
            buttons.process(dataA);

            assert.equal(spy.args[0][0], dataA[1]);
            assert.equal(spy.called, true);
        });

        it('should not raise the analog event', function() {
            emitter.on('button:analog', spy);
            buttons.process(dataB);

            assert.equal(spy.called, false);
        });
    });

    describe('ps4 dpad up button', function() {
        it('should emit the dpadUp:press event', function() {
            emitter.on('dpadUp:press', spy);
            buttons.process([0, 0, 0, 0, 0, 0]);

            assert.equal(spy.called, true);
        });

        it('should not emit the dpadDown:press event', function() {
            emitter.on('dpadDown:press', spy);
            buttons.process([0, 0, 0, 0, 0, 0]);

            assert.equal(spy.called, false);
        });
    });

    describe('ps4 dpad down button', function() {
        it('should emit the dpadDown:press event', function() {
            emitter.on('dpadDown:press', spy);
            buttons.process([0, 0, 0, 0, 0, parseInt("00001001", 2)]);

            assert.equal(spy.called, true);
        });

        it('should not emit the dpadUp:press event', function() {
            emitter.on('dpadUp:press', spy);
            buttons.process([0, 0, 0, 0, 0, parseInt("00001001", 2)]);

            assert.equal(spy.called, false);
        });
    });

});
