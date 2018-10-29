"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
exports.default = randomString;
