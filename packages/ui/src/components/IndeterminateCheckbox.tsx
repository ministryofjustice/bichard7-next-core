import { ChangeEvent, Dispatch, useEffect, useRef } from "react"
import { FilterAction } from "types/CourtCaseFilter"

import { IndeterminateCheckboxWrapper } from "./IndeterminateCheckbox.styles"

interface IndeterminateCheckboxProps {
  checkedValue: boolean
  dispatch: Dispatch<FilterAction>
  id: string
  indeterminate: boolean
  labelText: string
  value: string | string[]
}

const IndeterminateCheckbox = ({
  checkedValue,
  dispatch,
  id,
  indeterminate,
  labelText,
  value
}: IndeterminateCheckboxProps): JSX.Element => {
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
            checked={checkedValue}
            className="govuk-checkboxes__input"
            id={id}
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
            ref={checkboxRef}
            type="checkbox"
            value={id}
          ></input>
          <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
            {labelText}
          </label>
        </IndeterminateCheckboxWrapper>
      </div>
    </div>
  )
}

export default IndeterminateCheckbox
