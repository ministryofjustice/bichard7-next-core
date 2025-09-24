import { CourtDateReceivedDateMismatchCheckboxLabel } from "./CourtDateReceivedDateMismatchCheckbox.styles"

interface CheckboxProps extends React.ComponentProps<"input"> {
  label: string
}

export const CourtDateReceivedDateMismatchCheckbox = ({ id, value, label }: CheckboxProps) => {
  const checkboxId = id || `checkbox-${value}`

  return (
    <div className="govuk-checkboxes__item govuk-checkboxes--small">
      <input
        className="govuk-checkboxes__input"
        id={checkboxId}
        type="checkbox"
        // value={value}
      />
      <CourtDateReceivedDateMismatchCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={checkboxId}>
        {label}
      </CourtDateReceivedDateMismatchCheckboxLabel>
    </div>
  )
}

export default CourtDateReceivedDateMismatchCheckbox
