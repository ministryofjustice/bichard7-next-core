import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import { SecondaryButton } from "components/Buttons/SecondaryButton"
import styled from "styled-components"
import { gdsLightGrey, grey } from "utils/colours"

const CaseDetailHeaderContainer = styled.div`
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
  gap: 12px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
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
  StyledButton,
  StyledSecondaryButton,
  ReallocateLinkButton
}
