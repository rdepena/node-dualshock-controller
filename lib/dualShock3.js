var dualShock3 = function () {
	this.controller = require('./controller.js');
	//need to load the config file with all the device specifics.
	var controllerConfiguration = require('./../controllerConfigurations/dualShock3.js');

	//loads the configuration;
	this.controller.init(controllerConfiguration);
	return this;
}();

module.exports = dualShock3.controller;
