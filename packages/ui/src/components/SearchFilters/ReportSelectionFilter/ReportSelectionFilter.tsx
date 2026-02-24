import { HeaderWrapper } from "components/Card/Card.styles"
import DateInput from "components/CustomDateInput/DateInput"

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
  IncludeSectionWrapper,
  ReportsSectionWrapper,
  SecondarySectionTitle,
  SectionTitle,
  SelectReportsLabelWrapper,
  SelectReportsWrapper
} from "components/SearchFilters/ReportSelectionFilter/ReportSelectionFilter.styles"
import { Select } from "components/Select"
import { NextPage } from "next"
import { Button } from "../../Buttons/Button"

export const ReportSelectionFilter: NextPage = () => {
  const triggers = "triggers"
  const exceptions = "exceptions"

  return (
    <HeaderWrapper>
      <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <fieldset className="govuk-fieldset">
          <FieldsWrapper>
            <ReportsSectionWrapper id={"report-section"}>
              <SectionTitle>
                <label>{"Reports"}</label>
              </SectionTitle>
              <SecondarySectionTitle>
                <SelectReportsLabelWrapper>
                  <label>{"Sort by"}</label>
                </SelectReportsLabelWrapper>
              </SecondarySectionTitle>
              <SelectReportsWrapper>
                <Select placeholder={"Resolved cases"} name={"select-case-type"} style={{ width: "100%" }}></Select>
              </SelectReportsWrapper>
            </ReportsSectionWrapper>
            <DateRangeSectionWrapper id={"date-range-section"}>
              <SectionTitle>
                <label>{"Date range"}</label>
              </SectionTitle>
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
              <SectionTitle>
                <label>{"Include"}</label>
              </SectionTitle>
              <div>
                <SecondarySectionTitle>
                  <label>{"Select an option"}</label>
                </SecondarySectionTitle>
                <CheckboxesWrapper>
                  <CheckboxUnit className="govuk-checkboxes__item">
                    <input className="govuk-checkboxes__input" id={triggers} type="checkbox"></input>
                    <CheckboxLabel className="govuk-checkboxes__label" htmlFor={triggers}>
                      {"Triggers"}
                    </CheckboxLabel>
                  </CheckboxUnit>
                  <CheckboxUnit className="govuk-checkboxes__item">
                    <input className="govuk-checkboxes__input" id={exceptions} type="checkbox"></input>
                    <CheckboxLabel className="govuk-checkboxes__label" htmlFor={exceptions}>
                      {"Exceptions"}
                    </CheckboxLabel>
                  </CheckboxUnit>
                </CheckboxesWrapper>
              </div>
            </IncludeSectionWrapper>
          </FieldsWrapper>
        </fieldset>
        <BottomActionsBox>
          <Button id={"search"} style={{ margin: 0, flexShrink: 0, width: "max-content", padding: "10px 20px" }}>
            {"Search Reports"}
          </Button>
          <ClearSearchLinkBox>
            <a className="govuk-link govuk-link--no-visited-state" href="/bichard?keywords=">
              {"Clear search"}
            </a>
          </ClearSearchLinkBox>
        </BottomActionsBox>
      </div>
    </HeaderWrapper>
  )
}
