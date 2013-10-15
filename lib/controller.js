(function () {
	var util = require('util');
	var events = require('events');
	var HID = require('node-hid');
	
	var controller = function () {

		var deviceConfiguration = null;
		var hidDevice = null;
		var buffer = {};
		//the amount of variance we allow on the analog sticks before we invoke the event: I foresee this will change
		var varianceThreshhold = 1;

		//connect to the device.
		this.connect = function (deviceConfig){
			deviceConfiguration = deviceConfig;
			hidDevice = new HID.HID(deviceConfiguration.vendorId, deviceConfiguration.productId);
			
			buffer.buttonStates = {};
			//prime the button states
			for (var button in deviceConfiguration.buttons) {
				buffer.buttonStates[button] = {
					pressed : false
				};
			}
			this.emit('connect', {});
			hidDevice.read(processFrame.bind(this));
		};

		//noticed there was a bit on noise from the controller.
		var isWithinVariance = function (x, y) {
			return Math.abs(x - y) > varianceThreshhold;
		};
		
		//process data from HID connected device.
		var processFrame = function (error, data) {
			var analog = {
				leftY : data[deviceConfiguration.leftAnalogY],
				leftX : data[deviceConfiguration.leftAnalogX],
				rightY : data[deviceConfiguration.rightAnalogY],
				rightX : data[deviceConfiguration.rightAnalogX]
			};
			
			//make sure the buffer is not null.
			buffer.analog = buffer.analog || analog;
			var buttonBlock = null;
			var buttonValue = null;

			//check the left analog for movement.
			if (isWithinVariance(buffer.analog.leftY, analog.leftY) || isWithinVariance(buffer.analog.leftX, analog.leftX)) {
				this.emit('left:move', {
					x : analog.leftX,
					y : analog.leftY
				});
			}

			//check the right analog for movement
			if (isWithinVariance(buffer.analog.rightY, analog.rightY) || isWithinVariance(buffer.analog.rightX, analog.rightX)) {
				this.emit('right:move', {
					x : analog.rightX,
					y : analog.rightY
				});
			}

			for (var button in deviceConfiguration.buttons) {

				buttonBlock = data[deviceConfiguration.buttons[button].buttonBlock];
				buttonValue = deviceConfiguration.buttons[button].buttonValue;

				if (buttonBlock & buttonValue) {
					if(!buffer.buttonStates[button].pressed) {
						buffer.buttonStates[button].pressed = true;
						this.emit(button + ":pressed", button);
					}
					//button is not pressed, check if it was pressed.
				} else {
					if(buffer.buttonStates[button].pressed) {
						buffer.buttonStates[button].pressed = false;
						this.emit(button + ":release", button);
					}
				}
			}

			buffer.analog = analog;
			hidDevice.read(processFrame.bind(this));
		};

	};

	util.inherits(controller, events.EventEmitter);
	module.exports = new controller();

}());
