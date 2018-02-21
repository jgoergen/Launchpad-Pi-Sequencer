"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("./System");
let system = new System_1.default();
system
    .init()
    .then(() => {
    system.start();
})
    .catch((err) => {
    console.log("There was an error starting! " + err);
});
//# sourceMappingURL=app.js.map