import config from "lib/config"
import QueryString from "qs"
import { Result } from "types/Result"
import { unsign } from "cookie-signature"

export interface ParseFormTokenResult {
  cookieName: string
  formToken: string
}

export default (formData: QueryString.ParsedQs): Result<ParseFormTokenResult> => {
  const { tokenName, formSecret } = config.csrf

  // eslint-disable-next-line no-prototype-builtins
  if (!formData.hasOwnProperty(tokenName)) {
    return Error("Token not found in the form data.")
  }

  const formToken = formData[tokenName]?.toString()

  if (!formToken) {
    return Error("Token is empty in the form data.")
  }
  const unsignedFormToken = unsign(formToken, formSecret)

  if (!unsignedFormToken) {
    return Error("Invalid form token format.")
  }

  const formTokenParts = unsignedFormToken.split("=")
  const cookieName = formTokenParts[0]
  const formTokenValue = formTokenParts.splice(1).join("=")

  const formTokenValueParts = formTokenValue.split(".")
  const formTokenExpiryDate = new Date(Number(formTokenValueParts[0]))

  if (formTokenExpiryDate < new Date()) {
    return Error("Expired form token.")
  }

  const csrfFormToken = formTokenValueParts.splice(1).join(".")

  return { cookieName, formToken: csrfFormToken }
}
