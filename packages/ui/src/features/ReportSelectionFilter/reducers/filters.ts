import type { FilterAction, FilterState } from "types/ReportSelectionFilter"

export const initialFilterState: FilterState = {
  reportType: undefined,
  dateTo: "",
  dateFrom: "",
  exceptions: true,
  triggers: true
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_REPORT_TYPE":
      return {
        ...state,
        reportType: action.payload,
        exceptions: initialFilterState.exceptions,
        triggers: initialFilterState.triggers
      }
    case "SET_DATE_FROM":
      return { ...state, dateFrom: action.payload }
    case "SET_DATE_TO":
      return { ...state, dateTo: action.payload }
    case "SET_CHECKBOX":
      return { ...state, [action.payload.id]: action.payload.checked }
    case "RESET_FILTERS":
      return initialFilterState
    default:
      return state
  }
}
