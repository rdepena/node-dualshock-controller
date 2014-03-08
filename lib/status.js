// Module dependencies.

//Proccess button events.
var Status = function (eventEmmiter, statusConfiguration) {
    'use strict';

    var buffer = {};

    var processControllerStatus = function (category, data) {
        var statusValue;
        category.states.forEach(function (conf) {
            if (data[category.pin] === conf.value) {
                statusValue = conf.state;
            }
        });
        if (buffer[category.name] !== statusValue) {
            eventEmmiter.emit(category.name + ':change', statusValue);
        }
        buffer[category.name] = statusValue;
    };

    this.process = function (data) {
        statusConfiguration.forEach(function (conf) {
            processControllerStatus(conf, data);
        });
    };
};

module.exports = Status;
