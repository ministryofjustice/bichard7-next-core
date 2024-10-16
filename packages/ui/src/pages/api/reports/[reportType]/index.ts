import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import QueryColumns from "services/QueryColumns"
import { Reason } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import { createReport } from "utils/reports/createReport"
import { createReportCsv } from "utils/reports/createReportCsv"
import { ReportType } from "utils/reports/ReportTypes"
import { extractSearchParamsFromQuery } from "utils/validateQueryParams"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth
  const { reportType } = req.query
  const caseListQueryParams = extractSearchParamsFromQuery(req.query, currentUser)

  switch (reportType) {
    case ReportType.RESOLVED_EXCEPTIONS:
      if (!caseListQueryParams.resolvedDateRange) {
        res.status(400).end()
      }

      caseListQueryParams.caseState = "Resolved"
      caseListQueryParams.reason = Reason.Exceptions
      break
    default:
      res.status(404).end()
  }

  const dataSource = await getDataSource()

  const courtCases = await listCourtCases(
    dataSource,
    caseListQueryParams,
    currentUser,
    QueryColumns.ResolvedExceptionsReport
  )

  if (isError(courtCases)) {
    const { message } = courtCases
    return res.status(500).json({ error: message })
  }

  const reportLines = createReport(courtCases.result, reportType as ReportType)
  const report = createReportCsv(reportLines, reportType as ReportType)

  res.status(200).json({ report })
}
