import { useCurrentUser } from "context/CurrentUserContext"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
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
      <FormGroup className={`govuk-form-group reasons`}>
        <ExpandingFilters filterName={"Case state"} classNames="filters-reason">
          <fieldset className="govuk-fieldset">
            <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="resolved"
                  name="state"
                  type="radio"
                  value="Resolved"
                  checked={caseState === "Resolved" && !resolvedByUsername}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      method: event.currentTarget.checked ? "add" : "remove",
                      type: "caseState",
                      value: "Resolved"
                    })
                  }}
                ></input>
                <label className="govuk-label govuk-radios__label" htmlFor="ResolvedCases">
                  {"Resolved cases"}
                </label>
              </div>
            </div>
          </fieldset>
          <fieldset className="govuk-fieldset">
            <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="myResolvedCases"
                  name="resolvedByUsername"
                  type="radio"
                  value={currentUser.username}
                  checked={resolvedByUsername === currentUser.username}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      method: event.currentTarget.checked ? "add" : "remove",
                      type: "caseState",
                      value: "Resolved"
                    })

                    dispatch({
                      method: event.currentTarget.checked ? "add" : "remove",
                      type: "resolvedByUsernameFilter",
                      value: currentUser.username
                    })
                  }}
                ></input>
                <label className="govuk-label govuk-radios__label" htmlFor="myResolvedCases">
                  {"My resolved cases"}
                </label>
              </div>
            </div>
          </fieldset>
        </ExpandingFilters>
      </FormGroup>
    </fieldset>
  )
}

export default CaseStateFilter
