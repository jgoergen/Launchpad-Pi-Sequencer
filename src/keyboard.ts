import Midi from "./Midi";
import Display from "./Display";

export default class Keyboard {

    running: boolean;
    toggle: boolean;
    mode: string;

    public init(): void {

        this.running = false;
        this.toggle = true;
        this.mode = "normal";
    }

    public update(display: Display, midi: Midi): void {

        if (this.running) {

            if (this.toggle) {

                display.setPad(1, display.brightRunner);

            } else {

                display.setPad(1, display.darkRunner);
            }

            this.toggle = !this.toggle;
        }
    }
};