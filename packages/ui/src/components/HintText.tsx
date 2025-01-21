import styled from "styled-components"
import { gdsSecondaryTextColour } from "utils/colours"

const HintText = styled.span`
  display: block;
  color: ${gdsSecondaryTextColour};
`

const HintTextNoMargin = styled(HintText)`
  margin-bottom: 0;
`

export { HintText, HintTextNoMargin }
