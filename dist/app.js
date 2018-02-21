"use strict";
exports.__esModule = true;
var fs = require("fs");
var NanoTimer = require("nanotimer");
var defaults_1 = require("./defaults");
var Keyboard_1 = require("./Keyboard");
var Sequencer_1 = require("./Sequencer");
var Display_1 = require("./Display");
var Midi_1 = require("./Midi");
var GPIO_1 = require("./GPIO");
var midi = new Midi_1["default"]();
var gpio = new GPIO_1["default"]();
var display = new Display_1["default"]();
var keyboard = new Keyboard_1["default"]();
var sequencer = new Sequencer_1["default"]();
var settingsHeld = false;
var presetsHeld = false;
var pads = defaults_1["default"].pads.slice();
var trackPads = defaults_1["default"].trackPads.slice();
var controlPads = defaults_1["default"].controlPads.slice();
var presets = defaults_1["default"].presets.slice();
var loadDisplay = defaults_1["default"].loadDisplay.slice();
var saveDisplay = defaults_1["default"].saveDisplay.slice();
console.log("Initializing");
gpio.init(shutdown, handleClockSwitch, handleResetIn);
midi.init(handleMidiNoteOn, handleMidiCCmessage, handleClock);
display.init(midi);
keyboard.init();
sequencer.init();
presets = loadPresets();
var timer = new NanoTimer();
function loadPresets() {
    var presetFile = __dirname + "/presets.json";
    if (fs.existsSync(presetFile)) {
        var fileData = fs.readFileSync(presetFile, "utf8");
        return JSON.parse(fileData);
    }
    else {
        return "";
    }
}
function shutdown() {
    console.log("Shutting down.");
}
function handleClockSwitch(err, value) {
}
function handleResetIn(err, value) {
}
function handleMidiNoteOn(params) {
    var note = params.note;
    var velocity = params.velocity;
    console.log("Note On : '" + note + "' : " + velocity);
    if (velocity === 127) {
        if (trackPads.indexOf(note) !== -1) {
            console.log("track button " + trackPads.indexOf(note));
            changeTrack(trackPads.indexOf(note));
            return;
        }
        if (pads.indexOf(note) !== -1) {
            console.log("button on grid " + pads.indexOf(note));
            gridButtonPress(pads.indexOf(note));
        }
    }
}
function handleMidiCCmessage(params) {
    var cc = params.controller;
    var value = params.value;
    console.log("CC change : '" + cc + "' : " + value);
    if (value === 127) {
        switch (cc) {
            case controlPads[0]:
                break;
            case controlPads[1]:
                break;
            case controlPads[2]:
                break;
            case controlPads[3]:
                break;
            case controlPads[4]:
                break;
            case controlPads[5]:
                break;
            case controlPads[6]:
                break;
            case controlPads[7]:
                break;
        }
    }
    else if (value === 0) {
    }
}
function changeTrack(trackIndex) {
}
function gridButtonPress(button) {
}
function fireExternalClock() {
}
function handleClock(err, value) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Midi clock @ " + midi.bpm);
    keyboard.update(display, midi);
    sequencer.update(display, midi);
    if (midi.internalClock) {
        fireExternalClock();
    }
}
function update() {
    midi.update();
    display.update();
}
midi.startInternalClock();
timer.setInterval(update, [timer], "33ms");
//# sourceMappingURL=app.js.map