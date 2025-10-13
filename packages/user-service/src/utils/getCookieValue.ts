import jwt from "jsonwebtoken"
import type { NextApiRequestCookies } from "next/dist/server/api-utils"

export default (cookies: NextApiRequestCookies, cookieName: string) => {
  if (cookies[cookieName] !== undefined) {
    const jwtToken = cookies[cookieName]?.split(";")[0]
    if (jwtToken === undefined) {
      return undefined
    }

    const result = jwt.decode(jwtToken)
    if (result !== null && typeof result !== "string") {
      return result
    }
  }

  return undefined
}
