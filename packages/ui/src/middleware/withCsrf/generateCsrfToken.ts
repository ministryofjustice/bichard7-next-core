import type { IncomingMessage } from "http"

import { sign } from "cookie-signature"
import Tokens from "csrf"

import { CSRF } from "../../config"

const tokens = new Tokens()

const generateCsrfToken = (request: IncomingMessage): string => {
  const { formSecret, maximumTokenAgeInSeconds, tokenName } = CSRF
  const tokenExpiryDate = new Date()
  tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + maximumTokenAgeInSeconds)
  const token = tokens.create(`${formSecret}`)
  const encodedTokenName = encodeURIComponent(`${tokenName}${request.url}`)
  const formToken = sign(`${encodedTokenName}=${tokenExpiryDate.getTime()}.${token}`, formSecret)

  return formToken
}

export default generateCsrfToken
