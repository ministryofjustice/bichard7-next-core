/**
 * @jest-environment node
 */

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import config from "lib/config"
import type { NextApiRequestCookies } from "next/dist/server/api-utils"
import { getEmailAddressFromCookie, storeEmailAddressInCookie } from "useCases"
import { emailAddressCookieTypes, type EmailAddressCookieType } from "types/EmailAddressCookieType"

function getEmailAddressCookieName(emailAddressCookieType: EmailAddressCookieType) {
  if (emailAddressCookieType === "REMEMBER") {
    return config.rememberEmailAddressCookieName
  } else if (emailAddressCookieType === "IN_PROGRESS") {
    return config.inProgressEmailAddressCookieName
  }

  throw new Error("Unknown email address cookie")
}

describe("getEmailAddressFromCookie", () => {
  it.each(emailAddressCookieTypes)("should return the email address from the cookie (%s)", (cookieType) => {
    const request = { cookies: {} } as { cookies: NextApiRequestCookies }
    const response = new ServerResponse({} as IncomingMessage)
    storeEmailAddressInCookie(response, config, "dummy@dummy.com", cookieType)

    const cookies = response.getHeader("Set-Cookie") as string[]
    const cookieName = cookies[0].split("=")[0]
    const cookieValue = cookies[0].split("=")[1].split(";")[0]
    request.cookies[cookieName] = decodeURIComponent(cookieValue)

    const emailAddress = getEmailAddressFromCookie(request, config, cookieType)
    expect(emailAddress).toBe("dummy@dummy.com")
  })

  it.each(emailAddressCookieTypes)("should return null if cookie value is expired (%s)", (cookieType) => {
    const request = { cookies: {} } as { cookies: NextApiRequestCookies }
    request.cookies[getEmailAddressCookieName(cookieType)] =
      "1629887818347|dummy@dummy.com.SATxSgt/eVyzah6Uig09ooiyW/YW+G4XRX/EgAQ2yDo"

    const emailAddress = getEmailAddressFromCookie(request, config, cookieType)
    expect(emailAddress).toBeNull()
  })

  it.each(emailAddressCookieTypes)("should return null if cookie has invalid signature (%s)", (cookieType) => {
    const request = { cookies: {} } as { cookies: NextApiRequestCookies }
    request.cookies[getEmailAddressCookieName(cookieType)] = "1629887818347|dummy@dummy.com.InvalidSignature"

    const emailAddress = getEmailAddressFromCookie(request, config, cookieType)
    expect(emailAddress).toBeNull()
  })

  it.each(emailAddressCookieTypes)("should return null if cookie does not exist (%s)", (cookieType) => {
    const request = { cookies: {} } as { cookies: NextApiRequestCookies }

    const emailAddress = getEmailAddressFromCookie(request, config, cookieType)
    expect(emailAddress).toBeNull()
  })
})
