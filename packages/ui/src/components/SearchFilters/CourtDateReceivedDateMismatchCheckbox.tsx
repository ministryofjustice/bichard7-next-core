interface CheckboxProps extends React.ComponentProps<"input"> {
  label: string
}

export const CourtDateReceivedDateMismatchCheckbox = ({ id, value, label }: CheckboxProps) => {
  const checkboxId = id || `checkbox-${value}`

  return (
    <div className="govuk-checkboxes__item govuk-checkboxes--small">
      <input className="govuk-checkboxes__input" id={checkboxId} type="checkbox" />
      <label className="govuk-label govuk-checkboxes__label govuk-!-padding-right-0" htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  )
}

export default CourtDateReceivedDateMismatchCheckbox
