import type { Request, Response, NextFunction } from "express"
import queryParser from "../../src/middleware/queryParser"

describe("queryParser", () => {
  it("parses the query string correctly", () => {
    const req = {
      url: "example.com?boolean=true&array[0][foo]=bar&array[1][foo]=bar&number=3&string=string"
    } as unknown as Request
    const res = {} as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    queryParser(req, res, next)

    expect(req.query).toEqual({
      boolean: "true",
      array: [{ foo: "bar" }, { foo: "bar" }],
      number: "3",
      string: "string"
    })
  })
})
