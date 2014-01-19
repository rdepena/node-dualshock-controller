/**
 * Module dependencies.
 */
var util = require('util');
var events = require('events');
var HID = require('node-hid');
var colors = require('colors');
var motionProcessor = require('./inputProcessors/motionProcessor');
var analogProcessor = require('./inputProcessors/analogProcessor');
var buttonProcessor = require('./inputProcessors/buttonProcessor');

/**
 * generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
 */
var controller = function () {
    var controllerConfiguration = null;
    var hidDevice = null;
    //for some reason HID will sometimes not read.
    var deviceReadOk = false;

    /**
    * Private methods
    */
    //emit an error event or log it to the console.
    var handleException = function (ex) {
        //if exception was generated within our stream
        if (this.emit) {
            this.emit('error', ex);
        } else {
            console.log(ex);
        }
    };

    //process data from HID connected device.
    var processFrame = function (error, data) {
        //check for errors from node-hid.
        if(error) {
            //throw the error, will be handled and retry will be done.
            throw(error);
        }
        //we have read.
        deviceReadOk = true;

        if(controllerConfiguration.motionInputs) {
            motionProcessor.processMotionEvents(data);
        }
        if (controllerConfiguration.analogSticks) {
            analogProcessor.processAnalogStickEvents(data);
        }
        if(controllerConfiguration.buttons) {
            buttonProcessor.processButtonEvents(data);
        }

        //read from the hid device.
        this.deviceRead();

    };

    /**
    * Public methods
    */
    //init the controller, setting configuration values and default states.
    this.init = function (controllerConfig) {

        //init the private members;
        controllerConfiguration = controllerConfig;

        if (controllerConfiguration.motionInputs) {
            motionProcessor.init(this, controllerConfiguration.motionInputs );
        }

        if (controllerConfiguration.analogSticks) {
            analogProcessor.init(this, controllerConfiguration.analogSticks);
        }

        if(controllerConfiguration.buttons) {
            buttonProcessor.init(this, controllerConfiguration.buttons);
        }

    };

    //initiate the HID connection with the device, use the vendorId and product Id to identify the controller
    this.connect = function () {

        //connect to the device.
        try {
            hidDevice = new HID.HID(controllerConfiguration.vendorId, controllerConfiguration.productId);
            console.log('node dualshock connecting'.yellow);
        } catch (ex) {
            handleException(ex);
        }
        //start the read loop
        this.deviceRead();

        //this is a hack because we do not have a connected confirmation from HID.
        setTimeout(this.checkIfreceiving.bind(this), 500);
    };

    this.disconnect = function () {
        if (hidDevice) {
            hidDevice.close();
        }
        this.emit('disconnecting');
        console.log('node dualshock disconnecting'.yellow);
    };

    this.checkIfreceiving = function () {
        if (!deviceReadOk) {
            this.emit("error", "the device failed to read, retrying");
            this.connect();
        } else {
            this.emit('connected');
            console.log('node dualshock connected'.yellow);
        }
    };

    this.deviceRead = function () {
        //call device read and process the data.
        try {
            if(hidDevice) {
                hidDevice.read(processFrame.bind(this));
            } else {
                this.emit("error", "Could not connect to the device");
            }
        } catch (ex) {
            handleException(ex);
            //retry
            this.deviceRead();
        }

    };

    //subscribe to the exit event:
    process.on('exit', this.disconnect.bind(this));

    return this;

};

//need to inherit from event emiter.
util.inherits(controller, events.EventEmitter);
module.exports = new controller();
