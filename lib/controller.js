// Module dependencies.

var util = require('util'),
    events = require('events'),
    colors = require('colors'),
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
    var device = null,
        //get the options and controller configuration.
        controllerConfig = config.getControllerConfig(),
        options = config.getOptions(),
        analogs = new Analogs(this),
        buttons = new Buttons(this),
        gyro = new Gyro(this),
        status = new Status(this);


    //Private methods
    //emit an error event or log it to the console.
    var handleException = function(ex) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        } else {
            console.log(ex);
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
        console.log('connect method is deprecated, controller now connects upon declaration.'.yellow);
    };

    this.disconnect = function() {
        if (device) {
            device.close();
        }
        this.emit('disconnecting');
        console.log('node dualshock disconnecting'.yellow);
    };

    //connect to the controller.
    try {
        console.log('node dualshock connecting'.yellow);

        var devices = HID.devices()
            .filter(isController)
            .filter(isValidPath),
            hidDevice = devices[0];

        //no siutable node-hid device found, lets try linux native.
        if (!hidDevice) {
            console.log('no siutable node-hid device found, lets try linux native'.yellow);
            device = new LinuxConnector(controllerConfig);
        } else {
            device = new HID.HID(hidDevice.path);
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
util.inherits(Controller, events.EventEmitter);
module.exports = Controller;
