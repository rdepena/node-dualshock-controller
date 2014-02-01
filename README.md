node-dualshock-controller
=========================

`dualshock-controller` is a node library that exposes events from a ps3 (ps4 partially supported) dualshock controller connected.

## Installation:

### Linux Requirements:

    * libudev-dev

### Run npm command:

    $ npm install dualshock-controller



## Guide

###Connecting the controller

Obviously the controller needs to be connected but you can connect the dualshock controllers in two ways:

Via Bluetooth: just make sure you pair with the controller via bluetooth.

Via USB: once the controller is connected to the computer make sure you press the playstation button located in the center of the controller. Important: THE CONTROLLER WILL NOT SEND ANY DATA IF YOU DO NOT PRESS THE PS BUTTON.


###Use the DualShock library

~~~~ js
var dualShock = require('dualshock-controller');

//as of version 0.2 you will need to init the controller
var dualShock3 = dualShock();

//this is because now you can use dualShock4 by passing the controller config file
var dualShock4 = dualShock(
    {
        config: "dualshock4-generic-driver"
    });

//pass options to init the controller.
var controller = dualShock(
    {
        //you can use a ds4 by uncommenting this line.
        //config: "dualshock4-generic-driver",
        //if using ds4 comment this line.
        config : "dualShock3",
        //smooths the output from the acelerometers (moving averages) defaults to true
        accelerometerSmoothing : true,
        //smooths the output from the analog sticks (moving averages) defaults to false
        analogStickSmoothing : false
    });

//make sure you add an error event handler
dualShock3.on('error', function(data) {
  //...someStuffDidNotWork();
});

//add event handlers:
dualShock3.on('left:move', function(data) {
  //...doStuff();
});
dualShock3.on('right:move', function(data) {
  //...doStuff();
});
dualShock3.on('connected', function(data) {
  //...doStuff();
});
//as of version 0.3 all events are in the same tense so "pressed" will not work.
dualShock3.on('square:press', function (data) {
  //...doStuff();
});
dualShock3.on('square:release', function (data) {
  //...doStuff();
});

//as of version 0.4 you can now subscribe to sixasis motion events:
//the object returned from each of the movement events is as follows:
//{
//    direction : values can be: 1 for right, forward and up. 2 for left, backwards and down.
//    value : values will be from 0 to 120 for directions right, forward and up and from 0 to -120 for left, backwards and down.
//}

//right-left movement
dualShock3.on('rightLeft:motion', function (data) {
    //...doStuff();
});

//forward-back movement
dualShock3.on('forwardBackward:motion', function (data) {
    //...doStuff();
});
//up-down movement
dualShock3.on('upDown:motion', function (data) {
    //...doStuff();
});

//connect the controller
dualShock3.connect();

~~~~

The MIT License (MIT)

Copyright (c) 2013 Ricardo de Pena

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
