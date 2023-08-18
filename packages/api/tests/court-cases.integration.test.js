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
var supertest_1 = require("supertest");
var qs_1 = require("qs");
var app_1 = require("../src/app");
var insertCourtCases_1 = require("./utils/insertCourtCases");
var CourtCase_1 = require("../src/services/entities/CourtCase");
var deleteFromEntity_1 = require("./utils/deleteFromEntity");
describe("/court-cases", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, deleteFromEntity_1["default"])(CourtCase_1["default"])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, deleteFromEntity_1["default"])(CourtCase_1["default"])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("GET", function () {
        it("returns a 401 status code if authorization header is not set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                            .get("/court-cases")
                            .query((0, qs_1.stringify)({ forces: ["01"], maxPageItems: "10" }))];
                    case 1:
                        response = _a.sent();
                        expect(response.statusCode).toBe(401);
                        return [2 /*return*/];
                }
            });
        }); });
        it("returns a 401 status code if authorization contains incorrect password", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                            .get("/court-cases")
                            .set("authorization", "not-the-password")
                            .query((0, qs_1.stringify)({ forces: ["01"], maxPageItems: "10" }))];
                    case 1:
                        response = _a.sent();
                        expect(response.statusCode).toBe(401);
                        return [2 /*return*/];
                }
            });
        }); });
        it("returns a 200 status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                            .get("/court-cases")
                            .set("authorization", "password")
                            .query((0, qs_1.stringify)({ forces: ["01"], maxPageItems: "10" }))];
                    case 1:
                        response = _a.sent();
                        expect(response.statusCode).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it("returns a 400 status code if required query attributes are missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"]).get("/court-cases").set("authorization", "password").query({})];
                    case 1:
                        response = _a.sent();
                        expect(response.statusCode).toBe(400);
                        return [2 /*return*/];
                }
            });
        }); });
        it("returns a list of results and the total result count", function () { return __awaiter(void 0, void 0, void 0, function () {
            var casesToInsert, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        casesToInsert = [
                            {
                                orgForPoliceFilter: "01"
                            }
                        ];
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(casesToInsert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({ forces: ["01"], maxPageItems: "10" }))];
                    case 2:
                        response = _a.sent();
                        expect(response.body.result).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can filter on courtDate", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, firstDate, secondDate, thirdDate, fourthDate, courtDateRangeQueryParams, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "01";
                        firstDate = new Date("2001-09-26");
                        secondDate = new Date("2008-01-26");
                        thirdDate = new Date("2008-03-26");
                        fourthDate = new Date("2013-10-16");
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { courtDate: firstDate, orgForPoliceFilter: orgCode },
                                { courtDate: secondDate, orgForPoliceFilter: orgCode },
                                { courtDate: thirdDate, orgForPoliceFilter: orgCode },
                                { courtDate: fourthDate, orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _a.sent();
                        courtDateRangeQueryParams = "courtDateRange[0][from]=2008-01-01T00:00:00Z&courtDateRange[0][to]=2008-12-30T00:00:00Z";
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases?forces[]=01&maxPageItems=10&".concat(courtDateRangeQueryParams))
                                .set("authorization", "password")];
                    case 2:
                        response = _a.sent();
                        expect(response.body.result).toHaveLength(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should filter on many fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "01";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { ptiurn: "00001", errorCount: 3, triggerCount: 0, orgForPoliceFilter: orgCode, errorReason: "HO00001" },
                                { ptiurn: "00002", errorCount: 0, triggerCount: 2, orgForPoliceFilter: orgCode, errorReason: "HO002222" }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({ forces: [orgCode], maxPageItems: "10", reasons: ["Exceptions"] }))];
                    case 2:
                        response = _a.sent();
                        expect(response.body.result[0].ptiurn).toBe("00001");
                        expect(response.body.result).toHaveLength(1);
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({ forces: [orgCode], maxPageItems: "10", reasons: ["Triggers"] }))];
                    case 3:
                        response = _a.sent();
                        expect(response.body.result[0].ptiurn).toBe("00002");
                        expect(response.body.result).toHaveLength(1);
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({ forces: [orgCode], maxPageItems: "10", reasons: ["Triggers", "Exceptions"] }))];
                    case 4:
                        response = _a.sent();
                        expect(response.body.result[0].ptiurn).toBe("00001");
                        expect(response.body.result[1].ptiurn).toBe("00002");
                        expect(response.body.result).toHaveLength(2);
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({
                                forces: [orgCode],
                                maxPageItems: "10",
                                reasons: ["Triggers", "Exceptions"],
                                orderBy: "reason",
                                order: "desc"
                            }))];
                    case 5:
                        response = _a.sent();
                        expect(response.body.result[0].errorReason).toBe("HO002222");
                        expect(response.body.result[1].errorReason).toBe("HO00001");
                        expect(response.body.result).toHaveLength(2);
                        return [4 /*yield*/, (0, supertest_1["default"])(app_1["default"])
                                .get("/court-cases")
                                .set("authorization", "password")
                                .query((0, qs_1.stringify)({ forces: [orgCode], maxPageItems: "10", reasons: ["Triggers", "Exceptions"], ptiurn: "00002" }))];
                    case 6:
                        response = _a.sent();
                        expect(response.body.result[0].ptiurn).toBe("00002");
                        expect(response.body.result).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
