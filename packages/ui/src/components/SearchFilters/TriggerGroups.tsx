import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { useCurrentUser } from "context/CurrentUserContext"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { Dispatch } from "react"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allGroupedTriggers from "utils/triggerGroups/allGroupedTriggers"
import filteredReasonCodes from "utils/triggerGroups/filteredReasonCodes"

import TriggerGroup from "./TriggerGroup"
import { ScrollableFieldset } from "./TriggerGroups.styles"

interface TriggerGroupProps {
  dispatch: Dispatch<FilterAction>
  reasonCodes: ReasonCode[]
}

const TriggerGroups = ({ dispatch, reasonCodes }: TriggerGroupProps): JSX.Element => {
  const currentUser = useCurrentUser()

  return (
    <ScrollableFieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      {Object.keys(GroupedTriggerCodes).map((key, i) => (
        <TriggerGroup
          allGroupTriggers={allGroupedTriggers(key, currentUser.excludedTriggers)}
          dispatch={dispatch}
          filteredReasonCodes={filteredReasonCodes(allGroupedTriggers(key, currentUser.excludedTriggers), reasonCodes)}
          key={`trigger-group-${i}`}
          name={key}
        />
      ))}
    </ScrollableFieldset>
  )
}

export default TriggerGroups
