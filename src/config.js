'use strict';
// Module dependencies.
// we will expose these objects via the manager.
var options,
    controllerConfig;

//provides access to the current options and configs.
var config = {
    setOptions: function(opts) {
        //no options were passed
        options = opts || {};

        // Defaults:
        var defaultValues = {
            config: "dualShock3",
            accelerometerSmoothing: true,
            analogStickSmoothing: false,
            logging: false,
            forceNodeHid: false,
            linuxJoystickId: 0
        };

        for (var name in defaultValues) {
            if (defaultValues.hasOwnProperty(name)) {
                var target = options[name];
                var orig = defaultValues[name];

                if (!target) {
                    options[name] = orig;
                }
            }
        }

        var controllerConfiguration;
        //use passed config or load from built-in configs
        if (typeof options.config === "object") {
            controllerConfiguration = options.config;
        } else {
            controllerConfiguration = require('./../controllerConfigurations/' + options.config);
        }

        //set the current controllerConfiguration
        config.setControllerConfig(controllerConfiguration);
    },
    getOptions: function() {
        return options;
    },
    setControllerConfig: function(config) {
        controllerConfig = config;
    },
    getControllerConfig: function() {
        return controllerConfig;
    }
};

module.exports = config;
