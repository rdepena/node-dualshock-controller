var printcontrollerEvents = function(controller, controllerConfiguration) {
    'use strict';
    controller.on('left:move', function(data) {
        console.log('left Moved');
        console.log(data);
    });
    controller.on('right:move', function(data) {
        console.log('right Moved');
        console.log(data);
    });
    controller.on('connected', function() {
        console.log('connected');
    });

    controller.on('error', function(data) {
        console.log(data);
    });

    var pressed = function(data) {
        console.log(data + ": press");
    };
    var released = function(data) {
        console.log(data + ": release");
    };
    var analog = function(data) {
        console.log(data + ": analog");
    };
    var hold = function(data) {
        console.log(data + ": hold");
    };
    var motion = function(motionInput, data) {
        console.log(motionInput);
        console.log(data);
    };
    //subscribe to all the buttons:
    for (var i = 0; i < controllerConfiguration.buttons.length; i++) {
        controller.on(controllerConfiguration.buttons[i].name + ":press", pressed);
        controller.on(controllerConfiguration.buttons[i].name + ":release", released);
        controller.on(controllerConfiguration.buttons[i].name + ":analog", analog);
        controller.on(controllerConfiguration.buttons[i].name + ":hold", hold);

    }
    //subscribe to all the status events:
    if (controllerConfiguration.status && controllerConfiguration.status.length) {
        for (i = 0; i < controllerConfiguration.status.length; i++) {
            controller.on(controllerConfiguration.status[i].name + ":change", console.log);
        }
    }
    //subscribe to the motion events.
    controller.on('rightLeft' + ':motion', function(data) {
        motion('rightLeft', data);
    });
    controller.on('forwardBackward' + ':motion', function(data) {
        motion('forwardBackward', data);
    });
    controller.on('upDown' + ':motion', function(data) {
        motion('upDown', data);
    });
    //once everything is ready we call connect()
    controller.connect();
};

module.exports = printcontrollerEvents;
