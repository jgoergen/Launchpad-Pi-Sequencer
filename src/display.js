"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var midi_1 = require("./midi");
var sequencer = function () {
    // midi
    var channel = defaults_1["default"].channel;
    // color settings
    var dark = defaults_1["default"].dark;
    var darkRunner = defaults_1["default"].darkRunner;
    var brightRunner = defaults_1["default"].brightRunner;
    var trackColors = defaults_1["default"].trackColors.slice();
    // translation arrays
    var pads = defaults_1["default"].pads.slice();
    var trackPads = defaults_1["default"].trackPads.slice();
    var controlPads = defaults_1["default"].controlPads.slice();
    // display object
    var lastDisplay = {
        pads: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1
        ],
        tracks: [-1, -1, -1, -1, -1, -1, -1, -1],
        controls: [-1, -1, -1, -1, -1, -1, -1, -1]
    };
    var nextDisplay = {
        pads: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        tracks: [0, 0, 0, 0, 0, 0, 0, 0],
        controls: [0, 0, 0, 0, 0, 0, 0, 0]
    };
    function init() {
        // ok
    }
    function update() {
        // update pads
        for (var i = 0; i < nextDisplay.pads.length; i++) {
            if (lastDisplay.pads[i] !== nextDisplay.pads[i]) {
                changePad(pads[i], nextDisplay.pads[i]);
                lastDisplay.pads[i] = nextDisplay.pads[i];
            }
        }
        // update tracks ( right buttons )
        for (var i = 0; i < nextDisplay.tracks.length; i++) {
            if (lastDisplay.tracks[i] !== nextDisplay.tracks[i]) {
                changePad(trackPads[i], nextDisplay.tracks[i]);
                lastDisplay.tracks[i] = nextDisplay.tracks[i];
            }
        }
        // update controls ( top buttons )
        for (var i = 0; i < nextDisplay.controls.length; i++) {
            if (lastDisplay.controls[i] !== nextDisplay.controls[i]) {
                changeControl(controlPads[i], nextDisplay.controls[i]);
                lastDisplay.controls[i] = nextDisplay.controls[i];
            }
        }
    }
    function changePad(pad, color) {
        // could change to take channel as argument
        midi_1["default"].send("noteon", {
            note: pad,
            velocity: color,
            channel: channel
        });
    }
    function changeControl(pad, color) {
        midi_1["default"].send("cc", {
            controller: pad,
            value: color,
            channel: channel
        });
    }
    function setPad(which, value) {
        nextDisplay.pads[which] = value;
    }
    function setTrackPad(which, value) {
        nextDisplay.trackPads[which] = value;
    }
    function setControlPad(which, value) {
        nextDisplay.controlPads[which] = value;
    }
    return {
        init: init,
        update: update,
        setPad: setPad,
        setTrackPad: setTrackPad,
        setControlPad: setControlPad
    };
};
exports["default"] = sequencer;
