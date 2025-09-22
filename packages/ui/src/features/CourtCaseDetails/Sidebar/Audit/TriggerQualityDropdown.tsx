import { triggerQualityValues, type TriggerQuality } from "@moj-bichard7/common/types/TriggerQuality"
import { Select } from "components/Select"

export type TriggerQualityDropdownProps = {
  value?: TriggerQuality | null
  onChange?: (value: TriggerQuality | null) => void
}

const triggerQualityDropdownValues = Object.entries(triggerQualityValues).sort((a, b) => a[1] - b[1])

export const TriggerQualityDropdown = ({ value, onChange }: TriggerQualityDropdownProps) => {
  return (
    <Select
      placeholder={"Set Trigger Quality"}
      value={value ?? undefined}
      onChange={(e) => {
        if (onChange) {
          onChange(Number(e.target.value) as unknown as TriggerQuality)
        }
      }}
    >
      {triggerQualityDropdownValues.map(([displayAs, value]) => (
        <option key={value} value={value}>
          {displayAs}
        </option>
      ))}
    </Select>
  )
}
