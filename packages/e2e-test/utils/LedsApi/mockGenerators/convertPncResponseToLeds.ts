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

    const [errorDetailType, message] = match.groups.error.split("-")
    errors.push({ errorDetailType, message })
  }
}

const convertPncResponseToLeds = (pncResponse?: string): ConvertPncResponseToLedsResult => {
  const isSuccessful = /<TXT>A\d{4}/.test(pncResponse ?? "")
  const errors = extractErrors(pncResponse ?? "")

  if (!pncResponse || isSuccessful || errors.length === 0) {
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

export default convertPncResponseToLeds
