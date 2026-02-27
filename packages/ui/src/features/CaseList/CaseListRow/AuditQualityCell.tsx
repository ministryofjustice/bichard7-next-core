import type { ComponentProps } from "react"

import { type ExceptionQuality, exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { type TriggerQuality, triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { TableCell } from "components/Table"

interface Props extends ComponentProps<"td"> {
  errorQualityChecked: ExceptionQuality | null
  triggerQualityChecked: TriggerQuality | null
  hasExceptions: boolean
  hasTriggers: boolean
}

export const AuditQualityCell = ({
  errorQualityChecked,
  triggerQualityChecked,
  hasExceptions,
  hasTriggers,
  ...props
}: Props) => {
  const exceptionQuality = exceptionQualityValues[errorQualityChecked ?? 1]
  const triggerQuality = triggerQualityValues[triggerQualityChecked ?? 1]

  return (
    <TableCell {...props}>
      {hasExceptions && (
        <div>
          <b>{"Exceptions: "}</b>
          {exceptionQuality}
        </div>
      )}

      {hasTriggers && (
        <div>
          <b>{"Triggers: "}</b>
          {triggerQuality}
        </div>
      )}
    </TableCell>
  )
}
