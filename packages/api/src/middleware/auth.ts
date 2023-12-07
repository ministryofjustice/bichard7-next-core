import type { NextFunction, Request, Response } from "express"

const API_KEY = process.env.API_KEY || "password"

export default (req: Request, res: Response, next: NextFunction) => {
  const authAttempt = req.headers?.authorization || null

  if (authAttempt === API_KEY) {
    next()
  } else {
    res.sendStatus(401)
  }
}
