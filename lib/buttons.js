// Module dependencies.

//Proccess button events.
var Buttons = function (eventEmmiter, buttonConfiguration) {
    'use strict';

    // convert strings to numbers, e.g. "0x01" to 0x01
    // must be converted because JSON doesn't allow numbers with leading zeros
    buttonConfiguration.forEach(function(button) {
        if(typeof button.buttonValue == "string") {
            button.buttonValue = parseInt(button.buttonValue);
        }

        if(typeof button.mask == "string") {
          button.mask = parseInt(button.mask);
        } else if(!(button.mask instanceof Number)) {
          button.mask = 0xFF;
        }
    });

    var buffer = {};

    //Private methods
    var processButton = function (button, data) {
        //make sure the data contains a value for the specified block
        //and bitwise operation for the button value

        var block = data[button.buttonBlock] & button.mask;
        var hit = (block & button.buttonValue) == button.buttonValue;

        // special case for the dualshock 4's dpadUp button as it causes the
        // lower 8 bits of it's block to be zeroed
        if(!button.buttonValue) {
            hit = !block;
        }

        // special case for dualshock 4's dpad - they are not bitmasked values as
        // they cannot be pressed together - ie. up, left and upleft are three
        // different values - upleft is not equal to up & left
        if(button.buttonBlock == 5 && block < 0x08) {
            hit = block == button.buttonValue;
        }

        if (hit) {

            //if the button is in the released state.
            if (!buffer[button.name]) {
                buffer[button.name] = true;
                eventEmmiter.emit(button.name + ':press', button.name);
            }

            //send the analog data
            if (button.analogPin) {
                eventEmmiter.emit(button.name + ":analog", data[button.analogPin]);
            }

        } else if(buffer[button.name]) {
            //button was pressed and is not released
            buffer[button.name] = false;

            //button is no longer pressed, emit a analog 0 event.
            if(button.analogPin) {
                eventEmmiter.emit(button.name  + ":analog", 0);
            }
            //emit the released event.
            eventEmmiter.emit(button.name  + ":release", button.name);
        }
    };

    // Public methods
    //process all the analog events.
    this.process = function (data) {
        for (var i = 0; i < buttonConfiguration.length; i++) {
            processButton(buttonConfiguration[i], data);
        }
    };
};

module.exports = Buttons;
