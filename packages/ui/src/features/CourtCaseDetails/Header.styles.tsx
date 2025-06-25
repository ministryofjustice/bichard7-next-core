import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import styled from "styled-components"
import { gdsLightGrey, lightGrey } from "utils/colours"

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
  justify-content: space-between;
  align-items: center;
  gap: 1.88rem;
  width: 100%;

  @media (max-width: 768px) {
    h2.govuk-heading-m {
      font-size: 1.1875rem;
      line-height: 1.31579;
    }
  }

  @media (max-width: 1300px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;

    #locked-tag-container {
      margin-left: 0;
    }

    #return-to-case-list {
      margin-bottom: 0.63rem;
    }
  }
`

const CaseDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: 1300px) {
    width: 100%;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
  padding-top: 0.31rem;
  gap: 0.75rem;

  @media (max-width: 768px) {
    .govuk-button {
      font-size: 1rem;
    }
  }
`

const LockedTagContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-left: auto;

  @media (max-width: 1019px) {
    gap: 1rem;
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
