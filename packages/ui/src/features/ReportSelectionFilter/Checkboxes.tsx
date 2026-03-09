import Checkbox from "components/Checkbox/Checkbox"
import { FormGroup } from "components/FormGroup"
import { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useState } from "react"
import { AT_LEAST_ONE_CHECKBOX_REQUIRED } from "./ValidationMessages"

interface CheckboxesProps {
  handleChange: (event: SyntheticEvent<HTMLInputElement>) => void
  triggers: boolean
  exceptions: boolean
}
export interface CheckboxesRef {
  validate: () => boolean
}

export const Checkboxes = forwardRef<CheckboxesRef, CheckboxesProps>(({ handleChange, triggers, exceptions }, ref) => {
  const [showCheckboxesError, setShowCheckboxesError] = useState<boolean>(false)

  const validate = (): boolean => {
    if (!exceptions && !triggers) {
      setShowCheckboxesError(true)
      return false
    } else {
      setShowCheckboxesError(false)
      return true
    }
  }

  useEffect(() => {
    if (!exceptions && !triggers) {
      setShowCheckboxesError(true)
    } else {
      setShowCheckboxesError(false)
    }
  }, [exceptions, triggers])

  useImperativeHandle(ref, () => ({
    validate
  }))

  return (
    <>
      <h2 className={"govuk-heading-m"}>{"Include"}</h2>
      <FormGroup showError={showCheckboxesError}>
        <label className="govuk-body" htmlFor={"checkboxes-container"}>
          {"Select an option"}
        </label>
        {showCheckboxesError ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span> {AT_LEAST_ONE_CHECKBOX_REQUIRED}
          </p>
        ) : null}
        <div id={"checkboxes-container"} className="checkboxes-wrapper">
          <Checkbox label={"Triggers"} checked={triggers} id={"triggers"} onChange={handleChange} />
          <Checkbox label={"Exceptions"} checked={exceptions} id={"exceptions"} onChange={handleChange} />
        </div>
      </FormGroup>
    </>
  )
})

Checkboxes.displayName = "Checkboxes"
