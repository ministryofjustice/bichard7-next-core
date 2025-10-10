import type { ServerResponse } from "http"
import type { UserServiceConfig } from "lib/config"
import setCookie from "utils/setCookie"

export default (response: ServerResponse, config: UserServiceConfig): void => {
  const { rememberEmailAddressCookieName: cookieName } = config
  setCookie(response, cookieName, "", { maxAge: 0, path: "/users/login" })
}
