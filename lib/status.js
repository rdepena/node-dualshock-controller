'use strict';
// Module dependencies.

var config = require('./config');

//Proccess button events.
var Status = function(eventEmmiter) {

    var buffer = {},
        statusConfiguration = config.getControllerConfig().status;

    var processControllerStatus = function(category, data) {
        var statusValue;
        for (var i = 0; i < category.states.length; i++) {
            if (data[category.pin] === category.states[i].value) {
                statusValue = category.states[i].state;
            }
        }
        if (buffer[category.name] !== statusValue) {
            eventEmmiter.emit(category.name + ':change', statusValue);
        }
        buffer[category.name] = statusValue;
    };

    this.process = function(data) {
        for (var i = 0; i < statusConfiguration.length; i++) {
            processControllerStatus(statusConfiguration[i], data);
        }
    };
};

module.exports = Status;
