import generatePasswordChangedEmail from "emails/passwordChanged"
import EmailContent from "types/EmailContent"
import User from "types/User"

export default (user: User, baseUrl: string): EmailContent => {
  const url = new URL("/login", baseUrl)

  return generatePasswordChangedEmail({ url: url.href, user })
}
