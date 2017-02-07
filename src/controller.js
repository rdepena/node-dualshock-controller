// Module dependencies.
const util = require('util'),
    dsutilities = require('./utilities'),
    Emitter = require('events').EventEmitter,
    Gyro = require('./gyro'),
    Analogs = require('./analogs'),
    Buttons = require('./buttons'),
    Status = require('./status'),
    HID = require('node-hid'),
    config = require('./config'),
    TouchPad = require('./touchpad');

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
const Controller = function() {
    'use strict';
    Emitter.call(this);

    const controllerConfig = config.getControllerConfig(),
        options = config.getOptions(),
        indexes = controllerConfig.output.indexes,
        analogs = new Analogs(this),
        buttons = new Buttons(this),
        gyro = new Gyro(this),
        status = new Status(this),
        touchPad = new TouchPad(this);

    let device = null;

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
        const entities = controllerConfig[setup.type],
            properties = setup.properties;

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
    const handleException = function(ex) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        } else {
            dsutilities.warn(ex);
            throw (ex);
        }
    };

    //process data from HID connected device.
    const processFrame = function(data) {
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
        if (controllerConfig.touchPad) {
            touchPad.process(data);
        }
    };

    const isController = function(device) {
        return device.vendorId == controllerConfig.vendorId && device.productId == controllerConfig.productId;
    };

    // Public methods
    this.connect = function() {
        dsutilities.warn('connect method is deprecated, controller now connects upon declaration.');
    };

    this.disconnect = function() {
        if (device && device.close) {
            device.close();
        }
        this.emit('disconnecting');
        dsutilities.warn('node dualshock disconnecting');
    };

    // Used to set controller rumble and light
    this.setExtras = function(data) {

        let buff = controllerConfig.output.defaultBuffer.slice();

        Object.keys(data).forEach(k => {
            buff[indexes[k]] = data[k];
        });
        device.write(buff);
    };

    //connect to the controller.
    if (typeof options.device === 'undefined') {
        dsutilities.warn('node dualshock connecting');

        const deviceMeta = HID.devices()
            .filter(isController)[0];
        if (deviceMeta) {
            device = new HID.HID(deviceMeta.path);
        } else {
            handleException(new Error(`device with VID:${controllerConfig.vendorId} PID:${controllerConfig.productId} not found`));
        }

    } else {
        // Allow user-specified device
        device = options.device;
    }

    device.on('data', processFrame.bind(this));
    device.on('error', handleException.bind(this));

    //subscribe to the exit event:
    process.on('exit', this.disconnect.bind(this));
};

//need to inherit from event emiter.
util.inherits(Controller, Emitter);

module.exports = Controller;
