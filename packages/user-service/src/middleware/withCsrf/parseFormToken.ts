import config from "lib/config"
import type QueryString from "qs"
import type { Result } from "types/Result"
import { unsign } from "cookie-signature"

export interface ParseFormTokenResult {
  cookieName: string
  formToken: string
}

const parseFormToken = (formData: QueryString.ParsedQs): Result<ParseFormTokenResult> => {
  const { tokenName, formSecret } = config.csrf

  if (!formData.hasOwnProperty(tokenName)) {
    return new Error("Token not found in the form data.")
  }

  const formToken = formData[tokenName]?.toString()

  if (!formToken) {
    return new Error("Token is empty in the form data.")
  }

  const unsignedFormToken = unsign(formToken, formSecret)

  if (!unsignedFormToken) {
    return new Error("Invalid form token format.")
  }

  const formTokenParts = unsignedFormToken.split("=")
  const cookieName = formTokenParts[0]
  const formTokenValue = formTokenParts.splice(1).join("=")

  const formTokenValueParts = formTokenValue.split(".")
  const formTokenExpiryDate = new Date(Number(formTokenValueParts[0]))

  if (formTokenExpiryDate < new Date()) {
    return new Error("Expired form token.")
  }

  const csrfFormToken = formTokenValueParts.splice(1).join(".")

  return { cookieName, formToken: csrfFormToken }
}

export default parseFormToken
