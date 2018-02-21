import defaults from "./defaults";
import Midi from "./Midi";
import Display from "./Display";

export default class Sequencer {

    running: boolean;
    toggle: boolean;
    mode: string;
    tracksDisplayed: number;
    scrollPage: number;
    displayTrack: number;
    curStep: Array<number>;
    lastStep: Array<number>;
    midiOutNotes: any;
    tracks: Array<any>;
    midiRef: Midi;
    displayRef: Display;

    public async init(display: Display, midi: Midi): Promise<void> {

        // initial state
        this.running = false;
        this.toggle = true;
        this.mode = "step";
        this.tracksDisplayed = 1;
        this.scrollPage = 0;
        this.displayTrack = 0;
        this.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
        this.lastStep = [63, 63, 63, 63, 63, 63, 63, 63];
        this.tracks = [
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice()
        ];
        this.midiOutNotes = defaults.midiOutNotes.slice();
        this.displayRef = display;
        this.midiRef = midi;
    }

    public update(): void {

        if (this.running) {

            let triggersToSend: Array<number> = [];

            // for each track

            for (let i: number = 0; i < 8; i++) {

                // advance steps

                this.curStep[i] =
                    this.curStep[i] >= this.lastStep[i] ?
                        0 :
                        this.curStep[i] + 1;

                // is there note data in this step ( for this track )

                if (this.tracks[i][this.curStep[i]]) {

                    triggersToSend.push(i);
                }
            }

            for (let i: number = 0; i < triggersToSend.length; i++) {

                this.midiRef.sendNote(
                    + this.midiOutNotes[triggersToSend[i]][1],
                    127,
                    this.midiOutNotes[triggersToSend[i]][0]);
            }

            this.toggle = !this.toggle;
        }
    }
};