import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import parseFormToken, { ParseFormTokenResult } from "middleware/withCsrf/parseFormToken"
import { IncomingMessage } from "http"
import QueryString from "qs"
import { isError } from "types/Result"
import config from "lib/config"

const request = <IncomingMessage>{ url: "/login" }

it("should return form token and cookie name when token exists in the form data", () => {
  const { formToken, cookieName: expectedCookieName } = generateCsrfToken(request, config)
  const formData = <QueryString.ParsedQs>{
    CSRFToken: formToken
  }
  const expectedFormToken = formToken.split("=")[1].split(".")[1]

  const result = parseFormToken(formData)

  expect(isError(result)).toBe(false)

  const { formToken: actualFormToken, cookieName: actualCookieName } = result as ParseFormTokenResult
  expect(actualFormToken).toBe(expectedFormToken)
  expect(actualCookieName).toBe(expectedCookieName)
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
