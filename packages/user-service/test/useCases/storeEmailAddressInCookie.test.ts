/**
 * @jest-environment node
 */

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import config from "lib/config"
import { storeEmailAddressInCookie } from "useCases"

it("should set the email address cookie", () => {
  const response = new ServerResponse({} as IncomingMessage)
  storeEmailAddressInCookie(response, config, "dummy@dummy.com")

  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(
    /LOGIN_EMAIL=\d+%7Cdummy%40dummy\.com\..+; Max-Age=86400; Path=\/users\/login; HttpOnly/
  )
})
