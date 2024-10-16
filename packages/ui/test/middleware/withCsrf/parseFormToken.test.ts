import type { IncomingMessage } from "http"
import type QueryString from "qs"
import { isError } from "types/Result"
import generateCsrfToken from "../../../src/middleware/withCsrf/generateCsrfToken"
import type { ParseFormTokenResult } from "../../../src/middleware/withCsrf/parseFormToken"
import parseFormToken from "../../../src/middleware/withCsrf/parseFormToken"

const request = <IncomingMessage>{ url: "/login" }

it("should return form token when token exists in the form data", () => {
  const formToken = generateCsrfToken(request)
  const formData = <QueryString.ParsedQs>{
    CSRFToken: formToken
  }
  const expectedFormToken = formToken.split("=")[1].split(".")[1]

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(false)

  const { formToken: actualFormToken } = result as ParseFormTokenResult
  expect(actualFormToken).toBe(expectedFormToken)
})

it("should return error when token does not exist in form data", () => {
  const formData = <QueryString.ParsedQs>{}

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Token not found in the form data.")
})

it("should return error when token is empty in form data", () => {
  const formData = <QueryString.ParsedQs>{ CSRFToken: "" }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Token is empty in the form data.")
})

it("should return error when token format is invalid", () => {
  const formData = <QueryString.ParsedQs>{
    CSRFToken: "Invalid format"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid form token format.")
})

it("should return error when token signature is invalid", () => {
  const formData = <QueryString.ParsedQs>{
    CSRFToken: "CSRFToken%2Flogin=1629370536933.QO60fsUX-KKkGnqboM90s8VS9C5zSdrysjrg.INVALID_SIGNATURE"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid form token format.")
})

it("should return error when token is expired", () => {
  const formData = <QueryString.ParsedQs>{
    CSRFToken:
      "CSRFToken%2Flogin=1631008561433.hsW1jiiB-zRY6RuLsB-xCMSKDsRPHiYD-fbI.Yg1mgLhFO//A+bmuCs1wSbbKhO+sqJ0HzD2e/MCou00"
  }

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Expired form token.")
})
