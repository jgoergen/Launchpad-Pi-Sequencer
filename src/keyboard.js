"use strict";
exports.__esModule = true;
var display_1 = require("./display");
var keyboard = function () {
    var running;
    var toggle;
    var mode;
    function init() {
        running = false;
        toggle = true,
            mode = "normal";
    }
    function update() {
        if (running) {
            if (toggle) {
                display_1["default"].setPad(1, display_1["default"].brightRunner);
            }
            else {
                display_1["default"].setPad(1, display_1["default"].darkRunner);
            }
            toggle = !toggle;
        }
    }
    return {
        init: init,
        update: update
    };
};
exports["default"] = keyboard;
