import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import type { Dispatch } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  reason?: Reason
  reasonOptions: Reason[]
  dispatch: Dispatch<FilterAction>
}

const ReasonFilter: React.FC<Props> = ({ reason, reasonOptions, dispatch }: Props) => {
  return (
    <FormGroup className={`govuk-form-group reasons`}>
      <ExpandingFilters filterName={"Reason"} classNames="filters-reason">
        <fieldset className="govuk-fieldset">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            {reasonOptions.map((reasonOption) => (
              <div className={`govuk-radios__item ${reasonOption.toLowerCase()}`} key={reasonOption}>
                <input
                  className="govuk-radios__input"
                  id={`${reasonOption.toLowerCase()}-reason`}
                  name="reason"
                  type="radio"
                  value={reasonOption}
                  checked={reason === reasonOption}
                  onChange={(event) => {
                    const value = event.currentTarget.value as Reason
                    dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "reason", value })
                  }}
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
