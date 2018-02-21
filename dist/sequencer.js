"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var Sequencer = (function () {
    function Sequencer() {
    }
    Sequencer.prototype.init = function () {
        this.running = false;
        this.toggle = true,
            this.mode = "step";
        this.tracksDisplayed = 1;
        this.scrollPage = 0;
        this.displayTrack = 0;
        this.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
        this.lastStep = [63, 63, 63, 63, 63, 63, 63, 63];
        this.tracks = [
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice(),
            defaults_1["default"].emptyTrackData.slice()
        ];
        this.midiOutNotes = defaults_1["default"].midiOutNotes.slice();
    };
    Sequencer.prototype.update = function (display, midi) {
        if (this.running) {
            var triggersToSend = [];
            for (var i = 0; i < 8; i++) {
                this.curStep[i] =
                    this.curStep[i] >= this.lastStep[i] ?
                        0 :
                        this.curStep[i] + 1;
                if (this.tracks[i][this.curStep[i]]) {
                    triggersToSend.push(i);
                }
            }
            for (var i = 0; i < triggersToSend.length; i++) {
                midi.sendNote(+this.midiOutNotes[triggersToSend[i]][1], 127, this.midiOutNotes[triggersToSend[i]][0]);
            }
            this.toggle = !this.toggle;
        }
    };
    return Sequencer;
}());
exports["default"] = Sequencer;
;
//# sourceMappingURL=Sequencer.js.map