import { sign } from "cookie-signature"
import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"
import type { EmailAddressCookieType } from "../types/EmailAddressCookieType"

export default (
  response: ServerResponse,
  config: UserServiceConfig,
  emailAddress: string,
  emailAddressCookieType: EmailAddressCookieType
): void => {
  let cookieName: string | null = null
  let maxAgeInMinutes: number | null = null
  if (emailAddressCookieType === "REMEMBER") {
    cookieName = config.rememberEmailAddressCookieName
    maxAgeInMinutes = config.rememberEmailAddressMaxAgeInMinutes
  } else if (emailAddressCookieType === "IN_PROGRESS") {
    cookieName = config.inProgressEmailAddressCookieName
    maxAgeInMinutes = config.inProgressEmailAddressMaxAgeInMinutes
  }

  if (!cookieName || maxAgeInMinutes === null) {
    throw new Error("Could not set email address cookie")
  }

  const expiryDate = new Date()
  expiryDate.setMinutes(expiryDate.getMinutes() + maxAgeInMinutes)
  const cookieValue = `${expiryDate.getTime()}|${emailAddress}`
  const signedCookieValue = sign(cookieValue, config.cookieSecret)

  setCookie(response, cookieName, signedCookieValue, { maxAge: maxAgeInMinutes * 60, path: "/users/login" })
}
