/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ConditionalRender from "components/ConditionalRender"
import FilterChip from "components/FilterChip"
import { Link } from "govuk-react"
import { Dispatch } from "react"
import { LockedState, Reason } from "types/CaseListQueryParams"
import { Filter, FilterAction, FilterState } from "types/CourtCaseFilter"
import { anyFilterChips } from "utils/filterChips"
import { formatStringDateAsDisplayedDate } from "utils/date/formattedDate"
import FilterChipContainer from "./FilterChipContainer"
import FilterChipRow from "./FilterChipRow"
import { HeaderRow } from "./FilterChipSection.styles"

interface Props {
  state: Filter
  dispatch: Dispatch<FilterAction>
  sectionState: FilterState
  marginTop: boolean
  placeholderMessage?: string
}

const FilterChipSection: React.FC<Props> = ({
  state,
  dispatch,
  sectionState,
  marginTop,
  placeholderMessage
}: Props) => {
  const dateRangeLabel = `${formatStringDateAsDisplayedDate(state.dateFrom.value)} - ${formatStringDateAsDisplayedDate(
    state.dateTo.value
  )}`

  return (
    <>
      <ConditionalRender isRendered={anyFilterChips(state, sectionState)}>
        <HeaderRow className={`header-row`}>
          <div>
            <h2
              className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
            >{`${sectionState} filters`}</h2>
          </div>
          <div>
            <Link id="clear-filters" href="/bichard?keywords=">
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
          type="defendantName"
          label="Defendant name"
          state={state.defendantNameSearch.state || sectionState}
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
          type="ptiurn"
          label="PTIURN"
          state={state.ptiurnSearch.state || sectionState}
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
          type="courtName"
          label="Court name"
          state={state.courtNameSearch.state || sectionState}
          value={state.courtNameSearch.value!}
        />

        <FilterChipContainer label="Reason codes" condition={state.reasonCodes.length > 0}>
          {state.reasonCodes.map((reasonCode) => (
            <FilterChip
              key={`filter-chip${reasonCode.value}`}
              chipLabel={reasonCode.label!}
              dispatch={dispatch}
              removeAction={() => {
                return { method: "remove", type: "reasonCodes", value: reasonCode.value } as FilterAction
              }}
              state={reasonCode.state || sectionState}
            />
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
              key={state.reasonFilter.value}
              chipLabel={state.reasonFilter.value ?? ""}
              dispatch={dispatch}
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
          type="dateRange"
          label="Date range"
          state={state.dateFrom.state || sectionState}
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
                  key={caseAgeFilter.value}
                  chipLabel={caseAgeFilter.value}
                  dispatch={dispatch}
                  removeAction={() => {
                    return { method: "remove", type: "caseAge", value: caseAgeFilter.value }
                  }}
                  state={caseAgeFilter.state}
                />
              ))}
          </ul>
        </ConditionalRender>

        <FilterChipRow
          chipLabel={state.caseStateFilter.label!}
          condition={
            state.caseStateFilter.value !== undefined &&
            state.caseStateFilter.label !== undefined &&
            state.caseStateFilter.state === sectionState
          }
          dispatch={dispatch}
          type="caseState"
          label="Case state"
          state={state.caseStateFilter.state || sectionState}
          value={state.caseStateFilter.value!}
        />

        <FilterChipRow
          chipLabel={state.lockedStateFilter.label!}
          condition={
            state.lockedStateFilter.value !== undefined &&
            state.lockedStateFilter.label !== undefined &&
            state.lockedStateFilter.state === sectionState &&
            state.lockedStateFilter?.value !== LockedState.All
          }
          dispatch={dispatch}
          type="lockedState"
          label="Locked state"
          state={state.lockedStateFilter.state || sectionState}
          value={state.lockedStateFilter.value!}
        />
      </ConditionalRender>
      <ConditionalRender isRendered={!anyFilterChips(state, sectionState) && placeholderMessage !== undefined}>
        <h2
          className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
        >{`${sectionState} filters`}</h2>
        <p>{placeholderMessage}</p>
      </ConditionalRender>
    </>
  )
}

export default FilterChipSection
