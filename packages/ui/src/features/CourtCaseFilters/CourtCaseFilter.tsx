import type { Filter } from "types/CourtCaseFilter"

import Permission from "@moj-bichard7/common/types/Permission"
import { PrimaryButton } from "components/Buttons"
import ConditionalRender from "components/ConditionalRender"
import CaseStateFilter from "components/SearchFilters/CaseStateFilter"
import LockedFilter, { lockedStateShortLabels } from "components/SearchFilters/LockedFilter"
import ReasonCodeFilter from "components/SearchFilters/ReasonCodeFilter"
import ReasonFilter from "components/SearchFilters/ReasonFilterOptions/ReasonFilter"
import ResolvedDateFilter from "components/SearchFilters/ResolvedDateFilter"
import TextFilter from "components/SearchFilters/TextFilter"
import TriggerGroups from "components/SearchFilters/TriggerGroups"
import { useCurrentUser } from "context/CurrentUserContext"
import { FormGroup } from "govuk-react"
import { useReducer } from "react"
import { CaseListQueryParams, LockedState, SerializedDateRange } from "types/CaseListQueryParams"
import { anyFilterChips } from "utils/filterChips"
import { reasonOptions } from "utils/reasonOptions"

import CourtDateFilter from "../../components/SearchFilters/CourtDateFilter"
import { FilterOptionsContainer, SelectedFiltersContainer } from "./CourtCaseFilter.styles"
import FilterChipSection from "./FilterChipSection"
import { filtersReducer } from "./reducers/filters"

const Divider = () => (
  <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
)

type Props = {
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  caseResolvedDateRange: null | SerializedDateRange
  dateRange: null | SerializedDateRange
} & CaseListQueryParams

const CourtCaseFilter: React.FC<Props> = ({
  caseAge,
  caseAgeCounts,
  caseResolvedDateRange,
  caseState,
  courtName,
  dateRange,
  defendantName,
  lockedState,
  order,
  orderBy,
  ptiurn,
  reason,
  reasonCodes,
  resolvedByUsername
}) => {
  const lockedStateValue = lockedState ?? LockedState.All
  const initialFilterState: Filter = {
    caseAgeFilter: caseAge.map((slaDate) => {
      return { state: "Applied", value: slaDate }
    }),
    caseStateFilter: caseState !== null ? { label: caseState, state: "Applied", value: caseState } : {},
    courtNameSearch: courtName !== null ? { label: courtName, state: "Applied", value: courtName } : {},
    dateFrom: dateRange !== null ? { state: "Applied", value: dateRange.from } : {},
    dateTo: dateRange !== null ? { state: "Applied", value: dateRange.to } : {},
    defendantNameSearch: defendantName !== null ? { label: defendantName, state: "Applied", value: defendantName } : {},
    lockedStateFilter:
      lockedState !== null
        ? { label: lockedStateShortLabels[lockedStateValue], state: "Applied", value: lockedStateValue }
        : {},
    ptiurnSearch: ptiurn !== null ? { label: ptiurn, state: "Applied", value: ptiurn } : {},
    reasonCodes: reasonCodes?.map((reasonCode) => ({ label: reasonCode, state: "Applied", value: reasonCode })) ?? [],
    reasonFilter: reason !== null ? { state: "Applied", value: reason } : {},
    resolvedByUsernameFilter: resolvedByUsername !== null ? { state: "Applied", value: resolvedByUsername } : {},
    resolvedFrom: caseResolvedDateRange !== null ? { state: "Applied", value: caseResolvedDateRange.from } : {},
    resolvedTo: caseResolvedDateRange !== null ? { state: "Applied", value: caseResolvedDateRange.to } : {}
  }
  const [state, dispatch] = useReducer(filtersReducer, initialFilterState)
  const currentUser = useCurrentUser()

  return (
    <form id="filter-panel" method={"get"}>
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
              <FilterChipSection dispatch={dispatch} marginTop={false} sectionState={"Applied"} state={state} />
              <FilterChipSection
                dispatch={dispatch}
                marginTop={anyFilterChips(state, "Applied")}
                placeholderMessage={"No filters selected"}
                sectionState={"Selected"}
                state={state}
              />
            </SelectedFiltersContainer>
          </div>
        </div>
        <FilterOptionsContainer className="moj-filter__options">
          <PrimaryButton className="govuk-button" dataModule="govuk-button" id={"search"}>
            {"Apply filters"}
          </PrimaryButton>

          <input id="order" name="order" type="hidden" value={order || ""} />
          <input id="orderBy" name="orderBy" type="hidden" value={orderBy || ""} />

          <FormGroup className={"govuk-form-group"}>
            <h2 className="govuk-heading-m">{"Search"}</h2>
            <div>
              <ReasonCodeFilter dispatch={dispatch} value={state.reasonCodes} />
              <TextFilter
                dispatch={dispatch}
                id="defendantName"
                label="Defendant name"
                value={state.defendantNameSearch.value}
              />
              <TextFilter dispatch={dispatch} id="courtName" label="Court name" value={state.courtNameSearch.value} />
              <TextFilter dispatch={dispatch} id="ptiurn" label="PTIURN" value={state.ptiurnSearch.value} />
            </div>
          </FormGroup>

          <CaseStateFilter
            caseState={state.caseStateFilter.value}
            dispatch={dispatch}
            resolvedByUsername={state.resolvedByUsernameFilter.value}
          />

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <Divider />
            <TriggerGroups dispatch={dispatch} reasonCodes={state.reasonCodes} />
            <Divider />
            <ReasonFilter dispatch={dispatch} reason={state.reasonFilter.value} reasonOptions={reasonOptions} />
          </ConditionalRender>
          <Divider />

          <CourtDateFilter
            caseAgeCounts={caseAgeCounts}
            caseAges={state.caseAgeFilter.map((slaDate) => slaDate.value as string)}
            dateRange={{ from: state.dateFrom.value, to: state.dateTo.value }}
            dispatch={dispatch}
          />
          <Divider />

          <ResolvedDateFilter
            dateRange={{ from: state.resolvedFrom.value, to: state.resolvedTo.value }}
            dispatch={dispatch}
          />
          <Divider />

          <LockedFilter dispatch={dispatch} lockedState={state.lockedStateFilter.value} />
          <Divider />

          <PrimaryButton className="govuk-button" dataModule="govuk-button" id={"search-bottom"}>
            {"Apply filters"}
          </PrimaryButton>
        </FilterOptionsContainer>
      </div>
    </form>
  )
}

export default CourtCaseFilter
