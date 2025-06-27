import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

const SummaryBoxDetail = styled.div`
  &.detail__court-name {
    grid-column: 1 / span 3;
  }

  @media (max-width: ${breakpoints.compact}) {
    font-size: 1rem;
  }

  @media (min-width: 1680px) {
    display: block;
    padding-right: 35px;
    &:last-child {
      padding-right: 0;
    }
  }
`

const SummaryBoxLabel = styled.div`
  display: inline-block;
  margin-right: 10px;

  @media (min-width: 1280px) and (max-width: 1679px) {
    width: "180px";
  }

  @media (min-width: 1680px) {
    display: flex;
    min-width: inherit;
  }
`

const SummaryBoxValue = styled.div`
  display: inline-block;
  margin-right: 15px;

  @media (min-width: 1680px) {
    display: flex;
    margin-right: 0;
    margin-left: 0;
  }
`

export { SummaryBoxDetail, SummaryBoxLabel, SummaryBoxValue }
