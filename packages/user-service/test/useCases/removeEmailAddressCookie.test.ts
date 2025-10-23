/**
 * @jest-environment node
 */

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import config from "lib/config"
import { removeEmailAddressCookie } from "useCases"
import { emailAddressCookieTypes } from "types/EmailAddressCookieType"
import { getEmailAddressCookieConfig } from "useCases/getEmailAddressCookieConfig"

it.each(emailAddressCookieTypes)("should expire the email address cookie and empty the value (%s)", (cookieType) => {
  const response = new ServerResponse({} as IncomingMessage)
  removeEmailAddressCookie(response, config, cookieType)

  const { cookieName } = getEmailAddressCookieConfig(config, cookieType)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(
    new RegExp(`${cookieName}=; Max-Age=0; Path=/users/login; HttpOnly; Secure; SameSite=Strict`)
  )
})
