"use strict";
exports.__esModule = true;
var zod_fixture_1 = require("zod-fixture");
var validate_1 = require("../../src/middleware/validate");
var createTestQuery = function () {
    var caseListQuery = (0, zod_fixture_1.createFixture)(validate_1.caseListQuerySchema);
    caseListQuery.courtDateRange = [{ from: new Date().toISOString(), to: new Date().toISOString() }];
    caseListQuery.maxPageItems = "100";
    caseListQuery.pageNum = "1";
    return caseListQuery;
};
describe("validateCourtCaseListQueryParams", function () {
    it("calls the next function if query has all required fields", function () {
        var req = { query: { forces: ["01"], maxPageItems: "10" } };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("stores the validated query in the request object", function () {
        var req = { query: { forces: ["01"], maxPageItems: "10" } };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(req.caseListQueryParams).toEqual({ forces: ["01"], maxPageItems: "10" });
    });
    it("returns 400 status code if forces are absent", function () {
        var req = { query: { maxPageItems: "10" } };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_type",
                    expected: "array",
                    received: "undefined",
                    path: ["forces"],
                    message: "Required"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 status code if maxPageItems are absent", function () {
        var req = { query: { forces: ["01"] } };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_type",
                    expected: "string",
                    received: "undefined",
                    path: ["maxPageItems"],
                    message: "Required"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 status code if maxPageItems is NaN", function () {
        var req = {
            query: { forces: ["01"], maxPageItems: "Not a number" }
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_string",
                    path: ["maxPageItems"],
                    message: "Invalid",
                    validation: "regex"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 status code if maxPageItems is less than 10", function () {
        var req = {
            query: { forces: ["01"], maxPageItems: "9" }
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_string",
                    path: ["maxPageItems"],
                    message: "Invalid",
                    validation: "regex"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 status code if maxPageItems is greater than 100", function () {
        var req = {
            query: { forces: ["01"], maxPageItems: "101" }
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_string",
                    path: ["maxPageItems"],
                    message: "Invalid",
                    validation: "regex"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("calls the next function if query has all optional fields", function () {
        var caseListQuery = createTestQuery();
        var req = {
            query: caseListQuery
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("returns 400 if query has an unexpected field", function () {
        var caseListQuery = createTestQuery();
        caseListQuery.foo = "bar";
        var req = {
            query: caseListQuery
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "unrecognized_keys",
                    keys: ["foo"],
                    path: [],
                    message: "Unrecognized key(s) in object: 'foo'"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 if caseState is set to an unexpected value", function () {
        var caseListQuery = createTestQuery();
        caseListQuery.caseState = "bar";
        var req = {
            query: caseListQuery
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    received: "bar",
                    code: "invalid_enum_value",
                    options: ["Resolved", "Unresolved and resolved"],
                    path: ["caseState"],
                    message: "Invalid enum value. Expected 'Resolved' | 'Unresolved and resolved', received 'bar'"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 if reasons is set to an unexpected value", function () {
        var caseListQuery = createTestQuery();
        caseListQuery.reasons = "foo";
        var req = {
            query: caseListQuery
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    code: "invalid_type",
                    expected: "array",
                    received: "string",
                    path: ["reasons"],
                    message: "Expected array, received string"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("returns 400 if urgency is set to an unexpected value", function () {
        var caseListQuery = createTestQuery();
        caseListQuery.urgent = "foo";
        var req = {
            query: caseListQuery
        };
        var res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        var next = jest.fn();
        (0, validate_1.validateCaseListQueryParams)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            issues: [
                {
                    received: "foo",
                    code: "invalid_enum_value",
                    options: ["Urgent", "Non-urgent"],
                    path: ["urgent"],
                    message: "Invalid enum value. Expected 'Urgent' | 'Non-urgent', received 'foo'"
                }
            ]
        });
        expect(next).not.toHaveBeenCalled();
    });
});
