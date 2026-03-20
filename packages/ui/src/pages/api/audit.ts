import type { NextApiRequest, NextApiResponse } from "next"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import withApiAuthentication from "../../middleware/withApiAuthentication/withApiAuthentication"
import Permission from "@moj-bichard7/common/types/Permission"
import BichardApiV1 from "../../services/api/BichardApiV1"
import ApiClient from "../../services/api/ApiClient"
import { isError } from "../../types/Result"

export default async (request: NextApiRequest, response: NextApiResponse<AuditDto>) => {
  const allowedMethods = ["POST"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth

  if (!currentUser.hasAccessTo[Permission.CanAuditCases]) {
    res.status(403).end("Forbidden")
    return
  }

  const jwt = req.cookies[".AUTH"] as string
  const apiClient = new ApiClient(jwt)
  const apiGateway = new BichardApiV1(apiClient)

  const result = await apiGateway.createAudit(req.body)
  if (isError(result)) {
    res.status(400).send(result.message)
    return
  }

  res.status(200).json(result)
}
