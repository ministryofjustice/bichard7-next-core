/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ConditionalRender from "components/ConditionalRender"
import FilterChip from "components/FilterChip"
import { Link } from "govuk-react"
import { Dispatch } from "react"
import { LockedState, Reason } from "types/CaseListQueryParams"
import { Filter, FilterAction, FilterState } from "types/CourtCaseFilter"
import { formatStringDateAsDisplayedDate } from "utils/date/formattedDate"
import { anyFilterChips } from "utils/filterChips"

import FilterChipContainer from "./FilterChipContainer"
import FilterChipRow from "./FilterChipRow"
import { HeaderRow } from "./FilterChipSection.styles"

interface Props {
  dispatch: Dispatch<FilterAction>
  marginTop: boolean
  placeholderMessage?: string
  sectionState: FilterState
  state: Filter
}

const FilterChipSection: React.FC<Props> = ({
  dispatch,
  marginTop,
  placeholderMessage,
  sectionState,
  state
}: Props) => {
  const dateRangeLabel = `${formatStringDateAsDisplayedDate(state.dateFrom.value)} - ${formatStringDateAsDisplayedDate(
    state.dateTo.value
  )}`

  const resolvedDateRangeLabel = `${formatStringDateAsDisplayedDate(state.resolvedFrom.value)} - ${formatStringDateAsDisplayedDate(
    state.resolvedTo.value
  )}`
  return (
    <div className={`${sectionState.toLowerCase()}-filters`}>
      <ConditionalRender isRendered={anyFilterChips(state, sectionState)}>
        <HeaderRow className={`header-row`}>
          <div>
            <h2
              className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
            >{`${sectionState} filters`}</h2>
          </div>
          <div>
            <Link href="/bichard?keywords=" id="clear-filters">
              {"Clear filters"}
            </Link>
          </div>
        </HeaderRow>

        <FilterChipRow
          chipLabel={state.defendantNameSearch.label!}
          condition={
            state.defendantNameSearch.value !== undefined &&
            state.defendantNameSearch.label !== undefined &&
            state.defendantNameSearch.state === sectionState
          }
          dispatch={dispatch}
          label="Defendant name"
          state={state.defendantNameSearch.state ?? sectionState}
          type="defendantName"
          value={state.defendantNameSearch.value!}
        />

        <FilterChipRow
          chipLabel={state.ptiurnSearch.label!}
          condition={
            state.ptiurnSearch.value !== undefined &&
            state.ptiurnSearch.label !== undefined &&
            state.ptiurnSearch.state === sectionState
          }
          dispatch={dispatch}
          label="PTIURN"
          state={state.ptiurnSearch.state ?? sectionState}
          type="ptiurn"
          value={state.ptiurnSearch.value!}
        />

        <FilterChipRow
          chipLabel={state.courtNameSearch.label!}
          condition={
            state.courtNameSearch.value !== undefined &&
            state.courtNameSearch.label !== undefined &&
            state.courtNameSearch.state === sectionState
          }
          dispatch={dispatch}
          label="Court name"
          state={state.courtNameSearch.state ?? sectionState}
          type="courtName"
          value={state.courtNameSearch.value!}
        />

        <FilterChipContainer
          condition={
            state.reasonCodes.length > 0 && state.reasonCodes.some((reasonCode) => reasonCode.state === sectionState)
          }
          label="Reason codes"
        >
          {state.reasonCodes.map((reasonCode) => (
            <ConditionalRender isRendered={reasonCode.state === sectionState} key={`filter-chip${reasonCode.value}`}>
              <FilterChip
                chipLabel={reasonCode.label!}
                dispatch={dispatch}
                removeAction={() => {
                  return { method: "remove", type: "reasonCodes", value: reasonCode.value } as FilterAction
                }}
                state={reasonCode.state ?? sectionState}
              />
            </ConditionalRender>
          ))}
        </FilterChipContainer>

        <ConditionalRender
          isRendered={
            !!state.reasonFilter &&
            state.reasonFilter?.value !== Reason.All &&
            state.reasonFilter?.state === sectionState
          }
        >
          <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Reason"}</h3>
          <ul className="moj-filter-tags govuk-!-margin-bottom-0">
            <FilterChip
              chipLabel={state.reasonFilter.value ?? ""}
              dispatch={dispatch}
              key={state.reasonFilter.value}
              removeAction={() => {
                return { method: "remove", type: "reason", value: state.reasonFilter.value } as FilterAction
              }}
              state={state.reasonFilter.state ?? "Applied"}
            />
          </ul>
        </ConditionalRender>

        <FilterChipRow
          chipLabel={dateRangeLabel}
          condition={
            state.dateFrom.value !== undefined &&
            state.dateTo.value !== undefined &&
            state.dateFrom.state === sectionState &&
            state.dateTo.state === sectionState
          }
          dispatch={dispatch}
          label="Date range"
          state={state.dateFrom.state ?? sectionState}
          type="dateRange"
          value={dateRangeLabel}
        />

        <ConditionalRender
          isRendered={state.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.state === sectionState).length > 0}
        >
          <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Case age (SLA)"}</h3>
          <ul className="moj-filter-tags govuk-!-margin-bottom-0">
            {state.caseAgeFilter
              .filter((caseAgeFilter) => caseAgeFilter.state === sectionState)
              .map((caseAgeFilter) => (
                <FilterChip
                  chipLabel={caseAgeFilter.value}
                  dispatch={dispatch}
                  key={caseAgeFilter.value}
                  removeAction={() => {
                    return { method: "remove", type: "caseAge", value: caseAgeFilter.value }
                  }}
                  state={caseAgeFilter.state}
                />
              ))}
          </ul>
        </ConditionalRender>

        <FilterChipRow
          chipLabel={resolvedDateRangeLabel}
          condition={
            state.resolvedFrom.value !== undefined &&
            state.resolvedTo.value !== undefined &&
            state.resolvedFrom.state === sectionState &&
            state.resolvedTo.state === sectionState
          }
          dispatch={dispatch}
          label="Case resolved date range"
          state={state.resolvedFrom.state ?? sectionState}
          type="caseResolvedDateRange"
          value={resolvedDateRangeLabel}
        />

        <FilterChipContainer
          condition={!!state.resolvedByUsernameFilter.value || !!state.caseStateFilter.value}
          label="Case state"
        >
          <ConditionalRender isRendered={!!state.caseStateFilter.value}>
            <FilterChip
              chipLabel={"Resolved cases"}
              dispatch={dispatch}
              removeAction={() => {
                return { method: "remove", type: "caseState", value: state.caseStateFilter.value! } as FilterAction
              }}
              state={state.caseStateFilter.state || sectionState}
            />
          </ConditionalRender>
          <ConditionalRender isRendered={!!state.resolvedByUsernameFilter.value}>
            <FilterChip
              chipLabel={"My resolved cases"}
              dispatch={dispatch}
              removeAction={() => {
                return {
                  method: "remove",
                  type: "resolvedByUsernameFilter",
                  value: state.resolvedByUsernameFilter.value!
                } as FilterAction
              }}
              state={state.resolvedByUsernameFilter.state || sectionState}
            />
          </ConditionalRender>
        </FilterChipContainer>

        <FilterChipRow
          chipLabel={state.lockedStateFilter.label!}
          condition={
            state.lockedStateFilter.value !== undefined &&
            state.lockedStateFilter.label !== undefined &&
            state.lockedStateFilter.state === sectionState &&
            state.lockedStateFilter?.value !== LockedState.All
          }
          dispatch={dispatch}
          label="Locked state"
          state={state.lockedStateFilter.state ?? sectionState}
          type="lockedState"
          value={state.lockedStateFilter.value!}
        />
      </ConditionalRender>

      <ConditionalRender isRendered={!anyFilterChips(state, sectionState) && placeholderMessage !== undefined}>
        <h2
          className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
        >{`${sectionState} filters`}</h2>
        <p>{placeholderMessage}</p>
      </ConditionalRender>
    </div>
  )
}

export default FilterChipSection
