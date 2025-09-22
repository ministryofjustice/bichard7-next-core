import type { ComponentProps } from "react"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { Select } from "components/Select"

export type ExceptionQualityDropdownProps = ComponentProps<typeof Select>

const exceptionQualityDropdownValues = Object.entries(exceptionQualityValues).sort((a, b) => a[1] - b[1])

export const ExceptionQualityDropdown = (props: ExceptionQualityDropdownProps) => {
  return (
    <Select {...props} placeholder={"Set Exception Quality"} name={"exception-quality"}>
      {exceptionQualityDropdownValues.map(([displayAs, value]) => (
        <option key={value} value={value}>
          {displayAs}
        </option>
      ))}
    </Select>
  )
}
