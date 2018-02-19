import * as fs from 'fs';
import easymidi from "easymidi";
import defaults from "./defaults";
import gpio from "./gpio";

const midi: any = () => {

    let inputs: any;
    let outputs: any;
    let input: any;
    let output: any;
    let midiOut: any;
    let channel: number;
    let clockCallback: any;
    let internalClock: boolean = false;
    let externalClock: boolean = false;
    let bpm: number = 120;
    let lastClockTime: any;

    function init(handleMidiNoteOn: any, handleMidiCCmessage: any, handleClock: any): void {

        channel = defaults.channel;

        // autoconfigure midi inputs and outputs

        inputs = easymidi.getInputs();
        outputs = easymidi.getOutputs();
        input = setupMidiIn(defaults.midiDeviceName, inputs);
        output = setupMidiOut(defaults.midiDeviceName, outputs);
        midiOut = makeMidiOutput(outputs);
        clockCallback = handleClock;
        lastClockTime = process.hrtime();

        // handle button pushes

        input.on("noteon", handleMidiNoteOn);
        input.on("cc", handleMidiCCmessage);

        /*
        // file data

        let fileData: any =
            fs.readFileSync(
                __dirname + "/midiConfig.json",
                "utf8");

        midiOutNotes = JSON.parse(fileData);
        */
    }

    function update(): void {

        if (internalClock) {

            // has enough ms passed since the last clock message? if so, fire a midi update

            if (process.hrtime(lastClockTime)[0] >= 60000 / bpm) {

                lastClockTime = process.hrtime();
                clockCallback();
            }
        }
    }

    function setupMidiIn(device: string, inputs: any): any {

        console.log("Setting up Midi In");

        let arr: any =
            inputs.filter(
                (input: any) =>
                    (input.indexOf(device) === 0));

        if (arr.length > 0) {

            return new easymidi.Input(arr[0]);

        } else {

            console.log("no midi input with device name: " + device);
        }
    }

    function setupMidiOut(device: string, outputs: any): any {

        console.log("Setting up Midi Out");

        let arr: any =
            outputs.filter(
                (output: any) =>
                    (output.indexOf(device) === 0));

        if (arr.length > 0) {

            return new easymidi.Output(arr[0]);

        } else {

            console.log("no midi output with device name: " + device);
        }
    }

    function makeMidiOutput(outputs: any): any {

        let arr: any =
            outputs.filter(
                (output: any) =>
                    (output.indexOf(defaults.midiDeviceName) !== 0));

        if (arr.length > 0) {

            console.log("midi output to device: " + arr[arr.length - 1]);
            return new easymidi.Output(arr[arr.length - 1]);

        } else {

            console.log("no non launchpad midi devices connected");
        }
    }

    function startInternalClock(): void {

        externalClock = true;
        internalClock = false;
        gpio.clockIn.watch(clockCallback);
    }

    function stopInternalClock(): void {

        externalClock = false;
        gpio.clockIn.unwatch();
    }

    function sendNote(note: number, velocity: number, channel: number): void {

        if (midiOut !== undefined) {

            midiOut.send(
                "noteon",
                {
                    note,
                    velocity,
                    channel
                });
        }
    }

    return {
        init,
        update,
        startInternalClock,
        stopInternalClock,
        sendNote
    };
};

export default midi;