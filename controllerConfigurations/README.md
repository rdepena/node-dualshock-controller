These json files are used to map the controller:
=========================

##To add a new controller:
Use DeviceDiscoveryHelp.js in the examples folder, using node-hid you can obtain the values you need to create a controller.json file and leverage the library to wire it up.

###To connect the right controller
the vendorId and the productId need to be set to the right values, you can use node-hid to determine what these are.

###Analogs are mapped as:
~~~~ js
"analogSticks" : [
    {
        "name" : "left",
        "x" : 7,
        "y" : 6
    },
    {
        "name" : "right",
        "x" : 9,
        "y" : 8
    }
]

###Buttons are usually grouped by a block but should be added as:

~~~~ js
"buttons" : [
    {
        "name": name of the button used for events,
        "buttonBlock": int representing the button block,
        "buttonValue": bit value,
        "analogPin" : int representing the pin used for analog.
    },
]
