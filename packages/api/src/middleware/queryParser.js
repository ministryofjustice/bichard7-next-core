"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
var url_1 = require("url");
exports["default"] = (function (req, _, next) {
    var rawQuery = url_1["default"].parse(req.url).query;
    var query = (0, qs_1.parse)(rawQuery);
    req.query = query;
    next();
});
