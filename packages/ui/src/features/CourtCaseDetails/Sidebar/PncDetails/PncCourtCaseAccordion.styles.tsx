import styled from "styled-components"
import { gdsLightGrey, gdsMidGrey } from "utils/colours"

const CourtCase = styled.div`
  font-family: var(--default-font-family);
  font-size: var(--default-font-size);

  &:not(:first-of-type) {
    border-top: solid 1px ${gdsMidGrey};
  }
`
const CourtCaseHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background-color: ${gdsLightGrey};
  border-bottom: solid 1px ${gdsMidGrey};

  &.expanded,
  &:hover {
    background-color: #dfdfe0;

    .chevron {
      color: white;
      background: black;
    }
  }
`
const CourtCaseHeader = styled.div`
  width: 100%;
  margin: 15px 20px;
`

const CCR = styled.h1`
  margin: 0;
  width: 100%;
  padding-bottom: 10px;
`

const CrimeOffenceReference = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  .heading {
    font-weight: bold;
  }

  & > * {
    flex: 1;
  }
`

const ChevronContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: inherit;
  align-items: center;
  margin-right: 15px;
`

const Offence = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px;
  row-gap: 15px;

  hr {
    border-top: solid 1px ${gdsMidGrey};
    border-bottom: 0;
    margin-left: -20px;
    margin-right: -20px;
    margin-top: -15px;
    margin-bottom: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .heading {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;

    & > span {
      margin-bottom: 0;
    }

    .acpo-code {
      font-weight: normal;
    }

    & > * {
      flex: 1;
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    row-gap: 15px;

    & > * {
      flex-basis: 50%;
    }
  }

  .no-disposals-message {
    margin-top: 0;
  }

  .adjudication {
    margin-bottom: 10px;
  }
`

const DisposalHeader = styled.h2`
  background-color: ${gdsLightGrey};
  margin: 0 -20px;
  padding-left: 20px;
  font-size: 24px;
  line-height: 32px;
`

export {
  CCR,
  ChevronContainer,
  CourtCase,
  CourtCaseHeader,
  CourtCaseHeaderContainer,
  CrimeOffenceReference,
  DisposalHeader,
  Offence
}
