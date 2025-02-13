import { useRouter } from "next/router"
import { useState } from "react"
import { SecondaryButton } from "./Buttons/SecondaryButton"

type Props = {
  reportType: string
}

const DownloadButton = ({ reportType }: Props) => {
  const router = useRouter()
  const { query } = router
  const [working, setWorking] = useState(false)

  const handleClick = async () => {
    setWorking(true)
    try {
      const queryString = new URLSearchParams(query as Record<string, string>).toString()
      const response = await fetch(`/bichard/api/reports/${reportType}?${queryString}`)

      if (response.ok) {
        const payload = await response.json()
        const { report } = payload

        const blob = new Blob([report], { type: "text/csv" })

        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `bichard-${reportType}-report-${new Date().toISOString()}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        window.alert(`Error downloading report: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error downloading report:", error)
      window.alert("Error downloading report")
    } finally {
      setWorking(false)
    }
  }

  return (
    <SecondaryButton
      data-module="govuk-button"
      id="download-button"
      className="govuk-!-margin-bottom-0"
      type="button"
      onClick={handleClick}
      disabled={working}
    >
      {"Download Report"}
    </SecondaryButton>
  )
}

export default DownloadButton
