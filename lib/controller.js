// Module dependencies.

var util = require('util'),
    events = require('events'),
    HID = require('node-hid'),
    colors = require('colors'),
    Gyro = require('./gyro'),
    Analogs = require('./analogs'),
    Buttons = require('./buttons'),
    Status = require('./status');

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
var Controller = function (controllerConfig, options) {
    'use strict';

    var hidDevice = null,
        analogs = new Analogs(this, controllerConfig.analogSticks, options.analogStickSmoothing),
        buttons = new Buttons(this, controllerConfig.buttons),
        gyro = new Gyro(this, controllerConfig.motionInputs, options.accelerometerSmoothing),
        status = new Status(this, controllerConfig.status);

    //Private methods
    //emit an error event or log it to the console.
    var handleException = function (ex) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        } else {
            console.log(ex);
        }
    };

    //process data from HID connected device.
    var processFrame = function (data) {
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

    // Public methods
    //initiate the HID connection with the device, use the vendorId and product Id to identify the controller
    this.connect = function () {
        try {
            console.log('node dualshock connecting'.yellow);

            //connect to the device.
            hidDevice = new HID.HID(controllerConfig.vendorId, controllerConfig.productId);

            //once the device is connected we can subscribe to the node-hid data event.
            hidDevice.on('data', processFrame.bind(this));
        } catch (ex) {
            handleException(ex);
        }

        //subscribe to the exit event:
        process.on('exit', this.disconnect.bind(this));
    };

    this.disconnect = function () {
        if (hidDevice) {
            hidDevice.close();
        }
        this.emit('disconnecting');
        console.log('node dualshock disconnecting'.yellow);
    };
};

//need to inherit from event emiter.
util.inherits(Controller, events.EventEmitter);
module.exports = Controller;
