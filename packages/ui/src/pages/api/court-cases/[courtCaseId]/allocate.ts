import withApiAuthentication from "@/middleware/withApiAuthentication/withApiAuthentication"
import ApiClient from "@/services/api/ApiClient"
import BichardApiV1 from "@/services/api/BichardApiV1"
import type { AllocationQuery } from "@moj-bichard7/common/contracts/AllocationQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import type { UserLookupDto } from "@moj-bichard7/common/types/User"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function users(request: NextApiRequest, response: NextApiResponse) {
  const allowedMethods = ["PUT"]

  const auth = await withApiAuthentication(request, response, allowedMethods)
  if (!auth) {
    response.status(401).send("Unauthorized")
    return
  }

  const { req, res, currentUser } = auth

  if (!userAccess(currentUser)[Permission.CanAllocate]) {
    res.status(403).send("Forbidden")
    return
  }

  const { courtCaseId, caseType } = req.query

  const body = req.body as UserLookupDto

  const jwt = req.cookies[".AUTH"] as string
  const apiClient = new ApiClient(jwt)
  const apiGateway = new BichardApiV1(apiClient)

  const query = {
    courtCaseId: courtCaseId as string,
    caseType: caseType as string,
    allocatedToUserId: body.id
  } as AllocationQuery

  const result = await apiGateway.updateAllocation(Number(courtCaseId), query)

  if (isError(result)) {
    return res.status(500).send(result.message)
  }

  res.status(200).send({ result: "success" })
}
