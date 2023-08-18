"use strict";
exports.__esModule = true;
var API_KEY = process.env.API_KEY || "password";
exports["default"] = (function (req, res, next) {
    var _a;
    var authAttempt = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || null;
    switch (authAttempt) {
        case API_KEY:
            next();
            break;
        default:
            res.sendStatus(401);
    }
});
