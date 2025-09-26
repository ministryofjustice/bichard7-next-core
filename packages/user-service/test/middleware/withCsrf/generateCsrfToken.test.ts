/* eslint-disable @typescript-eslint/no-non-null-assertion */
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import { IncomingMessage } from "http"
import config from "lib/config"

const request = <IncomingMessage>{ url: "/login" }

it("should generate both form and cookie tokens", () => {
  const { formToken, cookieToken, cookieName } = generateCsrfToken(request, config)

  const formTokenParts = formToken.split("=")
  expect(formTokenParts).toHaveLength(2)

  const formTokenCookieName = formTokenParts[0]
  const actualFormToken = formTokenParts[1]
  expect(cookieName).toBe("CSRFToken%2Flogin")
  expect(cookieName).toBe(formTokenCookieName)
  expect(cookieToken).toBeDefined()

  const cookieTokenParts = cookieToken.split(".")
  expect(cookieTokenParts).toHaveLength(2)

  expect(formToken).toBeDefined()

  const actualFormTokenParts = actualFormToken.split(".")
  expect(Number(actualFormTokenParts[0])).not.toBeNaN()
  expect(actualFormTokenParts[1]).toBe(cookieTokenParts[0])
  expect(actualFormTokenParts[2]).not.toBe(cookieTokenParts[1])
})
