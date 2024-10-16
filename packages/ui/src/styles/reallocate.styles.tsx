import { GridRow } from "govuk-react"
import styled from "styled-components"

const NotesTableContainer = styled.div`
  max-height: 368px;
  overflow: auto;
`

const ShowMoreContainer = styled(GridRow)`
  justify-content: flex-end;
  padding-right: 15px;
  margin-top: 15px;
`

export { NotesTableContainer, ShowMoreContainer }
