// Module dependencies.

var HID = require('node-hid'),
    linuxConnector = require('./linuxConnector');

var device = {

    getConnectedDevice : function (controllerConfig) {
        'use strict';
        //if controller is connected via usb and bt we will get both from node-hid
        var devices = HID.devices().filter(function (device) {
            return device.vendorId == controllerConfig.vendorId && device.productId == controllerConfig.productId;
        });

        //no node-hid controller discovered.
        if (devices.length < 1) {
            return linuxConnector.getConnectedDevice();
        } else {
            //choose the bluetooth device:
            var blueToothConnection = devices.filter(function (device) {
                return device.path.toLowerCase().indexOf('bluetooth') > -1;
            })[0];

            //this might not do. refactor this.
            var path = blueToothConnection ? blueToothConnection.path : devices[0].path;

            //we have a node-hid device but the path is not correct.
            if (path === '0001:000f:00') {
                return linuxConnector.getConnectedDevice();
            }
            return new HID.HID(path);
        }
    }
};

module.exports = device;
