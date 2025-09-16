import { mergeClassNames } from "../../helpers/mergeClassNames"
import { Checkbox, CheckboxProps } from "./Checkbox"

export interface CheckboxesProps extends React.ComponentProps<"fieldset"> {
  name: string
  fieldsetLegend: string
  hint?: string
  items: CheckboxProps[]
}

export const Checkboxes = ({ name, fieldsetLegend, hint, items, ...fieldsetProps }: CheckboxesProps) => {
  const fieldsetId = fieldsetProps.id || `govuk-checkboxes-${name}`
  const describedby = hint ? `${fieldsetId}-hint` : undefined

  return (
    <div className="govuk-form-group">
      <fieldset
        className={mergeClassNames("govuk-fieldset", fieldsetProps.className)}
        aria-describedby={describedby}
        data-module="govuk-checkboxes"
        {...fieldsetProps}
      >
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">{fieldsetLegend}</h1>
        </legend>

        {hint && (
          <div id={`${fieldsetId}-hint`} className="govuk-hint">
            {hint}
          </div>
        )}

        <div className="govuk-checkboxes">
          {items.map((item, index) => (
            <Checkbox key={index} name={name} {...item} />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
