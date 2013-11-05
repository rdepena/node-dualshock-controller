var dualShock = function (options) {
	options = options || {};
	var controllerConfig = options.config || "dualShock3.js";
	this.controller = require('./controller.js');
	//need to load the config file with all the device specifics.
	var controllerConfiguration = require('./../controllerConfigurations/' + controllerConfig);

	//loads the configuration;
	this.controller.init(controllerConfiguration);
	return this.controller;
};

module.exports = dualShock;
