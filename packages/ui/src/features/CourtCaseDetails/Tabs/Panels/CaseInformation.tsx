import { Case } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { Card } from "components/Card"
import formatForce from "utils/formatForce"
import { InfoRow } from "./InfoRow"

interface caseInformationProps {
  caseInformation: Case
}

type Row = {
  label: string
  value: string | null
}

export const CaseInformation = ({ caseInformation }: caseInformationProps) => {
  const rows: Row[] = [
    {
      label: "PTIURN",
      value: caseInformation.PTIURN
    }
  ]

  if (caseInformation.ForceOwner !== undefined) {
    rows.push({
      label: "Force owner",
      value: formatForce(caseInformation.ForceOwner)
    })
  }

  if (caseInformation.CourtCaseReferenceNumber !== undefined) {
    rows.push({
      label: "Court case reference",
      value: caseInformation.CourtCaseReferenceNumber
    })
  }

  if (caseInformation.CourtReference.CrownCourtReference !== undefined) {
    rows.push(
      { label: "Crown court reference", value: caseInformation.CourtReference.CrownCourtReference },
      { label: "Magistrates court reference", value: caseInformation.CourtReference.MagistratesCourtReference }
    )
  } else {
    rows.push({
      label: "Court reference",
      value: caseInformation.CourtReference.MagistratesCourtReference
    })
  }

  if (caseInformation.RecordableOnPNCindicator !== undefined) {
    rows.push({
      label: "Notifiable to PNC",
      value: caseInformation.RecordableOnPNCindicator ? "Yes" : "No"
    })
  }

  rows.push({
    label: "Pre decision ind",
    value: caseInformation.PreChargeDecisionIndicator ? "Yes" : "No"
  })

  return (
    <Card heading={"Case"}>
      {rows.map((row, idx) => (
        <InfoRow label={row.label} value={row.value} key={idx} />
      ))}
    </Card>
  )
}
