import { useCourtCase } from "context/CourtCaseContext"
import { QualityStatusDisplay } from "./QualityStatusDisplay"
import { QualityStatusForm } from "./QualityStatusForm"

export const QualityStatusCard = () => {
  const { courtCase } = useCourtCase()

  const hasExceptions = courtCase.aho.Exceptions.length > 0
  const hasTriggers = courtCase.triggerCount > 0
  const auditQualitySet =
    (!hasExceptions || (hasExceptions && (courtCase.errorQualityChecked ?? 0) > 1)) &&
    (!hasTriggers || (hasTriggers && (courtCase.triggerQualityChecked ?? 0) > 1))

  return auditQualitySet ? (
    <QualityStatusDisplay hasExceptions={hasExceptions} hasTriggers={hasTriggers} />
  ) : (
    <QualityStatusForm hasExceptions={hasExceptions} hasTriggers={hasTriggers} />
  )
}
