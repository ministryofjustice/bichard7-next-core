import type { NextFunction, Response } from "express"
import { ZodError, z } from "zod"
import type { CaseListQueryRequest } from "../types/CaseListQueryRequest"

const parseBoolean = z.preprocess((value) => Boolean(value), z.boolean())

export const caseListQuerySchema: z.Schema = z
  .object({
    forces: z.array(z.string()),
    maxPageItems: z.string().regex(new RegExp(/^((100)|([1-9]\d))$/gm)), // numeric strings between 10 and 100
    allocatedToUserName: z.string().optional(),
    caseState: z.enum(["Resolved", "Unresolved and resolved"]).optional(),
    courtDateRange: z.array(z.object({ from: z.string().datetime(), to: z.string().datetime() }).optional()).optional(),
    courtName: z.string().optional(),
    defendantName: z.string().optional(),
    locked: parseBoolean.optional(),
    order: z.string().optional(),
    orderBy: z.string().optional(),
    pageNum: z.string().regex(new RegExp(/^\d*$/gm)).optional(), // only numeric characters
    ptiurn: z.string().optional(),
    reasonCode: z.string().optional(),
    reasons: z.array(z.string()).optional(),
    resolvedByUsername: z.string().optional(),
    urgent: z.enum(["Urgent", "Non-urgent"]).optional()
  })
  .strict()

export const validateCaseListQueryParams = (req: CaseListQueryRequest, res: Response, next: NextFunction) => {
  const { query } = req
  try {
    req.caseListQueryParams = caseListQuerySchema.parse(query)

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const { issues } = err
      res.status(400).json({ issues })
    } else {
      res.status(500).json({ message: "internal server error" })
    }
  }
}
