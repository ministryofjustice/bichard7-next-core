import { mergeClassNames } from "../../helpers/mergeClassNames"

export interface CheckboxProps extends React.ComponentProps<"input"> {
  label: string
  hint?: string
}

export const Checkbox = ({ id, name, value, label, hint, ...inputProps }: CheckboxProps) => {
  const checkboxId = id || `checkbox-${value}`

  return (
    <div className="govuk-checkboxes__item">
      <input
        className={mergeClassNames("govuk-checkboxes__input", inputProps.className)}
        id={checkboxId}
        name={name}
        type="checkbox"
        value={value}
        data-testid="checkbox-input"
        {...inputProps}
      />
      <label className="govuk-label govuk-checkboxes__label" htmlFor={checkboxId}>
        {label}
      </label>
      {hint && (
        <span id={`${checkboxId}-item-hint`} className="govuk-hint govuk-checkboxes__hint">
          {hint}
        </span>
      )}
    </div>
  )
}
