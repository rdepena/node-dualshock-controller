// Module dependencies.

var HID = require('node-hid'),
    LinuxConnector = require('./linuxConnector'),
    fs = require('fs');

// will discover the current connection and provide a node-hid connection or a linux fs connection.
var DeviceConnection = function () {

    //private members

    //this will obtain a node-hid device.
    var getNodeHidConnector = function (devices) {
        if (devices.length > 0) {
            //choose the bluetooth device:
            var blueToothConnection = devices.filter(function (device) {
                return device.path.toLowerCase().indexOf('bluetooth') > -1;
            })[0];

            //this might not do. refactor this.
            var path = blueToothConnection ? blueToothConnection.path : devices[0].path;

            //we have a node-hid device but the path is not correct.
            if (path !== '0002:0005:00') {
                return new HID.HID(path);
            }
        }
    };

    this.getConnectedDevice = function (controllerConfig) {
        'use strict';
        //if controller is connected via usb and bt we will get both from node-hid
        var connectedDevice,
            devices = HID.devices().filter(function (device) {
            return device.vendorId == controllerConfig.vendorId && device.productId == controllerConfig.productId;
        });

        //try to obtain a node-hid device connection.
        connectedDevice = getNodeHidConnector(devices);

        //no siutable node-hid device found, lets try linux native.
        if (!connectedDevice) {
            var linuxConnector = new LinuxConnector();
            connectedDevice = linuxConnector.getConnectedDevice(controllerConfig);
        }

        return connectedDevice;
    };

};

module.exports = DeviceConnection;
