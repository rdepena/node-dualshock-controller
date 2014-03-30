// Module dependencies.

var HID = require('node-hid');

var device = {

    getConnectedDevice : function (controllerConfig) {
        'use strict';
        //if controller is connected via usb and bt we will get both from node-hid
        var devices = HID.devices().filter(function (device) {
            return device.vendorId == controllerConfig.vendorId && device.productId == controllerConfig.productId;
        });

        //no node-hid controller discovered.
        if (devices.length < 1) {
            //do something here
            //need to do linux checks and all that jazz.
        } else {
            //choose the bluetooth device:
            var blueToothConnection = devices.filter(function (device) {
                return device.path.toLowerCase().indexOf('bluetooth') > -1;
            })[0];

            //this might not do. refactor this.
            var path = blueToothConnection ? blueToothConnection.path : devices[0].path;
            return new HID.HID(path);
        }
    }
};

module.exports = device;
