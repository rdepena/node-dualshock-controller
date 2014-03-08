// Module dependencies.

//provide a few utility functions.
var ds3Utilities = function () {
    'use strict';

    // Public methods
    //reduces noise from the controller.
    this.isWithinVariance = function (x, y, varianceThreshhold) {
        return Math.abs(x - y) > varianceThreshhold;
    };
};

module.exports = ds3Utilities;
