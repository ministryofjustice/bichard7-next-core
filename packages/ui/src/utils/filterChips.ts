import { LockedState, Reason } from "types/CaseListQueryParams"
import { Filter, FilterState } from "types/CourtCaseFilter"

const anyFilterChips = (state: Filter, countOfState?: FilterState): boolean => {
  return (
    [
      state.dateFrom,
      state.dateTo,
      state.caseStateFilter,
      state.defendantNameSearch,
      state.courtNameSearch,
      state.reasonCodes[0],
      state.ptiurnSearch
    ].some(
      (filter): boolean =>
        filter?.value !== undefined &&
        filter.value !== "" &&
        (countOfState === undefined || filter.state === countOfState)
    ) ||
    state.caseAgeFilter.some((filter) => countOfState === undefined || filter.state === countOfState) ||
    (!!state.reasonFilter && state.reasonFilter.value !== Reason.All && state.reasonFilter.state === countOfState) ||
    (!!state.lockedStateFilter &&
      state.lockedStateFilter.value !== LockedState.All &&
      state.lockedStateFilter.state === countOfState)
  )
}

export { anyFilterChips }
