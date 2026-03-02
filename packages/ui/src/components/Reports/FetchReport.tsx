import { useState, useEffect } from "react"
import type { ReportType } from "types/reports/ReportType"
import { Loading } from "components/Loading"
import { ReportConfigs } from "types/reports/Config"
import { downloadReport } from "services/reports/downloadReport"
import { createReportCsv } from "services/reports/createReportCsv"
import { SimpleTable } from "components/Reports/SimpleTable"
import { GroupTable } from "components/Reports/GroupTable"
import { csvFilename } from "services/reports/utils/csvFilename"

interface FetchReportProps {
  type: ReportType
  urlQuery: URLSearchParams
}

export const FetchReport = ({ urlQuery, type }: FetchReportProps) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null)

  const reportCsvFilename = csvFilename(type, urlQuery)
  const config = ReportConfigs[type]

  const reportButtonText = () => {
    if (!config) {
      return "Missing Config for Report"
    }

    if (isStreaming) {
      return "Loading Report..."
    }

    return "Load Report"
  }

  const handleDownload = async () => {
    setIsStreaming(true)
    setRows([])
    setCsvDownloadUrl(null)

    try {
      const parsedData = await downloadReport(type, urlQuery)
      const csvBlob = await createReportCsv(parsedData, config, type, urlQuery.get("fromDate"), urlQuery.get("toDate"))

      setRows(parsedData)
      setCsvDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  useEffect(() => {
    return () => {
      if (csvDownloadUrl) {
        globalThis.URL.revokeObjectURL(csvDownloadUrl)
      }
    }
  }, [csvDownloadUrl])

  return (
    <div>
      <span>{`Report ${type}  `}</span>

      <button onClick={handleDownload} disabled={isStreaming || !config}>
        {reportButtonText()}
      </button>

      {isStreaming ? <Loading text={`Loading ${type} report...`} /> : undefined}

      {csvDownloadUrl && (
        <a href={csvDownloadUrl} download={reportCsvFilename}>
          <button style={{ marginLeft: "1rem" }}>{"Download CSV"}</button>
        </a>
      )}

      {rows.length > 0 && config && (
        <div style={{ marginTop: "1rem" }}>
          {config.isGrouped ? (
            <GroupTable config={config} groups={rows} />
          ) : (
            <SimpleTable config={config} rows={rows} />
          )}
        </div>
      )}
    </div>
  )
}
