import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import QueryString from "qs"
import { isError } from "types/Result"
import parseFormToken from "./parseFormToken"
import parseCookieToken from "./parseCookieToken"

interface VerifyCsrfTokenResult {
  isValid: boolean
  formData: QueryString.ParsedQs
}

export default async (request: IncomingMessage): Promise<VerifyCsrfTokenResult> => {
  const formData = await parseFormData(request)

  if (request.method === "GET") {
    return { isValid: true, formData }
  }

  const formTokenResult = parseFormToken(formData)

  if (isError(formTokenResult)) {
    return { isValid: false, formData }
  }

  const { formToken, cookieName } = formTokenResult

  const cookieToken = parseCookieToken(request, cookieName)

  if (isError(cookieToken)) {
    return { isValid: false, formData }
  }

  const isValid = formToken === cookieToken

  return { isValid, formData }
}
