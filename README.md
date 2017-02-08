node-dualshock-controller
=========================
[![Build Status](https://travis-ci.org/rdepena/node-dualshock-controller.png?branch=master)](https://travis-ci.org/rdepena/node-dualshock-controller) [![Code Climate](https://codeclimate.com/github/rdepena/node-dualshock-controller.png)](https://codeclimate.com/github/rdepena/node-dualshock-controller)

`dualshock-controller` Eventing API layer over HID for the Sony DualShock 3 and DualShock 4 controllers

## Installation:

#### OSX/Windows:

```bash
npm install dualshock-controller
```
#### Linux:

Review the [Linux support](#linux-support) section.

## Using the DualShock library

`Important: THE CONTROLLER WILL NOT SEND ANY DATA IF YOU DO NOT PRESS THE PS BUTTON.`

~~~~ javascript
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

//DualShock 4 control rumble and light settings for the controller
controller.setExtras({
  rumbleLeft:  0,   // 0-255 (Rumble left intensity)
  rumbleRight: 0,   // 0-255 (Rumble right intensity)
  red:         0,   // 0-255 (Red intensity)
  green:       75,  // 0-255 (Blue intensity)
  blue:        225, // 0-255 (Green intensity)
  flashOn:     40,  // 0-255 (Flash on time)
  flashOff:    10   // 0-255 (Flash off time)
});

//DualShock 3 control rumble and light settings for the controller
controller.setExtras({
  rumbleLeft:  0,   // 0-1 (Rumble left on/off)
  rumbleRight: 0,   // 0-255 (Rumble right intensity)
  led: 2 // 2 | 4 | 8 | 16 (Leds 1-4 on/off, bitmasked)
});

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

//DualShock 4 TouchPad
//finger 1 is x1 finger 2 is x2
controller.on('touchpad:x1:active', () => console.log('touchpad one finger active'));

controller.on('touchpad:x2:active', () => console.log('touchpad two fingers active'));

controller.on('touchpad:x2:inactive', () => console.log('touchpad back to single finger'));

controller.on('touchpad:x1', data => console.log('touchpad x1:', data.x, data.y));

controller.on('touchpad:x2', data => console.log('touchpad x2:', data.x, data.y));


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

## <a name="linux-support"></a> Linux support:

In order to provide Rumble/Gyro and LED support for all platforms the linux specific joystick implementation has been removed. This means you will need to:

* [Install node-hid build requirements](#node-hid-build)
* [Install node-hid with hidraw support](#node-hid-hidraw)
* [create udev rules](#create-udev-rules)

#### <a name="node-hid-build"></a> Install node-hid build requirements

To build node-hid you will need to install:

* libudev-dev
* libusb-1.0-0
* libusb-1.0-0-dev
* build-essential
* git
* node-gyp
* node-pre-gyp

Using apt-get:

```bash
sudo apt-get install libudev-dev libusb-1.0-0 libusb-1.0-0-dev build-essential git
```

```bash
npm install -g node-gyp node-pre-gyp
```

#### <a name="node-hid-hidraw"></a> Install node-hid with hidraw support

Once you have run the installation scripts above you can install the node-dualshock module, then replace the installed node-hid with hidraw support enabled node-hid:

```bash
npm install dualshock-controller
```

```bash
npm install node-hid --driver=hidraw --build-from-source
```

#### <a name="create-udev-rules"></a> Create udev rules

You will need to create a udev rule to be able to access the hid stream as a non root user.

Write the following file in `/etc/udev/rules.d/61-dualshock.rules`

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="0268", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"

SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="05c4", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"
```

Reload the rules `sudo udevadm control --reload-rules`, then disconnect/connect the controller.

The MIT License (MIT)

Copyright (c) 2017 Ricardo de Pena

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
