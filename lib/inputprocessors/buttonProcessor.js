/**
 * Module dependencies.
 */

var ds3Utilities = require('../ds3Utilities');
/**
 * Proccess button events.
 */
 var buttonProcessor = function () {
    'use strict';

    var my = {};
    var controllerEmmiter = {};
    var buttonConfiguration = {};
    var varianceThreshhold = 1;
    var buttonPressedBuffer = {};

    /**
    * Private methods
    */
    var processButton = function (button, data) {
        //make sure the data contains a value for the specified block
        //and bitwise operation for the button value
        if (data[button.buttonBlock] & button.buttonValue) {
            //send the analog data
            if (button.analogPin) {
                controllerEmmiter.emit(button.name + ":analog", data[button.analogPin]);
            }
            //if the button is in the released state.
            if (!buttonPressedBuffer[button.name]) {
                buttonPressedBuffer[button.name] = true;
                controllerEmmiter.emit(button.name + ':press', button.name);
            }
        } else if(buttonPressedBuffer[button.name]) {
            //button was pressed and is not released
            buttonPressedBuffer[button.name] = false;

            //button is no longer pressed, emit a analog 0 event.
            if(button.analogPin) {
                controllerEmmiter.emit(button.name  + ":analog", 0);
            }
            //emit the released event.
            controllerEmmiter.emit(button.name  + ":release", button.name);
        }
    };

    /**
    * Public methods
    */
    //init the analogProcessor.
    my.init = function (eventEmmiter, controllerConfiguration) {
        controllerEmmiter = eventEmmiter;
        buttonConfiguration = controllerConfiguration;
    };

    //process all the analog events.
    my.processButtonEvents = function (data) {
        for (var i = 0; i < buttonConfiguration.length; i++) {
            processButton(buttonConfiguration[i], data);
        }
    };

    return my;
 };

 module.exports = new buttonProcessor();
