import styled from "styled-components"
import { gdsLightGrey } from "utils/colours"

const SummaryBox = styled.aside`
  background-color: ${gdsLightGrey};
  padding: 1.5rem 0.75rem;
  position: sticky;
  top: 0;
  z-index: 9;
`

const SummaryBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-auto-flow: row dense;
  gap: 12px;

  @media (min-width: 1680px) {
    display: flex;
    font-size: 19px;
  }
`
const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 1rem;
  justify-content: auto;
  margin-bottom: 1rem; // TODO: Refine this to match design

  h2 {
    margin: 0;
  }

  .govuk-body {
    margin-bottom: 0;
  }
`

export { FlexContainer, SummaryBox, SummaryBoxGrid }
