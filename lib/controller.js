(function () {
	var util = require('util');
	var events = require('events');
	var HID = require('node-hid');
	
	var controller = function () {

		var deviceConfiguration = null;
		var hidDevice = null;
		var buffer = {};

		//connect to the device.
		this.connect = function (deviceConfig){
			deviceConfiguration = deviceConfig;
			hidDevice = new HID.HID(deviceConfiguration.vendorId, deviceConfiguration.productId);
			this.emit('connected', {});
			hidDevice.read(processFrame.bind(this));
		}
		
		//processs data from HID connected device.
		var processFrame = function (error, data) {
			console.log("processing the frame.");
			var frame = {
				//todo: add buttons and stuff.
				leftY : data[deviceConfiguration.leftAnalogY],
				leftX : data[deviceConfiguration.leftAnalogX],
				rightY : data[deviceConfiguration.rightAnalogY],
				rightX : data[deviceConfiguration.rightAnalogX]
			};
			this.emit('left:move', {
				x : frame.leftX,
				y : frame.leftY
			});
			hidDevice.read(processFrame.bind(this));
		};

	};

	util.inherits(controller, events.EventEmitter);
	module.exports = new controller();

}());
