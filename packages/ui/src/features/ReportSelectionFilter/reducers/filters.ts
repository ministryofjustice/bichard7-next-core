import type { FilterAction, FilterState } from "types/ReportSelectionFilter"
import { DATE_CANNOT_BE_AFTER_DATE_TO, DATE_CANNOT_BE_BEFORE_DATE_FROM } from "utils/reports/validationMessages"

export const initialFilterState: FilterState = {
  reportType: undefined,
  dateTo: "",
  dateFrom: "",
  exceptions: true,
  triggers: true,
  checkboxesError: null,
  dateFromError: null,
  dateToError: null,
  reportTypeError: null
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_REPORT_TYPE":
      return {
        ...state,
        reportType: action.payload,
        exceptions: initialFilterState.exceptions,
        triggers: initialFilterState.triggers,
        reportTypeError: null
      }
    case "SET_DATE_FROM":
      let dateToError = state.dateToError
      if (dateToError === DATE_CANNOT_BE_BEFORE_DATE_FROM) {
        dateToError = null
      }

      return { ...state, dateFrom: action.payload, dateFromError: null, dateToError: dateToError }
    case "SET_DATE_TO":
      let dateFromError = state.dateFromError
      if (dateFromError === DATE_CANNOT_BE_AFTER_DATE_TO) {
        dateFromError = null
      }

      return { ...state, dateTo: action.payload, dateToError: null, dateFromError: dateFromError }
    case "SET_CHECKBOX":
      return { ...state, [action.payload.id]: action.payload.checked }
    case "RESET_FILTERS":
      return initialFilterState
    case "SET_ERRORS":
      return {
        ...state,
        reportTypeError: action.payload.reportTypeError,
        dateFromError: action.payload.dateFromError,
        dateToError: action.payload.dateToError,
        checkboxesError: action.payload.checkboxesError
      }
    case "SET_CHECKBOXES_ERROR":
      return { ...state, checkboxesError: action.payload }
    default:
      return state
  }
}
