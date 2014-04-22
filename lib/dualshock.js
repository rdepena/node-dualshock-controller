// Module dependencies.
var Controller = require('./controller.js'),
    config = require('./config');

// This is the app entry point.
//  options you can pass:
//  {
//   config : "File from controllerConfigurations" or a JS object containing configuration,
//   accelerometerSmoothing : true/false, this will activate motion/acelerometer output smoothing. true by default.
//   analogStickSmoothing : true/false, this will activate analog thumb stick smoothing
//  }
var dualShock = function(options) {
    'use strict';

    //set the current options
    config.setOptions(options);

    //returns the controller.
    return new Controller();
};

module.exports = dualShock;
