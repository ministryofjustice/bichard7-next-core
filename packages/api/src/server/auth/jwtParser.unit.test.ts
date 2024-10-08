import type { JWT } from "@moj-bichard7/common/types/JWT"
import jwtParser from "server/auth/jwtParser"

const encodedJwt =
  "eyJ1c2VybmFtZSI6IkJpY2hhcmQwMSIsImV4Y2x1c2lvbkxpc3QiOltdLCJpbmNsdXNpb25MaXN0IjpbIkIwMSIsIkI0MU1FMDAiLCIwMDEiLCIwMDIiLCIwMDQiLCIwMTQiLCIwNDUiXSwiZW1haWxBZGRyZXNzIjoiYmljaGFyZDAxQGV4YW1wbGUuY29tIiwiZ3JvdXBzIjpbIkI3QWxsb2NhdG9yIiwiQjdBdWRpdCIsIkI3RXhjZXB0aW9uSGFuZGxlciIsIkI3U3VwZXJ2aXNvciIsIkI3VHJpZ2dlckhhbmRsZXIiLCJCN05ld1VJIiwiQjdHZW5lcmFsSGFuZGxlciJdLCJpZCI6ImMwNThhMWJmLWNlNmEtNDVkOS04ZTg0LTk3MjlhZWFjNTI0NiIsImlhdCI6MTcyNjA0NTE5MywiZXhwIjoxNzI2NjQ5OTkzLCJpc3MiOiJCaWNoYXJkIn0"

describe("jwtParser", () => {
  it("returns undefined when given undefined", async () => {
    const result = await jwtParser()

    expect(result).toBeUndefined()
  })

  it("returns undefined when given empty string", async () => {
    const result = await jwtParser("")

    expect(result).toBeUndefined()
  })

  it("returns throws an error when given token that's base64 encoded", async () => {
    await expect(jwtParser("abc123")).rejects.toThrow("is not valid JSON")
  })

  it("decodes a valid JWT", async () => {
    const result = await jwtParser(encodedJwt)

    expect(result).toEqual({
      username: "Bichard01",
      exclusionList: [],
      inclusionList: ["B01", "B41ME00", "001", "002", "004", "014", "045"],
      emailAddress: "bichard01@example.com",
      groups: [
        "B7Allocator",
        "B7Audit",
        "B7ExceptionHandler",
        "B7Supervisor",
        "B7TriggerHandler",
        "B7NewUI",
        "B7GeneralHandler"
      ],
      id: "c058a1bf-ce6a-45d9-8e84-9729aeac5246",
      iat: 1726045193,
      exp: 1726649993,
      iss: "Bichard"
    } satisfies JWT)
  })
})
