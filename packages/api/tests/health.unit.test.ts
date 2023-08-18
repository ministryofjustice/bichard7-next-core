import type { Request, Response } from "express"
import { checkStatus } from "../src/controllers/health"

describe("checkStatus", () => {
  it("returns a 200 status code", () => {
    const req = {} as Request
    const res = {} as Response
    res.sendStatus = jest.fn().mockReturnValue(res)

    checkStatus(req, res)

    expect(res.sendStatus).toHaveBeenCalledWith(200)
  })
})
