import ResultQualifierCodes from "@moj-bichard7-developers/bichard7-next-data/dist/data/result-qualifier-code.json"
import { Result } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import { JSX } from "react"
import { TableRow } from "../../TableRow"

interface QualifierProps {
  result: Result
}

type ResultQualifierCode = {
  code: string
  description?: string
}

const ResultQualifier = ({ result }: QualifierProps): JSX.Element => {
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
    <div className="result-qualifier-code-table">
      <h4 className="govuk-heading-m">{"Result qualifier code" + (showIndex ? "s" : "")}</h4>
      <Table>
        {qualifierCodes.map((qualifierCode, i) => (
          <TableRow
            key={qualifierCode.code}
            label={"Code" + (showIndex ? ` ${i + 1}` : "")}
            value={qualifierCode.code + (qualifierCode.description ? ` (${qualifierCode.description})` : "")}
          />
        ))}
      </Table>
    </div>
  )
}

export default ResultQualifier
