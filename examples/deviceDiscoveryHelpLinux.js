var joystick = require('joystick'),
    controller = new joystick(0, 256, 500);

controller.on('button', console.log);

controller.on('axis', console.log);
