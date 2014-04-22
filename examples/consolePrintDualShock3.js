'use strict';
var dualShock = require('./../lib/dualshock.js');

//init the controller
var dualShock3 = dualShock();

//for a client implementation we do not need this, this is only to test the inputs.
var controllerConfiguration = require('./../controllerConfigurations/dualShock3');

//init the print events
var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock3, controllerConfiguration);
