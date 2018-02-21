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
class Midi {
    constructor() {
        this.internalClock = false;
        this.externalClock = true;
        this.bpm = 0;
        this.nanoSecondsPerBeat = 0;
    }
    init(handleMidiNoteOn, handleMidiCCmessage, handleClock) {
        return __awaiter(this, void 0, void 0, function* () {
            this.channel = defaults_1.default.channel;
            this.input = this.setupMidiIn(defaults_1.default.midiDeviceName, this.inputs);
            this.output = this.setupMidiOut(defaults_1.default.midiDeviceName, this.outputs);
            this.midiOut = this.makeMidiOutput(this.outputs);
            this.clockCallback = handleClock;
            this.lastClockTime = process.hrtime();
            if (this.input) {
                this.input.on("noteon", handleMidiNoteOn);
                this.input.on("cc", handleMidiCCmessage);
            }
            this.setBPM(120);
        });
    }
    update() {
        if (this.internalClock) {
            if (process.hrtime(this.lastClockTime)[1] >= this.nanoSecondsPerBeat) {
                this.lastClockTime = process.hrtime();
                this.clockCallback();
            }
        }
    }
    setBPM(newBPM) {
        this.bpm = newBPM;
        this.nanoSecondsPerBeat = 1000 / (this.bpm / 60) * 1000000;
    }
    setupMidiIn(device, inputs) {
        console.log("Setting up Midi In");
        if (!inputs || inputs.length < 1) {
            console.log("No midi inputs found, exiting.");
            return;
        }
        let arr = inputs.filter((input) => (input.indexOf(device) === 0));
        if (arr.length > 0) {
            return null;
        }
        else {
            console.log("no midi input with device name: " + device);
        }
    }
    setupMidiOut(device, outputs) {
        console.log("Setting up Midi Out");
        if (!outputs || outputs.length < 1) {
            console.log("No midi outputs found, exiting.");
            return;
        }
        let arr = outputs.filter((output) => (output.indexOf(device) === 0));
        if (arr.length > 0) {
            return null;
        }
        else {
            console.log("no midi output with device name: " + device);
        }
    }
    makeMidiOutput(outputs) {
        if (!outputs || outputs.length < 1) {
            return;
        }
        let arr = outputs.filter((output) => (output.indexOf(defaults_1.default.midiDeviceName) !== 0));
        if (arr.length > 0) {
            console.log("midi output to device: " + arr[arr.length - 1]);
            return null;
        }
        else {
            console.log("no non launchpad midi devices connected");
        }
    }
    startInternalClock() {
        this.externalClock = false;
        this.internalClock = true;
    }
    stopInternalClock() {
        this.externalClock = true;
        this.internalClock = false;
    }
    sendNote(note, velocity, channel) {
        if (this.midiOut !== undefined) {
            this.midiOut.send("noteon", {
                note,
                velocity,
                channel
            });
        }
    }
    sendCC(controller, value, channel) {
        if (this.midiOut !== undefined) {
            this.midiOut.send("cc", {
                controller,
                value,
                channel
            });
        }
    }
}
exports.default = Midi;
;
//# sourceMappingURL=Midi.js.map