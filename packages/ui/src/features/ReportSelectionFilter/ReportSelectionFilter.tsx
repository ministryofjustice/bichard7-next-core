import { HeaderWrapper } from "components/Card/Card.styles"
import DateInput from "components/CustomDateInput/DateInput"
import { Select } from "components/Select"
import {
  BottomActionsBox,
  CalendarsWrapper,
  CheckboxesWrapper,
  CheckboxLabel,
  CheckboxUnit,
  ClearSearchLinkBox,
  DateFromWrapper,
  DateRangeSectionWrapper,
  DateToWrapper,
  FieldsWrapper,
  headerStyling,
  IncludeSectionWrapper,
  ReportsSectionWrapper,
  searchButtonStyling,
  SelectReportsWrapper,
  selectStyling
} from "features/ReportSelectionFilter/ReportSelectionFilter.styles"
import { NextPage } from "next"
import { Button } from "../../components/Buttons/Button"

export const ReportSelectionFilter: NextPage = () => {
  const triggers = "triggers"
  const exceptions = "exceptions"

  return (
    <HeaderWrapper style={headerStyling}>
      <fieldset className="govuk-fieldset">
        <FieldsWrapper>
          <ReportsSectionWrapper id={"report-section"}>
            <h1 className={"govuk-heading-m"}>{"Reports"}</h1>
            <label className="govuk-body" htmlFor={"report-select"}>
              {"Sort by"}
            </label>
            <SelectReportsWrapper>
              <Select
                id={"report-select"}
                placeholder={"Resolved cases"}
                name={"select-case-type"}
                style={selectStyling}
              ></Select>
            </SelectReportsWrapper>
          </ReportsSectionWrapper>
          <DateRangeSectionWrapper id={"date-range-section"}>
            <h1 className={"govuk-heading-m"}>{"Date range"}</h1>
            <CalendarsWrapper>
              <DateFromWrapper id={"report-selection-date-from"}>
                <DateInput
                  dateType="resolvedFrom"
                  dispatch={function (): void {
                    throw new Error("Function not implemented.")
                  }}
                  value={""}
                  dateRange={undefined}
                />
              </DateFromWrapper>
              <DateToWrapper id={"report-selection-date-to"}>
                <DateInput
                  dateType="resolvedTo"
                  dispatch={function (): void {
                    throw new Error("Function not implemented.")
                  }}
                  value={""}
                  dateRange={undefined}
                />
              </DateToWrapper>
            </CalendarsWrapper>
          </DateRangeSectionWrapper>
          <IncludeSectionWrapper id={"include-section"}>
            <h1 className={"govuk-heading-m"}>{"Include"}</h1>
            <label className="govuk-body" htmlFor={"checkboxes-container"}>
              {"Select an option"}
            </label>
            <CheckboxesWrapper id={"checkboxes-container"}>
              <CheckboxUnit className="govuk-checkboxes__item">
                <input className="govuk-checkboxes__input" id={triggers} type="checkbox"></input>
                <CheckboxLabel className="govuk-checkboxes__label" htmlFor={triggers}>
                  {"Triggers"}
                </CheckboxLabel>
              </CheckboxUnit>
              <CheckboxUnit className="govuk-checkboxes__item">
                <input className="govuk-checkboxes__input" id={exceptions} type="checkbox"></input>
                <CheckboxLabel className="govuk-checkboxes__label">{"Exceptions"}</CheckboxLabel>
              </CheckboxUnit>
            </CheckboxesWrapper>
          </IncludeSectionWrapper>
        </FieldsWrapper>
      </fieldset>
      <BottomActionsBox>
        <Button id={"search"} style={searchButtonStyling}>
          {"Search Reports"}
        </Button>
        <ClearSearchLinkBox>
          <a className="govuk-link govuk-link--no-visited-state" href="/bichard?keywords=">
            {"Clear search"}
          </a>
        </ClearSearchLinkBox>
      </BottomActionsBox>
    </HeaderWrapper>
  )
}
