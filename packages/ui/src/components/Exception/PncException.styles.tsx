import styled from "styled-components"
import { darkGrey, gdsLightGrey } from "utils/colours"

const InsetText = styled.div`
  display: block;
  font-weight: 300;
  font-size: 16px;
  padding: 0.9375rem 1.25rem;
  background: var(--other-light-grey, ${gdsLightGrey});
  box-shadow: 5px 0 0 0 ${darkGrey} inset;
`

const InsetTextHeading = styled.span`
  display: block;
  font-weight: 700;
`

export { InsetText, InsetTextHeading }
