import type { NextApiRequest, NextApiResponse } from "next"
import withApiAuthentication from "@/middleware/withApiAuthentication/withApiAuthentication"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import Permission from "@moj-bichard7/common/types/Permission"
import ApiClient from "@/services/api/ApiClient"
import BichardApiV1 from "@/services/api/BichardApiV1"
import { isError } from "@moj-bichard7/common/types/Result"
import type { ApiUserLookupQuery } from "@moj-bichard7/common/contracts/ApiUserLookupQuery"

export default async function users(request: NextApiRequest, response: NextApiResponse) {
  const allowedMethods = ["GET"]

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

  const jwt = req.cookies[".AUTH"] as string
  const apiClient = new ApiClient(jwt)
  const apiGateway = new BichardApiV1(apiClient)

  const query: ApiUserLookupQuery = req.query

  const result = await apiGateway.fetchUserLookup(query)

  if (isError(result)) {
    return res.status(500).send(result.message)
  }

  res.status(200).send(result.users)
}
