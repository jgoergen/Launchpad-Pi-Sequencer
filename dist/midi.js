"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var Midi = (function () {
    function Midi() {
        this.internalClock = false;
        this.externalClock = true;
        this.bpm = 0;
        this.nanoSecondsPerBeat = 0;
    }
    Midi.prototype.init = function (handleMidiNoteOn, handleMidiCCmessage, handleClock) {
        this.channel = defaults_1["default"].channel;
        this.input = this.setupMidiIn(defaults_1["default"].midiDeviceName, this.inputs);
        this.output = this.setupMidiOut(defaults_1["default"].midiDeviceName, this.outputs);
        this.midiOut = this.makeMidiOutput(this.outputs);
        this.clockCallback = handleClock;
        this.lastClockTime = process.hrtime();
        if (this.input) {
            this.input.on("noteon", handleMidiNoteOn);
            this.input.on("cc", handleMidiCCmessage);
        }
        this.setBPM(80);
    };
    Midi.prototype.update = function () {
        if (this.internalClock) {
            if (process.hrtime(this.lastClockTime)[1] >= this.nanoSecondsPerBeat) {
                this.lastClockTime = process.hrtime();
                this.clockCallback();
            }
        }
    };
    Midi.prototype.setBPM = function (newBPM) {
        this.bpm = newBPM;
        this.nanoSecondsPerBeat = 1000 / (this.bpm / 60) * 1000000;
    };
    Midi.prototype.setupMidiIn = function (device, inputs) {
        console.log("Setting up Midi In");
        if (!inputs || inputs.length < 1) {
            console.log("No midi inputs found, exiting.");
            return;
        }
        var arr = inputs.filter(function (input) {
            return (input.indexOf(device) === 0);
        });
        if (arr.length > 0) {
            return null;
        }
        else {
            console.log("no midi input with device name: " + device);
        }
    };
    Midi.prototype.setupMidiOut = function (device, outputs) {
        console.log("Setting up Midi Out");
        if (!outputs || outputs.length < 1) {
            console.log("No midi outputs found, exiting.");
            return;
        }
        var arr = outputs.filter(function (output) {
            return (output.indexOf(device) === 0);
        });
        if (arr.length > 0) {
            return null;
        }
        else {
            console.log("no midi output with device name: " + device);
        }
    };
    Midi.prototype.makeMidiOutput = function (outputs) {
        if (!outputs || outputs.length < 1) {
            return;
        }
        var arr = outputs.filter(function (output) {
            return (output.indexOf(defaults_1["default"].midiDeviceName) !== 0);
        });
        if (arr.length > 0) {
            console.log("midi output to device: " + arr[arr.length - 1]);
            return null;
        }
        else {
            console.log("no non launchpad midi devices connected");
        }
    };
    Midi.prototype.startInternalClock = function () {
        this.externalClock = false;
        this.internalClock = true;
    };
    Midi.prototype.stopInternalClock = function () {
        this.externalClock = true;
        this.internalClock = false;
    };
    Midi.prototype.sendNote = function (note, velocity, channel) {
        if (this.midiOut !== undefined) {
            this.midiOut.send("noteon", {
                note: note,
                velocity: velocity,
                channel: channel
            });
        }
    };
    Midi.prototype.sendCC = function (controller, value, channel) {
        if (this.midiOut !== undefined) {
            this.midiOut.send("cc", {
                controller: controller,
                value: value,
                channel: channel
            });
        }
    };
    return Midi;
}());
exports["default"] = Midi;
;
//# sourceMappingURL=Midi.js.map