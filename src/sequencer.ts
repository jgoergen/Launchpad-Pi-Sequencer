import defaults from "./defaults";
import midi from "./midi";
import display from "./display";

const sequencer: any = () => {

    let running: boolean;
    let toggle: boolean;
    let mode: string;
    let tracksDisplayed: number;
    let scrollPage: number;
    let displayTrack: number;
    let curStep: Array<number>;
    let lastStep: Array<number>;
    let midiOutNotes: any;
    let tracks: Array<any>;

    function init(): void {

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
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice(),
            defaults.emptyTrackData.slice()
        ];
        midiOutNotes = defaults.midiOutNotes.slice();
    }

    function update(): void {

        if (running) {

            let triggersToSend: Array<number> = [];

            // for each track

            for (let i: number = 0; i < 8; i++) {

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

            for (let i: number = 0; i < triggersToSend.length; i++) {

                midi.sendNote(
                    + midiOutNotes[triggersToSend[i]][1],
                    127,
                    midiOutNotes[triggersToSend[i]][0]);
            }

            toggle = !toggle;
        }
    }

    return {
        init,
        update
    };
};

export default sequencer;