import { exceptionQualityValues, type ExceptionQuality } from "@moj-bichard7/common/types/ExceptionQuality"
import { Select } from "components/Select"

export type ExceptionQualityDropdownProps = {
  value: ExceptionQuality | null
}

const exceptionQualityDropdownValues = Object.entries(exceptionQualityValues)

export const ExceptionQualityDropdown = ({ value }: ExceptionQualityDropdownProps) => {
  return (
    <Select placeholder={"Set Exception Quality"} value={value ?? undefined}>
      {exceptionQualityDropdownValues.map(([value, displayAs]) => (
        <option key={value} value={value}>
          {displayAs}
        </option>
      ))}
    </Select>
  )
}
