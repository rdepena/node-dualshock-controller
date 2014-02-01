/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');

var outputSmoothing = function () {
    var buffer = {};

    //rename to something else.
    var maxPeriod = 5;

    /**
    * Public methods
    */
    this.readLastPosition = function (motionAxisName) {
        var axisBuffer = buffer[motionAxisName];
        return axisBuffer ? axisBuffer[axisBuffer.length -1] : null;
    };

    this.addToBuffer = function (motionAxisName, value) {
        if (buffer[motionAxisName]) {
            //add the current value to the buffer
            buffer[motionAxisName].push(value);

            //remove the head of the buffer
            if(buffer[motionAxisName].length > maxPeriod) {
                buffer[motionAxisName].shift();
            }
        } else {
            //create an array with the value.
            buffer[motionAxisName] = [value];
        }
    };

    //smooth using a moving average.
    this.smooth = function (motionAxisName, value) {
        var lastPosition = this.readLastPosition(motionAxisName);

        this.addToBuffer(motionAxisName, value);

        var axisBuffer = buffer[motionAxisName];
        var sum = 0;
        for(var i =0; i < axisBuffer.length; i++) {
            sum += axisBuffer[i];
        }
        return Math.floor(sum/axisBuffer.length);
    };
};

module.exports = new outputSmoothing();
