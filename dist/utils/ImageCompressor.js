"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var imagemin_1 = __importDefault(require("imagemin"));
var imagemin_jpegtran_1 = __importDefault(require("imagemin-jpegtran"));
var imagemin_pngquant_1 = __importDefault(require("imagemin-pngquant"));
var chalk_1 = __importDefault(require("chalk"));
var ImageCompressor = /** @class */ (function () {
    function ImageCompressor() {
        var _this = this;
        this.printCompressImagelog = function (files, buildFolder) {
            files.map(function (file) {
                var fileAbsName = file.path;
                var fileBasename = path_1.basename(fileAbsName);
                var fileDirname = path_1.dirname(fileAbsName);
                var folder = path_1.relative(buildFolder, fileDirname);
                console.log("\u27A9 " + folder + "/" + chalk_1.default.cyan(fileBasename));
            });
        };
        this.compress = function (images, distFolder) {
            if (typeof images === 'string') {
                images = [images];
            }
            images = images.filter(function (image) {
                return /\.(png|jpg|git)$/.test(image.split('?')[0]);
            });
            console.log(chalk_1.default.green('Optimizing images...\n'));
            return imagemin_1.default(images, distFolder, {
                plugins: [
                    imagemin_jpegtran_1.default(),
                    imagemin_pngquant_1.default({ quality: '65-80' })
                ]
            })
                .then(function (files) {
                _this.printCompressImagelog(files, distFolder);
                console.log(chalk_1.default.green("\nOptimizing images successfully.\n"));
                return files;
            })
                .catch(function (err) {
                console.log(chalk_1.default.red("\nOptimizing image error: \n"), err);
            });
        };
    }
    return ImageCompressor;
}());
exports.default = ImageCompressor;
