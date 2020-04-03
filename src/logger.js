'use strict';

const Logger = function(config) {
    this.config = config;
};

Logger.prototype.warn = function(message) {
    if (this.config.options.logging) {
        console.log(message);
    }
};

module.exports = Logger;
