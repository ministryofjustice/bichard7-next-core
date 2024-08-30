/* eslint-disable @typescript-eslint/no-non-null-assertion */
import FilterChip from "components/FilterChip"
import ConditionalRender from "components/ConditionalRender"
import { Dispatch } from "react"
import { FilterAction, FilterState, FilterType } from "types/CourtCaseFilter"

interface Props {
  chipLabel: string
  condition: boolean
  dispatch: Dispatch<FilterAction>
  type: FilterType
  label: string
  state: FilterState
  value: string | boolean
}

const FilterChipRow: React.FC<Props> = ({ chipLabel, condition, dispatch, type, label, state, value }: Props) => {
  return (
    <ConditionalRender isRendered={condition}>
      <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{label}</h3>
      <ul className="moj-filter-tags govuk-!-margin-bottom-0">
        <FilterChip
          chipLabel={chipLabel}
          dispatch={dispatch}
          removeAction={() => {
            return { method: "remove", type: type, value: value } as FilterAction
          }}
          state={state}
        />
      </ul>
    </ConditionalRender>
  )
}

export default FilterChipRow
