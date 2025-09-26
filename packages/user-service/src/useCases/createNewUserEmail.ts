import generateNewUserEmail from "emails/newUser"
import { addBasePath } from "next/dist/client/add-base-path"
import type EmailContent from "types/EmailContent"
import type { Result } from "types/Result"
import type User from "types/User"

export default (user: User, baseUrl: string): Result<EmailContent> => {
  const url = new URL(addBasePath("/login/reset-password"), baseUrl)

  return generateNewUserEmail({ url: url.href, user })
}
