import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ChangeEvent, Dispatch } from "react"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction } from "types/CourtCaseFilter"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import { TriggerCheckboxLabel } from "./TriggerCheckbox.styles"

interface TriggerCheckboxProps {
  triggerCode: TriggerCode
  selectedTrigger?: boolean
  dispatch: Dispatch<FilterAction>
}

const TriggerCheckbox = ({ triggerCode, selectedTrigger, dispatch }: TriggerCheckboxProps): JSX.Element => {
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
