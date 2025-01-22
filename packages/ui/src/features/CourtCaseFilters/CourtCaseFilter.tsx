import Permission from "@moj-bichard7/common/types/Permission"
import { Button } from "components/Buttons"
import ConditionalRender from "components/ConditionalRender"
import CaseStateFilter from "components/SearchFilters/CaseStateFilter"
import LockedFilter, { lockedStateShortLabels } from "components/SearchFilters/LockedFilter"
import ReasonCodeFilter from "components/SearchFilters/ReasonCodeFilter"
import ReasonFilter from "components/SearchFilters/ReasonFilterOptions/ReasonFilter"
import TextFilter from "components/SearchFilters/TextFilter"
import TriggerGroups from "components/SearchFilters/TriggerGroups"
import { useCurrentUser } from "context/CurrentUserContext"
import { useReducer } from "react"
import { CaseListQueryParams, LockedState, SerializedDateRange } from "types/CaseListQueryParams"
import type { Filter } from "types/CourtCaseFilter"

import ResolvedDateFilter from "components/SearchFilters/ResolvedDateFilter"
import { anyFilterChips } from "utils/filterChips"
import { reasonOptions } from "utils/reasonOptions"
import CourtDateFilter from "../../components/SearchFilters/CourtDateFilter"
import { FilterOptionsContainer, SelectedFiltersContainer } from "./CourtCaseFilter.styles"
import FilterChipSection from "./FilterChipSection"
import { filtersReducer } from "./reducers/filters"

const Divider = () => (
  <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
)

type Props = CaseListQueryParams & {
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  dateRange: SerializedDateRange | null
  caseResolvedDateRange: SerializedDateRange | null
}

const CourtCaseFilter: React.FC<Props> = ({
  reason,
  defendantName,
  ptiurn,
  courtName,
  reasonCodes,
  caseAge,
  caseAgeCounts,
  dateRange,
  lockedState,
  caseState,
  order,
  orderBy,
  resolvedByUsername,
  caseResolvedDateRange
}) => {
  const lockedStateValue = lockedState ?? LockedState.All
  const initialFilterState: Filter = {
    caseAgeFilter: caseAge.map((slaDate) => {
      return { value: slaDate, state: "Applied" }
    }),
    dateFrom: dateRange !== null ? { value: dateRange.from, state: "Applied" } : {},
    dateTo: dateRange !== null ? { value: dateRange.to, state: "Applied" } : {},
    lockedStateFilter:
      lockedState !== null
        ? { value: lockedStateValue, state: "Applied", label: lockedStateShortLabels[lockedStateValue] }
        : {},
    caseStateFilter: caseState !== null ? { value: caseState, state: "Applied", label: caseState } : {},
    defendantNameSearch: defendantName !== null ? { value: defendantName, state: "Applied", label: defendantName } : {},
    courtNameSearch: courtName !== null ? { value: courtName, state: "Applied", label: courtName } : {},
    reasonCodes: reasonCodes?.map((reasonCode) => ({ value: reasonCode, state: "Applied", label: reasonCode })) ?? [],
    ptiurnSearch: ptiurn !== null ? { value: ptiurn, state: "Applied", label: ptiurn } : {},
    reasonFilter: reason !== null ? { value: reason, state: "Applied" } : {},
    resolvedByUsernameFilter: resolvedByUsername !== null ? { value: resolvedByUsername, state: "Applied" } : {},
    resolvedFrom: caseResolvedDateRange !== null ? { value: caseResolvedDateRange.from, state: "Applied" } : {},
    resolvedTo: caseResolvedDateRange !== null ? { value: caseResolvedDateRange.to, state: "Applied" } : {}
  }
  const [state, dispatch] = useReducer(filtersReducer, initialFilterState)
  const currentUser = useCurrentUser()

  return (
    <form method={"get"} id="filter-panel">
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Search panel"}</h2>
        </div>
        <div className="moj-filter__header-action"></div>
      </div>
      <div className="moj-filter__content">
        <div className="moj-filter__selected">
          <div className="moj-filter__selected-heading">
            <SelectedFiltersContainer className={`moj-filter__heading-title`}>
              <FilterChipSection state={state} dispatch={dispatch} sectionState={"Applied"} marginTop={false} />
              <FilterChipSection
                state={state}
                dispatch={dispatch}
                sectionState={"Selected"}
                marginTop={anyFilterChips(state, "Applied")}
                placeholderMessage={"No filters selected"}
              />
            </SelectedFiltersContainer>
          </div>
        </div>
        <FilterOptionsContainer className="moj-filter__options">
          <Button id={"search"}>{"Apply filters"}</Button>

          <input type="hidden" id="order" name="order" value={order || ""} />
          <input type="hidden" id="orderBy" name="orderBy" value={orderBy || ""} />

          <div className={"govuk-form-group"}>
            <h2 className="govuk-heading-m">{"Search"}</h2>
            <div>
              <ReasonCodeFilter value={state.reasonCodes} dispatch={dispatch} />
              <TextFilter
                label="Defendant name"
                id="defendantName"
                value={state.defendantNameSearch.value}
                dispatch={dispatch}
              />
              <TextFilter label="Court name" id="courtName" value={state.courtNameSearch.value} dispatch={dispatch} />
              <TextFilter label="PTIURN" id="ptiurn" value={state.ptiurnSearch.value} dispatch={dispatch} />
            </div>
          </div>

          <CaseStateFilter
            dispatch={dispatch}
            caseState={state.caseStateFilter.value}
            resolvedByUsername={state.resolvedByUsernameFilter.value}
          />

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <Divider />
            <TriggerGroups dispatch={dispatch} reasonCodes={state.reasonCodes} />
            <Divider />
            <ReasonFilter reason={state.reasonFilter.value} reasonOptions={reasonOptions} dispatch={dispatch} />
          </ConditionalRender>
          <Divider />

          <CourtDateFilter
            caseAges={state.caseAgeFilter.map((slaDate) => slaDate.value as string)}
            caseAgeCounts={caseAgeCounts}
            dispatch={dispatch}
            dateRange={{ from: state.dateFrom.value, to: state.dateTo.value }}
          />
          <Divider />

          <ResolvedDateFilter
            dispatch={dispatch}
            dateRange={{ from: state.resolvedFrom.value, to: state.resolvedTo.value }}
          />
          <Divider />

          <LockedFilter lockedState={state.lockedStateFilter.value} dispatch={dispatch} />
          <Divider />

          <Button id={"search-bottom"}>{"Apply filters"}</Button>
        </FilterOptionsContainer>
      </div>
    </form>
  )
}

export default CourtCaseFilter
