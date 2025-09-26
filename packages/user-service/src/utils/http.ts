import { IncomingMessage } from "http"

export const isPost = (request: IncomingMessage) => {
  return request.method === "POST"
}

export const isGet = (request: IncomingMessage) => {
  return request.method === "GET"
}
