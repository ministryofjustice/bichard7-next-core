import { sign } from "cookie-signature"
import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"
import type { EmailAddressCookieType } from "../types/EmailAddressCookieType"
import { getEmailAddressCookieConfig } from "./getEmailAddressCookieConfig"

export default (
  response: ServerResponse,
  config: UserServiceConfig,
  emailAddress: string,
  emailAddressCookieType: EmailAddressCookieType
): void => {
  const { cookieName, maxAgeInMinutes } = getEmailAddressCookieConfig(config, emailAddressCookieType)

  const expiryDate = new Date()
  expiryDate.setMinutes(expiryDate.getMinutes() + maxAgeInMinutes)
  const cookieValue = `${expiryDate.getTime()}|${emailAddress}`
  const signedCookieValue = sign(cookieValue, config.cookieSecret)

  setCookie(response, cookieName, signedCookieValue, { maxAge: maxAgeInMinutes * 60, path: "/users/login" })
}
