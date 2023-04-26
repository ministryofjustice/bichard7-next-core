import type { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

const caseListQuerySchema: z.Schema = z.object({
  forces: z.array(z.string()),
  maxPageItems: z.string()
})

export const validateCaseListQueryParams = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query)
  try {
    caseListQuerySchema.parse(req.query)

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
