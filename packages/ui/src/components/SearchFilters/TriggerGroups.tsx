import forceExcludedTriggers from "@moj-bichard7-developers/bichard7-next-data/dist/data/excluded-trigger-config.json"
import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { useCurrentUser } from "context/CurrentUserContext"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { Dispatch } from "react"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allExcludedTriggers from "utils/triggerGroups/allExcludedTriggers"
import allGroupedTriggers from "utils/triggerGroups/allGroupedTriggers"
import filteredReasonCodes from "utils/triggerGroups/filteredReasonCodes"
import TriggerGroup from "./TriggerGroup"
import { ScrollableFieldset } from "./TriggerGroups.styles"

interface TriggerGroupProps {
  dispatch: Dispatch<FilterAction>
  reasonCodes: ReasonCode[]
}

const TriggerGroups = ({ dispatch, reasonCodes }: TriggerGroupProps): React.ReactNode => {
  const currentUser = useCurrentUser()
  const excludedTriggers = allExcludedTriggers(currentUser, forceExcludedTriggers)

  return (
    <ScrollableFieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      {Object.keys(GroupedTriggerCodes).map((key) => (
        <TriggerGroup
          key={`trigger-group-${key.toLowerCase().replaceAll(" ", "")}`}
          name={key}
          allGroupTriggers={allGroupedTriggers(key, excludedTriggers)}
          filteredReasonCodes={filteredReasonCodes(allGroupedTriggers(key, excludedTriggers), reasonCodes)}
          dispatch={dispatch}
        />
      ))}
    </ScrollableFieldset>
  )
}

export default TriggerGroups
