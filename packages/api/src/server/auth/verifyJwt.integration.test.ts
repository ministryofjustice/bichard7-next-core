import type { User } from "@moj-bichard7/common/types/User"

import { generateTestJwtToken } from "../../tests/helpers/jwtHelper"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import verifyJwt from "./verifyJwt"

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"
const testDatabaseGateway = new End2EndPostgres()

describe("verifyJwt", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  it("returns an error if the username does not exists in the db", async () => {
    const jwtString = generateTestJwtToken({ username: "UserNotFound" })

    const result = await verifyJwt(testDatabaseGateway.readonly, jwtString)

    expect((result as Error).message).toBe('JWT verification failed: User "UserNotFound" does not exist')
  })

  it("returns a User if the username exists in the db and the JWT ID matches", async () => {
    const jwtString = generateTestJwtToken({ username: "user01" }, validJwtId)
    const user = await createUser(testDatabaseGateway, { jwtId: validJwtId, username: "user01" })

    const result = (await verifyJwt(testDatabaseGateway.readonly, jwtString)) as User

    expect(result.username).toBe(user.username)
    expect(result.jwtId).toBe(user.jwtId)
    expect(result.jwtId).toBe(validJwtId)
  })

  it("returns an error if the JWT is not valid", async () => {
    const result = (await verifyJwt(testDatabaseGateway.readonly, "NotARealJWT")) as Error

    expect(result.message).toBe("jwt malformed")
  })

  it("returns error if the username exists in the db and the JWT ID doesn't match", async () => {
    const jwtString = generateTestJwtToken({ username: "user01" }, validJwtId)
    await createUser(testDatabaseGateway, { jwtId: null, username: "user01" })

    const result = (await verifyJwt(testDatabaseGateway.readonly, jwtString)) as Error

    expect(result.message).toBe("JWT verification failed: JWT ids do not match")
  })
})
