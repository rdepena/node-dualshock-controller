// Module dependencies.
var Utilities = require('./utilities'),
    Smoothing = require('./smoothing');

//Proccess Analog stick events.
var Analogs = function (eventEmmiter, analogConfiguration, smoothInput) {
    'use strict';

    var varianceThreshhold = 1,
        buffer = {},
        outputSmoothing = new Smoothing(smoothInput),
        ds3Utilities = new Utilities();

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
    this.process = function (data) {
        analogConfiguration.forEach(function (conf) {
            processStick(conf, data);
        });
    };
};

module.exports = Analogs;
