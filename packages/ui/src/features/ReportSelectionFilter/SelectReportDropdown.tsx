import { ReportType } from "aws-sdk/clients/codebuild"
import { FormGroup } from "components/FormGroup"
import { Select } from "components/Select"
import { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useState } from "react"
import { REPORT_TYPE_MAP } from "types/reports/ReportType"

const FIELD_REQUIRED_ERROR = "This field is required"

interface SelectReportDropdownProps {
  handleChange: (event: SyntheticEvent<HTMLSelectElement>) => void
  reportType: ReportType | undefined
}
export interface SelectReportDropdownRef {
  validate: () => boolean
}

export const SelectReportDropdown = forwardRef<SelectReportDropdownRef, SelectReportDropdownProps>(
  ({ handleChange, reportType }, ref) => {
    const [showSelectError, setShowSelectError] = useState<boolean>(false)

    const validate = () => {
      if (!reportType) {
        setShowSelectError(true)
        return false
      }
      setShowSelectError(false)
      return true
    }

    useEffect(() => {
      if (reportType) {
        setShowSelectError(false)
      }
    }, [reportType])

    useImperativeHandle(ref, () => ({
      validate
    }))

    return (
      <>
        <h2 className={"govuk-heading-m"}>{"Reports"}</h2>
        <FormGroup showError={showSelectError}>
          <label className="govuk-body" htmlFor={"report-select"}>
            {"Select report"}
          </label>
          {showSelectError ? (
            <p className="govuk-error-message">
              <span className="govuk-visually-hidden">{"Error:"}</span> {FIELD_REQUIRED_ERROR}
            </p>
          ) : null}
          <Select
            id={"report-select"}
            placeholder={"Select report..."}
            name={"select-case-type"}
            className="select-report-input"
            onChange={handleChange}
            aria-describedby="report-type-label"
            value={reportType || ""}
            showError={showSelectError}
          >
            <option disabled={true} value={""}>
              {"Select report..."}
            </option>
            {Object.entries(REPORT_TYPE_MAP).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </FormGroup>
      </>
    )
  }
)

SelectReportDropdown.displayName = "SelectReportDropdown"
