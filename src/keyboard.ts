import defaults from "./defaults";
import midi from "./midi";
import display from "./display";

const keyboard: any = () => {

    let running: boolean;
    let toggle: boolean;
    let mode: string;

    function init(): void {

        running = false;
        toggle = true,
        mode = "normal";
    }

    function update(): void {

        if (running) {

            if (toggle) {

                display.setPad(1, display.brightRunner);

            } else {

                display.setPad(1, display.darkRunner);
            }

            toggle = !toggle;
        }
    }

    return {
        init,
        update
    };
};

export default keyboard;