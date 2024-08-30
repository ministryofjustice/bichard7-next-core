import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { ChangeEvent, Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface CaseStateFilterProps {
  dispatch: Dispatch<FilterAction>
  value?: string
}

const CaseStateFilter = ({ dispatch, value }: CaseStateFilterProps) => (
  <fieldset className="govuk-fieldset">
    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
      <Legend>{"Case state"}</Legend>
    </legend>
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          id="resolved"
          name="state"
          type="checkbox"
          value={value}
          checked={value === "Resolved"}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              method: event.currentTarget.checked ? "add" : "remove",
              type: "caseState",
              value: "Resolved"
            })
          }}
        ></input>
        <label className="govuk-label govuk-checkboxes__label" htmlFor="resolved">
          {"Resolved"}
        </label>
      </div>
    </div>
  </fieldset>
)

export default CaseStateFilter
