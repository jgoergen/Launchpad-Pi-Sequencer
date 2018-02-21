import * as fs from "fs";

let data: Array<any> =
    [
        [0, "036"],
        [0, "038"],
        [0, "043"],
        [0, "050"],
        [0, "042"],
        [0, "046"],
        [0, "039"],
        [0, "049"]
    ];

let jsonString: string = JSON.stringify(data);

fs.writeFile(
    "./midiConfig.json",
    jsonString,
    function(err: any): void {

        if (err) {

            console.log(err);

        } else {

            console.log("success");
        }
    });
