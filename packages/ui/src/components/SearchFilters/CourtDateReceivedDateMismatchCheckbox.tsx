import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "../../types/CourtCaseFilter"

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "value"> {
  dispatch: Dispatch<FilterAction>
  value: boolean
}

export const CourtDateReceivedDateMismatchCheckbox = ({ id, value, dispatch }: CheckboxProps): React.ReactNode => {
  const checkboxId = id || `checkbox-${value}`

  return (
    <div className="govuk-checkboxes__item govuk-checkboxes--small">
      <input
        className="govuk-checkboxes__input"
        id={checkboxId}
        name="courtDateReceivedDateMismatch"
        type="checkbox"
        checked={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          dispatch({
            method: event.currentTarget.checked ? "add" : "remove",
            type: "courtDateReceivedDateMismatch",
            value: event.currentTarget.checked
          })
        }}
      />
      <label className="govuk-label govuk-checkboxes__label govuk-!-padding-right-0" htmlFor={checkboxId}>
        {"Cases where date received is different"}
      </label>
    </div>
  )
}

export default CourtDateReceivedDateMismatchCheckbox
