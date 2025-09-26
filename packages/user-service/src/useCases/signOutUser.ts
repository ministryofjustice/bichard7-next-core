import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"
import { removeTokenId } from "lib/token/authenticationToken"
import Database from "types/Database"
import { isError } from "types/Result"
import removeCookie from "utils/removeCookie"
import logger from "utils/logger"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"

export default async (
  connection: Database,
  response: ServerResponse,
  request: IncomingMessage & {
    cookies: NextApiRequestCookies
  }
) => {
  const authToken = getAuthenticationPayloadFromCookie(request)

  if (authToken) {
    const removeTokenIdResult = await removeTokenId(connection, authToken.id)
    if (isError(removeTokenIdResult)) {
      logger.error(removeTokenIdResult)
      return removeTokenIdResult
    }
  }

  removeCookie(response, request.cookies, config.authenticationCookieName)
  return undefined
}
