import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import ConditionalRender from "../../../../components/ConditionalRender"
import { TableRow } from "./TableRow"

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
      <p />
      <h3 className="govuk-heading-s">{"Bail conditions"}</h3>
      <Table>
        {conditions.map((condition, i) => (
          <TableRow
            key={`bail-condition-${i}`}
            label={condition.label}
            hintText={condition.offenceIndex ? `Offence ${condition.offenceIndex}` : ""}
            value={condition.value}
          />
        ))}
        {bailReason && <TableRow label="Bail reason" value={bailReason} />}
      </Table>
    </ConditionalRender>
  )
}
