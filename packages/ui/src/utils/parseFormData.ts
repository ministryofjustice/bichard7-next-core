import { IncomingMessage } from "http"
import getRawBody from "raw-body"
import { parse } from "qs"

const limit = "1mb"
const encoding = "utf-8"

export default async function parseFormData(req: IncomingMessage) {
  const body = await getRawBody(req, { limit, encoding })
  return parse(body.toString())
}
