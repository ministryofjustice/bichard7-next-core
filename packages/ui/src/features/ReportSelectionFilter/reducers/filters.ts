import { validateResolvedBy } from "@/utils/reports/validateResolvedBy"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { FilterAction, FilterState } from "types/reports/ReportSelectionFilter"
import { validateCheckboxes } from "utils/reports/validateCheckboxes"
import { DATE_CANNOT_BE_AFTER_DATE_TO, DATE_CANNOT_BE_BEFORE_DATE_FROM } from "utils/reports/validationMessages"

export const initialFilterState: FilterState = {
  reportType: undefined,
  isAutomatedReport: undefined,
  dateTo: "",
  dateFrom: "",
  exceptions: true,
  triggers: true,
  checkboxesError: null,
  dateFromError: null,
  dateToError: null,
  reportTypeError: null,
  resolvedBy: [],
  resolvedByError: null,
  canUseTriggerAndExceptionQualityAuditing: false
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  const clearErrors = () => {
    return {
      reportTypeError: null,
      dateFromError: null,
      dateToError: null,
      checkboxesError: null
    }
  }

  switch (action.type) {
    case "SET_REPORT_TYPE":
      return {
        ...state,
        reportType: action.payload,
        exceptions: initialFilterState.exceptions,
        triggers: initialFilterState.triggers,
        isAutomatedReport: false,
        ...clearErrors()
      }
    case "SET_AUTOMATED_REPORT_TYPE":
      return {
        ...state,
        reportType: action.payload,
        isAutomatedReport: true,
        ...clearErrors()
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
      const id = action.payload.id
      const checked = action.payload.checked
      const checkboxError = validateCheckboxes(
        state.reportType as ReportType,
        id === "triggers" ? checked : state.triggers,
        id === "exceptions" ? checked : state.exceptions
      )

      return { ...state, [action.payload.id]: action.payload.checked, checkboxesError: checkboxError }
    case "SET_RESOLVED_BY":
      const resolvedByError = validateResolvedBy(
        state.reportType as ReportType,
        action.payload,
        state.canUseTriggerAndExceptionQualityAuditing
      )

      return { ...state, resolvedBy: action.payload, resolvedByError: resolvedByError }
    case "RESET_FILTERS":
      return initialFilterState
    case "SET_ERRORS":
      return {
        ...state,
        reportTypeError: action.payload.reportTypeError,
        dateFromError: action.payload.dateFromError,
        dateToError: action.payload.dateToError,
        checkboxesError: action.payload.checkboxesError,
        resolvedByError: action.payload.resolvedByError
      }
    default:
      return state
  }
}
