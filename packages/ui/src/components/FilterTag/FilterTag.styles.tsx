import styled from "styled-components"
import { darkGrey } from "utils/colours"

const StyledA = styled.a`
  background: ${darkGrey};
  color: white;
  &:visited {
    color: white;
  }
  &::after {
    background-image: url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg);
  }
  &:link {
    color: white;
  }
  &:focus {
    color: #222;
    &::after {
      background-image: url(/bichard/moj_assets/images/icon-tag-remove-cross.svg);
    }
  }
`

export { StyledA }
