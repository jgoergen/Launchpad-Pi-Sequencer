import { Gpio } from "onoff";

const gpio: any = () => {

    let outputPins: Array<number>;
    let triggerGPIO: any;
    let clockOut: any;
    let clockIn: any;
    let clockSwitch: any;
    let resetIn: any;
    let powerSwitch: any;

    function init(shutdown: any, handleClockSwitch: any, handleResetIn: any): void {

        // configure pins

        console.log("Configuring GPIO Pins");
        outputPins = [18, 4, 17, 23, 25, 5, 13, 21];

        triggerGPIO = outputPins.map(
            (pin) =>
                new Gpio(pin, "out"));

        clockOut = new Gpio(27, "out");
        clockIn = new Gpio(24, "in", "falling");
        clockSwitch = new Gpio(6, "in", "both");
        resetIn = new Gpio(16, "in", "falling");
        powerSwitch = new Gpio(20, "in", "rising");

        triggerGPIO.forEach(
            (pin) => {

                pin.write(
                    1,
                    (err) => {

                    if (err) {

                        console.log(err);
                    }
                });
            });

        clockOut.write(
            1,
            (err) => {

            if (err) {
                console.log(err);
            }
        });

        powerSwitch.watch(shutdown);
        clockSwitch.read(handleClockSwitch);
        clockSwitch.watch(handleClockSwitch);
        resetIn.watch(handleResetIn);
    }

    return {
        init
    };
};

export default gpio;