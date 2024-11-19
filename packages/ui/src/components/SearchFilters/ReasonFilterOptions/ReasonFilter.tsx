import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import { Reason } from "types/CaseListQueryParams"

interface Props {
  dispatch: Dispatch<FilterAction>
  reason?: Reason
  reasonOptions: Reason[]
}

const ReasonFilter: React.FC<Props> = ({ dispatch, reason, reasonOptions }: Props) => {
  return (
    <FormGroup className={`govuk-form-group reasons`}>
      <ExpandingFilters classNames="filters-reason" filterName={"Reason"}>
        <fieldset className="govuk-fieldset">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            {reasonOptions.map((reasonOption) => (
              <div className={`govuk-radios__item ${reasonOption.toLowerCase()}`} key={reasonOption}>
                <input
                  checked={reason === reasonOption}
                  className="govuk-radios__input"
                  id={`${reasonOption.toLowerCase()}-reason`}
                  name="reason"
                  onChange={(event) => {
                    const value = event.currentTarget.value as Reason
                    dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "reason", value })
                  }}
                  type="radio"
                  value={reasonOption}
                ></input>
                <label className="govuk-label govuk-radios__label" htmlFor={`${reasonOption.toLowerCase()}-reason`}>
                  {reasonOption}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </ExpandingFilters>
    </FormGroup>
  )
}

export default ReasonFilter
