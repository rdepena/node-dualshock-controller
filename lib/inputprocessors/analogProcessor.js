// Module dependencies.
var ds3Utils = require('../ds3Utilities'),
    smoothing = require('./outputSmoothing');

//Proccess Analog stick events.
var analogProcessor = function (eventEmmiter, analogConfiguration, smoothInput) {
    'use strict';

    var that = this,
        varianceThreshhold = 1,
        buffer = {},
        outputSmoothing = new smoothing(smoothInput),
        ds3Utilities = new ds3Utils();

    //Private methods
    var processStick = function (analogStick, data) {
        var currentValue = {
            x : data[analogStick.x],
            y : data[analogStick.y]
        },
            previousValue = {
            x : outputSmoothing.readLastPosition(analogStick.name + "x"),
            y : outputSmoothing.readLastPosition(analogStick.name + "y")
        };

        //we only raise an event if both
        if (ds3Utilities.isWithinVariance(previousValue.x, currentValue.x, varianceThreshhold) ||
            ds3Utilities.isWithinVariance(previousValue.y, currentValue.y, varianceThreshhold)) {

            currentValue.x = outputSmoothing.smooth(analogStick.name + "x", currentValue.x);
            currentValue.y = outputSmoothing.smooth(analogStick.name + "y", currentValue.y);

            eventEmmiter.emit(analogStick.name + ':move', currentValue);
        }
    };

    // Public methods
    //process all the analog events.
    that.processAnalogStickEvents = function (data) {
        for (var i = 0; i < analogConfiguration.length; i++) {
            processStick(analogConfiguration[i], data);
        }
    };

    return that;
};

module.exports = analogProcessor;
