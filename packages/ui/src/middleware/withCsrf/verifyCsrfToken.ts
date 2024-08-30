import { IncomingMessage } from "http"
import QueryString from "qs"
import { isError } from "types/Result"
import parseFormData from "utils/parseFormData"
import parseFormToken from "./parseFormToken"

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

  const { formToken } = formTokenResult

  const isValid = !!formToken

  return { isValid, formData }
}
