'use strict';
var dualShock = require('./../src/dualshock.js');

var dualShock4 = dualShock({
    config: "dualShock4",
    logging: true
});

//for a client implementation we do not need this, this is only to test the inputs.
var controllerConfiguration = require('./../controllerConfigurations/dualShock4');

//init the print events
var consolePrintEvents = require('./consolePrintControllerEvents')(dualShock4, controllerConfiguration);

dualShock4.on("dpadup:press", () => {
    dualShock4.setExtras({
        red: 255
    });
});

dualShock4.on("dpadright:press", () => {
    dualShock4.setExtras({
        green: 255
    });
});

dualShock4.on("dpaddown:press", () => {
    dualShock4.setExtras({
        blue: 255
    });
});

dualShock4.on("dpadleft:press", () => {
    dualShock4.setExtras({
        red: 255,
        green: 255,
        blue: 255
    });
});

dualShock4.on("x:press", (d) => {
    dualShock4.setExtras({
        red: 255,
        flashOn: 50,
        flashOff: 10
    });
});

dualShock4.on("r2:analog", (d) => {
    dualShock4.setExtras({
        rumbleRight: d
    });
});

dualShock4.on("l2:analog", (d) => {
    dualShock4.setExtras({
        rumbleLeft: d
    });
});
