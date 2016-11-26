var assert = require('assert'),
    Emitter = require('events').EventEmitter,
    config = require('../src/config'),
    mockery = require('mockery');

function Device() {
    Emitter.call(this);
}

Device.prototype = Object.create(Emitter.prototype, {
    constructor: {
        value: Device
    },
    close: {
        value: function() {}
    }
});

var config = {
    analogSticks: [{
        name: 'foo',
        x: 0,
        y: 1
    }],
    buttons: [{
        name: 'bar',
        buttonBlock: 0,
        buttonValue: 0x08,
        analogPin: 1
    }],
    motionInputs: [{
        name: 'baz',
        directionPin: 0,
        valuePin: 1
    }],
    status: [{
        name: 'quz',
        pin: 5,
        states: [{
            value: 0,
            state: 'Charging'
        }, {
            value: 2,
            state: 'Charging'
        }, {
            value: 3,
            state: '40%'
        }]
    }]
};

var analogs = config.analogSticks;
var buttons = config.buttons;
var motions = config.motionInputs;
var status = config.status;

describe('the DualShock component', function() {
    //enable mockery and mock node-hid:
    mockery.enable();
    var nodeHidMock = {
        HID: function(vendor, productId) {
            return {
                on: function() {
                    //could use this at some point. nothing atm.
                }
            };
        }
    };
    //register mock node-hid.
    mockery.registerMock('node-hid', nodeHidMock);

    //once mockery is up we can require the dualshock module.
    var DualShock = require('./../src/dualshock.js'),
        controller, device;

    before(function() {
        device = new Device();
        controller = DualShock({
            config: config,
            device: device
        });
    });

    //disable mockery so it does not interfere with other tests.
    after(function() {
        mockery.deregisterMock('node-hid');
        mockery.disable();
    });

    beforeEach(function() {
        controller.removeAllListeners(Object.keys(controller._events));
    });

    describe('analog properties', function() {
        analogs.forEach(function(analog) {
            it(analog.name, function() {
                assert.equal(controller[analog.name].x, 0);
                assert.equal(controller[analog.name].y, 0);

                device.emit('data', [100, 100]);

                assert.equal(controller[analog.name].x, 100);
                assert.equal(controller[analog.name].y, 100);
            });
        });
    });

    describe('button properties', function() {
        buttons.forEach(function(button) {
            it(button.name, function() {
                assert.equal(controller[button.name].value, 0);
                assert.equal(controller[button.name].state, 0);

                device.emit('data', [8, 170]);

                assert.equal(controller[button.name].value, 1);
                assert.equal(controller[button.name].state, 1);

                device.emit('data', [8, 170]);

                assert.equal(controller[button.name].value, 1);
                assert.equal(controller[button.name].state, 2);

                device.emit('data', [0, 0]);

                assert.equal(controller[button.name].value, 0);
                assert.equal(controller[button.name].state, 0);
            });
        });
    });

    describe('motion properties', function() {
        motions.forEach(function(motion) {
            it(motion.name, function() {
                assert.equal(controller[motion.name].value, 0);
                assert.equal(controller[motion.name].direction, 0);

                device.emit('data', [1, 233]);

                assert.equal(controller[motion.name].value, 22);
                assert.equal(controller[motion.name].direction, 1);
            });
        });
    });

    describe('status properties', function() {
        status.forEach(function(stat) {
            it(stat.name, function() {
                device.emit('data', [0, 0, 0, 0, 1, 3]);
                assert.equal(controller[stat.name].state, '40%');

                device.emit('data', [0, 0, 0, 0, 1, 2]);
                assert.equal(controller[stat.name].state, 'Charging');
            });
        });
    });
});
