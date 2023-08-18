"use strict";
exports.__esModule = true;
var auth_1 = require("../../src/middleware/auth");
describe("auth", function () {
    it("returns a 401 unauthorised response if password is not in the authorization header", function () {
        var req = {};
        var res = {
            sendStatus: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, auth_1["default"])(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
    it("returns a 401 unauthorised response if incorrect password is in the authorization header", function () {
        var req = { headers: { authorization: "not-the-password" } };
        var res = {
            sendStatus: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, auth_1["default"])(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
    it("calls next if correct password is in the authorization header", function () {
        var req = { headers: { authorization: "password" } };
        var res = {
            sendStatus: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, auth_1["default"])(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
