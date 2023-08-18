"use strict";
exports.__esModule = true;
var health_1 = require("../src/controllers/health");
describe("checkStatus", function () {
    it("returns a 200 status code", function () {
        var req = {};
        var res = {};
        res.sendStatus = jest.fn().mockReturnValue(res);
        (0, health_1.checkStatus)(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
});
