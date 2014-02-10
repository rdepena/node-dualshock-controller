// Module dependencies.

//Proccess button events.
var Status = function (statusConfiguration) {
    'use strict';

    var processControllerStatus = function (category, data) {
        var statusValue;
        for (var i = 0; i < category.states.length; i++) {
            if (data[category.pin] === category.states[i].value) {
                statusValue = category.states[i].state;
            }
        }
        return statusValue;
    };

    this.process = function (data) {
        var controllerStatus = {};

        for (var i = 0; i < statusConfiguration.length; i++) {
            controllerStatus[statusConfiguration[i].name] = processControllerStatus(statusConfiguration[i], data);
        }

        return controllerStatus;
    };

    return this;
};

module.exports = Status;