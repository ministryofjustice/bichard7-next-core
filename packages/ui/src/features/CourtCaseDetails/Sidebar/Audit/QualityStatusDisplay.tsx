import { ExceptionQuality, exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { TriggerQuality, triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { Card } from "components/Card"
import { useCourtCase } from "context/CourtCaseContext"

const exceptionQualityChecked = (value: ExceptionQuality | null) => exceptionQualityValues[value ?? 1]
const triggerQualityChecked = (value: TriggerQuality | null) => triggerQualityValues[value ?? 1]

export const QualityStatusDisplay = () => {
  const { courtCase } = useCourtCase()

  const exceptionQuality = exceptionQualityChecked(courtCase.errorQualityChecked)
  const triggerQuality = triggerQualityChecked(courtCase.triggerQualityChecked)

  return (
    <Card heading={"Quality status"}>
      <p>
        <b>{"Trigger Quality: "}</b>
        {triggerQuality}
      </p>
      <p>
        <b>{"Exception Quality: "}</b>
        {exceptionQuality}
      </p>
    </Card>
  )
}
