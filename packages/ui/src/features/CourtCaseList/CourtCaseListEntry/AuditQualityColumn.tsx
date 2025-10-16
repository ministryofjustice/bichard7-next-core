import { ExceptionQuality, exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { TriggerQuality, triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { TableCell } from "components/Table"

interface Props {
  errorQualityChecked: ExceptionQuality | null
  triggerQualityChecked: TriggerQuality | null
  hasExceptions: boolean
  hasTriggers: boolean
}

export const AuditQualityColumn = ({
  errorQualityChecked,
  triggerQualityChecked,
  hasExceptions,
  hasTriggers
}: Props) => {
  const exceptionQuality = exceptionQualityValues[errorQualityChecked ?? 1]
  const triggerQuality = triggerQualityValues[triggerQualityChecked ?? 1]

  return (
    <TableCell>
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
