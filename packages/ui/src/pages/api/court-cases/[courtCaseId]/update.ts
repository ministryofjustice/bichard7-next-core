import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import amendCourtCase from "services/amendCourtCase/amendCourtCase"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { isError } from "types/Result"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["PATCH", "PUT", "POST"]

  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth

  const dataSource = await getDataSource()
  const amendments = req.body

  const { courtCaseId } = req.query

  if (!courtCaseId) {
    res.status(404)
    res.end()
    return
  }

  let courtCase = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: +courtCaseId } })

  if (!courtCase) {
    res.status(404)
    res.end()
    return
  }

  const amendCourtCaseResponse = await amendCourtCase(dataSource, amendments, courtCase, currentUser)

  if (isError(amendCourtCaseResponse)) {
    res.status(500)
    res.end()
  }

  courtCase = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: +courtCaseId } })

  if (!courtCase) {
    res.status(404)
    res.end()
    return
  }

  const updatedCourtCase = courtCaseToDisplayFullCourtCaseDto(courtCase, currentUser)

  res.status(200)
  res.json({ courtCase: updatedCourtCase })
  res.end()
}
