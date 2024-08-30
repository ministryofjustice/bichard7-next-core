import { SummaryBoxDetail, SummaryBoxLabel, SummaryBoxValue } from "./CourtCaseDetailsSummaryBoxField.styles"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
  courtNameClass?: string
}

const CourtCaseDetailsSummaryBoxField = ({
  label,
  value,
  courtNameClass = undefined
}: CourtCaseDetailsSummaryBoxFieldProps) => {
  const classNames = ["detail"]

  if (courtNameClass) {
    if (courtNameClass === "inside") {
      classNames.push("detail__court-name-inside")
    } else if (courtNameClass === "outside") {
      classNames.push("detail__court-name-outside")
    }
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
