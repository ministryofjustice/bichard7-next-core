import { GridCol, GridRow } from "govuk-react"
import styled from "styled-components"

const SelectAllTriggersGridRow = styled(GridRow)`
  text-align: right;
  padding-bottom: 20px;
  cursor: pointer;
  font-size: 1em;
`

const MarkCompleteGridCol = styled(GridCol)`
  display: flex;
  justify-content: end;
  margin-bottom: 0;
`

const LockStatus = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
`

export { LockStatus, MarkCompleteGridCol, SelectAllTriggersGridRow }
