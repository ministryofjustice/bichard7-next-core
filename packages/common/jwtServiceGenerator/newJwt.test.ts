import jwt from "jsonwebtoken"

import type { JWTServiceDetails } from "../types/JWTServiceDetails"

import { isError } from "../types/Result"
import { UserGroup } from "../types/UserGroup"
import { newJwt } from "./newJwt"

describe("newJwt", () => {
  const tokenSecret = "Something"

  it("returns an invalid token", () => {
    const serviceDetails: JWTServiceDetails = {
      emailAddress: "moj-bichard7@madetech.com",
      groups: [UserGroup.GeneralHandler],
      username: "Core-Worker"
    }

    const result = newJwt(tokenSecret, serviceDetails)

    expect(result).toBeInstanceOf(Error)

    const err = result as Error
    expect(err.message).toBe("Could not create Service JWT")
  })

  it("creates a valid JWT token", () => {
    const serviceDetails: JWTServiceDetails = {
      emailAddress: "moj-bichard7@madetech.com",
      groups: [UserGroup.Service],
      username: "Core-Worker"
    }

    const result = newJwt(tokenSecret, serviceDetails)

    if (isError(result)) {
      throw result
    }

    expect(typeof result).toBe("string")

    const resultJwt = jwt.verify(result, tokenSecret, { issuer: "Bichard" }) as JWTServiceDetails

    expect(resultJwt.emailAddress).toBe("moj-bichard7@madetech.com")
    expect(resultJwt.groups).toEqual([UserGroup.Service])
    expect(resultJwt.username).toBe("Core-Worker")
  })
})
