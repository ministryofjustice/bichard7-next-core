import { HeaderWrapper } from "components/Card/Card.styles"
import DateInput from "components/CustomDateInput/DateInput"
import { Button } from "components/FilterChip.styles"
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
import { Props } from "next/script"

export const ReportSelectionFilter: NextPage<Props> = () => {
  const triggers = "triggers"
  const exceptions = "exceptions"

  return (
    <HeaderWrapper style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <fieldset className="govuk-fieldset">
        <FieldsWrapper>
          <ReportsSectionWrapper>
            <SectionTitle>
              <label>{"Reports"}</label>
            </SectionTitle>
            <SecondarySectionTitle>
              <SelectReportsLabelWrapper>
                <label>{"Sort by"}</label>
              </SelectReportsLabelWrapper>
            </SecondarySectionTitle>
            <SelectReportsWrapper>
              <Select placeholder={"Resolved cases"} name={"resolved-cases"} style={{ width: "100%" }}></Select>
            </SelectReportsWrapper>
          </ReportsSectionWrapper>
          <DateRangeSectionWrapper>
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
                  dateRange={undefined} // dispatch={dispatch}
                  // value={caseResolvedDateRange?.from ?? ""}
                  // dateRange={caseResolvedDateRange}
                />
              </DateFromWrapper>
              <DateToWrapper id={"report-selection-date-to"}>
                <DateInput
                  dateType="resolvedTo"
                  dispatch={function (): void {
                    throw new Error("Function not implemented.")
                  }}
                  value={""}
                  dateRange={undefined} // dispatch={dispatch}
                  // value={caseResolvedDateRange?.to ?? ""}
                  // dateRange={caseResolvedDateRange}
                />
              </DateToWrapper>
            </CalendarsWrapper>
          </DateRangeSectionWrapper>
          <IncludeSectionWrapper>
            <SectionTitle>
              <label>{"Include"}</label>
            </SectionTitle>
            <div>
              <SecondarySectionTitle>
                <label>{"Select an option"}</label>
              </SecondarySectionTitle>
              <CheckboxesWrapper>
                <CheckboxUnit className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id={triggers}
                    type="checkbox"
                    value={"1"}
                    //checked={selectedTriggerIds.includes(trigger.triggerId)}
                    //onChange={setTriggerSelection}
                  ></input>
                  <CheckboxLabel className="govuk-checkboxes__label" htmlFor={triggers}>
                    {"Triggers"}
                  </CheckboxLabel>
                </CheckboxUnit>
                <CheckboxUnit className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id={exceptions}
                    type="checkbox"
                    value={"1"}
                    //checked={selectedTriggerIds.includes(trigger.triggerId)}
                    //onChange={setTriggerSelection}
                  ></input>
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
    </HeaderWrapper>
  )
}
