import { withAuthentication } from "@/middleware"
import type { IncomingMessage, ServerResponse } from "http"
import parseJwtCookie from "middleware/withAuthentication/parseJwtCookie"
import type { GetServerSidePropsContext } from "next"
import type { ParsedUrlQuery } from "querystring"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import getUser from "services/getUser"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
jest.mock("middleware/withAuthentication/parseJwtCookie")
jest.mock("services/getDataSource")
jest.mock("services/getUser")

const mockedParseJwtCookie = parseJwtCookie as jest.MockedFunction<typeof parseJwtCookie>
const mockedGetDataSource = getDataSource as jest.MockedFunction<typeof getDataSource>
const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>

describe("withAuthentication wrapper", () => {
  let mockRequest: IncomingMessage
  let mockResponse: Partial<ServerResponse>

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {} as IncomingMessage
    mockResponse = {
      statusCode: 200,
      statusMessage: "",
      end: jest.fn()
    } as unknown as ServerResponse
  })

  it("filters out matching trigger codes from currentUser.excludedTriggers when provided as a single string", async () => {
    mockedParseJwtCookie.mockReturnValue({ username: "dummy", groups: ["group1"] } as any)
    mockedGetDataSource.mockResolvedValue({} as any)

    const initialUser = {
      username: "dummy",
      excludedTriggers: ["TRPR0001", "TRPR0002", "TRPR0003"]
    } as User

    mockedGetUser.mockResolvedValue(initialUser)

    const context = {
      req: mockRequest,
      res: mockResponse as ServerResponse,
      query: {
        triggerCodes: "TRPR0002"
      }
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>

    const handler = withAuthentication((ctx) => {
      const { currentUser } = ctx as AuthenticationServerSidePropsContext
      expect(currentUser?.excludedTriggers).toEqual(["TRPR0001", "TRPR0003"])
      return Promise.resolve({ props: {} })
    })

    await handler(context)
  })

  it("filters out multiple trigger codes when provided as an array in query", async () => {
    mockedParseJwtCookie.mockReturnValue({ username: "dummy", groups: ["group1"] } as any)
    mockedGetDataSource.mockResolvedValue({} as any)

    const initialUser = {
      username: "dummy",
      excludedTriggers: ["TRPR0001", "TRPR0002", "TRPR0003", "TRPR0004"]
    } as User

    mockedGetUser.mockResolvedValue(initialUser)

    const context = {
      req: mockRequest,
      res: mockResponse as ServerResponse,
      query: {
        triggerCodes: ["TRPR0001", "TRPR0003"]
      }
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>

    const handler = withAuthentication((ctx) => {
      const { currentUser } = ctx as AuthenticationServerSidePropsContext
      expect(currentUser?.excludedTriggers).toEqual(["TRPR0002", "TRPR0004"])
      return Promise.resolve({ props: {} })
    })

    await handler(context)
  })

  it("leaves excludedTriggers untouched when triggerCodes query param is not provided", async () => {
    mockedParseJwtCookie.mockReturnValue({ username: "dummy", groups: ["group1"] } as any)
    mockedGetDataSource.mockResolvedValue({} as any)

    const initialUser = {
      username: "dummy",
      excludedTriggers: ["TRPR0001", "TRPR0002"]
    } as User

    mockedGetUser.mockResolvedValue(initialUser)

    const context = {
      req: mockRequest,
      res: mockResponse as ServerResponse,
      query: {}
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>

    const handler = withAuthentication((ctx) => {
      const { currentUser } = ctx as AuthenticationServerSidePropsContext
      expect(currentUser?.excludedTriggers).toEqual(["TRPR0001", "TRPR0002"])
      return Promise.resolve({ props: {} })
    })

    await handler(context)
  })

  it("returns 401 response when currentUser is null", async () => {
    mockedParseJwtCookie.mockReturnValue({ username: "dummy", groups: ["group1"] } as any)
    mockedGetDataSource.mockResolvedValue({} as any)
    mockedGetUser.mockResolvedValue(null)

    const context = {
      req: mockRequest,
      res: mockResponse as ServerResponse,
      query: {}
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>

    const innerHandler = jest.fn()
    const handler = withAuthentication(innerHandler)

    const result = await handler(context)

    expect(mockResponse.statusCode).toBe(401)
    expect(mockResponse.statusMessage).toBe("Unauthorized")
    expect(mockResponse.end).toHaveBeenCalled()
    expect(innerHandler).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it("returns 502 response when getUser returns an Error", async () => {
    mockedParseJwtCookie.mockReturnValue({ username: "dummy", groups: ["group1"] } as any)
    mockedGetDataSource.mockResolvedValue({} as any)
    mockedGetUser.mockResolvedValue(new Error("Database connection failed"))

    const context = {
      req: mockRequest,
      res: mockResponse as ServerResponse,
      query: {}
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>

    const innerHandler = jest.fn()
    const handler = withAuthentication(innerHandler)

    const result = await handler(context)

    expect(mockResponse.statusCode).toBe(502)
    expect(mockResponse.statusMessage).toBe("Bad Gateway")
    expect(mockResponse.end).toHaveBeenCalled()
    expect(innerHandler).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })
})
