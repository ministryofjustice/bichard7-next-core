import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

import DateInput from "components/CustomDateInput/DateInput"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import { SerializedDateRange } from "types/CaseListQueryParams"

interface Props {
  dateRange: SerializedDateRange | undefined
  dispatch: Dispatch<FilterAction>
}

const ResolvedDateFilter: React.FC<Props> = ({ dateRange: caseResolvedDateRange, dispatch }: Props) => (
  <FormGroup className={"govuk-form-group"}>
    <ExpandingFilters classNames="filters-case-resolved-date" filterName={"Case resolved date"}>
      <fieldset className="govuk-fieldset">
        <div id="conditional-resolved-date-range">
          <DateInput
            dateRange={caseResolvedDateRange}
            dateType="resolvedFrom"
            dispatch={dispatch}
            value={caseResolvedDateRange?.from ?? ""}
          />
          <DateInput
            dateRange={caseResolvedDateRange}
            dateType="resolvedTo"
            dispatch={dispatch}
            value={caseResolvedDateRange?.to ?? ""}
          />
        </div>
      </fieldset>
    </ExpandingFilters>
  </FormGroup>
)
export default ResolvedDateFilter
