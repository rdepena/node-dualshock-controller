/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');

/**
 * Proccess Analog stick events.
 */
 var analogProcessor = function () {
    var my = {};
    var controllerEmmiter = {};
    var analogConfiguration = {};
    var varianceThreshhold = 1;
    var buffer = {};

    /**
    * Private methods
    */
    var processStick = function (analogStick, data) {
        var analogValue = {
            x : data[analogStick.x],
            y : data[analogStick.y]
        };

        //make sure the buffer is not null;
        buffer[analogStick.name] = buffer[analogStick.name] || analogValue;

        if (ds3Utilities.isWithinVariance(buffer[analogStick.name].x, analogValue.x, varianceThreshhold) || 
            ds3Utilities.isWithinVariance(buffer[analogStick.name].y, analogValue.y, varianceThreshhold)) {
            controllerEmmiter.emit(analogStick.name + ':move', analogValue);
        }

        buffer[analogStick.name] = analogValue;

    };

    /**
    * Public methods
    */
    //init the analogProcessor.
    my.init = function (eventEmmiter, controllerConfiguration) {
        controllerEmmiter = eventEmmiter;
        analogConfiguration = controllerConfiguration;
    };

    //process all the analog events.
    my.processAnalogStickEvents = function (data) {
        for (var i = 0; i < analogConfiguration.length; i++) {
            processStick(analogConfiguration[i], data);
        }
    };

    return my;
 };

module.exports = new analogProcessor();