import type { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

const caseListQuerySchema: z.Schema = z
  .object({
    forces: z.array(z.string()),
    maxPageItems: z.string(),
    orderBy: z.string().optional(),
    order: z.string().optional(),
    reasons: z.string().optional(),
    defendantName: z.string().optional(),
    courtName: z.string().optional(),
    ptiurn: z.string().optional(),
    urgent: z.string().optional(),
    pageNum: z.string().optional(),
    courtDateRange: z.array(z.object({ from: z.date(), to: z.date() }).optional()).optional(),
    locked: z.boolean().optional(),
    caseState: z.string().optional(),
    allocatedToUserName: z.string().optional(),
    reasonCode: z.string().optional(),
    resolvedByUsername: z.string().optional()
  })
  .strict()

export const validateCaseListQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = caseListQuerySchema.parse(req.query)

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
