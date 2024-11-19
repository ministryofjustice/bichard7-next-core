import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { H3, Table } from "govuk-react"

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
          offenceIndex: offences.find(
            (offence) =>
              offence.CourtOffenceSequenceNumber &&
              offence.Result.some((res) => res.ResultVariableText?.includes(bailCondition))
          )?.CourtOffenceSequenceNumber,
          value: bailCondition
        }
      })
    : []

  return (
    <ConditionalRender isRendered={conditions.length > 0}>
      <p />
      <H3>{"Bail conditions"}</H3>
      <Table>
        {conditions.map((condition, i) => (
          <TableRow
            hintText={condition.offenceIndex ? `Offence ${condition.offenceIndex}` : ""}
            key={`bail-condition-${i}`}
            label={condition.label}
            value={condition.value}
          />
        ))}
        {bailReason && <TableRow label="Bail reason" value={bailReason} />}
      </Table>
    </ConditionalRender>
  )
}
