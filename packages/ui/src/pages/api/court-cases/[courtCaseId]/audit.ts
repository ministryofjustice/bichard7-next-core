import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import generateCsrfToken from "middleware/withCsrf/generateCsrfToken"
import type { NextApiRequest, NextApiResponse } from "next"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { isError } from "types/Result"
import { USE_API } from "../../../../config"
import BichardApiV1 from "../../../../services/api/BichardApiV1"
import ApiClient from "../../../../services/api/ApiClient"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["PATCH", "PUT", "POST"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth

  const dataSource = await getDataSource()

  const { courtCaseId } = req.query

  if (!courtCaseId) {
    res.status(404)
    res.end()
    return
  }

  let apiGateway: BichardApiV1 | undefined = undefined
  const jwt = req.cookies[".AUTH"] as string
  const apiClient = new ApiClient(jwt)
  apiGateway = new BichardApiV1(apiClient)

  const auditResults = apiGateway?.saveAuditResults(Number(courtCaseId))

  if (isError(auditResults)) {
    throw auditResults
  }

  let courtCase
  if (!USE_API) {
    courtCase = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: +courtCaseId } })

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }
  } else {
    apiGateway?.fetchCase(Number(courtCaseId))
  }

  const updatedCourtCase = courtCaseToDisplayFullCourtCaseDto(courtCase as CourtCase, currentUser)

  res.status(200)
  res.json({ courtCase: updatedCourtCase, csrfToken: generateCsrfToken(request) })
  res.end()
}
