import { useCourtCase } from "context/CourtCaseContext"
import { QualityStatusDisplay } from "./QualityStatusDisplay"
import { QualityStatusForm } from "./QualityStatusForm"

export const QualityStatusCard = () => {
  const { courtCase } = useCourtCase()

  const auditQualitySet: boolean = [courtCase.errorQualityChecked, courtCase.triggerQualityChecked].some(
    (value) => value !== null && value !== 1
  )

  return auditQualitySet ? <QualityStatusDisplay /> : <QualityStatusForm />
}
