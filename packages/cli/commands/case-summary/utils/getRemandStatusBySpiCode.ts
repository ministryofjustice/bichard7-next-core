type RemandStatus = {
  cjsCode: string
  description: string
  pncCode: string
  spiCode: string
}

let remandStatuses: RemandStatus[] = []

const getRemandStatusBySpiCode = async (spiStatus?: string): Promise<string> => {
  if (!spiStatus) {
    return ""
  }

  if (remandStatuses.length === 0) {
    const resultCodeResult = await fetch(
      "https://raw.githubusercontent.com/ministryofjustice/bichard7-next-data/refs/heads/main/output-data/data/remand-status.json"
    )
    remandStatuses = await resultCodeResult.json()
  }

  const title = remandStatuses.find((result) => result.spiCode === spiStatus)?.description

  return title ? `${title} (${spiStatus})` : spiStatus
}

export default getRemandStatusBySpiCode
