'use strict';
// Module dependencies.
var dsutilities = require('./utilities'),
    Smoothing = require('./smoothing'),
    config = require('./config');

//Proccess Analog stick events.
var Analogs = function(controller) {

    var varianceThreshhold = 1,
        outputSmoothing = new Smoothing(smoothInput),
        analogSticks = config.getControllerConfig().analogSticks,
        smoothInput = config.getOptions().analogStickSmoothing;

    //Private methods
    var processStick = function(analogStick, data) {
        var currentValue = {
            x: data[analogStick.x],
            y: data[analogStick.y]
        },
            previousValue = {
                x: outputSmoothing.readLastPosition(analogStick.name + 'x'),
                y: outputSmoothing.readLastPosition(analogStick.name + 'y')
            };

        //we only raise an event if both
        if (dsutilities.isWithinVariance(previousValue.x, currentValue.x, varianceThreshhold) ||
            dsutilities.isWithinVariance(previousValue.y, currentValue.y, varianceThreshhold)) {

            currentValue.x = outputSmoothing.smooth(analogStick.name + 'x', currentValue.x);
            currentValue.y = outputSmoothing.smooth(analogStick.name + 'y', currentValue.y);

            // Update and emit
            if (controller[analogStick.name]) {
                controller[analogStick.name].x = currentValue.x;
                controller[analogStick.name].y = currentValue.y;
            }
            controller.emit(analogStick.name + ':move', currentValue);
        }
    };

    // Public methods
    //process all the analog events.
    this.process = function(data) {
        for (var i = 0; i < analogSticks.length; i++) {
            processStick(analogSticks[i], data);
        }
    };
};

module.exports = Analogs;
