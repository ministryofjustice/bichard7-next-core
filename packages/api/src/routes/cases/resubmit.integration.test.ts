import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance, InjectOptions } from "fastify"
import { FORBIDDEN, OK } from "http-status"
import build from "../../app"
import FakeGateway from "../../services/gateways/fakeGateway"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

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

  it("user can't resubmit case if they aren't in a required role", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([
      UserGroup.TriggerHandler,
      UserGroup.Audit,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    ])
    const spy = jest.spyOn(gateway, "fetchUserByUsername")
    spy.mockResolvedValue(user)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it.each([UserGroup.ExceptionHandler, UserGroup.GeneralHandler, UserGroup.Supervisor, UserGroup.Allocator])(
    "user can resubmit case if they are in role: %s",
    async (role) => {
      const [encodedJwt, user] = generateJwtForStaticUser([role])
      const spy = jest.spyOn(gateway, "fetchUserByUsername")
      spy.mockResolvedValue(user)

      const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

      expect(statusCode).toBe(OK)
    }
  )

  it("resubmission fails if case doesn't belong to same force as user", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    const spyFetchUser = jest.spyOn(gateway, "fetchUserByUsername")
    const spyForce = jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser")

    spyFetchUser.mockResolvedValue(user)
    spyForce.mockRejectedValue(
      new Error(`Case is either: not present; not in the force or not locked by ${user.username}`)
    )

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it.skip("returns 403 if exception lock is owned by a different user", () => {})
  it.skip("returns 400 if case does not exist", () => {})
  it.skip("returns 400 if case is resolved", () => {})
  it.skip("returns 400 if case is already submitted", () => {})
  it.skip("202 s3 upload successful", () => {})
  it.skip("502 s3 upload failed", () => {})
  it.skip("502 db failed to respond", () => {})
})
