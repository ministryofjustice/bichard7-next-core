"use strict";
exports.__esModule = true;
var queryParser_1 = require("../../src/middleware/queryParser");
describe("queryParser", function () {
    it("parses the query string correctly", function () {
        var req = {
            url: "example.com?boolean=true&array[0][foo]=bar&array[1][foo]=bar&number=3&string=string"
        };
        var res = {};
        var next = jest.fn();
        (0, queryParser_1["default"])(req, res, next);
        expect(req.query).toEqual({
            boolean: "true",
            array: [{ foo: "bar" }, { foo: "bar" }],
            number: "3",
            string: "string"
        });
        expect(next).toHaveBeenCalled();
    });
});
