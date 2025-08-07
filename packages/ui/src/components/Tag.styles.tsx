import { css } from "styled-components"
import { breakpoints } from "types/breakpoints"

export const TagCss = css`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
  }
`

export const TagContainerCss = css`
  display: flex;
  justify-content: end;
  font-size: 1.1875rem;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: ${breakpoints.regular}) {
    font-size: 1rem;
  }
`
