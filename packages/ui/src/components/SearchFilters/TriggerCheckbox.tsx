import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import getTriggerWithDescription from "@moj-bichard7/common/utils/getTriggerWithDescription"
import { ChangeEvent, Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"
import { TriggerCheckboxLabel } from "./TriggerCheckbox.styles"

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
      <TriggerCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={triggerCode.toLowerCase()}>
        {getTriggerWithDescription(triggerCode, true)}
      </TriggerCheckboxLabel>
    </div>
  )
}

export default TriggerCheckbox
