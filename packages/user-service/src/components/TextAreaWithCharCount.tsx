interface Props {
  value?: string
  id: string
  name: string
  label: string
  charLimit: number
  hint?: string
  isEmpty?: boolean
  emptyErrorMessage: string
  isOverCharLimit?: boolean
  charLimitErrorMessage: string
}

export const TextAreaWithCharCount = ({
  value = "",
  id,
  name,
  label,
  hint = "",
  charLimit,
  isEmpty = false,
  isOverCharLimit = false,
  charLimitErrorMessage,
  emptyErrorMessage
}: Props) => {
  const hasError = isEmpty || isOverCharLimit
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
      {isEmpty && (
        <p id="feedback-error" className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {emptyErrorMessage}
        </p>
      )}
      {isOverCharLimit && (
        <p id={`${id}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {charLimitErrorMessage}
        </p>
      )}

      <textarea
        className={`govuk-textarea ${hasError ? "govuk-textarea--error" : ""} govuk-js-character-count`}
        id={id}
        name={name}
        rows={5}
        aria-describedby={`${id}-info ${hasError ? `${id}-error` : ""}`}
      >
        {value}
      </textarea>
      <div id={`${id}-info`} className="govuk-hint govuk-character-count__message">
        {`You can enter up to ${charLimit} characters`}
      </div>
    </div>
  )
}
