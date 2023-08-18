"use strict";
exports.__esModule = true;
var delimitedPrefixedString_1 = require("./delimitedPrefixedString");
var transformer;
describe("delimiterPrefixedString value transformer", function () {
    beforeAll(function () {
        transformer = (0, delimitedPrefixedString_1["default"])(",", "0");
    });
    it("can transform forces from a string into an array", function () {
        expect(transformer.from("011111,011112")).toStrictEqual(["11111", "11112"]);
    });
    it("creates an empty array when there are no forces", function () {
        expect(transformer.from("")).toStrictEqual([]);
    });
    it("can transform the array back to the original value", function () {
        expect(transformer.to(["11111", "11112"])).toBe("011111,011112");
        expect(transformer.to([])).toBe("");
    });
});
