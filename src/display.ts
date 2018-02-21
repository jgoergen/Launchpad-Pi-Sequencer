import defaults from "./defaults";
import Midi from "./Midi";

export default class Sequencer {

    // midi

    midiRef: Midi;
    channel: number = defaults.channel;

    // color settings

    dark:number = defaults.dark;
    darkRunner:number = defaults.darkRunner;
    brightRunner:number = defaults.brightRunner;
    trackColors:number = defaults.trackColors.slice();

    // translation arrays

    pads: Array<number> = defaults.pads.slice();
    trackPads: Array<number> = defaults.trackPads.slice();
    controlPads: Array<number> = defaults.controlPads.slice();

    // display object

    lastDisplay: any = {
        pads: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1],
        tracks: [-1, -1, -1, -1, -1, -1, -1, -1],
        controls: [-1, -1, -1, -1, -1, -1, -1, -1]
    };

    nextDisplay: any = {
        pads: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tracks: [0, 0, 0, 0, 0, 0, 0, 0],
        controls: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    public async init(midi: Midi): Promise<void> {

        this.midiRef = midi;
    }

    public update(): void {

        // update pads

        for (let i:number = 0; i < this.nextDisplay.pads.length; i++) {

            if (this.lastDisplay.pads[i] !== this.nextDisplay.pads[i]) {

                this.changePad(this.pads[i], this.nextDisplay.pads[i]);
                this.lastDisplay.pads[i] = this.nextDisplay.pads[i];
            }
        }

        // update tracks ( right buttons )

        for (let i:number = 0; i < this.nextDisplay.tracks.length; i++) {

            if (this.lastDisplay.tracks[i] !== this.nextDisplay.tracks[i]) {

                this.changePad(this.trackPads[i], this.nextDisplay.tracks[i]);
                this.lastDisplay.tracks[i] = this.nextDisplay.tracks[i];
            }
        }

        // update controls ( top buttons )

        for (let i:number = 0; i < this.nextDisplay.controls.length; i++) {

            if (this.lastDisplay.controls[i] !== this.nextDisplay.controls[i]) {

                this.changeControl(this.controlPads[i], this.nextDisplay.controls[i]);
                this.lastDisplay.controls[i] = this.nextDisplay.controls[i];
            }
        }
    }

    public changePad (pad: any, color: any): void {

        // could change to take channel as argument

        this.midiRef.sendNote(
            pad,
            color,
            this.channel
        );
    }

    public changeControl(pad: any, color: any): void {

        this.midiRef.sendCC(
            pad,
            color,
            this.channel);
    }

    public setPad(which: number, value: number): void {

        this.nextDisplay.pads[which] = value;
    }

    public setTrackPad(which: number, value: number): void {

        this.nextDisplay.trackPads[which] = value;
    }

    public setControlPad(which: number, value: number): void {

        this.nextDisplay.controlPads[which] = value;
    }
};