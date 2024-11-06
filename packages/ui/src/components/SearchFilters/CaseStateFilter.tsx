import { useCurrentUser } from "context/CurrentUserContext"
import { ChangeEvent, Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface CaseStateFilterProps {
  dispatch: Dispatch<FilterAction>
  caseState?: string
  resolvedByUsername?: string
}

const CaseStateFilter = ({ dispatch, caseState, resolvedByUsername }: CaseStateFilterProps) => {
  const currentUser = useCurrentUser()
  console.log(resolvedByUsername)
  console.log(currentUser.username)

  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Case state"}</legend>
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        {/* <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="resolved"
            name="state"
            type="checkbox"
            value="Resolved"
            checked={caseState === "Resolved" && !resolvedByUsername}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                method: event.currentTarget.checked ? "add" : "remove",
                type: "caseState",
                value: "Resolved"
              })
            }}
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="resolved">
            {"Resolved cases"}
          </label>
        </div> */}
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="myResolvedCases"
            name="resolvedByUsername"
            type="checkbox"
            value={currentUser.username}
            checked={caseState === "Resolved" && resolvedByUsername === currentUser.username}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.currentTarget.checked

              dispatch({
                method: isChecked ? "add" : "remove",
                type: "caseState",
                value: "Resolved"
              })

              dispatch({
                method: isChecked ? "add" : "remove",
                type: "resolvedByUsernameFilter",
                value: currentUser.username
              })
            }}
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="myResolvedCases">
            {"My resolved cases"}
          </label>
        </div>
      </div>
    </fieldset>
  )
}

export default CaseStateFilter
