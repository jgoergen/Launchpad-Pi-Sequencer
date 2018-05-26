// import easymidi from "easymidi";
import defaults from "./defaults";
// import gpio from "./gpio";

export default class Midi {

    inputs: any;
    outputs: any;
    input: any;
    output: any;
    midiOut: any;
    channel: number;
    clockCallback: any;
    internalClock: boolean = false;
    externalClock: boolean = true;
    bpm: number = 0;
    lastClockTime: any;
    nanoSecondsPerBeat: number = 0;

    public async init(handleMidiNoteOn: any, handleMidiCCmessage: any, handleClock: any): Promise<void> {

        this.channel = defaults.channel;

        // autoconfigure midi inputs and outputs

        // inputs = easymidi.getInputs();
        // outputs = easymidi.getOutputs();
        this.input = this.setupMidiIn(defaults.midiDeviceName, this.inputs);
        this.output = this.setupMidiOut(defaults.midiDeviceName, this.outputs);
        this.midiOut = this.makeMidiOutput(this.outputs);
        this.clockCallback = handleClock;
        this.lastClockTime = process.hrtime();

        // handle button pushes

        if (this.input) {

            this.input.on("noteon", handleMidiNoteOn);
            this.input.on("cc", handleMidiCCmessage);
        }

        /*
        // file data

        let fileData: any =
            fs.readFileSync(
                __dirname + "/midiConfig.json",
                "utf8");

        midiOutNotes = JSON.parse(fileData);
        */

        // default bpm to 120
        this.setBPM(120);
    }

    public update(): void {

        if (this.internalClock) {

            // has enough ms passed since the last clock message? if so, fire a midi update

            if (process.hrtime(this.lastClockTime)[1] >= this.nanoSecondsPerBeat) {

                this.lastClockTime = process.hrtime();
                this.clockCallback();
            }
        }
    }

    public setBPM(newBPM: number): void {

        this.bpm = newBPM;
        this.nanoSecondsPerBeat = 1000 / (this.bpm / 60) * 1000000;
    }

    public setupMidiIn(device: string, inputs: any): any {

        console.log("Setting up Midi In");

        if (!inputs || inputs.length < 1) {

            console.log("No midi inputs found, exiting.");
            return;
        }

        let arr: any =
            inputs.filter(
                (input: any) =>
                    (input.indexOf(device) === 0));

        if (arr.length > 0) {

            return null; // new easymidi.Input(arr[0]);

        } else {

            console.log("no midi input with device name: " + device);
        }
    }

    public setupMidiOut(device: string, outputs: any): any {

        console.log("Setting up Midi Out");

        if (!outputs || outputs.length < 1) {

            console.log("No midi outputs found, exiting.");
            return;
        }

        let arr: any =
            outputs.filter(
                (output: any) =>
                    (output.indexOf(device) === 0));

        if (arr.length > 0) {

            return null; // new easymidi.Output(arr[0]);

        } else {

            console.log("no midi output with device name: " + device);
        }
    }

    public makeMidiOutput(outputs: any): any {

        if (!outputs || outputs.length < 1) {

            return;
        }

        let arr: any =
            outputs.filter(
                (output: any) =>
                    (output.indexOf(defaults.midiDeviceName) !== 0));

        if (arr.length > 0) {

            console.log("midi output to device: " + arr[arr.length - 1]);
            return null; // new easymidi.Output(arr[arr.length - 1]);

        } else {

            console.log("no non launchpad midi devices connected");
        }
    }

    public startInternalClock(): void {

        this.externalClock = false;
        this.internalClock = true;
        // gpio.clockIn.watch(clockCallback);
    }

    public stopInternalClock(): void {

        this.externalClock = true;
        this.internalClock = false;
        // gpio.clockIn.unwatch();
    }

    public sendNote(note: number, velocity: number, channel: number): void {

        if (this.midiOut !== undefined) {

            this.midiOut.send(
                "noteon",
                {
                    note,
                    velocity,
                    channel
                });
        }
    }

    public sendCC(controller: number, value: number, channel: number): void {

        if (this.midiOut !== undefined) {

            this.midiOut.send(
                "cc",
                {
                    controller,
                    value,
                    channel
                });
        }
    }
};