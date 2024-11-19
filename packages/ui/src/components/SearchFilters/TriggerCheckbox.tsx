import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ChangeEvent, Dispatch } from "react"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction } from "types/CourtCaseFilter"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"

import { TriggerCheckboxLabel } from "./TriggerCheckbox.styles"

interface TriggerCheckboxProps {
  dispatch: Dispatch<FilterAction>
  selectedTrigger?: boolean
  triggerCode: TriggerCode
}

const TriggerCheckbox = ({ dispatch, selectedTrigger, triggerCode }: TriggerCheckboxProps): JSX.Element => {
  const triggerShortCode = getShortTriggerCode(triggerCode) ?? ""

  return (
    <div className="govuk-checkboxes__item">
      <input
        checked={selectedTrigger}
        className="govuk-checkboxes__input"
        id={triggerCode.toLowerCase()}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          dispatch({
            method: event.currentTarget.checked ? "add" : "remove",
            type: "reasonCodesCheckbox",
            value: triggerShortCode
          })
        }}
        type="checkbox"
        value={triggerCode}
      ></input>
      <TriggerCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={triggerCode.toLowerCase()}>
        {getTriggerWithDescription(triggerCode, true)}
      </TriggerCheckboxLabel>
    </div>
  )
}

export default TriggerCheckbox
