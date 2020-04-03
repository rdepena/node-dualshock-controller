// Module dependencies.
const util = require('util'),
    Config = require('./config'),
    Logger = require('./logger'),
    Emitter = require('events').EventEmitter,
    Gyro = require('./gyro'),
    Analogs = require('./analogs'),
    Buttons = require('./buttons'),
    Status = require('./status'),
    HID = require('node-hid'),
    TouchPad = require('./touchpad');

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
const Controller = function(opts) {
    'use strict';
    Emitter.call(this);

    this.config = new Config(opts);

    const config = this.config,
        logger = new Logger(config),
        indexes = config.controller.output.indexes,
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
        const entities = config.controller[setup.type],
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
            logger.warn(ex);
            throw (ex);
        }
    };

    //process data from HID connected device.
    const processFrame = function(data) {
        if (config.controller.motionInputs) {
            gyro.process(data);
        }
        if (config.controller.analogSticks) {
            analogs.process(data);
        }
        if (config.controller.buttons) {
            buttons.process(data);
        }
        if (config.controller.status) {
            status.process(data);
        }
        if (config.controller.touchPad) {
            touchPad.process(data);
        }
    };

    const isController = function(device) {
        return device.vendorId == config.controller.vendorId && device.productId == config.controller.productId;
    };

    // Public methods
    this.connect = function() {
        logger.warn('connect method is deprecated, controller now connects upon declaration.');
    };

    this.disconnect = function() {
        if (device && device.close) {
            device.close();
        }
        this.emit('disconnecting');
        logger.warn('node dualshock disconnecting');
    };

    // Used to set controller rumble and light
    this.setExtras = function(data) {

        let buff = config.controller.output.defaultBuffer.slice();

        Object.keys(data).forEach(k => {
            buff[indexes[k]] = data[k];
        });
        device.write(buff);
    };

    //connect to the controller.
    if (typeof config.options.device === 'undefined') {
        logger.warn('node dualshock connecting');

        const deviceMeta = HID.devices().
            sort((a, b) => a.path.localeCompare(b.path)).
            filter(isController)[config.options.index || 0];
        if (deviceMeta) {
            device = new HID.HID(deviceMeta.path);
        } else {
            handleException(new Error(`device with VID:${config.controller.vendorId} PID:${config.controller.productId} not found`));
        }

    } else {
        // Allow user-specified device
        device = config.options.device;
    }

    device.on('data', processFrame.bind(this));
    device.on('error', handleException.bind(this));

    //subscribe to the exit event:
    process.on('exit', this.disconnect.bind(this));
};

//need to inherit from event emiter.
util.inherits(Controller, Emitter);

module.exports = Controller;
