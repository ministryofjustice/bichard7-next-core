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
exports.__esModule = true;
var courtCases_1 = require("../src/controllers/courtCases");
var CourtCase_1 = require("../src/services/entities/CourtCase");
var getDataSource_1 = require("../src/services/getDataSource");
var listCourtCases_1 = require("../src/services/listCourtCases");
jest.mock("../src/services/getDataSource");
jest.mock("../src/services/listCourtCases", function () { return jest.fn(); });
getDataSource_1["default"].mockReturnValue({
    destroy: jest.fn()
});
describe("getCourtCases", function () {
    it("returns a 200 status code", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    listCourtCases_1["default"].mockReturnValue(Promise.resolve({ result: [], totalCases: 0 }));
                    req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } };
                    res = {};
                    res.status = jest.fn().mockReturnValue(res);
                    res.json = jest.fn().mockReturnValue(res);
                    return [4 /*yield*/, (0, courtCases_1.getCourtCases)(req, res)];
                case 1:
                    _a.sent();
                    expect(res.status).toHaveBeenCalledWith(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("returns a 500 status code when database returns an error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var expectedError, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedError = new Error("Something went wrong");
                    listCourtCases_1["default"].mockReturnValue(Promise.resolve(expectedError));
                    req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } };
                    res = {};
                    res.status = jest.fn().mockReturnValue(res);
                    res.json = jest.fn().mockReturnValue(res);
                    return [4 /*yield*/, (0, courtCases_1.getCourtCases)(req, res)];
                case 1:
                    _a.sent();
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(res.json).toHaveBeenCalledWith(expectedError);
                    return [2 /*return*/];
            }
        });
    }); });
    it("returns the court cases from the database", function () { return __awaiter(void 0, void 0, void 0, function () {
        var expected, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = {
                        result: [new CourtCase_1["default"](), new CourtCase_1["default"](), new CourtCase_1["default"]()],
                        totalCases: 3
                    };
                    listCourtCases_1["default"].mockReturnValue(Promise.resolve(expected));
                    req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } };
                    res = {};
                    res.status = jest.fn().mockReturnValue(res);
                    res.json = jest.fn().mockReturnValue(res);
                    return [4 /*yield*/, (0, courtCases_1.getCourtCases)(req, res)];
                case 1:
                    _a.sent();
                    expect(res.json).toHaveBeenCalledWith(expected);
                    return [2 /*return*/];
            }
        });
    }); });
});
