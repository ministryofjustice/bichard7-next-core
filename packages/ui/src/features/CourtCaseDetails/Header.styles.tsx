import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import { SecondaryButton } from "components/Buttons/SecondaryButton"
import styled from "styled-components"
import { gdsLightGrey, grey } from "utils/colours"

const CaseDetailHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${gdsLightGrey};
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
  padding-top: 0.31rem;
  gap: 0.75rem;
`

const LockedTagContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-left: auto;
`

const StyledButton = styled(Button)`
  margin-bottom: 0;
`

const StyledSecondaryButton = styled(SecondaryButton)`
  background-color: ${grey};
`
const ReallocateLinkButton = styled(LinkButton)`
  background-color: ${grey};
`
export {
  ButtonContainer,
  CaseDetailHeaderContainer,
  CaseDetailHeaderRow,
  LockedTagContainer,
  ReallocateLinkButton,
  StyledButton,
  StyledSecondaryButton
}
