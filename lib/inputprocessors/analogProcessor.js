/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');
var smoothAnalog = require('./smoothAnalog');

/**
 * Proccess Analog stick events.
 */
 var analogProcessor = function () {
    'use strict';

    var my = {};
    var controllerEmmiter = {};
    var analogConfiguration = {};
    var varianceThreshhold = 1;
    var buffer = {};

    /**
    * Private methods
    */
    var processStick = function (analogStick, data) {
        var analogValue = {
            x : data[analogStick.x],
            y : data[analogStick.y]
        };

        if (ds3Utilities.isWithinVariance(smoothAnalog.readLastPosition(analogStick.name + "x"), analogValue.x, varianceThreshhold) ||
            ds3Utilities.isWithinVariance(smoothAnalog.readLastPosition(analogStick.name + "y"), analogValue.y, varianceThreshhold)) {
            analogValue.x = smoothAnalog.smoothAnalog(analogStick.name + "x", analogValue.x);
            analogValue.y = smoothAnalog.smoothAnalog(analogStick.name + "y", analogValue.y);
            controllerEmmiter.emit(analogStick.name + ':move', analogValue);
        }

    };

    /**
    * Public methods
    */
    //init the analogProcessor.
    my.init = function (eventEmmiter, controllerConfiguration) {
        controllerEmmiter = eventEmmiter;
        analogConfiguration = controllerConfiguration;
    };

    //process all the analog events.
    my.processAnalogStickEvents = function (data) {
        for (var i = 0; i < analogConfiguration.length; i++) {
            processStick(analogConfiguration[i], data);
        }
    };

    return my;
 };

module.exports = new analogProcessor();
