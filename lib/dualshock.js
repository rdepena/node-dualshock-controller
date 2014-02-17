// Module dependencies.
var controller = require('./controller.js');


// This is the app entry point.
//  options you can pass:
//  {
//   config : "File from controllerConfigurations" or a JS object containing configuration,
//   accelerometerSmoothing : true/false, this will activate motion/acelerometer output smoothing. true by default.
//   analogStickSmoothing : true/false, this will activate analog thumb stick smoothing
//  }
var dualShock = function (options) {
    'use strict';

    //no options were passed
    options = options || {};

    //default to dualshock3
    options.config = options.config || "dualShock3";

    //default motionSmoothing is turned on
    options.accelerometerSmoothing = options.accelerometerSmoothing === undefined ? true : options.accelerometerSmoothing;

    //defaults analogStickSmoothing is turned off
    options.analogStickSmoothing = options.analogStickSmoothing === undefined ? false : options.analogStickSmoothing;

    var controllerConfiguration;

    //use passed config or load from built-in configs
    if (typeof options.config === "object") {
      controllerConfiguration = options.config;
    } else {
      controllerConfiguration = require('./../controllerConfigurations/' + options.config);
    }

    //loads the configuration;
    var ds = new controller(controllerConfiguration, options);
    return ds;
};

module.exports = dualShock;
