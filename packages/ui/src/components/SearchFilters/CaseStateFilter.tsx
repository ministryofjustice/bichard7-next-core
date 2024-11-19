import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import ConditionalRender from "components/ConditionalRender"
import { useCurrentUser } from "context/CurrentUserContext"
import { ChangeEvent, Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface CaseStateFilterProps {
  caseState?: string
  dispatch: Dispatch<FilterAction>
  resolvedByUsername?: string
}

const CaseStateFilter = ({ caseState, dispatch, resolvedByUsername }: CaseStateFilterProps) => {
  const currentUser = useCurrentUser()

  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Case state"}</legend>
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input
            checked={caseState === "Resolved"}
            className="govuk-checkboxes__input"
            id="resolved"
            name="state"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                method: event.currentTarget.checked ? "add" : "remove",
                type: "caseState",
                value: "Resolved"
              })
            }}
            type="checkbox"
            value="Resolved"
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="resolved">
            {"Resolved cases"}
          </label>
        </div>
        <ConditionalRender isRendered={currentUser.groups.includes(UserGroup.Supervisor)}>
          <div className="govuk-checkboxes__item">
            <input
              checked={resolvedByUsername === currentUser.username && caseState === "Resolved"}
              className="govuk-checkboxes__input"
              id="myResolvedCases"
              name="resolvedByUsername"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const isChecked = event.currentTarget.checked

                dispatch({
                  method: isChecked ? "add" : "remove",
                  type: "resolvedByUsernameFilter",
                  value: currentUser.username
                })
              }}
              type="checkbox"
              value={currentUser.username}
            />
            <label className="govuk-label govuk-checkboxes__label" htmlFor="myResolvedCases">
              {"My resolved cases"}
            </label>
          </div>
        </ConditionalRender>
      </div>
    </fieldset>
  )
}

export default CaseStateFilter
