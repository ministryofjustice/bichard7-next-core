"use strict";
exports.__esModule = true;
var globals_1 = require("@jest/globals");
var CourtCase_1 = require("../../../src/services/entities/CourtCase");
describe("CourtCase", function () {
    it("should be locked by another user when error is locked by another user", function () {
        var courtCase = new CourtCase_1["default"]();
        courtCase.errorLockedByUsername = "Another username";
        var result = courtCase.isLockedByAnotherUser("username");
        (0, globals_1.expect)(result).toBe(true);
    });
    it("should be locked by another user when trigger is locked by another user", function () {
        var courtCase = new CourtCase_1["default"]();
        courtCase.triggerLockedByUsername = "Another username";
        var result = courtCase.isLockedByAnotherUser("username");
        (0, globals_1.expect)(result).toBe(true);
    });
    it("should not be locked by another user when error is locked by the user", function () {
        var courtCase = new CourtCase_1["default"]();
        courtCase.errorLockedByUsername = "username";
        var result = courtCase.isLockedByAnotherUser("username");
        (0, globals_1.expect)(result).toBe(false);
    });
    it("should not be locked by another user when trigger is locked by the user", function () {
        var courtCase = new CourtCase_1["default"]();
        courtCase.triggerLockedByUsername = "username";
        var result = courtCase.isLockedByAnotherUser("username");
        (0, globals_1.expect)(result).toBe(false);
    });
    it("should not be locked by another user when error and trigger are not locked by any user", function () {
        var courtCase = new CourtCase_1["default"]();
        var result = courtCase.isLockedByAnotherUser("username");
        (0, globals_1.expect)(result).toBe(false);
    });
});
