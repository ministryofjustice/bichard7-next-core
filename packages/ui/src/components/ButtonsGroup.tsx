import { StyledButtonsGroup } from "./ButtonsGroup.styles"

interface Props {
  children: React.ReactNode
  noGap?: boolean
}

const ButtonsGroup = ({ children, noGap = false }: Props) => {
  return (
    <div className="govuk-button-group">
      <StyledButtonsGroup noGap={noGap}>{children}</StyledButtonsGroup>
    </div>
  )
}

export default ButtonsGroup
