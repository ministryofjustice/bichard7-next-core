import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

import RadioButton from "components/RadioButton/RadioButton"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { LockedState } from "types/CaseListQueryParams"

interface Props {
  dispatch: Dispatch<FilterAction>
  lockedState?: string
}

const lockedStateOptions = [LockedState.All, LockedState.Locked, LockedState.Unlocked, LockedState.LockedToMe]

export const lockedStateShortLabels: Record<string, string> = {
  [LockedState.All]: "All",
  [LockedState.Locked]: "Locked",
  [LockedState.LockedToMe]: "Locked to me",
  [LockedState.Unlocked]: "Unlocked"
}

const lockedStateLongLabels = {
  [LockedState.All]: "All cases",
  [LockedState.Locked]: "Locked cases",
  [LockedState.LockedToMe]: "Cases locked to me",
  [LockedState.Unlocked]: "Unlocked cases"
}

const LockedFilter: React.FC<Props> = ({ dispatch, lockedState }: Props) => {
  return (
    <ExpandingFilters classNames="filters-locked-state" filterName={"Locked state"}>
      <fieldset className="govuk-fieldset">
        <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
          {lockedStateOptions.map((optionName) => (
            <RadioButton
              checked={lockedState === optionName}
              id={`locked-state-${optionName.toLowerCase()}`}
              key={optionName.toLowerCase()}
              label={lockedStateLongLabels[optionName]}
              name={"lockedState"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch({ method: "add", type: "lockedState", value: event.target.value })
              }}
              value={optionName}
            />
          ))}
        </div>
      </fieldset>
    </ExpandingFilters>
  )
}

export default LockedFilter
