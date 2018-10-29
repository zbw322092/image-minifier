"use strict";
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
var express_1 = __importDefault(require("express"));
var routing_controllers_1 = require("routing-controllers");
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var chalk_1 = __importDefault(require("chalk"));
var compression_1 = __importDefault(require("compression"));
var path_1 = require("path");
var ENV = process.env;
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.createApp = function () {
        var app = express_1.default();
        var publicPath = path_1.join(process.cwd(), './public');
        var zipPath = path_1.join(process.cwd(), './upload/zip');
        app.use(serve_favicon_1.default(path_1.join(__dirname, '../favicon.ico')));
        app.use('/image-compress', compression_1.default(), express_1.default.static(publicPath));
        app.use('/zip-download', compression_1.default(), express_1.default.static(zipPath));
        routing_controllers_1.useExpressServer(app, {
            routePrefix: '/api',
            controllers: [__dirname + "/controllers/*.{js,ts}"]
        });
        return app;
    };
    App.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var host, port, app;
            return __generator(this, function (_a) {
                console.log('starting node server...');
                host = process.env.NODE_ENV === 'dev' ? 'localhost' : (ENV.HOST || 'localhost');
                port = Number(ENV.PORT) || 9988;
                app = this.createApp();
                app.listen(port, host, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(chalk_1.default.cyan.bold("Server is listening on port " + port));
                });
                return [2 /*return*/];
            });
        });
    };
    return App;
}());
exports.default = App;
