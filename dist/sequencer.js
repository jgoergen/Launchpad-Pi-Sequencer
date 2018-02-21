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
    init(display, midi) {
        return __awaiter(this, void 0, void 0, function* () {
            this.running = false;
            this.toggle = true;
            this.mode = "step";
            this.tracksDisplayed = 1;
            this.scrollPage = 0;
            this.displayTrack = 0;
            this.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
            this.lastStep = [63, 63, 63, 63, 63, 63, 63, 63];
            this.tracks = [
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice(),
                defaults_1.default.emptyTrackData.slice()
            ];
            this.midiOutNotes = defaults_1.default.midiOutNotes.slice();
            this.displayRef = display;
            this.midiRef = midi;
        });
    }
    update() {
        if (this.running) {
            let triggersToSend = [];
            for (let i = 0; i < 8; i++) {
                this.curStep[i] =
                    this.curStep[i] >= this.lastStep[i] ?
                        0 :
                        this.curStep[i] + 1;
                if (this.tracks[i][this.curStep[i]]) {
                    triggersToSend.push(i);
                }
            }
            for (let i = 0; i < triggersToSend.length; i++) {
                this.midiRef.sendNote(+this.midiOutNotes[triggersToSend[i]][1], 127, this.midiOutNotes[triggersToSend[i]][0]);
            }
            this.toggle = !this.toggle;
        }
    }
}
exports.default = Sequencer;
;
//# sourceMappingURL=Sequencer.js.map