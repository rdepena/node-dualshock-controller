'use strict';
var config = require('./config');

function ControllerOutput(device) {
    var outputOpts = config.getControllerConfig().output;


    function rumble(left, right) {
        outputOpts.writePackage[outputOpts.rumbleMotors.left] = left;
        outputOpts.writePackage[outputOpts.rumbleMotors.right] = right;

        writeState();
    }

    function led(val) {
        outputOpts.writePackage[outputOpts.ledPin] = val;

        writeState();

    }

    function hasLedValue(val) {
        return outputOpts.writePackage[outputOpts.ledPin] & val;
    }

    function ledOn(led) {
        var ledVal = outputOpts.leds[led];
        if (hasLedValue(ledVal)) {
            return;
        }
        outputOpts.writePackage[outputOpts.ledPin] += ledVal;

        writeState();
    }

    function ledOff(led) {
        var ledVal = outputOpts.leds[led];
        if (!hasLedValue(ledVal)) {
            return;
        }
        outputOpts.writePackage[outputOpts.ledPin] -= ledVal;

        writeState();
    }

    function writeState() {
        if (!device.write || !outputOpts) {
            return;
        }

        device.write(outputOpts.writePackage);
    }


    return {
        rumble: rumble,
        led: led,
        ledOn: ledOn,
        ledOff: ledOff
    };

}

module.exports = ControllerOutput;
