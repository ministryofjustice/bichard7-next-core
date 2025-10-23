/**
 * @jest-environment node
 */

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import config from "lib/config"
import { removeEmailAddressCookie } from "useCases"
import { type EmailAddressCookieType, emailAddressCookieTypes } from "types/EmailAddressCookieType"

function getEmailAddressCookieName(emailAddressCookieType: EmailAddressCookieType) {
  if (emailAddressCookieType === "REMEMBER") {
    return config.rememberEmailAddressCookieName
  } else if (emailAddressCookieType === "IN_PROGRESS") {
    return config.inProgressEmailAddressCookieName
  }

  throw new Error("Unknown email address cookie")
}

it.each(emailAddressCookieTypes)("should expire the email address cookie and empty the value (%s)", (cookieType) => {
  const response = new ServerResponse({} as IncomingMessage)
  removeEmailAddressCookie(response, config, cookieType)

  const cookieName = getEmailAddressCookieName(cookieType)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(
    new RegExp(`${cookieName}=; Max-Age=0; Path=/users/login; HttpOnly; Secure; SameSite=Strict`)
  )
})
