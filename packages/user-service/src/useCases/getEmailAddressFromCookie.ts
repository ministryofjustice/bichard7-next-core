import { unsign } from "cookie-signature"
import type { UserServiceConfig } from "lib/config"
import type { NextApiRequestCookies } from "next/dist/server/api-utils"

export default ({ cookies }: { cookies: NextApiRequestCookies }, config: UserServiceConfig): string | null => {
  const { rememberEmailAddressCookieName, cookieSecret } = config
  const cookieValue = cookies[rememberEmailAddressCookieName]
  if (!cookieValue) {
    return null
  }

  let unsignedCookieValue: string | boolean
  try {
    unsignedCookieValue = unsign(cookieValue, cookieSecret)
  } catch {
    return null
  }

  if (!unsignedCookieValue) {
    return null
  }

  const cookieValueParts = unsignedCookieValue.split("|")

  if (cookieValueParts.length !== 2) {
    return null
  }

  const expiryDate = new Date(Number.parseInt(cookieValueParts[0], 10))

  if (expiryDate < new Date()) {
    return null
  }

  return cookieValueParts[1]
}
