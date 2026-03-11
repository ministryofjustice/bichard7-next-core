import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import type { LogQuery } from "services/reports/auditLogCsvDownload"
import { auditLogCsvDownload } from "services/reports/auditLogCsvDownload"

import { isError } from "@moj-bichard7/common/types/Result"

export default async function log(request: NextApiRequest, response: NextApiResponse) {
  const allowedMethods = ["GET"]

  const auth = await withApiAuthentication(request, response, allowedMethods)
  if (!auth) {
    response.status(401).send("Unauthorized")
    response.end()
    return
  }

  const { req, res, currentUser } = auth

  const result = await auditLogCsvDownload(currentUser, req.query as unknown as LogQuery)

  if (!isError(result)) {
    res.status(201).send({ saved: true })
    res.end()
    return
  }

  if (result.message) {
    switch (result.message) {
      case "400":
        res.status(400).send({ saved: false, error: "Bad Request" })
        res.end()
        return
      case "403":
        res.status(403).send({ saved: false, error: "Forbidden" })
        res.end()
        return
      default:
        res.status(500).send({ saved: false, error: result.message })
        res.end()
        return
    }
  }

  res.status(500).send({ saved: false, error: "Unknow Error" })
  res.end()
}
