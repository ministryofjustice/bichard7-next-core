import { Button } from "components/Buttons/Button"
import { SecondaryButton } from "components/Buttons/SecondaryButton"
import styled from "styled-components"

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-self: center;
`

const LockedTagContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-grow: 1;
`

const StyledButton = styled(Button)`
  margin-bottom: 0;
`

const StyledSecondaryButton = styled(SecondaryButton)`
  margin-bottom: 0;
`

export { ButtonContainer, LockedTagContainer, StyledButton, StyledSecondaryButton }
