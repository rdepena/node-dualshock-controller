(function () {
	var dualShock3 = require('./../lib/dualShock3.js');

	//for a client implementation we do not need this, this is only to test the inputs.
	var controllerConfiguration = require('./../controllerConfigurations/dualShock3.js');

	dualShock3.on('left:move', function(data) {
		console.log('left Moved');
		console.log(data);
	});
	dualShock3.on('right:move', function(data) {
		console.log('left Moved');
		console.log(data);
	});
	dualShock3.on('connect', function(data) {
		console.log('connected');
	});

	dualShock3.on('error', function (data) {
		console.log(data);
	});
		//subscribe to all the buttons:
	for (var button in controllerConfiguration.buttons) {
		this.controller.on(button + ":pressed", function (data) {
			console.log(data + " pressed");
		});
		this.controller.on(button + ":release", function (data) {
			console.log(data + " released");
		});
	}

	//once everything is ready we call connect()
	dualShock3.connect();
}());