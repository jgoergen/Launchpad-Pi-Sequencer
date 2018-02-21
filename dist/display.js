"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var Sequencer = (function () {
    function Sequencer() {
        this.channel = defaults_1["default"].channel;
        this.dark = defaults_1["default"].dark;
        this.darkRunner = defaults_1["default"].darkRunner;
        this.brightRunner = defaults_1["default"].brightRunner;
        this.trackColors = defaults_1["default"].trackColors.slice();
        this.pads = defaults_1["default"].pads.slice();
        this.trackPads = defaults_1["default"].trackPads.slice();
        this.controlPads = defaults_1["default"].controlPads.slice();
        this.lastDisplay = {
            pads: [
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1
            ],
            tracks: [-1, -1, -1, -1, -1, -1, -1, -1],
            controls: [-1, -1, -1, -1, -1, -1, -1, -1]
        };
        this.nextDisplay = {
            pads: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            tracks: [0, 0, 0, 0, 0, 0, 0, 0],
            controls: [0, 0, 0, 0, 0, 0, 0, 0]
        };
    }
    Sequencer.prototype.init = function (midi) {
        this.midiRef = midi;
    };
    Sequencer.prototype.update = function () {
        for (var i = 0; i < this.nextDisplay.pads.length; i++) {
            if (this.lastDisplay.pads[i] !== this.nextDisplay.pads[i]) {
                this.changePad(this.pads[i], this.nextDisplay.pads[i]);
                this.lastDisplay.pads[i] = this.nextDisplay.pads[i];
            }
        }
        for (var i = 0; i < this.nextDisplay.tracks.length; i++) {
            if (this.lastDisplay.tracks[i] !== this.nextDisplay.tracks[i]) {
                this.changePad(this.trackPads[i], this.nextDisplay.tracks[i]);
                this.lastDisplay.tracks[i] = this.nextDisplay.tracks[i];
            }
        }
        for (var i = 0; i < this.nextDisplay.controls.length; i++) {
            if (this.lastDisplay.controls[i] !== this.nextDisplay.controls[i]) {
                this.changeControl(this.controlPads[i], this.nextDisplay.controls[i]);
                this.lastDisplay.controls[i] = this.nextDisplay.controls[i];
            }
        }
    };
    Sequencer.prototype.changePad = function (pad, color) {
        this.midiRef.sendNote(pad, color, this.channel);
    };
    Sequencer.prototype.changeControl = function (pad, color) {
        this.midiRef.sendCC(pad, color, this.channel);
    };
    Sequencer.prototype.setPad = function (which, value) {
        this.nextDisplay.pads[which] = value;
    };
    Sequencer.prototype.setTrackPad = function (which, value) {
        this.nextDisplay.trackPads[which] = value;
    };
    Sequencer.prototype.setControlPad = function (which, value) {
        this.nextDisplay.controlPads[which] = value;
    };
    return Sequencer;
}());
exports["default"] = Sequencer;
;
//# sourceMappingURL=Display.js.map