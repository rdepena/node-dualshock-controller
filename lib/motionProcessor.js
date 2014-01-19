/**
 * Module dependencies.
 */
var ds3Utilities = require('./ds3Utilities');

var motionProcessor = function () {
    var my = {};
    var controllerEmmiter = {};
    var configuration = {};
    var varianceThreshhold = 1;
    var buffer = {};

    /**
    * Private methods
    */
    var processAxis = function (motionAxis, data) {

        //every motion will have a dirrection and a value
        var motion = {
            direction : data[motionAxis.directionPin],
            value : data[motionAxis.valuePin]
        };

        //some data corrections so that each dirrection has a 0 throug x value
        if (motion.direction === 1) {
            motion.value = 255 - motion.value;
        }

        //check if the values are within variance
        if(ds3Utilities.isWithinVariance(buffer[motionAxis.name], motion.value, varianceThreshhold)) {
            controllerEmmiter.emit(motionAxis.name + ':motion', motion);
        }

        //buffer will hold the current value to compare on the next call.
        buffer[motionAxis.name] = motion.value;

    };

    /**
    * Public methods
    */
    //init the MotionProcessor.
    my.init = function (eventEmmiter, controllerConfiguration) {
        controllerEmmiter = eventEmmiter;
        configuration = controllerConfiguration;
    };

    //process all configured motion inputs.
    my.processMotionEvents = function (data) {
        for(var i = 0; i < configuration.motionInputs.length; i++) {
            processAxis(configuration.motionInputs[i], data);
        }
    };

    return my;
};

module.exports = motionProcessor();