/**
 * @jest-environment node
 */

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import config from "lib/config"
import { storeEmailAddressInCookie } from "useCases"
import { emailAddressCookieTypes } from "types/EmailAddressCookieType"
import { getEmailAddressCookieConfig } from "useCases/getEmailAddressCookieConfig"

it.each(emailAddressCookieTypes)("should set the email address cookie (%s)", (cookieType) => {
  const response = new ServerResponse({} as IncomingMessage)
  storeEmailAddressInCookie(response, config, "dummy@dummy.com", cookieType)

  const { cookieName, maxAgeInMinutes } = getEmailAddressCookieConfig(config, cookieType)
  const cookieValues = response.getHeader("Set-Cookie") as string[]
  expect(cookieValues).toHaveLength(1)
  expect(cookieValues[0]).toMatch(
    new RegExp(
      `${cookieName}=\\d+%7Cdummy%40dummy.com..+; Max-Age=${maxAgeInMinutes * 60}; Path=/users/login; HttpOnly`
    )
  )
})
