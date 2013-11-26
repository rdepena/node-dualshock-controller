(function () {
	var util = require('util'),
		events = require('events'),
		HID = require('node-hid'),
		colors = require('colors');
	
	//our generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
	var controller = function () {
		//store the analog data in the buffer.
		var controllerConfiguration = null;
		var hidDevice = null;
		//we will use this bugger to keep track of changes.
		var buffer = {};
		//the amount of variance is allowed on the analog sticks before any event is invoked,
		//usually depending on the controller an amount of noise will be introduced
		var varianceThreshhold = 1;
		var buttonBlock = null;
		var buttonValue = null;
		//for some reason HID will sometimes not read.
		var deviceReadOk = false;

		//noticed there was a bit on noise from the controller.
		var isWithinVariance = function (x, y) {
			return Math.abs(x - y) > varianceThreshhold;
		};

		var handleException = function (ex) {
			//if exception was generated within our stream
			if (this.emit) {
				this.emit('error', ex);
			} else {
				console.log(ex);	
			}
		};
		
		//process data from HID connected device.
		var processFrame = function (error, data) {
			//make sure the buffer is not null.
			if(error) {
				//throw the error, will be handled and retry will be done.
				throw(error);
			}
			//we have read.
			deviceReadOk = true;
			//only process analog data if controller has analog sticks.
			//current analog state.
			var analog = {
				leftY : data[controllerConfiguration.leftAnalogY],
				leftX : data[controllerConfiguration.leftAnalogX],
				rightY : data[controllerConfiguration.rightAnalogY],
				rightX : data[controllerConfiguration.rightAnalogX]
			};
			
			//make sure the buffer is not null.
			buffer.analog = buffer.analog || analog;

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
			//store the analog data in the buffer.
			buffer.analog = analog;
			//process the input data for button events.
			for (var button in controllerConfiguration.buttons) {

				buttonBlock = data[controllerConfiguration.buttons[button].buttonBlock];
				buttonValue = controllerConfiguration.buttons[button].buttonValue;
				analogPin = controllerConfiguration.buttons[button].analogPin;

				//process the digital button press 
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
				//process button analog 
				if (buttonBlock && analogPin) {
					this.emit(button + ":analog", data[analogPin]);
				}
			}
			//read from the hid device.
			this.deviceRead();

		};

		//init the controller, setting configuration values and default states.
		this.init = function (controllerConfig) {

			//init the private members;
			controllerConfiguration = controllerConfig;
			buffer.buttonStates = {};

			//prime the button states
			for (var button in controllerConfiguration.buttons) {
				buffer.buttonStates[button] = {
					pressed : false
				};
			}
		};

		//initiate the HID connection with the device, use the vendorId and product Id to identify the controller
		this.connect = function () {

			//connect to the device.
			try {
				hidDevice = new HID.HID(controllerConfiguration.vendorId, controllerConfiguration.productId);
				console.log('node dualshock connecting'.yellow);
			} catch (ex) {
				handleException(ex);
			}
			//start the read loop
			this.deviceRead();

			//this is a hack because we do not have a connected confirmation from HID.
			setTimeout(this.checkIfreceiving.bind(this), 500);
		};

		this.disconnect = function () {
			if (hidDevice) {
				hidDevice.close();
			}
			this.emit('disconnecting');
			console.log('node dualshock disconnecting'.yellow);
		};

		this.checkIfreceiving = function () {
			if (!deviceReadOk) {
				this.emit("error", "the device failed to read, retrying");
				this.connect();
			} else {
				this.emit('connected');
				console.log('node dualshock connected'.yellow);
			}
		};

		this.deviceRead = function () {
			//call device read and process the data.
			try {
				if(hidDevice) {
					hidDevice.read(processFrame.bind(this));	
				} else {
					this.emit("error", "Could not connect to the device");
				}
			} catch (ex) {
				handleException(ex);
				//retry
				this.deviceRead();
			}
			
		};

		//subscribe to the exit event:
		process.on('exit', this.disconnect.bind(this));

		return this;

	};

	//need to inherit from event emiter.
	util.inherits(controller, events.EventEmitter);
	module.exports = new controller();

}());
