import type { HttpResponse } from "mockserver-client"

const createMockResponse = <T>(body: T, statusCode: number): HttpResponse => ({
  statusCode,
  body: {
    type: "JSON",
    json: body
  }
})

export default createMockResponse
