var dualShock3_test = {
	setUp: function (callback) {
		this.dualShock3 = require("../lib/dualShock3.js");
		callback();
	},
	tearDown: function (callback) {
		callback();
	},
	testOne : function (test) {
		var dialshockController = this.dualShock3();
		test.expect(1);
		test.ok(true);
		test.done();
	}
};
module.exports = dualShock3_test;