import { StyledButtonsGroup } from "./ButtonsGroup.styles"

interface Props {
  children: React.ReactNode
}

const ButtonsGroup = ({ children }: Props) => <StyledButtonsGroup>{children}</StyledButtonsGroup>

export default ButtonsGroup
