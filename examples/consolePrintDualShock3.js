'use strict';
var dualShock = require('./../src/dualshock.js');
var dualShock3;

//init the controller
dualShock3 = dualShock({
    analogStickSmoothing: false,
    config: "dualShock3",
    logging: true
});

// //for a client implementation we do not need this, this is only to test the inputs.
var controllerConfiguration = require('./../controllerConfigurations/dualShock3');

// //init the print events
var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock3, controllerConfiguration);

dualShock3.on("dpadup:press", () => {
    dualShock3.setExtras({
        led: 2
    });
});

dualShock3.on("dpadright:press", () => {
    dualShock3.setExtras({
        led: 4
    });
});

dualShock3.on("dpaddown:press", () => {
    dualShock3.setExtras({
        led: 8
    });
});

dualShock3.on("dpadleft:press", () => {
    dualShock3.setExtras({
        led: 16
    });
});

dualShock3.on("r2:analog", (d) => {
    dualShock3.setExtras({
        rumbleRight: d
    });
});

dualShock3.on("l2:press", (d) => {
    dualShock3.setExtras({
        rumbleLeft: 1
    });
});
