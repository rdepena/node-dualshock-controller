'use strict';
// Module dependencies.
var dsutilities = require('./utilities'),
    Smoothing = require('./smoothing'),
    config = require('./config');

//Proccess button events.
var motionProcessor = function(controller) {

    var varianceThreshhold = 1,
        smoothInput = config.getOptions().accelerometerSmoothing,
        outputSmoothing = new Smoothing(smoothInput),
        motionInputs = config.getControllerConfig().motionInputs;

    //generate event name aliases:
    motionInputs.forEach(function(motionAxis) {
        motionAxis.eventPrefixes = dsutilities.generateEventPrefixAliases(motionAxis.name);
    });

    //Private methods
    //data corrections so that each dirrection has a 0 throug x value
    var correctData = function(motionAxis, data) {
        var value;
        //ensuring that both directions start from 0 and move to -x or x;
        if (data[motionAxis.directionPin] === 1) {
            //we need the values to be from 0 to x.
            value = 255 - data[motionAxis.valuePin];
        } else if (data[motionAxis.directionPin] === 2) {
            //going in the oposite direction, we need to values to be from 0 to -x;
            value = data[motionAxis.valuePin] * -1;
        }

        //return an object with both value and dirrection.
        return {
            direction: data[motionAxis.directionPin],
            value: value
        };
    };

    //process the axis movement.
    var processAxis = function(motionAxis, data) {
        //every motion will have a dirrection and a value
        var motionValue = correctData(motionAxis, data),
            lastPosition = outputSmoothing.readLastPosition(motionAxis.name);

        //check if the values are within variance
        if (dsutilities.isWithinVariance(lastPosition, motionValue.value, varianceThreshhold)) {
            motionValue.value = outputSmoothing.smooth(motionAxis.name, motionValue.value);

            // Don't assign motionValue directly to controller[motionAxis.name],
            // this will break the reference.
            if (controller[motionAxis.name]) {
                controller[motionAxis.name].value = motionValue.value;
                controller[motionAxis.name].direction = motionValue.direction;
            }

            motionAxis.eventPrefixes.forEach(function(eventPrefix) {
                controller.emit(eventPrefix + ':motion', motionValue);
            });
        }
    };

    // Public methods
    //process all configured motion inputs.
    this.process = function(data) {
        for (var i = 0; i < motionInputs.length; i++) {
            processAxis(motionInputs[i], data);
        }
    };
};

module.exports = motionProcessor;
