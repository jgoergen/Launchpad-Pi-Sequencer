"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let data = [
    [0, "036"],
    [0, "038"],
    [0, "043"],
    [0, "050"],
    [0, "042"],
    [0, "046"],
    [0, "039"],
    [0, "049"]
];
let jsonString = JSON.stringify(data);
fs.writeFile("./midiConfig.json", jsonString, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("success");
    }
});
//# sourceMappingURL=makeConfig.js.map