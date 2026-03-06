import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type { UpdateResponse } from "@moj-bichard7/core/types/leds/UpdateResponse"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"

type LedsError = ErrorResponse["leds"]["errors"][0]
type ConvertPncResponseToLedsResult = { mockResponse: ErrorResponse | UpdateResponse; statusCode: number }

const extractErrors = (pncResponse: string): LedsError[] => {
  const regex = new RegExp(/<TXT>(?<error>I[123467890]{1}\d{3}.*)<\/TXT>/g)
  const errors: LedsError[] = []

  while (true) {
    const match = regex.exec(pncResponse)
    if (!match || !match.groups?.error) {
      return errors
    }

    errors.push({ errorDetailType: match.groups.error, message: match.groups.error })
  }
}

const convertPncUpdateResponseToLeds = (pncUpdateResponse?: string): ConvertPncResponseToLedsResult => {
  const isSuccessful = /<TXT>A\d{4}/.test(pncUpdateResponse ?? "")
  const errors = extractErrors(pncUpdateResponse ?? "")

  if (!pncUpdateResponse || isSuccessful || errors.length === 0) {
    return { mockResponse: { id: randomUUID() }, statusCode: HttpStatusCode.Created }
  }

  const mockResponse: ErrorResponse = {
    status: 400,
    title: "string",
    type: "conflict/version",
    details: "string",
    instance: "string",
    leds: {
      errors
    }
  }

  return { mockResponse, statusCode: HttpStatusCode.BadRequest }
}

export default convertPncUpdateResponseToLeds
