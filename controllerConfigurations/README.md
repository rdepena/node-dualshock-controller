These json files are used to map the controller inputs:
=========================

##To add a new controller:

##use DeviceDiscoveryHelp.js
In the examples folder there is a file called deviceDiscoveryHelp.js that I used to create the existing files.

###To connect the right controller
the vendorId and the productId need to be set to the right values, you can use node-hid to determine what these are.

###Analogs are mapped as:
leftAnalogY, leftAnalogX
rightAnalogY, rightAnalogX

###Buttons are usually grouped by a block but should be added as:

~~~~ js
"buttonName": {
	"buttonBlock": int representing the button block,
	"buttonValue": bit value,
	"analogPin": int representing the pin used for analog.
}