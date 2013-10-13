var dualShock3 = function () {
	

		console.log("Hello");
		var controllerOptions = {
			//Controller "constants"
			//analogs resting ~125, up 0, down 255, left 0, right 155
			leftAnalogY : 7,
			leftAnalogX : 6,
			rightAnalogY : 8,
			rightAnalogX : 9,
			////left 128, down 64, right 32, top 16, start 8, 
			//right joystick bumb 4, left joystick bumb 2, left 1
			directionalButtons : 2,
			//square : 128, x : 64, circle: 32, triangle 16, R1: 8, L1:4, R2: 2, L2:1
			actionButtons : 3,
			vendorId : 1356,
			productId : 616
		};
		var my = {};

		var controller = require('./controller.js');
		
		//var dualShockController =  //new controller(HID, controllerOptions);
		console.log(controller);
		controller.on("left:move'", function(data) {
			console.log(data);
		});
		controller.on("connect'", function(data) {
			console.log("connected");
		});
		controller.connect(controllerOptions);
		return my;
};

module.exports = dualShock3;

dualShock3();