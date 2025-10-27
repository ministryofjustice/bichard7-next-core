import { unsign } from "cookie-signature"
import type { UserServiceConfig } from "lib/config"
import type { NextApiRequestCookies } from "next/dist/server/api-utils"
import type { EmailAddressCookieType } from "types/EmailAddressCookieType"
import { getEmailAddressCookieConfig } from "./getEmailAddressCookieConfig"

export default (
  { cookies }: { cookies: NextApiRequestCookies },
  config: UserServiceConfig,
  emailAddressCookieType: EmailAddressCookieType
): string | null => {
  const { cookieName } = getEmailAddressCookieConfig(config, emailAddressCookieType)
  const cookieValue = cookies[cookieName]
  if (!cookieValue) {
    return null
  }

  let unsignedCookieValue: string | boolean
  try {
    unsignedCookieValue = unsign(cookieValue, config.cookieSecret)
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
