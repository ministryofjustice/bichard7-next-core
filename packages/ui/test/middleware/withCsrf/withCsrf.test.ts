/* eslint-disable import/first */
jest.mock("middleware/withCsrf/verifyCsrfToken")
jest.mock("middleware/withCsrf/generateCsrfToken")

import { IncomingMessage, ServerResponse } from "http"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import verifyCsrfToken from "middleware/withCsrf/verifyCsrfToken"
import withCsrf from "middleware/withCsrf/withCsrf"
import { GetServerSidePropsContext } from "next"
import QueryString from "qs"
import { ParsedUrlQuery } from "querystring"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"

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
    const { formData, csrfToken, req } = context as CsrfServerSidePropsContext

    expect(req).toBeDefined()
    expect(csrfToken).toBe("DummyFormToken")
    expect(formData).toBeDefined()
    expect(formData["Dummy-Form-Field"]).toBe("DummyValue")

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).not.toBeDefined()

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
      statusCode: 200,
      statusMessage: "Ok",
      setHeader: (name: string, value: string) => {
        headers[name] = value
      },
      end: () => {
        isEndCalled = true
      }
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
