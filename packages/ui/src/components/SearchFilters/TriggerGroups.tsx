import forceExcludedTriggers from "@moj-bichard7-developers/bichard7-next-data/dist/data/excluded-trigger-config.json"
import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { useCurrentUser } from "context/CurrentUserContext"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { isEmpty } from "lodash"
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
  const excludedTriggerGroups: Record<string, string[]> = {}

  Object.keys(GroupedTriggerCodes).forEach((key) => {
    excludedTriggerGroups[key] = allGroupedTriggers(key, excludedTriggers)
  })

  return (
    <ScrollableFieldset className="govuk-fieldset trigger-groups-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      {isEmpty(Object.values(excludedTriggerGroups).flatMap((v) => v)) ? (
        <div className="govuk-body">{"No trigger groups"}</div>
      ) : (
        Object.keys(excludedTriggerGroups).map((key) => {
          if (excludedTriggerGroups[key].length === 0) {
            return
          }

          return (
            <TriggerGroup
              key={`trigger-group-${key.toLowerCase().replaceAll(" ", "")}`}
              name={key}
              allGroupTriggers={allGroupedTriggers(key, excludedTriggers)}
              filteredReasonCodes={filteredReasonCodes(allGroupedTriggers(key, excludedTriggers), reasonCodes)}
              dispatch={dispatch}
            />
          )
        })
      )}
    </ScrollableFieldset>
  )
}

export default TriggerGroups
