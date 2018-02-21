"use strict";
exports.__esModule = true;
var fs = require("fs");
var data = [
    [0, "036"],
    [0, "038"],
    [0, "043"],
    [0, "050"],
    [0, "042"],
    [0, "046"],
    [0, "039"],
    [0, "049"]
];
var jsonString = JSON.stringify(data);
fs.writeFile("./midiConfig.json", jsonString, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("success");
    }
});
//# sourceMappingURL=makeConfig.js.map