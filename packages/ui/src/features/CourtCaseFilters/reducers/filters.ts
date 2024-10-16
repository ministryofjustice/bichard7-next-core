import type { Filter, FilterAction } from "types/CourtCaseFilter"
import handleAddingFilters from "./handleAddingFilters"
import handleRemovingFilters from "./handleRemovingFilters"

const filters = (state: Filter, action: FilterAction): Filter => {
  const newState = Object.assign({}, state)

  if (action.method === "add") {
    handleAddingFilters(newState, action)
  } else if (action.method === "remove") {
    handleRemovingFilters(newState, action)
  }

  return newState
}

export { filters as filtersReducer }
export default filters
