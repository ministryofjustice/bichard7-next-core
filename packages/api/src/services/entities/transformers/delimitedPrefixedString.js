"use strict";
exports.__esModule = true;
var delimitedPrefixedString = function (delimeter, prefix) { return ({
    to: function (value) { return value.map(function (f) { return prefix + f; }).join(delimeter); },
    from: function (value) {
        var _a, _b;
        return (_b = (_a = value === null || value === void 0 ? void 0 : value.split(delimeter).map(function (f) { return f.substring(prefix.length); })) === null || _a === void 0 ? void 0 : _a.filter(function (force) { return force != ""; })) !== null && _b !== void 0 ? _b : [];
    }
}); };
exports["default"] = delimitedPrefixedString;
