import { SummaryBoxDetail, SummaryBoxLabel, SummaryBoxValue } from "./CourtCaseDetailsSummaryBoxField.styles"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
  courtName?: boolean
}

const CourtCaseDetailsSummaryBoxField = ({ label, value, courtName = false }: CourtCaseDetailsSummaryBoxFieldProps) => {
  const classNames = ["detail"]

  if (courtName) {
    classNames.push("detail__court-name")
  }

  return (
    <SummaryBoxDetail className={classNames.join(" ")}>
      <SummaryBoxLabel>
        <b>{label}</b>
      </SummaryBoxLabel>
      <SummaryBoxValue className={"detail__value"}>{value}</SummaryBoxValue>
    </SummaryBoxDetail>
  )
}

export default CourtCaseDetailsSummaryBoxField
