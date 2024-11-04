import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import { ChangeEvent, Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface CaseStateFilterProps {
  dispatch: Dispatch<FilterAction>
  value?: string
}

const CaseStateFilter = ({ dispatch, value }: CaseStateFilterProps) => (
  <fieldset className="govuk-fieldset">
    <FormGroup className={`govuk-form-group reasons`}>
      <ExpandingFilters filterName={"Case state"} classNames="filters-reason">
        <fieldset className="govuk-fieldset">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="resolved"
                name="Resolved cases"
                type="radio"
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
                name="Resolved by username"
                type="radio"
                value={value}
                checked={value === "bichard01"}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    method: event.currentTarget.checked ? "add" : "remove",
                    type: "resolvedByUsernameFilter",
                    value: "bichard01"
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

export default CaseStateFilter
