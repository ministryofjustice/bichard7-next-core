import { LockedState, Reason } from "types/CaseListQueryParams"
import type { Filter, FilterState } from "types/CourtCaseFilter"

const anyFilterChips = (state: Filter, countOfState?: FilterState): boolean => {
  return (
    state.reasonCodes.some((reasonCode) => countOfState === undefined || reasonCode.state === countOfState) ||
    [
      state.dateFrom,
      state.dateTo,
      state.caseStateFilter,
      state.defendantNameSearch,
      state.courtNameSearch,
      state.ptiurnSearch,
      state.resolvedFrom,
      state.resolvedTo,
      state.resolvedByUsernameFilter
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
      state.lockedStateFilter.state === countOfState) ||
    (state.courtDateReceivedDateMismatchFilter.value &&
      state.courtDateReceivedDateMismatchFilter.state === countOfState)
  )
}

export { anyFilterChips }
