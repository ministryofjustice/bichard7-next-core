import type { Request, Response, NextFunction } from "express"
import url from "url"
import { parse } from "qs"

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawQuery = url.parse(req.url).query
    const query = parse(rawQuery as string)
    req.query = query

    next()
  } catch (err) {
    res.status(500).json(err)
  }
}
