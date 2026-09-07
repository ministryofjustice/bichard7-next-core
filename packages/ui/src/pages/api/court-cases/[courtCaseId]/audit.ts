import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import type { NextApiRequest, NextApiResponse } from "next"
import { isError } from "types/Result"
import ApiClient from "../../../../services/api/ApiClient"
import BichardApiV1 from "../../../../services/api/BichardApiV1"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["PATCH", "PUT", "POST"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res } = auth

  const { courtCaseId } = req.query

  if (!courtCaseId) {
    res.status(400)
    res.end()
    return
  }

  const jwt = req.cookies[".AUTH"] as string
  const apiClient = new ApiClient(jwt)
  const apiGateway = new BichardApiV1(apiClient)

  const { triggerQuality, exceptionQuality, note } = req.body.data
  const auditResultsData = {
    triggerQuality,
    errorQuality: exceptionQuality,
    note
  }

  const auditResults = await apiGateway.saveAuditResults(Number(courtCaseId), auditResultsData)

  if (isError(auditResults)) {
    response.status(500).json({ error: "Failed to save audit results" })
    response.end()
    return
  }

  const finalCourtCase = await apiGateway.fetchCase(Number(courtCaseId))

  if (isError(finalCourtCase)) {
    throw finalCourtCase
  }

  if (!finalCourtCase) {
    res.status(404).json({ error: "Case not found." })
    res.end()
    return
  }

  res.status(200)
  res.json({ courtCase: finalCourtCase, csrfToken: generateCsrfToken(request) })
  res.end()
}
