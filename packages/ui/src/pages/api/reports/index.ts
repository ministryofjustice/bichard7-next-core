import type { NextApiRequest, NextApiResponse } from "next"
import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import ReportsApiClient from "services/api/ReportsApiClient"
import BichardReportGateway from "services/api/BichardV1Report"
import type { ReportType } from "types/reports/ReportType"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import Permission from "@moj-bichard7/common/types/Permission"
import type { AnyReportQuery } from "services/api/interfaces/BichardReportGateway"

export const config = {
  api: {
    responseLimit: false,
    externalResolver: true
  }
}

export default async function index(request: NextApiRequest, response: NextApiResponse) {
  const allowedMethods = ["GET"]

  const auth = await withApiAuthentication(request, response, allowedMethods)
  if (!auth) {
    response.status(401).send("Unauthorized")
    return
  }

  const { req, res, currentUser } = auth

  if (!userAccess(currentUser)[Permission.ViewReports]) {
    res.status(403).send("Forbidden")
    return
  }

  const jwt = req.cookies[".AUTH"] as string
  const streamClient = new ReportsApiClient(jwt)
  const reportGateway = new BichardReportGateway(streamClient)

  const reportType = req.query.reportType as ReportType
  const params: AnyReportQuery = {
    fromDate: new Date(req.query.fromDate as string),
    toDate: new Date(req.query.toDate as string),
    exceptions: req.query.exceptions === "true",
    triggers: req.query.triggers === "true"
  }

  const reportStream = reportGateway.reportStrategy(reportType, params)

  if (isError(reportStream)) {
    res.status(400).send(reportStream.message)
    return
  }

  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")

  try {
    for await (const chunk of reportStream) {
      if (chunk instanceof Error) {
        console.error("Stream error from Gateway:", chunk.message)
        res.write(JSON.stringify({ error: chunk.message }) + "\n")
        break
      }

      res.write(chunk)
    }
  } catch (error) {
    console.error("Fatal API Route Error:", error)
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" })
      return
    }
  } finally {
    res.end()
  }
}
