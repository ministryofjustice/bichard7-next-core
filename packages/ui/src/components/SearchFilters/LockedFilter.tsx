import RadioButton from "components/RadioButton/RadioButton"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import type { ChangeEvent, Dispatch } from "react"
import { LockedState } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  lockedState?: string
  dispatch: Dispatch<FilterAction>
}

const lockedStateOptions = [LockedState.All, LockedState.Locked, LockedState.Unlocked, LockedState.LockedToMe]

export const lockedStateShortLabels: Record<string, string> = {
  [LockedState.All]: "All",
  [LockedState.Locked]: "Locked",
  [LockedState.Unlocked]: "Unlocked",
  [LockedState.LockedToMe]: "Locked to me"
}

const lockedStateLongLabels = {
  [LockedState.All]: "All cases",
  [LockedState.Locked]: "Locked cases",
  [LockedState.Unlocked]: "Unlocked cases",
  [LockedState.LockedToMe]: "Cases locked to me"
}

const LockedFilter: React.FC<Props> = ({ lockedState, dispatch }: Props) => {
  return (
    <ExpandingFilters filterName={"Locked state"} classNames="filters-locked-state">
      <fieldset className="govuk-fieldset">
        <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
          {lockedStateOptions.map((optionName) => (
            <RadioButton
              name={"lockedState"}
              key={optionName.toLowerCase()}
              id={`locked-state-${optionName.toLowerCase()}`}
              checked={lockedState === optionName}
              value={optionName}
              label={lockedStateLongLabels[optionName]}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch({ method: "add", type: "lockedState", value: event.target.value })
              }}
            />
          ))}
        </div>
      </fieldset>
    </ExpandingFilters>
  )
}

export default LockedFilter
