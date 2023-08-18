"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
exports.__esModule = true;
var CourtCase_1 = require("./entities/CourtCase");
var typeorm_1 = require("typeorm");
var User_1 = require("./entities/User");
var Trigger_1 = require("./entities/Trigger");
var Note_1 = require("./entities/Note");
var databaseConfig = {
    host: (_b = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : process.env.DB_AUTH_HOST) !== null && _b !== void 0 ? _b : "localhost",
    user: (_d = (_c = process.env.DB_USER) !== null && _c !== void 0 ? _c : process.env.DB_AUTH_USER) !== null && _d !== void 0 ? _d : "bichard",
    password: (_f = (_e = process.env.DB_PASSWORD) !== null && _e !== void 0 ? _e : process.env.DB_AUTH_PASSWORD) !== null && _f !== void 0 ? _f : "password",
    database: (_h = (_g = process.env.DB_DATABASE) !== null && _g !== void 0 ? _g : process.env.DB_AUTH_DATABASE) !== null && _h !== void 0 ? _h : "bichard",
    port: parseInt((_k = (_j = process.env.DB_PORT) !== null && _j !== void 0 ? _j : process.env.DB_AUTH_PORT) !== null && _k !== void 0 ? _k : "5432", 10),
    ssl: ((_l = process.env.DB_SSL) !== null && _l !== void 0 ? _l : process.env.DB_AUTH_SSL) === "true",
    schema: "br7own"
};
var appDataSource;
var getDataSource = function () { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = {
                    type: "postgres",
                    applicationName: "ui-connection",
                    host: databaseConfig.host,
                    port: databaseConfig.port,
                    username: databaseConfig.user,
                    password: databaseConfig.password,
                    database: databaseConfig.database,
                    synchronize: false,
                    entities: [CourtCase_1["default"], User_1["default"], Trigger_1["default"], Note_1["default"]],
                    subscribers: [],
                    migrations: [],
                    schema: databaseConfig.schema,
                    ssl: databaseConfig.ssl ? { rejectUnauthorized: false } : false,
                    logging: false,
                    extra: {
                        max: 1
                    }
                };
                if (config.synchronize) {
                    throw Error("Synchronize must be false.");
                }
                if (!(!appDataSource || !appDataSource.isInitialized)) return [3 /*break*/, 2];
                return [4 /*yield*/, new typeorm_1.DataSource(config).initialize()];
            case 1:
                appDataSource = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, appDataSource];
        }
    });
}); };
exports["default"] = getDataSource;
