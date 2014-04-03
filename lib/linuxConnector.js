// Module dependencies.

var events = require('events'),
    util = require('util'),
    fs = require('fs');


var linuxConnector = {

    getConnectedDevice : function () {
        return fs.createReadStream('/dev/input/js0');
    };
};

module.exports = linuxConnector;
