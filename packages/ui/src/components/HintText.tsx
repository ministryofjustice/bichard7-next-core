import styled from "styled-components"
import { textSecondary } from "utils/colours"

const HintText = styled.span`
  display: block;
  color: ${textSecondary};
`

const HintTextNoMargin = styled(HintText)`
  margin-bottom: 0;
`

export { HintText, HintTextNoMargin }
