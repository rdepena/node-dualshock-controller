// Module dependencies.

//smooths data with moving average
var outputSmoothing = function(smoothInput) {
    'use strict';

    var buffer = {},
        maxFrames = 5;

    // Public methods
    this.readLastPosition = function(motionAxisName) {
        var axisBuffer = buffer[motionAxisName];
        return axisBuffer ? axisBuffer[axisBuffer.length - 1] : null;
    };

    this.addToBuffer = function(motionAxisName, value) {
        if (buffer[motionAxisName]) {
            //add the current value to the buffer
            buffer[motionAxisName].push(value);

            //remove the head of the buffer
            if (buffer[motionAxisName].length > maxFrames) {
                buffer[motionAxisName].shift();
            }
        } else {
            //create an array with the value.
            buffer[motionAxisName] = [value];
        }
    };

    //smooth using a moving average.
    this.smooth = function(motionAxisName, value) {
        this.addToBuffer(motionAxisName, value);
        var axisBuffer = buffer[motionAxisName],
            sum = 0,
            smoothedVal = value;

        if (smoothInput) {
            for (var i = 0; i < axisBuffer.length; i++) {
                sum += axisBuffer[i];
            }
            smoothedVal = Math.floor(sum / axisBuffer.length);
        }

        return smoothedVal;

    };
};

module.exports = outputSmoothing;
