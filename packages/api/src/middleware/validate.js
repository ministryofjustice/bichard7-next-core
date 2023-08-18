"use strict";
exports.__esModule = true;
exports.validateCaseListQueryParams = exports.caseListQuerySchema = void 0;
var zod_1 = require("zod");
var parseBoolean = zod_1.z.preprocess(function (value) { return Boolean(value); }, zod_1.z.boolean());
exports.caseListQuerySchema = zod_1.z
    .object({
    forces: zod_1.z.array(zod_1.z.string()),
    maxPageItems: zod_1.z.string().regex(new RegExp(/^((100)|([1-9][0-9]{1}))$/gm)),
    allocatedToUserName: zod_1.z.string().optional(),
    caseState: zod_1.z["enum"](["Resolved", "Unresolved and resolved"]).optional(),
    courtDateRange: zod_1.z.array(zod_1.z.object({ from: zod_1.z.string().datetime(), to: zod_1.z.string().datetime() }).optional()).optional(),
    courtName: zod_1.z.string().optional(),
    defendantName: zod_1.z.string().optional(),
    locked: parseBoolean.optional(),
    order: zod_1.z.string().optional(),
    orderBy: zod_1.z.string().optional(),
    pageNum: zod_1.z
        .string()
        .regex(new RegExp(/^[0-9]*$/gm))
        .optional(),
    ptiurn: zod_1.z.string().optional(),
    reasonCode: zod_1.z.string().optional(),
    reasons: zod_1.z.array(zod_1.z.string()).optional(),
    resolvedByUsername: zod_1.z.string().optional(),
    urgent: zod_1.z["enum"](["Urgent", "Non-urgent"]).optional()
})
    .strict();
var validateCaseListQueryParams = function (req, res, next) {
    var query = req.query;
    try {
        req.caseListQueryParams = exports.caseListQuerySchema.parse(query);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            var issues = err.issues;
            res.status(400).json({ issues: issues });
        }
        else {
            res.status(500).json({ message: "internal server error" });
        }
    }
};
exports.validateCaseListQueryParams = validateCaseListQueryParams;
