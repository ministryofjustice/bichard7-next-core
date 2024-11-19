/* eslint-disable import/first */
jest.mock("middleware/withCsrf/verifyCsrfToken")
jest.mock("middleware/withCsrf/generateCsrfToken")

import type { IncomingMessage } from "http"
import type { GetServerSidePropsContext } from "next"
import type QueryString from "qs"
import type { ParsedUrlQuery } from "querystring"
import type CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"

import { ServerResponse } from "http"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import verifyCsrfToken from "middleware/withCsrf/verifyCsrfToken"
import withCsrf from "middleware/withCsrf/withCsrf"

it("should include form data and CSRF token in the context", async () => {
  const mockedVerifyCsrfToken = verifyCsrfToken as jest.MockedFunction<typeof verifyCsrfToken>
  const mockedGenerateCsrfToken = generateCsrfToken as jest.MockedFunction<typeof generateCsrfToken>

  const dummyFormData = <QueryString.ParsedQs>{ "Dummy-Form-Field": "DummyValue" }
  mockedVerifyCsrfToken.mockResolvedValue({ formData: dummyFormData, isValid: true })
  const dummyToken = "DummyFormToken"
  mockedGenerateCsrfToken.mockReturnValue(dummyToken)

  const request = {} as IncomingMessage
  const response = new ServerResponse(request)
  const dummyContext = { req: request, res: response } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withCsrf((context) => {
    const { csrfToken, formData, req } = context as CsrfServerSidePropsContext

    expect(req).toBeDefined()
    expect(csrfToken).toBe("DummyFormToken")
    expect(formData).toBeDefined()
    expect(formData["Dummy-Form-Field"]).toBe("DummyValue")

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toBeUndefined()

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set forbidden response code when CSRF token verification fails", async () => {
  const mockedVerifyCsrfToken = verifyCsrfToken as jest.MockedFunction<typeof verifyCsrfToken>

  const dummyFormData = <QueryString.ParsedQs>{ "Dummy-Form-Field": "DummyValue" }
  mockedVerifyCsrfToken.mockResolvedValue({ formData: dummyFormData, isValid: false })

  let isEndCalled = false
  const headers: Record<string, string> = {}
  const dummyContext = {
    res: {
      end: () => {
        isEndCalled = true
      },
      setHeader: (name: string, value: string) => {
        headers[name] = value
      },
      statusCode: 200,
      statusMessage: "Ok"
    }
  } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withCsrf(() => undefined as never)

  await handler(dummyContext)

  const { statusCode, statusMessage } = dummyContext.res
  expect(statusCode).toBe(403)
  expect(statusMessage).toBe("Invalid CSRF-token")
  expect(headers).toStrictEqual({
    "X-Status-Message": "Invalid CSRF-token"
  })
  expect(isEndCalled).toBe(true)
})
