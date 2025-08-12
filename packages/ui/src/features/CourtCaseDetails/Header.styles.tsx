import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import styled from "styled-components"
import { breakpoints } from "types/breakpoints"
import { gdsLightGrey, gdsYellow, lightGrey } from "utils/colours"

const CaseDetailHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${lightGrey};
  position: sticky;
  top: 0;
  z-index: 9;
  padding: 0.63rem 0.63rem 0.63rem 0.63rem;
`

const CaseDetailHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;

  h2.govuk-heading-m {
    font-size: 1.5rem;
    line-height: 1.31579;
  }

  @media (max-width: ${breakpoints.compact}) {
    display: initial;
  }

  @media (min-width: ${breakpoints.spacious}) {
    flex-wrap: nowrap;
  }

  .govuk-accordion__summary-box {
    display: none;
    cursor: pointer;
    margin-bottom: 10px;

    @media (min-resolution: 144dpi) and (max-width: ${breakpoints.compact}) {
      display: block;

      &:focus-visible,
      &:focus {
        background-color: ${gdsYellow};
        border-color: ${gdsYellow};
      }
    }
  }
`

const CaseDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 auto;

  h2 {
    margin-bottom: 10px;
  }

  @media (max-width: ${breakpoints.compact}) {
    .govuk-button {
      font-size: 1rem;
    }
  }
`

const LockedTagContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  margin-left: auto;
  gap: 2.5rem;
  justify-content: end;

  @media (max-width: ${breakpoints.compact}) {
    justify-content: unset;

    .govuk-button {
      font-size: 1rem;
    }
  }

  @media (min-width: ${breakpoints.spacious}) {
    justify-content: unset;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 1 1 100%;
  gap: 0.75rem;

  a {
    margin-bottom: 15px;
  }

  @media (max-width: ${breakpoints.compact}) {
    .govuk-button {
      font-size: 1rem;
    }
  }

  @media (min-width: ${breakpoints.spacious}) {
    flex: unset;
  }
`

const StyledButton = styled(Button)`
  margin-bottom: 0;
`

const SecondaryLinkButton = styled(LinkButton)`
  background-color: ${gdsLightGrey};

  &:hover {
    color: ${gdsLightGrey};
    background-color: #222222;
  }
`

export {
  ButtonContainer,
  CaseDetailHeaderContainer,
  CaseDetailHeaderRow,
  CaseDetailsHeader,
  LockedTagContainer,
  SecondaryLinkButton,
  StyledButton
}
