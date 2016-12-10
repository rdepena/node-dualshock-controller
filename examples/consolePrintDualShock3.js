'use strict';
var dualShock = require('./../src/dualshock.js');

//init the controller
var dualShock3 = dualShock({
    analogStickSmoothing: false,
    config: "dualShock3",
    forceNodeHid: false
});

//for a client implementation we do not need this, this is only to test the inputs.
var controllerConfiguration = require('./../controllerConfigurations/dualShock3');

//init the print events
var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock3, controllerConfiguration);
