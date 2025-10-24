import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"
import type { EmailAddressCookieType } from "types/EmailAddressCookieType"
import { getEmailAddressCookieConfig } from "./getEmailAddressCookieConfig"

export default (
  response: ServerResponse,
  config: UserServiceConfig,
  emailAddressCookieType: EmailAddressCookieType
): void => {
  const { cookieName } = getEmailAddressCookieConfig(config, emailAddressCookieType)
  setCookie(response, cookieName, "", { maxAge: 0, path: "/users/login" })
}
