import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { decodeAuthenticationToken } from "lib/token/authenticationToken"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"

jest.mock("lib/token/authenticationToken")

const request = {
  cookies: {
    ".AUTH": "DummyToken"
  }
}

const authenticationTokenPayload = {
  username: "dummy",
  emailAddress: "dummy@dummy.com"
} as AuthenticationTokenPayload

it("should return authentication payload when there is a valid authentication cookie", () => {
  const mockedDecodeAuthenticationToken = decodeAuthenticationToken as jest.MockedFunction<
    typeof decodeAuthenticationToken
  >
  mockedDecodeAuthenticationToken.mockReturnValue(authenticationTokenPayload)

  const result = getAuthenticationPayloadFromCookie(request)

  expect(result).toBeDefined()

  const { username, emailAddress } = result as AuthenticationTokenPayload
  expect(username).toBe(authenticationTokenPayload.username)
  expect(emailAddress).toBe(authenticationTokenPayload.emailAddress)
})

it("should return null when authentication cookie does not exist", () => {
  const result = getAuthenticationPayloadFromCookie({ cookies: {} })
  expect(result).toBeNull()
})

it("should return null when authentication cookie is invalid", () => {
  const expectedError = new Error("Dummy Error")
  const mockedDecodeAuthenticationToken = decodeAuthenticationToken as jest.MockedFunction<
    typeof decodeAuthenticationToken
  >
  mockedDecodeAuthenticationToken.mockReturnValue(expectedError)

  const result = getAuthenticationPayloadFromCookie(request)

  expect(result).toBeNull()
})
