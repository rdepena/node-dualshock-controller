// Module dependencies.
var Status = require('../lib/status'),
    assert = require('assert'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    config = require('../lib/config');

describe('the status component', function() {
    var mockConfig = [{
        "name": "chargingState",
        "pin": 0,
        "states": [{
            "value": 0,
            "state": "Charging"
        }, {
            "value": 2,
            "state": "Charging"
        }, {
            "value": 3,
            "state": "40%"
        }]
    }],
        dataA = [0, 0],
        dataB = [0, 3],
        instance = [{
            name: 'process'
        }],
        status,
        emitter,
        spy;

    beforeEach(function() {
        emitter = new EventEmitter();
        spy = sinon.spy();
        config.setControllerConfig({
            status: mockConfig
        });
        status = new Status(emitter, mockConfig);
    });

    describe('object instance', function() {
        it('should have the following shape', function() {
            //make sure we find these functions.
            instance.forEach(function(method) {
                assert.equal(typeof status[method.name], 'function');
            });
        });
    });

    describe('process()', function() {
        it('process should return an object with the expected values', function() {
            emitter.on('chargingState:change', spy);
            status.process(dataA);
            var spyArgument = spy.args[0][0];
            assert.equal(typeof spyArgument, 'string');
            assert.equal(spyArgument, 'Charging');
            spyArgument = null;
        });
    });
});
