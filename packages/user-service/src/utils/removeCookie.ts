import { ServerResponse } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"

export default (response: ServerResponse, cookies: NextApiRequestCookies, cookieName: string) => {
  const newCookies: string[] = []

  Object.keys(cookies).forEach((key) => {
    if (key !== cookieName && cookies[key] !== undefined) {
      newCookies.push(`${key}=${cookies[key]?.trim().split("=")[1]}`)
    } else {
      newCookies.push(`${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`)
    }
  })
  response.setHeader("Set-Cookie", newCookies)
}
