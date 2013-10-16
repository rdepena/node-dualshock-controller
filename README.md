node-dualshock-controller
=========================

`node-dualshock-controller` is a node library that exposes events from a ps3 dualshock controller connected.

## Installation

Todo...

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
dualShock3.on('connect', function(data) {
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
