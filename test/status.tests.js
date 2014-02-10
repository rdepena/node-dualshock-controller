// Module dependencies.
var Status = require('../lib/status'),
    assert = require('assert');

describe('the status component', function () {
    var mockConfig = [{
        "name" : "chargingState",
        "pin" : 0,
        "states" : [
            {
                "value" : 0,
                "state" : "Charging"
            },
            {
                "value" : 2,
                "state" : "Charging"
            },
            {
                "value" : 3,
                "state" : "Not Charging"
            }
        ]
    }],
    instance = [{ name: 'process' }],
    status;

    beforeEach(function () {
        status = new Status(mockConfig);
    });

    describe('object instance', function () {
        it('should have the following shape', function () {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof status[method.name], 'function');
            });
        });
    });

    describe('process()', function () {
        it('process should return an object with the expected values', function () {
            for (var i = 0; i < mockConfig[0].states.length; i++) {
                var controllerStatus = status.process([mockConfig[0].states[i].value]);

                assert.equal(typeof controllerStatus.chargingState, 'string');
                assert.equal(controllerStatus.chargingState,mockConfig[0].states[i].state);
            }

        });
    });

});