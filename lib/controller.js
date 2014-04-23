// Module dependencies.
var util = require('util'),
    dsutilities = require('./utilities'),
    Emitter = require('events').EventEmitter,
    Gyro = require('./gyro'),
    Analogs = require('./analogs'),
    Buttons = require('./buttons'),
    Status = require('./status'),
    HID = require('node-hid'),
    LinuxConnector = require('./linuxConnector'),
    config = require('./config');

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
var Controller = function() {
    'use strict';
    Emitter.call(this);

    var device = null,
        devices = null,
        //get the options and controller configuration.
        controllerConfig = config.getControllerConfig(),
        options = config.getOptions(),
        analogs = new Analogs(this),
        buttons = new Buttons(this),
        gyro = new Gyro(this),
        status = new Status(this);

    [{
        type: 'analogSticks',
        properties: [{
            name: 'x',
            initialValue: 0
        }, {
            name: 'y',
            initialValue: 0
        }]
    }, {
        type: 'buttons',
        properties: [{
            name: 'state',
            initialValue: 0
        }, {
            name: 'value',
            initialValue: 0
        }]
    }, {
        type: 'motionInputs',
        properties: [{
            name: 'value',
            initialValue: 0
        }, {
            name: 'direction',
            initialValue: 0
        }]
    }, {
        type: 'status',
        properties: [{
            name: 'state',
            initialValue: ''
        }]
    }].forEach(function(setup) {
            var entities = controllerConfig[setup.type];
            var properties = setup.properties;

            if (entities.length) {
                entities.forEach(function(entity) {
                    this[entity.name] = properties.reduce(function(accum, property) {
                        return (accum[property.name] = property.initialValue, accum);
                    }, {});
                }, this);
            }
        }, this);

    //Private methods
    //emit an error event or log it to the console.
    var handleException = function(ex) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        } else {
            dsutilities.warn(ex);
            throw (ex);
        }
    };

    //process data from HID connected device.
    var processFrame = function(data) {
        if (controllerConfig.motionInputs) {
            gyro.process(data);
        }
        if (controllerConfig.analogSticks) {
            analogs.process(data);
        }
        if (controllerConfig.buttons) {
            buttons.process(data);
        }
        if (controllerConfig.status) {
            status.process(data);
        }
    };

    var isController = function(device) {
        return device.vendorId == controllerConfig.vendorId && device.productId == controllerConfig.productId;
    };

    var isValidPath = function(device) {
        var path = device.path.toLowerCase();
        return path.match('bluetooth') || path.match('usb');
    };

    // Public methods
    //initiate the HID connection with the device, use the vendorId and product Id to identify the controller
    this.connect = function() {
        dsutilities.warn('connect method is deprecated, controller now connects upon declaration.'.yellow);
    };

    this.disconnect = function() {
        if (device) {
            device.close();
        }
        this.emit('disconnecting');
        dsutilities.warn('node dualshock disconnecting'.yellow);
    };

    //connect to the controller.
    try {

        //the user has specified that we need to force hid
        if (options.forceNodeHid) {
            device = new HID.HID(controllerConfig.vendorId, controllerConfig.productId);
        } else {
            if (typeof options.device === 'undefined') {
                dsutilities.warn('node dualshock connecting'.yellow);

                devices = HID.devices()
                    .filter(isController)
                    .filter(isValidPath);

                //no suitable node-hid device found, lets try linux native.
                if (!devices.length) {
                    dsutilities.warn('no siutable node-hid device found, lets try linux native'.yellow);
                    device = new LinuxConnector();
                } else {
                    device = new HID.HID(devices[0].path);
                }
            } else {
                // Allow user-specified device
                device = options.device;

            }
        }
        //once the device is connected we can subscribe to the node-hid data event.
        device.on('data', processFrame.bind(this));

    } catch (ex) {
        handleException(ex);
    }

    //subscribe to the exit event:
    process.on('exit', this.disconnect.bind(this));
};

//need to inherit from event emiter.
util.inherits(Controller, Emitter);

module.exports = Controller;
