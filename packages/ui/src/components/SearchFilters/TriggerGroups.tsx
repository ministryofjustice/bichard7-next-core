import ExpandingFilters from "@/features/CourtCaseFilters/ExpandingFilters"
import forceExcludedTriggers from "@moj-bichard7-developers/bichard7-next-data/dist/data/excluded-trigger-config.json"
import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
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
  const excludedTriggersForUser = currentUser.excludedTriggers

  const activeTriggerGroups: Record<string, string[]> = {}
  const excludedTriggerGroupsForUser: Record<string, string[]> = {}

  Object.keys(GroupedTriggerCodes).forEach((key) => {
    activeTriggerGroups[key] = allGroupedTriggers(key, excludedTriggers)

    const allTriggersForGroup = (GroupedTriggerCodes as Record<string, string[]>)[key] || []
    excludedTriggerGroupsForUser[key] = excludedTriggersForUser.filter((trigger) =>
      allTriggersForGroup.includes(trigger)
    )
  })

  return (
    <ScrollableFieldset className="govuk-fieldset trigger-groups-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      <>
        {Object.keys(activeTriggerGroups).map((key) => {
          if (activeTriggerGroups[key].length === 0) {
            return
          }

          return (
            <TriggerGroup
              key={`trigger-group-${key.toLowerCase().replaceAll(" ", "")}`}
              name={key}
              allGroupTriggers={activeTriggerGroups[key] as TriggerCode[]}
              filteredReasonCodes={filteredReasonCodes(activeTriggerGroups[key] as TriggerCode[], reasonCodes)}
              dispatch={dispatch}
            />
          )
        })}

        {excludedTriggersForUser.length > 0 && (
          <ExpandingFilters filterName={"Excluded"} openByDefault={false}>
            {Object.keys(excludedTriggerGroupsForUser).map((key) => {
              if (excludedTriggerGroupsForUser[key].length === 0) {
                return
              }

              return (
                <TriggerGroup
                  key={`trigger-group-excluded-${key.toLowerCase().replaceAll(" ", "")}`}
                  name={key}
                  idPrefix="excluded"
                  allGroupTriggers={excludedTriggerGroupsForUser[key] as TriggerCode[]}
                  filteredReasonCodes={filteredReasonCodes(
                    excludedTriggerGroupsForUser[key] as TriggerCode[],
                    reasonCodes
                  )}
                  dispatch={dispatch}
                />
              )
            })}
          </ExpandingFilters>
        )}
      </>
    </ScrollableFieldset>
  )
}

export default TriggerGroups
