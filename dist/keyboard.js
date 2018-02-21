"use strict";
exports.__esModule = true;
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.prototype.init = function () {
        this.running = false;
        this.toggle = true;
        this.mode = "normal";
    };
    Keyboard.prototype.update = function (display, midi) {
        if (this.running) {
            if (this.toggle) {
                display.setPad(1, display.brightRunner);
            }
            else {
                display.setPad(1, display.darkRunner);
            }
            this.toggle = !this.toggle;
        }
    };
    return Keyboard;
}());
exports["default"] = Keyboard;
;
//# sourceMappingURL=Keyboard.js.map