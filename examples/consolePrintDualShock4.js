(function () {
	var dualShock = require('./../lib/dualShock.js');

	var dualShock4 = dualShock(
	{
		config: "dualshock4-generic-driver"
	});

	//for a client implementation we do not need this, this is only to test the inputs.
	var controllerConfiguration = require('./../controllerConfigurations/dualshock4-generic-driver.js');

	//init the print events
	var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock4, controllerConfiguration);
}());
