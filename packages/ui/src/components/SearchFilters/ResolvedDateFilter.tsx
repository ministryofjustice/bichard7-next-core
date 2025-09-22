import DateInput from "components/CustomDateInput/DateInput"
import { FormGroup } from "components/FormGroup"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import type { Dispatch } from "react"
import { SerializedDateRange } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dispatch: Dispatch<FilterAction>
  dateRange: SerializedDateRange | undefined
}

const ResolvedDateFilter: React.FC<Props> = ({ dispatch, dateRange: caseResolvedDateRange }: Props) => (
  <FormGroup>
    <ExpandingFilters filterName={"Case resolved date"} classNames="filters-case-resolved-date">
      <fieldset className="govuk-fieldset">
        <div id="conditional-resolved-date-range">
          <DateInput
            dateType="resolvedFrom"
            dispatch={dispatch}
            value={caseResolvedDateRange?.from ?? ""}
            dateRange={caseResolvedDateRange}
          />
          <DateInput
            dateType="resolvedTo"
            dispatch={dispatch}
            value={caseResolvedDateRange?.to ?? ""}
            dateRange={caseResolvedDateRange}
          />
        </div>
      </fieldset>
    </ExpandingFilters>
  </FormGroup>
)
export default ResolvedDateFilter
