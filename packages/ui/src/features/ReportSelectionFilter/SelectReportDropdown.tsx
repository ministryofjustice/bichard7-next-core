import { ReportType } from "aws-sdk/clients/codebuild"
import { FormGroup } from "components/FormGroup"
import { Select } from "components/Select"
import { SyntheticEvent } from "react"
import { REPORT_TYPE_MAP } from "types/reports/ReportType"

interface SelectReportDropdownProps {
  handleChange: (event: SyntheticEvent<HTMLSelectElement>) => void
  reportType: ReportType | undefined
  error?: string | null
}

export const SelectReportDropdown: React.FC<SelectReportDropdownProps> = ({ handleChange, reportType, error }) => {
  return (
    <>
      <h2 className="govuk-heading-m">{"Reports"}</h2>
      <FormGroup showError={!!error}>
        <label className="govuk-body" htmlFor="report-select">
          {"Select report"}
        </label>

        {error && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span>
            {error}
          </p>
        )}

        <Select
          id="report-select"
          placeholder="Select report..."
          name="select-case-type"
          className="select-report-input"
          onChange={handleChange}
          aria-describedby="report-type-label"
          value={reportType || ""}
          showError={!!error}
        >
          <option disabled value="">
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
