/* eslint-disable import/first */
jest.mock("utils/parseFormData")

import type { IncomingMessage } from "http"
import type QueryString from "qs"
import generateCsrfToken from "../../../src/middleware/withCsrf/generateCsrfToken"
import verifyCsrfToken from "../../../src/middleware/withCsrf/verifyCsrfToken"
import parseFormData from "../../../src/utils/parseFormData"

const createRequest = () => {
  return <IncomingMessage>{
    method: "POST"
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
const validFormToken = generateCsrfToken(dummyRequest)

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

it("should be invalid when form token is expired", async () => {
  mockParseFormData(expiredFormToken)
  const request = createRequest()

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, expiredFormToken)
})

it("should be invalid when form token returns error", async () => {
  const invalidFormToken = "Invalid Format"
  mockParseFormData(invalidFormToken)
  const request = createRequest()

  const result = await verifyCsrfToken(request)

  expect(result).toBeDefined()

  const { isValid, formData } = result
  expect(isValid).toBe(false)
  expectFormDataToBeValid(formData, invalidFormToken)
})
