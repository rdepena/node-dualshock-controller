var conrollerConfiguration = { 
	"analogsPresent" : true,
	"leftAnalogY" : 7,
	"leftAnalogX" : 6,
	"rightAnalogY" : 8,
	"rightAnalogX" : 9,
	"buttonBlockTwo" : 2,
	"buttonBlockOne" : 3,
	"vendorId" : 1356,
	"productId" : 616,
	"buttons" : {
		"l2": {
			"buttonBlock": 3,
			"buttonValue": 0x01
		},
		"r2":{
			"buttonBlock": 3,
			"buttonValue": 0x02
		},
		"l1":{
			"buttonBlock": 3,
			"buttonValue": 0x04
		},
		"r1":{
			"buttonBlock": 3,
			"buttonValue": 0x08
		},
		"triangle":{
			"buttonBlock": 3,
			"buttonValue": 0x10
		},
		"circle":{
			"buttonBlock": 3,
			"buttonValue": 0x20
		},
		"x":{
			"buttonBlock": 3,
			"buttonValue": 0x40
		},
		"square":{
			"buttonBlock": 3,
			"buttonValue": 0x80
		},
		"select":{
			"buttonBlock": 2,
			"buttonValue": 0x1
		},
		"leftAnalogBumb":{
			"buttonBlock": 2,
			"buttonValue": 0x2
		},
		"rightAnalogBump":{
			"buttonBlock": 2,
			"buttonValue": 0x4
		},
		"start":{
			"buttonBlock": 2,
			"buttonValue": 0x08
		},
		"dpadUp":{
			"buttonBlock": 2,
			"buttonValue": 0x10
		},
		"dpadRight":{
			"buttonBlock": 2,
			"buttonValue": 0x20
		},
		"dpadDown" : {
			"buttonBlock": 2,
			"buttonValue" : 0x40
		},
		"dpadLeft":{	
			"buttonBlock": 2,
			"buttonValue": 0x80
		},
		"psxButton":{
			"buttonBlock":4,
			"buttonValue": 0x01
		}
	}
}
module.exports = conrollerConfiguration;
