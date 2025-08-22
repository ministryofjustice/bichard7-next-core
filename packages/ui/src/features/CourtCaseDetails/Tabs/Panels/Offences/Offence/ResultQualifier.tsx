import ResultQualifierCodes from "@moj-bichard7-developers/bichard7-next-data/dist/data/result-qualifier-code.json"
import { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { InfoRow } from "../../InfoRow"

interface QualifierProps {
  result: Result
}

type ResultQualifierCode = {
  code: string
  description?: string
}

const ResultQualifier = ({ result }: QualifierProps): React.ReactNode => {
  if (result.ResultQualifierVariable.length === 0) {
    return <></>
  }

  let showIndex = false

  if (result.ResultQualifierVariable.length > 1) {
    showIndex = true
  }

  const qualifierCodes: ResultQualifierCode[] = result.ResultQualifierVariable.map((qualifier) => {
    const result = ResultQualifierCodes.find((qualifierCode) => qualifierCode.cjsCode === qualifier.Code)

    if (result) {
      return { code: result.cjsCode, description: result.description }
    }

    return { code: qualifier.Code }
  })

  return (
    <InfoRow
      label={"Result qualifier code" + (showIndex ? "s" : "")}
      value={qualifierCodes.map((qualifierCode) => (
        <div key={qualifierCode.code}>
          {qualifierCode.code + (qualifierCode.description ? ` (${qualifierCode.description})` : "")}
        </div>
      ))}
    />
  )
}

export default ResultQualifier
