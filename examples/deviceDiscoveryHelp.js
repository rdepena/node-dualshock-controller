var HID = require('node-hid');
console.log(HID.devices());

var controller = new HID.HID(1356, 616);

controller.on('data', function(data) {
    for (var i = 0; i < data.length; i++) {
        if (i === 30) {
            console.log(i + " " + data[i]);
        }
    }
});
