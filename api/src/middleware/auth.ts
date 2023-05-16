import type { NextFunction, Request, Response } from "express"

const API_KEY = process.env.API_KEY || "password"

export default (req: Request, res: Response, next: NextFunction) => {
  const authAttempt = req.headers?.Authorization

  switch (authAttempt) {
    case API_KEY:
      next()
      break
    default:
      res.sendStatus(401)
  }
}
