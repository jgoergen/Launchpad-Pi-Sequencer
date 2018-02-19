"use strict";
exports.__esModule = true;
var onoff_1 = require("onoff");
var gpio = function () {
    var outputPins;
    var triggerGPIO;
    var clockOut;
    var clockIn;
    var clockSwitch;
    var resetIn;
    var powerSwitch;
    function init(shutdown, handleClockSwitch, handleResetIn) {
        // configure pins
        console.log("Configuring GPIO Pins");
        outputPins = [18, 4, 17, 23, 25, 5, 13, 21];
        triggerGPIO = outputPins.map(function (pin) {
            return new onoff_1.Gpio(pin, "out");
        });
        clockOut = new onoff_1.Gpio(27, "out");
        clockIn = new onoff_1.Gpio(24, "in", "falling");
        clockSwitch = new onoff_1.Gpio(6, "in", "both");
        resetIn = new onoff_1.Gpio(16, "in", "falling");
        powerSwitch = new onoff_1.Gpio(20, "in", "rising");
        triggerGPIO.forEach(function (pin) {
            pin.write(1, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
        clockOut.write(1, function (err) {
            if (err) {
                console.log(err);
            }
        });
        powerSwitch.watch(shutdown);
        clockSwitch.read(handleClockSwitch);
        clockSwitch.watch(handleClockSwitch);
        resetIn.watch(handleResetIn);
    }
    return {
        init: init
    };
};
exports["default"] = gpio;
