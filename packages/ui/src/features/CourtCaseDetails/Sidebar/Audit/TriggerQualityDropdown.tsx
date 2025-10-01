import type { ComponentProps } from "react"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { Select } from "components/Select"
import { FormGroup } from "components/FormGroup"

export type TriggerQualityDropdownProps = ComponentProps<typeof Select>

const triggerQualityDropdownValues = Object.entries(triggerQualityValues).filter(([value]) => Number(value) !== 1)

export const TriggerQualityDropdown = (props: TriggerQualityDropdownProps) => {
  return (
    <FormGroup>
      <label className={"govuk-visually-hidden"} htmlFor={"trigger-quality"}>
        {"Set Trigger Quality"}
      </label>
      <Select
        {...props}
        placeholder={"Set Trigger Quality"}
        name={"trigger-quality"}
        aria-invalid={props.showError}
        aria-describedby={props.showError ? "trigger-quality-error" : undefined}
      >
        {triggerQualityDropdownValues.map(([value, displayAs]) => (
          <option key={value} value={value}>
            {displayAs}
          </option>
        ))}
      </Select>
      {props.showError ? (
        <p id="trigger-quality-error" className="govuk-error-message govuk-!-margin-top-1">
          <span className="govuk-visually-hidden">{"Error:"}</span> {"Must be set"}
        </p>
      ) : null}
    </FormGroup>
  )
}
