// Module dependencies.
var Smoothing = require('../lib/smoothing');

module.exports = {
    setUp: function (callback) {
        this.smoothing = new Smoothing(true);
        this.nonSmoothing = new Smoothing(false);

        //an instance should have the following functions.
        this.instance = [{
            name: 'readLastPosition'
        }, {
            name: 'addToBuffer'
        }, {
            name: 'smooth'
        }];
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    //test that the object has the right properties
    shape: function (test) {
        //make sure we find these functions.
        this.instance.forEach(function(method) {
            test.equal(typeof this.smoothing[method.name], 'function');
        }, this);

        test.done();
    },
    //test that the the last position can be read.
    readLastPosition: function (test) {
        //we add values to the buffer for different names
        this.smoothing.addToBuffer('one', 1);
        this.smoothing.addToBuffer('two', 4);

        test.equal(this.smoothing.readLastPosition('one'), 1);
        test.equal(this.smoothing.readLastPosition('two'), 4);
        test.done();
    },
    //test that the buffer stores information for each key seperately.
    buffer: function (test) {
        this.smoothing.addToBuffer('one', 2);
        this.smoothing.addToBuffer('one', 6);
        this.smoothing.addToBuffer('two', 2);
        this.smoothing.addToBuffer('two', 7);

        test.equal(this.smoothing.readLastPosition('one'), 6);
        test.equal(this.smoothing.readLastPosition('two'), 7);
        test.done();
    },
    //test that the smoothing operation works as expected
    smoothing: function (test) {
        for (var i = 0; i < 5; i++) {
            this.smoothing.addToBuffer('testSmoothing', i);
        }
        //with this data set smoothing of 6 should be 3.
        test.equal(this.smoothing.smooth('testSmoothing', 6), 3);
        //with this data set smoothing of 8 should be 4.
        test.equal(this.smoothing.smooth('testSmoothing', 8), 4);

        test.done();
    },
    //test that passing false to the constructor will de-activate the smoothing.
    nonSmoothing: function (test) {
        for (var i = 0; i < 5; i++) {
            this.nonSmoothing.addToBuffer('testNonSmoothing', i);
        }
        //with smoothing turned off 9 should return 9
        test.equal(this.nonSmoothing.smooth('testNonSmoothing', 9), 9);
        //with smoothing turned off 6 should return 6
        test.equal(this.nonSmoothing.smooth('testNonSmoothing', 6), 6);

        test.done();
    }
};
