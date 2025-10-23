import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"
import type { EmailAddressCookieType } from "../types/EmailAddressCookieType"

export default (
  response: ServerResponse,
  config: UserServiceConfig,
  emailAddressCookieType: EmailAddressCookieType
): void => {
  let cookieName: string | null = null
  if (emailAddressCookieType === "REMEMBER") {
    cookieName = config.rememberEmailAddressCookieName
  } else if (emailAddressCookieType === "IN_PROGRESS") {
    cookieName = config.inProgressEmailAddressCookieName
  }

  if (!cookieName) {
    throw new Error("Could not find email address cookie")
  }

  setCookie(response, cookieName, "", { maxAge: 0, path: "/users/login" })
}
