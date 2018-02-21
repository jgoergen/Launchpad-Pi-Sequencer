import Midi from "./Midi";
import Display from "./Display";

export default class Keyboard {

    running: boolean;
    toggle: boolean;
    mode: string;
    midiRef: Midi;
    displayRef: Display;

    public async init(display: Display, midi: Midi): Promise<void> {

        this.running = false;
        this.toggle = true;
        this.mode = "normal";
        this.displayRef = display;
        this.midiRef = midi;
    }

    public update(): void {

        if (this.running) {

            if (this.toggle) {

                this.displayRef.setPad(1, this.displayRef.brightRunner);

            } else {

                this.displayRef.setPad(1, this.displayRef.darkRunner);
            }

            this.toggle = !this.toggle;
        }
    }

    public handleNote(note: any) {

    }
};