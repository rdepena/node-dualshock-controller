// Module dependencies.

var events = require('events'),
    util = require('util'),
    joystick = require('joystick'),
    config = require('./config');


var LinuxConnector = function() {

    //private members

    var buffer = [],
        controllerConfig = config.getControllerConfig(),
        options = config.getOptions();

    var initBuffer = function() {
        var buttons = controllerConfig.buttons;
        for (var i = 0; i < buttons.length; i++) {
            buffer[buttons[i].buttonBlock] = 0;
        }
    };

    //take a button event from joystick and update the buffer.
    var updateButtonBuffer = function(data) {
        var buttons = controllerConfig.buttons,
            button,
            bufferButton;
        //process buttons
        for (var i = 0; i < buttons.length; i++) {
            //current button.
            button = buttons[i];
            if (button.joystickNumber === data.number) {
                bufferButton = buffer[button.buttonBlock];
                if (!data.value) {
                    if (bufferButton & button.buttonValue) {
                        buffer[button.buttonBlock] = bufferButton - button.buttonValue;
                    }
                } else {
                    buffer[button.buttonBlock] = bufferButton + button.buttonValue;
                }
            }
        }
    };

    var updateAxisBuffer = function(data) {
        var analogSticks = controllerConfig.analogSticks,
            analogStick,
            reducedResData;

        //process analogs
        for (var i = 0; i < analogSticks.length; i++) {
            //current analog stick.
            analogStick = analogSticks[i];
            //reduce resolution to look more like node-hid.
            reducedResData = 128 - (Math.floor(data.value / 256) * -1);

            if (data.number === analogStick.joystickYNumber) {
                buffer[analogStick.y] = reducedResData;
            } else if (data.number === analogStick.joystickXNumber) {
                buffer[analogStick.x] = reducedResData;
            }
        }
    };

    var emmitBufferData = function() {

        this.emit('data', buffer);
        //emit only at ~30fps;
        setTimeout(emmitBufferData.bind(this), 33);
    };

    //make sure the buffer is initiated;
    initBuffer();
    //defaulting to the first controller by passing 0;
    var controller = new joystick(options.linuxJoystickId, 3500, 350);

    //process the button events
    controller.on('button', updateButtonBuffer.bind(this));
    //process the axis events.
    controller.on('axis', updateAxisBuffer.bind(this));

    controller.on('error', function(error) {
        this.emit('data', error);
    }.bind(this));

    //wait for ~ 1second to start the emmit loop.
    setTimeout(emmitBufferData.bind(this), 1000);
};

util.inherits(LinuxConnector, events.EventEmitter);
module.exports = LinuxConnector;
