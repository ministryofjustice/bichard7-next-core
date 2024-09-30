import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance, InjectOptions } from "fastify"
import { FORBIDDEN } from "http-status"
import build from "../../app"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"
import fetchUserByUsername from "../../useCases/fetchUserByUsername"

jest.mock("../../useCases/fetchUserByUsername")

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
  const mockedFetchUserByUsername = fetchUserByUsername as jest.Mock
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("returns 403 if the user is not in a permitted role for resubmission", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([
      UserGroup.TriggerHandler,
      UserGroup.Audit,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    ])
    mockedFetchUserByUsername.mockResolvedValue(user)

    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(FORBIDDEN)
  })

  it.skip("returns 403 if case doesn't belong to same force as user", () => {})
  it.skip("returns 403 if exception lock is owned by a different user", () => {})
  it.skip("returns 400 if case does not exist", () => {})
  it.skip("returns 400 if case is resolved", () => {})
  it.skip("returns 400 if case is already submitted", () => {})
  it.skip("202 s3 upload successful", () => {})
  it.skip("502 s3 upload failed", () => {})
  it.skip("502 db failed to respond", () => {})
})
