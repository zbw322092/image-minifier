"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routing_controllers_1 = require("routing-controllers");
var connect_busboy_1 = __importDefault(require("connect-busboy"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var ImageCompressor_1 = __importDefault(require("../utils/ImageCompressor"));
var randomString_1 = __importDefault(require("../utils/randomString"));
var DirArchiver_1 = __importDefault(require("../utils/DirArchiver"));
var imageCompressor = new ImageCompressor_1.default();
var uploadPath = path_1.join(process.cwd(), './upload/raw');
var distPath = path_1.join(process.cwd(), './upload/compressed');
var zipPath = path_1.join(process.cwd(), './upload/zip');
var UploadController = /** @class */ (function () {
    function UploadController() {
        this.randomDirName = function () {
            return Date.now() + "-" + randomString_1.default();
        };
    }
    UploadController.prototype.uploadFile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var busboy_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.busboy) return [3 /*break*/, 2];
                        busboy_1 = req.busboy;
                        req.pipe(req.busboy);
                        return [4 /*yield*/, new Promise(function () {
                                var filesCounter = 0;
                                var hasFinish = false;
                                var rawFiles = [];
                                var randomDirName = _this.randomDirName();
                                var rawDir = path_1.join(uploadPath, "./" + randomDirName);
                                var compressedDir = path_1.join(distPath, "./" + randomDirName);
                                var zipFilePath = path_1.join(zipPath, "./compressed_images_" + randomDirName + ".zip");
                                if (!fs_1.default.existsSync(rawDir)) {
                                    fs_1.default.mkdirSync(rawDir);
                                }
                                busboy_1.on('file', function (fieldname, file, filename, encoding, mimetype) {
                                    ++filesCounter;
                                    console.log(chalk_1.default.green('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype));
                                    file.on('data', function (data) {
                                        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
                                    });
                                    file.on('end', function () {
                                        console.log('File [' + fieldname + '] Finished');
                                    });
                                    var rawFilePath = path_1.join(rawDir, filename);
                                    rawFiles.push(rawFilePath);
                                    var fsStream = fs_1.default.createWriteStream(rawFilePath);
                                    file.pipe(fsStream);
                                    fsStream.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var dirArchiver, zipOutput;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    --filesCounter;
                                                    console.log("Upload of '" + filename + "' finished");
                                                    if (!(hasFinish && filesCounter === 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, imageCompressor.compress(rawFiles, compressedDir)];
                                                case 1:
                                                    _a.sent();
                                                    dirArchiver = new DirArchiver_1.default();
                                                    zipOutput = dirArchiver.archive(compressedDir, zipFilePath);
                                                    zipOutput.on('close', function () {
                                                        res.json({
                                                            filename: "compressed_images_" + randomDirName + ".zip"
                                                        });
                                                    });
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                });
                                busboy_1.on('finish', function () {
                                    hasFinish = true;
                                    console.log("busboy finish");
                                });
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        routing_controllers_1.Post('/upload'),
        routing_controllers_1.UseBefore(connect_busboy_1.default({
            highWaterMark: 2 * 1024 * 1024,
        })),
        __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Res()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UploadController.prototype, "uploadFile", null);
    UploadController = __decorate([
        routing_controllers_1.Controller()
    ], UploadController);
    return UploadController;
}());
exports.default = UploadController;
