import styled from "styled-components"
import { gdsLightGrey } from "utils/colours"

const SummaryBox = styled.div`
  background-color: ${gdsLightGrey};
  padding: 25px;
`

const SummaryBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-auto-flow: row dense;
  row-gap: 12px;

  @media (min-width: 1680px) {
    display: flex;
    font-size: 19px;
  }
`

const StyledSummaryBoxFieldInside = styled.div`
  display: none;
  visibility: hidden;

  @media (min-width: 1680px) {
    display: block;
    visibility: visible;
  }
`

const StyledSummaryBoxFieldOutside = styled.div`
  display: inline-block;
  visibility: visible;
  margin-top: 12px;

  @media (min-width: 1680px) {
    display: none;
    visibility: hidden;
  }
`

export { StyledSummaryBoxFieldInside, StyledSummaryBoxFieldOutside, SummaryBox, SummaryBoxGrid }
