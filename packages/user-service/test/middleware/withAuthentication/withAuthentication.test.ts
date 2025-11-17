jest.mock("middleware/withAuthentication/getAuthenticationPayloadFromCookie")
jest.mock("useCases/getUserByEmailAddress")
jest.mock("lib/token/authenticationToken")

import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { isTokenIdValid } from "lib/token/authenticationToken"
import { withAuthentication } from "middleware"
import getAuthenticationPayloadFromCookie from "middleware/withAuthentication/getAuthenticationPayloadFromCookie"
import type { GetServerSidePropsContext } from "next"
import type { ParsedUrlQuery } from "querystring"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"

it("should include current user in the context when successfully get the user", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as AuthenticationTokenPayload
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)

  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as User
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const mockedIsTokenIdValid = isTokenIdValid as jest.MockedFunction<typeof isTokenIdValid>
  mockedIsTokenIdValid.mockResolvedValue(true)

  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set current user to undefined in the context when there is an error getting the user", async () => {
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(null)
  const dummyContext = { req: {} } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeNull()
    return undefined as never
  })

  await handler(dummyContext)
})

it("should set httpsRedirectCookie to true", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@example.com"
  } as AuthenticationTokenPayload
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)

  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@example.com"
  } as User
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const mockedIsTokenIdValid = isTokenIdValid as jest.MockedFunction<typeof isTokenIdValid>
  mockedIsTokenIdValid.mockResolvedValue(true)

  const request = {} as IncomingMessage
  const response = new ServerResponse(request)
  const dummyContext = { req: request, res: response } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req, httpsRedirectCookie } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toBeDefined()
    expect(cookieValues[0]).toContain("httpsRedirect=true; Path=/; HttpOnly; Secure; SameSite=Strict")

    expect(httpsRedirectCookie).toBe(true)

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set httpsRedirectCookie to false", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as AuthenticationTokenPayload
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)

  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as User
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const mockedIsTokenIdValid = isTokenIdValid as jest.MockedFunction<typeof isTokenIdValid>
  mockedIsTokenIdValid.mockResolvedValue(true)

  const request = {} as IncomingMessage
  const response = new ServerResponse(request)
  const dummyContext = { req: request, res: response } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req, httpsRedirectCookie } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toBeUndefined()

    expect(httpsRedirectCookie).toBe(false)

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set httpsRedirectCookie to true and the cookie set", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as AuthenticationTokenPayload
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)

  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@dummy.com",
    featureFlags: { httpsRedirect: true }
  } as User
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const mockedIsTokenIdValid = isTokenIdValid as jest.MockedFunction<typeof isTokenIdValid>
  mockedIsTokenIdValid.mockResolvedValue(true)

  const request = {} as IncomingMessage
  const response = new ServerResponse(request)
  const dummyContext = { req: request, res: response } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req, httpsRedirectCookie } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toBeDefined()
    expect(cookieValues[0]).toContain("httpsRedirect=true; Path=/; HttpOnly; Secure; SameSite=Strict")

    expect(httpsRedirectCookie).toBe(true)

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set httpsRedirectCookie to false and the cookie not set", async () => {
  const expectedAuthenticationToken = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as AuthenticationTokenPayload
  const mockedGetAuthenticationPayloadFromCookie = getAuthenticationPayloadFromCookie as jest.MockedFunction<
    typeof getAuthenticationPayloadFromCookie
  >
  mockedGetAuthenticationPayloadFromCookie.mockReturnValue(expectedAuthenticationToken)

  const expectedUser = {
    username: "dummy",
    emailAddress: "dummy@dummy.com",
    featureFlags: { httpsRedirect: false }
  } as User
  const mockedGetUserByEmailAddress = getUserByEmailAddress as jest.MockedFunction<typeof getUserByEmailAddress>
  mockedGetUserByEmailAddress.mockResolvedValue(expectedUser)

  const mockedIsTokenIdValid = isTokenIdValid as jest.MockedFunction<typeof isTokenIdValid>
  mockedIsTokenIdValid.mockResolvedValue(true)

  const request = {} as IncomingMessage
  const response = new ServerResponse(request)
  const dummyContext = { req: request, res: response } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = withAuthentication((context) => {
    const { currentUser, req, httpsRedirectCookie } = context as AuthenticationServerSidePropsContext

    expect(req).toBeDefined()
    expect(currentUser).toBeDefined()

    const { emailAddress, username } = currentUser as Partial<User>
    expect(emailAddress).toBe(expectedUser.emailAddress)
    expect(username).toBe(expectedUser.username)

    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toBeUndefined()

    expect(httpsRedirectCookie).toBe(false)

    return undefined as never
  })

  await handler(dummyContext)
})
