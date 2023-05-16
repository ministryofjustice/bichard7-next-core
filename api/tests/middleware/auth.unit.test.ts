import type { NextFunction, Response, Request } from "express"
import auth from "../../src/middleware/auth"

describe("auth", () => {
  it("returns a 401 unauthorised response if password is not in Authorization header", () => {
    const req = {} as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it("returns a 401 unauthorised response if incorrect password is in the Authorization header", () => {
    const req = { headers: { Authorization: "not-the-password" } } as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it("call next if correct password is in Authorization header", () => {
    const req = { headers: { Authorization: "password" } } as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
