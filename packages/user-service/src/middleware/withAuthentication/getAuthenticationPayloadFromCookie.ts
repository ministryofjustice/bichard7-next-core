import config from "lib/config"
import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { decodeAuthenticationToken } from "lib/token/authenticationToken"
import type { NextApiRequestCookies } from "next/dist/server/api-utils"
import { isSuccess } from "types/Result"

export default ({ cookies }: { cookies: NextApiRequestCookies }): AuthenticationTokenPayload | null => {
  const { authenticationCookieName } = config
  const authenticationToken = cookies[authenticationCookieName]

  if (authenticationToken) {
    const payload = decodeAuthenticationToken(authenticationToken)
    if (isSuccess(payload)) {
      return payload
    }
  }

  return null
}
