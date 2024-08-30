import styled, { css } from "styled-components"
import { darkGrey } from "utils/colours"

const buttonCss = css`
  margin-top: 8px;
`

const Button = styled.button`
  ${buttonCss}
`

const ButtonAlt = styled.button`
  ${buttonCss}
  background: ${darkGrey};
  color: white;
  &:visited {
    color: white;
  }
  &:after {
    background-image: url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg);
  }
  &:link {
    color: white;
  }
`

export { Button, ButtonAlt }
