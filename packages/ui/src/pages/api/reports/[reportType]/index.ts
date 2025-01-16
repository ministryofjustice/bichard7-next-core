import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import QueryColumns from "services/listCourtCasesConfig"
import { Reason } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import { createReport } from "utils/reports/createReport"
import { createReportCsv } from "utils/reports/createReportCsv"
import { ReportType } from "utils/reports/ReportTypes"
import { extractSearchParamsFromQuery } from "utils/validateQueryParams"
import config from "services/listCourtCasesConfig"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth
  const { reportType } = req.query
  const caseListQueryParams = extractSearchParamsFromQuery(req.query, currentUser)

  caseListQueryParams.maxPageItems = config.BYPASS_PAGE_LIMIT
  caseListQueryParams.page = config.BYPASS_PAGE_LIMIT

  let selectColumns: string[] = []

  switch (reportType) {
    case ReportType.RESOLVED_EXCEPTIONS:
      if (!caseListQueryParams.resolvedDateRange) {
        res.status(400).end()
      }

      caseListQueryParams.caseState = "Resolved"
      caseListQueryParams.reason = Reason.Exceptions

      selectColumns = QueryColumns.ResolvedExceptionsReport
      break
    case ReportType.CASE_LIST:
      selectColumns = QueryColumns.CaseListQuery
      break

    default:
      res.status(404).end()
  }

  const dataSource = await getDataSource()

  const courtCases = await listCourtCases(dataSource, caseListQueryParams, currentUser, selectColumns)

  if (isError(courtCases)) {
    const { message } = courtCases
    return res.status(500).json({ error: message })
  }

  const reportLines = createReport(courtCases.result, reportType as ReportType)
  const report = createReportCsv(reportLines, reportType as ReportType)

  res.status(200).json({ report })
}
