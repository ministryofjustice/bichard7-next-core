import type { EmailAddressCookieType } from "types/EmailAddressCookieType"
import type { UserServiceConfig } from "lib/config"

export function getEmailAddressCookieConfig(config: UserServiceConfig, emailAddressCookieType: EmailAddressCookieType) {
  if (emailAddressCookieType === "REMEMBER") {
    return {
      cookieName: config.rememberEmailAddressCookieName,
      maxAgeInMinutes: config.rememberEmailAddressMaxAgeInMinutes
    }
  } else if (emailAddressCookieType === "IN_PROGRESS") {
    return {
      cookieName: config.inProgressEmailAddressCookieName,
      maxAgeInMinutes: config.inProgressEmailAddressMaxAgeInMinutes
    }
  }

  throw new Error("Unknown email address cookie")
}
