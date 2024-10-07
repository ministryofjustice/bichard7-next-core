import { IncomingMessage } from "http"

export const isPost = (request: IncomingMessage) => {
  return request.method === "POST"
}

export const statusOk = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode < 300
}
