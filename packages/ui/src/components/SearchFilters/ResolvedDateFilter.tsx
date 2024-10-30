import DateInput from "components/CustomDateInput/DateInput"
import RadioButton from "components/RadioButton/RadioButton"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import type { Dispatch } from "react"
import { SerializedDateRange } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dispatch: Dispatch<FilterAction>
  dateRange: SerializedDateRange | undefined
}

const ResolvedDateFilter: React.FC<Props> = ({ dispatch, dateRange: caseResolvedDateRange }: Props) => (
  <FormGroup className={"govuk-form-group"}>
    <ExpandingFilters filterName={"Case resolved date"} classNames="filters-case-resolved-date">
      <fieldset className="govuk-fieldset">
        <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
          <RadioButton
            name={"caseResolvedDate"}
            id={"resolved-date-range"}
            dataAriaControls={"conditional-resolved-date-range"}
            defaultChecked={!!caseResolvedDateRange?.from && !!caseResolvedDateRange.to}
            label={"Date range"}
            onChange={(event) => dispatch({ method: "remove", type: "caseAge", value: event.target.value as string })}
          />
          <div className="govuk-radios__conditional" id="conditional-resolved-date-range">
            <div className="govuk-radios govuk-radios--small">
              <DateInput
                dateType="from"
                dispatch={dispatch}
                value={caseResolvedDateRange?.from ?? ""}
                dateRange={caseResolvedDateRange}
              />
              <DateInput
                dateType="to"
                dispatch={dispatch}
                value={caseResolvedDateRange?.to ?? ""}
                dateRange={caseResolvedDateRange}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </ExpandingFilters>
  </FormGroup>
)
export default ResolvedDateFilter
