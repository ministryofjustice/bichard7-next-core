interface Props {
  label?: string
  labelSize?: "s" | "m" | "l"
  name: string
  hint?: string
  className?: string
  error?: string | boolean
  width?: "5" | "10" | "20" | "30"
  id?: string
  readOnly?: boolean
  disabled?: boolean
  mandatory?: boolean
  value?: string
  optionalProps?: object
}

const PasswordInput = ({
  label,
  labelSize,
  hint,
  error,
  className,
  name,
  width,
  id,
  readOnly = false,
  disabled = false,
  value,
  mandatory = false,
  optionalProps = {}
}: Props) => {
  const hintElementId = `${name}-hint`
  const errorElementId = `${name}-error`
  const inputId = id || name

  const hasError = error && !readOnly

  const formGroupClasses = [
    "govuk-form-group",
    "govuk-password-input",
    className,
    hasError ? "govuk-form-group--error" : null
  ]
    .filter(Boolean)
    .join(" ")

  const widthClass = width ? `govuk-input--width-${width}` : null

  const inputClasses = [
    "govuk-input",
    "govuk-password-input__input",
    "govuk-js-password-input-input",
    widthClass,
    hasError ? "govuk-input--error" : null
  ]
    .filter(Boolean)
    .join(" ")

  const labelClassName = labelSize ? `govuk-label--${labelSize}` : null

  const labelClasses = ["govuk-label", labelClassName].filter(Boolean).join(" ")

  const ariaDescribedBy = [hint ? hintElementId : null, hasError ? errorElementId : null].filter(Boolean).join(" ")
  return (
    <div className={formGroupClasses} data-module="govuk-password-input">
      {label && (
        <label className={labelClasses} htmlFor={name}>
          {label}
          {mandatory && " *"}
        </label>
      )}

      {hint && (
        <div id={hintElementId} className="govuk-hint">
          {hint}
        </div>
      )}
      {!!hasError && typeof error === "string" && (
        <span data-test={`password-input_${name}-error`} id={errorElementId} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {error}
        </span>
      )}

      <div className="govuk-input__wrapper govuk-password-input__wrapper">
        <input
          className={inputClasses}
          id={inputId}
          name={name}
          data-test={`password-input_${name}`}
          type="password"
          defaultValue={value}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete="current-password"
          autoCapitalize="none"
          spellCheck="false"
          aria-describedby={ariaDescribedBy}
          {...optionalProps}
        />

        <button
          className="govuk-button govuk-button--secondary govuk-password-input__toggle govuk-js-password-input-toggle"
          type="button"
          data-module="govuk-button"
          aria-controls={inputId}
          aria-label="Show password"
        >
          {"Show"}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
