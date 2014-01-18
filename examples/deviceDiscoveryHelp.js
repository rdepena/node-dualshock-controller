(function () {
	var HID = require('node-hid');
	console.log(HID.devices());

	var controller = new HID.HID(1356, 616);

	function processData(err, data) {
		for (var i = 0; i < data.length; i++) {
			if (i>40) {
				console.log(i + " " + data[i]);	
			}
		}
		console.log('seperator');
		controller.read(processData);
	}

	console.log('this is the controller object');

	console.log(controller);

	console.log('lets try to read from the controller');

	controller.read(processData);

}());
