import { sign } from "cookie-signature"
import { ServerResponse } from "http"
import { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse, config: UserServiceConfig, emailAddress: string): void => {
  const {
    cookieSecret,
    rememberEmailAddressCookieName: cookieName,
    rememberEmailAddressMaxAgeInMinutes: maxAgeInMinutes
  } = config

  const expiryDate = new Date()
  expiryDate.setMinutes(expiryDate.getMinutes() + maxAgeInMinutes)
  const cookieValue = `${expiryDate.getTime()}|${emailAddress}`
  const signedCookieValue = sign(cookieValue, cookieSecret)

  setCookie(response, cookieName, signedCookieValue, { maxAge: maxAgeInMinutes * 60, path: "/users/login" })
}
