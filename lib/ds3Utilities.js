var ds3Utilities = {
    //noticed there was a bit on noise from the controller.
    isWithinVariance : function (x, y, varianceThreshhold) {
        return Math.abs(x - y) > varianceThreshhold;
    }
};

module.exports = ds3Utilities;