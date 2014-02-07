// Module dependencies.
var ds3Utils = require('../ds3Utilities');

//Proccess button events.
var buttonProcessor = function (eventEmmiter, buttonConfiguration) {
    'use strict';

    var that = this,
        varianceThreshhold = 1,
        buffer = {},
        ds3Utilities = new ds3Utils();

    //Private methods
    var processButton = function (button, data) {
        //make sure the data contains a value for the specified block
        //and bitwise operation for the button value
        if (data[button.buttonBlock] & button.buttonValue) {

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
    that.processButtonEvents = function (data) {
        for (var i = 0; i < buttonConfiguration.length; i++) {
            processButton(buttonConfiguration[i], data);
        }
    };

    return that;
};

module.exports = buttonProcessor;
