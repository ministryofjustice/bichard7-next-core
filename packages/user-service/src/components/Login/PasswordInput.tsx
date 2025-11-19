import { useState } from "react"

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
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const hintElementId = `${name}-hint`
  const errorElementId = `${name}-error`
  const inputId = id || name
  const hasError = error && !readOnly

  const formGroupClasses = ["govuk-form-group", className, hasError ? "govuk-form-group--error" : null]
    .filter(Boolean)
    .join(" ")

  const widthClass = width ? `govuk-input--width-${width}` : null

  const inputClasses = [
    "govuk-input",
    "govuk-password-input__input",
    widthClass,
    hasError ? "govuk-input--error" : null
  ]
    .filter(Boolean)
    .join(" ")

  const labelClassName = labelSize ? `govuk-label--${labelSize}` : null

  const labelClasses = ["govuk-label", labelClassName].filter(Boolean).join(" ")

  const ariaDescribedBy = [hint ? hintElementId : null, hasError ? errorElementId : null].filter(Boolean).join(" ")
  return (
    <div className={formGroupClasses}>
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
          data-testid={`password-input_${name}`}
          type={showPassword ? "text" : "password"}
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
          className="govuk-button govuk-button--secondary govuk-password-input__toggle"
          type="button"
          onClick={togglePassword}
          aria-controls={inputId}
          aria-label={showPassword ? "Hide password" : "Show password"}
          data-testid={`password-input-button_${name}`}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
