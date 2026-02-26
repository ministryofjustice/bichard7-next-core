import { Card } from "components/Card"
import Checkbox from "components/Checkbox/Checkbox"
import DateInput from "components/CustomDateInput/DateInput"
import { Select } from "components/Select"
import { ReportSelectionFilterWrapper } from "features/ReportSelectionFilter/ReportSelectionFilter.styles"
import { NextPage } from "next"
import { Button } from "../../components/Buttons/Button"

export const ReportSelectionFilter: NextPage = () => {
  return (
    <ReportSelectionFilterWrapper>
      <Card heading={"Search reports"} isContentVisible={true}>
        <fieldset className="govuk-fieldset fields-wrapper">
          <div id={"report-section"} className="reports-section-wrapper">
            <h2 className={"govuk-heading-m"}>{"Reports"}</h2>
            <label className="govuk-body" htmlFor={"report-select"}>
              {"Sort by"}
            </label>
            <Select
              id={"report-select"}
              placeholder={"Resolved cases"}
              name={"select-case-type"}
              className="govuk-input"
            ></Select>
          </div>
          <div id={"date-range-section"} className="date-range-section-wrapper">
            <h2 className={"govuk-heading-m"}>{"Date range"}</h2>
            <div className="calendars-wrapper">
              <div id={"report-selection-date-from"} className="date">
                <DateInput
                  dateType="resolvedFrom"
                  dispatch={function (): void {
                    throw new Error("Function not implemented.")
                  }}
                  value={""}
                  dateRange={undefined}
                />
              </div>
              <div id={"report-selection-date-to"} className="date">
                <DateInput
                  dateType="resolvedTo"
                  dispatch={function (): void {
                    throw new Error("Function not implemented.")
                  }}
                  value={""}
                  dateRange={undefined}
                />
              </div>
            </div>
          </div>
          <div id={"include-section"} className="include-section-wrapper">
            <h2 className={"govuk-heading-m"}>{"Include"}</h2>
            <label className="govuk-body" htmlFor={"checkboxes-container"}>
              {"Select an option"}
            </label>
            <div id={"checkboxes-container"} className="checkboxes-wrapper">
              <Checkbox label={"Triggers"} checked={false} id={"triggers"}></Checkbox>
              <Checkbox label={"Exceptions"} checked={false} id={"exceptions"}></Checkbox>
            </div>
          </div>
        </fieldset>
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
        <div className="bottom-actions-bar">
          <Button id={"search"} className="search-button">
            {"Search Reports"}
          </Button>
          <a className="govuk-link govuk-link--no-visited-state" href="/bichard?keywords=">
            {"Clear search"}
          </a>
        </div>
      </Card>
    </ReportSelectionFilterWrapper>
  )
}
