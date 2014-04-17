var joystick = require('joystick'),
	controller = new joystick(0, 256, 500);

controller.on('button', function (buffer) {
	console.log(buffer);
});

controller.on('axis', console.log);