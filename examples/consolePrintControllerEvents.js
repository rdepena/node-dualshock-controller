var printcontrollerEvents = function (controller, controllerConfiguration) {
    'use strict';
    controller.on('left:move', function(data) {
        console.log('left Moved');
        console.log(data);
    });
    controller.on('right:move', function(data) {
        console.log('right Moved');
        console.log(data);
    });
    controller.on('connected', function(data) {
        console.log('connected');
    });

    controller.on('error', function (data) {
        console.log(data);
    });

    var pressed = function (data) {
        console.log(data + ": press");
    };
    var released = function (data) {
        console.log(data + ": release");
    };
    var analog = function (data) {
        console.log(data + ": analog");
    };

    var motion = function (motionInput, data) {
        console.log(motionInput);
        console.log(data);
    };
    //subscribe to all the buttons:
    for (var i = 0; i < controllerConfiguration.buttons.length; i++) {
        controller.on(controllerConfiguration.buttons[i].name + ":press", pressed);
        controller.on(controllerConfiguration.buttons[i].name + ":release", released);
        controller.on(controllerConfiguration.buttons[i].name +":analog", analog);
    }

    controller.on('rightLeft' + ':motion', function (data) {
        motion('rightLeft', data);
    });

    //once everything is ready we call connect()
    controller.connect();
};

module.exports = printcontrollerEvents;


