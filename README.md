node-dualshock-controller
=========================
[![Build Status](https://travis-ci.org/rdepena/node-dualshock-controller.png?branch=master)](https://travis-ci.org/rdepena/node-dualshock-controller) [![Code Climate](https://codeclimate.com/github/rdepena/node-dualshock-controller.png)](https://codeclimate.com/github/rdepena/node-dualshock-controller)

`dualshock-controller` is a node library that exposes events from a ps3 (ps4 partially supported) dualshock controller connected.

## Installation:

### Linux Requirements:

    * libudev-dev

### Run npm command: ###

    $ npm install dualshock-controller
    
    
### Connecting the controller

Obviously the controller needs to be connected but you can connect the dualshock controllers in two ways:

Via Bluetooth: just make sure you pair with the controller via bluetooth.

Via USB: once the controller is connected to the computer make sure you press the playstation button located in the center of the controller. Important: THE CONTROLLER WILL NOT SEND ANY DATA IF YOU DO NOT PRESS THE PS BUTTON.


### Use the DualShock library

~~~~ js
var dualShock = require('dualshock-controller');

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
controller.on('error', err => console.log(err));

//connect the controller
controller.connect();

//add event handlers:
controller.on('left:move', data => console.log('left Moved: ' + data.x + ' | ' + data.y));

controller.on('right:move', data => console.log('right Moved: ' + data.x + ' | ' + data.y));

controller.on('connected', () => console.log('connected'));

controller.on('square:press', ()=> console.log('square press'));

controller.on('square:release', () => console.log('square release'));

//sixasis motion events:
//the object returned from each of the movement events is as follows:
//{
//    direction : values can be: 1 for right, forward and up. 2 for left, backwards and down.
//    value : values will be from 0 to 120 for directions right, forward and up and from 0 to -120 for left, backwards and down.
//}

//right-left movement
controller.on('rightLeft:motion', data => console.log(data));

//forward-back movement
controller.on('forwardBackward:motion', data => console.log(data));

//up-down movement
controller.on('upDown:motion', data => console.log(data));

//controller status
//as of version 0.6.2 you can get the battery %, if the controller is connected and if the controller is charging
controller.on('battery:change', data => console.log(data));

controller.on('connection:change', data => console.log(data));

controller.on('charging:change', data => console.log(data));

~~~~

The MIT License (MIT)

Copyright (c) 2016 Ricardo de Pena

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
