import { useState } from "react"
import { useRouter } from "next/router"

const DownloadButton = () => {
  const router = useRouter()
  const { query } = router
  const [working, setWorking] = useState(false)

  const handleClick = async () => {
    setWorking(true)
    try {
      const queryString = new URLSearchParams(query as Record<string, string>).toString()
      const response = await fetch(`/bichard/api/reports/case-list?${queryString}`)
      const payload = await response.json()
      const { report } = payload

      const blob = new Blob([report], { type: "text/csv" })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `bichard-case-list-report-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading the file:", error)
    }
    setWorking(false)
  }

  return (
    <button
      data-module="govuk-button"
      id="download-button"
      className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
      type="button"
      onClick={handleClick}
      disabled={working}
    >
      {"Download Report"}
    </button>
  )
}

export default DownloadButton
