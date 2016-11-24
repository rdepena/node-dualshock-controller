'use strict';
// Module dependencies.

var config = require('./config');

//Proccess button events.
var Status = function(controller) {

    var buffer = {},
        status = config.getControllerConfig().status;

    var processControllerStatus = function(category, data) {
        var state;
        for (var i = 0; i < category.states.length; i++) {
            if (data[category.pin] === category.states[i].value) {
                state = category.states[i].state;
            }
        }

        if (buffer[category.name] !== state) {
            if (controller[category.name]) {
                controller[category.name].state = state;
            }
            controller.emit(category.name + ':change', state);
        }
        buffer[category.name] = state;
    };

    this.process = function(data) {
        for (var i = 0; i < status.length; i++) {
            processControllerStatus(status[i], data);
        }
    };
};

module.exports = Status;
