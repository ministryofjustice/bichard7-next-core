import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { Dispatch } from "react"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allTriggersSelected from "utils/triggerGroups/allTriggersSelected"
import selectedTrigger from "utils/triggerGroups/selectedTrigger"
import someTriggersSelected from "utils/triggerGroups/someTriggersSelected"
import TriggerCheckbox from "./TriggerCheckbox"
import { TriggerGroupList } from "./TriggerGroup.styles"

interface TriggerGroupProps {
  name: string
  idPrefix?: string
  allGroupTriggers: TriggerCode[]
  filteredReasonCodes: ReasonCode[]
  dispatch: Dispatch<FilterAction>
}

const TriggerGroup = ({
  name,
  idPrefix,
  allGroupTriggers,
  filteredReasonCodes,
  dispatch
}: TriggerGroupProps): React.ReactNode => {
  const someSelected = someTriggersSelected(allGroupTriggers, filteredReasonCodes)
  const allSelected = allTriggersSelected(allGroupTriggers, filteredReasonCodes)

  const checkboxId = idPrefix ? `${idPrefix}-${name}` : name

  return (
    <div id={`${name.toLowerCase()}-group`}>
      <IndeterminateCheckbox
        id={checkboxId.toLowerCase()}
        checkedValue={allSelected}
        labelText={name}
        indeterminate={someSelected}
        value={allGroupTriggers.map((trigger) => getShortTriggerCode(trigger) ?? "")}
        dispatch={dispatch}
      />

      <TriggerGroupList hidden={!(allSelected || someSelected)}>
        <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
          {allGroupTriggers.map((triggerCode) => (
            <TriggerCheckbox
              key={triggerCode}
              triggerCode={triggerCode}
              selectedTrigger={selectedTrigger(triggerCode, filteredReasonCodes)}
              dispatch={dispatch}
            />
          ))}
        </div>
      </TriggerGroupList>
    </div>
  )
}

export default TriggerGroup
