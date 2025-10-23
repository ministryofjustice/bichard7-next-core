import { sign } from "cookie-signature"
import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse, config: UserServiceConfig, emailAddress: string): void => {
  const {
    cookieSecret,
    inProgressEmailAddressCookieName: cookieName,
    inProgressEmailAddressMaxAgeInMinutes: maxAgeInMinutes
  } = config

  const expiryDate = new Date()
  expiryDate.setMinutes(expiryDate.getMinutes() + maxAgeInMinutes)
  const cookieValue = `${expiryDate.getTime()}|${emailAddress}`
  const signedCookieValue = sign(cookieValue, cookieSecret)

  setCookie(response, cookieName, signedCookieValue, { maxAge: maxAgeInMinutes * 60, path: "/users/login" })
}
