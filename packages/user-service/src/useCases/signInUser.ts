import type { ServerResponse } from "http"
import config from "lib/config"
import { generateAuthenticationToken, storeTokenId } from "lib/token/authenticationToken"
import setCookie from "utils/setCookie"
import { v4 as uuidv4 } from "uuid"
import { isError } from "types/Result"
import type Database from "types/Database"
import logger from "utils/logger"
import updateUserLastLogin from "./updateUserLastLogin"
import type UserAuthBichard from "types/UserAuthBichard"

export default async (
  connection: Database,
  response: ServerResponse,
  user: UserAuthBichard
): Promise<string | Error> => {
  const { authenticationCookieName } = config
  const uniqueId = uuidv4()

  const storeTokenIdResult = await storeTokenId(connection, user.id, uniqueId)

  if (isError(storeTokenIdResult)) {
    logger.error(storeTokenIdResult)
    return storeTokenIdResult
  }

  const userLoggedInResult = await updateUserLastLogin(connection, user.username)

  if (isError(userLoggedInResult)) {
    logger.error(userLoggedInResult)
    return userLoggedInResult
  }

  const authenticationToken = generateAuthenticationToken(user, uniqueId)
  setCookie(response, authenticationCookieName, authenticationToken, { path: "/" })

  return authenticationToken
}
