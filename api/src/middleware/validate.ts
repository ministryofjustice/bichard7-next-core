import type { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

export const caseListQuerySchema: z.Schema = z
  .object({
    forces: z.array(z.string()),
    maxPageItems: z.string(),
    allocatedToUserName: z.string().optional(),
    caseState: z.enum(["Resolved", "Unresolved and resolved"]).optional(),
    courtDateRange: z.array(z.object({ from: z.date(), to: z.date() }).optional()).optional(),
    courtName: z.string().optional(),
    defendantName: z.string().optional(),
    locked: z.boolean().optional(),
    order: z.string().optional(),
    orderBy: z.string().optional(),
    pageNum: z.string().optional(),
    ptiurn: z.string().optional(),
    reasonCode: z.string().optional(),
    reasons: z.array(z.string()).optional(),
    resolvedByUsername: z.string().optional(),
    urgent: z.enum(["Urgent", "Non-urgent"]).optional()
  })
  .strict()

export const validateCaseListQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = caseListQuerySchema.parse(req.query)

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const { issues } = err
      console.log(issues)
      res.status(400).json({ issues })
    } else {
      res.status(500).json({ message: "internal server error" })
    }
  }
}
