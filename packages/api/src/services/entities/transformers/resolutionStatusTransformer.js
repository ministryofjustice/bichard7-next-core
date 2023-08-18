"use strict";
exports.__esModule = true;
var resolveFindOperator_1 = require("./resolveFindOperator");
var resolutionStatusByCode = {
    1: "Unresolved",
    2: "Resolved",
    3: "Submitted"
};
var getResolutionStatusCodeByText = function (text) {
    return Object.keys(resolutionStatusByCode)
        .map(function (num) { return Number(num); })
        .find(function (code) { return resolutionStatusByCode[code] === text; });
};
var resolutionStatusTransformer = {
    from: function (value) {
        return resolutionStatusByCode[value];
    },
    to: function (value) {
        return (0, resolveFindOperator_1["default"])(value, function (input) { return getResolutionStatusCodeByText(input); });
    }
};
exports["default"] = resolutionStatusTransformer;
