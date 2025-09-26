import { IncomingMessage } from "http"
import { isPost, isGet } from "utils/http"

it("isPost should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "POST" }
  const isPostRequest = isPost(request)

  expect(isPostRequest).toBe(true)
})

it("isPost should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "GET" }
  const isPostRequest = isPost(request)

  expect(isPostRequest).toBe(false)
})

it("isGet should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "GET" }
  const isGetRequest = isGet(request)

  expect(isGetRequest).toBe(true)
})

it("isGet should return true when request method is post", () => {
  const request = <IncomingMessage>{ method: "POST" }
  const isGetRequest = isGet(request)

  expect(isGetRequest).toBe(false)
})
