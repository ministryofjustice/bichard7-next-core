import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { Dispatch } from "react"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allTriggersSelected from "utils/triggerGroups/allTriggersSelected"
import selectedTrigger from "utils/triggerGroups/selectedTrigger"
import someTriggersSelected from "utils/triggerGroups/someTriggersSelected"

import TriggerCheckbox from "./TriggerCheckbox"
import { TriggerGroupList } from "./TriggerGroup.styles"

interface TriggerGroupProps {
  allGroupTriggers: TriggerCode[]
  dispatch: Dispatch<FilterAction>
  filteredReasonCodes: ReasonCode[]
  name: string
}

const TriggerGroup = ({ allGroupTriggers, dispatch, filteredReasonCodes, name }: TriggerGroupProps): JSX.Element => {
  const someSelected = someTriggersSelected(allGroupTriggers, filteredReasonCodes)
  const allSelected = allTriggersSelected(allGroupTriggers, filteredReasonCodes)

  return (
    <div id={`${name.toLowerCase()}-group`}>
      <IndeterminateCheckbox
        checkedValue={allSelected}
        dispatch={dispatch}
        id={name.toLowerCase()}
        indeterminate={someSelected}
        labelText={name}
        value={allGroupTriggers.map((trigger) => getShortTriggerCode(trigger) ?? "")}
      />

      <TriggerGroupList hidden={!(allSelected || someSelected)}>
        <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
          {allGroupTriggers.map((triggerCode) => (
            <TriggerCheckbox
              dispatch={dispatch}
              key={triggerCode}
              selectedTrigger={selectedTrigger(triggerCode, filteredReasonCodes)}
              triggerCode={triggerCode}
            />
          ))}
        </div>
      </TriggerGroupList>
    </div>
  )
}

export default TriggerGroup
