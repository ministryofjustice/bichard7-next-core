type ResultCode = {
  cjsCode: string
  description: string
  recordableOnPnc: string
  resultCodeQualifiers: string
  resultHalfLifeHours: string
  type: string
}

let resultCodes: ResultCode[] = []

const getOffenceCodeDetails = async (resultCode?: string | number): Promise<string> => {
  if (!resultCode || String(resultCode) === "1000") {
    return "No result code"
  }

  if (resultCodes.length === 0) {
    const resultCodeResult = await fetch(
      "https://raw.githubusercontent.com/ministryofjustice/bichard7-next-data/refs/heads/main/output-data/data/result-code.json"
    )
    resultCodes = await resultCodeResult.json()
  }

  const title = resultCodes.find((result) => result.cjsCode === String(resultCode))?.description

  return title ? `${resultCode} (${title})` : String(resultCode)
}

export default getOffenceCodeDetails
