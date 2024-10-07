import { NextApiRequestCookies } from "next/dist/server/api-utils"
import type AuthJwt from "types/AuthJwt"

const parseJwt = (jwtPayload: string): AuthJwt => {
  const base64Decode = Buffer.from(jwtPayload, "base64")
  return JSON.parse(base64Decode.toString())
}

const parseJwtCookie = (request: { cookies: NextApiRequestCookies }): AuthJwt | null => {
  const payload = request.cookies[".AUTH"]?.split(".")?.[1]

  return payload ? parseJwt(payload) : null
}

export default parseJwtCookie
