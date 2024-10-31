/* eslint-disable jest/expect-expect */
import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance, InjectOptions } from "fastify"
import { BAD_GATEWAY, BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import build from "../../app"
import FakeDataStoreGateway from "../../services/gateways/dataStoreGateways/fakeDataStoreGateway"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

const defaultInjectParams = (jwt: string): InjectOptions => {
  return {
    method: "POST",
    url: "/cases/0/resubmit",
    headers: {
      authorization: "Bearer {{ token }}".replace("{{ token }}", jwt)
    },
    body: { phase: 1 }
  }
}

describe("resubmit", () => {
  const dataStoreGateway = new FakeDataStoreGateway()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build({ dataStoreGateway })
    await app.ready()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  const assertStatusCode = async (encodedJwt: string, code: number) => {
    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(code)
  }

  it("fails if user not in any permitted role", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([
      UserGroup.TriggerHandler,
      UserGroup.Audit,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    ])
    jest.spyOn(dataStoreGateway, "fetchUserByUsername").mockResolvedValue(user)

    await assertStatusCode(encodedJwt, FORBIDDEN)
  })

  it.each([UserGroup.ExceptionHandler, UserGroup.GeneralHandler, UserGroup.Supervisor, UserGroup.Allocator])(
    "succeeds if user is in role: %s",
    async (role) => {
      const [encodedJwt, user] = generateJwtForStaticUser([role])
      jest.spyOn(dataStoreGateway, "fetchUserByUsername").mockResolvedValue(user)

      await assertStatusCode(encodedJwt, OK)
    }
  )

  describe("fails if", () => {
    let encodedJwt: string
    let user: User

    beforeEach(() => {
      ;[encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
      jest.spyOn(dataStoreGateway, "fetchUserByUsername").mockResolvedValue(user)
    })

    const canCaseBeResubmittedFalse = () => {
      jest.spyOn(dataStoreGateway, "canCaseBeResubmitted").mockResolvedValue(false)
    }

    it("case doesn't belong to same force as user", async () => {
      canCaseBeResubmittedFalse()

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    it("case is locked to a different user", async () => {
      canCaseBeResubmittedFalse()

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    it("case does not exist", async () => {
      jest.spyOn(dataStoreGateway, "canCaseBeResubmitted").mockRejectedValue(new Error("Case not found"))

      await assertStatusCode(encodedJwt, BAD_REQUEST)
    })

    it("case is resolved", async () => {
      canCaseBeResubmittedFalse()

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    it("case is already submitted", async () => {
      canCaseBeResubmittedFalse()

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    it("DB fails", async () => {
      const error = new Error("AggregateError")
      error.name = "AggregateError"
      error.stack = "Something Sql or pOstGreS"
      jest.spyOn(dataStoreGateway, "canCaseBeResubmitted").mockRejectedValue(error)

      await assertStatusCode(encodedJwt, BAD_GATEWAY)
    })
  })

  it.skip("202 s3 upload successful", () => {})
  it.skip("502 s3 upload failed", () => {})
})
