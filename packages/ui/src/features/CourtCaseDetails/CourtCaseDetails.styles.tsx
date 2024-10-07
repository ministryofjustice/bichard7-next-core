import { GridCol, GridRow } from "govuk-react"
import styled, { css } from "styled-components"

const repeatedCss = css`
  @media (max-width: 1024px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    display: block;
  }
`

const PanelsGridRow = styled(GridRow)`
  ${repeatedCss}
`

const PanelsGridCol = styled(GridCol)`
  overflow-x: scroll;

  ${repeatedCss}
`

const SideBar = styled(GridCol)`
  min-width: 320px;
  max-width: 100%;

  ${repeatedCss}
  @media (max-width: 1024px) {
    padding-top: 50px;
  }
`

export { PanelsGridCol, PanelsGridRow, SideBar }
