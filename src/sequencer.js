"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var midi_1 = require("./midi");
var sequencer = function () {
    var running;
    var toggle;
    var mode;
    var tracksDisplayed;
    var scrollPage;
    var displayTrack;
    var curStep;
    var lastStep;
    var midiOutNotes;
    var tracks;
    function init() {
        // initial state
        running = false;
        toggle = true,
            mode = "step";
        tracksDisplayed = 1;
        scrollPage = 0;
        displayTrack = 0;
        curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
        lastStep = [63, 63, 63, 63, 63, 63, 63, 63];
        tracks = [
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice()
        ];
        midiOutNotes = defaults_1["default"].midiOutNotes.slice();
    }
    function update() {
        if (running) {
            var triggersToSend = [];
            // for each track
            for (var i = 0; i < 8; i++) {
                // advance steps
                curStep[i] =
                    curStep[i] >= lastStep[i] ?
                        0 :
                        curStep[i] + 1;
                // is there note data in this step ( for this track )
                if (tracks[i][curStep[i]]) {
                    triggersToSend.push(i);
                }
            }
            for (var i = 0; i < triggersToSend.length; i++) {
                midi_1["default"].sendNote(+midiOutNotes[triggersToSend[i]][1], 127, midiOutNotes[triggersToSend[i]][0]);
            }
            toggle = !toggle;
        }
    }
    return {
        init: init,
        update: update
    };
};
exports["default"] = sequencer;
