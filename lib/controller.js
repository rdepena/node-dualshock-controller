// Module dependencies.

var util = require('util'),
    events = require('events'),
    HID = require('node-hid'),
    colors = require('colors'),
    motion = require('./inputprocessors/motionProcessor'),
    analog = require('./inputprocessors/analogProcessor'),
    button = require('./inputprocessors/buttonProcessor');

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
var controller = function (controllerConfig, options) {
    'use strict';

    var that = this,
        hidDevice = null,
        analogProcessor = new analog(that, controllerConfig.analogSticks, options.analogStickSmoothing),
        buttonProcessor = new button(that, controllerConfig.buttons),
        motionProcessor = new motion(that, controllerConfig.motionInputs, options.accelerometerSmoothing);

    //Private methods
    //emit an error event or log it to the console.
    var handleException = function (ex) {
        //if exception was generated within our stream
        if (that.emit) {
            that.emit('error', ex);
        } else {
            console.log(ex);
        }
    };

    //process data from HID connected device.
    var processFrame = function (data) {
        if(controllerConfig.motionInputs) {
            motionProcessor.processMotionEvents(data);
        }
        if (controllerConfig.analogSticks) {
            analogProcessor.processAnalogStickEvents(data);
        }
        if(controllerConfig.buttons) {
            buttonProcessor.processButtonEvents(data);
        }
    };

    // Public methods
    //initiate the HID connection with the device, use the vendorId and product Id to identify the controller
    that.connect = function () {

        //connect to the device.
        try {
            hidDevice = new HID.HID(controllerConfig.vendorId, controllerConfig.productId);
            console.log('node dualshock connecting'.yellow);
        } catch (ex) {
            handleException(ex);
        }

        hidDevice.on('data', processFrame.bind(that));

        //subscribe to the exit event:
        process.on('exit', that.disconnect.bind(that));
    };

    that.disconnect = function () {
        if (hidDevice) {
            hidDevice.close();
        }
        that.emit('disconnecting');
        console.log('node dualshock disconnecting'.yellow);
    };

    return that;

};

//need to inherit from event emiter.
util.inherits(controller, events.EventEmitter);
module.exports = controller;
