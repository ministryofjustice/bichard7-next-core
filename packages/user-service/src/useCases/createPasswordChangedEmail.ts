import type EmailContent from "@moj-bichard7/common/email/EmailContent"
import generatePasswordChangedEmail from "emails/passwordChanged"
import type User from "types/User"

export default (user: User, baseUrl: string): EmailContent => {
  const url = new URL("/login", baseUrl)

  return generatePasswordChangedEmail({ url: url.href, user })
}
