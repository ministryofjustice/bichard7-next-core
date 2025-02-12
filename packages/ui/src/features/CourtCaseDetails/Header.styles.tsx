import { Button } from "components/Buttons/Button"
import { SecondaryButton } from "components/Buttons/SecondaryButton"
import styled from "styled-components"

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
`

export { ButtonContainer, LockedTagContainer, StyledButton, StyledSecondaryButton }
