import type { IncomingMessage } from "http"
import type QueryString from "qs"

import { isError } from "types/Result"
import parseFormData from "utils/parseFormData"

import parseFormToken from "./parseFormToken"

interface VerifyCsrfTokenResult {
  formData: QueryString.ParsedQs
  isValid: boolean
}

export default async (request: IncomingMessage): Promise<VerifyCsrfTokenResult> => {
  const formData = await parseFormData(request)

  if (request.method === "GET") {
    return { formData, isValid: true }
  }

  const formTokenResult = parseFormToken(formData)

  if (isError(formTokenResult)) {
    return { formData, isValid: false }
  }

  const { formToken } = formTokenResult

  const isValid = !!formToken

  return { formData, isValid }
}
