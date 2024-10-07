import { Reason } from "types/CaseListQueryParams"
import { Filter, FilterAction } from "types/CourtCaseFilter"

const handleRemovingFilters = (newState: Filter, action: FilterAction) => {
  switch (action.type) {
    case "caseAge": {
      if (action.value) {
        newState.caseAgeFilter = newState.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.value !== action.value)
      } else {
        newState.caseAgeFilter = []
      }
      break
    }
    case "dateRange": {
      newState.dateFrom.value = undefined
      newState.dateTo.value = undefined
      break
    }
    case "caseState": {
      newState.caseStateFilter.value = undefined
      newState.caseStateFilter.label = undefined
      break
    }
    case "lockedState": {
      newState.lockedStateFilter.value = undefined
      newState.lockedStateFilter.label = undefined
      break
    }
    case "reason": {
      newState.reasonFilter.value = Reason.All
      newState.reasonFilter.state = "Selected"
      break
    }
    case "defendantName": {
      newState.defendantNameSearch.value = ""
      newState.defendantNameSearch.label = undefined
      break
    }
    case "courtName": {
      newState.courtNameSearch.value = ""
      newState.courtNameSearch.label = undefined
      break
    }
    case "reasonCodes": {
      newState.reasonCodes = newState.reasonCodes.filter((reasonCode) => reasonCode.value !== action.value)
      break
    }
    case "ptiurn": {
      newState.ptiurnSearch.value = ""
      newState.ptiurnSearch.label = undefined
      break
    }
    case "reasonCodesCheckbox": {
      newState.reasonCodes = newState.reasonCodes.filter((reasonCode) => reasonCode.value !== action.value)
      break
    }
    case "triggerIndeterminate": {
      const values = Array.isArray(action.value) ? action.value : [action.value]
      values.forEach((reason) => {
        newState.reasonCodes = newState.reasonCodes.filter((reasonCode) => reasonCode.value !== reason)
      })
      break
    }
  }
}

export default handleRemovingFilters
