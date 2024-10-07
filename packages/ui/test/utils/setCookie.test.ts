import { serialize } from "cookie"
import { IncomingMessage, ServerResponse } from "http"
import setCookie from "utils/setCookie"

it("should set the cookie when no cookie is in the response", () => {
  const cookieName = ".DUMMY"
  const cookieValue = "Dummy Cookie"
  const response = new ServerResponse({} as IncomingMessage)
  setCookie(response, cookieName, cookieValue)

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toBeDefined()
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(new RegExp(`^${serialize(cookieName, cookieValue)}`))
})

it("should set the cookie when threre is already a cookie in the response", () => {
  const response = new ServerResponse({} as IncomingMessage)
  const cookieName1 = ".DUMMY1"
  const cookieValue1 = "Dummy Cookie 1"
  setCookie(response, cookieName1, cookieValue1)

  const cookieValues1 = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues1).toBeDefined()
  expect(cookieValues1).toHaveLength(1)
  expect(cookieValues1[0]).toMatch(new RegExp(`^${serialize(cookieName1, cookieValue1)}`))

  const cookieName2 = ".DUMMY2"
  const cookieValue2 = "Dummy Cookie 2"
  setCookie(response, cookieName2, cookieValue2)

  const cookieValues2 = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues2).toBeDefined()
  expect(cookieValues2).toHaveLength(2)
  expect(cookieValues2[0]).toMatch(new RegExp(`^${serialize(cookieName1, cookieValue1)}`))
  expect(cookieValues2[1]).toMatch(new RegExp(`^${serialize(cookieName2, cookieValue2)}`))
})

it("should add the same cookie multiple times", () => {
  const response = new ServerResponse({} as IncomingMessage)
  Array.from(Array(5).keys()).forEach((value) => setCookie(response, `Cookie${value}`, `Value${value}`))

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toBeDefined()
  cookieValues.forEach((cookieValue, index) => {
    expect(cookieValue).toMatch(new RegExp(`^${serialize(`Cookie${index}`, `Value${index}`)}`))
  })
})
