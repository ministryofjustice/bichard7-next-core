"use strict";
exports.__esModule = true;
var featureFlagTransformer = {
    to: function (value) { return value; },
    from: function (value) { return value !== null && value !== void 0 ? value : {}; }
};
exports["default"] = featureFlagTransformer;
