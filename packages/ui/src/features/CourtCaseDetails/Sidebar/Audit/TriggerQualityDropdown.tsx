import type { ComponentProps } from "react"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import { Select } from "components/Select"
import { FormGroup } from "components/FormGroup"

export type TriggerQualityDropdownProps = ComponentProps<typeof Select>

const triggerQualityDropdownValues = Object.entries(triggerQualityValues).sort((a, b) => a[1] - b[1])

export const TriggerQualityDropdown = (props: TriggerQualityDropdownProps) => {
  return (
    <FormGroup>
      <label className={"govuk-visually-hidden"} htmlFor={"trigger-quality"}>
        {"Set Trigger Quality"}
      </label>
      <Select {...props} placeholder={"Set Trigger Quality"} name={"trigger-quality"}>
        {triggerQualityDropdownValues.map(([displayAs, value]) => (
          <option key={value} value={value}>
            {displayAs}
          </option>
        ))}
      </Select>
    </FormGroup>
  )
}
