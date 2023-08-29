import type { NextFunction, Request, Response } from "express"
import auth from "../../src/middleware/auth"

describe("auth", () => {
  it("returns a 401 unauthorised response if password is not in the authorization header", () => {
    const req = {} as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it("returns a 401 unauthorised response if incorrect password is in the authorization header", () => {
    const req = { headers: { authorization: "not-the-password" } } as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it("calls next if correct password is in the authorization header", () => {
    const req = { headers: { authorization: "password" } } as unknown as Request
    const res = {
      sendStatus: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    auth(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
