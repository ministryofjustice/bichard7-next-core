import { createJwt } from "./createJwt"

describe("createJwt", () => {
  const stubBasePath = "/v1/audit"
  const stubJwtSecret = "SuperSecret"

  let beforeBasePath: string | undefined
  let beforeJwtSecret: string | undefined

  beforeAll(() => {
    beforeBasePath = process.env.AUDIT_LOG_API_BASE_PATH
    beforeJwtSecret = process.env.AUTH_JWT_SECRET
  })

  afterAll(() => {
    process.env.AUDIT_LOG_API_BASE_PATH = beforeBasePath
    process.env.AUTH_JWT_SECRET = beforeJwtSecret
  })

  it("will use a default error message if AUDIT_LOG_API_BASE_PATH is undefined", () => {
    expect(() => createJwt()).toThrow(new Error("AUDIT_LOG_API_BASE_PATH env is missing"))
  })

  it("will accept a custom error message if AUDIT_LOG_API_BASE_PATH is undefined", () => {
    const errorMessage = "error"

    expect(() => createJwt(errorMessage)).toThrow(new Error(`AUDIT_LOG_API_BASE_PATH ${errorMessage}`))
  })

  it("will error if AUTH_JWT_SECRET is undefined", () => {
    process.env.AUDIT_LOG_API_BASE_PATH = stubBasePath
    const errorMessage = "error"

    expect(() => createJwt(errorMessage)).toThrow(new Error(`AUTH_JWT_SECRET ${errorMessage}`))
  })

  it("will not error if AUTH_JWT_SECRET is undefined", () => {
    process.env.AUDIT_LOG_API_BASE_PATH = stubBasePath
    process.env.AUTH_JWT_SECRET = stubJwtSecret

    expect(() => createJwt()).not.toThrow(new Error())
  })

  it("will return a JWT and base path", () => {
    process.env.AUDIT_LOG_API_BASE_PATH = stubBasePath
    process.env.AUTH_JWT_SECRET = stubJwtSecret

    const result = createJwt()

    expect(result.apiKey).toMatch(/^Bearer [A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)
    expect(result.basePath).toBe(stubBasePath)
  })
})
