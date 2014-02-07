// Module dependencies.
var ds3Utils = require('../ds3Utilities'),
    smoothing = require('./outputSmoothing');

//Proccess button events.
var motionProcessor = function (eventEmmiter, motionInputConfiguration, smoothInput) {
    'use strict';

    var that = this,
        varianceThreshhold = 1,
        outputSmoothing = new smoothing(smoothInput),
        ds3Utilities = new ds3Utils();

    //Private methods
    //data corrections so that each dirrection has a 0 throug x value
    var correctData = function (motionAxis, data) {
        var value;
        //ensuring that both directions start from 0 and move to -x or x;
        if (data[motionAxis.directionPin] === 1) {
            //we need the values to be from 0 to x.
            value = 255 - data[motionAxis.valuePin];
        } else if(data[motionAxis.directionPin]=== 2) {
            //going in the oposite direction, we need to values to be from 0 to -x;
            value = data[motionAxis.valuePin] * -1;
        }

        //return an object with both value and dirrection.
        return {
            direction : data[motionAxis.directionPin],
            value : value
        };
    };

    //process the axis movement.
    var processAxis = function (motionAxis, data) {
        //every motion will have a dirrection and a value
        var motionValue = correctData(motionAxis, data),
            lastPosition = outputSmoothing.readLastPosition(motionAxis.name);

        //check if the values are within variance
        if(ds3Utilities.isWithinVariance(lastPosition, motionValue.value, varianceThreshhold)) {
            motionValue.value = outputSmoothing.smooth(motionAxis.name, motionValue.value);
            eventEmmiter.emit(motionAxis.name + ':motion', motionValue);
        }
    };

    // Public methods
    //process all configured motion inputs.
    that.processMotionEvents = function (data) {
        for (var i = 0; i < motionInputConfiguration.length; i++) {
            processAxis(motionInputConfiguration[i], data);
        }
    };

    return that;
};

module.exports = motionProcessor;
