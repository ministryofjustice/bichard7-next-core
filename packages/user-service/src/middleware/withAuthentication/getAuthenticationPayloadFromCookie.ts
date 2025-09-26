import config from "lib/config"
import { AuthenticationTokenPayload, decodeAuthenticationToken } from "lib/token/authenticationToken"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
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
