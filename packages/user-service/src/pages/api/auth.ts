import config from "lib/config"
import getConnection from "lib/getConnection"
import { generateAuthenticationToken, isTokenIdValid } from "lib/token/authenticationToken"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"
import type { NextApiRequest, NextApiResponse } from "next"
import hasUserAccessToUrl from "useCases/hasUserAccessToUrl"
import setCookie from "utils/setCookie"

const unauthenticated = (res: NextApiResponse) => res.status(401).json({ authenticated: false, authorised: false })
const unauthorised = (res: NextApiResponse) => res.status(403).json({ authenticated: true, authorised: false })
const allowed = (res: NextApiResponse) => res.status(200).json({ authenticated: true, authorised: true })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = getAuthenticationPayloadFromCookie(req)
  const connection = getConnection()

  if (authToken && (await isTokenIdValid(connection, authToken.id))) {
    const { referer } = req.headers

    if (hasUserAccessToUrl(authToken, referer)) {
      const authenticationToken = generateAuthenticationToken(
        {
          username: authToken.username,
          exclusionList: authToken.exclusionList,
          inclusionList: authToken.inclusionList,
          emailAddress: authToken.emailAddress,
          groups: authToken.groups
        },
        authToken.id
      )
      setCookie(res, config.authenticationCookieName, authenticationToken, { path: "/" })
      return allowed(res)
    }

    return unauthorised(res)
  }

  return unauthenticated(res)
}
