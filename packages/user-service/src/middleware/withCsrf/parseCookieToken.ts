import { parse } from "cookie"
import { unsign } from "cookie-signature"
import type { IncomingMessage } from "http"
import config from "lib/config"
import type { Result } from "types/Result"
import { isError } from "types/Result"

export default (request: IncomingMessage, cookieName: string): Result<string> => {
  if (!request.headers.cookie) {
    return Error("Could not find CSRF cookie.")
  }

  const { cookieSecret } = config.csrf
  const parsedCookie = parse(request.headers.cookie)
  const cookieToken = parsedCookie[cookieName]

  let unsignedCookieToken: string | false
  try {
    unsignedCookieToken = unsign(String(cookieToken), cookieSecret)
  } catch (error) {
    return isError(error) ? error : Error("Error parsing cookie token")
  }

  if (!unsignedCookieToken) {
    return Error("Invalid cookie token format.")
  }

  return unsignedCookieToken
}
