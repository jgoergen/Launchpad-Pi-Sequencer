import defaults from "./defaults";
import midi from "./midi";

const sequencer: any = () => {

    // midi

    let channel: number = defaults.channel;

    // color settings

    let dark:number = defaults.dark;
    let darkRunner:number = defaults.darkRunner;
    let brightRunner:number = defaults.brightRunner;
    let trackColors:number = defaults.trackColors.slice();

    // translation arrays

    let pads: Array<number> = defaults.pads.slice();
    let trackPads: Array<number> = defaults.trackPads.slice();
    let controlPads: Array<number> = defaults.controlPads.slice();

    // display object

    let lastDisplay: any = {
        pads: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1],
        tracks: [-1, -1, -1, -1, -1, -1, -1, -1],
        controls: [-1, -1, -1, -1, -1, -1, -1, -1]
    };

    let nextDisplay: any = {
        pads: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tracks: [0, 0, 0, 0, 0, 0, 0, 0],
        controls: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    function init(): void {

        // ok
    }

    function update(): void {

        // update pads

        for (let i:number = 0; i < nextDisplay.pads.length; i++) {

            if (lastDisplay.pads[i] !== nextDisplay.pads[i]) {

                changePad(pads[i], nextDisplay.pads[i]);
                lastDisplay.pads[i] = nextDisplay.pads[i];
            }
        }

        // update tracks ( right buttons )

        for (let i:number = 0; i < nextDisplay.tracks.length; i++) {

            if (lastDisplay.tracks[i] !== nextDisplay.tracks[i]) {

                changePad(trackPads[i], nextDisplay.tracks[i]);
                lastDisplay.tracks[i] = nextDisplay.tracks[i];
            }
        }

        // update controls ( top buttons )

        for (let i:number = 0; i < nextDisplay.controls.length; i++) {

            if (lastDisplay.controls[i] !== nextDisplay.controls[i]) {

                changeControl(controlPads[i], nextDisplay.controls[i]);
                lastDisplay.controls[i] = nextDisplay.controls[i];
            }
        }
    }

    function changePad (pad: any, color: any): void {

        // could change to take channel as argument

        midi.send(
            "noteon",
            {
                note: pad,
                velocity: color,
                channel: channel
            });
    }

    function changeControl(pad: any, color: any): void {

        midi.send(
            "cc",
            {
                controller: pad,
                value: color,
                channel: channel
            });
    }

    function setPad(which: number, value: number): void {

        nextDisplay.pads[which] = value;
    }

    function setTrackPad(which: number, value: number): void {

        nextDisplay.trackPads[which] = value;
    }

    function setControlPad(which: number, value: number): void {

        nextDisplay.controlPads[which] = value;
    }

    return {
        init,
        update,
        setPad,
        setTrackPad,
        setControlPad
    };
};

export default sequencer;