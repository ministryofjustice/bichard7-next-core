import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { Card } from "components/Card"
import { useCourtCase } from "context/CourtCaseContext"
import { InfoRow } from "features/CourtCaseDetails/Tabs/Panels/InfoRow"

interface Props {
  hasExceptions: boolean
  hasTriggers: boolean
}

export const QualityStatusDisplay = ({ hasTriggers, hasExceptions }: Props) => {
  const { courtCase } = useCourtCase()

  const triggerQuality = triggerQualityValues[courtCase.triggerQualityChecked ?? 1]
  const exceptionQuality = exceptionQualityValues[courtCase.errorQualityChecked ?? 1]

  return (
    <Card heading={"Quality status"}>
      {hasTriggers && <InfoRow label="Trigger Quality: " value={triggerQuality} />}
      {hasExceptions && <InfoRow label="Exception Quality: " value={exceptionQuality} />}
    </Card>
  )
}
