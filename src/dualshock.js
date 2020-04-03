'use strict';

// Module dependencies.
var Controller = require('./controller');

// This is the app entry point.
//  options you can pass:
//  {
//   config : "File from controllerConfigurations" or a JS object containing configuration,
//   accelerometerSmoothing : true/false, this will activate motion/acelerometer output smoothing. true by default.
//   analogStickSmoothing : true/false, this will activate analog thumb stick smoothing
//  }
var dualShock = function(options) {
    return new Controller(options);
};

// Since dualShock() simply delegates to `new Controller()`, allow direct use
// of the latter.
dualShock.Controller = Controller;

module.exports = dualShock;
