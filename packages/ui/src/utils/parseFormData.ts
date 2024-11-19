import type { IncomingMessage } from "http"

import { parse } from "qs"
import getRawBody from "raw-body"

const limit = "1mb"
const encoding = "utf-8"

export default async function parseFormData(req: IncomingMessage) {
  const body = await getRawBody(req, { encoding, limit })
  return parse(body.toString())
}
