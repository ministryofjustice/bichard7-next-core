import type { Request, Response, NextFunction } from "express"
import { z } from "zod"

const caseListQuerySchema: z.Schema = z.object({
  forces: z.array(z.string()),
  maxPageItems: z.string()
})

export const validateCaseListQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    caseListQuerySchema.parse(req.query)

    next()
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
