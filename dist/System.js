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
const fs = require("fs");
const defaults_1 = require("./defaults");
const Keyboard_1 = require("./Keyboard");
const Sequencer_1 = require("./Sequencer");
const Display_1 = require("./Display");
const Midi_1 = require("./Midi");
const GPIO_1 = require("./GPIO");
class System {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Initializing");
            this.settingsHeld = false;
            this.presetsHeld = false;
            this.midi = new Midi_1.default();
            this.gpio = new GPIO_1.default();
            this.display = new Display_1.default();
            this.keyboard = new Keyboard_1.default();
            this.sequencer = new Sequencer_1.default();
            this.pads = defaults_1.default.pads.slice();
            this.trackPads = defaults_1.default.trackPads.slice();
            this.controlPads = defaults_1.default.controlPads.slice();
            this.presets = defaults_1.default.presets.slice();
            this.loadDisplay = defaults_1.default.loadDisplay.slice();
            this.saveDisplay = defaults_1.default.saveDisplay.slice();
            yield this.gpio.init();
            yield this.midi.init((params) => this.handleMidiNoteOn(params), (params) => this.handleMidiCCmessage(params), (err, value) => this.handleClock(err, value));
            yield this.display.init(this.midi);
            yield this.keyboard.init(this.display, this.midi);
            yield this.sequencer.init(this.display, this.midi);
            this.presets = this.loadPresets();
        });
    }
    start() {
        console.log("Starting");
        this.midi.startInternalClock();
        setInterval(() => this.update(), 200);
    }
    loadPresets() {
        let presetFile = __dirname + "/presets.json";
        if (fs.existsSync(presetFile)) {
            let fileData = fs.readFileSync(presetFile, "utf8");
            return JSON.parse(fileData);
        }
        else {
            return "";
        }
    }
    handleMidiNoteOn(params) {
        let note = params.note;
        let velocity = params.velocity;
        console.log("Note On : '" + note + "' : " + velocity);
        if (velocity === 127) {
            if (this.trackPads.indexOf(note) !== -1) {
                console.log("track button " + this.trackPads.indexOf(note));
                this.changeTrack(this.trackPads.indexOf(note));
                return;
            }
            if (this.pads.indexOf(note) !== -1) {
                console.log("button on grid " + this.pads.indexOf(note));
                this.gridButtonPress(this.pads.indexOf(note));
            }
        }
    }
    handleMidiCCmessage(params) {
        let cc = params.controller;
        let value = params.value;
        console.log("CC change : '" + cc + "' : " + value);
        if (value === 127) {
            switch (cc) {
                case this.controlPads[0]:
                    break;
                case this.controlPads[1]:
                    break;
                case this.controlPads[2]:
                    break;
                case this.controlPads[3]:
                    break;
                case this.controlPads[4]:
                    break;
                case this.controlPads[5]:
                    break;
                case this.controlPads[6]:
                    break;
                case this.controlPads[7]:
                    break;
            }
        }
        else if (value === 0) {
        }
    }
    changeTrack(trackIndex) {
    }
    gridButtonPress(button) {
    }
    fireExternalClock() {
    }
    handleClock(err, value) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Midi clock @ " + this.midi.bpm);
        this.keyboard.update();
        this.sequencer.update();
        if (this.midi.internalClock) {
            this.fireExternalClock();
        }
    }
    update() {
        console.log("Main Update!");
        this.midi.update();
        this.display.update();
    }
}
exports.default = System;
;
//# sourceMappingURL=System.js.map