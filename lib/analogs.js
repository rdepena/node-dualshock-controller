'use strict';
// Module dependencies.
var dsutilities = require('./utilities'),
    Smoothing = require('./smoothing'),
    config = require('./config');

//Proccess Analog stick events.
var Analogs = function(eventEmmiter) {

    var varianceThreshhold = 1,
        outputSmoothing = new Smoothing(smoothInput),
        analogConfiguration = config.getControllerConfig().analogSticks,
        smoothInput = config.getOptions().analogStickSmoothing;

    //Private methods
    var processStick = function(analogStick, data) {
        var currentValue = {
            x: data[analogStick.x],
            y: data[analogStick.y]
        },
            previousValue = {
                x: outputSmoothing.readLastPosition(analogStick.name + "x"),
                y: outputSmoothing.readLastPosition(analogStick.name + "y")
            };

        //we only raise an event if both
        if (dsutilities.isWithinVariance(previousValue.x, currentValue.x, varianceThreshhold) ||
            dsutilities.isWithinVariance(previousValue.y, currentValue.y, varianceThreshhold)) {

            currentValue.x = outputSmoothing.smooth(analogStick.name + "x", currentValue.x);
            currentValue.y = outputSmoothing.smooth(analogStick.name + "y", currentValue.y);

            eventEmmiter.emit(analogStick.name + ':move', currentValue);
        }
    };

    // Public methods
    //process all the analog events.
    this.process = function(data) {
        for (var i = 0; i < analogConfiguration.length; i++) {
            processStick(analogConfiguration[i], data);
        }
    };
};

module.exports = Analogs;
