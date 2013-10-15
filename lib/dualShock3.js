var dualShock3 = function () {
		var controllerConfiguration = {
			//Controller "constants"
			//analogs resting ~125, up 0, down 255, left 0, right 155
			leftAnalogY : 7,
			leftAnalogX : 6,
			rightAnalogY : 8,
			rightAnalogX : 9,
			////left 128, down 64, right 32, top 16, start 8, 
			//right joystick bumb 4, left joystick bumb 2, left 1
			buttonBlockTwo : 2,
			//square : 128, x : 64, circle: 32, triangle 16, R1: 8, L1:4, R2: 2, L2:1
			buttonBlockOne : 3,
			vendorId : 1356,
			productId : 616
		};
		var buttons = {
			'l2': {
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x01
			},
			'r2':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x02
			},
			'l1':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x04
			},
			'r1':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x08
			},
			'triangle':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x10
			},
			'circle':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x20
			},
			'x':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x40
			},
			'square':{
				'buttonBlock': controllerConfiguration.buttonBlockOne,
				'buttonValue': 0x80
			},
			'select':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x1
			},
			'leftAnalogBumb':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x2
			},
			'rightAnalogBump':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x4
			},
			'start':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x08
			},
			'dpadUp':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x10
			},
			'dpadRight':{
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x20
			},
			'dpadDown' : {
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue' : 0x40
			},
			'dPadLeft':{	
				'buttonBlock': controllerConfiguration.buttonBlockTwo,
				'buttonValue': 0x80
			}
		};
		controllerConfiguration.buttons = buttons;
		var my = {};

		var controller = require('./controller.js');
		
		//var dualShockController =  //new controller(HID, controllerConfiguration);
		console.log(controller);
		controller.on('left:move', function(data) {
			console.log('left Moved');
			console.log(data);
		});
		controller.on('right:move', function(data) {
			console.log('left Moved');
			console.log(data);
		});
		controller.on('connect', function(data) {
			console.log('connected');
		});

		//subscribe to all the buttons:
		for (var button in buttons) {
			controller.on(button + ":pressed", function (data) {
				console.log(data + " pressed");
			});
			controller.on(button + ":release", function (data) {
				console.log(data + " released");
			});
		};

		controller.connect(controllerConfiguration);
		return my;
};

module.exports = dualShock3;

dualShock3();