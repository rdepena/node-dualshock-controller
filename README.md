node-dualshock-controller
=========================

`dualshock-controller` is a node library that exposes events from a ps3 dualshock controller connected.

## Installation:

### Linux Requirements:
    
    * libudev-dev

### Run npm command:

    $ npm install dualshock-controller
    

    
## Guide 

###Use the DualShock3 library

~~~~ js
var dualShock3 = require('dualshock-controller');

//set event handlers:
dualShock3.on('left:move', function(data) {
  //...doStuff();
});
dualShock3.on('right:move', function(data) {
  //...doStuff();
});
dualShock3.on('connected', function(data) {
  //...doStuff();
});
dualShock3.on('square:pressed', function (data) {
  //...doStuff();
});
dualShock3.on('square:release', function (data) {
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
