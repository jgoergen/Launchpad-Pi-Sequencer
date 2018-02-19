"use strict";
exports.__esModule = true;
var easymidi_1 = require("easymidi");
var defaults_1 = require("./defaults");
var gpio_1 = require("./gpio");
var midi = function () {
    var inputs;
    var outputs;
    var input;
    var output;
    var midiOut;
    var channel;
    var clockCallback;
    var internalClock = false;
    var externalClock = false;
    var bpm = 120;
    var lastClockTime;
    function init(handleMidiNoteOn, handleMidiCCmessage, handleClock) {
        channel = defaults_1["default"].channel;
        // autoconfigure midi inputs and outputs
        inputs = easymidi_1["default"].getInputs();
        outputs = easymidi_1["default"].getOutputs();
        input = setupMidiIn(defaults_1["default"].midiDeviceName, inputs);
        output = setupMidiOut(defaults_1["default"].midiDeviceName, outputs);
        midiOut = makeMidiOutput(outputs);
        clockCallback = handleClock;
        lastClockTime = process.hrtime();
        // handle button pushes
        input.on("noteon", handleMidiNoteOn);
        input.on("cc", handleMidiCCmessage);
        /*
        // file data

        let fileData: any =
            fs.readFileSync(
                __dirname + "/midiConfig.json",
                "utf8");

        midiOutNotes = JSON.parse(fileData);
        */
    }
    function update() {
        if (internalClock) {
            // has enough ms passed since the last clock message? if so, fire a midi update
            if (process.hrtime(lastClockTime)[0] >= 60000 / bpm) {
                lastClockTime = process.hrtime();
                clockCallback();
            }
        }
    }
    function setupMidiIn(device, inputs) {
        console.log("Setting up Midi In");
        var arr = inputs.filter(function (input) {
            return (input.indexOf(device) === 0);
        });
        if (arr.length > 0) {
            return new easymidi_1["default"].Input(arr[0]);
        }
        else {
            console.log("no midi input with device name: " + device);
        }
    }
    function setupMidiOut(device, outputs) {
        console.log("Setting up Midi Out");
        var arr = outputs.filter(function (output) {
            return (output.indexOf(device) === 0);
        });
        if (arr.length > 0) {
            return new easymidi_1["default"].Output(arr[0]);
        }
        else {
            console.log("no midi output with device name: " + device);
        }
    }
    function makeMidiOutput(outputs) {
        var arr = outputs.filter(function (output) {
            return (output.indexOf(defaults_1["default"].midiDeviceName) !== 0);
        });
        if (arr.length > 0) {
            console.log("midi output to device: " + arr[arr.length - 1]);
            return new easymidi_1["default"].Output(arr[arr.length - 1]);
        }
        else {
            console.log("no non launchpad midi devices connected");
        }
    }
    function startInternalClock() {
        externalClock = true;
        internalClock = false;
        gpio_1["default"].clockIn.watch(clockCallback);
    }
    function stopInternalClock() {
        externalClock = false;
        gpio_1["default"].clockIn.unwatch();
    }
    function sendNote(note, velocity, channel) {
        if (midiOut !== undefined) {
            midiOut.send("noteon", {
                note: note,
                velocity: velocity,
                channel: channel
            });
        }
    }
    return {
        init: init,
        update: update,
        startInternalClock: startInternalClock,
        stopInternalClock: stopInternalClock,
        sendNote: sendNote
    };
};
exports["default"] = midi;
