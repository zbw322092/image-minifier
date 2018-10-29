"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.config();
require("reflect-metadata");
var App_1 = __importDefault(require("./App"));
var chalk_1 = __importDefault(require("chalk"));
var app = new App_1.default();
app.start().catch(function (err) {
    return console.log(chalk_1.default.red.bold('Error: '), err);
});
process.on('uncaughtException', function (err) {
    console.log(chalk_1.default.red.bold('uncaughtException: '), err);
});
