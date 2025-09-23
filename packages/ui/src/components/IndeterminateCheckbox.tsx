import { useEffect, useRef } from "react"
import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import { IndeterminateCheckboxWrapper } from "./IndeterminateCheckbox.styles"
import { Label } from "./Label"

interface IndeterminateCheckboxProps {
  id: string
  checkedValue: boolean
  labelText: string
  indeterminate: boolean
  value: string | string[]
  dispatch: Dispatch<FilterAction>
}

const IndeterminateCheckbox = ({
  id,
  checkedValue,
  labelText,
  indeterminate,
  value,
  dispatch
}: IndeterminateCheckboxProps): React.ReactNode => {
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef?.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [checkboxRef, indeterminate])

  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <div className="govuk-checkboxes__item">
        <IndeterminateCheckboxWrapper>
          <input
            ref={checkboxRef}
            className="govuk-checkboxes__input"
            id={id}
            type="checkbox"
            value={id}
            checked={checkedValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                method: event.currentTarget.checked
                  ? "add"
                  : event.currentTarget.indeterminate
                    ? "indeterminate"
                    : "remove",
                type: "triggerIndeterminate",
                value
              })
            }}
          ></input>
          <Label className="govuk-checkboxes__label" htmlFor={id}>
            {labelText}
          </Label>
        </IndeterminateCheckboxWrapper>
      </div>
    </div>
  )
}

export default IndeterminateCheckbox
