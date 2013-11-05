var printcontrollerEvents = function (controller, controllerConfiguration) {

	controller.on('left:move', function(data) {
		console.log('left Moved');
		console.log(data);
	});
	controller.on('right:move', function(data) {
		console.log('right Moved');
		console.log(data);
	});
	controller.on('connected', function(data) {
		console.log('connected');
	});

	controller.on('error', function (data) {
		console.log(data);
	});

	pressed = function (data) {
		console.log(data + ": pressed");
	};
	released = function (data) {
		console.log(data + ": released");
	};
	analog = function (data) {
		console.log(data + ": analog");
	};
	//subscribe to all the buttons:
	for (var button in controllerConfiguration.buttons) {
		this.controller.on(button + ":pressed", pressed);
		this.controller.on(button + ":release", released);
		this.controller.on(button+":analog", analog);
	}

	//once everything is ready we call connect()
	controller.connect();
};

module.exports = printcontrollerEvents;


