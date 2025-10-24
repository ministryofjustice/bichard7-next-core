export const emailAddressCookieTypes = ["REMEMBER", "IN_PROGRESS"] as const

export type EmailAddressCookieType = (typeof emailAddressCookieTypes)[number]
