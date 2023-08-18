"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.insertMultipleDummyCourtCases = exports.insertDummyCourtCasesWithTriggers = exports.insertDummyCourtCasesWithNotes = exports.insertCourtCasesWithFields = exports.insertCourtCases = exports.getDummyCourtCase = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var CourtCase_1 = require("../../src/services/entities/CourtCase");
var getDataSource_1 = require("../../src/services/getDataSource");
var HO100102_1_json_1 = require("../test-data/HO100102_1.json");
var DummyCourtCase_1 = require("./DummyCourtCase");
var getDummyCourtCase = function (overrides) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, getDataSource_1["default"])()];
            case 1: return [2 /*return*/, (_a.sent()).getRepository(CourtCase_1["default"]).create(__assign(__assign(__assign({}, DummyCourtCase_1["default"]), { hearingOutcome: HO100102_1_json_1["default"].hearingOutcomeXml }), overrides))];
        }
    });
}); };
exports.getDummyCourtCase = getDummyCourtCase;
var insertCourtCases = function (courtCases) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, getDataSource_1["default"])()];
        case 1: return [2 /*return*/, (_a.sent()).getRepository(CourtCase_1["default"]).save(Array.isArray(courtCases) ? courtCases : [courtCases])];
    }
}); }); };
exports.insertCourtCases = insertCourtCases;
var insertCourtCasesWithFields = function (cases) { return __awaiter(void 0, void 0, void 0, function () {
    var existingCourtCases, index, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                existingCourtCases = [];
                index = 0;
                _c.label = 1;
            case 1:
                if (!(index < cases.length)) return [3 /*break*/, 4];
                _b = (_a = existingCourtCases).push;
                return [4 /*yield*/, getDummyCourtCase(__assign({ errorId: index, messageId: String(index).padStart(5, "x"), ptiurn: "Case" + String(index).padStart(5, "0") }, cases[index]))];
            case 2:
                _b.apply(_a, [_c.sent()]);
                _c.label = 3;
            case 3:
                index++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, insertCourtCases(existingCourtCases)];
        }
    });
}); };
exports.insertCourtCasesWithFields = insertCourtCasesWithFields;
var insertMultipleDummyCourtCases = function (numToInsert, orgCode) {
    return insertCourtCasesWithFields(Array.from(Array(numToInsert)).map(function (_, index) { return ({
        orgForPoliceFilter: orgCode,
        defendantName: "Defendant Name ".concat(index)
    }); }));
};
exports.insertMultipleDummyCourtCases = insertMultipleDummyCourtCases;
var insertDummyCourtCasesWithNotes = function (caseNotes, orgCode) {
    return insertCourtCasesWithFields(caseNotes.map(function (notes, index) { return ({
        orgForPoliceFilter: orgCode,
        notes: notes.map(function (note, _) {
            return ({
                createdAt: new Date(),
                noteText: note.text,
                userId: note.user,
                errorId: index
            });
        })
    }); }));
};
exports.insertDummyCourtCasesWithNotes = insertDummyCourtCasesWithNotes;
var insertDummyCourtCasesWithTriggers = function (caseTriggers, orgCode) {
    return insertCourtCasesWithFields(caseTriggers.map(function (triggers, index) { return ({
        orgForPoliceFilter: orgCode,
        triggers: triggers.map(function (trigger, _) {
            return ({
                createdAt: new Date(),
                triggerCode: trigger.code,
                errorId: index,
                status: trigger.status
            });
        })
    }); }));
};
exports.insertDummyCourtCasesWithTriggers = insertDummyCourtCasesWithTriggers;
