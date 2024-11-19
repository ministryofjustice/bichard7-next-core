import type { SerializeOptions } from "cookie"
import type { ServerResponse } from "http"

import { serialize } from "cookie"

import { COOKIES_SECURE_OPTION } from "../config"

const cookieOptions: SerializeOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: COOKIES_SECURE_OPTION
}

const getExistingCookies = (response: ServerResponse): string[] => {
  let cookies: string[] = []
  const existingCookies = response.getHeader("Set-Cookie")

  if (Array.isArray(existingCookies)) {
    cookies = existingCookies as string[]
  } else if (existingCookies) {
    cookies = [existingCookies as string]
  }

  return cookies
}

export default (response: ServerResponse, name: string, value: string, options?: SerializeOptions) => {
  const cookies = getExistingCookies(response)
  const cookieValue = serialize(name, value, { ...cookieOptions, ...options })
  cookies.push(cookieValue)
  response.setHeader("Set-Cookie", cookies)
}
