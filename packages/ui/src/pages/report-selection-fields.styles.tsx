import styled from "styled-components"

const FieldsBox = styled.div`
  //background: red;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
  //justify-content: flex-start;
`
const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`
const SecondarySectionTitle = styled.div`
  font-size: 19px;
`
const ReportsBox = styled.div`
  background: orange;
  //@include govuk-responsive-margin(4, "right");
  flex: 1 1 300px;
  min-width: 150px;
  padding-left: 10px;
`
const SelectReportsBox = styled.div`
  //background: mediumaquamarine;
  //flex: 1 1 300px;
  //min-width: 250px;
`
const DateRangeBox = styled.div`
  background: fuchsia;
  flex: 1 1 300px;
  min-width: 150px;
`
const CalendarsBox = styled.div`
  //background: darkcyan;
  display: flex;
  flex-wrap: nowrap;
`
const DateFromBox = styled.div`
  //background: gold;
  float: left;
  margin-right: 25px;
  flex: 1 1 300px;
  min-width: 50px;
`
const DateToBox = styled.div`
  //background: silver;
  float: right;
  flex: 1 1 300px;
  min-width: 50px;
`
const IncludeBox = styled.div`
  background: lightseagreen;
  flex: 1 1 300px;
  min-width: 150px;
`
const CheckboxUnit = styled.div`
  //background: magenta;
  display: flex;
  align-items: center;
  margin: 0;
  //gap: 5px;
  flex-shrink: 0;
`
const CheckboxesBox = styled.div`
  //background: navy;
  display: flex;
`
const CheckboxLabel = styled.label`
  //background: orange;
  margin: 0;
  line-height: 1;
`
const BottomActionsBox = styled.div`
  //background: hotpink;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
`
const SearchReportsButtonBox = styled.div`
  background: goldenrod;
`
const ClearSearchLinkBox = styled.div`
  //background: blueviolet;
  margin-right: 44px;
`

export {
  FieldsBox,
  SectionTitle,
  SecondarySectionTitle,
  ReportsBox,
  SelectReportsBox,
  DateRangeBox,
  CalendarsBox,
  DateFromBox,
  DateToBox,
  IncludeBox,
  CheckboxesBox,
  CheckboxLabel,
  CheckboxUnit,
  BottomActionsBox,
  SearchReportsButtonBox,
  ClearSearchLinkBox
}
