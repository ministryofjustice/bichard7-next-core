/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { IncomingMessage } from "http"
import generateCsrfToken from "../../../src/middleware/withCsrf/generateCsrfToken"

const request = <IncomingMessage>{ url: "/login" }

it("should generate form token", () => {
  const formToken = generateCsrfToken(request)

  expect(formToken).toBeDefined()

  const formTokenParts = formToken.split("=")
  expect(formTokenParts).toHaveLength(2)

  const formTokenEncodedTokenName = formTokenParts[0]
  const actualFormToken = formTokenParts[1]

  expect(formTokenEncodedTokenName).toBe("CSRFToken%2Flogin")

  const actualFormTokenParts = actualFormToken.split(".")
  expect(Number(actualFormTokenParts[0])).not.toBeNaN()
  expect(actualFormTokenParts[1]).toBeDefined()
  expect(actualFormTokenParts[2]).toBeDefined()
})
