"use strict";
exports.__esModule = true;
var express_1 = require("express");
var health_1 = require("../controllers/health");
var router = (0, express_1.Router)();
router.get("/", health_1.checkStatus);
exports["default"] = router;
