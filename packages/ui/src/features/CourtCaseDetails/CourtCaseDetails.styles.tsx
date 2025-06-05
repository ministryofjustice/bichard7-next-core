import styled, { css } from "styled-components"

const repeatedCss = css`
  @media (max-width: 1024px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    display: block;
  }
`

const PanelsGridRow = styled.div`
  margin-right: 0px;
  margin-left: 0px;

  ${repeatedCss}
`

const PanelsGridCol = styled.div`
  padding-left: 0px;
  padding-right: 0px;

  ${repeatedCss}
`

const SideBar = styled.div`
  min-width: 320px;
  max-width: 100%;
  padding-right: 0px;
  padding-left: 20px;

  ${repeatedCss}
  @media (max-width: 1024px) {
    padding-top: 50px;
    padding-left: 0px;
  }
`

export { PanelsGridCol, PanelsGridRow, SideBar }
