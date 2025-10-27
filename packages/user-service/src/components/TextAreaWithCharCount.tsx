interface Props extends React.ComponentProps<"textarea"> {
  label: string
  charLimit: number
  hint?: string
  hasError: boolean
  errorMessage?: string
}

export const TextAreaWithCharCount = ({
  id,
  name,
  value = "",
  label,
  hint = "",
  charLimit,
  hasError,
  errorMessage = "",
  ...rest
}: Props) => {
  return (
    <div
      className={`govuk-form-group ${hasError ? "govuk-form-group--error" : ""} govuk-character-count`}
      data-module="govuk-character-count"
      data-maxlength={charLimit}
    >
      <h3 className="govuk-label-wrapper">
        <label className="govuk-label govuk-!-font-weight-bold govuk-!-padding-top-5" htmlFor={id}>
          {label}
        </label>
      </h3>
      <div className="govuk-hint">{hint}</div>
      {hasError && (
        <p id={`${id}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
        </p>
      )}

      <textarea
        className={`govuk-textarea ${hasError ? "govuk-textarea--error" : ""} govuk-js-character-count`}
        id={id}
        defaultValue={value}
        name={name}
        rows={5}
        aria-describedby={`${id}-info ${hasError ? `${id}-error` : ""}`}
        {...rest}
      ></textarea>
      <div id={`${id}-info`} className="govuk-hint govuk-character-count__message">
        {`You can enter up to ${charLimit} characters`}
      </div>
    </div>
  )
}
