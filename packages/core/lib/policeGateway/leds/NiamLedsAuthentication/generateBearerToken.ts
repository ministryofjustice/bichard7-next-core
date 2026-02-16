import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import jwt from "jsonwebtoken"

import NiamAuthenticationOptions from "../../../../types/leds/NiamAuthenticationOptions"
import generateX5t from "./generateX5t"

type GenerateBearerTokenResult = {
  expiryDate: Date
  token: string
}

const generateBearerToken = async ({
  authenticationUrl,
  certificate,
  parameters,
  privateKey
}: NiamAuthenticationOptions): PromiseResult<GenerateBearerTokenResult> => {
  const claims = {
    iss: parameters.claims.iss,
    sub: parameters.claims.sub,
    aud: parameters.claims.aud
  }
  const x5t = generateX5t(certificate)
  if (isError(x5t)) {
    return x5t
  }

  let clientAssertion: string
  try {
    clientAssertion = jwt.sign(claims, privateKey, {
      header: { alg: "RS256", x5t },
      expiresIn: "1m"
    })
  } catch (error) {
    return Error(`Failed to sign client assertion claims. ${(error as Error)?.message}`)
  }

  const urlEncodedBody = new URLSearchParams({
    grant_type: parameters.grantType,
    client_id: parameters.clientId,
    scope: parameters.scope,
    client_assertion_type: parameters.clientAssertionType,
    client_assertion: clientAssertion
  })

  const response = await fetch(authenticationUrl, {
    method: "POST",
    body: urlEncodedBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch((error: Error) => new Error(error.message))

  if (response instanceof Error) {
    return response
  }

  try {
    const tokenResult = await response.json()
    const token = String(tokenResult["access_token"])
    const { exp: expiryEpochTime } = jwt.decode(token) as { exp: number }

    return { token, expiryDate: new Date(expiryEpochTime * 1000) }
  } catch (error) {
    return new Error(`Failed to decode token. ${(error as Error).message}`)
  }
}

export default generateBearerToken
