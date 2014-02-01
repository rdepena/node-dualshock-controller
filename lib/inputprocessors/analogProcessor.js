/**
 * Module dependencies.
 */
var ds3Utilities = require('../ds3Utilities');
var outputSmoothing = require('./outputSmoothing');

/**
 * Proccess Analog stick events.
 */
 var analogProcessor = function () {
    'use strict';

    var my = {};
    var controllerEmmiter = {};
    var analogConfiguration = {};
    var varianceThreshhold = 1;
    var smoothInput = false;
    var buffer = {};

    /**
    * Private methods
    */
    var processStick = function (analogStick, data) {
        var currentValue = {
            x : data[analogStick.x],
            y : data[analogStick.y]
        };

        var previousValue = {
            x : outputSmoothing.readLastPosition(analogStick.name + "x"),
            y : outputSmoothing.readLastPosition(analogStick.name + "y")
        };

        //we only raise an event if both
        if (ds3Utilities.isWithinVariance(previousValue.x, currentValue.x, varianceThreshhold) ||
            ds3Utilities.isWithinVariance(previousValue.y, currentValue.y, varianceThreshhold)) {

            if (smoothInput) {
                currentValue.x = outputSmoothing.smooth(analogStick.name + "x", currentValue.x);
                currentValue.y = outputSmoothing.smooth(analogStick.name + "y", currentValue.y);
            } else {
                outputSmoothing.addToBuffer(analogStick.name + "x", currentValue.x);
                outputSmoothing.addToBuffer(analogStick.name + "y", currentValue.y);
            }

            controllerEmmiter.emit(analogStick.name + ':move', currentValue);
        }

    };

    /**
    * Public methods
    */
    //init the analogProcessor.
    my.init = function (eventEmmiter, controllerConfiguration, hasSmoothing) {
        controllerEmmiter = eventEmmiter;
        analogConfiguration = controllerConfiguration;
        smoothInput = hasSmoothing;
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
