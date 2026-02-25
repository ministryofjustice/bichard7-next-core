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
const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`
const SecondarySectionTitle = styled.div`
  font-size: 19px;
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
`
const CheckboxUnit = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  flex: 1 1 150px;
  max-width: 150px;
`
const CheckboxLabel = styled.label`
  margin: 0;
  line-height: 1;
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

const headerPadding: CSSProperties = {
  paddingTop: "20px",
  paddingBottom: "20px"
}

const searchButton: CSSProperties = {
  margin: 0,
  flexShrink: 0,
  width: "max-content",
  padding: "10px 20px"
}

export {
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
  headerPadding,
  IncludeSectionWrapper,
  ReportsSectionWrapper,
  searchButton,
  SecondarySectionTitle,
  SectionTitle,
  SelectReportsLabelWrapper,
  SelectReportsWrapper
}
