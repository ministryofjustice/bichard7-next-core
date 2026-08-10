/* eslint-disable @typescript-eslint/no-var-requires */

export {}

const { TextDecoder, TextEncoder } = require("node:util")
Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, configurable: true },
  TextDecoder: { value: TextDecoder, configurable: true }
})

const { ReadableStream } = require("node:stream/web")
Object.defineProperty(globalThis, "ReadableStream", { value: ReadableStream, configurable: true })

const { MessagePort } = require("node:worker_threads")
Object.defineProperty(globalThis, "MessagePort", { value: MessagePort, configurable: true })

const { fetch, Headers, Request, Response, FormData } = require("undici")
Object.assign(globalThis, { fetch, Headers, Request, Response, FormData })
