import { useCourtCase } from "context/CourtCaseContext"
import { QualityStatusDisplay } from "./QualityStatusDisplay"
import { QualityStatusForm } from "./QualityStatusForm"

export const QualityStatusCard = () => {
  const { courtCase } = useCourtCase()

  const auditQualitySet: boolean = [courtCase.errorQualityChecked, courtCase.triggerQualityChecked].some(
    (value) => value !== null && value !== 1
  )

  const hasExceptions = courtCase.aho.Exceptions.length > 0
  const hasTriggers = courtCase.triggerCount > 0

  return auditQualitySet ? (
    <QualityStatusDisplay hasExceptions={hasExceptions} hasTriggers={hasTriggers} />
  ) : (
    <QualityStatusForm hasExceptions={hasExceptions} hasTriggers={hasTriggers} />
  )
}
