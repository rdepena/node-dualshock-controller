'use strict';
// Module dependencies.

var config = require('./config'),
    colors = require('colors'),
    _ = require('lodash');

//provide a few utility functions.
module.exports = {

    //reduces noise from the controller
    isWithinVariance: function(x, y, varianceThreshhold) {
        return Math.abs(x - y) > varianceThreshhold;
    },
    warn: function(message) {
        if (config.getOptions().logging) {
            console.log(message.yellow);
        }
    },
    generateEventPrefixAliases: function(eventPrefix) {
        return _.uniq([
            eventPrefix,
            eventPrefix.toLowerCase()
        ]);
    }
};
