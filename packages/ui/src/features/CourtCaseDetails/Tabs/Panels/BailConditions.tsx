import { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { Card } from "components/Card"
import ConditionalRender from "../../../../components/ConditionalRender"
import { InfoRow } from "./InfoRow"

interface BailConditionsProps {
  bailConditions?: string[]
  bailReason?: string
  offences: Offence[]
}

export const BailConditions = ({ bailConditions, bailReason, offences }: BailConditionsProps) => {
  const conditions = bailConditions
    ? bailConditions.map((bailCondition) => {
        const conditionWithLabel = bailCondition.match(/^\s*([^:]+):\s*(.*)$/)
        return {
          label: conditionWithLabel ? conditionWithLabel[1].trim() : "Other",
          value: bailCondition,
          offenceIndex: offences.find(
            (offence) =>
              offence.CourtOffenceSequenceNumber &&
              offence.Result.some((res) => res.ResultVariableText?.includes(bailCondition))
          )?.CourtOffenceSequenceNumber
        }
      })
    : []

  return (
    <ConditionalRender isRendered={conditions.length > 0}>
      <Card heading={"Bail conditions"} isContentVisible={true}>
        {conditions.map((condition, i) => (
          <InfoRow
            key={`bail-condition-${i}`}
            label={condition.label}
            hintText={condition.offenceIndex ? `Offence ${condition.offenceIndex}` : ""}
            value={condition.value}
          />
        ))}
        {bailReason && <InfoRow label="Bail reason" value={bailReason} />}
      </Card>
    </ConditionalRender>
  )
}
