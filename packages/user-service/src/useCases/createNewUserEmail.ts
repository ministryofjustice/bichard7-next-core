import generateNewUserEmail from "emails/newUser"
import { addBasePath } from "next/dist/client/add-base-path"
import EmailContent from "types/EmailContent"
import { Result } from "types/Result"
import User from "types/User"

export default (user: User, baseUrl: string): Result<EmailContent> => {
  const url = new URL(addBasePath("/login/reset-password"), baseUrl)

  return generateNewUserEmail({ url: url.href, user })
}
