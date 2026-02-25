import { CSSProperties } from "react"
import styled from "styled-components"

const FieldsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  width: 100%;
  align-items: flex-start;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
`

const ReportsSectionWrapper = styled.div`
  flex: 1 1 250px;
  min-width: 150px;
`
const SelectReportsLabelWrapper = styled.div`
  padding-bottom: 1.5px;
`
const SelectReportsWrapper = styled.div`
  flex: 1 1 150px;
`
const DateRangeSectionWrapper = styled.div`
  flex: 1 1 500px;
  min-width: 150px;
`
const CalendarsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`
const DateFromWrapper = styled.div`
  float: left;
  margin-right: 25px;
  flex: 1 1 150px;
  min-width: 150px;
`
const DateToWrapper = styled.div`
  float: right;
  flex: 1 1 150px;
  min-width: 50px;
`
const IncludeSectionWrapper = styled.div`
  flex: 1 1 225px;
  min-width: 150px;
`
const CheckboxesWrapper = styled.div`
  display: flex;

  .govuk-checkboxes__item {
    display: flex;
    align-items: center;
    margin: 0;
    flex: 1 1 150px;
    max-width: 150px;
  }

  .govuk-checkboxes__input {
    width: 40px;
    height: 40px;
  }

  .govuk-checkboxes__label::before {
    top: 0px;
    left: 0px;
  }

  .govuk-checkboxes__label::after {
    top: 11px;
    left: 9px;
  }
`

const BottomActionsBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
`
const ClearSearchLinkBox = styled.div`
  margin-right: 44px;
`

const headerStyling: CSSProperties = {
  paddingTop: "20px",
  paddingBottom: "20px"
}

const selectStyling: CSSProperties = {
  width: "100%"
}

const searchButtonStyling: CSSProperties = {
  margin: 0,
  flexShrink: 0,
  width: "max-content",
  padding: "10px 20px"
}

export {
  BottomActionsBox,
  CalendarsWrapper,
  CheckboxesWrapper,
  ClearSearchLinkBox,
  DateFromWrapper,
  DateRangeSectionWrapper,
  DateToWrapper,
  FieldsWrapper,
  headerStyling,
  IncludeSectionWrapper,
  ReportsSectionWrapper,
  searchButtonStyling,
  SelectReportsLabelWrapper,
  SelectReportsWrapper,
  selectStyling
}
