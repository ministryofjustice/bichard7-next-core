"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var courtCasesByVisibleForcesQuery = function (query, forces) {
    query.where(new typeorm_1.Brackets(function (qb) {
        if (forces.length < 1) {
            qb.where(":numForces > 0", { numForces: forces.length });
            return query;
        }
        forces.forEach(function (force) {
            if (force.length === 1) {
                var condition = { orgForPoliceFilter: (0, typeorm_1.Like)("".concat(force, "__%")) };
                qb.where(condition);
            }
            else {
                var condition = { orgForPoliceFilter: (0, typeorm_1.Like)("".concat(force, "%")) };
                qb.orWhere(condition);
            }
            if (force.length > 3) {
                var subCodes = Array.from(__spreadArray([], force, true).keys())
                    .splice(4)
                    .map(function (index) { return force.substring(0, index); });
                qb.orWhere({ orgForPoliceFilter: (0, typeorm_1.In)(subCodes) });
            }
        });
    }));
    return query;
};
exports["default"] = courtCasesByVisibleForcesQuery;
