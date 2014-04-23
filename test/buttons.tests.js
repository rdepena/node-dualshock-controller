// Module dependencies.
var Buttons = require('../lib/buttons'),
    assert = require('assert'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    config = require('../lib/config');

describe('the Buttons component', function() {
    'use strict';

    var mockConfig = [{
        "name": "buttonName",
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
        spy,
        spyLowerCaseEvents;

    beforeEach(function() {
        emitter = new EventEmitter();
        config.setControllerConfig({
            buttons: mockConfig
        });
        buttons = new Buttons(emitter);
        spy = new sinon.spy();
        spyLowerCaseEvents = new sinon.spy();

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
        it('should envoke the buttonName:press', function() {
            emitter.on('buttonName:press', spy);
            emitter.on('buttonname:press', spyLowerCaseEvents);
            buttons.process(dataA);

            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });
        it('should not envoke the buttonName:press', function() {
            emitter.on('buttonName:release', spy);
            emitter.on('buttonname:release', spyLowerCaseEvents);
            buttons.process(dataB);

            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

    describe('release events', function() {
        it('should envoke the buttonName:release', function() {
            emitter.on('buttonName:release', spy);
            emitter.on('buttonname:release', spyLowerCaseEvents);
            buttons.process(dataA);
            buttons.process(dataB);

            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });
        it('should not envoke the buttonName:release', function() {
            emitter.on('buttonName:release', spy);
            emitter.on('buttonname:release', spyLowerCaseEvents);
            buttons.process(dataA);

            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

    describe('button hold', function() {
        it('should raise the hold event', function() {
            emitter.on('buttonName:hold', spy);
            emitter.on('buttonname:hold', spyLowerCaseEvents);
            buttons.process(dataA);
            buttons.process(dataA);
            assert.equal(spy.args[0][0], 'buttonName');
            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });

        it('should not raise the hold event', function() {
            emitter.on('buttonName:hold', spy);
            emitter.on('buttonname:hold', spyLowerCaseEvents);
            buttons.process(dataB);
            buttons.process(dataB);
            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

    describe('button analog', function() {
        it('should raise the analog event', function() {
            emitter.on('buttonName:analog', spy);
            emitter.on('buttonname:analog', spyLowerCaseEvents);
            buttons.process(dataA);

            assert.equal(spy.args[0][0], dataA[1]);
            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });

        it('should not raise the analog event', function() {
            emitter.on('buttonName:analog', spy);
            emitter.on('buttonname:analog', spyLowerCaseEvents);
            buttons.process(dataB);

            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

    describe('ps4 dpad up button', function() {
        it('should emit the dpadUp:press event', function() {
            emitter.on('dpadUp:press', spy);
            emitter.on('dpadup:press', spyLowerCaseEvents);
            buttons.process([0, 0, 0, 0, 0, 0]);

            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });

        it('should not emit the dpadDown:press event', function() {
            emitter.on('dpadDown:press', spy);
            emitter.on('dpaddown:press', spyLowerCaseEvents);
            buttons.process([0, 0, 0, 0, 0, 0]);

            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

    describe('ps4 dpad down button', function() {
        it('should emit the dpadDown:press event', function() {
            emitter.on('dpadDown:press', spy);
            emitter.on('dpaddown:press', spyLowerCaseEvents);
            buttons.process([0, 0, 0, 0, 0, parseInt("00001001", 2)]);

            assert.equal(spy.called, true);
            assert.equal(spyLowerCaseEvents.called, true);
        });

        it('should not emit the dpadUp:press event', function() {
            emitter.on('dpadUp:press', spy);
            emitter.on('dpadup:press', spyLowerCaseEvents);
            buttons.process([0, 0, 0, 0, 0, parseInt("00001001", 2)]);

            assert.equal(spy.called, false);
            assert.equal(spyLowerCaseEvents.called, false);
        });
    });

});
