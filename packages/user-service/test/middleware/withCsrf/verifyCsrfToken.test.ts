jest.mock("lib/parseFormData")

import { serialize } from "cookie"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import verifyCsrfToken from "middleware/withCsrf/verifyCsrfToken"
import type { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import type QueryString from "qs"
import config from "lib/config"

const createRequest = (cookie: string) => {
  return <IncomingMessage>{
    method: "POST",
    headers: {
      cookie
    }
  }
}

const mockParseFormData = (formToken: string) => {
  const mockedParseFormData = parseFormData as jest.MockedFunction<typeof parseFormData>
  mockedParseFormData.mockResolvedValue({
    CSRFToken: formToken,
    "Dummy-Form-Field": "DummyValue"
  })
}

const expectFormDataToBeValid = (formData: QueryString.ParsedQs, formToken: string) => {
  expect(formData).toHaveProperty("CSRFToken")
  expect(formData.CSRFToken).toBe(formToken)
  expect(formData).toHaveProperty("Dummy-Form-Field")
  expect(formData["Dummy-Form-Field"]).toBe("DummyValue")
}

const dummyRequest = <IncomingMessage>{ url: "/login" }
const {
  formToken: validFormToken,
  cookieToken: validCookieToken,
  cookieName: validCookieName
} = generateCsrfToken(dummyRequest, config)
const cookie = serialize(validCookieName, validCookieToken)

const { cookieToken: anotherCookieToken, cookieName: anotherCookieName } = generateCsrfToken(dummyRequest, config)
const invalidCookieForFormToken = serialize(anotherCookieName, anotherCookieToken)

const expiredCookie = "QO60fsUX-KKkGnqboM90s8VS9C5zSdrysjrg.FuBXqXqFzbs6JWUZIC5jIZztpbZ8gYdD4Q2%2FF569Qr4"
const expiredFormToken =
  "CSRFToken%2Flogin=1629370536933.QO60fsUX-KKkGnqboM90s8VS9C5zSdrysjrg.31NFF0UFt3Pa7IAeRDiagzG8BPM45cIH8EMynKUlpzY"

it("should be valid when request method is GET", async () => {
  mockParseFormData(validFormToken)
  const request = <IncomingMessage>{ method: "GET" }

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(true)
  expectFormDataToBeValid(formData, validFormToken)
})

it("should be valid when form token and cookie token are equal", async () => {
  mockParseFormData(validFormToken)
  const request = createRequest(cookie)

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(true)
  expectFormDataToBeValid(formData, validFormToken)
})

it("should be invalid when form token and cookie token are not equal", async () => {
  mockParseFormData(validFormToken)
  const request = createRequest(invalidCookieForFormToken)

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, validFormToken)
})

it("should be invalid when form token is expired", async () => {
  mockParseFormData(expiredFormToken)
  const request = createRequest(expiredCookie)

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, expiredFormToken)
})

it("should be invalid when form token returns error", async () => {
  const invalidFormToken = "Invalid Format"
  mockParseFormData(invalidFormToken)
  const request = createRequest(invalidCookieForFormToken)

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, invalidFormToken)
})

it("should be invalid when cookie token returns error", async () => {
  const invalidFormToken = "Invalid Format"
  mockParseFormData(invalidFormToken)
  const request = createRequest(invalidCookieForFormToken)

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, invalidFormToken)
})
