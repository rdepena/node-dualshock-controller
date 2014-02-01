/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');
var outputSmoothing = require('./outputSmoothing');


/**
 * Proccess Motion events.
 */
var motionProcessor = function () {
    'use strict';
    var my = {};
    var controllerEmmiter = {};
    var motionInputConfiguration = {};
    var varianceThreshhold = 1;
    var smoothInput = false;

    /**
    * Private methods
    */
    var processAxis = function (motionAxis, data) {

        //every motion will have a dirrection and a value
        var motionValue = {
            direction : data[motionAxis.directionPin],
            value : data[motionAxis.valuePin]
        };
        //check if the values are within variance
        if(ds3Utilities.isWithinVariance(outputSmoothing.readLastPosition(motionAxis.name), motionValue.value, varianceThreshhold)) {

            //some data corrections so that each dirrection has a 0 throug x value
            if (motionValue.direction === 1) {
                //we need the values to be from 0 to x.
                motionValue.value = 255 - motionValue.value;
            } else if(motionValue.direction === 2) {
                //going in the oposite direction, we need to values to be from 0 to -x;
                motionValue.value = motionValue.value * -1;
            }

            if (smoothInput) {
                motionValue.value = outputSmoothing.smooth(motionAxis.name, motionValue.value);
            } else {
                outputSmoothing.addToBuffer(motionAxis.name, currentValue.x);
            }
            controllerEmmiter.emit(motionAxis.name + ':motion', motionValue);
        }
    };

    /**
    * Public methods
    */
    //init the MotionProcessor.
    my.init = function (eventEmmiter, controllerConfiguration, hasSmoothing) {
        controllerEmmiter = eventEmmiter;
        motionInputConfiguration = controllerConfiguration;
        smoothInput = hasSmoothing;
    };

    //process all configured motion inputs.
    my.processMotionEvents = function (data) {
        for (var i = 0; i < motionInputConfiguration.length; i++) {
            processAxis(motionInputConfiguration[i], data);
        }
    };

    return my;
};

module.exports = new motionProcessor();
