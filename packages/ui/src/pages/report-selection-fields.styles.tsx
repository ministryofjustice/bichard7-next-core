import styled from "styled-components"

const PageGeneral = styled.div`
  //background: red;
  display: flex;
  align-items: flex-start;
  width: 100%;
`
const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`
const SecondarySectionTitle = styled.div`
  font-size: 19px;
`
const ReportsBox = styled.div`
  //background: orange;
  flex-grow: 1;
  //flex-direction: column;
  //justify-content: flex-start;
  padding-left: 20px;
`
const SelectReportsBox = styled.div`
  //background: mediumaquamarine;
  padding-top: 2px;
`
const DateRangeBox = styled.div`
  //background: fuchsia;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
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
`
const DateToBox = styled.div`
  //background: silver;
  float: right;
`
const IncludeBox = styled.div`
  //background: green;
  flex-grow: 1;
  overflow: auto;
  padding-left: 20px;
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

export {
  PageGeneral,
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
  CheckboxUnit
}
