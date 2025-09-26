import type { ComponentProps } from "react"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { Select } from "components/Select"
import { FormGroup } from "components/FormGroup"

export type ExceptionQualityDropdownProps = ComponentProps<typeof Select>

const exceptionQualityDropdownValues = Object.entries(exceptionQualityValues).filter(([value]) => Number(value) !== 1)

export const ExceptionQualityDropdown = (props: ExceptionQualityDropdownProps) => {
  return (
    <FormGroup>
      <label className={"govuk-visually-hidden"} htmlFor={"exception-quality"}>
        {"Set Exception Quality"}
      </label>
      <Select
        {...props}
        placeholder={"Set Exception Quality"}
        name={"exception-quality"}
        aria-invalid={props.showError}
        aria-describedby={props.showError ? "exception-quality-error" : undefined}
      >
        {exceptionQualityDropdownValues.map(([value, displayAs]) => (
          <option key={value} value={value}>
            {displayAs}
          </option>
        ))}
      </Select>
      {props.showError ? (
        <p id="exception-quality-error" className="govuk-error-message govuk-!-margin-top-1">
          <span className="govuk-visually-hidden">{"Error:"}</span> {"Must be set"}
        </p>
      ) : null}
    </FormGroup>
  )
}
