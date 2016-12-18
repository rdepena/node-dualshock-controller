'use strict';
var dualShock = require('./../lib/dualshock.js');

//init the controller
// var dualShock3 = dualShock({
//     forceNodeHid: true
// });

var dualShock3 = dualShock();

//for a client implementation we do not need this, this is only to test the inputs.
var controllerConfiguration = require('./../controllerConfigurations/dualShock3');

//init the print events
var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock3, controllerConfiguration);

var leftRumble = 0,
    rightRumble = 0;

console.log("Hey I just started");

dualShock3.on('l2:press', function() {
    leftRumble = 1;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('square:press', function() {
    rightRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('triangle:press', function() {
    rightRumble = 64;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('circle:press', function() {
    rightRumble = 132;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('x:press', function() {
    rightRumble = 255;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('l2:release', function() {
    leftRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('square:release', function() {
    rightRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('triangle:release', function() {
    rightRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('circle:release', function() {
    rightRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});
dualShock3.on('x:release', function() {
    rightRumble = 0;
    dualShock3.rumble(leftRumble, rightRumble);
});

dualShock3.on('dpadUp:press', function() {
    console.log("one");
    dualShock3.ledOn("one");
});

dualShock3.on('dpadUp:release', function() {
    dualShock3.ledOff("one");
});

dualShock3.on('dpadRight:press', function() {
    console.log("two");
    dualShock3.ledOn("two");
});
dualShock3.on('dpadRight:release', function() {
    dualShock3.ledOff("two");
});

dualShock3.on('dpadDown:press', function() {
    dualShock3.ledOn("three");
});

dualShock3.on('dpadDown:release', function() {
    dualShock3.ledOff("three");
});

dualShock3.on('dpadLeft:press', function() {
    console.log("four");
    dualShock3.ledOn("four");
});

dualShock3.on('dpadLeft:release', function() {
    dualShock3.ledOff("four");
});

dualShock3.connect();

///NOTES: left side seems to output the same as long as the number is a odd number.
//valid values to Left side pass to rumble:
//0
// 1
// 3
// 5
//...255
//

//valid values for the right side:
// 0
// 64
// 132
// 255
