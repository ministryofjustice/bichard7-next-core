import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { Label } from "components/Label"
import type { Dispatch } from "react"
import { Reason } from "types/CaseListQueryParams"
import { FormGroup } from "components/FormGroup"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  reason?: Reason
  reasonOptions: Reason[]
  dispatch: Dispatch<FilterAction>
}

const ReasonFilter: React.FC<Props> = ({ reason, reasonOptions, dispatch }: Props) => {
  return (
    <FormGroup className={"reasons"}>
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
                <Label className="govuk-radios__label" htmlFor={`${reasonOption.toLowerCase()}-reason`}>
                  {reasonOption}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      </ExpandingFilters>
    </FormGroup>
  )
}

export default ReasonFilter
