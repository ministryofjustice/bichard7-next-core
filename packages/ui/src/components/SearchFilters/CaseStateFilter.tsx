import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import ConditionalRender from "components/ConditionalRender"
import RadioButton from "components/RadioButton/RadioButton"
import { useCurrentUser } from "context/CurrentUserContext"
import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface CaseStateFilterProps {
  dispatch: Dispatch<FilterAction>
  caseState?: string
  resolvedByUsername?: string
}

const CaseStateFilter = ({ dispatch, caseState, resolvedByUsername }: CaseStateFilterProps) => {
  const currentUser = useCurrentUser()

  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Case state"}</legend>
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        <RadioButton
          name={"state"}
          id={"resolved"}
          dataAriaControls={"conditional-case-state"}
          defaultChecked={caseState === "Resolved" && !resolvedByUsername}
          label={"All resolved cases"}
          onChange={() => {
            dispatch({
              method: "add",
              type: "caseState",
              value: "Resolved"
            })
          }}
        />
        <ConditionalRender isRendered={currentUser.groups.includes(UserGroup.Supervisor)}>
          <RadioButton
            name={"state"}
            id={"myResolvedCases"}
            dataAriaControls={"conditional-case-state"}
            defaultChecked={caseState === "Resolved" && resolvedByUsername === currentUser.username}
            label={"My resolved cases"}
            onChange={() => {
              dispatch({
                method: "add",
                type: "resolvedByUsernameFilter",
                value: currentUser.username
              })
            }}
          />
        </ConditionalRender>
        <RadioButton
          name={"state"}
          id={"unresolved"}
          dataAriaControls={"conditional-case-state"}
          defaultChecked={caseState === "Unresolved"}
          label={"Unresolved cases"}
          onChange={() => {
            dispatch({
              method: "remove",
              type: "caseState",
              value: "Resolved"
            })
          }}
        />
      </div>
    </fieldset>
  )
}

export default CaseStateFilter
