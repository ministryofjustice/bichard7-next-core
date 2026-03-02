import PreviewButton from "components/PreviewButton"
import styled from "styled-components"

const NotePreviewHeader = styled.p`
  font-size: 14px;
`
const NotePreviewBody = styled.p`
  font-size: 16px;
`

const StyledPreviewButton = styled(PreviewButton)`
  &.govuk-accordion__show-all {
    font-size: 16px;
    padding: 2px 5px 0;
  }
`

export { NotePreviewBody, NotePreviewHeader, StyledPreviewButton }
