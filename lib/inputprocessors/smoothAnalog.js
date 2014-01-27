/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');

var smoothAnalog = function () {
    var buffer = {};

    var addToBuffer = function (inputName, value) {
        //do we already have an array at for this axis?
        if (buffer[inputName]) {
            buffer[inputName].push(value);
            if(buffer[inputName].length > 5) {
                buffer[inputName].shift();
            }
        } else {
            //create an array with the value.
            buffer[inputName] = [value];
        }

        return buffer[inputName];
    };

    this.readLastPosition = function (inputName) {
        var axisBuffer = buffer[inputName];
        return axisBuffer ? axisBuffer[axisBuffer.length -1] : null;
    };

    this.smooth = function (inputName, value) {
        var axisBuffer = addToBuffer(inputName, value);
        var sum = 0;
        for(var i =0; i < axisBuffer.length; i++) {
            sum += axisBuffer[i];
        }

        return Math.floor(sum/axisBuffer.length);
    };
};

module.exports = new smoothAnalog();