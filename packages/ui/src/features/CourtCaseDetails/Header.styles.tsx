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
  padding: 10px 10px 10px 10px;
`
const CaseDetailHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  width: 100%;

  #case-detail-header-row > div:nth-last-child(-n + 2) {
    margin-left: 300px;
    gap: 10px;
  }

  @media (max-width: 1300px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0px;
  padding-top: 5px;
  gap: 12px;
`

const LockedTagContainer = styled.div`
  display: flex;
  gap: 2.5rem;
`

const StyledButton = styled(Button)`
  margin-bottom: 0;
`

const StyledSecondaryButton = styled(SecondaryButton)`
  margin-bottom: 0;
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
