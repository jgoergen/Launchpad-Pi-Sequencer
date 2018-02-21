"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Keyboard {
    init(display, midi) {
        return __awaiter(this, void 0, void 0, function* () {
            this.running = false;
            this.toggle = true;
            this.mode = "normal";
            this.displayRef = display;
            this.midiRef = midi;
        });
    }
    update() {
        if (this.running) {
            if (this.toggle) {
                this.displayRef.setPad(1, this.displayRef.brightRunner);
            }
            else {
                this.displayRef.setPad(1, this.displayRef.darkRunner);
            }
            this.toggle = !this.toggle;
        }
    }
    handleNote(note) {
    }
}
exports.default = Keyboard;
;
//# sourceMappingURL=Keyboard.js.map