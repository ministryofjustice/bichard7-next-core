import { IncomingMessage } from "http"
import parseCookieToken from "middleware/withCsrf/parseCookieToken"
import { isError } from "types/Result"

it("should return cookie token when valid CSRF cookie exists", () => {
  const cookieName = "CSRFToken%2Flogin"
  const request = <IncomingMessage>{
    headers: {
      cookie: `${cookieName}=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.M8YyQuvpv66ecZXEQUrL%2BLF%2BsR3g%2Fw0ysplz47bdeVE`
    }
  }

  const result = parseCookieToken(request, cookieName)

  expect(isError(result)).toBe(false)
  expect(result).toBe("VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA")
})

it("should return error when CSRF cookie does not exist", () => {
  const request = <IncomingMessage>{
    headers: {}
  }

  const result = parseCookieToken(request, "CSRFToken%2Flogin")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Could not find CSRF cookie.")
})

it("should return error when CSRF cookie is invalid", () => {
  const request = <IncomingMessage>{
    headers: {
      cookie: "Invalid format"
    }
  }

  const result = parseCookieToken(request, "CSRFToken%2Flogin")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid cookie token format.")
})

it("should return error when CSRF cookie has invalid signature", () => {
  const cookieName = "CSRFToken%2Flogin"
  const request = <IncomingMessage>{
    headers: {
      cookie: `${cookieName}=VfyI1c88-__KLP0wgpxue6xFzVozwuKsLxAA.INVALID_SIGNATURE`
    }
  }

  const result = parseCookieToken(request, cookieName)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe("Invalid cookie token format.")
})
