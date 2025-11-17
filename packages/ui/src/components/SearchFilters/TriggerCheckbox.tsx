import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import getTriggerWithDescription from "@moj-bichard7/common/utils/getTriggerWithDescription"
import type { ChangeEvent, Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"
import { Label } from "components/Label"

interface TriggerCheckboxProps {
  triggerCode: TriggerCode
  selectedTrigger?: boolean
  dispatch: Dispatch<FilterAction>
}

const TriggerCheckbox = ({ triggerCode, selectedTrigger, dispatch }: TriggerCheckboxProps): React.ReactNode => {
  const triggerShortCode = getShortTriggerCode(triggerCode) ?? ""

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={triggerCode.toLowerCase()}
        type="checkbox"
        value={triggerCode}
        checked={selectedTrigger}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          dispatch({
            method: event.currentTarget.checked ? "add" : "remove",
            type: "reasonCodesCheckbox",
            value: triggerShortCode
          })
        }}
      ></input>
      <Label className="govuk-checkboxes__label govuk-!-padding-right-0" htmlFor={triggerCode.toLowerCase()}>
        {getTriggerWithDescription(triggerCode, true)}
      </Label>
    </div>
  )
}

export default TriggerCheckbox
