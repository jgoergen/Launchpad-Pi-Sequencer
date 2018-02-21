// import { Gpio } from "onoff";

export default class GPIO {

    outputPins: Array<number>;
    triggerGPIO: any;
    clockOut: any;
    clockIn: any;
    clockSwitch: any;
    resetIn: any;
    powerSwitch: any;

    public init(shutdown: any, handleClockSwitch: any, handleResetIn: any): void {

        // TODO finish gpio
        return;

        // configure pins

        console.log("Configuring GPIO Pins");
        this.outputPins = [18, 4, 17, 23, 25, 5, 13, 21];

        this.triggerGPIO = this.outputPins.map(
            (pin) =>
                null); // new Gpio(pin, "out"));

        this.clockOut = null; // new Gpio(27, "out");
        this.clockIn = null; // new Gpio(24, "in", "falling");
        this.clockSwitch = null; // new Gpio(6, "in", "both");
        this.resetIn = null; // new Gpio(16, "in", "falling");
        this.powerSwitch = null; // new Gpio(20, "in", "rising");

        this.triggerGPIO.forEach(
            (pin: any) => {

                if (pin) {

                    pin.write(
                        1,
                        (err: any) => {

                        if (err) {

                            console.log(err);
                        }
                    });
                }
            });

        if (this.clockOut) {

            this.clockOut.write(
                1,
                (err: any) => {

                if (err) {
                    console.log(err);
                }
            });
        }

        this.powerSwitch.watch(shutdown);
        this.clockSwitch.read(handleClockSwitch);
        this.clockSwitch.watch(handleClockSwitch);
        this.resetIn.watch(handleResetIn);
    }
};