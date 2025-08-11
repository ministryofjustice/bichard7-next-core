import { mergeClassNames } from "helpers/mergeClassNames"
import { SummaryBoxDetail, SummaryBoxLabel, SummaryBoxValue } from "./CourtCaseDetailsSummaryBoxField.styles"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
  courtName?: boolean
}

const CourtCaseDetailsSummaryBoxField = ({ label, value, courtName = false }: CourtCaseDetailsSummaryBoxFieldProps) => {
  return (
    <SummaryBoxDetail className={mergeClassNames("detail", courtName ? "detail__court-name" : undefined)}>
      <SummaryBoxLabel>
        <b>{label}</b>
      </SummaryBoxLabel>
      <SummaryBoxValue className={"detail__value"}>{value}</SummaryBoxValue>
    </SummaryBoxDetail>
  )
}

export default CourtCaseDetailsSummaryBoxField
