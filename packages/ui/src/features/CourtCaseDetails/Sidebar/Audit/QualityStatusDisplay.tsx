import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { Card } from "components/Card"
import { useCourtCase } from "context/CourtCaseContext"

interface Props {
  hasExceptions: boolean
  hasTriggers: boolean
}

export const QualityStatusDisplay = ({ hasTriggers, hasExceptions }: Props) => {
  const { courtCase } = useCourtCase()

  const exceptionQuality = exceptionQualityValues[courtCase.errorQualityChecked ?? 1]
  const triggerQuality = triggerQualityValues[courtCase.triggerQualityChecked ?? 1]

  return (
    <Card heading={"Quality status"}>
      {hasTriggers && (
        <p>
          <b>{"Trigger Quality: "}</b>
          {triggerQuality}
        </p>
      )}
      {hasExceptions && (
        <p>
          <b>{"Exception Quality: "}</b>
          {exceptionQuality}
        </p>
      )}
    </Card>
  )
}
