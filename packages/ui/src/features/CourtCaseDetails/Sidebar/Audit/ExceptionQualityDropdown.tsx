import { exceptionQualityValues, type ExceptionQuality } from "@moj-bichard7/common/types/ExceptionQuality"
import { Select } from "components/Select"

export type ExceptionQualityDropdownProps = {
  value?: ExceptionQuality | null
  onChange?: (value: ExceptionQuality | null) => void
}

const exceptionQualityDropdownValues = Object.entries(exceptionQualityValues)

export const ExceptionQualityDropdown = ({ value, onChange }: ExceptionQualityDropdownProps) => {
  return (
    <Select
      placeholder={"Set Exception Quality"}
      value={value ?? undefined}
      onChange={(e) => {
        if (onChange) {
          onChange(Number(e.target.value) as unknown as ExceptionQuality)
        }
      }}
    >
      {exceptionQualityDropdownValues.map(([value, displayAs]) => (
        <option key={value} value={value}>
          {displayAs}
        </option>
      ))}
    </Select>
  )
}
