"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./defaults");
class Sequencer {
    constructor() {
        this.channel = defaults_1.default.channel;
        this.dark = defaults_1.default.dark;
        this.darkRunner = defaults_1.default.darkRunner;
        this.brightRunner = defaults_1.default.brightRunner;
        this.trackColors = defaults_1.default.trackColors.slice();
        this.pads = defaults_1.default.pads.slice();
        this.trackPads = defaults_1.default.trackPads.slice();
        this.controlPads = defaults_1.default.controlPads.slice();
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
    init(midi) {
        return __awaiter(this, void 0, void 0, function* () {
            this.midiRef = midi;
        });
    }
    update() {
        for (let i = 0; i < this.nextDisplay.pads.length; i++) {
            if (this.lastDisplay.pads[i] !== this.nextDisplay.pads[i]) {
                this.changePad(this.pads[i], this.nextDisplay.pads[i]);
                this.lastDisplay.pads[i] = this.nextDisplay.pads[i];
            }
        }
        for (let i = 0; i < this.nextDisplay.tracks.length; i++) {
            if (this.lastDisplay.tracks[i] !== this.nextDisplay.tracks[i]) {
                this.changePad(this.trackPads[i], this.nextDisplay.tracks[i]);
                this.lastDisplay.tracks[i] = this.nextDisplay.tracks[i];
            }
        }
        for (let i = 0; i < this.nextDisplay.controls.length; i++) {
            if (this.lastDisplay.controls[i] !== this.nextDisplay.controls[i]) {
                this.changeControl(this.controlPads[i], this.nextDisplay.controls[i]);
                this.lastDisplay.controls[i] = this.nextDisplay.controls[i];
            }
        }
    }
    changePad(pad, color) {
        this.midiRef.sendNote(pad, color, this.channel);
    }
    changeControl(pad, color) {
        this.midiRef.sendCC(pad, color, this.channel);
    }
    setPad(which, value) {
        this.nextDisplay.pads[which] = value;
    }
    setTrackPad(which, value) {
        this.nextDisplay.trackPads[which] = value;
    }
    setControlPad(which, value) {
        this.nextDisplay.controlPads[which] = value;
    }
}
exports.default = Sequencer;
;
//# sourceMappingURL=Display.js.map