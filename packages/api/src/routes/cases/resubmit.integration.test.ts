import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance, InjectOptions } from "fastify"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import FakeGateway from "services/gateways/fakeGateway"
import build from "src/app"
import { generateJwtForStaticUser } from "tests/helpers/userHelper"

const defaultInjectParams = (jwt: string): InjectOptions => {
  return {
    method: "POST",
    url: "/cases/0/resubmit",
    headers: {
      "X-API-Key": "password",
      authorization: "Bearer {{ token }}".replace("{{ token }}", jwt)
    },
    body: { phase: 1 }
  }
}

describe("resubmit", () => {
  const gateway = new FakeGateway()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build(gateway)
    await app.ready()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it("fails if user not in any permitted role", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([
      UserGroup.TriggerHandler,
      UserGroup.Audit,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    ])
    jest.spyOn(gateway, "fetchUserByUsername").mockResolvedValue(user)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it.each([UserGroup.ExceptionHandler, UserGroup.GeneralHandler, UserGroup.Supervisor, UserGroup.Allocator])(
    "succeeds if user is in role: %s",
    async (role) => {
      const [encodedJwt, user] = generateJwtForStaticUser([role])
      jest.spyOn(gateway, "fetchUserByUsername").mockResolvedValue(user)

      const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

      expect(statusCode).toBe(OK)
    }
  )

  it("fails if case doesn't belong to same force as user", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    jest.spyOn(gateway, "fetchUserByUsername").mockResolvedValue(user)
    jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser").mockResolvedValue(false)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("fails if case is locked to a different user", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    jest.spyOn(gateway, "fetchUserByUsername").mockResolvedValue(user)
    jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser").mockResolvedValue(false)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("fails if case does not exist", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    const error = new Error("Case not found")
    jest.spyOn(gateway, "fetchUserByUsername").mockResolvedValue(user)
    jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser").mockRejectedValue(error)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it.skip("returns 400 if case is resolved", () => {})
  it.skip("returns 400 if case is already submitted", () => {})
  it.skip("202 s3 upload successful", () => {})
  it.skip("502 s3 upload failed", () => {})
  it.skip("502 db failed to respond", () => {})
})
