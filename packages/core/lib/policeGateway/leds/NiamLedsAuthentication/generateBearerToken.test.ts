import generateTestPrivateKeyAndCertificate from "../../../../tests/helpers/generateTestPrivateKeyAndCertificate"
import generateBearerToken from "./generateBearerToken"

const dummyToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkdW1teS1hdWQiLCJpc3MiOiJkdW1teS1pc3MiLCJpYXQiOjE3NzA5OTM0MzgsIm5iZiI6MTc3MDk5MzQzOCwiZXhwIjoxNzcwOTk3MzM4LCJhaW8iOiJkdW1teS1haW8iLCJhenAiOiJkdW1teS1henAiLCJhenBhY3IiOiIyIiwib2lkIjoiZHVtbXktb2lkIiwicmgiOiJkdW1teS1yaCIsInJvbGVzIjpbInJvbGU9ZHVtbXktcm9sZSJdLCJzdWIiOiJkdW1teS1zdWIiLCJ0aWQiOiJkdW1teS10aWQiLCJ1dGkiOiJkdW1teS11dGkiLCJ2ZXIiOiIyLjAiLCJ4bXNfZnRkIjoiZHVtbXkteG1zLWZ0ZCJ9Cg.fakestuff"

const generateOptions = (certificate: string, privateKey: string) => ({
  authenticationUrl: "https://dummy-url.com",
  certificate,
  privateKey,
  parameters: {
    claims: {
      aud: "aud",
      iss: "iss",
      sub: "sub"
    },
    clientAssertionType: "dummy",
    clientId: "client-id",
    grantType: "grant-type",
    scope: "scope"
  }
})

const spyFetch = (token: unknown) => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ access_token: token })
    } as Response)
  )
}

describe("generateBearerToken", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should generate the token", async () => {
    spyFetch(dummyToken)
    const { privateKey, certificate } = generateTestPrivateKeyAndCertificate()

    const result = await generateBearerToken(generateOptions(certificate, privateKey))

    expect(result instanceof Error).toBeFalsy()
    expect(result).toEqual({ expiryDate: new Date("2026-02-13T15:42:18.000Z"), token: dummyToken })
  })

  it("should return error when API call fails", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject(new TypeError("Network Error")))
    const { privateKey, certificate } = generateTestPrivateKeyAndCertificate()

    const result = await generateBearerToken(generateOptions(certificate, privateKey))

    expect((result as Error).message).toBe("Network Error")
  })

  it("should return error when API response does not have access_token key", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ randomKey: "random value" })
      } as Response)
    )
    const { privateKey, certificate } = generateTestPrivateKeyAndCertificate()

    const result = await generateBearerToken(generateOptions(certificate, privateKey))

    expect((result as Error).message).toContain("Failed to decode token.")
  })

  it("should return error when API return non-json content", async () => {
    spyFetch("dummy string")
    const { privateKey, certificate } = generateTestPrivateKeyAndCertificate()

    const result = await generateBearerToken(generateOptions(certificate, privateKey))

    expect((result as Error).message).toContain("Failed to decode token.")
  })

  it("should return error when private key is invalid", async () => {
    spyFetch(dummyToken)
    const certificate = generateTestPrivateKeyAndCertificate().certificate

    const result = await generateBearerToken(generateOptions(certificate, "invalid private key"))

    expect((result as Error).message).toBe(
      "Failed to sign client assertion claims. secretOrPrivateKey must be an asymmetric key when using RS256"
    )
  })

  it("should return error when fails to generate X5T", async () => {
    spyFetch(dummyToken)
    const privateKey = generateTestPrivateKeyAndCertificate().privateKey

    const result = await generateBearerToken(generateOptions("", privateKey))

    expect((result as Error).message).toContain("Failed to generate X5T")
  })
})
