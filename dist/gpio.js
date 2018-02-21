"use strict";
exports.__esModule = true;
var GPIO = (function () {
    function GPIO() {
    }
    GPIO.prototype.init = function (shutdown, handleClockSwitch, handleResetIn) {
        return;
        console.log("Configuring GPIO Pins");
        this.outputPins = [18, 4, 17, 23, 25, 5, 13, 21];
        this.triggerGPIO = this.outputPins.map(function (pin) {
            return null;
        });
        this.clockOut = null;
        this.clockIn = null;
        this.clockSwitch = null;
        this.resetIn = null;
        this.powerSwitch = null;
        this.triggerGPIO.forEach(function (pin) {
            if (pin) {
                pin.write(1, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
        if (this.clockOut) {
            this.clockOut.write(1, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
        this.powerSwitch.watch(shutdown);
        this.clockSwitch.read(handleClockSwitch);
        this.clockSwitch.watch(handleClockSwitch);
        this.resetIn.watch(handleResetIn);
    };
    return GPIO;
}());
exports["default"] = GPIO;
;
//# sourceMappingURL=GPIO.js.map