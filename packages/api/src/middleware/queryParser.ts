import type { NextFunction, Request, Response } from "express"
import { parse } from "qs"
import url from "url"

export default (req: Request, _: Response, next: NextFunction) => {
  const rawQuery = url.parse(req.url).query
  const query = parse(rawQuery as string)
  req.query = query

  next()
}
