'use strict';

const defaults = {
    config: "dualShock3",
    accelerometerSmoothing: true,
    analogStickSmoothing: false,
    logging: false,
    forceNodeHid: false,
    linuxJoystickId: 0,
};

const applyDefaults = function(opts) {
    var applied = Object.assign({}, opts);

    for (var name in defaults) {
        if (defaults.hasOwnProperty(name) && !(name in applied)) {
            applied[name] = defaults[name];
        }
    }

    return applied;
};

const resolveControllerConfiguration = function(opts) {
    if (typeof opts.config === "string") {
        return require('./../controllerConfigurations/' + opts.config);
    }

    return opts.config;
};

const Config = function(opts) {
    this.options = applyDefaults(opts || {});
    this.controller = resolveControllerConfiguration(this.options);
};

module.exports = Config;
