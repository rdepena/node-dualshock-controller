// Module dependencies.

//provide a few utility functions.
var ds3Utilities = function () {
    'use strict';

    var that = this;

    // Public methods
    //reduces noise from the controller.
    that.isWithinVariance = function (x, y, varianceThreshhold) {
        return Math.abs(x - y) > varianceThreshhold;
    };

    return that;
};

module.exports = ds3Utilities;
