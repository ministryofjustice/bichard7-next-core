"use strict";
exports.__esModule = true;
var dateTransformer = {
    to: function (value) { return value; },
    from: function (value) { return (value !== null ? new Date(value) : null); }
};
exports["default"] = dateTransformer;
