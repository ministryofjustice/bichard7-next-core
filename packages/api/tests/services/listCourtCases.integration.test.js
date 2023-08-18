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
var CourtCase_1 = require("../../src/services/entities/CourtCase");
var Note_1 = require("../../src/services/entities/Note");
var Trigger_1 = require("../../src/services/entities/Trigger");
var getDataSource_1 = require("../../src/services/getDataSource");
var listCourtCases_1 = require("../../src/services/listCourtCases");
var courtCasesByVisibleForcesQuery_1 = require("../../src/services/queries/courtCasesByVisibleForcesQuery");
var Result_1 = require("../../src/types/Result");
var deleteFromEntity_1 = require("../utils/deleteFromEntity");
var insertCourtCases_1 = require("../utils/insertCourtCases");
var manageExceptions_1 = require("../utils/manageExceptions");
var manageTriggers_1 = require("../utils/manageTriggers");
jest.mock("../../src/services/queries/courtCasesByVisibleForcesQuery", jest.fn(function () {
    return jest.fn(function (query) {
        return query;
    });
}));
jest.setTimeout(100000);
describe("listCourtCases", function () {
    var dataSource;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, getDataSource_1["default"])()];
                case 1:
                    dataSource = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, deleteFromEntity_1["default"])(CourtCase_1["default"])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, deleteFromEntity_1["default"])(Trigger_1["default"])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, deleteFromEntity_1["default"])(Note_1["default"])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dataSource) return [3 /*break*/, 2];
                    return [4 /*yield*/, dataSource.destroy()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    it("should call cases by visible forces query", function () { return __awaiter(void 0, void 0, void 0, function () {
        var forceCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forceCode = "dummyForceCode";
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: [forceCode], maxPageItems: "1" })];
                case 1:
                    _a.sent();
                    expect(courtCasesByVisibleForcesQuery_1["default"]).toHaveBeenCalledTimes(1);
                    expect(courtCasesByVisibleForcesQuery_1["default"]).toHaveBeenCalledWith(expect.any(Object), [forceCode]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return cases with notes correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var caseNotes, query, result, cases;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    caseNotes = [
                        [
                            {
                                user: "System",
                                text: "System note 1"
                            }
                        ],
                        [
                            {
                                user: "System",
                                text: "System note 2"
                            },
                            {
                                user: "bichard01",
                                text: "Test note 1"
                            },
                            {
                                user: "System",
                                text: "System note 3"
                            }
                        ],
                        [
                            {
                                user: "bichard01",
                                text: "Test note 2"
                            },
                            {
                                user: "bichard02",
                                text: "Test note 3"
                            },
                            {
                                user: "bichard01",
                                text: "Test note 2"
                            }
                        ]
                    ];
                    return [4 /*yield*/, (0, insertCourtCases_1.insertDummyCourtCasesWithNotes)(caseNotes, "01")];
                case 1:
                    query = _a.sent();
                    expect((0, Result_1.isError)(query)).toBe(false);
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["01"], maxPageItems: "100" })];
                case 2:
                    result = _a.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    cases = result.result;
                    expect(cases).toHaveLength(3);
                    expect(cases[0].notes).toHaveLength(1);
                    expect(cases[1].notes).toHaveLength(3);
                    expect(cases[2].notes).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return all the cases if they number less than or equal to the specified maxPageItems", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(Array.from(Array(100)).map(function () { return ({ orgForPoliceFilter: "36FPA1" }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["36FPA1"], maxPageItems: "100" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(100);
                    expect(cases[0].errorId).toBe(0);
                    expect(cases[9].errorId).toBe(9);
                    expect(cases[0].messageId).toBe("xxxx0");
                    expect(cases[9].messageId).toBe("xxxx9");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("shouldn't return more cases than the specified maxPageItems", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(Array.from(Array(100)).map(function () { return ({ orgForPoliceFilter: "36FPA1" }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["36FPA1"], maxPageItems: "10" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(10);
                    expect(cases[0].errorId).toBe(0);
                    expect(cases[9].errorId).toBe(9);
                    expect(cases[0].messageId).toBe("xxxx0");
                    expect(cases[9].messageId).toBe("xxxx9");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("shouldn't return more cases than the specified maxPageItems when cases have notes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var caseNote, caseNotes, result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    caseNote = [
                        {
                            user: "bichard01",
                            text: "Test note 2"
                        },
                        {
                            user: "bichard02",
                            text: "Test note 3"
                        },
                        {
                            user: "bichard01",
                            text: "Test note 2"
                        }
                    ];
                    caseNotes = new Array(100).fill(caseNote);
                    return [4 /*yield*/, (0, insertCourtCases_1.insertDummyCourtCasesWithNotes)(caseNotes, "01")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["01"], maxPageItems: "10" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(10);
                    expect(cases[0].notes[0].noteText).toBe("Test note 2");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("shouldn't return more cases than the specified maxPageItems when cases have triggers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var caseTrigger, caseTriggers, result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    caseTrigger = [
                        {
                            code: "TRPR0001",
                            status: "Unresolved"
                        },
                        {
                            code: "TRPR0002",
                            status: "Resolved"
                        },
                        {
                            code: "TRPR0003",
                            status: "Submitted"
                        }
                    ];
                    caseTriggers = new Array(100).fill(caseTrigger);
                    return [4 /*yield*/, (0, insertCourtCases_1.insertDummyCourtCasesWithTriggers)(caseTriggers, "01")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["01"], maxPageItems: "10" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(10);
                    expect(cases[0].triggers[0].triggerCode).toBe("TRPR0001");
                    expect(cases[0].triggers[0].status).toBe("Unresolved");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return the next page of items", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(Array.from(Array(100)).map(function () { return ({ orgForPoliceFilter: "36FPA1" }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "2" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(10);
                    expect(cases[0].errorId).toBe(10);
                    expect(cases[9].errorId).toBe(19);
                    expect(cases[0].messageId).toBe("xxx10");
                    expect(cases[9].messageId).toBe("xxx19");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return the last page of items correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(Array.from(Array(100)).map(function () { return ({ orgForPoliceFilter: "36FPA1" }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "10" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(10);
                    expect(cases[0].errorId).toBe(90);
                    expect(cases[9].errorId).toBe(99);
                    expect(cases[0].messageId).toBe("xxx90");
                    expect(cases[9].messageId).toBe("xxx99");
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("shouldn't return any cases if the page number is greater than the total pages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, cases, totalCases;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(Array.from(Array(100)).map(function () { return ({ orgForPoliceFilter: "36FPA1" }); }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "11" })];
                case 2:
                    result = _b.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(0);
                    expect(totalCases).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should order by court name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var orgCode, resultAsc, _a, casesAsc, totalCasesAsc, resultDesc, _b, casesDesc, totalCasesDesc;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    orgCode = "36FPA1";
                    return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["BBBB", "CCCC", "AAAA"].map(function (courtName) { return ({ courtName: courtName, orgForPoliceFilter: orgCode }); }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtName" })];
                case 2:
                    resultAsc = _c.sent();
                    expect((0, Result_1.isError)(resultAsc)).toBe(false);
                    _a = resultAsc, casesAsc = _a.result, totalCasesAsc = _a.totalCases;
                    expect(casesAsc).toHaveLength(3);
                    expect(casesAsc[0].courtName).toBe("AAAA");
                    expect(casesAsc[1].courtName).toBe("BBBB");
                    expect(casesAsc[2].courtName).toBe("CCCC");
                    expect(totalCasesAsc).toBe(3);
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                            forces: [orgCode],
                            maxPageItems: "100",
                            orderBy: "courtName",
                            order: "desc"
                        })];
                case 3:
                    resultDesc = _c.sent();
                    expect((0, Result_1.isError)(resultDesc)).toBe(false);
                    _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                    expect(casesDesc).toHaveLength(3);
                    expect(casesDesc[0].courtName).toBe("CCCC");
                    expect(casesDesc[1].courtName).toBe("BBBB");
                    expect(casesDesc[2].courtName).toBe("AAAA");
                    expect(totalCasesDesc).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should order by court date", function () { return __awaiter(void 0, void 0, void 0, function () {
        var orgCode, firstDate, secondDate, thirdDate, result, _a, cases, totalCases, resultDesc, _b, casesDesc, totalCasesDesc;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    orgCode = "36FPA1";
                    firstDate = new Date("2001-09-26");
                    secondDate = new Date("2008-01-26");
                    thirdDate = new Date("2013-10-16");
                    return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                            { courtDate: secondDate, orgForPoliceFilter: orgCode },
                            { courtDate: firstDate, orgForPoliceFilter: orgCode },
                            { courtDate: thirdDate, orgForPoliceFilter: orgCode }
                        ])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtDate" })];
                case 2:
                    result = _c.sent();
                    expect((0, Result_1.isError)(result)).toBe(false);
                    _a = result, cases = _a.result, totalCases = _a.totalCases;
                    expect(cases).toHaveLength(3);
                    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate));
                    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate));
                    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate));
                    expect(totalCases).toBe(3);
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                            forces: [orgCode],
                            maxPageItems: "100",
                            orderBy: "courtDate",
                            order: "desc"
                        })];
                case 3:
                    resultDesc = _c.sent();
                    expect((0, Result_1.isError)(resultDesc)).toBe(false);
                    _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                    expect(casesDesc).toHaveLength(3);
                    expect(casesDesc[0].courtDate).toStrictEqual(thirdDate);
                    expect(casesDesc[1].courtDate).toStrictEqual(secondDate);
                    expect(casesDesc[2].courtDate).toStrictEqual(firstDate);
                    expect(totalCasesDesc).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("ordered by 'lockedBy' reason", function () {
        it("should order by error reason as primary order", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultAsc, _a, casesAsc, totalCasesAsc, resultDesc, _b, casesDesc, totalCasesDesc;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["HO100100", "HO100101", "HO100102"].map(function (code) { return ({ errorReason: code, orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "reason" })];
                    case 2:
                        resultAsc = _c.sent();
                        expect((0, Result_1.isError)(resultAsc)).toBe(false);
                        _a = resultAsc, casesAsc = _a.result, totalCasesAsc = _a.totalCases;
                        expect(casesAsc).toHaveLength(3);
                        expect(casesAsc[0].errorReason).toBe("HO100100");
                        expect(casesAsc[1].errorReason).toBe("HO100101");
                        expect(casesAsc[2].errorReason).toBe("HO100102");
                        expect(totalCasesAsc).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                orderBy: "reason",
                                order: "desc"
                            })];
                    case 3:
                        resultDesc = _c.sent();
                        expect((0, Result_1.isError)(resultDesc)).toBe(false);
                        _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                        expect(casesDesc).toHaveLength(3);
                        expect(casesDesc[0].errorReason).toBe("HO100102");
                        expect(casesDesc[1].errorReason).toBe("HO100101");
                        expect(casesDesc[2].errorReason).toBe("HO100100");
                        expect(totalCasesDesc).toBe(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should order by trigger reason as secondary order", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultAsc, _a, casesAsc, totalCasesAsc, resultDesc, _b, casesDesc, totalCasesDesc;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["TRPR0010", "TRPR0011", "TRPR0012"].map(function (code) { return ({ triggerReason: code, orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "reason" })];
                    case 2:
                        resultAsc = _c.sent();
                        expect((0, Result_1.isError)(resultAsc)).toBe(false);
                        _a = resultAsc, casesAsc = _a.result, totalCasesAsc = _a.totalCases;
                        expect(casesAsc).toHaveLength(3);
                        expect(casesAsc[0].triggerReason).toBe("TRPR0010");
                        expect(casesAsc[1].triggerReason).toBe("TRPR0011");
                        expect(casesAsc[2].triggerReason).toBe("TRPR0012");
                        expect(totalCasesAsc).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                orderBy: "reason",
                                order: "desc"
                            })];
                    case 3:
                        resultDesc = _c.sent();
                        expect((0, Result_1.isError)(resultDesc)).toBe(false);
                        _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                        expect(casesDesc).toHaveLength(3);
                        expect(casesDesc[0].triggerReason).toBe("TRPR0012");
                        expect(casesDesc[1].triggerReason).toBe("TRPR0011");
                        expect(casesDesc[2].triggerReason).toBe("TRPR0010");
                        expect(totalCasesDesc).toBe(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("should order by notes number", function () { return __awaiter(void 0, void 0, void 0, function () {
        var caseNotes, orgCode, resultAsc, _a, casesAsc, totalCasesAsc, resultDesc, _b, casesDesc, totalCasesDesc;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    caseNotes = [
                        [
                            {
                                user: "System",
                                text: "System note 1"
                            }
                        ],
                        [
                            {
                                user: "System",
                                text: "System note 2"
                            },
                            {
                                user: "bichard01",
                                text: "Test note 1"
                            },
                            {
                                user: "System",
                                text: "System note 3"
                            }
                        ],
                        [
                            {
                                user: "bichard01",
                                text: "Test note 2"
                            },
                            {
                                user: "bichard02",
                                text: "Test note 3"
                            },
                            {
                                user: "bichard01",
                                text: "Test note 2"
                            }
                        ]
                    ];
                    orgCode = "36FPA1";
                    return [4 /*yield*/, (0, insertCourtCases_1.insertDummyCourtCasesWithNotes)(caseNotes, "01")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                            forces: [orgCode],
                            maxPageItems: "100",
                            orderBy: "notes"
                        })];
                case 2:
                    resultAsc = _c.sent();
                    expect((0, Result_1.isError)(resultAsc)).toBe(false);
                    _a = resultAsc, casesAsc = _a.result, totalCasesAsc = _a.totalCases;
                    expect(casesAsc).toHaveLength(3);
                    expect(casesAsc[0].notes).toHaveLength(1);
                    expect(casesAsc[1].notes).toHaveLength(3);
                    expect(casesAsc[2].notes).toHaveLength(3);
                    expect(totalCasesAsc).toBe(3);
                    return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                            forces: [orgCode],
                            maxPageItems: "100",
                            orderBy: "notes",
                            order: "desc"
                        })];
                case 3:
                    resultDesc = _c.sent();
                    expect((0, Result_1.isError)(resultDesc)).toBe(false);
                    _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                    expect(casesDesc).toHaveLength(3);
                    expect(casesDesc[0].notes).toHaveLength(3);
                    expect(casesDesc[1].notes).toHaveLength(3);
                    expect(casesDesc[2].notes).toHaveLength(1);
                    expect(totalCasesDesc).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("ordered by 'lockedBy' username", function () {
        it("should order by errorLockedByUsername as primary order and triggerLockedByUsername as secondary order", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultAsc, _a, casesAsc, totalCasesAsc, resultDesc, _b, casesDesc, totalCasesDesc;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { errorLockedByUsername: "User1", triggerLockedByUsername: "User4", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User1", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User2", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                orderBy: "lockedBy"
                            })];
                    case 2:
                        resultAsc = _c.sent();
                        expect((0, Result_1.isError)(resultAsc)).toBe(false);
                        _a = resultAsc, casesAsc = _a.result, totalCasesAsc = _a.totalCases;
                        expect(casesAsc).toHaveLength(3);
                        expect(casesAsc[0].errorLockedByUsername).toBe("User1");
                        expect(casesAsc[0].triggerLockedByUsername).toBe("User3");
                        expect(casesAsc[1].errorLockedByUsername).toBe("User1");
                        expect(casesAsc[1].triggerLockedByUsername).toBe("User4");
                        expect(casesAsc[2].errorLockedByUsername).toBe("User2");
                        expect(casesAsc[2].triggerLockedByUsername).toBe("User1");
                        expect(totalCasesAsc).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                orderBy: "lockedBy",
                                order: "desc"
                            })];
                    case 3:
                        resultDesc = _c.sent();
                        expect((0, Result_1.isError)(resultDesc)).toBe(false);
                        _b = resultDesc, casesDesc = _b.result, totalCasesDesc = _b.totalCases;
                        expect(casesDesc).toHaveLength(3);
                        expect(casesDesc[0].errorLockedByUsername).toBe("User2");
                        expect(casesDesc[0].triggerLockedByUsername).toBe("User1");
                        expect(casesDesc[1].errorLockedByUsername).toBe("User1");
                        expect(casesDesc[1].triggerLockedByUsername).toBe("User4");
                        expect(casesDesc[2].errorLockedByUsername).toBe("User1");
                        expect(casesDesc[2].triggerLockedByUsername).toBe("User3");
                        expect(totalCasesDesc).toBe(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("search by defendant name", function () {
        it("should list cases when there is a case insensitive match", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, defendantToInclude, defendantToIncludeWithPartialMatch, defendantToNotInclude, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "01FPA1";
                        defendantToInclude = "WAYNE Bruce";
                        defendantToIncludeWithPartialMatch = "WAYNE Bill";
                        defendantToNotInclude = "GORDON Barbara";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
                                { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
                                { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                defendantName: "WAYNE Bruce"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].defendantName).toStrictEqual(defendantToInclude);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                defendantName: "WAYNE B"
                            })];
                    case 3:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases[0].defendantName).toStrictEqual(defendantToInclude);
                        expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("filter by cases allocated to me", function () {
        it("should list cases that are locked to me", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultBefore, _a, casesBefore, totalCasesBefore, resultAfter, _b, casesAfter, totalCasesAfter;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { errorLockedByUsername: "User1", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User2", triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User3", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100"
                            })];
                    case 2:
                        resultBefore = _c.sent();
                        expect((0, Result_1.isError)(resultBefore)).toBe(false);
                        _a = resultBefore, casesBefore = _a.result, totalCasesBefore = _a.totalCases;
                        expect(casesBefore).toHaveLength(3);
                        expect(casesBefore[0].errorLockedByUsername).toBe("User1");
                        expect(casesBefore[0].triggerLockedByUsername).toBe("User1");
                        expect(casesBefore[1].errorLockedByUsername).toBe("User2");
                        expect(casesBefore[1].triggerLockedByUsername).toBe("User2");
                        expect(casesBefore[2].errorLockedByUsername).toBe("User3");
                        expect(casesBefore[2].triggerLockedByUsername).toBe("User3");
                        expect(totalCasesBefore).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                allocatedToUserName: "User1"
                            })];
                    case 3:
                        resultAfter = _c.sent();
                        expect((0, Result_1.isError)(resultAfter)).toBe(false);
                        _b = resultAfter, casesAfter = _b.result, totalCasesAfter = _b.totalCases;
                        expect(casesAfter).toHaveLength(1);
                        expect(casesAfter[0].errorLockedByUsername).toBe("User1");
                        expect(casesAfter[0].triggerLockedByUsername).toBe("User1");
                        expect(totalCasesAfter).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should list cases that have triggers locked to me", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultBefore, _a, casesBefore, totalCasesBefore, resultAfter, _b, casesAfter, totalCasesAfter;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
                                { triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
                                { triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100"
                            })];
                    case 2:
                        resultBefore = _c.sent();
                        expect((0, Result_1.isError)(resultBefore)).toBe(false);
                        _a = resultBefore, casesBefore = _a.result, totalCasesBefore = _a.totalCases;
                        expect(casesBefore).toHaveLength(3);
                        expect(casesBefore[0].triggerLockedByUsername).toBe("User1");
                        expect(casesBefore[1].triggerLockedByUsername).toBe("User2");
                        expect(casesBefore[2].triggerLockedByUsername).toBe("User3");
                        expect(totalCasesBefore).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                allocatedToUserName: "User1"
                            })];
                    case 3:
                        resultAfter = _c.sent();
                        expect((0, Result_1.isError)(resultAfter)).toBe(false);
                        _b = resultAfter, casesAfter = _b.result, totalCasesAfter = _b.totalCases;
                        expect(casesAfter).toHaveLength(1);
                        expect(casesAfter[0].triggerLockedByUsername).toBe("User1");
                        expect(totalCasesAfter).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should list cases that have errors locked to me", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resultBefore, _a, casesBefore, totalCasesBefore, resultAfter, _b, casesAfter, totalCasesAfter;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgCode = "36FPA1";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { errorLockedByUsername: "User1", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User2", orgForPoliceFilter: orgCode },
                                { errorLockedByUsername: "User3", orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100"
                            })];
                    case 2:
                        resultBefore = _c.sent();
                        expect((0, Result_1.isError)(resultBefore)).toBe(false);
                        _a = resultBefore, casesBefore = _a.result, totalCasesBefore = _a.totalCases;
                        expect(casesBefore).toHaveLength(3);
                        expect(casesBefore[0].errorLockedByUsername).toBe("User1");
                        expect(casesBefore[1].errorLockedByUsername).toBe("User2");
                        expect(casesBefore[2].errorLockedByUsername).toBe("User3");
                        expect(totalCasesBefore).toBe(3);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                allocatedToUserName: "User1"
                            })];
                    case 3:
                        resultAfter = _c.sent();
                        expect((0, Result_1.isError)(resultAfter)).toBe(false);
                        _b = resultAfter, casesAfter = _b.result, totalCasesAfter = _b.totalCases;
                        expect(casesAfter).toHaveLength(1);
                        expect(casesAfter[0].errorLockedByUsername).toBe("User1");
                        expect(totalCasesAfter).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("search by court name", function () {
        it("should list cases when there is a case insensitive match", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, courtNameToInclude, courtNameToIncludeWithPartialMatch, courtNameToNotInclude, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "01FPA1";
                        courtNameToInclude = "Magistrates' Courts London Croydon";
                        courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else";
                        courtNameToNotInclude = "Court Name not to include";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
                                { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
                                { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                courtName: "Magistrates' Courts London Croydon"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].courtName).toStrictEqual(courtNameToInclude);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                courtName: "magistrates' courts london"
                            })];
                    case 3:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases[0].courtName).toStrictEqual(courtNameToInclude);
                        expect(cases[1].courtName).toStrictEqual(courtNameToIncludeWithPartialMatch);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("search by ptiurn", function () {
        it("should list cases when there is a case insensitive match", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, ptiurnToInclude, ptiurnToIncludeWithPartialMatch, ptiurnToNotInclude, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "01FPA1";
                        ptiurnToInclude = "01ZD0303908";
                        ptiurnToIncludeWithPartialMatch = "01ZD0303909";
                        ptiurnToNotInclude = "00000000000";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { ptiurn: ptiurnToInclude, orgForPoliceFilter: orgCode },
                                { ptiurn: ptiurnToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
                                { ptiurn: ptiurnToNotInclude, orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                ptiurn: "01ZD0303908"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                ptiurn: "01ZD030390"
                            })];
                    case 3:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude);
                        expect(cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("search by reason", function () {
        it("should list cases when there is a case insensitive match in triggers or exceptions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var triggerToInclude, triggerToIncludePartialMatch, triggerNotToInclude, errorToInclude, errorToIncludePartialMatch, errorNotToInclude, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01", "01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        triggerToInclude = {
                            triggerId: 0,
                            triggerCode: "TRPR0111",
                            status: "Unresolved",
                            createdAt: new Date("2022-07-09T10:22:34.000Z")
                        };
                        triggerToIncludePartialMatch = {
                            triggerId: 1,
                            triggerCode: "TRPR2222",
                            status: "Unresolved",
                            createdAt: new Date("2022-07-09T10:22:34.000Z")
                        };
                        triggerNotToInclude = {
                            triggerId: 2,
                            triggerCode: "TRPR9999",
                            status: "Unresolved",
                            createdAt: new Date("2022-07-09T10:22:34.000Z")
                        };
                        errorToInclude = "HO00001";
                        errorToIncludePartialMatch = "HO002222";
                        errorNotToInclude = "HO999999";
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(0, [triggerToInclude, triggerToIncludePartialMatch])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(1, errorToInclude, "".concat(errorToInclude, "||ds:XMLField"))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(2, errorToIncludePartialMatch, "".concat(errorToIncludePartialMatch, "||ds:XMLField"))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(3, errorNotToInclude, "".concat(errorNotToInclude, "||ds:XMLField"))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(3, [triggerNotToInclude])
                            // Searching for a full matched trigger code
                        ];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasonCode: triggerToInclude.triggerCode
                            })];
                    case 7:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToInclude.triggerCode);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasonCode: errorToInclude
                            })];
                    case 8:
                        // Searching for a full matched error code
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].errorReason).toStrictEqual(errorToInclude);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasonCode: "2222"
                            })];
                    case 9:
                        // Searching for a partial match error/trigger code
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToIncludePartialMatch.triggerCode);
                        expect(cases[1].errorReason).toStrictEqual(errorToIncludePartialMatch);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should list cases when there is a case insensitive match in any exceptions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorToInclude, anotherErrorToInclude, errorNotToInclude, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        errorToInclude = "HO100322";
                        anotherErrorToInclude = "HO100323";
                        errorNotToInclude = "HO200212";
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(0, errorToInclude, "".concat(errorToInclude, "||ds:OrganisationUnitCode"))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(0, anotherErrorToInclude, "".concat(anotherErrorToInclude, "||ds:NextHearingDate"))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(1, errorNotToInclude, "".concat(errorNotToInclude, "||ds:XMLField"))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasonCode: errorToInclude
                            })];
                    case 5:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].errorReport).toBe("".concat(errorToInclude, "||ds:OrganisationUnitCode, ").concat(anotherErrorToInclude, "||ds:NextHearingDate"));
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasonCode: anotherErrorToInclude
                            })];
                    case 6:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBe(false);
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].errorReport).toBe("".concat(errorToInclude, "||ds:OrganisationUnitCode, ").concat(anotherErrorToInclude, "||ds:NextHearingDate"));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases having reason", function () {
        var testTrigger = {
            triggerId: 0,
            triggerCode: "TRPR0001",
            status: "Unresolved",
            createdAt: new Date("2022-07-09T10:22:34.000Z")
        };
        var conditionalBailTrigger = {
            triggerId: 0,
            triggerCode: "TRPR0010",
            status: "Unresolved",
            createdAt: new Date("2022-07-09T10:22:34.000Z")
        };
        var bailDirectionTrigger = {
            triggerId: 0,
            triggerCode: "TRPR0019",
            status: "Unresolved",
            createdAt: new Date("2022-07-09T10:22:34.000Z")
        };
        var preChargeBailApplicationTrigger = {
            triggerId: 0,
            triggerCode: "TRPR0019",
            status: "Unresolved",
            createdAt: new Date("2022-07-09T10:22:34.000Z")
        };
        it("Should filter by whether a case has triggers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(0, [testTrigger])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(1, [bailDirectionTrigger])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasons: ["Triggers"]
                            })];
                    case 4:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases[0].errorId).toBe(0);
                        expect(cases[1].errorId).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter by whether a case has excecptions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(0, "HO100300")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(1, [testTrigger])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasons: ["Exceptions"]
                            })];
                    case 4:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases[0].errorId).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter cases that has bails", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01", "01", "01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(0, "HO100300")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(1, [testTrigger])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(2, [conditionalBailTrigger])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(3, [bailDirectionTrigger])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(4, [preChargeBailApplicationTrigger])];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasons: ["Bails"]
                            })];
                    case 7:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        expect(cases[0].errorId).toBe(2);
                        expect(cases[1].errorId).toBe(3);
                        expect(cases[2].errorId).toBe(4);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter cases with all reasons", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(["01", "01", "01", "01"].map(function (orgCode) { return ({ orgForPoliceFilter: orgCode }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, manageExceptions_1["default"])(0, "HO100300")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(1, [testTrigger])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(2, [conditionalBailTrigger])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                reasons: ["Exceptions", "Triggers", "Bails"]
                            })];
                    case 5:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        expect(cases[0].errorId).toBe(0);
                        expect(cases[1].errorId).toBe(1);
                        expect(cases[2].errorId).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases by urgency", function () {
        it("Should filter only urgent cases", function () { return __awaiter(void 0, void 0, void 0, function () {
            var forceCode, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forceCode = "01";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: true, orgForPoliceFilter: forceCode },
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: true, orgForPoliceFilter: forceCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                urgent: "Urgent"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([1, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter non-urgent cases", function () { return __awaiter(void 0, void 0, void 0, function () {
            var forceCode, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forceCode = "01";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: true, orgForPoliceFilter: forceCode },
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: false, orgForPoliceFilter: forceCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100",
                                urgent: "Non-urgent"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not filter cases when the urgent filter is undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
            var forceCode, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forceCode = "01";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: true, orgForPoliceFilter: forceCode },
                                { isUrgent: false, orgForPoliceFilter: forceCode },
                                { isUrgent: true, orgForPoliceFilter: forceCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: ["01"],
                                maxPageItems: "100"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(4);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases by court date", function () {
        it("Should filter cases that within a start and end date", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, firstDate, secondDate, thirdDate, fourthDate, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FPA1";
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
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                courtDateRange: { from: new Date("2008-01-01"), to: new Date("2008-12-31") }
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter cases by multiple date ranges", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, firstDate, secondDate, thirdDate, fourthDate, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FPA1";
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
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                courtDateRange: [
                                    { from: new Date("2008-01-26"), to: new Date("2008-01-26") },
                                    { from: new Date("2008-03-26"), to: new Date("2008-03-26") },
                                    { from: new Date("2013-10-16"), to: new Date("2013-10-16") }
                                ]
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([1, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases by locked status", function () {
        it("Should filter cases that are locked", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: orgCode },
                                { orgForPoliceFilter: orgCode }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                locked: true
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter cases that are unlocked", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, lockedCase, unlockedCase, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        lockedCase = {
                            errorId: 0,
                            errorLockedByUsername: "bichard01",
                            triggerLockedByUsername: "bichard01",
                            messageId: "0"
                        };
                        unlockedCase = {
                            errorId: 1,
                            messageId: "1"
                        };
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([lockedCase, unlockedCase])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                locked: false
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should treat cases with only one lock as locked.", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, lockedResult, lockedCases, unlockedResult, unlockedCases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([
                                {
                                    errorId: 0,
                                    errorLockedByUsername: "bichard01",
                                    messageId: "0"
                                },
                                {
                                    errorId: 1,
                                    triggerLockedByUsername: "bichard01",
                                    messageId: "1"
                                },
                                {
                                    errorId: 2,
                                    messageId: "2"
                                }
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                locked: true
                            })];
                    case 2:
                        lockedResult = _a.sent();
                        expect((0, Result_1.isError)(lockedResult)).toBeFalsy();
                        lockedCases = lockedResult.result;
                        expect(lockedCases).toHaveLength(2);
                        expect(lockedCases.map(function (c) { return c.errorId; })).toStrictEqual([0, 1]);
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                locked: false
                            })];
                    case 3:
                        unlockedResult = _a.sent();
                        expect((0, Result_1.isError)(unlockedResult)).toBeFalsy();
                        unlockedCases = unlockedResult.result;
                        expect(unlockedCases).toHaveLength(1);
                        expect(unlockedCases.map(function (c) { return c.errorId; })).toStrictEqual([2]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases by case state", function () {
        it("Should return unresolved cases if case state not set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map(function (timeStamp) { return ({
                                resolutionTimestamp: timeStamp,
                                orgForPoliceFilter: orgCode
                            }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(1);
                        expect(cases.map(function (c) { return c.resolutionTimestamp; })).toStrictEqual([null]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should filter cases that are resolved", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map(function (timeStamp) { return ({
                                resolutionTimestamp: timeStamp,
                                orgForPoliceFilter: orgCode
                            }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                caseState: "Resolved"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        expect(cases.map(function (c) { return c.resolutionTimestamp; })).toStrictEqual([
                            resolutionTimestamp,
                            resolutionTimestamp,
                            resolutionTimestamp
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return all cases if case state is 'Unresolved and resolved'", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)([null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map(function (timeStamp) { return ({
                                resolutionTimestamp: timeStamp,
                                orgForPoliceFilter: orgCode
                            }); }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                caseState: "Unresolved and resolved"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(4);
                        expect(cases.map(function (c) { return c.resolutionTimestamp; })).toStrictEqual([
                            null,
                            resolutionTimestamp,
                            resolutionTimestamp,
                            resolutionTimestamp
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Filter cases by resolution status", function () {
        it("should show supervisors all resolved cases for their force", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, casesToInsert, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        casesToInsert = [undefined, "Bichard01", "Supervisor", "Bichard02", undefined].map(function (resolver) { return ({
                            resolutionTimestamp: resolver !== undefined ? resolutionTimestamp : null,
                            errorResolvedTimestamp: resolver !== undefined ? resolutionTimestamp : null,
                            errorResolvedBy: resolver !== null && resolver !== void 0 ? resolver : null,
                            orgForPoliceFilter: orgCode
                        }); });
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(casesToInsert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                caseState: "Resolved"
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(3);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([1, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should show handlers cases that they resolved", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, thisUser, otherUser, casesToInsert, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        thisUser = "Bichard01";
                        otherUser = "Bichard02";
                        casesToInsert = [thisUser, otherUser, thisUser, otherUser].map(function (user) { return ({
                            resolutionTimestamp: resolutionTimestamp,
                            orgForPoliceFilter: orgCode,
                            errorResolvedBy: user
                        }); });
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(casesToInsert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                caseState: "Resolved",
                                resolvedByUsername: thisUser
                            })];
                    case 2:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([0, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should show handlers cases that they resolved a trigger for", function () { return __awaiter(void 0, void 0, void 0, function () {
            var orgCode, resolutionTimestamp, thisUser, otherUser, casesToInsert, result, cases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orgCode = "36FP";
                        resolutionTimestamp = new Date();
                        thisUser = "Bichard01";
                        otherUser = "Bichard02";
                        casesToInsert = [
                            {
                                resolutionTimestamp: resolutionTimestamp,
                                orgForPoliceFilter: orgCode,
                                errorResolvedBy: otherUser
                            },
                            {
                                resolutionTimestamp: resolutionTimestamp,
                                orgForPoliceFilter: orgCode,
                                errorResolvedBy: otherUser
                            },
                            {
                                resolutionTimestamp: resolutionTimestamp,
                                orgForPoliceFilter: orgCode,
                                errorResolvedBy: otherUser,
                                triggerResolvedBy: thisUser
                            }
                        ];
                        return [4 /*yield*/, (0, insertCourtCases_1.insertCourtCasesWithFields)(casesToInsert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, manageTriggers_1.insertTriggers)(0, [
                                {
                                    triggerId: 0,
                                    triggerCode: "TRPR0010",
                                    status: "Resolved",
                                    createdAt: resolutionTimestamp,
                                    resolvedAt: resolutionTimestamp,
                                    resolvedBy: thisUser
                                }
                            ])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, listCourtCases_1["default"])(dataSource, {
                                forces: [orgCode],
                                maxPageItems: "100",
                                caseState: "Resolved",
                                resolvedByUsername: thisUser
                            })];
                    case 3:
                        result = _a.sent();
                        expect((0, Result_1.isError)(result)).toBeFalsy();
                        cases = result.result;
                        expect(cases).toHaveLength(2);
                        expect(cases.map(function (c) { return c.errorId; })).toStrictEqual([0, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
