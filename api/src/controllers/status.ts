import type { Request, Response } from "express"

export function checkStatus(_: Request, res: Response): void {
  res.sendStatus(200)
}
