import { lockedStateShortLabels } from "components/SearchFilters/LockedFilter"
import { uniqBy } from "lodash"
import type { Filter, FilterAction } from "types/CourtCaseFilter"
import { caseStateLabels } from "utils/caseStateFilters"

const handleAddingFilters = (newState: Filter, action: FilterAction) => {
  switch (action.type) {
    case "caseAge": {
      if (newState.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.value === action.value).length < 1) {
        newState.caseAgeFilter.push({ value: action.value as string, state: "Selected" })
      }

      break
    }

    case "dateFrom": {
      newState.dateFrom.value = action.value
      newState.dateFrom.state = "Selected"
      break
    }

    case "dateTo": {
      newState.dateTo.value = action.value
      newState.dateTo.state = "Selected"
      break
    }

    case "caseResolvedFrom": {
      newState.resolvedFrom.value = action.value.toString()
      newState.resolvedFrom.state = "Selected"

      newState.caseStateFilter.value = "Resolved"
      newState.caseStateFilter.state = "Selected"
      break
    }

    case "caseResolvedTo": {
      newState.resolvedTo.value = action.value
      newState.resolvedTo.state = "Selected"
      break
    }

    case "caseState": {
      newState.caseStateFilter.value = action.value
      newState.caseStateFilter.label = caseStateLabels[action.value ?? ""]
      newState.caseStateFilter.state = "Selected"

      newState.resolvedByUsernameFilter.value = undefined
      newState.resolvedByUsernameFilter.label = undefined
      newState.resolvedByUsernameFilter.state = undefined
      break
    }

    case "lockedState": {
      newState.lockedStateFilter.value = action.value
      newState.lockedStateFilter.label = lockedStateShortLabels[action.value]
      newState.lockedStateFilter.state = "Selected"
      break
    }

    case "resolvedByUsername": {
      newState.caseStateFilter.value = "Resolved"
      newState.caseStateFilter.state = "Selected"

      newState.resolvedByUsernameFilter.value = action.value
      newState.resolvedByUsernameFilter.state = "Selected"
      break
    }

    case "reason": {
      newState.reasonFilter.value = action.value
      newState.reasonFilter.state = "Selected"
      break
    }

    case "defendantName": {
      newState.defendantNameSearch.value = action.value
      newState.defendantNameSearch.label = action.value
      newState.defendantNameSearch.state = "Selected"
      break
    }

    case "courtName": {
      newState.courtNameSearch.value = action.value
      newState.courtNameSearch.label = action.value
      newState.courtNameSearch.state = "Selected"
      break
    }

    case "reasonCodes": {
      if (newState.reasonCodes.find((reason) => reason.value === action.value)) {
        break
      }

      const values = Array.isArray(action.value) ? action.value : [action.value]
      newState.reasonCodes = values.map((reason: string) => ({
        value: reason,
        label: reason,
        state: "Selected"
      }))

      break
    }

    case "ptiurn": {
      newState.ptiurnSearch.value = action.value
      newState.ptiurnSearch.label = action.value
      newState.ptiurnSearch.state = "Selected"
      break
    }

    case "reasonCodesCheckbox": {
      if (newState.reasonCodes.find((reason) => reason.value === action.value)) {
        break
      }

      newState.reasonCodes.push({
        value: action.value,
        label: action.value,
        state: "Selected"
      })
      break
    }

    case "triggerIndeterminate": {
      const values = Array.isArray(action.value) ? action.value : [action.value]
      values.forEach((reason: string) => {
        newState.reasonCodes.push({
          value: reason,
          label: reason,
          state: "Selected"
        })
      })

      newState.reasonCodes = uniqBy(newState.reasonCodes, (reasonCode) => reasonCode.value)
      break
    }
  }
}

export default handleAddingFilters
