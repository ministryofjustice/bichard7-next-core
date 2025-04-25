import { HintTextNoMargin } from "components/HintText"
import { StyledInfoRow } from "./InfoRow.styles"

interface InfoRowProps {
  label: string
  hintText?: string
  value: string | number | null | undefined | React.ReactNode
  className?: string
}

export const InfoRow = ({ label, value, hintText, className }: InfoRowProps) => {
  const rowClassName = `info-row__${label.replaceAll(/ /g, "-").toLowerCase()}`

  return (
    <StyledInfoRow className={`govuk-summary-list__row ${rowClassName} ${className ?? ""}`}>
      <dt className="govuk-summary-list__key">
        {label}
        {hintText && <HintTextNoMargin className={"hint-text"}>{hintText}</HintTextNoMargin>}
      </dt>
      <dd className="govuk-summary-list__value">{value}</dd>
    </StyledInfoRow>
  )
}
