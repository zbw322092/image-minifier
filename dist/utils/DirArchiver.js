"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var archiver_1 = __importDefault(require("archiver"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var DirArchiver = /** @class */ (function () {
    function DirArchiver() {
        this.archive = function (sourceDir, zipFileName) {
            var output = fs_1.default.createWriteStream(zipFileName);
            var archive = archiver_1.default('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });
            // This event is fired when the data source is drained no matter what was the data source.
            // It is not part of this library but rather from the NodeJS Stream API.
            // @see: https://nodejs.org/api/stream.html#stream_event_end
            output.on('end', function () {
                console.log('Data has been drained');
            });
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            archive.on('warning', function (err) {
                if (err.code === 'ENOENT') {
                    // log warning
                    console.log(chalk_1.default.red('Archiver warning: '), err);
                }
                else {
                    // throw error
                    throw err;
                }
            });
            // good practice to catch this error explicitly
            archive.on('error', function (err) {
                throw err;
            });
            // pipe archive data to the file
            archive.pipe(output);
            archive.directory(sourceDir, 'compressed_images');
            // finalize the archive (ie we are done appending files but streams have to finish yet)
            // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
            archive.finalize();
            return output;
        };
    }
    return DirArchiver;
}());
exports.default = DirArchiver;
