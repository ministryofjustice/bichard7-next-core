"use strict";
exports.__esModule = true;
var https_1 = require("https");
var fs_1 = require("fs");
var app_1 = require("./app");
var PORT = process.env.PORT || "3333";
if (process.env.USE_SSL === "true") {
    var config = { key: fs_1["default"].readFileSync("/certs/server.key"), cert: fs_1["default"].readFileSync("/certs/server.crt") };
    https_1["default"].createServer(config, app_1["default"]).listen(PORT, function () { return console.log("app is listening on https port ".concat(PORT)); });
}
else {
    app_1["default"].listen(PORT, function () { return console.log("app is listening on http port ".concat(PORT)); });
}
