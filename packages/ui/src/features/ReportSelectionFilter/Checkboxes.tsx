import Checkbox from "components/Checkbox/Checkbox"
import { FormGroup } from "components/FormGroup"
import { SyntheticEvent } from "react"

interface CheckboxesProps {
  handleChange: (event: SyntheticEvent<HTMLInputElement>) => void
  triggers: boolean
  exceptions: boolean
  error?: string | null
}

export const Checkboxes: React.FC<CheckboxesProps> = ({ handleChange, triggers, exceptions, error }) => {
  return (
    <>
      <h2 className="govuk-heading-m">{"Include"}</h2>
      <FormGroup showError={!!error}>
        <label className="govuk-body" htmlFor="checkboxes-container">
          {"Select an option"}
        </label>

        {error && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span>
            {error}
          </p>
        )}

        <div id="checkboxes-container" className="checkboxes-wrapper">
          <Checkbox label="Triggers" checked={triggers} id="triggers" onChange={handleChange} />
          <Checkbox label="Exceptions" checked={exceptions} id="exceptions" onChange={handleChange} />
        </div>
      </FormGroup>
    </>
  )
}
