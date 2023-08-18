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
var globals_1 = require("@jest/globals");
var User_1 = require("../../../src/services/entities/User");
var createUser = function () {
    var groups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        groups[_i] = arguments[_i];
    }
    var user = new User_1["default"]();
    user.groups = __spreadArray([], groups, true);
    return user;
};
describe("User", function () {
    test("canLockExceptions should return true and canLockTriggers should return false when user is in Exception Handler group", function () {
        var user = createUser("ExceptionHandler");
        (0, globals_1.expect)(user.canLockExceptions).toBe(true);
        (0, globals_1.expect)(user.canLockTriggers).toBe(false);
    });
    test("canLockExceptions should return false and canLockTriggers should return true when user is in Trigger Handler group", function () {
        var user = createUser("TriggerHandler");
        (0, globals_1.expect)(user.canLockExceptions).toBe(false);
        (0, globals_1.expect)(user.canLockTriggers).toBe(true);
    });
    test("canLockExceptions and canLockTriggers should return true when user is in General Handler group", function () {
        var user = createUser("GeneralHandler");
        (0, globals_1.expect)(user.canLockExceptions).toBe(true);
        (0, globals_1.expect)(user.canLockTriggers).toBe(true);
    });
    test("canLockExceptions and canLockTriggers should return true when user is in Allocator group", function () {
        var user = createUser("Allocator");
        (0, globals_1.expect)(user.canLockExceptions).toBe(true);
        (0, globals_1.expect)(user.canLockTriggers).toBe(true);
    });
    test("canLockExceptions and canLockTriggers should return true when user is in Supervisor group", function () {
        var user = createUser("Supervisor");
        (0, globals_1.expect)(user.canLockExceptions).toBe(true);
        (0, globals_1.expect)(user.canLockTriggers).toBe(true);
    });
    test("canLockExceptions and canLockTriggers should return false when user is in any other groups", function () {
        var user = createUser("Audit", "AuditLoggingManager", "NewUI", "SuperUserManager", "UserManager");
        (0, globals_1.expect)(user.canLockExceptions).toBe(false);
        (0, globals_1.expect)(user.canLockTriggers).toBe(false);
    });
});
