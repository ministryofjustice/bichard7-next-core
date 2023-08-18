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
var typeorm_1 = require("typeorm");
var Result_1 = require("../types/Result");
var bailCodes_1 = require("../utils/bailCodes");
var CourtCase_1 = require("./entities/CourtCase");
var courtCasesByVisibleForcesQuery_1 = require("./queries/courtCasesByVisibleForcesQuery");
var Note_1 = require("./entities/Note");
var listCourtCases = function (connection, _a) {
    var pageNum = _a.pageNum, maxPageItems = _a.maxPageItems, forces = _a.forces, orderBy = _a.orderBy, order = _a.order, defendantName = _a.defendantName, courtName = _a.courtName, ptiurn = _a.ptiurn, reasons = _a.reasons, urgent = _a.urgent, courtDateRange = _a.courtDateRange, locked = _a.locked, caseState = _a.caseState, allocatedToUserName = _a.allocatedToUserName, reasonCode = _a.reasonCode, resolvedByUsername = _a.resolvedByUsername;
    return __awaiter(void 0, void 0, void 0, function () {
        var pageNumValidated, maxPageItemsValidated, repository, subquery, query, sortOrder, orderByQuery, defendantNameLike, courtNameLike, ptiurnLike, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
                    ;
                    maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25;
                    repository = connection.getRepository(CourtCase_1["default"]);
                    subquery = connection
                        .getRepository(Note_1["default"])
                        .createQueryBuilder("notes")
                        .select("COUNT(note_id)")
                        .where("error_id = courtCase.errorId");
                    query = repository.createQueryBuilder("courtCase");
                    query = (0, courtCasesByVisibleForcesQuery_1["default"])(query, forces);
                    query
                        .leftJoinAndSelect("courtCase.triggers", "trigger")
                        .leftJoinAndSelect("courtCase.notes", "note")
                        .skip(pageNumValidated * maxPageItemsValidated)
                        .take(maxPageItemsValidated);
                    sortOrder = order === "desc" ? "DESC" : "ASC";
                    // Primary sorts
                    if (orderBy === "reason") {
                        query.orderBy("courtCase.errorReason", sortOrder).addOrderBy("courtCase.triggerReason", sortOrder);
                    }
                    else if (orderBy === "lockedBy") {
                        query
                            .orderBy("courtCase.errorLockedByUsername", sortOrder)
                            .addOrderBy("courtCase.triggerLockedByUsername", sortOrder);
                    }
                    else if (orderBy === "isUrgent") {
                        query.orderBy("courtCase.isUrgent", sortOrder === "ASC" ? "DESC" : "ASC");
                    }
                    else if (orderBy === "notes") {
                        query
                            .addSelect("(".concat(subquery.getQuery(), ")"), "note_count")
                            .orderBy("note_count", sortOrder === "ASC" ? "ASC" : "DESC");
                    }
                    else {
                        orderByQuery = "courtCase.".concat(orderBy !== null && orderBy !== void 0 ? orderBy : "errorId");
                        query.orderBy(orderByQuery, sortOrder);
                    }
                    // Secondary sorts
                    if (orderBy !== "courtDate") {
                        query.addOrderBy("courtCase.courtDate", "DESC");
                    }
                    if (orderBy !== "ptiurn") {
                        query.addOrderBy("courtCase.ptiurn");
                    }
                    if (defendantName) {
                        defendantNameLike = { defendantName: (0, typeorm_1.ILike)("%".concat(defendantName, "%")) };
                        query.andWhere(defendantNameLike);
                    }
                    if (courtName) {
                        courtNameLike = { courtName: (0, typeorm_1.ILike)("%".concat(courtName, "%")) };
                        query.andWhere(courtNameLike);
                    }
                    if (ptiurn) {
                        ptiurnLike = { ptiurn: (0, typeorm_1.ILike)("%".concat(ptiurn, "%")) };
                        query.andWhere(ptiurnLike);
                    }
                    if (reasonCode) {
                        query.andWhere(new typeorm_1.Brackets(function (qb) {
                            qb.where("trigger.trigger_code ilike '%' || :reason || '%'", {
                                reason: reasonCode
                            }).orWhere("courtCase.error_report ilike '%' || :reason || '%'", {
                                reason: reasonCode
                            });
                        }));
                    }
                    if (reasons) {
                        query.andWhere(new typeorm_1.Brackets(function (qb) {
                            if (reasons === null || reasons === void 0 ? void 0 : reasons.includes("Triggers")) {
                                qb.where({ triggerCount: (0, typeorm_1.MoreThan)(0) });
                            }
                            if (reasons === null || reasons === void 0 ? void 0 : reasons.includes("Exceptions")) {
                                qb.orWhere({ errorCount: (0, typeorm_1.MoreThan)(0) });
                            }
                            if (reasons === null || reasons === void 0 ? void 0 : reasons.includes("Bails")) {
                                Object.keys(bailCodes_1.BailCodes).forEach(function (triggerCode, i) {
                                    var _a;
                                    var paramName = "bails".concat(i);
                                    qb.orWhere("trigger.trigger_code ilike '%' || :".concat(paramName, " || '%'"), (_a = {},
                                        _a[paramName] = triggerCode,
                                        _a));
                                });
                            }
                        }));
                    }
                    if (urgent === "Urgent") {
                        query.andWhere({ isUrgent: (0, typeorm_1.MoreThan)(0) });
                    }
                    else if (urgent === "Non-urgent") {
                        query.andWhere({ isUrgent: 0 });
                    }
                    if (courtDateRange) {
                        if (Array.isArray(courtDateRange)) {
                            query.andWhere(new typeorm_1.Brackets(function (qb) {
                                courtDateRange.forEach(function (dateRange) {
                                    qb.orWhere(new typeorm_1.Brackets(function (dateRangeQuery) {
                                        dateRangeQuery
                                            .andWhere({ courtDate: (0, typeorm_1.MoreThanOrEqual)(dateRange.from) })
                                            .andWhere({ courtDate: (0, typeorm_1.LessThanOrEqual)(dateRange.to) });
                                    }));
                                });
                            }));
                        }
                        else {
                            query
                                .andWhere({ courtDate: (0, typeorm_1.MoreThanOrEqual)(courtDateRange.from) })
                                .andWhere({ courtDate: (0, typeorm_1.LessThanOrEqual)(courtDateRange.to) });
                        }
                    }
                    if (!caseState) {
                        query.andWhere({
                            resolutionTimestamp: (0, typeorm_1.IsNull)()
                        });
                    }
                    else if (caseState === "Resolved") {
                        query.andWhere({
                            resolutionTimestamp: (0, typeorm_1.Not)((0, typeorm_1.IsNull)())
                        });
                        if (resolvedByUsername !== undefined) {
                            query.andWhere(new typeorm_1.Brackets(function (qb) {
                                qb.where({
                                    errorResolvedBy: resolvedByUsername
                                })
                                    .orWhere({
                                    triggerResolvedBy: resolvedByUsername
                                })
                                    .orWhere("trigger.resolvedBy = :triggerResolver", { triggerResolver: resolvedByUsername });
                            }));
                        }
                    }
                    if (allocatedToUserName) {
                        query.andWhere(new typeorm_1.Brackets(function (qb) {
                            qb.where({ errorLockedByUsername: allocatedToUserName }).orWhere({
                                triggerLockedByUsername: allocatedToUserName
                            });
                        }));
                    }
                    if (locked !== undefined) {
                        if (locked) {
                            query.andWhere(new typeorm_1.Brackets(function (qb) {
                                qb.where({ errorLockedByUsername: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }).orWhere({ triggerLockedByUsername: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) });
                            }));
                        }
                        else {
                            query.andWhere(new typeorm_1.Brackets(function (qb) {
                                qb.where({ errorLockedByUsername: (0, typeorm_1.IsNull)() }).andWhere({ triggerLockedByUsername: (0, typeorm_1.IsNull)() });
                            }));
                        }
                    }
                    return [4 /*yield*/, query.getManyAndCount()["catch"](function (error) { return error; })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, (0, Result_1.isError)(result)
                            ? result
                            : {
                                result: result[0],
                                totalCases: result[1]
                            }];
            }
        });
    });
};
exports["default"] = listCourtCases;
