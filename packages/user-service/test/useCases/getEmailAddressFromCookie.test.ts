/**
 * @jest-environment node
 */

import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { getEmailAddressFromCookie, storeEmailAddressInCookie } from "useCases"

it("should return the email address from the cookie", () => {
  const { rememberEmailAddressCookieName } = config
  const request = { cookies: {} } as { cookies: NextApiRequestCookies }
  const response = new ServerResponse({} as IncomingMessage)
  storeEmailAddressInCookie(response, config, "dummy@dummy.com")

  const cookies = response.getHeader("Set-Cookie") as string[]
  const cookieValue = cookies[0].split("=")[1].split(";")[0]
  request.cookies[rememberEmailAddressCookieName] = decodeURIComponent(cookieValue)

  const emailAddress = getEmailAddressFromCookie(request, config)
  expect(emailAddress).toBe("dummy@dummy.com")
})

it("should return null if cookie value is expired", () => {
  const { rememberEmailAddressCookieName } = config
  const request = { cookies: {} } as { cookies: NextApiRequestCookies }
  request.cookies[rememberEmailAddressCookieName] =
    "1629887818347|dummy@dummy.com.SATxSgt/eVyzah6Uig09ooiyW/YW+G4XRX/EgAQ2yDo"

  const emailAddress = getEmailAddressFromCookie(request, config)
  expect(emailAddress).toBeNull()
})

it("should return null if cookie has invalid signature", () => {
  const { rememberEmailAddressCookieName } = config
  const request = { cookies: {} } as { cookies: NextApiRequestCookies }
  request.cookies[rememberEmailAddressCookieName] = "1629887818347|dummy@dummy.com.InvalidSignature"

  const emailAddress = getEmailAddressFromCookie(request, config)
  expect(emailAddress).toBeNull()
})

it("should return null if cookie does not exist", () => {
  const request = { cookies: {} } as { cookies: NextApiRequestCookies }

  const emailAddress = getEmailAddressFromCookie(request, config)
  expect(emailAddress).toBeNull()
})
