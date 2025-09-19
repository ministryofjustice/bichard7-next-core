import { CourtDateReceivedDateMismatchCheckboxLabel } from "./CourtDateReceivedDateMismatchCheckbox.styles"
// import { ChangeEvent, type Dispatch } from "react"
// import type { FilterAction } from "../../types/CourtCaseFilter"

interface CheckboxProps extends React.ComponentProps<"input"> {
  label: string
  selectedIncludeMismatched?: boolean
  // dispatch: Dispatch<FilterAction>
}

export const CourtDateReceivedDateMismatchCheckbox = ({
  id,
  value,
  label,
  selectedIncludeMismatched
  // dispatch
}: CheckboxProps) => {
  const checkboxId = id || `checkbox-${value}`

  return (
    <div className="govuk-checkboxes__item govuk-checkboxes--small">
      <input
        className="govuk-checkboxes__input"
        id={checkboxId}
        type="checkbox"
        value={value}
        checked={selectedIncludeMismatched}
        // onChange={(event: ChangeEvent<HTMLInputElement>) => {
        //   dispatch({
        //     method: event.currentTarget.checked ? "add" : "remove",
        //     type: "courtDateReceivedDateMismatchCheckbox",
        //     value: value
        //   })
        // }}
      />
      <CourtDateReceivedDateMismatchCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={checkboxId}>
        {label}
      </CourtDateReceivedDateMismatchCheckboxLabel>
    </div>
  )
}

export default CourtDateReceivedDateMismatchCheckbox
