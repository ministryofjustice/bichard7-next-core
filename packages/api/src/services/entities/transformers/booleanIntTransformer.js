"use strict";
exports.__esModule = true;
var booleanIntTransformer = {
    to: function (value) { return (value ? 1 : 0); },
    from: function (value) { return value !== 0; }
};
exports["default"] = booleanIntTransformer;
